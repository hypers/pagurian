define(function(require, exports, module) {

    require("./datepicker");
    require("./locale/en_US");
    require("./locale/zh_CN");

    var g = window;


    function DatePicker(selector, options, callback) {

        var defaultDate;
        var textFormat = "YYYY-MM-DD";

        if (options && options.defaultDate) {
            defaultDate = moment(options.defaultDate);
        }

        this.options = {
            format: 'yyyy-mm-dd',
            textFormat: textFormat,
            language: pagurian.language || 'zh_CN',
            autoclose: true
        };

        this.init = function() {

            var o = this;
            if (!jQuery().datepicker) {
                return;
            }

            var opt = $.extend(true, this.options, options);
            this.options.format = this.options.textFormat.toLocaleLowerCase();

            var picker = $(selector).datepicker(this.options);

            if (defaultDate) {
                $(selector).val(defaultDate.format(this.options.textFormat));
            }

            picker.on("changeDate", function(e) {
                if (typeof callback === "function") {
                    callback(moment(e.date).format(o.options.textFormat));
                }
            });

            return picker;

        };
    }

    g[PagurianAlias].plugin.datePicker = function(seletor, options, callback) {
        var picker = new DatePicker(seletor, options, callback);
        return picker.init();
    };


});
