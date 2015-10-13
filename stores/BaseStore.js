var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('eventemitter3');
exports.Events = {
    Change: "Change"
};
var BaseStore = (function (_super) {
    __extends(BaseStore, _super);
    function BaseStore() {
        _super.call(this);
        this.dispatcher = new AppDispatcher.TableDispatcher();
    }
    BaseStore.prototype.addChangeListener = function (callback) {
        this.on(exports.Events.Change, callback);
    };
    BaseStore.prototype.removeChangeListener = function (callback) {
        this.removeListener(exports.Events.Change, callback);
    };
    BaseStore.prototype.emitChange = function () {
        this.emit(exports.Events.Change);
    };
    return BaseStore;
})(EventEmitter);
exports.BaseStore = BaseStore;
