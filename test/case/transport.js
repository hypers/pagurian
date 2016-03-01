module('Transport');

//case 1
test('transport.toObject', function (assert) {
    pagurian.call(["lib/app", "lib/core/transport"], function (app, transport) {
        var data = transport.toObject([{
            "name": "foo",
            "value": "bar"
        }]);
        assert.deepEqual(data, {
            "foo": "bar"
        }, "OK");
    });

    ok(true, 'this had better work.');
});

//case 2
test("transport.toObject", function (assert) {
    pagurian.call(["lib/app", "lib/core/transport"], function (app, transport) {
        var data2 = transport.toObject([
            {
                "name": "foo",
                "value": "bar"
            },
            {
                "name": "foo",
                "value": "bar2"
            }
        ]);
        assert.deepEqual(data2, {
            "foo": ["bar", "bar2"]
        }, "OK");
    });
    ok(true, 'this had better work.');
});


//case 3
test("transport.toObject", function (assert) {
    pagurian.call(["lib/app", "lib/core/transport"], function (app, transport) {
        var data3 = transport.toObject([{
            "name": "foo",
            "value": "bar",
            "type": "array"
        }]);
        assert.deepEqual(data3, {
            "foo": ["bar"]
        }, "OK");
    });
    ok(true, 'this had better work.');
});

//case 4
test("transport.toObject", function (assert) {
    pagurian.call(["lib/app", "lib/core/transport"], function (app, transport) {
        var data4 = transport.toObject({
            "project.id": "1"
        });
        assert.deepEqual(data4, {
            "project": {
                "id": "1"
            }
        }, "OK");
    });
    ok(true, 'this had better work.');
});

//case 5
test("transport.toObject", function (assert) {
    pagurian.call(["lib/app", "lib/core/transport"], function (app, transport) {
        var data5 = transport.toObject({
            "project.id": ["1", "2"]
        });
        assert.ok(data5.project[0].id === 1, "OK");
        assert.ok(data5.project[1].id === 2, "OK");
    });
    ok(true, 'this had better work.');
});

