/**
 * Set, get or remove DOM attribute.
 *
 * No third arg returns attribute value, third arg set to null or false removes attribute.
 * 
 * @param {HTMLElement}  DOMElement  Dom node
 * @param {string}       name        Property name
 * @apram {mixed}        value       Property value
 */
_.prototype.attr = function(DOMElement, name, value)
{
    // Get attribute
    // e.g attr(node, style)
    if ((TO_ARR.call(arguments)).length === 2 && this.is_string(name))
    {
        return this.__get_attribute(DOMElement, name);
    }

    // attr(node, {foo : 'bar', baz: 'bar'})
    if (this.is_object(name))
    {
        this.each(name, function(prop, value)
        {
            this.attr(DOMElement, prop, value);

        }, this);

        return;
    }

    // Set or remove attibute.
    switch (name)
    {
        // innerHTML
        case 'innerHTML':
            DOMElement.innerHTML = !value ? '' : value;
            break;

        // Children
        case 'children':

            this.each(DOMElement.children, function(node)
            {
                this.remove_from_dom(node);
            
            }, this);

            this.each(value, function(node)
            {
                DOMElement.appendChild(node);
            });

            break;

        // Class
        case 'class':
        case 'className':

            if (!value)
            {
                DOMElement.removeAttribute('class');
            }

            DOMElement.className = value;

            break;

        // Style
        case 'style':

            // remove all styles completely
            if (this.is_empty(value))
            {
                DOMElement.removeAttribute('style');
            }
            // Clear style and overwrite
            else if (this.is_string(value))
            {
                DOMElement.style = '';
                
                // attr(node, 'css', 'foo : bar; baz: bar;})
                this.each(value.split(';'), function(i, rule)
                {
                    var style = rule.split(':');

                    if (style.length >= 2)
                    {
                        this.css(DOMElement, style.shift().trim(), style.join(':').trim());
                    }
                }, this);
            }
            // attr(node, 'css', {foo : 'bar', baz: 'bar'})
            else if (this.is_object(value))
            {
                DOMElement.style = '';

                this.each(value, function(prop, value)
                {
                    this.css(DOMElement, prop, value);
                    
                }, this);
            }
            break;

        // Events / attributes
        default:

            // Events
            if (name[0] === 'o' && name[1] === 'n')
            {
                var evt = name.slice(2).toLowerCase();

                // Remove old listeners
                this.remove_event_listener(DOMElement, evt);

                // Add new listener if one provided
                if (value)
                {
                    this.add_event_listener(DOMElement, evt, value);
                }
            }
            // All other node attributes
            else
            {
                if (
                    name !== 'href' &&
                    name !== 'list' &&
                    name !== 'form' &&
                    // Default value in browsers is `-1` and an empty string is
                    // cast to `0` instead
                    name !== 'tabIndex' &&
                    name !== 'download' &&
                    name in DOMElement
                )
                {
                    try
                    {
                        DOMElement[name] = value == null ? '' : value;
                        // labelled break is 1b smaller here than a return statement (sorry)
                        break;
                    } catch (e) {}
                }

                let camelName  = name.includes('-') ? this.to_camel_case(name) : name;
                let hyphenName = name.includes('-') ? name : this.camel_case_to_hyphen(name);


                // ARIA-attributes have a different notion of boolean values.
                // The value `false` is different from the attribute not
                // existing on the DOM, so we can't remove it. For non-boolean
                // ARIA-attributes we could treat false as a removal, but the
                // amount of exceptions would cost us too many bytes. On top of
                // that other VDOM frameworks also always stringify `false`.

                if (typeof value === 'function')
                {
                    // never serialize functions as attribute values
                }
                else if (value != null && (value !== false || name.indexOf('-') != -1))
                {
                    DOMElement.setAttribute(name, value);
                }
                else
                {
                    DOMElement.removeAttribute(name);
                }
            }

            break;
    }
}

/**
 * Simple get html attribute.
 *
 * No third arg returns attribute value, third arg set to null or false removes attribute.
 * 
 * @access {private}
 * @param  {HTMLElement}      DOMElement  Dom node
 * @param  {string}           name        Property name
 * @return {string|undefined}
 */
_.prototype.__get_attribute = function(DOMElement, name)
{
    if (name.startsWith('data'))
    {
        name = name.startsWith('data-') ? this.to_camel_case(name.substring(5)) : name.substring(4);

        return DOMElement.dataset[name];
    }

    // Special booleans
    if (this.in_array(name, BOOLEAN_ATTRS))
    {
        if (DOMElement[name] === '' || DOMElement[name] === 'true' || DOMElement[name] === true) return true;

        return DOMElement[name] === 'false' || !DOMElement[name] ? false : true;
    }

    let camelName  = name.includes('-') ? this.to_camel_case(name) : name;
    let hyphenName = name.includes('-') ? name : this.camel_case_to_hyphen(name);
    let retCamel   = DOMElement[camelName];
    let retAttr    = DOMElement.getAttribute(hyphenName);

    return retAttr === null || this.is_undefined(retAttr) ? retCamel : retAttr;
}

