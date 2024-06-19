/**
 * Extends a function with prototype inheritance.
 *
 * @param   {function}           baseFunc    Base function to extend
 * @param   {function}           extendFunc  Function to get extended.
 * @param   {undefined|boolean}  callSuper   If true "extendFunc" is treated as a constructor and the BaseFunc / any nested prototypes will get instantiated. (default true)
 * @returns {function}
 */
extend(baseFunc, extendFunc, callSuper)
{
    callSuper = this.is_undefined(callSuper) ? true : callSuper;

    const oldConstructor = extendFunc.prototype.constructor;
    const constructors = [...this.__protoConstructors(baseFunc), oldConstructor];
    const newProto = function() {};
    const oldProto = extendFunc.prototype;
    const fncName = extendFunc.name;

    newProto.prototype = oldProto;

    Object.setPrototypeOf(oldProto, baseFunc.prototype);

    Object.setPrototypeOf(extendFunc, newProto);

    if (callSuper)
    {
        extendFunc = function()
        {
            let args = TO_ARR.call(arguments);

            let _this = this;

            this.each(constructors, function(i, constr)
            {
                if (constr.name !== 'Object')
                {
                    this.__bind(constr, _this).apply(_this, args);
                }
            }, this);
        };
    }

    extendFunc.prototype = oldProto;

    this.__applyStatics(constructors, extendFunc);

    extendFunc.prototype.constructor = extendFunc;

    Object.defineProperty(extendFunc, 'name', { value: fncName, writable: false });

    return extendFunc;
}

/**
 * Returns an array of prototype constructors nested inside a function.
 *
 * @private
 * @param   {function}  func  Function to loop
 * @returns {array}
 */
__protoConstructors(func)
{
    let protos = [];
    let proto = func.prototype || Object.getPrototypeOf(func);

    while (proto && proto.constructor)
    {
        // recursive stopper
        if (protos.includes.proto)
        {
            break;
        }

        protos.push(proto.constructor);

        proto = proto.prototype || Object.getPrototypeOf(proto);
    }

    return protos.reverse();
}

/**
 * Apply static properties to extended function.
 *
 * @private
 * @param  {array}     constructors  Array of prototype chain constructors
 * @param  {function}  func          Function to apply props to
 */
__applyStatics(constructors, func)
{
    this.each(constructors, function(i, constructor)
    {
        let props = Object.keys(constructor).filter(key => !PROTO_EXCLUDES.includes(key));

        if (props.length)
        {
            this.each(props, function(i, key)
            {
                let prop = constructor[key];

                if (this.is_function(prop))
                {
                    prop = this.__bind(prop, func);
                }

                func[key] = prop;

            }, this);
        }
    }, this);
}
