define(function(require, exports, module) {

    var g = window;
    require('./js/2.2.0/echarts-all');
    $p.locale.echartsChinaProvince = require('./locale/china-province');
    $p.locale.echartsChinaCity = require('./locale/china-city');
    $p.locale.echartCountry = require('./locale/country');

});
