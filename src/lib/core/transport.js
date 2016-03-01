define(function(require, exports, module) {

    /**
     * 把数组转成对象
     *
     * CASE 1:
     * [{name:"foo","value":"bar"}] ===> {"foo":"bar"}
     *
     * CASE 2:
     * [
     * 	{name:"foo","value":"bar"},
     * 	{name:"foo","value":"bar2"}
     * ]
     * ===> {"foo":["bar","bar2"]}
     *
     * CASE 3:
     * [{name:"foo","value":"bar",type:"array"}]
     * ===> {"foo":["bar"]}
     *
     */
    function handleArrayToObject(data) {

        var tempData = {};

        if ($.isPlainObject(data)) {
            return data;
        }

        if (!$.isArray(data)) {
            $p.log("Data is not an array");
            return null;
        }

        for (var i = 0; i < data.length; i++) {

            //如此临时对象重已经存在这个属性，就更新这个属性
            if (tempData[data[i].name]) {

                var _item = tempData[data[i].name];

                //如果值不是一个数组，则先转成一个数组，再push新值
                if (!$.isArray(_item)) {
                    tempData[data[i].name] = [_item];
                }
                tempData[data[i].name].push(data[i].value);
                continue;
            }

            //当不存在重复的name,需要已数组的方式传递，需要添加type="array"
            if (data[i].type === "array") {
                tempData[data[i].name] = [data[i].value];
                continue;
            }

            tempData[data[i].name] = data[i].value;
        }

        return tempData;
    }

    /**
     * 处理具有结构化的key, 拆分成对象
     *
     * case 1:
     * {"project.id":"1"} ===> {"project":{"id":"1"}}
     *
     * case 2:
     * {"project.id":["1","2"]} ===> {"project":[{"id":1},{"id":2}]}
     *
     */
    function handleObjectStructuredKey(tempData) {
        var finishData = {};
        for (var key in tempData) {

            //把"带有."的属性名转化为对象
            var keys = key.split(".");
            var value = tempData[key];
            if ($p.tool.isString(value)) {
                value = $.trim(value);
            }

            if (keys.length === 1) {
                finishData[key] = value;
                continue;
            }

            if ($.isArray(value)) {
                finishData[keys[0]] = finishData[keys[0]] || [];
                for (var i = 0, tempValue; i < value.length; i++) {
                    tempValue = {};
                    tempValue[keys[1]] = value[i];
                    finishData[keys[0]].push(tempValue);
                }
                continue;
            }

            finishData[keys[0]] = finishData[keys[0]] || {};
            finishData[keys[0]][keys[1]] = value;
        }

        return finishData;
    }


    module.exports = {

        toObject: function(data) {

            var tempData = handleArrayToObject(data);
            var finishData = handleObjectStructuredKey(tempData);

            return finishData;
        },
        toJSON: function(data) {
            return $.toJSON({
                data: data
            });
        }
    };

});
