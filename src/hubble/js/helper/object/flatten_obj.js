/**
 * Returns object properties and methods as array of keys.
 * 
 * @param   {mixed}    mixed_var    Variable to test
 * @param   {boolean}  withMethods  Return methods and props (optional) (default "true")
 * @returns {array}
 */
_.prototype.flatten_obj = function(obj, deep)
{
    deep = typeof deep === 'undefined' ? false : deep;

    var ret = {};

    this.each(obj, (k,v) => ret[k] = v);
   
    if (deep)
    {
        let proto = mixed_var.prototype || Object.getPrototypeOf(mixed_var);

        ret = {...ret, ...this.flatten_obj(proto, true)};
    }
    
    return ret;
}