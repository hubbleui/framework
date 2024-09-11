/**
 * Checks if variable should be considered "true" or "false" using "common sense".
 * 
 * @param   {mixed} mixed_var  Variable to test
 * @returns {boolean}
 */
_.prototype.bool = function(mixed_var)
{
    mixed_var = (typeof mixed_var === 'undefined' ? false : mixed_var);

    if (this.is_bool(mixed_var))
    {
        return mixed_var;
    }

    if (this.is_number(mixed_var))
    {
        return mixed_var > 0;
    }

    if (this.is_array(mixed_var))
    {
        return mixed_var.length > 0;
    }

    if (this.is_object(mixed_var))
    {
        return Object.keys(mixed_var).length > 0;
    }

    if (this.is_string(mixed_var))
    {
        mixed_var = mixed_var.toLowerCase().trim();

        if (mixed_var === 'false')
        {
            return false;
        }
        if (mixed_var === 'true')
        {
            return true;
        }
        if (mixed_var === 'on')
        {
            return true;
        }
        if (mixed_var === 'off')
        {
            return false;
        }
        if (mixed_var === 'undefined')
        {
            return false;
        }
        if (this.is_numeric(mixed_var))
        {
            return Number(mixed_var) > 0;
        }
        if (mixed_var === '')
        {
            return false;
        }
    }

    return false;
}
