module.exports = function (grunt) {
    const fs = require('fs');
    const path = require('path');

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

    const transport = require('grunt-cmd-transport');
    const style = transport.style.init(grunt);
    const text = transport.text.init(grunt);
    const script = transport.script.init(grunt);
    const getCssFiles = require('./grunt/getCssFiles');
    const pallet = require('./grunt/pallet');
    const getMinCssFiles = require('./grunt/getMinCssFiles');
    const themes = grunt.file.readJSON('./grunt/themes.json');

    //connect端口
    const connectPort = 9000;

    const vendorPath = 'src/lib/vendor/';
    const resourcesPath = 'src/resources/';
    const lessFile = getCssFiles(resourcesPath);

    const option = {
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
                    src: ['**/**/*.png', '**/**/*.gif', '**/**/*.swf', '**/echarts/**/*'],
                    dest: 'dist/plugins',
                    filter: 'isFile'
                }]
            }
        },
        clean: {
            dist: ['dist'], //清除dist目录
            build: ['.build'] //清除build目录
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
                files: getMinCssFiles(resourcesPath, vendorPath)
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
                        '!**/sea*.js',
                        '!**/plugins/echarts/js/**/*.js'
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
                        '**/modules/**/app.js'
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
    const task_default = [];

    task_default.push("clean:dist");
    task_default.push("transport:all");
    task_default.push("copy:all");
    task_default.push("concat:modules");
    task_default.push("clean:build");
    task_default.push("template");
    task_default.push("css");


    grunt.initConfig(option);


    grunt.registerTask('default', task_default);
    grunt.registerTask('seajs', ['uglify:seajs']);
    grunt.registerTask('check', ['jshint', 'connect', 'qunit']);
    grunt.registerTask('tpl', ['template', "copy:all"]);
    grunt.registerTask('cp', ['copy:all']);
    //生成主题
    grunt.registerTask('theme', 'Generate theme', function () {
        Object.keys(themes).forEach((name)=> {
            const color = themes[name];
            const taskName = `theme-${name}`;
            const outputName = `src/resources/css/themes-${name}.css`;
            grunt.config.merge({
                less: {
                    [taskName]: {
                        options: {
                            customFunctions: {
                                'pallet': pallet
                            },
                            modifyVars: {
                                'base-color': color
                            }
                        },
                        files: {
                            [outputName]: 'src/resources/less/theme/base.less'
                        }
                    }
                }
            });
            grunt.task.run(`less:${taskName}`);
        });
    });
    grunt.registerTask('css', ['theme', 'cssmin:build', 'postcss', 'copy:all']);
};
