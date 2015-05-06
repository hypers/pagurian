define(function(require, exports, module) {

    var g = window;

    function Checkboxs() {
        /**
         * [init 初始化]
         * @param  {[String]} seletor [选择器]
         * @param  {[Object]} options [配置参数]
         * @return {[Object]}         [this]
         */
        this.init = function(seletor, options) {

            this.dom = $(seletor);
            var all_list = options.all_list,
                current_list = options.current_list,
                name = options.name;

            this.dom.empty();

            for (var i = 0; i < all_list.length; i++) {
                var checked = "";

                for (var j = 0; j < current_list.length; j++) {
                    if (current_list[j].value == all_list[i].value) {
                        checked = "checked=checked";
                    }
                }
                this.dom.append('<label><input type="checkbox" ' + checked + ' name="' + name + '"  value="' + all_list[i].value + '"  /> ' + all_list[i].text + '</label>');
            }
            //init uniform
            if (jQuery().uniform) {
                this.dom.find("input").uniform();
            }
        }
        this.checkAll = function() {
            var els = this.dom.find("input");
            els.prop("checked", true);

            if (jQuery().uniform) {
                $.uniform.update(els);
            }

        }
        this.uncheckAll = function() {
            var els = this.dom.find("input");
            els.prop("checked", false);

            if (jQuery().uniform) {
                $.uniform.update(els);
            }
        }
    }


    g[PagurianAlias].com.checkboxs = function(seletor, options) {
        var obj = new Checkboxs();
        obj.init(seletor, options);

        return obj;
    }

});