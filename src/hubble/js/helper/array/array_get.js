/**
 * Gets an from an array/object using dot/bracket notation.
 *
 * @param   {string}        path    Path to get
 * @param   {object|array}  object  Object to get from
 * @returns {mixed}
 */
array_get(path, object)
{
    return this.__arrayGetRecursive(this.__arrayKeySegment(path), object);
}

