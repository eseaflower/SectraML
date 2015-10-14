var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var Login = require("./Login");
var Sidebar = require("./Sidebar");
var Experiment = require("./ExperimentController");
var Actions = require("../actions/actions");
function buildLogin() {
    return (React.createElement("div", {"className": "container"}, React.createElement("div", {"className": "row"}, React.createElement("div", {"className": "col-xs-3 col-xs-offset-4"}, React.createElement("div", {"className": "page-header"}, React.createElement("h1", null, "Sectra ML")), React.createElement(Login.LoginComponent, null)))));
}
var UserMainComponent = (function (_super) {
    __extends(UserMainComponent, _super);
    function UserMainComponent(props, context) {
        var _this = this;
        _super.call(this, props, context);
        this.state = {
            navigationItems: [
                { id: 0, name: "Overview", url: "#", active: true, clickCallback: function (p) { return _this.handleNavigationClick(p); } },
                { id: 1, name: "Second", url: "#", active: false, clickCallback: function (p) { return _this.handleNavigationClick(p); } },
                { id: 2, name: "Analytics", url: "#", active: false, clickCallback: function (p) { return _this.handleNavigationClick(p); } },
                { id: 3, name: "Export", url: "#", active: false, clickCallback: function (p) { return _this.handleNavigationClick(p); } },
            ],
            activeItem: 0
        };
    }
    UserMainComponent.prototype.handleNavigationClick = function (item) {
        var newState = $.extend({}, this.state);
        newState.navigationItems[newState.activeItem].active = false;
        newState.navigationItems[item.id].active = true;
        newState.activeItem = item.id;
        this.setState(newState);
    };
    UserMainComponent.prototype.render = function () {
        return (React.createElement("div", null, React.createElement(Sidebar.Sidebar, {"items": this.state.navigationItems}), React.createElement(Experiment.ExperimentController, null)));
    };
    return UserMainComponent;
})(React.Component);
function buildUser(userId) {
    return (React.createElement("div", {"className": "container"}, React.createElement("div", {"className": "row"}, React.createElement("h1", {"className": "page-header"}, "User Workspace")), React.createElement("div", {"className": "row"}, React.createElement(UserMainComponent, null))));
}
function mountAndRender(contentId, element) {
    var mount = document.getElementById(contentId);
    React.render(element, mount);
}
function login(contentId) {
    mountAndRender(contentId, buildLogin());
}
exports.login = login;
function user(contentId, userId) {
    mountAndRender(contentId, buildUser(userId));
    Actions.User.SetUserId(userId.toString());
}
exports.user = user;
