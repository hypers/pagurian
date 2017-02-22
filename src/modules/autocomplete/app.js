/**
 * Created by yangguo on 2015/9/9 0009.
 */
define(function (require, exports, module) {
    var app = require("../../lib/app");
    var model = require('./model');

    require('../../widgets/autocomplete/module');

    var datas = [
        {
            name: 'HYPER Advertiser',
            value: 1
        }, {
            name: 'HYPER Web Analytics',
            value: 2
        }, {
            name: 'HYPER Mobile Analytics',
            value: 3
        }, {
            name: 'HYPER Video Analytics',
            value: 4
        }, {
            name: 'HYPER DMP',
            value: 5
        }, {
            name: 'HYPER Ad Serving',
            value: 6
        }, {
            name: 'HYPER Data Discovery',
            value: 7
        }
    ];

    app.page.single = function () {
        var input = $('#autoComplete');
        var autoComplete = $p.autoComplete(input, {
            datas: datas,
            autoShowPanel: true,
            chooseCallback: function (data) {
                input.val(data.data.name);
            }
        });
    };

    app.page.multiple = function () {
        var autoComplete = $p.autoComplete($('#autoComplete'), {
            //多选
            multiple: true,
            //光标获取焦点时展示全部数据
            autoShowPanel: true,
            //关闭面板时 清除input中的内容
            clearInput: true,
            datas: datas,
            chooseCallback: function (data) {
                var allData = autoComplete.getData();
                var chooseDta = autoComplete.getChooseData();
                var doms = allData.filter(function (data) {
                    return chooseDta.indexOf(data.value) >= 0;
                }).map(function (data) {
                    return '<span>' + data.name + '</span>';
                });
                doms = doms.length > 0 ? doms.join('') : '未选择任何产品';
                $('.sizer-result-content').empty().append(doms);
            }
        });
    };

    module.exports = app;
});
