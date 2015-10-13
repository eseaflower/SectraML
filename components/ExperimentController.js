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
        this.state = ExperimentStore.Instance.getState();
        ExperimentStore.Instance.addChangeListener(function () { return _this.onChange(); });
    }
    ExperimentController.prototype.onChange = function () {
        this.setState(ExperimentStore.Instance.getState());
    };
    ExperimentController.prototype.render = function () {
        return (React.createElement("div", null, React.createElement("div", {"className": "alert"}, this.state.Message), React.createElement(ExperimentComponent.Experiment, {"Columns": this.state.Columns, "Rows": this.state.Rows})));
    };
    return ExperimentController;
})(React.Component);
exports.ExperimentController = ExperimentController;
