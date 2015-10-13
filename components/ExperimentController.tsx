/// <reference path="../typings/tsd.d.ts"/>
import React=require("react");
import ExperimentStore = require("../stores/ExperimentStore")
import ExperimentComponent = require("./Experiment")
import Actions = require("../actions/actions")


export class ExperimentController extends React.Component<{}, ExperimentStore.IExperimentStoreState> {
	constructor(props?:{}, context?:any) {
		super(props, context);
		this.state = ExperimentStore.Instance.getState();
		ExperimentStore.Instance.addChangeListener(() => this.onChange());
	}
	
	private onChange() {
		this.setState(ExperimentStore.Instance.getState());
	}
	
	public render():JSX.Element {
		return(<div>
		<div className="alert">{this.state.Message}</div>
		<ExperimentComponent.Experiment Columns={this.state.Columns} Rows={this.state.Rows} />
		</div>)
	}
	
}