define(function (require, exports, module) {

    var app = require('../../lib/app');
    require('../../plugins/echarts/module');
    var chart = {};

    app.page.bar = function () {

        chart = $p.plugin.echarts("my_chart", {
            type: "bar"
        });

        var data = {
            name: "PV",
            //是否为水平显示,默认为false
            //horizon:true,
            data: [
                {
                    value: 735,
                    name: '百度'
                },
                {
                    value: 310,
                    name: '谷歌'
                },
                {
                    value: 234,
                    name: '360搜索'
                },
                {
                    value: 135,
                    name: '搜狗'
                },
                {
                    value: 548,
                    name: '必应'
                },
                {
                    value: 148,
                    name: '雅虎'
                },
                {
                    value: 114,
                    name: '网易有道'
                }]
        };

        chart.load(data, function(option){
            option.series[0].itemStyle.normal={
                color: function (params) {
                    var colorList = [
                        '#C1232B', '#B5C334', '#FCCE10', '#E87C25', '#27727B',
                        '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
                        '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'
                    ];
                    return colorList[params.dataIndex];
                }
            };
            return option;
        });

    };


    app.events.resize = function () {
        if (chart.chart && "function" === typeof chart.chart.resize) {
            chart.chart.resize();
        }
    };


    module.exports = app;

});
