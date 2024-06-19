/**
 * Is undefined.
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {boolean}
 */
is_undefined(mixed_var)
{
    return this.var_type(mixed_var) === UNDEF_TAG;
}