/**
 * Set a key using dot/bracket notation on an object or array.
 *
 * @param   {string}       path   Path to set
 * @param   {mixed}        value  Value to set
 * @param   {object|array} object Object to set into
 * @returns {object|array}
 */
_.prototype.array_set = function(path, value, object)
{
    this.__array_set_recursive(this.__array_key_segment(path), value, object);

    return object;
}