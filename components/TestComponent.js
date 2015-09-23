var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
;
var Test = (function (_super) {
    __extends(Test, _super);
    function Test() {
        _super.apply(this, arguments);
    }
    Test.prototype.render = function () {
        return (React.createElement("h2", null, this.props.who));
    };
    return Test;
})(React.Component);
exports.Test = Test;
;
;
;
var LoginForm = (function (_super) {
    __extends(LoginForm, _super);
    function LoginForm(props, context) {
        _super.call(this, props, context);
        this.state = { login_name: this.props.login_name };
    }
    LoginForm.prototype.handleOnChange = function (event) {
        var ugly = event.target;
        this.setState({ login_name: ugly.value });
    };
    LoginForm.prototype.render = function () {
        var _this = this;
        return (React.createElement("form", null, React.createElement("input", {"type": "email", "onChange": function (event) { return _this.handleOnChange(event); }, "id": "inputEmail", "className": "form-control", "value": this.state.login_name, "placeholder": "Email address", "required": true}), React.createElement("label", null), React.createElement("button", {"className": "btn btn-md btn-primary btn-block", "type": "submit"}, "Sign in")));
    };
    return LoginForm;
})(React.Component);
exports.LoginForm = LoginForm;
;
