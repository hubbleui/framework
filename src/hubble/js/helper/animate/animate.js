/**
 * JS Aniamation Core
 *
 * @access {private}
 * @param  {DOMElement} DOMElement          Target DOM node
 * @param  {object}     options             Options object
 * @param  {string}     options.property    CSS property
 * @param  {mixed}      options.from        Start value
 * @param  {mixed}      options.to          Ending value
 * @param  {int}        options.duration    Animation duration in MS
 * @param  {string}     options.easing      Easing function in camelCase
 * @param  {function}   options.callback    Callback to apply when animation ends (optional)
 */
__animate_js(DOMElement, options)
{
    const _helper = this;

    const AnimateJS = function(DOMElement, options)
    {
        this.DOMElement = DOMElement;

        this.options = options;

        this.keyframes = [];

        this.currentKeyframe = 0;

        this.duration = options.duration;

        this.intervalDelay = Math.floor(1000 / options.fps);

        this.keyFrameCount = Math.floor(this.duration / this.intervalDelay) + 1;

        this.intervalTimer = null;

        this.callbacks = [options.callback];

        this.easing = options.easing;

        this.CSSProperty = options.property;

        this.isTransform = this.CSSProperty.toLowerCase().includes('transform');

        this.isColor = options.property.includes('color') || options.to.startsWith('#') || options.to.startsWith('rgb');

        this.parseOptions();

        this.generateKeyframes();
    }

    AnimateJS.prototype.start = function()
    {
        if (this.keyFrameCount === 0) return;

        clearInterval(this.intervalTimer);

        this.clearTransitions();

        var _this = this;

        this.intervalTimer = setInterval(function()
        {
            _this.loop();

        }, this.intervalDelay);

        return this;
    }

    AnimateJS.prototype.loop = function()
    {        
        const keyframe = this.keyframes.shift();
        const prop     = Object.keys(keyframe)[0];

        _helper.css(this.DOMElement, prop, keyframe[prop]);

        this.currentKeyframe++;

        this.stop();
    }

    AnimateJS.prototype.stop = function(force)
    {
        if (this.keyframes.length === 0 || force === true)
        {
            clearInterval(this.intervalTimer);

            this.keyframes = [];

            _helper.each(this.callbacks, function(i, callback)
            {
                if (_helper.is_function(callback))
                {
                    callback(this.DOMElement);
                }
                
            }, this);
        }
    }

    AnimateJS.prototype.parseOptions = function()
    {
        if (this.isTransform)
        {
            this.parseTransformOptions();
        }
        else if (this.isColor)
        {
            this.parseColorOptions();
        }
        else
        {
            this.parseDefaultOptions();
        }
    }

    AnimateJS.prototype.parseDefaultOptions = function()
    {
        var startVal = _helper.is_undefined(this.options.from) ? _helper.rendered_style(this.DOMElement, this.CSSProperty) : this.options.from;
        var endVal   = this.options.to;

        // We need to set the end value, then remove it and re-apply any inline styles if they
        // existed
        if (endVal === 'auto' || endVal === 'initial' || endVal === 'unset')
        {
            let prevStyle = _helper.inline_style(this.DOMElement, this.CSSProperty);

            _helper.css(this.DOMElement, this.CSSProperty, endVal);
            
            endVal = _helper.rendered_style(this.DOMElement, this.CSSProperty);
            
            _helper.css(this.DOMElement, this.CSSProperty, prevStyle ? prevStyle : false);

        }

        var startUnit = _helper.css_value_unit(startVal);
        var endUnit   = _helper.css_value_unit(endVal);

        if (startUnit !== endUnit && this.CSSProperty !== 'opacity')
        {
            if (startUnit !== 'px')
            {
                startVal  = _helper.css_to_px(startVal + startUnit, this.DOMElement, this.CSSProperty);
                startUnit = 'px';
            }
            if (endUnit !== 'px')
            {
                endVal  = _helper.css_to_px(this.options.to, this.DOMElement, this.CSSProperty);
                endUnit = 'px';
            }
        }

        startVal = _helper.css_unit_value(startVal);
        endVal   = _helper.css_unit_value(endVal);

        this.startValue    = _helper.css_unit_value(startVal);
        this.endValue      = _helper.css_unit_value(endVal);
        this.backAnimation = endVal < startVal;
        this.distance      = Math.abs(endVal < startVal ? (startVal - endVal) : (endVal - startVal));
        this.CSSunits      = endUnit;
    }

    AnimateJS.prototype.parseTransformOptions = function()
    {
        var DOMElement    = this.DOMElement;
        var startValues   = _helper.css_transform_props(DOMElement, false);
        var endValues     = _helper.css_transform_props(this.options.to, false);

        // If a start value was specified it gets overwritten as the transform
        // property is singular
        if (this.options.from)
        {
            startValues = _helper.css_transform_props(this.options.from);
        }

        this.CSSProperty    = [];
        this.startValue     = [];
        this.endValue       = [];
        this.CSSunits       = [];
        this.backAnimation  = [];
        this.distance       = [];
        this.baseTransforms = _helper.is_empty(startValues) ? '' : _helper.join_obj(_helper.map(startValues, (prop, val) => !endValues[prop] ? val : false), '(', ') ', false, false);

        _helper.each(endValues, function(propAxis, valueStr)
        {
            var startValStr        = !startValues[propAxis] ? (propAxis.includes('scale') ? '1' : '0') : startValues[propAxis];
            var startVal           = _helper.css_unit_value(startValStr);
            var endVal             = _helper.css_unit_value(valueStr);
            var startUnit          = _helper.css_value_unit(startValStr);
            var endUnit            = _helper.css_value_unit(valueStr);
            var CSSpropertyUnits   = endUnit;

            if (startUnit !== endUnit)
            {
                // 0 no need to convert
                if (_helper.is_empty(startUnit))
                {
                    startUnit = endUnit;
                }
                else
                {
                    if (startUnit !== 'px') startVal = _helper.css_to_px(startVal + startUnit, DOMElement, propAxis.includes('Y') ? 'height' : 'width');
                    if (endUnit !== 'px') endVal = _helper.css_to_px(endVal + endUnit, DOMElement, propAxis.includes('Y') ? 'height' : 'width');
                    CSSpropertyUnits = 'px';
                }
            }

            this.CSSProperty.push(propAxis);
            this.CSSunits.push(endUnit);
            this.endValue.push(endVal);
            this.startValue.push(startVal);
            this.backAnimation.push(endVal < startVal);
            this.distance.push(Math.abs(endVal < startVal ? (startVal - endVal) : (endVal - startVal)));

        }, this);
    }

    AnimateJS.prototype.parseColorOptions = function()
    {
        this.startValue = this.sanitizeColor(this.options.from || _helper.rendered_style(this.DOMElement, this.CSSProperty));
        this.endValue   = this.sanitizeColor(this.options.to);
    }

    /**
     * Sanitize the start and end colors to RGB arrays.
     * 
     * @param  {string} color  hex or rgb color as as string
     * @return {array}
     */
    AnimateJS.prototype.sanitizeColor = function(color)
    {
        if (color.startsWith('rgb('))
        {
            return color.split(' ', 3).map((x) => parseInt(x.replaceAll(/[^\d+]/g, '')));
        }
        else if (color.length === 7 )
        {
            let rgb = [];

            color.match(/#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i).forEach((item) =>
            {
                if (item.length === 2)
                {
                    const color = parseInt(item, 16);

                    rgb.push(color);
                }
            });

            return rgb;
        }
    }

    AnimateJS.prototype.generateKeyframes = function()
    {    
        if (_helper.is_equal(this.startValue, this.endValue))
        {
            this.keyFrameCount = 0;

            return;
        }

        if (this.isTransform)
        {
            _helper.for(this.endValue, function(transformIndex)
            {
                _helper.for(this.keyFrameCount, function(index)
                {
                    this.keyframes.push(this.generateKeyframe(index, transformIndex));
                    
                }, this);
                
            }, this);

            return;
        }

        _helper.for(this.keyFrameCount, function(index)
        {
            this.keyframes.push(this.generateKeyframe(index));
            
        }, this);
    }

    AnimateJS.prototype.generateKeyframe = function(index, transformIndex)
    {
        if (this.isColor)
        {
            const change = this.tween(this.easing, (index / this.keyFrameCount));
            
            return { [this.CSSProperty]: this.mixColors(this.startValue, this.endValue, change) };
        }
        
        const backAnimation = this.isTransform ? this.backAnimation[transformIndex] : this.backAnimation;

        const startValue = this.isTransform ? this.startValue[transformIndex] : this.startValue;

        const distance = this.isTransform ? this.distance[transformIndex] : this.distance;

        const change = (distance * this.tween(this.easing, (index / this.keyFrameCount)));

        const keyVal = this.roundNumber(backAnimation ? startValue - change : startValue + change, 5);

        var property = this.isTransform ? 'transform' : this.CSSProperty;

        var prefix  = this.isTransform ? `${this.CSSProperty[transformIndex]}(` : '';

        var suffix  = this.isTransform ? `${this.CSSunits[transformIndex]})` : this.CSSunits;
        
        var keyframe = { [property]:  `${prefix}${keyVal}${suffix}` };
        
        if (this.isTransform && _helper.is_undefined(this.keyframes[index]))
        {
            keyframe[property] = `${this.baseTransforms} ${keyframe[property]}`.trim();
        }

        return keyframe;
    }

    /**
     * Mix 2 colors.
     * 
     * @param  {array}  color1 RGB color array
     * @param  {array}  color2 RGB color array
     * @param  {number} blend % between 0 and 1
     * @return {string} 
     */
    AnimateJS.prototype.mixColors = function(color1RGB, color2RGB, blend)
    {
        function linearInterpolation(y1, y2, x)
        {
            return Math.round(x * (y2 - y1) + y1);
        }
        
        const colorRGB  = [];

        color1RGB.forEach((c1, index) =>
        {
            const mixedColor = linearInterpolation(c1, color2RGB[index], blend);

            colorRGB.push(mixedColor);
        });

        return 'rgb(' + colorRGB + ')';
    }

    /**
     * Calculate the easing pattern.
     * 
     * @private
     * @link    {https://gist.github.com/gre/1650294}
     * @param   {String} type Easing pattern
     * @param   {Number} time Time animation should take to complete
     * @returns {Number}
     */
    AnimateJS.prototype.clearTransitions = function()
    {        
        var CSSProperty    = this.isTransform ? 'transform' : this.CSSProperty;
        var transitions    = _helper.css_transition_props(this.DOMElement);
        var css_transition = _helper.inline_style(this.DOMElement, 'transition'); 

        if (_helper.is_empty(transitions) || !transitions[CSSProperty]) return;

        transitions[CSSProperty] = '0s linear 0s';

        _helper.css(this.DOMElement, 'transition', _helper.join_obj(transitions, ' ', ', '));

        this.callbacks.push(() => { _helper.css(this.DOMElement, 'transition', !css_transition ? false : css_transition ); });

    }

    AnimateJS.prototype.roundNumber = (n, dp) => 
    {
        const h = +('1'.padEnd(dp + 1, '0')) // 10 or 100 or 1000 or etc

        return Math.round(n * h) / h;
    }

    /**
     * Calculate the easing pattern.
     * 
     * @private
     * @link    {https://gist.github.com/gre/1650294}
     * @param   {String} type Easing pattern
     * @param   {Number} time Time animation should take to complete
     * @returns {Number}
     */
    AnimateJS.prototype.tween = function(type, time)
    {
        return ANIMATION_EASING_FUNCTIONS[type].call(null, time) || time;
    }

    return (new AnimateJS(DOMElement, options)).start();
    
}