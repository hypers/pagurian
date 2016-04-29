define(function(require, exports, module) {

    var g = window;

    function Form(selector, options) {

        var self = this;
        this.options = {
            isAjaxRequest: true //是否ajax请求 默认true
        };

        this.init = function() {

            $.extend(true, this.options, options);

            this.disabled = false;
            this.container = (selector instanceof jQuery) ? selector : $(selector);
            this.submitButton = this.options.submitButton || this.container.find(".btn[type='submit']");

            //自定义submit 按钮
            if (!(this.submitButton instanceof jQuery)) this.submitButton = $(selector + " " + this.options.submitButton);


            this.reset(); //重置表单
            this.initValidationRules(); //初始化验证规则
            this.initEvent(); //初始化事件
            return this;
        };

        this.showLoading = function() {
            this.disabled = true;
            this.submitButton.addClass("disabled").prop("disabled", true);
            return this;
        };

        this.hideLoading = function() {
            this.disabled = false;
            this.submitButton.removeClass("disabled").removeAttr("disabled");
            return this;
        };

        this.initEvent = function() {

            //点击按钮提交
            this.submitButton.click(function() {
                if (self.disabled) return;
                self.submit();
            });

            //触发表单submit事件提交，如:表单回车
            this.container.submit(function() {
                if (self.disabled) return false;
                self.submit();
                return false;
            });
        };

        /**
         * 重置表单
         * @return {Object}  [this]
         */
        this.reset = function() {

            this.hideLoading();
            if (this.container[0].reset !== undefined) this.container[0].reset();

            this.container.find(".help-block").each(function() {
                var tip = $(this).data("tip");
                if (tip) {
                    $(this).text(tip).addClass("tip");
                } else {
                    $(this).empty();
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

            function getValue(name) {

                if (data[name]) {
                    return data[name];
                }
                //兼容老版本中的 parent.id 这种
                var split = (name+"").split(".");
                if ($.isPlainObject(data[split[0]])) {
                    return data[split[0]][split[1]];
                }
                return null;
            }

            function setValue($element, value) {
                if ($element.is("select")) {
                    $element.find("option[value='" + value + "']").prop("selected", true);
                } else if ($element.is(":radio")) {
                    $element.prop("checked", ($element.val() === value.toString()));
                    $.uniform.update($element);
                } else if ($element.is(":checkbox")) {
                    var checked = false;
                    //如果值是数组，在配置数组中的每个值 [xxx,yyy,zzz]
                    if ($.isArray(value)) {
                        for (var i = 0; i < value.length; i++) {
                            if ($element.val() === value[i].toString()) {
                                checked = true;
                            }
                        }
                    } else {
                        checked = ($element.val() === value.toString());
                    }

                    $element.prop("checked", checked);
                    $.uniform.update($element);
                } else {
                    //input-text input-hidden input-file textarea
                    $element.val(value);
                }
            }

            this.container.find("input,textarea,select").each(function(index) {
                var name = $(this).attr("name");
                var value = getValue(name);

                if (name && value !== null) {
                    setValue($(this), value);
                }
            });

            return this;
        };

        /**
         * 初始化验证规则
         * @return {Object} [this]
         */
        this.initValidationRules = function() {
            if (!this.container.validate) return false;
            var reserveOptions = {
                errorElement: 'span', //默认错误显示元素
                errorClass: 'help-block', //默认错误显示元素 class
                focusInvalid: true,
                ignore: "",
                rules: {},
                invalidHandler: function(event, validator) {}, //验证处理
                highlight: function(element) { //高亮回调
                    //$(element).closest('.form-group').addClass('has-error');
                },
                unhighlight: function(element) { //取消高亮回调
                    //$(element).closest('.form-group').removeClass('has-error');
                },
                success: function(label) { //验证通过
                    label.closest('.form-group').removeClass('has-error');
                },
                submitHandler: function(form) { //表单提交处理
                    return false;
                }
            };


            $.extend(reserveOptions, this.options.validate);
            this.container.validate(reserveOptions);

            return this;
        };

        /**
         * 表单提交
         * @return {Object}      [this]
         */
        this.submit = function() {

            this.showLoading();
            var data = this.container.serializeArray(); //表单数据
            var handleSubmit = this.options.submitModelEvent; //处理表单提交的API方法
            var handleSubmitParams = this.options.submitModelParams; //处理表单提交的参数
            var handleDataFormat = this.options.submitDataFormat; //格式化表单提交数据
            var handleSubmitError = this.options.submitError; //处理提交失败
            var handleSubmitSuccess = this.options.submitSuccess; //处理提交成功

            if (handleDataFormat !== undefined) data = handleDataFormat(data, this.container);

            if (!this.validate()) {
                setTimeout(function() {
                    self.hideLoading();
                }, 500);
                return false;
            }

            var params = [data, function(resp, valid) {
                self.complete();
                if (!valid) {
                    //表单提交成功处理
                    if (handleSubmitError !== undefined) handleSubmitError(resp, valid);
                    return;
                }
                //提交失败处理
                if (handleSubmitSuccess !== undefined) handleSubmitSuccess(resp, valid);
            }];

            if (handleSubmitParams !== undefined) params = handleSubmitParams.apply(this, params);
            if (handleSubmit !== undefined) handleSubmit.apply(this, params);
            if (this.options.isAjaxRequest) return false;

            return this;
        };

        /**
         * 获取表单数据
         */
        this.getFormData = function() {
            var data = this.container.serializeArray();
            //格式化表单提交数据
            var handleDataFormat = this.options.submitDataFormat;
            if (handleDataFormat !== undefined) data = handleDataFormat(data, this.container);
            return data;
        };


        /**
         * 触发表单验证
         * @return {bool}  true:验证通过, false:验证失败
         */
        this.validate = function() {

            var $form = this.container;
            var validate = this.options.validate;
            var failA = false; //jquery validate
            var failB = false; //custom validate
            var data = this.container.serializeArray(); //表单数据

            if ($form.valid !== undefined) failA = !$form.valid();
            if (validate && validate.custom !== undefined) failB = !validate.custom(data, $form);
            if (failA || failB) return false;

            return true;
        };

        /**
         * 表单处理完成
         */
        this.complete = function(data, valid) {
            this.hideLoading();
            return this;
        };

    }

    g[PagurianAlias].form = function(selector, options) {
        return new Form(selector, options).init();
    };

});
