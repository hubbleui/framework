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
        files: [{
            expand: true,
            src: ['dist/js/*.js', '!dist/js/*.min.js'],
            dest: '',
            cwd: '.',
            rename: function (dst, src)
            {
            
                return src.replace('.js', '.min.js');
            }
        }]
    }
};