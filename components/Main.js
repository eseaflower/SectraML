var React = require("react");
var test = require("./TestComponent");
function buildContent() {
    var c = React.createElement(test.LoginForm, {"login_name": "eseaflower@hotmail.com"});
    return c;
}
function entry(contentId) {
    var content = buildContent();
    var mount = document.getElementById(contentId);
    React.render(content, mount);
}
exports.entry = entry;
