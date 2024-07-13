/**
 * Prefixer configuration
 *
 * @var object
 */
var _options =
{
    browsers : ['last 2 versions'],
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