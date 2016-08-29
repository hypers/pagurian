module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-cmd-transport');
    grunt.loadNpmTasks('grunt-cmd-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-template-html');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-qunit');

    require('time-grunt')(grunt);

    var transport = require('grunt-cmd-transport');
    var style = transport.style.init(grunt);
    var text = transport.text.init(grunt);
    var script = transport.script.init(grunt);
    var getCssFiles = require('./grunt/getCssFiles');
    var pallet = require('./grunt/pallet');

    //connect端口
    var connectPort = 9000;

    var vendorPath = 'src/lib/vendor/';
    var cssPath = 'src/resources/';
    var lessFile = getCssFiles(cssPath);

    function getMinCssFiles() {
        var cssObject = {};

        cssObject[cssPath + 'css/public.css'] = [
            vendorPath + 'bootstrap/css/bootstrap.css',
            vendorPath + 'uniform/css/uniform.default.css',
            vendorPath + 'font-awesome/css/font-awesome.min.css'
        ];

        Object.keys(lessFile).forEach(function (file) {
            cssObject[file] = [file];
        });
        return cssObject;
    }

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
                    src: ['**/*', '!less/**/*'],
                    dest: 'dist/resources',
                    flatten: false
                }, {
                    expand: true,
                    cwd: 'src/lib',
                    src: ['**/sea.js', '**/jquery*.js', '**/es5*.*'],
                    dest: 'dist/lib'
                }, {
                    expand: true,
                    cwd: 'src/plugins',
                    src: ['**/**/*.png', '**/**/*.gif', '**/**/*.swf'],
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
                options: {
                    customFunctions: {
                        'pallet': pallet
                    }
                },
                files: lessFile
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
                files: getMinCssFiles()
            }
        },
        postcss: {
            options: {
                map: false,
                processors: [
                    require('autoprefixer')({
                        browsers: 'last 2 versions',
                        remove: false
                    })
                ]
            },
            dist: {
                src: 'src/resources/css/*.css'
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: 'checkstyle',
                reporterOutput: '.build/report.xml',
                force: true
            },
            allFiles: {
                files: [
                    {src: 'src/modules/**/*.js'},
                    {src: 'src/widgets/**/*.js'},
                    {src: 'src/plugins/**/module.js'},
                    {src: 'src/lib/**/*.js'},
                    {src: '!src/lib/vendor/**/*.js'}
                ]
            }
        },
        transport: {
            options: {
                debug: false,
                paths: ['src'],
                alias: '<%= pkg.spm.alias %>',
                parsers: {
                    '.js': [script.jsParser],
                    '.css': [style.css2jsParser],
                    '.tpl': [text.html2jsParser],
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
                    src: [
                        '**/*',
                        '!resources/**',
                        '!templates/**',
                        '!**/sea*.js'
                    ],
                    filter: 'isFile',
                    dest: '.build'
                }]
            }
        },
        concat: {
            options: {
                paths: ['.'],
                include: 'relative',
                uglify: true
            },
            modules: {
                files: [{
                    expand: true,
                    cwd: '.build/',
                    src: [
                        '**/modules/**/app.js',
                        '**/echarts/loader.js',
                        '**/echarts/loader-map.js'
                    ],
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
            }
        },
        /**
         * [handlebars template]
         */
        template: {
            dev: {
                engine: 'handlebars',
                cwd: 'src/templates/',
                partials: [
                    'src/templates/fixtures/*',
                    'src/templates/codes/*',
                    'src/templates/layouts/*'
                ],
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
        },
        // Create a local web server for testing http:// URIs.
        connect: {
            root_server: {
                options: {
                    port: connectPort,
                    base: '.',
                }
            }
        },
        // Unit tests.
        qunit: {
            allTest: {
                options: {
                    urls: [
                        'http://localhost:' + connectPort + '/test/index.html'
                    ]
                }
            }
        }
    };


    //生产发布的Task
    var task_default = [];

    task_default.push("clean:dist");
    task_default.push("transport:all");
    task_default.push("copy:all");
    task_default.push("concat:modules");
    task_default.push("clean:build");
    task_default.push("template");


    grunt.initConfig(option);


    grunt.registerTask('seajs', ['uglify:seajs']);
    grunt.registerTask('check', ['jshint', 'connect', 'qunit']);
    grunt.registerTask('css', ['less:build', 'cssmin:build', 'postcss', 'copy:all']);
    grunt.registerTask('tpl', ['template', "copy:all"]);
    grunt.registerTask('cp', ['copy:all']);

    grunt.registerTask('default', task_default);

};
