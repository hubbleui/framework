/**
 * Returns an array of prototypes
 * 
 * @param   {mixed}    mixed_var    Variable to test
 * @param   {boolean}  withMethods  Return methods and props (optional) (default "true")
 * @returns {array}
 */
_.prototype.prototypes = function(mixed_var)
{
    let ret = [];

    if (!mixed_var) return ret;

    const _this = this;

    const recursive = function(obj)
    {
        let proto = obj.prototype || Object.getPrototypeOf(obj);

        // No prototype
        if (!proto) return;

        // Prototype is native object
        let protokeys = Object.getOwnPropertyNames(proto);

        if (protokeys.filter(x => !EMPTY_OBJ_KEYS.includes(x)).length === 0) return;

        ret.push(proto);

        recursive(proto);
    }

    recursive(mixed_var);

    return ret;
}

