/**
 * Checks if variable is a class declaration or extends a class and/or constructable function.
 *
 * @param   {mixed}                        mixed_var  Variable to evaluate
 * @oaram   {string} | undefined | boolean} classname  Classname or strict if boolean provided
 * @param   {boolean}                      strict     If "true" only returns true on ES6 classes (default "false")
 * @returns {boolean}
 */
_.prototype.is_class = function(mixed_var, classname, strict)
{
    // this.is_class(foo, true)
    if (classname === true || classname === false)
    {
        strict = classname;
        classname = null;
    }
    // this.is_class(foo, 'Bar') || this.is_class(foo, 'Bar', false)
    else
    {
        strict = typeof strict === 'undefined' ? false : strict;
    }

    if (typeof mixed_var !== 'function' || !this.is_constructable(mixed_var))
    {
        return false;
    }

    let isES6 = /^\s*class\s+\w+/.test(mixed_var.toString());

    if (classname)
    {
        if (!isES6 && strict)
        {
            return false;
        }

        if (mixed_var.name === classname || mixed_var.prototype.constructor.name === classname)
        {
            return true;
        }

        let protos = [];
        let proto = mixed_var.prototype || Object.getPrototypeOf(mixed_var);
        let ret = false;

        while (proto && proto.constructor)
        {
            // recursive stopper
            if (protos.includes.proto)
            {
                break;
            }

            protos.push(proto);

            if (proto.constructor.name === classname)
            {
                ret = true;

                break;
            }

            proto = proto.prototype || Object.getPrototypeOf(proto);
        }

        return ret;
    }

    // ES6 class declaration depending on strict

    return strict ? isES6 : this.is_constructable(mixed_var);
}