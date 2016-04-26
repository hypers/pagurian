define(function (require, exports, module) {

    var app = require("../../lib/app");
    require("../../plugins/echarts/module");
    var chart = {};

    app.page.line = function () {

        chart = $p.echarts("my_chart", {
            type: "line",
            title: {
                text: '来源分析',
                subtext: '最近一周数据'
            }
        });

        chart.load({
            columns: ['2014-07-05', '2014-07-06', '2014-07-07', '2014-07-08', '2014-07-09', '2014-07-10', '2014-07-11', '2014-07-12', '2014-07-13', '2014-07-15', '2014-07-15', '2014-07-16', '2014-07-17', '2014-07-18', '2014-07-19', '2014-07-20', '2014-07-21', '2014-07-22', '2014-07-23', '2014-07-24'],
            rows: [
                {
                    name: "搜索引擎",
                    data: [120, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90, 230, 210, 150, 232, 201, 154, 190, 330]
                },
                {
                    name: "外部链接",
                    data: [220, 182, 191, 234, 290, 330, 310, 320, 332, 301, 334, 390, 330, 320, 132, 101, 134, 90, 230, 210],
                },
                {
                    name: "直接访问",
                    data: [150, 232, 201, 154, 190, 330, 410, 220, 182, 191, 234, 290, 330, 310, 290, 330, 310, 320, 332, 301]
                },
                {
                    name: "站内链接",
                    data: [320, 332, 301, 334, 390, 330, 320, 150, 232, 201, 154, 190, 330, 410, 182, 191, 234, 290, 330, 310]
                }]
        });

        $("#btn_demo").click(function () {
            var $portlet = $(".portlet");
            var $chart = $("#my_chart");
            var height = $(window).height();
            if ($portlet.hasClass("demo")) {
                $portlet.removeClass("demo");
                $chart.css("height", "350px");
                $(this).html('<i class="fa fa-laptop"></i> 演示');
            } else {
                $portlet.addClass("demo");
                $chart.css("height", height - 100);
                $(this).html('<i class="fa fa-laptop"></i> 退出演示');
            }
            chart.chart.resize();
        });
    };

    app.page.stack = function () {


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
                data: [120, 132, 101, 134, 90, 230, 210],
                stack: "总浏览量"
            }, {
                name: "外部链接",
                data: [220, 182, 191, 234, 290, 330, 310],
                stack: "总浏览量"
            }, {
                name: "直接访问",
                data: [150, 232, 201, 154, 190, 330, 410],
                stack: "总浏览量"
            }, {
                name: "站内链接",
                data: [320, 332, 301, 334, 390, 330, 320],
                stack: "总浏览量"
            }]
        });

    };

    app.page.areaStack = function () {


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
                data: [120, 132, 101, 134, 90, 230, 210],
                stack: "总浏览量",
                itemStyle: {
                    normal: {
                        areaStyle: {
                            type: 'macarons'
                        }
                    }
                }
            }, {
                name: "外部链接",
                data: [220, 182, 191, 234, 290, 330, 310],
                stack: "总浏览量",
                itemStyle: {
                    normal: {
                        areaStyle: {
                            type: 'macarons'
                        }
                    }
                }
            }, {
                name: "直接访问",
                data: [150, 232, 201, 154, 190, 330, 410],
                stack: "总浏览量",
                itemStyle: {
                    normal: {
                        areaStyle: {
                            type: 'macarons'
                        }
                    }
                }
            }, {
                name: "站内链接",
                data: [320, 332, 301, 334, 390, 330, 320],
                stack: "总浏览量",
                itemStyle: {
                    normal: {
                        areaStyle: {
                            type: 'macarons'
                        }
                    }
                }
            }]
        });

    };

    app.events.resize = function () {
        if (chart.chart && "function" === typeof chart.chart.resize) {
            chart.chart.resize();
        }
    };


    module.exports = app;

});
