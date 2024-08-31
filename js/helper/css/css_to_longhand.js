/**
 * Expand shorthand property to longhand properties 
 *
 * @access {private}
 * @param  {string}  CSS rules
 * @return {object}
 */
_.prototype.css_to_longhand = function(css)
{
    var ret    = {};
    var values = this.css_to_object(css);

    this.each(values, function(prop, value)
    {
        if (SHORTHAND_PROPS.hasOwnProperty(prop))
        {
            var splits  = value.split(' ').map( (x) => x.trim());
            var dfault  = prop === 'margin' || prop === 'padding' ? '0' : 'initial';

            this.each(SHORTHAND_PROPS[prop], function(i, longhand)
            {
                // Object is setup so that if it starts with a '-'
                // then it gets concatenated to the oridional prop
                // e.g 'background' -> '-image'
                longhand = longhand.startsWith('-') ? prop + longhand : longhand;

                // otherwise it gets replaced
                // e.g 'border-color' -> 'border-top-color', 'border-right-color'... etc
                ret[longhand] = this.is_undefined(splits[i]) ? dfault : splits[i];

            }, this);
        }
        else
        {
            ret[prop] = value;
        }

    }, this);

    return ret;
}