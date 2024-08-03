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
            'dist/css/hubble.css' : 'dist/css/hubble.css',
        }
    },
    
    // Hubble theme
    theme:
    {
        files:
        {
            'dist/css/theme.css' : 'dist/css/theme.css',
        }
    }
};