/**
 * Component Dynamic Hanlder 
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
     * AJAX Module
     * 
     * @var obj
     */
    var Ajax = Hubble.require('Ajax');

    /**
     * Module constructor
     *
     * @access      public
     * @constructor
     * @param       object options Object of handler options
     */
    var DynamicUiHandler = function(options)
    {
        this._options = options;

        this._options.onRenderArgs = typeof options.onRenderArgs === 'undefined' ? [] : options.onRenderArgs;
        this._options.onErrorArgs  = typeof options.onErrorArgs === 'undefined'  ? [] : options.onErrorArgs;

        if (Helper.nodeExists(Helper.$(this._options.trigger)))
        {
            this._bind();
        }

        _this = this;

        return this;
    };

    /**
     * Destroy the handler and remove event listener
     *
     * @access public
     */
    DynamicUiHandler.prototype.destroy = function()
    {
        this._unbind();
    }

    /**
     * Bind the event listener
     *
     * @access private
     */
    DynamicUiHandler.prototype._bind = function()
    {
        var _this = this;

        this._callback = function _uiEventHandler(e)
        {
            _this._eventHandler();
        };

        Helper.addEventListener(Helper.$(this._options.trigger), this._options.event, this._callback);
    }

    /**
     * Unbind the event listener
     *
     * @access private
     */
    DynamicUiHandler.prototype._unbind = function()
    {
        Helper.removeEventListener(Helper.$(this._options.trigger), this._options.event, this._callback);
    }

    /**
     * Event handler
     *
     * @access private
     */
    DynamicUiHandler.prototype._eventHandler = function()
    {
        var trigger = Helper.$(this._options.trigger);
        var target  = Helper.$(this._options.target);
        var ajaxUrl = this._options.url;
        var form    = this._options.form || {};
        var trigger = this._options.trigger;
        var _this   = this;

        // Return on loading or disabled
        if (Helper.hasClass(trigger, 'active') || trigger.disabled === true)
        {
            return;
        }

        // Add active class
        Helper.addClass(trigger, 'active');
        Helper.addClass(target, 'active');

        // Request the Ajax
        Ajax.post(ajaxUrl, form, function(success)
        {
            var responseObj = Helper.isJSON(success);

            if (responseObj && responseObj.response === 'valid')
            {
                _this._render(responseObj);
                _this._fireRendered(responseObj);
                Hubble.require('Events').fire('domChange', target);
                Hubble.dom().refresh();
            }
            else
            {
                _this._fireErrored(success);
            }

            Helper.removeClass(trigger, 'active');
            Helper.removeClass(target, 'active');
        },
        function(error)
        {
            Helper.removeClass(trigger, 'active');
            Helper.removeClass(target, 'active');
            _this._fireErrored(error);
        });
    }

    /**
     * Render the DOM changes
     *
     * @access private
     * @param  object  response Response object from the server
     */
    DynamicUiHandler.prototype._render = function(response)
    {
        var details = response.details;
        var classes = this._options.classes;
        var target  = Helper.$(this._options.target);

        for (var i = 0; i < classes.length; i++)
        {
            var content = details[classes[i]['key']] || null;
            var node    = Helper.$(classes[i]['class'], target);

            if (!content || !Helper.nodeExists(node))
            {
                continue;
            }

            node.innerHTML = content;
        }
    }

    /**
     * Fire rendered event
     *
     * @access private
     */
    DynamicUiHandler.prototype._fireRendered = function(response)
    {        
        if (typeof this._options.onRender !== 'undefined')
        {
            var callback = this._options.onRender;
            var args     = this._options.onRenderArgs;
            args.unshift(response);

            callback.apply(this._options.target, args);
        }
    }

    /**
     * Fire errored event
     *
     * @access private
     */
    DynamicUiHandler.prototype._fireErrored = function(error)
    {
        if (typeof this._options.onError !== 'undefined')
        {
            var callback = this._options.onError;
            var args     = this._options.onErrorArgs;
            args.unshift(error);

            callback.apply(this._options.target, args);
        }
    }

    // Load into container
    Container.set('_DynamicUiHandler', DynamicUiHandler);

})();