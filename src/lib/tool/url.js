define(function(require, exports, module) {

    var g = window;

    g[PagurianAlias].url = {
        getParameter: function(paramName) {
            var searchString = window.location.search.substring(1),
                i, val, params = searchString.split("&");

            for (i = 0; i < params.length; i++) {
                val = params[i].split("=");
                if (val[0] === paramName) {
                    return g[PagurianAlias].tool.decode(val[1]);
                }
            }
            return null;
        },
        getReferrer: function() {
            return document.referrer;
        },
        format: function(url) {
            if (!url) {
                return "";
            }
            if (url.substring(0, 4) !== "http") {
                url = "http://" + url;
            }
            return url;
        },


        forward: function(url) {
            setTimeout(function() {
                window.location.href = url;
            }, 1000);
            return this;
        },

        /**
         * [reload description]
         * @return {[type]} [description]
         */
        reload: function() {
            window.location.reload();
            return this;
        },
        /**
         * [convertParams Object To URL Params]
         * @param  {[Object]} params
         * @return {[String]}
         */
        convertParams: function(params) {
            var str_params = "",
                url_split = "";
            for (var i in params) {
                if (typeof params[i] !== "function") {

                    //如果是一个数组的，就设置多个值
                    if (typeof params[i] === "object") {
                        for (var j = 0; j < params[i].length; j++) {
                            str_params += url_split + i + "=" + encodeURIComponent(encodeURIComponent(params[i][j]));
                            url_split = "&";
                        }
                        continue;
                    }
                    str_params += url_split + i + "=" + encodeURIComponent(encodeURIComponent(params[i]));
                    url_split = "&";
                }
            }
            return str_params;
        },
        /**
         * Parsing URLs with the DOM
         * http://james.padolsey.com/javascript/parsing-urls-with-the-dom/
         */
        parse: function(url) {
            var a = document.createElement('a');
            a.href = url;
            return {
                source: url,
                protocol: a.protocol.replace(':', ''),
                host: a.hostname,
                port: a.port,
                query: a.search,
                params: (function() {
                    var ret = {},
                        seg = a.search.replace(/^\?/, '').split('&'),
                        len = seg.length,
                        i = 0,
                        s;
                    for (; i < len; i++) {
                        if (!seg[i]) {
                            continue;
                        }
                        s = seg[i].split('=');
                        ret[s[0]] = s[1];
                    }
                    return ret;
                })(),
                file: (a.pathname.match(/([^/?#]+)$/i) || [0, ''])[1],
                hash: a.hash.replace('#', ''),
                path: a.pathname.replace(/^([^/])/, '/$1'),
                relative: (a.href.match(/tps?:\/[^/]+(.+)/) || [0, ''])[1],
                segments: a.pathname.replace(/^\//, '').split('/')
            };
        }
    };

});
