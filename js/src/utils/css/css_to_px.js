/**
 * Get CSS property.
 * 
 * @param  {string} value CSS value (e.g "12px")
 * @return {Number}
 */
_.prototype.css_unit_value = function(value)
{
    value = value + '';

    if (this.is_numeric(value))
    {
        return parseFloat(value);
    }

    if (this.is_empty(value))
    {
        return 0;
    }

    return parseFloat(value.replaceAll(/[^0-9-.]/g, ''));
}

/**
 * Get CSS property unit.
 * 
 * @param  {string} value CSS value (e.g "12px")
 * @return {string}
 */
_.prototype.css_value_unit = function(value)
{
    value = value + '';

    return value.split(/[0-9]/).pop().replaceAll(/[^a-z%]/g, '').trim();
}

/**
 * Converts CSS units to px.
 * 
 * @param  {String}     value      CSS value (e.g "12rem")
 * @param  {DomElement} DOMElement CSS value (optional) (used to relative units)
 * @param  {String}     property   CSS property (optional) (used for % unit)
 * @return {Number}
 */
_.prototype.css_to_px = function(valueStr, DOMElement, property)
{
    valueStr = valueStr + '';
    
    if (valueStr.includes('calc')) return valueStr;

    var unit  = this.css_value_unit(valueStr);
    var value = this.css_unit_value(valueStr);

    if (valueStr.includes('px')) return value;

    if (!this.is_undefined(CSS_ABSOLUTE_UNITS[unit]))
    {
        return (value * CSS_ABSOLUTE_UNITS[unit]);
    }

    if (!this.is_undefined(CSS_RELATIVE_UNITS[unit]))
    {
        if (unit === 'em' || unit === 'ex' || 'unit' === 'ch')
        {
            if (!DOMElement) return value * CSS_RELATIVE_UNITS[unit];
            let psize = this.css_unit_value(this.rendered_style(DOMElement.parentNode, 'font-size'));
            if (unit === 'em') return value * psize;
            if (unit === 'ex') return value * (psize / 1.8);
            if (unit === 'ch') return value * (psize / 2);
            if (unit === '%')  return value * psize;
        }
        else if (unit === '%')
        {
            if (!DOMElement) return value * CSS_RELATIVE_UNITS[unit];
            if (!property) property = 'height';
            
            let psize = this.css_unit_value(this.rendered_style(DOMElement, property));

            return psize * (value / 100);
        }
        else if (unit === 'rem')
        {
            // font sizes are always returned in px with JS
            return value * this.css_unit_value(this.rendered_style(document.documentElement, 'font-size'));
        }
        else if (unit === 'vw')
        {
            return this.width(window) * (value / 100);
        }
        else if (unit === 'vh')
        {
            return this.height(window) * (value / 100);
        }
        else if (unit === 'vmin' || unit === 'vmax')
        {
            let w = this.width(window);
            let h = this.height(window);
            let m = unit === 'vmin' ? Math.min(w, h) : Math.max(w, h)

            return m * (value / 100);
        }
    }

    return value;
}
