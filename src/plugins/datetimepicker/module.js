define(function(require, exports, module) {
    require("./js/datetimepicker");
    require("./locale/en_US");
    require("./locale/zh_CN");

    var g = window;

    function DateTimePicker(selector, options, callback) {

        var defaultDate;
        var textFormat = "YYYY-MM-DD hh:mm"; //moment 的格式

        if (options && options.defaultDate) {
            defaultDate = moment(options.defaultDate);
        }

        this.options = {
            format: 'yyyy-mm-dd hh:ii',
            textFormat: textFormat,
            language: pagurian.language || 'zh_CN',
            autoclose: true,
            pickerPosition: "bottom-right",
            minuteStep: 15
        };

        this.init = function() {

            var o = this;
            if (!jQuery().datetimepicker) {
                return;
            }

            var opt = $.extend(true, this.options, options);
            var picker = $(selector).datetimepicker(this.options);

            picker.on("changeDate", function(e) {
                var data;

                if (typeof callback === "function") {
                    data = e.currentTarget.value || $(e.currentTarget).find("input[type='text']").val();
                    callback(data);
                }

            });

            return picker;

        };

    }

    g[PagurianAlias].plugin.dateTimePicker = function(seletor, options, callback) {
        var picker = new DateTimePicker(seletor, options, callback);
        return picker.init();
    };


});
