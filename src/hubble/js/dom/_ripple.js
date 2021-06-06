/**
 * Ripple click animation
 *
 * @author    Joe J. Howard
 * @copyright Joe J. Howard
 * @license   https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE
 */
(function()
{
    /**
     * Ripple handler
     * 
     * @var object
     */
    /**
     * Ripple handler
     * 
     * @see https://github.com/samthor/js-ripple
     */
    var rippleTypeAttr = 'data-event';

    /**
     * @param {string} type
     * @param {!Event|!Touch} at
     */
    function startRipple(type, at, holder)
    {
        var holder = Helper.$('.js-ripple', holder);

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
     * @var object
     */
    var Helper = Hubble.helper();

    /**
     * Module constructor
     *
     * @access public
     * @constructor
     */
    var Ripple = function()
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
            '.card',
            '.js-ripple'
        ];

        this._nodes = Helper.$All(this._classes.join(','));

        this._bind();

        return this;
    };

    /**
     * Module destructor - removes event listeners
     *
     * @access public
     */
    Ripple.prototype.destruct = function()
    {
        this._unbind();

        this._nodes = [];
    }

    /**
     * Insert ripples
     *
     * @access private
     */
    Ripple.prototype._bind = function()
    {
        for (var i = 0; i < this._nodes.length; i++)
        {
            this._insertRipple(this._nodes[i]);
        }
    }

    /**
     * Remove ripples
     *
     * @access private
     */
    Ripple.prototype._unbind = function()
    {
        var ripples = Helper.$All('.js-ripple');

        for (var i = 0; i < ripples.length; i++)
        {
            Helper.removeFromDOM(ripples[i]);
        }
    }

    /**
     * Insert ripple
     *
     * @access private
     * @param  node    wrapper
     */
    Ripple.prototype._insertRipple = function(wrapper)
    {
        // Don't ripple on cards with ripples inside them
        if (Helper.hasClass(wrapper, 'card'))
        {
            var children = Helper.$All(this._classes.join(','), wrapper);

            if (!Helper.empty(children))
            {
                return;
            }
        }

        if (!Helper.hasClass(wrapper, 'js-ripple'))
        {
            var rip  = document.createElement('span');
            
            rip.className = 'js-ripple';
            
            wrapper.appendChild(rip);
        }
        else
        {
            wrapper = wrapper.parentNode;
        }

        if (Helper.hasClass(wrapper, 'chip'))
        { 
            rip.className = 'js-ripple fill';
        }

        Helper.addEventListener(wrapper, 'mousedown', this._mouseDown);

        Helper.addEventListener(wrapper, 'touchstart', this._touchStart)
  
    }

    /**
     * On mousedown
     *
     * @access private
     * @param  event|null e
     */
    Ripple.prototype._mouseDown = function(e)
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
     * @access private
     * @param  event|null   e
     */
    Ripple.prototype._touchStart = function(ev)
    {
        e = e || window.event;

        for (var i = 0; i < e.changedTouches.length; ++i)
        {
            startRipple(e.type, e.changedTouches[i], this);
        }
    }
    
    // Load into Hubble DOM core
    Container.get('Hubble').dom().register('Ripple', Ripple);

})();
