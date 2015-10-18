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

function buildUser(userId:number):JSX.Element {	
  return (<div className="container">
      <div className="row"><h1 className="page-header">User Workspace</h1></div>
	    <div className="row">      
		<Sidebar.Sidebar/>
      	<Experiment.ExperimentController/>
	  </div>	  
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