/**
 * Animate JS
 *
 * @access {public}
 * @param  {DOMElement} DOMElement                  Target DOM node
 * @param  {object}     options             Options object
 * @param  {string}     options.property    CSS property
 * @param  {mixed}      options.from        Start value
 * @param  {mixed}      options.to          Ending value
 * @param  {int}        options.duration    Animation duration in MS
 * @param  {string}     options.easing      Easing function in camelCase
 * @param  {function}   options.callback    Callback to apply when animation ends (optional)
 * @return {array}
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
animate(DOMElement, options)
{
    const animations = [];

    const Animation = function()
    {
        return this;
    };

    Animation.prototype.stop = function()
    {
        for (var i = 0; i < animations.length; i++)
        {
            animations[i].stop(true);
        }
    };

    Animation.prototype.destory = function()
    {
        for (var i = 0; i < animations.length; i++)
        {
            animations[i].destory();
        }

        animations = [];
    };

    const factoryOptions = !options.FROM_FACTORY ? this.__animation_factory(DOMElement, options) : options;

    const AnimationInstance = new Animation;

    this.each(factoryOptions, function(i, opts)
    {
        animations.push(this.__animate_js(DOMElement, opts));

    }, this);

    return AnimationInstance;
}

/**
 * Animate CSS
 *
 * @access {public}
 * @param  {DOMElement} DOMElement                  Target DOM node
 * @param  {object}     options             Options object
 * @param  {string}     options.property    CSS property
 * @param  {mixed}      options.from        Start value
 * @param  {mixed}      options.to          Ending value
 * @param  {int}        options.duration    Animation duration in MS
 * @param  {string}     options.easing      Easing function in camelCase
 * @param  {function}   options.callback    Callback to apply when animation ends (optional)
 * @return {array}
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
    var cssAnimation;

    const Animation = function()
    {
        return this;
    };

    Animation.prototype.stop = function()
    {
        cssAnimation.stop(true);
    };

    Animation.prototype.destory = function()
    {
        cssAnimation.destory(true);
    };

    const factoryOptions = !options.FROM_FACTORY ? this.__animation_factory(DOMElement, options) : options;

    cssAnimation = this.__animate_css(DOMElement, factoryOptions);
    
    return new Animation;
}

/**
 * Animation factory.
 *
 * @access {private}
 * @param  {DOMElement} DOMElement                  Target DOM node
 * @param  {object}     options             Options object
 * @param  {string}     options.property    CSS property
 * @param  {mixed}      options.from        Start value
 * @param  {mixed}      options.to          Ending value
 * @param  {int}        options.duration    Animation duration in MS
 * @param  {string}     options.easing      Easing function in camelCase
 * @param  {function}   options.callback    Callback to apply when animation ends (optional)
 * @return {array}
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
__animation_factory(DOMElement, opts)
{
    var optionSets = [];

    this.each(opts, function(key, val)
    {
        // animation_factory('foo', { property : 'left', from : '-300px', to: '0',  easing: 'easeInOutElastic', duration: 3000} );
        if (key === 'property')
        {
            var options = this.array_merge({}, ANIMATION_DEFAULT_OPTIONS, opts);

            options.FROM_FACTORY = true;
            options.property = val;
            options.el = DOMElement;
            optionSets.push(options);

            // break
            return false;
        }
        else if (!this.in_array(key, ANIMATION_ALLOWED_OPTIONS))
        {
            // Only worth adding if the property is vavlid
            var camelProp = this.css_prop_to_camel_case(key);
            
            if (!this.is_undefined(document.body.style[camelProp]))
            {
                var isObjSet = this.is_object(val);
                var toMerge  = isObjSet ? val : opts;
                var options  = this.array_merge({}, ANIMATION_DEFAULT_OPTIONS, toMerge);
                
                // animation_factory('foo', { height: '100px', opacity: 0 } );
                if (!isObjSet)
                {
                    options.to = val;
                }

                // animation_factory('foo', { height: { from: '100px', to: '500px', easing: 'easeInOutElastic'}, opacity:{ to: 0, easing: 'linear'} } );
                options.FROM_FACTORY = true;
                options.property     = key;
                options.el           = DOMElement;
                optionSets.push(options);
            }
        }
    }, this);

    this.each(optionSets, function(i, options)
    {
        // Not nessaray, but sanitize out redundant options
        options = this.map(options, function(key, val)
        {
            return this.in_array(key, ANIMATION_FILTER_OPTIONS) ? val : false;

        }, this);

        if (!ANIMATION_EASING_FUNCTIONS[options.easing]) options.easing = 'ease';

        options.FROM_FACTORY = true;

        optionSets[i] = options;

    }, this);

    if (this.is_empty(optionSets))
    {
        console.error('Animation Error: Either no CSS property(s) was provided or the provided property(s) is unsupported.');
    }

    return optionSets;
}