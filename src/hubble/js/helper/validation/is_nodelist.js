/**
 * Is nodelist.
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {boolean}
 */
_.prototype.is_nodelist = function(mixed_var)
{
    return this.var_type(mixed_var) === NODELST_TAG;
}