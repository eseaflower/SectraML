/// <reference path="../typings/tsd.d.ts"/>

import AppDispatcher = require('../dispatcher/AppDispatcher')
import EventEmitter = require('eventemitter3')


export class BaseStore extends EventEmitter {
	protected dispatcher:AppDispatcher.TableDispatcher;
	constructor() {
		super();								
		this.dispatcher = new AppDispatcher.TableDispatcher();					
	}
}