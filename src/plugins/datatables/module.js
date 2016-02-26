define(function(require, exports, module) {

    var g = window;
    var languages = {
        zh_CN: require('./locale/zh_CN'),
        en_US: require('./locale/en_US')
    };
    var locale = languages[$p.language || "zh_CN"];

    require('./1.9.4/dataTables.css');
    require('./1.9.4/jquery.dataTables');

    require('./extend/options');
    require('./extend/functions');
    require('./extend/pagination');
    require('./extend/compatibility');

    function DataTables(selector, options) {



        var oTable, pagesize = parseInt($.cookie("params.pagesize")) || 30;
        var that = this;

        this.id = '_' + (Math.random() * 1E18).toString(36).slice(0, 5).toUpperCase();
        this.bLoadFinish = false;
        this.bShowSummary = false;
        this.aApiParams = {};
        this.version = "0.2.160106";
        this.options = {
            "sDefaultValue": "--",
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
                        if (aoData[i].name === "iDisplayLength") {
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
                if ($.isFunction(oSettings.oInit.fnParams)) {
                    var params = oSettings.oInit.fnParams(aApiParams) || {};


                    for (key in params) {
                        if (!$.isFunction(params[key])) {

                            //如果是一个数组的，就设置多个值
                            if ($.isArray(params[key])) {
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

                    if ($.isFunction(oSettings.oInit.fnOptions)) {
                        opt = oSettings.oInit.fnOptions();
                    }

                    //兼容老的版本
                    var fnDataSource = oSettings.oInit.fnDataSource || oSettings.oInit.dataSource;

                    if ($.isFunction(fnDataSource)) {

                        fnDataSource(aApiParams, function(a, b, c) {


                            var total = a.page ? a.page.total : 0;
                            var items = $.isArray(a.result) ? a.result : a.result.items || [];
                            var summary = a.result.summary || {};
                            var columns = oSettings.oInit.aoColumns;




                            //设置默认值，如果返回的值为空默认为"--"
                            for (var i = 0; i < items.length; i++) {
                                for (var o in items[i]) {
                                    if (!items[i][o] && items[i][o] !== 0) {
                                        items[i][o] = that.options.sDefaultValue;
                                    }
                                }


                                for (var j = 0; j < columns.length; j++) {
                                    if (!columns[j].mData) {
                                        continue;
                                    }
                                    //如果Table中的列在后端没有返回，则初始为"--"
                                    if (items[i][columns[j].mData] === undefined) {
                                        items[i][columns[j].mData] = that.options.sDefaultValue;
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
                                createOrderNumbers(a.page.current, a.page.pagesize);
                            }

                            //汇总信息
                            $(selector + " thead .table-summary").each(function() {

                                var key = $(this).data("field");
                                var summary_value = summary[key];
                                for (i = 0; i < oSettings.aoColumns.length; i++) {
                                    if (oSettings.aoColumns[i].mData === key && $.isFunction(oSettings.aoColumns[i].fnSummaryFormat)) {
                                        summary_value = oSettings.aoColumns[i].fnSummaryFormat(summary_value);
                                    }
                                }

                                if ($p.tool.isNull(summary_value) || summary_value === undefined) {
                                    summary_value = that.options.sDefaultValue;
                                }

                                $(this).html(summary_value);

                            });


                            //显示细分信息
                            if (oSettings.oInit.fnExtendDetails && items && items.length) {

                                var nCloneTh = document.createElement('th');
                                var nCloneTd = document.createElement('td');

                                $(nCloneTh).addClass("w60 nCloneTh nExtend");
                                $(nCloneTd).addClass("w60 nCloneTd nExtend");
                                nCloneTd.innerHTML = '<span class="row-details row-details-close"></span>';

                                $(selector + ' thead tr').each(function() {
                                    if (!$(this).find(".nCloneTh").length) {
                                        this.insertBefore(nCloneTh, this.childNodes[0]);
                                    }
                                });

                                $(selector + ' tbody tr').each(function() {
                                    this.insertBefore(nCloneTd.cloneNode(true), this.childNodes[0]);
                                });


                                $(selector + '  tbody td .row-details').unbind("click");
                                $(selector + '  tbody td .row-details').click(function() {


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

                                        oTable.fnOpen(nTr, "<div class='p10 t-a-c'>" + locale.sLoadingRecords + "</div>", 'details');
                                        /* Open this row */
                                        row_details.addClass("row-details-open disabled").removeClass("row-details-close");
                                        oSettings.oInit.fnExtendDetails(oTable, nTr, function(tb_details) {

                                            oTable.fnOpen(nTr, tb_details || "<div class='p10  dataTables_empty'>" + locale.sEmptyTable + "</div>", 'details');
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
                                    status_text = locale.timeout;
                                } else {
                                    status_text = a.message;
                                }

                                $(selector + " .dataTables_empty").html("<i class='icon icon-info red icon-big'></i>  " + status_text);
                            } else if (a.code === 500) {
                                $(selector + " .dataTables_empty").html("<i class='icon icon-info red icon-big'></i> " + a.message);
                            }

                            //如果数据为空就不显示底部的分页条
                            if (a && a.page && a.page.total > 0) {
                                $(selector + "_wrapper .bottom").show();
                            } else {
                                $(selector + "_wrapper .bottom").hide();
                            }

                            //初始化回调
                            if ($.isFunction(oSettings.oInit.callback)) {
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
            "oLanguage": locale
        };

        this.init = function() {

            var aoColumns;
            this.container = $(selector);
            $.extend(true, this.options, options);


            aoColumns = this.options.aoColumns;
            for (var i = 0; i < aoColumns.length; i++) {

                var summary = "<p class='table-summary' data-field='" + aoColumns[i].mData + "' id='" + this.id + "_" + aoColumns[i].mData + "'>" + that.options.sDefaultValue + "</p>";
                var subtitle = "<p class='table-subtitle' data-field='" + aoColumns[i].mData + "' id='" + this.id + "_subtitle_" + aoColumns[i].mData + "'>" + aoColumns[i].sSubtitle + "</p>";

                //表头副标题
                if (aoColumns[i].sSubtitle) {
                    if (aoColumns[i].sTitle) {
                        aoColumns[i].sTitle += subtitle;
                    } else {
                        $(selector + " thead th:eq(" + i + ")").append(subtitle);
                    }
                }

                //表头汇总指标
                if (aoColumns[i].mData && aoColumns[i].bShowSummary) {
                    if (aoColumns[i].sTitle) {
                        aoColumns[i].sTitle += summary;
                    } else {
                        $(selector + " thead th:eq(" + i + ")").append(summary);
                    }
                    that.bShowSummary = true;
                }

            }

            if (this.options.oSearch) {
                var searchId = this.options.oSearch.sInput;
                var searchWord = this.options.oSearch.sParamName;
                var searchInputPlaceholder = $(searchId).attr("placeholder");
                var searchInitVal = $.trim($(searchId).val());

                //如果搜索框中的值等于placeholder则关键词设为空
                if (searchInitVal === searchInputPlaceholder) {
                    searchInitVal = "";
                }

                that.aApiParams[searchWord] = searchInitVal;

                $(searchId).prop("disabled", false);
                $(searchId).keyup(function(e) {

                    var $input = $(this);
                    if ((e.which === 13 || that.bLoadFinish)) {
                        setTimeout(function() {

                            var word = $.trim($input.val());

                            //如果搜索框中的值等于placeholder则关键词设为空
                            if (word === searchInputPlaceholder) {
                                word = "";
                            }

                            that.aApiParams[searchWord] = word;
                            that.update();
                            if (typeof that.options.oSearch.fnCallback === "function") {
                                that.options.oSearch.fnCallback(word);
                            }

                        }, 500);
                        that.bLoadFinish = false;
                        return;
                    }
                });
            }

            $(selector).addClass("table-custom table  table-hover  " + options.sClass);

            this.table = oTable = $(selector).dataTable(this.options);

            if (that.bShowSummary) {
                $(selector + '_wrapper').addClass("table-summary-wrapper");
            }

            $(selector + '_wrapper .dataTables_filter input').addClass("form-control input-small");
            $(selector + '_wrapper .dataTables_length select').addClass("form-control input-small");

            return this;
        };

        //更新表格数据
        this.update = function() {
            this.table.fnPageChange(0);
            return this;
        };

        //清空表格数据
        this.clearTable = function() {
            $(selector + " .table-summary").html(that.options.sDefaultValue);
        };

        //销毁表格
        this.destroy = function() {
            this.table.fnDestroy();
            this.container.empty();
        };

        //创建表格序号
        function createOrderNumbers(current, pagesize) {
            var index = (current - 1) * pagesize,
                k = 1;
            $(selector).find("tbody tr").each(function() {
                $(this).find("td:eq(0)").text(index + k);
                k++;
            });
        }
    }

    g[PagurianAlias].dataTable = function(selector, options) {
        return new DataTables(selector, options).init();
    };

});
