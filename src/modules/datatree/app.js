define(function(require, exports, module) {
    window.CONFIG = {
        appId: "DataTree"
    };
    var app = require("../../lib/app");

    require("../../plugins/datatree/module");

    app.page.index = function() {
        $p.dataTree("#tree", {
            'core': {
                'data': [{
                    "text": "Root node",
                    "state": {
                        "opened": true
                    },
                    "children": [{
                            "text": "Child node 1",
                            "state": {
                                "selected": true
                            },
                            "icon": "fa fa-flash"
                        }, {
                            "text": "Child node 2",
                            "state": {
                                "disabled": true
                            }
                        },
                        "Child node 3"
                    ]
                }]
            }
        });
    };

    app.page.advanced = function() {
        $p.dataTree("#tree", {
            "plugins": ["checkbox", "search"],
            'core': {
                'data': [{
                    "text": "Root node",
                    "state": {
                        "opened": true
                    },
                    "children": [{
                            "text": "Child node 1",
                            "state": {
                                "selected": true
                            },
                            "icon": "fa fa-flash"
                        }, {
                            "text": "Child node 2",
                            "state": {
                                "disabled": true
                            }
                        },
                        "Child node 3"
                    ]
                }]
            }
        });
    };

    module.exports = app;
});
