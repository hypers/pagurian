define(function(require, exports, module) {

    var locale = {
        zh_CN: require('../locale/zh_CN'),
        en_US: require('../locale/en_US')
    };
    var activeLocale = locale[pagurian.language || "zh_CN"];

    module.exports = function(options) {

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
            calculable: false,
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


        var i, _temp;

        //横向柱状图
        if (!options.horizon) {

            _temp = option.xAxis;
            option.xAxis = option.yAxis;
            option.yAxis = _temp;
            //初始化数据
            for (i = 0; i < dataList.length; i++) {
                option.yAxis[0].data.push(dataList[i].name);
                option.series[0].data.push(dataList[i].value);
            }
            if (options.name) {
                option.xAxis[0].name = options.name;
                option.series[0].name = options.name;
            }
            this.option = option;
            return option;
        }

        //初始化数据
        for (i = 0; i < dataList.length; i++) {
            option.xAxis[0].data.push(dataList[i].name);
            option.series[0].data.push(dataList[i].value);
        }
        if (options.name) {
            option.yAxis[0].name = options.name;
            option.series[0].name = options.name;
        }
        this.option = option;
        return option;
    };

});
