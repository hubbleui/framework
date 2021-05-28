/**
 * Sass task configuration
 *
 * @var object
 */
var _options =
{
    precision: 6,
    style: 'expanded',
    trace: true,
    bundleExec: false
};

/**
 * Sass task
 *
 * Put any custom SASS mapping here
 * @var object
 */
module.exports =
{
	// Preminify icons, fonts, css reset
    premin:
    {
        options:
        {
            precision  : 6,
            style      : 'compressed',
            trace      : true,
            bundleExec : false
        },
        files:
        {
            'src/hubble/scss/base/premin.min.css' : 'src/hubble/scss/base/premin.scss',
        }
    },

    // Hubble core
    core:
    {
        options: _options,
        files:
        {
           'build/css/hubble.css' : 'src/hubble/scss/hubble.scss'
        }
    },

    // Your custom theme
    theme:
    {
        options: _options,
        files:
        {
           'build/css/theme.css' : 'src/theme/scss/theme.scss'
        }
    }
};
