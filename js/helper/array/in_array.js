/**
 * Checks if an array contains a value
 *
 * @access {public}
 * @param  {string} needle    The value to search for
 * @param  {array}  haystack  The target array to index
 * @param  {bool}   strict    Strict comparison (optional) (default false)
 * @return {bool}
 * 
 */
_.prototype.in_array = function(needle, haystack, strict)
{
    strict = this.is_undefined(strict) ? false : strict;
    
    if (!strict) return haystack.includes(needle);

    let ret = false;

    this.each(haystack, function(k, v)
    {
        ret = this.is_equal(needle, v, strict);

        if (ret) return false;

    }, this);

    return ret;
}