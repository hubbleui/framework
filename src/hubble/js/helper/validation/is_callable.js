/**
 * Is variable a function / constructor.
 *
 * @param   {mixed}  mixed_var  Variable to check
 * @returns {boolean}
 */
_.prototype.is_callable = function(mixed_var)
{
    return this.is_function(mixed_var);
}