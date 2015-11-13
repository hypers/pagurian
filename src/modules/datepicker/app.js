define(function(require, exports, module) {

    var app = require('../../lib/app');

    require('../../plugins/daterangepicker/module');
    require('../../plugins/datetimepicker/module');
    require('../../plugins/datepicker/module');

    app.page.date = function() {
        $p.plugin.datePicker('#picker1', {
            defaultDate: moment(),
        }, function(date) {
            $p.com.alert(date);
        });

        $p.plugin.datePicker('#picker2', {
            defaultDate: moment(),
        }, function(date) {
            $p.com.alert(date);
        });

        $p.plugin.datePicker('#picker3', {
            defaultDate: [moment().subtract('days', 6), moment()],
        }, function(date) {
            $p.com.alert(date);
        });
    };

    app.page.daterange = function() {

        $p.plugin.dateRangePicker("#my_picker", {
            defaultDate: [moment().subtract('days', 6), moment()], //默认最近一周
        }, function(start, end) {
            $p.com.alert("开始时间：" + start + " , 结束时间：" + end);
        });

    };


    app.page.datetime = function() {

        $p.plugin.dateTimePicker('#picker1', {}, function(date) {
            $p.com.alert(date);
        });

        $p.plugin.dateTimePicker('#picker2', {
            defaultDate: moment(),
        }, function(date) {
            $p.com.alert(date);
        });

    };

    module.exports = app;

});
