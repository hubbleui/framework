(function() {

    // MODULE OBJECT
    /*****************************************/
    var Events = function() {
        
        this.__construct();
        
        return this;
    }

    // CONSTRUCTOR
    /*****************************************/
    Events.prototype.__construct = function() {
        this._callbacks = {};
    }

    // DESTRUCTOR
    /*****************************************/
    Events.prototype.destruct = function() {
        this._callbacks = {};
    }

    // FIRE A CUSTOM EVENT
    /*****************************************/
    Events.prototype.fire = function(eventName, subject) {
        for (var key in this._callbacks) {
            if (!this._callbacks.hasOwnProperty(key)) continue;
            var callbackEvent = key.split('______')[0];
            if (callbackEvent === eventName) {
                var callback = this._callbacks[key].callback;
                callback.apply(subject, []);
            }
        }
    }

    // BINDER
    /*****************************************/
    Events.prototype.on = function(eventName, callback) {
        
        // Make sure the function is unique - unless it is ananonymous
        var callbackName = this._getFnName(callback);
        if (callbackName === 'anonymous') callbackName = 'anonymous_' + Object.keys(this._callbacks).length;
        var key  = eventName+'______'+callbackName;

        // Save the callback and event name
        this._callbacks[key] = {
            name     : eventName,
            callback : callback,
        };
    }

    // BINDER
    /*****************************************/
    Events.prototype.off = function(eventName, callback) {
        for (var key in this._callbacks) {
            if (!this._callbacks.hasOwnProperty(key)) continue;
            var callbackEvent = key.split('______')[0];
            if (callbackEvent === eventName && this._callbacks[key]['callback'] === callback) {
                delete this._callbacks[key];
            }
        }
    }

    // GET THE FUNCTION NAME
    /*****************************************/
    Events.prototype._getFnName = function(fn) {
        var f = typeof fn == 'function';
        var s = f && ((fn.name && ['', fn.name]) || fn.toString().match(/function ([^\(]+)/));
        return (!f && 'not a function') || (s && s[1] || 'anonymous');
    }

    
    // PUSH TO MODULES AND INVOKE
    /*****************************************/
    Modules.singleton('Events', Events).require('Events');

}());
