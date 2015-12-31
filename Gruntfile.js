module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        cfg: {
            srcRoot: 'src',
            distRoot: 'dist',
            moduleRoot: 'node_modules',
            banner: [
                "/*!",
                "* <%= pkg.name %> <%= pkg.version %>",
                "* Date: " + grunt.template.today("UTC:ddd mmm d yyyy HH:MM:ss Z"),
                "* https://github.com/gogo1217",
                "*",
                "* Copyright 2015, " + grunt.template.today("yyyy") + " gogo1217 ",
                "*",
                "*/",
                ""
            ].join(grunt.util.linefeed)
        },
        clean: ['<%= cfg.distRoot %>', 'node_modules'],

        jshint: {
            options: {
                //这里是覆盖JSHint默认配置的选项`
                globals: {
                    jQuery: true,
                    console: true,
                    module: true,
                    document: true
                }
            },
            files: ['<%= cfg.srcRoot %>/js/**/*.js']
        },
        uglify: {
            dist: {
                options: {
                    compress: {
                        drop_console: true //删除console
                    },
                    preserveComments: 'some' // 不删除 banner 注释
                },
                files: [{
                    expand: true, // Enable dynamic expansion.
                    cwd: '<%= cfg.distRoot %>/js/', // Src matches are relative to this path.
                    src: ['**/*.js', '!**/*.min.js'], // Actual pattern(s) to match.
                    dest: '<%= cfg.distRoot %>/js/', // Destination path prefix.
                    ext: '.js', // Dest filepaths will have this extension.
                    extDot: 'last' // Extensions in filenames begin after the first dot
                }]
            }
        },

        less: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= cfg.srcRoot %>/css',
                    src: ['**/*.less'],
                    dest: '<%= cfg.distRoot %>/css',
                    ext: '.css'
                }]
            }
        },
        cssmin: {
            dist: {
                options: {
                    shorthandCompacting: false,
                    compatibility: 'ie8', //设置兼容模式
                    noAdvanced: true //取消高级特性
                },
                files: [{
                    expand: true,
                    cwd: '<%= cfg.distRoot %>/',
                    src: ['**/*.css', '!**/*.min.css'],
                    dest: '<%= cfg.distRoot %>/',
                    ext: '.min.css'
                }]
            }
        },

        copy: {
            main: {
                files: [{
                    expand: true,
                    cwd: '<%= cfg.srcRoot %>/',
                    src: ["**", '!**/*.less'],
                    dest: '<%= cfg.distRoot %>/',
                    filter: 'isFile'
                }, {
                    expand: true,
                    cwd: '<%= cfg.moduleRoot %>/jquery/dist',
                    src: ['jquery.min.js'],
                    dest: '<%= cfg.distRoot %>/lib/jquery/',
                    filter: 'isFile'
                }]
            }
        },

        usebanner: {
            taskName: {
                options: {
                    position: 'top',
                    banner: '<%= cfg.banner %>',
                    linebreak: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= cfg.distRoot %>',
                    src: ['css/*.css', 'js/*.js']
                }]
            }
        },
        watch: {
            options: {
                livereload: true
            },
            js: {
                files: ['<%= cfg.srcRoot %>/**/*.js'],
                tasks: ['copy']
            },
            less: {
                files: '<%= cfg.srcRoot %>/**/*.less',
                tasks: ['less']
            },
            html: {
                files: '<%= cfg.srcRoot %>/**/*.html',
                tasks: ['copy']
            }
        },
        connect: {
            options: {
                port: 9000,
                hostname: '0.0.0.0',
                open: true,
                middleware: function (connect, options, middlewares) {
                    var serveStatic = require('serve-static');
                    var serveIndex = require('serve-index');
                    var lrSnippet = require('connect-livereload')();
                    return [
                        lrSnippet,
                        // 静态文件服务器的路径 原先写法：connect.static(options.base[0])
                        serveStatic(options.base[0]),
                        // 启用目录浏览(相当于IIS中的目录浏览) 原先写法：connect.directory(options.base[0])
                        serveIndex(options.base[0])
                    ];
                }
            },
            sever: {
                options: {
                    base: ['dist']
                }
            }
        }

    });

    //加载模块
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.loadNpmTasks('grunt-banner');

    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');


    //注册任务
    grunt.registerTask('default', ['jshint', 'less', 'copy']);
    grunt.registerTask('compress', ['default', 'uglify', 'cssmin', 'usebanner']);
    grunt.registerTask('server', ['connect', 'watch']);
};