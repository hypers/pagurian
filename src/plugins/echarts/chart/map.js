define(function(require, exports, module) {

    var languages = {
        zh_CN: require('../locale/zh_CN'),
        en_US: require('../locale/en_US')
    };
    var lang = pagurian.language || "zh_CN";
    var locale = languages[lang];

    module.exports = function(options) {

        var mapType = options.mapType || "china";

        var chinaProvinceLocale = $p.locale.echarts[lang].china_province;
        var chinaCityLocale = $p.locale.echarts[lang].china_city;
        var chinaProvince_zh_CN = $p.locale.echarts.zh_CN.china_province;
        var countryLocale = $p.locale.echarts[lang].country;
        var country_en_US = $p.locale.echarts.en_US.country;

        var nameMap = {
            china: function(locale) {
                var list = {};
                for (var key in chinaProvince_zh_CN) {
                    list[chinaProvince_zh_CN[key]] = chinaProvinceLocale[key];
                }
                return list;
            },
            world: function(locale) {
                var list = {};
                for (var key in country_en_US) {
                    list[country_en_US[key]] = countryLocale[key];
                }
                return list;
            }
        };

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
                formatter: options.name + "<br/>{b} : {c} {d}"
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
                nameMap: nameMap[mapType](pagurian.language || "zh_CN"),
                calculable: false,
                mapLocation: {
                    y: 60
                },
                roam: false,
                itemStyle: {
                    normal: {
                        label: {
                            show: mapType === "china" ? true : false,

                            textStyle: {
                                fontSize: pagurian.language === "en_US" ? "10" : "12"
                            }
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

            dataList[i].name = getName(dataList[i].name);
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
