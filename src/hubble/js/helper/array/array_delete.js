/**
 * Deletes from an array/object using dot/bracket notation.
 *
 * @param   {string}        path   Path to delete
 * @param   {object|array}  object Object to delete from
 * @returns {object|array}
 */
array_delete(path, object)
{
    this.__arrayDeleteRecursive(this.__arrayKeySegment(path), object);

    return object;
}