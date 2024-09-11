/**
 * Is dataView obj.
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {boolean}
 */
_.prototype.is_dataview = function(mixed_var)
{
    return this.var_type(mixed_var) === DATAVIEW_TAG;
}