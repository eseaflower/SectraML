/// <reference path="../typings/tsd.d.ts"/>
import Base = require('./BaseStore') 
import Actions = require('../actions/actions')


export interface IUserStoreState {
	UserId:string;
}

class UserStore extends Base.BaseStore {
	private state:IUserStoreState;
	constructor() {
		super();
		this.state = {UserId:null};
		this.dispatcher.register<string>(Actions.User.USER_ID_SET, (_)=>this.SetUserId(_));
	}

	public getState():IUserStoreState {
		return $.extend({}, this.state);
	}

	public SetUserId(userId:string) {
		this.state.UserId = userId;
		this.emitChange();
	}
}

export var Instance = new UserStore()