/**
 * Returns array/object/string/number size.
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {number}
 */
_.prototype.size = function(mixed_var)
{
    if (this.is_string(mixed_var) || this.is_array(mixed_var))
    {
        return mixed_var.length;
    }
    else if (this.is_number(mixed_var))
    {
        return mixed_var;
    }
    else if (this.is_bool(mixed_var))
    {
        return mixed_var === true ? 1 : -1;
    }
    else(this.is_object(mixed_var))
    {
        return Object.keys(mixed_var).length;
    }

    return 1;
}
