define(function(require, exports, module) {
    window.CONFIG = {
        appId: "Form"
    };

    var app = require("../../lib/app");
    var model = require('./model');


    require('../../plugins/jquery.validate/module');
    require('../../plugins/uploadify/module');


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
                custom: function(form, data) {
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
                custom: function(data, form) {
                    $p.log("自定义验证");
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
                    if (data[i].name == 'checkbox') {
                        _data.push({
                            name: "checkboxes",
                            value: {
                                id: data[i].value,
                                title: data[i].name
                            }
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



    //文件上传
    app.page.fileUpload = function() {
        $p.upload("#file", {
            formData: {
                "token": "abc"
            },
            uploader: '/src/plugins/uploadify/3.2.1/uploadify.php',
            onUploadSuccess: function(file, data, response) {
                console.log(file, data, response);
            }
        });
    };



    module.exports = app;
});
