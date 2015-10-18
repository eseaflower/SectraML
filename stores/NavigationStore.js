var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Base = require('./BaseStore');
var Actions = require('../actions/actions');
var ExperimentStore = require("./ExperimentStore");
var NavigationStore = (function (_super) {
    __extends(NavigationStore, _super);
    function NavigationStore() {
        var _this = this;
        _super.call(this);
        this.state = {
            navigationItems: [
                { name: "Create", active: true, enabled: true, actionType: Actions.Navigation.NAVIGATE_CREATE },
                { name: "Predict", active: false, enabled: false, actionType: Actions.Navigation.NAVIGATE_PREDICT }
            ]
        };
        this.dispatcher.register(Actions.Navigation.NAVIGATE_CREATE, function () { return _this.navigateCreate(); });
        this.dispatcher.register(Actions.Navigation.NAVIGATE_PREDICT, function () { return _this.navigatePredict(); });
        this.dispatcher.register(Actions.Experiment.TRAINING_COMPLETE, function () { return _this.trainingComplete(); });
    }
    NavigationStore.prototype.getState = function () {
        return $.extend({}, this.state);
    };
    NavigationStore.prototype.getActiveType = function () {
        for (var i = 0; i < this.state.navigationItems.length; i++) {
            if (this.state.navigationItems[i].active) {
                return this.state.navigationItems[i].name;
            }
        }
        return null;
    };
    NavigationStore.prototype.canNavigateTo = function (type) {
        for (var i = 0; i < this.state.navigationItems.length; i++) {
            if (this.state.navigationItems[i].name == type) {
                return this.state.navigationItems[i].enabled;
            }
        }
        return false;
    };
    NavigationStore.prototype.navigateTo = function (type) {
        if (this.canNavigateTo(type)) {
            for (var i = 0; i < this.state.navigationItems.length; i++) {
                if (this.state.navigationItems[i].name == type) {
                    this.state.navigationItems[i].active = true;
                }
                else {
                    this.state.navigationItems[i].active = false;
                }
            }
            this.emitChange();
        }
    };
    NavigationStore.prototype.enableType = function (type, enabled) {
        for (var i = 0; i < this.state.navigationItems.length; i++) {
            if (this.state.navigationItems[i].name == type) {
                this.state.navigationItems[i].enabled = enabled;
            }
        }
        this.emitChange();
    };
    NavigationStore.prototype.navigateCreate = function () {
        this.navigateTo("Create");
    };
    NavigationStore.prototype.navigatePredict = function () {
        this.navigateTo("Predict");
    };
    NavigationStore.prototype.trainingComplete = function () {
        this.waitFor(ExperimentStore.Instance);
        var experimentState = ExperimentStore.Instance.getState();
        if (experimentState.example != null) {
            this.enableType("Predict", true);
        }
    };
    return NavigationStore;
})(Base.BaseStore);
exports.NavigationStore = NavigationStore;
exports.Instance = new NavigationStore();
