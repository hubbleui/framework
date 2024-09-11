/**
 * Converts CSS property to hyphen case.
 *
 * @access {public}
 * @param  {string} prop Property to convert
 * @retirm {string}
 */
_.prototype.css_prop_to_hyphen_case = function(prop)
{
    if (!/[A-Z]/.test(prop)) return prop;
    
    if (this.in_array(prop, Object.keys(CSS_PROP_TO_HYPHEN_CASES)))
    {
        return CSS_PROP_TO_HYPHEN_CASES[prop];
    }

    var hyphenProp = this.camel_case_to_hyphen(prop);

    if (hyphenProp.startsWith('webkit-') || hyphenProp.startsWith('moz-') || hyphenProp.startsWith('ms-') || hyphenProp.startsWith('o-'))
    {
        hyphenProp = '-' + hyphenProp;
    }

    CSS_PROP_TO_CAMEL_CASES[prop] = hyphenProp;

    return hyphenProp;
}