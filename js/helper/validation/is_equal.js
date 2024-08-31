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
_.prototype.is_equal = function(a, b, strict)
{    
    strict = this.is_undefined(strict) ? false : strict;

    if ((typeof a) !== (typeof b))
    {
        return false;
    }
    else if (this.is_string(a) || this.is_number(a) || this.is_bool(a) || this.is_null(a) || this.is_htmlElement(a))
    {
        return a === b;
    }
    else if (this.is_function(a))
    {        
        return strict ? a === b : this.__is_equal_func(a, b);
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
        
        return this.__is_equal_traverseable(a, b);
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
_.prototype.__is_equal_func = function(a, b)
{
    // Functions have the same name
    if (a.name === b.name)
    {
        // If the functions were bound or cloned by the library they can technically still be equal
        if (a.__isBound)
        {
            if (!b.__isBound) return false;

            if (!this.is_equal(a.__boundContext, b.__boundContext)) return false;
            
            if (!this.is_equal(a.__origional, b.__origional)) return false;
        }

        // Check string
        if (a.toString() !== b.toString()) return false;

        // Prototypes are different
        if (!this.__is_equal_protos(a, b)) return false;

        return true;
    }

    return false;
}

/**
 * Checks if object prototypes are equal
 * 
 * @param   {array} | object}  a
 * @param   {array} | object}  b
 * @returns {boolean}
 */
_.prototype.__is_equal_protos = function(a, b)
{
    // Check the prototypes
    let aProtos = this.prototypes(a);
    let bProtos = this.prototypes(b);

    if (aProtos.length !== bProtos.length) return false;

    if (aProtos.length === 0 && bProtos.length === 0) return true;

    let ret = true;

    this.each(aProtos, (i, proto) =>
    {                
        if (!this.is_equal(proto, bProtos[i]))
        {
            ret = false;

            return false;
        }

    }, this);

    return ret;
}


/**
 * Checks if traversable's are equal
 * 
 * @param   {array} | object}  a
 * @param   {array} | object}  b
 * @returns {boolean}
 */
_.prototype.__is_equal_traverseable = function(a, b)
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

    if (!ret) return false;

    if (this.is_object(a)) return this.__is_equal_protos(a, b);

    return ret;
}
