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


export interface IUploadData {
	id:number;
	columns:string[];
	rows:string[][];
	availableTypes:string[];	
}

class _Upload {
	public UPLOAD_COMMITED:string;
	public UPLOAD_COMPLETE:string;
	public UPLOAD_FAILED:string;
	constructor() {
		this.UPLOAD_COMMITED = "UPLOAD_COMMITED";		
		this.UPLOAD_COMPLETE = "UPLOAD_COMPLETE";
		this.UPLOAD_FAILED = "UPLOAD_FAILED";	
	}
	public CommitUpload(file:File){
		AppDispatcher.Dispatcher.dispatch({type:this.UPLOAD_COMMITED, data:file});
	}
	private UploadComplete(data:IUploadData) {
		AppDispatcher.Dispatcher.dispatch({type:this.UPLOAD_COMPLETE, data:data});
	}
	private UploadFailed(message:string){
		AppDispatcher.Dispatcher.dispatch({type:this.UPLOAD_FAILED, data:message});	
	} 
	public PerformUpload(url:string, file:File) {
		Ajax.uploadFile<IUploadData>(url, file).
		done((data)=>this.UploadComplete(data)).
		fail((xhr:JQueryXHR, status:string, err:Error) => {
			var message = ["Upload failed:",xhr.status.toString(),xhr.statusText].join(' ');				
			this.UploadFailed(message);	
		});
	}
}
export var Upload = new _Upload()

export interface IDataType {
	column:string;
	datatype:string;
}

class _Experiment {	
	public DATATYPES_COMMITED:string;
	public UPLOAD_DATATYPES_COMPLETE:string;
	public UPLOAD_DATATYPES_FAILED:string;
	public DATATYPES_CHANGED:string;
	constructor() {
		this.DATATYPES_COMMITED = "DATATYPES_COMMITED";
		this.UPLOAD_DATATYPES_COMPLETE = "UPLOAD_DATATYPES_COMPLETE";
		this.UPLOAD_DATATYPES_FAILED = "UPLOAD_DATATYPES_FAILED";
		this.DATATYPES_CHANGED = "DATATYPES_CHANGED";
	}	
	public CommitDatatypes() {
		AppDispatcher.Dispatcher.dispatch({type:this.DATATYPES_COMMITED, data:null});
	}
	
	private UploadDataTypesComplete(data:IDataType[]){
		AppDispatcher.Dispatcher.dispatch({type:this.UPLOAD_DATATYPES_COMPLETE, data:data});
	}
	private UploadDataTypesFailed(message:string) {				
		AppDispatcher.Dispatcher.dispatch({type:this.UPLOAD_DATATYPES_FAILED, data:message});
	}
	public UploadDatatypes(url:string, data:IDataType[]) {
		Ajax.postJson<IDataType[]>(url, data).
		done((_) => this.UploadDataTypesComplete(_)).
		fail((xhr:JQueryXHR, status:string, err:Error) => {
			var message = ["Upload datatypes failed:",xhr.status.toString(),xhr.statusText].join(' ');				
			this.UploadDataTypesFailed(message);	
		});
	}
	public DatatypeChanged(data:IDataType) {
		AppDispatcher.Dispatcher.dispatch({type:this.DATATYPES_CHANGED, data:data});
	}
}

export var Experiment = new _Experiment()


class _User {
	public USER_ID_SET:string;
	constructor() {
		this.USER_ID_SET = "USER_ID_SET";
	}
	public SetUserId(userId:string) {
		AppDispatcher.Dispatcher.dispatch({type:this.USER_ID_SET, data:userId});
	}
}
export var User = new _User();