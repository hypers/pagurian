/**
 * Created by hypers-godfery on 2015/7/24.
 */
define(function (require, exports, module) {
    var g = window;

    /**
     * [DataListView 数据视图类]
     * @param {[type]} selector [选择器]
     * @param {[type]} options [参数]
     */
    function DataListView(selector, options) {
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
            "sProcessing": '<i class="fa fa-spinner fa-spin big"></i>&nbsp;&nbsp;加载中',
            "bInitLoad": true,
            "bEmptyData": true, //返回数据结果是否为空
            "sTplHtml": "",
            "sDataBody": {
                "ele": "div",
                "cls": "dataListView_Wrap"
            },
            "sDom": ["D", "<div style='display: block;' class='bottom'>", "S", "T", "P", "</div>"]
        }
        this.version = "0.2";
        this.dataListName = selector.substring(1);
        this.paginate = {};
        /**
         * [init description] 初始化页面
         * @return {[type]} [description]
         */
        this.init = function () {
            var o = this;
            options = $.extend(this.options, options);
            this.bindEvent();
            //初始化页面
            if (options.bInitLoad) {
                this.loadData();
            }
        };
        /**
         * [bindEvent 绑定事件]
         * @return {[type]} [description]
         */
        this.bindEvent = function () {
            var o = this;
            $(document).delegate('#' + o.dataListName + '_paginate .pagination li:not(.disabled)', 'click', function () {
                var page = $(this).data("id");
                switch (page) {
                    case "prev" :
                        page = o.params.page - 1 === 0 ? 1 : o.params.page - 1;
                        break;
                    case "next":
                        page = o.params.page + 1 > o.params.pagenum ? o.params.pagenum : o.params.page + 1;
                        break;
                    default:
                        break;
                }
                o.params.page = page;
                o.params.pagesize = $('#' + o.dataListName + '_length select').val() === undefined ? 30 : $('#' + o.dataListName + '_length select').val();
                o.update();
            });

            $(document).delegate('.dataTables_length select', 'change', function () {
                o.params.page = 1;
                o.params.pagesize = $(this).val();
                o.update();
            });
        }
        /**
         * [initDom 初始化分页控件]
         * @param  {[type]} data [description]
         * @return {[type]}      [description]
         */
        this.initDom = function (data) {
            var o = $(selector);
            var _paginate;
            if (data.page) {
                _paginate = {
                    "listLength": 5,
                    "page": +data.page.current,
                    "pagesize": +data.page.pagesize,
                    "total": +data.page.total,
                    "pagenum": Math.ceil(+data.page.total / +data.page.pagesize)
                };
            } else {
                _paginate = {
                    "listLength": 5,
                    "page": 1,
                    "pagesize": 1,
                    "pagenum": 1
                };
            }

            var oPaginate = this.paginate = _paginate;

            var sClass, iStart, iEnd, iHalf = Math.ceil(oPaginate.listLength / 2);

            var sDom = "",
                sDataView = "",
                sPaginate = "",
                sPageSelect = "",
                sPageTotal = "";

            sDataView += '<' + options.sDataBody.ele + ' id="' + this.dataListName + '_data_body" class="' + options.sDataBody.cls + '"></' + options.sDataBody.ele + '>';

            //生成paginate
            sPaginate += '    <div class="dataListView_paginate" id="' + this.dataListName + '_paginate">';
            sPaginate += '        <ul style="visibility: visible;" class="pagination">';
            sPaginate += '             <li class="prev" data-id="1"><a href="javascript:;" title="第一页"><i class="fa fa-angle-double-left"></i></a></li>';
            sPaginate += '             <li class="prev" data-id="prev"><a href="javascript:;" title="上一页"><i class="fa fa-angle-left"></i></a></li>';

            if (oPaginate.pagenum < oPaginate.listLength) {
                iStart = 1;
                iEnd = oPaginate.pagenum;
            } else if (oPaginate.page <= iHalf) {
                iStart = 1;
                iEnd = oPaginate.listLength;
            } else if (oPaginate.page >= (oPaginate.pagenum - iHalf)) {
                iStart = oPaginate.pagenum - oPaginate.listLength + 1;
                iEnd = oPaginate.pagenum;
            } else {
                iStart = oPaginate.page - iHalf + 1;
                iEnd = iStart + oPaginate.listLength - 1;
            }

            for (var j = iStart; j <= iEnd; j++) {
                sClass = (j == oPaginate.page) ? 'class="active"' : '';
                sPaginate += '<li ' + sClass + ' data-id=' + j + '><a href="javascript:;">' + j + '</a></li>';
            }

            sPaginate += '             <li class="next" data-id="next"><a href="javascript:;" title="下一页"><i class="fa fa-angle-right"></i></a></li>';
            sPaginate += '             <li class="next" data-id="' + oPaginate.pagenum + '"><a href="javascript:;" title="最后一页"><i class="fa fa-angle-double-right"></i></a></li>';
            sPaginate += '        </ul>';
            sPaginate += '    </div>';

            //生成pageSelect
            sPageSelect += '     <div class="dataListView_length" id="' + this.dataListName + '_length">';
            sPageSelect += '         <label>每页';
            sPageSelect += '                 <select class="form-control input-small">';
            sPageSelect += '                         <option ';
            if (oPaginate.pagesize === 30) {
                sPageSelect += 'selected="selected"';
            }
            sPageSelect += '                                  value="30">30</option>';
            sPageSelect += '                         <option ';
            if (oPaginate.pagesize === 50) {
                sPageSelect += 'selected="selected"';
            }
            sPageSelect += '                                  value="50">50</option>';
            sPageSelect += '                         <option ';
            if (oPaginate.pagesize === 100) {
                sPageSelect += 'selected="selected"';
            }
            sPageSelect += '                                  value="100">100</option>';
            sPageSelect += '                 </select> 条';
            sPageSelect += '         </label>';
            sPageSelect += '     </div>'

            //生成pageTotal
            if (oPaginate.total) {
                sPageTotal += '     <div class="dataListView_info"  id="' + this.dataListName + '_info"> ';
                sPageTotal += '共 <span class="num">' + oPaginate.total + '</span> 条数据';
                sPageTotal += '     </div>';
            }

            var oDom = {
                "D": sDataView, //data
                "S": sPageSelect,//select
                "T": sPageTotal,//total
                "P": sPaginate,//paginate
            }

            for (var i = 0, l = options.sDom.length; i < l; i++) {
                if (oDom[options.sDom[i]]) {
                    sDom += oDom[options.sDom[i]];
                } else {
                    sDom += (options.sDom[i] === "D" ||
                    options.sDom[i] === "S" ||
                    options.sDom[i] === "T" ||
                    options.sDom[i] === "P") ? "" : options.sDom[i];
                }
            }

            o.find('#' + this.dataListName + '_paginate').remove();
            o.find('#' + this.dataListName + '_data_body').remove();
            o.append(sDom);

            //判断上一页下一页等按钮是否可用
            if (oPaginate.page === 1) {
                $('li.prev').addClass('disabled');
            } else {
                $('li.prev').removeClass('disabled');
            }

            if (oPaginate.page === oPaginate.pagenum || oPaginate.pagenum === 0) {
                $('li.next').addClass('disabled');
            } else {
                $('li.next').removeClass('disabled');
            }
        };

        /**
         * [initProcessing 初始化状态dom]
         * @return {[void]}
         */
        this.initProcessing = function () {
            var sProcessing = "",
                o = $(selector);

            sProcessing += '<div style="visibility:visible" class="dataTables_processing" id="' + this.dataListName + '_processing">';
            sProcessing += options.sProcessing;
            sProcessing += '</div>';

            if (this.options.bEmptyData) { //如果查询结果为空 则清除文本
                o.find(".dataTables_empty").empty().append("&nbsp;");
            }

            if (o.find('#' + this.dataListName + '_processing').length === 0) {
                o.append(sProcessing);
            } else {
                $('#' + this.dataListName + '_processing').css({"visibility": "visible"})
            }
        }

        /**
         * [initDataView 初始化数据]
         * @param  {[type]} data [description]
         * @return {[type]}      [description]
         */
        this.initDataView = function (data) {
            var o = this,
                oData = $('#' + this.dataListName + '_data_body');
            oData.empty();
            if (!data.result || data.result.length === 0) {
                var _empty_tml = ['<table class="col-md-12">',
                    '            <tbody>',
                    '            <tr class="odd">',
                    '                <td valign="top" colspan="8" class="dataTables_empty"><i class="fa fa-info-circle  big"></i>',
                    '                    查询结果为空',
                    '                </td>',
                    '            </tr>',
                    '            </tbody>',
                    '        </table>'].join("");
                o.options.bEmptyData = true;
                $('#' + this.dataListName + '_processing').css({"visibility": "hidden"});
                oData.append(_empty_tml);
                $("#" + this.dataListName + "_paginate").empty();
                options.fnCall && options.fnCall();
                return;
            }
            var result = data.result;
            o.options.bEmptyData = false;
            $('#' + this.dataListName + '_processing').css({"visibility": "hidden"});
            for (var i = 0; i < result.length; i++) {
                oData.append(options.fnFormat(result[i]));
            }

            options.fnCall && options.fnCall();
        }
        /**
         * [loadData 载入数据]
         * @return {[type]} [description]
         */
        this.loadData = function () {
            var o = this,
                _selector = $(selector);
            this.params = options.fnParams();
            _selector.addClass("dataListView");
            o.initProcessing();
            options.dataSource(this.params, function (resp) {
                //初始化底部分页插件
                o.initDom(resp);
                //初始化视图数据
                o.initDataView(resp);
            });
        };
        /**
         * [update description] 更新数据
         * @return {[type]} [description]
         */
        this.update = function () {
            this.loadData();
        };
    }

    /**
     * [dataListView 数据列表视图]
     * @param  {[type]} selector [选择器]
     * @param  {[type]} options [选项]
     * @return {[type]}         [dataListView]
     */
    g[PagurianAlias].plugin.dataListView = function (seletor, options) {
        var view = new DataListView(seletor, options);
        view.init();
        return view;
    }
});
