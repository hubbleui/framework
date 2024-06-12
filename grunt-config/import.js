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
        dest: 'build/js/hubble.js',
    },

    // Theme file
    theme :
    {
        src: 'src/theme/js/theme.js',
        dest: 'build/js/theme.js',
    },

    // Vendor
    gallery :
    {
        src: 'src/hubble/js/vendor/_photoSwipe.js',
        dest: 'build/js/gallery.js',
    },
    slider :
    {
        src: 'src/hubble/js/vendor/_flickity.js',
        dest: 'build/js/slider.js',
    },
};