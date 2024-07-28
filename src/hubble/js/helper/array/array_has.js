/**
 * Checks if array/object contains path using dot/bracket notation.
 *
 * e.g array_has('foo.bar.baz[0]', obj)
 * 
 * @param   {string}        path   Path to check
 * @param   {object|array}  object Object to check on
 * @returns {boolean}
 */
_.prototype.array_has = function(path, object)
{
    return !this.is_undefined(this.array_get(path, object));
}