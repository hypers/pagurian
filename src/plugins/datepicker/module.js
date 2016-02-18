define(function(require, exports, module) {

    require("./datepicker");
    require("./locale/en_US");
    require("./locale/zh_CN");

    var g = window;


    function DatePicker(selector, options, callback) {

        this.options = {
            format: 'yyyy-mm-dd',
            textFormat: 'YYYY-MM-DD', //moment 的格式
            language: pagurian.language || 'zh_CN',
            autoclose: true
        };

        this.init = function() {

            var that = this;
            var defaultDate;
            if (!jQuery().datepicker) {
                return;
            }

            var opt = $.extend(true, this.options, options);
            this.options.format = this.options.textFormat.toLocaleLowerCase();

            var picker = $(selector).datepicker(this.options);




            if (options && options.defaultDate) {
                if ($.isArray(options.defaultDate)) {
                    defaultDate = [];
                    defaultDate.push(moment(options.defaultDate[0]));
                    defaultDate.push(moment(options.defaultDate[1]));
                } else {
                    defaultDate = moment(options.defaultDate);
                }

                picker.each(function() {

                    if ($(this).hasClass("input-daterange") && $.isArray(defaultDate)) {
                        var $inputs = $(this).find("input[type='text']");
                        $inputs.eq(0).val(defaultDate[0].format(that.options.textFormat));
                        $inputs.eq(1).val(defaultDate[1].format(that.options.textFormat));
                    } else {

                        if ($(this).prop("tagName") === "INPUT") {
                            $(this).val(defaultDate.format(that.options.textFormat));
                        } else {
                            $(this).find("input[type='text']").val(defaultDate.format(that.options.textFormat));
                        }

                    }

                });
            }

            picker.on("changeDate", function(e) {
                if (typeof callback === "function") {
                    callback(moment(e.date).format(that.options.textFormat));
                }
            });

            return picker;

        };
    }

    g[PagurianAlias].datePicker = function(selector, options, callback) {
        var picker = new DatePicker(selector, options, callback);
        return picker.init();
    };


});
