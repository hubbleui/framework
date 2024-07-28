(function()
{
    /**
     * Component base
     * 
     * @var {class}
     */
    const [Component] = Container.get('Component');

    /**
     * Helper functions
     * 
     * @var {Function}
     */
    const [$, $All, each, add_class, add_event_listener, closest, has_class, hide_aria, remove_class, remove_event_listener, show_aria, extend] = Container.import(['$','$All','each','add_class','add_event_listener','closest','has_class','hide_aria','remove_class','remove_event_listener','show_aria','extend']).from('_');

    /**
     * Dropdown Buttons
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE}
     */
    const DropDowns = function()
    {
        this.super('.js-drop-trigger');

        this.boundWindow = false;
    }
 
    /**
     * Bind click listener to containers
     *
     * @access {private}
     */
    DropDowns.prototype.bind = function(node)
    {
        add_event_listener(node, 'click', this._clickHandler, this);

        if (!this.boundWindow)
        {
            add_event_listener(window, 'click', this._windowClick, this);

            this.boundWindow = true;
        }
    }

    /**
     * Unbind listener to containers
     *
     * @access {private}
     */
    DropDowns.prototype.unbind = function(node)
    {
        remove_event_listener(node, 'click', this._clickHandler, this);

        if (this.boundWindow)
        {
            remove_event_listener(window, 'click', this._windowClick, this);

            this.boundWindow = false;
        }
    }

    /**
     * Click event handler
     *
     * @param  {event|null} e JavaScript Click event
     * @access {private}
     */
    DropDowns.prototype._clickHandler = function(e, button)
    {
        e = e || window.event;

        var active = $('.js-drop-trigger.drop-active');

        if (active) this._hideDrop(active);

        // Remove active and return
        if (active !== button)
        {
            this._showDrop(button);
        }
    }

    /**
     * Click event handler
     *
     * @param  {event|null} e JavaScript Click event
     * @access {private}
     */
    DropDowns.prototype._hideDrop = function(button)
    {
        var drop = $('.drop-menu', button.parentNode);
        
        remove_class(button, ['active', 'drop-active']);
        
        button.setAttribute('aria-pressed', 'false');
        
        hide_aria(drop);
        
        drop.blur();
    }

    /**
     * Click event handler
     *
     * @param  {event|null} e JavaScript Click event
     * @access {private}
     */
    DropDowns.prototype._showDrop = function(button)
    {
        var drop = $('.drop-menu', button.parentNode);
        
        add_class(button, ['active', 'drop-active']);
        
        button.setAttribute('aria-pressed', 'true');
        
        show_aria(drop);
        
        drop.focus();
    }

    /**
     * Window click event
     *
     * @param {event|null} e JavaScript click event
     * @access {private}
     */
    DropDowns.prototype._windowClick = function(e)
    {
        e = e || window.event;

        if (closest(e.target, '.js-drop-trigger'))
        {
            return;
        }

        var active = $('.js-drop-trigger.drop-active');

        if (active) this._hideDrop(active);
    }

    // Load into Hubble DOM core
    Hubble.dom().register('DropDowns', extend(Component, DropDowns));

})();
