/**
 * Prefixer configuration
 *
 * @var object
 */
var _options =
{
    browsers :
    [
        'Chrome >= 35', 
        'Firefox >= 31',
        'Edge >= 12',
        'Explorer >= 9',
        'iOS >= 8',
        'Safari >= 3',
        'Android 2.3',
        'Android >= 4',
        'Opera >= 12'
    ],
    remove : false
};

/**
 * CSS auto prefixer task
 *
 * @var object
 */
module.exports =
{
	// Prefixer options
	options: _options,

    // Hubble core
    core:
    {
        files:
        {
            'src/hubble/scss/base/premin.min.css' : 'src/hubble/scss/base/premin.min.css',
            
            'build/css/hubble.css' : 'build/css/hubble.css',
        }
    },
    
    // Hubble theme
    theme:
    {
        files:
        {
            'build/css/theme.css' : 'build/css/theme.css',
        }
    }
};