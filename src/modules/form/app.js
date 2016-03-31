define(function(require, exports, module) {


    var app = require("../../lib/app");
    var model = require('./model');


    require('../../plugins/jquery.validate/module');

    app.page.index = function() {

    };

    //表单验证
    app.page.validation = function() {

        $p.form("#form_sample_1", {
            validate: {
                rules: {
                    name: {
                        minlength: 2,
                        required: true
                    },
                    email: {
                        required: true,
                        email: true
                    },
                    url: {
                        required: true,
                        url: true
                    },
                    number: {
                        required: true,
                        number: true
                    },
                    digits: {
                        required: true,
                        digits: true
                    },
                    creditcard: {
                        required: true,
                        creditcard: true
                    },
                    occupation: {
                        minlength: 5,
                    },
                    category: {
                        required: true
                    }
                },
                //自定义验证
                custom: function(data, $form) {

                    var $occupation = $form.find("[name='occupation']");
                    var $occupationBlock = $form.find("[for='occupation']");
                    if ($occupation.val().length > 10) {
                        $occupationBlock.text("该字段不能大于10个字符").removeClass("tip");
                    }
                    return true;
                }
            }
        });

    };

    //表单赋值
    app.page.val = function() {
        $p.form("#form_sample_1").val({
            text: "This is text",
            textarea: "This is Textarea",
            select: 2,
            radio: 2,
            checkbox: [2, 3]
        });
    };

    //表单提交
    app.page.submit = function() {

        $p.com.form("#form_sample_1", {
            //表单验证
            validate: {
                rules: {
                    text: {
                        maxlength: 128,
                        required: true,
                        validString: true
                    },
                    radio: {
                        required: true
                    },
                    checkbox: {
                        required: true
                    }
                },
                //自定义验证
                custom: function(data, $form) {

                    var $textarea = $form.find("[name='textarea']");
                    var $textareaBlock = $form.find(".help-block[for='textarea']");

                    if ($textarea.val().length > 10) {
                        $textareaBlock.html("该字段不能大于10个字符啊~~~").removeClass("tip");
                        return false;
                    }
                    return true;
                }
            },
            //提交按钮
            submitButton: "#btn_submit",
            //提交接口
            submitModelEvent: model.add,
            //接口参数
            submitModelParams: function(params, callback) {
                //新增参数项，回调函数
                return [params, callback];
            },
            //数据格式化
            submitDataFormat: function(data, form) {
                var _data = [];
                //格式化后的数据
                for (var i = 0; i < data.length; i++) {

                    //name 为checkbox的值，修改为checkboxes
                    if (data[i].name === 'checkbox') {
                        _data.push({
                            name: "checkboxes",
                            value: {
                                id: data[i].value,
                                title: data[i].name
                            },
                            //当checkbox只选中一项的时候,提交的时候会当做Object{}处理
                            //属性type: "array",是为了让该字段当做Array[]处理
                            type: "array"
                        });
                        continue;
                    }
                    _data.push(data[i]);
                }
                return _data;
            },
            //提交成功
            submitSuccess: function(resp, valid) {
                $p.alert(resp.message);
            },
            //提交失败
            submitError: function(resp, valid) {
                $p.alert(resp.message, "error");
            }
        });


    };






    module.exports = app;
});
