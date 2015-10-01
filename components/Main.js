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
            window.location.replace(data.redirectUrl);
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
function buildMain() {
    return (React.createElement("div", {"className": "container"}, React.createElement("div", {"className": "row"}, React.createElement("div", {"className": "col-xs-3 col-xs-offset-3"}, React.createElement("div", {"className": "page-header"}, React.createElement("h1", null, "Sectra ML")), React.createElement(MainComponent, null)))));
}
function buildUser(userId) {
    return (React.createElement("div", {"className": "container"}, React.createElement("div", {"className": "row"}, React.createElement("h1", {"className": "page-header"}, "User Workspace")), React.createElement("div", {"className": "row"}, React.createElement("div", {"className": "col-xs-3 sidebar", "id": "navigation"}, "Navigation stuff", React.createElement("ul", {"className": "nav nav-sidebar"}, React.createElement("li", {"className": "active"}, React.createElement("a", {"href": "#"}, "Overview ", React.createElement("span", {"className": "sr-only"}, "(current)"))), React.createElement("li", null, React.createElement("a", {"href": "#"}, "Reports")), React.createElement("li", null, React.createElement("a", {"href": "#"}, "Analytics")), React.createElement("li", null, React.createElement("a", {"href": "#"}, "Export")))), React.createElement("div", {"className": "col-xs-9", "id": "mainWorkspace"}, React.createElement("div", {"className": "table-responsive"}, React.createElement("table", {"className": "table table-striped"}, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "#"), React.createElement("th", null, "Header"), React.createElement("th", null, "Header"), React.createElement("th", null, "Header"), React.createElement("th", null, "Header"))), React.createElement("tbody", null, React.createElement("tr", null, React.createElement("td", null, "1,001"), React.createElement("td", null, "Lorem"), React.createElement("td", null, "ipsum"), React.createElement("td", null, "dolor"), React.createElement("td", null, "sit")), React.createElement("tr", null, React.createElement("td", null, "1,002"), React.createElement("td", null, "amet"), React.createElement("td", null, "consectetur"), React.createElement("td", null, "adipiscing"), React.createElement("td", null, "elit")), React.createElement("tr", null, React.createElement("td", null, "1,003"), React.createElement("td", null, "Integer"), React.createElement("td", null, "nec"), React.createElement("td", null, "odio"), React.createElement("td", null, "Praesent")))))))));
}
function mountAndRender(contentId, element) {
    var mount = document.getElementById(contentId);
    React.render(element, mount);
}
function entry(contentId) {
    mountAndRender(contentId, buildMain());
}
exports.entry = entry;
function user(contentId, userId) {
    mountAndRender(contentId, buildUser(userId));
}
exports.user = user;
