define(function(require, exports, module) {

    var app = require('../../lib/app');
    require('../../plugins/daterangepicker/module');

    app.page.index = function() {

        $p.ui.dateRangePicker("#my_picker", {
            textForamt: "YYYY年MM月DD日"
        }, function(begin, end) {
            $p.ui.alert("开始时间：" + begin + " , 结束时间：" + end);
        });

    }


    module.exports = app;

});