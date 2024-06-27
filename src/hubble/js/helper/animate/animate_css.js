/**
 * CSS Animation.
 *
 * @access {private}
 * @param  {DOMElement}     DOMElement          Target DOM node
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
__animate_css(DOMElement, options)
{    
    const _helper = this;

    var _this;

    const AnimateCss = function(DOMElement, options)
    {        
        _this = this;

        this.DOMElement = DOMElement;

        this.options = options;

        this.animatedProps = {};

        this.animatedTransitions = {};

        this.preAnimatedTransitions = {};

        this.callback = null;

        this.preProcessStartEndValues();

        return this;
    };

    /**
     * Start animation.
     *
     */
    AnimateCss.prototype.start = function()
    {
        this.applyStartValues();

        this.applyTransitions();

        DOMElement.addEventListener('transitionend', this.on_complete, true);

        this.applyEndValues();

        return this;
    }

    /**
     * Stop animation.
     *
     */
    AnimateCss.prototype.stop = function()
    {
        DOMElement.removeEventListener('transitionend', _this.on_complete, true);

        _helper.css(DOMElement, 'transition', this.preAnimatedTransitions);
    }

    /**
     * Stop animation and destroy.
     *
     */
    AnimateCss.prototype.destory = function()
    {
        this.stop();

        this.animatedProps = {};

        this.animatedTransitions = {};

        this.preAnimatedTransitions = {};

        this.callback = null;
    }

    /**
     * On transition end.
     * 
     * Note if a multiple animation properties wer supplied
     * we only want to call the callback once when all transitions
     * have completed.
     *
     * @param  {Event} e transitionEnd event
     */
    AnimateCss.prototype.on_complete = function(e)
    {        
        e = e || window.event;

        var prop = _helper.css_prop_to_hyphen_case(e.propertyName);

        if (prop === 'background-color') prop = 'background';

        // Change inline style back to auto
        let endVal = _this.animatedProps[prop];
        if (endVal === 'auto' || endVal === 'initial' || endVal === 'unset') _helper.css(DOMElement, prop, endVal);

        delete _this.animatedTransitions[prop];

        delete _this.animatedProps[prop];
        
        var completed = _helper.is_empty(_this.animatedProps);

        var transition = completed ? _this.preAnimatedTransitions : _helper.join_obj(_this.animatedTransitions, ' ', ', ');

        _helper.css(DOMElement, 'transition', _this.preAnimatedTransitions);

        if (completed)
        {
            DOMElement.removeEventListener('transitionend', _this.on_complete, true);
            
            if (_helper.is_function(_this.callback))
            {
                _this.callback(_this.DOMElement);
            }
        }
    }

    /**
     * Checks for "auto" transtions.
     * 
     */
    AnimateCss.prototype.preProcessStartEndValues = function()
    {
        var DOMElement = this.DOMElement;
        
        // We need to set the end value explicitly as these values will not
        // transition with CSS
        _helper.each(this.options, function(i, option)
        {
            let startValue  = option.from;
            let endValue    = option.to;
            let CSSProperty = option.property;

            if (startValue === 'auto' || startValue === 'initial' || startValue === 'unset' || !startValue)
            {
                this.options[i].from = _helper.rendered_style(DOMElement, CSSProperty);
            }

            if (endValue === 'auto' || endValue === 'initial' || endValue === 'unset')
            {
                var inlineStyle = _helper.inline_style(DOMElement, CSSProperty);

                _helper.css(DOMElement, CSSProperty, endValue);

                this.options[i].to = _helper.rendered_style(DOMElement, CSSProperty);

                _helper.css(DOMElement, CSSProperty, inlineStyle ? inlineStyle : false);
            }

            this.animatedProps[CSSProperty] = endValue;
        
        }, this);
    }

    /**
     * Apply start values.
     * 
     */
    AnimateCss.prototype.applyStartValues = function()
    {
        var styles = {};

        _helper.each(this.options, function(i, option)
        {
            if (option.from)
            {
                styles[option.property] = option.from;
            }
        });

        if (!_helper.is_empty(styles)) _helper.css(this.DOMElement, styles);
    }

    /**
     * Apply animation transitions.
     * 
     */
    AnimateCss.prototype.applyTransitions = function()
    {
        this.preAnimatedTransitions  = _helper.inline_style(this.DOMElement, 'transition');
        this.preAnimatedTransitions  = !this.preAnimatedTransitions ? false : this.preAnimatedTransitions;
        this.animatedTransitions     = _helper.css_transition_props(this.DOMElement);

        _helper.each(this.options, function(i, option)
        {
            // Setup and convert duration from MS to seconds
            let property = option.property;
            let duration = (option.duration / 1000);
            let easing   = CSS_EASINGS[option.easing] || 'ease';

            // Set the transition for the property
            // in our merged obj
            this.animatedTransitions[property] = `${duration}s ${easing}`;

        }, this);

        _helper.css(this.DOMElement, 'transition', _helper.join_obj(this.animatedTransitions, ' ', ', '));
    }

    /**
     * Apply animation end values.
     * 
     */
    AnimateCss.prototype.applyEndValues = function()
    {
        var styles = {};

        _helper.each(options, function(i, option)
        {
            styles[option.property] = option.to;

            this.callback = option.callback;

        }, this);

        _helper.css(DOMElement, styles);
    }

    return new AnimateCss(DOMElement, options).start();
}
