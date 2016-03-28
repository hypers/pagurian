define(function(require, exports, module) {

    var g = window;
    var template = require("../tpl/dialog.tpl");

    function Dialog(selector, options) {


        var timer; //定时器，定时关闭消息提示
        var self = this;

        this.id = $p.tool.newId();
        this.language = {
            zh_CN: {
                title: "提示信息",
                buttonSubmit: "确定",
                buttonCancel: "取消",
                body: "你好，我是一个模式对话框。"
            },
            en_US: {
                title: 'Title',
                buttonSubmit: "Confirm",
                buttonCancel: "Cancel",
                body: "Hello, I am a dialog ."
            }
        };

        this.reset = function() {

            var $form = this.form;
            var $elements = $form.find("input,textarea");

            $elements.each(function() {
                if ($(this).attr('type') === "text" || $(this).attr('type') === "hidden" || $(this).get(0).tagName === "TEXTAREA") {
                    $(this).val("");
                }
            });

            $form.find(".help-block").each(function() {
                var tip = $(this).data("tip");
                if (tip) {
                    $(this).text(tip).addClass("tip");
                } else {
                    $(this).text("");
                }
            });

            this.container.find(".submit-waiting").html("");
            this.container.find(".modal-message").html("");
            this.container.find(".btn").removeClass("disabled").removeAttr("disabled");
            this.container.find(".form-group").removeClass("has-error");
            this.whisper.html("").show();
        };


        /**
         * 初始化
         * @param  {String} selector 选择器
         * @param  {Object} options 配置项
         * @return {Object}    Dialog
         */
        this.init = function() {

            options.id = this.id;

            //初始化模版
            this.htmlTpl = $p.tpl(template,
                $.extend(
                    this.language[$p.language || "zh_CN"],
                    options
                )
            );

            $("body").append(this.htmlTpl);
            this.container = $("#modal" + this.id);
            this.whisper = $("#whisper" + this.id);
            this.form = this.container.find("form");
            this.container.addClass(options.className);
            this.initEvent();

            if ($.isFunction(options.preload)) {
                options.preload(this);
            }

            return this;
        };


        this.initEvent = function() {


            if (selector) {
                //给按钮绑定事件
                $(document).delegate(selector, 'click', function() {
                    if ($(this).hasClass("disabled") || $(this).attr("disabled")) {
                        return;
                    }
                    var params = $(this).data("params");
                    var $form = self.form;

                    self.params = eval("(" + params + ")") || {};
                    self.show();
                    if ($.isFunction(options.initForm)) {
                        options.initForm(self, $form, self.params);
                    }
                });
            }

            //提交按钮绑定事件
            $("#btn_submit" + this.id).click(function() {

                var $form = self.form;
                var data = [];

                //jquery.validate 验证
                var failA = false;
                if ($form.length) {
                    data = $form.serializeArray();
                    failA = !$form.valid();
                }
                //自定义验证
                var failB = ($.isFunction(options.validate) && !options.validate(self, data, self.params));

                if (failA || failB) {
                    return false;
                }
                //提交表单数据
                if ($.isFunction(options.submit)) {
                    $(this).addClass("disabled").prop("disabled", true);
                    self.container.find(".submit-waiting").html('<i class="fa fa-spinner fa-spin"></i>');
                    options.submit(self, $form.serializeArray() || [], self.params);
                }
            });


            //取消按钮绑定事件
            $("#btn_cancel" + this.id).click(function() {
                if ($.isFunction(options.cancel)) {
                    options.cancel(self, self.params);
                }
            });
        };
        /**
         * 当点击提交按钮以后,按钮会处理禁用状态
         * 这个时候，你如果需要把按钮恢复正常状态，就需要调用complete方法
         * @return {Object}  Dialog
         */
        this.complete = function() {
            this.container.find(".submit-waiting").html('');
            this.container.find(".btn").removeClass("disabled").removeAttr("disabled");
            return this;
        };

        /**
         * 显示Dialog
         * @return {Object} Dialog
         */
        this.show = function() {

            this.reset();
            this.container.modal('show');

            //调整Modal的高度
            setTimeout(function() {
                var modalBody = self.container.find(".modal-body");
                var availableHeight = modalBody.height(); //modal 滚动高度
                var customHeight = 114;
                var footerHeight = 50;
                var headerHeight = 50;

                //页面的工作区域高度
                var contentHeight = $(window).height() - footerHeight - headerHeight - customHeight;
                if (availableHeight >= contentHeight) {
                    modalBody.css("max-height", contentHeight);
                }

                modalBody.scrollTop(0);
            }, 200);
            return this;
        };

        /**
         * 隐藏Dialog
         * @return {Object} Dialog
         */
        this.hide = function() {
            this.container.modal('hide');
            return this;
        };

        /**
         * 显示按钮旁边的提示信息
         * @param  {String} message 信息内容
         * @param  {String} type    信息类型：info,error
         * @return {Object}         Dialog
         */
        this.showWhisper = function(message, type) {

            var $whisper = this.whisper.html(message).show();
            var className = {
                info: "whisper-success",
                error: "whisper-error"
            };

            $whisper.removeClass().addClass("whisper " + className[type || "info"]);
            clearTimeout(timer);
            timer = setTimeout(function() {
                $whisper.html("").hide();
            }, 3000);

            return this;
        };

    }


    g[PagurianAlias].dialog = function(selector, options) {

        //当只传递一个参数的情况下，则不绑定click
        if (arguments.length === 1) {
            return new Dialog(null, arguments[0]).init();
        }

        return new Dialog(selector, options).init();
    };

});
