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
    _Upload.prototype.PerformUpload = function (url, file) {
        var _this = this;
        Ajax.uploadFile(url, file).
            done(function (data) { return _this.UploadComplete(data); }).
            fail(function (xhr, status, err) {
            var message = ["Upload failed:", xhr.status.toString(), xhr.statusText].join(' ');
            _this.UploadFailed(message);
        });
    };
    return _Upload;
})();
exports.Upload = new _Upload();
var _Experiment = (function () {
    function _Experiment() {
        this.DATATYPES_COMMITED = "DATATYPES_COMMITED";
        this.UPLOAD_DATATYPES_COMPLETE = "UPLOAD_DATATYPES_COMPLETE";
        this.UPLOAD_DATATYPES_FAILED = "UPLOAD_DATATYPES_FAILED";
        this.DATATYPES_CHANGED = "DATATYPES_CHANGED";
    }
    _Experiment.prototype.CommitDatatypes = function () {
        AppDispatcher.Dispatcher.dispatch({ type: this.DATATYPES_COMMITED, data: null });
    };
    _Experiment.prototype.UploadDataTypesComplete = function (data) {
        AppDispatcher.Dispatcher.dispatch({ type: this.UPLOAD_DATATYPES_COMPLETE, data: data });
    };
    _Experiment.prototype.UploadDataTypesFailed = function (message) {
        AppDispatcher.Dispatcher.dispatch({ type: this.UPLOAD_DATATYPES_FAILED, data: message });
    };
    _Experiment.prototype.UploadDatatypes = function (url, data) {
        var _this = this;
        Ajax.postJson(url, { type: "create_datamapping", data: data }).
            done(function (_) { return _this.UploadDataTypesComplete(_); }).
            fail(function (xhr, status, err) {
            var message = ["Upload datatypes failed:", xhr.status.toString(), xhr.statusText].join(' ');
            _this.UploadDataTypesFailed(message);
        });
    };
    _Experiment.prototype.DatatypeChanged = function (data) {
        AppDispatcher.Dispatcher.dispatch({ type: this.DATATYPES_CHANGED, data: data });
    };
    return _Experiment;
})();
exports.Experiment = new _Experiment();
var _User = (function () {
    function _User() {
        this.USER_ID_SET = "USER_ID_SET";
    }
    _User.prototype.SetUserId = function (userId) {
        AppDispatcher.Dispatcher.dispatch({ type: this.USER_ID_SET, data: userId });
    };
    return _User;
})();
exports.User = new _User();
