/**
 * Clones any variables
 * 
 * @param   {mixed}  mixed_var
 * @param   {mixed}  context   Context to bind functions
 * @returns {mixed}
 */
_.prototype.clone_deep = function(mixed_var, context)
{
    return this.__clone_var(mixed_var, this.is_undefined(context) ? mixed_var : context);
}

/**
 * Clone's variable with context.
 * 
 * @param   {mixed}  mixed_var  Variable to clone
 * @param   {mixed}  context    Context when cloning recursive objects and arrays.
 * @returns {mixed}
 */
_.prototype.__clone_var = function(mixed_var, context)
{
    let tag = this.var_type(mixed_var);

    switch (tag)
    {
        case OBJECT_TAG:
            return this.__clone_obj(mixed_var, context);

        case ARRAY_TAG:
        case NODELST_TAG:
        case ARGS_TAG:
            return this.__clone_array(mixed_var, context);

        case FUNC_TAG:
            return this.__clone_func(mixed_var, context);

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
            return this.__clone_RegExp(mixed_var, context);

        case SYMBOL_TAG:
            return this.__clone_symbol(mixed_var);

        case DATE_TAG:
            return this.__clone_date(mixed_var);

        case SET_TAG:
            return this.__clone_set(mixed_var, context);

        case MAP_TAG:
            return this.__clone_map(mixed_var, context);

        case ARRAY_BUFFER_TAG:
            return this.__clone_array_buffer(mixed_var);

        case DATAVIEW_TAG:
            return this.__clone_data_view(mixed_var);

        case ARRAY_BUFFER_TAG:
            return this.__clone_buffer(mixed_var);

        case FLOAT32_TAG:
        case FLOAT64_TAG:
        case INT8_TAG:
        case INT16_TAG:
        case INT32_TAG:
        case UINT8_TAG:
        case UINT8CLAMPED_TAG:
        case UINT16_TAG:
        case UINT32_TAG:
            return this.__clone_typed_array(object);

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
_.prototype.__clone_obj = function(obj, context)
{
    // Shallow keys
    let keys = this.object_props(obj);
    let ret  = {};

    // Empty object
    if (keys.length === 0 || this.is_empty(obj))
    {
        return ret;
    }

    this.each(keys, function(i, key)
    {
        ret[key] = this.clone_deep(obj[key], context);

    }, this);

    // Clone prototypes
    let protos = this.prototypes(obj);

    if (protos.length >= 1)
    {
        let curr = ret;

        while(protos.length > 0)
        {
            let proto        = protos.shift();
            let clone        = this.clone_deep(proto, context);
            clone.constrctor = this.clone_deep(proto.constructor, context);
            
            Object.setPrototypeOf(curr, clone);
            
            curr = clone;
        }
    }

    return ret;
}

/**
 * Clones a function
 * 
 * @param   {function}  function
 * @param   {mixed}     context   Context to bind function
 * @returns {function}
 */
_.prototype.__clone_func = function(func, context)
{
    return this.bind(func, context);
}

/**
 * Clones an array
 * 
 * @param   {array}  arr
 * @returns {array}
 */
_.prototype.__clone_array = function(arr, context)
{
    let ret = [];

    this.each(arr, function(i, val)
    {
        ret[i] = this.clone_deep(val, context);
    
    }, this);

    return ret;
}

_.prototype.__clone_date = function(d)
{
    let r = new Date();

    r.setTime(d.getTime());

    return r;
}

_.prototype.__clone_symbol = function(symbol)
{
    return Object(Symbol.prototype.valueOf.call(symbol));
}

_.prototype.__clone_RegExp = function(regexp)
{
    let reFlags = /\w*$/;

    let result = new regexp.constructor(regexp.source, reFlags.exec(regexp));

    result.lastIndex = regexp.lastIndex;

    return result;
}

_.prototype.__clone_map = function(m, context)
{
    const ret = new Map();

    m.this.each((v, k) =>
    {
        ret.set(k, this.clone_deep(v, context));
    
    }, this);

    return ret;
}

_.prototype.__clone_set = function(s, context)
{
    const ret = new Set();

    s.this.each((val, k) =>
    {
        ret.add(k, this.clone_deep(v, context));
    
    }, this);

    return ret;
}

_.prototype.__clone_array_buffer = function(arrayBuffer)
{
    const result = new arrayBuffer.constructor(arrayBuffer.byteLength)

    new Uint8Array(result).set(new Uint8Array(arrayBuffer));

    return result;
}

_.prototype.__clone_data_view = function(dataView)
{
    const buffer = this.__clone_array_buffer(dataView.buffer);

    return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}

/**
 * Creates a clone of `buffer`.
 *
 * @param   {Buffer}   buffer   The buffer to clone.
 * @param   {boolean} [isDeep]  Specify a deep clone.
 * @returns {Buffer}   Returns  the cloned buffer.
 */
_.prototype.__clone_buffer = function(buffer)
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
_.prototype.__clone_typed_array = function(typedArray)
{
    const buffer = this.__clone_array_buffer(typedArray.buffer);

    return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}
