/**
 * Converts CSS property to camel case.
 *
 * @access {public}
 * @param  {string} prop Property to convert
 * @retirm {string}
 */
_.prototype.css_prop_to_camel_case = function(prop)
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

    return ret;
}