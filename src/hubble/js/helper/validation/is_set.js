/**
 * Is Set.
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {boolean}
 */
is_set(mixed_var)
{
    return this.var_type(mixed_var) === SET_TAG;
}