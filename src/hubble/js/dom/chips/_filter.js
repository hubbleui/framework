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
    const [add_event_listener, remove_event_listener, toggle_class, extend] = Hubble.import(['add_event_listener','remove_event_listener','toggle_class', 'extend']).from('_');

    /**
     * Filter chips
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE}
     */
    const FilterChips = function()
    {
        this.super('.js-filter-chips .btn-chip');
    }

    /**
     * Bind DOM listeners
     *
     * @access {private}
     */
    FilterChips.prototype.bind = function(node)
    {
        add_event_listener(node, 'click', this._clickHandler);
    }

    /**
     * Unbind DOM listeners
     *
     * @access {private}
     */
    FilterChips.prototype.unbind = function(node)
    {
        remove_event_listener(node, 'click', this._clickHandler);
    }

    /**
     * Handle click event on chip
     *
     * @access {private}
     * @param  {event|null} e
     */
    FilterChips.prototype._clickHandler = function(e)
    {
        e = e || window.event;

        e.preventDefault();

        toggle_class(this, 'checked');
    }

    // Load into Hubble DOM core
    Hubble.dom().register('FilterChips', extend(Component, FilterChips));

}());
