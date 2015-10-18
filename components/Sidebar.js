var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var Actions = require("../actions/actions");
var NavigationStore = require("../stores/NavigationStore");
;
var NavigationItem = (function (_super) {
    __extends(NavigationItem, _super);
    function NavigationItem() {
        _super.apply(this, arguments);
    }
    NavigationItem.prototype.handleClick = function () {
        Actions.Navigation.Navigate(this.props.actionType);
    };
    NavigationItem.prototype.render = function () {
        var _this = this;
        var css = "";
        if (this.props.active) {
            css = "active";
        }
        else if (!this.props.enabled) {
            css = "disabled";
        }
        return (React.createElement("li", {"className": css}, React.createElement("a", {"onClick": function () { return _this.handleClick(); }, "href": "#"}, this.props.name)));
    };
    return NavigationItem;
})(React.Component);
;
var Sidebar = (function (_super) {
    __extends(Sidebar, _super);
    function Sidebar(props, context) {
        var _this = this;
        _super.call(this, props, context);
        this.changeEventHandler = function () { return _this.onChange(); };
        this.state = this.buildState();
    }
    Sidebar.prototype.buildState = function () {
        var storeState = NavigationStore.Instance.getState();
        return {
            items: storeState.navigationItems
        };
    };
    Sidebar.prototype.componentDidMount = function () {
        NavigationStore.Instance.addChangeListener(this.changeEventHandler);
    };
    Sidebar.prototype.componentWillUnmount = function () {
        NavigationStore.Instance.removeChangeListener(this.changeEventHandler);
    };
    Sidebar.prototype.onChange = function () {
        this.setState(this.buildState());
    };
    Sidebar.prototype.render = function () {
        var navigationElements = this.state.items.map(function (item) { return React.createElement(NavigationItem, React.__spread({}, item)); });
        return (React.createElement("div", {"className": "col-xs-2 sidebar", "id": "navigation"}, "Mode", React.createElement("ul", {"className": "nav nav-sidebar"}, navigationElements)));
    };
    return Sidebar;
})(React.Component);
exports.Sidebar = Sidebar;
;
