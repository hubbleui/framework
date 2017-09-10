/**
 * Dynamic UI component 
 *
 * @author    Joe J. Howard
 * @copyright Joe J. Howard
 * @license   https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE
 * 
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
    var DynamicUI = function(options)
    {
        this._handler = null;
        this._options = options;

        this._init();

        return this;
    };

    /**
     * Destroy the module instance and remove event listeners
     *
     * @access public
     */
    DynamicUI.prototype.destroy = function()
    {
        if (this._handler)
        {
            this._handler.destroy();
        }
    }

    /**
     * Invoke the module handler
     *
     * @access public
     */
    DynamicUI.prototype.invoke = function()
    {
        if (this._handler)
        {
            this._handler._eventHandler();
        }
    }

    /**
     * Refresh the module instance - removes and re-adds event listeners
     *
     * @access public
     */
    DynamicUI.prototype.refresh = function()
    {
        this._handler.destroy();

        this._init();
    }

    /**
     * Initialize the handler
     *
     * @access public
     */
    DynamicUI.prototype._init = function()
    {
        var _this   = this;
        var trigger = Helper.$(this._options.trigger);

        if (Helper.nodeExists(trigger))
        {
            this._handler = Container.get('_DynamicUiHandler', this._options);
        }
        
        Hubble.require('Events').on('domChange', function()
        {
            _this.refresh();
        });
    }

    // Load into container
    Container.set('DynamicUI', DynamicUI);

})();