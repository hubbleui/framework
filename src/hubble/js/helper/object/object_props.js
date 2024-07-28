/**
 * Returns object properties and methods as array of keys.
 * 
 * @param   {mixed}    mixed_var    Variable to test
 * @param   {boolean}  withMethods  Return methods and props (optional) (default "true")
 * @returns {array}
 */
_.prototype.object_props = function(mixed_var, deep)
{
    if (!mixed_var) return [];

    deep = typeof deep === 'undefined' ? false : deep;

    let keys = Object.keys(mixed_var);

    let proto = mixed_var.prototype || Object.getPrototypeOf(mixed_var);

    if (deep)
    {
        keys = [...keys, ...this.object_props(proto, true)];
    }
    
    return this.array_unique(keys);
}

