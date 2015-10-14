var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var ExperimentStore = require("../stores/ExperimentStore");
var ExperimentComponent = require("./Experiment");
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
            mapperProps: {
                availableTypes: experimentData.availableTypes,
                examples: experimentData.examples,
                datatypes: experimentData.datatypes
            }
        };
    };
    ExperimentController.prototype.onChange = function () {
        this.setState(this.buildState());
    };
    ExperimentController.prototype.render = function () {
        var alertElement = this.state.message != null ? React.createElement("div", {"className": "alert"}, this.state.message) : null;
        var showUpload = this.state.mapperProps.datatypes == null;
        return (React.createElement("div", null, alertElement, React.createElement(ExperimentComponent.Experiment, {"showUpload": showUpload, "datatypeProps": this.state.mapperProps})));
    };
    return ExperimentController;
})(React.Component);
exports.ExperimentController = ExperimentController;
