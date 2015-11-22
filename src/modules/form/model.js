define(function(require, exports, module) {


    var service = pagurian.lib.service;
    var api = pagurian.lib.api;



    function Model() {

        this.add = function(params, callback) {
            service.get(api.succeed, params, callback);
            return this;
        };


    }

    module.exports = new Model();

});