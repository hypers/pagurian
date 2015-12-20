define(function(require, exports, module) {

    var g = window;

    require('./3.2.1/jquery.uploadify');
    require('./3.2.1/uploadify.css');

    function Uploadify(seletor, options) {
        this.language = {
            zh_CN: {
                buttonText: "选择文件"
            },
            en_US: {
                buttonText: "Select files"
            }
        };

        this.options = {
            height: 36,
            auto: true,
            buttonClass: 'btn btn-default',
            helpBlock: true,
            buttonText: this.language[$p.language || "zh_CN"].buttonText,
            swf: pagurian.path.app + 'plugins/uploadify/3.2.1/uploadify.swf',
            onUploadError: function(file, errorCode, errorMsg, errorString) {
                $p.log('The file ' + file.name + ' could not be uploaded: ' + errorString + "," + errorCode + "," + errorMsg);
            },
            onUploadSuccess: function(file, data, response) {
                $p.log([file, data, response]);
            },
            onError: function(errorType) {
                $p.log(errorType);
            }
        };

        

        /**
         * 判断当前上传的文件是否都上传完成
         * @return true/false
         */
        this.uploadCompleted = function() {
            var $queue = $("#" + $(seletor).attr("id") + "-queue");
            var completed = $queue.find(".uploadify-queue-item").length ? true : false;
            return completed;
        };

        $(seletor).uploadify($.extend(this.options, options));
    }

    g[PagurianAlias].upload = function(seletor, options) {
        return new Uploadify(seletor, options);
    };

});
