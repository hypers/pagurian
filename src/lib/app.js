/*
 * @fileOverview app基础模块，所有的app模块继承该模块
 * @version 0.1
 */
define(function(require, exports, module) {

    //载入依赖
    require('./vendor/bootstrap/js/bootstrap');
    require('./vendor/uniform/jquery.uniform');
    require('./vendor/jquery-cookie/jquery-cookie');
    require('./vendor/jquery-json/2.4/jquery-json');
    require('./vendor/moment/moment');

    //载入基础UI
    require('./com/form');
    require('./com/alert');
    require('./com/dialog');
    require('./com/select');
    require('./com/checkboxes');

    //载入工具
    require('./tool/tool');
    require('./tool/url');
    require('./tool/str');

    //载入模板，载入页面布局
    require('./core/tpl');
    var layout = require('./core/layout');


    //载入国际化语言
    var locale = {
        zh_CN: require('../conf/locale.zh_CN'),
        en_US: require('../conf/locale.en_US')
    };
    pagurian.locale = locale[pagurian.language];


    pagurian.lib = {
        service: require('./service'),
        route: require('../conf/route')
    };

    //载入API配置
    var api = require('../conf/api');

    pagurian.lib.api = api.items || {};
    pagurian.lib.apiPostfix = api.postfix;

    //日志
    pagurian.log = function() {
        if (!window.console || !pagurian.debug) {
            return;
        }
        if (arguments.length === 1) {
            console.error(arguments[0]);
        }
        if (arguments.length === 2) {
            console[arguments[1]](arguments[0]);
        }
    };


    //module中的app父对象
    var app = {
        page: {},
        events: {},
        updateUniform: function() {
            layout.updateUniform();
        },
        activateCurrentMenu: function() {
            layout.activateCurrentMenu();
        },
        init: function() {

            //初始化页面布局
            layout.init();
            layout.custom();
            layout.activateCurrentMenu();
            layout.resize(function() {
                if (app.events.resize && "function" === typeof app.events.resize) {
                    app.events.resize();
                }
            });
        }
    };

    app.init();

    module.exports = app;
});
