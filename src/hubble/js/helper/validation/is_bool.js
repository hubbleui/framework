/**
 * Is bool.
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {boolean}
 */
is_bool(mixed_var)
{
    return this.var_type(mixed_var) === BOOL_TAG;
}