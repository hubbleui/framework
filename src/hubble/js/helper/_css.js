/**
 * IMPORTANT ALL CSS PROPS ARE HANDLED BY THE LIBRARY IN 'hyphen-case'
 * 
 * However, you can provide a camelCase property to a css func and it will convert it
 * automatically
 * 
 *
 * use css_prop_to_camel_case() or css_prop_to_camel_case
 * to interchange between them
 */

/**
 * Expand shorthand property to longhand properties 
 *
 * @access {private}
 * @param  {string} property  The CSS base property
 * @return {array}
 */
css_to_longhand(property)
{
    property = this.css_prop_to_hyphen_case(property);

    // Doesn't exist
    if (!SHORTHAND_PROPS.hasOwnProperty(property))
    {
        return [property];
    }

    return this.map(SHORTHAND_PROPS[property], function(i, longhand)
    {
        // Object is setup so that if it starts with a '-'
        // then it gets concatenated to the oridional prop
        // e.g 'background' -> '-image'
        if (longhand.startsWith('-'))
        {
            longhand = property + longhand;
        }

        // otherwise it gets replaced
        // e.g 'border-color' -> 'border-top-color', 'border-right-color'... etc
        return longhand;

    }, this);
}

/**
 * Concatenate longhand to shorthand
 *
 * @access {private}
 * @param  {node}   el      Target element
 * @param  {string|array}  longHandProps Array of longhanded CSS properties in order (camelCased)
 * @return {string}
 */
css_to_shorthand(el, longHandProps)
{
    var shorthand = '';
    var multiValArr = [];

    this.each(longHandProps, function()
    {

    }, this);

    for (var j = 0, len = longHandProps.length; j < len; j++)
    {
        var longHandStyle = this.rendered_style(el, longHandProps[j]);

        if (longHandStyle)
        {
            if (longHandStyle.indexOf(',') >= 0)
            {
                multiValArr.push(longHandStyle.split(',').map(Function.prototype.call, String.prototype.trim));
            }
            else
            {
                shorthand += ' ' + longHandStyle;
            }
        }
    }

    if (!this.is_empty(multiValArr))
    {
        var _this = this;
        var multiValArrStrs = [];
        for (var k = 0, len = multiValArr.length; k < len; k++)
        {
            multiValArr[k].map(function(val, n)
            {
                if (! multiValArrStrs[n])
                {
                    multiValArrStrs[n] = val;
                }
                else
                {
                    multiValArrStrs[n] += ' ' + val;
                }
            });
        }

        return multiValArrStrs.join(', ');
    }

    return shorthand.trim();
}

/**
 * Get an element's inline style if it exists
 *
 * @access {public}
 * @param  {node}   el   Target element
 * @param  {string} prop CSS property to check
 * @return {string}
 */
inline_style(element, prop)
{
    // @todo expand shorthand    
    const elementStyle = element.style;

    prop = this.css_prop_to_hyphen_case(prop);

    if (Object.hasOwn(elementStyle, prop))
    {
        const val = elementStyle.getPropertyValue(elementStyle[prop]) || elementStyle[prop];
        
        return val === '' ? undefined : val;
    }
}

/**
 * Get the element's computed style on a property
 *
 * @access {private}
 * @param  {node}   el   Target element
 * @param  {string} prop CSS property to check (in camelCase) (optional)
 * @return {mixed}
 */
rendered_style(el, property)
{
    if (window.getComputedStyle)
    {
        if (property)
        {
            return window.getComputedStyle(el, null)[property];
        }

        return window.getComputedStyle(el, null);

    }
    if (el.currentStyle)
    {
        if (property)
        {
            return el.currentStyle[property];
        }
        
        return el.currentStyle;
    }

    return '';
}

/**
 * Set CSS value(s) on element
 *
 * @access {public}
 * @param  {node}   el     Target DOM node
 * @param  {string|object} Assoc array of property->value or string property
 * @example {Helper.css(node,} { display : 'none' });
 * @example {Helper.css(node,} 'display', 'none');
 */
css(el, property, value)
{
    // If their is no value and property is an object
    if (this.is_object(property))
    {
        this.each(property, function(prop, val)
        {
            this.css(el, prop, val);

        }, this);
    }
    else
    {
        // Getting not settings
        if (this.is_undefined(value))
        {
            return this.inline_style(el, property);
        }
        // Value is either null or false we remove
        else if (this.is_null(value) || value === false)
        {
            if (el.style.removeProperty)
            {
                el.style.removeProperty(property);
            }
            else
            {
                el.style.removeAttribute(property);
            }
        }
        else
        {
            el.style[property] = value;
        }
    }
}

/**
 * Remove inline css style
 * 
 * @access {public}
 * @param  {node}   el   Target element
 * @param  {string} prop CSS property to removes
 */
remove_style(el, prop)
{
    if (typeof prop === 'undefined')
    {
        DOMElement.removeAttribute('style');

        return;
    }

    this.css(el, prop);
}

/**
 * Converts CSS property to camel case.
 *
 * @access {public}
 * @param  {string} prop Property to convert
 * @retirm {string}
 */
css_prop_to_camel_case(prop)
{
    if (!prop.includes('-')) return prop;

    let camelProp = this.to_camel_case(prop);

    if (this.in_array(prop, Object.keys(CSS_PROP_TO_CAMEL_CASES)))
    {
        return CSS_PROP_TO_CAMEL_CASES[prop];
    }

    // First char is always lowercase
    let ret = camelProp.charAt(0).toLowerCase() + camelProp.slice(1);

    CSS_PROP_TO_CAMEL_CASES[prop] = ret;

    console.log(CSS_PROP_TO_CAMEL_CASES);

    return ret;
}

/**
 * Converts CSS property to hyphen case.
 *
 * @access {public}
 * @param  {string} prop Property to convert
 * @retirm {string}
 */
css_prop_to_hyphen_case(prop)
{
    if (!/[A-Z]/.test(prop)) return prop;
    
    if (this.in_array(prop, Object.keys(CSS_PROP_TO_HYPHEN_CASES)))
    {
        return CSS_PROP_TO_HYPHEN_CASES[prop];
    }

    var hyphenProp = this.camel_case_to_hyphen(prop);

    if (hyphenProp.startsWith('webkit-') || hyphenProp.startsWith('moz-') || hyphenProp.startsWith('ms-') || hyphenProp.startsWith('o-'))
    {
        hyphenProp = '-' + hyphenProp;
    }

    CSS_PROP_TO_CAMEL_CASES[prop] = hyphenProp;

    return hyphenProp;
}