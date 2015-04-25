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
                dest: CONF.distPath + moduleName + '.js'
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
                src: CONF.distPath + moduleName + '.js',
                dest: CONF.distPath + moduleName + '.min.js'
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: CONF.srcPath + 'js/*.js'
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-cssbeautifier');
    grunt.loadNpmTasks('grunt-contrib-copy');


    grunt.registerTask('build', [
        'clean',
        'jshint',
        'concat',
        'copy:main',
        'cssmin',
        'uglify',
        'copy:fin'
    ]);

}
