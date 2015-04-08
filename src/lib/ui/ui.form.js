/**
 * $p.ui.form("#edit_form",{
 *      init:function(){
 *
 *      },
 *      valid:function(data){
 *
 *      },
 *      submit:function(){
 *
 *            //
 *            model.add({
 *
 *            });
 *        }
 *    });
 */

define(function(require, exports, module) {

    var g = window;

    function Form(seletor) {

        if (seletor instanceof jQuery) {
            this.element = seletor;
        } else {
            this.element = $(seletor);
        }

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
        }

        this.bind = function(data) {

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
                            if (o.val() === data[key]) {
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
        }
    }

    g[PagurianAlias].ui.form = function(seletor, options) {
        var form = new Form(seletor);
        return form;
    }



});