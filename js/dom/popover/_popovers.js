(function()
{
    /**
     * Component base
     * 
     * @var {class}
     */
    const [Component] = FrontBx.get('Component');

    /**
     * JS Helper reference
     * 
     * @var {object}
     */
    const [find, find_all, add_class, on, closest, has_class, is_empty, remove_class, off, each, extend] = FrontBx.import(['find', 'find_all', 'add_class', 'on', 'closest', 'has_class', 'is_empty', 'remove_class', 'off', 'each', 'extend']).from('_');

    var HOVER_TIMER;

    var POP_HANDLERS = new Map;

    /**
     * Popover
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.comfrontbx/uimaster/LICENSE}
     */
    const Popover = function()
    {
        this.super('.js-popover');

        this._windowClick = false;

        this.defaultProps = 
        {
            direction: 'top',
            animation: 'pop',
            theme:     'light',
            title:     '',
            content:   '',
            event:     'click',
        };
    }

    /**
     * Initialize the handlers on a trigger
     *
     * @access {private}
     * @param  {DOMElement} trigger Click/hover trigger
     */
    Popover.prototype.template = function(props)
    {

    }

    /**
     * Initialize the handlers on a trigger
     *
     * @access {private}
     * @param  {DOMElement} trigger Click/hover trigger
     */
    Popover.prototype._build = function(options)
    {

    }

    /**
     * Initialize the handlers on a trigger
     *
     * @access {private}
     * @param  {DOMElement} trigger Click/hover trigger
     */
    Popover.prototype.bind = function(trigger)
    {
        if (!this._windowClick)
        {
            on(window, 'click', this._windowClickHandler, this);

            this._windowClick = true;
        }

        let direction = trigger.dataset.popoverDirection;
        let title     = trigger.dataset.popoverTitle;
        let theme     = trigger.dataset.popoverTheme || 'dark';
        let content   = trigger.dataset.popoverContent;
        let evnt      = trigger.dataset.popoverEvent;
        let animation = trigger.dataset.popoverAnimate || 'pop';
        let target    = trigger.dataset.popoverTarget;
        let closeBtn  = evnt === 'click' ? '<button type="button" class="btn btn-sm btn-pure btn-circle js-remove-pop close-btn"><span class="fa fa-xmark"></span></button>' : '';
        let pop       = '<div class="popover-content"><p>' + content + '</p></div>';

        if (title)
        {
            pop = closeBtn + '<h5 class="popover-title">' + title + '</h5>' + pop;
        }

        if (target)
        {
            pop = find('#' + target).cloneNode(true);
            pop.classList.remove('hidden');
        }

        let popHandler = FrontBx.get('PopHandler',
        {
            target: trigger,
            direction: direction,
            template: pop,
            animation: animation,
            classes: 'popover ' + direction + ' ' + theme,
        });

        if (evnt === 'click')
        {
            on(trigger, 'click', this._clickHandler, this);
            on(window, 'resize', this._windowResize, this);
        }
        else
        {                
            on(trigger, 'mouseenter', this._hoverEnter, this);
        }

        POP_HANDLERS.set(trigger, popHandler);
    }

    /**
     * Unbind event listeners on a trigger
     *
     * @param {trigger} node
     * @access {private}
     */
    Popover.prototype.unbind = function(trigger)
    {
        if (this._windowClick)
        {
            off(window, 'click', this._windowClickHandler, this);

            this._windowClick = false;
        }

        var evnt = trigger.dataset.popoverEvent;

        if (evnt === 'click')
        {
            off(trigger, 'click', this._clickHandler, this);
            off(window, 'resize', this._windowResize, this);
        }
        else
        {
            off(trigger, 'mouseenter', this._hoverEnter, this);
            off(trigger, 'mouseleave', this._hoverLeave, this);

            this._killPop(trigger);

            POP_HANDLERS.delete(trigger);
        }
    }

    /**
     * Hover over event handler
     *
     * @access {private}
     */
    Popover.prototype._hoverEnter = function(e, trigger)
    {
        if (has_class(trigger, 'popped')) return;

        let handler = POP_HANDLERS.get(trigger);
        
        let pop = handler.render();

        on(pop, 'mouseenter', this._hoverPop, this);

        on(trigger, 'mouseleave', this._hoverLeave, this);
        
        add_class(trigger, 'popped');
    }

    /**
     * Hover leave event handler
     *
     * @access {private}
     */
    Popover.prototype._hoverLeave = function(e, trigger)
    {
        clearTimeout(HOVER_TIMER);

        // Mouse leaving pop not trigger
        if (!has_class(trigger, '.js-popover'))
        {
            for (let [_trigger, handler] of POP_HANDLERS)
            {
                if (handler.el === trigger) trigger = handler.trigger;
            }
        }

        HOVER_TIMER = setTimeout(() => 
        {
            this._killPop(trigger);

            off(trigger, 'mouseleave', this._hoverLeave, this);

        }, 300);
    }

    /**
     * Hover leave event handler
     *
     * @access {private}
     */
    Popover.prototype._hoverPop = function(e, pop)
    {
        clearTimeout(HOVER_TIMER);

        on(pop, 'mouseleave', this._hoverLeave, this);
    }

    /**
     * Window resize event handler
     *
     * @access {private}
     */
    Popover.prototype._windowResize = function()
    {
        for (let [trigger, handler] of POP_HANDLERS)
        {
            if (handler.state === 'active') handler.stylePop();

        }
    }

    /**
     * Click event handler
     *
     * @param {event|null} e JavaScript click event
     * @access {private}
     */
    Popover.prototype._killPop = function(trigger)
    {            
        let handler = POP_HANDLERS.get(trigger);

        handler.remove();
        
        remove_class(trigger, 'popped');
    }

    /**
     * Click event handler
     *
     * @param {event|null} e JavaScript click event
     * @access {private}
     */
    Popover.prototype._clickHandler = function(e, trigger)
    {
        e = e || window.event;

        e.preventDefault();
        
        var popHandler = POP_HANDLERS.get(trigger);

        if (has_class(trigger, 'popped'))
        {
            this._removeAll(trigger);
            
            popHandler.remove();
            
            remove_class(trigger, 'popped');
        }
        else
        {
            this._removeAll(trigger);
            
            popHandler.render();
            
            add_class(trigger, 'popped');
        }
    }

    /**
     * Remove all popovers when anything is clicked
     *
     * @access {private}
     */
    Popover.prototype._windowClickHandler = function(e)
    {        
        let clicked = e.target;

        // Clicked the close button
        if (has_class(clicked, 'js-remove-pop') || closest(clicked, '.js-remove-pop'))
        {
            this._removeAll();

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
     * Remove all the popovers currently being displayed
     *
     * @access {private}
     */
    Popover.prototype._removeAll = function(exception)
    {        
        for (let [trigger, handler] of POP_HANDLERS)
        {
            if (!exception || (exception && trigger !== exception))
            {
                handler.remove();

                remove_class(trigger, 'popped');
            }
        }
    }

    // Load into FrontBx DOM core
    FrontBx.dom().register('Popover', extend(Component, Popover));

}());
