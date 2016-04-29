define(function(require, exports, module) {
    
    var app = require("../../lib/app");
    require("../../plugins/echarts/module");
    var chart = {};



    app.page.world = function() {

        chart = $p.echarts("my_chart", {
            type: "map",
            title: {
                text: "浏览量（PV）地域分布图"
            }
        });

        chart.load({
            name: "pv",
            mapType: "world",
            data: [{
                value: 735,
                name: 'geo.country.china'
            }, {
                value: 423,
                name: 'United States of America'
            }, {
                value: 310,
                name: 'geo.country.italy'
            }, {
                value: 300,
                name: '俄罗斯'
            }]
        });
    };

    app.page.china = function() {

        chart = $p.echarts("my_chart", {
            type: "map",
            title: {
                text: "浏览量（PV）地域分布图"
            }
        });

        chart.load({
            name: "pv",
            mapType: "china",
            data: [{
                value: 735,
                name: '上海'
            }, {
                value: 310,
                name: '北京'
            }, {
                value: 234,
                name: '四川'
            }, {
                value: 135,
                name: '天津'
            }, {
                value: 548,
                name: '云南'
            }, {
                value: 148,
                name: '河南'
            }, {
                value: 114,
                name: '香港'
            }]
        });
    };

    app.page.city = function() {

        chart = $p.echarts("my_chart", {
            type: "map",
            title: {
                text: "浏览量（PV）地域分布图 - 中国"
            }
        });

        chart.load({
            name: "pv",
            mapType: "china",
            data: [{
                value: 234,
                name: 'Sichuan'
            }, {
                value: 400,
                name: 'Chengdu'
            }, {
                value: 500,
                name: '浙江'
            }, {
                value: 300,
                name: '杭州市'
            }, {
                value: 200,
                name: '宁波市'
            }]
        });

        chart.on(echarts.config.EVENT.MAP_SELECTED, function(param) {
            chart.onMapSelectedByChina(param);
        });

    };

    app.events.resize = function() {
        if (chart.chart && "function" === typeof chart.chart.resize) {
            chart.chart.resize();
        }
    };


    module.exports = app;

});
