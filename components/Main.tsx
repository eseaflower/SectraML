/// <reference path="../typings/tsd.d.ts"/>
/// <reference path="./TestComponent.tsx"/>
import React=require("react");
import test = require("./TestComponent");

function buildContent() {
	var c = <test.Test who="Erik Sjöblom"/>
	return c;
}


export function entry(contentId) {	
	var content = buildContent();
	var mount = document.getElementById(contentId);
	React.render(content, mount);
}
