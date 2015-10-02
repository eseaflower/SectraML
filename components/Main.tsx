/// <reference path="../typings/tsd.d.ts"/>
/// <reference path="./TestComponent.tsx"/>
import React=require("react");
import test = require("./TestComponent");
import AjaxJson = require("./AjaxJson");
import sidebar = require("./Sidebar");

interface IMainState {
	username:string;
	loginInProgress:boolean;	
}

interface IUser {
	userId:number;
	redirectUrl:string;
}

class MainComponent extends React.Component<{},IMainState> {
	constructor(props?:{}, context?:any) {
		super(props, context);
		this.state = {username:"a@b", loginInProgress:false};		
	}
	private copyState():IMainState {
		return {
			username:this.state.username,
			loginInProgress:this.state.loginInProgress			
		}
	}
	
	private handleChange(value:string):void {				
		var newState = this.copyState();
		newState.username = value;
		this.setState(newState);
	}
	
	private onLoggedIn(data:any) {
		var newState = this.copyState();
		newState.loginInProgress = false;
		this.setState(newState);
	}
	
	private handleLogin():void {			
		var handle = AjaxJson.postJson<IUser>("/login", {"username":this.state.username});
		handle.done((data:IUser, status:string)=>{			
			window.location.replace(data.redirectUrl);
		}).fail((xhr:JQueryXHR, status:string, err:Error) => {			
			alert(["Login failed:",xhr.status.toString(),xhr.statusText].join(' '));
			var newState = this.copyState()
			newState.loginInProgress = false;
			this.setState(newState);			
		});
		
		var newState = this.copyState();
		newState.loginInProgress = true;		
		this.setState(newState);
	}
	
	public render():JSX.Element {
		return <test.LoginForm 
		onChanged={(value:string) => this.handleChange(value)}
		onLogin={() => this.handleLogin()}
		username={this.state.username}
		loginInProgress={this.state.loginInProgress}/> 
	}
	
} 

function buildMain():JSX.Element {	    
	return (<div className="container">      
      <div className="row">
        <div className="col-xs-3 col-xs-offset-3">
			<div className="page-header">
				<h1>Sectra ML</h1>
			</div>
			<MainComponent/>
		</div>
	  </div>
	</div>)
}

interface IUserMainState {		
	navigationItems:sidebar.INavigationItemProps[];	
	activeItem:number;
}

class UserMainComponent extends React.Component<{}, IUserMainState> {
	constructor(props?:{}, context?:any) {
		super(props, context);
		this.state = {
			navigationItems:[
	  {id:0, name : "Overview",url:"#",active:true, clickCallback:(p:sidebar.INavigationItemProps)=>this.handleNavigationClick(p)},
	  {id:1,name : "Second",url:"#",active:false, clickCallback:(p:sidebar.INavigationItemProps)=>this.handleNavigationClick(p)},
	  {id:2,name : "Analytics",url:"#",active:false, clickCallback:(p:sidebar.INavigationItemProps)=>this.handleNavigationClick(p)},
	  {id:3,name : "Export",url:"#",active:false, clickCallback:(p:sidebar.INavigationItemProps)=>this.handleNavigationClick(p)},
	  ],
	  activeItem:0
		}		
	}
	private handleNavigationClick(item:sidebar.INavigationItemProps){
		var newState = $.extend({}, this.state);
		newState.navigationItems[newState.activeItem].active = false;
		newState.navigationItems[item.id].active = true;
		newState.activeItem=item.id;
		this.setState(newState);
	}
	public render():JSX.Element {
		return <sidebar.Sidebar items={this.state.navigationItems}/>
	}
}


function buildUser(userId:number):JSX.Element {	
  return (<div className="container">
      <div className="row"><h1 className="page-header">User Workspace</h1></div>
	  <div className="row">
		  <UserMainComponent/>	  		
		  <div className="col-xs-10" id="mainWorkspace">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Header</th>
                  <th>Header</th>
                  <th>Header</th>
                  <th>Header</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1,001</td>
                  <td>Lorem</td>
                  <td>ipsum</td>
                  <td>dolor</td>
                  <td>sit</td>
                </tr>
                <tr>
                  <td>1,002</td>
                  <td>amet</td>
                  <td>consectetur</td>
                  <td>adipiscing</td>
                  <td>elit</td>
                </tr>
                <tr>
                  <td>1,003</td>
                  <td>Integer</td>
                  <td>nec</td>
                  <td>odio</td>
                  <td>Praesent</td>
                </tr>
              </tbody>
            </table>
          </div>
		</div>
	  </div>
    </div>)    		
}

function mountAndRender(contentId:string, element:JSX.Element) {	
	var mount = document.getElementById(contentId);
	React.render(element, mount);	
}

export function entry(contentId) {	
	mountAndRender(contentId, buildMain());
}

export function user(contentId:string, userId:number) {
	mountAndRender(contentId, buildUser(userId));		
}