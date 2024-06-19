/**
 * Is null.
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {boolean}
 */
is_null(mixed_var)
{
    return this.var_type(mixed_var) === NULL_TAG;
}