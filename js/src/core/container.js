(function()
{
    /**
     * JS IoC Container
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.comfrontbx/uimaster/LICENSE}
     */
    const Inverse = function()
    {
        this._store = {};

        this.IMPORT_AS_REF = 100;
    }

    /**
     * Set data key to value
     *
     * @access {public}
     * @param {string} key   The data key
     * @param {mixed}  value The data value
     */
    Inverse.prototype.set = function(key, value, singleton)
    {
        key = this._normalizeKey(key);

        value = this._storeObj(value, singleton);

        this._store[key] = value;

        this._setProto(key);
    }

    /**
     * Stores a globally unique singleton
     *
     * @access {public}
     * @param  {string} key      The value or object name
     * @param  {object} classObj The closure that defines the object
     * @return {this}
     */
    Inverse.prototype.singleton = function(key, classObj, invoke)
    {
        invoke = typeof invoke === 'undefined' ? false : invoke;

        this.set(key, classObj, true);

        if (invoke)
        {
            return this.get(key);
        }
    }

    /**
     * Does this set contain a key?
     *
     * @access {public}
     * @param  {string}  key The data key
     * @return {boolean}
     */
    Inverse.prototype.has = function(key)
    {
        key = this._normalizeKey(key);

        for (var k in this._store)
        {
            if (k === key)
            {
                return true;
            }
        }

        return false;
    }

    /**
     * Remove a key/value
     *
     * @access {public}
     * @param {string} key   The data key
     */
    Inverse.prototype.delete = function(key)
    {
        key = this._normalizeKey(key);

        delete this._store[key];

        var _proto = Object.getPrototypeOf(this);

        if (typeof _proto[key] !== 'undefined')
        {
            _proto[key] = undefined;
        }
    }

    /**
     * Get data value with key
     *
     * @access {public}
     * @param  {string} key The data key
     * @param  {mixed}  ... Any additional parameters to pass to the constructor (optional) (default null)
     * @return {mixed}      The data value
     */
    Inverse.prototype.get = function(key)
    {
        key = this._normalizeKey(key);

        let args = Array.prototype.slice.call(arguments).slice(1);

        let storeObj = this._store[key];

        if (this.has(key))
        {
            if (args[0] && args[0] === this.IMPORT_AS_REF) return storeObj.value;

            // Singletons
            if (storeObj.singleton)
            {
                if (!storeObj.instance)
                {
                    return storeObj.singleton.apply(this, [key, ...args]);
                }

                return storeObj.instance;
            }
            // Constructorables
            if (storeObj.invokable)
            {
                return this._newInstance(storeObj.value, args);
            }
            // Functions
            if (storeObj.funcn)
            {
                return storeObj.value.apply(this, args);
            }
            // Intances and all other var types
            return storeObj.value;
        }
    }

    /**
     * Get data value with key
     *
     * @access {public}
     * @param  {string} key The data key
     * @param  {mixed}  ... Any additional parameters to pass to the constructor (optional) (default null)
     * @return {mixed}      The data value
     */
    Inverse.prototype.import = function(names)
    {
        const _this   = this;
        const _import = {};

        _import.from = function(module)
        {
            const _rets = [];

            const _context = _this.get(module);

            for (var i = 0; i < names.length; i++)
            {
                const mixedVar = _context[names[i]];

                _rets.push(_this._is_func(mixedVar) ? _this.bind(_context[names[i]], _context) : mixedVar);

            }

            return _rets;
        };

        return _import;
    }

    Inverse.prototype.bind = function(callback, context)
    {
        context = typeof context === 'undefined' ? window : context;

        const bound = function()
        {
            return callback.apply(context, arguments);
        }

        Object.defineProperty(bound, 'name', { value: callback.name });

        bound.__isBound      = true;
        bound.__boundContext = context;
        bound.__origional    = callback;

        return bound;
    }

    /**
     * Sets the key as a prototype method
     *
     * @access {public}
     * @param  {string} key   The data key
     * @return {mixed}
     */
    Inverse.prototype._setProto = function(key)
    {
        var _this = this;

        var _proto = Object.getPrototypeOf(this);

        _proto[key] = function()
        {
            var args = Array.prototype.slice.call(arguments);

            args.unshift(key);

            return _this.get.apply(_this, args);
        };
    }

    /**
     * Stores a globally unique singleton
     *
     * @access {public}
     * @param  {string} key      The value or object name
     * @param  {object} classObj The closure that defines the object
     * @return {this}
     */
    Inverse.prototype._singletonFunc = function(key)
    {
        let storeObj = this._store[key];
        let instance = storeObj.invoked ? storeObj.instance : null;
        let args     = Array.prototype.slice.call(arguments).slice(1);

        if (!instance)
        {
            instance           = this._newInstance(storeObj.value, args);
            storeObj.function  = false;
            storeObj.invokable = false;
            storeObj.invoked   = true;
            storeObj.value     = null;
            storeObj.instance  = instance;
            storeObj.singleton = true;
        }

        return instance;
    }

    Inverse.prototype._isInvokable = function(mixed_var)
    {
        // Not a function
        if (typeof mixed_var !== 'function' || mixed_var === null)
        {
            return false;
        }

        // Strict ES6 class
        if (/^\s*class\s+\w+/.test(mixed_var.toString()))
        {
            return true;
        }

        // Native arrow functions
        if (!mixed_var.prototype || !mixed_var.prototype.constructor)
        {
            return false;
        }

        return true;
    }

    /**
     * Checks if a class object has been invoked
     *
     * @access {private}
     * @param  {mixed} mixedVar The object instance or reference
     * @return {bool}
     */
    Inverse.prototype._isInvoked = function(mixedVar)
    {
        if (typeof mixedVar === 'object' && mixedVar.constructor && typeof mixedVar.constructor === 'function')
        {
            var constr = mixedVar.constructor.toString().trim();
            
            return constr.startsWith('function (') || constr.startsWith('function(') || constr.startsWith('function Object(') || constr.startsWith('class ') ;
        }

        return false;
    }

    /**
     * Invokes and returns a new class instance
     *
     * @access {private}
     * @param  {mixed} classObj The object instance or reference
     * @param  {array} args     Arguements to pass to class constructor (optional) (default null)
     * @return {object}
     */
    Inverse.prototype._newInstance = function(reference, args)
    {
        return new reference(...args);
    }

    /**
     * Invokes and returns a new class instance
     *
     * @access {private}
     * @param  {mixed} classObj The object instance or reference
     * @param  {array} args     Arguements to pass to class constructor (optional) (default null)
     * @return {object}
     */
    Inverse.prototype._storeObj = function(mixedVar, isSingleton)
    {
        isSingleton = typeof isSingleton === 'undefined' ? false : isSingleton;

        let value       = mixedVar;
        let invokable   = this._isInvokable(mixedVar);
        let invoked     = this._isInvoked(mixedVar);
        let instance    = invoked && isSingleton ? mixedVar : null;
        let funcn       = this._is_func(mixedVar) && !invokable && !invoked && !isSingleton;
        let singleton   = isSingleton ? this._singletonFunc : false;

        return { funcn, invokable, invoked, value, instance, singleton };
    }

    /**
     * Normalizes key for prototypes
     *
     * @access {private}
     * @param  {string} key Key to normalize
     * @return {string}
     */
    Inverse.prototype._normalizeKey = function(key)
    {
        key = key.replace(/['"]/g, '').replace(/\W+/g, ' ')
            .replace(/ (.)/g, function($1)
            {
                return $1.toUpperCase();
            })
            .replace(/ /g, '');

        key = key.charAt(0).toUpperCase() + key.slice(1);

        return key;
    }

    Inverse.prototype._is_func = function(mixedVar)
    {
        return Object.prototype.toString.call(mixedVar) === '[object Function]';
    }

    /**
     * Loads container into global namespace as "FrontBx"
     *
     */
    if (!window.Container)
    {
        var container = new Inverse;

        window.Container = container;
    }
    
})();