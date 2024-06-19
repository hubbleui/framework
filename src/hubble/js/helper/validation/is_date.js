/**
 * Is date object.
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {boolean}
 */
is_date(mixed_var)
{
    return this.var_type(mixed_var) === DATE_TAG;
}