define(function(require, exports, module) {

    var g = window;

    g[PagurianAlias].tool = {
        getQueryString: function(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"),
                r = window.location.search.substr(1).match(reg);
            if (r !== null) {
                return unescape(r[2]);
            }
            return null;
        },
        getReferrer: function() {
            var ref;
            try {
                ref = G.top.document.referrer;
            } catch (e) {
                log(e);

                try {
                    ref = G.parent.document.referrer;
                } catch (ex) {
                    log(ex);
                    ref = document.referrer;
                }
            }
            return ref;
        },
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
         *浮点数相乘
         **/
        floatMul: function(arg1, arg2) {

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
            return this.toDecimal(n);

        }
    };

});
