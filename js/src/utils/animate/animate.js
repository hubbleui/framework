const AnimateJS = function(DOMElement, options)
{
    this.DOMElement = DOMElement;

    this.options = options;

    this.keyframes = [];

    this.currentKeyframe = 0;

    this.duration = options.duration;

    this.intervalDelay = Math.floor(1000 / options.fps);

    this.keyFrameCount = Math.floor(this.duration / this.intervalDelay) + 1;

    this.easing = options.easing;

    this.CSSProperty = options.property;

    this.isTransform = this.CSSProperty.toLowerCase().includes('transform');

    this.isScroll = this.CSSProperty.toLowerCase().replace('-', '') === 'scrollto' && DOMElement === window;

    this.isColor = options.property.includes('color') || options.to.startsWith('#') || options.to.startsWith('rgb');

    this.clearAnimating(DOMElement);

    this.parseOptions();

    this.generateKeyframes();

    this.stopped = true;

    return this;
}

AnimateJS.prototype.clearAnimating = function(DOMElement)
{
    const CSSprop = this.CSSProperty;

    _THIS.each(ANIMATING, function(i, animation)
    {
        if (animation.CSSProperty === CSSprop && animation.DOMElement === DOMElement)
        {
            animation.stop();

            ANIMATING.splice(i, 1);

            return false;
        }
    });
}

AnimateJS.prototype.start = function()
{
    if (this.keyFrameCount === 0) return;

    this.stopped = false;

    if (!this.isScroll) this.clearTransitions();

    if (this.options.start) this.options.start(this.DOMElement);

    const loop = () =>
    {        
        if (this.stopped) return;

        this._applyKeyframe(this.keyframes.shift());

        if (this.keyframes.length === 0)
        {            
            this._complete();

            return;
        }

        setTimeout(loop, this.intervalDelay);
    }

    loop();

    this._failTimer = setTimeout(() =>
    {            
        if (this.options.fail) this.options.fail(this.DOMElement);

    }, this.duration + 50 );

    ANIMATING.push(this);

    return this;
}

AnimateJS.prototype._applyKeyframe = function(keyframe)
{
    if (!keyframe) return;

    let prop = Object.keys(keyframe)[0];

    this.isScroll ? window.scrollTo(keyframe[0], keyframe[1]) : _THIS.css(this.DOMElement, prop, keyframe[prop]);
}

AnimateJS.prototype._complete = function()
{
    clearTimeout(this._failTimer);

    _THIS.each(ANIMATING, (i, animation) =>
    {
        if (animation === this)
        {
            ANIMATING.splice(i, 1);

            return false;
        }
    });

    let DOMElement = this.DOMElement;

    if (this.options.complete) this.options.complete(DOMElement);

    if (this.options.callback) this.options.callback(DOMElement);

    if (!this.isScroll) _THIS.css(DOMElement, 'transition', this._pre_transition );
}

AnimateJS.prototype.stop = function()
{
    this.stopped = true;

    clearTimeout(this._failTimer);

    return this;
}

AnimateJS.prototype.parseOptions = function()
{
    if (this.isScroll)
    {
        this.parseScrollOptions();
    }
    else if (this.isTransform)
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

AnimateJS.prototype.parseScrollOptions = function()
{
    if (!this.options.to.includes(','))
    {
        throw new Error('Invalid scroll value. Animating scroll should be provided as [Y, X].');
    }

    // We ignore 'from'
    let startY = window.scrollY;
    let startX = window.scrollX;
    let endX   = parseInt(this.options.to.split(',').shift().trim());
    let endY   = parseInt(this.options.to.split(',').pop().trim());
    let distX  = Math.abs(endX < startX ? (startX - endX) : (endX - startX))
    let distY  = Math.abs(endY < startY ? (startY - endY) : (endY - startY))

    this.startValue    = [startX, startY];
    this.endValue      = [endX, endY];
    this.backAnimation = [endX < startX, endY < startY];
    this.distance      = [distX, distY] ;
    this.CSSunits      = '';
}

AnimateJS.prototype.parseDefaultOptions = function()
{
    var startVal = _THIS.is_undefined(this.options.from) ? _THIS.rendered_style(this.DOMElement, this.CSSProperty) : this.options.from;
    var endVal   = this.options.to;

    // We need to set the end value, then remove it and re-apply any inline styles if they
    // existed
    if (endVal === 'auto' || endVal === 'initial' || endVal === 'unset')
    {
        let prevStyle = _THIS.inline_style(this.DOMElement, this.CSSProperty);

        _THIS.css(this.DOMElement, this.CSSProperty, endVal);
        
        endVal = _THIS.rendered_style(this.DOMElement, this.CSSProperty);
        
        _THIS.css(this.DOMElement, this.CSSProperty, prevStyle ? prevStyle : false);
    }

    // From auto
    if (startVal === 'auto' || startVal === 'initial')
    {
        startVal = _THIS.rendered_style(this.DOMElement, this.CSSProperty);
    }

    var startUnit = _THIS.css_value_unit(startVal);
    var endUnit   = _THIS.css_value_unit(endVal);

    if (startUnit !== endUnit && this.CSSProperty !== 'opacity')
    {
        if (startUnit !== 'px')
        {
            startVal  = _THIS.css_to_px(startVal + startUnit, this.DOMElement, this.CSSProperty);
            startUnit = 'px';
        }
        if (endUnit !== 'px')
        {
            endVal  = _THIS.css_to_px(this.options.to, this.DOMElement, this.CSSProperty);
            endUnit = 'px';
        }
    }

    startVal = _THIS.css_unit_value(startVal);
    endVal   = _THIS.css_unit_value(endVal);

    this.startValue    = _THIS.css_unit_value(startVal);
    this.endValue      = _THIS.css_unit_value(endVal);
    this.backAnimation = endVal < startVal;
    this.distance      = Math.abs(endVal < startVal ? (startVal - endVal) : (endVal - startVal));
    this.CSSunits      = endUnit;
}

AnimateJS.prototype.parseTransformOptions = function()
{
    var DOMElement    = this.DOMElement;
    var startValues   = _THIS.css_transform_props(DOMElement, false);
    var endValues     = _THIS.css_transform_props(this.options.to, false);

    // If a start value was specified it gets overwritten as the transform
    // property is singular
    if (this.options.from)
    {
        startValues = _THIS.css_transform_props(this.options.from);
    }

    this.CSSProperty    = [];
    this.startValue     = [];
    this.endValue       = [];
    this.CSSunits       = [];
    this.backAnimation  = [];
    this.distance       = [];
    this.baseTransforms = _THIS.is_empty(startValues) ? '' : _THIS.join_obj(_THIS.map(startValues, (prop, val) => !endValues[prop] ? val : false), '(', ') ', false, false);

    _THIS.each(endValues, function(propAxis, valueStr)
    {
        var startValStr        = !startValues[propAxis] ? (propAxis.includes('scale') ? '1' : '0') : startValues[propAxis];
        var startVal           = _THIS.css_unit_value(startValStr);
        var endVal             = _THIS.css_unit_value(valueStr);
        var startUnit          = _THIS.css_value_unit(startValStr);
        var endUnit            = _THIS.css_value_unit(valueStr);
        var CSSpropertyUnits   = endUnit;

        if (startUnit !== endUnit)
        {
            // 0 no need to convert
            if (_THIS.is_empty(startUnit))
            {
                startUnit = endUnit;
            }
            else
            {
                if (startUnit !== 'px') startVal = _THIS.css_to_px(startVal + startUnit, DOMElement, propAxis.includes('Y') ? 'height' : 'width');
                if (endUnit !== 'px') endVal = _THIS.css_to_px(endVal + endUnit, DOMElement, propAxis.includes('Y') ? 'height' : 'width');
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
    this.startValue = this.sanitizeColor(this.options.from || _THIS.rendered_style(this.DOMElement, this.CSSProperty));
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
    if (_THIS.is_equal(this.startValue, this.endValue))
    {
        this.keyFrameCount = 0;

        return;
    }

    if (this.isScroll)
    {
        _THIS.for(this.keyFrameCount, function(index)
        {
            let x = this.generateKeyframe(index, 0);
            let y = this.generateKeyframe(index, 1);

            this.keyframes.push([x, y]);
                            
        }, this);

        // Fallback
        this.keyframes.push([this.endValue[0], this.endValue[1]]);

        return;
    }

    if (this.isTransform)
    {
        _THIS.for(this.endValue, function(transformIndex)
        {
            _THIS.for(this.keyFrameCount, function(index)
            {
                this.keyframes.push(this.generateKeyframe(index, transformIndex));
                
            }, this);
            
        }, this);

        return;
    }

    _THIS.for(this.keyFrameCount, function(index)
    {
        this.keyframes.push(this.generateKeyframe(index));
        
    }, this);

    // Failsafe
    if (this.keyframes[this.keyFrameCount -1][this.CSSProperty] !== `${this.endValue}${this.CSSunits}`)
    {
        this.keyframes.push({[this.CSSProperty]: `${this.endValue}${this.CSSunits}`});
    }
}

AnimateJS.prototype.generateKeyframe = function(index, transformIndex)
{
    if (this.isColor)
    {
        const change = this.tween(this.easing, (index / this.keyFrameCount));
        
        return { [this.CSSProperty]: this.mixColors(this.startValue, this.endValue, change) };
    }
    
    const backAnimation = this.isTransform || this.isScroll ? this.backAnimation[transformIndex] : this.backAnimation;

    const startValue = this.isTransform || this.isScroll ? this.startValue[transformIndex] : this.startValue;

    const distance = this.isTransform || this.isScroll ? this.distance[transformIndex] : this.distance;

    const change = (distance * this.tween(this.easing, (index / this.keyFrameCount)));

    const keyVal = this.roundNumber(backAnimation ? startValue - change : startValue + change, this.CSSProperty === 'opacity' ? 5 : 1);

    var property = this.isTransform ? 'transform' : this.CSSProperty;

    var prefix  = this.isTransform ? `${this.CSSProperty[transformIndex]}(` : '';

    var suffix  = this.isTransform ? `${this.CSSunits[transformIndex]})` : this.CSSunits;
    
    var keyframe = { [property]:  `${prefix}${keyVal}${suffix}` };
    
    if (this.isScroll)
    {
        return keyVal;
    }

    if (this.isTransform && _THIS.is_undefined(this.keyframes[index]))
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
    var transitions    = _THIS.css_transition_props(this.DOMElement);
    var css_transition = _THIS.inline_style(this.DOMElement, 'transition'); 

    if (_THIS.is_empty(transitions) || !transitions[CSSProperty]) return;

    transitions[CSSProperty] = '0s linear 0s';

    _THIS.css(this.DOMElement, 'transition', _THIS.join_obj(transitions, ' ', ', '));

    this._pre_transition = !css_transition ? false : css_transition;
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

_.prototype.__animate_js = function(DOMElement, options)
{
    return (new AnimateJS(DOMElement, options)).start();
}