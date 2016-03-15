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
            $p.log("url is undefined");
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
            options.params = filterParams(arguments[1]);
            options.callback = arguments[2];
            return options;
        }

        options.type = arguments[0];
        options.url = arguments[1];
        options.params = filterParams(arguments[2]);
        options.callback = arguments[3];


        return options;
    }

    //过滤请求参数
    function filterParams(params) {
        var data = $.isArray(params) ? [] : {};

        function push(key, value) {
            if ($.isArray(data)) {
                data.push({
                    name: key,
                    value: value
                });
                return data;
            }
            return (data[key] = value);
        }

        $.each(params, function(index, value) {
            if ($.isPlainObject(value)) {
                push(value.name, value.value);
            } else if (!$.isFunction(value)) {
                push(index, value);
            }
        });

        return data;
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
     * 请求数据
     */
    function requestDate(options) {

        if (!validateRequest(options)) {
            return false;
        }
        if ($.inArray(options.type, ["post", "put", "patch"]) > -1) {

            if (!options.original) {
                options.params = transport.toObject(options.params);
            }
            if (options.bundle) {
                options.contentType = "application/json";
                options.params = transport.toJSON(options.params);
            }
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

            //Encode
            options.params=$.param(params, true);
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
