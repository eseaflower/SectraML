/// <reference path="../typings/tsd.d.ts"/>

import AppDispatcher = require('../dispatcher/AppDispatcher')
import EventEmitter = require('eventemitter3')

export var Events = {
	Change : "Change"
};


export class BaseStore extends EventEmitter {
	protected dispatcher:AppDispatcher.TableDispatcher;
	constructor() {
		super();								
		this.dispatcher = new AppDispatcher.TableDispatcher();					
	}
	public addChangeListener(callback:()=>void) {
		this.on(Events.Change, callback);
	}
	public removeChangeListener(callback:()=>void) {
		this.removeListener(Events.Change, callback);
	}
	protected emitChange() {
		this.emit(Events.Change);
	}

}