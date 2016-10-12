/**
 * Created by YangGuo on 2016/10/11.
 */
define(function (require, exports, module) {
    var locale = {
        zh_CN: require('../locale/zh_CN'),
        en_US: require('../locale/en_US')
    };

    /**
     *
     * @param {Object} options
     * @param {Array} options.data - 数据
     * @return {{title: {x: string, y: string, textStyle: {color: string, fontWeight: string}}, tooltip: {trigger: string, triggerOn: string}, series: *[]}}
     */
    module.exports = function (options) {
        var links = options.data || [];
        var nodes = {};

        links.forEach(function (data) {
            addKeyToNode(data.source);
            addKeyToNode(data.target);
        });

        nodes = Object.keys(nodes).map(function (key) {
            return {name: key};
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
                    layout: 'none',
                    layoutIterations: 0,
                    data: nodes,
                    links: links,
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
                            curveness: 0.5
                        }
                    }
                }
            ]
        };

        /**
         * 添加key到node
         * @param {String} key
         */
        function addKeyToNode(key) {
            if (nodes[key]) {
                return;
            }
            nodes[key] = true;
        }

        return option;
    };
});
