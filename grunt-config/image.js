/**
 * Image compress task configuration
 *
 * @var object
 */
var _options =
{
    optipng        : true,
    pngquant       : false,
    zopflipng      : true,
    jpegRecompress : false,
    mozjpeg        : true,
    guetzli        : false,
    gifsicle       : true,
    svgo           : false
};

/**
 * Image compress task
 *
 * @var object
 */
module.exports =
{
    dist :
    {
        options : _options,
        
        files   : [{
            expand : true,
            cwd    : 'src/img/',
            src    : ['**/*.{png,jpg,gif}'],
            dest   : 'dist/img/'
        }]
    }
};