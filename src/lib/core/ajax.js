define(function(require, exports, module) {

    var request = {
        data: [],
        type: "get",
        url: "/",
        contentType: "application/json",
        formatURL: function() {
            this.url = pagurian.path.api + this.url + (pagurian.path.apiPostfix || "");
            return this;
        },
        ajaxSend: function(options) {
            options.type = this.type;
            options.url = this.url;
            options.data = this.params;
            options.contentType = this.contentType;
            return $.ajax(options);
        }
    };

    module.exports = {
        bundle: true,
        send: function(callback) {
            return request.ajaxSend({
                dataType: "json",
                timeout: 30000,
                success: function(data, textStatus, jqueryXHR) {
                    callback(data, textStatus, jqueryXHR);
                },
                error: function(jqueryXHR, textStatus, errorThrown) {
                    var data = {
                        error: true
                    };
                    for (var value in jqueryXHR) {
                        if ($.isFunction(jqueryXHR[value])) {
                            continue;
                        }
                        data[value] = jqueryXHR[value];
                    }
                    callback({
                        code: jqueryXHR.status,
                        result: data
                    });
                }
            });
        },
        request: function(options, callback) {

            $.extend(request, options).formatURL();

            this.send(function() {
                if ($.isFunction(callback)) {
                    callback.apply(this, arguments);
                }
            });

            return this;
        }
    };

});
