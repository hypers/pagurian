/**
 * Created by hypers-godfery on 2015/10/14.
 * Update by hypers-godfery on 2015/11/23.
 * Update by hypers-godfery on 2015/12/5.
 * 1.增加了sizer组件对新数据的支持,(同时支持老数据)
 * 2.修复了sizer组件单选情况下默认选中有选项，而按钮中的文字没有被选项name所覆盖的bug
 */
define(function (require, exports, module) {
        var g = window,
            locale = {};
        locale.zh_CN = require('./locale/zh_CN');
        locale.en_US = require('./locale/en_US');
        var oLanguage = locale[g[PagurianAlias].language || "zh_CN"];

        /**
         * [Sizer 筛选器类]
         * @param {[type]} selector [选择器]
         * @param {[type]} options [参数]
         * @param {[type]} chooseDatas [选中的选项]
         */
        function Sizer(selector, options, chooseDatas) {
            var that = this,
                _nameStr = "sizer",
                _id = '_' + (Math.random() * 1E18).toString(36).slice(0, 5).toUpperCase();
            //版本
            this.version = "2015.12.05.23.01";
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
             * callbackSelectAll: function(){},//全选时的回调
             * callbackSubmit: function(){},//确认按钮回调
             * callbackCancel: function(){}}//取消按钮回调
             * }
             */
            this.options = {
                isMultiple: false,//是否为多选 默认为false
                isExpand: false,//是否展开 默认为false
                dataSource: null,//数据源
                dataParams: {},//数据源的params
                dataMapping: {
                    "name": "name",
                    "value": "id"
                },
                position: { //设置面板的位置
                    left: 0
                },
                style: "", //筛选器自定义class
                processing: oLanguage.processing,//loading默认文字
                search: oLanguage.search,//搜索框默认文字
                callbackExpand: null,//面板展开时的回调
                callbackClose: null,//面板关闭时的回调
                callbackOption: null, //点击选项的回调
                callbackSearch: null,//搜索框录入回调
                callbackClean: null,//点击清除/清楚选择的回调
                //仅isMultiple为true时有效
                callbackSelectAll: null,//全选时的回调
                callbackSubmit: null,//确认按钮回调
                callbackCancel: null //取消按钮回调
            };

            //初始化组件
            var init = function () {
                that.options = $.extend(that.options, options);
                if (that.options.isMultiple) {
                    that._tmpSelectDatas = [];//暂存数据
                    that.isFirstClick = true;//是否为第一次点击
                    that.isFirstSearch = true;//是否为第一次搜索
                }
                bindEvent(selector);
                drawDom(selector);
                that.promtText = $("#" + that.sizerName).find("button").attr("title");
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
                    _sizerSelectPanel = '';
                _sizerWrap += '<div id="' + that.sizerName + '"class="sizer-wrap ' + that.options.style;
                //_sizerWrap += o.options.isExpand ? " sizer-open" : "";
                _sizerWrap += '"></div>';

                $(selector).wrap(_sizerWrap);
                _sizerSelectPanel += '<div id="' + _nameStr + '_select_panel' + _id + '" class="sizer-select-panel ';
                _sizerSelectPanel += that.options.isMultiple ? "sizer-multiple" : "";
                _sizerSelectPanel += '">';
                _sizerSelectPanel += '    <div class="sizer-top">';
                _sizerSelectPanel += '        <div class="sizer-search-wrap">';
                _sizerSelectPanel += '            <div class="input-icon input-search">';
                _sizerSelectPanel += '                <i class="fa fa-search"></i>';
                _sizerSelectPanel += '                <input id="' + _nameStr + '_search' + _id + '" type="text" placeholder="' + that.options.search + '" class="form-control" maxlength="1024"/>';
                _sizerSelectPanel += '            </div>';
                _sizerSelectPanel += '            <label class="sizer-prompt">';
                _sizerSelectPanel += that.options.isMultiple ? oLanguage.multiple : oLanguage.single;
                _sizerSelectPanel += '            </label>';
                _sizerSelectPanel += '            <div class="sizer-btn-group">';
                if (that.options.isMultiple) {
                    _sizerSelectPanel += '                <a href="javascript:;" id="' + _nameStr + '_selectAll' + _id + '">' + oLanguage.chooseAll + '</a>';
                }
                _sizerSelectPanel += '                <a href="javascript:;" id="' + _nameStr + '_clean' + _id + '">';
                _sizerSelectPanel += that.options.isMultiple ? oLanguage.clearMultiple : oLanguage.clearSingle;
                _sizerSelectPanel += '                </a>';
                _sizerSelectPanel += '            </div>';
                _sizerSelectPanel += '        </div>';
                _sizerSelectPanel += '        <div id="' + _nameStr + '_listwrap' + _id + '" class="sizer-list-wrap loading">';//scollbar
                _sizerSelectPanel += '            <div class="sizer-loading">';
                _sizerSelectPanel += that.options.processing;
                _sizerSelectPanel += '            </div>';
                _sizerSelectPanel += '            <ul id="' + _nameStr + '_datalist' + _id + '" class="sizer-data-list">';
                _sizerSelectPanel += '            </ul>';
                _sizerSelectPanel += '        </div>';
                _sizerSelectPanel += '    </div>';
                if (that.options.isMultiple) {
                    _sizerSelectPanel += '    <div class="sizer-footer">';
                    _sizerSelectPanel += '        <button id="' + _nameStr + '_btnSubmit' + _id + '" class="btn btn-primary" type="button">' + oLanguage.btnSubmit + '</button>';
                    _sizerSelectPanel += '        <button id="' + _nameStr + '_btnCancel' + _id + '"  class="btn btn-default" type="button">' + oLanguage.btnCancel + '</button>';
                    _sizerSelectPanel += '    </div>';
                }
                _sizerSelectPanel += '</div>';
                $(selector).after(_sizerSelectPanel);
                $("#" + _nameStr + '_select_panel' + _id).css(that.options.position);

            };

            /**
             * 绑定事件
             * @param selector
             * @param options
             */
            var bindEvent = function (selector) {
                var _isMultiple = that.options.isMultiple;
                $(document).delegate(selector, 'click', function () {
                    that.expandPanel();
                });

                //选项点击事件
                $(document).delegate("#" + that.sizerName + " .sizer-data-list-li", 'click', function () {
                    var _selectDatas = !that.options.isMultiple ? that.selectDatas : that._tmpSelectDatas,
                        _dataName = that.options.dataMapping.name,
                        _dataValue = that.options.dataMapping.value,
                        _data = {},
                        isSelect = $(this).hasClass("selected");

                    _data[_dataName] = $(this).attr("title");
                    _data[_dataValue] = $(this).data("value");

                    //单选
                    if (!that.options.isMultiple) {
                        var _isSelected = $(this).hasClass("selected");
                        $("#" + that.sizerName + " .sizer-data-list-li").removeClass("selected");
                        _selectDatas = [];
                        if (!_isSelected) {
                            $(this).addClass("selected");
                        }
                        _selectDatas.push(_data);
                        singleSetText(_data[_dataName]);
                        that.selectDatas = _selectDatas;
                        if ($.isFunction(that.options.callbackOption)) {
                            that.options.callbackOption(_data, isSelect);
                        }
                        closePanel(true);
                    }

                    //多选
                    if (that.options.isMultiple) {
                        if (that.isFirstClick) {
                            _selectDatas = _selectDatas.concat(that.selectDatas);
                            that.isFirstClick = false;
                        }
                        _selectDatas = uniqueDatas(_selectDatas);
                        if (!isSelect) { //添加选项
                            $(this).addClass("selected");
                            _selectDatas.push(_data);
                            _selectDatas = uniqueDatas(_selectDatas);
                        } else {//删除选项
                            $(this).removeClass("selected");
                            _selectDatas = removeData(_data, _selectDatas);
                        }
                        that._tmpSelectDatas = _selectDatas;
                        if ($.isFunction(that.options.callbackOption)) {
                            that.options.callbackOption(_data, isSelect);
                        }
                    }

                    //去重
                    function uniqueDatas(attr) {
                        var _o = {}, _attr = [];
                        for (var i = 0, len = attr.length; i < len; i++) {
                            if (!_o[attr[i][_dataValue]]) {
                                _attr.push(attr[i]);
                                _o[attr[i][_dataValue]] = true;
                            }
                        }
                        return _attr;
                    }

                    //移除一个选项
                    function removeData(data, attr) {
                        var _attr = [];
                        for (var i = 0, len = attr.length; i < len; i++) {
                            if (data[_dataValue] !== attr[i][_dataValue]) {
                                _attr.push(attr[i]);
                            }
                        }
                        return _attr;
                    }
                });

                //清除选择
                $(document).delegate("#" + _nameStr + '_clean' + _id, 'click', function () {
                    cleanOption(true);
                });

                //搜索框事件
                $(document).delegate("#" + _nameStr + '_search' + _id, 'keyup', function (e) {
                    var resultDatas = searchData($(this).val());
                    if ($.isFunction(that.options.callbackSearch)) {
                        that.options.callbackSearch(resultDatas);
                    }
                });

                //多选筛选器独有事件
                if (_isMultiple) {
                    //全选
                    $(document).delegate("#" + _nameStr + '_selectAll' + _id, 'click', function () {
                        if (that.isFirstClick) {
                            that.isFirstClick = false;
                        }
                        var $dataLis = $("#" + that.sizerName + " .sizer-data-list-li");
                        $dataLis.each(function () {
                            if (!$(this).hasClass("selected")) {
                                $(this).click();
                            }
                        });
                        if ($.isFunction(that.options.callbackSelectAll)) {
                            that.options.callbackSelectAll(that._tmpSelectDatas);
                        }
                    });

                    //确定
                    $(document).delegate("#" + _nameStr + '_btnSubmit' + _id, 'click', function () {
                        that.selectDatas = that._tmpSelectDatas;
                        if ($.isFunction(that.options.callbackSubmit)) {
                            that.options.callbackSubmit();
                        }
                        closePanel(true);
                    });

                    //取消
                    $(document).delegate("#" + _nameStr + '_btnCancel' + _id, 'click', function () {
                        if ($.isFunction(that.options.callbackCancel)) {
                            that.options.callbackCancel();
                        }
                        closePanel(true);
                    });
                }
            };

            /**
             * 关闭面板
             */
            var closePanel = function (isCallBack) {
                var $sizerWrap = $("#" + that.sizerName);
                $sizerWrap.removeClass("sizer-open");
                if (that.options.isMultiple) {
                    that._tmpSelectDatas = [];
                    that.isFirstClick = true;
                    that.isFirstSearch = true;
                }
                $("#" + _nameStr + '_search' + _id).val("");
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
                $("#" + that.sizerName).find("span.sizer-btn-text").empty().append(text);
                $("#" + that.sizerName).find("button").attr("title", text);
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
                    var _tpl = '';
                    _tpl += '<li class="sizer-data-list-li ';
                    //选中默认选中项
                    if (chooseDatas) {
                        for (var j = 0, lenJ = chooseDatas.length; j < lenJ; j++) {
                            if (allDatas[i][that.options.dataMapping.value] === chooseDatas[j][that.options.dataMapping.value]) {
                                _tpl += 'selected ';
                                /*if(!o.options.isMultiple){
                                 singleSetText(allDatas[i][o.options.dataMapping.name]);
                                 }*/
                            }
                        }
                    }
                    _tpl += ((i + 1) % 4 === 0 ? 'mr-n"' : '"');
                    _tpl += 'title="' + allDatas[i][that.options.dataMapping.name] + '" data-value="' + allDatas[i][that.options.dataMapping.value] + '">';
                    _tpl += '<a href="javascript:;">' + allDatas[i][that.options.dataMapping.name] + '</a></li>';
                    $dataList.append(_tpl);
                }
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
                    that.allDatas = _datas;
                    chooseDatas = chooseDatas ? chooseDatas : [];
                    setData(_datas, chooseDatas);
                    that.needLoad = false;
                });
                return this;
            };

            /**
             * 重新拉取数据
             */
            this.update = function () {
                cleanOption(false);
                //多选
                if (that.options.isMultiple) {
                    $("#" + that.sizerName).removeClass("sizer-open");
                    this.loadData();
                    return this;
                }
                //单选
                singleSetText(that.promtText);
                this.loadData();
                return this;
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
                    singleSetText(that.promtText);
                    if($.isFunction(that.options.callbackClean)){
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
                var word = text,
                    $dataList = $("#" + _nameStr + "_datalist" + _id).empty(),
                    _datas = that.allDatas,
                    _tempDatas = [],
                    _selectDatas = !that.options.isMultiple ? that.selectDatas : that._tmpSelectDatas,
                    _tempSelectDatas = [];
                if (that.isFirstSearch) {
                    _selectDatas = _selectDatas.concat(that.selectDatas);
                }
                word = $.trim(word);
                for (var i = 0, len = _datas.length; i < len; i++) {
                    if (_datas[i][that.options.dataMapping.name].indexOf(word) <= -1) {
                        continue;
                    }
                    _tempDatas.push(_datas[i]);
                    for (var j = 0, lenJ = _selectDatas.length; j < lenJ; j++) {
                        if (_datas[i][that.options.dataMapping.value] === _selectDatas[j][that.options.dataMapping.value]) {
                            _tempSelectDatas.push(_datas[i]);
                        }
                    }
                }
                setData(_tempDatas, _tempSelectDatas);
                return _tempDatas;
            }

            init();
        }

        /**
         * [Sizer 筛选器类]
         * @param {[type]} selector [选择器]
         * @param {[type]} options [参数]
         * @param {[type]} chooseDatas [选中的选项]
         */
        g[PagurianAlias].sizer = function (seletor, options, chooseDatas) {
            var sizer = new Sizer(seletor, options, chooseDatas);
            return sizer;
        };
    }
);
