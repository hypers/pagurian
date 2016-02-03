define(function(require, exports, module) {


    require('./3.2.1/jquery.uploadify');
    require('./3.2.1/uploadify.css');

    var g = window;
    var languages = {
        zh_CN: require('./locale/zh_CN'),
        en_US: require('./locale/en_US')
    };
    var locale = languages[$p.language || "zh_CN"];

    function Uploadify(selector, options) {


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
            },
            /**
             * 新增的一个onRemove事件
             * 和onCancel不同点在于:onCancel上次文件的过程中(未完成上次)的时候触发，
             * onRemove不管是上次过程中还是已经上次完成，只有点击了删除按钮都会触发。
             */
            onRemove: function(file) {
                $p.log(file + " has been removed");
            }
        };

        /**
         * 判断当前上传的文件是否都上传完成
         * @return true/false
         */
        this.uploadCompleted = function() {

            var $queue = $("#" + $(selector).attr("id") + "-queue");
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
            var $queue = $("#" + $(selector).attr("id") + "-queue");

            $(".completed").each(function() {
                files.push($(this).data("itemData"));
            });

            return files;
        };


        this.container = $(selector).uploadify($.extend(this.options, options));
    }

    g[PagurianAlias].upload = function(selector, options) {
        return new Uploadify(selector, options);
    };

});
