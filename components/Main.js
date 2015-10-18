var React = require("react");
var Login = require("./Login");
var Sidebar = require("./Sidebar");
var Experiment = require("./ExperimentController");
var Actions = require("../actions/actions");
function buildLogin() {
    return (React.createElement("div", {"className": "container"}, React.createElement("div", {"className": "row"}, React.createElement("div", {"className": "col-xs-3 col-xs-offset-4"}, React.createElement("div", {"className": "page-header"}, React.createElement("h1", null, "Sectra ML")), React.createElement(Login.LoginComponent, null)))));
}
function buildUser(userId) {
    return (React.createElement("div", {"className": "container"}, React.createElement("div", {"className": "row"}, React.createElement("h1", {"className": "page-header"}, "User Workspace")), React.createElement("div", {"className": "row"}, React.createElement(Sidebar.Sidebar, null), React.createElement(Experiment.ExperimentController, null))));
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
