/// <reference path="../typings/tsd.d.ts"/>
import React=require("react");
import Signin = require("./Signin");
import Sidebar = require("./Sidebar");
import Login = require("../stores/LoginStore")

class MainComponent extends React.Component<{},Login.ILoginState> {
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
		return <Signin.LoginForm 
		username={this.state.username}
		loginInProgress={this.state.loginInProgress}
		error={this.state.error}/> 
	}
	
} 

function buildMain():JSX.Element {	    
	return (<div className="container">      
      <div className="row">
        <div className="col-xs-3 col-xs-offset-4">
			<div className="page-header">
				<h1>Sectra ML</h1>
			</div>
			<MainComponent/>
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
		return <Sidebar.Sidebar items={this.state.navigationItems}/>
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