define(function(require, exports, module) {

    //直接在页面中引入,因为Grunt uglify 执行太慢了
    //require("plugins/echarts/loader"); //基础包（不含map）
    //require("plugins/echarts/loader-map"); //完整包

    var g = window;
    var locale = {
        zh_CN: require('./locale/zh_CN'),
        en_US: require('./locale/en_US')
    };
    var activeLocale = locale[pagurian.language || "zh_CN"];

    var cities;


    var chartOptions = {
        line: require('./chart/line'),
        pie: require('./chart/pie'),
        bar: require('./chart/bar'),
        map: require('./chart/map'),
    };

    function Echarts(seletor, options) {

        this.version = "0.1.1208";
        this.options = {
            backgroundColor: '#f5f5f5',
            color: ['#fe8463', '#9bca63', '#fad860', '#60c0dd', '#0084c6', '#d7504b', '#c6e579', '#26c0c0', '#f0805a', '#f4e001', '#b5c334'],
        };


        var provinces = $p.locale.echartsChinaProvince;
        var cities = $p.locale.echartsChinaCity;
        var nameMapCity = {};
        var nameMapProvince = provinces;
        var options_all;

        this.init = function() {

            this.id = seletor;
            $.extend(true, this.options, options);
            this.chart = echarts.init(document.getElementById(seletor));
            this.chart.showLoading({
                text: activeLocale.loading
            });

            var key;

            if (pagurian.language == "en_US") {
                for (key in cities) {
                    nameMapCity[cities[key]] = key;
                }

            }

            if (pagurian.language == "zh_CN") {
                for (key in provinces) {
                    nameMapProvince[provinces[key]] = provinces[key];
                }
            }
        };

        this.message = function(status, message) {

            this.chart.hideLoading();
            this.chart.clear();
            var icon = "icon-info icon-big";
            var msg = message || activeLocale.empty;

            if (status === "timeout") {
                icon = "icon-exclamation-circle icon-big red";
                msg += "<br/><a class='btn btn-default' id='btn_reload'>" + activeLocale.search_reset + "</a>";
            }
            if (status === "empty") {

            }
            if (status === "error") {
                icon = "icon-exclamation-circle icon-big red";
            }
            if ($("#" + seletor + ".chart-message").length > 0) {
                $(".chart-message").html("<h3><i class='icon " + icon + "' ></i> " + msg + "</h3>");
                return;
            }
            $("#" + this.id).append("<div class='chart-message'><h3><i class='icon " + icon + "' ></i> " + msg + "</h3></div>");

            return this;
        };


        this.load = function(data, options) {
            $("#" + seletor + " .chart-message").remove();

            //如果没有 type 参数，
            //则直接setOption 采用Echart自己的参数
            if (!this.options.type) {
                this.chart.hideLoading();
                this.chart.clear();
                $.extend(true, this.options, data);
                this.chart.setOption(this.options);
                return;
            }

            var type = this.options.type;
            var _options = $.extend(true, {}, chartOptions[type](data), this.options);



            if (typeof options === "function") {
                options_all = options(_options);
            } else {
                options_all = $.extend(true, _options, options || {});
            }

            this.chart.hideLoading();
            this.chart.clear();
            this.chart.setOption(options_all);

            return this;
        };


        /**
         * 外部接口绑定事件
         * @param {Object} eventName 事件名称
         * @param {Object} eventListener 事件响应函数
         */
        this.on = function(eventName, eventListener) {
            this.chart.on(eventName, eventListener);
            return this;
        };

        /**
         * 设置属性
         * @param {Object} options
         */
        this.set = function(options) {
            this.chart.setOption($.extend(true, options_all, options), true);
        };


        this.selected = "china";
        this.onMapSelectedByChina = function(params) {

            var mapType = "china";

            if (nameMapProvince[params.target] && nameMapProvince[params.target] != this.selected) {
                mapType = nameMapProvince[params.target];
            }

            this.set({
                series: [{
                    mapType: mapType,
                    nameMap: nameMapCity,
                }]
            });

            this.selected = mapType;


        };

    }

    g[PagurianAlias].plugin.echarts = function(seletor, options) {
        var chart = new Echarts(seletor, options);
        chart.init();
        return chart;
    };

});
