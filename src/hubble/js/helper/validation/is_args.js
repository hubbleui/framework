/**
 * Is args array.
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {boolean}
 */
is_args(mixed_var)
{
    return this.var_type(mixed_var) === ARGS_TAG;
}