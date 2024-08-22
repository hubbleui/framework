/**
 * Watch task configuration
 *
 * @var object
 */
var _options =
{
    interrupt  : true,
    livereload : true,
};

/**
 * Watch task
 *
 * @var object
 */
module.exports =
{
    // Watch sass files and run grunt tasks
    sass :
    {
        options : _options,
        files   : 'src/**/*.scss',
        tasks   : ['sass', 'autoprefixer' ,'cssmin', 'concat'],
        
    },
    
    // Watch js files and run grunt tasks
    js :
    {
        options : _options,
        files   : 'src/**/*.js',
        tasks   : ['js'],
    },

    // Watch image files and run grunt tasks
    images :
    {
        options : _options,
        files   : ['src/**/*.{png,jpg,gif}', 'src/*.{png,jpg,gif}'],
        tasks   : ['image'],
    },

    // Watch image files and run grunt tasks
    svg :
    {
        options : _options,
        files   : ['src/**/*.svg', 'src/*.svg'],
        tasks   : ['svgmin'],
    },

    // Watch docs src files and run grunt tasks
    docs :
    {
        options : _options,
        files   : ['src/docs/**/*.md', 'src/docs/**/*.html'],
        tasks   : ['docs'],
    }
};
