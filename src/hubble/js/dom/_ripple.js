(function()
{
    /**
     * Component base
     * 
     * @var {class}
     */
    const [Component] = Container.get('Component');

    /**
     * Ripple animation time.
     * 
     * Note 1. this is set in CSS
     * Note 2. This value is actually half of total animation time as the the ripple scales (2.5)
     * 
     * @var {int}
     */
    const RPL_AN_TIME = 400;

    /**
     * Wrappers that need "position:relative" to hide overflow.
     * 
     * @var {array}
     */
    const STATIC_POSITIONS = ['static', 'unset', 'initial'];

    /**
     * JS Helper reference
     * 
     * @var {object}
     */
    const Helper = Container.Helper();

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
     * @license   {https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE}
     */
    class Ripple extends Component
    {
        /**
         * Module constructor
         *
         * @access {public}
         * @constructor
         */
        constructor()
        {
            super(SELECTORS.join(','));
        }
        
        /**
         * Insert ripples
         *
         * @access {private}
         */
        bind(node)
        {
            // No ripples inside primary actions
            if (!Helper.has_class(node, 'primary-action') && Helper.closest(node, '.primary-action') && !Helper.has_class(node, 'card'))
            {
                return;
            }

            Helper.addEventListener(node, 'mousedown, touchstart', this._startRipple);
        }

        /**
         * Insert ripples
         *
         * @access {private}
         */
        unbind(node)
        {
            Helper.removeEventListener(node, 'mousedown, touchstart', this._startRipple);
        }

        /**
         * Ripple handler
         *
         * @access {private}
         * @param  {event|null} e
         */
        _startRipple(e)
        {
            e = e || window.event;

            var wrapper = this;

            // Ignore disabled
            if (wrapper.disabled || Helper.has_class(wrapper, 'disabled')) return;

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
            Helper.add_class(wrapper, 'ripple-down');

            // Create ripple and append immediately
            var ripple = document.createElement('div');
            Helper.preapend(ripple, wrapper);

            // Figure out where to place ripple inside parent
            var c = Helper.coordinates(wrapper);
            var s = Math.max(Helper.height(wrapper), Helper.width(wrapper));
            var x = (e.pageX - c.left) - (s / 2);
            var y = (e.pageY - c.top) - (s / 2);

            // Apply styles to ripple
            Helper.css(ripple, 
            {
                width:  `${s}px`,
                height: `${s}px`,
                left:   `${x}px`,
                top:    `${y}px`
            });

            // Issue here is that if ripple is clicked multiple times in quick succession
            // the original inline overflow and position styles are overwritten by the next
            // click

            // Cache 'overflow' and 'position' inline styles
            // to revert back to after complete
            // If these are empty they will be removed
            if (!INLINESTYLES.has(wrapper))
            {
                let CSSoverflow = Helper.inline_style(wrapper, 'overflow') || false;
                
                let CSSposition = Helper.inline_style(wrapper, 'position') || false;

                INLINESTYLES.set(wrapper, [CSSoverflow, CSSposition]);
            }

            // Ensure parent hides overflow
            Helper.css(wrapper, 'overflow', 'hidden !important');

            // Ensure position relative if needed
            if (Helper.in_array(Helper.rendered_style(wrapper, 'position'), STATIC_POSITIONS))
            {
                Helper.css(wrapper, 'position', 'relative');
            }

            // Start ripple animation
            ripple.classList.add('ripple');

            // Animation started
            const t0 = performance.now();

            // Figure out release event type
            var releaseEvent = (e.type === 'mousedown' ? 'mouseup' : 'touchend');

            // Remove handler
            const remove = function()
            {                
                if (Helper.in_dom(ripple) && Helper.in_dom(wrapper))
                {
                    wrapper.removeChild(ripple); 
                }
            }

            // Restore handler
            const restore = function()
            {
                if (Helper.in_dom(wrapper))
                {
                    wrapper.offsetHeight;

                    wrapper.removeAttribute('data-event');
                
                    Helper.remove_class(wrapper, 'ripple-down');

                    let styles = INLINESTYLES.get(wrapper);

                    Helper.css(wrapper, 'overflow', styles[0]);

                    Helper.css(wrapper, 'position', styles[1]);
                }
            }

            // Cached timer for release
            var timer;

            // Blocking click target
            var blockedClick = e.target !== wrapper;
            var loopedClicks = false;

            const triggerClicks = function(node)
            {
                if (node === wrapper)
                {
                    Helper.trigger_event(node, 'click');

                    return true;
                }

                Helper.trigger_event(node, 'click');
            }

            // Release event
            const release = function(ev)
            {
                // Clear timer
                clearTimeout(timer);

                // Remove release listener
                document.removeEventListener(releaseEvent, release);

                if (blockedClick && !loopedClicks)
                {
                    Helper.traverse_up(e.target, triggerClicks);

                    loopedClicks = true;
                }

                // Check if release happened before ripple finished animating
                const held = (performance.now() - t0);

                // Release occurs before initial scale animation finishes with buffer
                if (held < RPL_AN_TIME)
                {
                    let diff = parseInt(RPL_AN_TIME - held);

                    if (diff > 150)
                    {
                        timer = setTimeout(release, diff);

                        return;
                    }
                }

                Helper.animate_css(ripple, {'opacity': 0, duration: 350, callback: remove });

                let restoreTimer = setTimeout(restore, 500);

                RIPPLING.set(wrapper, restoreTimer);
            };

            // Release listener
            document.addEventListener(releaseEvent, release);
        }
    }
    
    // Load into Hubble DOM core
    Hubble.dom().register('Ripple', Ripple);

})();
