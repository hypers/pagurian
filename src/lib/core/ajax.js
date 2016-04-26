define(function(require, exports, module) {

    function send(options, callback) {
        return $.ajax($.extend({
            timeout: 30000,
            success: function(data, textStatus, jqueryXHR) {
                callback(data, textStatus, jqueryXHR);
            },
            error: function(jqueryXHR, textStatus, errorThrown) {
                var responeData = {
                    error: true
                };
                for (var value in jqueryXHR) {
                    if ($.isFunction(jqueryXHR[value])) continue;
                    responeData[value] = jqueryXHR[value];
                }
                callback({
                    code: jqueryXHR.status,
                    result: responeData
                });
            }
        }, options));
    }

    module.exports = {
        getJSON: function(options, callback) {
            options.dataType = "json";
            return send(options, function() {
                if (callback !== undefined) callback.apply(this, arguments);
            });
        }
    };

});
