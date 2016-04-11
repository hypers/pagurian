module('singgle sizer');
var sizer;
var selectDatas = [{
    "id": 4
}];

var getSizerData = function (params, call) {
    var data = {
        "code": "20000",
        "result": {
            "items": [
                {
                    "id": 1,
                    "name": "2.1.1"
                },
                {
                    "id": 2,
                    "name": "2.1.2"
                },
                {
                    "id": 3,
                    "name": "2.1.3"
                },
                {
                    "id": 4,
                    "name": "2.1.4"
                },
                {
                    "id": 5,
                    "name": "2.1.5.1"
                },
                {
                    "id": 6,
                    "name": "2.1.5.2"
                },
                {
                    "id": 7,
                    "name": "2.1.5-beta"
                },
                {
                    "id": 8,
                    "name": "2.1.5.201510192303"
                },
                {
                    "id": 9,
                    "name": "3.1.2-alpha"
                },
                {
                    "id": 10,
                    "name": "3.5.2-alpha"
                },
                {
                    "id": 11,
                    "name": "5.1.7"
                },
                {
                    "id": "&<>'\" \n+_*&^%$#",
                    "name": "鐗规畩瀛楃:&<>    '\""
                }
            ]
        }
    };
    return call(data);
};
var options = {
    isMultiple: false,//是否为多选 默认为false
    dataSource: getSizerData,//数据源
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

test('展开面板', function (assert) {
    pagurian.call(["lib/app", "widgets/sizer/module"], function (ok) {
        sizer = $p.sizer("#sizer-multiple", options);
        sizer.on('loadData', function () {
            //testSizer();
            var _oS = sizer;
            var $sizer = _oS.container;
            var $sizerBtn = $('#sizer-multiple');
            $sizerBtn.click();
            assert.ok($sizer.hasClass('sizer-open'), "OK");
        });
        sizer.update();
    });
    ok(true, 'this had better work.');
});

test('点击选项', function (assert) {
    pagurian.call(["lib/app", "widgets/sizer/module"], function (ok) {
        sizer = $p.sizer("#sizer-multiple", options);
        sizer.on('loadData', function () {
            testSizer();
        });
        sizer.update();
    });

    function testSizer() {
        var _oS = sizer;
        var $sizer = _oS.container;
        $sizer.addClass('sizer-open');
        $sizer.find('li.sizer-data-list-li:first-child label').click();
        assert.deepEqual(_oS.getSelectDatas(), [_oS.getAllDatas()[0]]);
    }

    ok(true, 'this had better work.');
});
