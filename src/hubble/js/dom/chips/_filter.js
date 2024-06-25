(function()
{
    /**
     * JS Helper reference
     * 
     * @var {object}
     */
    const Helper = Container.Helper();

    /**
     * Filter chips
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE}
     */
    class FilterChips
    {
        /**
         * Module constructor
         *
         * @constructor
         {*} @access public
         */
    	constructor()
        {
            this._chips = Helper.$All('.js-filter-chips .chip');

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

            Container.Events().fire('Chips:selected', [this.dataset.value, !Helper.has_class(this, 'checked')]);

            Helper.toggle_class(this, 'checked');
        }
    }

    // Load into Hubble DOM core
    Hubble.dom().register('FilterChips', FilterChips);

}());
