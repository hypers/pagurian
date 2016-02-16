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
        var oLanguage = locale[g[PagurianAlias].language || "zh_CN"];

        /**
         * [Summary 汇总面板类]
         * @param {[type]} selector [选择器]
         * @param {[type]} options [参数]
         */
        function Summary(selector, options) {
            var o = this,
            //前缀名
                _nameStr = options.name ? options.name : "summary",
            //随机id
                _id = '_' + (Math.random() * 1E18).toString(36).slice(0, 5).toUpperCase(),
            //cookieName
                _cookieName,
            //全部列、行
                _allColumns, _allRows,
            //临时变量
                $div_ul, $setting_ul, i, l, j;
            //最小列数
            var MIN_COLUMN_NUM = 1;
            //cookie设置及获取
            var params = {
                set: function (key, value) {
                    this[key] = value;
                    $.cookie('params.' + key, value, {
                        expires: 7,
                        path: '/'
                    });
                },
                get: function (key) {
                    return this[key] || $.cookie('params.' + key);
                }
            };
            //展示数
            var _showNum = 0;
            //selectorStr
            this.selectorStr = selector.substring(1, selector.length);
            //版本
            this.version = "2015.12.06.0028";
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
            this.update = function () {
                drawData();
                return this;
            };

            /**
             *  调整组件高度
             */
            this.autoHeight = function () {
                adjustHeight();
                return this;
            };

            /**
             * 初始化组件
             */
            var init = function () {
                o.options = $.extend(o.options, options);
                _allColumns = $.isArray(o.options.allColumns) ? o.options.allColumns : [];
                _allRows = o.options.allRows;
                o.maxNum = o.options.maxNum ? o.options.maxNum : _allColumns.length;
                o.minNum = o.options.minNum ? o.options.minNum : MIN_COLUMN_NUM;
                o.canChoose = o.options.canChoose;
                o.showSetting = o.options.showSetting;
                //判断并设置最大展示数和展示数
                o.maxNum = o.maxNum <= _allColumns.length ? o.maxNum : _allColumns.length;
                if (o.maxNum > _allColumns.length) {
                    _showNum = _allColumns.length;
                }
                //设置展示的列
                _cookieName = _nameStr + '.' + o.selectorStr;

                var cookieShowColumns = params.get(_cookieName);
                if (!cookieShowColumns) {
                    for (i = 0; i < o.maxNum; i++) {
                        o.showColumns.push(_allColumns[i][o.options.cName]);
                    }
                    params.set(_cookieName, o.showColumns.join(","));
                } else {
                    o.showColumns = cookieShowColumns.split(",");
                }
                //如果可以切换则设置已选择的列
                if (o.canChoose) {
                    var cookieChooseColumns = params.get(_cookieName + ".chooseColumns");
                    if (!cookieChooseColumns) {
                        o.chooseColumns = o.showColumns[0];
                    } else {
                        o.chooseColumns = cookieChooseColumns;
                    }
                }

                bindEvent(selector, options);
                drawDom(selector, options);
            };

            /**
             * 绘制组件
             * @param selector
             * @param options
             */
            var drawDom = function (selector, options) {
                var _summaryPanelTpl = "",
                    _settingPanelTpl = "",
                    _classBorder = o.options.canChoose ? "border-bottom" : "";

                _summaryPanelTpl += '<div id="' + getTagId("div_ul") + '" class="summary-div-ul li' + _showNum + ' ' + _classBorder + '">';
                _summaryPanelTpl += '</div>';
                if (o.showSetting) {
                    _settingPanelTpl += '<div id="' + getTagId("setting_wrap") + '" class="summary-setting-wrap">';
                    _settingPanelTpl += '    <a id="' + getTagId("setting_icon") + '" class="summary-setting-icon" href="javascript:;"><i class="fa fa-cog "></i></a>';
                    _settingPanelTpl += '    <div id="' + getTagId("setting_panel") + '" class="summary-setting-panel">';
                    _settingPanelTpl += '        <div class="summary-setting-panel-arrows"></div>';
                    _settingPanelTpl += '        <div class="summary-setting-panel-body">';
                    _settingPanelTpl += '            <div class="summary-setting-panel-text">';
                    _settingPanelTpl += '                <span>' + oLanguage.maxNum.replace("{0}", _showNum) + '</span>';
                    _settingPanelTpl += '                <a class="summary-reset" href="javascript:;">' + oLanguage.resetDefault + '</a>';
                    _settingPanelTpl += '            </div>';
                    _settingPanelTpl += '            <ul id="' + getTagId("setting_ul") + '" class="summary-setting-ul">';
                    _settingPanelTpl += '            </ul>';
                    _settingPanelTpl += '        </div>';
                    _settingPanelTpl += '        <div class="summary-setting-panel-footer">';
                    _settingPanelTpl += '            <button id="' + getTagId("btn_submit") + '" class="btn btn-primary" type="button">' + oLanguage.btnSubmit + '</button>';
                    _settingPanelTpl += '            <button id="' + getTagId("btn_cancel") + '" class="btn btn-default" type="button">' + oLanguage.btnCancel + '</button>';
                    _settingPanelTpl += '        </div>';
                    _settingPanelTpl += '    </div>';
                    _settingPanelTpl += '</div>';
                }

                $(selector).append(_summaryPanelTpl).append(_settingPanelTpl);

                drawInitDom();
                drawData();
            };

            /**
             * 绑定事件
             * @param selector
             * @param options
             */
            var bindEvent = function (selector, options) {
                if (o.showSetting) {
                    /**
                     * 设置按钮
                     */
                    $(document).delegate("#" + getTagId("setting_icon"), 'click', function () {
                        expandSettingPanel();
                    });

                    /**
                     * setting submit按钮
                     */
                    $(document).delegate("#" + getTagId("btn_submit"), 'click', function () {
                        expandSettingPanel();
                        o.showColumns = o._showColumns;
                        params.set(_cookieName, o.showColumns.join(","));
                        drawPanel($div_ul);
                        setData(o.allDatas);
                        adjustHeight();
                        if ($.isFunction(o.options.callbackSubmit)) {
                            o.options.callbackSubmit(o.showColumns, o.allDatas);
                        }
                    });

                    /**
                     * setting cancel按钮
                     */
                    $(document).delegate("#" + getTagId("btn_cancel"), 'click', function () {
                        var $allCheckBoxes = $('#' + getTagId("setting_ul") + ' [type="checkbox"]');
                        $allCheckBoxes.removeAttr("checked");
                        for (var _i = 0; _i < o.showColumns.length; _i++) {
                            $('#' + getTagId("setting_ul") + ' [type="checkbox"][value="' + o.showColumns[_i] + '"]')
                                .prop("checked", "checked");
                        }
                        updateCheckbox();
                        expandSettingPanel();
                        if (o.options.callbackCancel) {
                            o.options.callbackCancel();
                        }
                    });

                    /**
                     * setting 中的checkbox
                     */
                    $(document).delegate('#' + getTagId("setting_ul") + ' [type="checkbox"]', 'click', function () {
                        var $selectCheckBoxes = updateCheckbox();
                        o._showColumns = [];
                        $selectCheckBoxes.each(function () {
                            o._showColumns.push($(this).val());
                        });
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
                        if (checkNum >= o.maxNum) {
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
                        if (checkNum === o.minNum) {
                            _$selectCheckBoxes.attr("disabled", "disabled");
                            if ($.uniform) {
                                _$allCheckBoxes.uniform.update();
                            }
                        }

                        return _$selectCheckBoxes;
                    };
                }


                /**
                 * 面板点击回调
                 */
                if (o.options.callBackPanel) {
                    $(document).delegate('.jsSummary' + _id + '_content', 'click', function () {
                        var _columnName = $(this).data("name"),
                            _columnData = getColumnData(_columnName),
                            _columnsData = o.allDatas;

                        if (o.canChoose) {
                            o.chooseColumns = _columnName;
                            params.set(_cookieName + ".chooseColumns", o.chooseColumns);
                            $("#" + getTagId("div_ul")).find(".summary-div-li").removeClass("choose");
                            $(this).parent().addClass("choose");
                        }
                        if (o.options.callBackPanel) {
                            o.options.callBackPanel(_columnName, _columnData, _columnsData);
                        }
                    });
                }

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
                obj.addClass("li" + o.showColumns.length);
                for (i = 0; i < o.showColumns.length; i++) {
                    var _columnsName = o.showColumns[i];
                    var _columnsConfig = getColumnConfig(_columnsName);
                    var _clickStr = o.options.callBackPanel ? "canClick" : "";
                    var _div_li_tpl = '';
                    _div_li_tpl += '<div class="summary-div-li">';
                    _div_li_tpl += '    <ul data-name="' + _columnsConfig.cName + '" class="jsSummary' + _id + '_content ' + _clickStr + '">';
                    for (var k = 0; k < _allRows.length; k++) {
                        var _class = _allRows[k].klass ? _allRows[k].klass : "",
                            _text = _allRows[k].tpl ? _allRows[k].tpl.replace("{0}", "--") : "--";
                        _text = _allRows[k].isTitle ? _columnsConfig.title : _text;
                        _div_li_tpl += ' <li class="' + _class + '" data-name="' + _allRows[k].dataName + '">' + _text + '</li>';
                    }
                    _div_li_tpl += '    </ul>';
                    if (o.canChoose) {
                        _div_li_tpl += '<div class="summary-triangle"></div>';
                    }
                    _div_li_tpl += '</div>';
                    obj.append(_div_li_tpl);
                }
                if (o.canChoose) {
                    var $chooseColumns = $('.jsSummary' + _id + '_content[data-name="' + o.chooseColumns + '"]');
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
                    _setting_option_tpl += '      <input type="checkbox" value="' + _allColumns[i][o.options.cName] + '"';
                    for (var j = 0; j < o.showColumns.length; j++) {
                        if (_allColumns[i][o.options.cName] === o.showColumns[j]) {
                            _setting_option_tpl += 'checked = "checked"';
                        }
                    }
                    _setting_option_tpl += '/>' + _allColumns[i].title;
                    _setting_option_tpl += '</label></li>';

                    obj.append(_setting_option_tpl);
                }
                var $selectCheckBoxes = obj.find('[type="checkbox"]:checked'),
                    $unselectCheckBoxes = obj.find('[type="checkbox"]:not(:checked)');
                if ($selectCheckBoxes.length >= o.maxNum) {
                    $unselectCheckBoxes.attr("disabled", "disabled");
                }
                if ($selectCheckBoxes.length <= o.minNum) {
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
            function drawData() {
                var _datas = [];
                if (!o.options.dataSource) {
                    var _allColumns = o.options.allColumns;
                    for (i = 0; i < _allColumns.length; i++) {
                        var _dataName = _allColumns[i][o.options.cName],
                            _columnConfig = getColumnConfig(_dataName),
                            _o = {
                                "cName": _dataName
                            };
                        _o[o.options.cName + "Title"] = _columnConfig.title;
                        _datas.push(_o);
                    }
                    o.allDatas = _datas;
                    setData(_datas);
                    adjustHeight();
                    if (o.canChoose) {
                        var _chooseColumnsData = getColumnData(o.chooseColumns);
                        if ($.isFunction(o.options.callBackGetData)) {
                            o.options.callBackGetData(o.chooseColumns, _chooseColumnsData, o.allDatas);
                        }
                        return;
                    }
                    if ($.isFunction(o.options.callBackGetData)) {
                        o.options.callBackGetData(o.allDatas);
                    }
                    return;
                }

                o.options.dataSource(o.options.dataParams, function (resp) {
                    var _result = resp.result || {};
                    _datas = $.isArray(_result) ? _result : _result.items || [];
                    for (i = 0; i < _datas.length; i++) {
                        var _dataName = _datas[i][o.options.cName],
                            _columnConfig = getColumnConfig(_dataName);
                        _datas[i][o.options.cName + "Title"] = _columnConfig.title;
                    }
                    o.allDatas = _datas;
                    setData(_datas);
                    adjustHeight();
                    if (o.canChoose) {
                        var _chooseColumnsData = getColumnData(o.chooseColumns);
                        if($.isFunction(o.options.callBackGetData)){
                            o.options.callBackGetData(o.chooseColumns, _chooseColumnsData, o.allDatas);
                        }
                        return;
                    }
                    if($.isFunction(o.options.callBackGetData)){
                        o.options.callBackGetData(o.allDatas);
                    }
                });
            }

            /**
             * 渲染数据到页面
             * @param _datas
             */
            function setData(_datas) {
                var $summaryContents = $('.jsSummary' + _id + '_content');
                for (i = 0; i < $summaryContents.length; i++) {
                    var $summaryContent = $($summaryContents[i]),
                        _data = getColumnData($summaryContent.data("name"));
                    for (var _name in _data) {
                        var $contentLi = $summaryContent.find('li[data-name="' + _name + '"]'),
                            _rowConfig = getRowConfig(_name);
                        if (_rowConfig.render) {
                            $contentLi.html(_rowConfig.render(_data[_name], _datas));
                        } else if (_rowConfig.tpl) {
                            $contentLi.html(_rowConfig.tpl.replace("{0}", _data[_name]));
                        } else {
                            $contentLi.html(_data[_name]);
                        }
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
                function getAllHeight($lis){
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
                o._showColumns = [];
                $selectCheckBoxes.each(function () {
                    o._showColumns.push($(this).val());
                });
                if($.isFunction(o.options.callbackOpen)){
                    o.options.callbackOpen();
                }
            }

            /**
             * 获取某一列的数据
             * @param cName 列名
             * @returns {{}} 该列的数据
             */
            function getColumnData(cName) {
                var columnData = {};
                for (var _i = 0; _i < o.allDatas.length; _i++) {
                    if (cName === o.allDatas[_i][o.options.cName]) {
                        columnData = o.allDatas[_i];
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
                    if (cName === _allColumns[_i][o.options.cName]) {
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
