/// <reference path="../typings/tsd.d.ts"/>
import React=require("react");

export interface ITestProps {
	who:string;		
};


export class Test extends React.Component<ITestProps, any> {
	render() {						
		return(<h2>{this.props.who}</h2>)
	}		
};

export interface ILoginFormProps {
	login_name:string;	
};
interface ILoginFormState {
	login_name:string;
};


export class LoginForm extends React.Component<ILoginFormProps, ILoginFormState> {
	constructor(props?:ILoginFormProps, context?:any) {
		super(props, context);
		this.state = {login_name: this.props.login_name};
	}
	
	private handleOnChange(event:React.FormEvent):void {		
		var ugly = event.target as any;
		this.setState({login_name: ugly.value});
	}
	
	public render() : JSX.Element {		
		return (
			<form>
				<input type="email" 
					onChange={(event:React.FormEvent) => this.handleOnChange(event)} 
					id="inputEmail" 
					className="form-control" 
					value={this.state.login_name} 
					placeholder="Email address" required/>
				<label></label>
				<button className="btn btn-md btn-primary btn-block" type="submit">Sign in</button>			
			</form>
		);
	}		
};