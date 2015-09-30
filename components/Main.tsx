/// <reference path="../typings/tsd.d.ts"/>
/// <reference path="./TestComponent.tsx"/>
import React=require("react");
import test = require("./TestComponent");
import jquery = require("jquery")
import AjaxJson = require("./AjaxJson");

interface IMainState {
	username:string;
	loginInProgress:boolean;	
}

interface IUser {
	userId:number;
}

class MainComponent extends React.Component<{},IMainState> {
	constructor(props?:{}, context?:any) {
		super(props, context);
		this.state = {username:"a@b", loginInProgress:false};		
	}
	private copyState():IMainState {
		return {
			username:this.state.username,
			loginInProgress:this.state.loginInProgress			
		}
	}
	
	private handleChange(value:string):void {				
		var newState = this.copyState();
		newState.username = value;
		this.setState(newState);
	}
	
	private onLoggedIn(data:any) {
		var newState = this.copyState();
		newState.loginInProgress = false;
		this.setState(newState);
	}
	
	private handleLogin():void {			
		var handle = AjaxJson.postJson<IUser>("/login", {"username":this.state.username});
		handle.done((data:IUser, status:string)=>{
			alert("User id is " + data.userId.toString());
			window.location.replace("http://www.na.se");
		}).fail((xhr:JQueryXHR, status:string, err:Error) => {			
			alert(["Login failed:",xhr.status.toString(),xhr.statusText].join(' '));
			var newState = this.copyState()
			newState.loginInProgress = false;
			this.setState(newState);			
		});
		
		var newState = this.copyState();
		newState.loginInProgress = true;		
		this.setState(newState);
	}
	
	public render():JSX.Element {
		return <test.LoginForm 
		onChanged={(value:string) => this.handleChange(value)}
		onLogin={() => this.handleLogin()}
		username={this.state.username}
		loginInProgress={this.state.loginInProgress}/> 
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
