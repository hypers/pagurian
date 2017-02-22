/**
 * Updated by hypers-godfery on 2015/1/6 添加isString方法
 */
define(function (require, exports, module) {

    var g = window;

    /**
     * @author {@link https://github.com/jashkenas/underscore underscorejs}.
     * @version 1.8.3
     * {@link https://github.com/jashkenas/underscore/blob/1.8.3/underscore.js#L1095 source}
     * @see {@link http://underscorejs.org/#isEqual underscore.isEqual(object, other)
     * @param a
     * @param b
     * @returns {boolean}
     */
    var eq = function (a, b, aStack, bStack) {
        function has(obj, key) {
            return obj !== null && Object.prototype.hasOwnProperty.call(obj, key);
        }

        var toString = Object.prototype.toString;
        // Identical objects are equal. `0 === -0`, but they aren't identical.
        // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
        if (a === b) return a !== 0 || 1 / a === 1 / b;
        // A strict comparison is necessary because `null == undefined`.
        if (a === null || b === null) return a === b;
        // Compare `[[Class]]` names.
        var className = toString.call(a);
        if (className !== toString.call(b)) return false;
        switch (className) {
            // Strings, numbers, regular expressions, dates, and booleans are compared by value.
            case '[object RegExp]':
            // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
            case '[object String]':
                // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
                // equivalent to `new String("5")`.
                return '' + a === '' + b;
            case '[object Number]':
                // `NaN`s are equivalent, but non-reflexive.
                // Object(NaN) is equivalent to NaN
                if (+a !== +a) return +b !== +b;
                // An `egal` comparison is performed for other numeric values.
                return +a === 0 ? 1 / +a === 1 / b : +a === +b;
            case '[object Date]':
            case '[object Boolean]':
                // Coerce dates and booleans to numeric primitive values. Dates are compared by their
                // millisecond representations. Note that invalid dates with millisecond representations
                // of `NaN` are not equivalent.
                return +a === +b;
        }

        var areArrays = className === '[object Array]';
        if (!areArrays) {
            if (typeof a !== 'object' || typeof b !== 'object') return false;

            // Objects with different constructors are not equivalent, but `Object`s or `Array`s
            // from different frames are.
            var aCtor = a.constructor, bCtor = b.constructor;
            if (aCtor !== bCtor && !($.isFunction(aCtor) && aCtor instanceof aCtor &&
                $.isFunction(bCtor) && bCtor instanceof bCtor) && ('constructor' in a && 'constructor' in b)) {
                return false;
            }
        }
        // Assume equality for cyclic structures. The algorithm for detecting cyclic
        // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

        // Initializing stack of traversed objects.
        // It's done here since we only need them for objects and arrays comparison.
        aStack = aStack || [];
        bStack = bStack || [];
        var length = aStack.length;
        while (length--) {
            // Linear search. Performance is inversely proportional to the number of
            // unique nested structures.
            if (aStack[length] === a) return bStack[length] === b;
        }

        // Add the first object to the stack of traversed objects.
        aStack.push(a);
        bStack.push(b);

        // Recursively compare objects and arrays.
        if (areArrays) {
            // Compare array lengths to determine if a deep comparison is necessary.
            length = a.length;
            if (length !== b.length) return false;
            // Deep compare the contents, ignoring non-numeric properties.
            while (length--) {
                if (!eq(a[length], b[length], aStack, bStack)) return false;
            }
        } else {
            // Deep compare objects.
            var keys = Object.keys(a), key;
            length = keys.length;
            // Ensure that both objects contain the same number of properties before comparing deep equality.
            if (Object.keys(b).length !== length) return false;
            while (length--) {
                // Deep compare each member
                key = keys[length];
                if (!(has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
            }
        }
        // Remove the first object from the stack of traversed objects.
        aStack.pop();
        bStack.pop();
        return true;
    };

    g[PagurianAlias].tool = {
        newId: function () {
            return '_' + (Math.random() * 1E18).toString(36).slice(0, 5).toUpperCase();
        },
        isArray: function (o) {
            return Object.prototype.toString.call(o) === "[object Array]";
        },
        isObject: function (o) {
            return Object.prototype.toString.call(o) === "[object Object]";
        },
        isNumber: function (value) {
            return /^[0-9]+.?[0-9]*$/.test(value);
        },
        isNull: function (o) {
            return Object.prototype.toString.call(o) === '[object Null]';
        },

        isFunction: function (o) {
            return typeof o === "function";
        },
        isString: function (o) {
            return Object.prototype.toString.call(o) === '[object String]';
        },
        /**
         *加码
         */
        encode: function (value) {
            return encodeURIComponent(value);
        },

        /**
         * 解码
         */
        decode: function (value) {
            return decodeURIComponent(value);
        },
        encodeHtml: function (str) {
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
        decodeHtml: function (str) {
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

        objectToUrlParams: function (params) {

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
        toDecimal: function (arg, num) {
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
        /**
         * 转千分位  1000.00 ==> 1,000.00
         **/
        toThousands: function (num) {
            return (num + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
        },
        formatTime: function (timestamp) {
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
        formatDateRange: function (daterange, type) {
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
        floatMul: function (arg1, arg2, sign) {

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
            } catch (e) {
            }
            try {
                m += s2.split(".")[1].length;
            } catch (e) {
            }

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
        throttle: function (func, wait, options) {
            var context, args, result;
            var timeout = null;
            var previous = 0;
            var _now = Date.now || function () {
                    return new Date().getTime();
                };
            if (!options) options = {};
            var later = function () {
                previous = options.leading === false ? 0 : _now();
                timeout = null;
                result = func.apply(context, args);
                if (!timeout) context = args = null;
            };
            return function () {
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
        debounce: function (func, wait, immediate) {

            var timeout, args, context, timestamp, result;

            var _now = Date.now || function () {
                    return new Date().getTime();
                };

            var later = function () {
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

            return function () {
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
        },
        // 判断两个值是否相等
        isEqual: function (a, b) {
            return eq(a, b);
        }
    };

});
