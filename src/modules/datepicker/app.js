define(function(require, exports, module) {
    
    var app = require("../../lib/app");

    require('../../plugins/daterangepicker/module');
    require('../../plugins/datetimepicker/module');
    require('../../plugins/datepicker/module');

    app.page.date = function() {
        $p.datePicker('#picker1', {
            defaultDate: moment(),
        }, function(date) {
            $p.alert(date);
        });

        $p.datePicker('#picker2', {
            defaultDate: moment(),
        }, function(date) {
            $p.alert(date);
        });

        $p.datePicker('#picker3', {
            defaultDate: [moment().subtract('days', 6), moment()],
        }, function(date) {
            $p.alert(date);
        });
    };

    app.page.daterange = function() {

        $p.dateRangePicker("#picker", {
            defaultDate: [moment().subtract('days', 6), moment()], //默认最近一周
        }, function(start, end) {
            $p.alert(start + " - " + end);
        });

    };

    app.page.datetime = function() {

        $p.dateTimePicker('#picker1', {}, function(date) {
            $p.alert(date);
        });

        $p.dateTimePicker('#picker2', {
            defaultDate: moment(),
        }, function(date,e) {
            $p.alert(date);
        });

    };

    module.exports = app;

});
