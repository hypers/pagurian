define(function(require, exports, module) {


    var service = pagurian.lib.service;
    var api = pagurian.lib.api;



    function Model() {


        //获取数据列表
        this.getUser = function(id, params, callback) {
            params = params || {};
            params.id = id;
            service.get(api.user, params, callback);
            return this;
        };

        //更新用户信息
        this.update = function(id, params, callback) {
            params = params || {};
            params.id = id;
            service.post(api.succeed, params, callback);
            return this;
        };


    }

    module.exports = new Model();

});