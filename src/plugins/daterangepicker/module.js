define(function(require, exports, module) {

    require("./daterangepicker.js");
    var daterangepicker = {

        init: function(selector, options, callback) {
            if (!jQuery().daterangepicker) {
                return;
            }

            var momentStartDate = $.cookie("param.begin") ? moment($.cookie("param.begin")) : moment().subtract('days', 6);
            var momentEndDate = $.cookie("param.end") ? moment($.cookie("param.end")) : moment();


            //今天 昨天 最近一周，最近一个月，最近三个月，最近半年
            $(selector).daterangepicker({
                opens: 'right',
                format: 'YYYY-MM-DD',
                separator: ' -- ',
                startDate: momentStartDate.format("YYYY-MM-DD"),
                endDate: momentEndDate.format('YYYY-MM-DD'),
                maxDate: moment().format("YYYY-MM-DD"),
                ranges: {
                    '今天': [moment(), moment()],
                    '昨天': [moment().subtract('days', 1), moment().subtract('days', 1)],
                    '最近一周': [moment().subtract('days', 6), moment()],
                    '最近一个月': [moment().subtract('month', 1), moment()],
                    '最近三个月': [moment().subtract('month', 3), moment()],
                    '最近半年': [moment().subtract('month', 6), moment()]
                },
                locale: {
                    applyLabel: '确定',
                    cancelLabel: '取消',
                    fromLabel: '开始',
                    toLabel: '结束',
                    customRangeLabel: '自定义',
                    daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
                    monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
                },
                applyClass: 'green'
            }, function(start, end) {
                $(selector).find('input').val(start.format('YYYY年MM月DD日') + ' -- ' + end.format('YYYY年MM月DD日'));
                if ("function" === typeof callback) callback(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
            });

            //默认现在当前一周
            $(selector).find('input').val(momentStartDate.format("YYYY年MM月DD日") + ' -- ' + momentEndDate.format("YYYY年MM月DD日"));
            $(selector).find('input').prop("readonly", true);
            return $(selector);
        }
    }

    module.exports = daterangepicker;
});