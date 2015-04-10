define(function(require, exports, module) {

    var app = require('../../lib/app');
    var model = require('./model');

    

    var dataTable = require('../../plugins/datatables/module');
    var chart = require('../../plugins/echarts/module');


    //  var kk_data = require('../../../test_data/kk.js');
    var kk_data = [];
    app.page.dataTable = function() {

        var oTable = dataTable.init({
            "id": "#datatable_keywords",
            "dataSource": model.getDataList,
            "isCreateOrder": true,
            "aaSorting": [
                [3, "desc"]
            ],
            "fnParams": function() {
                return {};
            },
            "aoColumns": [{
                "mData": null,
                "bSortable": false,
                "sClass": "t-a-c",
                mRender: function(data, type, full) {
                    return "";
                }
            }, {
                "bSortable": false,
                "mData": "keywords",
                mRender: function(data, type, full) {
                    return '<span title="' + full.keywords + '">' + full.keywords + '</span>';
                }
            }, {
                "bSortable": false,
                "mData": "searchEngine"
            }, {
                "sClass": "t-a-r",
                "mData": "pageViews"
            }, {
                "sClass": "t-a-r",
                "mData": "uniqueVisitors"
            }, {
                "sClass": "t-a-r",
                "mData": "visitViews"
            }],
            callback: function() {

            }
        });

    };
    
    app.page.echarts_line = function() {

        var myChart = chart.init("my_chart");
        var option = myChart.line({
            column: ['2014-07-05', '2014-07-06', '2014-07-07', '2014-07-08', '2014-07-09', '2014-07-10', '2014-07-11'],
            data: [{
                name: "搜索引擎",
                value: [120, 132, 101, 134, 90, 230, 210]
            }, {
                name: "外部链接",
                value: [220, 182, 191, 234, 290, 330, 310],
            }, {
                name: "直接访问",
                value: [150, 232, 201, 154, 190, 330, 410]
            }, {
                name: "站内链接",
                value: [320, 332, 301, 334, 390, 330, 320]
            }]
        });
        myChart.load(option);
    }

    app.page.echarts_stack=function(){

        var myChart = chart.init("my_chart");
        var option = myChart.line({
            column: ['2014-07-05', '2014-07-06', '2014-07-07', '2014-07-08', '2014-07-09', '2014-07-10', '2014-07-11'],
            data: [{
                name: "搜索引擎",
                value: [120, 132, 101, 134, 90, 230, 210]
            }, {
                name: "外部链接",
                value: [220, 182, 191, 234, 290, 330, 310],
            }, {
                name: "直接访问",
                value: [150, 232, 201, 154, 190, 330, 410]
            }, {
                name: "站内链接",
                value: [320, 332, 301, 334, 390, 330, 320]
            }],
            config: {
                stack: "pv",
                showAreaStyle: true
            }
        });
        myChart.load(option);



       
    }

    app.page.echarts_pie=function(){
        
        var myChart = chart.init("my_chart");
        var option = myChart.pie({
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
        myChart.load(option);
    }

    app.page.echarts_bar=function(){
        
        var myChart = chart.init("my_chart");
        var option = myChart.bar({
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
            }]
        });
        myChart.load(option);


      
    }

    app.page.echarts_map=function(){

        var myChart = chart.init("my_chart");
        var option = myChart.map({
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
            }],
            config: {
                name: "浏览量（PV）地域分布图"
            }
        });
        myChart.load(option);
    }

   
    module.exports = app;

});