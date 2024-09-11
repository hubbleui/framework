/**
 * Concats longhand property to shorthand
 *
 * Note if values are not provide not all browsers will except initial
 * for all properties in shorthand syntax
 * 
 * @access {private}
 * @param  {string}  CSS rules
 * @return {object}
 */
_.prototype.css_to_shorthand = function(css)
{
    const needsFilling = ['margin', 'padding', 'transition', 'animation'];
    var ret            = {};
    var styles         = this.css_to_object(css);

    // 'margin': ['-top', '-right', '-bottom', '-left'],
    this.each(SHORTHAND_PROPS, function(property, longhands)
    {
        var value       = '';
        var matched     = false;
        var needsDefault = this.in_array(property, needsFilling) || property.includes('border');

        this.each(longhands, function(i, longhand)
        {
            longhand = longhand.startsWith('-') ? property + longhand : longhand;

            var suppliedVal = styles[longhand];

            if (!this.is_undefined(suppliedVal))
            {
                matched = true;
                // Colors get flatted
                if (longhand.includes('-color'))
                {
                    value = suppliedVal;
                }
                else
                {
                    value += suppliedVal + ' ';
                }
            }
            else if (needsDefault)
            {
                this.each(SHORTHAND_DEFAULTS, function(matcher, defaltVal)
                {
                    if (longhand.includes(matcher))
                    {
                        value += ` ${defaltVal} `;
                    }
                });
            }
            
        }, this);

        if (!this.is_empty(value) && matched) ret[property] = value.trim();
        
    }, this);

    return ret;
}