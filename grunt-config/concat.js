/**
 * File concat task configuration
 *
 * @var object
 */
var _options =
{
    separator: '\n',
};

/**
 * Concat task
 *
 * Put any custom concat mapping here
 * @var object
 */
module.exports =
{
    // Options
    options : _options,

	// Concat Hubble CSS Core
    css_core :
    {
        src :
        [
            'src/hubble/scss/base/premin.min.css',
            'build/css/hubble.css'
        ],

        dest: 'build/css/hubble.css',
    },

    // Concat Hubble minified core
    css_core_min:
    {
        src :
        [
            'src/hubble/scss/base/premin.min.css',
            'build/css/hubble.min.css'
        ],
        
        dest: 'build/css/hubble.min.css',
    },
};
