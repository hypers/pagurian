/**
 * Created by hypers-YangGuo on 2015/10/14.
 * Update by hypers-YangGuo on 2016/1/27 重构组件
 * Updata by hypers-YangGuo on 2016/3/16 bugfix
 */
define(function (require, exports, module) {
    var g = window,
        locale = {};
    locale.zh_CN = require('./locale/zh_CN');
    locale.en_US = require('./locale/en_US');
    var oLanguage = locale[g[PagurianAlias].language || "zh_CN"];

    /**
     * [Sizer 筛选器类]
     * @param {[string|jQuery|Dom]} sizerBtnSelector [选择器] 必须唯一
     * @param {[array]} options [配置参数]
     * @param {string} chooseDatas [初始选中的选项] 兼容老版本不推荐使用
     */
    function Sizer(sizerBtnSelector, options, chooseDatas) {
        //版本
        var version = "2016.05.04.1501";
        var sizerPanelTpl = require("./tpl/sizerPanel.tpl");
        var sizerFooterTpl = require("./tpl/sizerFooter.tpl");
        var sizerButton = require("./tpl/sizerButton.tpl");
        var _this = this;
        var _nameStr = "sizer";
        var _id = '_' + (Math.random() * 1E18).toString(36).slice(0, 5).toUpperCase();
        /**
         * 不出现滚动条的最大展示数
         * @type {number}
         */
        var MAX_SHOW_SCROLL_LENGTH = 8;
        var _evTimeStamp = 0;
        /**
         * 是否为展开面板后的第一次点击
         * @type {boolean}
         * @private
         */
        var _isFirstClick = true;
        var $sizerBtn = $(sizerBtnSelector);
        var _oLanguage = $.extend(true, {}, oLanguage);
        _oLanguage.nameStr = _nameStr;
        _oLanguage.id = _id;
        _oLanguage.promtText = $.trim($sizerBtn.text());

        //id
        this.sizerName = _nameStr + _id;
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
        //数据载入promise
        this.p_loadData = $.Deferred();

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
            processing: _oLanguage.processing, //loading默认文字
            search: _oLanguage.search, //搜索框默认文字
            matchCase: true,//忽略大小写匹配
            callbackExpand: null, //面板展开时的回调
            callbackClose: null, //面板关闭时的回调
            callbackOption: null, //点击选项的回调
            callbackSearch: null, //搜索框录入回调
            callbackClean: null, //点击清除/清除选择的回调
            callbackLoadData: null, //数据加载完成后的回调
            //仅isMultiple为true时有效
            callbackSelectAll: null, //全选时的回调
            callbackSubmit: null, //确认按钮回调
            callbackCancel: null //取消按钮回调
        };

        this.getSelectDatas = function () {
            var _selectDatas = [];
            var _type = _this.options.isMultiple ? "checkbox" : "radio";
            var allCheckBox = $('#' + _this.sizerName + ' .sizer-data-list input[type="' + _type + '"]:checked');
            allCheckBox.each(function () {
                var oValue = {};
                oValue[_this.options.dataMapping.value] = "" + $(this).val();
                oValue[_this.options.dataMapping.name] = $(this).data("key");
                _selectDatas.push(oValue);
            });
            return _selectDatas;
        };

        /**
         * 打开面板
         */
        this.expandPanel = function () {
            var $sizerWrap = _this.container,
                _isExpand = $sizerWrap.hasClass("sizer-open");
            //关闭所有已展开的面板
            $('[id^="' + _nameStr + '"].sizer-wrap').removeClass("sizer-open");
            //判断是否展开如果展开则关闭
            if (_isExpand) {
                _this.close();
                return this;
            }
            _this.open();
            if ($.isFunction(_this.options.callbackExpand)) {
                _this.options.callbackExpand(_this.selectDatas);
            }
            return this;
        };

        //打开面板
        this.open = function () {
            _this.container.addClass("sizer-open");
        };

        //关闭面板
        this.close = function () {
            _this.container.removeClass("sizer-open");
            closePanel(true);
        };

        /**
         * 选中数据
         * @param values {array|string|obj}
         * array:[{name:"2.1.12.3",value:1},...]
         * obj:{name:"2.1.12.3",value:1},
         * string:"all"全选,"null"全不选 ,如果为单选则接受直接传入value进行选中
         */
        this.chooseData = function (values) {
            $.when(_this.p_loadData).done(function (data) {
                chooseData(values);
            });


            function chooseData(values) {
                var $container = _this.container,
                    _value;
                var _type = _this.options.isMultiple ? "checkbox" : "radio";
                var _valueStr = _this.options.dataMapping.value;
                var objAllData = {};
                if ($.isFunction(values)) {
                    values = values();
                }
                _this.allDatas.forEach(function (data) {
                    objAllData[data[_valueStr]] = true;
                });

                var $checkboxs = _this.container.find('.sizer-data-list [type="' + _type + '"]');

                if (!_this.options.isMultiple) {
                    $checkboxs.prop("checked", false).uniform();
                    _value = $.isArray(values) ? values[0] : values;
                    _value = $p.tool.isObject(_value) ? "" + _value[_this.options.dataMapping.value] : "" + _value;
                    if (!objAllData[_value]) {
                        $p.log('value is not fonud');
                        return;
                    }
                    $checkboxs.filter(function (index) {
                        return "" + $checkboxs[index].value === _value;
                    }).prop("checked", "checked").uniform();
                    var valueObj = _getData(_value);
                    _this.selectDatas = _this._tmpSelectDatas = [valueObj];
                    singleSetText(valueObj[_this.options.dataMapping.name] || _oLanguage.promtText);
                    return;
                }

                if (values === "all") {
                    $container.find('.sizer-data-list [type="checkbox"]').prop('checked', 'checked');
                    _this.selectDatas = _this._tmpSelectDatas = _this.allDatas;
                }

                if (values === "null") {
                    $container.find('.sizer-data-list [type="checkbox"]').prop('checked', false);
                    _this.selectDatas = _this._tmpSelectDatas = [];
                }

                if ($.isArray(values)) {
                    $checkboxs.prop('checked', false).uniform();
                    //var _valueStr = _this.options.dataMapping.value,
                    var _selectDatas = [];
                    //var objAllData = {};
                    var _values = [];

                    //_this.allDatas.forEach(function (data) {
                    //    objAllData[data[_valueStr]] = true;
                    //});

                    values.forEach(function (data) {
                        if (objAllData[data[_valueStr]]) {
                            _values.push(data);
                        }
                    });

                    for (var i = 0; i < _values.length; i++) {
                        _value = _values[i];

                        $checkboxs.filter(function (index) {
                            return "" + $checkboxs[index].value === "" + _value[_valueStr];
                        }).prop("checked", "checked").uniform();

                        _selectDatas.push(_getData(_value[_valueStr]));
                    }
                    _this.selectDatas = _this._tmpSelectDatas = _selectDatas;
                }

                /**
                 * 通过id获取已选中的对象
                 * @param id
                 * @returns {*}
                 * @private
                 */
                function _getData(id) {
                    return $.grep(_this.allDatas, function (value) {
                        return "" + id === "" + value[_valueStr];
                    })[0];
                }

                uniForm();
            }

            return this;
        };

        /**
         * 重新拉取数据
         */
        this.update = function (params) {
            //$("#" + _nameStr + "_listwrap" + _id).addClass("loading");
            //$("#" + _nameStr + "_datalist" + _id).empty();
            _this.container.find('.sizer-list-wrap').addClass("loading");
            _this.container.find('.sizer-data-list').empty();
            _this.selectDatas = [];
            _this._tmpSelectDatas = [];
            var _promise;
            //cleanOption(false);
            if (params !== undefined) {
                _this.params = _this.options.dataParams = $.extend({}, _this.options.dataParams, params);
            }
            //多选
            if (_this.options.isMultiple) {
                //$("#" + _this.sizerName).removeClass("sizer-open");
            } else {
                singleSetText(_oLanguage.promtText);
            }
            _promise = _this._loadData();
            if (_this.p_loadData) {
                _this.p_loadData.reject();
            }
            _this.p_loadData = _promise;
            $.when(_this.p_loadData).done(function (resp) {
                _this._renderData(resp);
            });
            return this;
        };

        /**
         * 绑定、解绑事件
         * @param eventName 事件名称
         * @param call 回调事件 如果没有 则为解绑
         */
        this._manageEvent = function (eventName, call) {
            if (Object.prototype.toString.call(eventName) !== "[object String]") {
                throw "manageEvent exception: type of eventName error";
            }
            var _eventName = 'callback' + eventName.split("")[0].toUpperCase() + eventName.substr(1, eventName.length - 1);
            if (arguments.length === 1) {
                if ($.isFunction(_this.options[_eventName])) {
                    _this.options[_eventName] = null;
                }
                return;
            }
            if ($.isFunction(_this.options[_eventName]) || _this.options[_eventName] === null) {
                _this.options[_eventName] = call;
            }
        };

        /**
         * 载入数据
         * @returns {Sizer}
         * @private
         */
        this._loadData = function () {
            var _dataParams = _this.options.dataParams;
            _this.params = $.isFunction(_dataParams) ? _dataParams() : _dataParams;
            var _promise = $.Deferred();
            _this.options.dataSource(_this.params, function (resp) {
                _promise.resolve(resp);
            });
            return _promise;
        };

        /**
         * 渲染dom
         * @param resp
         * @param loadConfig 是否读取构造参数中的chooseDatas
         * @private
         */
        this._renderData = function (resp, loadConfig) {
            var $listWrap = _this.container.find("#" + _nameStr + "_listwrap" + _id);
            if ($listWrap.hasClass("loading")) {
                $listWrap.removeClass("loading");
            }
            var _result = resp.result || {};
            var _datas = $.isArray(_result) ? _result : _result.items || [];
            if (_datas.length >= MAX_SHOW_SCROLL_LENGTH) {
                $listWrap.addClass("scollbar");
            }

            _this.allDatas = _datas;
            var _chooseDatas = [];
            if (loadConfig) {
                if (_this.options.isMultiple) {
                    if (chooseDatas === "all") {
                        _chooseDatas = _datas;
                    }

                    if (chooseDatas === "null") {
                        _chooseDatas = [];
                    }

                    if ($.isArray(chooseDatas)) {
                        _chooseDatas = chooseDatas;
                    }
                } else {
                    if ($.isArray(chooseDatas)) {
                        _chooseDatas.push(chooseDatas[0]);
                    }
                }
            }
            setData(_datas, _chooseDatas);
            var _selectVals = [];
            var _selectDatas = [];
            _chooseDatas.forEach(function (data) {
                _selectVals.push("" + data[_this.options.dataMapping.value]);
            });
            _datas.forEach(function (data) {
                if (_selectVals.indexOf("" + data[_this.options.dataMapping.value]) > -1) {
                    _selectDatas.push(data);
                }
            });
            _this.selectDatas = _selectDatas;

            _this.p_loadData.resolve(_datas);
            if ($.isFunction(_this.options.callbackLoadData)) {
                _this.options.callbackLoadData(_this.allDatas);
            }
        };

        /**
         * 初始化组件
         */
        function init() {
            if ($sizerBtn.length === 0) {
                $p.log("Selector dom is not found");
            }
            _this.options = $.extend(_this.options, options);
            _this.matchCase = _this.options.matchCase;
            setBtnsOptions();

            if (_this.options.isMultiple) {
                _this._tmpSelectDatas = []; //暂存数据
                _this.isFirstClick = true; //是否为第一次点击
                _this.isFirstSearch = true; //是否为第一次搜索
            }

            drawDom();
            bindEvent();

            var _promise = _this._loadData();
            if (_this.p_loadData) {
                _this.p_loadData.reject();
            }
            _this.p_loadData = _promise;
            $.when(_this.p_loadData).done(function (resp) {
                _this._renderData(resp, true);
            });

            if (_this.options.isExpand) {
                _this.open();
            }
            if (chooseDatas) {
                if (!_this.options.isMultiple && chooseDatas[0][_this.options.dataMapping.name]) {
                    singleSetText(chooseDatas[0][_this.options.dataMapping.name]);
                }
                _this.selectDatas = chooseDatas;
            }
        }

        /**
         * 绘制组件
         */
        function drawDom() {
            _oLanguage.multipleClass = _this.options.isMultiple ? "sizer-multiple" : "";

            var $sizerWrap = $('<div class="sizer-wrap"></div>');
            var $selectAll = $('<a></a>');
            var $clearAll = $('<a></a>');
            var $clearSingle = $('<a></a>');
            var sizerSelectPanel = $($p.tpl(sizerPanelTpl, _oLanguage));
            var sizerBtnGroup = sizerSelectPanel.find(".sizer-btn-group");

            $sizerWrap.attr('id', _this.sizerName).addClass(_this.options.style);
            $selectAll.prop('href', 'javascript:;').attr('id', _nameStr + '_selectAll' + _id).append(_oLanguage.chooseAll);
            $clearAll.prop('href', 'javascript:;').attr('id', _nameStr + '_cleanAll' + _id).append(_oLanguage.clearSingle);
            $clearSingle.prop('href', 'javascript:;').attr('id', _nameStr + '_clean' + _id).append(_oLanguage.clearSingle);
            $sizerBtn.wrap($sizerWrap);

            $sizerBtn.empty().attr('title', _oLanguage.promtText).append($p.tpl($(sizerButton).html(), _oLanguage));

            var Obtns = {
                selectAll: $selectAll,
                clearAll: $clearAll,
                clearSingle: $clearSingle
            };

            _this.options.btns.forEach(function (btnName) {
                sizerBtnGroup.append(Obtns[btnName] || '');
            });

            if (_this.options.isMultiple) {
                sizerSelectPanel.append($p.tpl(sizerFooterTpl, _oLanguage));
            }

            $sizerBtn.after(sizerSelectPanel.get(0).outerHTML);
            $("#" + _nameStr + '_select_panel' + _id).css(_this.options.position);
            _this.container = $sizerBtn.parent(".sizer-wrap");
            uniForm();
        }

        /**
         * 绑定事件
         * @param selector
         * @param options
         */
        function bindEvent() {
            var _isMultiple = _this.options.isMultiple;
            $sizerBtn.on('click', function () {
                _this.expandPanel();
            });

            //选项点击事件
            _this.container.find('.sizer-data-list').on('click', ' .sizer-data-list-li [type]', function (event) {
                if (!_isCanTrigger()) {
                    return;
                }
                var type = _this.options.isMultiple ? 'checkbox' : 'radio',
                    $checkBox = $(this);
                var _dataName = _this.options.dataMapping.name,
                    _dataValue = _this.options.dataMapping.value,
                    _data = {};
                _data[_dataName] = $checkBox.data("key");
                var _checkVal = $checkBox.val();
                _data[_dataValue] = isNaN(_checkVal) ? _checkVal : +_checkVal;
                //单选
                if (!_this.options.isMultiple) {
                    singleSetText(_data[_dataName]);
                    _this._tmpSelectDatas = _this.selectDatas = [_data];
                    if ($.isFunction(_this.options.callbackOption)) {
                        _this.options.callbackOption(_data);
                    }
                    closePanel(true);
                }

                //多选
                if (_this.options.isMultiple) {
                    if (_isFirstClick) {
                        _isFirstClick = false;
                        _this._tmpSelectDatas = uniqueDatas(concatArray(_this.selectDatas, _this._tmpSelectDatas));
                    }
                    _this._tmpSelectDatas = uniqueDatas(concatArray(_this._tmpSelectDatas, _data));
                    if (!$checkBox.is(":checked")) {
                        _this._tmpSelectDatas = $.grep(_this._tmpSelectDatas, function (o) {
                            return "" + _data[_dataValue] !== "" + o[_dataValue];
                        });
                    }
                    if ($.isFunction(_this.options.callbackOption)) {
                        _this.options.callbackOption(_data, $checkBox.is(":checked"));
                    }
                }
            });

            //清除选择
            _this.container.on('click', "#" + _nameStr + '_clean' + _id, function () {
                cleanOption(true);
                if ($.isFunction(_this.options.callbackClean)) {
                    _this.options.callbackClean(_this._tmpSelectDatas);
                }
            });

            //搜索框事件
            _this.container.on('keyup', "#" + _nameStr + '_search' + _id, $p.tool.debounce(function () {
                if (_isFirstClick) {
                    _isFirstClick = false;
                    _this._tmpSelectDatas = uniqueDatas(concatArray(_this.selectDatas, _this._tmpSelectDatas));
                }
                var resultDatas = searchData($(this).val());
                //resetSelectAll();
                if ($.isFunction(_this.options.callbackSearch)) {
                    _this.options.callbackSearch(resultDatas);
                }
            }, 200));


            //多选筛选器独有事件
            if (_isMultiple) {
                /**
                 * 全选或全不选
                 * @param isChecked
                 */
                var checkAll = function (isChecked) {
                    var _selects = [];
                    var $checkBoxes = $('#' + _this.sizerName + ' .sizer-data-list input[type="checkbox"]');
                    $checkBoxes.each(function () {
                        var $o = $(this);
                        var _o = {};
                        _o[_this.options.dataMapping.name] = $o.data("key");
                        _o[_this.options.dataMapping.value] = $o.val();
                        _selects.push(_o);
                    });
                    if (_isFirstClick) {
                        _isFirstClick = false;
                        _this._tmpSelectDatas = uniqueDatas(concatArray(_this.selectDatas, _this._tmpSelectDatas));
                    }
                    if (isChecked) {
                        $('#' + _this.sizerName + ' .sizer-data-list input[type="checkbox"]:not(:checked)').prop('checked', 'checked');
                        _this._tmpSelectDatas = uniqueDatas(concatArray(_this._tmpSelectDatas, _selects));
                    } else {
                        $('#' + _this.sizerName + ' .sizer-data-list input[type="checkbox"]:checked').prop('checked', false);
                        var _oldSelectDatas = _this._tmpSelectDatas,
                            _newSelectDats = [];
                        for (var i = 0; i < _oldSelectDatas.length; i++) {
                            var isAdd = true,
                                valueStr = _this.options.dataMapping.value;
                            for (var j = 0; j < _selects.length; j++) {
                                if ("" + _selects[j][valueStr] === "" + _oldSelectDatas[i][valueStr]) {
                                    isAdd = false;
                                }
                            }
                            if (isAdd) {
                                _newSelectDats.push(_oldSelectDatas[i]);
                            }
                        }
                        _this._tmpSelectDatas = _newSelectDats;
                    }
                    uniForm();
                };

                //全选
                _this.container.on('click', "#" + _nameStr + '_selectAll' + _id, function () {
                    checkAll(true);
                });

                //清除选择
                _this.container.on('click', "#" + _nameStr + '_cleanAll' + _id, function () {
                    checkAll(false);
                });

                //确定
                _this.container.on('click', "#" + _nameStr + '_btnSubmit' + _id, function () {
                    if (_isFirstClick) {
                        _isFirstClick = false;
                        _this._tmpSelectDatas = uniqueDatas(concatArray(_this.selectDatas, _this._tmpSelectDatas));
                    }
                    _this.selectDatas = _this._tmpSelectDatas;
                    _this._tmpSelectDatas = [];
                    var _keyName = _this.options.dataMapping.name,
                        _valueName = _this.options.dataMapping.value;
                    var $checkboxs = $('#' + _this.sizerName + ' .sizer-data-list input[type="checkbox"]');
                    $checkboxs.prop('checked', false);
                    for (var _i = 0; _i < _this.selectDatas.length; _i++) {
                        var _key = _this.selectDatas[_i][_keyName],
                            _value = _this.selectDatas[_i][_valueName];
                        $checkboxs.filter(function (index) {
                            return "" + $checkboxs[index].value === "" + _value;
                        }).prop('checked', 'checked');
                        var _o = {};
                        _o[_this.options.dataMapping.name] = _key;
                        _o[_this.options.dataMapping.value] = _value;
                        _this._tmpSelectDatas.push(_o);
                    }
                    if ($.isFunction(_this.options.callbackSubmit)) {
                        _this.options.callbackSubmit(_this.selectDatas, _this.allDatas);
                    }
                    uniForm();
                    //resetSelectAll();
                    closePanel(true);
                });

                //取消
                _this.container.on('click', "#" + _nameStr + '_btnCancel' + _id, function () {
                    _this._tmpSelectDatas = [];
                    var _keyName = _this.options.dataMapping.name,
                        _valueName = _this.options.dataMapping.value;
                    var $checkboxs = $('#' + _this.sizerName + ' .sizer-data-list input[type="checkbox"]');
                    $checkboxs.prop('checked', false);
                    for (var _i = 0; _i < _this.selectDatas.length; _i++) {
                        var _key = _this.selectDatas[_i][_keyName],
                            _value = _this.selectDatas[_i][_valueName];
                        $checkboxs.filter(function (index) {
                            return "" + $checkboxs[index].value === "" + _value;
                        }).prop('checked', 'checked');
                        var _o = {};
                        _o[_this.options.dataMapping.name] = _key;
                        _o[_this.options.dataMapping.val] = _value;
                        _this._tmpSelectDatas.push(_o);
                    }
                    if ($.isFunction(_this.options.callbackCancel)) {
                        _this.options.callbackCancel();
                    }
                    uniForm();
                    //resetSelectAll();
                    closePanel(true);
                });
            }
        }

        /**
         * 设置组件的按钮配置
         */
        function setBtnsOptions() {
            if (_this.options.btns && $.isArray(_this.options.btns)) {
                return;
            }
            if (_this.options.btns === 'null' || _this.options.btns === null) {
                _this.options.btns = [];
                return;
            }
            _this.options.btns = _this.options.isMultiple ? ['selectAll', 'clearAll'] : ['clearSingle'];
        }

        /**
         * 关闭面板
         * @param excuteCallBack [boolean] 是否执行关闭面板回调
         */
        function closePanel(excuteCallBack) {
            _isFirstClick = true;
            var $sizerWrap = _this.container;
            $sizerWrap.removeClass("sizer-open");
            $("#" + _nameStr + '_search' + _id).val("");
            _this._tmpSelectDatas = [];
            var _keyName = _this.options.dataMapping.name,
                _valueName = _this.options.dataMapping.value;
            var $checkboxs = $('#' + _this.sizerName + ' .sizer-data-list input[type="checkbox"]');

            $checkboxs.prop('checked', false);

            for (var _i = 0; _i < _this.selectDatas.length; _i++) {
                var _key = _this.selectDatas[_i][_keyName],
                    _value = _this.selectDatas[_i][_valueName];

                $checkboxs.filter(function (index) {
                    return "" + $checkboxs[index].value === "" + _value;
                }).prop('checked', 'checked');

                var _o = {};
                _o[_this.options.dataMapping.name] = _key;
                _o[_this.options.dataMapping.value] = _value;
                _this._tmpSelectDatas.push(_o);
            }

            searchData("");
            if (excuteCallBack && $.isFunction(_this.options.callbackClose)) {
                _this.options.callbackClose(_this.selectDatas, _this.allDatas);
            }
        }

        /**
         * 为单选按钮设置文字
         * @param text 需要设置的文字
         */
        function singleSetText(text) {
            var title = ( text !== _oLanguage.promtText && !_this.options.isMultiple ) ? (_oLanguage.promtText + ':' + text ) : text;
            $("#" + _this.sizerName).find("span.sizer-btn-text").empty().append(text);
            $("#" + _this.sizerName).find("button").attr("title", title);
        }

        /**
         * 设置数据
         * @param allDatas
         * @param chooseDatas
         */
        function setData(allDatas, chooseDatas) {
            //var $dataList = $("#" + _nameStr + "_datalist" + _id).empty();
            var $dataList = _this.container.find('.sizer-data-list').empty();
            var _valueName = _this.options.dataMapping.value;
            var _keyName = _this.options.dataMapping.name;

            //暂时不在搜索的时候处理滚动条
            //var $dataListWrap = $dataList.parents('.sizer-list-wrap');
            //if (allDatas.length >= MAX_SHOW_SCROLL_LENGTH) {
            //    $dataListWrap.addClass('scollbar');
            //} else {
            //    $dataListWrap.removeClass('scollbar');
            //}

            if (!allDatas || allDatas.length === 0) {
                var _empty = '<div class="sizer-empty">' + _oLanguage.empty + '</div>';
                $dataList.append(_empty);
                return;
            }
            for (var i = 0, len = allDatas.length; i < len; i++) {
                var _type = _this.options.isMultiple ? "checkbox" : "radio";
                var _dataKey = "" + allDatas[i][_keyName];
                var _dataValue = allDatas[i][_valueName];

                var _liCls = ((i + 1) % 2 === 0 ) ? 'mr-n' : '';
                _liCls += i <= 1 ? ' mt-n' : '';

                var $li = $('<li class="sizer-data-list-li "></li>');
                var $label = $('<label></label>');
                var $input = $('<input/>');

                $li.addClass(_liCls);
                $label.prop('title', _dataKey);
                $input.prop('type', _type);
                $input.val(_dataValue);
                $input.attr('data-key', _dataKey);
                if (chooseDatas) {
                    for (var j = 0, lenJ = chooseDatas.length; j < lenJ; j++) {
                        if ("" + _dataValue === "" + chooseDatas[j][_valueName]) {
                            $input.prop('checked', 'checked');
                        }
                    }
                }
                $label.append($input).append(_dataKey);
                $li.append($label);
                $dataList.append($li);
            }
            uniForm();
        }

        /**
         * 初始化表单组件样式
         */
        function uniForm() {
            _this.container.find("input[type='checkbox']").uniform();
            _this.container.find("input[type='radio']").uniform();
        }

        /**
         * 清除选中选项
         * @param isCallBackClose 是否执行关闭面板时的回调
         */
        function cleanOption(isCallBackClose) {
            var $dataLis = _this.container.find('sizer-data-list-li');
            //多选
            if (_this.options.isMultiple) {
                if (_this.isFirstClick) {
                    _this.isFirstClick = false;
                }
                //var $dataLis =$("#" + _this.sizerName + " .sizer-data-list-li")
                $dataLis.each(function () {
                    if ($(this).hasClass("selected")) {
                        $(this).click();
                    }
                });

                if (!isCallBackClose) {
                    closePanel(isCallBackClose);
                    return;
                }

                if ($.isFunction(_this.options.callbackClean)) {
                    _this.options.callbackClean(_this._tmpSelectDatas);
                }
            }

            //单选
            if (!_this.options.isMultiple) {
                $dataLis.removeClass("selected");
                _this.selectDatas = [];
                singleSetText(_oLanguage.promtText);
                closePanel(isCallBackClose);
            }
        }

        /**
         * 搜索数据
         * @param text 关键字
         * @returns {Array} 搜索到的数据
         */
        function searchData(text) {
            var _selectDatas = _this.getSelectDatas(),
                word = text,
                _datas = _this.allDatas,
                _tempDatas = [],
                _tempSelectDatas = [];
            word = _this.matchCase ? $.trim(word).toUpperCase() : $.trim(word);
            //$("#" + _nameStr + "_datalist" + _id).empty();
            _this.container.find('.sizer-data-list').empty();
            for (var i = 0, len = _datas.length; i < len; i++) {
                var _str = _this.matchCase ? _datas[i][_this.options.dataMapping.name].toUpperCase() : _datas[i][_this.options.dataMapping.name];
                if (_str.indexOf(word) <= -1) {
                    continue;
                }
                _tempDatas.push(_datas[i]);
                for (var j = 0, lenJ = _selectDatas.length; j < lenJ; j++) {
                    if ("" + _datas[i][_this.options.dataMapping.value] === _selectDatas[j][_this.options.dataMapping.value]) {
                        _tempSelectDatas.push(_datas[i]);
                    }
                }
            }
            setData(_tempDatas, _this._tmpSelectDatas);
            //resetSelectAll();
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
                _dataValue = _this.options.dataMapping.value;
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
         * 重置全选按钮
         */
        //function resetSelectAll() {
        //    $('#' + _nameStr + '_selectAll' + _id + ' [type="checkbox"]').prop("checked", false).uniform();
        //}

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
    }

    Sizer.prototype = {
        constructor: Sizer,
        getOption: function () {
            return this.options;
        },
        getAllDatas: function () {
            return this.allDatas;
        },
        chooseData: function (data) {
            this.chooseData(data);
            return this;
        },
        on: function (eventName, call) {
            this._manageEvent(eventName, call);
            return this;
        },
        off: function (eventName) {
            this._manageEvent(eventName);
            return this;
        },
        //销毁
        destroy: function () {
            this.container.remove();
        }
    };

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
