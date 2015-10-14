var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var ExperimentStore = require("../stores/ExperimentStore");
var UserStore = require("../stores/UserStore");
var ExperimentComponent = require("./Experiment");
var ExperimentController = (function (_super) {
    __extends(ExperimentController, _super);
    function ExperimentController(props, context) {
        var _this = this;
        _super.call(this, props, context);
        this.state = this.buildState();
        ExperimentStore.Instance.addChangeListener(function () { return _this.onChange(); });
    }
    ExperimentController.prototype.buildState = function () {
        return {
            Experiment: ExperimentStore.Instance.getState(),
            User: UserStore.Instance.getState()
        };
    };
    ExperimentController.prototype.onChange = function () {
        this.setState(this.buildState());
    };
    ExperimentController.prototype.render = function () {
        var alertElement = this.state.Experiment.Message != null ? React.createElement("div", {"className": "alert"}, this.state.Experiment.Message) : null;
        return (React.createElement("div", null, alertElement, React.createElement(ExperimentComponent.Experiment, {"Columns": this.state.Experiment.Columns, "Rows": this.state.Experiment.Rows})));
    };
    return ExperimentController;
})(React.Component);
exports.ExperimentController = ExperimentController;
