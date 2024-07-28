(function()
{
    /**
     * Component base
     * 
     * @var {class}
     */
    const [Component] = Container.get('Component');

    /**
     * JS Helper reference
     * 
     * @var {object}
     */
    const [$, $All, add_class, add_event_listener, closest, has_class, is_empty, remove_class, remove_event_listener, extend] = Container.import(['$', '$All', 'add_class', 'add_event_listener', 'closest', 'has_class', 'is_empty', 'remove_class', 'remove_event_listener', 'extend']).from('_');

    /**
     * Popovers
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE}
     */
    const Popovers = function()
    {
        this.super('.js-popover');

        this._pops = [];

        this._windowClick = false;
    }

    /**
     * Initialize the handlers on a trigger
     *
     * @access {private}
     * @param  {DOMElement} trigger Click/hover trigger
     */
    Popovers.prototype.bind = function(trigger)
    {
        if (!this._windowClick)
        {
            add_event_listener(window, 'click', this._windowClickHandler, this);

            this._windowClick = true;
        }

        var direction = trigger.dataset.popoverDirection;
        var title     = trigger.dataset.popoverTitle;
        var theme     = trigger.dataset.popoverTheme || 'dark';
        var content   = trigger.dataset.popoverContent;
        var evnt      = trigger.dataset.popoverEvent;
        var animation = trigger.dataset.popoverAnimate || 'pop';
        var target    = trigger.dataset.popoverTarget;
        var closeBtn  = evnt === 'click' ? '<button type="button" class="btn btn-sm btn-pure btn-circle js-remove-pop close-btn"><span class="glyph-icon glyph-icon-cross3"></span></button>' : '';
        var pop       = '<div class="popover-content"><p>' + content + '</p></div>';

        if (title)
        {
            pop = closeBtn + '<h5 class="popover-title">' + title + '</h5>' + pop;
        }

        if (target)
        {
            pop = $('#' + target).cloneNode(true);
            pop.classList.remove('hidden');
        }

        var popHandler = Container.get('PopHandler',
        {
            target: trigger,
            direction: direction,
            template: pop,
            animation: animation,
            classes: 'popover ' + direction + ' ' + theme,
        });

        this._pops.push(popHandler);

        if (evnt === 'click')
        {
            add_event_listener(trigger, 'click', this._clickHandler, this);
            add_event_listener(window, 'resize', this._windowResize, this);
        }
        else
        {                
            add_event_listener(trigger, 'mouseenter', this._hoverOver, this);
            add_event_listener(trigger, 'mouseleave', this._hoverLeavTimeout, this);
        }
    }

    /**
     * Unbind event listeners on a trigger
     *
     * @param {trigger} node
     * @access {private}
     */
    Popovers.prototype.unbind = function(trigger)
    {
        if (this._windowClick)
        {
            remove_event_listener(window, 'click', this._windowClickHandler, this);

            this._windowClick = false;
        }

        var evnt = trigger.dataset.popoverEvent;

        if (evnt === 'click')
        {
            remove_event_listener(trigger, 'click', this._clickHandler, this);
            remove_event_listener(window, 'resize', this._windowResize, this);
        }
        else
        {
            remove_event_listener(trigger, 'mouseenter', this._hoverOver, this);
            remove_event_listener(trigger, 'mouseleave', this._hoverLeavTimeout, this);
        }
    }

    /**
     * Timeout handler for hoverleave
     *
     * @access {private}
     */
    Popovers.prototype._hoverLeavTimeout = function(e)
    {
        e = e || window.event;

        const _this = this;

        setTimeout(() => _this._hoverLeave(e), 300);
    }

    /**
     * Hover over event handler
     *
     * @access {private}
     */
    Popovers.prototype._hoverOver = function(e, trigger)
    {
        var popHandler = this._getHandler(trigger);

        if (has_class(trigger, 'popped')) return;
        
        popHandler.render();
        
        add_class(trigger, 'popped');
    }

    /**
     * Hover leave event handler
     *
     * @access {private}
     */
    Popovers.prototype._hoverLeave = function(e)
    {
        var hovers = $All(':hover');

        const _this = this;

        each(hovers, (i, hover) =>
        {
            if (has_class(hover, 'popover'))
            {
                remove_event_listener(hover, 'mouseleave', _this._hoverLeave, _this)
            }
        });
    }

    /**
     * Window resize event handler
     *
     * @access {private}
     */
    Popovers.prototype._windowResize = function()
    {
        each(this._DOMElements, (i, node) =>
        {
            if (has_class(node, 'popped'))
            {
                var popHandler = this._getHandler(node);
                
                popHandler.stylePop();
            }

        }, this);
    }

    /**
     * Click event handler
     *
     * @param {event|null} e JavaScript click event
     * @access {private}
     */
    Popovers.prototype._clickHandler = function(e, trigger)
    {
        e = e || window.event;

        e.preventDefault();
        
        var popHandler = this._getHandler(trigger);

        if (has_class(trigger, 'popped'))
        {
            this._removeAll();
            
            popHandler.remove();
            
            remove_class(trigger, 'popped');
        }
        else
        {
            this._removeAll();
            
            popHandler.render();
            
            add_class(trigger, 'popped');
        }
    }

    /**
     * Remove all popovers when anything is clicked
     *
     * @access {private}
     */
    Popovers.prototype._windowClickHandler = function(e, clicked)
    {
        e = e || window.event;
        
        var clicked = e.target;

        // Clicked the close button
        if (has_class(clicked, 'js-remove-pop') || closest(clicked, '.js-remove-pop'))
        {
            _this._removeAll();

            return;
        }

        // Clicked inside the popover
        if (has_class(clicked, 'popover') || closest(clicked, '.popover'))
        {
            return;
        }

        // Clicked a popover trigger
        if (has_class(clicked, 'js-popover') || closest(clicked, '.js-popover'))
        {
            return;
        }

        this._removeAll();
    }

    /**
     * Get the handler for the trigger
     * 
     * @access {private}
     * @param  {DOMElement}    trigger DOM node that triggered event
     * @return {object|false}
     */
    Popovers.prototype._getHandler = function(trigger)
    {
        var ret = false;

        each(this._pops, (i, pop) =>
        {
            if (pop['trigger'] === trigger)
            {
                ret = pop;

                return false;
            }
        });

        return ret;
    }

    /**
     * Remove all the popovers currently being displayed
     *
     * @access {private}
     */
    Popovers.prototype._removeAll = function()
    {
        each(this._pops, (i, pop) =>
        {
            pop.remove();

            remove_class(pop.options.target, 'popped');
        });
    }

    // Load into Hubble DOM core
    Hubble.dom().register('Popovers', extend(Component, Popovers));

}());
