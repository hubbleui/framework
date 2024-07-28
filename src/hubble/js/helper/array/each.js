/**
 * Foreach loop
 * 
 * @access {public}
 * @param  {object}  obj       The target object to loop over
 * @param  {closure} callback  Callback to apply to each iteration
 * @param  {array}   args      Array of params to apply to callback (optional) (default null)
 */
_.prototype.each = function(obj, callback)
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

_.prototype.foreach = function()
{
    return this.each.apply(this, arguments);
}

/**
 * For loop with count
 * 
 * @access {public}
 * @param  {object}  obj       The target object to loop over
 * @param  {closure} callback  Callback to apply to each iteration
 * @param  {array}   args      Array of params to apply to callback (optional) (default null)
 */
_.prototype.for = function(count, callback)
{
    var args = TO_ARR.call(arguments);

    args[0] = Array.from(Array(count).keys());

    return this.each.apply(this, args);
}

