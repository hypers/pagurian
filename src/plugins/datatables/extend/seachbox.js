define(function(require, exports, module) {
    module.exports = {
        settings: {
            delay: 500,
        },
        _resetTimer: function(timer) {
            if (timer) clearTimeout(timer);
        },
        _isEmpty: function() {
            var value = this.container.val();
            var placeholder = this.container.attr("placeholder");
            if (value == placeholder) {
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
            $filter.find("a").click(function() {
                var id = $(this).data("id");
                if (!self._isEmpty()) {
                    self.settings.filterChange(id);
                }
            });
        },
        _search: function() {
            var self = this;
            var placeholder = self.container.attr("placeholder");
            self.container.keyup(function(e) {
                var $input = $(this);
                if ($input.val() != this.previousValue) {
                    self._resetTimer(this.timer);
                    this.timer = setTimeout(function() {
                        var word = $.trim($input.val());
                        //如果搜索框中的值等于placeholder则关键词设为空
                        if (word === placeholder) {
                            word = "";
                        }
                        self.settings.search(word);
                    }, self.settings.delay);
                }
                this.previousValue = $input.val();
            });
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
