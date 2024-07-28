/**
 * Gets the `toStringTag` of `value`.
 *
 * @public
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
_.prototype.var_type = function(value)
{
    if (value == null)
    {
        return value === undefined ? '[object Undefined]' : '[object Null]'
    }

    return TO_STR.call(value);
}