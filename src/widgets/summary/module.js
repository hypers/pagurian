/**
 * Created by hypers-godfery on 2015-10-28.
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
            this.version = "2015.10.28.1626";
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
                "maxNum": 5,
                //最小展示数
                "minNum": 1,
                //可以选择
                "canChoose":false,
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
                "maxNum": 5,
                //最小展示数
                "minNum": 1,
                //可以切换
                "canChoose": false,
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
                 * "callBackPanel"：function(_columnName, _columnData, _columnsData){}//点击的列名，当前列数据，所有数据
                 */
                "callBackPanel": null
            };

            /**
             * 更新数据 并刷新组件
             */
            this.update = function () {
                drawData();
            };

            /**
             * 初始化组件
             */
            var init = function () {
                o.options = $.extend(o.options, options);
                _allColumns = o.options.allColumns;
                _allRows = o.options.allRows;
                o.maxNum = o.options.maxNum;
                o.minNum = o.options.minNum;
                o.canChoose = o.options.canChoose;
                if (!isArray(_allColumns)) {
                    alert('Summary:[' + selector + '] allColumns不为正确的类型:[Array],请正确设置allColumns');
                    return;
                }
                //判断并设置最大展示数和展示数
                if (o.maxNum <= _allColumns.length) {
                    _showNum = o.maxNum;
                } else if (o.maxNum > _allColumns.length) {
                    o.maxNum = _allColumns.length;
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
                    _settingPanelTpl = "";

                _summaryPanelTpl += '<div id="' + getTagId("div_ul") + '" class="summary-div-ul li' + _showNum + '">';
                _settingPanelTpl += '</div>';

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
                    o.options.callbackSubmit && o.options.callbackSubmit(o.showColumns, o.allDatas);
                });

                /**
                 * setting cancel按钮
                 */
                $(document).delegate("#" + getTagId("btn_cancel"), 'click', function () {
                    expandSettingPanel();
                    o.options.callbackCancel && o.options.callbackCancel();
                });

                /**
                 * setting 中的checkbox
                 */
                $(document).delegate('#' + getTagId("setting_ul") + ' [type="checkbox"]', 'click', function () {
                    var $allCheckBoxes = $('#' + getTagId("setting_ul") + ' [type="checkbox"]'),
                        $selectCheckBoxes = $('#' + getTagId("setting_ul") + ' [type="checkbox"]:checked'),
                        $unselectCheckBoxes = $('#' + getTagId("setting_ul") + ' [type="checkbox"]:not(:checked)');
                    var checkNum = $selectCheckBoxes.length;
                    if (checkNum >= o.maxNum) {
                        $unselectCheckBoxes.attr("disabled", "disabled");
                        if ($.uniform) {
                            $allCheckBoxes.uniform.update();
                        }
                    } else {
                        $allCheckBoxes.removeAttr("disabled");
                        if ($.uniform) {
                            $allCheckBoxes.uniform.update();
                        }
                    }
                    if (checkNum === o.minNum) {
                        $selectCheckBoxes.attr("disabled", "disabled");
                        if ($.uniform) {
                            $allCheckBoxes.uniform.update();
                        }
                    }
                    o._showColumns = [];
                    $selectCheckBoxes.each(function () {
                        o._showColumns.push($(this).val());
                    });
                });

                /**
                 * 面板点击回调
                 */
                if (o.options.callBackPanel) {
                    $(document).delegate('.jsSummary' + _id + '_content', 'click', function () {
                        var _columnName = $(this).data("name"),
                            _columnData = {},
                            _columnsData = o.allDatas;
                        for (i in _columnsData) {
                            if (_columnsData[i][o.options.cName] === _columnName) {
                                _columnData = _columnsData[i];
                                break;
                            }
                        }
                        if (o.canChoose) {
                            o.chooseColumns = _columnName;
                            params.set(_cookieName + ".chooseColumns", o.chooseColumns);
                            $("#" + getTagId("div_ul")).find(".summary-div-li").removeClass("choose");
                            $(this).parent().addClass("choose");
                        }
                        o.options.callBackPanel && o.options.callBackPanel(_columnName, _columnData, _columnsData);
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
                    for (j = 0; j < _allColumns.length; j++) {
                        if (_columnsName === _allColumns[j][o.options.cName]) {
                            var _div_li_tpl = '';
                            _div_li_tpl += '<div class="summary-div-li">';
                            _div_li_tpl += '    <ul data-name="' + _allColumns[i].cName + '" class="jsSummary' + _id + '_content">';
                            for (var k = 0; k < _allRows.length; k++) {
                                var _class = _allRows[k].klass ? _allRows[k].klass : "",
                                    _text = _allRows[k].tpl ? _allRows[k].tpl.replace("{0}", "--") : "--";
                                _text = _allRows[k].isTitle ? _allColumns[j].title : _text;
                                _div_li_tpl += ' <li class="' + _class + '" data-name="' + _allRows[k].dataName + '">' + _text + '</li>';
                            }
                            _div_li_tpl += '    </ul>';
                            if (o.canChoose) {
                                _div_li_tpl += '<div class="summary-triangle"></div>';
                            }
                            _div_li_tpl += '</div>';
                            obj.append(_div_li_tpl);
                        }
                    }
                }
                if (o.canChoose) {
                    $('.jsSummary' + _id + '_content[data-name="' + o.chooseColumns + '"]').parent().addClass("choose");
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
                    _setting_option_tpl += ' <li class="summary-setting-li ' + _mr + '">';
                    _setting_option_tpl += '      <input type="checkbox" value="' + _allColumns[i][o.options.cName] + '"';
                    for (var j = 0; j < o.showColumns.length; j++) {
                        if (_allColumns[i][o.options.cName] === o.showColumns[j]) {
                            _setting_option_tpl += 'checked = "checked"';
                        }
                    }
                    _setting_option_tpl += '/>' + _allColumns[i].title;
                    _setting_option_tpl += '</li>';

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
                if (!o.options.dataSource) {
                    alert('Summary:[' + selector + '] dataSource is undefined');
                    return;
                }
                o.options.dataSource(o.options.dataParams, function (resp) {
                    var _datas = resp.result ? resp.result : [];
                    o.allDatas = _datas;
                    setData(_datas);
                    adjustHeight();
                });
            }

            /**
             * 渲染数据到页面
             * @param _datas
             */
            function setData(_datas) {
                var _cName = o.options.cName,
                    _rowsConfig = _allRows,
                    $summaryContents = $('.jsSummary' + _id + '_content');
                for (i = 0; i < _datas.length; i++) {
                    for (j = 0; j < $summaryContents.length; j++) {
                        var $summaryContent = $($summaryContents[j]);
                        if ($summaryContent.data("name") === _datas[i][_cName]) {
                            var _data = _datas[i];
                            for (var _name in _data) {
                                var $contentLi = $summaryContent.find('li[data-name="' + _name + '"]'),
                                    _rowConfig = {};
                                for (var k = 0; k < _rowsConfig.length; k++) {
                                    if (_rowsConfig[k].dataName === _name) {
                                        _rowConfig = _rowsConfig[k];
                                        break;
                                    }
                                }
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
                    $lis.each(function () {
                        heights.push($(this).height());
                    });
                    var _maxHeight = Math.max.apply(null, heights);
                    $lis.css({"height": _maxHeight + "px"});
                }
            }


            /**
             * 打开设置面板
             */
            function expandSettingPanel() {
                var $settingPanel = $("#" + getTagId("setting_panel"));
                if ($settingPanel.hasClass("open")) {
                    $settingPanel.removeClass("open");
                } else {
                    $settingPanel.addClass("open");
                    var $selectCheckBoxes = $('#' + getTagId("setting_ul") + ' [type="checkbox"]:checked');
                    o._showColumns = [];
                    $selectCheckBoxes.each(function () {
                        o._showColumns.push($(this).val());
                    });
                    o.options.callbackOpen && o.options.callbackOpen();
                }
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
        g[PagurianAlias].plugin.summary = function (seletor, options) {
            var summary = new Summary(seletor, options);
            return summary;
        };
    }
);
