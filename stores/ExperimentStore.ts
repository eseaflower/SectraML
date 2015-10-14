/// <reference path="../typings/tsd.d.ts"/>
import Base = require('./BaseStore') 
import Actions = require('../actions/actions')
import User = require("./UserStore")

export interface IExperimentStoreState {
	Columns:string[];
	Rows:string[][];
	Message:string;
	DataTypes:Actions.IDataType[];
}

export class ExperimentStore extends Base.BaseStore {
	private state:IExperimentStoreState;
	private dataTypesUploadUrl:string;
	constructor() {
		super();
		this.state = {Columns:null, Rows: null, Message:null, DataTypes:null};
		this.dataTypesUploadUrl = null;
		this.dispatcher.register<File>(Actions.Upload.UPLOAD_COMMITED,(_)=>this.commitUpload(_));	
		this.dispatcher.register<Actions.IUploadData>(Actions.Upload.UPLOAD_COMPLETE, (_)=>this.uploadCompleted(_));	
		this.dispatcher.register<string>(Actions.Upload.UPLOAD_FAILED, (_)=>this.uploadFailed(_));
		this.dispatcher.register<Actions.IDataType[]>(Actions.Experiment.DATATYPES_COMMITED, (_)=>this.commitUploadDataTypes(_));
		this.dispatcher.register<Actions.IDataType[]>(Actions.Experiment.UPLOAD_DATATYPES_COMPLETE, (_)=>this.uploadDataTypesCompleted(_));
		this.dispatcher.register<string>(Actions.Experiment.UPLOAD_DATATYPES_FAILED, (_)=>this.uploadDataTypesFailed(_));			
		this.dispatcher.register<string>(Actions.User.USER_ID_SET, (_)=>this.userChanged(_));
			
	}	
	
	public getState():IExperimentStoreState {		
		return $.extend({}, this.state); 		
	}
			
	private commitUpload(file:File) {
		Actions.Upload.PerformUpload(file);
		this.state.Columns = null;
		this.state.Message = "Uploading...";
		this.emitChange();		
	}
	private uploadCompleted(data:Actions.IUploadData) {
		this.state.Columns = data.Columns;
		this.state.Rows = data.Rows;
		this.state.Message = null;
		this.emitChange();
	}
	private uploadFailed(message:string) {
		this.state.Columns = null;
		this.state.Message = message;
		this.emitChange();
	}
	private commitUploadDataTypes(data:Actions.IDataType[]) {
		if (this.dataTypesUploadUrl != null) {
			Actions.Experiment.UploadDatatypes(this.dataTypesUploadUrl, data);
		}
	}
	
	private uploadDataTypesCompleted(data:Actions.IDataType[]) {
		this.state.DataTypes = data;
		this.emitChange();
	}
	private uploadDataTypesFailed(message:string) {
		this.state.Message = message;
		this.emitChange();	
	}	
	
	private userChanged(userId:string) {
		// Wait for the user store.
		this.waitFor(User.Instance);
				
		var userId = User.Instance.getState().UserId;
		this.dataTypesUploadUrl = null;
		if (userId != null) {
			this.dataTypesUploadUrl = "/user/" + userId + "/datatypes";
		}	
	}
}

export var Instance = new ExperimentStore();