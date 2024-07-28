const AnimateCss = function(DOMElement, options)
{        
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

    _THIS.add_event_listener(this.DOMElement, 'transitionend', this.on_complete, this);

    this.applyEndValues();

    return this;
}

/**
 * Stop animation.
 *
 */
AnimateCss.prototype.stop = function()
{
    _THIS.remove_event_listener(this.DOMElement, 'transitionend', this.on_complete, this);

    _THIS.css(this.DOMElement, 'transition', this.preAnimatedTransitions);
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

    var prop = _THIS.css_prop_to_hyphen_case(e.propertyName);

    if (prop === 'background-color') prop = 'background';

    // Change inline style back to auto
    let endVal = this.animatedProps[prop];
    if (endVal === 'auto' || endVal === 'initial' || endVal === 'unset') _THIS.css(this.DOMElement, prop, endVal);

    delete this.animatedTransitions[prop];

    delete this.animatedProps[prop];
    
    var completed = _THIS.is_empty(this.animatedProps);

    var transition = completed ? this.preAnimatedTransitions : _THIS.join_obj(this.animatedTransitions, ' ', ', ');

    _THIS.css(this.DOMElement, 'transition', this.preAnimatedTransitions);

    if (completed)
    {
        _THIS.remove_event_listener(this.DOMElement, 'transitionend', this.on_complete, this);
        
        if (_THIS.is_function(this.callback))
        {
            this.callback(this.DOMElement);
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
    _THIS.each(this.options, function(i, option)
    {
        let startValue  = option.from;
        let endValue    = option.to;
        let CSSProperty = option.property;

        if (startValue === 'auto' || startValue === 'initial' || startValue === 'unset' || !startValue)
        {
            this.options[i].from = _THIS.rendered_style(DOMElement, CSSProperty);
        }

        if (endValue === 'auto' || endValue === 'initial' || endValue === 'unset')
        {
            var inlineStyle = _THIS.inline_style(DOMElement, CSSProperty);

            _THIS.css(DOMElement, CSSProperty, endValue);

            this.options[i].to = _THIS.rendered_style(DOMElement, CSSProperty);

            _THIS.css(DOMElement, CSSProperty, inlineStyle ? inlineStyle : false);
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

    _THIS.each(this.options, function(i, option)
    {
        if (option.from)
        {
            styles[option.property] = option.from;
        }
    });

    if (!_THIS.is_empty(styles)) _THIS.css(this.DOMElement, styles);
}

/**
 * Apply animation transitions.
 * 
 */
AnimateCss.prototype.applyTransitions = function()
{
    this.preAnimatedTransitions  = _THIS.inline_style(this.DOMElement, 'transition');
    this.preAnimatedTransitions  = !this.preAnimatedTransitions ? false : this.preAnimatedTransitions;
    this.animatedTransitions     = _THIS.css_transition_props(this.DOMElement);

    _THIS.each(this.options, function(i, option)
    {
        // Setup and convert duration from MS to seconds
        let property = option.property;
        let duration = (option.duration / 1000);
        let easing   = CSS_EASINGS[option.easing] || 'ease';

        // Set the transition for the property
        // in our merged obj
        this.animatedTransitions[property] = `${duration}s ${easing}`;

    }, this);

    _THIS.css(this.DOMElement, 'transition', _THIS.join_obj(this.animatedTransitions, ' ', ', '));
}

/**
 * Apply animation end values.
 * 
 */
AnimateCss.prototype.applyEndValues = function()
{
    var styles = {};

    _THIS.each(this.options, function(i, option)
    {
        styles[option.property] = option.to;

        this.callback = option.callback;

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
