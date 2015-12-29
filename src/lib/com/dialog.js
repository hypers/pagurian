define(function(require, exports, module) {

    var g = window;
    var template = require("../tpl/dialog.tpl");

    function Dialog() {


        var timer; //定时器，定时关闭消息提示
        var _id = '_' + (Math.random() * 1E18).toString(36).slice(0, 5).toUpperCase();

        /**
         * 重置表单,情况表单中的值
         */
        function resetForm(form) {

            var form_element_list = form.find("input,textarea");
            form_element_list.each(function() {
                if ($(this).attr('type') === "text" || $(this).attr('type') === "hidden" || $(this).get(0).tagName === "TEXTAREA") {
                    $(this).val("");
                }
            });

            form.find(".help-block").each(function() {
                var tip = $(this).data("tip");
                if (tip) {
                    $(this).text(tip).addClass("tip");
                } else {
                    $(this).text("");
                }
            });
        }

        this.language = {
            zh_CN: {
                title: "提示信息",
                btn_submit: "确定",
                btn_cancel: "取消",
                body: "你好，我是一个模式对话框。"
            },
            en_US: {
                title: 'Title',
                btn_submit: "Confirm",
                btn_cancel: "Cancel",
                body: "Hello, I am a dialog ."
            }
        };

        /**
         * 初始化
         * @param  {String} seletor 选择器
         * @param  {Object} options 配置项
         * @return {Object}    Dialog
         */
        this.init = function(seletor, options) {

            var modal = this;

            this.id = _id;
            options.id = _id;

            //初始化模版
            this.tpl = $p.tpl(template, $.extend(this.language[$p.language || "zh_CN"], options));

            $("body").append(this.tpl);

            var form = $("#modal" + _id + " form");
            if (seletor) {
                //给按钮绑定事件
                $(document).delegate(seletor, 'click', function() {
                    var params = $(this).data("params");
                    modal.params = eval("(" + params + ")") || {};
                    modal.show();
                    if ($.isFunction(options.initForm)) {
                        options.initForm(modal, form, modal.params);
                    }
                });
            }

            this.element = $("#modal" + _id);

            //提交按钮绑定事件
            this.submitButton = $("#btn_submit" + _id).click(function() {

                var data = form.serializeArray() || [];
                //jquery.validate 验证表单
                if (form.length && $.isFunction(form.valid) && !form.valid()) {
                    return false;
                }

                //手动验证表单
                if (form.length && typeof $.isFunction(options.validate) && !options.validate(modal, data, modal.params)) {
                    return false;
                }

                //提交表单数据
                if ($.isFunction(options.submit)) {
                    $(this).addClass("disabled").prop("disabled", true);
                    $("#modal" + _id + " .submit-waiting").html('<i class="fa fa-spinner fa-spin"></i>');
                    options.submit(modal, form.serializeArray() || [], modal.params);
                }

            });

            //取消按钮绑定事件
            this.cancelButton = $("#btn_cancel" + _id).click(function() {
                if ($.isFunction(options.cancel)) {
                    options.cancel(modal, modal.params);
                }
            });

            return this;
        };

        /**
         * 当点击提交按钮以后,按钮会处理禁用状态
         * 这个时候，你如果需要把按钮恢复正常状态，就需要调用complete方法
         * @return {Object}  Dialog
         */
        this.complete = function() {
            $("#modal" + _id + " .submit-waiting").html('');
            $('#modal' + _id + " .btn").removeClass("disabled").removeAttr("disabled");

            return this;
        };

        /**
         * 显示Dialog
         * @return {Object} Dialog
         */
        this.show = function() {

            resetForm($("#modal" + _id + " form"));
            $('#modal' + _id + " .submit-waiting").html("");
            $('#modal' + _id + " .modal-message").html("");
            $('#modal' + _id + " .btn").removeClass("disabled").removeAttr("disabled");
            $('#modal' + _id + " .form-group").removeClass("has-error");
            $('#modal' + _id).modal('show');
            $("#whisper" + _id).html("").show();

            //调整Modal的高度
            setTimeout(function() {

                var modal_body = $('#modal' + _id + ' .modal-body');
                //modal 滚动高度
                var available_height = modal_body.height();

                // $('#modal' + _id + ' .modal-footer') + $('#modal' + _id + ' .modal-footer');
                var custom_height = 114;
                // $('.footer').outerHeight()
                var footer_height = 50;
                //$('.header').outerHeight()
                var header_height = 50;

                //页面的工作区域高度
                var content_height = $(window).height() - footer_height - header_height - custom_height;

                if (available_height >= content_height) {
                    modal_body.css("max-height", content_height);
                }

            }, 200);

            return this;
        };

        /**
         * 隐藏Dialog
         * @return {Object} Dialog
         */
        this.hide = function() {
            $('#modal' + _id).modal('hide');
            return this;
        };

        /**
         * 显示按钮旁边的提示信息
         * @param  {String} message 信息内容
         * @param  {String} type    信息类型：info,error
         * @return {Object}         Dialog
         */
        this.showWhisper = function(message, type) {

            var $whisper = $("#whisper" + _id).html(message).show();
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

    /**
     *
     */
    g[PagurianAlias].dialog = function(seletor, options) {

        //当只传递一个参数的情况下，则不绑定click
        if (arguments.length === 1) {
            return new Dialog().init(null, arguments[0]);
        }

        return new Dialog().init(seletor, options);
    };

});
