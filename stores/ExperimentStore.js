var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Base = require('./BaseStore');
var Actions = require('../actions/actions');
var ExperimentStore = (function (_super) {
    __extends(ExperimentStore, _super);
    function ExperimentStore() {
        var _this = this;
        _super.call(this);
        this.state = { Columns: null, Rows: null, Message: null };
        this.dispatcher.register(Actions.Upload.UPLOAD_COMMITED, function (_) { return _this.commitUpload(_); });
        this.dispatcher.register(Actions.Upload.UPLOAD_COMPLETE, function (_) { return _this.uploadCompleted(_); });
        this.dispatcher.register(Actions.Upload.UPLOAD_FAILED, function (_) { return _this.uploadFailed(_); });
    }
    ExperimentStore.prototype.getState = function () {
        return $.extend({}, this.state);
    };
    ExperimentStore.prototype.commitUpload = function (file) {
        Actions.Upload.PerformUpload(file);
        this.state.Columns = null;
        this.state.Message = "Uploading...";
        this.emitChange();
    };
    ExperimentStore.prototype.uploadCompleted = function (data) {
        this.state.Columns = data.Columns;
        this.state.Rows = data.Rows;
        this.state.Message = null;
        this.emitChange();
    };
    ExperimentStore.prototype.uploadFailed = function (message) {
        this.state.Columns = null;
        this.state.Message = message;
        this.emitChange();
    };
    return ExperimentStore;
})(Base.BaseStore);
exports.ExperimentStore = ExperimentStore;
exports.Instance = new ExperimentStore();
