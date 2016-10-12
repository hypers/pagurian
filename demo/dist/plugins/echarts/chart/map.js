define(function (require, exports, module) {

    var languages = {
        zh_CN: require('../locale/zh_CN'),
        en_US: require('../locale/en_US')
    };
    var lang = pagurian.language || "zh_CN";
    var locale = languages[lang];

    module.exports = function (options) {

        var mapType = options.mapType || "china";

        var chinaProvinceLocale = $p.locale.echarts[lang].china_province;
        var chinaCityLocale = $p.locale.echarts[lang].china_city;
        var chinaProvince_zh_CN = $p.locale.echarts.zh_CN.china_province;
        var countryLocale = $p.locale.echarts[lang].country;
        var country_en_US = $p.locale.echarts.en_US.country;

        var nameMap = {
            china: function (locale) {
                var list = {};
                for (var key in chinaProvince_zh_CN) {
                    list[chinaProvince_zh_CN[key]] = chinaProvinceLocale[key];
                }
                return list;
            },
            world: function (locale) {
                var list = {};
                for (var key in country_en_US) {
                    list[country_en_US[key]] = countryLocale[key];
                }
                return list;
            }
        };

        //当前语言映射
        var currentNameMap = nameMap[mapType](pagurian.language || "zh_CN");

        //通过Key获取本地语言的名称
        function getName(key) {
            if (mapType === "world") {
                return countryLocale[key] || key;
            }
            if (chinaProvinceLocale[key]) {
                return chinaProvinceLocale[key];
            }
            return chinaCityLocale[key] || key;
        }

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
                formatter: function (params) {
                    return [options.name, params.name + '：' + (isNaN(params.value) ? '-' : params.value)].join('<br/>');
                }
            },
            dataRange: {
                orient: 'horizontal',
                min: 0,
                max: 0,
                text: [locale.high, locale.low],
                calculable: false,
                color: ['#fe8463', '#ffede8'],
                x: "18",
                y: "420"
            },
            series: [{
                name: '',
                type: 'map',
                mapType: mapType,
                selectedMode: 'single',
                nameMap: currentNameMap,
                calculable: false,
                mapLocation: {
                    y: 60
                },
                roam: false,
                itemStyle: {
                    normal: {
                        borderColor: '#eee',
                        borderWidth: 0.3,
                        areaColor: '#d0d0d0',
                        label: {
                            show: mapType === "china" ? true : false,
                            textStyle: {
                                color: '#8b4513',
                                fontSize: pagurian.language === "en_US" ? "10" : "12"
                            }
                        }
                    },
                    emphasis: {
                        label: {
                            show: true,
                            textStyle: {
                                color: "#eee"
                            }
                        },
                        areaStyle: {
                            color: '#d7504b'
                        },
                        areaColor: '#d7504b'
                    }
                },
                data: []
            }]
        };

        dataList = dataList.map(function (data) {
            data.name = getName(data.name);
            return data;
        });

        //初始化数据
        Object.keys(currentNameMap).forEach(function (key) {
            var currentName = currentNameMap[key];
            var values = dataList.filter(function (item) {
                return item.name === currentName;
            });

            if (values.length) {
                var valueObj = values[0];
                option.series[0].data.push(valueObj);
                if (valueObj.value > option.dataRange.max) {
                    option.dataRange.max = valueObj.value;
                }
                return;
            }

            option.series[0].data.push({
                name: currentName,
                value: null
            });
        });

        option.series[0].name = options.name;

        $.extend(true, option, options.options);
        this.option = option;
        return option;
    };

});
