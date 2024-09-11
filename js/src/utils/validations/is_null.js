/**
 * Is null.
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {boolean}
 */
_.prototype.is_null = function(mixed_var)
{
    return this.var_type(mixed_var) === NULL_TAG;
}