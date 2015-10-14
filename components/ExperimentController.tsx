/// <reference path="../typings/tsd.d.ts"/>
import React=require("react");
import ExperimentStore = require("../stores/ExperimentStore")
import UserStore = require("../stores/UserStore")
import ExperimentComponent = require("./Experiment")
import Actions = require("../actions/actions")

export interface IExperimentControllerProps {
	mapperProps:ExperimentComponent.IDatatypeMapperProps;
	message:string;
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
			mapperProps: {
				availableTypes:experimentData.availableTypes,
				examples: experimentData.examples,
				datatypes:experimentData.datatypes
			}
		};
	}
	
	private onChange() {
		this.setState(this.buildState());
	}
	
	public render():JSX.Element {
		var alertElement = this.state.message != null?<div className="alert">{this.state.message}</div>:null		
		var showUpload = this.state.mapperProps.datatypes == null;
		return(<div>
		{alertElement}
		<ExperimentComponent.Experiment showUpload={showUpload} datatypeProps={this.state.mapperProps} />
		</div>)
	}
	
}