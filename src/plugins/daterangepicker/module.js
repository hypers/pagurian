define(function(require, exports, module) {

    require("./1.2/daterangepicker.css");
    require("./1.2/daterangepicker");

    var g = window;

    function DateRangePicker(selector, options, callback) {

        var defaultStartDate, defaultEndDate;
        if (options && options.defaultDate && $.isArray(options.defaultDate)) {
            defaultStartDate = options.defaultDate[0];
            defaultEndDate = options.defaultDate[1];
        }

        var momentStartDate = defaultStartDate ? moment(defaultStartDate) : moment().subtract('days', 6);
        var momentEndDate = defaultEndDate ? moment(defaultEndDate) : moment();


        var _options = {
            en_US: {
                opens: 'right',
                format: 'YYYY-MM-DD',
                textForamt: 'YYYY-MM-DD',
                separator: ' -- ',
                startDate: momentStartDate.format("YYYY-MM-DD"),
                endDate: momentEndDate.format('YYYY-MM-DD'),
                maxDate: moment().subtract('days', -1).format("YYYY-MM-DD"),
                applyClass: 'green',
                ranges: {
                    'Today': [moment(), moment()],
                    'Yesterday': [moment().subtract('days', 1), moment().subtract('days', 1)],
                    'Last Week': [moment().subtract('days', 6), moment()],
                    'Last Month': [moment().subtract('month', 1), moment()],
                    'Last 3 Months': [moment().subtract('month', 3), moment()],
                    'Last 6 Months': [moment().subtract('month', 6), moment()]
                },
                locale: {
                    applyLabel: 'Confirm',
                    cancelLabel: 'Cancel',
                    fromLabel: 'From',
                    toLabel: 'To',
                    customRangeLabel: 'Custom',
                    daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                    monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                    firstDay: 1
                }
            },
            zh_CN: {
                opens: 'right',
                format: 'YYYY-MM-DD',
                textForamt: 'YYYY-MM-DD',
                separator: ' -- ',
                startDate: momentStartDate.format("YYYY-MM-DD"),
                endDate: momentEndDate.format('YYYY-MM-DD'),
                maxDate: moment().subtract('days', -1).format("YYYY-MM-DD"),
                applyClass: 'green',
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
                }
            }
        };

        this.options = _options[pagurian.language || "zh_CN"];

        this.setValue = function(startDate, endDate) {

            var value = [
                startDate.format(this.options.textForamt),
                this.options.separator,
                endDate.format(this.options.textForamt)
            ].join("");

            if (this.container.find("input[type='text']").length) {
                this.container.find("input[type='text']").val(value);
            } else if (this.container.is("input[type='button']")) {
                this.container.val(value);
            } else {
                this.container.text(value);
            }
        };

        this.init = function() {

            var self = this;

            this.container = $(selector);
            $.extend(true, this.options, options);

            //今天 昨天 最近一周，最近一个月，最近三个月，最近半年
            this.container.daterangepicker(this.options, function(start, end) {
                $(this).foramt = self.options.textForamt;
                self.setValue(start, end);
                if ($.isFunction(callback)) {
                    callback(start.format(self.options.format), end.format(self.options.format));
                }
            });

            //设置默认值
            if (this.options.defaultDate) {
                this.setValue(momentStartDate, momentEndDate);
            }

            //文本框设置为只读
            $(selector).find('input[type=text]').prop("readonly", true);
            return this;
        };

    }


    g[PagurianAlias].dateRangePicker = function(selector, options, callback) {
        return new DateRangePicker(selector, options, callback).init();
    };

});
