define(function(require, exports, module) {
    require('./3.2.1/themes/default/style.css');
    require('./3.2.1/jstree');
    var g = window;


    function DataTree(selector, options) {

        this.container = $(selector);
        this.container.jstree($.extend({
            initedCallback: function() {
                var spinnerOptions = options.added ? options.added.numberSpinner : false;
                if (spinnerOptions) {
                    $p.numberSpinner($(selector).find(".jstree-input"), $.extend({
                        verticalbuttons: false
                    }, spinnerOptions));
                }
            }
        }, options));

        if (options.search) {
            var $input = $(options.search.input);
            var to = false;
            var that = this;
            $input.keyup(function() {
                if (to) {
                    clearTimeout(to);
                }
                to = setTimeout(function() {
                    var v = $input.val();
                    that.container.jstree(true).search(v);
                }, 250);
            });
        }

        //绑定Node Change事件
        this.container.on('changed.jstree', function(e, node) {
            if ($.isFunction(options.change)) {
                options.change(e, node);
            }
        });


        /**
         * 获取所有被选择的ID
         */
        this.getSelectedNodes = function() {
            var _temp_nodes = $.jstree.reference(this.container).get_selected() || [];
            var nodes = [];
            for (var i = 0; i < _temp_nodes.length; i++) {
                nodes.push(_temp_nodes[i].split("-")[1]);
            }
            return nodes;
        };

        this.getSelectedNodeValues = function() {
            var _temp_nodes = $.jstree.reference(this.container).get_selected() || [],
                $input, values = [];
            for (var i = 0; i < _temp_nodes.length; i++) {
                $input = this.container.find(".jstree-input[name='" + _temp_nodes[i] + "']");
                values.push({
                    name: _temp_nodes[i].split("-")[1],
                    value: $input.val()
                });
            }
            return values;
        };

        /**
         * 销毁
         */
        this.destroy = function() {
            this.container.jstree("destroy");
        };

        /**
         * 刷新
         */
        this.refresh = function() {
            this.container.jstree("refresh");
        };

        /**
         * 选中全部
         */
        this.selectAll = function() {
            $.jstree.reference(this.container).select_all();
        };

        /**
         * 取消全部选中
         */
        this.deselectAll = function() {
            $.jstree.reference(this.container).deselect_all();
        };



    }


    g[PagurianAlias].dataTree = function(selector, options) {
        return new DataTree(selector, options);
    };
});