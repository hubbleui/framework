/**
 * Set, get or remove CSS value(s) on element.
 * 
 * Note that this will only return inline styles, use 'rendered_style' for
 * currently displayed styles.
 *
 * @access {public}
 * @param  {DOMElement}   el     Target DOM node
 * @param  {string|object} Assoc array of property->value or string property
 * @example {Helper.css(node,} { display : 'none' });
 * @example {Helper.css(node,} 'display', 'none');
 */
_.prototype.css = function(el, property, value)
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
            if (value.includes('important') || property.startsWith('--'))
            {
                let styles = el.getAttribute('style');

                if (styles && styles.includes(property))
                {
                    let re = new RegExp(`${property}\s?:[^;]+;?`, 'g');

                    styles = styles.replace(re, '').trim();
                }
                
                styles = !styles ? `${property}:${value}` : `${this.rtrim(styles, ';')};${property}:${value}`;

                el.setAttribute('style', styles);

                return;
            }
            else
            {
                el.style[property] = value;    
            }
        }
    }
}