/**
 * Returns an object of CSS transforms by property as keys or transforms as string.
 *
 * @param  {node|string} DOMElement     Target element or transition value string
 * @param  {bool}        returnAsString Returns transforms as string (optional) (default true)
 * @return {object}
 */
_.prototype.css_transform_props = function(DOMElement, returnAsString)
{
    if (this.is_string(DOMElement))
    {
        return this.__un_css_matrix(DOMElement, returnAsString);
    }

    returnAsString = this.is_undefined(returnAsString) ? true : returnAsString;

    let styles = this.__computed_style(DOMElement, 'transform');

    // If element is set to "display:none" only inline transforms will show up
    // so we check those first
    let inline   = this.inline_style(DOMElement, 'transform');
    let emptys   = [undefined, '', 'none', 'unset', 'initial', 'inherit'];

    // Has inline styles - inline do not need to converted
    if (!emptys.includes(inline))
    {
        return returnAsString ? inline : this.__un_css_matrix(inline, false);
    }

    // If element is hiddien we need to display it quickly
    // to get the CSS defined transform prop to be renderd
    let inlineDisplay = this.inline_style(DOMElement, 'display');
    let cssDisplay    = this.rendered_style(DOMElement, 'display');
    let isHidden      = cssDisplay === 'none';

    // Re-get transform value
    if (isHidden)
    {
        this.css(DOMElement, 'display', 'unset');

        styles = this.__computed_style(DOMElement, 'transform');
    }

    // Doesn't have stylesheet styles
    if (this.in_array(styles, emptys))
    {
        styles = styles === 'none' || styles === undefined ? '' : styles;
    }

    // Empty return
    if (!styles)
    {
        return returnAsString ? '' : {};
    }

    // revert matrix
    styles = this.__un_css_matrix(DOMElement, returnAsString);
    
    // Revert back origional styles
    if (isHidden)
    {
        this.css(DOMElement, 'display', !inlineDisplay ? false : inlineDisplay);
    }

    return returnAsString ? styles : styles;
}

/**
 * Converts an element's matrix transform value back to component transforms
 *
 * @access {private}
 * @param  {DOMElement}   DOMElement     Target element
 * @param  {bool}   returnAsString Returns string
 * @return {string|object}
 */
_.prototype.__un_css_matrix = function(DOMElement, returnAsString)
{
    if (!this.is_string(DOMElement))
    {
        if (!DOMElement.computedStyleMap)
        {
            return returnAsString ? '' : {};
        }

        var computedTransforms = DOMElement.computedStyleMap().get('transform');

        var transforms = Array.prototype.slice.call(computedTransforms).map( (x) => x.toString() ).sort().reverse();
    }
    else
    {
        var transforms = DOMElement.split(')');
    }

    const axisMap = ['X', 'Y', 'Z'];

    const ret = {};

    this.each(transforms, function(i, transform)
    {
        if (transform.trim() === '') return;

        var split    = transform.split('(');
        var bsName   = split[0].replace('3d', '');
        var prop     = split.shift().trim();
        var value    = split.pop().trim().replace(')', '');
        var values   = value.split(',').map((x) => x.trim());
        var lastChar = prop.slice(-1);

        if (prop === 'perspective')
        {
            ret.perspective = value;

            return;
        }
        
        this.each(values, function(i, val)
        {
            if (i > 2) return false;

            let defltVal = prop.includes('scale') ? 1 : 0;
            let axisProp = !axisMap.includes(lastChar) ? `${bsName}${axisMap[i]}` : bsName;

            if (prop === 'rotate')
            {
                ret.rotateZ = val;
            }
            else if (prop === 'rotate3d')
            {
                if (parseFloat(val) !== defltVal)
                {
                    ret[axisProp] = values[values.length - 1];
                }
            }
            else if (parseFloat(val) === defltVal && ret[axisProp])
            {
                return;
            }
            else
            {
                ret[axisProp] = val;
            }
        });

    }, this);

    if (returnAsString)
    {
        return !this.is_empty(ret) ? this.join_obj(ret, '(', ') ') + ')' : '';
    }
    
    return ret;
}