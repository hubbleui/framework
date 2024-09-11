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
    const [$, add_event_listener, attr, closest, has_class, in_dom, remove_event_listener, remove_from_dom, trigger_event, extend] = FrontBx.import(['$','add_event_listener','attr','closest','has_class','in_dom','remove_event_listener','remove_from_dom','trigger_event','extend']).from('_');

    /**
     * Chip suggestions.
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.comfrontbx/uimaster/LICENSE}
     */
    const ChipSuggestions = function()
    {
        this.super('.js-chip-suggestions .btn-chip');
    }

    /**
     * Bind DOM listeners
     *
     * @access {private}
     */
    ChipSuggestions.prototype.bind = function(node)
    {
        add_event_listener(node, 'click', this._clickHandler);
    }

    /**
     * Unbind DOM listeners
     *
     * @access {private}
     */
    ChipSuggestions.prototype.unbind = function()
    {
        remove_event_listener(node, 'click', this._clickHandler);
    }

    /**
     * Chip click handler
     *
     * @access {private}
     * @param  {event|null} e
     */
    ChipSuggestions.prototype._clickHandler = function(e)
    {
        e = e || window.event;

        e.preventDefault();

        var _wrapper = closest(this, '.js-chip-suggestions');
        var _input   = $('#' + _wrapper.dataset.inputTarget);
        var _text    = this.innerText.trim();

        if (!_input || !in_dom(_input))
        {
            throw new Error('Target node does not exist.');

            return false;
        }

        // Chips input
        if (has_class(_input, '.js-chips-input'))
        {
            FrontBx.dom().component('ChipInputs').addChip(_text, _input);

            remove_from_dom(this);

            return;
        }

        let val = attr(_input, 'value');

        attr(_input, 'value',  val === '' ? _text : `${val} ${_text}`);

        trigger_event(_input, 'change');

        remove_from_dom(this);
    }

    // Load into FrontBx DOM core
    FrontBx.dom().register('ChipSuggestions', extend(Component, ChipSuggestions));

})();