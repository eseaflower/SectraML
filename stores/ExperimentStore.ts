/// <reference path="../typings/tsd.d.ts"/>
import Base = require('./BaseStore') 
import Actions = require('../actions/actions')
import User = require("./UserStore")

export interface IExperimentStoreState {
	examples:string[][];
	message:string;
	datatypes:Actions.IDataType[];
	inputDimension:number;
	outputDimension:number;
	hiddenLayers:number[];
	availableTypes:string[];
	example:{[key:string]:string};
	trainingSettings:Actions.ITrainingSettings;	
	predicted:string;
	readyForMapping:boolean;
	readyForTraining:boolean;	
	readyForNetwork:boolean;
	trainFigureUrl:string;
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
			inputDimension:null,
			outputDimension:null,
			availableTypes:null, 
			hiddenLayers:null,
			example:null,
			trainingSettings:{
				learningRate:"0.001",
				regularization:"0.0001",
				epochsPerRun:"1",
				runs:"10"
			},
			predicted:null,
			readyForTraining:false,
			readyForMapping:false,
			readyForNetwork:false,
			trainFigureUrl:null
		};
		this.experimentUrl = null;
		this.fileUploadUrl = null;
		this.dispatcher.register<File>(Actions.Upload.UPLOAD_COMMITED,(_)=>this.commitUpload(_));	
		this.dispatcher.register<Actions.IUploadData>(Actions.Upload.UPLOAD_COMPLETE, (_)=>this.uploadCompleted(_));	
		this.dispatcher.register<string>(Actions.Upload.UPLOAD_FAILED, (_)=>this.uploadFailed(_));
		this.dispatcher.register(Actions.Experiment.DATATYPES_COMMITED, ()=>this.commitUploadDataTypes());
		this.dispatcher.register<Actions.IDataMappingResult>(Actions.Experiment.UPLOAD_DATATYPES_COMPLETE, (_)=>this.uploadDataTypesCompleted(_));
		this.dispatcher.register<string>(Actions.Experiment.UPLOAD_DATATYPES_FAILED, (_)=>this.uploadDataTypesFailed(_));			
		this.dispatcher.register<string>(Actions.User.USER_ID_SET, (_)=>this.userChanged(_));
		this.dispatcher.register<Actions.IDataType>(Actions.Experiment.DATATYPES_CHANGED, (_)=>this.datatypesChanged(_));
		this.dispatcher.register<number[]>(Actions.Experiment.LAYERS_CHANGED, (_)=>this.layersChanged(_));
		this.dispatcher.register(Actions.Experiment.COMMIT_TRAINING, () => this.trainingCommited());
		this.dispatcher.register(Actions.Experiment.TRAINING_COMPLETE, ()=> this.trainingComplete());
		this.dispatcher.register<string>(Actions.Experiment.TRAINING_FAILED, (_) => this.trainingFailed(_));
		this.dispatcher.register<{column:string, value:string}>(Actions.Experiment.EXAMPLE_CHANGED, (_)=>this.exampleChanged(_));
		this.dispatcher.register(Actions.Experiment.COMMIT_PREDICT, ()=>this.predictCommited());
		this.dispatcher.register<string>(Actions.Experiment.PREDICT_COMPLETE, (_)=>this.predictCompleted(_));
		this.dispatcher.register<Actions.ITrainingSettings>(Actions.Experiment.TRAINING_SETTINGS_CHANGED, (_)=>this.trainingSettingsChanged(_))	
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
		var custom:{[key:string]:string} = {};
		this.state.datatypes = data.columns.map(column => {
			return {column:column, datatype:data.availableTypes[0], custom:custom}
		});
		this.state.availableTypes = data.availableTypes;
		this.experimentUrl = "/experiment/" + data.id.toString();
		this.state.message = null;
		this.state.readyForMapping = true;
		this.state.readyForNetwork = false;
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
			this.state.message = "Creating data mapping..."
			this.emitChange();
		}
	}
	
	private uploadDataTypesCompleted(data:Actions.IDataMappingResult) {
		this.state.message = null;
		this.state.datatypes = data.mapping;
		this.state.inputDimension = data.inputDimension;
		this.state.outputDimension = data.outputDimension;
		this.state.readyForMapping = false;		
		this.state.readyForNetwork = true;		
		this.state.readyForTraining = true;
		if (this.state.hiddenLayers == null) {
			this.state.hiddenLayers = [];				
		} 
		//this.updateTrainingReady();		
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
	
	private layersChanged(data:number[]) {
		this.state.hiddenLayers = data;		
		//this.updateTrainingReady();
		this.emitChange();	
	}
	
	private updateTrainingReady() {
		var ready = false;		 
		if (this.state.hiddenLayers != null) {
			var nodeCount = 0;
			this.state.hiddenLayers.map(i => nodeCount += i);
			ready = nodeCount > 0;		
		}
		if (ready != this.state.readyForTraining) {
			this.state.readyForTraining = ready;			
			return true;	
		}
		return false;
	}
	
	private trainingCommited() {
		// Gather network/training parameters and do training.
		if (this.experimentUrl != null) {
			this.state.readyForMapping = false;
			this.state.readyForNetwork = false;
			this.state.readyForTraining = false;
			this.state.example = null;
			this.state.message = "Training model..."
			var layers = this.state.hiddenLayers != null?this.state.hiddenLayers:[];
			Actions.Experiment.DoTraining(this.experimentUrl, 
				{	
					hiddenLayers:layers,
					settings:this.state.trainingSettings
				});
			this.emitChange();
		}
	}
	
	private trainingComplete() {
		this.state.example = {};
		this.state.message = "Prediction model available at " + this.experimentUrl + "?args={\"type\":\"predict\",\"data\":[<list of your data>]}";		
		this.state.trainFigureUrl = this.experimentUrl+"?args="+JSON.stringify({type:"figure", data:Date.now()});
		this.emitChange();
	}
	
	private trainingFailed(message:string) {
		this.state.message = message;
		this.emitChange();		
	}
	
	private exampleChanged(val:{column:string, value:string}) {		
		this.state.example[val.column] = val.value;	
		this.state.predicted = null;	
		this.emitChange();
	}
	
	private predictCommited() {
		if (this.experimentUrl != null) {
			var toPredict:{[key:string]:string} = {};
			this.state.datatypes.map(dt => {
				if (dt.datatype != "Ignore" && dt.datatype != "Label") {
					var value = this.state.example[dt.column];
					if (value == null) {
						value = "";
					}
					toPredict[dt.column] = value;
				}				
			});
			
			Actions.Experiment.DoPredict(this.experimentUrl, [toPredict]);
			this.emitChange();			
		}
	}
	private predictCompleted(value:string) {
		this.state.predicted = value;
		this.emitChange();
	}
	
	private trainingSettingsChanged(data:Actions.ITrainingSettings) {
		this.state.trainingSettings = data;
		this.emitChange();
	}
}

export var Instance = new ExperimentStore();