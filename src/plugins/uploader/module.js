define(function(require, exports, module) {


    var webUploader = require('./0.1.5/webuploader');
    require('./0.1.5/webuploader.css');

    var g = window;
    var languages = {
        zh_CN: require('./locale/zh_CN'),
        en_US: require('./locale/en_US')
    };
    var locale = languages[$p.language || "zh_CN"];


    function Uploader(selector, options) {

        this.options = {

            // 选完文件后，是否自动上传。
            auto: true,

            // swf文件路径
            swf: pagurian.path.app + 'plugins/uploader/0.1.5/Uploader.swf',

            // 文件接收服务端。
            //server: 'fileupload.php',

            // 选择文件的按钮。可选。
            // 内部根据当前运行是创建，可能是input元素，也可能是flash.
            pick: selector,

            // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
            resize: false
        };

        this.container = $(selector);
        this.queue = [];
        this.queueContainer = $('<div  class="uploader-list"></div>');
        this.initControler = function() {
            this.plugin = webUploader.create($.extend(this.options, options));
            this.container.after(this.queueContainer);
            this.initEvent();
            return this;
        };
        //初始化事件
        this.initEvent = function() {
            var root = this;

            //事件API
            $.each(["on", "off", "once", "trigger"], function(index, fn) {
                root[fn] = function(eventName, callback) {
                    if (fn === "on" && eventName === "removeFile") {
                        this.removeFile = callback;
                        return;
                    }
                    root.plugin[fn](eventName, callback);
                };
            });

            //当点击删除按钮后触发
            $(document).delegate(".cancel a", "click", function() {
                var fileId = $(this).data("id");
                var file;

                for (var i = 0; i < root.queue.length; i++) {
                    if (root.queue[i].id === fileId) {
                        file = root.queue[i];
                        break;
                    }
                }
                root.plugin.removeFile(fileId, true);

                $("#" + fileId).fadeOut();
            });

            //当文件被加入队列以后触发
            this.on('fileQueued', function(file) {

                root.queueContainer.append(
                    '<div id="' + file.id + '" class="item">' +
                    '<div class="info"> <label>' + file.name + '</label> ' +
                    '<span class="state"> - ' + locale.waiting + '</span> </div>' +
                    '<div class="cancel"><a href="javascript:;" data-id="' + file.id + '"><i class="icon icon-close"></i></a></div>' +
                    '</div>'
                );
            });

            //当文件被移除队列后触发
            this.on("fileDequeued", function(file) {
                root.queue.splice($.inArray(file, root.queue), 1);
            });

            //上传过程中触发，携带上传进度
            this.on('uploadProgress', function(file, percentage) {

                var $li = $('#' + file.id),
                    $percent = $li.find('.progress .progress-bar');
                // 避免重复创建
                if (!$percent.length) {
                    $percent = $(
                        '<div class="progress progress-striped active">' +
                        '<div class="progress-bar" role="progressbar" style="width: 0%">' +
                        '</div>' +
                        '</div>'
                    ).appendTo($li).find('.progress-bar');
                }
                $li.find('span.state').text(' - ' + locale.in_progress);
                $percent.css('width', percentage * 100 + '%');
            });

            //当文件上传成功时触发
            this.on('uploadSuccess', function(file) {
                $('#' + file.id).find('span.state').text(' - ' + locale.success);
                root.queue.push(file);
            });

            //当文件上传出错时触发
            this.on('uploadError', function(file) {
                $('#' + file.id).find('span.state').text(' - ' + locale.error);
            });

            //不管成功或者失败，文件上传完成时触发
            this.on('uploadComplete', function(file) {
                var interval = (file.getStatus() === "error") ? 3000 : 1000;
                setTimeout(function() {
                    $('#' + file.id).fadeOut();
                }, interval);
            });


            return this;

        };

        //获取上传成功所有的文件
        this.getUploadFiles = function() {
            return this.plugin.getFiles();
        };

        //获取页面上显示在队列中的文件（只包含上传完成的）
        this.getQueueFiles = function() {
            return this.queue;
        };

    }

    g[PagurianAlias].uploader = function(selector, options) {
        return new Uploader(selector, options).initControler();
    };

});
