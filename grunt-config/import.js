/**
 * JS "@import" task
 *
 * @var object
 */
module.exports =
{
	// Hubble Core
	core :
	{
        src: 'src/hubble/js/hubble.js',
        dest: 'dist/js/hubble.js',
    },

    // Theme file
    theme :
    {
        src: 'src/theme/js/theme.js',
        dest: 'dist/js/hubble.theme.js',
    },

    // Vendor
    gallery :
    {
        src: 'src/hubble/js/vendor/_photoSwipe.js',
        dest: 'dist/js/hubble.gallery.js',
    },
    lazy :
    {
        src: 'src/hubble/js/dom/_lazyLoad.js',
        dest: 'dist/js/hubble.lazyload.js',
    },
};