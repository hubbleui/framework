/**
 * Array utility functions
 *
 * @author    {Joe J. Howard}
 * @copyright {Joe J. Howard}
 * @license   {https://github.com/kanso-cms/cms/blob/master/LICENSE}
 */

/**
 * Map.
 *  
 * return undefined to break loop, true to keep, false to reject
 * 
 * @param   {array|object}  obj
 * @param   {function}      callback
 * @param   {array|mixed}   args      If single arg provided gets apllied as this to callback, otherwise args apllied to callback
 * @returns {array|object}
 */
map(obj, callback)
{
    if (typeof obj !== 'object' || obj === null) return;

    let isArray = TO_STR.call(obj) === '[object Array]';
    let i       = 0;
    let keys    = isArray ? null : Object.keys(obj);
    let len     = isArray ? obj.length : keys.length;
    let args    = TO_ARR.call(arguments).slice(2);
    let ret     = isArray ? [] : {};
    let key;
    let val;
    let clbkVal;

    // Applies the value of "this" to the callback as the array or object provided
    //var thisArg = typeof args !== 'undefined' && TO_STR.call(args) !== '[object Array]' ? args : obj;

    // Applies this arg as first extra arg if provided
    // otherwise falls back to the array or object provided
    // Removes "this" from args to callback
    var thisArg = this.is_empty(args) ? obj : args[0];
    args        = !this.is_empty(args) ? args.slice(1) : null;
    args        = this.is_empty(args) ? null : args;

    if (TO_STR.call(args) === '[object Array]')
    {
        for (; i < len; i++)
        {
            key   = isArray ? i : keys[i];
            val   = isArray ? obj[i] : obj[key];
            clbkVal = callback.apply(thisArg, this.array_merge([key, val], args));

            if (clbkVal === false)
            {
                continue;
            }
            else if (typeof clbkVal === 'undefined')
            {
                break;
            }
            else
            {
                isArray ? ret.push(clbkVal) : ret[key] = clbkVal;
            }
        }

        // A special, fast, case for the most common use of each (no extra args provided)
    }
    else
    {
        for (; i < len; i++)
        {
            key   = isArray ? i : keys[i];
            val   = isArray ? obj[i] : obj[key];
            clbkVal = callback.call(thisArg, key, val);

            if (clbkVal === false)
            {
                continue;
            }
            else if (typeof clbkVal === 'undefined')
            {
                break;
            }
            else
            {
                isArray ? ret.push(clbkVal) : ret[key] = clbkVal;
            }
        }
    }

    return ret;
}


/**
 * Foreach loop
 * 
 * @access {public}
 * @param  {object}  obj       The target object to loop over
 * @param  {closure} callback  Callback to apply to each iteration
 * @param  {array}   args      Array of params to apply to callback (optional) (default null)
 */
foreach(obj, callback)
{
    if (typeof obj !== 'object' || obj === null) return;

    let isArray = TO_STR.call(obj) === '[object Array]';
    let i       = 0;
    let keys    = isArray ? null : Object.keys(obj);
    let len     = isArray ? obj.length : keys.length;
    let args    = TO_ARR.call(arguments).slice(2);
    let ret     = isArray ? [] : {};
    let key;
    let val;
    let clbkVal;

    // Applies the value of "this" to the callback as the array or object provided
    //var thisArg = typeof args !== 'undefined' && TO_STR.call(args) !== '[object Array]' ? args : obj;

    // Applies this arg as first extra arg if provided
    // otherwise falls back to the array or object provided
    // Removes "this" from args to callback
    var thisArg = this.is_empty(args) ? obj : args[0];
    args        = !this.is_empty(args) ? args.slice(1) : null;
    args        = this.is_empty(args) ? null : args;

    if (TO_STR.call(args) === '[object Array]')
    {
        for (; i < len; i++)
        {
            key   = isArray ? i : keys[i];
            val   = isArray ? obj[i] : obj[key];
            clbkVal = callback.apply(thisArg, this.array_merge([key, val], args));

            if (clbkVal === false)
            {
                break;
            }
        }

        // A special, fast, case for the most common use of each (no extra args provided)
    }
    else
    {
        for (; i < len; i++)
        {
            key   = isArray ? i : keys[i];
            val   = isArray ? obj[i] : obj[key];
            clbkVal = callback.call(thisArg, key, val);

            if (clbkVal === false)
            {
                break;
            }
        }
    }

    return obj;
}

each()
{
    return this.foreach.apply(this, arguments);
}

/**
 * Merge multiple arrays together
 * 
 * @access {public}
 * @param  {...}   List of arrays to merge
 * @return {array}
 */
/**
 * Merges multiple objects or arrays into the original.
 *
 * @param   {object|array} First array then any number of array or objects to merge into
 * @returns {object|array}
 */
array_merge()
{
    let args = TO_ARR.call(arguments);

    if (args.length === 0)
    {
        throw new Error('Nothing to merge.');
    }
    else if (args.length === 1)
    {
        return args[1];
    }

    var clone = false;

    // Clone deep
    this.each(args, function(i, arg)
    {
        if (arg = 'CLONE_FLAG_TRUE')
        {
            clone = true;

            return false;
        }
    });

    let first = args.shift();
    let fType = this.is_array(first) ? 'array' : 'obj';

    this.each(args, function(i, arg)
    {
        if (!this.is_array(arg) && !this.is_object(arg))
        {
            throw new Error('Arguments must be an array or object.');
        }

        first = fType === 'array' ? [...first, ...arg] : {...first, ...arg};

    }, this);

    return first;
}

/**
 * Filters empty array entries and returns new array
 *
 * @param   {object|array}  object Object to delete from
 * @returns {object|array}
 */
array_filter(arr)
{
    let isArr = this.is_array(arr);

    let ret = isArr ? [] : {};

    this.foreach(arr, function(i, val)
    {
        if (!this.is_empty(val))
        {
            isArr ? ret.push(val) : ret[i] = val;
        }
    });

    return ret;
}

/**
 * Removes duplicates and returns new array.
 *
 * @param   {array} arr Array to run
 * @returns {array}
 */
array_unique(arr)
{
    let uniq = function(value, index, self)
    {
        return self.indexOf(value) === index;
    }

    return arr.filter(uniq);
}

/**
 * Set a key using dot/bracket notation on an object or array.
 *
 * @param   {string}       path   Path to set
 * @param   {mixed}        value  Value to set
 * @param   {object|array} object Object to set into
 * @returns {object|array}
 */
array_set(path, value, object)
{
    this.__arraySetRecursive(this.__arrayKeySegment(path), value, object);

    return object;
}

/**
 * Gets an from an array/object using dot/bracket notation.
 *
 * @param   {string}        path    Path to get
 * @param   {object|array}  object  Object to get from
 * @returns {mixed}
 */
array_get(path, object)
{
    return this.__arrayGetRecursive(this.__arrayKeySegment(path), object);
}

/**
 * Checks if array/object contains path using dot/bracket notation.
 *
 * @param   {string}        path   Path to check
 * @param   {object|array}  object Object to check on
 * @returns {boolean}
 */
array_has(path, object)
{
    return !this.is_undefined(this.array_get(path, object));
}

/**
 * Deletes from an array/object using dot/bracket notation.
 *
 * @param   {string}        path   Path to delete
 * @param   {object|array}  object Object to delete from
 * @returns {object|array}
 */
array_delete(path, object)
{
    this.__arrayDeleteRecursive(this.__arrayKeySegment(path), object);

    return object;
}

/**
 * Checks if an array contains a value
 *
 * @access {public}
 * @param  {string} needle    The value to search for
 * @param  {array}  haystack  The target array to index
 * @return {bool}
 */
in_array(needle, haystack, strict)
{
    let ret = false;

    this.each(haystack, function(k, v)
    {
        if (this.is_equal(needle, v))
        {
            ret = true;
            return false;
        }

    }, this);

    return ret;
}
