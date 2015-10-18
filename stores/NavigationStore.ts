/// <reference path="../typings/tsd.d.ts"/>
import Base = require('./BaseStore') 
import Actions = require('../actions/actions')
import ExperimentStore = require("./ExperimentStore")

export interface INavigationItem {
	name:string;
	actionType:string;
	active:boolean;		
	enabled:boolean;
}

export interface INavigationStoreState {
	navigationItems:INavigationItem[];
}

export class NavigationStore extends Base.BaseStore {
	private state:INavigationStoreState;
	constructor() {
		super();
		this.state = {
			navigationItems:[
	  			{name : "Create",active:true, enabled:true, actionType:Actions.Navigation.NAVIGATE_CREATE},
	  			{name : "Predict",active:false, enabled:false, actionType:Actions.Navigation.NAVIGATE_PREDICT}
	  		]			
		}
		
		this.dispatcher.register(Actions.Navigation.NAVIGATE_CREATE, () => this.navigateCreate());
		this.dispatcher.register(Actions.Navigation.NAVIGATE_PREDICT, () => this.navigatePredict());				
		this.dispatcher.register(Actions.Experiment.TRAINING_COMPLETE, ()=> this.trainingComplete());	
	}
	public getState():INavigationStoreState {
		return $.extend({}, this.state);
	}	
	
	public getActiveType():string {
		for (var i =0;i<this.state.navigationItems.length;i++) {
			if (this.state.navigationItems[i].active) {
				return this.state.navigationItems[i].name;
			}
		}
		return null;	
	}
	
	private canNavigateTo(type:string):boolean {
		for (var i =0;i<this.state.navigationItems.length;i++) {
			if (this.state.navigationItems[i].name == type) {
				return this.state.navigationItems[i].enabled;
			}
		}		
		return false;
	}
	
	private navigateTo(type:string) {
		if (this.canNavigateTo(type)) {		
			for (var i =0;i<this.state.navigationItems.length;i++) {
				if (this.state.navigationItems[i].name == type) {
					this.state.navigationItems[i].active = true;
				} else {
					this.state.navigationItems[i].active = false;
				}
			}
			this.emitChange();		
		}
	}
	
	private enableType(type:string, enabled:boolean) {
		for (var i =0;i<this.state.navigationItems.length;i++) {
			if (this.state.navigationItems[i].name == type) {
				this.state.navigationItems[i].enabled = enabled;
			} 
		}
		this.emitChange();				
	}
	
	private navigateCreate() {
		this.navigateTo("Create");
	}
	private navigatePredict() {
		this.navigateTo("Predict");
	}

	private trainingComplete() {
		this.waitFor(ExperimentStore.Instance);
		var experimentState = ExperimentStore.Instance.getState()
		if (experimentState.example != null) {
			this.enableType("Predict", true);
		}
	}

}

export var Instance = new NavigationStore()