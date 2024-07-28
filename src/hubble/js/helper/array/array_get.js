/**
 * Gets an from an array/object using dot/bracket notation.
 *
 * @param   {string}        path    Path to get
 * @param   {object|array}  object  Object to get from
 * @returns {mixed}
 */
_.prototype.array_get = function(path, object)
{
    return this.__array_get_recursive(this.__array_key_segment(path), object);
}

