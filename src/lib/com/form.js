define(function(require, exports, module) {


    var g = window;

    function Form(seletor, options) {



        this.element = (seletor instanceof jQuery) ? seletor : $(seletor);
        this.options = {
            isAjaxRequest: true, //是否ajax请求 默认true
            submitButton: $(seletor + " .btn[type='submit']") //默认submit按钮
        };

        this.init = function() {

            var that = this;
            //自定义submit 按钮
            if (options.submitButton && !(options.submitButton instanceof jQuery)) {
                options.submitButton = $(seletor + " " + options.submitButton);
            }

            $.extend(true, this.options, options);

            var $btn_submit = this.options.submitButton;
            $btn_submit.data("text", $btn_submit.text());
            $btn_submit.click(function() {

                $(this).addClass("disabled");
                //$(this).text($p.locale.loading);

                if (!that.element.valid()) {
                    that.complete();
                    return;
                }

                that.submit();
            });

            //初始化表单验证
            this.validation();

            return this;
        };

        /**
         * 重置表单
         * @return {Object}  [this]
         */
        this.reset = function() {

            var elements = this.element.find("input,textarea");
            elements.each(function() {
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

            return this;
        };

        /**
         * 表单赋值
         * @param  {Object} data [值]
         * @return {Object}      [this]
         */
        this.val = function(data) {

            var elements = this.element.find("input,textarea,select");
            elements.each(function() {

                var $that = $(this);
                for (var key in data) {

                    var name = $that.attr("name");
                    var sub_key = "";
                    if (!name) {
                        continue;
                    }
                    var a = name.split(".");
                    if (a.length > 1) {
                        name = a[0];
                        sub_key = a[1];
                    }

                    if (name === key && data[key]) {

                        if ($that.attr("type") == "checkbox" || $that.attr("type") == "radio") {

                            if ($that.val() == data[key]) {

                                $that.prop("checked", true);
                            } else {
                                $that.prop("checked", false);
                            }

                            $.uniform.update(o);
                            continue;
                        }

                        if ($that.is("select")) {
                            var v = data[key];
                            //如果取到的值是一个对象，则使用这个对象的ID作为key
                            if (typeof data[key] == "object") {
                                v = v[sub_key];
                            }
                            $that.find("option[value='" + v + "']").prop("selected", true);
                            continue;
                        }

                        if (sub_key) {
                            $that.val(data[key][sub_key]);
                            return;
                        }
                        $that.val(data[key]);
                    }
                }
            });

        };

        /**
         * 表单验证初始化
         * @return {Object} [this]
         */
        this.validation = function() {

            if (!this.element.validate) {
                return false;
            }
            var that = this;
            var _options = {
                errorElement: 'span', //默认错误显示元素
                errorClass: 'help-block', //默认错误显示元素 class
                focusInvalid: true, //do not focus the last invalid input
                ignore: "",
                rules: {},
                //验证处理
                invalidHandler: function(event, validator) {},
                //高亮回调
                highlight: function(element) {
                    //$(element).closest('.form-group').addClass('has-error');
                },
                //取消高亮回调
                unhighlight: function(element) {
                    //$(element).closest('.form-group').removeClass('has-error');
                },
                //验证通过
                success: function(label) {
                    label.closest('.form-group').removeClass('has-error');
                },
                //表单提交处理
                submitHandler: function(form) {

                    that.submit();
                    return false;
                }
            };

            $.extend(_options, this.options.validate);
            this.element.validate(_options);

            return this;
        };

        /**
         * 表单提交
         * @return {Object}      [this]
         */
        this.submit = function() {

            var that = this;
            //表单验证OK？
            var valid = true;
            //表单数据
            var data = that.element.serializeArray();
            //处理表单提交的API方法
            var handleSubmit = this.options.submitModelEvent;
            //处理表单提交的参数
            var handleSubmitParams = this.options.submitModelParams;
            //格式化表单提交数据
            var handleDataFormat = this.options.submitDataFormat;
            if ($p.tool.isFunction(handleDataFormat)) {
                data = handleDataFormat(data, that.element);
            }
            //处理提交失败
            var handleSubmitError = this.options.submitError;
            //处理提交成功
            var handleSubmitSuccess = this.options.submitSuccess;



            /**
             * 表单提交的参数
             * @param  {Object} resp  表单数据
             * @param  {Function} valid 验证结果
             */
            var submitParams = [data, function(resp, valid) {
                that.complete();
                if (!valid) {
                    //表单提交成功处理
                    if ($p.tool.isFunction(handleSubmitError)) {
                        handleSubmitError(resp, valid);
                    }
                    return;
                }
                //提交失败处理
                if ($p.tool.isFunction(handleSubmitSuccess)) {
                    handleSubmitSuccess(resp, valid);
                }
            }];

            //触发自定义表单验证
            if ($p.tool.isFunction(that.options.validate.custom)) {
                valid = that.options.validate.custom(data, that.element);
            }

            //提交表单
            if (!$p.tool.isFunction(handleSubmit)) {
                p.log("submitModelEvent is undefined");
                return false;
            }

            if (valid) {
                if (handleSubmitParams) {
                    submitParams = handleSubmitParams.apply(this, submitParams);
                }
                handleSubmit.apply(this, submitParams);
            }

            if (this.options.isAjaxRequest) {
                return false;
            }

            return this;
        };

        this.complete = function(data, valid) {

            var $btn_submit = this.options.submitButton;
            $btn_submit.removeClass("disabled").removeAttr("disabled").data("disabled", false);
            //$btn_submit.text($btn_submit.data("text"));
        };

    }

    g[PagurianAlias].com.form = function(seletor, options) {
        return new Form(seletor, options).init();
    };

});
