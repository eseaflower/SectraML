/// <reference path="../typings/tsd.d.ts"/>
import React=require("react");
import Login = require("../stores/LoginStore")
import Actions = require("../actions/actions")

export interface ILoginFormProps {
	username:string;
	loginInProgress:boolean;
	error:string;	
}


export class LoginForm extends React.Component<ILoginFormProps, {}> {	
	private handleOnChange(elementName:string):void {		
		var htmlComponent = this.refs[elementName] as React.ClassicComponent<any, any>;
		var value = htmlComponent.getDOMNode<HTMLInputElement>().value;
		Actions.Login.UpdateUsername(value);		
	}
	private handleSubmit(event:React.FormEvent):void {		
		Actions.Login.LoginCommited();
		event.preventDefault();
	}
		
	public render() : JSX.Element {		
		var alert = this.props.error!=null?<div className="alert alert-danger alert-thin">{this.props.error}</div>:null; 
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
				{alert}
				<button className="btn btn-md btn-primary btn-block" type="submit">Sign in</button>			
			</form>
		);
	}		
}

export class LoginComponent extends React.Component<{},Login.ILoginState> {
	// Store the event handler instance!
	private changeEventHandler:()=>void;
	constructor(props?:{}, context?:any) {
		super(props, context);
		this.state = Login.Instance.getState();		
		this.changeEventHandler = () => this.onStoreChange();
	}
	
	private componentDidMount() {
		// Attach to store.
		Login.Instance.addChangeListener(this.changeEventHandler);		
	}
	private componentWillUnmount() {
		// Detach from store.
		Login.Instance.removeChangeListener(this.changeEventHandler);
	}
	
	private onStoreChange() {
		this.setState(Login.Instance.getState());
	}		
					
	public render():JSX.Element {
		return <LoginForm 
		username={this.state.username}
		loginInProgress={this.state.loginInProgress}
		error={this.state.error}/> 
	}
	
} 
