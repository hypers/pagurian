define(function (require, exports, module) {
    var g = window;


    /**
     * The autoComplete options data
     * @typedef {Object} AutoCompleteOption~chooseData
     * @property {AutoCompleteOption~Data} data - The choose item's data.
     * @property {Boolean} [choose=] - when AutoCompleteOption.multiple has this value.
     */

    /**
     * This function type is called `chooseCallback` when execute in click item.
     * @callback AutoCompleteOption~chooseCallback
     * @param {AutoCompleteOption~chooseData} data
     */

    /**
     * This function type is called `searchCompareFunc` and is set rules of search.
     * @callback AutoCompleteOption~searchCompareFunc
     * @param {String} word
     * @param {*} value
     * @param {Number} index
     * @return {Boolean} flag whether equal
     */

    /**
     * This function type is called `equalValue` that is set equal function of compare.
     * @callback AutoCompleteOption~equalValueFunc
     * @param {AutoCompleteOption~Data.value} value
     * @param {AutoCompleteOption~Data} chooseDat
     */

    /**
     * The autoComplete options data
     * @typedef {Object} AutoCompleteOption~Data
     * @property {String} name - The name of data.
     * @property {*} value - The value of data.
     */

    /**
     * The autoComplete options
     * @typedef {Object} AutoCompleteOption
     * @property {Boolean} [multiple=false] - Whether it is multiple.
     * @property {Boolean} [clearInput=false] - Whether clear searchInput when hide panel.
     * @property {Boolean} [autoShowPanel=false] - Whether Show panel when input focus .
     * @property {AutoCompleteOption~Data[]} datas - All data.
     * @property {AutoCompleteOption~Data.value | AutoCompleteOption~Data.value[]} choose - Choose data,it could be a string or an array.
     * @property {String} style - The custom class of container that used to customize style.
     * @property {AutoCompleteOption~searchCompareCallback} [searchCompareFunc] - The function that set search rules;The default function will search used data.name and ignore case;
     * @property {AutoCompleteOption~compareValueFunc} [compareValueFunc] - The function that set equal function ;The default function will compare wheathear value and data.value  is equal;
     * @property {AutoCompleteOption~chooseCallback} [chooseCallback] - The callback execute in choose items.
     */

    /**
     *
     * @param {String|jQuery|Mixed|HTMLElement} selector - selector must be unique
     * @param {AutoCompleteOption} options - option
     * @version 2017-02-22 14:46:14
     * @constructor
     */
    function AutoComplete(selector, options) {
        var that = this;

        /**
         * uid
         * @constant {string}
         */
        var UID = '-' + (Math.random() * 1E18).toString(36).slice(0, 5).toUpperCase();

        /**
         * complete data key
         * @constant {string}
         */
        var COMPLETE_DATA_KEY = 'auto-complete' + UID;

        /**
         * complete choose data key
         * @constant {string}
         */
        var COMPLETE_CHOOSE_DATA_KEY = 'auto-complete-choose-data' + UID;

        /**
         * search result cache key
         * @type {string}
         */
        var SEARCH_CACHE_DATA_KEY = 'auto-complete-search-cache' + UID;

        /**
         * single choice template
         * @constant {string}
         */
        var TPL_ITEM_SINGLE = '<li class="item auto-complete-item {active}" title="{name}"><label class="text">{name}</label></li>';

        /**
         * multiple choice template
         * @constant {string}
         */
        var TPL_ITEM_MULTIPLE = '<li class="item auto-complete-item {active}" title="{name}"><label class="text" ><input type="checkbox" name="{inputName}" {checked}>{name}</label></li>';

        this.options = $.extend(true, {
            multiple: false
        }, options);

        this.dom = {};

        /**
         * initDom
         */
        function initDom() {
            var dom = that.dom;
            var listWidth = $(selector).outerWidth();
            dom.selector = $(selector);
            dom.selector.prop('autocomplete', 'off');
            dom.selector.wrap('<div class="auto-complete-wrap" />');
            dom.container = dom.selector.parent();
            var listWrap = $('<div class="auto-complete-content"/>');
            listWrap.css({
                'width': listWidth
            });
            dom.container.append(listWrap);
            dom.listWrap = listWrap;
        }

        /**
         * getCompareValueFunc
         * @return {Function}
         */
        function getCompareValueFunc() {
            return $.isFunction(that.options.compareValueFunc) ?
                that.options.compareValueFunc :
                function (value, chooseData) {
                    return chooseData.filter(function (data) {
                            return $p.tool.isEqual(data, value);
                        }).length > 0;
                };
        }

        /**
         * Set AllData
         * @param {AutoCompleteOption~Data[]} datas
         */
        function setData(datas) {
            that.dom.selector.data(COMPLETE_DATA_KEY, datas || []);
        }

        /**
         * getData
         * @param {String} [word=] - search word
         * @return {AutoCompleteOption~Data[]} choose datas
         */
        function getData(word) {
            word = word || '';
            var call = that.options.searchCompareFunc;
            var datas = that.dom.selector.data(COMPLETE_DATA_KEY);
            var filterFunction = $.isFunction(call) ?
                function (value, index) {
                    return call(word, value, index);
                } :
                function (value) {
                    var name = ('' + value.name).toLocaleUpperCase();
                    word = ('' + word).toLocaleUpperCase();
                    return name.indexOf(word) >= 0;
                };
            return datas.filter(filterFunction);
        }

        /**
         * set Choose Data
         * @param {AutoCompleteOption~Data[]} data
         */
        function setChooseData(data) {
            that.dom.selector.data(COMPLETE_CHOOSE_DATA_KEY, data);
        }

        /**
         * getChooseData
         * @return {AutoCompleteOption~Data[]} choose datas
         */
        function getChooseData() {
            return that.dom.selector.data(COMPLETE_CHOOSE_DATA_KEY) || [];
        }

        /**
         * add Choose Data
         * @param {AutoCompleteOption~Data.value} dataValue
         */
        function addChooseData(dataValue) {
            var chooseDatas;
            if (isMultiple()) {
                chooseDatas = getChooseData();
                var getValueIsChoose = getCompareValueFunc();
                if (!getValueIsChoose(dataValue, chooseDatas)) {
                    chooseDatas.push(dataValue);
                }
            } else {
                chooseDatas = [dataValue];
            }
            setChooseData(chooseDatas);
        }

        /**
         * remove choose data
         * @param {AutoCompleteOption~Data.value} dataValue
         */
        function removeChooseData(dataValue) {
            var chooseDatas = getChooseData().filter(function (chooseData) {
                return !$p.tool.isEqual(chooseData, dataValue);
            });
            setChooseData(chooseDatas);
        }

        /**
         * set Search Cache Data
         * @param {AutoCompleteOption~Data[]} data
         */
        function setSearchCacheData(data) {
            that.dom.selector.data(SEARCH_CACHE_DATA_KEY, data);
        }

        /**
         * get Search Cache Data
         * @param {AutoCompleteOption~Data[]} data
         */
        function getSearchCacheData() {
            return that.dom.selector.data(SEARCH_CACHE_DATA_KEY);
        }


        /**
         * show result panel
         * @param {AutoCompleteOption~Data[]} result datas
         */
        this.showResultPanel = function () {
            var result = getSearchCacheData();
            var listWrap = this.dom.listWrap;
            var ul = $('<ul/>');
            result.forEach(function (data, index) {
                var tpl = isMultiple() ? TPL_ITEM_MULTIPLE : TPL_ITEM_SINGLE;
                var dataValue = data.value;
                var chooseData = getChooseData();
                var equalValueFunc = getCompareValueFunc();
                //To flag whether choosed.
                var choosed = equalValueFunc(dataValue, chooseData);
                var tplObj = {
                    name: data.name,
                    inputName: 'auto-complete' + UID
                };
                if (choosed) {
                    tplObj = $.extend({}, tplObj, {
                        active: 'active',
                        checked: 'checked'
                    });
                }
                var item = $($p.tpl(tpl, tplObj));
                item.data(COMPLETE_DATA_KEY, data);
                ul.append(item);
            });
            listWrap.empty().append(ul);
            if (result.length > 0) {
                listWrap.addClass('show');
                if (isMultiple() && $.uniform) {
                    listWrap.find(':checkbox').uniform();
                }
                return;
            }

            that.hideResultPanel();
        };

        /**
         * hide result panel
         */
        this.hideResultPanel = function () {
            this.dom.listWrap.removeClass('show');
            if (this.options.clearInput) {
                this.dom.selector.val('');
            }
        };

        function initEvent() {
            var input = that.dom.selector;
            var container = that.dom.container;
            input.on('keyup focus', $p.tool.debounce(function () {
                var word = $.trim(input.val());
                //if word is none and autoShowPanel is false then return [];
                var result = word.length === 0 && !that.options.autoShowPanel ? [] : getData(word);
                //if result has none hide result panel
                if (!result.length) {
                    that.hideResultPanel();
                    return;
                }
                setSearchCacheData(result);
                that.showResultPanel();

                $(document).off('mouseup', hidePanel).on('mouseup', hidePanel);

                function hidePanel(e) {
                    var container = $('.auto-complete-wrap');
                    if (!container.is(e.target) && container.has(e.target).length === 0 || !that.options.multiple) {
                        that.hideResultPanel();
                        $(document).off('mouseup', hidePanel);
                    }
                }
            }, 200));

            container.on('click', '.auto-complete-item', function (event) {
                var data = $(this).data(COMPLETE_DATA_KEY);
                var chooseCallback = that.options.chooseCallback;
                if (isMultiple()) {
                    //click event will fire twice,so only target is INPUT can execute;
                    if (event.target.tagName === 'INPUT') {
                        $.proxy(multipleChooseData, this)(data, chooseCallback);
                    }
                    return;
                }
                $.proxy(singleChooseData, this)(data, chooseCallback);
            });

            /**
             * singleChooseData
             */
            function singleChooseData(data, chooseCallback) {
                container.find('.item').removeClass('active');
                addChooseData(data.value);
                $(this).addClass('active');
                if ($.isFunction(chooseCallback)) {
                    chooseCallback({
                        data: data
                    });
                }
            }

            /**
             * multipleChooseData
             * @param data
             * @param chooseCallback
             */
            function multipleChooseData(data, chooseCallback) {
                var choosed = $(this).find(':checkbox').is(':checked');
                var toggleClass = choosed ? 'addClass' : 'removeClass';
                $(this)[toggleClass]('active');
                var saveDataFunc = choosed ? addChooseData : removeChooseData;
                saveDataFunc(data.value);
                if ($.isFunction(chooseCallback)) {
                    chooseCallback({
                        data: data,
                        choose: choosed
                    });
                }
            }
        }

        /**
         * isMultiple
         * @return {boolean|*|string|string|Boolean}
         */
        function isMultiple() {
            return that.options.multiple;
        }

        (function init() {
            initDom();
            setData(that.options.datas);
            initEvent();
        })();

        this.setData = setData;
        this.getData = getData;
        this.getChooseData = getChooseData;
        this.setSearchCacheData = setSearchCacheData;
    }

    /**
     * @param {String|jQuery|Mixed|HTMLElement} selector - selector must be unique
     * @param {AutoCompleteOption} options - option
     */
    g[PagurianAlias].autoComplete = function (selector, options) {
        var autoComplete = new AutoComplete(selector, options);
        return autoComplete;
    };
});
