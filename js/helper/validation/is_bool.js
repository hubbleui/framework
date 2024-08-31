/**
 * Is bool.
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {boolean}
 */
_.prototype.is_bool = function(mixed_var)
{
    return this.var_type(mixed_var) === BOOL_TAG;
}