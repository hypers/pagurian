define(function(require, exports, module) {

    var app = require('../../lib/app');
    require('../../plugins/daterangepicker/module');

    require('../../plugins/datepicker/module');

    app.page.daterange = function() {

        $p.ui.dateRangePicker("#my_picker", {
            textForamt: "YYYY年MM月DD日"
        }, function(begin, end) {
            $p.ui.alert("开始时间：" + begin + " , 结束时间：" + end);
        });

    }
    app.page.date = function() {

        $p.ui.datePicker('#my_picker', {
            format: "yyyy年mm月dd日"
        }, function(date) {
            $p.ui.alert(date);
        });
    }


    module.exports = app;

});