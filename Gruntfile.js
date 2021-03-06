module.exports = function(grunt)
{
    /**
     * Helper function to load config files
     *
     * @access private
     * @return object
     */
    function loadConfig(path)
    {
        var glob   = require('glob');
        var object = {};
        var key;

        glob.sync('*', {cwd: path}).forEach(function(option)
        {
            key        = option.replace(/\.js$/,'');
            object[key] = require(path + option);
        });


        return object;
    }

    /**
     * Initial Grunt Config
     *
     * @var object
     */
    var config =
    {
        pkg: grunt.file.readJSON('package.json')
    }

    // Load tasks from the grunt-config folder
    grunt.loadTasks('grunt-config');

    // Load all the tasks options in grunt-config based on the name:
    grunt.util._.extend(config, loadConfig('./grunt-config/'));

    // Init grunt configurations
    grunt.initConfig(config);

    // Register tasks
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-import');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-image');
    grunt.loadNpmTasks('grunt-svgmin');
    grunt.loadNpmTasks('grunt-prettify');
    grunt.loadNpmTasks("grunt-jsbeautifier");


    // Default grunt task 
    grunt.registerTask('default', [ 'sass', 'autoprefixer' ,'cssmin', 'concat', 'import', 'uglify', 'image', 'svgmin']);

    grunt.registerTask('js', ['import', 'uglify']);

    grunt.registerTask('css', ['sass', 'autoprefixer', 'cssmin', 'concat:css_core', 'concat:css_core_min']);

    grunt.registerTask('images', ['image', 'svgmin']);

    grunt.registerTask('dev', ['prettify', 'jsbeautifier']);
};
