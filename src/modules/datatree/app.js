define(function(require, exports, module) {

    var app = require("../../lib/app");

    require('../../plugins/number-spinner/module');
    require("../../plugins/datatree/module");

    app.page.index = function() {
        $p.dataTree("#tree", {
            core: {
                data: [{
                    text: "Root node",
                    state: {
                        opened: true
                    },
                    children: [{
                            id: 1,
                            text: "Child node 1",
                            state: {
                                selected: true
                            },
                            icon: "fa fa-flash"
                        }, {
                            text: "Child node 2",
                            state: {
                                disabled: true
                            }
                        },
                        "Child node 3"
                    ]
                }]
            }
        });
    };

    app.page.advanced = function() {

        var treeData = [{
            text: "Root node",
            state: {
                opened: true
            },
            children: [{
                    text: "Child node 1",
                    id: "111",
                    state: {
                        selected: true
                    },
                    icon: "fa fa-flash"
                }, {
                    text: "Child node 2",
                    state: {
                        disabled: true
                    }
                },
                "Child node 3"
            ]
        }];

        $p.dataTree("#tree", {
            plugins: ["checkbox", "search", "added"],
            core: {
                data: treeData
            },
            search: {
                input: "#input_search"
            },
            added: {
                numberSpinner: {
                    decimals: 2,
                    min: -10,
                    max: 100,
                    step: 0.1,
                    change: function(data, entity) {
                        console.log(data);
                    }
                }
            },
            change: function(e, node) {
                console.log(node);
            }
        });


    };

    module.exports = app;
});
