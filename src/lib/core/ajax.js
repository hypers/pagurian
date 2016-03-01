define(function(require, exports, module) {

    var request = {
        type: "get",
        url: "/",
        formatURL: function() {
            var params = [];
            this.url = pagurian.path.api + this.url + (pagurian.path.apiPostfix || "");
            if (this.type === "delete") {
                if ($.isPlainObject(this.params)) {
                    for (var key in this.params) {
                        params.push(key + "=" + this.params[key]);
                    }
                }

                if ($.isArray(this.params)) {
                    for (var i = 0; i < this.params.length; i++) {
                        params.push(params[i].name + "=" + this.params[i].value);
                    }
                }
                this.url += "?" + params.join("&");
            }

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
