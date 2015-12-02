define(function(require, exports, module) {

    var locale = {
        zh_CN: require('../locale/zh_CN'),
        en_US: require('../locale/en_US')
    };
    var activeLocale = locale[pagurian.language || "zh_CN"];

    module.exports = function(options) {
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
                startAngle: 0,
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
    };

});
