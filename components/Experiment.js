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
        return (React.createElement("div", null, React.createElement("input", {"onChange": function () { return _this.handleUpload(); }, "ref": "filename", "type": "file"})));
    };
    return FileUploadComponent;
})(React.Component);
exports.FileUploadComponent = FileUploadComponent;
var ExampleTableComponent = (function (_super) {
    __extends(ExampleTableComponent, _super);
    function ExampleTableComponent() {
        _super.apply(this, arguments);
    }
    ExampleTableComponent.prototype.getColumnHeaders = function () {
        return this.props.headers.map(function (header) { return React.createElement("th", null, header); });
    };
    ExampleTableComponent.prototype.getExampleRow = function (row) {
        return React.createElement("tr", null, row.map(function (value) { return React.createElement("td", null, value); }));
    };
    ExampleTableComponent.prototype.getExamples = function () {
        var _this = this;
        return this.props.examples.map(function (row) { return _this.getExampleRow(row); });
    };
    ExampleTableComponent.prototype.render = function () {
        return (React.createElement("table", {"className": "table table-striped"}, React.createElement("thead", null, React.createElement("tr", null, this.getColumnHeaders())), React.createElement("tbody", null, this.getExamples())));
    };
    return ExampleTableComponent;
})(React.Component);
var DatatypeComponent = (function (_super) {
    __extends(DatatypeComponent, _super);
    function DatatypeComponent() {
        _super.apply(this, arguments);
    }
    DatatypeComponent.prototype.getOptions = function () {
        return this.props.availableTypes.map(function (type) { return React.createElement("option", {"value": type}, type); });
    };
    DatatypeComponent.prototype.valueChanged = function () {
        if (this.props.acceptEdit) {
            var component = this.refs["selectedValue"];
            var datatype = component.getDOMNode().value;
            Actions.Experiment.DatatypeChanged({ column: this.props.type.column, datatype: datatype, custom: this.getCustomValues() });
        }
    };
    DatatypeComponent.prototype.getDatatypeSelect = function () {
        var _this = this;
        return (React.createElement("select", {"className": "form-control", "disabled": !this.props.acceptEdit, "onChange": function () { return _this.valueChanged(); }, "ref": "selectedValue", "value": this.props.type.datatype}, this.getOptions()));
    };
    DatatypeComponent.prototype.getElementValue = function (id) {
        var comp = this.refs[id];
        var value = null;
        if (comp != null) {
            value = comp.getDOMNode().value;
        }
        return value;
    };
    DatatypeComponent.prototype.getCustomValues = function () {
        var custom = {};
        var value = this.getElementValue("minCount");
        if (value != null) {
            custom["minCount"] = value;
        }
        value = this.getElementValue("size");
        if (value != null) {
            custom["size"] = value;
        }
        value = this.getElementValue("dim");
        if (value != null) {
            custom["dim"] = value;
        }
        value = this.getElementValue("filter");
        if (value != null) {
            custom["filter"] = value;
        }
        return custom;
    };
    DatatypeComponent.prototype.getBagOfItemsElements = function () {
        var _this = this;
        var minCountValue = this.props.type.custom["minCount"];
        var sizeValue = this.props.type.custom["size"];
        if (minCountValue === undefined) {
            minCountValue = "";
        }
        if (sizeValue === undefined) {
            sizeValue = "";
        }
        return (React.createElement("div", null, React.createElement("label", {"className": "control-label col-xs-2"}, "Count:"), React.createElement("div", {"className": "col-xs-3"}, React.createElement("input", {"className": "form-control input-sm", "disabled": !this.props.acceptEdit, "onChange": function () { return _this.valueChanged(); }, "ref": "minCount", "type": "text", "value": minCountValue})), React.createElement("label", {"className": "control-label col-xs-2"}, "Size:"), React.createElement("div", {"className": "col-xs-3"}, React.createElement("input", {"className": "form-control input-sm", "disabled": !this.props.acceptEdit, "onChange": function () { return _this.valueChanged(); }, "ref": "size", "type": "text", "value": sizeValue}))));
    };
    DatatypeComponent.prototype.getNumberElements = function () {
        var _this = this;
        var dimValue = this.props.type.custom["dim"];
        if (dimValue === undefined) {
            dimValue = "";
        }
        return (React.createElement("div", null, React.createElement("label", {"className": "control-label col-xs-2"}, "Dim:"), React.createElement("div", {"className": "col-xs-3"}, React.createElement("input", {"className": "form-control input-sm", "disabled": !this.props.acceptEdit, "onChange": function () { return _this.valueChanged(); }, "ref": "dim", "type": "text", "value": dimValue}))));
    };
    DatatypeComponent.prototype.getLabelElements = function () {
        var _this = this;
        var filterValue = this.props.type.custom["filter"];
        if (filterValue === undefined) {
            filterValue = "";
        }
        return (React.createElement("div", null, React.createElement("label", {"className": "control-label col-xs-2"}, "Filter:"), React.createElement("div", {"className": "col-xs-3"}, React.createElement("input", {"className": "form-control input-sm", "disabled": !this.props.acceptEdit, "onChange": function () { return _this.valueChanged(); }, "ref": "filter", "type": "text", "value": filterValue}))));
    };
    DatatypeComponent.prototype.getTypeSpecificElements = function () {
        switch (this.props.type.datatype) {
            case "BagOfItems":
                return this.getBagOfItemsElements();
                break;
            case "BagOfShingles":
                return this.getBagOfItemsElements();
                break;
            case "Number":
                return this.getNumberElements();
                break;
            case "Label":
                return this.getLabelElements();
                break;
            default:
                break;
        }
        return null;
    };
    DatatypeComponent.prototype.render = function () {
        return (React.createElement("div", {"className": "row form-group"}, React.createElement("div", {"className": "col-xs-2"}, React.createElement("strong", null, this.props.type.column)), React.createElement("div", {"className": "col-xs-3"}, this.getDatatypeSelect()), React.createElement("div", {"className": "col-xs-7"}, React.createElement("div", {"className": "row"}, this.getTypeSpecificElements()))));
    };
    return DatatypeComponent;
})(React.Component);
var DatatypeMapperTable = (function (_super) {
    __extends(DatatypeMapperTable, _super);
    function DatatypeMapperTable() {
        _super.apply(this, arguments);
    }
    DatatypeMapperTable.prototype.handleCreateMapper = function () {
        if (this.props.acceptEdit) {
            Actions.Experiment.CommitDatatypes();
        }
    };
    DatatypeMapperTable.prototype.getDatatypes = function () {
        var result = [];
        for (var i = 0; i < this.props.datatypes.length; i++) {
            var dt = this.props.datatypes[i];
            if (this.props.acceptEdit || dt.datatype != "Ignore") {
                result.push(React.createElement(DatatypeComponent, {"type": dt, "availableTypes": this.props.availableTypes, "acceptEdit": this.props.acceptEdit}));
            }
        }
        return result;
    };
    DatatypeMapperTable.prototype.render = function () {
        var _this = this;
        var headers = this.props.datatypes.map(function (dt) { return dt.column; });
        var createButton = this.props.acceptEdit ?
            React.createElement("input", {"className": "btn btn-primary", "type": "button", "value": "Create..", "onClick": function () { return _this.handleCreateMapper(); }}) : null;
        return (React.createElement("div", null, React.createElement(ExampleTableComponent, {"headers": headers, "examples": this.props.examples}), React.createElement("h4", null, "Datatype mapping"), this.getDatatypes(), createButton));
    };
    return DatatypeMapperTable;
})(React.Component);
exports.DatatypeMapperTable = DatatypeMapperTable;
var LayerComponent = (function (_super) {
    __extends(LayerComponent, _super);
    function LayerComponent() {
        _super.apply(this, arguments);
    }
    LayerComponent.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", {"className": "row"}, React.createElement("div", {"className": "col-xs-1"}, React.createElement("label", null, "Nodes:")), React.createElement("div", {"className": "col-xs-1"}, React.createElement("input", {"onChange": function () { return _this.props.onChange(); }, "type": "text"}))));
    };
    return LayerComponent;
})(React.Component);
var NetworkComponent = (function (_super) {
    __extends(NetworkComponent, _super);
    function NetworkComponent() {
        _super.apply(this, arguments);
    }
    NetworkComponent.prototype.handleChange = function (index) {
        if (this.props.acceptEdit) {
            var refId = "l_" + index.toString();
            var c = this.refs[refId];
            var value = c.getDOMNode().value;
            var numValue = Number(value);
            if (!isNaN(numValue)) {
                var copy = this.props.hiddenLayers.slice();
                copy[index] = numValue;
                Actions.Experiment.LayersChanged(copy);
            }
        }
    };
    NetworkComponent.prototype.getLayerElement = function (index) {
        var _this = this;
        var refId = "l_" + index.toString();
        var value = this.props.hiddenLayers[index].toString();
        return (React.createElement("div", {"className": "row"}, React.createElement("div", {"className": "col-xs-1"}, React.createElement("label", null, "Nodes:")), React.createElement("div", {"className": "col-xs-2"}, React.createElement("input", {"className": "form-control", "disabled": !this.props.acceptEdit, "ref": refId, "onChange": function () { return _this.handleChange(index); }, "type": "text", "value": value}))));
    };
    NetworkComponent.prototype.getLayerElements = function () {
        var _this = this;
        var elements = [];
        if (this.props.hiddenLayers != null) {
            for (var i = 0; i < this.props.hiddenLayers.length; i++) {
                elements.push(this.getLayerElement(i));
            }
        }
        if (this.props.acceptEdit) {
            var addElement = (React.createElement("div", {"className": "row"}, React.createElement("div", {"className": "col-xs-offset-1 col-xs-1"}, React.createElement("input", {"className": "btn btn-success", "onClick": function () { return _this.addLayer(); }, "type": "button", "value": "Add..."}))));
            elements.push(addElement);
        }
        return elements;
    };
    NetworkComponent.prototype.addLayer = function () {
        var copy = this.props.hiddenLayers.slice();
        copy.push(0);
        Actions.Experiment.LayersChanged(copy);
    };
    NetworkComponent.prototype.getInputLayer = function () {
        return (React.createElement("div", {"className": "row"}, React.createElement("div", {"className": "col-xs-1"}, React.createElement("label", null, "Input:")), React.createElement("div", {"className": "col-xs-1"}, React.createElement("label", null, this.props.inputDimension))));
    };
    NetworkComponent.prototype.getOutputLayer = function () {
        return (React.createElement("div", {"className": "row"}, React.createElement("div", {"className": "col-xs-1"}, React.createElement("label", null, "Output:")), React.createElement("div", {"className": "col-xs-1"}, React.createElement("label", null, this.props.outputDimension))));
    };
    NetworkComponent.prototype.render = function () {
        return (React.createElement("div", null, React.createElement("h4", null, "Network"), this.getInputLayer(), this.getLayerElements(), this.getOutputLayer()));
    };
    return NetworkComponent;
})(React.Component);
exports.NetworkComponent = NetworkComponent;
var TrainingSettingsComponent = (function (_super) {
    __extends(TrainingSettingsComponent, _super);
    function TrainingSettingsComponent() {
        _super.apply(this, arguments);
    }
    TrainingSettingsComponent.prototype.handleChange = function () {
        var newSettings = this.getValues();
        Actions.Experiment.TrainingSettingsChanged(newSettings);
    };
    TrainingSettingsComponent.prototype.getElementValue = function (id) {
        var comp = this.refs[id];
        var result = null;
        if (comp != null) {
            result = comp.getDOMNode().value;
        }
        return result;
    };
    TrainingSettingsComponent.prototype.getValues = function () {
        return {
            learningRate: this.getElementValue("lr"),
            regularization: this.getElementValue("reg"),
            epochsPerRun: this.getElementValue("eprun"),
            runs: this.getElementValue("run")
        };
    };
    TrainingSettingsComponent.prototype.safeToString = function (val) {
        if (val == null) {
            return "";
        }
        return val.toString();
    };
    TrainingSettingsComponent.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", null, React.createElement("div", {"className": "row"}, React.createElement("label", {"className": "col-xs-2"}, "Learning rate:"), React.createElement("div", {"className": "col-xs-2"}, React.createElement("input", {"onChange": function () { return _this.handleChange(); }, "ref": "lr", "className": "form-control", "value": this.props.learningRate}))), React.createElement("div", {"className": "row"}, React.createElement("label", {"className": "col-xs-2"}, "Regularization:"), React.createElement("div", {"className": "col-xs-2"}, React.createElement("input", {"onChange": function () { return _this.handleChange(); }, "ref": "reg", "className": "form-control", "value": this.props.regularization}))), React.createElement("div", {"className": "row"}, React.createElement("label", {"className": "col-xs-2"}, "Epochs/run:"), React.createElement("div", {"className": "col-xs-2"}, React.createElement("input", {"onChange": function () { return _this.handleChange(); }, "ref": "eprun", "className": "form-control", "value": this.props.epochsPerRun}))), React.createElement("div", {"className": "row"}, React.createElement("label", {"className": "col-xs-2"}, "Runs:"), React.createElement("div", {"className": "col-xs-2"}, React.createElement("input", {"onChange": function () { return _this.handleChange(); }, "ref": "run", "className": "form-control", "value": this.props.runs})))));
    };
    return TrainingSettingsComponent;
})(React.Component);
exports.TrainingSettingsComponent = TrainingSettingsComponent;
var PredictComponent = (function (_super) {
    __extends(PredictComponent, _super);
    function PredictComponent() {
        _super.apply(this, arguments);
    }
    PredictComponent.prototype.getColumnHeaders = function () {
        var headers = this.getValidColumns().map(function (dt) { return React.createElement("th", null, dt.column); });
        headers.push(React.createElement("th", null, "Predicted"));
        return headers;
    };
    PredictComponent.prototype.exampleChanged = function (refId) {
        var c = this.refs[refId];
        var value = c.getDOMNode().value;
        Actions.Experiment.ExampleChanged({ column: refId, value: value });
    };
    PredictComponent.prototype.getExample = function () {
        var _this = this;
        var cells = this.getValidColumns().map(function (dt) { return React.createElement("td", null, React.createElement("input", {"value": _this.props.example[dt.column], "onChange": function () { return _this.exampleChanged(dt.column); }, "ref": dt.column, "type": "text"})); });
        cells.push(React.createElement("td", null, this.props.predicted));
        return cells;
    };
    PredictComponent.prototype.getValidColumns = function () {
        var validColumns = [];
        this.props.datatypes.map(function (dt) {
            if (dt.datatype != "Ignore" && dt.datatype != "Label") {
                validColumns.push(dt);
            }
        });
        return validColumns;
    };
    PredictComponent.prototype.commitPredict = function () {
        Actions.Experiment.CommitPredict();
    };
    PredictComponent.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", null, React.createElement("table", {"className": "table table-striped"}, React.createElement("thead", null, React.createElement("tr", null, this.getColumnHeaders())), React.createElement("tbody", null, this.getExample())), React.createElement("div", {"className": "row"}, React.createElement("div", {"className": "col-xs-2"}, React.createElement("input", {"className": "btn btn-primary", "type": "button", "onClick": function () { return _this.commitPredict(); }, "value": "Predict..."})))));
    };
    return PredictComponent;
})(React.Component);
exports.PredictComponent = PredictComponent;
