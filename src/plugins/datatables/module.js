define(function(require, exports, module) {

    var g = window;
    var locale = {};

    require('./1.9.4/jquery.dataTables');

    locale.zh_CN = require('./locale/zh_CN');
    locale.en_US = require('./locale/en_US');

    /* Set the defaults for DataTables initialisation */
    $.extend(true, $.fn.dataTable.defaults, {
        "sDom": "<'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", // horizobtal scrollable datatable
        //"sDom": "<'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", // defaukt datatable without  horizobtal scroll
        "sPaginationType": "bootstrap",
        "oLanguage": {
            "sLengthMenu": "_MENU_ records"
        }
    });


    /* Default class modification */
    $.extend($.fn.dataTableExt.oStdClasses, {
        "sWrapper": "dataTables_wrapper form-inline"
    });

    /* API method to get paging information */
    $.fn.dataTableExt.oApi.fnPagingInfo = function(oSettings) {
        return {
            "iStart": oSettings._iDisplayStart,
            "iEnd": oSettings.fnDisplayEnd(),
            "iLength": oSettings._iDisplayLength,
            "iTotal": oSettings.fnRecordsTotal(),
            "iFilteredTotal": oSettings.fnRecordsDisplay(),
            "iPage": Math.ceil(oSettings._iDisplayStart / oSettings._iDisplayLength),
            "iTotalPages": Math.ceil(oSettings.fnRecordsDisplay() / oSettings._iDisplayLength)
        };
    };


    $.fn.dataTableExt.oApi.fnReloadAjax = function(oSettings, sNewSource, fnCallback, bStandingRedraw) {


        if ($.fn.dataTable.versionCheck) {
            var api = new $.fn.dataTable.Api(oSettings);

            if (sNewSource) {
                api.ajax.url(sNewSource).load(fnCallback, !bStandingRedraw);
            } else {
                api.ajax.reload(fnCallback, !bStandingRedraw);
            }
            return;
        }

        if (sNewSource !== undefined && sNewSource !== null) {
            oSettings.sAjaxSource = sNewSource;
        }

        // Server-side processing should just call fnDraw
        if (oSettings.oFeatures.bServerSide) {
            this.fnDraw();
            return;
        }

        this.oApi._fnProcessingDisplay(oSettings, true);
        var that = this;
        var iStart = oSettings._iDisplayStart;
        var aData = [];

        this.oApi._fnServerParams(oSettings, aData);

        oSettings.fnServerData.call(oSettings.oInstance, oSettings.sAjaxSource, aData, function(json) {


            that.oApi._fnClearTable(oSettings);

            var aData = (oSettings.sAjaxDataProp !== "") ?
                that.oApi._fnGetObjectDataFn(oSettings.sAjaxDataProp)(json) : json;

            if (!aData) {
                return;
            }

            for (var i = 0; i < aData.length; i++) {
                that.oApi._fnAddData(oSettings, aData[i]);
            }

            oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();

            that.fnDraw();

            if (bStandingRedraw === true) {
                oSettings._iDisplayStart = iStart;
                that.oApi._fnCalculateEnd(oSettings);
                that.fnDraw(false);
            }

            that.oApi._fnProcessingDisplay(oSettings, false);

            if (typeof fnCallback == 'function' && fnCallback !== null) {
                fnCallback(oSettings);
            }
        }, oSettings);
    };

    $.fn.dataTableExt.oApi.fnLengthChange = function(oSettings, iDisplay) {
        oSettings._iDisplayLength = iDisplay;
        oSettings.oApi._fnCalculateEnd(oSettings);

        /* If we have space to show extra rows (backing up from the end point - then do so */
        if (oSettings._iDisplayEnd == oSettings.aiDisplay.length) {
            oSettings._iDisplayStart = oSettings._iDisplayEnd - oSettings._iDisplayLength;
            if (oSettings._iDisplayStart < 0) {
                oSettings._iDisplayStart = 0;
            }
        }

        if (oSettings._iDisplayLength == -1) {
            oSettings._iDisplayStart = 0;
        }

        oSettings.oApi._fnDraw(oSettings);

        if (oSettings.aanFeatures.l) {
            $('select', oSettings.aanFeatures.l).val(iDisplay);
        }
    };

    /* Bootstrap style pagination control */
    $.extend($.fn.dataTableExt.oPagination, {
        "bootstrap": {
            "fnInit": function(oSettings, nPaging, fnDraw) {
                var oLang = oSettings.oLanguage.oPaginate;
                var fnClickHandler = function(e) {
                    e.preventDefault();
                    if (oSettings.oApi._fnPageChange(oSettings, e.data.action)) {
                        fnDraw(oSettings);
                    }
                };

                // pagination with prev, next link icons
                $(nPaging).append(
                    '<ul class="pagination">' +
                    '<li class="prev disabled"><a href="#" title="' + oLang.sPrevious + '"><i class="fa fa-angle-left"></i></a></li>' +
                    '<li class="next disabled"><a href="#" title="' + oLang.sNext + '"><i class="fa fa-angle-right"></i></a></li>' +
                    '</ul>'
                );

                var els = $('a', nPaging);
                $(els[0]).bind('click.DT', {
                    action: "previous"
                }, fnClickHandler);
                $(els[1]).bind('click.DT', {
                    action: "next"
                }, fnClickHandler);
            },

            "fnUpdate": function(oSettings, fnDraw) {
                var iListLength = 5;
                var oPaging = oSettings.oInstance.fnPagingInfo();
                var an = oSettings.aanFeatures.p;
                var i, j, sClass, iStart, iEnd, iHalf = Math.floor(iListLength / 2);

                if (oPaging.iTotalPages < iListLength) {
                    iStart = 1;
                    iEnd = oPaging.iTotalPages;
                } else if (oPaging.iPage <= iHalf) {
                    iStart = 1;
                    iEnd = iListLength;
                } else if (oPaging.iPage >= (oPaging.iTotalPages - iHalf)) {
                    iStart = oPaging.iTotalPages - iListLength + 1;
                    iEnd = oPaging.iTotalPages;
                } else {
                    iStart = oPaging.iPage - iHalf + 1;
                    iEnd = iStart + iListLength - 1;
                }

                if (oPaging.iTotalPages < 0) {
                    $('.pagination', an[i]).css('visibility', 'hidden');
                } else {
                    $('.pagination', an[i]).css('visibility', 'visible');
                }

                for (i = 0, iLen = an.length; i < iLen; i++) {
                    // Remove the middle elements
                    $('li:gt(0)', an[i]).filter(':not(:last)').remove();

                    // Add the new list items and their event handlers
                    for (j = iStart; j <= iEnd; j++) {
                        sClass = (j == oPaging.iPage + 1) ? 'class="active"' : '';
                        $('<li ' + sClass + '><a href="#">' + j + '</a></li>')
                            .insertBefore($('li:last', an[i])[0])
                            .bind('click', function(e) {

                                e.preventDefault();
                                oSettings._iDisplayStart = (parseInt($('a', this).text(), 10) - 1) * oPaging.iLength;
                                fnDraw(oSettings);
                            });
                    }

                    // Add / remove disabled classes from the static elements
                    if (oPaging.iPage === 0) {
                        $('li:first', an[i]).addClass('disabled');
                    } else {
                        $('li:first', an[i]).removeClass('disabled');
                    }

                    if (oPaging.iPage === oPaging.iTotalPages - 1 || oPaging.iTotalPages === 0) {
                        $('li:last', an[i]).addClass('disabled');
                    } else {
                        $('li:last', an[i]).removeClass('disabled');
                    }
                }
            }
        }
    });

    /* Bootstrap style full number pagination control */
    $.extend($.fn.dataTableExt.oPagination, {
        "bootstrap_full_number": {
            "fnInit": function(oSettings, nPaging, fnDraw) {
                var oLang = oSettings.oLanguage.oPaginate;
                var fnClickHandler = function(e) {

                    e.preventDefault();
                    if (oSettings.oApi._fnPageChange(oSettings, e.data.action)) {
                        fnDraw(oSettings);
                    }
                };

                $(nPaging).append(
                    '<ul class="pagination">' +
                    '<li class="prev disabled"><a href="#" title="' + oLang.sFirst + '"><i class="fa fa-angle-double-left"></i></a></li>' +
                    '<li class="prev disabled"><a href="#" title="' + oLang.sPrevious + '"><i class="fa fa-angle-left"></i></a></li>' +
                    '<li class="next disabled"><a href="#" title="' + oLang.sNext + '"><i class="fa fa-angle-right"></i></a></li>' +
                    '<li class="next disabled"><a href="#" title="' + oLang.sLast + '"><i class="fa fa-angle-double-right"></i></a></li>' +
                    '</ul>'
                );
                var els = $('a', nPaging);
                $(els[0]).bind('click.DT', {
                    action: "first"
                }, fnClickHandler);
                $(els[1]).bind('click.DT', {
                    action: "previous"
                }, fnClickHandler);
                $(els[2]).bind('click.DT', {
                    action: "next"
                }, fnClickHandler);
                $(els[3]).bind('click.DT', {
                    action: "last"
                }, fnClickHandler);
            },

            "fnUpdate": function(oSettings, fnDraw) {

                var iListLength = 5;
                var oPaging = oSettings.oInstance.fnPagingInfo();
                var an = oSettings.aanFeatures.p;
                var i, j, sClass, iStart, iEnd, iHalf = Math.floor(iListLength / 2);

                if (oPaging.iTotalPages < iListLength) {
                    iStart = 1;
                    iEnd = oPaging.iTotalPages;
                } else if (oPaging.iPage <= iHalf) {
                    iStart = 1;
                    iEnd = iListLength;
                } else if (oPaging.iPage >= (oPaging.iTotalPages - iHalf)) {
                    iStart = oPaging.iTotalPages - iListLength + 1;
                    iEnd = oPaging.iTotalPages;
                } else {
                    iStart = oPaging.iPage - iHalf + 1;
                    iEnd = iStart + iListLength - 1;
                }

                if (oPaging.iTotalPages < 0) {
                    $('.pagination', an[i]).css('visibility', 'hidden');
                } else {
                    $('.pagination', an[i]).css('visibility', 'visible');
                }

                for (i = 0, iLen = an.length; i < iLen; i++) {
                    // Remove the middle elements
                    $('li:gt(1)', an[i]).filter(':not(.next)').remove();

                    // Add the new list items and their event handlers
                    for (j = iStart; j <= iEnd; j++) {
                        sClass = (j == oPaging.iPage + 1) ? 'class="active"' : '';
                        $('<li ' + sClass + '><a href="#">' + j + '</a></li>')
                            .insertBefore($('li.next:first', an[i])[0])
                            .bind('click', function(e) {
                                e.preventDefault();
                                oSettings._iDisplayStart = (parseInt($('a', this).text(), 10) - 1) * oPaging.iLength;
                                fnDraw(oSettings);
                            });
                    }

                    // Add / remove disabled classes from the static elements
                    if (oPaging.iPage === 0) {
                        $('li.prev', an[i]).addClass('disabled');
                    } else {
                        $('li.prev', an[i]).removeClass('disabled');
                    }

                    if (oPaging.iPage === oPaging.iTotalPages - 1 || oPaging.iTotalPages === 0) {
                        $('li.next', an[i]).addClass('disabled');
                    } else {
                        $('li.next', an[i]).removeClass('disabled');
                    }
                }
            }
        }
    });


    /*
     * TableTools Bootstrap compatibility
     * Required TableTools 2.1+
     */
    if ($.fn.DataTable.TableTools) {
        // Set the classes that TableTools uses to something suitable for Bootstrap
        $.extend(true, $.fn.DataTable.TableTools.classes, {
            "container": "btn-group",
            "buttons": {
                "normal": "btn default",
                "disabled": "btn disabled"
            },
            "collection": {
                "container": "DTTT_dropdown dropdown-menu",
                "buttons": {
                    "normal": "",
                    "disabled": "disabled"
                }
            }
        });

        // Have the collection use a bootstrap compatible dropdown
        $.extend(true, $.fn.DataTable.TableTools.DEFAULTS.oTags, {
            "collection": {
                "container": "ul",
                "button": "li",
                "liner": "a"
            }
        });
    }

    function DataTables(seletor, options) {

        var oTable, pagesize = parseInt($.cookie("params.pagesize")) || 30;
        var that = this;

        this.id = '_' + (Math.random() * 1E18).toString(36).slice(0, 5).toUpperCase();
        this.bLoadFinish = false;
        this.bShowSummary = false;
        this.aApiParams = {};
        this.options = {
            "sForm": '#form',
            "bAutoload": true,
            "bProcessing": true,
            "bInfo": true,
            "bFilter": false,
            "bPaginate": true,
            "bSort": true,
            "bAutoWidth": false,
            "bOrderNumbers": false,
            "fnRowCallback": function(row) {},
            "fnInitComplete": function() {},
            "bLengthChange": true,
            "bJQueryUI": false,
            "sPaginationType": "bootstrap_full_number",
            "bServerSide": true,
            "iDisplayLength": pagesize,
            "sDom": '<"top"><"table-scrollable"rt><"bottom"pli><"clear">',
            "aLengthMenu": [
                [30, 50, 100],
                [30, 50, 100]
            ],
            "fnServerParams": function(aoData) {},
            "fnServerData": function(sSource, aoData, fnCallback, oSettings) {


                var length = oSettings.oInit.iDisplayLength,
                    //aApiParams 用[] 不用{} 是有原因的，在某些情况下一个参数会传递多个值
                    aApiParams = [],
                    opt = {},
                    key;

                function getPageIndex(total) {
                    for (var i = 0; i < aoData.length; i++) {
                        if (aoData[i].name == "iDisplayLength") {
                            length = aoData[i].value;
                        }
                    }
                    var s = parseInt(total) + parseInt(length);
                    if (s % length) {
                        return parseInt(s / length) + 1;
                    }
                    return s / length;
                }

                for (var i = 0; i < aoData.length; i++) {

                    //页码
                    if (aoData[i].name === "iDisplayStart") {
                        aApiParams.push({
                            "name": "page",
                            "value": getPageIndex(aoData[i].value)
                        });
                    }

                    //排序字段
                    if (aoData[i].name === "iSortCol_0" && oSettings.aoColumns[aoData[i].value].mData) {

                        column = oSettings.aoColumns[aoData[i].value];
                        aApiParams.push({
                            "name": "orderColumn",
                            "value": column.mData
                        });

                        if (column.isPinyinSort) {
                            aApiParams.push({
                                "name": "isDict",
                                "value": true
                            });
                        }

                    }

                    //排序类型（升序/降序）
                    if (aoData[i].name === "sSortDir_0") {
                        aApiParams.push({
                            "name": "orderType",
                            "value": aoData[i].value
                        });
                    }


                }

                //每页显示行数
                aApiParams.push({
                    "name": "pagesize",
                    "value": length
                });

                if (that.bShowSummary) {
                    aApiParams.push({
                        "name": "summary",
                        "value": true
                    });
                }


                for (key in that.aApiParams) {
                    if (that.aApiParams[key] !== "") {
                        aApiParams.push({
                            name: key,
                            value: that.aApiParams[key]
                        });
                    }
                }


                $.cookie("params.pagesize", length, {
                    expires: 60,
                    path: '/'
                });

                //自定义的业务参数
                if (typeof oSettings.oInit.fnParams === "function") {
                    var params = oSettings.oInit.fnParams(aApiParams) || {};

                    for (key in params) {
                        if (typeof params[key] !== "function") {

                            //如果是一个数组的，就设置多个值
                            if (typeof params[key] === "object") {
                                for (var j = 0; j < params[key].length; j++) {
                                    aApiParams.push({
                                        "name": key,
                                        "value": params[key][j]
                                    });
                                }
                                continue;
                            }

                            aApiParams.push({
                                "name": key,
                                "value": params[key]
                            });
                        }
                    }
                }

                if (oSettings.oInit.bAutoload) {

                    if ("function" === typeof oSettings.oInit.fnOptions) {
                        opt = oSettings.oInit.fnOptions();
                    }

                    //兼容老的版本
                    var fnDataSource = oSettings.oInit.fnDataSource || oSettings.oInit.dataSource;

                    if ("function" === typeof fnDataSource) {

                        fnDataSource(aApiParams, function(a, b, c) {


                            var total = a.page ? a.page.total : 0;
                            var items = a.result.items || [];
                            var summary = a.result.summary || {};


                            //设置默认值，如果返回的值为空默认为"--"
                            for (var i = 0; i < items.length; i++) {
                                for (var o in items[i]) {
                                    if (!items[i][o] && items[i][o] !== 0) {
                                        items[i][o] = "--";
                                    }
                                }
                            }

                            var data = {
                                "aaData": items,
                                "iTotalDisplayRecords": total,
                                "iTotalRecords": total,
                                "sColumns": null
                            };

                            //初始化Table
                            fnCallback(data, b, c);

                            //生成序号
                            var bOrderNumbers = oSettings.oInit.bOrderNumbers || oSettings.oInit.isCreateOrder;
                            if (bOrderNumbers && items.length) {
                                createNumber(a.page.current, a.page.pagesize);
                            }

                            //汇总信息
                            for (var key in summary) {
                                var summary_value = summary[key];
                                for (i = 0; i < oSettings.aoColumns.length; i++) {
                                    if (oSettings.aoColumns[i].mData == key && typeof oSettings.aoColumns[i].fnSummaryFormat == "function") {
                                        summary_value = oSettings.aoColumns[i].fnSummaryFormat(summary_value);
                                    }
                                }

                                if (summary_value === null || summary_value === "") {
                                    summary_value = "--";
                                }

                                $("#" + that.id + "_" + key).html(summary_value);
                            }


                            //显示细分信息
                            if (oSettings.oInit.fnExtendDetails && items && items.length) {

                                var nCloneTh = document.createElement('th');
                                var nCloneTd = document.createElement('td');

                                $(nCloneTh).addClass("w60 nCloneTh nExtend");
                                $(nCloneTd).addClass("w60 nCloneTd nExtend");
                                nCloneTd.innerHTML = '<span class="row-details row-details-close"></span>';

                                $(seletor + ' thead tr').each(function() {
                                    if (!$(this).find(".nCloneTh").length) {
                                        this.insertBefore(nCloneTh, this.childNodes[0]);
                                    }
                                });

                                $(seletor + ' tbody tr').each(function() {
                                    this.insertBefore(nCloneTd.cloneNode(true), this.childNodes[0]);
                                });


                                $(seletor + '  tbody td .row-details').unbind("click");
                                $(seletor + '  tbody td .row-details').click(function() {


                                    var row_details = $(this);
                                    var nTr = $(this).parents('tr')[0];

                                    if (oTable.fnIsOpen(nTr)) {

                                        /* This row is already open - close it */
                                        row_details.addClass("row-details-close").removeClass("row-details-open");
                                        oTable.fnClose(nTr);
                                    } else {

                                        if (row_details.hasClass("disabled")) {
                                            return;
                                        }

                                        oTable.fnOpen(nTr, "<div class='p10 t-a-c'>加载中...</div>", 'details');
                                        /* Open this row */
                                        row_details.addClass("row-details-open disabled").removeClass("row-details-close");
                                        oSettings.oInit.fnExtendDetails(oTable, nTr, function(tb_details) {

                                            oTable.fnOpen(nTr, tb_details || "<div class='p10  dataTables_empty'><i class='icon icon-info icon-big'></i>&nbsp;&nbsp;&nbsp;查询结果为空</div>", 'details');
                                            var ndetails = row_details.parents("tr").next().find(".details");
                                            row_details.removeClass("disabled");
                                            ndetails.attr("colspan", parseInt(ndetails.attr("colspan")) + 1);
                                        });
                                    }

                                });
                            }


                            //判断请求状态
                            if (a.code === 0 && a.result) {
                                var status_text = "";

                                if (a.result.statusText === "timeout") {
                                    status_text = locale[pagurian.language || "zh_CN"].timeout;
                                } else {
                                    status_text = a.message;
                                }

                                $(seletor + " .dataTables_empty").html("<i class='icon icon-info red icon-big'></i>  " + status_text);
                            } else if (a.code == 500) {
                                $(seletor + " .dataTables_empty").html("<i class='icon icon-info red icon-big'></i> " + a.message);
                            }


                            //如果数据为空就不显示底部的分页条
                            if (a && a.page && a.page.total > 0) {
                                $(seletor + "_wrapper .bottom").show();
                            } else {
                                $(seletor + "_wrapper .bottom").hide();
                            }

                            //初始化回调
                            if (typeof oSettings.oInit.callback === "function") {
                                oSettings.oInit.callback(a);
                            }

                            that.bLoadFinish = true;

                        }, opt);
                    }

                } else {

                    fnCallback({
                        "aaData": [],
                        "iTotalDisplayRecords": 0,
                        "iTotalRecords": 0,
                        "sColumns": null,
                        "sEcho": "1"
                    });

                }
            },
            "oLanguage": locale[pagurian.language || "zh_CN"]
        };

        this.init = function() {

            var aoColumns;

            $.extend(true, this.options, options);

            //显示汇总信息
            aoColumns = this.options.aoColumns;
            for (var i = 0; i < aoColumns.length; i++) {

                var p = "<p class='table-summary' id='" + this.id + "_" + aoColumns[i].mData + "'>--</p>";

                if (aoColumns[i].mData && aoColumns[i].bShowSummary) {
                    if (aoColumns[i].sTitle) {
                        aoColumns[i].sTitle += p;
                    } else {
                        $(seletor + " thead th:eq(" + i + ")").append(p);
                    }

                    that.bShowSummary = true;
                }
            }


            $(seletor).addClass("table-custom table  table-hover  " + options.sClass);

            this.table = oTable = $(seletor).dataTable(this.options);

            if (that.bShowSummary) {
                $(seletor + '_wrapper').addClass("table-summary-wrapper");
            }

            $(seletor + '_wrapper .dataTables_filter input').addClass("form-control input-small");
            $(seletor + '_wrapper .dataTables_length select').addClass("form-control input-small");

            if (this.options.oSearch) {
                var searchId = this.options.oSearch.sInput;
                var searchWord = this.options.oSearch.sParamName;
                var search_keyword = "";

                $(searchId).keyup(function(e) {

                    var word = $.trim($(this).val()),
                        isChange = search_keyword === word ? 0 : 1,
                        isPush = false;
                    if ((e.which == 13 || that.bLoadFinish) && isChange) {

                        that.bLoadFinish = false;
                        that.aApiParams[searchWord] = word;
                        search_keyword = word;

                        if (!$(seletor).is(":hidden")) {

                            that.update();
                            if (typeof that.options.oSearch.fnCallback == "function") {
                                that.options.oSearch.fnCallback(word);
                            }
                        }

                        return;
                    }

                });


            }
        };

        this.update = function() {
            this.table.fnPageChange(0);
        };

        function createNumber(current, pagesize) {
            var index = (current - 1) * pagesize,
                k = 1;
            $(seletor).find("tbody tr").each(function() {
                $(this).find("td:eq(0)").text(index + k);
                k++;
            });
        }
    }

    g[PagurianAlias].plugin.dataTable = function(seletor, options) {
        var table = new DataTables(seletor, options);
        table.init();
        return table;
    };

});
