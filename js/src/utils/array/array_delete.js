/**
 * Deletes from an array/object using dot/bracket notation.
 *
 * @param   {string}        path   Path to delete
 * @param   {object|array}  object Object to delete from
 * @returns {object|array}
 */
_.prototype.array_delete = function(path, object)
{
    this.__array_delete_recursive(this.__array_key_segment(path), object);

    return object;
}