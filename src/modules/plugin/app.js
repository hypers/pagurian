define(function(require, exports, module) {

    var app = require('../../lib/app');
    var model = require('./model');

    require('../../plugins/echarts/js/echarts-plain-map');

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
    
    app.page.echarts = function() {


        var oChart1 = chart.init("chart1");
        var option1 = oChart1.line({
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
        oChart1.load(option1);


        var oChart2 = chart.init("chart2");
        var option2 = oChart2.line({
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
        oChart2.load(option2);



        var oChart3 = chart.init("chart3");
        var option3 = oChart3.pie({
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
        oChart3.load(option3);


        var oChart4 = chart.init("chart4");
        var option4 = oChart4.bar({
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
            config: {

            }
        });
        oChart4.load(option4);


        var oChart5 = chart.init("chart5");
        var option5 = oChart5.map({
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
        oChart5.load(option5);

    }

    app.page.test = function() {


        var option1 = {
            tooltip: {
                trigger: 'axis',
                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                data: ['新的-PV', '旧的-PV', '差异-PV', '新的-UV', '旧的-UV', '差异-UV']
            },
            calculable: true,
            xAxis: [{
                type: 'category',
                data: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00',
                    '10:00', '11:00', '12:00', '13:00',
                    '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
                ]
            }],
            yAxis: [{
                type: 'value'
            }],
            series: [{
                name: '新的-PV',
                type: 'bar',

                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            position: 'insideRight'
                        }
                    }
                },
                data: [11, 33, 234, 543, 390, 330, 320]
            }, {
                name: '旧的-PV',
                type: 'bar',

                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            position: 'insideRight'
                        }
                    }
                },
                data: [120, 132, 101, 134, 90, 230, 210]
            }, {
                name: '差异-PV',
                type: 'bar',

                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            position: 'insideRight'
                        }
                    }
                },
                data: [120, 132, 101, 134, 90, 230, 210]
            }, {
                name: '新的-UV',
                type: 'bar',

                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            position: 'insideRight'
                        }
                    }
                },
                data: [320, 302, 301, 334, 390, 330, 320]
            }, {
                name: '旧的-UV',
                type: 'bar',

                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            position: 'insideRight'
                        }
                    }
                },
                data: [120, 132, 101, 134, 90, 230, 210]
            }, {
                name: '差异-UV',
                type: 'bar',
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            position: 'insideRight'
                        }
                    }
                },
                data: [120, 132, 101, 134, 90, 230, 210]
            }]
        };


        var sel_kk = $("#sel_kk");
        sel_kk.append("<option value=''>请选择</option>");
        for (var i in kk_data) {
            sel_kk.append("<option value=" + i + ">" + i + "</option>");
        }

        var oChart1;
        sel_kk.change(function() {

            oChart1 = oChart1 || chart.init("chart1");
            var v = $(this).val();
            if (!v) {
                return;
            }

            var cy_pv = [],
                cy_uv = [];
            for (var i = 0; i < kk_data[v]['pv_new'].length; i++) {
                cy_pv.push(kk_data[v]['pv_new'][i] - kk_data[v]['pv_old'][i]);
                cy_uv.push(kk_data[v]['uv_new'][i] - kk_data[v]['uv_old'][i]);
            }

            option1.series[0].data = kk_data[v]['pv_new'];
            option1.series[1].data = kk_data[v]['pv_old'];
            option1.series[2].data = cy_pv;

            option1.series[3].data = kk_data[v]['uv_new'];
            option1.series[4].data = kk_data[v]['uv_old'];
            option1.series[5].data = cy_uv;

            oChart1.load(option1);
        });
    }

    module.exports = app;

});