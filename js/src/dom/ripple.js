(function()
{
    /**
     * Component base
     * 
     * @var {class}
     */
    const [Component] = FrontBx.get('Component');

    /**
     * Helper functions
     * 
     * @var {Function}
     */
    const [find, add_class, on, animate_css, closest, coordinates, css, has_class, height, in_array, in_dom, inline_style, preapend, remove_class, off, rendered_style, traverse_up, trigger_event, width, extend] = FrontBx.import(['find','add_class','on','animate_css','closest','coordinates','css','has_class','height','in_array','in_dom','inline_style','preapend','remove_class','off','rendered_style','traverse_up','trigger_event','width','extend']).from('_');

    /**
     * Wrappers that need "position:relative" to hide overflow.
     * 
     * @var {array}
     */
    const STATIC_POSITIONS = ['static', 'unset', 'initial'];

    /**
     * Original inline styles
     * 
     * @var {Map}
     */
    const INLINESTYLES = new Map();

    /**
     * Currently rippling
     * 
     * @var {Map}
     */
    const RIPPLING = new Map();

    /**
     * Currently clicking
     * 
     * @var {Map}
     */
    var CLICKING;

    /**
     * Selectors
     * 
     * @var {Map}
     */
    const SELECTORS =
    [
        '.btn',
        '.list > li',
        '.pagination li a',
        '.tab-nav li a',
        '.card.primary-action',
        '.card .primary-action',
        '.card-media',
        '.js-ripple'
    ];

    /**
     * Ripple click animation
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.comfrontbx/uimaster/LICENSE}
     */
    const Ripple = function()
    {
        this.super(SELECTORS.join(','));
    }

    /**
     * @inheritdoc
     * 
     */
    Ripple.prototype.bind = function(node)
    {        
        // No ripples inside primary actions
        if (!has_class(node, 'primary-action') && closest(node, '.primary-action') && !has_class(node, 'card'))
        {
            return;
        }

        // No ripples inside list buttons
        if (has_class(node, 'btn') && closest(node, '.list'))
        {
            return;
        }

        // No ripples on list items with checkbox controls
        if (closest(node, '.list') && (find('> .item-right .checkbox', node) || find('> .item-right .radio', node)  || find('> .item-right .switch', node))) return;

        // Cache 'overflow' and 'position' inline styles
        // to revert back to after complete
        // If these are empty they will be removed
        if (!INLINESTYLES.has(node))
        {
            let CSSoverflow = inline_style(node, 'overflow') || false;
            
            let CSSposition = inline_style(node, 'position') || false;

            INLINESTYLES.set(node, [CSSoverflow, CSSposition]);
        }

        on(node, 'mousedown, touchstart', this._startRipple, this);
    }

    /**
     * @inheritdoc
     * 
     */
    Ripple.prototype.unbind  = function(node)
    {
        off(node, 'mousedown, touchstart', this._startRipple, this);
    }

    /**
     * Ripple handler
     *
     * @access {private}
     * @param  {event|null} e
     */
    Ripple.prototype._restore  = function(wrapper)
    {
        if (in_dom(wrapper))
        {
            wrapper.offsetHeight;

            wrapper.removeAttribute('data-event');
        
            remove_class(wrapper, 'ripple-down');

            let styles = INLINESTYLES.get(wrapper);

            css(wrapper, 'overflow', styles[0]);

            css(wrapper, 'position', styles[1]);
        }
    }

    /**
     * Ripple handler
     *
     * @access {private}
     * @param  {event|null} e
     */
    Ripple.prototype._startRipple  = function(e, wrapper)
    {
        const _this = this;

        // Ignore disabled
        if (wrapper.disabled || has_class(wrapper, 'disabled')) return;

        // Single finger "clicks" only
        if (e.touches && e.touches.length > 1) return;

        // Left click only on mouse
        if ('button' in e && e.button !== 0) return;

        // Store the event used to generate this ripple on the holder: don't allow
        // further events of different types until we're done.
        // Prevents double-ripples from mousedown/touchstart.
        var prev = wrapper.getAttribute('data-event');
        if (prev && prev !== e.type) return;

        // Clear restorer
        clearTimeout(RIPPLING.get(wrapper));

        // Add the data-attribute to identify ripple event type
        wrapper.setAttribute('data-event', e.type);

        // Add class to parent do identify mousedown/touchstart
        add_class(wrapper, 'ripple-down');

        // Figure out release event type
        var releaseEvent = (e.type === 'mousedown' ? 'mouseup' : 'touchend');

        // Cached timer for release
        var releaseTimer;
        var released = false;

        // Animation started
        const t0 = performance.now();

        // Create ripple and append immediately
        var ripple = document.createElement('SPAN');
        ripple.className = 'ripple';

        // Release event
        const release = function(ev)
        {
            // Clear timer
            clearTimeout(releaseTimer);

            // Remove release listener
            document.removeEventListener(releaseEvent, release);

            add_class(ripple, 'complete');

            setTimeout(() => wrapper.removeChild(ripple), 400);

            let restoreTimer = setTimeout(() => _this._restore(wrapper), 500);

            RIPPLING.set(wrapper, restoreTimer);
        };  

        // Figure out where to place ripple inside parent
        var c = coordinates(wrapper);
        var s = Math.max(height(wrapper), width(wrapper));
        var x = (e.pageX - c.left) - (s / 2);
        var y = (e.pageY - c.top) - (s / 2);

        // Apply styles to ripple
        css(ripple, 
        {
            width:  `${s}px`,
            height: `${s}px`,
            left:   `${x}px`,
            top:    `${y}px`
        });

        // Issue here is that if ripple is clicked multiple times in quick succession
        // the original inline overflow and position styles are overwritten by the next
        // click

        // Ensure parent hides overflow
        css(wrapper, 'overflow', 'hidden !important');

        // Ensure position relative if needed
        if (in_array(rendered_style(wrapper, 'position'), STATIC_POSITIONS))
        {
            css(wrapper, 'position', 'relative');
        }

        // Release listener
        document.addEventListener(releaseEvent, release);
            
        preapend(ripple, wrapper);
    }

    // Load into FrontBx DOM core
    FrontBx.dom().register('Ripple', extend(Component, Ripple));

})();