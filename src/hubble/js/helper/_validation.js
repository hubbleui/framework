/**
 * Gets the `toStringTag` of `value`.
 *
 * @public
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var_type(value)
{
    if (value == null)
    {
        return value === undefined ? '[object Undefined]' : '[object Null]'
    }

    return TO_STR.call(value);
}

/**
 * Checks if variable is HTMLElement.
 *
 * @param   {mixed}  mixed_var  Variable to evaluate
 * @returns {boolean}
 */
is_htmlElement(mixed_var)
{
    if (mixed_var && mixed_var.nodeType)
    {
        let type = this.var_type(mixed_var);

        return HTML_REGXP.test(type) || type === '[object HTMLDocument]' || type === '[object Text]';
    }

    return false;
}

/**
 * Is undefined.
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {boolean}
 */
is_undefined(mixed_var)
{
    return this.var_type(mixed_var) === UNDEF_TAG;
}

/**
 * Is null.
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {boolean}
 */
is_null(mixed_var)
{
    return this.var_type(mixed_var) === NULL_TAG;
}

/**
 * Is bool.
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {boolean}
 */
is_bool(mixed_var)
{
    return this.var_type(mixed_var) === BOOL_TAG;
}

/**
 * Is function.
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {boolean}
 */
is_function(mixed_var)
{
    return this.var_type(mixed_var) === FUNC_TAG;
}

/**
 * Checks if variable is an object.
 *
 * @param   {mixed}  mixed_var Variable to evaluate
 * @returns {boolean}
 */
is_object(mixed_var)
{
    return mixed_var !== null && this.var_type(mixed_var) === OBJECT_TAG;
}

/**
 * Is array.
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {boolean}
 */
is_array(mixed_var, strict)
{
    strict = typeof strict === 'undefined' ? false : strict;

    let type = this.var_type(mixed_var);

    return !strict ? ARRAYISH_TAGS.includes(type) : type === ARRAY_TAG;
}

/**
 * Is nodelist.
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {boolean}
 */
is_nodelist(mixed_var)
{
    return this.var_type(mixed_var) === NODELST_TAG;
}

/**
 * Is node type.
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @param   {string} tag        Tag to compare
 * @returns {boolean}
 */
is_node_type(mixed_var, tag)
{
    return mixed_var.tagName.toUpperCase() === tag.toUpperCase();
}

/**
 * Is args array.
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {boolean}
 */
is_args(mixed_var)
{
    return this.var_type(mixed_var) === ARGS_TAG;
}

/**
 * Is string.
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {boolean}
 */
is_string(mixed_var)
{
    return this.var_type(mixed_var) === STRING_TAG;
}

/**
 * Is number.
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {boolean}
 */
is_number(mixed_var)
{
    return !isNaN(mixed_var) && this.var_type(mixed_var) === NUMBER_TAG;
}

/**
 * Is string.
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {boolean}
 */
is_numeric(mixed_var)
{
    if (this.is_number(mixed_var))
    {
        return true;
    }
    else if (this.is_string(mixed_var))
    {
        return /^-?\d+$/.test(mixed_var.trim());
    }

    return false;
}

/**
 * Is date object.
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {boolean}
 */
is_date(mixed_var)
{
    return this.var_type(mixed_var) === DATE_TAG;
}

/**
 * Is regexp.
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {boolean}
 */
is_regexp(mixed_var)
{
    return this.var_type(mixed_var) === REGEXP_TAG;
}

/**
 * Is Set.
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {boolean}
 */
is_set(mixed_var)
{
    return this.var_type(mixed_var) === SET_TAG;
}

/**
 * Is Map.
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {boolean}
 */
is_map(mixed_var)
{
    return this.var_type(mixed_var) === MAP_TAG;
}

/**
 * Is Symbol.
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {boolean}
 */
is_symbol(mixed_var)
{
    return this.var_type(mixed_var) === SYMBOL_TAG;
}

/**
 * Is Array buffer.
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {boolean}
 */
is_buffer(mixed_var)
{
    return this.var_type(mixed_var) === ARRAY_BUFFER_TAG;
}

/**
 * Is dataView obj.
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {boolean}
 */
is_dataview(mixed_var)
{
    return this.var_type(mixed_var) === DATAVIEW_TAG;
}

/**
 * Is variable a function / constructor.
 *
 * @param   {mixed}  mixed_var  Variable to check
 * @returns {boolean}
 */
is_callable(mixed_var)
{
    return this.is_function(mixed_var);
}

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

/**
 * Checks if variable is a class declaration or extends a class and/or constructable function.
 *
 * @param   {mixed}                        mixed_var  Variable to evaluate
 * @oaram   {string} | undefined | boolean} classname  Classname or strict if boolean provided
 * @param   {boolean}                      strict     If "true" only returns true on ES6 classes (default "false")
 * @returns {boolean}
 */
is_class(mixed_var, classname, strict)
{
    // this.is_class(foo, true)
    if (classname === true || classname === false)
    {
        strict = classname;
        classname = null;
    }
    // this.is_class(foo, 'Bar') || this.is_class(foo, 'Bar', false)
    else
    {
        strict = typeof strict === 'undefined' ? false : strict;
    }

    if (typeof mixed_var !== 'function' || !this.is_constructable(mixed_var))
    {
        return false;
    }

    let isES6 = /^\s*class\s+\w+/.test(mixed_var.toString());

    if (classname)
    {
        if (!isES6 && strict)
        {
            return false;
        }

        if (mixed_var.name === classname || mixed_var.prototype.constructor.name === classname)
        {
            return true;
        }

        let protos = [];
        let proto = mixed_var.prototype || Object.getPrototypeOf(mixed_var);
        let ret = false;

        while (proto && proto.constructor)
        {
            // recursive stopper
            if (protos.includes.proto)
            {
                break;
            }

            protos.push(proto);

            if (proto.constructor.name === classname)
            {
                ret = true;

                break;
            }

            proto = proto.prototype || Object.getPrototypeOf(proto);
        }

        return ret;
    }

    // ES6 class declaration depending on strict

    return strict ? isES6 : this.is_constructable(mixed_var);
}

/**
 * Is empty
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {boolean}
 */
is_empty(mixed_var)
{
    if (mixed_var === false || mixed_var === null || (typeof mixed_var === 'undefined'))
    {
        return true;
    }
    else if (this.is_array(mixed_var))
    {
        return mixed_var.length === null || mixed_var.length <= 0;
    }
    else if (this.is_object(mixed_var))
    {
        return Object.keys(mixed_var).length === 0;
    }
    else if (this.is_string(mixed_var))
    {
        return mixed_var.trim() === '';
    }
    else if (this.is_number(mixed_var))
    {
        return isNaN(mixed_var);
    }
    else if (this.is_function(mixed_var))
    {
        return false;
    }

    return false;
}

/**
 * Deep check for equal
 * 
 * @param   {mixed}  a
 * @param   {mixed}  b
 * @returns {boolean}
 */
is_equal(a, b)
{
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
        if (a === b)
        {
            return true;
        }
        else if (this.is_array(a) && !this.is_array(b))
        {
            return false;
        }

        return this.__equalTraverseable(a, b);
    }

    return true;
}

/**
 * Checks if HtmlElement is in current DOM
 *
 * @param   {HTMLElement}  element  Element to check
 * @returns {boolean}
 */
in_dom(element)
{
    if (!this.is_htmlElement(element))
    {
        return false;
    }

    if (element === document.body || element === document.documentElement)
    {
        return true;
    }

    while (element)
    {
        if (element === document.documentElement)
        {
            return true;
        }

        element = element.parentNode;
    }

    return false;
}

/**
 * Is valid JSON
 * 
 * @param  {mixed} str String JSON
 * @return {object|false}
 */
is_json(str)
{
    var obj;
    try
    {
        obj = JSON.parse(str);
    }
    catch (e)
    {
        return false;
    }
    return obj;
}


/**
 * Returns array/object/string/number size.
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {number}
 */
size(mixed_var)
{
    if (this.is_string(mixed_var) || this.is_array(mixed_var))
    {
        return mixed_var.length;
    }
    else if (this.is_number(mixed_var))
    {
        return mixed_var;
    }
    else if (this.is_bool(mixed_var))
    {
        return mixed_var === true ? 1 : -1;
    }
    else(this.is_object(mixed_var))
    {
        return Object.keys(mixed_var).length;
    }

    return 1;
}

/**
 * Count
 *
 * @access {public}
 * @param  {mixed}  mixed_var Variable to count
 * @return {int}
 */
count(mixed_var)
{
    return this.size(mixed_var);
}

/**
 * Returns function / class name
 *
 * @param   {mixed}  mixed_var Variable to evaluate
 * @returns {string}
 */
callable_name(mixed_var)
{
    if (this.is_callable(mixed_var))
    {
        return mixed_var.name;
    }
    else if (this.is_object(mixed_var))
    {
        return mixed_var.constructor.name;
    }
}

/**
 * Checks if variable should be considered "true" or "false" using "common sense".
 * 
 * @param   {mixed} mixed_var  Variable to test
 * @returns {boolean}
 */
bool(mixed_var)
{
    mixed_var = (typeof mixed_var === 'undefined' ? false : mixed_var);

    if (this.is_bool(mixed_var))
    {
        return mixed_var;
    }

    if (this.is_number(mixed_var))
    {
        return mixed_var > 0;
    }

    if (this.is_array(mixed_var))
    {
        return mixed_var.length > 0;
    }

    if (this.is_object(mixed_var))
    {
        return Object.keys(mixed_var).length > 0;
    }

    if (this.is_string(mixed_var))
    {
        mixed_var = mixed_var.toLowerCase().trim();

        if (mixed_var === 'false')
        {
            return false;
        }
        if (mixed_var === 'true')
        {
            return true;
        }
        if (mixed_var === 'on')
        {
            return true;
        }
        if (mixed_var === 'off')
        {
            return false;
        }
        if (mixed_var === 'undefined')
        {
            return false;
        }
        if (this.is_numeric(mixed_var))
        {
            return Number(mixed_var) > 0;
        }
        if (mixed_var === '')
        {
            return false;
        }
    }

    return false;
}
