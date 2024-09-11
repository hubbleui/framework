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
    const [$, add_event_listener, animate, bool, has_class, is_node_type, remove_event_listener, toggle_class, trigger_event, extend] = FrontBx.import(['$','add_event_listener','animate','bool','has_class','is_node_type','remove_event_listener','toggle_class','trigger_event','extend']).from('_');

    /**
     * Toggle height on click
     *
     * @class
     * @extends {Component}
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.comfrontbx/uimaster/LICENSE}
     */
    const Collapse = function()
    {        
        this.super('.js-collapse');
    }

    /**
     * Event binder - Binds all events on button click
     *
     * @access {private}
     */
    Collapse.prototype.bind = function(node)
    {
        add_event_listener(node, 'click', this._eventHandler);
    }

    /**
     * Event unbinder - Removes all events on button click
     *
     * @access {private}
     */
    Collapse.prototype.unbind = function(node)
    {
        remove_event_listener(node, 'click', this._eventHandler);
    }

    /**
     * Handle the click event
     *
     * @param {event|null} e JavaScript click event
     * @access {private}
     */
    Collapse.prototype._eventHandler = function(e)
    {
        e = e || window.event;

        if (is_node_type(this, 'a'))
        {
            e.preventDefault();
        }

        var clicked  = this;
        var targetEl = $('#' + clicked.dataset.collapseTarget);
        var duration = parseInt(clicked.dataset.collapseSpeed) || 350;
        var easing   = clicked.dataset.collapseEasing || 'easeOutExpo';
        var opacity  = bool(clicked.dataset.withOpacity);
        var closing  = has_class(clicked, 'active');

        trigger_event(targetEl, 'collapse:toggle', closing ? 'close' : 'open');

        var options  = 
        {
            property: 'height',
            to: closing ? '0px' : 'auto',
            from: closing ? 'auto' : '0px',
            duration: duration, 
            easing: easing,
            callback: () => { trigger_event(targetEl, 'collapse:toggled', closing ? 'close' : 'open'); }
        };

        animate(targetEl, options);
        toggle_class(clicked, 'active');
    }

    // Load into FrontBx DOM core
    FrontBx.dom().register('Collapse', extend(Component, Collapse));
})();