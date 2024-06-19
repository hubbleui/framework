/**
 * Set a key using dot/bracket notation on an object or array.
 *
 * @param   {string}       path   Path to set
 * @param   {mixed}        value  Value to set
 * @param   {object|array} object Object to set into
 * @returns {object|array}
 */
array_set(path, value, object)
{
    this.__arraySetRecursive(this.__arrayKeySegment(path), value, object);

    return object;
}