/**
 * Is Set.
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {boolean}
 */
_.prototype.is_set = function(mixed_var)
{
    return this.var_type(mixed_var) === SET_TAG;
}