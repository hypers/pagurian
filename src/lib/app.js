/*
 * @fileOverview app基础模块，所有的app模块继承该模块
 * @version 0.1
 *
 */
define(function(require, exports, module) {


    require('../plugins/bootstrap/js/bootstrap');
    require('../plugins/uniform/jquery.uniform');
    require('../plugins/jquery-cookie/jquery-cookie');
    require('../plugins/jquery-json/2.4/jquery-json');
    require('../plugins/moment/moment');

    require('./core/tpl');

    require('./com/form');
    require('./com/alert');
    require('./com/dialog');
    require('./com/select');

    require('./tool/tool');
    require('./tool/url');
    require('./tool/str');

    var layout = require('./core/layout');

    var locale = {};
    locale.zh_CN = require('../conf/locale.zh_CN');
    locale.en_US = require('../conf/locale.en_US');

    pagurian.locale = locale[pagurian.language];
    pagurian.lib = {
        service: require('./service'),
        api: require('../conf/api'),
        route: require('../conf/route')
    };

    pagurian.log = function() {
        if (!window.console) {
            return;
        }
        if (arguments.length == 1) {
            console.log(arguments[0]);
        }
        if (arguments.length == 2) {
            console[arguments[1]](arguments[0]);
        }
    };

    var app = {
        page: {},
        events: {},
        init: function() {

            //初始化页面布局
            layout.init();
            layout.custom();
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
