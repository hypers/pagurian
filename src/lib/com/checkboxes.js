define(function(require, exports, module) {

    var g = window;

    function Checkboxes(seletor, options) {


        this.container = $(seletor);

        //初始化
        this.init = function() {

            var that = this;
            this.container.addClass("checkbox-list " + (options.className || ""));
            this.load(options);

            this.container.on("click", "input[type='checkbox']", function() {

                that.actives = [];
                var $input = $(this);
                var active = {
                    value: $input.val(),
                    text: $input.data("text"),
                    checked: $input.is(":checked")
                };
                $(".checkbox-item input").each(function(index) {
                    if ($(this).is(":checked")) {
                        that.actives.push({
                            value: $(this).val(),
                            text: $(this).data("text")
                        });
                    }
                });
                if ($.isFunction(options.click)) {
                    options.click(active, that.actives);
                }

            });
        };

        //载入数据
        this.load = function(options) {

            this.items = options.items || [];
            this.actives = options.actives || [];
            this.name = options.name;

            var item;

            this.container.empty();
            for (var i = 0; i < this.items.length; i++) {

                item = [
                    '<label class="checkbox-item" ><input type="checkbox"',
                    'name="' + name + '"',
                    'value="' + this.items[i].value + '"',
                    'data-text="' + this.items[i].text + '"'
                ];

                for (var j = 0; j < this.actives.length; j++) {
                    if (this.actives[j].value == this.items[i].value) {
                        item.push('checked=checked');
                    }
                }
                item.push('/> ' + this.items[i].text + '</label>');
                this.container.append(item.join(" "));
            }

            //uniform
            if (jQuery().uniform) {
                this.container.find("input[type='checkbox']").uniform();
            }


        };

        //选中全部
        this.checkAll = function() {
            this.check(true);
        };

        //取消选中全部
        this.uncheckAll = function() {
            this.check(false);
        };

        this.check = function(flag) {
            var elements = this.container.find("input[type='checkbox']");
            elements.prop("checked", flag);
            if (jQuery().uniform) {
                $.uniform.update(elements);
            }
        };

        //获取所有选项
        this.getItems = function() {
            return this.actives;
        };

        //获取选择的选项
        this.getActives = function() {
            return this.actives;
        };

        //销毁
        this.destroy = function() {
            this.container.empty();
        };

    }

    g[PagurianAlias].checkboxes = function(seletor, options) {
        return new Checkboxes(seletor, options).init();
    };

});
