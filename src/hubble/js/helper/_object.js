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


/**
 * Clone an object
 * 
 * @access {public}
 * @param  {object}  src       The object to clone
 * @return {object}
 */
obj_clone(src)
{
    var clone = {};

    for (var prop in src)
    {
        if (src.hasOwnProperty(prop))
        {
            clone[prop] = src[prop];
        }
    }
    return clone;
}

/**
 * Deep merge two objects.
 * 
 * @param   {object} target
 * @param   {object} ...sources
 * @returns {object}
 */
merge_deep()
{
    let args = TO_ARR.call(arguments);

    // No args
    if (args.length === 0)
    {
        throw new Error('Nothing to merge.');
    }
    // Single arg
    else if (args.length === 1)
    {
        return args[1];
    }

    // Must be an object
    if (!this.is_object(args[0]))
    {
        throw new Error('Arguments must be an object.');
    }

    // Remove first and cache
    let first = args.shift();

    this.each(args, function(i, arg)
    {
        if (!this.is_object(arg))
        {
            throw new Error('Arguments must be an object.');
        }

        let cloned = this.clone_deep(arg, first);

        this.each(cloned, function(k, v)
        {
            first[k] = v;
        });
        
    }, this);

    return first;
}

/**
 * Clones any variables
 * 
 * @param   {mixed}  mixed_var
 * @param   {mixed}  context   Context to bind functions
 * @returns {mixed}
 */
clone_deep(mixed_var, context)
{
    let ret = this.__cloneVar(mixed_var, context, false);

    CURR_CLONES = new WeakMap();

    return ret;
}

/**
 * Creates a new object in 'dot.notation'
 * 
 * @param   {Object} obj Object
 * @returns {Object} 
 */
dotify(obj)
{
    var res = {};

    function recurse(obj, current)
    {
        for (var key in obj)
        {
            var value = obj[key];
            var newKey = (current ? current + '.' + key : key); // joined key with dot

            if (value && typeof value === 'object' && !(value instanceof Date))
            {
                recurse(value, newKey); // it's a nested object, so do it again
            }
            else
            {
                res[newKey] = value; // it's not an object, so set the property
            }
        }
    }

    recurse(obj);

    return res;
}

/**
 * Returns an immutable object with set,get,isset,delete methods that accept dot.notation.
 *
 * @returns {object}
 */
obj()
{
    return new __MAP;
}

/**
 * Creates a new object in 'dot.notation'
 * 
 * @param   {Object} obj Object
 * @returns {Object} 
 */
dotify(obj)
{
    var res = {};

    function recurse(obj, current)
    {
        for (var key in obj)
        {
            var value = obj[key];
            var newKey = (current ? current + '.' + key : key); // joined key with dot

            if (value && typeof value === 'object' && !(value instanceof Date))
            {
                recurse(value, newKey); // it's a nested object, so do it again
            }
            else
            {
                res[newKey] = value; // it's not an object, so set the property
            }
        }
    }

    recurse(obj);

    return res;
}

/**
 * Joins an object into a string
 * 
 * @param   {Object} obj       Object
 * @param   {string} seperator Seperator Between key & value
 * @param   {string} glue      Glue between value and next key
 * @returns {string} 
 */
join_obj(obj, seperator, glue, recursive)
{
    seperator = this.is_undefined(seperator) ? '' : seperator;
    glue      = this.is_undefined(glue) ? '' : glue;
    recursive = this.is_undefined(recursive) ? false : recursive;
    
    var ret = '';

    this.each(obj, function(key, val)
    {
        if (this.is_object(val))
        {
            val = recursive ? '{' + this.join_obj(val, seperator, glue, recursive) + '}' : {};
        }
        else if (this.is_array(val))
        {
            val = recursive ? this.join_obj(val, seperator, glue, recursive) : val.join(', ').replaceAll('[object Object]', '{}');
        }
        else
        {            
            val = `${val}`;
        }

        ret += `${glue}${key}${seperator}${val}`;

    }, this);

    if (ret === `${glue}${seperator}`) return '';

    return this.rtrim(this.ltrim(ret, glue), seperator);
}