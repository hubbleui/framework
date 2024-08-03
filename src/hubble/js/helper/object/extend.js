/**
 * Extends a function with prototype inheritance.
 *
 * @param   {function}           superType    Base function to extend
 * @param   {function}           subType  Function to get extended.
 * @param   {undefined|boolean}  callSuper   If true "subType" is treated as a constructor and the superType / any nested prototypes will get instantiated. (default true)
 * @returns {function}
 */
_.prototype.extend = function(base, extension)
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

    if (this.var_type(base) !== this.var_type(extension)) throw new Error('Extended variables need to be the same type.');

    if (this.is_object(base)) return this.extend_obj(base, extension);

    const baseProto   = base.prototype;
    const extendProto = extension.prototype;

    if (!baseProto.hasOwnProperty('constructor')) baseProto['constructor'] = base;
   
    if (!extendProto.hasOwnProperty('constructor')) extendProto['constructor'] = extension;
    
    var b = Class.extend(baseProto);

    var e = b.extend(extendProto);

    Object.defineProperty(e, 'name', { value: extension.name, writable: false });

    return e;
}

/**
 * Extends a function with prototype inheritance.
 *
 * @param   {function}           superType    Base function to extend
 * @param   {function}           subType  Function to get extended.
 * @param   {undefined|boolean}  callSuper   If true "subType" is treated as a constructor and the superType / any nested prototypes will get instantiated. (default true)
 * @returns {function}
 */
_.prototype.extend_obj = function(base, extension)
{
    const extProto  = this.prototypes(extension);
    const baseProto = this.prototypes(base);

    // Plain objects
    if (this.is_empty(extProto) && this.is_empty(baseProto)) return {...base, ...extension};

    const newProto = new (function() {});
    
    Object.setPrototypeOf(newProto, base);

    this.each(extProto, (i, proto) =>
    {
        this.each(proto, (k, v) =>
        {
            newProto[k] = v;
        })

    }, this);

    Object.defineProperty(newProto, 'name', { value: 'Class', writable: false });

    Object.setPrototypeOf(extension, newProto);

    return extension;
}

