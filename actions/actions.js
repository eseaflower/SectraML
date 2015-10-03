var AppDispatcher = require("../dispatcher/AppDispatcher");
var Ajax = require("../services/AjaxJson");
exports.UserStoreActions = {
    ADD_USER: "ADD_USER"
};
var _Login = (function () {
    function _Login() {
        this.USERNAME_UPDATED = "USERNAME_UPDATED";
        this.LOGIN_COMMITTED = "LOGIN_COMMITTED";
        this.LOGIN_COMPLETE = "LOGIN_COMPLETE";
        this.LOGIN_FAILED = "LOGIN_FAILED";
    }
    _Login.prototype.UpdateUsername = function (value) {
        AppDispatcher.Dispatcher.dispatch({ type: this.USERNAME_UPDATED, data: value });
    };
    _Login.prototype.LoginCommited = function () {
        AppDispatcher.Dispatcher.dispatch({ type: this.LOGIN_COMMITTED, data: {} });
    };
    _Login.prototype.LoginComplete = function (loginData) {
        AppDispatcher.Dispatcher.dispatch({ type: this.LOGIN_COMPLETE, data: loginData });
    };
    _Login.prototype.LoginFailed = function (message) {
        AppDispatcher.Dispatcher.dispatch({ type: this.LOGIN_FAILED, data: message });
    };
    _Login.prototype.PerformLogin = function (url, username) {
        var _this = this;
        Ajax.postJson(url, { "username": username }).
            done(function (data) { return _this.LoginComplete(data); }).
            fail(function (xhr, status, err) {
            var message = ["Login failed:", xhr.status.toString(), xhr.statusText].join(' ');
            _this.LoginFailed(message);
        });
    };
    return _Login;
})();
exports.Login = new _Login();
