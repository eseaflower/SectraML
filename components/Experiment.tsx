/// <reference path="../typings/tsd.d.ts"/>
import React=require("react");
import Actions = require("../actions/actions")



class FileUploadComponent extends React.Component<{}, {}> {

	private handleUpload() {
		var htmlComponent = this.refs["filename"] as React.ClassicComponent<any, any>;
		var value = htmlComponent.getDOMNode<HTMLInputElement>().files[0];		
		Actions.Upload.CommitUpload(value)
	}
	
	public render():JSX.Element {
		return (<div>
			<label>Data file</label><input className="wide" ref="filename" type="file"/>
			<input value="Upload..." type="button" onClick={() => this.handleUpload()}/>		
			</div>)		
	}	
}

export interface IDatatypeMapperProps {	
	availableTypes:string[];
	datatypes:Actions.IDataType[];
	examples:string[][];
}

class DatatypeMapper extends React.Component<IDatatypeMapperProps, {}> {
			
	private getColumnHeaders():JSX.Element[] {
		return this.props.datatypes.map(dt => <th>{dt.column}</th>);		
	}
	
	private getOptions():JSX.Element[] {
		return this.props.availableTypes.map(type => <option value={type}>{type}</option>);
	}
	
	private getSelectRefName(column:string) {
		return column +"_ref";
	}
	
	private valueChanged(column:string) {
		var refId = this.getSelectRefName(column);			
		var component = this.refs[refId] as React.ClassicComponent<any, any>;
		var datatype = component.getDOMNode<HTMLSelectElement>().value;
		Actions.Experiment.DatatypeChanged({column:column, datatype:datatype});
	}
	
	private getDatatypeSelect(dt:Actions.IDataType):JSX.Element {
		return (<select onChange={()=>this.valueChanged(dt.column)} ref={this.getSelectRefName(dt.column)} value={dt.datatype}>
			{this.getOptions()}
		</select>)				
	}
	private getColumnDatatypes():JSX.Element[] {
		return this.props.datatypes.map(dt => <td>{this.getDatatypeSelect(dt)}</td>);
	}
	private getExampleRow(row:string[]):JSX.Element {
		return <tr>{row.map(value => <td>{value}</td>)}</tr>;
	}
	private getExamples():JSX.Element[] {
		return this.props.examples.map(row => this.getExampleRow(row));
	}
		
	public render():JSX.Element {
		return (			
				<table className="table table-striped">
				<thead>
					<tr>
					{this.getColumnHeaders()}
					</tr>
					<tr>
					{this.getColumnDatatypes()}
					</tr>
				</thead>
				<tbody>
				{this.getExamples()}
				</tbody>
				</table>						
			)
	}	
}


export interface IExperimentProps {			
	showUpload:boolean;	
	datatypeProps:IDatatypeMapperProps;
}


export class Experiment extends React.Component<IExperimentProps, {}> {
		
	private handleCreateMapper() {
		Actions.Experiment.CommitDatatypes();
	}
			
	private getElement():JSX.Element {
		if (this.props.showUpload) {
			return <FileUploadComponent/>
		}
		return (<div className="table-responsive">
		<DatatypeMapper {...this.props.datatypeProps}/>
		<input type="button" value="Create.." onClick={() => this.handleCreateMapper()}/>
		</div>)		
	}
			
	public render():JSX.Element {
		return (			
			<div className="col-xs-10" id="experiment">
				{this.getElement()}				
			</div>
		)	
	}
}