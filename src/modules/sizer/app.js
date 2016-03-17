/**
 * Created by yangguo on 2015/10/13 0013.
 */
define(function (require, exports, module) {
    var app = require("../../lib/app");
    var model = require('./model');

    require('../../widgets/sizer/module');

    /**
     * 单选按钮
     */
    app.page.single = function () {
        var selectDatas = [{
            "id": 4
            //"name": "2.1.4" //此数据用于设置默认的选中文字，如需提示文字，则不需要此设置 仅在
        }];
        var options = {
            isMultiple: false,//是否为多选 默认为false
            isExpand: true,//是否默认展开 默认为false
            dataSource: model.getSizerData,//数据源
            style: "d-ib", //筛选器自定义class
            //processing: oLanguage.processing,//loading默认文字
            //search: oLanguage.search,//搜索框默认文字
            callbackExpand: function () {//面板展开时的回调
                console.log("Expand");
            },
            callbackClose: function (datas, allDatas) {//面板关闭时的回掉
                console.log("Close");
                console.log(datas);
                console.log(allDatas);
            },
            callbackOption: function (data) {//点击选项的回调
                console.log("Click Option");
                console.log(data);
            },
            callbackSearch: function (data) {//搜索框录入回调
                console.log("Search");
                console.log(data);
            },
            callbackClean: function () {//点击清除/清楚选择的回调
                console.log("Clean");
            }
        };

        var sizer = $p.sizer("#sizer-multiple", options, selectDatas);
    };

    /**
     * 多选按钮
     */
    app.page.multiple = function () {
        var selectDatas = [{
            "id": 4
        }, {
            "id": 5
        }];

        var options = {
            isMultiple: true,//是否为多选 默认为false
            isExpand: true,//是否默认展开 默认为false
            dataSource: model.getSizerData,//数据源
            dataParams: {
                timeStamp: +new Date()
            },
            style: "d-ib", //筛选器自定义class
            callbackClose: function (datas, allDatas) {//面板关闭时的回掉
                console.log("Close");
                console.log(datas);
                console.log(allDatas);
            },
            callbackSearch: function (datas) {//搜索框录入回调
                console.log(datas);
            },
            callbackClean: function () {//点击清除/清楚选择的回调
                console.log("Clean");
            },
            //仅isMultiple为true时有效
            callbackSelectAll: function (datas) {//全选时的回调
                console.log("SelectAll");
            },
            callbackSubmit: function (selectDatas, allDatas) {//确认按钮回调
                console.log("Submit");
                console.log(selectDatas);
                console.log(allDatas);
            },
            callbackCancel: function () {//取消按钮回调
                console.log("Cancel");
            },
            callbackLoadData: function (selectData, allData) {//数据加载完成回调
                console.log('数据加载完成');
                console.log(selectData);
                console.log(allData);
            }
        };
        var sizer = $p.sizer($("#sizer-multiple"), options);
        //使用on绑定事件
        sizer.on("option", function (data, status) {
            console.log(data, status);
        });

        sizer.chooseData(selectDatas);
    };

    /**
     * 多选按钮含有展示面板
     */
    app.page.multipleHasPanel = function () {
        var options = {
            isMultiple: true,
            dataSource: model.getSizerData,//数据源
            style: "d-ib" //筛选器自定义class
        };

        var sizer = $p.sizer($("#sizer-multiple"), options)
            .on('submit', function (selectDatas, allDatas) {
                appendSpan("#sizerPanel", selectDatas);
            });

        /**
         * 选择器
         * @param selector
         * @param selectDatas
         */
        function appendSpan(selector, selectDatas) {
            var spans = [];
            for (var i = 0; i < selectDatas.length; i++) {
                spans.push('<span>' + selectDatas[i].name + '</span>');
            }
            $(selector).find('.sizer-result-content').empty().append(spans.join('') || "选择为空");
        }
    };

    module.exports = app;
});
