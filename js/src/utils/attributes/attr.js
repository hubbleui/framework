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

        // innerText
        case 'innerText':
            DOMElement.innerText = !value ? '' : value;
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

            // Cleanup classname
            value = this.is_string(value) ? this.replace(value, ['undefined', 'null', 'false', 'true'], '').replace(/\s\s+/g, ' ').trim() : value;

            if (this.is_empty(value))
            {
                DOMElement.removeAttribute('class');
            }
            else
            {
                DOMElement.className = value;
            }

            break;

        // Style
        case 'style':

            // remove all styles completely
            if (this.is_empty(value))
            {
                DOMElement.removeAttribute('style');
            }

            DOMElement.style = '';

            let style = this.is_string(value) ? this.css_to_object(value) : value;

            this.each(style, (prop, value) => this.css(DOMElement, prop, value));
           
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
                let isData     = name.startsWith('data');
                let isAria     = name.startsWith('aria');
                let camelName  = name.includes('-') ? this.to_camel_case(name) : name;
                let hyphenName = name.includes('-') ? name : this.camel_case_to_hyphen(name);
                let isEmpty    = this.is_empty(value);

                // Special data
                if (isData)
                {
                    if (isEmpty)
                    {
                        DOMElement.removeAttribute(hyphenName);

                        delete DOMElement.dataset[this.lc_first(this.ltrim(camelName, 'data'))];
                    }
                    else
                    {
                        DOMElement.setAttribute(hyphenName, value);

                        DOMElement.dataset[this.lc_first(this.ltrim(camelName, 'data'))] = value;
                    }

                    break;
                }

                // Special booleans
                if (this.in_array(name, BOOLEAN_ATTRS))
                {
                    DOMElement[name] = isEmpty ? '' : value;

                    if (isEmpty) DOMElement.removeAttribute(name);

                    break;
                }

                if (!PROP_ATTRIBUTES.includes(camelName))
                {
                    try
                    {                        
                        DOMElement[camelName] = isEmpty ? '' : value;

                    } catch (e) {}
                }

                if (isEmpty)
                {
                    DOMElement.removeAttribute(hyphenName);
                }
                else
                {
                    DOMElement.setAttribute(hyphenName, value);
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