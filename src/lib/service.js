define(function(require, exports, module) {


    var ajax = require('./core/ajax');
    var transport = require('./core/transport');
    var validate = require('./core/validate');

    /**
     * 验证请求数据
     */
    function validateRequest(data) {
        if (!data) {
            return false;
        }
        return true;
    }

    /**
     * 追加参数
     * @param  {Object/Array} params 被追加的对象
     * @param  {Object} param  追加的对象
     * @return {Object}       被追加的对象
     */
    function appendParam(params, param) {
        var isEmpty = true;
        if ($.isPlainObject(params)) {
            params[param.name] = param.value;
            return params;
        }
        if ($.isArray(params)) {
            for (var i = 0; i < params.length; i++) {
                if (params[i].name === param.name) {
                    params[i].value = param.value;
                    isEmpty = false;
                }
            }
            if (isEmpty) {
                params.push(param);
            }
        }
        return params;
    }

    /**
     * 对参数值进行编码
     * @param  {Object} params 编码前的对象
     * @return {Object}        编码后的对象
     */
    function encodeValue(params) {

        if ($.isPlainObject(params)) {
            for (var key in params) {
                params[key] = encodeURIComponent(params[key]);
            }
            return params;
        }
        if ($.isArray(params)) {
            for (i = 0; i < params.length; i++) {
                params[i].value = encodeURIComponent(params[i].value);
            }
        }
        return params;
    }

    module.exports = {

        validateRespone: validate.validateCode,
        get: function(url, params, callback) {

            //设置语言
            appendParam(params, {
                name: "locale",
                value: $p.language
            });

            //设置随机参数
            appendParam(params, {
                name: "_ts",
                value: "_" + (Math.random() * 1E18).toString(36).slice(0, 5).toUpperCase()
            });

            //Encode 参数
            encodeValue(params);

            this.request("get", url, params, callback);
        },
        post: function(url, params, callback) {

            this.request("post", url, params, callback);
        },
        request: function(type, url, params, callback) {
            if (!validateRequest(params)) {
                return;
            }

            var data = transport.toObject(params);
            if ($.inArray(type, ["post", "put", "patch"]) > -1) {
                data = transport.toJSON(data);
            }

            ajax.request({
                "type": type,
                "url": url,
                "params": data
            }, function(response) {
                var valid = validate.validateCode(response.code);
                if ($.isFunction(callback)) {
                    callback(response, valid);
                }
            });

        }
    };

});
