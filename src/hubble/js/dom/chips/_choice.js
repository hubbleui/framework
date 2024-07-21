(function()
{
    const [$, $All, add_class, addEventListener, closest, has_class, remove_class, removeEventListener, trigger_event] = Container.import(['$', '$All', 'add_class', 'addEventListener', 'closest', 'has_class', 'remove_class', 'removeEventListener', 'trigger_event']).from('Helper');

    /**
     * Choice chips
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE}
     */
    class ChoiceChips
    {
        /**
         * Module constructor
         *
         * @constructor
         {*} @access public
         */
        constructor()
        {
            this._chips = $All('.js-choice-chips .btn-chip');

            this._bind();

            return this;
        }

        /**
         * Module destructor remove event handlers
         *
         * @access {public}
         */
        destruct()
        {
            this._unbind();

            this._chips = [];
        }

        /**
         * Bind DOM listeners
         *
         * @access {private}
         */
        _bind()
        {
            addEventListener(this._chips, 'click', this._clickHandler);
        }

        /**
         * Unbind DOM listeners
         *
         * @access {private}
         */
        _unbind()
        {
            removeEventListener(this._chips, 'click', this._clickHandler);
        }

        /**
         * Handle click event on chip
         *
         * @access {private}
         * @param  {event|null} e
         */
        _clickHandler(e)
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
    }

    // Load into Hubble DOM core
    Hubble.dom().register('ChoiceChips', ChoiceChips);

}());
