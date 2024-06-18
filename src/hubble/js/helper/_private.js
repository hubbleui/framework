

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
 * Recursively delete from array/object.
 *
 * @param   {array}        keys    Keys in search order
 * @param   {object|array} object  Object to get from
 * @returns {mixed}
 */
__arrayDeleteRecursive(keys, object)
{
    var key = keys.shift();

    var islast = keys.length === 0;

    if (islast)
    {
        if (TO_STR.call(object) === '[object Array]')
        {
            object.splice(key, 1);
        }
        else
        {
            delete object[key];
        }
    }

    if (!object[key])
    {
        return false;
    }

    return this.__arrayDeleteRecursive(keys, object[key]);
}

/**
 * Recursively search from array/object.
 *
 * @param   {array}        keys    Keys in search order
 * @param   {object|array} object  Object to get from
 * @returns {mixed}
 */
__arrayGetRecursive(keys, object)
{
    var key = keys.shift();
    var islast = keys.length === 0;

    if (islast)
    {
        return object[key];
    }

    if (!object[key])
    {
        return undefined;
    }

    return this.__arrayGetRecursive(keys, object[key]);
}

/**
 * Recursively set array/object.
 *
 * @param {array}          keys     Keys in search order
 * @param {mixed}          value    Value to set
 * @param {object|array}   object   Object to get from
 * @param {string|number}  nextKey  Next key to set
 */
__arraySetRecursive(keys, value, object, nextKey)
{
    var key = keys.shift();
    var islast = keys.length === 0;
    var lastObj = object;
    object = !nextKey ? object : object[nextKey];

    // Trying to set a value on nested array that doesn't exist
    if (!['object', 'function'].includes(typeof object))
    {
        throw new Error('Invalid dot notation. Cannot set key "' + key + '" on "' + JSON.stringify(lastObj) + '[' + nextKey + ']"');
    }

    if (!object[key])
    {
        // Trying to put object key into an array
        if (TO_STR.call(object) === '[object Array]' && typeof key === 'string')
        {
            var converted = Object.assign({}, object);

            lastObj[nextKey] = converted;

            object = converted;
        }

        if (keys[0] && typeof keys[0] === 'string')
        {
            object[key] = {};
        }
        else
        {
            object[key] = [];
        }
    }

    if (islast)
    {
        object[key] = value;

        return;
    }

    this.__arraySetRecursive(keys, value, object, key);
}

/**
 * Segments an array/object path using from "dot.notation" into an array of keys in order.
 *
 * @param   {string}  path Path to parse
 * @returns {array}
 */
__arrayKeySegment(path)
{
    var result = [];
    var segments = path.split('.');

    for (var i = 0; i < segments.length; i++)
    {
        var segment = segments[i];

        if (!segment.includes('['))
        {
            result.push(segment);

            continue;
        }

        var subSegments = segment.split('[');

        for (var j = 0; j < subSegments.length; j++)
        {
            if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(subSegments[j][0]))
            {
                result.push(parseInt(subSegments[j].replace(']')));
            }
            else if (subSegments[j] !== '')
            {
                result.push(subSegments[j])
            }
        }
    }

    return result;
}

/**
 * Checks if traversable's are equal
 * 
 * @param   {array} | object}  a
 * @param   {array} | object}  b
 * @returns {boolean}
 */
__equalTraverseable(a, b)
{
    if (size(a) !== size(b))
    {
        return false;
    }

    let ret = true;

    this.each(a, function(i, val)
    {
        if (!this.is_equal(val, b[i]))
        {
            ret = false;

            return false;
        }
    }, this);

    return ret;
}

/**
 * Binds a function so that it can be identified.
 * 
 * @param   {function}  b
 * @returns {boolean}
 */
__bind(func, context)
{
    context = typeof context === 'undefined' ? window : context;

    const bound = func.bind(context);

    bound.__isBound = true;

    bound.__boundContext = context;

    bound.__origional = func;

    return bound;
}

/**
 * Checks if two functions are equal
 * 
 * @param   {function}  a
 * @param   {function}  b
 * @returns {boolean}
 */
___equalFunction(a, b)
{
    // They're not technically equal
    if (a !== b)
    {
        // Functions have the same name
        if (a.name === b.name)
        {
            // If the functions were bound or cloned by the library they can technically still be equal
            if ( a.name.includes('bound '))
            {
                return a.this.__isBound === b.this.__isBound && a.this.__boundContext === b.this.__boundContext && a.this.__origional === b.this.__origional;
            }

            // Native arrow functions
            if (!a.prototype || !a.prototype.constructor)
            {
                return false;
            }

            // Check the prototypes
            let aProps = object_props(a.prototype);
            let bProps = object_props(b.prototype);

            if (aProps.length === 0 && bProps.length === 0) return true;

            let ret = true;

            this.each(aProps, function(i, key)
            {                
                if (!this.is_equal(a.prototype[key], b.prototype[key]))
                {
                    ret = false;

                    return false;
                }
            }, this);

            return ret;
        }

        return false;
    }

    return true;
}

/**
 * Clone's variable with context.
 * 
 * @param   {mixed}  mixed_var  Variable to clone
 * @param   {mixed}  context    Context when cloning recursive objects and arrays.
 * @returns {mixed}
 */
__cloneVar(mixed_var, context, isDeep)
{
    isDeep = is_undefined(isDeep) ? true : isDeep;

    let tag = this.var_type(mixed_var);

    switch (tag)
    {
        case OBJECT_TAG:
            return this.__cloneObj(mixed_var, context, isDeep);

        case ARRAY_TAG:
        case NODELST_TAG:
        case ARGS_TAG:
            return this.__cloneArray(mixed_var, context, isDeep);

        case FUNC_TAG:
            return this.__cloneFunc(mixed_var, context);

        case NULL_TAG:
            return null;

        case UNDEF_TAG:
            return;

        case BOOL_TAG:
            return mixed_var === true ? true : false;

        case STRING_TAG:
            return mixed_var.slice();

        case NUMBER_TAG:
            let n = mixed_var;
            return n;

        case REGEXP_TAG:
            return this.__cloneRegExp(mixed_var, context);

        case SYMBOL_TAG:
            return this.__cloneSymbol(mixed_var);

        case DATE_TAG:
            return this.__cloneDate(mixed_var);

        case SET_TAG:
            return this.__cloneSet(mixed_var, context);

        case MAP_TAG:
            return this.__cloneMap(mixed_var, context);

        case ARRAY_BUFFER_TAG:
            return this.__cloneArrayBuffer(mixed_var);

        case DATAVIEW_TAG:
            return this.__cloneDataView(mixed_var);

        case ARRAY_BUFFER_TAG:
            return this.__cloneBuffer(mixed_var);

        case FLOAT32_TAG:
        case FLOAT64_TAG:
        case INT8_TAG:
        case INT16_TAG:
        case INT32_TAG:
        case UINT8_TAG:
        case UINT8CLAMPED_TAG:
        case UINT16_TAG:
        case UINT32_TAG:
            return this.__cloneTypedArray(object);

        case ERROR_TAG:
        case WEAKMAP_TAG:
            return {};
    }

    return mixed_var;
}

/**
 * Clones an object
 * 
 * @param   {object}  obj
 * @returns {object}
 */
__cloneObj(obj, context, isDeep)
{
    // Handle date objects
    if (obj instanceof Date)
    {
        let r = new Date();

        r.setTime(obj.getTime());

        return r;
    }

    // Loop keys and functions
    let keys = object_props(obj);
    let ret = {};

    if (keys.length === 0)
    {
        return ret;
    }

    if (CURR_CLONES.has(obj))
    {
        return CURR_CLONES.get(obj);
    }

    CURR_CLONES.set(obj, ret);

    this.each(keys, function(i, key)
    {
        ret[key] = this.__cloneVar(obj[key], typeof context === 'undefined' ? ret : context);
    }, this);

    return ret;
}

/**
 * Clones a function
 * 
 * @param   {function}  function
 * @param   {mixed}     context   Context to bind function
 * @returns {function}
 */
__cloneFunc(func, context)
{
    return this.__bind(func, context);
}

/**
 * Clones an array
 * 
 * @param   {array}  arr
 * @returns {array}
 */
__cloneArray(arr, context)
{
    let ret = [];

    let cacheKey = { array: arr };

    if (CURR_CLONES.has(cacheKey))
    {
        return CURR_CLONES.get(cacheKey);
    }

    CURR_CLONES.set(cacheKey, ret);

    this.each(arr, function(i, val)
    {
        ret[i] = this.__cloneVar(val, context);
    });

    return ret;
}

__cloneDate(d)
{
    let r = new Date();

    r.setTime(d.getTime());

    return r;
}

__cloneSymbol(symbol)
{
    return Object(Symbol.prototype.valueOf.call(symbol));
}

__cloneRegExp(regexp)
{
    let reFlags = /\w*$/;

    let result = new regexp.constructor(regexp.source, reFlags.exec(regexp));

    result.lastIndex = regexp.lastIndex;

    return result;
}

__cloneMap(m, context)
{
    const ret = new Map();

    m.this.each((v, k) =>
    {
        ret.set(k, this.__cloneVar(v, context));
    });

    return ret;
}

__cloneSet(s, context)
{
    const ret = new Set();

    s.this.each((val, k) =>
    {
        ret.add(k, this.__cloneVar(v, context));
    });

    return ret;
}

__cloneArrayBuffer(arrayBuffer)
{
    const result = new arrayBuffer.constructor(arrayBuffer.byteLength)

    new Uint8Array(result).set(new Uint8Array(arrayBuffer));

    return result;
}

__cloneDataView(dataView)
{
    const buffer = this.__cloneArrayBuffer(dataView.buffer);

    return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}

/**
 * Creates a clone of `buffer`.
 *
 * @param   {Buffer}   buffer   The buffer to clone.
 * @param   {boolean} [isDeep]  Specify a deep clone.
 * @returns {Buffer}   Returns  the cloned buffer.
 */
__cloneBuffer(buffer)
{
    const length = buffer.length;

    const result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

    buffer.copy(result);

    return result;
}

/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */
__cloneTypedArray(typedArray)
{
    const buffer = this.__cloneArrayBuffer(typedArray.buffer);

    return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

/**
 * Removes all registered event listners on an element
 *
 * @access {private}
 * @param  {node}    element Target node element
 */
__removeElementListeners(element)
{
    var events = this._events;
    for (var eventName in events)
    {
        var eventObj = events[eventName];
        var i = eventObj.length;
        while (i--)
        {
            if (eventObj[i]['element'] === element)
            {
                this.__removeListener(eventObj[i]['element'], eventName, eventObj[i]['handler'], eventObj[i]['useCapture']);
                this._events[eventName].splice(i, 1);
            }
        }
    }
}

/**
 * Removes all registered event listners of a specific type on an element
 *
 * @access {private}
 * @param  {node}    element Target node element
 * @param  {string}  type    Event listener type
 */
__removeElementTypeListeners(element, type)
{
    var eventObj = this._events[type];
    var i = eventObj.length;
    while (i--)
    {
        if (eventObj[i]['element'] === element)
        {
            this.__removeListener(eventObj[i]['element'], type, eventObj[i]['handler'], eventObj[i]['useCapture']);

            this._events[type].splice(i, 1);
        }
    }
}

/**
 * Adds a listener to the element
 *
 * @access {private}
 * @param  {node}    element    The target DOM node
 * @param  {string}  eventName  Event type
 * @param  {closure} handler    Callback event
 * @param  {bool}    useCapture Use capture (optional) (defaul false)
 */
__addListener(el, eventName, handler, useCapture)
{
    if (el.addEventListener)
    {
        el.addEventListener(eventName, handler, useCapture);
    }
    else
    {
        el.attachEvent('on' + eventName, handler, useCapture);
    }
}

/**
 * Removes a listener from the element
 *
 * @access {private}
 * @param  {node}    element    The target DOM node
 * @param  {string}  eventName  Event type
 * @param  {closure} handler    Callback event
 * @param  {bool}    useCapture Use capture (optional) (defaul false)
 */
__removeListener(el, eventName, handler, useCapture)
{
    if (el.removeEventListener)
    {
        el.removeEventListener(eventName, handler, useCapture);
    }
    else
    {
        el.detachEvent('on' + eventName, handler, useCapture);
    }
}
