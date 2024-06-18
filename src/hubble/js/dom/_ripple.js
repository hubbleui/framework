/**
 * Ripple click animation
 *
 * @author    {Joe J. Howard}
 * @copyright {Joe J. Howard}
 * @license   {https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE}
 */
(function()
{
    /**
     * Ripple handler
     * 
     * @var {object}
     */
    /**
     * Ripple handler
     * 
     * @see {https://github.com/samthor/js-ripple}
     */
    var rippleTypeAttr = 'data-event';

    /**
     * @param {string} type
     * @param {!Event|!Touch} at
     */
    function startRipple(type, at, holder)
    {
        holder = Helper.$('.js-ripple-container', holder);

        if (!holder)
        {
            return false; // ignore
        }
        
        var cl = holder.classList;

        // Store the event use to generate this ripple on the holder: don't allow
        // further events of different types until we're done. Prevents double-
        // ripples from mousedown/touchstart.
        var prev = holder.getAttribute(rippleTypeAttr);
        if (prev && prev !== type)
        {
            return false;
        }
        holder.setAttribute(rippleTypeAttr, type);

        // Create and position the ripple.
        var rect = holder.getBoundingClientRect();
        var x = at.offsetX;
        var y;
        if (x !== undefined)
        {
            y = at.offsetY;
        }
        else
        {
            x = at.clientX - rect.left;
            y = at.clientY - rect.top;
        }
        var ripple = document.createElement('div');
        var max;
        if (rect.width === rect.height)
        {
            max = rect.width * 1.412;
        }
        else
        {
            max = Math.sqrt(rect.width * rect.width + rect.height * rect.height);
        }
        var dim = max * 2 + 'px';
        ripple.style.width = dim;
        ripple.style.height = dim;
        ripple.style.marginLeft = -max + x + 'px';
        ripple.style.marginTop = -max + y + 'px';

        // Activate/add the element.
        ripple.className = 'ripple';
        holder.appendChild(ripple);
        window.setTimeout(function()
        {
            ripple.classList.add('held');
        }, 0);

        var releaseEvent = (type === 'mousedown' ? 'mouseup' : 'touchend');
        var release = function(ev)
        {
            // TODO: We don't check for _our_ touch here. Releasing one finger
            // releases all ripples.
            document.removeEventListener(releaseEvent, release);
            ripple.classList.add('done');

            // larger than animation: duration in css
            window.setTimeout(function()
            {
                holder.removeChild(ripple);
                if (!holder.children.length)
                {
                    cl.remove('active');
                    holder.removeAttribute(rippleTypeAttr);
                }
            }, 650);
        };
        document.addEventListener(releaseEvent, release);
    }

    /**
     * JS Helper reference
     * 
     * @var {object}
     */
    var Helper = Hubble.helper();

    
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
                '.card-img',
                '.card-img-top',
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
            for (var i = 0; i < this._nodes.length; i++)
            {
                this._insertRipple(this._nodes[i]);
            }
        }

        /**
         * Remove ripples
         *
         * @access {private}
         */
        _unbind()
        {
            for (var i = 0; i < this._nodes.length; i++)
            {
                var wrapper = this._nodes[i];

                var ripples = Helper.$All('.js-ripple-container', wrapper);

                Helper.removeEventListener(wrapper, 'mousedown', this._mouseDown);

                Helper.removeEventListener(wrapper, 'touchstart', this._touchStart);

                for (var j = 0; j < ripples.length; j++)
                {
                    Helper.remove_from_dom(ripples[j]);
                }
            }
        }

        /**
         * Insert ripple
         *
         * @access {private}
         * @param  {node}    wrapper
         */
        _insertRipple(wrapper)
        {
            // If this is a user-defined JS-Ripple we need to insert it
            var rip  = document.createElement('span');
                
            rip.className = 'ripple-container js-ripple-container';

            if (Helper.has_class(wrapper, 'chip'))
            { 
                rip.className = 'ripple-container fill js-ripple-container';
            }
            
            Helper.preapend(rip, wrapper);

            Helper.addEventListener(wrapper, 'mousedown', this._mouseDown, true, 'foo', 'bar');

            Helper.addEventListener(wrapper, 'touchstart', this._touchStart, true, 'foo', 'bar');
      
        }

        /**
         * On mousedown
         *
         * @access {private}
         * @param  {event|null} e
         */
        _mouseDown(e)
        {
            e = e || window.event;

            if (e.button === 0)
            {
                startRipple(e.type, e, this);
            }

        }

        /**
         * On touchstart
         *
         * @access {private}
         * @param  {event|null}   e
         */
        _touchStart(e, foo, bar)
        {
            e = e || window.event;

            for (var i = 0; i < e.changedTouches.length; ++i)
            {
                startRipple(e.type, e.changedTouches[i], this);
            }
        }
    }
    
    // Load into Hubble DOM core
    Hubble.dom().register('Ripple', Ripple);

})();
