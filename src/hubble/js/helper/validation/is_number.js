/**
 * Is number.
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {boolean}
 */
is_number(mixed_var)
{
    return !isNaN(mixed_var) && this.var_type(mixed_var) === NUMBER_TAG;
}