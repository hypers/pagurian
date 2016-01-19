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

                var $input = $(this);
                var checkedItem = {
                    value: $input.val(),
                    text: $input.data("text"),
                    checked: $input.is(":checked")
                };

                //修改被点击的checkbox选中状态
                for (var i = 0; i < that.items.length; i++) {
                    if (that.items[i].value.toString() === $input.val()) {
                        that.items[i].checked = $input.is(":checked");
                    }
                }

                //执行回调方法
                if ($.isFunction(options.click)) {
                    options.click(checkedItem, that.getCheckedItems());
                }

            });
        };

        //载入数据
        this.load = function(options) {

            this.items = options.items || [];
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

                if (this.items[i].checked) {
                    item.push('checked=checked');
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
            return this.items;
        };

        //获取选择的选项
        this.getCheckedItems = function() {

            var checkedItems = [];
            for (var i = 0; i < this.items.length; i++) {
                if (this.items[i].checked) {
                    checkedItems.push(this.items[i]);
                }
            }

            return checkedItems;
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
