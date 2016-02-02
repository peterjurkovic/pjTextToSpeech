var pkg = require('./package.json'),
    CONF = {
        distPath: 'tmp/',
        srcPath: 'src/'
    },
    moduleName = pkg.name;

module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            dist: {
                src: [CONF.distPath, moduleName+'*.js', moduleName+'*.css']
            }
        },
        concat: {
            dist: {
                src: [CONF.srcPath + 'js/directives.js',CONF.srcPath + 'js/services.js', CONF.srcPath + 'js/module.js'],
                dest: CONF.distPath + moduleName + '.tmp.js'
            },
            fm : {
                src: [ CONF.distPath + moduleName + '.tmp.js', CONF.srcPath + 'js/fm.js'],
                dest: CONF.distPath + moduleName + '.min.js'
            }
        },
        copy: {
            main: {
                cwd: CONF.srcPath + 'css/',
                src: '**',
                dest: CONF.distPath,
                flatten: true,
                expand: true,
                filter: 'isFile'
            },
            fin : {
                cwd: CONF.distPath ,
                src: '**/*',
                dest: '',
                expand: true
            }
        },
        cssmin: {
            minify: {
                expand: true,
                src: CONF.distPath + '*.css',
                ext: '.min.css'
            }
        },
        uglify: {
            build: {
                src: CONF.distPath + moduleName + '.tmp.js',
                dest: CONF.distPath + moduleName + '.tmp.js'
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            files: {
                src: [
                    CONF.srcPath + 'js/directives.js' ,
                    CONF.srcPath + 'js/module.js',
                    CONF.srcPath + 'js/services.js'
                ]
            }
        },

        karma: {
            unit: {
                configFile: 'test/karma.conf.js'
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-cssbeautifier');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-karma');


    grunt.registerTask('build', [
        'clean',
        'jshint',
        'concat',
        'copy:main',
        'cssmin',
        'uglify',
        'concat:fm',
        'copy:fin'
    ]);

    grunt.registerTask('test', [
        'karma'
    ]);

}
