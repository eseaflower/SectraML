/// <reference path="../typings/tsd.d.ts"/>
import React=require("react");

export interface INavigationItemProps {
	id:number;
	name:string;
	url:string;
	active:boolean;
	clickCallback:(item:INavigationItemProps)=>void;		
};

export interface ISidebarProps {	
	items:INavigationItemProps[];	
};

class NavigationItem extends React.Component<INavigationItemProps, {}> {
	
	private handleClick(event:React.MouseEvent):void{
		this.props.clickCallback(this.props);
	}
	public render():JSX.Element {		
		return (<li className={this.props.active?"active":""}>
		<a onClick={(event:React.MouseEvent)=>this.handleClick(event)} href={this.props.url}>{this.props.name}</a></li>)	
	}	
};

export class Sidebar extends React.Component<ISidebarProps, {}> {
	public render():JSX.Element {
	  	var navigationElements = 
		  this.props.items.map((item:INavigationItemProps) => <NavigationItem {...item}/>)
		return (
		<div className="col-xs-2 sidebar" id="navigation">
			Navigation stuff			
       		<ul className="nav nav-sidebar">
				{navigationElements}
			</ul>
		</div>)
	}	
};
