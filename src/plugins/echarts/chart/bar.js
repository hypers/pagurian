define(function(require, exports, module) {

    var locale = {
        zh_CN: require('../locale/zh_CN'),
        en_US: require('../locale/en_US')
    };
    var activeLocale = locale[pagurian.language || "zh_CN"];

    module.exports = function(options) {


        var dataList = options.data || [],
            config = options.config || {},
            //行数据
            rows = options.rows,
            //列标签
            columns = options.columns,

            //水平显示图表
            horizon = options.horizon || false,

            //值显示的列
            valueColumn = horizon ? "xAxis" : "yAxis",

            //标签显示的列
            lableColumn = horizon ? "yAxis" : "xAxis";

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
            series: []
        };

        option[valueColumn] = [{
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
        }];


        option[lableColumn] = [{
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
        }];

        //初始化数据(兼容老的数据格式)
        if (dataList.length) {
            return compatible(option);
        }

        //新的数据格式
        if (rows && rows.length) {

            //初始化数据
            if (rows.length > 1) {
                option.legend = {
                    x: 'center',
                    y: "bottom",
                    data: []
                };

            }
            for (i = 0; i < rows.length; i++) {
                if (option.legend) {
                    option.legend.data.push(rows[i].name);
                }

                var series = {
                    name: rows[i].name,
                    type: 'bar',
                    data: rows[i].value,
                    itemStyle: {
                        normal: {
                            borderRadius: 0
                        }
                    }
                };

                //如果还需要设置其他参数，通过继承row上面的参数都继承到series
                $.extend(series, rows[i]);
                option.series.push(series);
            }
            option[lableColumn][0].data = options.columns;
        }

        this.option = option;


        //兼容以前老的data格式
        function compatible(option) {

            option.series.push({
                name: '',
                type: 'bar',
                itemStyle: {
                    normal: {
                        borderRadius: 0
                    }
                },
                data: []
            });

            for (i = 0; i < dataList.length; i++) {
                option[lableColumn][0].data.push(dataList[i].name);
                option.series[0].data.push(dataList[i].value);
            }
            if (options.name) {
                option[valueColumn][0].name = options.name;
                option.series[0].name = options.name;
            }
            return option;
        }

        return option;
    };



});
