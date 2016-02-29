define(function(require, exports, module) {

    var app = require("../../lib/app");
    require('../../plugins/zeroclipboard/module');

    app.page.index = function() {


        $p.copy("#btn_copy", {
            copy: function(event) {
                return $("#txa_content").val();
            },
            afterCopy: function(event) {
                var data = event.data["text/plain"];
                $p.log(data);
            }
        });
    };

    module.exports = app;
});
