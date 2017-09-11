/**
 * JSHelper Animation component
 *
 * @author    Joe J. Howard
 * @copyright Joe J. Howard
 * @license   https://github.com/kanso-cms/cms/blob/master/LICENSE
 */

/**
 * Vendor prefix a css property and convert to camelCase
 *
 * @access private
 * @param  string property The CSS base property
 * @return array
 */
JSHelper.prototype._vendorPrefix = function(property)
{
    // Properties to return
    var props = [];

    // Convert to regular hyphenated property 
    property = this.camelCaseToHyphen(property);

    // Is the property prefixable ?
    if (this.in_array(property, this.cssPrefixable))
    {
        var prefixes = this.cssPrefixes;

        // Loop vendor prefixes
        for (var i = 0; i < prefixes.length; i++)
        {
            props.push(prefixes[i] + this.ucfirst(this.toCamelCase(property)));
        }
    }

    // Add non-prefixed property
    props.push(this.toCamelCase(property));

    return props;
}

/**
 * Expand shorthand property to longhand properties 
 *
 * @access private
 * @param  string property The CSS base property (in camelCase)
 * @return array
 */
JSHelper.prototype._shortHandExpand = function(property, recurse)
{
    var _this = this;
    var props = this.shortHandProps;

    // Doesn't exist
    if (!props.hasOwnProperty(property))
    {
        return [property];
    }

    return props[property].map(function (p)
    {
        if (p.substr(0, 1) === '-')
        {
            var longhand = property + _this.toCamelCase(p);
        }
        else
        {
            var longhand = p;
        }
        //var longhand = p.substr(0, 1) === '-' ? property + p : p;
        return recurse ? _this._shortHandExpand(longhand, recurse) : longhand;
    });
}

/**
 * Get the element's computed style on a property
 *
 * @access private
 * @param  node   el   Target element
 * @param  string prop CSS property to check (in camelCase) (optional)
 * @return mixed
 */
JSHelper.prototype._computeStyle = function(el, property)
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
 * Concatenate longhand to shorthand
 *
 * @access private
 * @param  node   el      Target element
 * @param  array  longHandProps Array of longhanded CSS properties in order (camelCased)
 * @return string
 */
JSHelper.prototype._concatShortHandProperties = function(el, longHandProps)
{
    var shorthand   = '';
    var multiValArr = [];

    for (var j = 0, len = longHandProps.length; j < len; j++)
    {
        var longHandStyle = this._computeStyle(el, longHandProps[j]);
        var isMulti       = longHandStyle.indexOf(',') >= 0;

        if (longHandStyle)
        {
            if (isMulti)
            {                        
                multiValArr.push(longHandStyle.split(',').map(Function.prototype.call, String.prototype.trim));
            }
            else
            {
                shorthand += ' '+longHandStyle;
            }
        }
    }

    if (!this.empty(multiValArr))
    {
        var _this = this;
        var multiValArrStrs = [];
        for (var k = 0, len = multiValArr.length; k < len; k++)
        {
            multiValArr[k].map(function (val, n)
            {
                if (!_this.isset(multiValArrStrs[n]))
                {
                    multiValArrStrs[n] = val;
                }
                else
                {
                    multiValArrStrs[n] += ' '+val;
                }
            });
        }

        return multiValArrStrs.join(', ');
    }

    return shorthand.trim();
}

/**
 * Normalizes and easing e.g 'ease-in-out' and 'easeInOut' will both return cubic bezier
 *
 * @access private
 * @param  string value easing value or string
 * @return array
 */
JSHelper.prototype._normalizeEasing = function(value)
{
    for (var camelCased in this.cssEasings)
    {
        if (!this.cssEasings.hasOwnProperty(camelCased))
        {
            continue;
        }
        if (value === this.cssEasings[camelCased] || value === camelCased)
        {
            return this.cssEasings[camelCased];
        }
    }

    return value;
}

/**
 * Get an element's currently displaying style
 * Works on shorthand and longhand
 *
 * @access public
 * @param  node   el   Target element
 * @param  string prop CSS property to check
 * @return string
 */
JSHelper.prototype.getStyle = function(el, prop)
{
    // Firefox and otther browsers do not concatenate to the shorthand property even when
    // it was defined as shorthand in the stylsheet
    // console.log(window.getComputedStyle(document.body));
    // console.log(window.getComputedStyle(document.body).padding);
    // console.log(window.getComputedStyle(document.body).getPropertyValue('padding'));
   
    // Additionally, some css values can be comma separated
    // e.g
    // transition height 300ms ease, width 300ms ease;

    // Normalize the property to camelCase and check for vendor prefixes
    var properties = this._vendorPrefix(prop);

    for (var i = 0, len = properties.length; i < len; i++)
    {
        // current prop
        var property = properties[i];

        // Get longhand properties in order
        var longHands = this._shortHandExpand(property);

        // is this a shorthand property ?
        var isShortHandProp = longHands.length === 1;

        // Do we need to concatenate to shorthand ?
        if (isShortHandProp)
        {
            return this._computeStyle(el, property);
        }

        var shorthand = this._concatShortHandProperties(el, longHands);
        
        if (shorthand)
        {
            return shorthand;
        }
    }
}

/**
 * Set CSS value(s) on element
 *
 * @access public
 * @param  node   el     Target DOM node
 * @param  string|object Assoc array of property->value or string property
 * @example JSHelper.css(node, { display : 'none' });
 * @example JSHelper.css(node, 'display', 'none');
 */
JSHelper.prototype.css = function(el, property, value)
{
    // If their is no value and property is an object
    if (this.is_object(property))
    {
        for (var key in property)
        {
            if (!property.hasOwnProperty(key))
            {
                continue;
            }

            this.css(el, key, property[key]);
        }
    }
    else
    {   
        // Normalise if this is an easing value - e.g display, 'ease-in-out'
        value = this._normalizeEasing(value);

        // vendor prefix the property if need be and convert to camelCase
        var properties = this._vendorPrefix(property);

        // Loop vendored (if added) and unvendored properties and apply
        for (var i = 0; i < properties.length; i++)
        {
            el.style[properties[i]] = value;
        }
    }
}

/**
 * Animate a css proprety
 *
 * @access public
 * @param  node   el          Target DOM node
 * @param  string cssProperty CSS property
 * @param  mixed  from        Start value
 * @param  mixed  to          Ending value
 * @param  int    time        Animation time in ms
 * @param  string easing      Easing function
 */
JSHelper.prototype.animate = function(el, cssProperty, from, to, time, easing)
{     
    // Set defaults if values were not provided;
    time   = (typeof time === 'undefined' ? 300 : time);
    easing = (typeof easing === 'undefined' ? 'linear' : this._normalizeEasing(easing));

    // Width and height need to use js to get the starting size
    // if it was set to auto/initial/null
    if ((cssProperty === 'height' || cssProperty === 'width') && (from === 'initial' || from === 'auto' || !from) )
    {
        if (cssProperty === 'height')
        {
            from = (el.clientHeight || el.offsetHeight) + 'px';
        }
        else
        {
            from = (el.clientWidth || el.offsetWidth) + 'px';
        }

        // Float/integer of number fallback if not provided as string
        if (Number.isInteger(from) || Number(from) === from && from % 1 !== 0)
        {
            from = from + 'px';
        }

        this.css(el, cssProperty, from);
    }

    // Ortherwise set the current style or the defined "from"
    else
    {
        if (from === 'initial' || from === 'auto' || !from)
        {
            this.css(el, cssProperty, this.getStyle(el, cssProperty));
        }
        else
        {
            this.css(el, cssProperty, from);
        }
    }


    // We need to merge transitions into a single allied value
    var existingTransitions = this.getStyle(el, 'transition');

    if (existingTransitions !== 'none' && existingTransitions !== 'all 0s ease 0s')
    {
        // Don't apply the same transition value twice 
        // The animation transition on a property should override 
        // an existing one
        var transitions = existingTransitions.split(',').map(Function.prototype.call, String.prototype.trim);
        transitions.push(cssProperty + ' ' + time + 'ms ' + easing);

        var props  = [];
        for (var i = transitions.length - 1; i >= 0; --i)
        {
            var prop = transitions[i].split(' ')[0];
            if (this.in_array(prop, props))
            {
               transitions.splice(i, 1);
            }
            props.push(prop);
        }

        this.css(el, 'transition', transitions.join(', '));
    }
    else
    {
        this.css(el, 'transition', cssProperty + ' ' + time + 'ms ' + easing);
    }

    this.css(el, cssProperty, to);

    // Add an event listener to check when the transition has finished
    var _this = this;

    el.addEventListener('transitionend', function transitionEnd(e)
    {
        e = e || window.event;

        if (e.propertyName == cssProperty)
        {
            _this.removeStyle(el, 'transition');

            el.removeEventListener('transitionend', transitionEnd, false);
        }

    }, false);
}


