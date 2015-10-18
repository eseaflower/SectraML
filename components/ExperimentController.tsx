/// <reference path="../typings/tsd.d.ts"/>
import React=require("react");
import ExperimentStore = require("../stores/ExperimentStore")
import UserStore = require("../stores/UserStore")
import NavigationStore = require("../stores/NavigationStore")
import ExperimentComponent = require("./Experiment")
import Actions = require("../actions/actions")

export interface IExperimentControllerState {
	mapperProps:ExperimentComponent.IDatatypeMapperTableProps;
	networkProps:ExperimentComponent.INetworkProps;
	message:string;
	predictProps:ExperimentComponent.IPredictProps;
	readyForTraining:boolean;	
	readyForMapping:boolean;
	readyForNetwork:boolean;
	mode:string;

}

export class ExperimentController extends React.Component<{}, IExperimentControllerState> {
	private changeEventHandler:()=>void;
	constructor(props?:{}, context?:any) {
		super(props, context);
		this.state = this.buildState();	
		this.changeEventHandler = () => this.onChange();
	}
    private componentDidMount() {
		// Attach to store.
		ExperimentStore.Instance.addChangeListener(this.changeEventHandler);
		NavigationStore.Instance.addChangeListener(this.changeEventHandler);		
	}
	private componentWillUnmount() {
		// Detach from store.
		ExperimentStore.Instance.removeChangeListener(this.changeEventHandler);
		NavigationStore.Instance.removeChangeListener(this.changeEventHandler);
	}

	private buildState():IExperimentControllerState {
		var experimentData =ExperimentStore.Instance.getState();									
		return {
			mode:NavigationStore.Instance.getActiveType(),
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
				acceptEdit:experimentData.readyForNetwork,
				inputDimension:experimentData.inputDimension,
				outputDimension:experimentData.outputDimension
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
	
	private getCreateElement():JSX.Element {
		if (this.state.mode != "Create") {
			return null;
		}
		var uploadElement = this.state.mapperProps.datatypes == null?<ExperimentComponent.FileUploadComponent/>:null;
		var mapperElement = this.state.mapperProps.datatypes != null?		
			<ExperimentComponent.DatatypeMapperTable {...this.state.mapperProps} />:null;
			
		var networkElement = this.state.networkProps.hiddenLayers != null?
			<ExperimentComponent.NetworkComponent {...this.state.networkProps}/>:null;

		var trainElement = this.state.readyForTraining?<input className="btn btn-primary" type="button" onClick={()=>this.doTrain()} value="Train..."/>:null;
		return (<div>
			{uploadElement}
			{mapperElement}
			{networkElement}
			{trainElement}		
			{this.getAlertElement()}
		</div>) 		
	}
	private getPredictElement():JSX.Element {
		if (this.state.mode != "Predict") {
			return null;
		}
		var predictElement = this.state.predictProps.example != null?
			<ExperimentComponent.PredictComponent {...this.state.predictProps}/>:null;
		return (<div>{predictElement}</div>)	
	}
	private getAlertElement():JSX.Element {
		return this.state.message != null?<div className="alert alert-info">{this.state.message}</div>:null											
	}
	public render():JSX.Element {
		return(<div className="col-xs-10">				
		{this.getCreateElement()}
		{this.getPredictElement()}							
		</div>)
	}
	
}