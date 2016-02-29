module('Transport');

pagurian.call(["lib/app", "lib/core/transport"], function(app, transport) {

    //case 1
    var data = transport.toObject([{
        "name": "foo",
        "value": "bar"
    }]);
    QUnit.test("transport.toObject", function(assert) {
        assert.deepEqual(data, {
            "foo": "bar"
        }, "OK");
    });


    //case 2
    var data2 = transport.toObject([
        {
            name: "foo",
            "value": "bar"
        },
        {
            name: "foo",
            "value": "bar2"
        }
    ]);
    QUnit.test("transport.toObject", function(assert) {
        assert.deepEqual(data2, {
            "foo": ["bar", "bar2"]
        }, "OK");
    });


    //case 3
    var data3 = transport.toObject([{
        "name": "foo",
        "value": "bar",
        "type": "array"
    }]);
    QUnit.test("transport.toObject", function(assert) {
        assert.deepEqual(data3, {
            "foo": ["bar"]
        }, "OK");
    });


    //case 4
    var data4 = transport.toObject({
        "project.id": "1"
    });
    QUnit.test("transport.toObject", function(assert) {
        assert.deepEqual(data4, {
            "project": {
                "id": "1"
            }
        }, "OK");
    });

    //case 5
    var data5 = transport.toObject({
        "project.id": ["1", "2"]
    });
    QUnit.test("transport.toObject", function(assert) {
        assert.ok(data5.project[0].id == 1, "OK");
        assert.ok(data5.project[1].id == 2, "OK");
    });

});
