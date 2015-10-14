var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Base = require('./BaseStore');
var Actions = require('../actions/actions');
var UserStore = (function (_super) {
    __extends(UserStore, _super);
    function UserStore() {
        var _this = this;
        _super.call(this);
        this.state = { UserId: null };
        this.dispatcher.register(Actions.User.USER_ID_SET, function (_) { return _this.SetUserId(_); });
    }
    UserStore.prototype.getState = function () {
        return $.extend({}, this.state);
    };
    UserStore.prototype.SetUserId = function (userId) {
        this.state.UserId = userId;
        this.emitChange();
    };
    return UserStore;
})(Base.BaseStore);
exports.Instance = new UserStore();
