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