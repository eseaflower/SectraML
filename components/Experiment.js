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
        Actions.Upload.CommitUpload(value);
    };
    Experiment.prototype.handleCreateMapper = function () {
        var _this = this;
        var columnDesc = this.props.Columns.map(function (item) {
            var refId = _this.getSelectRefName(item);
            var component = _this.refs[refId];
            var dataType = component.getDOMNode().value;
            return { Column: item, Datatype: dataType };
        });
        Actions.Experiment.CommitDatatypes(columnDesc);
    };
    Experiment.prototype.getUploadComponents = function () {
        var _this = this;
        return (React.createElement("div", null, React.createElement("label", null, "Data file"), React.createElement("input", {"className": "wide", "ref": "filename", "type": "file"}), React.createElement("input", {"value": "Upload...", "type": "button", "onClick": function () { return _this.handleUpload(); }})));
    };
    Experiment.prototype.getSelectRefName = function (name) {
        return name + "_ref";
    };
    Experiment.prototype.getDataTypeSelect = function (name) {
        return (React.createElement("select", {"ref": this.getSelectRefName(name)}, React.createElement("option", {"value": "Ignore"}, "Ignore"), React.createElement("option", {"value": "BagOfItems"}, "Bag of items"), React.createElement("option", {"value": "Raw"}, "Raw"), React.createElement("option", {"value": "Label"}, "Label")));
    };
    Experiment.prototype.getTableComponents = function () {
        var _this = this;
        var columnHeaderNames = this.props.Columns.map(function (name) { return React.createElement("th", null, name); });
        var columnHeaderTypes = this.props.Columns.map(function (name) { return React.createElement("th", null, _this.getDataTypeSelect(name)); });
        var examples = this.props.Rows.map(function (row) { return React.createElement("tr", null, row.map(function (item) { return React.createElement("td", null, item); })); });
        return (React.createElement("div", {"className": "table-responsive"}, React.createElement("table", {"className": "table table-striped"}, React.createElement("thead", null, React.createElement("tr", null, columnHeaderNames), React.createElement("tr", null, columnHeaderTypes)), React.createElement("tbody", null, examples)), React.createElement("input", {"type": "button", "value": "Create..", "onClick": function () { return _this.handleCreateMapper(); }})));
    };
    Experiment.prototype.render = function () {
        var elements = this.props.Columns == null ? this.getUploadComponents() : this.getTableComponents();
        return (React.createElement("div", {"className": "col-xs-10", "id": "experiment"}, elements));
    };
    return Experiment;
})(React.Component);
exports.Experiment = Experiment;
