(function()
{
    /**
     * Component base
     * 
     * @var {class}
     */
    const [Component] = Hubble.get('Component');

    /**
     * Helper functions
     * 
     * @var {Function}
     */
    const [$, add_event_listener, remove_event_listener, has_class, add_class, remove_class, closest, trigger_event, extend] = Hubble.import(['$','add_event_listener','remove_event_listener','has_class','add_class','remove_class','closest','trigger_event','extend']).from('_');

    /**
     * Toggle active on lists
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE}
     */
    const Lists = function()
    { 
        this.super('.js-select-list > li');
    }

    /**
     * @inheritdoc
     * 
     */
    Lists.prototype.bind = function(node)
    {            
        add_event_listener(node, 'click', this._eventHandler);
    }

    /**
     * @inheritdoc
     * 
     */
    Lists.prototype.unbind = function(node)
    {
        remove_event_listener(node, 'click', this._eventHandler);
    }

    /**
     * Handle the click event
     *
     * @param {event|null} e JavaScript click event
     * @access {private}
     */
    Lists.prototype._eventHandler = function(e)
    {
        e = e || window.event;
        
        if (has_class(this, 'selected')) return;

        var list = closest(this, '.js-select-list');

        remove_class($('li.selected', list), 'selected');
        
        add_class(this, 'selected');

        trigger_event(list, 'list:selected', {item: this});
    }

    // Load into Hubble DOM core
    Hubble.dom().register('Lists', extend(Component, Lists));

}());
