/**
 * Created by hypers-godfery on 2015-10-28.
 */
define(function (require, exports, module) {
        var g = window,
            locale = {};
        locale.zh_CN = require('./locale/zh_CN');
        locale.en_US = require('./locale/en_US');
        var oLanguage = locale[g[PagurianAlias].language || "zh_CN"];

        /**
         * [Sizer 筛选器类]
         * @param {[type]} selector [选择器]
         * @param {[type]} options [参数]
         */
        function Summary(selector, options) {
            var o = this,
                _nameStr = "summary",
                _id = '_' + (Math.random() * 1E18).toString(36).slice(0, 5).toUpperCase();
            //版本
            this.version = "2015.10.28.1626";
            //id
            this.sizerName = _nameStr + _id;
            //提示文字
            this.promtText = "";
            //参数
            this.params = {};
            //全部可用数据
            this.allDatas = [];
            //已选数据
            this.selectDatas = [];
            //是否需要载入
            this.needLoad = true;

            this.options = {};

            /**
             * 初始化组件
             */
            var init = function () {
                o.options = $.extend(o.options, options);
                bindEvent(selector, options);
                drawDom(selector, options);
            };

            /**
             * 绘制组件
             * @param selector
             * @param options
             */
            var drawDom = function (selector, options) {

            }

            /**
             * 绑定事件
             * @param selector
             * @param options
             */
            var bindEvent = function (selector, options) {

            }

            init();
        }

        /**
         * [Sizer 筛选器类]
         * @param {[type]} selector [选择器]
         * @param {[type]} options [参数]
         * @param {[type]} chooseDatas [选中的选项]
         */
        g[PagurianAlias].plugin.summary = function (seletor, options) {
            var summary = new Summary(seletor, options);
            return summary;
        };
    }
);
