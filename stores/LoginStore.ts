/// <reference path="../typings/tsd.d.ts"/>
import Base = require('./BaseStore') 
import Actions = require('../actions/actions')

export interface ILoginState {
	username:string;
	loginInProgress:boolean;
	error:string;	
}

export var Events = {
	Change : "Change"
};

export class LoginStore extends Base.BaseStore {
	private state:ILoginState;
	constructor() {
		super();
		this.state = {username:"a@b", loginInProgress:false, error:null};						
		this.dispatcher.register<string>(Actions.Login.USERNAME_UPDATED, (_)=>this.usernameUpdated(_));
		this.dispatcher.register<{}>(Actions.Login.LOGIN_COMMITTED, ()=>this.commitLogin());
		this.dispatcher.register<string>(Actions.Login.LOGIN_FAILED, (_)=>this.loginFailed(_));
		this.dispatcher.register<Actions.ILoginData>(Actions.Login.LOGIN_COMPLETE, (_)=>this.loginSucceded(_));
	}
	
	public getState():ILoginState {		
		return $.extend({}, this.state); 		
	}
	
	public addChangeListener(callback:()=>void) {
		this.on(Events.Change, callback);
	}
	public removeChangeListener(callback:()=>void) {
		this.removeListener(Events.Change, callback);
	}
	
	private usernameUpdated(value:string) {
		this.state.username = value;
		this.emit(Events.Change);
	}
	
	private commitLogin() {		
		Actions.Login.PerformLogin("/login", this.state.username);
		this.state.loginInProgress = true;		
		this.emit(Events.Change);
	}
		
	private loginFailed(message:string) {
		//alert(message);
		this.state.error = message;
		this.state.loginInProgress = false;
		this.emit(Events.Change);
	}		
	private loginSucceded(data:Actions.ILoginData) {
		window.location.replace(data.redirectUrl);
	}
		
}

export var Instance = new LoginStore();
