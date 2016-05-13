/**
 * @fileOverview Pagurian
 * @param  {Object}  GLOBAL  window
 * @param  {String}  NAME    Pagurian alias
 * @param  {Boolean} DEBUG
 */
(function(GLOBAL, NAME, DEBUG) {

    GLOBAL.PagurianAlias = NAME;

    var CONFIG = GLOBAL.CONFIG || {};
    var PROTOCOL = ("https:" === location.protocol) ? "https://" : "http://"; //协议
    var DOMAIN = location.hostname || "/"; //域名
    var PORT = location.port ? ":" + location.port : ""; //端口
    var PATH = CONFIG.rootPath || ""; //路径
    var URL = [PROTOCOL, DOMAIN, PORT, PATH].join(""); //完整URL

    var pagurian = {
        version: CONFIG.version || "1.6.2",
        language: CONFIG.language || "zh_CN", //简体中文:zh_CN , 英文:en_US
        debug: DEBUG,
        path: {
            api: URL + "/test/api/",
            app: URL + "/" + (DEBUG ? "src" : "dist") + "/"
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
            "jquery": "lib/vendor/jquery-1.11.3.min"
        },
        //对dist/modules目录下的文件添加版本号
        map: [
            [/^(.*\/dist\/modules\/.*\.(?:js))(?:.*)$/i, '$1?v=' + pagurian.version]
        ],
        preload: ["jquery"], //预加载
        charset: 'utf-8',
        timeout: 20000,
        debug: DEBUG
    });


    /**
     * 载入Seajs文件
     * @param  {String} name seajs
     * @param  {Docement Object} script
     * @param  {Docement Object} container
     */
    (function callSeajs(name, script, container) {

        if (GLOBAL[name]) {
            return;
        }

        script = document.createElement("script");
        script.src = pagurian.path.app + "lib/vendor/sea.js";
        script.charset = "utf-8";
        script.async = true;
        script.id = name + "node";

        container = document.getElementsByTagName("script")[0];
        container.parentNode.insertBefore(script, container);

    })("seajs");

    GLOBAL[NAME] = GLOBAL.pagurian = pagurian;

})(this, "$p", false);
