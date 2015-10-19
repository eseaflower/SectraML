var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Base = require('./BaseStore');
var Actions = require('../actions/actions');
var User = require("./UserStore");
var ExperimentStore = (function (_super) {
    __extends(ExperimentStore, _super);
    function ExperimentStore() {
        var _this = this;
        _super.call(this);
        this.state = {
            examples: null,
            message: null,
            datatypes: null,
            inputDimension: null,
            outputDimension: null,
            availableTypes: null,
            hiddenLayers: null,
            example: null,
            trainingSettings: {
                learningRate: "0.001",
                regularization: "0.0001",
                epochsPerRun: "1",
                runs: "10"
            },
            predicted: null,
            readyForTraining: false,
            readyForMapping: false,
            readyForNetwork: false
        };
        this.experimentUrl = null;
        this.fileUploadUrl = null;
        this.dispatcher.register(Actions.Upload.UPLOAD_COMMITED, function (_) { return _this.commitUpload(_); });
        this.dispatcher.register(Actions.Upload.UPLOAD_COMPLETE, function (_) { return _this.uploadCompleted(_); });
        this.dispatcher.register(Actions.Upload.UPLOAD_FAILED, function (_) { return _this.uploadFailed(_); });
        this.dispatcher.register(Actions.Experiment.DATATYPES_COMMITED, function () { return _this.commitUploadDataTypes(); });
        this.dispatcher.register(Actions.Experiment.UPLOAD_DATATYPES_COMPLETE, function (_) { return _this.uploadDataTypesCompleted(_); });
        this.dispatcher.register(Actions.Experiment.UPLOAD_DATATYPES_FAILED, function (_) { return _this.uploadDataTypesFailed(_); });
        this.dispatcher.register(Actions.User.USER_ID_SET, function (_) { return _this.userChanged(_); });
        this.dispatcher.register(Actions.Experiment.DATATYPES_CHANGED, function (_) { return _this.datatypesChanged(_); });
        this.dispatcher.register(Actions.Experiment.LAYERS_CHANGED, function (_) { return _this.layersChanged(_); });
        this.dispatcher.register(Actions.Experiment.COMMIT_TRAINING, function () { return _this.trainingCommited(); });
        this.dispatcher.register(Actions.Experiment.TRAINING_COMPLETE, function () { return _this.trainingComplete(); });
        this.dispatcher.register(Actions.Experiment.TRAINING_FAILED, function (_) { return _this.trainingFailed(_); });
        this.dispatcher.register(Actions.Experiment.EXAMPLE_CHANGED, function (_) { return _this.exampleChanged(_); });
        this.dispatcher.register(Actions.Experiment.COMMIT_PREDICT, function () { return _this.predictCommited(); });
        this.dispatcher.register(Actions.Experiment.PREDICT_COMPLETE, function (_) { return _this.predictCompleted(_); });
        this.dispatcher.register(Actions.Experiment.TRAINING_SETTINGS_CHANGED, function (_) { return _this.trainingSettingsChanged(_); });
    }
    ExperimentStore.prototype.getState = function () {
        return $.extend({}, this.state);
    };
    ExperimentStore.prototype.commitUpload = function (file) {
        if (this.fileUploadUrl != null) {
            Actions.Upload.PerformUpload(this.fileUploadUrl, file);
            this.state.message = "Uploading...";
            this.emitChange();
        }
    };
    ExperimentStore.prototype.uploadCompleted = function (data) {
        this.state.examples = data.rows;
        var custom = {};
        this.state.datatypes = data.columns.map(function (column) {
            return { column: column, datatype: data.availableTypes[0], custom: custom };
        });
        this.state.availableTypes = data.availableTypes;
        this.experimentUrl = "/experiment/" + data.id.toString();
        this.state.message = null;
        this.state.readyForMapping = true;
        this.state.readyForNetwork = false;
        this.state.readyForTraining = false;
        this.emitChange();
    };
    ExperimentStore.prototype.uploadFailed = function (message) {
        this.state.message = message;
        this.emitChange();
    };
    ExperimentStore.prototype.commitUploadDataTypes = function () {
        if (this.experimentUrl != null) {
            this.state.readyForMapping = false;
            Actions.Experiment.UploadDatatypes(this.experimentUrl, this.state.datatypes);
            this.state.message = "Creating data mapping...";
            this.emitChange();
        }
    };
    ExperimentStore.prototype.uploadDataTypesCompleted = function (data) {
        this.state.message = null;
        this.state.datatypes = data.mapping;
        this.state.inputDimension = data.inputDimension;
        this.state.outputDimension = data.outputDimension;
        this.state.readyForMapping = false;
        this.state.readyForNetwork = true;
        this.state.readyForTraining = true;
        if (this.state.hiddenLayers == null) {
            this.state.hiddenLayers = [];
        }
        this.emitChange();
    };
    ExperimentStore.prototype.uploadDataTypesFailed = function (message) {
        this.state.message = message;
        this.emitChange();
    };
    ExperimentStore.prototype.userChanged = function (userId) {
        this.waitFor(User.Instance);
        var userId = User.Instance.getState().UserId;
        this.fileUploadUrl = null;
        if (userId != null) {
            this.fileUploadUrl = userId + "/upload";
            this.emitChange();
        }
    };
    ExperimentStore.prototype.datatypesChanged = function (data) {
        this.state.datatypes = this.state.datatypes.map(function (dt) { return (dt.column == data.column) ? data : dt; });
        this.state.readyForTraining = false;
        this.emitChange();
    };
    ExperimentStore.prototype.layersChanged = function (data) {
        this.state.hiddenLayers = data;
        this.emitChange();
    };
    ExperimentStore.prototype.updateTrainingReady = function () {
        var ready = false;
        if (this.state.hiddenLayers != null) {
            var nodeCount = 0;
            this.state.hiddenLayers.map(function (i) { return nodeCount += i; });
            ready = nodeCount > 0;
        }
        if (ready != this.state.readyForTraining) {
            this.state.readyForTraining = ready;
            return true;
        }
        return false;
    };
    ExperimentStore.prototype.trainingCommited = function () {
        if (this.experimentUrl != null) {
            this.state.readyForMapping = false;
            this.state.readyForNetwork = false;
            this.state.readyForTraining = false;
            this.state.example = null;
            this.state.message = "Training model...";
            var layers = this.state.hiddenLayers != null ? this.state.hiddenLayers : [];
            Actions.Experiment.DoTraining(this.experimentUrl, {
                hiddenLayers: layers,
                settings: this.state.trainingSettings
            });
            this.emitChange();
        }
    };
    ExperimentStore.prototype.trainingComplete = function () {
        this.state.example = {};
        this.state.message = "Prediction model available at " + this.experimentUrl + "?args={\"type\":\"predict\",\"data\":[<list of your data>]}";
        this.emitChange();
    };
    ExperimentStore.prototype.trainingFailed = function (message) {
        this.state.message = message;
        this.emitChange();
    };
    ExperimentStore.prototype.exampleChanged = function (val) {
        this.state.example[val.column] = val.value;
        this.state.predicted = null;
        this.emitChange();
    };
    ExperimentStore.prototype.predictCommited = function () {
        var _this = this;
        if (this.experimentUrl != null) {
            var toPredict = {};
            this.state.datatypes.map(function (dt) {
                if (dt.datatype != "Ignore" && dt.datatype != "Label") {
                    var value = _this.state.example[dt.column];
                    if (value == null) {
                        value = "";
                    }
                    toPredict[dt.column] = value;
                }
            });
            Actions.Experiment.DoPredict(this.experimentUrl, [toPredict]);
            this.emitChange();
        }
    };
    ExperimentStore.prototype.predictCompleted = function (value) {
        this.state.predicted = value;
        this.emitChange();
    };
    ExperimentStore.prototype.trainingSettingsChanged = function (data) {
        this.state.trainingSettings = data;
        this.emitChange();
    };
    return ExperimentStore;
})(Base.BaseStore);
exports.ExperimentStore = ExperimentStore;
exports.Instance = new ExperimentStore();
