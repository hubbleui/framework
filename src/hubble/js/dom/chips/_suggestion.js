(function()
{
    /**
     * JS Helper reference
     * 
     * @var {object}
     */
    const Helper = Container.Helper();

    /**
     * Chip suggestions.
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE}
     */
    class ChipSuggestions
    {
        /**
         * Module constructor
         *
         * @constructor
         {*} @access public
         */
    	constructor()
        {
            this._chips = Helper.$All('.js-chip-suggestions .chip');

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
            Helper.addEventListener(this._chips, 'click', this._clickHandler);
        }

        /**
         * Unbind DOM listeners
         *
         * @access {private}
         */
        _unbind()
        {
            Helper.removeEventListener(this._chips, 'click', this._clickHandler);
        }

        /**
         * Chip click handler
         *
         * @access {private}
         * @param  {event|null} e
         */
        _clickHandler(e)
        {
            e = e || window.event;

            var _wrapper = Helper.closest(this, '.js-chip-suggestions');
            var _id = _wrapper.dataset.inputTarget;
            var _input = Helper.$('#' + _id);
            var _text = this.innerText.trim();

            if (!_input || !Helper.in_dom(_input))
            {
                throw new Error('Target node does not exist.');

                return false;
            }

            // Chips input
            if (Helper.has_class(_input, 'js-chips-input'))
            {
                Container.ChipInputs().addChip(_text, _input);

                Helper.remove_from_dom(this);

                return;
            }


            var _chip = document.createElement('span');
            var _classes = _wrapper.dataset.chipClass;
            var _space = '';
            _chip.className = 'chip';

            if (_classes)
            {
                _chip.className += _classes;
            }

            if (_input.value !== '')
            {
                _space = ' ';
            }

            _input.value += _space + _text;

            Helper.remove_from_dom(this);
        }
    }

    // Load into Hubble DOM core
    Hubble.dom().register('ChipSuggestions', ChipSuggestions);

}());
