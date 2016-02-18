define(function(require, exports, module) {

    var app = require("../../lib/app");

    require('../../plugins/uploader/module');

    //文件上传
    app.page.index = function() {


        var uploader = $p.uploader("#btn_uploader", {
            server: '/src/plugins/uploader/0.1.5/fileupload.php'
        });

        uploader.on('uploadSuccess', function(file) {
            $("#table_files").append([
                "<tr>",
                    "<td><a>" + file.name + "</a></td>",
                    "<td>" + file.size + "</td>",
                "</tr>"
            ].join(""));
        });
    };

    module.exports = app;
});
