/// <reference path="../typings/tsd.d.ts"/>
import React=require("react");

export interface ITestProps {
	who:string;		
};


export class Test extends React.Component<ITestProps, any> {
	render() {						
		return(<h2>{this.props.who} </h2>)
	}		
};