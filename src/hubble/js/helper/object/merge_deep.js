/**
 * Deep merge two objects.
 * 
 * @param   {object} target
 * @param   {object} ...sources
 * @returns {object}
 */
_.prototype.merge_deep = function()
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