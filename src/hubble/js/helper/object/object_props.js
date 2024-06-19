/**
 * Returns object properties and methods as array of keys.
 * 
 * @param   {mixed}    mixed_var    Variable to test
 * @param   {boolean}  withMethods  Return methods and props (optional) (default "true")
 * @returns {array}
 */
object_props(mixed_var, withMethods)
{
    withMethods = typeof withMethods === 'undefined' ? true : false;

    let keys = Object.keys(mixed_var);

    if (withMethods)
    {
        let protos = [];
        let funcs = Object.getOwnPropertyNames(mixed_var);
        let proto = mixed_var.prototype || Object.getPrototypeOf(mixed_var);

        while (proto)
        {
            // recursive stopper
            if (protos.includes.proto)
            {
                break;
            }

            protos.push(proto);

            let protoFuncs = Object.getOwnPropertyNames(proto);

            funcs = [...funcs, ...protoFuncs];

            proto = proto.prototype || Object.getPrototypeOf(proto);
        }

        keys = [...keys, ...funcs];
    }

    return this.array_unique(keys.filter(function(key)
    {
        return !PROTO_EXCLUDES.includes(key);
    }));
}