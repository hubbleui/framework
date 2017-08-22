/**
 * Popovers
 *
 * @author    Joe J. Howard
 * @copyright Joe J. Howard
 * @license   https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE
 */

(function()
{
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
    var Popovers = function()
    {
        this._pops  = [];
        this._nodes = [];
        this._arrowClasses = {
            top    : 'arrow-s',
            left   : 'arrow-e',
            right  : 'arrow-w',
            bottom : 'arrow-n',
        };

        // Find nodes
        this._nodes = Helper.$All('.js-popover');

        // Bind events
        if (!Helper.empty(this._nodes))
        {
            for (var i = 0; i < this._nodes.length; i++)
            {
                this._bind(this._nodes[i]);
            }

            this._addWindowClickEvent();
        }

        return this;
    };

    /**
     * Module destructor
     *
     * @access public
     * @return this
     */
    Popovers.prototype.destruct = function()
    {
        if (!Helper.empty(this._nodes))
        {
            for (var i = 0; i < this._nodes.length; i++)
            {
                this._unbind(this._nodes[i]);
            }
        }

        this._removeAll();

        this._nodes = [];
        
        this._pops  = [];
    }

    /**
     * Unbind event listeners on a trigger
     *
     * @param trigger node
     * @access private
     */
    Popovers.prototype._unbind = function(trigger)
    {
        var evnt = trigger.dataset.popoverEvent;

        if (evnt === 'click')
        {
            Helper.removeEventListener(trigger, 'click', this._clickHandler);
            window.removeEventListener('resize', this._windowResize);
        }
        else
        {
            Helper.removeEventListener(trigger, 'mouseenter', this._hoverOver);
            Helper.removeEventListener(trigger, 'mouseleave', this._hoverLeavTimeout);
        }
    }

    /**
     * Initialize the handlers on a trigger
     *
     * @access private
     * @param  node trigger Click/hover trigger
     */
    Popovers.prototype._bind = function(trigger)
    {
        var direction      = trigger.dataset.popoverDirection;
        var title          = trigger.dataset.popoverTitle;
        var content        = trigger.dataset.popoverContent;
        var type           = trigger.dataset.popoverType || '';
        var evnt           = trigger.dataset.popoverEvent;
        var animation      = trigger.dataset.popoverAnimate || 'pop';
        var target         = trigger.dataset.popoverTarget;
        var closeBtn       = evnt === 'click' ? '<span class="glyph-icon glyph-icon-cross js-remove-pop"></span>' : ''; 
        var pop            = '<h3 class="popover-title">'+title+closeBtn+'</h3><div class="popover-content"><p>'+content+'</p></div>';

        if (target)
        {
            pop = Helper.$('#'+target).cloneNode(true);
            pop.classList.remove('hidden');
        }

        var popHandler = Container.get('_popHandler', {
            target    :  trigger,
            direction :  direction,
            template  :  pop,
            animation :  animation,
            classes   : 'popover '+ direction +' '+ type +' arrow ' + this._arrowClasses[direction],
        });

        this._pops.push(popHandler);

        if (evnt === 'click')
        {
            Helper.addEventListener(trigger, 'click', this._clickHandler);
            window.addEventListener('resize', this._windowResize);
        }
        else
        {
            var _this = this;
            Helper.addEventListener(trigger, 'mouseenter', this._hoverOver);
            Helper.addEventListener(trigger, 'mouseleave', this._hoverLeavTimeout);
        }
    }

    /**
     * Timeout handler for hoverleave
     *
     * @access private
     */
    Popovers.prototype._hoverLeavTimeout = function(e)
    {
        e = e || window.event;
        setTimeout(function()
        {
            Container.get('Popovers')._hoverLeave(e);
        }, 300);
    }

    /**
     * Hover over event handler
     *
     * @access private
     */
    Popovers.prototype._hoverOver = function()
    {
        var trigger    = this;
        var _this      = Container.get('Popovers');
        var popHandler = _this._getHandler(trigger);
        if (Helper.hasClass(trigger, 'popped')) return;
        popHandler.render();
        Helper.addClass(trigger, 'popped');
    }

    /**
     * Hover leave event handler
     *
     * @access private
     */
    Popovers.prototype._hoverLeave = function(e)
    {
        var _this = Container.get('Popovers');
        var hovers = Helper.$All(':hover');
        for (var i = 0; i < hovers.length; i++)
        {
            if (Helper.hasClass(hovers[i], 'popover'))
            {
                hovers[i].addEventListener('mouseleave', function(_e)
                {
                    _e = _e || window.event;
                    _this._hoverLeave(_e);
                });
                return;
            }
        }

        _this._removeAll();
    }

    /**
     * Hover leave event handler
     *
     * @access private
     */
    Popovers.prototype._onWindowMouseOver = function(e)
    {
        e = e || window.event;

        if (Helper.closestClass(e.target, 'popover'))
        {
            return;
        }

        window.removeEventListener('mouseover', _onMouseOverWindow);
    }

    /**
     * Window resize event handler
     *
     * @access private
     */
    Popovers.prototype._windowResize = function()
    {
        var _this = Container.get('Popovers');
        
        for (var i = 0; i < _this._nodes.length; i++)
        {
            if (Helper.hasClass(_this._nodes[i], 'popped'))
            {
                var popHandler = _this._getHandler(_this._nodes[i]);
                popHandler.stylePop();
            }
        }
    }

    /**
     * Click event handler
     *
     * @param event|null e JavaScript click event
     * @access private
     */
    Popovers.prototype._clickHandler = function(e)
    {
        e = e || window.event;
        e.preventDefault();
        var trigger    = this;
        var _this      = Container.get('Popovers');
        var popHandler = _this._getHandler(trigger);
       
        if (Helper.hasClass(trigger, 'popped'))
        {
            _this._removeAll();
            popHandler.remove();
            Helper.removeClass(trigger, 'popped');
        }
        else
        {
            _this._removeAll();
            popHandler.render();
            Helper.addClass(trigger, 'popped');
        }
    }

    /**
     * Remove all popovers when anything is clicked
     *
     * @access private
     */
    Popovers.prototype._addWindowClickEvent = function()
    {
        var _this = this;

        window.addEventListener('click', function (e)
        {
            e = e || window.event;
            var clicked = e.target;

            // Clicked inside the popver itself,
            // Clicked a popover trigger
            // Clicked a close trigger inside the popover
            if ( (Helper.hasClass(clicked, 'js-popover') || Helper.hasClass(clicked, 'popover') || Helper.closestClass(clicked, 'popover')) && !Helper.hasClass(clicked, 'js-remove-pop'))
            {
                return;
            }

            _this._removeAll();
        });
    }
    
    /**
     * Get the handler for the trigger
     * 
     * @access private
     * @param  node    trigger DOM node that triggered event
     * @return object|false
     */
    Popovers.prototype._getHandler = function(trigger)
    {
        for (var i = 0; i < this._pops.length; i++)
        {
           if (this._pops[i]['trigger'] === trigger) return this._pops[i];
        }

        return false;
    }

    /**
     * Remove all the popovers currently being displayed
     *
     * @access private
     */
    Popovers.prototype._removeAll = function()
    {
        for (var i = 0; i < this._pops.length; i++)
        {
            this._pops[i].remove();

            Helper.removeClass(this._pops[i].options.target, 'popped');
        }
    }

    // Load into Hubble DOM core
    Container.get('Hubble').dom().register('Popovers', Popovers);

}());