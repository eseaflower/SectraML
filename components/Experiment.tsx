/// <reference path="../typings/tsd.d.ts"/>
import React=require("react");
import Actions = require("../actions/actions")



export class FileUploadComponent extends React.Component<{}, {}> {

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

export interface IDatatypeMapperTableProps {	
	availableTypes:string[];
	datatypes:Actions.IDataType[];
	examples:string[][];
	acceptEdit:boolean;
}

class DatatypeMapperTable extends React.Component<IDatatypeMapperTableProps, {}> {
			
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
		if (this.props.acceptEdit) {
			var refId = this.getSelectRefName(column);			
			var component = this.refs[refId] as React.ClassicComponent<any, any>;
			var datatype = component.getDOMNode<HTMLSelectElement>().value;
			Actions.Experiment.DatatypeChanged({column:column, datatype:datatype});
		}
	}
	
	private getDatatypeSelect(dt:Actions.IDataType):JSX.Element {
		return (<select disabled={!this.props.acceptEdit} onChange={()=>this.valueChanged(dt.column)} ref={this.getSelectRefName(dt.column)} value={dt.datatype}>
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
	datatypeProps:IDatatypeMapperTableProps;
	acceptEdit:boolean;
}


export class Experiment extends React.Component<IExperimentProps, {}> {
		
	private handleCreateMapper() {
		if (this.props.acceptEdit) {
			Actions.Experiment.CommitDatatypes();
		}
	}
			
	public render():JSX.Element {
		return (<div className="table-responsive">
		<DatatypeMapperTable {...this.props.datatypeProps}/>
		<input type="button" disabled={!this.props.acceptEdit} value="Create.." onClick={() => this.handleCreateMapper()}/>
		</div>)		
	}
}