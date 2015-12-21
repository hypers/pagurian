define(function(require, exports, module) {


    require('./3.2.1/jquery.uploadify');
    require('./3.2.1/uploadify.css');

    var g = window;
    var languages = {
        zh_CN: require('./locale/zh_CN'),
        en_US: require('./locale/en_US')
    };
    var locale = languages[$p.language || "zh_CN"];

    function Uploadify(seletor, options) {


        this.options = {
            height: 36,
            auto: true,
            buttonClass: 'btn btn-default',
            helpBlock: true,
            removeCompleted: false,
            buttonText: locale.buttonText,
            swf: pagurian.path.app + 'plugins/uploadify/3.2.1/uploadify.swf',
            onUploadError: function(file, errorCode, errorMsg, errorString) {
                $p.log('The file ' + file.name + ' could not be uploaded: ' + errorString + "," + errorCode + "," + errorMsg);
            },
            onUploadSuccess: function(file, data, response) {
                $p.log([file, data, response]);
            },
            onSet: function(itemData) {
                $("#" + itemData.fileID).data("itemData", itemData);
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
            var $items = $queue.find(".uploadify-queue-item");
            var $completed = $queue.find(".completed");
            return $items.length === $completed.length;
        };

        /**
         * 获取上传列表中的文件
         * @return {Array} [{fileName,fileSize}]
         */
        this.getUploadFiles = function() {
            var files = [];
            var $queue = $("#" + $(seletor).attr("id") + "-queue");

            $(".completed").each(function() {
                files.push($(this).data("itemData"));
            });

            return files;
        };


        this.container = $(seletor).uploadify($.extend(this.options, options));
    }

    g[PagurianAlias].upload = function(seletor, options) {
        return new Uploadify(seletor, options);
    };

});
