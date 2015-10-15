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

interface IExampleTableProps{
	headers:string[];
	examples:string[][];
}

class ExampleTableComponent extends React.Component<IExampleTableProps, {}>{
	private getColumnHeaders():JSX.Element[] {
		return this.props.headers.map(header => <th>{header}</th>);		
	}

	private getExampleRow(row:string[]):JSX.Element {
		return <tr>{row.map(value => <td>{value}</td>)}</tr>;
	}
	private getExamples():JSX.Element[] {
		return this.props.examples.map(row => this.getExampleRow(row));
	}
	
	public render():JSX.Element {
		return (<table className="table table-striped">
			<thead>
				<tr>
				{this.getColumnHeaders()}
				</tr>
			</thead>
			<tbody>
			{this.getExamples()}
			</tbody>
			</table>);								
	}
}


export interface IDatatypeMapperTableProps {	
	availableTypes:string[];
	datatypes:Actions.IDataType[];
	examples:string[][];
	acceptEdit:boolean;
}


export interface IDatatypeProps {
	type:Actions.IDataType;
	availableTypes:string[];
}

class DatatypeComponent extends React.Component<IDatatypeProps, {}> {
	private getOptions():JSX.Element[] {
		return this.props.availableTypes.map(type => <option value={type}>{type}</option>);
	}
	
	private valueChanged() {							
		var component = this.refs["selectedValue"] as React.ClassicComponent<any, any>;
		var datatype = component.getDOMNode<HTMLSelectElement>().value;
		Actions.Experiment.DatatypeChanged({column:this.props.type.column, datatype:datatype, custom:this.getCustomValues()});	
	}

	private getDatatypeSelect():JSX.Element {
		return (<select onChange={()=>this.valueChanged()} ref="selectedValue" value={this.props.type.datatype}>
			{this.getOptions()}
		</select>)				
	}
	
	private getElementValue(id:string):string {
		var comp = this.refs[id] as React.ClassicComponent<any, any>;
		var value = null;
		if (comp != null) {
			value = comp.getDOMNode<HTMLInputElement>().value;
		}
		return value;
	}
	
	private getCustomValues():{[key:string]:string} {
		var custom:{[key:string]:string}={};
		var value = this.getElementValue("minCount");
		if (value != null) {
			custom["minCount"] = value;
		}
		value = this.getElementValue("size");
		if (value != null) {
			custom["size"] = value;
		}
		value = this.getElementValue("dim");
		if (value != null) {
			custom["dim"] = value;
		}
		value = this.getElementValue("filter");
		if (value != null) {
			custom["filter"] = value;
		}
		
		return custom;
	}
	
	private getBagOfItemsElements():JSX.Element {
		var minCountValue = this.props.type.custom["minCount"];
		var sizeValue = this.props.type.custom["size"];		
		if (minCountValue === undefined) {
			minCountValue = "";
		}
		if (sizeValue === undefined) {
			sizeValue = "";
		}
		return (<div>
		<label>Min count:</label><input className="thin" onChange={() => this.valueChanged()} ref="minCount" type="text" value={minCountValue}/>
		<label>Size:</label><input className="thin" onChange={() => this.valueChanged()} ref="size" type="text" value={sizeValue}/>
		</div> )
	}
	
	private getNumberElements():JSX.Element {
		var dimValue = this.props.type.custom["dim"];
		if (dimValue === undefined) {
			dimValue = "";			
		}
		return (<div><label>Dim:</label><input className="thin" onChange={() => this.valueChanged()} ref="dim" type="text" value={dimValue}/> </div>)
	}
	
	private getLabelElements():JSX.Element {
		var filterValue = this.props.type.custom["filter"]
		if (filterValue === undefined) {
			filterValue = "";
		}
		return (<div><label>Filter:</label><input className="thin" onChange={() => this.valueChanged()} ref="filter" type="text" value={filterValue}/></div>)
	}
	
	
	private getTypeSpecificElements():JSX.Element {
		switch (this.props.type.datatype) {
			case "BagOfItems":								
				return this.getBagOfItemsElements();
				break;
			case "Number":
				return this.getNumberElements();
				break;
			case "Label":
				return this.getLabelElements();
				break;
			default:
				break;
		}
		return null;
	}
	
	public render():JSX.Element {
		return (
			<div className="row">
			<div className="col-xs-2">
			<strong>{this.props.type.column}</strong>
			</div>
			<div className="col-xs-2">
			{this.getDatatypeSelect()}
			</div>
			<div className="col-xs-8">
				{this.getTypeSpecificElements()}
			</div>					
			</div>			
		)
	}
}



class DatatypeMapperTable extends React.Component<IDatatypeMapperTableProps, {}> {
	
	private getDatatypes():JSX.Element[] {
		return this.props.datatypes.map(dt => <DatatypeComponent type={dt} availableTypes={this.props.availableTypes} />)
	}		
		
	public render():JSX.Element {
		var headers = this.props.datatypes.map(dt => dt.column);
		return (<div>						
				<ExampleTableComponent headers={headers} examples={this.props.examples}/>
				{this.getDatatypes()}				
				</div>
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
		return (<div>
		<DatatypeMapperTable {...this.props.datatypeProps}/>
		<input type="button" disabled={!this.props.acceptEdit} value="Create.." onClick={() => this.handleCreateMapper()}/>
		</div>)		
	}
}