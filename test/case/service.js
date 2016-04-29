module('Service');

var apiURL = "../test/api/succeed.json";

test('测试GET请求', function(assert) {
    pagurian.call(["lib/app", "lib/service"], function(app, service) {
        service.get(apiURL, {
            "page": 1,
            "pagesize": 100
        }, function() {});
        assert.ok(1 === 1, "OK");
    });

    ok(true, 'this had better work.');
});

test('测试POST请求', function(assert) {

    pagurian.call(["lib/app", "lib/service"], function(app, service) {
        service.post(apiURL, {
            "page": 1,
            "pagesize": 100
        }, function() {});

        service.post(apiURL, [
            {
                "name": "foo",
                "value": "bar"
            },
            {
                "name": "foo",
                "value": "bar2"
            }
        ], function() {});

        service.post(apiURL, [{
            "name": "foo",
            "value": "bar",
            "type": "array"
        }], function() {});

        service.post(apiURL, {
            "project.id": "1"
        }, function() {});

        service.post(apiURL, {
            "project.id": ["1", "2"]
        }, function() {});


        service.post({
            url: apiURL,
            params: {
                "projectId": ["1", "2"],
                "actions": ["join", "buy", "click"]
            },
            callback: function() {}
        });


        service.post({
            url: apiURL,
            original: true,
            params: [{
                "projectId": ["1", "2"],
                "actions": ["join", "buy", "click"]
            }, {
                "projectId": ["4", "8"],
                "actions": ["change"]
            }],
            callback: function() {}
        });

        service.post({
            url: apiURL,
            original: true,
            headers:{
                "user":"abc",
            },
            params: [{
                "projectId": ["1", "2"],
                "actions": ["join", "buy", "click"]
            }, {
                "projectId": ["4", "8"],
                "actions": ["change"]
            }],
            callback: function() {}
        });

        assert.ok(1 === 1, "OK");
    });

    ok(true, 'this had better work.');
});

test('测试PUT请求', function(assert) {
    pagurian.call(["lib/app", "lib/service"], function(app, service) {
        service.request("put", apiURL, {
            "page": 1,
            "pagesize": 100
        }, function() {});
        assert.ok(1 === 1, "OK");
    });

    ok(true, 'this had better work.');
});

test('测试PATCH请求', function(assert) {
    pagurian.call(["lib/app", "lib/service"], function(app, service) {
        service.request("patch", apiURL, {
            "page": 1,
            "pagesize": 100
        }, function() {});

        assert.ok(1 === 1, "OK");
    });

    ok(true, 'this had better work.');
});

test('测试PUT请求', function(assert) {
    pagurian.call(["lib/app", "lib/service"], function(app, service) {
        service.request("delete", apiURL, {
            "page": 1,
            "pagesize": 100
        }, function(resp) {});
        assert.ok(1 === 1, "OK");
    });

    ok(true, 'this had better work.');
});
