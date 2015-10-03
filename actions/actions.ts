/// <reference path="../typings/tsd.d.ts"/>
import AppDispatcher = require("../dispatcher/AppDispatcher")
import Ajax = require("../services/AjaxJson")

export var UserStoreActions = {
	ADD_USER:"ADD_USER"
}

export interface ILoginData {
	userId:number;
	redirectUrl:string;
}

class _Login {
	public USERNAME_UPDATED:string;
	public LOGIN_COMMITTED:string;	
	public LOGIN_COMPLETE:string;
	public LOGIN_FAILED:string;
	constructor() {
		this.USERNAME_UPDATED  = "USERNAME_UPDATED";
		this.LOGIN_COMMITTED  = "LOGIN_COMMITTED";
		this.LOGIN_COMPLETE = "LOGIN_COMPLETE";
		this.LOGIN_FAILED = "LOGIN_FAILED";
	}	
	public UpdateUsername(value:string) {	
		AppDispatcher.Dispatcher.dispatch({type:this.USERNAME_UPDATED, data:value});
	}
	public LoginCommited() {
		AppDispatcher.Dispatcher.dispatch({type:this.LOGIN_COMMITTED, data:{}});
	}
	public LoginComplete(loginData:ILoginData) {
		AppDispatcher.Dispatcher.dispatch({type:this.LOGIN_COMPLETE, data:loginData});
	}
	public LoginFailed(message:string) {
		AppDispatcher.Dispatcher.dispatch({type:this.LOGIN_FAILED, data:message});
	}
	public PerformLogin(url:string, username:string) {
		Ajax.postJson<ILoginData>(url, {"username":username}).
		done((data) => this.LoginComplete(data)).
		fail((xhr:JQueryXHR, status:string, err:Error) => {
			var message = ["Login failed:",xhr.status.toString(),xhr.statusText].join(' ');
			this.LoginFailed(message);			
		});
	}	
}
export var Login = new _Login();
