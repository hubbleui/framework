/**
 * Checks if variable is constructed object function.
 *
 * @param   {mixed}  mixed_var  Variable to evaluate
 * @returns {boolean}
 */
_.prototype.is_constructed = function(mixed_var)
{
    if (typeof mixed_var === 'object' && mixed_var.constructor && typeof mixed_var.constructor === 'function')
    {
        var constr = mixed_var.constructor.toString().trim();
        
        return constr.startsWith('function (') || constr.startsWith('function(') || constr.startsWith('function Object(') || constr.startsWith('class ') ;
    }

    return false;
}