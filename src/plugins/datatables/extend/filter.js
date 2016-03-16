define(function(require, exports, module) {

    module.exports = {
        settings: {
            delay: 500,
        },
        _isEmpty: function() {
            var value = this.container.val();
            var placeholder = this.container.attr("placeholder");
            if (value === placeholder) {
                return true;
            }
            if (!$.trim(value)) {
                return true;
            }
            return false;
        },
        _filter: function() {
            if (!this.settings.oFilter) {
                return;
            }
            var self = this;
            var $filter = $(self.settings.oFilter.sButton);
            $filter.find("a").unbind("click").click(function() {
                var id = $(this).data("id");
                self.settings.filterChange(id, self._isEmpty());
            });
        },
        _search: function() {
            var self = this;
            var placeholder = self.container.attr("placeholder");
            self.container.unbind("keyup").keyup($p.tool.debounce(function() {
                var word = $.trim(self.container.val());
                //如果搜索框中的值等于placeholder则关键词设为空
                if (word === placeholder) {
                    word = "";
                }
                self.settings.search(word);
            }, self.settings.delay));
        },
        create: function(options) {
            var self = this;
            $.extend(self.settings, options);
            self.container = $(options.sInput);
            self.container.prop("disabled", false);
            self._search();
            self._filter();
        }
    };

});
