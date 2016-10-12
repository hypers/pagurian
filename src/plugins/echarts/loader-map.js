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

    require('./js/3.2.3/echarts.min');
    // require('./loader-json');

    //Word Json
    var wordJson = require('./js/3.2.3/map/world.json');
    //China Json
    var chinaJson = require('./js/3.2.3/map/china.json');
    // 省份标识与省份配置json的映射关系
    var MAPPING_CHINA_PROVINCE_CONFIG = {
        "geo.china.anhui": require('./js/3.2.3/map/province/anhui.json'),
        "geo.china.macao": require('./js/3.2.3/map/province/aomen.json'),
        "geo.china.beijing": require('./js/3.2.3/map/province/beijing.json'),
        "geo.china.chongqing": require('./js/3.2.3/map/province/chongqing.json'),
        "geo.china.fujian": require('./js/3.2.3/map/province/fujian.json'),
        "geo.china.gansu": require('./js/3.2.3/map/province/gansu.json'),
        "geo.china.guangdong": require('./js/3.2.3/map/province/guangdong.json'),
        "geo.china.guangxi": require('./js/3.2.3/map/province/guangxi.json'),
        "geo.china.guizhou": require('./js/3.2.3/map/province/guizhou.json'),
        "geo.china.hainan": require('./js/3.2.3/map/province/hainan.json'),
        "geo.china.hebei": require('./js/3.2.3/map/province/hebei.json'),
        "geo.china.heilongjiang": require('./js/3.2.3/map/province/heilongjiang.json'),
        "geo.china.henan": require('./js/3.2.3/map/province/henan.json'),
        "geo.china.hubei": require('./js/3.2.3/map/province/hubei.json'),
        "geo.china.hunan": require('./js/3.2.3/map/province/hunan.json'),
        "geo.china.jiangsu": require('./js/3.2.3/map/province/jiangsu.json'),
        "geo.china.jiangxi": require('./js/3.2.3/map/province/jiangxi.json'),
        "geo.china.jilins": require('./js/3.2.3/map/province/jilin.json'),
        "geo.china.liaoning": require('./js/3.2.3/map/province/liaoning.json'),
        "geo.china.inner_mongolia": require('./js/3.2.3/map/province/neimenggu.json'),
        "geo.china.ningxia": require('./js/3.2.3/map/province/ningxia.json'),
        "geo.china.qinghai": require('./js/3.2.3/map/province/qinghai.json'),
        "geo.china.shandong": require('./js/3.2.3/map/province/shandong.json'),
        "geo.china.shanghai": require('./js/3.2.3/map/province/shanghai.json'),
        "geo.china.shanxi": require('./js/3.2.3/map/province/shanxi.json'),
        "geo.china.shaanxi": require('./js/3.2.3/map/province/shanxi1.json'),
        "geo.china.sichuan": require('./js/3.2.3/map/province/sichuan.json'),
        "geo.china.tianjin": require('./js/3.2.3/map/province/tianjin.json'),
        "geo.china.tibet": require('./js/3.2.3/map/province/xizang.json'),
        "geo.china.taiwan": require('./js/3.2.3/map/province/taiwan.json'),
        "geo.china.hongkong": require('./js/3.2.3/map/province/xianggang.json'),
        "geo.china.xinjiang": require('./js/3.2.3/map/province/xinjiang.json'),
        "geo.china.yunnan": require('./js/3.2.3/map/province/yunnan.json'),
        "geo.china.zhejiang": require('./js/3.2.3/map/province/zhejiang.json')
    };


    echarts.registerMap('china', chinaJson);
    echarts.registerMap('world', wordJson);
    //获取当前语言的 省份语言包
    var i18nProvince = pagurian.locale.echarts[pagurian.language].china_province;
    //动态注册省份地图
    Object.keys(MAPPING_CHINA_PROVINCE_CONFIG).forEach(function (key) {
        echarts.registerMap(i18nProvince[key], MAPPING_CHINA_PROVINCE_CONFIG[key]);
    });
});
