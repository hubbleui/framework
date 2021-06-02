/**
 * Clicking one element triggers a lick on another
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
    var ClickTriggers = function()
    {
        /**
         * List of click-triggers
         * 
         * @var array
         */
        this._containers = Helper.$All('.js-click-trigger');

        if (!Helper.empty(this._containers))
        {
            this._bind();
        }

        return this;
    };

    /**
     * Module destructor - removes event listeners
     *
     * @access public
     */
    ClickTriggers.prototype.destruct = function()
    {
        this._unbind();

        this._containers = [];
    }

    /**
     * Event binder - Binds all events on button click
     *
     * @access private
     */
    ClickTriggers.prototype._bind = function()
    {
        for (var i = 0; i < this._containers.length; i++)
        {
            Helper.addEventListener(this._containers[i], 'click', this._eventHandler);
        }
    }

    /**
     * Event ubinder - Binds all event handlers on button click
     *
     * @access private
     */
    ClickTriggers.prototype._unbind = function()
    {
        for (var i = 0; i < this._containers.length; i++)
        {
            Helper.removeEventListener(this._containers[i], 'click', this._eventHandler);
        }
    }

    /**
     * Event handler
     *
     * @access private
     * @params event|null e Browser click event
     */
    ClickTriggers.prototype._eventHandler = function(e)
    {
        e = e || window.event;

        if (Helper.isNodeType(this, 'a'))
        {
            e.preventDefault();
        }

        var clicked = this;
        var targetEl = Helper.$(clicked.dataset.clickTarget);

        if (Helper.nodeExists(targetEl))
        {
            Helper.triggerEvent(targetEl, 'click');
        }
    }

    // Load into Hubble DOM core
    Container.get('Hubble').dom().register('ClickTriggers', ClickTriggers);

})();
