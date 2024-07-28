/**
 * Merges multiple objects or arrays into the original.
 *
 * @param   {object|array} First array then any number of array or objects to merge into
 * @returns {object|array}
 */
_.prototype.array_merge = function()
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