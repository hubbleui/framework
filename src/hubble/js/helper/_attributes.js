/**
 * Set DOM attribute.
 *
 * @param {HTMLElement}  DOMElement  Dom node
 * @param {string}       name        Property name
 * @apram {mixed}        value       Property value
 */
attr(DOMElement, name, value)
{
    // Get attribute
    // e.g attr(node, style)
    if ((TO_ARR.call(arguments)).length === 2 && this.is_string(name))
    {
        return this.__getAttribute(DOMElement, name);
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

    switch (name)
    {
        // innerHTML
        case 'innerHTML':
            DOMElement.innerHTML = value;
            break;

        // Children
        case 'children':
            this.each(value, function(node)
            {
                DOMElement.appendChild(node);
            });
            break;

        // Class
        case 'class':
        case 'className':
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
                this.removeEventListener(DOMElement, evt);

                // Add new listener if one provided
                if (value)
                {
                    this.addEventListener(DOMElement, evt, value);
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