/**
 * @fileOverview Pagurian
 * @version 1.3
 * @param  {Object} global window
 * @param  {String} name   Pagurian alias
 * @param  {Boolean} debug
 */
(function(global, name, debug) {

    global.PagurianAlias = name;

    var CONFIG = global.CONFIG || {};
    var prot = ("https:" == document.location.protocol) ? "https://" : "http://";
    var domain = window.location.hostname || "/";


    /**
     * Pagurian
     * @type {Object}
     */
    var pagurian = {
        version: CONFIG.version || "1.4.0",
        language: CONFIG.language || "en", //简体中文:zh_cn , 英文:en
        util: {},
        com: {},
        plugin: {},
        path: {
            api: prot + domain + "/",
            app: prot + domain + "/" + (debug ? "src" : "dist") + "/"
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
        map: [
            [/^(.*\/dist\/modules\/.*\.(?:js))(?:.*)$/i, '$1?v=' + pagurian.version]
        ],
        preload: ["jquery"], //预加载
        charset: 'utf-8',
        timeout: 20000,
        debug: false
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
