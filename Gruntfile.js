module.exports = function(grunt) {

    var transport = require('grunt-cmd-transport');

    var style = transport.style.init(grunt);
    var text = transport.text.init(grunt);
    var script = transport.script.init(grunt);


    require('time-grunt')(grunt);

    var option = {
        pkg: grunt.file.readJSON("package.json"),
        copy: {
            options: {
                paths: ['src']
            },
            all: {
                files: [{
                    expand: true,
                    cwd: 'src/resources',
                    src: ['**/*', '!css/source/**/*'],
                    dest: 'dist/resources',
                    flatten: false
                }, {
                    expand: true,
                    cwd: 'src/lib',
                    src: ['**/sea.js', '**/jquery*.js'],
                    dest: 'dist/lib'
                }, {
                    expand: true,
                    cwd: 'src/plugins',
                    src: ['**/*', '!**/*.js'],
                    dest: 'dist/plugins',
                    filter: 'isFile'
                }]
            }
        },
        clean: {
            dist: ['dist'], //清除dist目录
            build: ['.build'] //清除build目录
        },
        less: {
            /**
             * [build 编译所有的less文件，按照模板分类]
             */
            build: {
                files: {
                    "src/resources/css/themes-default.css": ["src/resources/css/source/themes/default.less"],
                    "src/resources/css/themes-green.css": ["src/resources/css/source/themes/green.less"],
                    "src/resources/css/themes-blue.css": ["src/resources/css/source/themes/blue.less"],
                    "src/resources/css/themes-purple.css": ["src/resources/css/source/themes/purple.less"],
                    "src/resources/css/themes-orange.css": ["src/resources/css/source/themes/orange.less"],
                    "src/resources/css/themes-red.css": ["src/resources/css/source/themes/red.less"],
                    "src/resources/css/page-login.css": ["src/resources/css/source/page/login.less"]
                }
            }
        },
        cssmin: {
            options: {
                keepSpecialComments: 0
            },
            /**
             * [build 压缩合并Css文件，分为公共css和模板css]
             * @type {Object}
             */
            build: {
                files: {
                    'src/resources/css/public.css': [
                        'src/plugins/bootstrap/css/bootstrap.css',
                        'src/plugins/daterangepicker/bs3.css',
                        'src/plugins/datepicker/datepicker.css',
                        'src/plugins/uniform/css/uniform.default.css',
                        'src/plugins/font-awesome/css/font-awesome.min.css',
                        'src/plugins/datatables/1.9.4/bs.css',
                        'src/resources/css/style-tpl.css',
                        'src/resources/css/style.css',
                        'src/resources/css/style-responsive.css',
                        'src/resources/css/plugins.css',
                    ],
                    'src/resources/css/themes-default.css': ['src/resources/css/themes-default.css'],
                    'src/resources/css/themes-green.css': ['src/resources/css/themes-green.css'],
                    'src/resources/css/themes-blue.css': ['src/resources/css/themes-blue.css'],
                    'src/resources/css/themes-purple.css': ['src/resources/css/themes-purple.css'],
                    'src/resources/css/themes-orange.css': ['src/resources/css/themes-orange.css'],
                    'src/resources/css/themes-red.css': ['src/resources/css/themes-red.css'],
                    'src/resources/css/page-login.css': ['src/resources/css/page-login.css']
                }
            }
        },
        jshint: {
            options: {
                eqeqeq: true,
                trailing: true
            },
            files: ['src/modules/**/*.js']
        },
        transport: {
            options: {
                paths: ['src'],
                alias: '<%= pkg.spm.alias %>',
                parsers: {
                    '.js': [script.jsParser],
                    '.css': [style.css2jsParser],
                    '.html': [text.html2jsParser]
                }
            },
            all: {
                options: {
                    idleading: ""
                },
                files: [{
                    expand: true,
                    cwd: 'src',
                    src: ['**/*', '!**/sea*.js'],
                    filter: 'isFile',
                    dest: '.build'
                }]
            }
        },
        concat: {
            options: {
                paths: ['.'],
                include: 'relative'
            },
            modules: {
                files: [{
                    expand: true,
                    cwd: '.build/',
                    src: ['**/modules/**/app.js'],
                    dest: 'dist/',
                    ext: '.js'
                }]
            }
        },
        uglify: {
            /**
             * [seajs 合并Seajs扩展文件，并混淆压缩]
             */
            seajs: {
                files: {
                    "src/lib/vendor/sea.js": ["src/lib/vendor/seajs/*.js"]
                }
            },
            /**
             * [all 混淆压缩所以的页面模块文件]
             */
            all: {
                files: [{
                    expand: true,
                    cwd: 'dist/',
                    src: ['modules/**/*.js'],
                    dest: 'dist/',
                    ext: '.js'
                }]
            }
        },
        /**
         * [template 编译html 模板引擎handlebars]
         */
        template: {
            dev: {
                engine: 'handlebars',
                cwd: 'src/templates/',
                partials: ['src/templates/fixtures/*.hbs'],
                data: 'src/templates/data.json',
                options: {},
                files: [{
                    expand: true,
                    cwd: 'src/templates/',
                    src: ['*.hbs'],
                    dest: 'dist/templates',
                    ext: '.html'
                }]
            }
        }

    }


    var task_default = [];

    task_default.push("clean:dist");
    task_default.push("transport:all");
    task_default.push("copy:all");
    task_default.push("concat:modules");
    task_default.push("uglify:all");
    task_default.push("clean:build");
    task_default.push("template");


    grunt.initConfig(option);

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-cmd-transport');
    grunt.loadNpmTasks('grunt-cmd-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-template-html');


    grunt.registerTask('check', ['jshint']);
    grunt.registerTask('css', ['less:build', 'cssmin:build','copy:all']);
    grunt.registerTask('seajs', ['uglify:seajs']);
    grunt.registerTask('tpl', ['template',"copy:all"]);
    grunt.registerTask('cp', ['copy:all']);
    grunt.registerTask('default', task_default);


};