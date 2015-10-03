var AjaxHelper = (function () {
    function AjaxHelper() {
    }
    AjaxHelper.prototype.post = function (url, data) {
        var serialized = JSON.stringify(data);
        var deferredHandle = $.post(url, { args: serialized });
        return deferredHandle;
    };
    return AjaxHelper;
})();
exports.AjaxHelper = AjaxHelper;
var TypedXHR = (function () {
    function TypedXHR(wrapped) {
        this.wrapped = wrapped;
    }
    TypedXHR.prototype.asXHR = function () {
        return this.wrapped;
    };
    TypedXHR.prototype.done = function (callback) {
        return new TypedXHR(this.wrapped.done(function (data, textStatus, jqXHR) {
            var deserialized = null;
            if (data !== null) {
                deserialized = JSON.parse(data);
            }
            callback(deserialized, textStatus, jqXHR);
        }));
    };
    TypedXHR.prototype.fail = function (callback) {
        return new TypedXHR(this.wrapped.fail(callback));
    };
    TypedXHR.prototype.always = function (callback) {
        return new TypedXHR(this.wrapped.always(callback));
    };
    return TypedXHR;
})();
exports.TypedXHR = TypedXHR;
function postJson(url, data) {
    return new TypedXHR(new AjaxHelper().post(url, data));
}
exports.postJson = postJson;
