/**
 * Minify configuration
 *
 * @var object
 */
var _options =
{
    compatibility       : 'ie9',
    keepSpecialComments : '*',
    sourceMap           : true,
    advanced            : false
};

/**
 * CSS minify task
 *
 * @var object
 */
module.exports =
{
	// Prefixer options
	options: _options,

    // Minify dist files
    dist: {
        files: [{
            expand : true,
            cwd    : 'dist/css',
            src    : ['*.css', '!*.min.css'],
            dest   : 'dist/css',
            ext    : '.min.css'
        }]
    }
};