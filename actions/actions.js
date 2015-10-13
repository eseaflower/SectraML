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
var _Upload = (function () {
    function _Upload() {
        this.UPLOAD_COMMITED = "UPLOAD_COMMITED";
        this.UPLOAD_COMPLETE = "UPLOAD_COMPLETE";
        this.UPLOAD_FAILED = "UPLOAD_FAILED";
    }
    _Upload.prototype.CommitUpload = function (file) {
        AppDispatcher.Dispatcher.dispatch({ type: this.UPLOAD_COMMITED, data: file });
    };
    _Upload.prototype.UploadComplete = function (data) {
        AppDispatcher.Dispatcher.dispatch({ type: this.UPLOAD_COMPLETE, data: data });
    };
    _Upload.prototype.UploadFailed = function (message) {
        AppDispatcher.Dispatcher.dispatch({ type: this.UPLOAD_FAILED, data: message });
    };
    _Upload.prototype.PerformUpload = function (file) {
        var _this = this;
        Ajax.uploadFile("/upload", file).
            done(function (data) { return _this.UploadComplete(data); }).
            fail(function (xhr, status, err) {
            var message = ["Upload failed:", xhr.status.toString(), xhr.statusText].join(' ');
            _this.UploadFailed(message);
        });
    };
    return _Upload;
})();
exports.Upload = new _Upload();
