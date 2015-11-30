define(function(require, exports, module) {

    var locale = {
        zh_CN: require('../locale/zh_CN'),
        en_US: require('../locale/en_US')
    };
    var activeLocale = locale[pagurian.language || "zh_CN"];

    module.exports = function(options) {

        var mapType = options.mapType || "china";
        var chinaProvince = $p.locale.echartsChinaProvince || {};
        var country = $p.locale.echartCountry || {};

        var nameMap = {
            china: function(locale) {
                var list = {};
                if (locale === "zh_CN") {
                    //暂时不处理
                } else if (locale === "en_US") {
                    for (var key in chinaProvince) {
                        list[chinaProvince[key]] = key;
                    }
                }
                return list;
            },
            world: function(locale) {
                var list = {};
                if (locale === "zh_CN") {
                    list = country;
                } else if (locale === "en_US") {
                    for (var key in country) {
                        list[key] = key;
                    }
                }
                return list;
            }
        };


        var getProvinceName = function(name) {
            if (name) {
                for (var key in chinaProvince) {
                    if (name.indexOf(chinaProvince[key]) >= 0) {
                        return chinaProvince[key];
                    }
                }
            }
            return name;
        };

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
                trigger: 'item',
                formatter: options.name + "<br/>{b} : {c} {d}"
            },
            dataRange: {
                orient: 'horizontal',
                min: 0,
                max: 0,
                text: [activeLocale.high, activeLocale.low],
                calculable: false,
                color: ['#fe8463', '#ffede8'],
                x: "18",
                y: "420"
            },
            series: [{
                name: '',
                type: 'map',
                mapType: mapType,
                nameMap: nameMap[mapType](pagurian.language || "zh_CN"),
                calculable: false,
                mapLocation: {
                    y: 60
                },
                roam: false,
                itemStyle: {
                    normal: {
                        label: {
                            show: mapType === "china" ? true : false
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

            dataList[i].name = getProvinceName(dataList[i].name);
            option.series[0].data.push(dataList[i]);
            if (dataList[i].value > option.dataRange.max) {
                option.dataRange.max = dataList[i].value;
            }

        }
        option.series[0].name = options.name;
        $.extend(true, option, options.options);

        this.option = option;
        return option;
    };

});
