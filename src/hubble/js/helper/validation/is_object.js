/**
 * Checks if variable is an object.
 *
 * @param   {mixed}  mixed_var Variable to evaluate
 * @returns {boolean}
 */
is_object(mixed_var)
{
    return mixed_var !== null && this.var_type(mixed_var) === OBJECT_TAG;
}