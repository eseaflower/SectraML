var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var Actions = require("../actions/actions");
var Experiment = (function (_super) {
    __extends(Experiment, _super);
    function Experiment() {
        _super.apply(this, arguments);
    }
    Experiment.prototype.handleUpload = function () {
        var htmlComponent = this.refs["filename"];
        var value = htmlComponent.getDOMNode().files[0];
        Actions.Upload.ComitUpload(value);
    };
    Experiment.prototype.getUploadComponents = function () {
        var _this = this;
        return (React.createElement("div", null, React.createElement("label", null, "Data file"), React.createElement("input", {"className": "wide", "ref": "filename", "type": "file"}), React.createElement("input", {"value": "Upload...", "type": "button", "onClick": function () { return _this.handleUpload(); }})));
    };
    Experiment.prototype.getColumnComponents = function () {
        var columnHeaderElements = this.props.Columns.map(function (name) { return React.createElement("th", null, name); });
        var examples = this.props.Rows.map(function (row) { return React.createElement("tr", null, row.map(function (item) { return React.createElement("td", null, item); })); });
        return (React.createElement("div", {"className": "table-responsive"}, React.createElement("table", {"className": "table table-striped"}, React.createElement("thead", null, React.createElement("tr", null, columnHeaderElements)), React.createElement("tbody", null, examples))));
    };
    Experiment.prototype.render = function () {
        var elements = this.props.Columns == null ? this.getUploadComponents() : this.getColumnComponents();
        return (React.createElement("div", {"className": "col-xs-10", "id": "experiment"}, elements));
    };
    return Experiment;
})(React.Component);
exports.Experiment = Experiment;
