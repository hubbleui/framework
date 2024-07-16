(function()
{
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
     * Ripple click animation
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE}
     */
    class Ripple
    {
        /**
         * Module constructor
         *
         * @access {public}
         * @constructor
         */
        constructor()
        {
            this._classes =
            [
                '.btn',
                '.chip',
                '.list > li',
                '.pagination li a',
                '.tab-nav li a',
                '.card.primary-action',
                '.card .primary-action',
                '.card-media',
                '.js-ripple'
            ];

            this._nodes = Helper.$All(this._classes.join(','));

            this._bind();

            return this;
        };

        /**
         * Module destructor - removes event listeners
         *
         * @access {public}
         */
        destruct()
        {
            this._unbind();

            this._nodes = [];
        }

        /**
         * Insert ripples
         *
         * @access {private}
         */
        _bind()
        {
            Helper.each(this._nodes, function(i, node)
            {
                // No ripples inside primary actions
                if (!Helper.has_class(node, 'primary-action') && Helper.closest(node, '.primary-action') && !Helper.has_class(node, 'card'))
                {
                    return;
                }

                this._bindWrapper(node);

            }, this);
        }

        /**
         * Remove ripples
         *
         * @access {private}
         */
        _unbind()
        {
            Helper.each(this._nodes, function(i, node)
            {
                Helper.removeEventListener(node, 'mousedown, touchstart', this._startRipple, true);

            }, this);
        }

        /**
         * Insert ripple
         *
         * @access {private}
         * @param  {DOMElement}    wrapper
         */
        _bindWrapper(wrapper)
        {
            Helper.addEventListener(wrapper, 'mousedown, touchstart', this._startRipple, true);
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

            // Single finger "clicks" only
            if (e.touches && e.touches.length > 1) return;

            // Left click only on mouse
            if ('button' in e && e.button !== 0) return;

            // Store the event used to generate this ripple on the holder: don't allow
            // further events of different types until we're done.
            // Prevents double-ripples from mousedown/touchstart.
            var prev = wrapper.getAttribute('data-event');
            if (prev && prev !== e.type) return;
            
            // Add the data-attribute to identify ripple event type
            wrapper.setAttribute('data-event', e.type);

            // Add class to parent do identify mousedown/touchstart
            Helper.add_class(wrapper, 'ripple-down');

            // Create ripple and append immediately
            var ripple = document.createElement('div');
            wrapper.appendChild(ripple);

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
            
            // Cache 'overflow' and 'position' inline styles
            // to revert back to after complete
            // If these are empty they will be removed
            const CSSoverflow = Helper.inline_style(wrapper, 'overflow') || false;
            const CSSposition = Helper.inline_style(wrapper, 'position') || false; 

            // Ensure parent hides overflow
            Helper.css(wrapper, 'overflow', 'hidden');

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
            
            // Cached timer for release
            var timer;

            // Remove handler
            const remove = function()
            {
                wrapper.removeChild(ripple);
                
                Helper.remove_class(wrapper, 'ripple-down');

                /*Helper.css(wrapper, 'overflow', CSSoverflow);

                Helper.css(wrapper, 'position', CSSposition);*/
            }

            // Release event
            const release = function(ev)
            {
                // Clear timer
                clearTimeout(timer);

                // Remove release listener
                document.removeEventListener(releaseEvent, release);

                // Check if release happened before ripple finished animating
                const held = (performance.now() - t0);

                // Release occurs before initial scale animation finishes with buffer
                if (held < RPL_AN_TIME)
                {
                    let diff = parseInt(RPL_AN_TIME - held);

                    if (diff > 150)
                    {
                        setTimeout(release, diff);

                        return;
                    }
                }

                // Cleanup and remove element
                wrapper.removeAttribute('data-event');

                Helper.animate_css(ripple, {'opacity': 0, duration: 350, callback: remove });
            };

            // Release listener
            document.addEventListener(releaseEvent, release);
        }
    }
    
    // Load into Hubble DOM core
    Hubble.dom().register('Ripple', Ripple);

})();
