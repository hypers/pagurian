/**
 * Created by hypers-godfery on 2015/10/14.
 */
define(function (require, exports, module) {
        var g = window,
            locale = {};
        locale.zh_CN = require('./locale/zh_CN');
        locale.en_US = require('./locale/en_US');
        var oLanguage = locale[g[PagurianAlias].language || "zh_CN"];

        /**
         * [DataListView 筛选器类]
         * @param {[type]} selector [选择器]
         * @param {[type]} options [参数]
         */
        function Sizer(selector, options, chooseDatas) {
            var o = this,
                _nameStr = "sizer",
                _id = '_' + (Math.random() * 1E18).toString(36).slice(0, 5).toUpperCase();

            this.version = "0.1"; //版本
            this.sizerName = _nameStr + _id; //id
            this.promtText = "";//提示文字
            this.params = {}; //参数
            this.allDatas = []; //全部可用数据
            this.selectDatas = [];//已选数据
            this.needLoad = true;
            this.options = {
                isMultiple: false,//是否为多选 默认为false
                isExpand: false,//是否展开 默认为false
                dataSource: null,//数据源
                dataParams: {},//数据源的params
                dataMapping: {
                    "name": "name",
                    "value": "id"
                },
                class: "", //筛选器自定义class
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
                callbackCancel: null, //取消按钮回调
            };

            //初始化组件
            var init = function () {
                o.options = $.extend(o.options, options);
                if (o.options.isMultiple) {
                    o._tmpSelectDatas = [];//暂存数据
                    o.isFirstClick = true;//是否为第一次点击
                    o.isFirstSearch = true;//是否为第一次搜索
                }
                bindEvent(selector, options);
                drawDom(selector, options);
                o.promtText = $("#" + o.sizerName).find("button").attr("title");
                if (o.options.isExpand) {
                    o.expandPanel();
                }
                if (chooseDatas) {
                    o.selectDatas = chooseDatas;
                }
            };

            //绘制组件
            var drawDom = function (selector, options) {
                var _sizerWrap = '',
                    _sizerSelectPanel = '';
                _sizerWrap += '<div id="' + o.sizerName + '"class="sizer-wrap ' + o.options.class;
                //_sizerWrap += o.options.isExpand ? " sizer-open" : "";
                _sizerWrap += '"></div>';

                $(selector).wrap(_sizerWrap);
                _sizerSelectPanel += '<div class="sizer-select-panel ';
                _sizerSelectPanel += o.options.isMultiple ? "sizer-multiple" : "";
                _sizerSelectPanel += '">';
                _sizerSelectPanel += '    <div class="sizer-top">';
                _sizerSelectPanel += '        <div class="sizer-search-wrap">';
                _sizerSelectPanel += '            <div class="input-icon input-search">';
                _sizerSelectPanel += '                <i class="fa fa-search"></i>';
                _sizerSelectPanel += '                <input id="' + _nameStr + '_search' + _id + '" type="text" placeholder="' + o.options.search + '" class="form-control" maxlength="1024"/>';
                _sizerSelectPanel += '            </div>';
                _sizerSelectPanel += '            <label class="sizer-prompt">';
                _sizerSelectPanel += o.options.isMultiple ? oLanguage.multiple : oLanguage.single;
                _sizerSelectPanel += '            </label>';
                _sizerSelectPanel += '            <div class="sizer-btn-group">';
                if (o.options.isMultiple) {
                    _sizerSelectPanel += '                <a href="javascript:;" id="' + _nameStr + '_selectAll' + _id + '">' + oLanguage.chooseAll + '</a>';
                }
                _sizerSelectPanel += '                <a href="javascript:;" id="' + _nameStr + '_clean' + _id + '">';
                _sizerSelectPanel += o.options.isMultiple ? oLanguage.clearMultiple : oLanguage.clearSingle;
                _sizerSelectPanel += '                </a>';
                _sizerSelectPanel += '            </div>';
                _sizerSelectPanel += '        </div>';
                _sizerSelectPanel += '        <div id="' + _nameStr + '_listwrap' + _id + '" class="sizer-list-wrap loading">';//scollbar
                _sizerSelectPanel += '            <div class="sizer-loading">';
                _sizerSelectPanel += o.options.processing;
                _sizerSelectPanel += '            </div>';
                _sizerSelectPanel += '            <ul id="' + _nameStr + '_datalist' + _id + '" class="sizer-data-list">';
                _sizerSelectPanel += '            </ul>';
                _sizerSelectPanel += '        </div>';
                _sizerSelectPanel += '    </div>';
                if (o.options.isMultiple) {
                    _sizerSelectPanel += '    <div class="sizer-footer">';
                    _sizerSelectPanel += '        <button id="' + _nameStr + '_btnSubmit' + _id + '" class="btn btn-primary" type="button">' + oLanguage.btnSubmit + '</button>';
                    _sizerSelectPanel += '        <button id="' + _nameStr + '_btnCancel' + _id + '"  class="btn btn-default" type="button">' + oLanguage.btnCancel + '</button>';
                    _sizerSelectPanel += '    </div>';
                }
                _sizerSelectPanel += '</div>';
                $(selector).after(_sizerSelectPanel);
            }

            //绑定事件
            var bindEvent = function (selector, options) {
                var _isMultiple = o.options.isMultiple;
                $(document).delegate(selector, 'click', function () {
                    o.expandPanel();
                });

                //选项点击事件
                $(document).delegate("#" + o.sizerName + " .sizer-data-list-li", 'click', function () {
                    var _selectDatas = !o.options.isMultiple ? o.selectDatas : o._tmpSelectDatas,
                        _dataName = o.options.dataMapping.name,
                        _dataValue = o.options.dataMapping.value,
                        _data = {},
                        isSelect = $(this).hasClass("selected");

                    _data[_dataName] = $(this).attr("title");
                    _data[_dataValue] = $(this).data("value");

                    //单选
                    if (!o.options.isMultiple) {
                        var _isSelected = $(this).hasClass("selected");
                        $("#" + o.sizerName + " .sizer-data-list-li").removeClass("selected");
                        _selectDatas = [];
                        if (!_isSelected) {
                            $(this).addClass("selected");
                            _selectDatas.push(_data);
                        }
                        ;
                        singleSetText(_data[_dataName]);
                        o.selectDatas = _selectDatas;
                        o.options.callbackOption && o.options.callbackOption(_data, isSelect);
                        closePanel();
                    }

                    //多选
                    if (o.options.isMultiple) {
                        if (o.isFirstClick) {
                            _selectDatas = _selectDatas.concat(o.selectDatas);
                            o.isFirstClick = false;
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
                        o._tmpSelectDatas = _selectDatas;
                        o.options.callbackOption && o.options.callbackOption(_data, isSelect);
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
                    //多选
                    if (o.options.isMultiple) {
                        if (o.isFirstClick) {
                            o.isFirstClick = false;
                        }
                        $(".sizer-data-list-li").removeClass("selected");
                        o._tmpSelectDatas = [];
                        o.options.callbackClean && o.options.callbackClean(o._tmpSelectDatas);
                    }

                    //单选
                    if (!o.options.isMultiple) {
                        $(".sizer-data-list-li").removeClass("selected");
                        o.selectDatas = [];
                        singleSetText(o.promtText);
                        closePanel();
                    }
                });

                //搜索框事件
                $(document).delegate("#" + _nameStr + '_search' + _id, 'keyup', function (e) {
                    var word = $(this).val(),
                        $dataList = $("#" + _nameStr + "_datalist" + _id).empty(),
                        _datas = o.allDatas,
                        _selectDatas = !o.options.isMultiple ? o.selectDatas : o._tmpSelectDatas;
                    if (o.isFirstSearch) {
                        _selectDatas = _selectDatas.concat(o.selectDatas);
                    }
                    word = $.trim(word);
                    for (var i = 0, len = _datas.length; i < len; i++) {
                        var _tpl = '';
                        if (!(_datas[i][o.options.dataMapping["name"]].indexOf(word) > -1)) {
                            continue;
                        }
                        _tpl += '<li class="sizer-data-list-li ';
                        for (var j = 0, lenJ = _selectDatas.length; j < lenJ; j++) {
                            if (_datas[i][o.options.dataMapping["value"]] === _selectDatas[j][o.options.dataMapping["value"]]) {
                                _tpl += 'selected ';
                            }
                        }
                        _tpl += ((i + 1) % 4 === 0 ? 'mr-n"' : '"');
                        _tpl += 'title="' + _datas[i][o.options.dataMapping["name"]] + '" data-value="' + _datas[i][o.options.dataMapping["value"]] + '">';
                        _tpl += '<a href="javascript:;">' + _datas[i][o.options.dataMapping["name"]] + '</a></li>';
                        $dataList.append(_tpl);
                    }
                });

                //多选筛选器独有事件
                if (_isMultiple) {
                    //全选
                    $(document).delegate("#" + _nameStr + '_selectAll' + _id, 'click', function () {
                        if (o.isFirstClick) {
                            o.isFirstClick = false;
                        }
                        $(".sizer-data-list-li").addClass("selected");
                        o._tmpSelectDatas = o.allDatas;
                        o.options.callbackSelectAll && o.options.callbackSelectAll(o._tmpSelectDatas);
                    });

                    //确定
                    $(document).delegate("#" + _nameStr + '_btnSubmit' + _id, 'click', function () {
                        o.selectDatas = o._tmpSelectDatas;
                        o.options.callbackSubmit && o.options.callbackSubmit();
                        closePanel();
                    });

                    //取消
                    $(document).delegate("#" + _nameStr + '_btnCancel' + _id, 'click', function () {
                        //o.selectDatas = o._tmpSelectDatas;
                        o.options.callbackCancel && o.options.callbackCancel();
                        closePanel();
                    });
                }
            }

            //关闭面板
            var closePanel = function () {
                var $sizerWrap = $("#" + o.sizerName);
                $sizerWrap.removeClass("sizer-open");
                if (o.options.isMultiple) {
                    o._tmpSelectDatas = [];
                    o.isFirstClick = true;
                    o.isFirstSearch = true;
                }
                $("#" + _nameStr + '_search' + _id).val("");
                $("#" + _nameStr + '_search' + _id).keyup();
                o.options.callbackClose && o.options.callbackClose(o.selectDatas);
            };

            //为单选按钮设置文字
            var singleSetText = function (text) {
                $("#" + o.sizerName).find("span.sizer-btn-text").empty().append(text);
                $("#" + o.sizerName).find("button").attr("title", text);
            };

            //打开面板
            this.expandPanel = function () {
                var $sizerWrap = $("#" + o.sizerName),
                    _isExpand = $sizerWrap.hasClass("sizer-open");
                //判断是否展开如果展开则关闭
                _isExpand ? $sizerWrap.removeClass("sizer-open") : $sizerWrap.addClass("sizer-open");
                //打开面板时执行的方法
                if (!_isExpand) {
                    if (o.needLoad) {
                        o.loadData();
                    }
                    o.updatePanel(o.selectDatas);
                    o.options.callbackExpand && o.options.callbackExpand(o.selectDatas);
                }
                //关闭面板时执行的方法
                if (_isExpand) {
                    closePanel();
                }
            };

            //载入数据
            this.loadData = function () {
                var $listWrap = $("#" + _nameStr + "_listwrap" + _id),
                    $dataList = $("#" + _nameStr + "_datalist" + _id).empty();
                o.params = o.options.dataParams;
                o.options.dataSource(o.options.params, function (resp) {
                    if ($listWrap.hasClass("loading")) {
                        $listWrap.removeClass("loading");
                    }
                    var _datas = resp.result;
                    o.allDatas = _datas;
                    for (var i = 0, len = _datas.length; i < len; i++) {
                        var _tpl = '';
                        _tpl += '<li class="sizer-data-list-li ';
                        //选中默认选中项
                        if (chooseDatas) {
                            for (var j = 0, lenJ = chooseDatas.length; j < lenJ; j++) {
                                if (_datas[i][o.options.dataMapping["value"]] === chooseDatas[j][o.options.dataMapping["value"]]) {
                                    _tpl += 'selected ';
                                }
                            }
                        }
                        _tpl += ((i + 1) % 4 === 0 ? 'mr-n"' : '"');
                        _tpl += 'title="' + _datas[i][o.options.dataMapping["name"]] + '" data-value="' + _datas[i][o.options.dataMapping["value"]] + '">';
                        _tpl += '<a href="javascript:;">' + _datas[i][o.options.dataMapping["name"]] + '</a></li>';
                        $dataList.append(_tpl);
                    }
                    o.needLoad = false;
                });
            };

            //使用自定义数据更新面板
            this.updatePanel = function (datas) {
                var $dataListLi = $("#" + _nameStr + '_datalist' + _id + " li"),
                    _selectData = datas;
                $dataListLi.removeClass("selected");
                for (var i = 0, len = _selectData.length; i < len; i++) {
                    $('.sizer-data-list-li[data-value="' + _selectData[i][o.options.dataMapping.value] + '"]').addClass("selected");
                }
            };

            //重新拉取数据
            this.update = function () {
                this.loadData();
            }

            init();
        }

        /**
         * [dataListView 数据列表视图]
         * @param  {[type]} selector [选择器]
         * @param  {[type]} options [选项]
         * @return {[type]}         [dataListView]
         */
        g[PagurianAlias].plugin.sizer = function (seletor, options, chooseDatas) {
            var sizer = new Sizer(seletor, options, chooseDatas);
            //sizer.init();
            return sizer;
        }
    }
);
