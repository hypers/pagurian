/**
 * Created by YangGuo on 2016/10/11.
 */
define(function (require, exports, module) {
    var locale = {
        zh_CN: require('../locale/zh_CN'),
        en_US: require('../locale/en_US')
    };
    module.exports = function (options) {
        var option = {
            title: {
                x: "center",
                y: "20",
                textStyle: {
                    color: "#999",
                    fontWeight: '100',
                }
            },
            tooltip: {
                trigger: 'item',
                triggerOn: 'mousemove'
            },
            series: [
                {
                    type: 'sankey',
                    layout: 'none',
                    data: [],
                    links: [],
                    itemStyle: {
                        normal: {
                            borderWidth: 1,
                            borderColor: '#aaa'
                        }
                    },
                    lineStyle: {
                        normal: {
                            color: 'source',
                            curveness: 0.5
                        }
                    }
                }
            ]
        };

        return option;
    };
});
