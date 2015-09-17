/// <reference path="./typings/tsd.d.ts"/>
import React=require("react");


export class Test extends React.Component<any, any> {
	render() {
		return(<h2>{this.props.who}</h2>)
	}
	
	props: {
		who?:string;
	}
	
}