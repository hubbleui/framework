
(function(window)
{
    const PROTO_EXCLUDES = ['constructor', '__proto__', '__defineGetter__', '__defineSetter__', 'hasOwnProperty', '__lookupGetter__', '__lookupSetter__', 'isPrototypeOf', 'propertyIsEnumerable', 'toString', 'toLocaleString', 'valueOf', 'length', 'name', 'arguments', 'caller', 'prototype', 'apply', 'bind', 'call'];

    /**
     * JS IoC Container
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE}
     */
    class Inverse
    {
        /**
         * Constructor
         *
         * @class
         {*} @constructor
         * @access {public}
         */
        constructor()
        {
            this._store = {};

            return this;
        }

        /**
         * Set data key to value
         *
         * @access {public}
         * @param {string} key   The data key
         * @param {mixed}  value The data value
         */
        set(key, value, singleton)
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
        singleton(key, classObj, invoke)
        {
            invoke = typeof invoke === 'undefined' ? false : invoke;

            this.set(key, classObj, true);

            if (invoke)
            {
                this.get(key);
            }
        }

        /**
         * Does this set contain a key?
         *
         * @access {public}
         * @param  {string}  key The data key
         * @return {boolean}
         */
        has(key)
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
        delete(key)
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
        get(key)
        {
            key = this._normalizeKey(key);

            let args = Array.prototype.slice.call(arguments).slice(1);

            let valObj = this._store[key];

            if (this.has(key))
            {
                // Singletons
                if (valObj.singleton)
                {
                    if (!valObj.instance)
                    {
                        return valObj.singleton.apply(this, [key, ...args]);
                    }

                    return valObj.instance;
                }
                // Constructorables
                if (valObj.invokable)
                {
                    return this._newInstance(valObj.value, args);
                }
                // Functions
                if (valObj.funcn)
                {
                    return valObj.value.apply(this, args);
                }
                // Intances and all other var types
                return valObj.value;
            }
        }

        /**
         * Sets the key as a prototype method
         *
         * @access {public}
         * @param  {string} key   The data key
         * @return {mixed}
         */
        _setProto(key)
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
        _singletonFunc(key)
        {
            var valObj   = this._store[key];
            var instance = valObj.invoked ? valObj.instance : null;
            var args     = Array.prototype.slice.call(arguments).slice(1);

            if (!instance)
            {
                instance         = this._newInstance(valObj.value, args);
                valObj.function  = false;
                valObj.invokable = false;
                valObj.invoked   = true;
                valObj.value     = null;
                valObj.instance  = instance;
                valObj.singleton = true;
            }

            return instance;
        }

        _isInvokable(mixed_var)
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

            // If prototype is empty 
            let props = this._object_props(mixed_var.prototype);

            return props.length >= 1;
        }

        /**
         * Checks if a class object has been invoked
         *
         * @access {private}
         * @param  {mixed} mixedVar The object instance or reference
         * @return {bool}
         */
        _isInvoked(mixedVar)
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
        _newInstance(reference, args)
        {
            return new reference(...args);
            //return new(Function.prototype.bind.apply(reference, args));
        }

        /**
         * Invokes and returns a new class instance
         *
         * @access {private}
         * @param  {mixed} classObj The object instance or reference
         * @param  {array} args     Arguements to pass to class constructor (optional) (default null)
         * @return {object}
         */
        _storeObj(mixedVar, isSingleton)
        {
            isSingleton = typeof isSingleton === 'undefined' ? false : isSingleton;

            var invokable   = this._isInvokable(mixedVar);
            var invoked     = this._isInvoked(mixedVar);
            var instance    = invoked && isSingleton ? mixedVar : null;
            var isFunc      = this._is_func(mixedVar) && !invokable && !invoked && !isSingleton;
            var singleton   = isSingleton ? this._singletonFunc : false;

            return {
                funcn     : isFunc,
                invokable : invokable,
                invoked   : invoked,
                value     : mixedVar,
                instance  : instance,
                singleton : singleton,
            };
        }

        /**
         * Normalizes key for prototypes
         *
         * @access {private}
         * @param  {string} key Key to normalize
         * @return {string}
         */
        _normalizeKey(key)
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

        /**
         * Returns object properties and methods as array of keys.
         * 
         * @param   {mixed}    mixed_var    Variable to test
         * @param   {boolean}  withMethods  Return methods and props (optional) (default "true")
         * @returns {array}
         */
        _object_props(mixed_var, withMethods)
        {
            var array_unique = function(arr)
            {
                let uniq = function(value, index, self)
                {
                    return self.indexOf(value) === index;
                }

                return arr.filter(uniq);
            }

            withMethods = typeof withMethods === 'undefined' ? true : false;

            let keys = Object.keys(mixed_var);

            if (withMethods)
            {
                let protos = [];
                let funcs = Object.getOwnPropertyNames(mixed_var);
                let proto = mixed_var.prototype || Object.getPrototypeOf(mixed_var);

                while (proto)
                {
                    // recursive stopper
                    if (protos.includes.proto)
                    {
                        break;
                    }

                    protos.push(proto);

                    let protoFuncs = Object.getOwnPropertyNames(proto);

                    funcs = [...funcs, ...protoFuncs];

                    proto = proto.prototype || Object.getPrototypeOf(proto);
                }

                keys = [...keys, ...funcs];
            }

            return array_unique(keys.filter(function(key)
            {
                return !PROTO_EXCLUDES.includes(key);
            }));
        }

        _is_func(mixedVar)
        {
            return Object.prototype.toString.call(mixedVar) === '[object Function]';
        }
    }

    /**
     * Loads container into global namespace as "Hubble"
     *
     */
    if (!window.Container)
    {
        var container = new Inverse;

        window.Container = container;
    }

})(window);