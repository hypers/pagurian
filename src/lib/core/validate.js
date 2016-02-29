define(function(require, exports, module) {

    module.exports = {

        validateCode: function(code) {

            switch (code) {
                case "200000":
                    return true;
                case "200001":
                    $p.alert(data.message, "warning");
                    return false;
                case "200002":

                    var fields = data.fields;
                    var element = {};
                    for (var k in fields) {
                        element = $(".help-block[for^='" + k + "']");
                        element.removeClass("tip-block");
                        element.html(fields[k][0].message);
                    }
                    return false;
                case "200403":
                    $p.alert($p.locale.handle_exception, "warning");
                    $p.url.forward(CONFIG.ctxPath() + "/" + $p.lib.api.urls.error403);
                    return false;

                case "200403.11":
                    $p.alert($p.locale.handle_exception, "warning");
                    $p.url.forward(CONFIG.ctxPath() + "/" + $p.lib.api.urls.error403_11);
                    return false;

                case "200403.13":
                    $p.alert($p.locale.handle_exception, "warning");
                    $p.url.forward(CONFIG.ctxPath() + "/" + $p.lib.api.urls.error403_13);
                    return false;

                case "200403.17":
                    window.location.reload();
                    break;
                case "200403.18":
                    $p.alert($p.locale.handle_exception, "warning");
                    $p.url.forward(CONFIG.ctxPath() + "/" + $p.lib.api.urls.error403_18);
                    return false;

                case "200404":
                    $p.alert($p.locale.handle_exception, "warning");
                    $p.url.forward(CONFIG.ctxPath() + "/" + $p.lib.api.urls.error404);
                    return false;

                case 404:
                    $p.alert($p.locale.handle_exception, "error");
                    return false;

                case "100500":
                    $p.alert($p.locale.handle_exception, "warning");
                    return false;
                case 500:
                    $p.alert($p.locale.handle_exception, "error");
                    return false;
                case 405:
                    $p.alert($p.locale.handle_exception, "error");
                    return false;
                case 400:
                    $p.alert($p.locale.params_error, "error");
                    return false;

                case 0:
                    if (data.result && data.result.statusText === "timeout") {
                        $p.alert($p.locale.handle_timeout, "error");
                        return false;
                    }
                    $p.alert($p.locale.handle_exception, "error");
                    return false;

                default:
                    return true;
            }

            return true;
        }

    };
});
