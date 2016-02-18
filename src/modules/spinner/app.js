define(function(require, exports, module) {
    
    var app = require("../../lib/app");

    require("../../plugins/number-spinner/module");
    app.page.index = function() {
        //$p.spinner("#txt_spinner");
        //$p.spinner("#txt_spinner2");
    };

    module.exports = app;
});
