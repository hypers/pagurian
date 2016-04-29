define(function(require, exports, module) {


    var input = document.createElement('input');
    input.className = 'jstree-input form-control ';
    input.setAttribute('type', 'text');

    module.exports = {
        defaults: {
            number: true
        },
        structure: function(options, parent) {
            this.bind = function() {
                parent.bind.call(this);
            };
            this.redraw_node = function() {

                node = parent.redraw_node.apply(this, arguments);
                if (node) {
                    var _input = input.cloneNode(false);
                    _input.setAttribute("name", node.id);
                    _input.setAttribute("value", parent._data.added[node.id]);
                    node.insertBefore(_input, node[0]);

                    //当文本框中的值改变是 存档到parent._data.added对象中
                    $(_input).change(function() {
                        $(node).data("val", $(this).val());
                        var name = $(this).attr("name");
                        parent._data.added[name] = $(this).val();
                    });
                }
                return node;
            };
            this.load_node = function() {
                return parent.load_node.apply(this, arguments);
            };
            this.trigger = function() {
                
                var action = arguments[0];
                var spinnerOptions = options.numberSpinner || false;

                if (action === "open_node" && spinnerOptions) {
                    $p.numberSpinner($("#" + arguments[1].node.id + " .jstree-children .jstree-input"), $.extend({
                        verticalbuttons: false
                    }, spinnerOptions));
                }
                parent.trigger.apply(this, arguments);
            };


        }
    };
});
