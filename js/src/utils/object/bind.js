/**
 * Binds a function so that it can be identified.
 * 
 * @param   {function}  func    Function to bind
 * @param   {mixed}     context Context to bind "this"
 * @returns {function}
 */
_.prototype.bind = function(func, context)
{
    context = typeof context === 'undefined' ? window : context;

    const bound = function()
    {
        return func.apply(context, arguments);
    }

    Object.defineProperty(bound, 'name', { value: func.name });

    bound.__isBound      = true;
    bound.__boundContext = context;
    bound.__origional    = func;

    return bound;
}