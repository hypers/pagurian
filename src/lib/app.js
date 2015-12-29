/*
 * @fileOverview app基础模块，所有的app模块继承该模块
 * @version 0.1
 *
 */
define(function(require, exports, module) {

    //载入依赖的基础插件
    require('../plugins/bootstrap/js/bootstrap');
    require('../plugins/uniform/jquery.uniform');
    require('../plugins/jquery-cookie/jquery-cookie');
    require('../plugins/jquery-json/2.4/jquery-json');
    require('../plugins/moment/moment');

    //载入基础UI
    require('./com/form');
    require('./com/alert');
    require('./com/dialog');
    require('./com/select');

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
        api: require('../conf/api'),
        route: require('../conf/route')
    };

    //日志
    pagurian.log = function() {
        if (!window.console || !pagurian.debug) {
            return;
        }
        if (arguments.length === 1) {
            console.log(arguments[0]);
        }
        if (arguments.length === 2) {
            console[arguments[1]](arguments[0]);
        }
    };

    /**
     * 兼容1.5以前的版本
     */
    function compatible() {

        pagurian.com = {
            alert: pagurian.alert,
            dialog: pagurian.dialog,
            checkboxs: pagurian.checkboxs,
            form: pagurian.form,
            portlet: pagurian.portlet,
            select: pagurian.select,
        };

        pagurian.plugin = {
            dataListView: pagurian.dataListView,
            sizer: pagurian.sizer,
            summary: pagurian.summary,
            dataTable: pagurian.dataTable,
            datePicker: pagurian.datePicker,
            dateRangePicker: pagurian.datePicker,
            dateTimePicker: pagurian.datePicker,
            echarts: pagurian.datePicker,
            slider: pagurian.slider
        };

    }



    //module中的app父对象
    var app = {
        page: {},
        events: {},
        init: function() {

            //版本兼容处理
            compatible();

            //初始化页面布局
            layout.init();
            layout.custom();
            layout.initMenu();
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
