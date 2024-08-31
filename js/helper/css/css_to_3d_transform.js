/**
 * Returns an object of CSS transitions by transition property as keys.
 *
 * @param  {string} transforms A CSS transform value e.g translateY(300px) 
 * @return {object}
 */
_.prototype.css_to_3d_transform = function(transformsStr)
{        
    var transforms = {};

    var _this = this;

    /**
     * Get value number
     * 
     * @private
     */
    var getPropValue = function(value)
    {
        if (_this.is_numeric(value))
        {
            return parseFloat(value);
        }

        if (_this.is_empty(value))
        {
            return 0;
        }

        return parseFloat(value.replaceAll(/[^0-9-.]/g, ''));
    }

    if (transformsStr.includes('matrix'))
    {
        return transformsStr;
    }

    // Split into object
    this.each(transformsStr.trim().split(')'), function(i, transform)
    {
        transform = transform.trim();

        if (transform === '') return;

        transform      = transform.split('(');
        var prop       = transform.shift().trim();
        var value      = transform.pop().trim();
        var values     = value.split(',').map((x) => x.trim());
        var valueCount = CSS_TRANSFORM_VALUES_COUNT[prop];

        if (prop === 'perspective')
        {
            transforms.perspective = values[0];
        }
        else if (valueCount === 1 || valueCount === 2)
        {
            var initialVal = prop === 'scale' ? 1 : 0;
            var name3d     = valueCount === 1 ? `${prop.slice(0,-1)}3d` : `${prop}3d`;
                name3d     = name3d.includes('skew') ? 'skew' : name3d;
                name3d     = name3d === 'rotat3d' ? 'rotate3d' : name3d;
            var key        = CSS_3D_TRANSFORM_MAP_KEYS[prop.slice(-1).toLowerCase()];
            
            if (this.is_empty(transforms[name3d]))
            {
                transforms[name3d] = CSS_3D_TRANSFORM_DEFAULTS[name3d];
            }
            
            if (prop === 'rotate')
            {
                transforms.rotate3d[3] = values[0];
            }
            else
            {
                this.each(values, function(i, value)
                {
                    var compValue = parseFloat(value.replaceAll(/[^0-9]-/g, ''));

                    if (getPropValue(value) !== initialVal)
                    {
                        transforms[name3d][!key ? i : key] = value;
                    }
                });
            }
        }
        else 
        {
            transforms[prop] = values;
        }

    }, this);

    return transforms;
}