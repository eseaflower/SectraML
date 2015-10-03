var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var Actions = require("../actions/actions");
var LoginForm = (function (_super) {
    __extends(LoginForm, _super);
    function LoginForm() {
        _super.apply(this, arguments);
    }
    LoginForm.prototype.handleOnChange = function (elementName) {
        var htmlComponent = this.refs[elementName];
        var value = htmlComponent.getDOMNode().value;
        Actions.Login.UpdateUsername(value);
    };
    LoginForm.prototype.handleSubmit = function (event) {
        Actions.Login.LoginCommited();
        event.preventDefault();
    };
    LoginForm.prototype.render = function () {
        var _this = this;
        var alert = this.props.error != null ? React.createElement("div", {"className": "alert alert-danger alert-thin"}, this.props.error) : null;
        return (React.createElement("form", {"onSubmit": function (event) { return _this.handleSubmit(event); }}, React.createElement("input", {"type": "email", "onChange": function (event) { return _this.handleOnChange("usernameInput"); }, "ref": "usernameInput", "id": "usernameInput", "className": "form-control", "value": this.props.username, "disabled": this.props.loginInProgress, "placeholder": "Email address", "required": true}), alert, React.createElement("button", {"className": "btn btn-md btn-primary btn-block", "type": "submit"}, "Sign in")));
    };
    return LoginForm;
})(React.Component);
exports.LoginForm = LoginForm;
