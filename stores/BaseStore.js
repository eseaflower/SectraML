var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('eventemitter3');
var BaseStore = (function (_super) {
    __extends(BaseStore, _super);
    function BaseStore() {
        _super.call(this);
        this.dispatcher = new AppDispatcher.TableDispatcher();
    }
    return BaseStore;
})(EventEmitter);
exports.BaseStore = BaseStore;
