/**
 * Animation handler
 *
 * @access {private}
 * @param  {node}     el                  Target DOM node
 * @param  {object}   options             Options object
 * @param  {string}   options.property    CSS property
 * @param  {mixed}    options.from        Start value
 * @param  {mixed}    options.to          Ending value
 * @param  {int}      options.duration    Animation duration in MS
 * @param  {string}   options.easing      Easing function in camelCase
 * @param  {function} options.callback    Callback to apply when animation ends (optional)
 */
animate(AN_DOMElement, options)
{
    // args have not been processed
    if (!options.FROM_FACTORY)
    {
        const optionSets = this.__animation_factory(AN_DOMElement, options);

        if (optionSets.length > 1)
        {
            this.each(optionSets, function(i, opts)
            {
                this.animate(AN_DOMElement, opts);

            }, this);

            return;
        }
        else
        {
            options = optionSets[0];
        }
    }

    const _this = this;

    // Local Animation Variables
    var AN_keyframeMap       = [];
    var AN_currentKeyframe   = 0;
    var AN_intervalDelay     = Math.floor(1000 / options.fps);
    var AN_callback          = options.callback;
    var AN_ON_COMPLETE       = () => {};
    var an_intervalTimer;

    const round = (n, dp) => 
    {
        const h = +('1'.padEnd(dp + 1, '0')) // 10 or 100 or 1000 or etc

        return Math.round(n * h) / h;
    }

    /**
     * Initialize
     * 
     * @private
     */
    var init = function()
    {
        if (options.property.includes('transform'))
        {
            AN_keyframeMap = generateTransformKeyframes(options.property, options.from, options.to, options.duration, options.easing, AN_intervalDelay);
        }
        else if (options.property.includes('color') || options.to.startsWith('#') || options.to.startsWith('rgb'))
        {
            AN_keyframeMap = generateColorKeyframes(options.property, options.from, options.to, options.duration, options.easing, AN_intervalDelay);
        }
        else
        {
            AN_keyframeMap = generateKeyFrames(options.property, options.from, options.to, options.duration, options.easing, AN_intervalDelay);
        }

        startAnimation(options.property);
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
    var clearTransitions = function(CSSProperty)
    {
        var transitions    = _this.css_transition_props(AN_DOMElement);
        var css_transition = _this.inline_style(AN_DOMElement, 'transition'); 

        if (_this.is_empty(transitions) || !transitions[CSSProperty]) return;

        transitions[CSSProperty] = '0s linear 0s';

        _this.css(AN_DOMElement, 'transition', _this.join_obj(transitions, ' ', ', '));

        AN_ON_COMPLETE = () => { _this.css(AN_DOMElement, 'transition', !css_transition ? false : css_transition ); };
    }

    /**
     * Start animation
     * 
     * @private
     */
    var startAnimation = function(CSSProperty)
    {
        clearInterval(an_intervalTimer);

        clearTransitions(CSSProperty);

        var _this = this;

        an_intervalTimer = setInterval(function()
        {
            loopAnimation();

        }, AN_intervalDelay);
    }

    /**
     * Loop animation
     * 
     * @private
     */
    var loopAnimation = function()
    {        
        const keyframe = AN_keyframeMap.shift();
        const prop     = Object.keys(keyframe)[0];

        _this.css(AN_DOMElement, prop, keyframe[prop]);

        AN_currentKeyframe++;

        stopAnimation();
    }

    /**
     * Stop the animation if nessasary.
     * @private
     * 
     */
    var stopAnimation = function()
    {
        if (AN_keyframeMap.length === 0)
        {
            clearInterval(an_intervalTimer);

            AN_ON_COMPLETE();

            if (_this.is_function(AN_callback))
            {
                AN_callback(AN_DOMElement);
            }
        }
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
    var easingPattern = function(type, time)
    {
        return ANIMATION_EASING_FUNCTIONS[type].call(null, time) || time;
    }

    /**
     * Sanitize the start and end colors to RGB arrays.
     * 
     * @param  {string} color  hex or rgb color as as string
     * @return {array}
     */
    var sanitizeColor = function(color)
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

    /**
     * Mix 2 colors.
     * 
     * @param  {array}  color1 RGB color array
     * @param  {array}  color2 RGB color array
     * @param  {number} blend % between 0 and 1
     * @return {string} 
     */
    var mixColors = function(color1RGB, color2RGB, blend)
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
     * Generate color gradient
     * 
     * @param  {string} funcName Easing function name
     * @return {array}
     */
    var generateTransformKeyframes = function(CSSProperty, startValue, endValue, duration, easing, keyframeInterval)
    {
        var startValues   = _this.css_transform_props(AN_DOMElement, false);
        var endValues     = _this.css_transform_props(endValue, false);
        var keyFrameCount = Math.floor(duration / keyframeInterval);
        var keyframes     = [];

        // If a start value was specified it gets overwritten as the transform
        // property is singular
        if (startValue)
        {
            startValues = _this.css_transform_props(startValue);
        }

        var baseTransforms = _this.join_obj(_this.map(startValues, (prop, val) => !endValues[prop] ? val : false), '(', ') ') + ')';

        _this.each(endValues, function(propAxis, valueStr)
        {
            var startValStr        = !startValues[propAxis] ? propAxis.includes('scale') ? 1 : 0 : startValues[propAxis];
            var startVal           = _this.css_unit_value(startValStr);
            var endVal             = _this.css_unit_value(valueStr);
            var startUnit          = _this.css_value_unit(startValStr);
            var endUnit            = _this.css_value_unit(valueStr);
            var CSSpropertyUnits   = endUnit;

            if (startUnit !== endUnit)
            {
                // 0 no need to convert
                if (_this.is_empty(startUnit))
                {
                    startUnit = endUnit;
                }
                else
                {
                    if (startUnit !== 'px') startVal = _this.css_to_px(startVal + startUnit, AN_DOMElement, propAxis.includes('Y') ? 'height' : 'width');
                    if (endUnit !== 'px') endVal = _this.css_to_px(endVal + endUnit, AN_DOMElement, propAxis.includes('Y') ? 'height' : 'width');
                    CSSpropertyUnits = 'px';
                }
            }


            var backWardsAnimation = endValue < startValue;
            var totalDistance      = Math.abs(backWardsAnimation ? (startVal - endVal) : (endVal - startVal));
            var propKeyframes      = [];
         

            _this.for(keyFrameCount + 1, function(i)
            {
                let change   = (totalDistance * easingPattern(easing, i / keyFrameCount));
                let keyframe = generateKeyframe('transform', backWardsAnimation ? startVal - change : startVal + change, CSSpropertyUnits, propAxis);

                if (_this.is_undefined(keyframes[i]))
                {
                    keyframe.transform = `${baseTransforms} ${keyframe.transform}`;
                    keyframes[i] = keyframe;
                }
                else
                {
                    keyframes[i].transform += ` ${keyframe.transform}`;
                }
            });
        });

        return keyframes;        
    }

    /**
     * Generate color gradient
     * 
     * @param  {string} easing Easing function name
     * @return {array}
     */
    var generateColorKeyframes = function(CSSProperty, startValue, endValue, duration, easing, keyframeInterval)
    {
        startValue        = options.from || _this.rendered_style(AN_DOMElement, CSSProperty);
        var keyframes     = [];
        var keyFrameCount = Math.floor(duration / keyframeInterval);
        const rgbStart    = sanitizeColor(startValue);
        const rgbEnd      = sanitizeColor(endValue);

        if (rgbStart === rgbEnd) return [];

        for (let i = 0; i <= keyFrameCount; i++)
        {
            const blend = ANIMATION_EASING_FUNCTIONS[easing](i / keyFrameCount);
            
            keyframes.push( { [CSSProperty]: mixColors(rgbStart, rgbEnd, blend) });

        }

        // Incase of not enough keyframes
        if (keyframes[keyframes.length - 1][CSSProperty] !== rgbEnd)
        {
            keyframes.push({ [CSSProperty]: rgbEnd });
        }

        return keyframes;
    }

    

    /**
     * Generate color gradient
     * 
     * @param  {string} funcName Easing function name
     * @return {array}
     */
    var generateKeyframe = function(CSSProperty, value, units, transformAxis)
    {
        var isTransform = CSSProperty === 'transform';
        var prefix = isTransform ? `${transformAxis}(` : '';
        var suffix = units;
        if (isTransform) suffix += ')';
        value = CSSProperty === 'opacity' ? round(value, 5) : round(value, 2);
        
        return { [CSSProperty]:  `${prefix}${value}${suffix}` };
    }

    /**
     * Generate color gradient
     * 
     * @param  {string} funcName Easing function name
     * @return {array}
     */
    var generateKeyFrames = function(CSSProperty, startValue, endValue, duration, easing, keyframeInterval)
    {
        // We need to set the end value, then remove it and re-apply any inline styles if they
        // existed
        if (endValue === 'auto' || endValue === 'initial' || endValue === 'unset')
        {
            var prevStyle = _this.inline_style(AN_DOMElement, CSSProperty);
            _this.css(AN_DOMElement, CSSProperty, endValue);
            endValue = _this.rendered_style(AN_DOMElement, CSSProperty);
            _this.css(AN_DOMElement, CSSProperty, prevStyle ? prevStyle : false);
        }

        startValue             = _this.is_undefined(startValue) ? _this.css_unit_value(_this.rendered_style(AN_DOMElement, CSSProperty)) : startValue;
        endValue               = _this.css_unit_value(endValue);
        var CSSpropertyUnits   = _this.css_value_unit(endValue);
        var backWardsAnimation = endValue < startValue;
        var totalDistance      = Math.abs(backWardsAnimation ? (startValue - endValue) : (endValue - startValue));

        if (endValue === startValue) [];

        var keyframes     = [];
        var keyFrameCount = Math.floor(duration / keyframeInterval);

        for (let i = 0; i <= keyFrameCount; i++)
        {            
            var change = (totalDistance * easingPattern(easing, i / keyFrameCount));

            keyframes.push(generateKeyframe(CSSProperty, backWardsAnimation ? startValue - change : startValue + change, CSSpropertyUnits));
        }

        // Incase match had some issues
        keyframes.push(generateKeyframe(CSSProperty, endValue, CSSpropertyUnits));

        return keyframes;
    }

    init();
}