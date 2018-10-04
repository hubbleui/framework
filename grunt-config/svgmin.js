/**
 * SVG minify task configuration
 *
 * @var object
 */
var _options =
{
    plugins :
    [
        {removeViewBox         : false},
        {removeDimensions      : true},
        {inlineStyles          : true},
        {removeDoctype         : true},
        {removeXMLProcInst     : true},
        {removeComments        : true},
        {removeMetadata        : true},
        {removeTitle           : true},
        {removeDesc            : true},
        {removeUselessDefs     : false},
        {removeXMLNS           : false},
        {removeEditorsNSData   : true},
        {removeEmptyAttrs      : true},
        {collapseGroups        : true},
        {removeAttrs           : { attrs: ['id', 'width', 'height', 'version']}}
    ]
};

/**
 * SVG minify task
 *
 * @var object
 */
module.exports =
{
    options : _options,

    dist :
    {
        options : _options,
        files   : [{
            expand : true,
            cwd    : 'src/img/',
            src    : ['**/*.svg'],
            dest   : 'build/img/'
        }]
    }
};