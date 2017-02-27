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
        loadPath: ['src/scss'],
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
            // core
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
            core: {
                files: {
                    'build/css/hubble.css' : 'build/css/hubble.css',
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

        // Concat js 
        concat: {

            options: {
                separator: '\n',
            },
            core: {
                src: [

                    // Module ioc
                    'src/hubble/js/module-loader.js',

                    // Helper
                    'src/hubble/js/helper/open.js',
                    'src/hubble/js/helper/dom.js',
                    'src/hubble/js/helper/string.js',
                    'src/hubble/js/helper/array.js',
                    'src/hubble/js/helper/misc.js',
                    'src/hubble/js/helper/events.js',
                    'src/hubble/js/helper/close.js',

                    // Modules
                    'src/hubble/js/modules/SmoothScroll.js',
                    'src/hubble/js/modules/Waypoint.js',
                    'src/hubble/js/modules/Scrollbar.js',
                    'src/hubble/js/modules/Ajax.js',
                    'src/hubble/js/modules/ButtonRipple.js',
                    'src/hubble/js/modules/Collapse.js',
                    'src/hubble/js/modules/Dropdown.js',
                    'src/hubble/js/modules/Events.js',
                    'src/hubble/js/modules/FileInput.js',
                    'src/hubble/js/modules/Flickity.js',
                    'src/hubble/js/modules/Modal.js',
                    'src/hubble/js/modules/Notification.js',
                    'src/hubble/js/modules/Popover.js',
                    'src/hubble/js/modules/Tabs.js',
                    'src/hubble/js/modules/ToggleHeight.js',
                    'src/hubble/js/modules/InputMasker.js',
                    'src/hubble/js/modules/InputMasks.js',
                    'src/hubble/js/modules/FormValidator.js',

                ],
                dest: 'build/js/hubble.js',
            },
            // theme
            theme: {
                src: [
                    'src/theme/js/theme.js'
                ],
                dest: 'build/js/theme.js',
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
                tasks: ['sass', 'autoprefixer' ,'cssmin'],
                options: {
                    interrupt: true,
                },
            },
            js: {
                files: 'src/**/*.js',
                tasks: ['concat', 'uglify'],
                options: {
                    interrupt: true,
                },
            },
        },
   
    });

    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', [ 'sass', 'autoprefixer', 'cssmin', 'concat', 'uglify']);

}