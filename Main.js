/// <reference path="./typings/tsd.d.ts"/>
/// <reference path="./TestComponent.tsx"/>
var React = require("react");
var test = require("./TestComponent");
function buildContent() {
    var c = React.createElement(test.Test, {"who": "ksjdkjd"});
    return c;
}
var content = buildContent();
var mount = document.getElementById("content");
React.render(content, mount);
