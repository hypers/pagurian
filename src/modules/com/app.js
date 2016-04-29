define(function(require, exports, module) {

    var app = require("../../lib/app");
    var model = require('./model');


    app.page.alert = function() {


        $("#btn_alert_1").click(function() {
            $p.alert.success("报表保持成功");
        });

        $("#btn_alert_2").click(function() {
            $p.alert.info("您有5条系统提醒未读");
        });

        $("#btn_alert_3").click(function() {
            $p.alert.warn("您将要删除该项目");
        });

        $("#btn_alert_4").click(function() {
            $p.alert.error("找不到您筛选的数据,请尝试刷新页面!");
        });
    };

    app.page.dialogs = function() {

        $p.dialog("#btn_remove", {
            title: "提示",
            body: "你确定要删除吗？",
            submit: function(modal, data, params, callback) {
                modal.hide();
                $p.alert("你点击了确定");
            }
        });

        $p.dialog("#btn_add", {
            title: "添加用户",
            body: $("#tpl_user").html(),
            validate: function(modal, data, params) {
                return true;
            },
            submit: function(modal, data, params, callback) {
                $p.alert("你点击了确定");
                modal.hide();
            }
        });

        $p.dialog("#btn_form_lang", {
            title: "长表单",
            body: $("#tpl_user_lang").html(),
            validate: function(modal, data, params) {
                return true;
            },
            submit: function(modal, data, params, callback) {
                modal.hide();
                $p.alert("你点击了确定");
            }
        });

        $p.dialog("#btn_update", {
            title: "编辑用户",
            body: $("#tpl_user").html(),
            initForm: function(modal, form, params) {

                //获取用户信息
                model.getUser(params.id, params, function(data) {
                    $p.form(form).val(data);
                });

            },
            validate: function(modal, data, params) {
                return true;
            },
            submit: function(modal, data, params) {
                //更新用户信息
                model.update(params.id, data, function(resp, valid) {
                    if (valid) {
                        $p.alert(resp.message);
                        modal.hide();
                    }
                    modal.complete();
                });
            }
        });

    };

    app.page.popover = function() {

    };

    app.page.tooltip = function() {

    };



    module.exports = app;

});
