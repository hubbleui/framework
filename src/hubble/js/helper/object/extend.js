/**
 * Extends a function with prototype inheritance.
 *
 * @param   {function}           superType    Base function to extend
 * @param   {function}           subType  Function to get extended.
 * @param   {undefined|boolean}  callSuper   If true "subType" is treated as a constructor and the superType / any nested prototypes will get instantiated. (default true)
 * @returns {function}
 */
_.prototype.extend = function(baseFunc, extendFunc)
{
    const _this = this;

    function proxySuper(superFn, fn)
    {
        return function()
        {
            var tmp = this.super;
            
            this.super = superFn;
            
            var ret = fn.apply(this, arguments);
            
            this.super = tmp;

            return ret;
        }
    }

    function Class() {}

    Class.extend = function(protoProps)
    {
        var parent = this, _super = parent.prototype, child;

        if (protoProps && protoProps.hasOwnProperty('constructor'))
        {
            child = proxySuper(parent, protoProps.constructor);
            
            delete protoProps.constructor; // remove constructor
        }
        else
        {
            child = function()
            {
                parent.apply(this, arguments);
            };
        }

        var prototype = Object.create(parent.prototype,
        {
            constructor:
            {
                value: child,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });

        for (var name in protoProps)
        {
            prototype[name] = _this.is_function(protoProps[name]) && _this.is_function(_super[name]) && /\bsuper\b/.test(protoProps[name])
            ? proxySuper(_super[name], protoProps[name]) : protoProps[name];
        }

        child.prototype = prototype;
        child.extend = Class.extend;

        return child;
    };


    const baseProto = baseFunc.prototype;

    const extendProto = extendFunc.prototype;

    if (!baseProto.hasOwnProperty('constructor')) baseProto['constructor'] = baseFunc;
   
    if (!extendProto.hasOwnProperty('constructor')) extendProto['constructor'] = extendFunc;
    
    var b = Class.extend(baseProto);

    var e = b.extend(extendProto);

    Object.defineProperty(e, 'name', { value: extendFunc.name, writable: false });

    return e;
}

