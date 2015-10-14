/// <reference path="../typings/tsd.d.ts"/>
import React=require("react");
import Actions = require("../actions/actions")

export interface IExperimentProps {		
	Columns:string[];
	Rows:string[][];
}

export class Experiment extends React.Component<IExperimentProps, {}> {
	
	private handleUpload() {
		var htmlComponent = this.refs["filename"] as React.ClassicComponent<any, any>;
		var value = htmlComponent.getDOMNode<HTMLInputElement>().files[0];		
		Actions.Upload.CommitUpload(value)
	}
	
	private handleCreateMapper() {
		var columnDesc = this.props.Columns.map((item) => {
			var refId = this.getSelectRefName(item);			
			var component = this.refs[refId] as React.ClassicComponent<any, any>;
			var dataType = component.getDOMNode<HTMLSelectElement>().value; 			
			return {Column:item, Datatype:dataType};
		});				
		Actions.Experiment.CommitDatatypes(columnDesc);
	}

	private getUploadComponents():JSX.Element {
		return (<div>
			<label>Data file</label><input className="wide" ref="filename" type="file"/>
			<input value="Upload..." type="button" onClick={() => this.handleUpload()}/>		
			</div>)
	}
	private getSelectRefName(name:string) {
		return name +"_ref";
	}
	private getDataTypeSelect(name:string):JSX.Element {
		return (<select ref={this.getSelectRefName(name)}>
			<option value="Ignore">Ignore</option>
			<option value="BagOfItems">Bag of items</option>
			<option value="Raw">Raw</option>			
			<option value="Label">Label</option>
		</select>)		
		
	}
		
	private getTableComponents():JSX.Element {		
		var columnHeaderNames = this.props.Columns.map((name:string) => <th>{name}</th>);
		var columnHeaderTypes = this.props.Columns.map((name:string) => <th>{this.getDataTypeSelect(name)}</th>);
		var examples = this.props.Rows.map((row) => <tr>{row.map((item) => <td>{item}</td>)}</tr>);
		return (
			<div className="table-responsive">
				<table className="table table-striped">
				<thead>
					<tr>
					{columnHeaderNames}
					</tr>
					<tr>
					{columnHeaderTypes}
					</tr>
				</thead>
				<tbody>
				{examples}
				</tbody>
				</table>
				<input type="button" value="Create.." onClick={() => this.handleCreateMapper()}/>
			</div>
			)
	}
	public render():JSX.Element {
		var elements = this.props.Columns == null ? this.getUploadComponents():this.getTableComponents();
		return (			
			<div className="col-xs-10" id="experiment">
				{elements}				
			</div>
		)	
	}
}