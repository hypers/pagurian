define(function(require, exports, module) {


    var g = window;

    function Form(seletor, options) {

        if (seletor instanceof jQuery) {
            this.element = seletor;
        } else {
            this.element = $(seletor);
        }

        this.options = {};

        this.init = function() {
            $.extend(true, this.options, options);
            this.validation();
        };

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

        this.val = function(data) {

            var elements = this.element.find("input,textarea,select");
            elements.each(function() {

                var o = $(this);
                for (var key in data) {

                    var name = o.attr("name");
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

                        if (o.attr("type") == "checkbox" || o.attr("type") == "radio") {

                            if (o.val() == data[key]) {

                                o.prop("checked", true);
                            } else {
                                o.prop("checked", false);
                            }

                            $.uniform.update(o);
                            continue;
                        }

                        if (o.is("select")) {
                            var v = data[key];
                            //如果取到的值是一个对象，则使用这个对象的ID作为key
                            if (typeof data[key] == "object") {
                                v = v[sub_key];
                            }
                            o.find("option[value='" + v + "']").prop("selected", true);
                            continue;
                        }

                        if (sub_key) {
                            o.val(data[key][sub_key]);
                            return;
                        }
                        o.val(data[key]);
                    }
                }
            });

        };


        this.validation = function() {

            if (!this.element.validate) {
                return false;
            }
            var o = this;
            var _options = {
                errorElement: 'span', //default input error message container
                errorClass: 'help-block', //default input error message class
                focusInvalid: false, //do not focus the last invalid input
                ignore: "",
                rules: {},
                invalidHandler: function(event, validator) {

                },
                highlight: function(element) {
                    $(element).closest('.form-group').addClass('has-error'); // set error class to the control group
                },

                unhighlight: function(element) { // revert the change done by hightlight
                    $(element).closest('.form-group').removeClass('has-error'); // set error class to the control group
                },
                success: function(label) {
                    label.closest('.form-group').removeClass('has-error'); // set success class to the control group
                },
                submitHandler: function(form) {


                    var valid = true;
                    var data = o.element.serializeArray();
                    if (o.options.validate && typeof o.options.validate.custom === "function") {
                        valid = o.options.validate.custom(o.element, data);
                    }

                    if (valid) {
                        o.submit(o.element, data);
                    }
                }
            };

            $.extend(_options, this.options.validate);
            this.element.validate(_options);
        };
        this.submit = function(form, data) {
            if (typeof this.options.submit === "function") {
                this.options.submit(form, data);
            }
        };

    }

    g[PagurianAlias].com.form = function(seletor, options) {
        var form = new Form(seletor, options);
        form.init();
        return form;
    };



});
