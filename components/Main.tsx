/// <reference path="../typings/tsd.d.ts"/>
/// <reference path="./TestComponent.tsx"/>
import React=require("react");
import test = require("./TestComponent");
import jquery = require("jquery")

interface IMainState {
	login_name:string;
	login_in_progress:boolean;	
}

class MainComponent extends React.Component<{},IMainState> {
	constructor(props?:{}, context?:any) {
		super(props, context);
		this.state = {login_name:"a@b", login_in_progress:false};		
	}
	private copyState():IMainState {
		return {
			login_name:this.state.login_name,
			login_in_progress:this.state.login_in_progress			
		}
	}
	
	private handleChange(value:string):void {				
		var newState = this.copyState();
		newState.login_name = value;
		this.setState(newState);
	}
	
	private onLoggedIn(data:any) {
		var newState = this.copyState();
		newState.login_in_progress = false;
		this.setState(newState);
	}
	
	private handleLogin():void{
		
		$.post("/login",
		{"Testdata":123},
		(data:any, status:string, jqXHR:JQueryXHR) => this.onLoggedIn(data),
		"json") 
		
		
		
		
		var newState = this.copyState();
		newState.login_in_progress = true;		
		this.setState(newState);
	}
	
	public render():JSX.Element {
		return <test.LoginForm 
		onChanged={(value:string) => this.handleChange(value)}
		onLogin={() => this.handleLogin()}
		login_name={this.state.login_name}
		login_in_progress={this.state.login_in_progress}/> 
	}
	
} 

function buildContent() {
	//var c = <test.LoginForm login_name="eseaflower@hotmail.com"/>
	return <MainComponent/>;
}


export function entry(contentId) {	
	var content = buildContent();
	var mount = document.getElementById(contentId);
	React.render(content, mount);
}
