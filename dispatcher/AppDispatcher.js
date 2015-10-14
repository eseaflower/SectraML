var flux = require('flux');
exports.Dispatcher = new flux.Dispatcher();
var TableDispatcher = (function () {
    function TableDispatcher() {
        this.isRegistered = false;
        this.dispatchTable = {};
        this.id = null;
    }
    TableDispatcher.prototype.waitFor = function (other) {
        if (other.isRegistered) {
            exports.Dispatcher.waitFor([other.id]);
        }
    };
    TableDispatcher.prototype.register = function (type, callback) {
        this.dispatchTable[type] = callback;
        this.startDispatching();
    };
    TableDispatcher.prototype.unregister = function (type) {
        delete this.dispatchTable[type];
        if (Object.keys(this.dispatchTable).length <= 0) {
            this.endDispatching();
        }
    };
    TableDispatcher.prototype.startDispatching = function () {
        var _this = this;
        if (!this.isRegistered) {
            this.id = exports.Dispatcher.register(function (p) { return _this.dispatch(p); });
            this.isRegistered = true;
        }
    };
    TableDispatcher.prototype.endDispatching = function () {
        if (this.isRegistered) {
            exports.Dispatcher.unregister(this.id);
            this.id = null;
            this.isRegistered = false;
        }
    };
    TableDispatcher.prototype.dispatch = function (action) {
        var typed = this.dispatchTable[action.type];
        if (typed != null) {
            typed(action.data);
        }
    };
    return TableDispatcher;
})();
exports.TableDispatcher = TableDispatcher;
