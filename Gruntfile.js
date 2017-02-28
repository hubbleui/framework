module.exports = function(grunt) {

    // Browser support for CSS prefix
    var _browsers = [
        'Chrome >= 35', 
        'Firefox >= 31',
        'Edge >= 12',
        'Explorer >= 9',
        'iOS >= 8',
        'Safari >= 8',
        'Android 2.3',
        'Android >= 4',
        'Opera >= 12'
    ];

    // Sass compiler options
    var _sassOptions = {
        precision: 6,
        sourcemap: 'auto',
        style: 'expanded',
        trace: true,
        bundleExec: false
    };

    // Grunt init config
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        // Sass (scss)
        sass: {

            // Preminify icons, fonts, css rest
            premin: {
                options: {
                    precision: 6,
                    sourcemap: 'none',
                    style: 'compressed',
                    trace: true,
                    bundleExec: false
                },
                files: {
                    'src/hubble/scss/base/premin.min.css' : 'src/hubble/scss/base/premin.scss',
                }
            },
            // hubble
            core: {
                options: _sassOptions,
                files: {
                   'build/css/hubble.css' : 'src/hubble/scss/hubble.scss'
                }
            },
            // theme
            theme: {
                options: _sassOptions,
                files: {
                   'build/css/theme.css' : 'src/theme/scss/theme.scss'
                }
            },
        },

        // Autoprefixer
        autoprefixer: {
            options: {
                browsers: _browsers,
            },
            // Hubble
            core: {
                files: {
                    'src/hubble/scss/base/premin.min.css' : 'src/hubble/scss/base/premin.min.css',
                    'build/css/hubble.css' : 'build/css/hubble.css',
                }
            },
            // theme
            theme: {
                files: {
                    'build/css/theme.css' : 'build/css/theme.css',
                }
            }
        },

        // CSS Minify 
        cssmin: {
            options: {
                compatibility: 'ie9',
                keepSpecialComments: '*',
                sourceMap: true,
                advanced: false
            },
            // Core & Theme
            core: {
                files: [{
                    expand: true,
                    cwd:  'build/css',
                    src: ['*.css', '!*.min.css'],
                    dest:  'build/css',
                    ext: '.min.css'
                }]
            },
        },

        import: {
            core: {
                src: 'src/hubble/js/hubble.js',
                dest: 'build/js/hubble.js',
            },
            theme: {
                src: 'src/theme/js/theme.js',
                dest: 'build/js/theme.js',
            }
        },

        // Concat js 
        concat: {

            options: {
                separator: '\n',
            },

            // theme
            css_core: {
                src: [
                    'src/hubble/scss/base/premin.min.css',
                    'build/css/hubble.css'
                ],
                dest: 'build/css/hubble.css',
            },
            // theme minified
            css_core_min: {
                src: [
                    'src/hubble/scss/base/premin.min.css',
                    'build/css/hubble.min.css'
                ],
                dest: 'build/css/hubble.min.css',
            },

        },

        // Uglify js
        uglify: {
            core: {
                files: {
                    'build/js/hubble.min.js': ['build/js/hubble.js'],
                    'build/js/theme.min.js': ['build/js/theme.js'],
                }
            }
        },

        // Watch
        watch: {
            sass: {
                files: 'src/**/*.scss',
                tasks: ['sass', 'autoprefixer' ,'cssmin', 'concat:css_core', 'concat:css_core_min'],
                options: {
                    interrupt: true,
                },
            },
            js: {
                files: 'src/**/*.js',
                tasks: ['import', 'uglify'],
                options: {
                    interrupt: true,
                },
            },
        },
   
    });

    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-import');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', [ 'sass', 'autoprefixer', 'concat', 'cssmin', 'import', 'uglify']);

}