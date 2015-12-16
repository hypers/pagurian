define(function(require, exports, module) {

    var app = require("app");
    var model = require('./model');


    require('../../plugins/jquery.validate/module');


    app.page.index = function() {

    };

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
                custom: function(form, data) {
                    return true;
                }
            },
            submit: function(form, data) {
                model.add(data, function(resp) {
                    $p.alert(resp.message);
                });
            }
        });

    };

    app.page.other = function() {
        var my_form = $p.form("#form_sample_1");

        my_form.val({
            text: "This is text",
            textarea: "This is Textarea",
            select: 2,
            radio: 2,
            checkbox: 2
        });
    };

    module.exports = app;

});
