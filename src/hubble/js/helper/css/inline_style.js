/**
 * Get an element's inline style if it exists
 *
 * @access {public}
 * @param  {DOMElement}   el   Target element
 * @param  {string} prop CSS property to check
 * @return {string}
 */
inline_style(element, prop)
{
    const elementStyle = element.style;

    prop = this.css_prop_to_hyphen_case(prop);

    if (Object.hasOwn(elementStyle, prop))
    {
        const val = elementStyle.getPropertyValue(elementStyle[prop]) || elementStyle[prop];
        
        return val === '' ? undefined : val;
    }
}