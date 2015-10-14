var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var Actions = require("../actions/actions");
var FileUploadComponent = (function (_super) {
    __extends(FileUploadComponent, _super);
    function FileUploadComponent() {
        _super.apply(this, arguments);
    }
    FileUploadComponent.prototype.handleUpload = function () {
        var htmlComponent = this.refs["filename"];
        var value = htmlComponent.getDOMNode().files[0];
        Actions.Upload.CommitUpload(value);
    };
    FileUploadComponent.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", null, React.createElement("label", null, "Data file"), React.createElement("input", {"className": "wide", "ref": "filename", "type": "file"}), React.createElement("input", {"value": "Upload...", "type": "button", "onClick": function () { return _this.handleUpload(); }})));
    };
    return FileUploadComponent;
})(React.Component);
var DatatypeMapper = (function (_super) {
    __extends(DatatypeMapper, _super);
    function DatatypeMapper() {
        _super.apply(this, arguments);
    }
    DatatypeMapper.prototype.getColumnHeaders = function () {
        return this.props.datatypes.map(function (dt) { return React.createElement("th", null, dt.column); });
    };
    DatatypeMapper.prototype.getOptions = function () {
        return this.props.availableTypes.map(function (type) { return React.createElement("option", {"value": type}, type); });
    };
    DatatypeMapper.prototype.getSelectRefName = function (column) {
        return column + "_ref";
    };
    DatatypeMapper.prototype.valueChanged = function (column) {
        var refId = this.getSelectRefName(column);
        var component = this.refs[refId];
        var datatype = component.getDOMNode().value;
        Actions.Experiment.DatatypeChanged({ column: column, datatype: datatype });
    };
    DatatypeMapper.prototype.getDatatypeSelect = function (dt) {
        var _this = this;
        return (React.createElement("select", {"onChange": function () { return _this.valueChanged(dt.column); }, "ref": this.getSelectRefName(dt.column), "value": dt.datatype}, this.getOptions()));
    };
    DatatypeMapper.prototype.getColumnDatatypes = function () {
        var _this = this;
        return this.props.datatypes.map(function (dt) { return React.createElement("td", null, _this.getDatatypeSelect(dt)); });
    };
    DatatypeMapper.prototype.getExampleRow = function (row) {
        return React.createElement("tr", null, row.map(function (value) { return React.createElement("td", null, value); }));
    };
    DatatypeMapper.prototype.getExamples = function () {
        var _this = this;
        return this.props.examples.map(function (row) { return _this.getExampleRow(row); });
    };
    DatatypeMapper.prototype.render = function () {
        return (React.createElement("table", {"className": "table table-striped"}, React.createElement("thead", null, React.createElement("tr", null, this.getColumnHeaders()), React.createElement("tr", null, this.getColumnDatatypes())), React.createElement("tbody", null, this.getExamples())));
    };
    return DatatypeMapper;
})(React.Component);
var Experiment = (function (_super) {
    __extends(Experiment, _super);
    function Experiment() {
        _super.apply(this, arguments);
    }
    Experiment.prototype.handleCreateMapper = function () {
        Actions.Experiment.CommitDatatypes();
    };
    Experiment.prototype.getElement = function () {
        var _this = this;
        if (this.props.showUpload) {
            return React.createElement(FileUploadComponent, null);
        }
        return (React.createElement("div", {"className": "table-responsive"}, React.createElement(DatatypeMapper, React.__spread({}, this.props.datatypeProps)), React.createElement("input", {"type": "button", "value": "Create..", "onClick": function () { return _this.handleCreateMapper(); }})));
    };
    Experiment.prototype.render = function () {
        return (React.createElement("div", {"className": "col-xs-10", "id": "experiment"}, this.getElement()));
    };
    return Experiment;
})(React.Component);
exports.Experiment = Experiment;
