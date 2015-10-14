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
        this.state = { examples: null, message: null, datatypes: null, availableTypes: null };
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
        this.state.datatypes = data.columns.map(function (column) { return { column: column, datatype: data.availableTypes[0] }; });
        this.state.availableTypes = data.availableTypes;
        this.experimentUrl = "/experiment/" + data.id.toString();
        this.state.message = null;
        this.emitChange();
    };
    ExperimentStore.prototype.uploadFailed = function (message) {
        this.state.message = message;
        this.emitChange();
    };
    ExperimentStore.prototype.commitUploadDataTypes = function () {
        if (this.experimentUrl != null) {
            Actions.Experiment.UploadDatatypes(this.experimentUrl, this.state.datatypes);
        }
    };
    ExperimentStore.prototype.uploadDataTypesCompleted = function (data) {
        this.state.datatypes = data;
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
        this.emitChange();
    };
    return ExperimentStore;
})(Base.BaseStore);
exports.ExperimentStore = ExperimentStore;
exports.Instance = new ExperimentStore();
