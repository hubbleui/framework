/**
 * Is array.
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {boolean}
 */
_.prototype.is_array = function(mixed_var, strict)
{
    strict = typeof strict === 'undefined' ? false : strict;

    let type = this.var_type(mixed_var);

    return !strict ? ARRAYISH_TAGS.includes(type) : type === ARRAY_TAG;
}