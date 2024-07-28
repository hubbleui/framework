/**
 * Is Symbol.
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {boolean}
 */
_.prototype.is_symbol = function(mixed_var)
{
    return this.var_type(mixed_var) === SYMBOL_TAG;
}