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
 * Clone's variable with context.
 * 
 * @param   {mixed}  mixed_var  Variable to clone
 * @param   {mixed}  context    Context when cloning recursive objects and arrays.
 * @returns {mixed}
 */
__cloneVar(mixed_var, context, isDeep)
{
    isDeep = this.is_undefined(isDeep) ? true : isDeep;

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
    let keys = this.object_props(obj);
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
    
    }, this);

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
    
    }, this);

    return ret;
}

__cloneSet(s, context)
{
    const ret = new Set();

    s.this.each((val, k) =>
    {
        ret.add(k, this.__cloneVar(v, context));
    
    }, this);

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
