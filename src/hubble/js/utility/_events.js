/**
 * Events
 *
 * This class handles custom event firing and callback assigning.
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
     * @class
     * @constructor
     * @access public
     * @return this
     */
    var Events = function()
    {

        this._callbacks = {};

        return this;
    }

    /**
     * Module destructor - clears event cache
     *
     * @access public
     */
    Events.prototype.destruct = function()
    {
        this._callbacks = {};
    }

    /**
     * Fire a custom event
     *
     * @param string eventName The event name to fire
     * @param mixed  subject   What should be given as "this" to the event callbacks
     * @param mixed  args      List of additional args to push (optional)
     * @access public
     */
    Events.prototype.fire = function()
    {
        var args = Array.prototype.slice.call(arguments);

        var eventName = args.shift();

        for (var key in this._callbacks)
        {
            if (!this._callbacks.hasOwnProperty(key))
            {
                continue;
            }

            var callbackEvent = key.split('______')[0];

            if (callbackEvent === eventName)
            {
                var callback   = this._callbacks[key].callback;
                var _this      = null;

                if (args.length >= 1)
                {
                    _this = args[0];

                    args.shift();
                }

                callback.apply(_this, args);
            }
        }
    }

    /**
     * Bind a callback to an event
     *
     * @param eventName string The event name
     * @param callback  func   The callback function
     * @access public
     */
    Events.prototype.on = function(eventName, callback)
    {
        // Make sure the function is unique - unless it is ananonymous
        var callbackName = this._getFnName(callback);

        if (callbackName === 'anonymous')
        {
            callbackName = 'anonymous_' + Object.keys(this._callbacks).length;
        }

        var key = eventName + '______' + callbackName;

        // Save the callback and event name
        this._callbacks[key] =
        {
            name: eventName,
            callback: callback,
        };
    }

    /**
     * UnBind a callback to an event
     *
     * @param eventName string The event name
     * @param callback  func   The callback function
     * @access public
     */
    Events.prototype.off = function(eventName, callback)
    {
        for (var key in this._callbacks)
        {
            if (!this._callbacks.hasOwnProperty(key))
            {
                continue;
            }

            var callbackEvent = key.split('______')[0];

            if (callbackEvent === eventName && this._callbacks[key]['callback'] === callback)
            {
                delete this._callbacks[key];
            }
        }
    }

    /**
     * Get a callback function by key
     *
     * @param fn string The function key
     * @access private
     * @return string
     */
    Events.prototype._getFnName = function(fn)
    {
        var f = typeof fn == 'function';

        var s = f && ((fn.name && ['', fn.name]) || fn.toString().match(/function ([^\(]+)/));

        return (!f && 'not a function') || (s && s[1] || 'anonymous');
    }

    // Load into container and invoke
    Container.singleton('Events', Events);

}());
