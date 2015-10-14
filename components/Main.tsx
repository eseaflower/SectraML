/// <reference path="../typings/tsd.d.ts"/>
import React=require("react");
import Login=require("./Login")
import Sidebar = require("./Sidebar");
import Experiment = require("./ExperimentController")
import Actions = require("../actions/actions")

function buildLogin():JSX.Element {	    
	return (<div className="container">      
      <div className="row">
        <div className="col-xs-3 col-xs-offset-4">
			<div className="page-header">
				<h1>Sectra ML</h1>
			</div>
			<Login.LoginComponent/>
		</div>
	  </div>
	</div>)
}

interface IUserMainState {		
	navigationItems:Sidebar.INavigationItemProps[];	
	activeItem:number;
}

class UserMainComponent extends React.Component<{}, IUserMainState> {
	constructor(props?:{}, context?:any) {
		super(props, context);
		this.state = {
			navigationItems:[
	  {id:0, name : "Overview",url:"#",active:true, clickCallback:(p:Sidebar.INavigationItemProps)=>this.handleNavigationClick(p)},
	  {id:1,name : "Second",url:"#",active:false, clickCallback:(p:Sidebar.INavigationItemProps)=>this.handleNavigationClick(p)},
	  {id:2,name : "Analytics",url:"#",active:false, clickCallback:(p:Sidebar.INavigationItemProps)=>this.handleNavigationClick(p)},
	  {id:3,name : "Export",url:"#",active:false, clickCallback:(p:Sidebar.INavigationItemProps)=>this.handleNavigationClick(p)},
	  ],
	  activeItem:0
		}		
	}
	private handleNavigationClick(item:Sidebar.INavigationItemProps){
		var newState = $.extend({}, this.state);
		newState.navigationItems[newState.activeItem].active = false;
		newState.navigationItems[item.id].active = true;
		newState.activeItem=item.id;
		this.setState(newState);
	}
	public render():JSX.Element {
		return (<div>      
      <Sidebar.Sidebar items={this.state.navigationItems}/>
      <Experiment.ExperimentController/>
      </div>)
	}
}


function buildUser(userId:number):JSX.Element {	
  return (<div className="container">
      <div className="row"><h1 className="page-header">User Workspace</h1></div>
	    <div className="row"><UserMainComponent/></div>	  
    </div>)    		
}

function mountAndRender(contentId:string, element:JSX.Element) {	
	var mount = document.getElementById(contentId);
	React.render(element, mount);	
}

export function login(contentId) {	
	mountAndRender(contentId, buildLogin());
}

export function user(contentId:string, userId:number) {
	mountAndRender(contentId, buildUser(userId));
	Actions.User.SetUserId(userId.toString());			
}