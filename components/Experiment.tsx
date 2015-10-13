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
		Actions.Upload.ComitUpload(value)
	}

	private getUploadComponents():JSX.Element {
		return (<div>
			<label>Data file</label><input className="wide" ref="filename" type="file"/>
			<input value="Upload..." type="button" onClick={() => this.handleUpload()}/>		
			</div>)
	}
	private getColumnComponents():JSX.Element {		
		var columnHeaderElements = this.props.Columns.map((name:string) => <th>{name}</th>);
    var examples = this.props.Rows.map((row) => <tr>{row.map((item) => <td>{item}</td>)}</tr>);
    return (
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                {columnHeaderElements}
                </tr>
              </thead>
              <tbody>
              {examples}
              </tbody>
            </table>
          </div>
		)
	}
	public render():JSX.Element {
		var elements = this.props.Columns == null ? this.getUploadComponents():this.getColumnComponents();
		return (			
			<div className="col-xs-10" id="experiment">
				{elements}				
			</div>
		)	
	}
}