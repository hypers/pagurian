 define(function(require, exports, module) {

     require('./jquery.dataTables.min');

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


     var dataTable = {
         init: function(opt) {
             var default_opt = {
                 "sForm": '#form', // search form selector
                 "bAutoload": true, // autoload data
                 "bProcessing": true,
                 "bInfo": true,
                 "bFilter": false,
                 "bPaginate": true,
                 "bSort": true,
                 "bAutoWidth": false,
                 "fnRowCallback": function(row) {},
                 "fnInitComplete": function() {},
                 "bLengthChange": true,
                 "bJQueryUI": false,
                 "sPaginationType": "bootstrap_full_number",
                 "bServerSide": true,
                 "iDisplayLength": 30,
                 "sDom": '<"top"><"table-scrollable"rt><"bottom"pli><"clear">',
                 "aLengthMenu": [
                     [30, 50, 100],
                     [30, 50, 100] // change per page values here
                 ],
                 "fnServerParams": function(aoData) {


                 },
                 "fnServerData": function(sSource, aoData, fnCallback, oSettings) {


                     var apData = [];
                     var length = options.iDisplayLength;



                     function getPageIndex(total) {
                         for (var i = 0; i < aoData.length; i++) {
                             if (aoData[i].name == "iDisplayLength") {
                                 length = aoData[i].value;
                             }
                         }
                         var s = total + length;
                         if (s % length) {
                             return parseInt(s / length) + 1;
                         }
                         return s / length;
                     }


                     for (var i = 0; i < aoData.length; i++) {

                         //页码
                         if (aoData[i].name === "iDisplayStart") {
                             apData.push({
                                 "name": "page",
                                 "value": getPageIndex(aoData[i].value)
                             });
                         }

                         //排序字段
                         if (aoData[i].name === "iSortCol_0" && oSettings.aoColumns[aoData[i].value].mData) {

                             apData.push({
                                 "name": "orderColumn",
                                 "value": oSettings.aoColumns[aoData[i].value].mData
                             });

                         }

                         //排序类型（升序/降序）
                         if (aoData[i].name === "sSortDir_0") {
                             apData.push({
                                 "name": "orderType",
                                 "value": aoData[i].value
                             });
                         }


                     }

                     //每页显示行数
                     apData.push({
                         "name": "pagesize",
                         "value": length
                     });

                     //自定义的业务参数
                     if (typeof options['fnParams'] === "function") {
                         var params = options['fnParams']() || {};

                         for (var i in params) {
                             if (typeof params[i] !== "function") {

                                 //如果是一个数组的，就设置多个值
                                 if (typeof params[i] === "object") {
                                     for (var j = 0; j < params[i].length; j++) {
                                         apData.push({
                                             "name": i,
                                             "value": params[i][j]
                                         });
                                     }
                                     continue;
                                 }

                                 apData.push({
                                     "name": i,
                                     "value": params[i]
                                 });
                             }
                         }
                     }

                     if (options['bAutoload']) {

                         if (opt.dataSource || "function" === typeof opt.dataSource) {

                             opt.dataSource(apData, function(a, b, c) {


                                 var total = a.page ? a.page.total : 0;

                                 //设置默认值，如果返回的值为空默认为"--"
                                 for (var i = 0; i < a.result.length; i++) {
                                     for (var o in a.result[i]) {
                                         if (!a.result[i][o]) {
                                             a.result[i][o] = "--";
                                         }
                                     }
                                 }

                                 var data = {
                                     "aaData": a.result || [],
                                     "iTotalDisplayRecords": total,
                                     "iTotalRecords": total,
                                     "sColumns": null
                                 }



                                 fnCallback(data, b, c);

                                 //生成序号
                                 if (opt.isCreateOrder && total) {
                                     initIndex(a.page.current, a.page.pagesize);
                                 }

                                 if (typeof opt.callback === "function") {
                                     opt.callback(a);
                                 }

                                 if (a.code === 0 && a.result) {
                                     var status_text = "";
                                     if (a.result.statusText === "timeout") {
                                         status_text = "请求超时";
                                     } else {
                                         status_text = a.result.statusText;
                                     }
                                     $(options.id + " .dataTables_empty").html("<i class='fa fa-info-circle fa-red fa-big'></i>  " + status_text);
                                 } else if (a.code == 500) {
                                     $(options.id + " .dataTables_empty").html("<i class='fa fa-info-circle fa-red fa-big'></i> " + a.result.statusText);
                                 }

                                 if (a && a.page && a.page.total > 0) {
                                     $(opt.id + "_wrapper .bottom").show();
                                 } else {
                                     $(opt.id + "_wrapper .bottom").hide();
                                 }
                             });

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
                 "oLanguage": {
                     "sProcessing": '<i class="fa fa-coffee"></i>&nbsp;加载中...',
                     "sLengthMenu": "每页 _MENU_ 条 ",
                     "oPaginate": {
                         "sPrevious": "上一页",
                         "sNext": "下一页",
                         "sFirst": "第一页",
                         "sLast": "最后一页"
                     },
                     "sInfo": "共 <span class='num'>_TOTAL_</span> 条数据",
                     "sInfoEmpty": "",
                     "sEmptyTable": "<i class='fa fa-info-circle fa-blue fa-big'></i>  查询结果为空",
                     "sLoadingRecords": "加载中..."

                 }
             };

             var options = $.extend(default_opt, opt);
             options['sAjaxSource'] = pagurian.path.api + "/api/" + options['sAjaxSource'];

             var oTable = $(options.id).dataTable(options);


             $(options.id + '_wrapper .dataTables_filter input').addClass("form-control input-small"); // modify table search input
             $(options.id + '_wrapper .dataTables_length select').addClass("form-control input-small"); // modify table per page dropdown, initialize select2 dropdown

             oTable.update = function() {
                 this.fnPageChange(0);
             }

             function initIndex(current, pagesize) {
                 var index = (current - 1) * pagesize,
                     k = 1;
                 oTable.find("tbody tr").each(function() {
                     $(this).find("td:eq(0)").text(index + k);
                     k++;
                 });
             }

             function initTotal(aoTotal, total) {
                 if (!aoTotal || !total) {
                     return;
                 }
                 var thead = oTable.find("thead tr"),
                     td, v, k;
                 for (var i = 0, len = aoTotal.length; i < len; i++) {

                     td = thead.find("th:eq(" + aoTotal[i][0] + ")");
                     v = total[aoTotal[i][1]] || "";
                     var k = td.html();
                     var l = k.indexOf("<");
                     if (l >= 0) {
                         k = k.substring(0, l);
                     }

                     td.html(k + "<div class='td-num'>" + v + "</div>");
                 }
             }

             return oTable;
         }

     }

     module.exports = dataTable;

 });