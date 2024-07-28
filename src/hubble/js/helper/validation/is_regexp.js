/**
 * Is regexp.
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {boolean}
 */
_.prototype.is_regexp = function(mixed_var)
{
    return this.var_type(mixed_var) === REGEXP_TAG;
}