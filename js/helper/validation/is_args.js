/**
 * Is args array.
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {boolean}
 */
_.prototype.is_args = function(mixed_var)
{
    return this.var_type(mixed_var) === ARGS_TAG;
}