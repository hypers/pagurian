define(function(require, exports, module) {

    var app = require('../../lib/app');

    //require('../../plugins/backstretch/jquery.backstretch');
    app.page.index = function() {
       /* $.backstretch([
            "../resources/img/bg/1.jpg",
            "../resources/img/bg/2.jpg"
        ], {
            fade: 1000,
            duration: 10000
        });*/
    }

    module.exports = app;
});