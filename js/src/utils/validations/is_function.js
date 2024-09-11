/**
 * Is function.
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {boolean}
 */
_.prototype.is_function = function(mixed_var)
{
    return this.var_type(mixed_var) === FUNC_TAG;
}