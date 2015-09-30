var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
;
var LoginForm = (function (_super) {
    __extends(LoginForm, _super);
    function LoginForm(props, context) {
        _super.call(this, props, context);
    }
    LoginForm.prototype.handleOnChange = function (elementName) {
        var htmlComponent = this.refs[elementName];
        this.props.onChanged(htmlComponent.getDOMNode().value);
    };
    LoginForm.prototype.handleSubmit = function (event) {
        this.props.onLogin();
        event.preventDefault();
    };
    LoginForm.prototype.render = function () {
        var _this = this;
        return (React.createElement("form", {"onSubmit": function (event) { return _this.handleSubmit(event); }}, React.createElement("input", {"type": "email", "onChange": function (event) { return _this.handleOnChange("usernameInput"); }, "ref": "usernameInput", "id": "usernameInput", "className": "form-control", "value": this.props.username, "disabled": this.props.loginInProgress, "placeholder": "Email address", "required": true}), React.createElement("label", null), React.createElement("button", {"className": "btn btn-md btn-primary btn-block", "type": "submit"}, "Sign in")));
    };
    return LoginForm;
})(React.Component);
exports.LoginForm = LoginForm;
;
