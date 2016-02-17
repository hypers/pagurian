define(function (require, exports, module) {
    
    var app = require("../../lib/app");
    require("../../plugins/echarts/module");
    var chart = {};

    app.page.pie = function () {


        chart = $p.echarts("my_chart", {
            type: "pie",
            title: {
                text: '来源分析',
                subtext: '最近一周数据'
            }
        });

        chart.load({
            name: '访问来源',
            data: [{
                value: 735,
                name: '百度'
            }, {
                value: 310,
                name: '谷歌'
            }, {
                value: 234,
                name: '360搜索'
            }, {
                value: 135,
                name: '搜狗'
            }, {
                value: 548,
                name: '必应'
            }, {
                value: 148,
                name: '雅虎'
            }, {
                value: 114,
                name: '网易有道'
            }],
        });

    };


    app.page.loop=function(){
        chart = $p.echarts("my_chart", {
            type: "pie",
            title: {
                text: '来源分析'
            }
        });

        chart.load({
            name: '访问来源',
            radius : ['50%', '70%'],
            data: [{
                value: 735,
                name: '百度'
            }, {
                value: 310,
                name: '谷歌'
            }, {
                value: 234,
                name: '360搜索'
            }, {
                value: 135,
                name: '搜狗'
            }, {
                value: 548,
                name: '必应'
            }, {
                value: 148,
                name: '雅虎'
            }, {
                value: 114,
                name: '网易有道'
            }],
        });
    };

    app.events.resize = function () {
        if (chart.chart && "function" === typeof chart.chart.resize) {
            chart.chart.resize();
        }
    };


    module.exports = app;

});
