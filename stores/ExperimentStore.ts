/// <reference path="../typings/tsd.d.ts"/>
import Base = require('./BaseStore') 
import Actions = require('../actions/actions')

export interface IExperimentStoreState {
	Columns:string[];
	Rows:string[][];
	Message:string;
}

export class ExperimentStore extends Base.BaseStore {
	private state:IExperimentStoreState;
	constructor() {
		super();
		this.state = {Columns:null, Rows: null, Message:null};
		this.dispatcher.register<File>(Actions.Upload.UPLOAD_COMMITED,(_)=>this.commitUpload(_));	
		this.dispatcher.register<Actions.IUploadData>(Actions.Upload.UPLOAD_COMPLETE, (_)=>this.uploadCompleted(_));	
		this.dispatcher.register<string>(Actions.Upload.UPLOAD_FAILED, (_)=>this.uploadFailed(_));
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
}

export var Instance = new ExperimentStore();