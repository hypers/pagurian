/**
 * Created by hypers-godfery on 2015-10-28.
 * Updated by hypers-godfery on 2015-12-06.
 * 1.增加了summar组件对新数据的支持,(同时支持老数据)
 * 2.增加了summary对无请求数据时的当作普通tab的支持
 */
define(function (require, exports, module) {
        var g = window,
            locale = {};
        locale.zh_CN = require('./locale/zh_CN');
        locale.en_US = require('./locale/en_US');
        var settingPanel = require('./tpl/settingPanel.tpl');
        var oLanguage = locale[g[PagurianAlias].language || "zh_CN"];

        /**
         * [Summary 汇总面板类]
         * @param {[type]} selector [选择器]
         * @param {[type]} options [参数]
         */
        function Summary(selector, options) {
            //版本
            var _version = "2016.3.18.1841";

            var _this = this;
            //前缀名
            var _nameStr = options.name ? options.name : "summary";
            //随机id
            var _id = '_' + (Math.random() * 1E18).toString(36).slice(0, 5).toUpperCase();
            //cookieName
            var _cookieName;
            //全部列、行
            var _allColumns, _allRows;
            //临时变量
            var $div_ul, $setting_ul, i, l, j;
            //最小列数
            var MIN_COLUMN_NUM = 1;
            //是否保存状态到cookie
            var _saveState = false;

            //cookie设置及获取
            var params = {
                set: function (key, value) {
                    this[key] = value;
                    if (_saveState) {
                        $.cookie('params.' + key, value, {
                            expires: 7,
                            path: _getCookiePath()
                        });
                    }
                },
                get: function (key) {
                    if (_saveState) {
                        return this[key] || $.cookie('params.' + key);
                    }
                    return this[key];
                }
            };
            //展示数
            var _showNum = 0;
            //selectorStr
            this.selectorStr = selector.substring(1, selector.length);
            //id
            this.summaryName = _nameStr + _id;
            //参数
            this.params = {};
            //最大展示数
            this.maxNum = 0;
            //最小展示数
            this.minNum = 0;
            //是否可切换
            this.canChoose = false;
            //是否显示setting
            this.showSetting = false;
            //展示的列
            this.showColumns = [];
            //临时存储需要展示的列
            this._showColumns = [];
            //全部数据
            this.allDatas = [];
            //标题行
            this.titlesRows = [];
            /**
             * 选项
             *{
                //数据源data cName的key
                "cName": "cName",
                //所有的行
                "allRows": [{
                    //dataName
                    "dataName": "title",
                    //是否为Title字段 默认填充列名
                    "isTitle": true,
                    //自定义class
                    "klass": "summary-span-title",
                    "tpl": "增长数:{0}" //模板填充,
                    //key为datame的值 填充方法(优先级高于tpl)
                    'render': function (data, full) {}
                }],
                //所有的列
                "allColumns": [{
                    //cName key默认为cName可在option中配置
                    "cName": "showCounts",
                    //title
                    "title": "展示次数"
                }],
                //最大展示数
                "maxNum": <int>,
                //最小展示数
                "minNum": <int>,
                //可以选择
                "canChoose":false,
                //是否显示setting按钮
                "showSetting": true,
                //数据源
                "dataSource": null,
                //数据源的params
                "dataParams": {},
                //展开面板的回调
                "callbackOpen": null,
                //确定按钮的回调
                "callbackSubmit": null,
                //取消按钮的回调
                "callbackCancel": null
                }
             */
            this.options = {
                //数据源data cName的key
                "cName": "cName",
                //保存状态
                "saveState": false,
                //所有的列
                "allColumns": [],
                //所有的行
                "allRows": [],
                //最大展示数
                //"maxNum": <int>,
                //最小展示数
                //"minNum": <int>,
                //可以切换
                "canChoose": false,
                //是否显示setting按钮
                "showSetting": false,
                //数据源
                "dataSource": null,
                //数据源的params
                "dataParams": {},
                //展开面板的回调
                "callbackOpen": null,
                /**
                 * 确定按钮的回调
                 * "callbackSubmit": function (showColumns, datas) {} //展示的列 全部数据
                 */
                "callbackSubmit": null,
                //取消按钮的回调
                "callbackCancel": null,
                /**
                 * 点击面板的回调
                 * "callBackPanel"：function(_columnName, _columnData, _allDatas){}//点击的列名，当前列数据，所有数据
                 */
                "callBackPanel": null,
                /**
                 * 数据渲染后的回调
                 * [canChoose=true]
                 *"callBackGetData":function(_chooseColumnsName, _chooseColumnsData, _allDatas){} 选中的列名,选中列的数据,所有数据
                 * [canChoose=false]
                 * "callBackGetData":function( _allDatas){} 所有数据
                 */
                "callBackGetData": null
            };

            /**
             * 更新数据 并刷新组件
             */
            this.update = function (params) {
                var _opParams = $.isFunction(_this.options.dataParams) ? _this.options.dataParams() : _this.options.dataParams;
                var _params = $.extend(true, {}, _opParams, params);
                drawData(_params);
                return this;
            };

            /**
             *  调整组件高度
             */
            this.resize = function () {
                adjustHeight();
                return this;
            };

            /**
             * 初始化组件
             */
            var init = function () {
                _this.options = $.extend(true, {}, _this.options, options);
                _saveState = _this.options.saveState;
                _allColumns = $.isArray(_this.options.allColumns) ? _this.options.allColumns : [];
                _allRows = _this.options.allRows;
                _this.maxNum = _this.options.maxNum ? _this.options.maxNum : _allColumns.length;
                _this.minNum = _this.options.minNum ? _this.options.minNum : MIN_COLUMN_NUM;
                _this.canChoose = _this.options.canChoose;
                _this.showSetting = _this.options.showSetting;
                //判断并设置最大展示数和展示数
                _this.maxNum = _this.maxNum <= _allColumns.length ? _this.maxNum : _allColumns.length;
                if (_this.maxNum > _allColumns.length) {
                    _showNum = _allColumns.length;
                }
                //设置展示的列
                _cookieName = _nameStr + '.' + _this.selectorStr;

                _this.options.allRows.forEach(function (row) {
                    if (row.isTitle) {
                        _this.titlesRows.push(row.dataName);
                    }
                });

                //选项中展示的列
                var _arrOptionShowColumns = [];
                //标识全部列
                var _objAllColumns = {};
                //标识展示的列
                var _objShowColumns = {};
                for (i = 0; i < _allColumns.length; i++) {
                    var _columnsName = _allColumns[i][_this.options.cName];
                    _objAllColumns[_columnsName] = true;
                    if (i < _this.maxNum) {
                        _arrOptionShowColumns.push(_columnsName);
                    }
                }
                //cookie中展示的列
                var cookieShowColumns = params.get(_cookieName);
                var _arrCookieShowColumns = cookieShowColumns ? cookieShowColumns.split(",") : [];
                //如果cookie中储存的展示列为0 或者 储存的展示列与配置项不一致则使用配置项中的展示列
                _this.showColumns = (_arrCookieShowColumns.length === 0 || !_columnsValidate(_arrCookieShowColumns)) ? _arrOptionShowColumns : _arrCookieShowColumns;
                params.set(_cookieName, _this.showColumns.join(","));
                _this.showColumns.forEach(function (showColumn) {
                    _objShowColumns[showColumn] = true;
                });
                //cookie中选中的列

                //如果可以切换则设置已选择的列
                if (_this.canChoose) {
                    var cookieChooseColumns = params.get(_cookieName + ".chooseColumns");
                    //如果cookie不存在 或者 cookie中所存的展示字段不存在 则默认选中第一列
                    if (!cookieChooseColumns || !_objShowColumns[cookieChooseColumns]) {
                        _this.chooseColumns = _this.showColumns[0];
                    } else {
                        _this.chooseColumns = cookieChooseColumns;
                    }
                    params.set(_cookieName + ".chooseColumns", _this.chooseColumns);
                }

                bindEvent();
                drawDom();


                /**
                 * 校验列明是否在配置中
                 * @param colunms
                 * @returns {boolean}
                 * @private
                 */
                function _columnsValidate(colunms) {
                    for (var _i = 0; _i < colunms.length; _i++) {
                        if (!_objAllColumns[colunms[_i]]) {
                            return false;
                        }
                    }
                    return true;
                }
            };

            /**
             * 绘制组件
             * @param selector
             * @param options
             */
            var drawDom = function () {
                var $summaryPanelTpl = $('<div class="summary-div-ul li"></div>'),
                    _classBorder = _this.options.canChoose ? "border-bottom" : "";

                $summaryPanelTpl.attr('id', getTagId("div_ul"));
                $summaryPanelTpl.addClass(_showNum).addClass(_classBorder);

                if (_this.showSetting) {

                    oLanguage.maxNum = oLanguage.maxNum.replace("{0}", _this.maxNum);
                    oLanguage.settingWrapId = getTagId("setting_wrap");
                    oLanguage.settingIconId = getTagId("setting_icon");
                    oLanguage.settingPannelId = getTagId("setting_panel");
                    oLanguage.settingUlId = getTagId("setting_ul");
                    oLanguage.btnSubmitId = getTagId("btn_submit");
                    oLanguage.btnCancelId = getTagId("btn_cancel");

                    settingPanel = $p.tpl(settingPanel, oLanguage);
                }

                $(selector).append($summaryPanelTpl);
                if (_this.options.showSetting) {
                    $(selector).append(settingPanel);
                }
                drawInitDom();
                var _params = $.isFunction(_this.options.dataParams) ? _this.options.dataParams() : _this.options.dataParams;
                drawData(_params);
            };

            /**
             * 绑定事件
             * @param selector
             * @param options
             */
            var bindEvent = function () {
                if (_this.showSetting) {
                    /**
                     * 设置按钮
                     */
                    $(selector).on('click', " .summary-setting-icon", function () {
                        expandSettingPanel();
                    });

                    /**
                     * setting submit按钮
                     */
                    $(selector).on('click', " .summary-setting-wrap .btn-primary", function () {
                        var _needClick = false;
                        expandSettingPanel();
                        _this.showColumns = _this._showColumns;
                        params.set(_cookieName, _this.showColumns.join(","));
                        if (_this.canChoose && _this.showColumns.indexOf(_this.chooseColumns) < 0) {
                            _needClick = true;
                            var _chooseColumns = _this.showColumns[0];
                            _this.chooseColumns = _chooseColumns;
                            params.set(_cookieName + ".chooseColumns", _chooseColumns);
                        }
                        drawPanel($div_ul);
                        setData(_this.allDatas);
                        adjustHeight();
                        if ($.isFunction(_this.options.callbackSubmit)) {
                            _this.options.callbackSubmit(_this.showColumns, _this.allDatas);
                        }
                        if (_needClick) {
                            $('.jsSummary' + _id + '_content[data-name="' + _this.chooseColumns + '"]').trigger('click');
                        }
                    });

                    /**
                     * setting cancel按钮
                     */
                    $(selector).on('click', " .summary-setting-wrap .btn-default", function () {
                        var $allCheckBoxes = $('#' + getTagId("setting_ul") + ' [type="checkbox"]');
                        $allCheckBoxes.prop("checked", false);
                        for (var _i = 0; _i < _this.showColumns.length; _i++) {
                            $('#' + getTagId("setting_ul") + ' [type="checkbox"][value="' + _this.showColumns[_i] + '"]')
                                .prop("checked", "checked");
                        }
                        updateCheckbox();
                        expandSettingPanel();
                        if (_this.options.callbackCancel) {
                            _this.options.callbackCancel();
                        }
                    });

                    /**
                     * setting 中的checkbox
                     */
                    $(selector).on('click', '.summary-setting-ul [type="checkbox"]', function () {
                        var $selectCheckBoxes = updateCheckbox();
                        _this._showColumns = [];
                        $selectCheckBoxes.each(function () {
                            _this._showColumns.push($(this).val());
                        });
                    });

                    /**
                     * setting 中的reset
                     */
                    $(selector).on('click', '.summary-setting-panel .summary-reset', function () {
                        var _needClick = false;
                        var _showColunms = [];
                        var checkBoxs = $(selector).find('.summary-setting-ul [type="checkbox"]');
                        checkBoxs.prop('checked', false).prop('disabled', false);
                        expandSettingPanel();
                        _this.allDatas.forEach(function (data, index) {
                            if (index < _this.options.maxNum) {
                                _showColunms.push(data.cName);
                            }
                        });
                        checkBoxs.each(function (index, checkBox) {
                            if (_showColunms.indexOf(checkBox.value) > -1) {
                                $(checkBox).prop('checked', 'checked');
                            } else {
                                $(checkBox).prop('disabled', 'disabled');
                            }
                        });
                        checkBoxs.uniform();

                        _this.showColumns = _showColunms;
                        params.set(_cookieName, _this.showColumns.join(","));
                        var _chooseColumns = _this.showColumns[0];
                        _this.chooseColumns = _chooseColumns;
                        params.set(_cookieName + ".chooseColumns", _chooseColumns);
                        drawPanel($div_ul);
                        setData(_this.allDatas);
                        adjustHeight();
                        if (_needClick) {
                            $('.jsSummary' + _id + '_content[data-name="' + _this.chooseColumns + '"]').trigger('click');
                        }
                    });

                    /**
                     * 更新checkbox样式
                     * @returns {jQuery|HTMLElement} 已选中的checkboxes
                     */
                    var updateCheckbox = function () {
                        var _$allCheckBoxes = $('#' + getTagId("setting_ul") + ' [type="checkbox"]'),
                            _$selectCheckBoxes = $('#' + getTagId("setting_ul") + ' [type="checkbox"]:checked'),
                            _$unselectCheckBoxes = $('#' + getTagId("setting_ul") + ' [type="checkbox"]:not(:checked)');
                        var checkNum = _$selectCheckBoxes.length;
                        if (checkNum >= _this.maxNum) {
                            _$selectCheckBoxes.removeAttr("disabled");
                            _$unselectCheckBoxes.attr("disabled", "disabled");
                            if ($.uniform) {
                                _$allCheckBoxes.uniform.update();
                            }
                        } else {
                            _$allCheckBoxes.removeAttr("disabled");
                            if ($.uniform) {
                                _$allCheckBoxes.uniform.update();
                            }
                        }
                        if (checkNum === _this.minNum) {
                            _$selectCheckBoxes.attr("disabled", "disabled");
                            if ($.uniform) {
                                _$allCheckBoxes.uniform.update();
                            }
                        }

                        return _$selectCheckBoxes;
                    };
                }
                
                $(selector).on('click', ' .summary-div-li', function () {
                    var $ul = $(this).find('ul[data-name]');
                    var _columnName = $ul.data("name"),
                        _columnData = getColumnData(_columnName),
                        _columnsData = _this.allDatas;
                    if (_this.canChoose) {
                        _this.chooseColumns = _columnName;
                        params.set(_cookieName + ".chooseColumns", _this.chooseColumns);
                        $("#" + getTagId("div_ul")).find(".summary-div-li").removeClass("choose");
                        $(this).addClass("choose");
                    }
                    if ($.isFunction(_this.options.callBackPanel)) {
                        _this.options.callBackPanel(_columnName, _columnData, _columnsData);
                    }
                });
            };


            /**
             * 绘制初始内容
             */
            function drawInitDom() {
                $div_ul = $('#' + getTagId('div_ul')).empty();
                $setting_ul = $('#' + getTagId('setting_ul')).empty();

                drawPanel($div_ul);
                drawSetting($setting_ul);
            }

            /**
             *  使用o.showColumns中的值绘制面板
             * @param obj 父级obj
             */
            function drawPanel(obj) {
                obj.empty();
                obj.attr('class', function (i, cls) {
                    return cls.replace(/li\d+/, '');
                });
                obj.addClass("li" + _this.showColumns.length);
                for (i = 0; i < _this.showColumns.length; i++) {
                    var _columnsName = _this.showColumns[i];
                    var _columnsConfig = getColumnConfig(_columnsName);
                    var _clickStr = _this.options.callBackPanel ? "canClick" : "";

                    var $div_li = $('<div class="summary-div-li"></div>');
                    var $div_li_ul = $('<ul></ul>');
                    var $triangle = $('<div class="summary-triangle"></div>');

                    $div_li_ul.attr('data-name', _columnsConfig.cName);
                    $div_li_ul.addClass('jsSummary' + _id + '_content ' + _clickStr);
                    for (var k = 0; k < _allRows.length; k++) {
                        var _class = _allRows[k].klass ? _allRows[k].klass : "",
                            _text = _allRows[k].tpl ? _allRows[k].tpl.replace("{0}", "--") : "--";
                        _text = _allRows[k].isTitle ? _columnsConfig.title : _text;
                        var $li = $('<li></li>');
                        $li.addClass(_class);
                        $li.attr('data-name', _allRows[k].dataName);
                        $li.append(_text);
                        $div_li_ul.append($li);
                    }
                    $div_li.append($div_li_ul);
                    if (_this.canChoose) {
                        $div_li.append('<div class="summary-triangle"></div>');
                    }


                    obj.append($div_li);
                }
                if (_this.canChoose) {
                    var $chooseColumns = $('.jsSummary' + _id + '_content[data-name="' + _this.chooseColumns + '"]');
                    $chooseColumns.parent().addClass("choose");
                }
                adjustHeight();
            }

            /**
             * 绘制菜单部分
             * @param obj 父级obj
             */
            function drawSetting(obj) {
                for (i = 0, l = _allColumns.length; i < l; i++) {
                    var _setting_option_tpl = '',
                        _mr = i % 2 === 0 ? 'mr' : '';
                    _setting_option_tpl += ' <li class="summary-setting-li ' + _mr + '"><label>';
                    _setting_option_tpl += '      <input type="checkbox" value="' + _allColumns[i][_this.options.cName] + '"';
                    for (var j = 0; j < _this.showColumns.length; j++) {
                        if (_allColumns[i][_this.options.cName] === _this.showColumns[j]) {
                            _setting_option_tpl += 'checked = "checked"';
                        }
                    }
                    _setting_option_tpl += '/>' + _allColumns[i].title;
                    _setting_option_tpl += '</label></li>';

                    obj.append(_setting_option_tpl);
                }
                var $selectCheckBoxes = obj.find('[type="checkbox"]:checked'),
                    $unselectCheckBoxes = obj.find('[type="checkbox"]:not(:checked)');
                if ($selectCheckBoxes.length >= _this.maxNum) {
                    $unselectCheckBoxes.attr("disabled", "disabled");
                }
                if ($selectCheckBoxes.length <= _this.minNum) {
                    $selectCheckBoxes.attr("disabled", "disabled");
                }
                var $checkboxes = obj.find('[type="checkbox"]');
                if ($checkboxes.uniform) {
                    $checkboxes.uniform();
                }
            }

            /**
             * 绘制数据
             */
            function drawData(params) {
                var _datas = [];
                var _params = $.extend({}, params);
                if (!_this.options.dataSource) {
                    var _allColumns = _this.options.allColumns;
                    for (i = 0; i < _allColumns.length; i++) {
                        var _dataName = _allColumns[i][_this.options.cName],
                            _columnConfig = getColumnConfig(_dataName),
                            _o = {
                                "cName": _dataName
                            };
                        _o[_this.options.cName + "Title"] = _columnConfig.title;
                        _datas.push(_o);
                    }
                    _this.allDatas = _datas;
                    setData(_datas);
                    adjustHeight();
                    if (_this.canChoose) {
                        var _chooseColumnsData = getColumnData(_this.chooseColumns);
                        if ($.isFunction(_this.options.callBackGetData)) {
                            _this.options.callBackGetData(_this.chooseColumns, _chooseColumnsData, _this.allDatas);
                        }
                        return;
                    }
                    if ($.isFunction(_this.options.callBackGetData)) {
                        _this.options.callBackGetData(_this.allDatas);
                    }
                    return;
                }

                _this.options.dataSource(_params, function (resp) {
                    var _result = resp.result || {};
                    _datas = $.isArray(_result) ? _result : _result.items || [];
                    for (i = 0; i < _datas.length; i++) {
                        var _dataName = _datas[i][_this.options.cName],
                            _columnConfig = getColumnConfig(_dataName);
                        _datas[i][_this.options.cName + "Title"] = _columnConfig.title;
                    }
                    _this.allDatas = _datas;
                    setData(_datas);
                    adjustHeight();
                    if (_this.canChoose) {
                        var _chooseColumnsData = getColumnData(_this.chooseColumns);
                        if ($.isFunction(_this.options.callBackGetData)) {
                            _this.options.callBackGetData(_this.chooseColumns, _chooseColumnsData, _this.allDatas);
                        }
                        return;
                    }
                    if ($.isFunction(_this.options.callBackGetData)) {
                        _this.options.callBackGetData(_this.allDatas);
                    }
                });
            }

            /**
             * 渲染数据到页面
             * @param _datas
             */
            function setData(_datas) {
                var $summaryContents = $('.jsSummary' + _id + '_content');
                var $summaryContentLi = $summaryContents.find('li');
                var _rowConfigs = {};
                _this.options.allRows.forEach(function (row) {
                    _rowConfigs[row.dataName] = row;
                });

                $summaryContentLi.each(function (index, summaryContent) {
                    var _dataName = $(summaryContent).data('name');
                    if (_rowConfigs[_dataName].isTitle) {
                        return;
                    }
                    var _html = "--";
                    if ($p.tool.isString(_rowConfigs[_dataName].tpl)) {
                        _html = $p.str.format(_rowConfigs[_dataName].tpl, '--');
                    }
                    $(summaryContent).html(_html);
                });

                for (i = 0; i < $summaryContents.length; i++) {
                    var $summaryContent = $($summaryContents[i]),
                        _data = getColumnData($summaryContent.data("name"));
                    for (var _name in _data) {
                        var $contentLi = $summaryContent.find('li[data-name="' + _name + '"]'),
                            _rowConfig = getRowConfig(_name);
                        var _html = "";
                        //if (_data[_name] === null || _data[_name] === undefined) {
                        //    continue;
                        //}
                        if ($.isFunction(_rowConfig.render)) {
                            _html = _rowConfig.render(_data[_name], _datas);
                        } else if (_rowConfig.tpl) {
                            _html = $p.str.format(_rowConfig.tpl, _data[_name]);
                        } else {
                            _html = _data[_name];
                        }

                        $contentLi.html(_html);
                    }
                }
            }

            /**
             * 调整面板各行高度
             */
            function adjustHeight() {
                $('.jsSummary' + _id + '_content').find('li').css({"height": "auto"});
                for (i in _allRows) {
                    var heights = [],
                        $lis = $('.jsSummary' + _id + '_content').find('li[data-name="' + _allRows[i].dataName + '"]');
                    heights = getAllHeight($lis);
                    var _maxHeight = Math.max.apply(null, heights);
                    $lis.css({"height": _maxHeight + "px"});
                }

                /**
                 * 获取所有li的高度
                 * @param $lis 需要获取高度的li的集合
                 * @returns {Array} 所有的高度
                 */
                function getAllHeight($lis) {
                    var _heights = [];
                    $lis.each(function () {
                        _heights.push($(this).height());
                    });

                    return _heights;
                }
            }


            /**
             * 打开设置面板
             */
            function expandSettingPanel() {
                var $settingPanel = $("#" + getTagId("setting_panel"));
                if ($settingPanel.hasClass("open")) {
                    $settingPanel.removeClass("open");
                    return;
                }

                $settingPanel.addClass("open");
                var $selectCheckBoxes = $('#' + getTagId("setting_ul") + ' [type="checkbox"]:checked');
                _this._showColumns = [];
                $selectCheckBoxes.each(function () {
                    _this._showColumns.push($(this).val());
                });
                if ($.isFunction(_this.options.callbackOpen)) {
                    _this.options.callbackOpen();
                }
            }

            /**
             * 获取某一列的数据
             * @param cName 列名
             * @returns {{}} 该列的数据
             */
            function getColumnData(cName) {
                var columnData = {};
                for (var _i = 0; _i < _this.allDatas.length; _i++) {
                    if (cName === _this.allDatas[_i][_this.options.cName]) {
                        columnData = _this.allDatas[_i];
                        break;
                    }
                }
                return columnData;
            }

            /**
             * 获取某一列的配置
             * @param cName 列名
             * @returns {{}} 该列的配置
             */
            function getColumnConfig(cName) {
                var columnData = {};
                for (var _i = 0; _i < _allColumns.length; _i++) {
                    if (cName === _allColumns[_i][_this.options.cName]) {
                        columnData = _allColumns[_i];
                        break;
                    }
                }
                return columnData;
            }

            /**
             * 获取某一行的配置
             * @param _name 行name
             * @returns {{}} 该行的配置
             */
            function getRowConfig(_name) {
                var rowConfig = {};
                for (var _i = 0; _i < _allRows.length; _i++) {
                    if (_allRows[_i].dataName === _name) {
                        rowConfig = _allRows[_i];
                        break;
                    }
                }
                return rowConfig;
            }

            /**
             * 获取tagId
             * @param tagName tangName
             * @returns {string} id
             */
            function getTagId(tagName) {
                return _nameStr + '_' + tagName + _id;
            }

            /**
             * 判断是否为数组
             * @param obj
             * @returns {boolean}
             */
            function isArray(obj) {
                return Object.prototype.toString.call(obj) === '[object Array]';
            }

            function _getCookiePath() {
                var _path;
                var _optionPath = options.cookiePath ? options.cookiePath : location.pathname;
                if (_optionPath === 'root') {
                    _path = '/';
                } else {
                    _path = _optionPath;
                }
                return _path;
            }

            init();
        }

        /**
         * [Summary 汇总面板类]
         * @param {[type]} selector [选择器]
         * @param {[type]} options [参数]
         */
        g[PagurianAlias].summary = function (selector, options) {
            var summary = new Summary(selector, options);
            return summary;
        };
    }
);
