/**
 * Close messages
 *
 * @author    Joe J. Howard
 * @copyright Joe J. Howard
 * @license   https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE
 */

(function()
{
    /**
     * Helper instance
     * 
     * @var object
     */
    var Helper = Container.get('JSHelper');

    /**
     * Constructor
     *
     * @class
     * @constructor
     * @access public
     */
    var MessageClosers = function()
    {
        this._triggers = Helper.$All('.js-close-msg');
        
        if (!Helper.empty(this._triggers))
        { 
            this._bind();
        }

        return this;
    };

    /**
     * Module destructor - removes event listeners
     *
     * @constructor
     * @access public
     */
    MessageClosers.prototype.destruct = function()
    {
        this._unbind();

        this._triggers = [];
    }

    /**
     * Event binder - Binds all events on button click
     *
     * @access private
     */
    MessageClosers.prototype._bind = function()
    {
        for (var i = 0; i < this._triggers.length; i++)
        {
            Helper.addEventListener(this._triggers[i], 'click', this._eventHandler);
        }
    }

    /**
     * Event ubinder - Binds all event handlers on button click
     *
     * @access private
     */
    MessageClosers.prototype._unbind = function()
    {
        for (var i = 0; i < this._triggers.length; i++)
        {
            Helper.removeEventListener(this._triggers[i], 'click', this._eventHandler);
        }
    }

    /**
     * Event handler - handles removing the message
     *
     * @param  event   e JavaScript click event
     * @access private
     */
    MessageClosers.prototype._eventHandler = function(e)
    {
        e = e || window.event;

        e.preventDefault();

        var toRemove = this.parentNode;

        if (Helper.hasClass(this, 'js-rmv-parent'))
        {
            toRemove = toRemove.parentNode;
        }
        
        Helper.animate(toRemove, 'opacity', '1', '0', 300, 'ease');
        
        setTimeout(function()
        {
            Helper.removeFromDOM(toRemove);

        }, 300);
    }

    // Load into hubble DOM core
    Container.get('Hubble').dom().register('MessageClosers', MessageClosers);

})();