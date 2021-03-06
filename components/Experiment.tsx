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
				<input onChange={() => this.handleUpload()} ref="filename" type="file"/>
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


export interface IDatatypeProps {
	type:Actions.IDataType;
	availableTypes:string[];
	acceptEdit:boolean;
}

class DatatypeComponent extends React.Component<IDatatypeProps, {}> {
	private getOptions():JSX.Element[] {
		return this.props.availableTypes.map(type => <option value={type}>{type}</option>);
	}
	
	private valueChanged() {
		if (this.props.acceptEdit) {							
			var component = this.refs["selectedValue"] as React.ClassicComponent<any, any>;
			var datatype = component.getDOMNode<HTMLSelectElement>().value;
			Actions.Experiment.DatatypeChanged({column:this.props.type.column, datatype:datatype, custom:this.getCustomValues()});
		}	
	}

	private getDatatypeSelect():JSX.Element {
		return (<select className="form-control" disabled={!this.props.acceptEdit} onChange={()=>this.valueChanged()} ref="selectedValue" value={this.props.type.datatype}>
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
		<label className="control-label col-xs-2">Count:</label>
			<div className = "col-xs-3">
				<input className="form-control input-sm" disabled={!this.props.acceptEdit}  onChange={() => this.valueChanged()} ref="minCount" type="text" value={minCountValue}/>
			</div>
		<label className="control-label col-xs-2">Size:</label>
			<div className="col-xs-3">
				<input className="form-control input-sm" disabled={!this.props.acceptEdit} onChange={() => this.valueChanged()} ref="size" type="text" value={sizeValue}/>
			</div>
		</div> )
	}
	
	private getNumberElements():JSX.Element {
		var dimValue = this.props.type.custom["dim"];
		if (dimValue === undefined) {
			dimValue = "";			
		}
		return (<div><label className="control-label col-xs-2">Dim:</label>
			<div className = "col-xs-3">
				<input className="form-control input-sm" disabled={!this.props.acceptEdit} onChange={() => this.valueChanged()} ref="dim" type="text" value={dimValue}/> 
			</div>
		</div>)
	}
	
	private getLabelElements():JSX.Element {
		var filterValue = this.props.type.custom["filter"]
		if (filterValue === undefined) {
			filterValue = "";
		}
		return (<div>
			<label className="control-label col-xs-2">Filter:</label>
			<div className = "col-xs-3">
				<input className="form-control input-sm" disabled={!this.props.acceptEdit} onChange={() => this.valueChanged()} ref="filter" type="text" value={filterValue}/>
			</div>				
		</div>)
	}
	
	
	private getTypeSpecificElements():JSX.Element {
		switch (this.props.type.datatype) {
			case "BagOfItems":								
				return this.getBagOfItemsElements();
				break;
			case "BagOfShingles":								
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
			<div className="row form-group">
			<div className="col-xs-2">
			<strong>{this.props.type.column}</strong>
			</div>
			<div className="col-xs-3">
			{this.getDatatypeSelect()}
			</div>
			<div className="col-xs-7">
				<div className="row">
				{this.getTypeSpecificElements()}
				</div>
			</div>					
			</div>			
		)
	}
}


export interface IDatatypeMapperTableProps {	
	availableTypes:string[];
	datatypes:Actions.IDataType[];
	examples:string[][];
	acceptEdit:boolean;
}

export class DatatypeMapperTable extends React.Component<IDatatypeMapperTableProps, {}> {
	private handleCreateMapper() {
		if (this.props.acceptEdit) {
			Actions.Experiment.CommitDatatypes();
		}
	}
	
	private getDatatypes():JSX.Element[] {
		var result:JSX.Element[] = [];
		for (var i=0;i<this.props.datatypes.length;i++) {
			var dt = this.props.datatypes[i];
			if (this.props.acceptEdit || dt.datatype != "Ignore") {
				result.push(<DatatypeComponent type={dt} availableTypes={this.props.availableTypes} acceptEdit={this.props.acceptEdit}/>);		
			}
		}
		
		return result;
	}		
		
	public render():JSX.Element {
		var headers = this.props.datatypes.map(dt => dt.column);
		var createButton = this.props.acceptEdit?
			<input className="btn btn-primary" type="button" value="Create.." onClick={() => this.handleCreateMapper()}/>:null;
		return (<div>						
				<ExampleTableComponent headers={headers} examples={this.props.examples}/>
				<h4>Datatype mapping</h4>
				{this.getDatatypes()}				
				{createButton}	
				</div>
			)
	}	
}


export interface INetworkProps {
	hiddenLayers:number[];
	inputDimension:number;
	outputDimension:number;
	acceptEdit:boolean;
}


interface ILayerProps {
	count:number;
	onChange:()=>void;
}

class LayerComponent extends React.Component<ILayerProps, {}> {
		
	public render():JSX.Element {
		return (<div className="row">
		<div className="col-xs-1"><label>Nodes:</label></div>
		<div className="col-xs-1"><input onChange={() => this.props.onChange()} type="text"/></div>
		</div>)
	}
}

export class NetworkComponent extends React.Component<INetworkProps, {}> {
			
	private handleChange(index:number) {
		if (this.props.acceptEdit) {
			var refId = "l_"+index.toString();				
			var c = this.refs[refId] as React.ClassicComponent<any, any>;			 
			var value = c.getDOMNode<HTMLInputElement>().value;					
			var numValue = Number(value);	
			if (!isNaN(numValue)) {
				var copy:number[] = [...this.props.hiddenLayers];			
				copy[index] = numValue;
				Actions.Experiment.LayersChanged(copy);
			}	
		}
	}
	
	private getLayerElement(index:number):JSX.Element {
		var refId = "l_"+index.toString();
		var value = this.props.hiddenLayers[index].toString();
		return (<div className="row">
			<div className="col-xs-1"><label>Nodes:</label></div>
			<div className="col-xs-2"><input className="form-control" disabled={!this.props.acceptEdit} ref={refId} onChange={() => this.handleChange(index)} type="text" value={value} /></div>
		</div>);	
	}
	
	private getLayerElements():JSX.Element[] {
		var elements:JSX.Element[] = []
		if (this.props.hiddenLayers != null) {
			for (var i=0;i<this.props.hiddenLayers.length;i++) {				 
				elements.push(this.getLayerElement(i));								
			}
		}
		if (this.props.acceptEdit) {
			var addElement =(<div className="row"><div className="col-xs-offset-1 col-xs-1"><input className="btn btn-success" onClick={() => this.addLayer()} type="button" value="Add..."/></div></div>); 
			elements.push(addElement);
		}
		return elements;
	}
	
	private addLayer() {
		var copy = [...this.props.hiddenLayers];
		copy.push(0)			
		Actions.Experiment.LayersChanged(copy);	
	}
		
	private getInputLayer():JSX.Element {
		return (<div className="row">
			<div className="col-xs-1"><label>Input:</label></div>
			<div className="col-xs-1"><label>{this.props.inputDimension}</label></div>
		</div>)	
	}		
	private getOutputLayer():JSX.Element {
		return (<div className="row">
			<div className="col-xs-1"><label>Output:</label></div>
			<div className="col-xs-1"><label>{this.props.outputDimension}</label></div>
		</div>)	
	}		
		
	public render():JSX.Element {
		return (<div>			
			<h4>Network</h4>
			{this.getInputLayer()}
			{this.getLayerElements()}
			{this.getOutputLayer()}						
		</div>)
	}
}




export class TrainingSettingsComponent extends React.Component<Actions.ITrainingSettings, {}> {
	
	
	private handleChange() {
		var newSettings = this.getValues();
		Actions.Experiment.TrainingSettingsChanged(newSettings);
	}
		
	private getElementValue(id:string):string {
		var comp = this.refs[id] as React.ClassicComponent<any, any>;
		var result = null;
		if (comp != null) {
			result = comp.getDOMNode<HTMLInputElement>().value;
		}
		return result;
	}

		
	private getValues():Actions.ITrainingSettings {
		return {
			learningRate:this.getElementValue("lr"),
			regularization:this.getElementValue("reg"),
			epochsPerRun:this.getElementValue("eprun"),
			runs:this.getElementValue("run")
		}
	}	

	private safeToString(val:number) {
		if (val == null) {
			return "";
		}
		return val.toString();
	}

	public render():JSX.Element {
		return (<div>
			<div className="row">
			<label className="col-xs-2">Learning rate:</label><div className="col-xs-2">
				<input onChange={()=>this.handleChange()} ref="lr" className="form-control" value={this.props.learningRate}/></div>
			</div>
			<div className="row">
			<label className="col-xs-2">Regularization:</label><div className="col-xs-2">
				<input onChange={()=>this.handleChange()} ref="reg" className="form-control" value={this.props.regularization}/></div>
			</div>
			<div className="row">
			<label className="col-xs-2">Epochs/run:</label><div className="col-xs-2">
				<input onChange={()=>this.handleChange()} ref="eprun" className="form-control" value={this.props.epochsPerRun}/></div>
			</div>
			<div className="row">
			<label className="col-xs-2">Runs:</label><div className="col-xs-2">
				<input onChange={()=>this.handleChange()} ref="run" className="form-control" value={this.props.runs}/></div>
			</div>
		</div>
		)
	}
}




export interface IPredictProps {
	datatypes:Actions.IDataType[];
	example:{[key:string]:string};
	predicted:string;
	acceptEdit:boolean;
}
export class PredictComponent extends React.Component<IPredictProps, {}> {
	
	private getColumnHeaders():JSX.Element[] {
		var headers = this.getValidColumns().map(dt => <th>{dt.column}</th>);
		headers.push(<th>Predicted</th>);
		return headers;		
	}
	
	private exampleChanged(refId:string) {
		var c = this.refs[refId] as React.ClassicComponent<any, any>;			 
		var value = c.getDOMNode<HTMLInputElement>().value;					
		Actions.Experiment.ExampleChanged({column:refId, value:value});		
	}
	
	private getExample():JSX.Element[] {
		var cells = this.getValidColumns().map(dt => <td><input value={this.props.example[dt.column]} onChange={() => this.exampleChanged(dt.column)} ref={dt.column} type="text"/></td>)
		cells.push(<td>{this.props.predicted}</td>);
		return cells;
	}
	
	private getValidColumns():Actions.IDataType[] {
		var validColumns:Actions.IDataType[] = [];
		this.props.datatypes.map(dt =>{
			if (dt.datatype != "Ignore" && dt.datatype != "Label") {
				validColumns.push(dt);
			}
		});
		return validColumns;
	}
	
	private commitPredict() {
		Actions.Experiment.CommitPredict();
	}
	
	public render():JSX.Element {
		return (<div>
			<table className="table table-striped">
			<thead>
				<tr>
				{this.getColumnHeaders()}
				</tr>
			</thead>
			<tbody>
			{this.getExample()}
			</tbody>
			</table>
			<div className="row">
			<div className="col-xs-2">
			<input className="btn btn-primary" type="button" onClick={()=>this.commitPredict()} value="Predict..."/>
			</div>
			</div>
			</div>);								
		
	}
}
