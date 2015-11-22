define(function(require, exports, module) {

    var app = require('../../lib/app');

    require("../../plugins/ion-range-slider/module");
    app.page.index = function() {
        $p.plugin.slider("#range",{
            from:10
        });

        $p.plugin.slider("#range2", {
            type: "double",
            grid: true,
            min: 0,
            max: 1000,
            from: 200,
            to: 800,
            prefix: "$"
        });

        $p.plugin.slider("#range3",{
            grid: true,
            from: 3,
            force_edges:true,
            values: [
                "January", "February", "March",
                "April", "May", "June",
                "July", "August", "September",
                "October", "November", "December"
            ]
        });

    };

    module.exports = app;
});
