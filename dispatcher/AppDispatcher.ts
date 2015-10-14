/// <reference path="../typings/tsd.d.ts"/>

import flux = require('flux')

export var Dispatcher = new flux.Dispatcher<Action>();

export interface Action {
	type:string;
	data:any;
}

export class TableDispatcher {
	private isRegistered:boolean;
	private dispatchTable:{[key:string]:(a)=>void};
	private id:string;
	constructor() {
		this.isRegistered = false;
		this.dispatchTable = {};
		this.id = null;				
	}
	
	public waitFor(other:TableDispatcher) {
		if (other.isRegistered) {
			Dispatcher.waitFor([other.id]);
		}
	}
	
	public register<U>(type:string, callback:(arg:U)=>void):void {
		this.dispatchTable[type] = callback;
		this.startDispatching(); 					
	}
	
	public unregister(type:string) {
		delete this.dispatchTable[type];
		if (Object.keys(this.dispatchTable).length <= 0) {
			this.endDispatching();
		}
	}
	
	private startDispatching() {
		if (!this.isRegistered) {
			this.id = Dispatcher.register((p) => this.dispatch(p));
			this.isRegistered = true;
		}
	}
	
	private endDispatching() {
		if (this.isRegistered) {
			Dispatcher.unregister(this.id);
			this.id = null;
			this.isRegistered = false;
		}
	}
	
	private dispatch(action:Action) {
		var typed = this.dispatchTable[action.type];
		if (typed != null) {
			typed(action.data);
		}
	}
}
