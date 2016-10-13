define(function (require, exports, module) {

    var g = window;

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

    require('./js/3.2.3/echarts');

    //Word Json
    var wordJson = require('./js/3.2.3/map/world.json');
    //China Json
    var chinaJson = require('./js/3.2.3/map/china.json');

    echarts.registerMap('china', chinaJson);
    echarts.registerMap('world', wordJson);
    
});
