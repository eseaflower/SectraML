/// <reference path="../typings/tsd.d.ts"/>
import React=require("react");
import Actions = require("../actions/actions")
import NavigationStore = require("../stores/NavigationStore")


export interface ISidebarState {	
	items:NavigationStore.INavigationItem[];	
};

class NavigationItem extends React.Component<NavigationStore.INavigationItem, {}> {
	
	private handleClick():void{
		Actions.Navigation.Navigate(this.props.actionType);
	}
	public render():JSX.Element {		
		var css = "";
		if (this.props.active) {
			css = "active";			
		} else if (!this.props.enabled) {
			css = "disabled"
		}
		return (<li className={css}>
		<a  onClick={()=>this.handleClick()} href="#">{this.props.name}</a></li>)	
	}	
};

export class Sidebar extends React.Component<{}, ISidebarState> {
	private changeEventHandler:()=>void; 		
	constructor(props?:{}, context?:any) {
		super(props, context);
		this.changeEventHandler = () => this.onChange(); 
		this.state = this.buildState();	
	}		 
	 private buildState():ISidebarState {
		 var storeState = NavigationStore.Instance.getState();
		 return {
			 items:storeState.navigationItems
		 }
	 }
	 
	 private componentDidMount() {
		// Attach to store.
		NavigationStore.Instance.addChangeListener(this.changeEventHandler);		
	}
	private componentWillUnmount() {
		// Detach from store.
		NavigationStore.Instance.removeChangeListener(this.changeEventHandler);
	}
	
	private onChange() {
		this.setState(this.buildState());
	}
	
	
	public render():JSX.Element {
	  	var navigationElements = 
		  this.state.items.map((item:NavigationStore.INavigationItem) => <NavigationItem {...item}/>)
		return (
		<div className="col-xs-2 sidebar" id="navigation">
			Mode			
       		<ul className="nav nav-sidebar">
				{navigationElements}
			</ul>
		</div>)
	}	
};
