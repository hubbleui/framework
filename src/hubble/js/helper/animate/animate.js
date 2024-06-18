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
        const optionSets = this._animation_factory(AN_DOMElement, options);

        this.each(optionSets, function(i, opts)
        {
            this.animate(AN_DOMElement, opts);

        }, this);

        return;
    }

    const _this = this;

    // Cache variables locally for faster reading / writing
    // Options
    var AN_CSSProperty           =  options.property;
    var AN_easing                =  options.easing;
    var AN_callback              =  options.callback;

    // Mutable options
    var AN_startValue            =  options.startValue;
    var AN_endValue              =  options.endValue;
    var AN_duration              =  options.duration;

    // Internal trackers
    var AN_currentValue          =  options.currentValue;
    var AN_totalDistance         =  options.totalDistance;
    var AN_timeLapsed            =  options.timeLapsed;
    var AN_percentage            =  options.percentage;
    var AN_eventTimeout          =  options.eventTimeout;
    var AN_animationInterval     =  options.animationInterval;
    var AN_CSSPropertyUnits      =  options.CSSPropertyUnits;
    var AN_backwardsAnimation    =  options.backwardsAnimation;
    var AN_animationStepDuration =  options.animationStepDuration;

    // Color specific
    var AN_isColorAnimation      =  AN_CSSProperty.includes('color');
    var AN_colorAnimationStep    =  options.colorAnimationStep;
    var AN_colorAnimationCount   =  options.colorAnimationCount;
    var AN_colorGradientMap      =  options.colorGradientMap;

    /**
     * Initialize
     * 
     * @private
     */
    var init = function()
    {
        if (AN_isColorAnimation)
        {
            AN_endValue   = options.to;
            AN_startValue = options.from || _this.rendered_style(AN_DOMElement, AN_CSSProperty);
            AN_animationStepDuration = 10;

            AN_colorAnimationCount = Math.floor(AN_duration / AN_animationStepDuration);

            AN_colorGradientMap = generateColorGradient(AN_easing);

            startColorAnimation();

            return;
        }

        if (AN_CSSProperty === 'transform')
        {
            

        }

        // We need to set the end value, then remove it and re-apply any inline styles if they
        // existed
        if (options.to === 'auto' || options.to === 'initial' || options.to === 'unset')
        {
            var prevStyle = _this.inline_style(AN_DOMElement, AN_CSSProperty);
            _this.css(AN_DOMElement, AN_CSSProperty, options.to);
            options.to = _this.rendered_style(AN_DOMElement, AN_CSSProperty);
            _this.css(AN_DOMElement, AN_CSSProperty, prevStyle ? prevStyle : false);
        }
       
        AN_endValue           = parseFloat(options.to);
        AN_CSSPropertyUnits   = getValueUnits(options.to);
        AN_startValue         = _this.is_undefined(options.from) ? parseFloat(_this.rendered_style(AN_DOMElement, AN_CSSProperty)) : options.from;
        AN_totalDistance      = Math.abs(AN_endValue - AN_startValue);
        AN_backwardsAnimation = AN_endValue < AN_startValue;
        
        if (AN_endValue === AN_startValue) return;

        startAnimation();
    }

    /**
     * Get value units e.g (px, rem, etc...)
     * 
     * @private
     */
    var getValueUnits = function(value)
    {
        if (_this.is_numeric(value) && AN_CSSProperty !== 'opacity')
        {
            return 'px';
        }

        value = value + '';

        return value.split(/[0-9]/).pop().replaceAll(/[^a-z%]/g, '').trim();
    }

    /**
     * Start animation
     * 
     * @private
     */
    var startAnimation = function()
    {
        clearInterval(AN_animationInterval);

        var _this = this;

        AN_animationInterval = setInterval(function()
        {
            loopAnimation();

        }, AN_animationStepDuration);
    }

    /**
     * Loop animation
     * 
     * @private
     */
    var loopAnimation = function()
    {
        AN_timeLapsed  += AN_animationStepDuration;
        AN_percentage   = (AN_timeLapsed / parseFloat(AN_duration, 10));
        AN_percentage   = (AN_percentage > 1) ? 1 : AN_percentage;
        var change = (AN_totalDistance * easingPattern(AN_easing, AN_percentage));
        AN_currentValue = AN_backwardsAnimation ? AN_startValue - change : AN_startValue + change;

        _this.css(AN_DOMElement, AN_CSSProperty, AN_currentValue + AN_CSSPropertyUnits);
        
        stopAnimation();
    }

    /**
     * Start color animation
     * 
     * @private
     */
    var startColorAnimation = function()
    {
        clearInterval(AN_animationInterval);

        var _this = this;

        AN_animationInterval = setInterval(function()
        {
            loopColorAnimation();

        }, AN_animationStepDuration);
    }

    /**
     * Loop the color animation.
     * 
     * @private
     */
    var loopColorAnimation = function()
    {
        AN_timeLapsed += AN_animationStepDuration;

        const color = AN_colorGradientMap[AN_colorAnimationStep];

        _this.css(AN_DOMElement, AN_CSSProperty, color);

        AN_colorAnimationStep++;

        stopAnimation();
    }

    /**
     * Stop the animation if nessasary.
     * @private
     * 
     */
    var stopAnimation = function()
    {
        AN_currentValue = parseFloat(_this.rendered_style(AN_DOMElement, AN_CSSProperty));

        if (AN_currentValue == AN_endValue || (!AN_backwardsAnimation && AN_currentValue > AN_endValue) || (AN_backwardsAnimation && AN_currentValue <= AN_endValue) || AN_colorAnimationStep > AN_colorAnimationCount || AN_timeLapsed > AN_duration)
        {
            clearInterval(AN_animationInterval);

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
    var generateColorGradient = function(funcName)
    {
        const colors = [];

        const rgbStart = sanitizeColor(AN_startValue);
        const rgbEnd   = sanitizeColor(AN_endValue);

        for (let i = 0; i <= AN_colorAnimationCount; i++)
        {
            const blend = ANIMATION_EASING_FUNCTIONS[funcName](i / AN_colorAnimationCount);
            
            const color = mixColors(rgbStart, rgbEnd, blend);

            colors.push(color);
        }

        return colors;
    }

    init();
}