define(function(require, exports, module) {

    var g = window;

    function Checkboxes(selector, options) {


        this.container = $(selector);

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

            return this;
        };

        //载入数据
        this.load = function(data) {

            this.items = [];
            this.name = data.name;
            this.container.empty();

            var item, i;
            for (i = 0; i < data.items.length; i++) {
                this.items.push($.extend({}, data.items[i]));
            }

            for (i = 0; i < this.items.length; i++) {

                item = [
                    '<label class="checkbox-item" ><input type="checkbox"',
                    'name="' + this.name + '"',
                    'value="' + this.items[i].value + '"',
                    'data-text="' + this.items[i].text + '"'
                ];

                //选中
                if (this.items[i].checked) {
                    item.push('checked=checked');
                }
                //禁用
                if (this.items[i].disabled) {
                    item.push('disabled=true');
                }

                item.push('/> ' + this.items[i].text + '</label>');
                this.container.append(item.join(" "));
            }

            //uniform
            if (jQuery().uniform) {
                this.container.find("input[type='checkbox']").uniform();
            }

            return this;
        };

        //选中全部
        this.checkAll = function() {
            this.check(true);
            return this;
        };

        //取消选中全部
        this.uncheckAll = function() {
            this.check(false);
            return this;
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

    g[PagurianAlias].checkboxes = function(selector, options) {
        return new Checkboxes(selector, options).init();
    };

});
