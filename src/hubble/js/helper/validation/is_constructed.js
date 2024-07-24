/**
 * Checks if variable is constructed object function.
 *
 * @param   {mixed}  mixed_var  Variable to evaluate
 * @returns {boolean}
 */
is_constructed(mixed_var)
{
    if (typeof mixedVar === 'object' && mixedVar.constructor && typeof mixedVar.constructor === 'function')
    {
        var constr = mixedVar.constructor.toString().trim();
        
        if (constr.startsWith('function (') || constr.startsWith('function(') || constr.startsWith('function Object(') || constr.startsWith('class '))
        {
            return constr.toLowerCase().includes('native code') ? this.object_props(mixed_var, true, true).length > 1 : true;
        }
    }

    return false;
}