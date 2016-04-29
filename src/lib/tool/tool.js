/**
 * Updated by hypers-godfery on 2015/1/6 添加isString方法
 */
define(function(require, exports, module) {

    var g = window;

    g[PagurianAlias].tool = {
        newId: function() {
            return '_' + (Math.random() * 1E18).toString(36).slice(0, 5).toUpperCase();
        },
        isArray: function(o) {
            return Object.prototype.toString.call(o) === "[object Array]";
        },
        isObject: function(o) {
            return Object.prototype.toString.call(o) === "[object Object]";
        },
        isNumber: function(value) {
            return /^[0-9]+$/.test(value);
        },
        isNull: function(o) {
            return Object.prototype.toString.call(o) === '[object Null]';
        },

        isFunction: function(o) {
            return typeof o === "function";
        },
        isString: function(o) {
            return Object.prototype.toString.call(o) === '[object String]';
        },
        /**
         *加码
         */
        encode: function(value) {
            return encodeURIComponent(value);
        },

        /**
         * 解码
         */
        decode: function(value) {
            return decodeURIComponent(value);
        },
        encodeHtml: function(str) {
            var s = "";
            if (str.length === 0) return "";
            s = str.replace(/&/g, "&amp;");
            s = s.replace(/</g, "&lt;");
            s = s.replace(/>/g, "&gt;");
            s = s.replace(/ /g, "&nbsp;");
            s = s.replace(/\'/g, "&#39;");
            s = s.replace(/\"/g, "&quot;");
            s = s.replace(/\n/g, "<br>");
            return s;
        },
        decodeHtml: function(str) {
            var s = "";
            if (!str || str.length === 0) return "";
            str += "";
            s = str.replace(/&amp;/g, "&");
            s = s.replace(/&lt;/g, "<");
            s = s.replace(/&gt;/g, ">");
            s = s.replace(/&nbsp;/g, " ");
            s = s.replace(/&#39;/g, "\'");
            s = s.replace(/&quot;/g, "\"");
            s = s.replace(/<br>/g, "\n");
            return s;
        },

        objectToUrlParams: function(params) {

            var str_params = "",
                url_split = "";
            for (var i in params) {
                if (typeof params[i] !== "function") {

                    //如果是一个数组的，就设置多个值
                    if (typeof params[i] === "object") {
                        for (var j = 0; j < params[i].length; j++) {
                            str_params += url_split + i + "=" + this.encode(this.encode(params[i][j]));
                            url_split = "&";
                        }
                        continue;
                    }
                    str_params += url_split + i + "=" + this.encode(this.encode(params[i]));
                    url_split = "&";
                }
            }
            return str_params;
        },

        /**
         * 转Decimal格式
         **/
        toDecimal: function(arg, num) {
            if ($p.tool.isNull(arg) || arg === undefined || arg === "--") {
                return "--";
            }

            if (!arg || arg === "--") {
                return "0.00";
            }

            try {
                return arg.toFixed(num || 2);
            } catch (e) {
                return arg;
            }

            return arg;
        },
        formatTime: function(timestamp) {
            if ($p.tool.isNull(timestamp)) {
                return "--";
            }
            if (!timestamp) {
                return "00:00:00";
            }
            var ss = Math.round(timestamp);
            if (!ss) {
                return "00:00:00";
            }
            var t3 = ss % 60;
            var t2 = parseInt(ss / 60);
            var t1 = 0;
            if (t2 >= 60) {
                t1 = parseInt(t2 / 60);
                t2 = t2 % 60;
            }
            return (t1 < 10 ? "0" + t1 : t1) + ":" + (t2 < 10 ? "0" + t2 : t2) + ":" + (t3 < 10 ? "0" + t3 : t3);
        },
        /**
         * [formatDateRange 根据单位时间类型，格式化时间]
         * @param  {[string]} daterange [时间范围　例如：2014-07-15 00:00:00 ~ 2014-07-15 23:59:59]
         * @param  {[string]} type [单位时间类型:HOUR,DAY,WEEK,MONTH]
         * @return {[string]}           [返回格式化后的时间]
         */
        formatDateRange: function(daterange, type) {
            var times = daterange.split("~");
            switch (type) {
                case 'HOUR':
                    return moment(times[0]).format("YYYY-MM-DD HH:mm:ss");
                case 'DAY':
                    return moment(times[0]).format("YYYY-MM-DD");
                case 'WEEK':
                    return moment(times[0]).format("YYYY-MM-DD") + " ~ " + moment(times[1]).format("YYYY-MM-DD");
                case 'MONTH':
                    return moment(times[0]).format("YYYY-MM");
                default:
                    return "";
            }
        },
        /**
         *浮点数相乘
         **/
        floatMul: function(arg1, arg2, sign) {

            if ($p.tool.isNull(arg1)) {
                return "--";
            }

            if (!arg1 || !arg2) {
                return "0.00";
            }

            var m = 0,
                s1 = arg1.toString(),
                s2 = arg2.toString();

            try {
                m += s1.split(".")[1].length;
            } catch (e) {}
            try {
                m += s2.split(".")[1].length;
            } catch (e) {}

            var n = Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
            return $p.tool.toDecimal(n) + sign;

        },
        /**
         * @author {@link https://github.com/jashkenas/underscore underscorejs}.
         * @version 1.7.0
         * @see {@link http://underscorejs.org/#throttle underscore.throttle(function, wait, [immediate])}
         * @param func
         * @param wait
         * @param options
         * @returns {throttled}
         */
        throttle: function(func, wait, options) {
            var context, args, result;
            var timeout = null;
            var previous = 0;
            var _now = Date.now || function() {
                return new Date().getTime();
            };
            if (!options) options = {};
            var later = function() {
                previous = options.leading === false ? 0 : _now();
                timeout = null;
                result = func.apply(context, args);
                if (!timeout) context = args = null;
            };
            return function() {
                var now = _now();
                if (!previous && options.leading === false) previous = now;
                var remaining = wait - (now - previous);
                context = this;
                args = arguments;
                if (remaining <= 0 || remaining > wait) {
                    if (timeout) {
                        clearTimeout(timeout);
                        timeout = null;
                    }
                    previous = now;
                    result = func.apply(context, args);
                    if (!timeout) context = args = null;
                } else if (!timeout && options.trailing !== false) {
                    timeout = setTimeout(later, remaining);
                }
                return result;
            };
        },

        /**
         * @author {@link https://github.com/jashkenas/underscore underscorejs}.
         * @version 1.7.0
         * @see {@link http://underscorejs.org/#debounce underscore.debounce(function, wait, [immediate])}
         * @param func
         * @param wait
         * @param immediate
         * @returns {*}
         */
        debounce: function(func, wait, immediate) {

            var timeout, args, context, timestamp, result;

            var _now = Date.now || function() {
                return new Date().getTime();
            };

            var later = function() {
                var last = _now() - timestamp;
                if (last < wait && last >= 0) {
                    timeout = setTimeout(later, wait - last);
                } else {
                    timeout = null;
                    if (!immediate) {
                        result = func.apply(context, args);
                        if (!timeout) context = args = null;
                    }
                }
            };

            return function() {
                context = this;
                args = arguments;
                timestamp = _now();
                var callNow = immediate && !timeout;
                if (!timeout) timeout = setTimeout(later, wait);
                if (callNow) {
                    result = func.apply(context, args);
                    context = args = null;
                }
                return result;
            };
        }
    };

});
