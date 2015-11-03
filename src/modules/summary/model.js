/**
 * Created by yangguo on 2015/9/9 0009.
 */
define(function(require, exports, module) {


    var service = pagurian.lib.service;
    var api = pagurian.lib.api;



    function Model() {
        //获取数据列表
        this.getSummaryData = function(params, callback) {
            service.get(api.summaryData, params, callback);
        };
    }

    module.exports = new Model();

});
