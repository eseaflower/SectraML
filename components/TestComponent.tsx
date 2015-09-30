/// <reference path="../typings/tsd.d.ts"/>
import React=require("react");

export interface ILoginFormProps {
	username:string;
	loginInProgress:boolean;	
	onChanged: (new_value:string)=>void;
	onLogin: ()=>void;
};


export class LoginForm extends React.Component<ILoginFormProps, {}> {
	constructor(props?:ILoginFormProps, context?:any) {
		super(props, context);		
	}
	
	private handleOnChange(elementName:string):void {		
		var htmlComponent = this.refs[elementName] as React.ClassicComponent<any, any>;
		this.props.onChanged(htmlComponent.getDOMNode<HTMLInputElement>().value);
	}
	private handleSubmit(event:React.FormEvent):void {		
		this.props.onLogin();
		event.preventDefault();
	}
		
	public render() : JSX.Element {		
		return (
			<form onSubmit={(event:React.FormEvent) => this.handleSubmit(event)}>
				<input type="email" 
					onChange={(event:React.FormEvent) => this.handleOnChange("usernameInput") } 
					ref = "usernameInput"
					id="usernameInput" 
					className="form-control" 
					value={this.props.username}
					disabled={this.props.loginInProgress} 
					placeholder="Email address" required/>
				<label></label>
				<button className="btn btn-md btn-primary btn-block" type="submit">Sign in</button>			
			</form>
		);
	}		
};