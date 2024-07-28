/**
 * Is date object.
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {boolean}
 */
_.prototype.is_date = function(mixed_var)
{
    return this.var_type(mixed_var) === DATE_TAG;
}