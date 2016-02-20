/*
 * @fileOverview app基础模块，所有的app模块继承该模块
 * @version 0.1
 *
 */
define(function(require, exports, module) {


    var ajax = require('./core/ajax');
    var service = {

        get: function(url, params, callback) {

            //设置语言
            if ($.isArray(params)) {
                var isSetLanguage = false;
                for (var i = 0; i < params.length; i++) {
                    if (params[i].name === "locale") {
                        params[i].value = $p.language;
                        isSetLanguage = true;
                    }
                }
                if (!isSetLanguage) {
                    params.push({
                        name: "locale",
                        value: $p.language
                    });
                }
            } else {
                params.locale = $p.language;
            }

            this.request("get", url, params, callback);
        },
        post: function(url, params, callback) {
            this.request("post", url, params, callback);
        },
        request: function(type, url, params, callback) {
            validateRequest(params);

            ajax.request(type, url, params, function(resp) {

                var valid = validateRespone(resp);
                if (typeof callback === "function") {
                    callback(resp, valid);
                }

            });
        }
    };

    function validateRequest(data) {
        return true;
    }

    function validateRespone(data) {

        if (!data) {
            return false;
        }

        switch (data.code) {
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

    service.validateRespone = validateRespone;

    module.exports = service;
});
