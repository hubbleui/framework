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
     * @var {function}
     */
    const [add_event_listener, animate_css, closest, has_class, remove_from_dom, remove_event_listener, trigger_event, extend] = Container.import(['add_event_listener','animate_css','closest','has_class','remove_from_dom','remove_event_listener','trigger_event','extend']).from('_');

    /**
     * Message closers
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE}
     */
    const MessageClosers = function()
    {
        this.super('.js-close-msg');
    }

    /**
     * @inheritdoc
     * 
     */
    MessageClosers.prototype.bind = function(node)
    {
        add_event_listener(node, 'click', this._eventHandler);
    }

    /**
     * @inheritdoc
     * 
     */
    MessageClosers.prototype.unbind = function(node)
    {
        remove_event_listener(node, 'click', this._eventHandler);
    }

    /**
     * Event handler - handles removing the message
     *
     * @param  {event}   e JavaScript click event
     * @access {private}
     */
    MessageClosers.prototype._eventHandler = function(e)
    {
        e = e || window.event;

        e.preventDefault();

        let msg      = closest(this, '.msg');
        let toRemove = msg;

        trigger_event(msg, 'message:close');

        if (has_class(this, 'js-rmv-parent'))
        {
            toRemove = toRemove.parentNode;
        }

        animate_css(toRemove, { opacity: 0, duration: 500, easing: 'easeInOutCubic', callback: function()
        {
            trigger_event(msg, 'message:closed');

            remove_from_dom(toRemove);
        }});
    }

    // Load into Hubble DOM core
    Hubble.dom().register('MessageClosers', extend(Component, MessageClosers));

})();
