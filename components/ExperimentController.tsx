/// <reference path="../typings/tsd.d.ts"/>
import React=require("react");
import ExperimentStore = require("../stores/ExperimentStore")
import UserStore = require("../stores/UserStore")
import ExperimentComponent = require("./Experiment")
import Actions = require("../actions/actions")

export interface IExperimentControllerProps {
	mapperProps:ExperimentComponent.IDatatypeMapperTableProps;
	networkProps:ExperimentComponent.INetworkProps;
	message:string;
	predictProps:ExperimentComponent.IPredictProps;
	readyForTraining:boolean;	
	readyForMapping:boolean;
	readyForNetwork:boolean;
}

export class ExperimentController extends React.Component<{}, IExperimentControllerProps> {
	private changeEventHandler:()=>void;
	constructor(props?:{}, context?:any) {
		super(props, context);
		this.state = this.buildState();	
		this.changeEventHandler = () => this.onChange();
	}
    private componentDidMount() {
		// Attach to store.
		ExperimentStore.Instance.addChangeListener(this.changeEventHandler);		
	}
	private componentWillUnmount() {
		// Detach from store.
		ExperimentStore.Instance.removeChangeListener(this.changeEventHandler);
	}

	private buildState():IExperimentControllerProps {
		var experimentData =ExperimentStore.Instance.getState();		
		return {
			message: experimentData.message,
			readyForTraining: experimentData.readyForTraining,
			readyForMapping: experimentData.readyForMapping,
			readyForNetwork:experimentData.readyForNetwork,			
			mapperProps: {
				availableTypes:experimentData.availableTypes,
				examples: experimentData.examples,
				datatypes:experimentData.datatypes,
				acceptEdit:experimentData.readyForMapping
			},
			networkProps: {
				hiddenLayers:experimentData.hiddenLayers,
				acceptEdit:experimentData.readyForNetwork
			},
			predictProps: {
				datatypes:experimentData.datatypes,
				example:experimentData.example,
				predicted:experimentData.predicted,
				acceptEdit:true
			}
		};
	}
	
	private onChange() {
		this.setState(this.buildState());
	}
	
	private doTrain() {
		Actions.Experiment.CommitTraining();
	}
	
	public render():JSX.Element {
		var alertElement = this.state.message != null?<div className="alert">{this.state.message}</div>:null		
		var uploadElement = this.state.mapperProps.datatypes == null?<ExperimentComponent.FileUploadComponent/>:null;
		var mapperElement = this.state.mapperProps.datatypes != null?		
			<ExperimentComponent.DatatypeMapperTable {...this.state.mapperProps} />:null;
			
		var networkElement = this.state.networkProps.hiddenLayers != null?
			<ExperimentComponent.NetworkComponent {...this.state.networkProps}/>:null;

		var trainElement = this.state.readyForTraining?<input type="button" onClick={()=>this.doTrain()} value="Train..."/>:null;
		
		var predictElement = this.state.predictProps.example != null?
			<ExperimentComponent.PredictComponent {...this.state.predictProps}/>:null;
		
		return(<div className="col-xs-10">
		{alertElement}
		{uploadElement}
		{mapperElement}
		{networkElement}
		{trainElement}
		{predictElement}					
		</div>)
	}
	
}