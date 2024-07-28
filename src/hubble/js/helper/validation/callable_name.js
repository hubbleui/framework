/**
 * Returns function / class name
 *
 * @param   {mixed}  mixed_var Variable to evaluate
 * @returns {string}
 */
_.prototype.callable_name = function(mixed_var)
{
    if (this.is_callable(mixed_var))
    {
        return mixed_var.name;
    }
    else if (this.is_object(mixed_var))
    {
        return mixed_var.constructor.name;
    }
}