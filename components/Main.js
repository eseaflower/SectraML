var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var test = require("./TestComponent");
var AjaxJson = require("./AjaxJson");
var MainComponent = (function (_super) {
    __extends(MainComponent, _super);
    function MainComponent(props, context) {
        _super.call(this, props, context);
        this.state = { username: "a@b", loginInProgress: false };
    }
    MainComponent.prototype.copyState = function () {
        return {
            username: this.state.username,
            loginInProgress: this.state.loginInProgress
        };
    };
    MainComponent.prototype.handleChange = function (value) {
        var newState = this.copyState();
        newState.username = value;
        this.setState(newState);
    };
    MainComponent.prototype.onLoggedIn = function (data) {
        var newState = this.copyState();
        newState.loginInProgress = false;
        this.setState(newState);
    };
    MainComponent.prototype.handleLogin = function () {
        var _this = this;
        var handle = AjaxJson.postJson("/login", { "username": this.state.username });
        handle.done(function (data, status) {
            alert("User id is " + data.userId.toString());
            window.location.replace("http://www.na.se");
        }).fail(function (xhr, status, err) {
            alert(["Login failed:", xhr.status.toString(), xhr.statusText].join(' '));
            var newState = _this.copyState();
            newState.loginInProgress = false;
            _this.setState(newState);
        });
        var newState = this.copyState();
        newState.loginInProgress = true;
        this.setState(newState);
    };
    MainComponent.prototype.render = function () {
        var _this = this;
        return React.createElement(test.LoginForm, {"onChanged": function (value) { return _this.handleChange(value); }, "onLogin": function () { return _this.handleLogin(); }, "username": this.state.username, "loginInProgress": this.state.loginInProgress});
    };
    return MainComponent;
})(React.Component);
function buildContent() {
    return React.createElement(MainComponent, null);
}
function entry(contentId) {
    var content = buildContent();
    var mount = document.getElementById(contentId);
    React.render(content, mount);
}
exports.entry = entry;
