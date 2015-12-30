/*
 * @fileOverview Service 模块,提供为api提供ajax方法
 * @author <a href="http://www.guoxiaoming.com">simon guo</a>
 * @version 0.1
 *
 */
define(function(require, exports, module) {




    function arrayToObject(arr) {

        if ($.isPlainObject(arr)) {
            return arr;
        }

        var obj = {},
            format_obj = {};

        for (var i = 0; i < arr.length; i++) {
            if (obj[arr[i].name]) {
                var _t = obj[arr[i].name];
                if (!$.isArray(obj[arr[i].name])) {
                    obj[arr[i].name] = [_t];
                }
                obj[arr[i].name].push(arr[i].value);
                continue;
            }
            if (arr[i].type === "array") {
                obj[arr[i].name] = [arr[i].value];
                continue;
            }
            obj[arr[i].name] = arr[i].value;
        }

        for (var k in obj) {

            //把"带有."的属性名转化为对象
            var a = k.split(".");
            var _value = obj[k];
            if (typeof _value === "string") {
                _value = $.trim(_value);
            }

            if (a.length > 1) {

                if ($.isArray(_value)) {

                    format_obj[a[0]] = format_obj[a[0]] || [];

                    for (var j = 0, _v; j < _value.length; j++) {
                        _v = {};
                        _v[a[1]] = _value[j];
                        format_obj[a[0]].push(_v);
                    }

                    continue;
                }

                format_obj[a[0]] = format_obj[a[0]] || {};
                format_obj[a[0]][a[1]] = _value;

                continue;
            }
            format_obj[k] = _value;
        }

        return format_obj;

    }



    var ajax = {
        bundle: true,
        options: {
            data: []
        },
        init: function(type, params) {

            var i;
            this.options.data = [];

            if ($.isArray(params)) {

                for (i = 0; i < params.length; i++) {
                    if (type === "get") {
                        params[i].value = encodeURIComponent(params[i].value);
                    }
                    this.options.data.push(params[i]);
                }

            } else {

                for (i in params) {

                    if (typeof params[i] === "function") {
                        continue;
                    }

                    //如果是一个数组的，就设置多个值
                    if ($.isArray(params[i])) {
                        for (var j = 0; j < params[i].length; j++) {
                            this.options.data.push({
                                "name": i,
                                "value": (type === "get") ? encodeURIComponent(params[i][j]) : params[i][j]
                            });
                        }
                        continue;
                    }

                    this.options.data.push({
                        name: i,
                        value: (type === "get") ? encodeURIComponent(params[i]) : params[i]
                    });
                }
            }

            if (type === "get") {
                this.options.data.push({
                    name: "_ts",
                    value: "_" + (Math.random() * 1E18).toString(36).slice(0, 5).toUpperCase()
                });
            }

            return this;

        },
        send: function(type, url, params, callback) {

            this.init(type, params);

            var data = this.options.data;
            var options = {
                url: pagurian.path.api + url + ".json",
                type: type || "get",
                dataType: "json",
                data: data,
                timeout: 30000,
                success: function(data, textStatus, jqXHR) {
                    if ($.isFunction(callback)) {
                        callback(data, textStatus, jqXHR);
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {

                    //TODO: 处理status， http status code，超时 408
                    //注意：如果发生了错误，错误信息（第二个参数）除了得到null之外，还可能
                    //是"timeout", "error", "notmodified" 和 "parsererror"
                    //alert(textStatus + ":" + XMLHttpRequest.status);

                    var data = {
                        error: true
                    };
                    for (var v in jqXHR) {
                        if (!$.isFunction(jqXHR[v])) {
                            data[v] = jqXHR[v];
                        }
                    }

                    if ($.isFunction(callback)) {
                        callback({
                            code: jqXHR.status,
                            result: data
                        });
                    }
                }
            };

            if (this.bundle) {
                options.contentType = "application/json";
                if ($.inArray(type, ["post", "put", "patch"]) > -1) {
                    data = $.toJSON({
                        data: arrayToObject(data)
                    });
                }

            }

            if (type === "delete") {
                var split = "?",
                    p = "";
                for (var i = 0; i < data.length; i++) {
                    p += split + data[i].name + "=" + data[i].value;
                    split = "&";
                }

                if (p) {
                    options.url += p;
                }
            }

            options.data = data;

            $.ajax(options);

            return this;

        },
        request: function(type, url, params, callback) {
            this.send(type, url, params, callback);
            return this;
        }
    };

    module.exports = ajax;

});
