/**
 * Miscellaneous helper functions
 *
 * @author    Joe J. Howard
 * @copyright Joe J. Howard
 * @license   https://github.com/kanso-cms/cms/blob/master/LICENSE
 */

/**
 * Is numeric? 
 *
 * @access public
 * @param  mixed  mixed_var Variable to check
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
 * Is callable ?
 *
 * @access public
 * @param  mixed  mixed_var Variable to check
 * @return bool
 */
JSHelper.prototype.isCallable = function(obj)
{
    return Object.prototype.toString.call(obj) === '[object Function]';
}

/**
 * Count
 *
 * @access public
 * @param  mixed  mixed_var Variable to count
 * @param  string mode      Variable count mode
 * @return int
 */
JSHelper.prototype.count = function(mixed_var, mode)
{
    var key, cnt = 0;
    if (mixed_var === null || typeof mixed_var === 'undefined')
    {
        return 0;
    }
    else if (mixed_var.constructor !== Array && mixed_var.constructor !== Object)
    {
        return 1;
    }

    if (mode === 'COUNT_RECURSIVE')
    {
        mode = 1;
    }
    if (mode != 1)
    {
        mode = 0;
    }

    for (key in mixed_var)
    {
        if (mixed_var.hasOwnProperty(key))
        {
            cnt++;
            if (mode == 1 && mixed_var[key] && (mixed_var[key].constructor === Array || mixed_var[key].constructor ===
                    Object))
            {
                cnt += this.count(mixed_var[key], 1);
            }
        }
    }

    return cnt;
}

/**
 * Convert to boolean
 *
 * @access public
 * @param  mixed  value Variable to evaluate
 * @return bool
 */
JSHelper.prototype.bool = function(value)
{

    value = (typeof value === 'undefined' ? false : value);

    if (typeof value === 'boolean') return value;

    if (typeof value === 'number') return value > 0;

    if (typeof value === 'string')
    {
        if (value.toLowerCase() === 'false') return false;
        if (value.toLowerCase() === 'true') return true;
        if (value.toLowerCase() === 'on') return true;
        if (value.toLowerCase() === 'off') return false;
        if (value.toLowerCase() === 'undefined') return false;
        if (this.is_numeric(value)) return Number(value) > 0;
        if (value === '') return false;
    }

    return false;
}

/**
 * Convert to integer
 *
 * @access public
 * @param  mixed  mixed_var Variable to evaluate
 * @return int
 */
JSHelper.prototype.intval = function(mixed_var, base)
{
    //  discuss at: http://phpjs.org/functions/intval/
    // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // improved by: stensi
    // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // bugfixed by: Brett Zamir (http://brett-zamir.me)
    // bugfixed by: Rafał Kukawski (http://kukawski.pl)
    //    input by: Matteo
    //   example 1: intval('Kevin van Zonneveld');
    //   returns 1: 0
    //   example 2: intval(4.2);
    //   returns 2: 4
    //   example 3: intval(42, 8);
    //   returns 3: 42
    //   example 4: intval('09');
    //   returns 4: 9
    //   example 5: intval('1e', 16);
    //   returns 5: 30

    var tmp;

    var type = typeof mixed_var;

    if (type === 'boolean')
    {
        return +mixed_var;
    }
    else if (type === 'string')
    {
        tmp = parseInt(mixed_var, base || 10);
        return (isNaN(tmp) || !isFinite(tmp)) ? 0 : tmp;
    }
    else if (type === 'number' && isFinite(mixed_var))
    {
        return mixed_var | 0;
    }
    else
    {
        return 0;
    }
}

/**
 * Convert to f,oat
 *
 * @access public
 * @param  mixed  mixed_var Variable to evaluate
 * @return float
 */
JSHelper.prototype.floatval = function(mixedVar)
{
    return (parseFloat(mixedVar) || 0)
}

/**
 * Checks if variable is set
 *
 * @access public
 * @param  mixed  mixed_var Variable to evaluate
 * @return bool
 */
JSHelper.prototype.isset = function()
{
    //  discuss at: http://phpjs.org/functions/isset/
    // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // improved by: FremyCompany
    // improved by: Onno Marsman
    // improved by: Rafał Kukawski
    //   example 1: isset( undefined, true);
    //   returns 1: false
    //   example 2: isset( 'Kevin van Zonneveld' );
    //   returns 2: true

    var a = arguments,
        l = a.length,
        i = 0,
        undef;

    if (l === 0)
    {
        throw new Error('Empty isset');
    }

    while (i !== l)
    {
        if (a[i] === undef || a[i] === null)
        {
            return false;
        }
        i++;
    }
    return true;
}

/**
 * Checks if variable is empty
 *
 * @access public
 * @param  mixed  value Variable to evaluate
 * @return bool
 */
JSHelper.prototype.empty = function(value)
{

    value = (typeof value === 'undefined' ? false : value);

    if (typeof value === 'boolean') return value !== true;

    if (typeof value === 'number') return value < 1;

    if (typeof value === 'string')
    {
        if (value.toLowerCase() === 'undefined') return true;
        if (this.is_numeric(value)) return Number(value) < 1;
        if (value === '') return true;
        if (value !== '') return false;
    }

    if (Object.prototype.toString.call(value) === '[object Array]') return value.length < 1;

    if (Object.prototype.toString.call(value) === '[object Object]') return (Object.getOwnPropertyNames(value).length === 0);

    return false;

}

/**
 * Checks if variable is an object
 *
 * @access public
 * @param  mixed  mixed_var Variable to evaluate
 * @return bool
 */
JSHelper.prototype.is_object = function(mixed_var)
{
    //  discuss at: http://phpjs.org/functions/is_object/
    // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // improved by: Legaev Andrey
    // improved by: Michael White (http://getsprink.com)
    //   example 1: is_object('23');
    //   returns 1: false
    //   example 2: is_object({foo: 'bar'});
    //   returns 2: true
    //   example 3: is_object(null);
    //   returns 3: false

    if (Object.prototype.toString.call(mixed_var) === '[object Array]')
    {
        return false;
    }
    return mixed_var !== null && typeof mixed_var === 'object';
}

/**
 * Checks if variable is a nodelist-array
 *
 * @access public
 * @param  mixed  nodes Variable to evaluate
 * @return bool
 */
JSHelper.prototype.isNodeList = function(nodes)
{
    return nodes == '[object NodeList]';
}

/**
 * Gets url query
 *
 * @access public
 * @param  string  name String query to get (optional)
 * @return object|string
 */
JSHelper.prototype.url_query = function(name)
{
    var results = {};

    if (window.location.search !== '')
    {
        var params = window.location.search.substring(1).split('&');

        for (var i = 0; i < params.length; i++)
        {
            if (!params[i].includes('='))
            {
                continue;
            }

            var split = params[i].split('=');

            results[decodeURIComponent(split[0])] = decodeURIComponent(split[1]);
        }
    }

    // No param return all url query
    if (typeof name === 'undefined')
    {
        return results;
    }

    name = decodeURIComponent(name);

    if (name in results)
    {
        return results[name];
    }

    return false;
}