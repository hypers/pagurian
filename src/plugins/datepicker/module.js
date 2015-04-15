define(function(require, exports, module) {

    require("./datepicker.js");

    var g = window;

    $.fn.datepicker.dates['zh-CN'] = {
        days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
        daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
        daysMin: ["日", "一", "二", "三", "四", "五", "六", "日"],
        months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        monthsShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        today: "今日",
        format: "yyyy年mm月dd日",
        weekStart: 1
    };

    function DatePicker(selector, options, callback) {
        
        this.options = {
            format: 'yyyy-mm-dd',
            language: 'zh-CN',
            autoclose: true
        };
        this.init = function() {

            if (!jQuery().datepicker) {
                return;
            }


            var opt = $.extend(true, this.options, options);
            var picker = $(selector).datepicker(this.options);

            picker.on("changeDate", function(e) {
                if (typeof callback === "function") {
                    callback(moment(e.date).format("YYYY-MM-DD"));
                }
            });

            return picker;

        }
    }

    g[PagurianAlias].ui.datePicker = function(seletor, options, callback) {
        var picker = new DatePicker(seletor, options, callback);
        return picker.init();
    }


});