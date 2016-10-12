/**
 * Created by YangGuo on 2016/10/11.
 */
define(function (require, exports, module) {
    var locale = {
        zh_CN: require('../locale/zh_CN'),
        en_US: require('../locale/en_US')
    };

    /**
     * 桑基图
     * @param {Object} options
     * @param {Array} options.links - {@link http://echarts.baidu.com/option.html#series-sankey.links|关系数据}
     * @return {Object} option
     */
    module.exports = function (options) {
        var links = options.links || [];
        var nodes = {};

        links.forEach(function (data) {
            addKeyToNode({
                type: 'source',
                key: data.source,
                value: data.value
            });
            addKeyToNode({
                type: 'target',
                key: data.target,
                value: data.value
            });
        });

        nodes = Object.keys(nodes).map(function (key) {
            var source = nodes[key].source || 0;
            var target = nodes[key].target || 0;
            return {
                name: key,
                value: source > target ? source : target
            };
        });

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
                    //layout: 'none',
                    layoutIterations: 99,
                    top: 50,
                    nodeWidth: 100,
                    nodeGap: 30,
                    data: nodes,
                    links: links,
                    label: {
                        emphasis: {
                            textStyle: {
                                color: '#575757'
                            }
                        }
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: function (params) {
                            return [options.name, params.name + '：' + (isNaN(params.value) ? '-' : params.value)].join('<br/>');
                        }
                    },
                    itemStyle: {
                        normal: {
                            borderWidth: 1,
                            borderColor: '#aaa',
                            label: {
                                show: true,
                                textStyle: {
                                    fontSize: pagurian.language === "en_US" ? "10" : "12"
                                }
                            }
                        },
                        emphasis: {
                            label: {
                                show: true,
                                textStyle: {
                                    color: "#eee"
                                }
                            },
                            areaStyle: {
                                color: '#d7504b'
                            },
                            areaColor: '#d7504b'
                        }
                    },
                    lineStyle: {
                        normal: {
                            color: 'source',
                            curveness: 0.6
                        }
                    }
                }
            ]
        };

        /**
         * 添加key到node
         * @param {object} obj
         * @param {string} obj.type - 类型
         * @param {string} obj.key - key
         * @param {number} obj.value - value
         */
        function addKeyToNode(obj) {
            var key = obj.key
            var type = obj.type
            var value = obj.value

            if (nodes[key]) {
                if (nodes[key][type] === undefined) {
                    nodes[key][type] = value;
                    return;
                }
                nodes[key][type] += value;
                return;
            }
            nodes[key] = {};
            nodes[key][type] = value;
        }

        return option;
    };
});
