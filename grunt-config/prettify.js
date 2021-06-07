/**
 * Pretyify docs task
 *
 */
module.exports =
{
    docs:
    {
        options:
        {
            "indent"            : 4,
            "condense"          : true,
            "indent_inner_html" : true,
            "unformatted"       : ["pre", "code", "svg"],
            "preserve_newlines" : false
        },
        files:
        [{
            expand : true,
            cwd    : 'docs',
            src    : ['*.html', '**/*.html'],
            dest   : 'docs',
        }]
    }
};
