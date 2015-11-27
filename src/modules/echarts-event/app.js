define(function (require, exports, module) {

    var app = require('../../lib/app');
    require('../../plugins/echarts/module');
    var chart = {};

    app.page.event = function () {

        chart = $p.plugin.echarts("my_chart", {
            type: "line",
            title: {
                text: '来源分析',
                subtext: '最近一周数据'
            }
        });

        chart.load({
            columns: ['2014-07-05', '2014-07-06', '2014-07-07', '2014-07-08', '2014-07-09', '2014-07-10', '2014-07-11'],
            rows: [{
                name: "搜索引擎",
                data: [120, 132, 101, 134, 90, 230, 210]
            }, {
                name: "外部链接",
                data: [220, 182, 191, 234, 290, 330, 310],
            }, {
                name: "直接访问",
                data: [150, 232, 201, 154, 190, 330, 410]
            }, {
                name: "站内链接",
                data: [320, 332, 301, 334, 390, 330, 320]
            }]
        });

        function eConsole(param) {
            var mes = '【' + param.type + '】';
            if (typeof param.seriesIndex !== 'undefined') {
                mes += '  seriesIndex : ' + param.seriesIndex;
                mes += '  dataIndex : ' + param.dataIndex;
            }
            console.log(param);
            $p.com.alert(mes, "success");
        }

        chart.on(echarts.config.EVENT.CLICK, eConsole);
    };

    app.events.resize = function () {
        if (chart.chart && "function" === typeof chart.chart.resize) {
            chart.chart.resize();
        }
    };


    module.exports = app;

});
