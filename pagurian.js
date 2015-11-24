/**
 * @fileOverview Pagurian
 * @version 1.4
 * @param  {Object} global window
 * @param  {String} name   Pagurian alias
 * @param  {Boolean} debug
 */
(function(global, name, debug) {

    global.PagurianAlias = name;


    var CONFIG = global.CONFIG || {},
        location = global.location,
        //协议
        protocol = ("https:" == location.protocol) ? "https://" : "http://",
        //域名
        domain = location.hostname || "/",
        //端口
        port = location.port ? ":" + location.port : "",
        //路径
        path = CONFIG.rootPath || "/pagurian",
        //完整URL
        url = protocol + domain + port + path;


    /**
     * Pagurian
     * @type {Object}
     */
    var pagurian = {
        version: CONFIG.version || "1.4.10101147",
        language: CONFIG.language || "zh_CN", //简体中文:zh_CN , 英文:en_US
        util: {},
        com: {},
        plugin: {},
        path: {
            api: url + "/test/api/",
            app: url + "/" + (debug ? "src" : "dist") + "/"
        },
        call: function() {
            return (this.queue = this.queue || []).push(arguments);
        },
        set: function(key, value) {
            this[key] = value;
        }
    };

    /**
     * Seajs config
     */
    pagurian.call("config", {
        base: pagurian.path.app,
        alias: {
            "jquery": "lib/vendor/jquery.1.9.1.min",
        },
        //对dist/modules目录下的文件添加版本号
        map: [
            [/^(.*\/dist\/modules\/.*\.(?:js))(?:.*)$/i, '$1?v=' + pagurian.version]
        ],
        preload: ["jquery"], //预加载
        charset: 'utf-8',
        timeout: 20000,
        debug: debug
    });


    /**
     * 载入Seajs文件
     * @param  {String} o seajs
     * @param  {Docement Object} s Script
     * @param  {Docement Object} f Script
     */
    (function callSeajs(o, s, f) {

        if (global[o]) return;
        s = document.createElement("script");
        s.src = pagurian.path.app + "lib/vendor/sea.js";
        s.charset = "utf-8";
        s.async = true;
        s.id = o + "node";
        f = document.getElementsByTagName("script")[0];
        f.parentNode.insertBefore(s, f);

    })("seajs");

    global[name] = global.pagurian = pagurian;

})(this, "$p", true);
