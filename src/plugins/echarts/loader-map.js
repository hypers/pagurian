define(function(require, exports, module) {

    var g = window;
    require('./js/2.2.7/echarts-all');

    $p.locale.echarts = {
        en_US: {
            "china_province": require('./locale/en_US/china-province'),
            "china_city": require('./locale/en_US/china-city'),
            "country": require('./locale/en_US/country')
        },
        zh_CN: {
            "china_province": require('./locale/zh_CN/china-province'),
            "china_city": require('./locale/zh_CN/china-city'),
            "country": require('./locale/zh_CN/country')
        }
    };

});
