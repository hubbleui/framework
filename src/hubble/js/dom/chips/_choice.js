(function()
{
    /**
     * JS Helper reference
     * 
     * @var {object}
     */
    const Helper = Container.Helper();

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
            this._chips = Helper.$All('.js-choice-chips .chip');

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
         * Handle click event on chip
         *
         * @access {private}
         * @param  {event|null} e
         */
        _clickHandler(e)
        {
            e = e || window.event;

            var _wrapper = Helper.closest(this, '.js-choice-chips');
            var _input = Helper.$('.js-choice-input', _wrapper);

            if (!Helper.has_class(this, 'selected'))
            {
                Helper.remove_class(Helper.$('.chip.selected', _wrapper), 'selected');

                Helper.add_class(this, 'selected');

                if (_input)
                {
                    _input.value = this.dataset.value;

                    Container.Events().fire('Chips:selected', [this.dataset.value, !Helper.has_class(this, 'selected')]);
                }
            }
        }
    }

    // Load into Hubble DOM core
    Hubble.dom().register('ChoiceChips', ChoiceChips);

}());
