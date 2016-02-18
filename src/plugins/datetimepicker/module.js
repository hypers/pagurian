define(function(require, exports, module) {
    require("./js/datetimepicker");
    require("./locale/en_US");
    require("./locale/zh_CN");

    var g = window;

    function DateTimePicker(selector, options, callback) {


        this.options = {
            format: 'yyyy-mm-dd hh:ii',
            textFormat: 'YYYY-MM-DD hh:mm', //moment 的格式
            language: pagurian.language || 'zh_CN',
            autoclose: true,
            pickerPosition: "bottom-right",
            minuteStep: 15
        };

        this.init = function() {

            var that = this;
            var defaultDate;

            if (!jQuery().datetimepicker) {
                return;
            }

            var opt = $.extend(true, this.options, options);
            var picker = $(selector).datetimepicker(this.options);


            if (options && options.defaultDate) {

                defaultDate = moment(options.defaultDate);

                picker.each(function() {
                    if ($(this).prop("tagName") === "INPUT") {
                        $(this).val(defaultDate.format(that.options.textFormat));
                    } else {
                        $(this).find("input[type='text']").val(defaultDate.format(that.options.textFormat));
                    }
                });
            }

            picker.on("changeDate", function(e) {
                var data;

                if (typeof callback === "function") {
                    data = e.currentTarget.value || $(e.currentTarget).find("input[type='text']").val();
                    callback(data, e);
                }

            });

            return picker;

        };

    }

    g[PagurianAlias].dateTimePicker = function(selector, options, callback) {
        var picker = new DateTimePicker(selector, options, callback);
        return picker.init();
    };


});
