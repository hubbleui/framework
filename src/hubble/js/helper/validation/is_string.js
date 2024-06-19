/**
 * Is string.
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {boolean}
 */
is_string(mixed_var)
{
    return this.var_type(mixed_var) === STRING_TAG;
}