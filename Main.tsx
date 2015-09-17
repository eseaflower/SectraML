/// <reference path="./typings/tsd.d.ts"/>
/// <reference path="./TestComponent.tsx"/>
import React=require("react");
import test = require("./TestComponent");

function buildContent() {
	var c = <test.Test who="ksjdkjd" />
	return c;
}

	
var content = buildContent();
var mount = document.getElementById("content");
React.render(content, mount);
