/**
 * File inputs
 *
 * @author    Joe J. Howard
 * @copyright Joe J. Howard
 * @license   https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE
 */

 (function()
 {
   /**
     * JS Helper reference
     * 
     * @var object
     */
    var Helper = Hubble.helper();

    /**
     * Module constructor
     *
     * @constructor
     * @access public
     */
    var ChoiceChips = function()
    {
        this._chips = Helper.$All('.js-choice-chips .chip');

        this._bind();
        
        return this;
    }

    /**
     * Module destructor remove event handlers
     *
     * @access public
     */
    ChoiceChips.prototype.destruct = function()
    {
        this._unbind();

        this._chips = [];
    }

    /**
     * Bind DOM listeners
     *
     * @access private
     */
    ChoiceChips.prototype._bind = function()
    {
        Helper.addEventListener(this._chips, 'click', this._clickHandler);
    }

    /**
     * Unbind DOM listeners
     *
     * @access private
     */
    ChoiceChips.prototype._unbind = function()
    {
        Helper.removeEventListener(this._chips, 'click', this._clickHandler);
    }

    /**
     * Handle click event on chip
     *
     * @access private
     * @param  event|null e
     */
    ChoiceChips.prototype._clickHandler = function(e)
    {
        e = e || window.event;

        var _wrapper = Helper.closest(this, '.js-choice-chips');
        var _input   = Helper.$('.js-choice-input', _wrapper);

        if (!Helper.hasClass(this, 'selected'))
        {
            Helper.removeClass(Helper.$('.chip.selected', _wrapper), 'selected');

            Helper.addClass(this, 'selected');

            if (_input)
            {
                _input.value = this.dataset.value;

                Container.Events().fire('Chips:selected', [this.dataset.value, !Helper.hasClass(this, 'selected')]);
            }
        }
    }

    // Load into Hubble DOM core
    Container.get('Hubble').dom().register('ChoiceChips', ChoiceChips);

}());
