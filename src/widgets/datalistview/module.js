/**
 * Created by hypers-godfery on 2015/7/24.
 * Updated by hypers-godfery on 2015/9/10 fixbug.
 * Updated by hypers-godfery on 2015/10/12 添加国际化.
 * Updated by hypers-godfery on 2015/12/6 添加对新数据格式的支持.
 * Updated by hypers-godfery on 2015/12/21 优化并精简大量代码.
 */
define(function (require, exports, module) {
    var g = window,
        locale = {};
    locale.zh_CN = require('./locale/zh_CN');
    locale.en_US = require('./locale/en_US');
    var oLanguage = locale[g[PagurianAlias].language || "zh_CN"];

    /**
     * [DataListView 数据视图类]
     * @param {[type]} selector [选择器] 推荐使用class或者id
     * @param {[type]} options [参数]
     */
    function DataListView(selector, options) {
        var that = this,
            _id = '_' + (Math.random() * 1E18).toString(36).slice(0, 5).toUpperCase();
        this.params = {};
        /**
         * [options 可选参数]
         * @type {Object}
         * @description {
         *   "dataSource": module method,
         *   "fnParams":参数,
         *   "fnFormat":格式化方法,
         *   "fnCall":回调,
         *   "bInitLoad": 是否初始化加载数据
         *   "tplHtml": 模版,
         *   "sProcessing":状态字段
         *   "sDataBody": { 主体
         *       "ele": 标签,
         *       "cls": 类
         *   },
         *   "sDom": ["D", "S", "T", "P"]  默认为[data 数据,select 每页显示多少,total 共计,paginate 分页]
         * }
         */
        this.options = {
            "dataSource": null,
            "fnParams": null,
            "fnFormat": null,
            "fnCall": null,
            "sProcessing": oLanguage.sProcessing,
            "bInitLoad": true,
            "bEmptyData": true, //返回数据结果是否为空
            "sTplHtml": "",
            "sDataBody": {
                "ele": "div",
                "cls": "dataListView_Wrap"
            },
            "aPageSize": [30, 50, 100],
            "sDom": ["D", "<div style='display: block;' class='bottom'>", "S", "T", "P", "</div>"]
        };
        this.version = "2015.01.05.1035";
        this.dataListName = selector.substring(1) + _id;
        this.paginate = {};
        /**
         * [update description] 更新数据
         * @return {[type]} [description]
         */
        this.update = function () {
            loadData();
            return this;
        };

        /**
         * [init description] 初始化页面
         * @return {[type]} [description]
         */
        this.init = function () {
            options = $.extend({}, that.options, options);
            bindEvent();
            //初始化页面
            if (options.bInitLoad) {
                loadData();
            }
            return that;
        };
        /**
         * [bindEvent 绑定事件]
         * @return {[type]} [description]
         */
        var bindEvent = function () {
            //var that = that;
            $(document).delegate('#' + that.dataListName + '_paginate li:not(.disabled)', 'click', function () {
                var page = $(this).data("id");
                switch (page) {
                    case "prev" :
                        page = that.params.page - 1 === 0 ? 1 : that.params.page - 1;
                        break;
                    case "next":
                        page = that.params.page + 1 > that.params.pagenum ? that.params.pagenum : that.params.page + 1;
                        break;
                    default:
                        break;
                }
                that.params.page = page;
                that.params.pagesize = $('#' + that.dataListName + '_length select').val() === undefined ? 30 : $('#' + that.dataListName + '_length select').val();
                that.update();
            });

            $(document).delegate('#' + that.dataListName + '_length.dataListView_length select', 'change', function () {
                that.params.page = 1;
                that.params.pagesize = $(this).val();
                that.update();
            });
        };
        /**
         * [initDom 初始化分页控件]
         * @param  {[type]} data [description]
         * @return {[type]}      [description]
         */
        var initDom = function (data) {
            //$selector {[JQuery Obj]} [selector obj]
            var $selector = $(selector);
            var _paginate = {
                "listLength": 5,
                "page": 1,
                "pagesize": 1,
                "pagenum": 1
            };
            if (data.page) {
                _paginate = {
                    "listLength": 5,
                    "page": +data.page.current,
                    "pagesize": +data.page.pagesize,
                    "total": +data.page.total,
                    "pagenum": Math.ceil(+data.page.total / +data.page.pagesize)
                };
            }
            that.paginate = _paginate;

            var sClass='', iStart = 1, iEnd =1, iHalf = Math.ceil(_paginate.listLength / 2);

            var sDom = "",
                sDataView = "",
                sPaginate = "",
                sPageSelect = "",
                sPageTotal = "";

            sDataView += '<' + options.sDataBody.ele + ' id="' + that.dataListName + '_data_body" class="' + options.sDataBody.cls + '"></' + options.sDataBody.ele + '>';

            //生成paginate
            sPaginate += '    <div class="dataListView_paginate" id="' + that.dataListName + '_paginate">';
            sPaginate += '        <ul style="visibility: visible;" class="pagination">';
            sPaginate += '             <li class="prev" data-id="1"><a href="javascript:;" title="' + oLanguage.oPaginate.sFirst + '"><i class="fa fa-angle-double-left"></i></a></li>';
            sPaginate += '             <li class="prev" data-id="prev"><a href="javascript:;" title="' + oLanguage.oPaginate.sPrevious + '"><i class="fa fa-angle-left"></i></a></li>';

            if (_paginate.pagenum < _paginate.listLength) {
                iStart = 1;
                iEnd = _paginate.pagenum;
            } else if (_paginate.page <= iHalf) {
                iStart = 1;
                iEnd = _paginate.listLength;
            } else if (_paginate.page >= (_paginate.pagenum - iHalf)) {
                iStart = _paginate.pagenum - _paginate.listLength + 1;
                iEnd = _paginate.pagenum;
            } else {
                iStart = _paginate.page - iHalf + 1;
                iEnd = iStart + _paginate.listLength - 1;
            }
            for (var j = iStart; j <= iEnd; j++) {
                sClass = (j === _paginate.page) ? 'class="active"' : '';
                sPaginate += '<li ' + sClass + ' data-id=' + j + '><a href="javascript:;">' + j + '</a></li>';
            }

            sPaginate += '             <li class="next" data-id="next"><a href="javascript:;" title="' + oLanguage.oPaginate.sNext + '"><i class="fa fa-angle-right"></i></a></li>';
            sPaginate += '             <li class="next" data-id="' + _paginate.pagenum + '"><a href="javascript:;" title="' + oLanguage.oPaginate.sLast + '"><i class="fa fa-angle-double-right"></i></a></li>';
            sPaginate += '        </ul>';
            sPaginate += '    </div>';

            //生成pageSelect
            sPageSelect += '     <div class="dataListView_length" id="' + that.dataListName + '_length">';
            sPageSelect += '         <label>';
            var _sPageSelect = oLanguage.sLengthMenu,
                _menu_ = "";
            _menu_ += '                 <select class="form-control input-small">';
            var _arrPageSize = options.aPageSize;
            for (var _ps = 0; _ps < _arrPageSize.length; _ps++) {
                _menu_ += '<option value="' + _arrPageSize[_ps] + '"';
                _menu_ += _paginate.pagesize === _arrPageSize[_ps] ? 'selected="selected"' : '';
                _menu_ += '>' + _arrPageSize[_ps] + '</option>';
            }
            _menu_ += '                 </select>';
            _sPageSelect = _sPageSelect.replace(" _MENU_ ", _menu_);
            sPageSelect += _sPageSelect;
            sPageSelect += '         </label>';
            sPageSelect += '     </div>';

            //生成pageTotal
            if (_paginate.total) {
                sPageTotal += '     <div class="dataListView_info"  id="' + that.dataListName + '_info"> ';
                sPageTotal += oLanguage.sInfo;
                sPageTotal = sPageTotal.replace("_TOTAL_", _paginate.total);
                sPageTotal += '     </div>';
            }

            var oDom = {
                "D": sDataView, //data
                "S": sPageSelect,//select
                "T": sPageTotal,//total
                "P": sPaginate,//paginate
            };

            for (var i = 0, l = options.sDom.length; i < l; i++) {
                if (oDom[options.sDom[i]]) {
                    sDom += oDom[options.sDom[i]];
                    continue;
                }
                sDom += (options.sDom[i] === "D" ||
                options.sDom[i] === "S" ||
                options.sDom[i] === "T" ||
                options.sDom[i] === "P") ? "" : options.sDom[i];

            }

            $selector.find('#' + that.dataListName + '_paginate').remove();
            $selector.find('#' + that.dataListName + '_info').remove();
            $selector.find('#' + that.dataListName + '_length').remove();
            $selector.find('#' + that.dataListName + '_data_body').remove();
            $selector.append(sDom);

            //判断上一页下一页等按钮是否可用
            if (_paginate.page === 1) {
                $('li.prev').addClass('disabled');
            } else {
                $('li.prev').removeClass('disabled');
            }

            if (_paginate.page === _paginate.pagenum || _paginate.pagenum === 0) {
                $('li.next').addClass('disabled');
            } else {
                $('li.next').removeClass('disabled');
            }
        };

        /**
         * [initProcessing 初始化状态dom]
         * @return {[void]}
         */
        var initProcessing = function () {
            var sProcessing = "",
                o = $(selector);

            sProcessing += '<div style="visibility:visible" class="dataTables_processing" id="' + that.dataListName + '_processing">';
            sProcessing += options.sProcessing;
            sProcessing += '</div>';

            if (that.options.bEmptyData) { //如果查询结果为空 则清除文本
                o.find(".dataTables_empty").empty().append("&nbsp;");
            }

            if (o.find('#' + that.dataListName + '_processing').length === 0) {
                o.append(sProcessing);
                return;
            }
            $('#' + that.dataListName + '_processing').css({"visibility": "visible"});
        };

        /**
         * [initDataView 初始化数据]
         * @param  {[type]} data [description]
         * @return {[type]}      [description]
         */
        var initDataView = function (data) {
            var o = this,
                oData = $('#' + that.dataListName + '_data_body');
            oData.empty();
            var _result = data.result || {};
            var _datas = $.isArray(_result) ? _result : _result.items || [];
            if (_datas.length === 0) {
                var _empty_tml = ['<table class="col-md-12">',
                    '            <tbody>',
                    '            <tr class="odd">',
                    '                <td valign="top" colspan="8" class="dataTables_empty">',
                    oLanguage.sEmptyTable,
                    '                </td>',
                    '            </tr>',
                    '            </tbody>',
                    '        </table>'].join("");
                o.options.bEmptyData = true;
                $('#' + that.dataListName + '_processing').css({"visibility": "hidden"});
                oData.append(_empty_tml);
                $("#" + that.dataListName + "_paginate").empty();
                if (options.fnCall) {
                    options.fnCall();
                }
            }
            var result = _datas;
            that.options.bEmptyData = false;
            $('#' + that.dataListName + '_processing').css({"visibility": "hidden"});
            for (var i = 0; i < result.length; i++) {
                oData.append(options.fnFormat(result[i]));
            }
            if ($.isFunction(options.fnCall)) {
                options.fnCall();
            }

        };
        /**
         * [loadData 载入数据]
         * @return {[type]} [description]
         */
        var loadData = function () {
            var o = this,
                _selector = $(selector);
            that.params = $.extend({}, that.params, options.fnParams());
            _selector.addClass("dataListView");
            initProcessing();
            options.dataSource(that.params, function (resp) {
                //初始化底部分页插件
                initDom(resp);
                //初始化视图数据
                initDataView(resp);
            });
        };

        that.init();
    }

    /**
     * [dataListView 数据列表视图]
     * @param  {[type]} selector [选择器]
     * @param  {[type]} options [选项]
     * @return {[type]}         [dataListView]
     */
    g[PagurianAlias].dataListView = function (selector, options) {
        var view = new DataListView(selector, options);
        return view;
    };
});
