define(function(require, exports, module) {

    var locale = {
        zh_CN: require('../locale/zh_CN'),
        en_US: require('../locale/en_US')
    };
    var activeLocale = locale[pagurian.language || "zh_CN"];

    module.exports = function(options) {

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
            //设置是否每个节点都显示出来
            calculable: true,
            tooltip: {
                trigger: 'axis'
            },
            grid: {
                x: 90,
                y: 60,
                x2: 60,
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

            };
            $.extend(series, rows[i]);
            option.series.push(series);
        }

        option.xAxis[0].data = options.columns;
        return option;
    };

});
