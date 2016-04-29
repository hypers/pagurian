define(function(require, exports, module) {

    var app = require("../../lib/app");
    require('../../plugins/clipboard/module');

    app.page.index = function() {
        $p.clipboard("#btn_copy", {
            copy: function(event) {
                return $("#txt_content").val();
            },
            afterCopy: function(data) {
                $p.log(data);
            }
        });
    };

    module.exports = app;
});
