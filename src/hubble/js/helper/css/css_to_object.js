/**
 * Converts string styles into an object
 *
 * @param  {string} styles CSS
 * @return {object}
 */
css_to_object(styles)
{
    var ret = {};

    const nested_regex = /([^\{]+\{)([\s\S]+?\})(\s*\})/g;

    const css_regex = /([^{]+\s*\{\s*)([^}]+)(\s*\}\s*)/g;

    if (styles.includes('{'))
    {
        var nestedStyles = [...css.matchAll(nested_regex)];


    }

    this.each(styles.split(';'), function(i, rule)
    {
        var style = rule.split(':');

        if (style.length >= 2)
        {
            var prop = style.shift().trim();
            var val  = style.join(':').trim();

            ret[prop] = val;
        }
    }, this);

    return ret;
}