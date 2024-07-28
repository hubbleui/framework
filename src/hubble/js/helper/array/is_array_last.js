/**
 * Checks if element is last element in array or object.
 *
 * @access {public}
 * @param  {string} needle    The value to search for
 * @param  {array}  haystack  The target array to index
 * @param  {bool}   strict    Strict comparison (optional) (default false)
 * @return {bool}
 * 
 */
_.prototype.is_array_last = function(needle, haystack, strict)
{
    strict = this.is_undefined(strict) ? false : strict;

    let last = TO_STR.call(haystack) === '[object Array]' ? haystack[haystack.length -1] : haystack[Object.keys(haystack).pop()];
    
    return this.is_equal(needle, last, strict);
}