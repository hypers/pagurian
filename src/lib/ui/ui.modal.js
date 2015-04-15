/**
 * [demo]
 * $p.ui.modal({
 *     id:"#btn_"
 *     onClickSubmit:function(){
 *
 *     }
 * });
 */
define(function(require, exports, module) {

    var g = window;

    function Modal() {

        var _id = '_' + (Math.random() * 1E18).toString(36).slice(0, 5).toUpperCase();

        var template = "";

        template += '<div class="modal fade" id="modal' + _id + '" >';
        template += '  <div class="modal-dialog ">';
        template += '        <div class="modal-content">';
        template += '            <div class="modal-header">';
        template += '                <button aria-hidden="true" data-dismiss="modal" class="close" type="button"></button>';
        template += '                <h4 class="modal-title">{title}</h4>';
        template += '            </div>';
        template += '            <div class="modal-message"></div>';
        template += '            <div class="modal-body">{body}</div>';
        template += '            <div class="modal-footer">';
        template += '                <button id="btn_submit' + _id + '" class="btn btn-primary" type="button">{btn_submit}</button>';
        template += '                <button data-dismiss="modal" class="btn btn-default" type="button">{btn_cancel}</button>';
        template += '            </div>';
        template += '        </div>';
        template += '    </div>';
        template += '</div>';


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


        this.init = function(seletor, options) {

            var modal = this;

            //初始化模版
            this.tpl = $p.tpl(template, $.extend({
                "title": "提示信息",
                "btn_submit": "确定",
                "btn_cancel": "取消",
                "body": "你好，我是一个模式对话框。"
            }, options));

            $("body").append(this.tpl);

            var form = $("#modal" + _id + " form");

            if (seletor) {

                //给按钮绑定事件
                $(document).delegate(seletor, 'click', function() {

                    var params = $(this).data("params");
                    modal.params = eval("(" + params + ")") || {};

                    if (typeof options.initForm === "function") {
                        options.initForm(modal, form, modal.params);
                    }


                    modal.show();
                });
            }



            //提交按钮绑定事件
            $("#btn_submit" + _id).click(function() {


                var data = form.serializeArray() || [];

                //jquery.validate 验证表单
                if (form.length && typeof form.valid === "function" && !form.valid()) {
                    return false;
                }

                //手动验证表单
                if (form.length && typeof options.validate === "function" && !options.validate(modal, data, modal.params)) {
                    return false;
                }

                //提交表单数据
                if (typeof options.submit === "function") {
                    options.submit(modal, data, modal.params);
                }

            });

            return this;
        }

        this.show = function() {

            resetForm($("#modal" + _id + " form"));
            $('#modal' + _id).modal('show');
            return this;
        }

        this.hide = function() {
            $('#modal' + _id).modal('hide');
            return this;
        }
    }

    g[PagurianAlias].ui.modal = function(seletor, options) {
        var modal = new Modal();
        modal.init(seletor, options);
        return modal;
    }

});