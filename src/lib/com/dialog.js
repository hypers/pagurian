define(function(require, exports, module) {

    var g = window;
    var template = require("../tpl/dialog.tpl");

    function Dialog(selector, options) {


        var timer; //定时器，定时关闭消息提示
        var self = this;

        function resize() {
            var scrollHeight = self.body.height(); //modal 滚动高度
            var overHeight = 214; //footer:50,  header:50, custom:114
            var contentHeight = $(window).height() - overHeight; //内容区域高度

            if (options.width) {
                //body.width(options.width);
                var padding = 36; // content css padding left + right
                self.content.width(options.width + padding);
                self.content.parent().width(options.width + padding);
            }

            if (scrollHeight >= contentHeight) {
                self.body.css("max-height", contentHeight);
            }
            self.body.scrollTop(0);
        }

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

            if (this.form) {
                this.form[0].reset();
                this.form.find(".help-block").each(function() {
                    var tip = $(this).data("tip");
                    if (tip) {
                        $(this).text(tip).addClass("tip");
                    } else {
                        $(this).empty();
                    }
                });
            }

            this.container.find(".submit-waiting").empty();
            this.container.find(".modal-message").empty();
            this.container.find(".btn").removeClass("disabled").removeAttr("disabled");
            this.container.find(".form-group").removeClass("has-error");
            this.whisper.empty().show();
        };


        /**
         * 初始化
         * @param  {String} selector 选择器
         * @param  {Object} options 配置项
         * @return {Object}    Dialog
         */
        this.init = function() {

            var dialogBody;
            if (!$p.tool.isString(options.body)) { // jQueryElement or Node
                dialogBody = options.body;
                options.body = '';
            }

            //初始化模版
            options.id = this.id;
            this.htmlTpl = $p.tpl(template,
                $.extend(
                    this.language[$p.language || "zh_CN"],
                    options
                )
            );
            $("body").append(this.htmlTpl);


            this.container = $("#modal" + this.id);
            this.whisper = $("#whisper" + this.id);
            this.form = this.container.find("form").length ? this.container.find("form") : null;
            this.body = this.container.find('.modal-body');
            this.content = this.container.find('.modal-content');
            this.submitButton = $("#btn_submit" + this.id);
            this.cancelButton = $("#btn_cancel" + this.id);
            this.container.addClass(options.className);

            if (dialogBody) {
                this.body.append(dialogBody);
            }

            this.initEvent();
            if (options.preload !== undefined) options.preload(this);

            return this;
        };


        this.showLoading = function() {
            this.submitButton.addClass("disabled").prop("disabled", true);
            this.container.find(".submit-waiting").html('<i class="fa fa-spinner fa-spin"></i>');
            return this;
        };

        this.hideLoading = function() {
            this.submitButton.removeClass("disabled").removeAttr("disabled");
            this.container.find(".submit-waiting").empty();
            return this;
        };

        this.submitForm = function() {

            var data;

            if (self.form) {
                data = self.form.serializeArray();
                //jquery.validate 验证
                var failA = (self.form.valid !== undefined) ? !self.form.valid() : false;
                //自定义验证
                var failB = (options.validate !== undefined) && !options.validate(self, data, self.params);

                if (failA || failB) return this;
            }

            //提交表单数据
            if (options.submit !== undefined) options.submit(self, data, self.params);

            this.showLoading();
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
                });
            }

            if (this.form) {
                this.form.submit(function() {
                    self.submitForm();
                    return false;
                });
            }

            //提交按钮绑定事件
            this.submitButton.click(function() {
                self.submitForm();
            });

            //取消按钮绑定事件
            this.cancelButton.click(function() {
                if (options.cancel !== undefined) options.cancel(self, self.params);
            });
        };
        /**
         * 当点击提交按钮以后,按钮会处理禁用状态
         * 这个时候，你如果需要把按钮恢复正常状态，就需要调用complete方法
         * @return {Object}  Dialog
         */
        this.complete = function() {
            this.hideLoading();
            return this;
        };

        /**
         * 显示Dialog
         * @return {Object} Dialog
         */
        this.show = function() {

            this.reset();
            this.container.modal('show');

            if (options.initForm !== undefined) options.initForm(this, this.form, this.params);
            //调整Modal的高度
            setTimeout(resize, 200);
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
                $whisper.empty().hide();
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
