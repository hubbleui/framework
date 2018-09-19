/**
 * JS uglify/minfy task
 *
 * @var object
 */
module.exports =
{
	// Hubble Core + Theme
	hubble :
	{
        files :
        {
            'build/js/hubble.min.js': ['build/js/hubble.js'],
            'build/js/theme.min.js': ['build/js/theme.js']
        }
    }
};