var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var ExperimentStore = require("../stores/ExperimentStore");
var NavigationStore = require("../stores/NavigationStore");
var ExperimentComponent = require("./Experiment");
var Actions = require("../actions/actions");
var ExperimentController = (function (_super) {
    __extends(ExperimentController, _super);
    function ExperimentController(props, context) {
        var _this = this;
        _super.call(this, props, context);
        this.state = this.buildState();
        this.changeEventHandler = function () { return _this.onChange(); };
    }
    ExperimentController.prototype.componentDidMount = function () {
        ExperimentStore.Instance.addChangeListener(this.changeEventHandler);
        NavigationStore.Instance.addChangeListener(this.changeEventHandler);
    };
    ExperimentController.prototype.componentWillUnmount = function () {
        ExperimentStore.Instance.removeChangeListener(this.changeEventHandler);
        NavigationStore.Instance.removeChangeListener(this.changeEventHandler);
    };
    ExperimentController.prototype.buildState = function () {
        var experimentData = ExperimentStore.Instance.getState();
        return {
            mode: NavigationStore.Instance.getActiveType(),
            message: experimentData.message,
            readyForTraining: experimentData.readyForTraining,
            readyForMapping: experimentData.readyForMapping,
            readyForNetwork: experimentData.readyForNetwork,
            trainFigureUrl: experimentData.trainFigureUrl,
            mapperProps: {
                availableTypes: experimentData.availableTypes,
                examples: experimentData.examples,
                datatypes: experimentData.datatypes,
                acceptEdit: experimentData.readyForMapping
            },
            networkProps: {
                hiddenLayers: experimentData.hiddenLayers,
                acceptEdit: experimentData.readyForNetwork,
                inputDimension: experimentData.inputDimension,
                outputDimension: experimentData.outputDimension
            },
            trainingProps: experimentData.trainingSettings,
            predictProps: {
                datatypes: experimentData.datatypes,
                example: experimentData.example,
                predicted: experimentData.predicted,
                acceptEdit: true
            }
        };
    };
    ExperimentController.prototype.onChange = function () {
        this.setState(this.buildState());
    };
    ExperimentController.prototype.doTrain = function () {
        Actions.Experiment.CommitTraining();
    };
    ExperimentController.prototype.getCreateElement = function () {
        var _this = this;
        if (this.state.mode != "Create") {
            return null;
        }
        var uploadElement = this.state.mapperProps.datatypes == null ? React.createElement(ExperimentComponent.FileUploadComponent, null) : null;
        var mapperElement = this.state.mapperProps.datatypes != null ?
            React.createElement(ExperimentComponent.DatatypeMapperTable, React.__spread({}, this.state.mapperProps)) : null;
        var networkElement = this.state.networkProps.hiddenLayers != null ?
            React.createElement(ExperimentComponent.NetworkComponent, React.__spread({}, this.state.networkProps)) : null;
        var trainElement = this.state.readyForTraining ? React.createElement(ExperimentComponent.TrainingSettingsComponent, React.__spread({}, this.state.trainingProps)) : null;
        var trainButtonElement = this.state.readyForTraining ? React.createElement("input", {"className": "btn btn-primary", "type": "button", "onClick": function () { return _this.doTrain(); }, "value": "Train..."}) : null;
        var figureElement = this.state.trainFigureUrl != null ?
            React.createElement("img", {"src": this.state.trainFigureUrl}) : null;
        return (React.createElement("div", null, uploadElement, mapperElement, networkElement, trainElement, trainButtonElement, this.getAlertElement(), figureElement));
    };
    ExperimentController.prototype.getPredictElement = function () {
        if (this.state.mode != "Predict") {
            return null;
        }
        var predictElement = this.state.predictProps.example != null ?
            React.createElement(ExperimentComponent.PredictComponent, React.__spread({}, this.state.predictProps)) : null;
        return (React.createElement("div", null, predictElement));
    };
    ExperimentController.prototype.getAlertElement = function () {
        return this.state.message != null ? React.createElement("div", {"className": "alert alert-info"}, this.state.message) : null;
    };
    ExperimentController.prototype.render = function () {
        return (React.createElement("div", {"className": "col-xs-10"}, this.getCreateElement(), this.getPredictElement()));
    };
    return ExperimentController;
})(React.Component);
exports.ExperimentController = ExperimentController;
