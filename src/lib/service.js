define(function(require, exports, module) {


    var ajax = require('./core/ajax');
    var transport = require('./core/transport');
    var validate = require('./core/validate');

    /**
     * 验证请求数据
     */
    function validateRequest(options) {

        if ($.inArray(options.type, ["get", "delete", "post", "put", "patch"]) === -1) {
            $p.log("type is undefined");
            return false;
        }

        if (!options.url) {
            $p.log("type is undefined");
            return false;
        }

        if (!options.params) {
            $p.log("params is undefined");
            return false;
        }
        return true;
    }

    function getOptions() {

        var options = {
            original: false,
            bundle: true
        };


        if (arguments.length === 1 && $.isPlainObject(arguments[0])) {
            return $.extend(options, arguments[0]);
        }
        if (arguments.length === 3) {
            options.url = arguments[0];
            options.params = arguments[1];
            options.callback = arguments[2];
            return options;
        }

        options.type = arguments[0];
        options.url = arguments[1];
        options.params = arguments[2];
        options.callback = arguments[3];


        return options;
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


    /**
     * 请求数据
     */
    function requestDate(options) {

        if (!validateRequest(options)) {
            return false;
        }

        if (!options.original) {
            options.params = transport.toObject(options.params);
        }

        if (options.bundle && $.inArray(options.type, ["post", "put", "patch"]) > -1) {
            options.contentType = "application/json";
            options.params = transport.toJSON(options.params);
        }

        ajax.request(options, function(response) {
            var valid = validate.check(response);
            if ($.isFunction(options.callback)) {
                options.callback(response, valid);
            }
        });
    }

    module.exports = {
        validateRespone: function(respone) {
            return validate.check(respone);
        },
        get: function(url, params, callback) {

            var options = getOptions.apply(this, arguments);

            //设置语言
            appendParam(options.params, {
                name: "locale",
                value: $p.language
            });

            //设置随机参数
            appendParam(options.params, {
                name: "_ts",
                value: "_" + (Math.random() * 1E18).toString(36).slice(0, 5)
            });

            //Encode 参数
            encodeValue(options.params);
            options.type = "get";
            requestDate(options);

        },
        post: function(url, params, callback) {
            var options = getOptions.apply(this, arguments);
            options.type = "post";
            requestDate(options);
        },
        request: function(type, url, params, callback) {
            var options = getOptions.apply(this, arguments);
            requestDate(options);
        }
    };

});
