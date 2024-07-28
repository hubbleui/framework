/**
 * Is Map.
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {boolean}
 */
_.prototype.is_map = function(mixed_var)
{
    return this.var_type(mixed_var) === MAP_TAG;
}