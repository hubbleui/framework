/**
 * Helper Animation component
 *
 * @author    Joe J. Howard
 * @copyright Joe J. Howard
 * @license   https://github.com/kanso-cms/cms/blob/master/LICENSE
 */


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
    // Call comes from factory - no need to sanitize
    if (options.FROM_FACTORY)
    {

    }

    var prevtransition = this.rendered_style(DOMElement, 'transition');
    var transitions    = prevtransition = prevtransition === 'all 0s ease 0s' || prevtransition === 'none' || !prevtransition ? [] : [prevtransition];
    var duration       = (options.duration / 100);
    var easing         = CSS_EASINGS[options.easing];
    
    transitions.push(`${options.property} .${duration}s ${easing}`);
    
    this.css(DOMElement, 'transition', transitions.join(', '));
    this.css(DOMElement, options.property, options.to);
}

