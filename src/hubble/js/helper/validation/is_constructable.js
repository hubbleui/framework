/**
 * Checks if variable is construable.
 *
 * @param   {mixed}  mixed_var  Variable to evaluate
 * @returns {boolean}
 */
is_constructable(mixed_var)
{
    // Not a function
    if (typeof mixed_var !== 'function' || mixed_var === null)
    {
        return false;
    }

    // Strict ES6 class
    if (/^\s*class\s+\w+/.test(mixed_var.toString()))
    {
        return true;
    }

    // Native arrow functions
    if (!mixed_var.prototype || !mixed_var.prototype.constructor)
    {
        return false;
    }

    // If prototype is empty 
    let props = this.object_props(mixed_var.prototype);

    return props.length >= 1;
}