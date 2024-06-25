/**
 * Returns an object of CSS transforms by transform property as keys.
 *
 * @param  {node|string} DOMElement  Target element or transform value string
 * @return {object}
 */
css_transform_values(DOMElement)
{
    if (!DOMElement) return {};
    var transforms     = {};
    var transformValue = this.is_string(DOMElement) ? DOMElement : this.rendered_style(DOMElement, 'transform');

    // No transforms
    if (!transformValue || transformValue === 'none' || transformValue === 'unset' || transformValue === 'auto' || transformValue === 'revert' || transformValue === 'initial')
    {
        return transforms;
    }

    this.each(transformValue.trim().split(')'), function(i, transform)
    {
        transform = transform.trim();

        if (transform === '') return;

        transform    = transform.split('(');
        let prop     = transform.shift().trim();
        let value    = transform.pop().trim();
        let valCount = CSS_TRANSFORM_VALUES_COUNT[prop];
        
        if (valCount === 1)
        {
            transforms[prop] = [value];
        }
        else
        {
            let values = value.split(',').map((x) => x.trim());

            if (values.length < valCount)
            {
                let pad = new Array(valCount - values.length).fill('0');

                transforms[prop] = [...values, ...pad];
            }
            else
            {
                transforms[prop] = values;
            }
        }

    }, this);

    return transforms;
}


/**
 * CSS Animation.
 *
 * @access {private}
 * @param  {node}     DOMElement          Target DOM node
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
animate_css(DOMElement, options)
{    
    // Call does not from factory need to sanitize
    options = !options.FROM_FACTORY ? this.__animation_factory(DOMElement, options) : options;

    // Cache inline transitions to revert back to on completion
    var inlineTransitions = this.css_transition_props(this.inline_style(DOMElement, 'transition'));
    inlineTransitions = this.is_empty(inlineTransitions) ? false : this.join_obj(inlineTransitions, ' ', ', ');;

    // Cache rendered transitions to merge into for this animation
    var renderedTransions = this.css_transition_props(DOMElement);

    var callback;

    // Props to animate / transition
    var styles = {};

    if (this.is_array(options))
    {
        this.each(options, function(i, option)
        {
            // Setup and convert duration from MS to seconds
            var property = option.property;
            var duration = (option.duration / 1000);
            var easing   = CSS_EASINGS[option.easing];

            // Set the transition for the property
            // in our merged obj
            renderedTransions[property] = `${duration}s ${easing}`;

            // Set the property style
            styles[property] = option.to;

            callback = option.callback;

        }, this);
    }
    else
    {
        var property = options.property;
        var duration = (options.duration / 1000);
        var easing   = CSS_EASINGS[options.easing];

        // Set the transition for the property
        // in our merged obj
        renderedTransions[property] = `${duration}s ${easing}`;

        // Set the property style
        styles[property] = options.to;

        callback = options.callback;
    }

    // Flatten transition ready for css
    var transition = this.join_obj(renderedTransions, ' ', ', ');

    this.css(DOMElement, 'transition', transition);

    const _this = this;

    var onTransitionEnd;

    onTransitionEnd = function(e)
    {
        e = e || window.event;

        var prop = _this.css_prop_to_hyphen_case(e.propertyName);

        delete renderedTransions[prop];

        var completed = _this.is_empty(renderedTransions);

        var transition = completed ? inlineTransitions : _this.join_obj(renderedTransions, ' ', ', ');

        _this.css(DOMElement, 'transition', transition);

        if (_this.is_empty(renderedTransions))
        {
            DOMElement.removeEventListener('transitionend', onTransitionEnd, true);

            if (callback)
            {
                callback(DOMElement);
            }
        }
    }

    DOMElement.addEventListener('transitionend', onTransitionEnd, true);

    this.css(DOMElement, styles);
}

