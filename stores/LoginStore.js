var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Base = require('./BaseStore');
var Actions = require('../actions/actions');
var LoginStore = (function (_super) {
    __extends(LoginStore, _super);
    function LoginStore() {
        var _this = this;
        _super.call(this);
        this.state = { username: "a@b", loginInProgress: false, error: null };
        this.dispatcher.register(Actions.Login.USERNAME_UPDATED, function (_) { return _this.usernameUpdated(_); });
        this.dispatcher.register(Actions.Login.LOGIN_COMMITTED, function () { return _this.commitLogin(); });
        this.dispatcher.register(Actions.Login.LOGIN_FAILED, function (_) { return _this.loginFailed(_); });
        this.dispatcher.register(Actions.Login.LOGIN_COMPLETE, function (_) { return _this.loginSucceded(_); });
    }
    LoginStore.prototype.getState = function () {
        return $.extend({}, this.state);
    };
    LoginStore.prototype.usernameUpdated = function (value) {
        this.state.username = value;
        this.emitChange();
    };
    LoginStore.prototype.commitLogin = function () {
        Actions.Login.PerformLogin("/login", this.state.username);
        this.state.loginInProgress = true;
        this.emitChange();
    };
    LoginStore.prototype.loginFailed = function (message) {
        this.state.error = message;
        this.state.loginInProgress = false;
        this.emitChange();
    };
    LoginStore.prototype.loginSucceded = function (data) {
        window.location.replace(data.redirectUrl);
    };
    return LoginStore;
})(Base.BaseStore);
exports.LoginStore = LoginStore;
exports.Instance = new LoginStore();
