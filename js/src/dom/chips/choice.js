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
    const [$, add_class, add_event_listener, closest, has_class, remove_class, remove_event_listener, trigger_event, extend] = FrontBx.import(['$','add_class','add_event_listener','closest','has_class','remove_class','remove_event_listener','trigger_event','extend']).from('_');

    /**
     * Choice chips
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.comfrontbx/uimaster/LICENSE}
     */
    const ChoiceChips = function()
    {
        this.super('.js-choice-chips .btn-chip');
    }

    /**
     * Bind DOM listeners
     *
     * @access {private}
     */
    ChoiceChips.prototype.bind = function(node)
    {
        add_event_listener(node, 'click', this._clickHandler);
    }

    /**
     * Unbind DOM listeners
     *
     * @access {private}
     */
    ChoiceChips.prototype.unbind = function(node)
    {
        remove_event_listener(node, 'click', this._clickHandler);
    }

    /**
     * Handle click event on chip
     *
     * @access {private}
     * @param  {event|null} e
     */
    ChoiceChips.prototype._clickHandler = function(e)
    {
        e = e || window.event;

        var _wrapper = closest(this, '.js-choice-chips');

        var _input = $('.js-choice-input', _wrapper);

        if (!has_class(this, 'selected'))
        {                
            remove_class($('.btn-chip.selected', _wrapper), 'selected');

            add_class(this, 'selected');

            if (_input)
            {
                _input.value = this.dataset.value || this.innerText.trim();

                trigger_event(_input, 'input');
                trigger_event(_input, 'change');
            }
        }
    }

    // Load into FrontBx DOM core
    FrontBx.dom().register('ChoiceChips', extend(Component, ChoiceChips));

})();