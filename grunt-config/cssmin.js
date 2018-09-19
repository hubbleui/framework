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

    // Minify build files
    build: {
        files: [{
            expand : true,
            cwd    : 'build/css',
            src    : ['*.css', '!*.min.css'],
            dest   : 'build/css',
            ext    : '.min.css'
        }]
    }
};