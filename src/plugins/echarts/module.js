define(function(require, exports, module) {

    //直接在页面中引入,因为Grunt uglify 执行太慢了
    //require("plugins/echarts/loader"); //基础包（不含map）
    //require("plugins/echarts/loader-map"); //完整包

    var g = window;
    var locale = {},
        activeLocale;
    var chartOptions = require('./options');

    locale.zh_CN = require('./locale/zh_CN');
    locale.en_US = require('./locale/en_US');

    activeLocale = locale[pagurian.language || "zh_CN"];

    function Echarts(seletor, options) {
        this.options = {
            backgroundColor: '#f5f5f5',
            color: ['#fe8463', '#9bca63', '#fad860', '#60c0dd', '#0084c6', '#d7504b', '#c6e579', '#26c0c0', '#f0805a', '#f4e001', '#b5c334'],
        };
        this.init = function() {
            this.id = seletor;
            $.extend(true, this.options, options);
            this.chart = echarts.init(document.getElementById(seletor));
            this.chart.showLoading({
                text: activeLocale.loading
            });
        };

        this.message = function(status, message) {

            this.chart.hideLoading();
            this.chart.clear();
            var icon = "fa-info-circle";
            var msg = message || activeLocale.empty;

            if (status == "timeout") {
                icon = "fa-exclamation-circle fa-red";
                msg += "<br/><a class='btn btn-default' id='btn_reload'>" + activeLocale.search_reset + "</a>";
            }
            if (status == "empty") {

            }
            if (status == "error") {
                icon = "fa-exclamation-circle fa-red";
            }
            if ($(".chart-message").length > 0) {
                $(".chart-message").html("<h3><i class='fa " + icon + "' ></i> " + msg + "</h3>");
                return;
            }
            $("#" + this.id).append("<div class='chart-message'><h3><i class='fa " + icon + "' ></i> " + msg + "</h3></div>");

            return this;
        };

        this.load = function(data) {

            $(".chart-message").remove();

            var type = this.options.type || "line";
            var options = $.extend(true, {}, this.options, chartOptions[type](data));

            this.chart.hideLoading();
            this.chart.clear();
            this.chart.setOption(options);

            return this;
        };

        /**
         * 外部接口绑定事件
         * @param {Object} eventName 事件名称
         * @param {Object} eventListener 事件响应函数
         */
        this.on = function(eventName,eventListener){
            this.chart.on(eventName,eventListener);
            return this;
        }
    }

    g[PagurianAlias].plugin.echarts = function(seletor, options) {
        var chart = new Echarts(seletor, options);
        chart.init();
        return chart;
    };

});
