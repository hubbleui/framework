/**
 * Is empty
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {boolean}
 */
_.prototype.is_empty = function(mixed_var)
{
    if (mixed_var === false || mixed_var === null || (typeof mixed_var === 'undefined'))
    {
        return true;
    }
    else if (this.is_array(mixed_var))
    {
        return mixed_var.length === null || mixed_var.length <= 0;
    }
    else if (this.is_object(mixed_var))
    {
        if (Object.keys(mixed_var).length > 0) return false;

        if (this.prototypes(mixed_var).length > 0) return false;

        return true;
    }
    else if (this.is_string(mixed_var))
    {
        return mixed_var.trim() === '';
    }
    else if (this.is_number(mixed_var))
    {
        return isNaN(mixed_var);
    }
    else if (this.is_function(mixed_var))
    {
        return false;
    }

    return false;
}