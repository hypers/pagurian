define(function(require, exports, module) {

    var app = require("../../lib/app");
    require("../../plugins/number-spinner/module");

    app.page.index = function() {
        $p.numberSpinner("#txt_spinner", {
            change: function(data, entity) {
                console.log(data);
            }
        });
        $p.numberSpinner("#txt_spinner2", {
            min: -10,
            max: 100,
            step: 0.1,
            decimals: 2,
            boostat: 5,
            maxboostedstep: 10
        });

    };

    module.exports = app;
});
