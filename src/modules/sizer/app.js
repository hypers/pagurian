/**
 * Created by yangguo on 2015/10/13 0013.
 */
define(function (require, exports, module) {
    var app = require('../../lib/app');
    var model = require('./model');

    require('../../widgets/sizer/module');

    app.page.multiple = function () {
        var selectDatas = [{
            "id": 4,
            "name": "2.1.4"
        }], options = {
            isMultiple: true,//是否为多选 默认为false
            isExpand: true,//是否默认展开 默认为false
            dataSource: model.getSizerData,//数据源
            style: "d-ib", //筛选器自定义class
            //processing: oLanguage.processing,//loading默认文字
            //search: oLanguage.search,//搜索框默认文字
            callbackExpand: function () {//面板展开时的回调
                console.log("Expand");
            },
            callbackClose: function (datas) {//面板关闭时的回掉
                console.log("Close");
                console.log(datas);
            },
            callbackOption: function (data) {//点击选项的回调
                console.log(data);
            },
            callbackSearch: function (datas) {//搜索框录入回调
                console.log(datas);
            },
            //仅isMultiple为true时有效
            callbackSelectAll: function () {//全选时的回调
                console.log("SelectAll");
            },
            callbackClean: function () {//点击清除/清楚选择的回调
                console.log("Clean");
            },
            callbackSubmit: function () {//确认按钮回调
                console.log("Submit");
            },
            callbackCancel: function () {//取消按钮回调
                console.log("Cancel");
            }
        };
        var sizer = $p.plugin.sizer("#sizer-multiple", options, selectDatas);
    };

    app.page.single = function () {
        var selectDatas = [{
            "id": 4,
            "name": "2.1.4"
        }], options = {
            isMultiple: false,//是否为多选 默认为false
            isExpand: true,//是否默认展开 默认为false
            dataSource: model.getSizerData,//数据源
            style: "d-ib", //筛选器自定义class
            //processing: oLanguage.processing,//loading默认文字
            //search: oLanguage.search,//搜索框默认文字
            callbackExpand: function () {//面板展开时的回调
                console.log("Expand");
            },
            callbackClose: function (datas) {//面板关闭时的回掉
                console.log("Close");
                console.log(datas);
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

        var sizer = $p.plugin.sizer("#sizer-multiple", options, selectDatas);
    };

    module.exports = app;
});
