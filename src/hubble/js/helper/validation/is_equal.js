/**
 * Deep check for equal
 * 
 * @param   {mixed}  a
 * @param   {mixed}  b
 * @param   {bool}   strict Strict comparison (optional) (default false)
 * @returns {bool}
 * 
 *  * Note that strict set to true would return false in the following:
 *  is_equal ({ foo : 'bar'}, { foo : 'bar'});
 */
is_equal(a, b, strict)
{
    strict = this.is_undefined(strict) ? false : strict;

    if ((typeof a) !== (typeof b))
    {
        return false;
    }
    else if (this.is_string(a) || this.is_number(a) || this.is_bool(a) || this.is_null(a))
    {
        return a === b;
    }
    else if (this.is_function(a))
    {
        return this.___equalFunction(a, b);
    }
    else if (this.is_array(a) || this.is_object(b))
    {
        if (strict)
        {
            if (a !== b || this.is_array(a) && !this.is_array(b))
            {
                return false;
            }
            
            return true;
        }
        
        return this.__equalTraverseable(a, b);
    }

    return true;
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
 * Checks if traversable's are equal
 * 
 * @param   {array} | object}  a
 * @param   {array} | object}  b
 * @returns {boolean}
 */
__equalTraverseable(a, b)
{
    if (this.size(a) !== this.size(b))
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
