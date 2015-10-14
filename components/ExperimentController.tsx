/// <reference path="../typings/tsd.d.ts"/>
import React=require("react");
import ExperimentStore = require("../stores/ExperimentStore")
import UserStore = require("../stores/UserStore")
import ExperimentComponent = require("./Experiment")
import Actions = require("../actions/actions")

export interface IExperimentControllerProps {
	Experiment:ExperimentStore.IExperimentStoreState;
	User:UserStore.IUserStoreState;
}

export class ExperimentController extends React.Component<{}, IExperimentControllerProps> {
	constructor(props?:{}, context?:any) {
		super(props, context);
		this.state = this.buildState();
		ExperimentStore.Instance.addChangeListener(() => this.onChange());
	}
	private buildState() {
		return {
			Experiment: ExperimentStore.Instance.getState(),
			User: UserStore.Instance.getState()
			};
	}
	
	private onChange() {
		this.setState(this.buildState());
	}
	
	public render():JSX.Element {
		var alertElement = this.state.Experiment.Message != null?<div className="alert">{this.state.Experiment.Message}</div>:null		
		return(<div>
		{alertElement}
		<ExperimentComponent.Experiment Columns={this.state.Experiment.Columns} Rows={this.state.Experiment.Rows} />
		</div>)
	}
	
}