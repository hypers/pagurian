define(function(require, exports, module) {
    require('./3.2.1/themes/default/style.css');
    require('./3.2.1/jstree');
    require('../number-spinner/module');
    var g = window;

    /**
    @options onInited:Function
    @options change:Function   当选择或取消选择时触发的事件回调
    @options added.numberSpinner.change:Function(value:String,event,nodeId:String,tree:DataTree)
    */
    function DataTree(container, options) {
        var _this = this;

        this._guid = guid() + '_';

        if (options.core && options.core.data) {
            options.core.data = convertId(options.core.data);
        }

        var spinnerOptions = options.added ? options.added.numberSpinner : false;
        if (spinnerOptions && spinnerOptions.change) {
            var originSpinnerChange = spinnerOptions.change;
            spinnerOptions.change = function (data,event) {
                var input = event.target;
                var nodeId = decodeId(input.name);
                originSpinnerChange(data,event,nodeId,_this);
            };
        }
        this.container = typeof container ==='string' ? $(container):container;
        this.container.jstree($.extend({
            initedCallback: function() {
                if (_this._disableOnTreeChange) return;
                if (spinnerOptions) {
                    $p.numberSpinner(_this.container.find(".jstree-input"), $.extend({
                        verticalbuttons: false
                    }, spinnerOptions));
                }
                if($.isFunction(options.onInited)){
                    options.onInited();
                }
            }
        }, options));

        if (options.search) {
            var $input = $(options.search.input);
            $input.keyup($p.tool.debounce(function() {
                var v = $input.val();
                _this.container.jstree(true).search(v);
            },300));
        }

        //绑定Node Change事件
        this.container.on('changed.jstree', function(e, node) {
            if ($.isFunction(options.change)) {
                //if (_this._disableOnTreeChange) return;
                if (node.action === 'select_node' || node.action === 'deselect_node') {
                    options.change(e, node);
                }
            }
        });


        /**
         * 获取所有被选择的ID
         */
        this.getSelectedNodes = function() {
            var _temp_nodes = $.jstree.reference(this.container).get_selected() || [];
            var nodes = [];
            for (var i = 0; i < _temp_nodes.length; i++) {
                nodes.push(decodeId(_temp_nodes[i]));
            }
            return nodes;
        };

        this.selectNode = function (id) {
            var tree = $.jstree.reference(this.container);
            tree.select_node(encodeId(id),true,true);
        };

        this.setSelectedNodes = function (nodes) {
            // 因为 jstree ™ 通过 API 改变选中状态，它仍然会触发change事件，这是不应该做的事情
            //this._disableOnTreeChange = true;
            var tree = $.jstree.reference(this.container);
            tree.deselect_all();
            nodes.forEach(function (v) {
                tree.select_node(encodeId(typeof v==='string'?v:v.id),true,true);
            });
            //this._disableOnTreeChange = false;
        };

        this.setSelectedNodeValues = function (nodes,valueField,defaultValue) {
            var _this = this;
            valueField = valueField || 'value';
            var tree = $.jstree.reference(this.container);
            tree.deselect_all();
            var hasDefault = false;
            if (typeof defaultValue !=='undefined') {
                hasDefault = true;
                this.container.find('.jstree-input').val(defaultValue);
            }
            nodes.forEach(function (v) {
                var id = encodeId(v.id);
                tree.select_node(id,true,true);
                if (hasDefault) {
                    _this.container.find('.jstree-input[name='+id+']').val(v[valueField] || defaultValue);
                }
            });
        };


        this.getSelectedNodeValues = function() {
            var _temp_nodes = $.jstree.reference(this.container).get_selected() || [],
                $input, values = [];
            for (var i = 0; i < _temp_nodes.length; i++) {
                $input = this.container.find(".jstree-input[name='" + _temp_nodes[i] + "']");
                values.push({
                    id: decodeId(_temp_nodes[i]),
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



        function convertId(data) {
            if ($.isArray(data)) {
                return data.map(convertId);
            }
            var d = $.extend({},data);
            d.id = encodeId(d.id);
            if (d.children) {
                d.children = d.children.map(convertId);
            }
            return d;
        }

        function encodeId(id) {
            return _this._guid  + id;
        }

        function decodeId(_id) {
            if (_id.slice(0,_this._guid.length) === _this._guid) {
                return _id.slice(_this._guid.length);
            }
        }



    }


    function guid() {
        return '_'+(Math.random()*10e8|0).toString(36) + (+ new Date()).toString(36).slice(3);
    }


    g[PagurianAlias].dataTree = function(selector, options) {
        return new DataTree(selector, options);
    };
});
