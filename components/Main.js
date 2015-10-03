var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var Signin = require("./Signin");
var Sidebar = require("./Sidebar");
var Login = require("../stores/LoginStore");
var MainComponent = (function (_super) {
    __extends(MainComponent, _super);
    function MainComponent(props, context) {
        var _this = this;
        _super.call(this, props, context);
        this.state = Login.Instance.getState();
        this.changeEventHandler = function () { return _this.onStoreChange(); };
    }
    MainComponent.prototype.componentDidMount = function () {
        Login.Instance.addChangeListener(this.changeEventHandler);
    };
    MainComponent.prototype.componentWillUnmount = function () {
        Login.Instance.removeChangeListener(this.changeEventHandler);
    };
    MainComponent.prototype.onStoreChange = function () {
        this.setState(Login.Instance.getState());
    };
    MainComponent.prototype.render = function () {
        return React.createElement(Signin.LoginForm, {"username": this.state.username, "loginInProgress": this.state.loginInProgress, "error": this.state.error});
    };
    return MainComponent;
})(React.Component);
function buildMain() {
    return (React.createElement("div", {"className": "container"}, React.createElement("div", {"className": "row"}, React.createElement("div", {"className": "col-xs-3 col-xs-offset-4"}, React.createElement("div", {"className": "page-header"}, React.createElement("h1", null, "Sectra ML")), React.createElement(MainComponent, null)))));
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
        return React.createElement(Sidebar.Sidebar, {"items": this.state.navigationItems});
    };
    return UserMainComponent;
})(React.Component);
function buildUser(userId) {
    return (React.createElement("div", {"className": "container"}, React.createElement("div", {"className": "row"}, React.createElement("h1", {"className": "page-header"}, "User Workspace")), React.createElement("div", {"className": "row"}, React.createElement(UserMainComponent, null), React.createElement("div", {"className": "col-xs-10", "id": "mainWorkspace"}, React.createElement("div", {"className": "table-responsive"}, React.createElement("table", {"className": "table table-striped"}, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "#"), React.createElement("th", null, "Header"), React.createElement("th", null, "Header"), React.createElement("th", null, "Header"), React.createElement("th", null, "Header"))), React.createElement("tbody", null, React.createElement("tr", null, React.createElement("td", null, "1,001"), React.createElement("td", null, "Lorem"), React.createElement("td", null, "ipsum"), React.createElement("td", null, "dolor"), React.createElement("td", null, "sit")), React.createElement("tr", null, React.createElement("td", null, "1,002"), React.createElement("td", null, "amet"), React.createElement("td", null, "consectetur"), React.createElement("td", null, "adipiscing"), React.createElement("td", null, "elit")), React.createElement("tr", null, React.createElement("td", null, "1,003"), React.createElement("td", null, "Integer"), React.createElement("td", null, "nec"), React.createElement("td", null, "odio"), React.createElement("td", null, "Praesent")))))))));
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
