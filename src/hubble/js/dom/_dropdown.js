/**
 * Dropdown Buttons
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
     * @access public
     * @constructor
     */
    var DropDowns = function()
    {
        /**
         * Array of click-triggers
         * 
         * @var array
         */
        this._triggers = Helper.$All('.js-drop-trigger');

        if (!Helper.empty(this._triggers))
        { 
            this._bind();
        }

        return this;
    };

    /**
     * Module destructor
     *
     * @access public
     */
    DropDowns.prototype.destruct = function()
    {
        this._unbind();
        this._triggers = [];
    }

    /**
     * Bind click listener to containers
     *
     * @access private
     */
    DropDowns.prototype._bind = function()
    {
        for (var i = 0; i < this._triggers.length; i++)
        {
            Helper.addEventListener(this._triggers[i], 'click', this._clickHandler);
        }
        Helper.addEventListener(window, 'click', this._windowClick);
    }

    /**
     * Unbind listener to containers
     *
     * @access private
     */
    DropDowns.prototype._unbind = function()
    {
        for (var i = 0; i < this._triggers.length; i++)
        {
            Helper.removeEventListener(this._triggers[i], 'click', this._clickHandler);
        }
        Helper.removeEventListener(window, 'click', this._windowClick);
    }

    /**
     * Click event handler
     *
     * @param  event|null e JavaScript Click event
     * @access private
     */
    DropDowns.prototype._clickHandler = function(e)
    {
        e = e || window.event;
        e.preventDefault();

        var button   = this;
        var _this    = Container.get('DropDowns');

        // Hide all dropdowns except this
        _this._hideDropDowns(button);

        // Remove active and return
        if (Helper.hasClass(button, 'active'))
        {
            _this._hideDrop(button);
        }
        else
        {
            _this._showDrop(button);
        }
    }

    /**
     * Click event handler
     *
     * @param  event|null e JavaScript Click event
     * @access private
     */
    DropDowns.prototype._hideDrop = function(button)
    {
        var drop = Helper.$('.drop-menu', button.parentNode);
        Helper.removeClass(button, 'active');
        button.setAttribute('aria-pressed', 'false');
        Helper.hideAria(drop);
        drop.blur();
    }

    /**
     * Click event handler
     *
     * @param  event|null e JavaScript Click event
     * @access private
     */
    DropDowns.prototype._showDrop = function(button)
    {
        var drop = Helper.$('.drop-menu', button.parentNode);
        Helper.addClass(button, 'active');
        button.setAttribute('aria-pressed', 'true');
        Helper.showAria(drop);
        drop.focus();
    }

    /**
     * Window click event
     *
     * @param event|null e JavaScript click event
     * @access private
     */
    DropDowns.prototype._windowClick = function(e)
    {
        e = e || window.event;
        if (Helper.closestClass(e.target, 'js-drop-trigger'))
        {
            return;
        }
        if (!Helper.hasClass(e.target, 'js-drop-trigger'))
        {
            var _this = Container.get('DropDowns');
            
            _this._hideDropDowns();
        }
    }

    /**
     * Hide all dropdowns
     *
     * @param exception (optional) Button to skip
     * @access private
     */
    DropDowns.prototype._hideDropDowns = function(exception)
    {
        dropTriggers = Helper.$All('.js-drop-trigger');
        exception    = (typeof exception === 'undefined' ? false : exception);

        for (var i = 0; i < dropTriggers.length; i++)
        {
            var node = dropTriggers[i];

            if (node === exception)
            {
                continue;
            }

            this._hideDrop(node);
        }
    }

    // Load into Hubble DOM core
    Container.get('Hubble').dom().register('DropDowns', DropDowns);

})();