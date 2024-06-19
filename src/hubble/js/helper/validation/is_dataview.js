/**
 * Is dataView obj.
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {boolean}
 */
is_dataview(mixed_var)
{
    return this.var_type(mixed_var) === DATAVIEW_TAG;
}