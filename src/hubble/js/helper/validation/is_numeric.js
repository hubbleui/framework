/**
 * Is string.
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {boolean}
 */
is_numeric(mixed_var)
{
    if (this.is_number(mixed_var))
    {
        return true;
    }
    else if (this.is_string(mixed_var))
    {
        return /^-?\d+$/.test(mixed_var.trim());
    }

    return false;
}