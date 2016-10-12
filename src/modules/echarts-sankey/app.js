define(function (require, exports, module) {

    var app = require("../../lib/app");
    require("../../plugins/echarts/module");
    var chart = {};
    app.page.sankey = function () {

        chart = $p.echarts("my_chart", {
            type: "sankey",
            title: {
                text: '来源分析'
            }
        });

        chart.load({
            links: [
                {
                    "source": "首页",
                    "target": "签到领金币",
                    // "zlevel": 0,
                    "value": 83034
                },
                {
                    "source": "首页",
                    "target": "进入iBuick",
                    "value": 8098
                },
                {
                    "source": "首页",
                    "target": "油费随手记",
                    "value": 6868
                },
                {
                    "source": "首页",
                    "target": "违章查询",
                    "value": 4336
                },
                {
                    "source": "签到领金币",
                    "target": "幸运大抽奖",
                    "value": 61785,
                    "zlevel": 1
                },
                {
                    "source": "签到领金币",
                    "target": "进入个人中心",
                    "value": 1797
                },
                {
                    "source": "签到领金币",
                    "target": "其它",
                    "value": 899
                },
                {
                    "source": "签到领金币",
                    "target": "其它",
                    "zlevel": 0,
                    "value": 83034
                },
                {
                    "source": "进入iBuick",
                    "target": "其它",
                    "value": 8098
                },
                {
                    "source": "油费随手记",
                    "target": "其它",
                    "value": 6868
                },
                {
                    "source": "违章查询",
                    "target": "其它",
                    "value": 4336
                }
            ]
        }, function (options) {
            return options;
        });

    };


    module.exports = app;

});
