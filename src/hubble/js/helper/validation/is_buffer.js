/**
 * Is Array buffer.
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {boolean}
 */
_.prototype.is_buffer = function(mixed_var)
{
    return this.var_type(mixed_var) === ARRAY_BUFFER_TAG;
}