/**
 * Created by hypers-godfery on 2015/10/14.
 * Update by hypers-godfery on 2016/1/27 重构组件
 */
define(function (require, exports, module) {
    var g = window,
        locale = {};
    locale.zh_CN = require('./locale/zh_CN');
    locale.en_US = require('./locale/en_US');
    var oLanguage = locale[g[PagurianAlias].language || "zh_CN"];

    /**
     * [Sizer 筛选器类]
     * @param {[string|jQuery]} selector [选择器]
     * @param {[array]} options [参数]
     * @param {string} chooseDatas [选中的选项]
     */
    function Sizer(selector, options, chooseDatas) {
        var sizerPanelTpl = require("./tpl/sizerPanel.tpl");
        var sizerFooterTpl = require("./tpl/sizerFooter.tpl");
        var sizerButton = require("./tpl/sizerButton.tpl");
        var that = this;
        var _nameStr = "sizer";
        var _id = '_' + (Math.random() * 1E18).toString(36).slice(0, 5).toUpperCase();
        var _evTimeStamp = 0;
        /**
         * 是否为展开面板后的第一次点击
         * @type {boolean}
         * @private
         */
        var _isFirstClick = true;

        oLanguage.nameStr = _nameStr;
        oLanguage.id = _id;
        that.promtText = $.trim($(selector).text());
        oLanguage.promtText = $.trim($(selector).text());
        selector = (selector instanceof jQuery) ? selector.selector : selector;

        //版本
        this.version = "2016.01.27.1029";
        //id
        this.sizerName = _nameStr + _id;
        //提示文字
        this.promtText = "";
        //参数
        this.params = {};
        //全部可用数据
        this.allDatas = [];
        //已选数据
        this.selectDatas = [];
        //是否需要载入
        this.needLoad = true;
        //父级容器
        this.container = null;
        /**
         *
         * @type {
         * {isMultiple: boolean,//是否为多选 默认为false
         * isExpand: boolean,//是否展开 默认为false
         * dataSource: null,//数据源的params
         * dataParams: {}, //数据源的参数
         * dataMapping: {name: string, value: string}, //数据源的映射关系
         * position: { left: 0 }//设置面板的位置 与$.css()数据格式相同
         * style: string,//custom类型
         * processing: (*|function(event, Object, boolean)), //loading文字
         * search: (*|string|string|string|string),//搜索框内的placeholder
         * callbackExpand: function(){},//面板展开时的回调
         * callbackClose: function(datas){},//面板关闭时的回调
         * callbackOption: function(data){},//点击选项的回调
         * callbackSearch: function(datas){},//搜索框录入回调
         * callbackClean: function(){},//点击清除/清除选择的回调
         * ======仅isMultiple为true时有效========
         * callbackSubmit: function(){},//确认按钮回调
         * callbackCancel: function(){}}//取消按钮回调
         * }
         */
        this.options = {
            isMultiple: false, //是否为多选 默认为false
            isExpand: false, //是否展开 默认为false
            dataSource: null, //数据源
            dataParams: {}, //数据源的params
            dataMapping: {
                "name": "name",
                "value": "id"
            },
            position: { //设置面板的位置
                left: 0
            },
            style: "", //筛选器自定义class
            processing: oLanguage.processing, //loading默认文字
            search: oLanguage.search, //搜索框默认文字
            matchCase: true,
            callbackExpand: null, //面板展开时的回调
            callbackClose: null, //面板关闭时的回调
            callbackOption: null, //点击选项的回调
            callbackSearch: null, //搜索框录入回调
            callbackClean: null, //点击清除/清楚选择的回调
            //仅isMultiple为true时有效
            callbackSelectAll: null, //全选时的回调
            callbackSubmit: null, //确认按钮回调
            callbackCancel: null //取消按钮回调
        };

        //初始化组件
        var init = function () {
            that.options = $.extend(that.options, options);
            that.matchCase = that.options.matchCase;
            if (that.options.isMultiple) {
                that._tmpSelectDatas = []; //暂存数据
                that.isFirstClick = true; //是否为第一次点击
                that.isFirstSearch = true; //是否为第一次搜索
            }
            bindEvent(selector);
            drawDom(selector);
            if (that.options.isExpand) {
                that.expandPanel();
            }
            if (chooseDatas) {
                if (!that.options.isMultiple && chooseDatas[0][that.options.dataMapping.name]) {
                    singleSetText(chooseDatas[0][that.options.dataMapping.name]);
                }
                that.selectDatas = chooseDatas;
            }
        };

        //绘制组件
        var drawDom = function (selector) {
            var _sizerWrap = '',
                _topBtn = that.options.isMultiple ?
                '<label id="' + _nameStr + '_selectAll' + _id + '"><input type="checkbox">' + oLanguage.chooseAll + '</label>' :
                '<a href="javascript:;" id="' + _nameStr + '_clean' + _id + '">' + oLanguage.clearSingle + '</a>';
            oLanguage.multipleClass = that.options.isMultiple ? "sizer-multiple" : "";
            $(selector).empty().attr('title', oLanguage.promtText).append($p.tpl($(sizerButton).html(), oLanguage));
            _sizerWrap += '<div id="' + that.sizerName + '"class="sizer-wrap ' + that.options.style + '"></div>';
            $(selector).wrap(_sizerWrap);
            var sizerSelectPanel = $($p.tpl(sizerPanelTpl, oLanguage));
            sizerSelectPanel.find(".sizer-btn-group").append(_topBtn);
            if (that.options.isMultiple) {
                sizerSelectPanel.append($p.tpl(sizerFooterTpl, oLanguage));
            }
            $(selector).after(sizerSelectPanel.get(0).outerHTML);
            $("#" + _nameStr + '_select_panel' + _id).css(that.options.position);
            if (that.container === null) {
                that.container = $(selector).parent(".sizer-wrap");
            }
            uniForm();
        };

        /**
         * 绑定事件
         * @param selector
         * @param options
         */
        var bindEvent = function (selector) {
            var _isMultiple = that.options.isMultiple;
            $(document).on('click', selector, function () {
                that.expandPanel();
            });

            //选项点击事件
            $(document).on('click', '#' + that.sizerName + ' .sizer-data-list-li [type]', function (event) {
                if (!_isCanTrigger()) {
                    return;
                }
                var type = that.options.isMultiple ? 'checkbox' : 'radio',
                    $checkBox = $(this);
                var _dataName = that.options.dataMapping.name,
                    _dataValue = that.options.dataMapping.value,
                    _data = new SizerData($checkBox.data("key"), $checkBox.val());
                //单选
                if (!that.options.isMultiple) {
                    singleSetText(_data[_dataName]);
                    that._tmpSelectDatas = that.selectDatas = [_data];
                    if ($.isFunction(that.options.callbackOption)) {
                        that.options.callbackOption(_data);
                    }
                    closePanel(true);
                }

                //多选
                if (that.options.isMultiple) {
                    if (_isFirstClick) {
                        _isFirstClick = false;
                        that._tmpSelectDatas = uniqueDatas(concatArray(that.selectDatas, that._tmpSelectDatas));
                    }
                    that._tmpSelectDatas = uniqueDatas(concatArray(that._tmpSelectDatas, _data));
                    if (!$checkBox.is(":checked")) {
                        that._tmpSelectDatas = $.grep(that._tmpSelectDatas, function (o) {
                            return "" + _data[_dataValue] !== "" + o[_dataValue];
                        });
                    }
                    if ($.isFunction(that.options.callbackOption)) {
                        that.options.callbackOption(_data, $checkBox.is("checked"));
                    }
                }
            });

            //清除选择
            $(document).on('click', "#" + _nameStr + '_clean' + _id, function () {
                cleanOption(true);
            });

            //搜索框事件
            $(document).on('keyup', "#" + _nameStr + '_search' + _id, function (e) {
                if (_isFirstClick) {
                    _isFirstClick = false;
                    that._tmpSelectDatas = uniqueDatas(concatArray(that.selectDatas, that._tmpSelectDatas));
                }
                var resultDatas = searchData($(this).val());
                resetSelectAll();
                if ($.isFunction(that.options.callbackSearch)) {
                    that.options.callbackSearch(resultDatas);
                }
            });

            //多选筛选器独有事件
            if (_isMultiple) {
                //全选
                $(document).on('click', "#" + _nameStr + '_selectAll' + _id, function (e) {
                    var _target = e.target;
                    //if(!_isCanTrigger()){
                    //    return;
                    //}
                    //if(_target.tagName !== "INPUT"){
                    //    var _$checkBox = $(this).find('[type="checkbox"]');
                    //    var _checked = _$checkBox.is(':checked') ? false : 'checked';
                    //    _$checkBox.prop('checked', _checked);
                    //    _$checkBox.uniform();
                    //}
                    var _selects = [];
                    var $checkBoxes = $('#' + that.sizerName + ' .sizer-data-list input[type="checkbox"]');
                    $checkBoxes.each(function () {
                        var $o = $(this);
                        _selects.push(new SizerData($o.data("key"), $o.val()));
                    });
                    if (_isFirstClick) {
                        _isFirstClick = false;
                        that._tmpSelectDatas = uniqueDatas(concatArray(that.selectDatas, that._tmpSelectDatas));
                    }
                    if ($(this).find('[type="checkbox"]').is(':checked')) {
                        $('#' + that.sizerName + ' .sizer-data-list input[type="checkbox"]:not(:checked)').prop('checked', 'checked');
                        that._tmpSelectDatas = uniqueDatas(concatArray(that._tmpSelectDatas, _selects));
                    } else {
                        $('#' + that.sizerName + ' .sizer-data-list input[type="checkbox"]:checked').prop('checked', false);
                        var _oldSelectDatas = that._tmpSelectDatas,
                            _newSelectDats = [];
                        for (var i = 0; i < _oldSelectDatas.length; i++) {
                            var isAdd = true,
                                valueStr = that.options.dataMapping.value;
                            for (var j = 0; j < _selects.length; j++) {
                                if ("" + _selects[j][valueStr] === "" + _oldSelectDatas[i][valueStr]) {
                                    isAdd = false;
                                }
                            }
                            if (isAdd) {
                                _newSelectDats.push(_oldSelectDatas[i]);
                            }
                        }
                        that._tmpSelectDatas = _newSelectDats;
                    }
                    uniForm();
                });

                //确定
                $(document).on('click', "#" + _nameStr + '_btnSubmit' + _id, function () {
                    that.selectDatas = that._tmpSelectDatas;
                    that._tmpSelectDatas = [];
                    var _keyName = that.options.dataMapping.name,
                        _valueName = that.options.dataMapping.value;
                    $('#' + that.sizerName + ' .sizer-data-list input[type="checkbox"]').prop('checked', false);
                    for (var _i = 0; _i < that.selectDatas.length; _i++) {
                        var _key = that.selectDatas[_i][_keyName],
                            _value = that.selectDatas[_i][_valueName];
                        $('#' + that.sizerName + ' .sizer-data-list input[type="checkbox"][value="' + _value + '"]').prop('checked', 'checked');
                        that._tmpSelectDatas.push(new SizerData(_key, _value));
                    }
                    if ($.isFunction(that.options.callbackSubmit)) {
                        that.options.callbackSubmit(that.selectDatas, that.allDatas);
                    }
                    uniForm();
                    resetSelectAll();
                    closePanel(true);
                });

                //取消
                $(document).on('click', "#" + _nameStr + '_btnCancel' + _id, function () {
                    that._tmpSelectDatas = [];
                    var _keyName = that.options.dataMapping.name,
                        _valueName = that.options.dataMapping.value;
                    $('#' + that.sizerName + ' .sizer-data-list input[type="checkbox"]').prop('checked', false);
                    for (var _i = 0; _i < that.selectDatas.length; _i++) {
                        var _key = that.selectDatas[_i][_keyName],
                            _value = that.selectDatas[_i][_valueName];
                        $('#' + that.sizerName + ' .sizer-data-list input[type="checkbox"][value="' + _value + '"]').prop('checked', 'checked');
                        that._tmpSelectDatas.push(new SizerData(_key, _value));
                    }
                    if ($.isFunction(that.options.callbackCancel)) {
                        that.options.callbackCancel();
                    }
                    uniForm();
                    resetSelectAll();
                    closePanel(true);
                });

            }
        };

        /**
         * 关闭面板
         */
        var closePanel = function (isCallBack) {
            _isFirstClick = true;
            var $sizerWrap = $("#" + that.sizerName);
            $sizerWrap.removeClass("sizer-open");
            $("#" + _nameStr + '_search' + _id).val("");
            that._tmpSelectDatas = [];
            var _keyName = that.options.dataMapping.name,
                _valueName = that.options.dataMapping.value;
            $('#' + that.sizerName + ' .sizer-data-list input[type="checkbox"]').prop('checked', false);
            for (var _i = 0; _i < that.selectDatas.length; _i++) {
                var _key = that.selectDatas[_i][_keyName],
                    _value = that.selectDatas[_i][_valueName];
                $('#' + that.sizerName + ' .sizer-data-list input[type="checkbox"][value="' + _value + '"]').prop('checked', 'checked');
                that._tmpSelectDatas.push(new SizerData(_key, _value));
            }
            searchData("");
            if (isCallBack && $.isFunction(that.options.callbackClose)) {
                that.options.callbackClose(that.selectDatas, that.allDatas);
            }
        };

        /**
         * 为单选按钮设置文字
         * @param text 需要设置的文字
         */
        var singleSetText = function (text) {
            var title = text !== ( that.promtText && !that.options.isMultiple ) ? oLanguage.promtText + ':' + text : text;
            $("#" + that.sizerName).find("span.sizer-btn-text").empty().append(text);
            $("#" + that.sizerName).find("button").attr("title", title);
        };

        /**
         * 设置数据
         * @param allDatas
         * @param chooseDatas
         */
        var setData = function (allDatas, chooseDatas) {
            var $dataList = $("#" + _nameStr + "_datalist" + _id).empty();
            if (!allDatas || allDatas.length === 0) {
                var _empty = '<div class="sizer-empty">' + oLanguage.empty + '</div>';
                $dataList.append(_empty);
                return;
            }
            for (var i = 0, len = allDatas.length; i < len; i++) {
                var _type = that.options.isMultiple ? "checkbox" : "radio";
                var _tpl = '',
                    _liCls = ((i + 1) % 2 === 0 ) ? 'mr-n' : '';
                _tpl += '<li class="sizer-data-list-li ' + _liCls + '">';
                _tpl += '<label title="' + allDatas[i][that.options.dataMapping.name] + '"><input type="' + _type + '" value="' + allDatas[i][that.options.dataMapping.value] + '" data-key="' + allDatas[i][that.options.dataMapping.name] + '"';
                if (chooseDatas) {
                    for (var j = 0, lenJ = chooseDatas.length; j < lenJ; j++) {
                        if ("" + allDatas[i][that.options.dataMapping.value] === "" + chooseDatas[j][that.options.dataMapping.value]) {
                            _tpl += 'checked=checked ';
                        }
                    }
                }
                _tpl += '>' + allDatas[i][that.options.dataMapping.name] + '</label></li>';
                $dataList.append(_tpl);
            }
            uniForm();
        };

        /**
         * 初始化表单组件样式
         */
        var uniForm = function () {
            that.container.find("input[type='checkbox']").uniform();
            that.container.find("input[type='radio']").uniform();
        };

        var getSelectDatas = function () {
            var _selectDatas = [];
            var allCheckBox = $('#' + that.sizerName + ' .sizer-data-list input[type="checkbox"]:checked');
            allCheckBox.each(function () {
                var oValue = {};
                oValue[that.options.dataMapping.value] = "" + $(this).val();
                oValue[that.options.dataMapping.name] = $(this).data("key");
                _selectDatas.push(oValue);
            });
            return _selectDatas;
        };

        /**
         * 打开面板
         */
        this.expandPanel = function () {
            var $sizerWrap = $("#" + that.sizerName),
                _isExpand = $sizerWrap.hasClass("sizer-open");
            //关闭所有已展开的面板
            $('[id^="' + _nameStr + '"].sizer-wrap').removeClass("sizer-open");
            //判断是否展开如果展开则关闭
            if (_isExpand) {
                //关闭面板时执行的方法
                $sizerWrap.removeClass("sizer-open");
                closePanel(true);
                return this;
            }
            //打开面板时执行的方法
            $sizerWrap.addClass("sizer-open");
            if (that.needLoad) {
                that.loadData();
            }
            if ($.isFunction(that.options.callbackExpand)) {
                that.options.callbackExpand(that.selectDatas);
            }
            return this;
        };

        /**
         * 载入数据
         */
        this.loadData = function () {
            var $listWrap = $("#" + _nameStr + "_listwrap" + _id);
            that.params = that.options.dataParams;
            that.options.dataSource(that.options.dataParams, function (resp) {
                if ($listWrap.hasClass("loading")) {
                    $listWrap.removeClass("loading");
                }
                var _result = resp.result || {};
                var _datas = $.isArray(_result) ? _result : _result.items || [];
                if (_datas.length > 8) {
                    $listWrap.addClass("scollbar");
                }
                that.allDatas = _datas;
                var _chooseDatas = [];
                if(that.options.isMultiple){
                    if (chooseDatas === "all") {
                        _chooseDatas = _datas;
                    }

                    if (chooseDatas === "null") {
                        _chooseDatas = [];
                    }

                    if ($.isArray(chooseDatas)) {
                        _chooseDatas = chooseDatas;
                    }
                }else{
                    if($.isArray(chooseDatas)){
                        _chooseDatas.push(chooseDatas[0]);
                    }
                }

                setData(_datas, _chooseDatas);
                that.needLoad = false;
            });
            return this;
        };

        /**
         * 选中数据
         * @param value {array|string|obj}
         * array:[{name:"2.1.12.3",value:1},...]
         * obj:{name:"2.1.12.3",value:1},
         * string:"all"全选,"null"全不选
         */
        this.chooseData = function (value) {
            var $container = $('#' + that.sizerName),
                _value;
            if (!that.options.isMultiple) {
                $('#' + that.sizerName + ' .sizer-data-list [type="radio"]').prop("checked", false);
                _value = $.isArray(value) ? value[0] : value;
                $('#' + that.sizerName + ' .sizer-data-list [type="radio"][value="' + _value[that.options.dataMapping.value] + '"]').prop("checked", "checked").uniform();
                singleSetText(_value[that.options.dataMapping.name] || oLanguage.promtText);
                that._tmpSelectDatas = that.selectDatas = [_value];
                return;
            }
            if (value === "all") {
                $container.find('.sizer-data-list [type="checkbox"]').prop('checked', 'checked');
                that.selectDatas = that._tmpSelectDatas = that.allDatas;
            }

            if (value === "null") {
                $container.find('.sizer-data-list [type="checkbox"]').prop('checked', false);
                that.selectDatas = that._tmpSelectDatas = [];
            }

            if ($.isArray(value)) {
                $container.find('.sizer-data-list [type="checkbox"]').prop('checked', false);
                var _valueStr = that.options.dataMapping.value,
                    _selectDatas = [];

                for (var i = 0; i < value.length; i++) {
                    _value = value[i];
                    $('#' + that.sizerName + ' .sizer-data-list [type="checkbox"][value="' + _value[_valueStr] + '"]').prop("checked", "checked");
                    _selectDatas.push(_getData(_value[_valueStr]));
                }
                that.selectDatas = that._tmpSelectDatas = _selectDatas;
            }

            /**
             * 通过id获取已选中的对象
             * @param id
             * @returns {*}
             * @private
             */
            function _getData(id) {
                return $.grep(that.allDatas, function (value) {
                    return "" + id === "" + value[_valueStr];
                })[0];
            }

            uniForm();
        };

        /**
         * 重新拉取数据
         */
        this.update = function (params) {
            cleanOption(false);
            if (params !== undefined) {
                that.params = that.options.dataParams = params;
            }
            //多选
            if (that.options.isMultiple) {
                $("#" + that.sizerName).removeClass("sizer-open");
                this.loadData();
                return this;
            }
            //单选
            singleSetText(oLanguage.promtText);
            this.loadData();
            return this;
        };

        /**
         * 绑定、解绑事件
         * @param eventName 事件名称
         * @param call 回调事件 如果没有 则为解绑
         */
        this.manageEvent = function (eventName, call) {
            if (Object.prototype.toString.call(eventName) !== "[object String]") {
                return;
            }
            var _eventName = 'callback' + eventName.split("")[0].toUpperCase() + eventName.substr(1, eventName.length - 1);
            if (arguments.length === 1) {
                if ($.isFunction(that.options[_eventName])) {
                    that.options[_eventName] = null;
                }
                return;
            }
            if ($.isFunction(that.options[_eventName]) || that.options[_eventName] === null) {
                that.options[_eventName] = call;
            }
        };

        /**
         * 清除选中选项
         * @param isCallBackClose 是否执行关闭面板时的回调
         */
        function cleanOption(isCallBackClose) {
            //多选
            if (that.options.isMultiple) {
                if (that.isFirstClick) {
                    that.isFirstClick = false;
                }
                var $dataLis = $("#" + that.sizerName + " .sizer-data-list-li");
                $dataLis.each(function () {
                    if ($(this).hasClass("selected")) {
                        $(this).click();
                    }
                });

                if (!isCallBackClose) {
                    closePanel(isCallBackClose);
                    return;
                }

                if ($.isFunction(that.options.callbackClean)) {
                    that.options.callbackClean(that._tmpSelectDatas);
                }
            }

            //单选
            if (!that.options.isMultiple) {
                $("#" + that.sizerName + " .sizer-data-list-li").removeClass("selected");
                that.selectDatas = [];
                singleSetText(oLanguage.promtText);
                if ($.isFunction(that.options.callbackClean)) {
                    that.options.callbackClean(that._tmpSelectDatas);
                }
                closePanel(isCallBackClose);
            }
        }

        /**
         * 搜索数据
         * @param text 关键字
         * @returns {Array} 搜索到的数据
         */
        function searchData(text) {
            var _selectDatas = getSelectDatas(),
                word = text,
                _datas = that.allDatas,
                _tempDatas = [],
                _tempSelectDatas = [];
            word = that.matchCase ? $.trim(word).toUpperCase() : $.trim(word);
            $("#" + _nameStr + "_datalist" + _id).empty();
            for (var i = 0, len = _datas.length; i < len; i++) {
                var _str = that.matchCase ? _datas[i][that.options.dataMapping.name].toUpperCase() : _datas[i][that.options.dataMapping.name];
                if (_str.indexOf(word) <= -1) {
                    continue;
                }
                _tempDatas.push(_datas[i]);
                for (var j = 0, lenJ = _selectDatas.length; j < lenJ; j++) {
                    if ("" + _datas[i][that.options.dataMapping.value] === _selectDatas[j][that.options.dataMapping.value]) {
                        _tempSelectDatas.push(_datas[i]);
                    }
                }
            }
            setData(_tempDatas, that._tmpSelectDatas);
            resetSelectAll();
            return _tempDatas;
        }

        /**
         * 数组去重
         * @param arr
         * @returns {Array}
         */
        function uniqueDatas(arr) {
            var _o = {},
                _attr = [],
                _dataValue = that.options.dataMapping.value;
            for (var i = 0, len = arr.length; i < len; i++) {
                if (!_o[arr[i][_dataValue]]) {
                    _attr.push(arr[i]);
                    _o[arr[i][_dataValue]] = true;
                }
            }
            return _attr;
        }

        /**
         * 复制并合并数据
         * @returns {Array}
         */
        function concatArray() {
            var _attr = [];
            for (var i = 0; i < arguments.length; i++) {
                var argument = arguments[i];
                if ($.isArray(argument)) {
                    var j = 0;
                    while (j < argument.length) {
                        _attr.push(argument[j]);
                        j++;
                    }
                    continue;
                }
                _attr.push(argument);
            }
            return _attr;
        }

        /**
         * sizer数据对象
         * @param name
         * @param value
         * @returns {{}}
         * @constructor
         */
        function SizerData(name, value) {
            this.name = name;
            this.value = value;
            var _o = {};
            _o[that.options.dataMapping.name] = name;
            _o[that.options.dataMapping.value] = value;
            return _o;
        }

        /**
         * 重置全选按钮
         */
        function resetSelectAll() {
            $('#' + _nameStr + '_selectAll' + _id + ' [type="checkbox"]').prop("checked", false).uniform();
        }

        /**
         * 判断是否可以触发事件
         * @returns {boolean}
         * @private
         */
        function _isCanTrigger() {
            var _now = +new Date();
            var _canTrigger = (_now - _evTimeStamp >= 100);
            _evTimeStamp = _now;
            return _canTrigger;
        }

        init();

        return {
            version: that.version,
            getOption: function () {
                return that.options;
            },
            getAllDatas: function () {
                return that.allDatas;
            },
            getSelectDatas: function () {
                return that.selectDatas;
            },
            chooseData: function (data) {
                that.chooseData(data);
                return this;
            },
            on: function (eventName, call) {
                that.manageEvent(eventName, call);
                return this;
            },
            unBind: function (eventName) {
                that.manageEvent(eventName);
                return this;
            },
            //销毁
            destroy: function () {
                $('#' + that.sizerName).remove();
            },
            expandPanel: that.expandPanel,
            update: that.update
        };
    }

    /**
     * [Sizer 筛选器类]
     * @param {[type]} selector [选择器]
     * @param {[type]} options [参数]
     * @param {[type]} chooseDatas [选中的选项]
     */
    g[PagurianAlias].sizer = function (selector, options, chooseDatas) {
        var sizer = new Sizer(selector, options, chooseDatas);
        return sizer;
    };
});
