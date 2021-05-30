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
    var ChipSuggestions = function()
    {
        this._chips = Helper.$All('.js-chip-suggestions .chip');

        this._bind();
        
        return this;
    }

    /**
     * Module destructor remove event handlers
     *
     * @access public
     */
    ChipSuggestions.prototype.destruct = function()
    {
        this._unbind();

        this._chips = [];
    }

    /**
     * Bind DOM listeners
     *
     * @access private
     */
    ChipSuggestions.prototype._bind = function()
    {
        Helper.addEventListener(this._chips, 'click', this._clickHandler);
    }

    /**
     * Unbind DOM listeners
     *
     * @access private
     */
    ChipSuggestions.prototype._unbind = function()
    {
        Helper.removeEventListener(this._chips, 'click', this._clickHandler);
    }

    /**
     * Chip click handler
     *
     * @access private
     * @param  event|null e
     */
    ChipSuggestions.prototype._clickHandler = function(e)
    {
        e = e || window.event;
        
        var _wrapper = Helper.closest(this, '.js-chip-suggestions');
        var _id      = _wrapper.dataset.inputTarget;
        var _input   = Helper.$('#' + _id);
        var _text    = this.innerText.trim();

        if (!_input || !Helper.nodeExists(_input))
        {
            throw new Error('Target node does not exist.');

            return false;
        }

        // Chips input
        if (Helper.hasClass(_input, 'js-chips-input'))
        {
            Container.ChipInputs().addChip(_text, _input);

            Helper.removeFromDOM(this);

            return;
        }

        
        var _chip       = document.createElement('span');
        var _classes    = _wrapper.dataset.chipClass;
        var _space      = '';
        _chip.className = 'chip';

        if (_classes)
        {
            _chip.className +=  _classes;
        }

        if (_input.value !== '')
        {
            _space = ' ';
        }

        _input.value += _space +  _text;

        Helper.removeFromDOM(this);
    }

    // Load into Hubble DOM core
    Container.get('Hubble').dom().register('ChipSuggestions', ChipSuggestions);


}());
