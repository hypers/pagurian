/*
var chart = $p.ui.echarts("my_chart", {
    type: "line"
});

chart.load({
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
*/

define(function(require, exports, module) {

    require('./js/2.0.0/echarts-plain-map');

    var g = window;

    function Echarts(seletor, options) {
        this.options = {
            backgroundColor: '#f5f5f5',
            color: ['#fe8463', '#9bca63', '#fad860', '#60c0dd', '#0084c6', '#d7504b', '#c6e579', '#26c0c0', '#f0805a', '#f4e001', '#b5c334'],

        };
        this.init = function() {
            this.id = seletor;
            $.extend(true, this.options, options);
            this.chart = echarts.init(document.getElementById(seletor));
            this.chart.showLoading({
                text: "加载中..."
            });
        }

        this.message = function(status, message) {

            this.chart.hideLoading();
            this.chart.clear();
            var icon = "fa-info-circle";
            var msg = message || "查询结果为空";

            if (status == "timeout") {
                icon = "fa-exclamation-circle fa-red";
                msg += "<br/><a class='btn btn-default' id='btn_reload'>重新查询</a>"
            }
            if (status == "empty") {

            }
            if (status == "error") {
                icon = "fa-exclamation-circle fa-red";
            }
            if ($(".chart-message").length > 0) {
                $(".chart-message").html("<h3><i class='fa " + icon + "' ></i> " + msg + "</h3>");
                return;
            }
            $("#" + this.id).append("<div class='chart-message'><h3><i class='fa " + icon + "' ></i> " + msg + "</h3></div>");

            return this;
        }

        this.load = function(data) {


            $(".chart-message").remove();

            var type = this.options.type || "line";

            var options = $.extend(true, {}, this.options, chartOptions[type](data));

            this.chart.hideLoading();
            this.chart.clear();
            this.chart.setOption(options);

            return this;
        }
    }

    var chartOptions = {

        line: function(options) {

            var rows = options.rows || [];
            var option = {
                
                title: {
                    x: "center",
                    y: "20",
                    textStyle: {
                        color: "#999",
                        fontWeight: '100',
                    }
                },
                calculable: true,
                tooltip: {
                    trigger: 'axis'
                },
                grid: {
                    x: 60,
                    y: 60,
                    x2: 50,
                    y2: 60
                },
                legend: {
                    x: 'center',
                    y: "bottom",
                    data: []
                },
                xAxis: [{
                    type: 'category',
                    boundaryGap: false,
                    axisLine: {
                        lineStyle: {
                            color: '#CCC'
                        }
                    },
                    splitLine: {
                        show: false,
                        lineStyle: {
                            color: '#DADADA'
                        }
                    },

                    data: []
                }],
                yAxis: [{
                    type: 'value',
                    axisLine: {
                        lineStyle: {
                            color: '#CCC'
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: 'rgba(240, 240, 240, 0.8)'
                        }
                    },
                    splitArea: {
                        show: true,
                        areaStyle: {
                            color: ['rgba(250,250,250,0.1)', 'rgba(200,200,200,0.1)']
                        }
                    }

                }],
                series: [],
            };

            //初始化数据
            for (var i = 0; i < rows.length; i++) {
                option.legend.data.push(rows[i].name);
                var series = {
                    name: rows[i].name,
                    type: 'line',
                    smooth: true,
                    data: rows[i].value,
                    symbol: "emptyCircle",
                    symbolSize: 5,

                }
                $.extend(series, rows[i]);
                option.series.push(series);
            }

            option.xAxis[0].data = options.columns;
            return option;
        },
        pie: function(options) {
            var dataList = options.data || [];
            var option = {
                title: {
                    x: "center",
                    y: "20",
                    textStyle: {
                        color: "#999",
                        fontWeight: '100',
                    }
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    x: 'center',
                    y: "bottom",
                    data: []
                },

                calculable: false,
                series: [{
                    name: '',
                    type: 'pie',
                    radius: '60%',
                    minAngle: 3,
                    center: ['50%', '50%'],
                    data: []
                }]
            };

            $.extend(option.series[0], options);
            //初始化数据
            for (var i = 0; i < dataList.length; i++) {
                option.legend.data.push(dataList[i].name);
            }

            this.option = option;
            return option;
        },
        bar: function(options) {

            var dataList = options.data || [];
            var config = options.config || {};
            var option = {
                title: {
                    x: "center",
                    y: "20",
                    textStyle: {
                        color: "#999",
                        fontWeight: '100',
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                toolbox: {
                    show: false
                },
                calculable: true,
                xAxis: [{
                    type: 'category',
                    data: [],
                    boundaryGap: true,
                    axisLine: {
                        lineStyle: {
                            color: '#CCC'
                        }
                    },
                    splitLine: {
                        show: false,
                        lineStyle: {
                            color: '#DADADA'
                        }
                    }
                }],
                yAxis: [{
                    name: '',
                    type: 'value',
                    nameTextStyle: {
                        color: '#000'
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#CCC'
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: 'rgba(240, 240, 240, 0.8)'
                        }
                    },
                    splitArea: {
                        show: true,
                        areaStyle: {
                            color: ['rgba(250,250,250,0.1)', 'rgba(200,200,200,0.1)']
                        }
                    }
                }],
                series: [{
                    name: '',
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            borderRadius: 0
                        }
                    },
                    data: []
                }]
            };


            //初始化数据
            for (var i = 0; i < dataList.length; i++) {
                option.xAxis[0].data.push(dataList[i].name);

                option.series[0].data.push(dataList[i].value);
            }
            if (options.name) {
                option.yAxis[0].name = options.name;
                option.series[0].name = options.name;
            }

            this.option = option;
            return option;
        },
        map: function(options) {

            var dataList = options.data || [];
            var option = {
                color: ['#fe8463', '#ffede8'],
                title: {
                    x: "center",
                    y: "20",
                    textStyle: {
                        color: "#999",
                        fontWeight: '100',
                    }
                },
                tooltip: {
                    trigger: 'item'
                },
                dataRange: {
                    orient: 'horizontal',
                    min: 0,
                    max: 5000,
                    text: ['高', '低'],
                    calculable: false,
                    color: ['#fe8463', '#ffede8']
                },
                series: [{
                    name: '独立用户数',
                    type: 'map',
                    roam: true,
                    mapType: 'china',
                    calculable: false,
                    roam: false, //是否开启缩放功能
                    itemStyle: {
                        normal: {
                            label: {
                                show: true
                            }
                        },
                        emphasis: {
                            label: {
                                show: true,
                                textStyle: {
                                    color: "#fff"
                                }
                            },
                            areaStyle: {
                                color: '#d7504b'
                            }
                        }
                    },
                    data: []
                }]
            };

            //初始化数据
            for (var i = 0; i < dataList.length; i++) {
                option.series[0].data.push(dataList[i]);
            }
            option.series[0].name = options.name;
            $.extend(true, option, options.options);
            this.option = option;

            return option;
        }
    }

    g[PagurianAlias].plugin.echarts = function(seletor, options) {
        var chart = new Echarts(seletor, options);
        chart.init();
        return chart;
    }

});