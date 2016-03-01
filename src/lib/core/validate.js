define(function(require, exports, module) {

    function handleServerCheck(code) {

        var postfix = ((code + "").match(/\.\d*/)[0] || "").substr(1);
        $p.alert($p.locale.handle_exception, "warning");
        $p.url.forward(CONFIG.ctxPath() + "/" + $p.lib.api.urls[error + (postfix ? "_" + postfix : "")]);
        return false;
    }

    function checkFields(data) {
        var fields = data.fields;
        var element = {};
        for (var k in fields) {
            element = $(".help-block[for^='" + k + "']");
            element.removeClass("tip-block");
            element.html(fields[k][0].message);
        }
        return false;
    }

    module.exports = {

        check: function(data) {
            var code = data.code;
            switch (true) {
                case /200000/.test(code):
                    return true;
                case /200001/.test(code):
                    $p.alert(data.message, "warning");
                    return false;
                case /200002/.test(code):
                    return checkFields(data);
                case /200403/.test(code):
                    return handleServerCheck(code);
                case /100\d/.test(code):
                    $p.alert($p.locale.handle_exception, "error");
                    return false;
                case code === 0:
                    if (data.result && data.result.statusText === "timeout") {
                        $p.alert($p.locale.handle_timeout, "error");
                        return false;
                    }
                    $p.alert($p.locale.handle_exception, "error");
                    return false;
                case /400/.test(code):
                    $p.alert($p.locale.params_error, "error");
                    return false;
                case /404/.test(code):
                    $p.alert($p.locale.handle_exception, "error");
                    return false;
                case code === 405:
                    $p.alert($p.locale.handle_exception, "error");
                    return false;
                case code === 500:
                    $p.alert($p.locale.handle_exception, "error");
                    return false;
                default:
                    return true;
            }

            return true;
        }

    };
});
