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
	custom:{[key:string]:string};
}

export interface ITrainingParams {
	hiddenLayers:number[];
}

export interface ITrainingResult {
	
}

class _Experiment {	
	public DATATYPES_COMMITED:string;
	public UPLOAD_DATATYPES_COMPLETE:string;
	public UPLOAD_DATATYPES_FAILED:string;
	public DATATYPES_CHANGED:string;
	public LAYERS_CHANGED:string;	
	public COMMIT_TRAINING:string;
	public TRAINING_COMPLETE:string;
	public TRAINING_FAILED:string;
	public EXAMPLE_CHANGED:string;
	public COMMIT_PREDICT:string;
	public PREDICT_COMPLETE:string;
	public PREDICT_FAILED:string;
	constructor() {
		this.DATATYPES_COMMITED = "DATATYPES_COMMITED";
		this.UPLOAD_DATATYPES_COMPLETE = "UPLOAD_DATATYPES_COMPLETE";
		this.UPLOAD_DATATYPES_FAILED = "UPLOAD_DATATYPES_FAILED";
		this.DATATYPES_CHANGED = "DATATYPES_CHANGED";
		this.LAYERS_CHANGED = "LAYERS_CHANGED";
		this.COMMIT_TRAINING ="COMMIT_TRAINING";
		this.TRAINING_COMPLETE = "TRAINING_COMPLETE";
		this.TRAINING_FAILED = "TRAINING_FAILED";
		this.EXAMPLE_CHANGED = "EXAMPLE_CHANGED";
		this.COMMIT_PREDICT = "COMMIT_PREDICT";
		this.PREDICT_COMPLETE = "PREDICT_COMPLETE";
		this.PREDICT_FAILED = "PREDICT_FAILED";
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
		Ajax.postJson<IDataType[]>(url, {type:"createDataMapping", data:data}).
		done((_) => this.UploadDataTypesComplete(_)).
		fail((xhr:JQueryXHR, status:string, err:Error) => {
			var message = ["Upload datatypes failed:",xhr.status.toString(),xhr.statusText].join(' ');				
			this.UploadDataTypesFailed(message);	
		});
	}
	public DatatypeChanged(data:IDataType) {
		AppDispatcher.Dispatcher.dispatch({type:this.DATATYPES_CHANGED, data:data});
	}
	
	public LayersChanged(data:number[]) {
		AppDispatcher.Dispatcher.dispatch({type:this.LAYERS_CHANGED, data:data});
	}
	public CommitTraining() {
		AppDispatcher.Dispatcher.dispatch({type:this.COMMIT_TRAINING, data:null});
	}
	private TrainingComplete(result:ITrainingResult) {
		AppDispatcher.Dispatcher.dispatch({type:this.TRAINING_COMPLETE, data:result});
	}
	private TrainingFailed(message:string) {
		AppDispatcher.Dispatcher.dispatch({type:this.TRAINING_FAILED, data:message});
	}
	
	public DoTraining(url:string, params:ITrainingParams) {
		Ajax.postJson<ITrainingResult>(url, {type:"train", data:params}).
		done((_)=> this.TrainingComplete(_)).
		fail((xhr:JQueryXHR, status:string, err:Error) => {
			var message = ["Training failed:",xhr.status.toString(),xhr.statusText].join(' ');				
			this.TrainingFailed(message);	
		});		
	}
	
	private PredictComplete(result:string) {
		AppDispatcher.Dispatcher.dispatch({type:this.PREDICT_COMPLETE, data:result});		
	}
	private PredictFailed(message:string) {
		AppDispatcher.Dispatcher.dispatch({type:this.PREDICT_FAILED, data:message});
	}
	
	public DoPredict(url:string, data:[{[key:string]:string}]) {
		Ajax.postJson<string>(url, {type:"predict", data:data}).
		done((_)=> this.PredictComplete(_)).
		fail((xhr:JQueryXHR, status:string, err:Error) => {
			var message = ["Prediction failed:",xhr.status.toString(),xhr.statusText].join(' ');				
			this.PredictFailed(message);	
		});		
	}
	
	public ExampleChanged(val:{column:string, value:string}) {
		AppDispatcher.Dispatcher.dispatch({type:this.EXAMPLE_CHANGED, data:val});
	}
	
	public CommitPredict() {
		AppDispatcher.Dispatcher.dispatch({type:this.COMMIT_PREDICT, data:null});
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