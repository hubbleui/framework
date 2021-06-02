/**
 * String Helper Functions
 *
 * @author    Joe J. Howard
 * @copyright Joe J. Howard
 * @license   https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE
 */

/**
 * Is valid JSON
 * 
 * @param  mixed str String JSON
 * @return object|false
 */
JSHelper.prototype.isJSON = function(str)
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
 * Json encode
 * 
 * @param  mixed str String JSON
 * @return object|false
 */
JSHelper.prototype.json_encode = function(str)
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
 * @param  mixed str String JSON
 * @return object|false
 */
JSHelper.prototype.json_decode = function(str)
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
 * @param  int    length String length
 * @return string
 */
JSHelper.prototype.makeid = function(length)
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
 * @param  mixed mixed_var Variable to validate
 * @return bool
 */
JSHelper.prototype.is_numeric = function(mixed_var)
{
    var whitespace =
        " \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000";
    return (typeof mixed_var === 'number' || (typeof mixed_var === 'string' && whitespace.indexOf(mixed_var.slice(-1)) === -
        1)) && mixed_var !== '' && !isNaN(mixed_var);
}

/**
 * Parse url
 *
 * @param  string    str       The URL to parse. Invalid characters are replaced by _.
 * @param  string    component Specify one of PHP_URL_SCHEME, PHP_URL_HOST, PHP_URL_PORT, PHP_URL_USER, PHP_URL_PASS, PHP_URL_PATH, PHP_URL_QUERY or PHP_URL_FRAGMENT to retrieve just a specific URL component as a string (except when PHP_URL_PORT is given, in which case the return value will be an integer).
 * @return object
 */
JSHelper.prototype.parse_url = function(str, component)
{
    //       discuss at: http://phpjs.org/functions/parse_url/
    //      original by: Steven Levithan (http://blog.stevenlevithan.com)
    // reimplemented by: Brett Zamir (http://brett-zamir.me)
    //         input by: Lorenzo Pisani
    //         input by: Tony
    //      improved by: Brett Zamir (http://brett-zamir.me)
    //             note: original by http://stevenlevithan.com/demo/parseuri/js/assets/parseuri.js
    //             note: blog post at http://blog.stevenlevithan.com/archives/parseuri
    //             note: demo at http://stevenlevithan.com/demo/parseuri/js/assets/parseuri.js
    //             note: Does not replace invalid characters with '_' as in PHP, nor does it return false with
    //             note: a seriously malformed URL.
    //             note: Besides function name, is essentially the same as parseUri as well as our allowing
    //             note: an extra slash after the scheme/protocol (to allow file:/// as in PHP)
    //        example 1: parse_url('http://username:password@hostname/path?arg=value#anchor');
    //        returns 1: {scheme: 'http', host: 'hostname', user: 'username', pass: 'password', path: '/path', query: 'arg=value', fragment: 'anchor'}

    var query, key = ['source', 'scheme', 'authority', 'userInfo', 'user', 'pass', 'host', 'port',
            'relative', 'path', 'directory', 'file', 'query', 'fragment'
        ],
        ini = (this.php_js && this.php_js.ini) ||
        {},
        mode = (ini['phpjs.parse_url.mode'] &&
            ini['phpjs.parse_url.mode'].local_value) || 'php',
        parser = {
            php: /^(?:([^:\/?#]+):)?(?:\/\/()(?:(?:()(?:([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?()(?:(()(?:(?:[^?#\/]*\/)*)()(?:[^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
            strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
            loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/\/?)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/ // Added one optional slash to post-scheme to catch file:/// (should restrict this)
        };

    var m = parser[mode].exec(str),
        uri = {},
        i = 14;
    while (i--)
    {
        if (m[i])
        {
            uri[key[i]] = m[i];
        }
    }

    if (component)
    {
        return uri[component.replace('PHP_URL_', '')
            .toLowerCase()];
    }
    if (mode !== 'php')
    {
        var name = (ini['phpjs.parse_url.queryKey'] &&
            ini['phpjs.parse_url.queryKey'].local_value) || 'queryKey';
        parser = /(?:^|&)([^&=]*)=?([^&]*)/g;
        uri[name] = {};
        query = uri[key[12]] || '';
        query.replace(parser, function($0, $1, $2)
        {
            if ($1)
            {
                uri[name][$1] = $2;
            }
        });
    }

    if (!'scheme' in uri || !uri.scheme || uri.scheme === '')
    {
        uri['scheme'] = window.location.protocol.replace(':', '').replaceAll('/', '');
    }

    delete uri.source;
    return uri;
}

/* Left trim */
JSHelper.prototype.ltrim = function(str, charlist)
{
    //  discuss at: http://phpjs.org/functions/ltrim/
    // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    //    input by: Erkekjetter
    // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // bugfixed by: Onno Marsman
    //   example 1: ltrim('    Kevin van Zonneveld    ');
    //   returns 1: 'Kevin van Zonneveld    '

    charlist = !charlist ? ' \\s\u00A0' : (charlist + '')
        .replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '$1');
    var re = new RegExp('^[' + charlist + ']+', 'g');
    return (str + '')
        .replace(re, '');
}

/* Left trim */
JSHelper.prototype.rtrim = function(str, charlist)
{
    //  discuss at: http://phpjs.org/functions/rtrim/
    // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    //    input by: Erkekjetter
    //    input by: rem
    // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // bugfixed by: Onno Marsman
    // bugfixed by: Brett Zamir (http://brett-zamir.me)
    //   example 1: rtrim('    Kevin van Zonneveld    ');
    //   returns 1: '    Kevin van Zonneveld'

    charlist = !charlist ? ' \\s\u00A0' : (charlist + '')
        .replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '\\$1');
    var re = new RegExp('[' + charlist + ']+$', 'g');
    return (str + '')
        .replace(re, '');
}

/* Trim */
JSHelper.prototype.trim = function(str, charlist)
{
    //  discuss at: http://phpjs.org/functions/trim/
    // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // improved by: mdsjack (http://www.mdsjack.bo.it)
    // improved by: Alexander Ermolaev (http://snippets.dzone.com/user/AlexanderErmolaev)
    // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // improved by: Steven Levithan (http://blog.stevenlevithan.com)
    // improved by: Jack
    //    input by: Erkekjetter
    //    input by: DxGx
    // bugfixed by: Onno Marsman
    //   example 1: trim('    Kevin van Zonneveld    ');
    //   returns 1: 'Kevin van Zonneveld'
    //   example 2: trim('Hello World', 'Hdle');
    //   returns 2: 'o Wor'
    //   example 3: trim(16, 1);
    //   returns 3: 6

    var whitespace, l = 0,
        i = 0;
    str += '';

    if (!charlist)
    {
        // default list
        whitespace =
            ' \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000';
    }
    else
    {
        // preg_quote custom list
        charlist += '';
        whitespace = charlist.replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '$1');
    }

    l = str.length;
    for (var i = 0; i < l; i++)
    {
        if (whitespace.indexOf(str.charAt(i)) === -1)
        {
            str = str.substring(i);
            break;
        }
    }

    l = str.length;
    for (i = l - 1; i >= 0; i--)
    {
        if (whitespace.indexOf(str.charAt(i)) === -1)
        {
            str = str.substring(0, i + 1);
            break;
        }
    }

    return whitespace.indexOf(str.charAt(0)) === -1 ? str : '';
}

/* regex escape */
JSHelper.prototype.preg_quote = function(str, delimiter)
{
    //  discuss at: http://phpjs.org/functions/preg_quote/
    // original by: booeyOH
    // improved by: Ates Goral (http://magnetiq.com)
    // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // improved by: Brett Zamir (http://brett-zamir.me)
    // bugfixed by: Onno Marsman
    //   example 1: preg_quote("$40");
    //   returns 1: '\\$40'
    //   example 2: preg_quote("*RRRING* Hello?");
    //   returns 2: '\\*RRRING\\* Hello\\?'
    //   example 3: preg_quote("\\.+*?[^]$(){}=!<>|:");
    //   returns 3: '\\\\\\.\\+\\*\\?\\[\\^\\]\\$\\(\\)\\{\\}\\=\\!\\<\\>\\|\\:'

    return String(str)
        .replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\' + (delimiter || '') + '-]', 'g'), '\\$&');
}

/* Preg match all */
JSHelper.prototype.preg_match_all = function(pattern, subject)
{

    // convert the pattern to regix
    // if needed. return null on fail
    if (typeof pattern === 'string')
    {
        try
        {
            pattern = new RegExp(pattern);
        }
        catch (err)
        {
            return null;
        }
    }
    var _this = this;
    var matches = [];
    var matched = pattern.exec(subject);
    if (matched !== null)
    {
        var i = 0;
        while (matched = pattern.exec(subject))
        {
            subject = _this.str_split_index(subject, (matched.index + matched[0].length - 1))[1];
            matched.index = i > 0 ? (matched.index + (matched[0].length - 1)) : matched.index - 1;
            matches.push(matched);
            i++;
        }
        return matches;
    }
    return null;
}

/* split string at index */
JSHelper.prototype.str_split_index = function(value, index)
{
    return [value.substring(0, index + 1), value.substring(index + 1)];
}

/* Capatalize first letter */
JSHelper.prototype.ucfirst = function(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/* Capatalize first letter of all words */
JSHelper.prototype.ucwords = function(str)
{
    //  discuss at: http://phpjs.org/functions/ucwords/
    // original by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
    // improved by: Waldo Malqui Silva
    // improved by: Robin
    // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // bugfixed by: Onno Marsman
    //    input by: James (http://www.james-bell.co.uk/)
    //   example 1: ucwords('kevin van  zonneveld');
    //   returns 1: 'Kevin Van  Zonneveld'
    //   example 2: ucwords('HELLO WORLD');
    //   returns 2: 'HELLO WORLD'

    return (str + '')
        .replace(/^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g, function($1)
        {
            return $1.toUpperCase();
        });
}

/* Reduce a string to a x words/letters with (optional) suffix */
JSHelper.prototype.strReduce = function(string, length, suffix, toChar)
{

    toChar = (typeof toChar === 'undefined' ? true : false);
    suffix = (typeof suffix === 'undefined' ? '' : suffix);

    if (toChar) return (string.length > length) ? string.substring(0, length) + suffix : string;

    var words = string.split(" ");

    if (count(words) > length) return fruits.slice(0, length).join(' ').suffix;

    return string;

}

/* Return human friendly time-ago */
JSHelper.prototype.timeAgo = function(time, asArray)
{
    asArray = (typeof asArray === 'undefined' ? false : true);
    time = isValidTimeStamp(time) ? parseInt(time) : strtotime(time);
    var units = [
    {
        name: "second",
        limit: 60,
        in_seconds: 1
    },
    {
        name: "minute",
        limit: 3600,
        in_seconds: 60
    },
    {
        name: "hour",
        limit: 86400,
        in_seconds: 3600
    },
    {
        name: "day",
        limit: 604800,
        in_seconds: 86400
    },
    {
        name: "week",
        limit: 2629743,
        in_seconds: 604800
    },
    {
        name: "month",
        limit: 31556926,
        in_seconds: 2629743
    },
    {
        name: "year",
        limit: null,
        in_seconds: 31556926
    }];
    var diff = (new Date() - new Date(time * 1000)) / 1000;
    if (diff < 5) return "now";

    var i = 0,
        unit;
    while (unit = units[i++])
    {
        if (diff < unit.limit || !unit.limit)
        {
            var diff = Math.floor(diff / unit.in_seconds);
            if (asArray)
            {
                return {
                    unit: unit.name + (diff > 1 ? "s" : ""),
                    time: diff
                };
            }
            return diff + " " + unit.name + (diff > 1 ? "s" : "");
        }
    }
}

/* Convert a string-date to a timestamp */
JSHelper.prototype.strtotime = function(text)
{
    var timestamp = Math.round(new Date(text).getTime() / 1000);

    if (isNaN(timestamp))
    {
        timestamp = Date.parse(text);

        if (isNaN(timestamp))
        {
            var split = text.split('/');

            if (Helper.count(split) !== 3)
            {
                return false;
            }

            // MM/DD/YY
            timestamp = Date.parse(split[1] + '/' + split[0] + '/' + split[2]);

            if (isNaN(timestamp))
            {
                return false;
            }
        }
    }

    return timestamp;
}

/* String replace */
JSHelper.prototype.str_replace = function(search, replace, subject, count)
{
    //  discuss at: http://phpjs.org/functions/str_replace/
    // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // improved by: Gabriel Paderni
    // improved by: Philip Peterson
    // improved by: Simon Willison (http://simonwillison.net)
    // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // improved by: Onno Marsman
    // improved by: Brett Zamir (http://brett-zamir.me)
    //  revised by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
    // bugfixed by: Anton Ongson
    // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // bugfixed by: Oleg Eremeev
    // bugfixed by: Glen Arason (http://CanadianDomainRegistry.ca)
    // bugfixed by: Glen Arason (http://CanadianDomainRegistry.ca) Corrected count
    //    input by: Onno Marsman
    //    input by: Brett Zamir (http://brett-zamir.me)
    //    input by: Oleg Eremeev
    //        note: The count parameter must be passed as a string in order
    //        note: to find a global variable in which the result will be given
    //   example 1: str_replace(' ', '.', 'Kevin van Zonneveld');
    //   returns 1: 'Kevin.van.Zonneveld'
    //   example 2: str_replace(['{name}', 'l'], ['hello', 'm'], '{name}, lars');
    //   returns 2: 'hemmo, mars'
    //   example 3: str_replace(Array('S','F'),'x','ASDFASDF');
    //   returns 3: 'AxDxAxDx'
    //   example 4: str_replace(['A','D'], ['x','y'] , 'ASDFASDF' , 'cnt');
    //   returns 4: 'xSyFxSyF' // cnt = 0 (incorrect before fix)
    //   returns 4: 'xSyFxSyF' // cnt = 4 (correct after fix)

    var i = 0,
        j = 0,
        temp = '',
        repl = '',
        sl = 0,
        fl = 0,
        f = [].concat(search),
        r = [].concat(replace),
        s = subject,
        ra = Object.prototype.toString.call(r) === '[object Array]',
        sa = Object.prototype.toString.call(s) === '[object Array]';
    s = [].concat(s);

    if (typeof(search) === 'object' && typeof(replace) === 'string')
    {
        temp = replace;
        replace = new Array();
        for (var i = 0; i < search.length; i += 1)
        {
            replace[i] = temp;
        }
        temp = '';
        r = [].concat(replace);
        ra = Object.prototype.toString.call(r) === '[object Array]';
    }

    if (count)
    {
        this.window[count] = 0;
    }

    for (i = 0, sl = s.length; i < sl; i++)
    {
        if (s[i] === '')
        {
            continue;
        }
        for (j = 0, fl = f.length; j < fl; j++)
        {
            temp = s[i] + '';
            repl = ra ? (r[j] !== undefined ? r[j] : '') : r[0];
            s[i] = (temp)
                .split(f[j])
                .join(repl);
            if (count)
            {
                this.window[count] += ((temp.split(f[j]))
                    .length - 1);
            }
        }
    }
    return sa ? s : s[0];
}

JSHelper.prototype.str_split = function(string, split_length)
{
    //  discuss at: http://phpjs.org/functions/str_split/
    // original by: Martijn Wieringa
    // improved by: Brett Zamir (http://brett-zamir.me)
    // bugfixed by: Onno Marsman
    //  revised by: Theriault
    //  revised by: Rafał Kukawski (http://blog.kukawski.pl/)
    //    input by: Bjorn Roesbeke (http://www.bjornroesbeke.be/)
    //   example 1: str_split('Hello Friend', 3);
    //   returns 1: ['Hel', 'lo ', 'Fri', 'end']

    if (split_length === null)
    {
        split_length = 1;
    }
    if (string === null || split_length < 1)
    {
        return false;
    }
    string += '';
    var chunks = [],
        pos = 0,
        len = string.length;
    while (pos < len)
    {
        chunks.push(string.slice(pos, pos += split_length));
    }

    return chunks;
}

JSHelper.prototype.toCamelCase = function(str)
{
    return str.toLowerCase()
        .replace(/['"]/g, '')
        .replace(/\W+/g, ' ')
        .replace(/ (.)/g, function($1)
        {
            return $1.toUpperCase();
        })
        .replace(/ /g, '');
}

JSHelper.prototype.camelCaseToHyphen = function(str)
{
    return str
        // insert a hyphen between lower & upper
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        // hyphen before last upper in a sequence followed by lower
        .replace(/\b([A-Z]+)([A-Z])([a-z])/, '$1-$2$3').toLowerCase();
}


JSHelper.prototype.explode = function(delimiter, string, limit)
{
    //  discuss at: http://phpjs.org/functions/explode/
    // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    //   example 1: explode(' ', 'Kevin van Zonneveld');
    //   returns 1: {0: 'Kevin', 1: 'van', 2: 'Zonneveld'}

    if (arguments.length < 2 || typeof delimiter === 'undefined' || typeof string === 'undefined') return null;
    if (delimiter === '' || delimiter === false || delimiter === null) return false;
    if (typeof delimiter === 'function' || typeof delimiter === 'object' || typeof string === 'function' || typeof string ===
        'object')
    {
        return {
            0: ''
        };
    }
    if (delimiter === true) delimiter = '1';

    // Here we go...
    delimiter += '';
    string += '';

    var s = string.split(delimiter);

    if (typeof limit === 'undefined') return s;

    // Support for limit
    if (limit === 0) limit = 1;

    // Positive limit
    if (limit > 0)
    {
        if (limit >= s.length) return s;
        return s.slice(0, limit - 1)
            .concat([s.slice(limit - 1)
                .join(delimiter)
            ]);
    }

    // Negative limit
    if (-limit >= s.length) return [];

    s.splice(s.length + limit);
    return s;
}

JSHelper.prototype.htmlspecialchars = function(string, quote_style, charset, double_encode)
{
    // http://kevin.vanzonneveld.net
    // +   original by: Mirek Slugen
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Nathan
    // +   bugfixed by: Arno
    // +    revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +    bugfixed by: Brett Zamir (http://brett-zamir.me)
    // +      input by: Ratheous
    // +      input by: Mailfaker (http://www.weedem.fr/)
    // +      reimplemented by: Brett Zamir (http://brett-zamir.me)
    // +      input by: felix
    // +    bugfixed by: Brett Zamir (http://brett-zamir.me)
    // %        note 1: charset argument not supported
    // *     example 1: htmlspecialchars("<a href='test'>Test</a>", 'ENT_QUOTES');
    // *     returns 1: '&lt;a href=&#039;test&#039;&gt;Test&lt;/a&gt;'
    // *     example 2: htmlspecialchars("ab\"c'd", ['ENT_NOQUOTES', 'ENT_QUOTES']);
    // *     returns 2: 'ab"c&#039;d'
    // *     example 3: htmlspecialchars("my "&entity;" is still here", null, null, false);
    // *     returns 3: 'my &quot;&entity;&quot; is still here'
    var optTemp = 0,
        i = 0,
        noquotes = false;
    if (typeof quote_style === 'undefined' || quote_style === null)
    {
        quote_style = 2;
    }
    string = string.toString();
    if (double_encode !== false)
    { // Put this first to avoid double-encoding
        string = string.replace(/&/g, '&amp;');
    }
    string = string.replace(/</g, '&lt;').replace(/>/g, '&gt;');

    var OPTS = {
        'ENT_NOQUOTES': 0,
        'ENT_HTML_QUOTE_SINGLE': 1,
        'ENT_HTML_QUOTE_DOUBLE': 2,
        'ENT_COMPAT': 2,
        'ENT_QUOTES': 3,
        'ENT_IGNORE': 4
    };
    if (quote_style === 0)
    {
        noquotes = true;
    }
    if (typeof quote_style !== 'number')
    { // Allow for a single string or an array of string flags
        quote_style = [].concat(quote_style);
        for (var i = 0; i < quote_style.length; i++)
        {
            // Resolve string input to bitwise e.g. 'ENT_IGNORE' becomes 4
            if (OPTS[quote_style[i]] === 0)
            {
                noquotes = true;
            }
            else if (OPTS[quote_style[i]])
            {
                optTemp = optTemp | OPTS[quote_style[i]];
            }
        }
        quote_style = optTemp;
    }
    if (quote_style & OPTS.ENT_HTML_QUOTE_SINGLE)
    {
        string = string.replace(/'/g, '&#039;');
    }
    if (!noquotes)
    {
        string = string.replace(/"/g, '&quot;');
    }

    return string;
}


JSHelper.prototype.htmlspecialchars_decode = function(string, quote_style)
{
    //       discuss at: http://phpjs.org/functions/htmlspecialchars_decode/
    //      original by: Mirek Slugen
    //      improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    //      bugfixed by: Mateusz "loonquawl" Zalega
    //      bugfixed by: Onno Marsman
    //      bugfixed by: Brett Zamir (http://brett-zamir.me)
    //      bugfixed by: Brett Zamir (http://brett-zamir.me)
    //         input by: ReverseSyntax
    //         input by: Slawomir Kaniecki
    //         input by: Scott Cariss
    //         input by: Francois
    //         input by: Ratheous
    //         input by: Mailfaker (http://www.weedem.fr/)
    //       revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // reimplemented by: Brett Zamir (http://brett-zamir.me)
    //        example 1: htmlspecialchars_decode("<p>this -&gt; &quot;</p>", 'ENT_NOQUOTES');
    //        returns 1: '<p>this -> &quot;</p>'
    //        example 2: htmlspecialchars_decode("&amp;quot;");
    //        returns 2: '&quot;'

    var optTemp = 0,
        i = 0,
        noquotes = false;
    if (typeof quote_style === 'undefined')
    {
        quote_style = 2;
    }
    string = string.toString()
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>');
    var OPTS = {
        'ENT_NOQUOTES': 0,
        'ENT_HTML_QUOTE_SINGLE': 1,
        'ENT_HTML_QUOTE_DOUBLE': 2,
        'ENT_COMPAT': 2,
        'ENT_QUOTES': 3,
        'ENT_IGNORE': 4
    };
    if (quote_style === 0)
    {
        noquotes = true;
    }
    if (typeof quote_style !== 'number')
    { // Allow for a single string or an array of string flags
        quote_style = [].concat(quote_style);
        for (var i = 0; i < quote_style.length; i++)
        {
            // Resolve string input to bitwise e.g. 'PATHINFO_EXTENSION' becomes 4
            if (OPTS[quote_style[i]] === 0)
            {
                noquotes = true;
            }
            else if (OPTS[quote_style[i]])
            {
                optTemp = optTemp | OPTS[quote_style[i]];
            }
        }
        quote_style = optTemp;
    }
    if (quote_style & OPTS.ENT_HTML_QUOTE_SINGLE)
    {
        string = string.replace(/&#0*39;/g, "'"); // PHP doesn't currently escape if more than one 0, but it should
        // string = string.replace(/&apos;|&#x0*27;/g, "'"); // This would also be useful here, but not a part of PHP
    }
    if (!noquotes)
    {
        string = string.replace(/&quot;/g, '"');
    }
    // Put this in last place to avoid escape being double-decoded
    string = string.replace(/&amp;/g, '&');

    return string;
}

JSHelper.prototype.get_html_translation_table = function(table, quoteStyle)
{

    // eslint-disable-line camelcase
    //  discuss at: http://locutus.io/php/get_html_translation_table/
    // original by: Philip Peterson
    //  revised by: Kevin van Zonneveld (http://kvz.io)
    // bugfixed by: noname
    // bugfixed by: Alex
    // bugfixed by: Marco
    // bugfixed by: madipta
    // bugfixed by: Brett Zamir (http://brett-zamir.me)
    // bugfixed by: T.Wild
    // improved by: KELAN
    // improved by: Brett Zamir (http://brett-zamir.me)
    //    input by: Frank Forte
    //    input by: Ratheous
    //      note 1: It has been decided that we're not going to add global
    //      note 1: dependencies to Locutus, meaning the constants are not
    //      note 1: real constants, but strings instead. Integers are also supported if someone
    //      note 1: chooses to create the constants themselves.
    //   example 1: get_html_translation_table('HTML_SPECIALCHARS')
    //   returns 1: {'"': '&quot;', '&': '&amp;', '<': '&lt;', '>': '&gt;'}

    var entities = {}
    var hashMap = {}
    var decimal
    var constMappingTable = {}
    var constMappingQuoteStyle = {}
    var useTable = {}
    var useQuoteStyle = {}

    // Translate arguments
    constMappingTable[0] = 'HTML_SPECIALCHARS'
    constMappingTable[1] = 'HTML_ENTITIES'
    constMappingQuoteStyle[0] = 'ENT_NOQUOTES'
    constMappingQuoteStyle[2] = 'ENT_COMPAT'
    constMappingQuoteStyle[3] = 'ENT_QUOTES'

    useTable = !isNaN(table) ?
        constMappingTable[table] :
        table ?
        table.toUpperCase() :
        'HTML_SPECIALCHARS'

    useQuoteStyle = !isNaN(quoteStyle) ?
        constMappingQuoteStyle[quoteStyle] :
        quoteStyle ?
        quoteStyle.toUpperCase() :
        'ENT_COMPAT'

    if (useTable !== 'HTML_SPECIALCHARS' && useTable !== 'HTML_ENTITIES')
    {
        throw new Error('Table: ' + useTable + ' not supported')
    }

    entities['38'] = '&amp;'
    if (useTable === 'HTML_ENTITIES')
    {
        entities['160'] = '&nbsp;'
        entities['161'] = '&iexcl;'
        entities['162'] = '&cent;'
        entities['163'] = '&pound;'
        entities['164'] = '&curren;'
        entities['165'] = '&yen;'
        entities['166'] = '&brvbar;'
        entities['167'] = '&sect;'
        entities['168'] = '&uml;'
        entities['169'] = '&copy;'
        entities['170'] = '&ordf;'
        entities['171'] = '&laquo;'
        entities['172'] = '&not;'
        entities['173'] = '&shy;'
        entities['174'] = '&reg;'
        entities['175'] = '&macr;'
        entities['176'] = '&deg;'
        entities['177'] = '&plusmn;'
        entities['178'] = '&sup2;'
        entities['179'] = '&sup3;'
        entities['180'] = '&acute;'
        entities['181'] = '&micro;'
        entities['182'] = '&para;'
        entities['183'] = '&middot;'
        entities['184'] = '&cedil;'
        entities['185'] = '&sup1;'
        entities['186'] = '&ordm;'
        entities['187'] = '&raquo;'
        entities['188'] = '&frac14;'
        entities['189'] = '&frac12;'
        entities['190'] = '&frac34;'
        entities['191'] = '&iquest;'
        entities['192'] = '&Agrave;'
        entities['193'] = '&Aacute;'
        entities['194'] = '&Acirc;'
        entities['195'] = '&Atilde;'
        entities['196'] = '&Auml;'
        entities['197'] = '&Aring;'
        entities['198'] = '&AElig;'
        entities['199'] = '&Ccedil;'
        entities['200'] = '&Egrave;'
        entities['201'] = '&Eacute;'
        entities['202'] = '&Ecirc;'
        entities['203'] = '&Euml;'
        entities['204'] = '&Igrave;'
        entities['205'] = '&Iacute;'
        entities['206'] = '&Icirc;'
        entities['207'] = '&Iuml;'
        entities['208'] = '&ETH;'
        entities['209'] = '&Ntilde;'
        entities['210'] = '&Ograve;'
        entities['211'] = '&Oacute;'
        entities['212'] = '&Ocirc;'
        entities['213'] = '&Otilde;'
        entities['214'] = '&Ouml;'
        entities['215'] = '&times;'
        entities['216'] = '&Oslash;'
        entities['217'] = '&Ugrave;'
        entities['218'] = '&Uacute;'
        entities['219'] = '&Ucirc;'
        entities['220'] = '&Uuml;'
        entities['221'] = '&Yacute;'
        entities['222'] = '&THORN;'
        entities['223'] = '&szlig;'
        entities['224'] = '&agrave;'
        entities['225'] = '&aacute;'
        entities['226'] = '&acirc;'
        entities['227'] = '&atilde;'
        entities['228'] = '&auml;'
        entities['229'] = '&aring;'
        entities['230'] = '&aelig;'
        entities['231'] = '&ccedil;'
        entities['232'] = '&egrave;'
        entities['233'] = '&eacute;'
        entities['234'] = '&ecirc;'
        entities['235'] = '&euml;'
        entities['236'] = '&igrave;'
        entities['237'] = '&iacute;'
        entities['238'] = '&icirc;'
        entities['239'] = '&iuml;'
        entities['240'] = '&eth;'
        entities['241'] = '&ntilde;'
        entities['242'] = '&ograve;'
        entities['243'] = '&oacute;'
        entities['244'] = '&ocirc;'
        entities['245'] = '&otilde;'
        entities['246'] = '&ouml;'
        entities['247'] = '&divide;'
        entities['248'] = '&oslash;'
        entities['249'] = '&ugrave;'
        entities['250'] = '&uacute;'
        entities['251'] = '&ucirc;'
        entities['252'] = '&uuml;'
        entities['253'] = '&yacute;'
        entities['254'] = '&thorn;'
        entities['255'] = '&yuml;'
    }

    if (useQuoteStyle !== 'ENT_NOQUOTES')
    {
        entities['34'] = '&quot;'
    }
    if (useQuoteStyle === 'ENT_QUOTES')
    {
        entities['39'] = '&#39;'
    }
    entities['60'] = '&lt;'
    entities['62'] = '&gt;'

    // ascii decimals to real symbols
    for (decimal in entities)
    {
        if (entities.hasOwnProperty(decimal))
        {
            hashMap[String.fromCharCode(decimal)] = entities[decimal]
        }
    }

    return hashMap
}

JSHelper.prototype.html_entity_decode = function(string, quote_style)
{
    //  discuss at: http://phpjs.org/functions/html_entity_decode/
    // original by: john (http://www.jd-tech.net)
    //    input by: ger
    //    input by: Ratheous
    //    input by: Nick Kolosov (http://sammy.ru)
    // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // improved by: marc andreu
    //  revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    //  revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // bugfixed by: Onno Marsman
    // bugfixed by: Brett Zamir (http://brett-zamir.me)
    // bugfixed by: Fox
    //  depends on: get_html_translation_table
    //   example 1: html_entity_decode('Kevin &amp; van Zonneveld');
    //   returns 1: 'Kevin & van Zonneveld'
    //   example 2: html_entity_decode('&amp;lt;');
    //   returns 2: '&lt;'

    var hash_map = {},
        symbol = '',
        tmp_str = '',
        entity = '';
    tmp_str = string.toString();

    if (false === (hash_map = this.get_html_translation_table('HTML_ENTITIES', quote_style)))
    {
        return false;
    }

    // fix &amp; problem
    // http://phpjs.org/functions/get_html_translation_table:416#comment_97660
    delete(hash_map['&']);
    hash_map['&'] = '&amp;';

    for (symbol in hash_map)
    {
        entity = hash_map[symbol];
        tmp_str = tmp_str.split(entity)
            .join(symbol);
    }
    tmp_str = tmp_str.split('&#039;')
        .join("'");

    return tmp_str;
}

JSHelper.prototype.strcmp = function(str1, str2)
{
    //  discuss at: http://phpjs.org/functions/strcmp/
    // original by: Waldo Malqui Silva (http://waldo.malqui.info)
    //    input by: Steve Hilder
    // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    //  revised by: gorthaur
    //   example 1: strcmp( 'waldo', 'owald' );
    //   returns 1: 1
    //   example 2: strcmp( 'owald', 'waldo' );
    //   returns 2: -1

    return ((str1 == str2) ? 0 : ((str1 > str2) ? 1 : -1))
}

JSHelper.prototype.strnatcmp = function(f_string1, f_string2, f_version)
{
    //  discuss at: http://phpjs.org/functions/strnatcmp/
    // original by: Martijn Wieringa
    // improved by: Michael White (http://getsprink.com)
    // improved by: Jack
    // bugfixed by: Onno Marsman
    //  depends on: strcmp
    //        note: Added f_version argument against code guidelines, because it's so neat
    //   example 1: strnatcmp('Price 12.9', 'Price 12.15');
    //   returns 1: 1
    //   example 2: strnatcmp('Price 12.09', 'Price 12.15');
    //   returns 2: -1
    //   example 3: strnatcmp('Price 12.90', 'Price 12.15');
    //   returns 3: 1
    //   example 4: strnatcmp('Version 12.9', 'Version 12.15', true);
    //   returns 4: -6
    //   example 5: strnatcmp('Version 12.15', 'Version 12.9', true);
    //   returns 5: 6

    var i = 0

    if (f_version == undefined)
    {
        f_version = false
    }

    var __strnatcmp_split = function(f_string)
    {
        var result = []
        var buffer = ''
        var chr = ''
        var i = 0,
            f_stringl = 0

        var text = true

        f_stringl = f_string.length
        for (var i = 0; i < f_stringl; i++)
        {
            chr = f_string.substring(i, i + 1)
            if (chr.match(/\d/))
            {
                if (text)
                {
                    if (buffer.length > 0)
                    {
                        result[result.length] = buffer
                        buffer = ''
                    }

                    text = false
                }
                buffer += chr
            }
            else if ((text == false) && (chr === '.') && (i < (f_string.length - 1)) && (f_string.substring(i + 1, i +
                        2)
                    .match(/\d/)))
            {
                result[result.length] = buffer
                buffer = ''
            }
            else
            {
                if (text == false)
                {
                    if (buffer.length > 0)
                    {
                        result[result.length] = parseInt(buffer, 10)
                        buffer = ''
                    }
                    text = true
                }
                buffer += chr
            }
        }

        if (buffer.length > 0)
        {
            if (text)
            {
                result[result.length] = buffer
            }
            else
            {
                result[result.length] = parseInt(buffer, 10)
            }
        }

        return result
    }

    var array1 = __strnatcmp_split(f_string1 + '')
    var array2 = __strnatcmp_split(f_string2 + '')

    var len = array1.length
    var text = true

    var result = -1
    var r = 0

    if (len > array2.length)
    {
        len = array2.length
        result = 1
    }

    for (var i = 0; i < len; i++)
    {
        if (isNaN(array1[i]))
        {
            if (isNaN(array2[i]))
            {
                text = true

                if ((r = this.strcmp(array1[i], array2[i])) != 0)
                {
                    return r
                }
            }
            else if (text)
            {
                return 1
            }
            else
            {
                return -1
            }
        }
        else if (isNaN(array2[i]))
        {
            if (text)
            {
                return -1
            }
            else
            {
                return 1
            }
        }
        else
        {
            if (text || f_version)
            {
                if ((r = (array1[i] - array2[i])) != 0)
                {
                    return r
                }
            }
            else
            {
                if ((r = this.strcmp(array1[i].toString(), array2[i].toString())) != 0)
                {
                    return r
                }
            }

            text = false
        }
    }

    return result
}

JSHelper.prototype.number_format = function(number, decimals, decPoint, thousandsSep)
{ // eslint-disable-line camelcase
    //  discuss at: http://locutus.io/php/number_format/
    // original by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
    // improved by: Kevin van Zonneveld (http://kvz.io)
    // improved by: davook
    // improved by: Brett Zamir (http://brett-zamir.me)
    // improved by: Brett Zamir (http://brett-zamir.me)
    // improved by: Theriault (https://github.com/Theriault)
    // improved by: Kevin van Zonneveld (http://kvz.io)
    // bugfixed by: Michael White (http://getsprink.com)
    // bugfixed by: Benjamin Lupton
    // bugfixed by: Allan Jensen (http://www.winternet.no)
    // bugfixed by: Howard Yeend
    // bugfixed by: Diogo Resende
    // bugfixed by: Rival
    // bugfixed by: Brett Zamir (http://brett-zamir.me)
    //  revised by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
    //  revised by: Luke Smith (http://lucassmith.name)
    //    input by: Kheang Hok Chin (http://www.distantia.ca/)
    //    input by: Jay Klehr
    //    input by: Amir Habibi (http://www.residence-mixte.com/)
    //    input by: Amirouche
    //   example 1: number_format(1234.56)
    //   returns 1: '1,235'
    //   example 2: number_format(1234.56, 2, ',', ' ')
    //   returns 2: '1 234,56'
    //   example 3: number_format(1234.5678, 2, '.', '')
    //   returns 3: '1234.57'
    //   example 4: number_format(67, 2, ',', '.')
    //   returns 4: '67,00'
    //   example 5: number_format(1000)
    //   returns 5: '1,000'
    //   example 6: number_format(67.311, 2)
    //   returns 6: '67.31'
    //   example 7: number_format(1000.55, 1)
    //   returns 7: '1,000.6'
    //   example 8: number_format(67000, 5, ',', '.')
    //   returns 8: '67.000,00000'
    //   example 9: number_format(0.9, 0)
    //   returns 9: '1'
    //  example 10: number_format('1.20', 2)
    //  returns 10: '1.20'
    //  example 11: number_format('1.20', 4)
    //  returns 11: '1.2000'
    //  example 12: number_format('1.2000', 3)
    //  returns 12: '1.200'
    //  example 13: number_format('1 000,50', 2, '.', ' ')
    //  returns 13: '100 050.00'
    //  example 14: number_format(1e-8, 8, '.', '')
    //  returns 14: '0.00000001'

    number = (number + '').replace(/[^0-9+\-Ee.]/g, '')
    var n = !isFinite(+number) ? 0 : +number
    var prec = !isFinite(+decimals) ? 0 : Math.abs(decimals)
    var sep = (typeof thousandsSep === 'undefined') ? ',' : thousandsSep
    var dec = (typeof decPoint === 'undefined') ? '.' : decPoint
    var s = ''

    var toFixedFix = function(n, prec)
    {
        if (('' + n).indexOf('e') === -1)
        {
            return +(Math.round(n + 'e+' + prec) + 'e-' + prec)
        }
        else
        {
            var arr = ('' + n).split('e')
            var sig = ''
            if (+arr[1] + prec > 0)
            {
                sig = '+'
            }
            return (+(Math.round(+arr[0] + 'e' + sig + (+arr[1] + prec)) + 'e-' + prec)).toFixed(prec)
        }
    }

    // @todo: for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec).toString() : '' + Math.round(n)).split('.')
    if (s[0].length > 3)
    {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep)
    }
    if ((s[1] || '').length < prec)
    {
        s[1] = s[1] || ''
        s[1] += new Array(prec - s[1].length + 1).join('0')
    }

    return s.join(dec)
}

JSHelper.prototype.urlencode = function(str)
{
    //       discuss at: https://locutus.io/php/urlencode/
    //      original by: Philip Peterson
    //      improved by: Kevin van Zonneveld (https://kvz.io)
    //      improved by: Kevin van Zonneveld (https://kvz.io)
    //      improved by: Brett Zamir (https://brett-zamir.me)
    //      improved by: Lars Fischer
    //      improved by: Waldo Malqui Silva (https://fayr.us/waldo/)
    //         input by: AJ
    //         input by: travc
    //         input by: Brett Zamir (https://brett-zamir.me)
    //         input by: Ratheous
    //      bugfixed by: Kevin van Zonneveld (https://kvz.io)
    //      bugfixed by: Kevin van Zonneveld (https://kvz.io)
    //      bugfixed by: Joris
    // reimplemented by: Brett Zamir (https://brett-zamir.me)
    // reimplemented by: Brett Zamir (https://brett-zamir.me)
    //           note 1: This reflects PHP 5.3/6.0+ behavior
    //           note 1: Please be aware that this function
    //           note 1: expects to encode into UTF-8 encoded strings, as found on
    //           note 1: pages served as UTF-8
    //        example 1: urlencode('Kevin van Zonneveld!')
    //        returns 1: 'Kevin+van+Zonneveld%21'
    //        example 2: urlencode('https://kvz.io/')
    //        returns 2: 'https%3A%2F%2Fkvz.io%2F'
    //        example 3: urlencode('https://www.google.nl/search?q=Locutus&ie=utf-8')
    //        returns 3: 'https%3A%2F%2Fwww.google.nl%2Fsearch%3Fq%3DLocutus%26ie%3Dutf-8'

    str = (str + '')

    return encodeURIComponent(str)
        .replace(/!/g, '%21')
        .replace(/'/g, '%27')
        .replace(/\(/g, '%28')
        .replace(/\)/g, '%29')
        .replace(/\*/g, '%2A')
        .replace(/~/g, '%7E')
        .replace(/%20/g, '+')
}

JSHelper.prototype.urldecode = function(str)
{
    //       discuss at: https://locutus.io/php/urldecode/
    //      original by: Philip Peterson
    //      improved by: Kevin van Zonneveld (https://kvz.io)
    //      improved by: Kevin van Zonneveld (https://kvz.io)
    //      improved by: Brett Zamir (https://brett-zamir.me)
    //      improved by: Lars Fischer
    //      improved by: Orlando
    //      improved by: Brett Zamir (https://brett-zamir.me)
    //      improved by: Brett Zamir (https://brett-zamir.me)
    //         input by: AJ
    //         input by: travc
    //         input by: Brett Zamir (https://brett-zamir.me)
    //         input by: Ratheous
    //         input by: e-mike
    //         input by: lovio
    //      bugfixed by: Kevin van Zonneveld (https://kvz.io)
    //      bugfixed by: Rob
    // reimplemented by: Brett Zamir (https://brett-zamir.me)
    //           note 1: info on what encoding functions to use from:
    //           note 1: https://xkr.us/articles/javascript/encode-compare/
    //           note 1: Please be aware that this function expects to decode
    //           note 1: from UTF-8 encoded strings, as found on
    //           note 1: pages served as UTF-8
    //        example 1: urldecode('Kevin+van+Zonneveld%21')
    //        returns 1: 'Kevin van Zonneveld!'
    //        example 2: urldecode('https%3A%2F%2Fkvz.io%2F')
    //        returns 2: 'https://kvz.io/'
    //        example 3: urldecode('https%3A%2F%2Fwww.google.nl%2Fsearch%3Fq%3DLocutus%26ie%3Dutf-8%26oe%3Dutf-8%26aq%3Dt%26rls%3Dcom.ubuntu%3Aen-US%3Aunofficial%26client%3Dfirefox-a')
    //        returns 3: 'https://www.google.nl/search?q=Locutus&ie=utf-8&oe=utf-8&aq=t&rls=com.ubuntu:en-US:unofficial&client=firefox-a'
    //        example 4: urldecode('%E5%A5%BD%3_4')
    //        returns 4: '\u597d%3_4'

    return decodeURIComponent((str + '')
        .replace(/%(?![\da-f]{2})/gi, function()
        {
            // PHP tolerates poorly formed escape sequences
            return '%25'
        })
        .replace(/\+/g, '%20'))
}
