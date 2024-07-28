/**
 * Checks if variable is constructed object function.
 *
 * @param   {mixed}  mixed_var  Variable to evaluate
 * @returns {boolean}
 */
_.prototype.is_constructed = function(mixed_var)
{
    if (typeof mixedVar === 'object' && mixedVar.constructor && typeof mixedVar.constructor === 'function')
    {
        var constr = mixedVar.constructor.toString().trim();
        
        if (constr.startsWith('function (') || constr.startsWith('function(') || constr.startsWith('function Object(') || constr.startsWith('class '))
        {
            return constr.toLowerCase().includes('native code') ? this.object_props(mixed_var, true).length > 0 : true;
        }
    }

    return false;
}