define(function(require, exports, module) {

    require('./js/echarts-plain-map');

    var echart = {

        init: function(id) {

            var chart = echarts.init(document.getElementById(id));
            chart.showLoading({
                text: "加载中..."
            });

            chart.load = function(option) {
                var default_option = {
                    backgroundColor: '#f5f5f5',
                    color: ['#fe8463', '#9bca63', '#fad860', '#60c0dd', '#0084c6', '#d7504b', '#c6e579', '#26c0c0', '#f0805a', '#f4e001', '#b5c334'],

                };
                $(".chart-message").remove();
                var options = $.extend(default_option, option);
                this.hideLoading();
                this.clear();
                this.setOption(options);

                return this;
            }
            chart.message = function(status, message) {
                this.hideLoading();
                this.clear();
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
                $(".chart-body").append("<div class='chart-message'><h3><i class='fa " + icon + "' ></i> " + msg + "</h3></div>");

                return this;
            }
            chart.line = function(opt, type) {

                var dataList = opt.data || [];
                var config = opt.config || {};
                var option = {
                    color: ['#fe8463', '#0084c6', '#9bca63', '#fad860', '#60c0dd', '#d7504b', '#c6e579', '#26c0c0', '#f0805a', '#f4e001', '#b5c334'],
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
                for (var i = 0; i < dataList.length; i++) {
                    option.legend.data.push(dataList[i].name);
                    var series = {
                        name: dataList[i].name,
                        type: 'line',
                        smooth: config.smooth || true,
                        data: dataList[i].value,
                        symbol: "emptyCircle",
                        symbolSize: 5,

                    }
                    if (config.stack) {
                        series.stack = config.stack;
                    }
                    if (config.showAreaStyle) {
                        series.itemStyle = {
                            normal: {
                                areaStyle: {
                                    type: 'macarons'
                                }
                            }
                        }
                    }

                    option.series.push(series);
                }

                option.xAxis[0].data = opt.column;

                this.option = option;
                return option;
            };
            chart.pie = function(opt, type) {
                var dataList = opt.data || [];
                var config = opt.config || {};
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
                    startAngle: 0,
                    minAngle: 3,
                    calculable: true,
                    series: [{
                        name: '',
                        type: 'pie',
                        radius: '65%',
                        center: ['50%', '48%'],
                        data: []
                    }]
                };

                //初始化数据
                for (var i = 0; i < dataList.length; i++) {
                    option.legend.data.push(dataList[i].name);
                    option.series[0].data.push(dataList[i]);
                }
                option.series[0].name = config.name;

                this.option = option;
                return option;
            };
            chart.bar = function(opt) {

                var dataList = opt.data || [];
                var config = opt.config || {};
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
                if (config.name) {
                    option.yAxis[0].name = config.name;
                    option.series[0].name = config.name;
                }

                this.option = option;
                return option;
            };
            chart.map = function(opt) {
                var dataList = opt.data || [];
                var config = opt.config || {};
                var option = {
                    color: ['#f0805a', '#ffded4'],
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
                        max: 2500,
                        text: ['高', '低'],
                        calculable: true,
                        color: ['#f0805a', '#ffded4'],
                    },
                    series: [{
                        name: '独立用户数',
                        type: 'map',
                        roam: true,
                        mapType: 'china',
                        roam: false, //是否开启缩放功能
                        itemStyle: {
                            normal: {
                                label: {
                                    show: true
                                }
                            },
                            emphasis: {
                                label: {
                                    show: true
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
                option.series[0].name = config.name;
                this.option = option;
                return option;
            }
            return chart;
        }
    };

    module.exports = echart;

});