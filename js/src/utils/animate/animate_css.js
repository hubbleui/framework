const AnimateCss = function(DOMElement, options)
{     
    // Domeleement   
    this.DOMElement = DOMElement;

    // Options
    this.options = options;

    // Props to animate
    this.animatedProps = {};

    // Pre animation transitions to restore
    this.preAnimatedTransitions = {};

    // Cache stopvalues
    this.stopValues = {};

    // Fail timer
    this._failTimer = null;
    
    // Max duration
    this.duration  = 0;
    
    // Callbacks
    this._callbackStart    = () => {};
    this._callbackComplete = () => {};
    this._callbackFail     = () => {};
    this._callbackStep     = () => {};

    this.preProcessStartEndValues();

    return this;
};

/**
 * Start animation.
 *
 */
AnimateCss.prototype.start = function()
{
    this._callbackStart(this.DOMElement);

    this.applyStartValues();

    this.applyTransitions();

    _THIS.add_event_listener(this.DOMElement, 'transitionend', this.transitionEnd, this);

    let _this = this;

    this._failTimer = setTimeout(() =>
    {
        _this._callbackFail(_this.DOMElement);

        _this.stop();

    }, this.duration + 50 );

    this._stepTimer = setInterval(() => this._callbackStep(), 16);

    this.applyEndValues();

    return this;
}

/**
 * Stop animation.
 *
 */
AnimateCss.prototype.stop = function()
{
    clearTimeout(this._failTimer);

    clearInterval(this._stepTimer);

    this.resotoreElement();

    _THIS.css(this.DOMElement, this.stopValues);
}

/**
 * Stop animation and destroy.
 *
 */
AnimateCss.prototype.destory = function()
{
    this.stop();

    this.animatedProps = {};

    this.preAnimatedTransitions = {};
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
AnimateCss.prototype.resotoreElement = function()
{
    _THIS.css(this.DOMElement, 'transition', this.preAnimatedTransitions);

    _THIS.remove_event_listener(this.DOMElement, 'transitionend', this.transitionEnd, this);
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
AnimateCss.prototype.transitionEnd = function(e)
{
    e = e || window.event;

    let prop = _THIS.css_prop_to_hyphen_case(e.propertyName);

    // Convert to shorthand if needed
    if (prop.includes('-'))
    {
        let shorthand = prop.split('-').shift();

        if (this.animatedProps[shorthand]) prop = shorthand;
    }

    let endVal = this.animatedProps[prop];

    // Change inline style back to auto
    if (endVal === 'auto' || endVal === 'initial' || endVal === 'unset') _THIS.css(this.DOMElement, prop, endVal);

    delete this.animatedProps[prop];
    
    if (_THIS.is_empty(this.animatedProps))
    {        
        clearTimeout(this._failTimer);

        clearInterval(this._stepTimer);

        this.resotoreElement();

        this._callbackComplete(this.DOMElement);
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
    _THIS.each(this.options, function(i, option)
    {
        // Cache start and fail callbacks
        if (option.start) this._callbackStart = option.start;
        if (option.fail) this._callbackFail = option.fail;
        if (option.step) this._callbackStep = option.step;

        // Keep the longest callback
        if (option.duration >= this.duration && (option.callback || option.complete))
        {
            this._callbackComplete = (option.callback || option.complete);
        }

        // Store the maximum duration
        if (option.duration >= this.duration) this.duration = option.duration;

        let startValue  = option.from;
        let endValue    = option.to;
        let CSSProperty = option.property;
        
        if (startValue === 'auto' || startValue === 'initial' || startValue === 'unset' || !startValue)
        {
            option.from = _THIS.rendered_style(DOMElement, CSSProperty);
        }

        if (endValue === 'auto' || endValue === 'initial' || endValue === 'unset')
        {
            let inlineStyle = _THIS.inline_style(DOMElement, CSSProperty);

            _THIS.css(DOMElement, CSSProperty, endValue);

            option.to = _THIS.rendered_style(DOMElement, CSSProperty);

            _THIS.css(DOMElement, CSSProperty, inlineStyle ? inlineStyle : false);
        }

        this.animatedProps[CSSProperty] = endValue;

        this.stopValues[CSSProperty] = _THIS.inline_style(DOMElement, CSSProperty) || false;

    }, this);
}

/**
 * Apply start values.
 * 
 */
AnimateCss.prototype.applyStartValues = function()
{
    var styles = {};

    _THIS.each(this.options, function(i, option)
    {
        styles[option.property] = option.from;
    });

    if (!_THIS.is_empty(styles)) _THIS.css(this.DOMElement, styles);
}

/**
 * Apply animation transitions.
 * 
 */
AnimateCss.prototype.applyTransitions = function()
{
    let transitions = _THIS.css_transition_props(this.DOMElement);

    this.preAnimatedTransitions  = _THIS.inline_style(this.DOMElement, 'transition') || false;

    _THIS.each(this.options, function(i, option)
    {
        // Setup and convert duration from MS to seconds
        let property = option.property;
        let duration = (option.duration / 1000);
        let easing   = CSS_EASINGS[option.easing] || 'ease';

        // Set the transition for the property
        // in our merged obj
        transitions[property] = `${duration}s ${easing}`;

    }, this);

    _THIS.css(this.DOMElement, 'transition', _THIS.join_obj(transitions, ' ', ', '));
}

/**
 * Apply animation end values.
 * 
 */
AnimateCss.prototype.applyEndValues = function()
{
    let styles = {};

    _THIS.each(this.options, function(i, option)
    {
        styles[option.property] = option.to;

    }, this);

    _THIS.css(this.DOMElement, styles);
}

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
_.prototype.__animate_css = function(DOMElement, options)
{    
    return new AnimateCss(DOMElement, options).start();
}
