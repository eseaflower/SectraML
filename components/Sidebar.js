var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
;
;
var NavigationItem = (function (_super) {
    __extends(NavigationItem, _super);
    function NavigationItem() {
        _super.apply(this, arguments);
    }
    NavigationItem.prototype.handleClick = function (event) {
        this.props.clickCallback(this.props);
    };
    NavigationItem.prototype.render = function () {
        var _this = this;
        return (React.createElement("li", {"className": this.props.active ? "active" : ""}, React.createElement("a", {"onClick": function (event) { return _this.handleClick(event); }, "href": this.props.url}, this.props.name)));
    };
    return NavigationItem;
})(React.Component);
;
var Sidebar = (function (_super) {
    __extends(Sidebar, _super);
    function Sidebar() {
        _super.apply(this, arguments);
    }
    Sidebar.prototype.render = function () {
        var navigationElements = this.props.items.map(function (item) { return React.createElement(NavigationItem, React.__spread({}, item)); });
        return (React.createElement("div", {"className": "col-xs-2 sidebar", "id": "navigation"}, "Navigation stuff", React.createElement("ul", {"className": "nav nav-sidebar"}, navigationElements)));
    };
    return Sidebar;
})(React.Component);
exports.Sidebar = Sidebar;
;
