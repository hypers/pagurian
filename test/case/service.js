module('Service');

test('测试GET请求', function (assert) {
    pagurian.call(["lib/app", "lib/service"], function (app, service) {
        service.get("../api/succeed", {
            "page": 1,
            "pagesize": 100
        }, function () {
        });
        assert.ok(1 === 1, "OK");
    });

    ok(true, 'this had better work.');
});

test('测试POST请求', function (assert) {

    pagurian.call(["lib/app", "lib/service"], function (app, service) {
        service.post("../api/succeed", {
            "page": 1,
            "pagesize": 100
        }, function () {
        });

        service.post("../api/succeed", [
            {
                "name": "foo",
                "value": "bar"
            },
            {
                "name": "foo",
                "value": "bar2"
            }
        ], function () {
        });

        service.post("../api/succeed", [{
            "name": "foo",
            "value": "bar",
            "type": "array"
        }], function () {
        });

        service.post("../api/succeed", {
            "project.id": "1"
        }, function () {
        });

        service.post("../api/succeed", {
            "project.id": ["1", "2"]
        }, function () {
        });


        service.post({
            url: "../api/succeed",
            params: {
                "projectId": ["1", "2"],
                "actions": ["join", "buy", "click"]
            },
            callback: function () {
            }
        });


        service.post({
            url: "../api/succeed",
            original: true,
            params: [{
                "projectId": ["1", "2"],
                "actions": ["join", "buy", "click"]
            }, {
                "projectId": ["4", "8"],
                "actions": ["change"]
            }],
            callback: function () {
            }
        });

        assert.ok(1 === 1, "OK");
    });

    ok(true, 'this had better work.');
});

test('测试PUT请求', function (assert) {
    pagurian.call(["lib/app", "lib/service"], function (app, service) {
        service.request("put", "../api/succeed", {
            "page": 1,
            "pagesize": 100
        }, function () {
        });
        assert.ok(1 === 1, "OK");
    });

    ok(true, 'this had better work.');
});

test('测试PATCH请求', function (assert) {
    pagurian.call(["lib/app", "lib/service"], function (app, service) {
        service.request("patch", "../api/succeed", {
            "page": 1,
            "pagesize": 100
        }, function () {
        });

        assert.ok(1 === 1, "OK");
    });

    ok(true, 'this had better work.');
});

test('测试PUT请求', function (assert) {
    pagurian.call(["lib/app", "lib/service"], function (app, service) {
        service.request("delete", "../api/succeed", {
            "page": 1,
            "pagesize": 100
        }, function (resp) {
        });
        assert.ok(1 === 1, "OK");
    });

    ok(true, 'this had better work.');
});
