var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var ExperimentStore = require("../stores/ExperimentStore");
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
    };
    ExperimentController.prototype.componentWillUnmount = function () {
        ExperimentStore.Instance.removeChangeListener(this.changeEventHandler);
    };
    ExperimentController.prototype.buildState = function () {
        var experimentData = ExperimentStore.Instance.getState();
        return {
            message: experimentData.message,
            readyForTraining: experimentData.readyForTraining,
            readyForMapping: experimentData.readyForMapping,
            readyForNetwork: experimentData.readyForNetwork,
            mapperProps: {
                availableTypes: experimentData.availableTypes,
                examples: experimentData.examples,
                datatypes: experimentData.datatypes,
                acceptEdit: experimentData.readyForMapping
            },
            networkProps: {
                hiddenLayers: experimentData.hiddenLayers,
                acceptEdit: experimentData.readyForNetwork
            },
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
    ExperimentController.prototype.render = function () {
        var _this = this;
        var alertElement = this.state.message != null ? React.createElement("div", {"className": "alert"}, this.state.message) : null;
        var uploadElement = this.state.mapperProps.datatypes == null ? React.createElement(ExperimentComponent.FileUploadComponent, null) : null;
        var mapperElement = this.state.mapperProps.datatypes != null ?
            React.createElement(ExperimentComponent.DatatypeMapperTable, React.__spread({}, this.state.mapperProps)) : null;
        var networkElement = this.state.networkProps.hiddenLayers != null ?
            React.createElement(ExperimentComponent.NetworkComponent, React.__spread({}, this.state.networkProps)) : null;
        var trainElement = this.state.readyForTraining ? React.createElement("input", {"type": "button", "onClick": function () { return _this.doTrain(); }, "value": "Train..."}) : null;
        var predictElement = this.state.predictProps.example != null ?
            React.createElement(ExperimentComponent.PredictComponent, React.__spread({}, this.state.predictProps)) : null;
        return (React.createElement("div", {"className": "col-xs-10"}, alertElement, uploadElement, mapperElement, networkElement, trainElement, predictElement));
    };
    return ExperimentController;
})(React.Component);
exports.ExperimentController = ExperimentController;
