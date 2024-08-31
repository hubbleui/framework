/**
 * Recursively delete from array/object.
 *
 * @param   {array}        keys    Keys in search order
 * @param   {object|array} object  Object to get from
 * @returns {mixed}
 */
_.prototype.__array_delete_recursive = function(keys, object)
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

    return this.__array_delete_recursive(keys, object[key]);
}

/**
 * Recursively search from array/object.
 *
 * @param   {array}        keys    Keys in search order
 * @param   {object|array} object  Object to get from
 * @returns {mixed}
 */
_.prototype.__array_get_recursive = function(keys, object)
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

    return this.__array_get_recursive(keys, object[key]);
}

/**
 * Recursively set array/object.
 *
 * @param {array}          keys     Keys in search order
 * @param {mixed}          value    Value to set
 * @param {object|array}   object   Object to get from
 * @param {string|number}  nextKey  Next key to set
 */
_.prototype.__array_set_recursive = function(keys, value, object, nextKey)
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

    this.__array_set_recursive(keys, value, object, key);
}

/**
 * Segments an array/object path using from "dot.notation" into an array of keys in order.
 *
 * @param   {string}  path Path to parse
 * @returns {array}
 */
_.prototype.__array_key_segment = function(path)
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
 * Recursively delete from array/object.
 *
 * @param   {array}        keys    Keys in search order
 * @param   {object|array} object  Object to get from
 * @returns {mixed}
 */
_.prototype.__array_delete_recursive = function(keys, object)
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

    return this.__array_delete_recursive(keys, object[key]);
}