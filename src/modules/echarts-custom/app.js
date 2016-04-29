define(function(require, exports, module) {
    
    var app = require("../../lib/app");
    require("../../plugins/echarts/module");
    var chart = {};

    app.page.event = function() {

        chart = $p.echarts("my_chart", {
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

        chart.on(echarts.config.EVENT.CLICK, function(param) {
            var mes = '【' + param.type + '】';
            if (typeof param.seriesIndex !== 'undefined') {
                mes += '  seriesIndex : ' + param.seriesIndex;
                mes += '  dataIndex : ' + param.dataIndex;
            }
            console.log(param);
            $p.alert(mes, "success");
        });
    };

    app.page.options = function() {

        chart = $p.echarts("my_chart");

        chart.load({
            title: {
                text: '漏斗图',
                subtext: '纯属虚构'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c}%"
            },
            toolbox: {
                show: true,
                feature: {
                    mark: {
                        show: true
                    },
                    dataView: {
                        show: true,
                        readOnly: false
                    },
                    restore: {
                        show: true
                    },
                    saveAsImage: {
                        show: true
                    }
                }
            },
            legend: {
                data: ['展现', '点击', '访问', '咨询', '订单']
            },
            calculable: true,
            series: [{
                name: '漏斗图',
                type: 'funnel',
                width: '40%',
                data: [{
                    value: 60,
                    name: '访问'
                }, {
                    value: 40,
                    name: '咨询'
                }, {
                    value: 20,
                    name: '订单'
                }, {
                    value: 80,
                    name: '点击'
                }, {
                    value: 100,
                    name: '展现'
                }]
            }, {
                name: '金字塔',
                type: 'funnel',
                x: '50%',
                sort: 'ascending',
                itemStyle: {
                    normal: {
                        // color: 各异,
                        label: {
                            position: 'left'
                        }
                    }
                },
                data: [{
                    value: 60,
                    name: '访问'
                }, {
                    value: 40,
                    name: '咨询'
                }, {
                    value: 20,
                    name: '订单'
                }, {
                    value: 80,
                    name: '点击'
                }, {
                    value: 100,
                    name: '展现'
                }]
            }]
        });

    };

    app.events.resize = function() {
        if (chart.chart && "function" === typeof chart.chart.resize) {
            chart.chart.resize();
        }
    };


    module.exports = app;

});
