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
	// icons
    icons:
    {
        options:
        {
            sourcemap  : false,
            trace      : true,
            bundleExec : false,
            style      : 'compressed'
        },
        files:
        {
            'dist/css/hubble-icons.css' : 'src/hubble/scss/icons.scss',
        }
    },

    // Hubble core
    core:
    {
        options: _options,
        files:
        {
           'dist/css/hubble.css' : 'src/hubble/scss/hubble.scss',
           'dist/css/lazyload.css' : 'src/hubble/scss/lazyload.scss'
        }
    },

    // Your custom theme
    theme:
    {
        options: _options,
        files:
        {
           'dist/css/theme.css' : 'src/theme/scss/theme.scss'
        }
    }
};
