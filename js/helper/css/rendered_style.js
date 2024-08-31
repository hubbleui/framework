/**
 * Get the element's computed style on a property
 *
 * @access {public}
 * @param  {DOMElement}   el   Target element
 * @param  {string} prop CSS property to check (in camelCase) (optional)
 * @return {mixed}
 */
_.prototype.rendered_style = function(DOMElement, property)
{
    if (property.includes('ransform'))
    {
        return this.css_transform_props(DOMElement, true);
    }

    return this.__computed_style(DOMElement, property);
}

/**
 * Get the elements computed style.
 *
 * @access {private}
 * @param  {DOMElement}          el   Target element
 * @param  {string}        prop CSS property to check (in camelCase) (optional)
 * @return {string|object}
 */
_.prototype.__computed_style = function(DOMElement, property)
{
    if (window.getComputedStyle)
    {
        let styles = window.getComputedStyle(DOMElement, null);

        if (property && property.startsWith('--')) return styles.getPropertyValue(property);

        return !property ? styles : styles[property];
    }
    else if (DOMElement.currentStyle)
    {
        let styles = DOMElement.currentStyle;

        return !property ? styles : styles[property];
    }

    return '';
}
















