/**
 * String Helper Functions
 *
 * @author    {Joe J. Howard}
 * @copyright {Joe J. Howard}
 * @license   {https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE}
 */

/**
 * Json encode
 * 
 * @param  {mixed} str String JSON
 * @return {object|false}
 */
json_encode(str)
{
    var obj;
    try
    {
        obj = JSON.stringify(str);
    }
    catch (e)
    {
        return false;
    }
    return obj;
}

/**
 * Json encode
 * 
 * @param  {mixed} str String JSON
 * @return {object|false}
 */
json_decode(str)
{
    var obj;
    try
    {
        obj = JSON.parse(str);
    }
    catch (e)
    {
        return false;
    }
    return obj;
}


/**
 * Make a random string
 *
 * @param  {int}    length String length
 * @return {string}
 */
makeid(length)
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    for (var i = 0; i < length; i++)
    {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return text;
}

/**
 * Is variable numeric?
 *
 * @param  {mixed} mixed_var Variable to validate
 * @return {bool}
 */
is_numeric(mixed_var)
{
    var whitespace =
        " \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000";
    return (typeof mixed_var === 'number' || (typeof mixed_var === 'string' && whitespace.indexOf(mixed_var.slice(-1)) === -
        1)) && mixed_var !== '' && !isNaN(mixed_var);
}

/**
 * Parse url
 *
 * @param  {string}    str       The URL to parse. Invalid characters are replaced by _.
 * @return {object}
 */
parse_url(str)
{
    var ret = {};
    var url = new URL(str);

    if (url.search)
    {
        var queries = url.search.substring(1).split('&');
        var qret    = {};
        this.foreach(queries, function(i, query)
        {
            if (query.includes('='))
            {
                var set   = query.split('=');
                var key   = decodeURI(set[0].trim());
                var val   = true;

                if (set.length === 2)
                {
                    val = set[1].trim();
                }

                if (key !== '' && val !== '')
                {
                    qret[key] = val;
                }
            }
            else
            {
                qret[query] = true;
            }
        });

        url.query = qret;
    }

    return url;
}

/* Left trim */
ltrim(str, charlist)
{
    charlist = !charlist ? ' \\s\u00A0' : (charlist + '')
        .replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '$1');
    var re = new RegExp('^[' + charlist + ']+', 'g');
    return (str + '')
        .replace(re, '');
}

/* Left trim */
rtrim(str, charlist)
{
    charlist = !charlist ? ' \\s\u00A0' : (charlist + '')
        .replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '\\$1');
    var re = new RegExp('[' + charlist + ']+$', 'g');
    return (str + '')
        .replace(re, '');
}

/* Trim */
trim(str, charlist)
{
    return this.rtrim(this.ltrim(str, charlist), charlist);
}


/* split string at index */
strSplitIndex(value, index)
{
    return [value.substring(0, index + 1), value.substring(index + 1)];
}

/* Capatalize first letter */
uc_first(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/* Capatalize first letter of all words */
ucwords(str)
{
    return (str + '').replace(/^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g, function($1)
    {
        return $1.toUpperCase();
    });
}

to_camel_case(str)
{
    str = str.trim();

    // Shouldn't be changed
    if (!str.includes(' ') && !str.includes('-') && /[A-Z]/.test(str))
    {
        return str;
    }

    return str.toLowerCase().replace(/['"]/g, '').replace(/\W+/g, ' ').replace(/ (.)/g, function($1)
    {
        return $1.toUpperCase();
    })
    .replace(/ /g, '');
}

camel_case_to_hyphen(str)
{
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/\b([A-Z]+)([A-Z])([a-z])/, '$1-$2$3').toLowerCase();
}
