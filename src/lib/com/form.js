define(function(require, exports, module) {

    var g = window;

    function Form(selector, options) {

        this.container = (selector instanceof jQuery) ? selector : $(selector);
        this.options = {
            isAjaxRequest: true, //是否ajax请求 默认true
            submitButton: this.container.find(".btn[type='submit']") //默认submit按钮

            //submitModelEvent  处理表单提交的API方法
            //submitModelParams 处理表单提交的参数
            //submitDataFormat 格式化表单提交数据
            //submitError 提交失败
            //submitSuccess 提交成功
        };

        this.init = function() {

            var that = this;
            var $btn_submit;

            $.extend(true, this.options, options);

            //自定义submit 按钮
            if (!(this.options.submitButton instanceof jQuery)) {
                this.options.submitButton = $(selector + " " + this.options.submitButton);
            }

            $btn_submit = this.options.submitButton;
            $btn_submit.data("text", $btn_submit.text());
            $btn_submit.click(function() {

                $(this).addClass("disabled");
                if (!that.container.valid()) {
                    that.complete();
                    return;
                }

                that.submit();
            });

            //初始化验证规则
            this.initValidationRules();

            return this;
        };

        /**
         * 重置表单
         * @return {Object}  [this]
         */
        this.reset = function() {

            this.container.find("input[type='text'],input[type='hidden'],input[type='file'],textarea").val("");
            this.container.find(".help-block").each(function() {
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

            /**
             * input-text, input-hidden ,input-file ,
             * input-checkbox, input-radio ,
             * textarea ,select
             */
            var $elements;

            function getValue(name) {
                if (data[name]) {
                    return data[name];
                }

                //兼容老版本中的 parent.id 这种
                var name_split = name.split(".");
                if ($.isPlainObject(data[name_split[0]])) {
                    return data[name_split[0]][name_split[1]];
                }

                return null;
            }


            $elements = this.container.find("input,textarea,select");
            $elements.each(function(index) {
                var $that = $(this);
                var name = $that.attr("name");
                if (!name) return;
                var value = getValue(name);
                if (value === null) return;

                if ($that.is("select")) {
                    //select
                    $that.find("option[value='" + value + "']").prop("selected", true);
                } else if ($that.attr("type") === "radio") {
                    //input radio
                    $that.prop("checked", ($that.val() === value.toString()));

                    $.uniform.update($that);
                } else if ($that.attr("type") === "checkbox") {
                    //input checkbox

                    var checked = false;
                    //如果值是数组，在配置数组中的每个值 [xxx,yyy,zzz]
                    if ($.isArray(value)) {
                        for (var i = 0; i < value.length; i++) {
                            if ($that.val() === value[i].toString()) {
                                checked = true;
                            }
                        }
                    } else {
                        checked = ($that.val() === value.toString());
                    }

                    $that.prop("checked", checked);
                    $.uniform.update($that);

                } else {
                    //input-text input-hidden input-file textarea
                    $that.val(value);
                }
            });

        };

        /**
         * 初始化验证规则
         * @return {Object} [this]
         */
        this.initValidationRules = function() {

            if (!this.container.validate) {
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

            this.container.validate(_options);
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
            var data = that.container.serializeArray();
            //处理表单提交的API方法
            var handleSubmit = this.options.submitModelEvent;
            //处理表单提交的参数
            var handleSubmitParams = this.options.submitModelParams;
            //格式化表单提交数据
            var handleDataFormat = this.options.submitDataFormat;
            if ($.isFunction(handleDataFormat)) {
                data = handleDataFormat(data, that.container);
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
                    if ($.isFunction(handleSubmitError)) {
                        handleSubmitError(resp, valid);
                    }
                    return;
                }
                //提交失败处理
                if ($.isFunction(handleSubmitSuccess)) {
                    handleSubmitSuccess(resp, valid);
                }
            }];

            //触发自定义表单验证
            if ($.isFunction(that.options.validate.custom)) {
                valid = that.options.validate.custom(data, that.container);
            }

            //提交表单
            if (!$.isFunction(handleSubmit)) {
                $p.log("submitModelEvent is undefined");
                return false;
            }

            if (valid) {
                if (handleSubmitParams) {
                    submitParams = handleSubmitParams.apply(this, submitParams);
                }
                handleSubmit.apply(this, submitParams);
            } else {
                //如果验证失败,重置按钮状态
                that.complete();
            }

            if (this.options.isAjaxRequest) {
                return false;
            }

            return this;
        };

        /**
         * 获取表单数据
         */
        this.getFormData = function() {
            var data = this.container.serializeArray();
            //格式化表单提交数据
            var handleDataFormat = this.options.submitDataFormat;
            if ($.isFunction(handleDataFormat)) {
                data = handleDataFormat(data, this.container);
            }
            return data;
        };


        /**
         * 触发表单验证
         * @return {bool}     true:验证通过, false:验证失败
         */
        this.validate = function(eventName) {

            var valid = this.container.valid();

            if (!valid) {
                return false;
            }

            if ($.isFunction(this.options.validate.custom)) {
                var data = this.container.serializeArray();
                //格式化表单提交数据
                var handleDataFormat = this.options.submitDataFormat;
                if ($.isFunction(handleDataFormat)) {
                    data = handleDataFormat(data, this.container);
                }
                valid = this.options.validate.custom(data, this.container);
            }
            return valid;
        };

        /**
         * 表单处理完成
         */
        this.complete = function(data, valid) {

            var $btn_submit = this.options.submitButton;

            $btn_submit.removeClass("disabled");
            $btn_submit.removeAttr("disabled");
            $btn_submit.data("disabled", false);

            return this;
        };

    }

    g[PagurianAlias].form = function(selector, options) {
        return new Form(selector, options).init();
    };

});
