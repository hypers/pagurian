/**
 * Created by yangguo on 2015/10/13 0013.
 */
define(function(require, exports, module) {
    var app = require("../../lib/app");
    var model = require('./model');

    //require('../../plugins/select2/select2.js');
    //require('../../plugins/select2/css/select2.css');
    require('../../plugins/select2/modal');

    app.page.index = function() {
        var select2 = $p.select2('#textSelect',{
            placeholder: "添加分类",
            tags: true,
            tokenSeparators: [',', ' ']
        });
        console.log(select2);
    };
    module.exports = app;
});
