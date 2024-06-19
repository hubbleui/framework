/**
 * Is regexp.
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {boolean}
 */
is_regexp(mixed_var)
{
    return this.var_type(mixed_var) === REGEXP_TAG;
}