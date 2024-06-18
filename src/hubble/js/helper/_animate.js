/**
 * Helper Animation component
 *
 * @author    {Joe J. Howard}
 * @copyright {Joe J. Howard}
 * @license   {https://github.com/kanso-cms/cms/blob/master/LICENSE}
 */

(function()
{
    /**
     * Math Contstansts.
     * 
     * @var {mixed}
     */
    const POW  = Math.pow;
    const SQRT = Math.sqrt;
    const SIN  = Math.sin;
    const COS  = Math.cos;
    const PI   = Math.PI;
    const C1   = 1.70158;
    const C2   = C1 * 1.525;
    const c3   = C1 + 1;
    const C4   = (2 * PI) / 3;
    const C5   = (2 * PI) / 4.5;

    /**
     * bounceOut function.
     * 
     * @var {function}
     */
    const bounceOut = function (x)
    {
        const n1 = 7.5625;
        const d1 = 2.75;

        if (x < 1 / d1)
        {
            return n1 * x * x;
        }
        else if (x < 2 / d1)
        {
            return n1 * (x -= 1.5 / d1) * x + 0.75;
        }
        else if (x < 2.5 / d1)
        {
            return n1 * (x -= 2.25 / d1) * x + 0.9375;
        }
        else
        {
            return n1 * (x -= 2.625 / d1) * x + 0.984375;
        }
    };

    /**
     * Easing functions.
     * 
     * @var {object}
     */
    const EASING_FUNCTIONS = 
    {
        linear: (x) => x,
        ease: function (x)
        {
            return x < 0.5 ? 4 * x * x * x : 1 - POW(-2 * x + 2, 3) / 2;
        },
        easeIn: function (x)
        {
            return 1 - COS((x * PI) / 2);
        },
        easeOut: function (x)
        {
            return SIN((x * PI) / 2);
        },
        easeInOut: function (x)
        {
            return -(COS(PI * x) - 1) / 2;
        },
        easeInQuad: function (x)
        {
            return x * x;
        },
        easeOutQuad: function (x)
        {
            return 1 - (1 - x) * (1 - x);
        },
        easeInOutQuad: function (x)
        {
            return x < 0.5 ? 2 * x * x : 1 - POW(-2 * x + 2, 2) / 2;
        },
        easeInCubic: function (x)
        {
            return x * x * x;
        },
        easeOutCubic: function (x)
        {
            return 1 - POW(1 - x, 3);
        },
        easeInOutCubic: function (x)
        {
            return x < 0.5 ? 4 * x * x * x : 1 - POW(-2 * x + 2, 3) / 2;
        },
        easeInQuart: function (x)
        {
            return x * x * x * x;
        },
        easeOutQuart: function (x)
        {
            return 1 - POW(1 - x, 4);
        },
        easeInOutQuart: function (x)
        {
            return x < 0.5 ? 8 * x * x * x * x : 1 - POW(-2 * x + 2, 4) / 2;
        },
        easeInQuint: function (x)
        {
            return x * x * x * x * x;
        },
        easeOutQuint: function (x)
        {
            return 1 - POW(1 - x, 5);
        },
        easeInOutQuint: function (x)
        {
            return x < 0.5 ? 16 * x * x * x * x * x : 1 - POW(-2 * x + 2, 5) / 2;
        },
        easeInSine: function (x)
        {
            return 1 - COS((x * PI) / 2);
        },
        easeOutSine: function (x)
        {
            return SIN((x * PI) / 2);
        },
        easeInOutSine: function (x)
        {
            return -(COS(PI * x) - 1) / 2;
        },
        easeInExpo: function (x)
        {
            return x === 0 ? 0 : POW(2, 10 * x - 10);
        },
        easeOutExpo: function (x)
        {
            return x === 1 ? 1 : 1 - POW(2, -10 * x);
        },
        easeInOutExpo: function (x)
        {
            return x === 0
                ? 0
                : x === 1
                ? 1
                : x < 0.5
                ? POW(2, 20 * x - 10) / 2
                : (2 - POW(2, -20 * x + 10)) / 2;
        },
        easeInCirc: function (x)
        {
            return 1 - SQRT(1 - POW(x, 2));
        },
        easeOutCirc: function (x)
        {
            return SQRT(1 - POW(x - 1, 2));
        },
        easeInOutCirc: function (x)
        {
            return x < 0.5
                ? (1 - SQRT(1 - POW(2 * x, 2))) / 2
                : (SQRT(1 - POW(-2 * x + 2, 2)) + 1) / 2;
        },
        easeInBack: function (x)
        {
            return c3 * x * x * x - C1 * x * x;
        },
        easeOutBack: function (x)
        {
            return 1 + c3 * POW(x - 1, 3) + C1 * POW(x - 1, 2);
        },
        easeInOutBack: function (x)
        {
            return x < 0.5
                ? (POW(2 * x, 2) * ((C2 + 1) * 2 * x - C2)) / 2
                : (POW(2 * x - 2, 2) * ((C2 + 1) * (x * 2 - 2) + C2) + 2) / 2;
        },
        easeInElastic: function (x)
        {
            return x === 0
                ? 0
                : x === 1
                ? 1
                : -POW(2, 10 * x - 10) * SIN((x * 10 - 10.75) * C4);
        },
        easeOutElastic: function (x)
        {
            return x === 0
                ? 0
                : x === 1
                ? 1
                : POW(2, -10 * x) * SIN((x * 10 - 0.75) * C4) + 1;
        },
        easeInOutElastic: function (x)
        {
            return x === 0
                ? 0
                : x === 1
                ? 1
                : x < 0.5
                ? -(POW(2, 20 * x - 10) * SIN((20 * x - 11.125) * C5)) / 2
                : (POW(2, -20 * x + 10) * SIN((20 * x - 11.125) * C5)) / 2 + 1;
        },
        easeInBounce: function (x)
        {
            return 1 - bounceOut(1 - x);
        },
        easeOutBounce: bounceOut,
        easeInOutBounce: function (x)
        {
            return x < 0.5
                ? (1 - bounceOut(1 - 2 * x)) / 2
                : (1 + bounceOut(2 * x - 1)) / 2;
        },
    };

    /**
     * Helper library.
     * 
     * @var {object}
     */
    _ = Container.get('Helper');

    /**
     * Default options.
     * 
     * @var {object}
     */
    const DEFAULT_OPTIONS =
    {
        // Options
        //'property', 'from', 'to'
        easing:               'ease',
        callback:              function() { console.log('complete'); },

        // Mutable options
        startValue:           null,
        endValue:             null,
        duration:             500,

        // Internal trackers
        currentValue:          null,
        totalDistance:         null,
        timeLapsed:            0,
        percentage:            0,
        eventTimeout:          null,
        animationInterval:     null,
        CSSPropertyUnits:      '',
        backwardsAnimation:    false,
        animationStepDuration: 16,

        // Color specific
        isColorAnimation:      false,
        colorAnimationStep:    0,
        colorAnimationCount:   50,
        colorGradientMap:      []
    };

    /**
     * Allowed Options.
     * 
     * @var {array}
     */
    const ALLOWED_OPTIONS = ['property', 'from', 'to', 'duration', 'easing', 'callback'];

    /**
     * Allowed Options.
     * 
     * @var {array}
     */
    const FILTER_OPTIONS = _.array_merge([], Object.keys(DEFAULT_OPTIONS), ALLOWED_OPTIONS);

    /**
     * Animation factory.
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
     * Options can be provided three ways:
     * 
     * 1. Flat object with single property
     *      animate(el, { height: '500px', easing 'easeOut' })
     * 
     * 2. Flat Object with multiple properties 
     *      Note this way you can only animate from the existing rendered element style (you cannot provide a 'from' value)
     *      animate(el, { height: '500px', width: '500px', easing 'easeOut' })
     * 
     * 3. Multi object with different options per property
     *      animate(el, { height:{ from: '100px', to: '500px', easing: 'easeInOutElastic'}, opacity:{ to: 0, easing: 'linear'} } );
     * 
     */
    var AnimationFactory = function(DOMElement, opts)
    {
        var optionSets = [];

        _.each(opts, function(key, val)
        {
            // AnimationFactory('foo', { property : 'left', from : '-300px', to: '0',  easing: 'easeInOutElastic', duration: 3000} );
            if (key === 'property')
            {
                var options = _.array_merge({}, DEFAULT_OPTIONS, opts);

                options.property = val;
                options.el = DOMElement;

                optionSets.push(options);

                // break
                return false;
            }
            
            else if (!_.in_array(key, ALLOWED_OPTIONS))
            {
                // Only worth adding if the property is vavlid
                var camelProp = _.css_prop_to_camel_case(key);
                
                if (!_.is_undefined(document.body.style[camelProp]))
                {
                    var isObjSet = _.is_object(val);
                    
                    if (!isObjSet)
                    {
                        opts.to = val;
                    }

                    // AnimationFactory('foo', { height: { from: '100px', to: '500px', easing: 'easeInOutElastic'}, opacity:{ to: 0, easing: 'linear'} } );
                    var options = _.array_merge({}, DEFAULT_OPTIONS, _.is_object(val) ? val : opts);

                    options.property = key;
                    options.el = DOMElement;
                    optionSets.push(options);
                }
            }
        });

        _.each(optionSets, function(i, options)
        {
            // Not nessaray, but sanitize out redundant options
            var _options = _.map(options, function(key, val)
            {
                return _.in_array(key, FILTER_OPTIONS) ? val : false;
            });

            // This
            Animate(DOMElement, _options);
        });

        return;

        console.error('Animation Error: Either no CSS property(s) was provided or the provided property(s) is unsupported.');
    }

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
    var Animate = function(AN_DOMElement, options)
    {
        /**
         * Get value units e.g (px, rem, etc...)
         * 
         * @private
         */
        var getValueUnits = function(value)
        {
            if (_.is_numeric(value) && AN_CSSProperty !== 'opacity')
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

            _.css(AN_DOMElement, AN_CSSProperty, AN_currentValue + AN_CSSPropertyUnits);
            
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

            _.css(AN_DOMElement, AN_CSSProperty, color);

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
            AN_currentValue = parseFloat(_.rendered_style(AN_DOMElement, AN_CSSProperty));

            if (AN_currentValue == AN_endValue || (!AN_backwardsAnimation && AN_currentValue > AN_endValue) || (AN_backwardsAnimation && AN_currentValue <= AN_endValue) || AN_colorAnimationStep > AN_colorAnimationCount || AN_timeLapsed > AN_duration)
            {
                clearInterval(AN_animationInterval);

                if (_.is_function(AN_callback))
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
            return EASING_FUNCTIONS[type].call(null, time) || time;
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
                const blend = EASING_FUNCTIONS[funcName](i / AN_colorAnimationCount);
                
                const color = mixColors(rgbStart, rgbEnd, blend);

                colors.push(color);
            }

            return colors;
        }

        /**
         * Generate color gradient
         * 
         * @param  {string} funcName Easing function name
         * @return {array}
         */
        var animateCSS = function(funcName)
        {

        }

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

        if (AN_isColorAnimation)
        {
            AN_endValue   = options.to;
            AN_startValue = options.from || _.rendered_style(AN_DOMElement, AN_CSSProperty);
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
            var prevStyle = _.inline_style(AN_DOMElement, AN_CSSProperty);
            _.css(AN_DOMElement, AN_CSSProperty, options.to);
            options.to = _.rendered_style(AN_DOMElement, AN_CSSProperty);
            _.css(AN_DOMElement, AN_CSSProperty, prevStyle ? prevStyle : false);
        }
       
        AN_endValue           = parseFloat(options.to);
        AN_CSSPropertyUnits   = getValueUnits(options.to);
        AN_startValue         = _.is_undefined(options.from) ? parseFloat(_.rendered_style(AN_DOMElement, AN_CSSProperty)) : options.from;
        AN_totalDistance      = Math.abs(AN_endValue - AN_startValue);
        AN_backwardsAnimation = AN_endValue < AN_startValue;
        
        if (AN_endValue === AN_startValue) return;

        startAnimation();
    }

    _.animate = function()
    {
        var args = arguments;

        AnimationFactory(...args);
    }
      
}());