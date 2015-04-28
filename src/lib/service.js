/*
 * @fileOverview app基础模块，所有的app模块继承该模块
 * @version 0.1
 *
 */
define(function(require, exports, module) {


    var ajax = require('./core/ajax');
    var service = {

        get: function(url, params, callback) {
            this.request("get", url, params, callback);
        },
        post: function(url, params, callback) {
            this.request("post", url, params, callback);
        },
        request: function(type, url, params, callback) {
            if (!validateRequest(params)) {
                return false;
            }

            ajax.request(type, url, params, function(resp) {

                var valid = validateRespone(resp);
                if (typeof callback === "function") {
                    callback(resp, valid);
                }

            });
        }
    }

    function validateRequest(data) {
        return true;
    }

    function validateRespone(data) {

        if (!data) {
            return false;
        }

        /**
        - 200000     操作成功
        - 200001     服务端验证-全局提示
        - 200002     服务端验证-字段验证
        - 200400     参数错误
        - 200404     该页面不存在
        - 200403     没有权限
        - 200403.11  没有权限：密码更改而导致无权查看
        - 200403.13  没有权限：管理员注销了当前用户
        - 200403.17  没有权限：session失效
        - 200403.18  没有权限：当前用户在别的终端登录，被注销
        - 100500     出现异常
        */
        switch (data.code) {
            case "200000":
                return true;
                break;
            case "200001":
                $p.ui.alert(data.message, "warning");
                return false;
                break;
            case "200002":

                var fields = data.fields;
                var element = {};
                for (var k in fields) {

                    element = $(".help-block[for^='" + k + "']");
                    element.removeClass("tip-block");
                    element.html(fields[k][0].message);

                }
                return false;
                break;
            case "200403":
                $p.ui.alert($p.locale.exception, "warning");
                return false;
                break;
            case "200403.11":
                $p.ui.alert($p.locale.exception, "warning");
                return false;
                break;
            case "200403.13":
                $p.ui.alert($p.locale.exception, "warning");
                return false;
                break;
            case "200403.17":
                $p.ui.alert($p.locale.exception, "warning");
                break;
            case "200403.18":
                $p.ui.alert($p.locale.exception, "warning");
                return false;
                break;
            case "200404":
                $p.ui.alert($p.locale.exception, "warning");
                return false;
                break;
            case 404:
                $p.ui.alert($p.locale.exception, "error");
                return false;
                break;
            case "100500":
                $p.ui.alert($p.locale.exception, "warning");
                return false;
                break;
            case 500:
                $p.ui.alert($p.locale.exception, "error");
                return false;
                break;
            case 400:
                $p.ui.alert($p.locale.params_error, "error");
                return false;
                break;
            case 0:
                $p.ui.alert($p.locale.exception, "warning");
                return false;
                break;
            default:
                return true;
        }

        return true;
    }

    module.exports = service;
});