(function()
{
    /**
     * JS Helper reference
     * 
     * @var {object}
     */
    const Helper = Container.Helper();

    /**
     * Chip inputs
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE}
     */
    class ChipInputs
    {
        /**
         * Module constructor
         *
         * @constructor
         {*} @access public
         */
    	constructor()
        {
            this._wrappers = Helper.$All('.js-chips-input');

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

            this._wrappers = [];
        }

        /**
         * Bind DOM listeners
         *
         * @access {private}
         */
        _bind()
        {
            for (var i = 0; i < this._wrappers.length; i++)
            {
                this._initInput(this._wrappers[i]);
            }
        }

        /**
         * Unbind DOM listeners
         *
         * @access {private}
         */
        _unbind()
        {
            for (var i = 0; i < this._wrappers.length; i++)
            {
                this._destroy(this._wrappers[i]);
            }
        }

        /**
         * Init a chips input
         *
         * @access {private}
         * @param  {DOMElement}    _wrapper
         */
        _initInput(_wrapper)
        {
            let _input = Helper.$('.js-chip-input', _wrapper);

            Helper.addEventListener(Helper.$All('.js-remove-btn', _wrapper), 'click', this._removeChip);

            Helper.addEventListener(_input, 'keyup', this._onKeyUp);

            if (Helper.closest(_input, 'form'))
            {
                Helper.addEventListener(_input, 'keydown', this._preventSubmit);
            }
        }

        /**
         * Destroy chip listeners
         *
         * @access {private}
         * @param  {DOMElement}    _wrapper
         */
        _destroy(_wrapper)
        {
            var _removeBtns = Helper.$All('.btn-chip .js-remove-btn', _wrapper);
            var _input = Helper.$('.js-chip-input', _wrapper);

            Helper.removeEventListener(_removeBtns, 'click', this._removeChip);

            Helper.removeEventListener(_input, 'keyup', this._onKeyUp);

            if (Helper.closest(_input, 'form'))
            {
                Helper.removeEventListener(_input, 'keydown', this._preventSubmit);
            }
        }

        /**
         * Prevent the form from submitting if it's part of a form
         *
         * @access {private}
         * @param  {event|null} e
         */
        _preventSubmit(e)
        {
            e = e || window.event;

            var _key = e.code || e.key || e.keyCode || e.charCode;

            if (_key == 'Enter' || _key === 13)
            {
                e.preventDefault();

                return false;
            }
            // Backspace
            else if (_key == 'Delete' || _key == 'Backspace' || _key == 8 || _key == 46)
            {
                if (this.value === '')
                {
                    var _wrapper = Helper.closest(this, '.js-chips-input');

                    Container.ChipInputs()._removeLastChip(_wrapper);
                }
            }
        }

        /**
         * Handle pressing enter to insert the chip
         *
         * @access {private}
         * @param  {event|null} e
         */
        _onKeyUp(e)
        {
            e = e || window.event;

            var _key = e.code || e.key || e.keyCode || e.charCode;

            // Enter
            if (_key == 'Enter' || _key === 13)
            {
                var _this = Container.ChipInputs();

                var _wrapper = Helper.closest(this, '.js-chips-input');

                var _value = Helper.input_value(this).trim();

                if (!Helper.in_array(_value, _this._getChipsValues(_wrapper)) && _value !== '')
                {
                    _this.addChip(_value, _wrapper);

                    this.value = '';
                }
            }
        }

        /**
         * Remove last chip
         *
         * @access {private}
         * @param  {DOMElement}    _wrapper
         */
        _removeLastChip(_wrapper)
        {
            var _chips = Helper.$All('.btn-chip', _wrapper);

            if (!Helper.is_empty(_chips))
            {
                Helper.remove_from_dom(_chips.pop());
            }
        }

        /**
         * Insert new chip
         *
         * @access {public}
         * @param  {string}      _value
         * @param  {DOMElement}        _wrapper
         * @param  {string|bool} _icon
         */
        addChip(_value, _wrapper, _icon)
        {
            let chip = Container.Chip({
                text       : _value.trim(),
                removeable : true,
                input      : _wrapper.dataset.inputName,
                variant    : _wrapper.dataset.chipClass,
            });

            _wrapper.insertBefore(chip, Helper.first_children(_wrapper).pop());

            Helper.addEventListener(Helper.$('.js-remove-btn', chip), 'click', this._removeChip);

            Container.Hubble().dom().refresh('Ripple', _wrapper);
        }

        /**
         * Remove an existing chip
         *
         * @access {private}
         * @param  {event|null} e
         */
        _removeChip(e)
        {
            e = e || window.event;

            e.preventDefault();

            Helper.remove_from_dom(Helper.closest(this, '.btn-chip'));
        }

        /**
         * Get all values from chip input
         *
         * @access {private}
         * @param  {DOMElement}    _wrapper
         * @return {array}
         */
        _getChipsValues(_wrapper)
        {
            var _result = [];

            var _chips = Helper.$All('.btn-chip input', _wrapper);

            for (var i = 0; i < _chips.length; i++)
            {
                _result.push(Helper.input_value(_chips[i]));
            }

            return _result;
        }
    }

    // Load into Hubble DOM core
    Hubble.dom().register('ChipInputs', ChipInputs);

}());
