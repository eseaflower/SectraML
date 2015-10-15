/// <reference path="../typings/tsd.d.ts"/>
import Base = require('./BaseStore') 
import Actions = require('../actions/actions')
import User = require("./UserStore")

export interface IExperimentStoreState {
	examples:string[][];
	message:string;
	datatypes:Actions.IDataType[];
	availableTypes:string[];
	readyForMapping:boolean;
	readyForTraining:boolean;	
}

export class ExperimentStore extends Base.BaseStore {
	private state:IExperimentStoreState;
	private experimentUrl:string;
	private fileUploadUrl:string
	constructor() {
		super();
		this.state = {
			examples: null, 
			message:null, 
			datatypes:null, 
			availableTypes:null, 
			readyForTraining:false,
			readyForMapping:false
		};
		this.experimentUrl = null;
		this.fileUploadUrl = null;
		this.dispatcher.register<File>(Actions.Upload.UPLOAD_COMMITED,(_)=>this.commitUpload(_));	
		this.dispatcher.register<Actions.IUploadData>(Actions.Upload.UPLOAD_COMPLETE, (_)=>this.uploadCompleted(_));	
		this.dispatcher.register<string>(Actions.Upload.UPLOAD_FAILED, (_)=>this.uploadFailed(_));
		this.dispatcher.register(Actions.Experiment.DATATYPES_COMMITED, ()=>this.commitUploadDataTypes());
		this.dispatcher.register<Actions.IDataType[]>(Actions.Experiment.UPLOAD_DATATYPES_COMPLETE, (_)=>this.uploadDataTypesCompleted(_));
		this.dispatcher.register<string>(Actions.Experiment.UPLOAD_DATATYPES_FAILED, (_)=>this.uploadDataTypesFailed(_));			
		this.dispatcher.register<string>(Actions.User.USER_ID_SET, (_)=>this.userChanged(_));
		this.dispatcher.register<Actions.IDataType>(Actions.Experiment.DATATYPES_CHANGED, (_)=>this.datatypesChanged(_));
	}	
	
	public getState():IExperimentStoreState {		
		return $.extend({}, this.state); 		
	}
			
	private commitUpload(file:File) {
		if (this.fileUploadUrl != null){
			Actions.Upload.PerformUpload(this.fileUploadUrl, file);
			this.state.message = "Uploading...";
			this.emitChange();		
		}
	}
	private uploadCompleted(data:Actions.IUploadData) {		
		this.state.examples = data.rows;		
		this.state.datatypes = data.columns.map(column => {
			return {column:column, datatype:data.availableTypes[0], custom:<{[key:string]:string}>{}}
		});
		this.state.availableTypes = data.availableTypes;
		this.experimentUrl = "/experiment/" + data.id.toString();
		this.state.message = null;
		this.state.readyForMapping = true;
		this.state.readyForTraining = false;
		this.emitChange();
	}
	private uploadFailed(message:string) {		
		this.state.message = message;
		this.emitChange();
	}
	private commitUploadDataTypes() {
		if (this.experimentUrl != null) {
			this.state.readyForMapping = false;
			Actions.Experiment.UploadDatatypes(this.experimentUrl, this.state.datatypes);
			this.emitChange();
		}
	}
	
	private uploadDataTypesCompleted(data:Actions.IDataType[]) {
		this.state.datatypes = data;
		this.state.readyForMapping = true;
		this.state.readyForTraining = true;
		this.emitChange();
	}
	private uploadDataTypesFailed(message:string) {
		this.state.message = message;
		this.emitChange();	
	}	
	
	private userChanged(userId:string) {
		// Wait for the user store.
		this.waitFor(User.Instance);
				
		var userId = User.Instance.getState().UserId;
		this.fileUploadUrl = null;
		if (userId != null) {
			this.fileUploadUrl = userId + "/upload";
			this.emitChange();
		}	
	}
	private datatypesChanged(data:Actions.IDataType) {
		// Copy all but the changed data mapping
		this.state.datatypes = this.state.datatypes.map(dt => (dt.column == data.column)?data:dt);
		this.state.readyForTraining = false;
		this.emitChange();	
	}
	
}

export var Instance = new ExperimentStore();