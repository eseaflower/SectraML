var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var test = require("./TestComponent");
var MainComponent = (function (_super) {
    __extends(MainComponent, _super);
    function MainComponent(props, context) {
        _super.call(this, props, context);
        this.state = { login_name: "a@b", login_in_progress: false };
    }
    MainComponent.prototype.copyState = function () {
        return {
            login_name: this.state.login_name,
            login_in_progress: this.state.login_in_progress
        };
    };
    MainComponent.prototype.handleChange = function (value) {
        var newState = this.copyState();
        newState.login_name = value;
        this.setState(newState);
    };
    MainComponent.prototype.onLoggedIn = function (data) {
        var newState = this.copyState();
        newState.login_in_progress = false;
        this.setState(newState);
    };
    MainComponent.prototype.handleLogin = function () {
        var _this = this;
        $.post("/login", { "Testdata": 123 }, function (data, status, jqXHR) { return _this.onLoggedIn(data); }, "json");
        var newState = this.copyState();
        newState.login_in_progress = true;
        this.setState(newState);
    };
    MainComponent.prototype.render = function () {
        var _this = this;
        return React.createElement(test.LoginForm, {"onChanged": function (value) { return _this.handleChange(value); }, "onLogin": function () { return _this.handleLogin(); }, "login_name": this.state.login_name, "login_in_progress": this.state.login_in_progress});
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
