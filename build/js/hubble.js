//'use strict';   

// Polyfills
/**
 * A fix to allow you to use window.location.origin consistently
 *
 * @see {https://tosbourn.com/a-fix-for-window-location-origin-in-internet-explorer/}
 */
if (!window.location.origin)
{
    window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
}

/*
 * domready (c) Dustin Diaz 2014 - License MIT
 *
 */
! function(name, definition)
{

    if (typeof module != 'undefined') module.exports = definition()
    else if (typeof define == 'function' && typeof define.amd == 'object') define(definition)
    else this[name] = definition()

}('domready', function()
{

    var fns = [],
        listener, doc = typeof document === 'object' && document,
        hack = doc && doc.documentElement.doScroll,
        domContentLoaded = 'DOMContentLoaded',
        loaded = doc && (hack ? /^loaded|^c/ : /^loaded|^i|^c/).test(doc.readyState)


    if (!loaded && doc)
        doc.addEventListener(domContentLoaded, listener = function()
        {
            doc.removeEventListener(domContentLoaded, listener)
            loaded = 1
            while (listener = fns.shift()) listener()
        })

    return function(fn)
    {
        loaded ? setTimeout(fn, 0) : fns.push(fn)
    }

});

/*
 * Custom events 
 *
 * @see {https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent#Polyfill}
 */
(function()
{

    if (typeof window.CustomEvent === "function") return false;

    function CustomEvent(event, params)
    {
        params = params ||
        {
            bubbles: false,
            cancelable: false,
            detail: null
        };
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    }

    window.CustomEvent = CustomEvent;

})();

/**
 * debounce and throttle methods
 * 
 * @see {Underscore.js} 1.9.1
 */
(function()
{

    // Some functions take a variable number of arguments, or a few expected
    // arguments at the beginning and then a variable number of values to operate
    // on. This helper accumulates all remaining arguments past the function’s
    // argument length (or an explicit `startIndex`), into an array that becomes
    // the last argument. Similar to ES6’s "rest parameter".
    var restArguments = function(func, startIndex)
    {
        startIndex = startIndex == null ? func.length - 1 : +startIndex;
        return function()
        {
            var length = Math.max(arguments.length - startIndex, 0),
                rest = Array(length),
                index = 0;
            for (; index < length; index++)
            {
                rest[index] = arguments[index + startIndex];
            }
            switch (startIndex)
            {
                case 0:
                    return func.call(this, rest);
                case 1:
                    return func.call(this, arguments[0], rest);
                case 2:
                    return func.call(this, arguments[0], arguments[1], rest);
            }
            var args = Array(startIndex + 1);
            for (index = 0; index < startIndex; index++)
            {
                args[index] = arguments[index];
            }
            args[startIndex] = rest;
            return func.apply(this, args);
        };
    };

    // A (possibly faster) way to get the current timestamp as an integer.
    var _now = Date.now || function()
    {
        return new Date().getTime();
    };


    // Delays a function for the given number of milliseconds, and then calls
    // it with the arguments supplied.
    var _delay = restArguments(function(func, wait, args)
    {
        return setTimeout(function()
        {
            return func.apply(null, args);
        }, wait);
    });


    // Returns a function, that, when invoked, will only be triggered at most once
    // during a given window of time. Normally, the throttled function will run
    // as much as it can, without ever going more than once per `wait` duration;
    // but if you'd like to disable the execution on the leading edge, pass
    // `{leading: false}`. To disable execution on the trailing edge, ditto.
    var _throttle = function(func, wait, options)
    {
        var timeout, context, args, result;
        var previous = 0;
        if (!options) options = {};

        var later = function()
        {
            previous = options.leading === false ? 0 : _now();
            timeout = null;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        };

        var throttled = function()
        {
            var now = _now();
            if (!previous && options.leading === false) previous = now;
            var remaining = wait - (now - previous);
            context = this;
            args = arguments;
            if (remaining <= 0 || remaining > wait)
            {
                if (timeout)
                {
                    clearTimeout(timeout);
                    timeout = null;
                }
                previous = now;
                result = func.apply(context, args);
                if (!timeout) context = args = null;
            }
            else if (!timeout && options.trailing !== false)
            {
                timeout = setTimeout(later, remaining);
            }
            return result;
        };

        throttled.cancel = function()
        {
            clearTimeout(timeout);
            previous = 0;
            timeout = context = args = null;
        };

        return throttled;
    };

    // Returns a function, that, as long as it continues to be invoked, will not
    // be triggered. The function will be called after it stops being called for
    // N milliseconds. If `immediate` is passed, trigger the function on the
    // leading edge, instead of the trailing.
    var _debounce = function(func, wait, immediate)
    {
        var timeout, result;

        var later = function(context, args)
        {
            timeout = null;
            if (args) result = func.apply(context, args);
        };

        var debounced = restArguments(function(args)
        {
            if (timeout) clearTimeout(timeout);
            if (immediate)
            {
                var callNow = !timeout;
                timeout = setTimeout(later, wait);
                if (callNow) result = func.apply(this, args);
            }
            else
            {
                timeout = _delay(later, wait, this, args);
            }

            return result;
        });

        debounced.cancel = function()
        {
            clearTimeout(timeout);
            timeout = null;
        };

        return debounced;
    };

    window.throttle = _throttle;

    window.debounce = _debounce;

}());

/**
 * String includes
 * 
 * @see {https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes}
 */
if (!String.prototype.includes)
{
    String.prototype.includes = function(search, start)
    {
        'use strict';

        if (search instanceof RegExp)
        {
            throw TypeError('first argument must not be a RegExp');
        }

        if (start === undefined)
        {
            start = 0;
        }

        return this.indexOf(search, start) !== -1;
    };
}

/**
 * String.prototype.replaceAll() polyfill
 * https://gomakethings.com/how-to-replace-a-section-of-a-string-with-another-one-with-vanilla-js/
 * @author {Chris} Ferdinandi}
 * @license {MIT}
 */
if (!String.prototype.replaceAll)
{
    String.prototype.replaceAll = function(str, newStr)
    {
        // If a regex pattern
        if (Object.prototype.toString.call(str).toLowerCase() === '[object regexp]')
        {
            return this.replace(str, newStr);
        }

        // If a string
        return this.replace(new RegExp(str, 'g'), newStr);
    };
}

/**
 * DOM parser pollyfill (legacy support)
 * 
 * @var {obj}
 * @source {https://gist.github.com/1129031}
 */
(function(DOMParser)
{
    var DOMParser_proto = DOMParser.prototype,
        real_parseFromString = DOMParser_proto.parseFromString;
    try
    {
        if ((new DOMParser).parseFromString("", "text/html"))
        {
            return;
        }
    }
    catch (ex)
    {}
    DOMParser_proto.parseFromString = function(markup, type)
    {
        if (/^\s*text\/html\s*(?:;|$)/i.test(type))
        {
            var doc = document.implementation.createHTMLDocument(""),
                doc_elt = doc.documentElement,
                first_elt;
            doc_elt.innerHTML = markup;
            first_elt = doc_elt.firstElementChild;
            if (doc_elt.childElementCount === 1 && first_elt.localName.toLowerCase() === "html")
            {
                doc.replaceChild(first_elt, doc_elt);
            }
            return doc;
        }
        else
        {
            return real_parseFromString.apply(this, arguments);
        }
    };
}(DOMParser));

// Production steps of ECMA-262, Edition 5, 15.4.4.19
// Reference: https://es5.github.io/#x15.4.4.19
if (!Array.prototype.map) {

  Array.prototype.map = function(callback/*, thisArg*/) {

    var T, A, k;

    if (this == null) {
      throw new TypeError('this is null or not defined');
    }

    // 1. Let O be the result of calling ToObject passing the |this|
    //    value as the argument.
    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get internal
    //    method of O with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = O.length >>> 0;

    // 4. If IsCallable(callback) is false, throw a TypeError exception.
    // See: https://es5.github.com/#x9.11
    if (typeof callback !== 'function') {
      throw new TypeError(callback + ' is not a function');
    }

    // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
    if (arguments.length > 1) {
      T = arguments[1];
    }

    // 6. Let A be a new array created as if by the expression new Array(len)
    //    where Array is the standard built-in constructor with that name and
    //    len is the value of len.
    A = new Array(len);

    // 7. Let k be 0
    k = 0;

    // 8. Repeat, while k < len
    while (k < len) {

      var kValue, mappedValue;

      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the HasProperty internal
      //    method of O with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then
      if (k in O) {

        // i. Let kValue be the result of calling the Get internal
        //    method of O with argument Pk.
        kValue = O[k];

        // ii. Let mappedValue be the result of calling the Call internal
        //     method of callback with T as the this value and argument
        //     list containing kValue, k, and O.
        mappedValue = callback.call(T, kValue, k, O);

        // iii. Call the DefineOwnProperty internal method of A with arguments
        // Pk, Property Descriptor
        // { Value: mappedValue,
        //   Writable: true,
        //   Enumerable: true,
        //   Configurable: true },
        // and false.

        // In browsers that support Object.defineProperty, use the following:
        // Object.defineProperty(A, k, {
        //   value: mappedValue,
        //   writable: true,
        //   enumerable: true,
        //   configurable: true
        // });

        // For best browser support, use the following:
        A[k] = mappedValue;
      }
      // d. Increase k by 1.
      k++;
    }

    // 9. return A
    return A;
  };
}

/**
 * Very simple chain library
 * 
 * @var {obj}
 * @source {https://github.com/krasimir/chain}
 */
var Chain = function()
{
    var _listeners = {},
        _resultOfPreviousFunc = null,
        _self = this,
        _api = {},
        _funcs = [],
        _errors = [];

    var on = function(type, listener) {
        if(!_listeners[type]) _listeners[type] = [];
        _listeners[type].push(listener);
        return _api;
    }
    var off = function(type, listener) {
        if(_listeners[type]) {
            var arr = [];
            for(var i=0; f=_listeners[type][i]; i++) {
                if(f !== listener) {
                    arr.push(f);
                }
            }
            _listeners[type] = arr;
        }
        return _api;
    }
    var dispatch = function(type, param) {
        if(_listeners[type]) {
            for(var i=0; f=_listeners[type][i]; i++) {
                f(param, _api);
            }
        }
    }
    var run = function() {
        if(arguments.length > 0) {
            _funcs = [];
            for(var i=0; f=arguments[i]; i++) _funcs.push(f);
            var element = _funcs.shift();
            if(typeof element === 'function') {
                element(_resultOfPreviousFunc, _api);
            } else if(typeof element === 'object' && element.length > 0) {
                var f = element.shift();
                f.apply(f, element.concat([_api.next]));
            }
            
        } else {
            dispatch("done", _resultOfPreviousFunc);
        }
        return _api;
    }
    var next = function(res) {
        _resultOfPreviousFunc = res;
        run.apply(_self, _funcs);
    }
    var error = function(err) {
        if(typeof err != 'undefined') {
            _errors.push(err);
            return _api;
        } else {
            return _errors;
        }       
    }
    var process = function() {
        if(arguments.length > 0) {
            // on method
            if(arguments.length === 2 && typeof arguments[0] === 'string' && typeof arguments[1] === 'function') {
                on.apply(self, arguments);
            // run method
            } else {
                run.apply(self, arguments);
            }
        }
        return process;
    }

    _api = {
        on: on,
        off: off,
        next: next,
        error: error
    }
    
    return process;
};


// Container
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
         * Get data value with key
         *
         * @access {public}
         * @param  {string} key The data key
         * @param  {mixed}  ... Any additional parameters to pass to the constructor (optional) (default null)
         * @return {mixed}      The data value
         */
        import(names)
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

        bind(callback, context)
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


        /*import(['foo', 'member2','alias2']).from('Helper');
        import('*').from('Helper');
        
        export_default(fooFunction)
        {

        }

        export('{ funct1, func2 }')
        {

        }*/


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

    console.log(Container);

})(window);
(function()
{
    /**
     * Application core
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE}
     */
    class Application
    {
        /**
         * Called when the application is first initialized
         *
         * @access {public}
         */
        boot()
        {        
            this.dom().boot();
        }

        /**
         * Get the Container component
         *
         * @access {public}
         * @return {object}
         */
        container()
        {
            return Container;
        }

        /**
         * Get the DOM component
         *
         * @access {public}
         * @return {object}
         */
        dom()
        {
            return Container.get('HubbleDom');
        }

        /**
         * Get the Helper component
         *
         * @access {public}
         * @return {object}
         */
        helper()
        {
            return Container.Helper();
        }

        /**
         * Require a module and/or key/value
         *
         * @access {public}
         * @param  {string} key The name of the key
         * @return {mixed}
         */
        require()
        {
            return Container.get(...arguments);
        }
    }

    // Loads into container
    Container.singleton('Hubble', Application);

    window.Hubble = Container.get('Hubble');

})();
(function()
{    
    /**
     * DOM Manager
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE}
     */
    class Dom
    {
        _modules = {};

        _ready = false;

        /**
         * Module constructor
         *
         * @class
         {*} @constructor
         * @access {public}
         */
        constructor()
        {
            window.hbDOMReady = false;

            return this;
        }

        /**
         * Boot Dom
         *
         * @access {public}
         * @param {string} name   Name of the module
         * @param {object} module Uninvoked module object
         */
        boot()
        {
            this._bindModules();

            this._dispatchReady();
        }

         /**
         * Boot Dom
         *
         * @access {public}
         * @param {string} name   Name of the module
         * @param {object} module Uninvoked module object
         */
        _dispatchReady()
        {
            if (!this._ready)
            {
                const event = document.createEvent('Event');

                event.initEvent('DOMReady', true, true);

                this._ready = event;
            }

            window.dispatchEvent(this._ready);
            
            window.hbDOMReady = true;
        }

        /**
         * Register a DOM module (singleton)
         *
         * @access {public}
         * @param {string} name   Name of the module
         * @param {object} module Uninvoked module object
         * @param {bool}   invoke Invoke the module immediately (optional) (default false)
         */
        register(name, module, invoke)
        {
            invoke = (typeof invoke === 'undefined' ? false : true);

            this._modules[name] = module;

            if (invoke && window.hbDOMReady)
            {
                this._bindModule(name);
            }
        }

        /**
         * Refresh the DOM modiules or a string module
         *
         * @access {public}
         * @param {string} name Name of the module (optional) (default false)
         */
        refresh(module)
        {
            module = (typeof module === 'undefined' ? false : module);

            if (module)
            {
                for (var key in this._modules)
                {
                    if (!this._modules.hasOwnProperty(key))
                    {
                        continue;
                    }

                    if (module === key)
                    {
                        this._unbindModule(key);

                        this._bindModule(key);

                        Container.Helper().collectGarbage();
                    }
                }
            }
            else
            {
                window.hbDOMReady = false;

                this._unbindModules();

                Container.Helper().collectGarbage();

                this._bindModules();

                this._dispatchReady();
            }
        }

        /**
         * Unbind listener to containers
         *
         * @param {null}
         * @access {private}
         */
        _unbindModules()
        {
            for (var key in this._modules)
            {
                if (!this._modules.hasOwnProperty(key))
                {
                    continue;
                }

                this._unbindModule(key);
            }
        }

        /**
         * Unbind a single module
         *
         * @param  {string}  key Name of module to unbind
         * @access {private}
         */
        _unbindModule(key)
        {
            var module = Container.get(key);

            if (this._hasMethod(module, 'destruct'))
            {
                module.destruct();
            }

            Container.delete(key);
        }

        /**
         * Unbind listener to containers
         *
         * @access {private}
         */
        _bindModules()
        {            
            for (var key in this._modules)
            {
                if (!this._modules.hasOwnProperty(key))
                {
                    continue;
                }

                this._bindModule(key);
            }
        }

        /**
         * Bind a single module
         *
         * @param {string} key Name of module to bind
         * @access {private}
         */
        _bindModule(key)
        {
            Container.singleton(key, this._modules[key], true);
        }

        /**
         * Checks if a class object has a method by name
         *
         * @access {private}
         * @param  {mixed}  classObj The object instance or reference
         * @param  {string} method   The name of the method to check for
         * @return {bool}
         */
        _hasMethod(classObj, method)
        {
            return typeof classObj === 'object' && typeof classObj[method] === 'function';
        }
    }

    // Load into container and invoke
    Container.singleton('HubbleDom', Dom);

})();


// Helper
(function()
{
	// Standard
const NULL_TAG = '[object Null]';
const UNDEF_TAG = '[object Undefined]';
const BOOL_TAG = '[object Boolean]';
const STRING_TAG = '[object String]';
const NUMBER_TAG = '[object Number]';
const FUNC_TAG = '[object Function]';
const ARRAY_TAG = '[object Array]';
const ARGS_TAG = '[object Arguments]';
const NODELST_TAG = '[object NodeList]';
const OBJECT_TAG = '[object Object]';
const DATE_TAG = '[object Date]';

// Unusual
const SET_TAG = '[object Set]';
const MAP_TAG = '[object Map]';
const REGEXP_TAG = '[object RegExp]';
const SYMBOL_TAG = '[object Symbol]';

// Array buffer
const ARRAY_BUFFER_TAG = '[object ArrayBuffer]';
const DATAVIEW_TAG = '[object DataView]';
const FLOAT32_TAG = '[object Float32Array]';
const FLOAT64_TAG = '[object Float64Array]';
const INT8_TAG = '[object Int8Array]';
const INT16_TAG = '[object Int16Array]';
const INT32_TAG = '[object Int32Array]';
const UINT8_TAG = '[object Uint8Array]';
const UINT8CLAMPED_TAG = '[object Uint8ClampedArray]';
const UINT16_TAG = '[object Uint16Array]';
const UINT32_TAG = '[object Uint32Array]';

// Non-cloneable
const ERROR_TAG = '[object Error]';
const WEAKMAP_TAG = '[object WeakMap]';

// Arrayish _tags
const ARRAYISH_TAGS = [ARRAY_TAG, ARGS_TAG, NODELST_TAG];

// Object.prototype.toString
const TO_STR = Object.prototype.toString;

// Array.prototype.slice
const TO_ARR = Array.prototype.slice;

// Regex for HTMLElement types
const HTML_REGXP = /^\[object HTML\w*Element\]$/;
	/**
 * List of shorthand properties and their longhand equivalents
 *
 * @var {object}
 */
const SHORTHAND_PROPS =
{
    // CSS 2.1: http://www.w3.org/TR/CSS2/propidx.html
    'list-style': ['-type', '-position', '-image'],
    'margin': ['-top', '-right', '-bottom', '-left'],
    'outline': ['-width', '-style', '-color'],
    'padding': ['-top', '-right', '-bottom', '-left'],

    // CSS Backgrounds and Borders Module Level 3: http://www.w3.org/TR/css3-background/
    'background': ['-image', '-position', '-size', '-repeat', '-origin', '-clip', '-attachment', '-color'],
    'border': ['-width', '-style', '-color'],
    'border-color': ['border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color'],
    'border-style': ['border-top-style', 'border-right-style', 'border-bottom-style', 'border-left-style'],
    'border-width': ['border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width'],
    'border-top': ['-width', '-style', '-color'],
    'border-right': ['-width', '-style', '-color'],
    'border-bottom': ['-width', '-style', '-color'],
    'border-left': ['-width', '-style', '-color'],
    'border-radius': ['border-top-left-radius', 'border-top-right-radius', 'border-bottom-right-radius', 'border-bottom-left-radius'],
    'border-image': ['-source', '-slice', '-width', '-outset', '-repeat'],

    // CSS Fonts Module Level 3: http://www.w3.org/TR/css3-fonts/
    'font': ['-style', '-variant', '-weight', '-stretch', '-size', 'line-height', '-family'],
    'font-variant': ['-ligatures', '-alternates', '-caps', '-numeric', '-east-asian'],

    // CSS Masking Module Level 1: http://www.w3.org/TR/css-masking/
    'mask': ['-image', '-mode', '-position', '-size', '-repeat', '-origin', '-clip'],
    'mask-border': ['-source', '-slice', '-width', '-outset', '-repeat', '-mode'],

    // CSS Multi-column Layout Module: http://www.w3.org/TR/css3-multicol/
    'columns': ['column-width', 'column-count'],
    'column-rule': ['-width', '-style', '-color'],

    // CSS Speech Module: http://www.w3.org/TR/css3-speech/
    'cue': ['-before', '-after'],
    'pause': ['-before', '-after'],
    'rest': ['-before', '-after'],

    // CSS Text Decoration Module Level 3: http://www.w3.org/TR/css-text-decor-3/
    'text-decoration': ['-line', '-style', '-color'],
    'text-emphasis': ['-style', '-color'],

    // CSS Animations (WD): http://www.w3.org/TR/css3-animations
    'animation': ['-name', '-duration', '-timing-function', '-delay', '-iteration-count', '-direction', '-fill-mode', '-play-state'],

    // CSS Transitions (WD): http://www.w3.org/TR/css3-transitions/
    'transition': ['-property', '-duration', '-timing-function', '-delay'],

    // CSS Flexible Box Layout Module Level 1 (WD): http://www.w3.org/TR/css3-flexbox/
    'flex': ['-grow', '-shrink', '-basis'],
};

/**
 * List of shorthand properties and their longhand equivalents
 *
 * @var {object}
 */
const SHORTHAND_DEFAULTS = 
{
    '-width' : '0',
    '-height' : '0',
    '-top' : '0',
    '-left' : '0',
    '-bottom' : '0',
    '-duration' : '0s',
    '-delay' : '0s',
    '-grow' : '1' ,
    '-shrink' : '1' ,
    '-iteration-count' : '1',
    '-timing-function' : 'linear',
    '-transition-property' : 'all',
    '-fill-mode': 'none',
    '-emphasis' : 'none',
    '-color' : 'none',
    '-decoration' : 'none',
    '-direction' : 'normal',
    '-play-state' : 'running',
};

/**
 * CSS Transform value counts
 *
 * @var {object}
 */
const CSS_TRANSFORM_VALUES_COUNT = 
{
    perspective: 1,
    skewY: 1,
    translateY: 1,
    translateZ: 1,
    scaleY: 1,
    scaleZ: 1,
    rotateX: 1,
    rotateY: 1,
    rotateZ: 1,
    translateX: 1,
    skewX: 1,
    scaleX: 1,
    rotate: 1,

    skew: 2,
    translate: 2,
    scale: 2,

    translate3d: 3,
    scale3d: 3,
    rotate3d: 3,

    matrix: 6,
    matrix3d: 16
};

const CSS_3D_TRANSFORM_DEFAULTS =
{
    'translate3d' : ['0','0','0'],
    'scale3d'     : ['1','1','1'],
    'rotate3d'    : ['0','0','1','0'],
    'skew'        : ['0', '0'],
};

const CSS_3D_TRANSFORM_MAP_KEYS =
{
    x: 0,
    y: 1,
    z: 3
};

/* USED FOR css_to_px */
const CSS_PIXELS_PER_INCH = 96;
const CSS_RELATIVE_UNITS  = {
    // Relative to the font-size of the element (2em means 2 times the size of the current font)
    'em' : 16,

    // Relative to the x-height of the current font (rarely used)
    'ex' : 7.15625,

    // Relative to the width of the "0" (zero)
    'ch' : 8,

    // Relative to font-size of the root element
    'rem' : 16,

    // Relative to 1% of the width of the viewport
    'vw' : 1,

    // Relative to 1% of the height of the viewport
    'vh' : 1,

    // Relative to 1% of viewport's* smaller dimension
    // If the viewport height is smaller than the width, 
    // the value of 1vmin will be equal to 1% of the viewport height.
    // Similarly, if the viewport width is smaller than the height, the value of 1vmin will be equal to 1% of the viewport width.
    'vmin' : 765,
    'vmax' : 1200,

    // Relative to the parent element
    '%' : 16
}
const CSS_ABSOLUTE_UNITS =
{
    'in': CSS_PIXELS_PER_INCH,
    'cm': CSS_PIXELS_PER_INCH / 2.54,
    'mm': CSS_PIXELS_PER_INCH / 25.4,
    'pt': CSS_PIXELS_PER_INCH / 72,
    'pc': CSS_PIXELS_PER_INCH / 6,
    'px': 1
}


/**
 * Cached CSS propery cases.
 *
 * @var {object}
 */
const CSS_PROP_TO_HYPHEN_CASES = {};
const CSS_PROP_TO_CAMEL_CASES  = {};
	// Excludes
const PROTO_EXCLUDES = ['constructor', '__proto__', '__defineGetter__', '__defineSetter__', 'hasOwnProperty', '__lookupGetter__', '__lookupSetter__', 'isPrototypeOf', 'propertyIsEnumerable', 'toString', 'toLocaleString', 'valueOf', 'length', 'name', 'arguments', 'caller', 'prototype', 'apply', 'bind', 'call'];

// Current clone map (stops recursive cloning between array/objects)
let CURR_CLONES = new WeakMap();
	/**
 * Default options.
 * 
 * @var {object}
 */
const ANIMATION_DEFAULT_OPTIONS =
{
    // Options
    //'property', 'from', 'to'
    easing:               'ease',
    callback:              () => {},
    duration:              500,
    fps:                   90, // (11ms)
};

 /**
 * Allowed Options.
 * 
 * @var {array}
 */
const ANIMATION_ALLOWED_OPTIONS = ['property', 'from', 'to', 'duration', 'easing', 'callback'];

/**
 * Allowed Options.
 * 
 * @var {array}
 */
const ANIMATION_FILTER_OPTIONS = [ ...Object.keys(ANIMATION_DEFAULT_OPTIONS), ...ANIMATION_ALLOWED_OPTIONS];
	/**
 * Math Contstansts.
 * 
 * @var {mixed}
 */
const POW  = Math.pow;
const SQRT = Math.sqrt;
const SIN  = Math.sin;
const COS  = Math.cos;
const PI   = Math.PI;
const C1   = 1.70158;
const C2   = C1 * 1.525;
const c3   = C1 + 1;
const C4   = (2 * PI) / 3;
const C5   = (2 * PI) / 4.5;

/**
 * bounceOut function.
 * 
 * @var {function}
 */
const bounceOut = function (x)
{
    const n1 = 7.5625;
    const d1 = 2.75;

    if (x < 1 / d1)
    {
        return n1 * x * x;
    }
    else if (x < 2 / d1)
    {
        return n1 * (x -= 1.5 / d1) * x + 0.75;
    }
    else if (x < 2.5 / d1)
    {
        return n1 * (x -= 2.25 / d1) * x + 0.9375;
    }
    else
    {
        return n1 * (x -= 2.625 / d1) * x + 0.984375;
    }
};

/**
 * Easing functions.
 * 
 * @var {object}
 */
const ANIMATION_EASING_FUNCTIONS = 
{
    linear: (x) => x,
    ease: function (x)
    {
        return x < 0.5 ? 4 * x * x * x : 1 - POW(-2 * x + 2, 3) / 2;
    },
    easeIn: function (x)
    {
        return 1 - COS((x * PI) / 2);
    },
    easeOut: function (x)
    {
        return SIN((x * PI) / 2);
    },
    easeInOut: function (x)
    {
        return -(COS(PI * x) - 1) / 2;
    },
    easeInQuad: function (x)
    {
        return x * x;
    },
    easeOutQuad: function (x)
    {
        return 1 - (1 - x) * (1 - x);
    },
    easeInOutQuad: function (x)
    {
        return x < 0.5 ? 2 * x * x : 1 - POW(-2 * x + 2, 2) / 2;
    },
    easeInCubic: function (x)
    {
        return x * x * x;
    },
    easeOutCubic: function (x)
    {
        return 1 - POW(1 - x, 3);
    },
    easeInOutCubic: function (x)
    {
        return x < 0.5 ? 4 * x * x * x : 1 - POW(-2 * x + 2, 3) / 2;
    },
    easeInQuart: function (x)
    {
        return x * x * x * x;
    },
    easeOutQuart: function (x)
    {
        return 1 - POW(1 - x, 4);
    },
    easeInOutQuart: function (x)
    {
        return x < 0.5 ? 8 * x * x * x * x : 1 - POW(-2 * x + 2, 4) / 2;
    },
    easeInQuint: function (x)
    {
        return x * x * x * x * x;
    },
    easeOutQuint: function (x)
    {
        return 1 - POW(1 - x, 5);
    },
    easeInOutQuint: function (x)
    {
        return x < 0.5 ? 16 * x * x * x * x * x : 1 - POW(-2 * x + 2, 5) / 2;
    },
    easeInSine: function (x)
    {
        return 1 - COS((x * PI) / 2);
    },
    easeOutSine: function (x)
    {
        return SIN((x * PI) / 2);
    },
    easeInOutSine: function (x)
    {
        return -(COS(PI * x) - 1) / 2;
    },
    easeInExpo: function (x)
    {
        return x === 0 ? 0 : POW(2, 10 * x - 10);
    },
    easeOutExpo: function (x)
    {
        return x === 1 ? 1 : 1 - POW(2, -10 * x);
    },
    easeInOutExpo: function (x)
    {
        return x === 0
            ? 0
            : x === 1
            ? 1
            : x < 0.5
            ? POW(2, 20 * x - 10) / 2
            : (2 - POW(2, -20 * x + 10)) / 2;
    },
    easeInCirc: function (x)
    {
        return 1 - SQRT(1 - POW(x, 2));
    },
    easeOutCirc: function (x)
    {
        return SQRT(1 - POW(x - 1, 2));
    },
    easeInOutCirc: function (x)
    {
        return x < 0.5
            ? (1 - SQRT(1 - POW(2 * x, 2))) / 2
            : (SQRT(1 - POW(-2 * x + 2, 2)) + 1) / 2;
    },
    easeInBack: function (x)
    {
        return c3 * x * x * x - C1 * x * x;
    },
    easeOutBack: function (x)
    {
        return 1 + c3 * POW(x - 1, 3) + C1 * POW(x - 1, 2);
    },
    easeInOutBack: function (x)
    {
        return x < 0.5
            ? (POW(2 * x, 2) * ((C2 + 1) * 2 * x - C2)) / 2
            : (POW(2 * x - 2, 2) * ((C2 + 1) * (x * 2 - 2) + C2) + 2) / 2;
    },
    easeInElastic: function (x)
    {
        return x === 0
            ? 0
            : x === 1
            ? 1
            : -POW(2, 10 * x - 10) * SIN((x * 10 - 10.75) * C4);
    },
    easeOutElastic: function (x)
    {
        return x === 0
            ? 0
            : x === 1
            ? 1
            : POW(2, -10 * x) * SIN((x * 10 - 0.75) * C4) + 1;
    },
    easeInOutElastic: function (x)
    {
        return x === 0
            ? 0
            : x === 1
            ? 1
            : x < 0.5
            ? -(POW(2, 20 * x - 10) * SIN((20 * x - 11.125) * C5)) / 2
            : (POW(2, -20 * x + 10) * SIN((20 * x - 11.125) * C5)) / 2 + 1;
    },
    easeInBounce: function (x)
    {
        return 1 - bounceOut(1 - x);
    },
    easeOutBounce: bounceOut,
    easeInOutBounce: function (x)
    {
        return x < 0.5
            ? (1 - bounceOut(1 - 2 * x)) / 2
            : (1 + bounceOut(2 * x - 1)) / 2;
    },
};

const CSS_EASINGS = 
{
    // Defaults
    ease: 'ease',
    linear: 'linear',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',

    // sine
    easeInSine: 'cubic-bezier(0.47, 0, 0.745, 0.715)',
    easeOutSine: 'cubic-bezier(0.39, 0.575, 0.565, 1)',
    easeInOutSine: 'cubic-bezier(0.445, 0.05, 0.55, 0.95)',

    // Quad
    easeInQuad: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
    easeOutQuad: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    easeInOutQuad: 'cubic-bezier(0.455, 0.03, 0.515, 0.955)',

    // Cubic
    easeInCubic: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
    easeOutCubic: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
    easeInOutCubic: 'cubic-bezier(0.645, 0.045, 0.355, 1)',

    // Queart
    easeInQuart: 'cubic-bezier(0.895, 0.03, 0.685, 0.22)',
    easeOutQuart: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
    easeInOutQuart: 'cubic-bezier(0.77, 0, 0.175, 1)',

    // Quint
    easeInQuint: 'cubic-bezier(0.755, 0.05, 0.855, 0.06)',
    easeOutQuint: 'cubic-bezier(0.23, 1, 0.32, 1)',
    easeInOutQuint: 'cubic-bezier(0.86, 0, 0.07, 1)',

    // Expo
    easeInExpo: 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
    easeOutExpo: 'cubic-bezier(0.19, 1, 0.22, 1)',
    easeInOutExpo: 'cubic-bezier(1, 0, 0, 1)',

    // Circ
    easeInCirc: 'cubic-bezier(0.6, 0.04, 0.98, 0.335)',
    easeOutCirc: 'cubic-bezier(0.075, 0.82, 0.165, 1)',
    easeInOutCirc: 'cubic-bezier(0.785, 0.135, 0.15, 0.86)',

    // Back
    easeInBack: 'cubic-bezier(0.6, -0.28, 0.735, 0.045)',
    easeOutBack: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    easeInOutBack: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
};

	/**
 * JavaScript helper library
 *
 * @author    {Joe J. Howard}
 * @copyright {Joe J. Howard}
 * @license   {https://github.com/kanso-cms/cms/blob/master/LICENSE}
 */      
class HelperJS
{
    version = "1.0.0";

    author = "Joe Howard";

    browser = false;

    _events = {};
		/**
 * JS Aniamation Core
 *
 * @access {private}
 * @param  {DOMElement} DOMElement          Target DOM node
 * @param  {object}     options             Options object
 * @param  {string}     options.property    CSS property
 * @param  {mixed}      options.from        Start value
 * @param  {mixed}      options.to          Ending value
 * @param  {int}        options.duration    Animation duration in MS
 * @param  {string}     options.easing      Easing function in camelCase
 * @param  {function}   options.callback    Callback to apply when animation ends (optional)
 */
__animate_js(DOMElement, options)
{
    const _helper = this;

    const AnimateJS = function(DOMElement, options)
    {
        this.DOMElement = DOMElement;

        this.options = options;

        this.keyframes = [];

        this.currentKeyframe = 0;

        this.duration = options.duration;

        this.intervalDelay = Math.floor(1000 / options.fps);

        this.keyFrameCount = Math.floor(this.duration / this.intervalDelay) + 1;

        this.intervalTimer = null;

        this.callbacks = [options.callback];

        this.easing = options.easing;

        this.CSSProperty = options.property;

        this.isTransform = this.CSSProperty.toLowerCase().includes('transform');

        this.isColor = options.property.includes('color') || options.to.startsWith('#') || options.to.startsWith('rgb');

        this.parseOptions();

        this.generateKeyframes();
    }

    AnimateJS.prototype.start = function()
    {
        if (this.keyFrameCount === 0) return;

        clearInterval(this.intervalTimer);

        this.clearTransitions();

        var _this = this;

        this.intervalTimer = setInterval(function()
        {
            _this.loop();

        }, this.intervalDelay);

        return this;
    }

    AnimateJS.prototype.loop = function()
    {        
        const keyframe = this.keyframes.shift();
        const prop     = Object.keys(keyframe)[0];

        _helper.css(this.DOMElement, prop, keyframe[prop]);

        this.currentKeyframe++;

        this.stop();
    }

    AnimateJS.prototype.stop = function(force)
    {
        if (this.keyframes.length === 0 || force === true)
        {
            clearInterval(this.intervalTimer);

            this.keyframes = [];

            _helper.each(this.callbacks, function(i, callback)
            {
                if (_helper.is_function(callback))
                {
                    callback(this.DOMElement);
                }
                
            }, this);
        }
    }

    AnimateJS.prototype.parseOptions = function()
    {
        if (this.isTransform)
        {
            this.parseTransformOptions();
        }
        else if (this.isColor)
        {
            this.parseColorOptions();
        }
        else
        {
            this.parseDefaultOptions();
        }
    }

    AnimateJS.prototype.parseDefaultOptions = function()
    {
        var startVal = _helper.is_undefined(this.options.from) ? _helper.rendered_style(this.DOMElement, this.CSSProperty) : this.options.from;
        var endVal   = this.options.to;

        // We need to set the end value, then remove it and re-apply any inline styles if they
        // existed
        if (endVal === 'auto' || endVal === 'initial' || endVal === 'unset')
        {
            let prevStyle = _helper.inline_style(this.DOMElement, this.CSSProperty);

            _helper.css(this.DOMElement, this.CSSProperty, endVal);
            
            endVal = _helper.rendered_style(this.DOMElement, this.CSSProperty);
            
            _helper.css(this.DOMElement, this.CSSProperty, prevStyle ? prevStyle : false);

        }

        var startUnit = _helper.css_value_unit(startVal);
        var endUnit   = _helper.css_value_unit(endVal);

        if (startUnit !== endUnit && this.CSSProperty !== 'opacity')
        {
            if (startUnit !== 'px')
            {
                startVal  = _helper.css_to_px(startVal + startUnit, this.DOMElement, this.CSSProperty);
                startUnit = 'px';
            }
            if (endUnit !== 'px')
            {
                endVal  = _helper.css_to_px(this.options.to, this.DOMElement, this.CSSProperty);
                endUnit = 'px';
            }
        }

        startVal = _helper.css_unit_value(startVal);
        endVal   = _helper.css_unit_value(endVal);

        this.startValue    = _helper.css_unit_value(startVal);
        this.endValue      = _helper.css_unit_value(endVal);
        this.backAnimation = endVal < startVal;
        this.distance      = Math.abs(endVal < startVal ? (startVal - endVal) : (endVal - startVal));
        this.CSSunits      = endUnit;
    }

    AnimateJS.prototype.parseTransformOptions = function()
    {
        var DOMElement    = this.DOMElement;
        var startValues   = _helper.css_transform_props(DOMElement, false);
        var endValues     = _helper.css_transform_props(this.options.to, false);

        // If a start value was specified it gets overwritten as the transform
        // property is singular
        if (this.options.from)
        {
            startValues = _helper.css_transform_props(this.options.from);
        }

        this.CSSProperty    = [];
        this.startValue     = [];
        this.endValue       = [];
        this.CSSunits       = [];
        this.backAnimation  = [];
        this.distance       = [];
        this.baseTransforms = _helper.is_empty(startValues) ? '' : _helper.join_obj(_helper.map(startValues, (prop, val) => !endValues[prop] ? val : false), '(', ') ', false, false);

        _helper.each(endValues, function(propAxis, valueStr)
        {
            var startValStr        = !startValues[propAxis] ? (propAxis.includes('scale') ? '1' : '0') : startValues[propAxis];
            var startVal           = _helper.css_unit_value(startValStr);
            var endVal             = _helper.css_unit_value(valueStr);
            var startUnit          = _helper.css_value_unit(startValStr);
            var endUnit            = _helper.css_value_unit(valueStr);
            var CSSpropertyUnits   = endUnit;

            if (startUnit !== endUnit)
            {
                // 0 no need to convert
                if (_helper.is_empty(startUnit))
                {
                    startUnit = endUnit;
                }
                else
                {
                    if (startUnit !== 'px') startVal = _helper.css_to_px(startVal + startUnit, DOMElement, propAxis.includes('Y') ? 'height' : 'width');
                    if (endUnit !== 'px') endVal = _helper.css_to_px(endVal + endUnit, DOMElement, propAxis.includes('Y') ? 'height' : 'width');
                    CSSpropertyUnits = 'px';
                }
            }

            this.CSSProperty.push(propAxis);
            this.CSSunits.push(endUnit);
            this.endValue.push(endVal);
            this.startValue.push(startVal);
            this.backAnimation.push(endVal < startVal);
            this.distance.push(Math.abs(endVal < startVal ? (startVal - endVal) : (endVal - startVal)));

        }, this);
    }

    AnimateJS.prototype.parseColorOptions = function()
    {
        this.startValue = this.sanitizeColor(this.options.from || _helper.rendered_style(this.DOMElement, this.CSSProperty));
        this.endValue   = this.sanitizeColor(this.options.to);
    }

    /**
     * Sanitize the start and end colors to RGB arrays.
     * 
     * @param  {string} color  hex or rgb color as as string
     * @return {array}
     */
    AnimateJS.prototype.sanitizeColor = function(color)
    {
        if (color.startsWith('rgb('))
        {
            return color.split(' ', 3).map((x) => parseInt(x.replaceAll(/[^\d+]/g, '')));
        }
        else if (color.length === 7 )
        {
            let rgb = [];

            color.match(/#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i).forEach((item) =>
            {
                if (item.length === 2)
                {
                    const color = parseInt(item, 16);

                    rgb.push(color);
                }
            });

            return rgb;
        }
    }

    AnimateJS.prototype.generateKeyframes = function()
    {    
        if (_helper.is_equal(this.startValue, this.endValue))
        {
            this.keyFrameCount = 0;

            return;
        }

        if (this.isTransform)
        {
            _helper.for(this.endValue, function(transformIndex)
            {
                _helper.for(this.keyFrameCount, function(index)
                {
                    this.keyframes.push(this.generateKeyframe(index, transformIndex));
                    
                }, this);
                
            }, this);

            return;
        }

        _helper.for(this.keyFrameCount, function(index)
        {
            this.keyframes.push(this.generateKeyframe(index));
            
        }, this);
    }

    AnimateJS.prototype.generateKeyframe = function(index, transformIndex)
    {
        if (this.isColor)
        {
            const change = this.tween(this.easing, (index / this.keyFrameCount));
            
            return { [this.CSSProperty]: this.mixColors(this.startValue, this.endValue, change) };
        }
        
        const backAnimation = this.isTransform ? this.backAnimation[transformIndex] : this.backAnimation;

        const startValue = this.isTransform ? this.startValue[transformIndex] : this.startValue;

        const distance = this.isTransform ? this.distance[transformIndex] : this.distance;

        const change = (distance * this.tween(this.easing, (index / this.keyFrameCount)));

        const keyVal = this.roundNumber(backAnimation ? startValue - change : startValue + change, 5);

        var property = this.isTransform ? 'transform' : this.CSSProperty;

        var prefix  = this.isTransform ? `${this.CSSProperty[transformIndex]}(` : '';

        var suffix  = this.isTransform ? `${this.CSSunits[transformIndex]})` : this.CSSunits;
        
        var keyframe = { [property]:  `${prefix}${keyVal}${suffix}` };
        
        if (this.isTransform && _helper.is_undefined(this.keyframes[index]))
        {
            keyframe[property] = `${this.baseTransforms} ${keyframe[property]}`.trim();
        }

        return keyframe;
    }

    /**
     * Mix 2 colors.
     * 
     * @param  {array}  color1 RGB color array
     * @param  {array}  color2 RGB color array
     * @param  {number} blend % between 0 and 1
     * @return {string} 
     */
    AnimateJS.prototype.mixColors = function(color1RGB, color2RGB, blend)
    {
        function linearInterpolation(y1, y2, x)
        {
            return Math.round(x * (y2 - y1) + y1);
        }
        
        const colorRGB  = [];

        color1RGB.forEach((c1, index) =>
        {
            const mixedColor = linearInterpolation(c1, color2RGB[index], blend);

            colorRGB.push(mixedColor);
        });

        return 'rgb(' + colorRGB + ')';
    }

    /**
     * Calculate the easing pattern.
     * 
     * @private
     * @link    {https://gist.github.com/gre/1650294}
     * @param   {String} type Easing pattern
     * @param   {Number} time Time animation should take to complete
     * @returns {Number}
     */
    AnimateJS.prototype.clearTransitions = function()
    {        
        var CSSProperty    = this.isTransform ? 'transform' : this.CSSProperty;
        var transitions    = _helper.css_transition_props(this.DOMElement);
        var css_transition = _helper.inline_style(this.DOMElement, 'transition'); 

        if (_helper.is_empty(transitions) || !transitions[CSSProperty]) return;

        transitions[CSSProperty] = '0s linear 0s';

        _helper.css(this.DOMElement, 'transition', _helper.join_obj(transitions, ' ', ', '));

        this.callbacks.push(() => { _helper.css(this.DOMElement, 'transition', !css_transition ? false : css_transition ); });

    }

    AnimateJS.prototype.roundNumber = (n, dp) => 
    {
        const h = +('1'.padEnd(dp + 1, '0')) // 10 or 100 or 1000 or etc

        return Math.round(n * h) / h;
    }

    /**
     * Calculate the easing pattern.
     * 
     * @private
     * @link    {https://gist.github.com/gre/1650294}
     * @param   {String} type Easing pattern
     * @param   {Number} time Time animation should take to complete
     * @returns {Number}
     */
    AnimateJS.prototype.tween = function(type, time)
    {
        return ANIMATION_EASING_FUNCTIONS[type].call(null, time) || time;
    }

    return (new AnimateJS(DOMElement, options)).start();
    
}
		/**
 * CSS Animation.
 *
 * @access {private}
 * @param  {DOMElement}     DOMElement          Target DOM node
 * @param  {object}   options             Options object
 * @param  {string}   options.property    CSS property
 * @param  {mixed}    options.from        Start value
 * @param  {mixed}    options.to          Ending value
 * @param  {int}      options.duration    Animation duration in MS
 * @param  {string}   options.easing      Easing function in camelCase
 * @param  {function} options.callback    Callback to apply when animation ends (optional)
 * Options can be provided three ways:
 * 
 * 1. Flat object with single property
 *      animate(el, { height: '500px', easing 'easeOut' })
 * 
 * 2. Flat Object with multiple properties 
 *      Note this way you can only animate from the existing rendered element style (you cannot provide a 'from' value)
 *      animate(el, { height: '500px', width: '500px', easing 'easeOut' })
 * 
 * 3. Multi object with different options per property
 *      animate(el, { height:{ from: '100px', to: '500px', easing: 'easeInOutElastic'}, opacity:{ to: 0, easing: 'linear'} } );
 * 
 */
__animate_css(DOMElement, options)
{    
    const _helper = this;

    var _this;

    const AnimateCss = function(DOMElement, options)
    {        
        _this = this;

        this.DOMElement = DOMElement;

        this.options = options;

        this.animatedProps = {};

        this.animatedTransitions = {};

        this.preAnimatedTransitions = {};

        this.callback = null;

        this.preProcessStartEndValues();

        return this;
    };

    /**
     * Start animation.
     *
     */
    AnimateCss.prototype.start = function()
    {
        this.applyStartValues();

        this.applyTransitions();

        DOMElement.addEventListener('transitionend', this.on_complete, true);

        this.applyEndValues();

        return this;
    }

    /**
     * Stop animation.
     *
     */
    AnimateCss.prototype.stop = function()
    {
        DOMElement.removeEventListener('transitionend', _this.on_complete, true);

        _helper.css(DOMElement, 'transition', this.preAnimatedTransitions);
    }

    /**
     * Stop animation and destroy.
     *
     */
    AnimateCss.prototype.destory = function()
    {
        this.stop();

        this.animatedProps = {};

        this.animatedTransitions = {};

        this.preAnimatedTransitions = {};

        this.callback = null;
    }

    /**
     * On transition end.
     * 
     * Note if a multiple animation properties wer supplied
     * we only want to call the callback once when all transitions
     * have completed.
     *
     * @param  {Event} e transitionEnd event
     */
    AnimateCss.prototype.on_complete = function(e)
    {        
        e = e || window.event;

        var prop = _helper.css_prop_to_hyphen_case(e.propertyName);

        if (prop === 'background-color') prop = 'background';

        // Change inline style back to auto
        let endVal = _this.animatedProps[prop];
        if (endVal === 'auto' || endVal === 'initial' || endVal === 'unset') _helper.css(DOMElement, prop, endVal);

        delete _this.animatedTransitions[prop];

        delete _this.animatedProps[prop];
        
        var completed = _helper.is_empty(_this.animatedProps);

        var transition = completed ? _this.preAnimatedTransitions : _helper.join_obj(_this.animatedTransitions, ' ', ', ');

        _helper.css(DOMElement, 'transition', _this.preAnimatedTransitions);

        if (completed)
        {
            DOMElement.removeEventListener('transitionend', _this.on_complete, true);
            
            if (_helper.is_function(_this.callback))
            {
                _this.callback(_this.DOMElement);
            }
        }
    }

    /**
     * Checks for "auto" transtions.
     * 
     */
    AnimateCss.prototype.preProcessStartEndValues = function()
    {
        var DOMElement = this.DOMElement;
        
        // We need to set the end value explicitly as these values will not
        // transition with CSS
        _helper.each(this.options, function(i, option)
        {
            let startValue  = option.from;
            let endValue    = option.to;
            let CSSProperty = option.property;

            if (startValue === 'auto' || startValue === 'initial' || startValue === 'unset' || !startValue)
            {
                this.options[i].from = _helper.rendered_style(DOMElement, CSSProperty);
            }

            if (endValue === 'auto' || endValue === 'initial' || endValue === 'unset')
            {
                var inlineStyle = _helper.inline_style(DOMElement, CSSProperty);

                _helper.css(DOMElement, CSSProperty, endValue);

                this.options[i].to = _helper.rendered_style(DOMElement, CSSProperty);

                _helper.css(DOMElement, CSSProperty, inlineStyle ? inlineStyle : false);
            }

            this.animatedProps[CSSProperty] = endValue;
        
        }, this);
    }

    /**
     * Apply start values.
     * 
     */
    AnimateCss.prototype.applyStartValues = function()
    {
        var styles = {};

        _helper.each(this.options, function(i, option)
        {
            if (option.from)
            {
                styles[option.property] = option.from;
            }
        });

        if (!_helper.is_empty(styles)) _helper.css(this.DOMElement, styles);
    }

    /**
     * Apply animation transitions.
     * 
     */
    AnimateCss.prototype.applyTransitions = function()
    {
        this.preAnimatedTransitions  = _helper.inline_style(this.DOMElement, 'transition');
        this.preAnimatedTransitions  = !this.preAnimatedTransitions ? false : this.preAnimatedTransitions;
        this.animatedTransitions     = _helper.css_transition_props(this.DOMElement);

        _helper.each(this.options, function(i, option)
        {
            // Setup and convert duration from MS to seconds
            let property = option.property;
            let duration = (option.duration / 1000);
            let easing   = CSS_EASINGS[option.easing] || 'ease';

            // Set the transition for the property
            // in our merged obj
            this.animatedTransitions[property] = `${duration}s ${easing}`;

        }, this);

        _helper.css(this.DOMElement, 'transition', _helper.join_obj(this.animatedTransitions, ' ', ', '));
    }

    /**
     * Apply animation end values.
     * 
     */
    AnimateCss.prototype.applyEndValues = function()
    {
        var styles = {};

        _helper.each(options, function(i, option)
        {
            styles[option.property] = option.to;

            this.callback = option.callback;

        }, this);

        _helper.css(DOMElement, styles);
    }

    return new AnimateCss(DOMElement, options).start();
}

		/**
 * Animate JS
 *
 * @access {public}
 * @param  {DOMElement} DOMElement                  Target DOM node
 * @param  {object}     options             Options object
 * @param  {string}     options.property    CSS property
 * @param  {mixed}      options.from        Start value
 * @param  {mixed}      options.to          Ending value
 * @param  {int}        options.duration    Animation duration in MS
 * @param  {string}     options.easing      Easing function in camelCase
 * @param  {function}   options.callback    Callback to apply when animation ends (optional)
 * @return {array}
 * Options can be provided three ways:
 * 
 * 1. Flat object with single property
 *      animate(el, { height: '500px', easing 'easeOut' })
 * 
 * 2. Flat Object with multiple properties 
 *      Note this way you can only animate from the existing rendered element style (you cannot provide a 'from' value)
 *      animate(el, { height: '500px', width: '500px', easing 'easeOut' })
 * 
 * 3. Multi object with different options per property
 *      animate(el, { height:{ from: '100px', to: '500px', easing: 'easeInOutElastic'}, opacity:{ to: 0, easing: 'linear'} } );
 * 
 */
animate(DOMElement, options)
{
    const animations = [];

    const Animation = function()
    {
        return this;
    };

    Animation.prototype.stop = function()
    {
        for (var i = 0; i < animations.length; i++)
        {
            animations[i].stop(true);
        }
    };

    Animation.prototype.destory = function()
    {
        for (var i = 0; i < animations.length; i++)
        {
            animations[i].destory();
        }

        animations = [];
    };

    const factoryOptions = !options.FROM_FACTORY ? this.__animation_factory(DOMElement, options) : options;

    const AnimationInstance = new Animation;

    this.each(factoryOptions, function(i, opts)
    {
        animations.push(this.__animate_js(DOMElement, opts));

    }, this);

    return AnimationInstance;
}

/**
 * Animate CSS
 *
 * @access {public}
 * @param  {DOMElement} DOMElement                  Target DOM node
 * @param  {object}     options             Options object
 * @param  {string}     options.property    CSS property
 * @param  {mixed}      options.from        Start value
 * @param  {mixed}      options.to          Ending value
 * @param  {int}        options.duration    Animation duration in MS
 * @param  {string}     options.easing      Easing function in camelCase
 * @param  {function}   options.callback    Callback to apply when animation ends (optional)
 * @return {array}
 * Options can be provided three ways:
 * 
 * 1. Flat object with single property
 *      animate(el, { height: '500px', easing 'easeOut' })
 * 
 * 2. Flat Object with multiple properties 
 *      Note this way you can only animate from the existing rendered element style (you cannot provide a 'from' value)
 *      animate(el, { height: '500px', width: '500px', easing 'easeOut' })
 * 
 * 3. Multi object with different options per property
 *      animate(el, { height:{ from: '100px', to: '500px', easing: 'easeInOutElastic'}, opacity:{ to: 0, easing: 'linear'} } );
 * 
 */
animate_css(DOMElement, options)
{
    var cssAnimation;

    const Animation = function()
    {
        return this;
    };

    Animation.prototype.stop = function()
    {
        cssAnimation.stop(true);
    };

    Animation.prototype.destory = function()
    {
        cssAnimation.destory(true);
    };

    const factoryOptions = !options.FROM_FACTORY ? this.__animation_factory(DOMElement, options) : options;

    cssAnimation = this.__animate_css(DOMElement, factoryOptions);
    
    return new Animation;
}

/**
 * Animation factory.
 *
 * @access {private}
 * @param  {DOMElement} DOMElement                  Target DOM node
 * @param  {object}     options             Options object
 * @param  {string}     options.property    CSS property
 * @param  {mixed}      options.from        Start value
 * @param  {mixed}      options.to          Ending value
 * @param  {int}        options.duration    Animation duration in MS
 * @param  {string}     options.easing      Easing function in camelCase
 * @param  {function}   options.callback    Callback to apply when animation ends (optional)
 * @return {array}
 * Options can be provided three ways:
 * 
 * 1. Flat object with single property
 *      animate(el, { height: '500px', easing 'easeOut' })
 * 
 * 2. Flat Object with multiple properties 
 *      Note this way you can only animate from the existing rendered element style (you cannot provide a 'from' value)
 *      animate(el, { height: '500px', width: '500px', easing 'easeOut' })
 * 
 * 3. Multi object with different options per property
 *      animate(el, { height:{ from: '100px', to: '500px', easing: 'easeInOutElastic'}, opacity:{ to: 0, easing: 'linear'} } );
 * 
 */
__animation_factory(DOMElement, opts)
{
    var optionSets = [];

    this.each(opts, function(key, val)
    {
        // animation_factory('foo', { property : 'left', from : '-300px', to: '0',  easing: 'easeInOutElastic', duration: 3000} );
        if (key === 'property')
        {
            var options = this.array_merge({}, ANIMATION_DEFAULT_OPTIONS, opts);

            options.FROM_FACTORY = true;
            options.property = val;
            options.el = DOMElement;
            optionSets.push(options);

            // break
            return false;
        }
        else if (!this.in_array(key, ANIMATION_ALLOWED_OPTIONS))
        {
            // Only worth adding if the property is vavlid
            var camelProp = this.css_prop_to_camel_case(key);
            
            if (!this.is_undefined(document.body.style[camelProp]))
            {
                var isObjSet = this.is_object(val);
                var toMerge  = isObjSet ? val : opts;
                var options  = this.array_merge({}, ANIMATION_DEFAULT_OPTIONS, toMerge);
                
                // animation_factory('foo', { height: '100px', opacity: 0 } );
                if (!isObjSet)
                {
                    options.to = val;
                }

                // animation_factory('foo', { height: { from: '100px', to: '500px', easing: 'easeInOutElastic'}, opacity:{ to: 0, easing: 'linear'} } );
                options.FROM_FACTORY = true;
                options.property     = key;
                options.el           = DOMElement;
                optionSets.push(options);
            }
        }
    }, this);

    this.each(optionSets, function(i, options)
    {
        // Not nessaray, but sanitize out redundant options
        options = this.map(options, function(key, val)
        {
            return this.in_array(key, ANIMATION_FILTER_OPTIONS) ? val : false;

        }, this);

        if (!ANIMATION_EASING_FUNCTIONS[options.easing]) options.easing = 'ease';

        options.FROM_FACTORY = true;

        optionSets[i] = options;

    }, this);

    if (this.is_empty(optionSets))
    {
        console.error('Animation Error: Either no CSS property(s) was provided or the provided property(s) is unsupported.');
    }

    return optionSets;
}
		/**
 * Deletes from an array/object using dot/bracket notation.
 *
 * @param   {string}        path   Path to delete
 * @param   {object|array}  object Object to delete from
 * @returns {object|array}
 */
array_delete(path, object)
{
    this.__arrayDeleteRecursive(this.__arrayKeySegment(path), object);

    return object;
}
		/**
 * Filters empty array entries and returns new array
 *
 * @param   {object|array}  object Object to delete from
 * @returns {object|array}
 */
array_filter(arr)
{
    let isArr = this.is_array(arr);

    let ret = isArr ? [] : {};

    this.foreach(arr, function(i, val)
    {
        if (!this.is_empty(val))
        {
            isArr ? ret.push(val) : ret[i] = val;
        }
    });

    return ret;
}
		/**
 * Gets an from an array/object using dot/bracket notation.
 *
 * @param   {string}        path    Path to get
 * @param   {object|array}  object  Object to get from
 * @returns {mixed}
 */
array_get(path, object)
{
    return this.__arrayGetRecursive(this.__arrayKeySegment(path), object);
}


		/**
 * Checks if array/object contains path using dot/bracket notation.
 *
 * e.g array_has('foo.bar.baz[0]', obj)
 * 
 * @param   {string}        path   Path to check
 * @param   {object|array}  object Object to check on
 * @returns {boolean}
 */
array_has(path, object)
{
    return !this.is_undefined(this.array_get(path, object));
}
		/**
 * Merges multiple objects or arrays into the original.
 *
 * @param   {object|array} First array then any number of array or objects to merge into
 * @returns {object|array}
 */
array_merge()
{
    let args = TO_ARR.call(arguments);

    if (args.length === 0)
    {
        throw new Error('Nothing to merge.');
    }
    else if (args.length === 1)
    {
        return args[1];
    }

    var clone = false;

    // Clone deep
    this.each(args, function(i, arg)
    {
        if (arg = 'CLONE_FLAG_TRUE')
        {
            clone = true;

            return false;
        }
    });

    let first = args.shift();
    let fType = this.is_array(first) ? 'array' : 'obj';

    this.each(args, function(i, arg)
    {
        if (!this.is_array(arg) && !this.is_object(arg))
        {
            throw new Error('Arguments must be an array or object.');
        }

        first = fType === 'array' ? [...first, ...arg] : {...first, ...arg};

    }, this);

    return first;
}
		/**
 * Set a key using dot/bracket notation on an object or array.
 *
 * @param   {string}       path   Path to set
 * @param   {mixed}        value  Value to set
 * @param   {object|array} object Object to set into
 * @returns {object|array}
 */
array_set(path, value, object)
{
    this.__arraySetRecursive(this.__arrayKeySegment(path), value, object);

    return object;
}
		/**
 * Removes duplicates and returns new array.
 *
 * @param   {array} arr Array to run
 * @returns {array}
 */
array_unique(arr)
{
    let uniq = function(value, index, self)
    {
        return self.indexOf(value) === index;
    }

    return arr.filter(uniq);
}
		/**
 * Foreach loop
 * 
 * @access {public}
 * @param  {object}  obj       The target object to loop over
 * @param  {closure} callback  Callback to apply to each iteration
 * @param  {array}   args      Array of params to apply to callback (optional) (default null)
 */
each(obj, callback)
{
    if (typeof obj !== 'object' || obj === null) return;

    let isArray = TO_STR.call(obj) === '[object Array]';
    let i       = 0;
    let keys    = isArray ? null : Object.keys(obj);
    let len     = isArray ? obj.length : keys.length;
    let args    = TO_ARR.call(arguments).slice(2);
    let ret     = isArray ? [] : {};
    let key;
    let val;
    let clbkVal;

    // Applies the value of "this" to the callback as the array or object provided
    //var thisArg = typeof args !== 'undefined' && TO_STR.call(args) !== '[object Array]' ? args : obj;

    // Applies this arg as first extra arg if provided
    // otherwise falls back to the array or object provided
    // Removes "this" from args to callback
    var thisArg = this.is_empty(args) ? obj : args[0];
    args        = !this.is_empty(args) ? args.slice(1) : null;
    args        = this.is_empty(args) ? null : args;

    if (TO_STR.call(args) === '[object Array]')
    {
        for (; i < len; i++)
        {
            key   = isArray ? i : keys[i];
            val   = isArray ? obj[i] : obj[key];
            clbkVal = callback.apply(thisArg, this.array_merge([key, val], args));

            if (clbkVal === false)
            {
                break;
            }
        }

        // A special, fast, case for the most common use of each (no extra args provided)
    }
    else
    {
        for (; i < len; i++)
        {
            key   = isArray ? i : keys[i];
            val   = isArray ? obj[i] : obj[key];
            clbkVal = callback.call(thisArg, key, val);

            if (clbkVal === false)
            {
                break;
            }
        }
    }

    return obj;
}

foreach()
{
    return this.each.apply(this, arguments);
}

/**
 * For loop with count
 * 
 * @access {public}
 * @param  {object}  obj       The target object to loop over
 * @param  {closure} callback  Callback to apply to each iteration
 * @param  {array}   args      Array of params to apply to callback (optional) (default null)
 */
for(count, callback)
{
    var args = TO_ARR.call(arguments);

    args[0] = Array.from(Array(count).keys());

    return this.each.apply(this, args);
}


		/**
 * Checks if an array contains a value
 *
 * @access {public}
 * @param  {string} needle    The value to search for
 * @param  {array}  haystack  The target array to index
 * @param  {bool}   strict    Strict comparison (optional) (default false)
 * @return {bool}
 * 
 */
in_array(needle, haystack, strict)
{
    strict = this.is_undefined(strict) ? false : strict;
    
    let ret = false;

    this.each(haystack, function(k, v)
    {
        ret = this.is_equal(needle, v, strict);

        if (ret) return false;

    }, this);

    return ret;
}
		/**
 * Map.
 *  
 * return undefined to break loop, true to keep, false to reject
 * 
 * @param   {array|object}  obj
 * @param   {function}      callback
 * @param   {array|mixed}   args      If single arg provided gets apllied as this to callback, otherwise args apllied to callback
 * @returns {array|object}
 */
map(obj, callback)
{
    if (typeof obj !== 'object' || obj === null) return;

    let isArray = TO_STR.call(obj) === '[object Array]';
    let i       = 0;
    let keys    = isArray ? null : Object.keys(obj);
    let len     = isArray ? obj.length : keys.length;
    let args    = TO_ARR.call(arguments).slice(2);
    let ret     = isArray ? [] : {};
    let key;
    let val;
    let clbkVal;

    // Applies the value of "this" to the callback as the array or object provided
    //var thisArg = typeof args !== 'undefined' && TO_STR.call(args) !== '[object Array]' ? args : obj;

    // Applies this arg as first extra arg if provided
    // otherwise falls back to the array or object provided
    // Removes "this" from args to callback
    var thisArg = this.is_empty(args) ? obj : args[0];
    args        = !this.is_empty(args) ? args.slice(1) : null;
    args        = this.is_empty(args) ? null : args;

    if (TO_STR.call(args) === '[object Array]')
    {
        for (; i < len; i++)
        {
            key   = isArray ? i : keys[i];
            val   = isArray ? obj[i] : obj[key];
            clbkVal = callback.apply(thisArg, this.array_merge([key, val], args));

            if (clbkVal === false)
            {
                continue;
            }
            else if (typeof clbkVal === 'undefined')
            {
                break;
            }
            else
            {
                isArray ? ret.push(clbkVal) : ret[key] = clbkVal;
            }
        }

        // A special, fast, case for the most common use of each (no extra args provided)
    }
    else
    {
        for (; i < len; i++)
        {
            key   = isArray ? i : keys[i];
            val   = isArray ? obj[i] : obj[key];
            clbkVal = callback.call(thisArg, key, val);

            if (clbkVal === false)
            {
                continue;
            }
            else if (typeof clbkVal === 'undefined')
            {
                break;
            }
            else
            {
                isArray ? ret.push(clbkVal) : ret[key] = clbkVal;
            }
        }
    }

    return ret;
}
		/**
 * Set, get or remove DOM attribute.
 *
 * No third arg returns attribute value, third arg set to null or false removes attribute.
 * 
 * @param {HTMLElement}  DOMElement  Dom node
 * @param {string}       name        Property name
 * @apram {mixed}        value       Property value
 */
attr(DOMElement, name, value)
{
    // Get attribute
    // e.g attr(node, style)
    if ((TO_ARR.call(arguments)).length === 2 && this.is_string(name))
    {
        return this.__getAttribute(DOMElement, name);
    }

    // attr(node, {foo : 'bar', baz: 'bar'})
    if (this.is_object(name))
    {
        this.each(name, function(prop, value)
        {
            this.attr(DOMElement, prop, value);
        }, this);

        return;
    }

    switch (name)
    {
        // innerHTML
        case 'innerHTML':
            DOMElement.innerHTML = value;
            break;

        // Children
        case 'children':
            this.each(value, function(node)
            {
                DOMElement.appendChild(node);
            });
            break;

        // Class
        case 'class':
        case 'className':
            DOMElement.className = value;
            break;

        // Style
        case 'style':

            // remove all styles completely
            if (this.is_empty(value))
            {
                DOMElement.removeAttribute('style');
            }
            // Clear style and overwrite
            else if (this.is_string(value))
            {
                DOMElement.style = '';
                
                // attr(node, 'css', 'foo : bar; baz: bar;})
                this.each(value.split(';'), function(i, rule)
                {
                    var style = rule.split(':');

                    if (style.length >= 2)
                    {
                        this.css(DOMElement, style.shift().trim(), style.join(':').trim());
                    }
                }, this);
            }
            // attr(node, 'css', {foo : 'bar', baz: 'bar'})
            else if (this.is_object(value))
            {
                DOMElement.style = '';

                this.each(value, function(prop, value)
                {
                    this.css(DOMElement, prop, value);
                    
                }, this);
            }
            break;

        // Events / attributes
        default:

            // Events
            if (name[0] === 'o' && name[1] === 'n')
            {
                var evt = name.slice(2).toLowerCase();

                // Remove old listeners
                this.removeEventListener(DOMElement, evt);

                // Add new listener if one provided
                if (value)
                {
                    this.addEventListener(DOMElement, evt, value);
                }
            }
            // All other node attributes
            else
            {
                if (
                    name !== 'href' &&
                    name !== 'list' &&
                    name !== 'form' &&
                    // Default value in browsers is `-1` and an empty string is
                    // cast to `0` instead
                    name !== 'tabIndex' &&
                    name !== 'download' &&
                    name in DOMElement
                )
                {
                    try
                    {
                        DOMElement[name] = value == null ? '' : value;
                        // labelled break is 1b smaller here than a return statement (sorry)
                        break;
                    } catch (e) {}
                }

                // ARIA-attributes have a different notion of boolean values.
                // The value `false` is different from the attribute not
                // existing on the DOM, so we can't remove it. For non-boolean
                // ARIA-attributes we could treat false as a removal, but the
                // amount of exceptions would cost us too many bytes. On top of
                // that other VDOM frameworks also always stringify `false`.

                if (typeof value === 'function')
                {
                    // never serialize functions as attribute values
                }
                else if (value != null && (value !== false || name.indexOf('-') != -1))
                {
                    DOMElement.setAttribute(name, value);
                }
                else
                {
                    DOMElement.removeAttribute(name);
                }
            }

            break;
    }
}
		/**
 * Set, get or remove CSS value(s) on element.
 * 
 * Note that this will only return inline styles, use 'rendered_style' for
 * currently displayed styles.
 *
 * @access {public}
 * @param  {DOMElement}   el     Target DOM node
 * @param  {string|object} Assoc array of property->value or string property
 * @example {Helper.css(node,} { display : 'none' });
 * @example {Helper.css(node,} 'display', 'none');
 */
css(el, property, value)
{
    // If their is no value and property is an object
    if (this.is_object(property))
    {
        this.each(property, function(prop, val)
        {
            this.css(el, prop, val);

        }, this);
    }
    else
    {
        // Getting not settings
        if (this.is_undefined(value))
        {
            return this.inline_style(el, property);
        }
        // Value is either null or false we remove
        else if (this.is_null(value) || value === false)
        {
            if (el.style.removeProperty)
            {
                el.style.removeProperty(property);
            }
            else
            {
                el.style.removeAttribute(property);
            }
        }
        else
        {
            el.style[property] = value;
        }
    }
}
		/**
 * Converts CSS property to camel case.
 *
 * @access {public}
 * @param  {string} prop Property to convert
 * @retirm {string}
 */
css_prop_to_camel_case(prop)
{
    if (!prop.includes('-')) return prop;

    let camelProp = this.to_camel_case(prop);

    if (this.in_array(prop, Object.keys(CSS_PROP_TO_CAMEL_CASES)))
    {
        return CSS_PROP_TO_CAMEL_CASES[prop];
    }

    // First char is always lowercase
    let ret = camelProp.charAt(0).toLowerCase() + camelProp.slice(1);

    CSS_PROP_TO_CAMEL_CASES[prop] = ret;

    return ret;
}
		/**
 * Converts CSS property to hyphen case.
 *
 * @access {public}
 * @param  {string} prop Property to convert
 * @retirm {string}
 */
css_prop_to_hyphen_case(prop)
{
    if (!/[A-Z]/.test(prop)) return prop;
    
    if (this.in_array(prop, Object.keys(CSS_PROP_TO_HYPHEN_CASES)))
    {
        return CSS_PROP_TO_HYPHEN_CASES[prop];
    }

    var hyphenProp = this.camel_case_to_hyphen(prop);

    if (hyphenProp.startsWith('webkit-') || hyphenProp.startsWith('moz-') || hyphenProp.startsWith('ms-') || hyphenProp.startsWith('o-'))
    {
        hyphenProp = '-' + hyphenProp;
    }

    CSS_PROP_TO_CAMEL_CASES[prop] = hyphenProp;

    return hyphenProp;
}
		/**
 * Expand shorthand property to longhand properties 
 *
 * @access {private}
 * @param  {string}  CSS rules
 * @return {object}
 */
css_to_longhand(css)
{
    var ret    = {};
    var values = this.css_to_object(css);

    this.each(values, function(prop, value)
    {
        if (SHORTHAND_PROPS.hasOwnProperty(prop))
        {
            var splits  = value.split(' ').map( (x) => x.trim());
            var dfault  = prop === 'margin' || prop === 'padding' ? '0' : 'initial';

            this.each(SHORTHAND_PROPS[prop], function(i, longhand)
            {
                // Object is setup so that if it starts with a '-'
                // then it gets concatenated to the oridional prop
                // e.g 'background' -> '-image'
                longhand = longhand.startsWith('-') ? prop + longhand : longhand;

                // otherwise it gets replaced
                // e.g 'border-color' -> 'border-top-color', 'border-right-color'... etc
                ret[longhand] = this.is_undefined(splits[i]) ? dfault : splits[i];

            }, this);
        }
        else
        {
            ret[prop] = value;
        }

    }, this);

    return ret;
}
		/**
 * Concats longhand property to shorthand
 *
 * Note if values are not provide not all browsers will except inital
 * for all properties in shorthand syntax
 * 
 * @access {private}
 * @param  {string}  CSS rules
 * @return {object}
 */
css_to_shorthand(css)
{
    const needsFilling = ['margin', 'padding', 'transition', 'animation'];
    var ret            = {};
    var styles         = this.css_to_object(css);

    // 'margin': ['-top', '-right', '-bottom', '-left'],
    this.each(SHORTHAND_PROPS, function(property, longhands)
    {
        var value       = '';
        var matched     = false;
        var needsDefault = this.in_array(property, needsFilling) || property.includes('border');

        this.each(longhands, function(i, longhand)
        {
            longhand = longhand.startsWith('-') ? property + longhand : longhand;

            var suppliedVal = styles[longhand];

            if (!this.is_undefined(suppliedVal))
            {
                matched = true;
                // Colors get flatted
                if (longhand.includes('-color'))
                {
                    value = suppliedVal;
                }
                else
                {
                    value += suppliedVal + ' ';
                }
            }
            else if (needsDefault)
            {
                this.each(SHORTHAND_DEFAULTS, function(matcher, defaltVal)
                {
                    if (longhand.includes(matcher))
                    {
                        value += ` ${defaltVal} `;
                    }
                });
                
            }
            
        }, this);

        if (!this.is_empty(value) && matched) ret[property] = value.trim();
        
    }, this);

    return ret;
}
		/**
 * Converts string styles into an object
 *
 * @param  {string} styles CSS
 * @return {object}
 */
css_to_object(styles)
{
    var ret = {};

    const nested_regex = /([^\{]+\{)([\s\S]+?\})(\s*\})/g;

    const css_regex = /([^{]+\s*\{\s*)([^}]+)(\s*\}\s*)/g;

    if (styles.includes('{'))
    {
        var nestedStyles = [...css.matchAll(nested_regex)];


    }

    this.each(styles.split(';'), function(i, rule)
    {
        var style = rule.split(':');

        if (style.length >= 2)
        {
            var prop = style.shift().trim();
            var val  = style.join(':').trim();

            ret[prop] = val;
        }
    }, this);

    return ret;
}
		/**
 * Get CSS property.
 * 
 * @param  {string} value CSS value (e.g "12px")
 * @return {Number}
 */
css_unit_value(value)
{
    value = value + '';

    if (this.is_numeric(value))
    {
        return parseFloat(value);
    }

    if (this.is_empty(value))
    {
        return 0;
    }

    return parseFloat(value.replaceAll(/[^0-9-.]/g, ''));
}

/**
 * Get CSS property unit.
 * 
 * @param  {string} value CSS value (e.g "12px")
 * @return {string}
 */
css_value_unit(value)
{
    value = value + '';

    return value.split(/[0-9]/).pop().replaceAll(/[^a-z%]/g, '').trim();
}

/**
 * Converts CSS units to px.
 * 
 * @param  {String}     value      CSS value (e.g "12rem")
 * @param  {DomElement} DOMElement CSS value (optional) (used to relative units)
 * @param  {String}     property   CSS property (optional) (used for % unit)
 * @return {Number}
 */
css_to_px(valueStr, DOMElement, property)
{
    valueStr = valueStr + '';
    
    if (valueStr.includes('calc')) return valueStr;

    var unit  = this.css_value_unit(valueStr);
    var value = this.css_unit_value(valueStr);

    if (valueStr.includes('px')) return value;

    if (!this.is_undefined(CSS_ABSOLUTE_UNITS[unit]))
    {
        return (value * CSS_ABSOLUTE_UNITS[unit]);
    }

    if (!this.is_undefined(CSS_RELATIVE_UNITS[unit]))
    {
        if (unit === 'em' || unit === 'ex' || 'unit' === 'ch')
        {
            if (!DOMElement) return value * CSS_RELATIVE_UNITS[unit];
            let psize = this.css_unit_value(this.rendered_style(DOMElement.parentNode, 'font-size'));
            if (unit === 'em') return value * psize;
            if (unit === 'ex') return value * (psize / 1.8);
            if (unit === 'ch') return value * (psize / 2);
            if (unit === '%')  return value * psize;
        }
        else if (unit === '%')
        {
            if (!DOMElement) return value * CSS_RELATIVE_UNITS[unit];
            if (!property) property = 'height';
            
            let psize = this.css_unit_value(this.rendered_style(DOMElement, property));

            return psize * (value / 100);
        }
        else if (unit === 'rem')
        {
            // font sizes are always returned in px with JS
            return value * this.css_unit_value(this.rendered_style(document.documentElement, 'font-size'));
        }
        else if (unit === 'vw')
        {
            return this.width(window) * (value / 100);
        }
        else if (unit === 'vh')
        {
            return this.height(window) * (value / 100);
        }
        else if (unit === 'vmin' || unit === 'vmax')
        {
            let w = this.width(window);
            let h = this.height(window);
            let m = unit === 'vmin' ? Math.min(w, h) : Math.max(w, h)

            return m * (value / 100);
        }
    }

    return value;
}

		/**
 * Get an element's inline style if it exists
 *
 * @access {public}
 * @param  {DOMElement}   el   Target element
 * @param  {string} prop CSS property to check
 * @return {string}
 */
inline_style(element, prop)
{
    const elementStyle = element.style;

    prop = this.css_prop_to_hyphen_case(prop);

    if (Object.hasOwn(elementStyle, prop))
    {
        const val = elementStyle.getPropertyValue(elementStyle[prop]) || elementStyle[prop];
        
        return val === '' ? undefined : val;
    }
}
		/**
 * Remove inline css style
 * 
 * @access {public}
 * @param  {DOMElement}   el   Target element
 * @param  {string} prop CSS property to removes
 */
remove_style(el, prop)
{
    if (typeof prop === 'undefined')
    {
        DOMElement.removeAttribute('style');

        return;
    }

    this.css(el, prop);
}
		/**
 * Get the element's computed style on a property
 *
 * @access {public}
 * @param  {DOMElement}   el   Target element
 * @param  {string} prop CSS property to check (in camelCase) (optional)
 * @return {mixed}
 */
rendered_style(DOMElement, property)
{
    if (property.includes('ransform'))
    {
        return this.css_transform_props(DOMElement, true);
    }

    return this.__computed_style(DOMElement, property);
}

/**
 * Get the elements computed style.
 *
 * @access {private}
 * @param  {DOMElement}          el   Target element
 * @param  {string}        prop CSS property to check (in camelCase) (optional)
 * @return {string|object}
 */
__computed_style(DOMElement, property)
{
    if (window.getComputedStyle)
    {
        let styles = window.getComputedStyle(DOMElement, null);

        return !property ? styles : styles[property];
    }
    else if (DOMElement.currentStyle)
    {
        let styles = DOMElement.currentStyle;

        return !property ? styles : styles[property];
    }

    return '';
}

















		/**
 * Returns an object of CSS transitions by transition property as keys.
 *
 * @param  {node|string} DOMElement  Target element or transition value string
 * @return {object}
 */
css_transition_props(DOMElement)
{
    if (!DOMElement) return {};
    var transitions   = {};
    var transitionVal = this.is_string(DOMElement) ? DOMElement : this.rendered_style(DOMElement, 'transition');

    // No transition
    if (!transitionVal || transitionVal.startsWith('all 0s ease 0s') || transitionVal === 'none' || transitionVal === 'unset' || transitionVal === 'auto')
    {
        return transitions;
    }

    let transitionSplit = transitionVal.includes('cubic-bezier') ? '' : transitionVal.trim().split(',');

    if (transitionVal.includes('cubic-bezier'))
    {
        let map      = [];
        let inBezier = false;
        let block    = '';
        let char;

        this.for(transitionVal.length, function(i)
        {
            char = transitionVal[i];

            if (char === '(') inBezier = true;
            if (char === ')') inBezier = false;

            if (char === ',' && !inBezier)
            {
                map.push(block.trim());
                block = '';

                // next
                return;
            }

            block += char;

            if (i === transitionVal.length -1) map.push(block.trim());
        });

        transitionSplit = map;
    }

    this.each(transitionSplit, function(i, transition)
    {
        transition = transition.trim();

        // Variants of all
        if (transition[0] === '.' || transition.startsWith('all ') ||  this.is_numeric(transition[0]))
        {
            transitions.all = transition.replace('all ', '');

            return false;
        }

        var prop = transition.split(' ', 4).shift();

        transitions[prop] = transition.replace(prop, '').trim();

    }, this);

    return transitions;
}
		/**
 * Returns an object of CSS transforms by property as keys or transforms as string.
 *
 * @param  {node|string} DOMElement     Target element or transition value string
 * @param  {bool}        returnAsString Returns transforms as string (optional) (default true)
 * @return {object}
 */
css_transform_props(DOMElement, returnAsString)
{
    if (this.is_string(DOMElement))
    {
        return this.__un_css_matrix(DOMElement, returnAsString);
    }

    returnAsString = this.is_undefined(returnAsString) ? true : returnAsString;

    let styles = this.__computed_style(DOMElement, 'transform');

    // If element is set to "display:none" only inline transforms will show up
    // so we check those first
    let inline   = this.inline_style(DOMElement, 'transform');
    let emptys   = [undefined, '', 'none', 'unset', 'initial', 'inherit'];

    // Has inline styles - inline do not need to converted
    if (!this.in_array(inline, emptys))
    {
        return inline;
    }

    // If element is hiddien we need to display it quickly
    // to get the CSS defined transform prop to be renderd
    let inlineDisplay = this.inline_style(DOMElement, 'display');
    let cssDisplay    = this.rendered_style(DOMElement, 'display');
    let isHidden      = cssDisplay === 'none';

    // Re-get transform value
    if (isHidden)
    {
        this.css(DOMElement, 'display', 'unset');

        styles = this.__computed_style(DOMElement, 'transform');
    }

    // Doesn't have stylesheet styles
    if (this.in_array(styles, emptys))
    {
        styles = styles === 'none' || styles === undefined ? '' : styles;
    }

    // Empty return
    if (!styles)
    {
        return returnAsString ? '' : {};
    }

    // revert matrix
    styles = this.__un_css_matrix(DOMElement, returnAsString);
    
    // Revert back origional styles
    if (isHidden)
    {
        this.css(DOMElement, 'display', !inlineDisplay ? false : inlineDisplay);
    }

    return returnAsString ? styles : styles;
}

/**
 * Converts an element's matrix transform value back to component transforms
 *
 * @access {private}
 * @param  {DOMElement}   DOMElement     Target element
 * @param  {bool}   returnAsString Returns string
 * @return {string|object}
 */
__un_css_matrix(DOMElement, returnAsString)
{
    if (!this.is_string(DOMElement))
    {
        if (!DOMElement.computedStyleMap)
        {
            return returnAsString ? '' : {};
        }

        var computedTransforms = DOMElement.computedStyleMap().get('transform');

        var transforms = Array.prototype.slice.call(computedTransforms).map( (x) => x.toString() ).sort().reverse();
    }
    else
    {
        var transforms = DOMElement.split(')');
    }

    const axisMap = ['X', 'Y', 'Z'];

    const ret = {};

    this.each(transforms, function(i, transform)
    {
        if (transform.trim() === '') return;

        var split    = transform.split('(');
        var bsName   = split[0].replace('3d', '');
        var prop     = split.shift().trim();
        var value    = split.pop().trim().replace(')', '');
        var values   = value.split(',').map((x) => x.trim());
        var lastChar = prop.slice(-1);

        if (prop === 'perspective')
        {
            ret.perspective = value;

            return;
        }
        
        this.each(values, function(i, val)
        {
            if (i > 2) return false;

            let defltVal = prop.includes('scale') ? 1 : 0;
            let axisProp = !axisMap.includes(lastChar) ? `${bsName}${axisMap[i]}` : bsName;

            if (prop === 'rotate')
            {
                ret.rotateZ = val;
            }
            else if (prop === 'rotate3d')
            {
                if (parseFloat(val) !== defltVal)
                {
                    ret[axisProp] = values[values.length - 1];
                }
            }
            else if (parseFloat(val) === defltVal && ret[axisProp])
            {
                return;
            }
            else
            {
                ret[axisProp] = val;
            }
        });

    }, this);


    if (returnAsString)
    {
        return !this.is_empty(ret) ? this.join_obj(ret, '(', ') ') + ')' : '';
    }
    
    return ret;
}
		/**
 * Returns an object of CSS transitions by transition property as keys.
 *
 * @param  {string} transforms A CSS transform value e.g translateY(300px) 
 * @return {object}
 */
css_to_3d_transform(transformsStr)
{        
    var transforms = {};

    var _this = this;

    /**
     * Get value number
     * 
     * @private
     */
    var getPropValue = function(value)
    {
        if (_this.is_numeric(value))
        {
            return parseFloat(value);
        }

        if (_this.is_empty(value))
        {
            return 0;
        }

        return parseFloat(value.replaceAll(/[^0-9-.]/g, ''));
    }

    if (transformsStr.includes('matrix'))
    {
        return transformsStr;
    }

    // Split into object
    this.each(transformsStr.trim().split(')'), function(i, transform)
    {
        transform = transform.trim();

        if (transform === '') return;

        transform      = transform.split('(');
        var prop       = transform.shift().trim();
        var value      = transform.pop().trim();
        var values     = value.split(',').map((x) => x.trim());
        var valueCount = CSS_TRANSFORM_VALUES_COUNT[prop];

        if (prop === 'perspective')
        {
            transforms.perspective = values[0];
        }
        else if (valueCount === 1 || valueCount === 2)
        {
            var initialVal = prop === 'scale' ? 1 : 0;
            var name3d     = valueCount === 1 ? `${prop.slice(0,-1)}3d` : `${prop}3d`;
                name3d     = name3d.includes('skew') ? 'skew' : name3d;
                name3d     = name3d === 'rotat3d' ? 'rotate3d' : name3d;
            var key        = CSS_3D_TRANSFORM_MAP_KEYS[prop.slice(-1).toLowerCase()];
            
            if (this.is_empty(transforms[name3d]))
            {
                transforms[name3d] = CSS_3D_TRANSFORM_DEFAULTS[name3d];
            }
            
            if (prop === 'rotate')
            {
                transforms.rotate3d[3] = values[0];
            }
            else
            {
                this.each(values, function(i, value)
                {
                    var compValue = parseFloat(value.replaceAll(/[^0-9]-/g, ''));

                    if (getPropValue(value) !== initialVal)
                    {
                        transforms[name3d][!key ? i : key] = value;
                    }
                });
            }
        }
        else 
        {
            transforms[prop] = values;
        }

    }, this);

    return transforms;
}
		/**
 * Add a css class or list of classes
 *
 * @access {public}
 * @param  {DOMElement}         DOMElement Target element
 * @param  {array|string} className  Class name(s) to add
 */
add_class(DOMElement, className)
{
    if (this.is_array(DOMElement))
    {
        this.each(DOMElement, function(i, _DOMElement)
        {
            this.add_class(_DOMElement, className);

        }, this);

        return this;
    }

    if (!this.in_dom(DOMElement))
    {
        return;
    }

    if (this.is_array(className))
    {
        this.each(className, function(i, _className)
        {
            DOMElement.classList.add(_className);

        });

        return;
    }

    DOMElement.classList.add(className);
}
		/**
 * Closest parent node by type/class or array of either
 *
 * @access {public}
 * @param  {DOMElement}   el   Target element
 * @param  {string} type Node type to find
 * @return {node\null}
 */
closest(el, type)
{
    // Type is class
    if (this.is_array(type))
    {
        for (var i = 0; i < type.length; i++)
        {
            var response = this.closest(el, type[i]);

            if (response)
            {
                return response;
            }
        }

        return null;
    }

    if (type[0] === '.')
    {
        return this.closest_class(el, type);
    }

    type = type.toLowerCase();

    if (typeof el === 'undefined')
    {
        return null;
    }

    if (el.nodeName.toLowerCase() === type)
    {
        return el;
    }

    if (el.parentNode && el.parentNode.nodeName.toLowerCase() === type)
    {
        return el.parentNode;
    }

    var parent = el.parentNode;

    while (parent !== document.body && typeof parent !== "undefined" && parent !== null)
    {
        parent = parent.parentNode;

        if (parent && parent.nodeName.toLowerCase() === type)
        {
            return parent;
        }
    }


    return null;
}

		/**
 * Closest parent node by class
 *
 * @access {public}
 * @param  {DOMElement}   el   Target element
 * @param  {string} clas Node class to find
 * @return {node\null}
 */
closest_class(el, clas)
{    
    // Type is class
    if (this.is_array(clas))
    {
        for (var i = 0; i < clas.length; i++)
        {
            var response = this.closest_class(el, clas[i]);

            if (response)
            {
                return response;
            }
        }

        return null;
    }

    if (this.has_class(el, clas))
    {
        return el;
    }

    if (this.has_class(el.parentNode, clas))
    {
        return el.parentNode;
    }

    var parent = el.parentNode;

    if (parent === window.document)
    {
        return null;
    }

    while (parent !== document.body)
    {
        if (this.has_class(parent, clas))
        {
            return parent;
        }

        if (parent === null || typeof parent === 'undefined')
        {
            return null;
        }

        parent = parent.parentNode;
    }

    return null;
}
		/**
 * Get an element's absolute coordinates
 *
 * @access {public}
 * @param  {DOMElement}   el Target element
 * @return {object}
 */
coordinates(DOMElement)
{
    // If element is hiddien we need to display it quickly
    var inlineDisplay = this.inline_style(DOMElement, 'display');
    var hidden        = this.rendered_style(DOMElement, 'display');
    
    if (hidden === 'none')
    {
        // If the element was "display:none" with an inline
        // style, remove the inline display so it defaults to
        // whatever styles are set on in through stylesheet
        if (inlineDisplay)
        {
            this.css(DOMElement, 'display', false);
        }
        // Otherwise set it to unset
        else
        {
            this.css(DOMElement, 'display', 'unset');
        }
    }

    var box        = DOMElement.getBoundingClientRect();
    var body       = document.body;
    var docEl      = document.documentElement;
    var scrollTop  = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;
    var clientTop  = docEl.clientTop || body.clientTop || 0;
    var clientLeft = docEl.clientLeft || body.clientLeft || 0;
    var borderL    = parseInt(this.rendered_style(DOMElement, 'border-top-width'));
    var borderR    = parseInt(this.rendered_style(DOMElement, 'border-top-width'));
    var borderT    = parseInt(this.rendered_style(DOMElement, 'border-top-width'));
    var borderB    = parseInt(this.rendered_style(DOMElement, 'border-top-width'));
    var top        = box.top + scrollTop - clientTop - borderT - borderB;
    var left       = box.left + scrollLeft - clientLeft + borderL - borderR;
    var width      = parseFloat(this.rendered_style(DOMElement, "width"));
    var height     = parseFloat(this.rendered_style(DOMElement, "height"));

    if (inlineDisplay)
    {
        this.css(DOMElement, 'display', inlineDisplay);
    }
    else
    {
        this.css(DOMElement, 'display', false);
    }
    

    return {
        top: top,
        left: left,
        right: left + width,
        bottom: top + height,
        height: height,
        width: width,
    };
}
		/**
 * Get all first level children
 *
 * @access {public}
 * @param  {DOMElement}   el   Target element
 * @return {node\null}
 */
first_children(el)
{
    var children = [];

    var childnodes = el.childNodes;

    for (var i = 0; i < childnodes.length; i++)
    {
        if (childnodes[i].nodeType == 1)
        {
            children.push(childnodes[i]);
        }
    }

    return children;
}
		/**
 * Get all input elements from a form
 *
 * @access {public}
 * @param  {DOMElement}   form Target element
 * @return {array}
 */
form_inputs(form)
{
    var allInputs = this.$All('input, textarea, select', form);

    var i = allInputs.length;

    while (i--)
    {
        var input = allInputs[i];

        if (input.type == "radio" && input.checked !== true)
        {
            allInputs.splice(i, 1);
        }
    }

    return allInputs;
}
		/**
 * Get an array of name/value objects for all inputs in a form
 *
 * @access {public}
 * @param  {DOMElement}   form Target element
 * @return {array}
 */
form_values(form)
{
    let inputs = this.form_inputs(form);
    let ret    = {};

    this.each(inputs, function(i, input)
    {
        let name = input.name;

        if (input.type === 'radio' && input.checked == false)
        {

        }
        else if (input.type === 'checkbox')
        {
            ret[name] = (input.checked == true);
        }
        if (name.indexOf('[]') > -1)
        {
            if (!ret[name])
            {
                ret[name] = [];
            }

            ret[name].push(this.input_value(input));
        }
        else
        {
            ret[name] = this.input_value(input);
        }

    }, this);
   
    return ret;
}
		/**
 * Check if a node has a class
 *
 * @access {public}
 * @param  {DOMElement}         el         Target element
 * @param  {string|array} className  Class name(s) to check for
 * @return {bool}
 */
has_class(el, className)
{
    if (!this.in_dom(el))
    {
        return false;
    }

    if (TO_STR.call(className) === '[object Array]')
    {
        for (var i = 0; i < className.length; i++)
        {
            if (el.classList.contains(className[i]))
            {
                return true;
            }
        }

        return false;
    }

    if (!el.classList)
    {
        return false;
    }

    var classNames = className.split('.');

    if ((classNames.length - 1) > 1)
    {
        for (var i = 0; i < classNames.length; i++)
        {
            if (el.classList.contains(classNames[i]))
            {
                return true;
            }
        }
    }

    if (className[0] === '.')
    {
        className = className.substring(1);
    }

    return el.classList.contains(className);
}
		/**
 * Aria hide an element
 *
 * @access {public}
 * @param  {DOMElement}   el Target DOM node
 */
hide_aria(el)
{
    el.setAttribute("aria-hidden", 'true');
}
		/**
 * Check if an element is in current viewport
 *
 * @access {public}
 * @param  {DOMElement}   el Target DOM node
 * @return {bool}
 */
in_viewport(el)
{
    var rect = el.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
    );
}
		/**
 * Replace or append a node's innerHTML
 *
 * @access {public}
 * @param  {DOMElement}   DOMElement  Target element
 * @param  {string} content     Target content
 * @param  {bool}   append      Append innerHTML or replace (optional) (default false)
 */
inner_HTML(DOMElement, content, append)
{
    content = this.is_array(content) ? content.join("\n") : content;

    if (append)
    {
        DOMElement.innerHTML += content;
    }
    else
    {
        DOMElement.innerHTML = content;
    }
}
		/**
 * Replaces element's innerText without destroying childnodes
 *
 * @access {public}
 * @param  {DOMElement}   el   Target element
 * @param  {string} text Text to replace
 */
inner_Text(el, text)
{
    if (el.childNodes[0])
    {
        el.childNodes[0].nodeValue = text;
    }
}
		/**
 * Gets an input element's value
 *
 * @access {public}
 * @param  {DOMElement}   input Target element
 * @return {mixed}
 */
input_value(input)
{
    if (input.type == "checkbox")
    {
        var val = '';

        var checks = this.$All('input[name=' + input.name + ']');

        for (var i = 0, len = checks.length; i < len; i++)
        {
            if (checks[i].checked)
            {
                val += checks[i].value + ', ';
            }
        }

        return this.rtrim(val, ', ');
    }

    if (input.type == "number")
    {
        return parseInt(input.value);
    }

    if (input.type == "select")
    {
        return input.options[input.selectedIndex].value;
    }

    if (input.type == "file")
    {
        if (input.multiple == true)
        {
            return input.files;
        }

        return input.files[0];
    }

    return input.value;
}
		/**
 * Create and insert a new node
 *
 * @access {public}
 * @param  {string} type    New node type
 * @param  {string} classes New node class names (optional) (default '')
 * @param  {string} classes New node ID (optional) (default '')
 * @param  {string} content New node innerHTML (optional) (default '')
 * @param  {DOMElement}   target  Parent to append new node into
 * @return {DOMElement}
 */
new_node(type, classes, ID, content, target)
{
    var node = document.createElement(type);
    classes = (typeof classes === "undefined" ? null : classes);
    ID = (typeof ID === "undefined" ? null : ID);
    content = (typeof content === "undefined" ? null : content);

    if (classes !== null)
    {
        node.className = classes
    }
    if (ID !== null)
    {
        node.id = ID
    }
    if (content !== null)
    {
        node.innerHTML = content
    }

    target.appendChild(node);

    return node;
}
		/**
 * Traverse nextSibling untill type or class or array of either
 *
 * @access {public}
 * @param  {DOMElement}   el   Target element
 * @param  {string} type Target node type
 * @return {node\null}
 */
next(el, type)
{
    // Type is class
    if (this.is_array(type))
    {
        for (var i = 0; i < type.length; i++)
        {
            var response = this.next(el, type[i]);

            if (response)
            {
                return response;
            }
        }

        return null;
    }

    if (type[0] === '.')
    {
        return this.next_untill_class(el, type);
    }

    type = type.toLowerCase();

    if (el.nextSibling && el.nextSibling.nodeName.toLowerCase() === type)
    {
        return el.nextSibling;
    }
    var next = el.nextSibling;

    while (next !== document.body && typeof next !== "undefined" && next !== null)
    {
        next = next.nextSibling;

        if (next && next.nodeName.toLowerCase() === type)
        {
            return next;
        }
    }

    return null;
}
		/**
 * Traverse nextSibling untill class type or class or array of either
 *
 * @access {public}
 * @param  {DOMElement}   el        Target element
 * @param  {string} className Target node classname
 * @return {node\null}
 */
next_untill_class(el, className)
{
    if (className[0] === '.')
    {
        className = className.substring(1);
    }

    if (el.nextSibling && this.has_class(el.nextSibling, className))
    {
        return el.nextSibling;
    }

    var next = el.nextSibling;

    while (next !== document.body && typeof next !== "undefined" && next !== null)
    {
        if (next && this.has_class(next, className))
        {
            return next;
        }

        next = next.nextSibling;

    }

    return null;
}
		/**
 * Inserts node as first child
 *
 * @access {public}
 * @param  {DOMElement} node     New node to insert
 * @param  {DOMElement} wrapper  Parent to preappend new node into
 * @return {DOMElement}
 */
preapend(node, wrapper)
{
    wrapper.insertBefore(node, wrapper.firstChild);

    return node;
}
		/**
 * Traverse previousSibling untill type
 *
 * @access {public}
 * @param  {DOMElement}   el   Target element
 * @param  {string} type Target node type
 * @return {node\null}
 */
previous(el, type)
{
    // Type is class
    if (this.is_array(type))
    {
        for (var i = 0; i < type.length; i++)
        {
            var response = this.previous(el, type[i]);

            if (response)
            {
                return response;
            }
        }

        return null;
    }

    if (type[0] === '.')
    {
        return this.previous_untill_class(el, type);
    }


    type = type.toLowerCase();
    if (el.previousSibling && el.previousSibling.nodeName.toLowerCase() === type) return el.previousSibling;
    var prev = el.previousSibling;
    while (prev !== document.body && typeof prev !== "undefined" && prev !== null)
    {
        prev = prev.previousSibling;
        if (prev && prev.nodeName.toLowerCase() === type)
        {
            return prev;
        }
    }
    return null;
}
		/**
 * Traverse previousSibling untill class
 *
 * @access {public}
 * @param  {DOMElement}   el        Target element
 * @param  {string} className Target node classname
 * @return {node\null}
 */
previous_untill_class(el, className)
{
    if (className[0] === '.')
    {
        className = className.substring(1);
    }

    if (el.previousSibling && this.has_class(el.previousSibling, className))
    {
        return el.previousSibling;
    }

    var prev = el.previousSibling;

    while (prev !== document.body && typeof prev !== "undefined" && prev !== null)
    {
        prev = prev.previousSibling;

        if (prev && this.has_class(prev, className))
        {
            return prev;
        }
    }

    return null;
}
		/**
 * Remove a css class or list of classes
 *
 * @access {public}
 * @param  {DOMElement}         DOMElement Target element
 * @param  {array|string} className  Class name(s) to remove
 */
remove_class(DOMElement, className)
{
    if (this.is_array(DOMElement))
    {
        this.each(DOMElement, function(i, _DOMElement)
        {
            this.remove_class(_DOMElement, className);

        }, this);

        return this;
    }

    if (!this.in_dom(DOMElement))
    {
        return this;
    }

    if (this.is_array(className))
    {
        this.each(className, function(i, _className)
        {
            DOMElement.classList.remove(_className);

        });

        return this;
    }

    DOMElement.classList.remove(className);

    return this;
}
		/**
 * Remove an element from the DOM
 *
 * This function also removes all attached event listeners
 * 
 * @access {public}
 * @param  {DOMElement}   el Target element
 */
remove_from_dom(el)
{
    if (this.in_dom(el))
    {
        el.parentNode.removeChild(el);

        var children = this.$All('*', el);

        for (var i = 0, len = children.length; i < len; i++)
        {
            this.removeEventListener(children[i]);
        }

        this.removeEventListener(el);
    }
}
		/**
 * Get the current document scroll position
 *
 * @access {private}
 * @return {obj}
 */
scroll_pos()
{
    var doc  = document.documentElement;
    var top  = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
    var left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
    
    return {
        top: top,
        left: left
    };
}
		/**
 * Select and return all nodes by selector
 *
 * @access {public}
 * @param  {string} selector CSS selector
 * @param  {DOMElement}   context (optional) (default document)
 * @return {DOMElement}
 */
$All(selector, context)
{
    context = (typeof context === 'undefined' ? document : context);
    return TO_ARR.call(context.querySelectorAll(selector));
}

/**
 * Select single node by selector
 *
 * @access {public}
 * @param  {string} selector CSS selector
 * @param  {DOMElement}   context (optional) (default document)
 * @return {DOMElement}
 */
$(selector, context)
{
    context = (typeof context === 'undefined' ? document : context);
    return context.querySelector(selector)
}
		/**
 * Aria show an element
 *
 * @access {public}
 * @param  {DOMElement}   el Target DOM node
 */
show_aria(el)
{
    el.setAttribute("aria-hidden", 'false');
}

		/**
 * Toogle a classname
 *
 * @access {public}
 * @param  {DOMElement}         el         Target element
 * @param  {string}       className  Class name to toggle
 */
toggle_class(el, className)
{
    if (!this.in_dom(el))
    {
        return;
    }

    if (this.has_class(el, className))
    {
        this.remove_class(el, className);
    }
    else
    {
        this.add_class(el, className);
    }
}
		/**
 * Triggers a native event on an element
 *
 * @access {public}
 * @param  {DOMElement}   el   Target element
 * @param  {string} type Valid event name
 */
trigger_event(el, type)
{
    if ('createEvent' in document)
    {
        var evt = document.createEvent("HTMLEvents");

        evt.initEvent(type, false, true);

        el.dispatchEvent(evt);
    }
    else
    {
        el.fireEvent(type);
    }
}
		/**
 * Get an element's actual width in px
 *
 * @access {public}
 * @param  {DOMElement}   DOMElement Target element
 * @return {object}
 */
width(DOMElement)
{
	if (DOMElement === window || DOMElement === document || DOMElement === document.documentElement ) return Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);

    return this.css_unit_value(this.rendered_style(DOMElement, 'width'));
}
		/**
 * Get an element's actual height in px
 *
 * @access {public}
 * @param  {DOMElement}   DOMElement Target element
 * @return {object}
 */
height(DOMElement)
{
    if (DOMElement === window || DOMElement === document || DOMElement === document.documentElement) return Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

    return this.css_unit_value(this.rendered_style(DOMElement, 'height'));
}
		/**
 * Add an event listener
 *
 * @access {public}
 * @param  {DOMElement}    element    The target DOM node
 * @param  {string}  eventName  Event type
 * @param  {closure} handler    Callback event
 * @param  {bool}    useCapture Use capture (optional) (defaul false)
 */
addEventListener(element, eventName, handler, useCapture)
{
    // Boolean use capture defaults to false
    useCapture = typeof useCapture === 'undefined' ? false : Boolean(useCapture);

    // Class event storage
    var events = this._events;

    // Make sure events are set
    if (!events)
    {
        this._events = events = {};
    }

    // Make sure an array for the event type exists
    if (!events[eventName])
    {
        events[eventName] = [];
    }

    // Arrays
    if (this.is_array(element))
    {
        for (var i = 0; i < element.length; i++)
        {
            this.addEventListener(element[i], eventName, handler, useCapture);
        }
    }
    else
    {
        // Push the details to the events object
        events[eventName].push(
        {
            element: element,
            handler: handler,
            useCapture: useCapture,
        });

        this.__addListener(element, eventName, handler, useCapture);
    }
}

/**
 * Adds a listener to the element
 *
 * @access {private}
 * @param  {DOMElement}    element    The target DOM node
 * @param  {string}  eventName  Event type
 * @param  {closure} handler    Callback event
 * @param  {bool}    useCapture Use capture (optional) (defaul false)
 */
__addListener(el, eventName, handler, useCapture)
{
    if (el.addEventListener)
    {
        el.addEventListener(eventName, handler, useCapture);
    }
    else
    {
        el.attachEvent('on' + eventName, handler, useCapture);
    }
}
		/**
 * Removes all event listeners registered by the library
 *
 * @access {public}
 */
clearEventListeners()
{
    var events = this._events;

    for (var eventName in events)
    {
        var eventObj = events[eventName];
        var i = eventObj.length;
        while (i--)
        {
            this.__removeListener(eventObj[i]['element'], eventName, eventObj[i]['handler'], eventObj[i]['useCapture']);
            this._events[eventName].splice(i, 1);
        }
    }
}
		/**
 * Removes all event listeners registered by the library on nodes
 * that are no longer part of the DOM tree
 *
 * @access {public}
 */
collectGarbage()
{
    var events = this._events;
    for (var eventName in events)
    {
        var eventObj = events[eventName];
        var i = eventObj.length;
        while (i--)
        {
            var el = eventObj[i]['element'];
            if (el == window || el == document || el == document.body) continue;
            if (!this.in_dom(el))
            {
                this.__removeListener(eventObj[i]['element'], eventName, eventObj[i]['handler'], eventObj[i]['useCapture']);
                this._events[eventName].splice(i, 1);
            }
        }
    }
}
		/**
 * Removes event listeners on a DOM node
 *
 * If no element given, all attached event listeners are returned.
 * If no event name is given, all attached event listeners are returned on provided element.
 * If single arguement is provided and arg is a string, e.g 'click', all events of that type are returned
 * 
 * @access {public}
 * @param  {mixed}   element    The target DOM node
 * @param  {string}  eventName  Event type
 * @return {array}
 */
eventListeners(DOMElement, eventName)
{
    var args = TO_ARR.call(arguments);
    var events = this._events;

    // No args, return all events
    if (args.length === 0)
    {
        return events;
    }
    // eventListeners(node) or
    // eventListeners('click')
    else if (args.length === 1)
    {
        // eventListeners('click')
        if (this.is_string(DOMElement))
        {   
            return events[DOMElement] || [];
        }
        
        var ret = [];

        // eventListeners(node)
        for (var evt in events)
        {
            var eventArr = events[evt];

            for (var i = 0; i < eventArr.length; i++)
            {
                var eventObj = eventArr[i];

                if (eventObj.element === DOMElement)
                {
                    ret.push(eventObj);
                }
            }
        }

        return ret;
    }
    // eventListeners(node, 'click')
    var ret = [];

    if (events[eventName])
    {
        var _evts = events[eventName];

        for (var i = 0; i < _evts.length; i++)
        {
            var eventObj = _evts[i];

            if (eventObj.element === DOMElement)
            {
                ret.push(eventObj);
            }
        }
    }

    return ret;
}
		/**
 * Removes event listeners on a DOM node
 *
 * If no event name is given, all attached event listeners are removed.
 * If no callback is given, all callbacks for the event type will be removed.
 * This function can still remove "annonymous" functions that are given a name as they are declared.
 * 
 * @access {public}
 * @param  {DOMElement}    element    The target DOM node
 * @param  {string}  eventName  Event type
 * @param  {closure} handler    Callback event
 * @param  {bool}    useCapture Use capture (optional) (defaul false)
 */
removeEventListener(element, eventName, handler, useCapture)
{
    if (this.is_array(element))
    {
        for (var j = 0; j < element.length; j++)
        {
            this.removeEventListener(element[j], eventName, handler, useCapture);
        }
    }
    else
    {
        // If the eventName name was not provided - remove all event handlers on element
        if (!eventName)
        {
            return this.__removeElementListeners(element);
        }

        // If the callback was not provided - remove all events of the type on the element
        if (!handler)
        {
            return this.__removeElementTypeListeners(element, eventName);
        }

        // Default use capture
        useCapture = typeof useCapture === 'undefined' ? false : Boolean(useCapture);

        var eventObj = this._events[eventName];

        if (typeof eventObj === 'undefined')
        {
            return;
        }

        // Loop stored events and match node, event name, handler, use capture
        for (var i = 0, len = eventObj.length; i < len; i++)
        {
            if (eventObj[i]['handler'] === handler && eventObj[i]['useCapture'] === useCapture && eventObj[i]['element'] === element)
            {
                this.__removeListener(element, eventName, handler, useCapture);
                this._events[eventName].splice(i, 1);
                break;
            }
        }
    }
}


/**
 * Removes all registered event listners on an element
 *
 * @access {private}
 * @param  {DOMElement}    element Target node element
 */
__removeElementListeners(element)
{
    var events = this._events;
    for (var eventName in events)
    {
        var eventObj = events[eventName];
        var i = eventObj.length;
        while (i--)
        {
            if (eventObj[i]['element'] === element)
            {
                this.__removeListener(eventObj[i]['element'], eventName, eventObj[i]['handler'], eventObj[i]['useCapture']);
                this._events[eventName].splice(i, 1);
            }
        }
    }
}

/**
 * Removes all registered event listners of a specific type on an element
 *
 * @access {private}
 * @param  {DOMElement}    element Target node element
 * @param  {string}  type    Event listener type
 */
__removeElementTypeListeners(element, type)
{
    var eventObj = this._events[type];
    var i = eventObj.length;
    while (i--)
    {
        if (eventObj[i]['element'] === element)
        {
            this.__removeListener(eventObj[i]['element'], type, eventObj[i]['handler'], eventObj[i]['useCapture']);

            this._events[type].splice(i, 1);
        }
    }
}



/**
 * Removes a listener from the element
 *
 * @access {private}
 * @param  {DOMElement}    element    The target DOM node
 * @param  {string}  eventName  Event type
 * @param  {closure} handler    Callback event
 * @param  {bool}    useCapture Use capture (optional) (defaul false)
 */
__removeListener(el, eventName, handler, useCapture)
{
    if (el.removeEventListener)
    {
        el.removeEventListener(eventName, handler, useCapture);
    }
    else
    {
        el.detachEvent('on' + eventName, handler, useCapture);
    }
}

		/**
 * Is this a mobile user agent?
 *
 * @return {bool}
 */
is_retina()
{
    var mediaQuery = "(-webkit-min-device-pixel-ratio: 1.5),\
                      (min--moz-device-pixel-ratio: 1.5),\
                      (-o-min-device-pixel-ratio: 3/2),\
                      (min-resolution: 1.5dppx)";

    if (window.devicePixelRatio > 1)
    {
        return true;
    }

    if (window.matchMedia && window.matchMedia(mediaQuery).matches)
    {
        return true;
    }

    return false;
}

		/**
 * Parse url
 *
 * @param  {string}    str       The URL to parse. Invalid characters are replaced by _.
 * @return {object}
 */
parse_url(str)
{
    var ret = {};
    var url = new URL(str);

    if (url.search)
    {
        var queries = url.search.substring(1).split('&');
        var qret    = {};
        this.foreach(queries, function(i, query)
        {
            if (query.includes('='))
            {
                var set   = query.split('=');
                var key   = decodeURI(set[0].trim());
                var val   = true;

                if (set.length === 2)
                {
                    val = set[1].trim();
                }

                if (key !== '' && val !== '')
                {
                    qret[key] = val;
                }
            }
            else
            {
                qret[query] = true;
            }
        });

        url.query = qret;
    }

    return url;
}
		/**
 * Gets url query
 *
 * @access {public}
 * @param  {string}  name String query to get (optional)
 * @return {object|string}
 */
url_query(name)
{
    var results = {};

    if (window.location.search !== '')
    {
        var params = window.location.search.substring(1).split('&');

        for (var i = 0; i < params.length; i++)
        {
            if (!params[i].includes('='))
            {
                continue;
            }

            var split = params[i].split('=');

            results[decodeURIComponent(split[0])] = decodeURIComponent(split[1]);
        }
    }

    // No param return all url query
    if (typeof name === 'undefined')
    {
        return results;
    }

    name = decodeURIComponent(name);

    if (name in results)
    {
        return results[name];
    }

    return false;
}
		/**
 * Clones any variables
 * 
 * @param   {mixed}  mixed_var
 * @param   {mixed}  context   Context to bind functions
 * @returns {mixed}
 */
clone_deep(mixed_var, context)
{
    let ret = this.__cloneVar(mixed_var, context, false);

    CURR_CLONES = new WeakMap();

    return ret;
}

/**
 * Clone's variable with context.
 * 
 * @param   {mixed}  mixed_var  Variable to clone
 * @param   {mixed}  context    Context when cloning recursive objects and arrays.
 * @returns {mixed}
 */
__cloneVar(mixed_var, context, isDeep)
{
    isDeep = this.is_undefined(isDeep) ? true : isDeep;

    let tag = this.var_type(mixed_var);

    switch (tag)
    {
        case OBJECT_TAG:
            return this.__cloneObj(mixed_var, context, isDeep);

        case ARRAY_TAG:
        case NODELST_TAG:
        case ARGS_TAG:
            return this.__cloneArray(mixed_var, context, isDeep);

        case FUNC_TAG:
            return this.__cloneFunc(mixed_var, context);

        case NULL_TAG:
            return null;

        case UNDEF_TAG:
            return;

        case BOOL_TAG:
            return mixed_var === true ? true : false;

        case STRING_TAG:
            return mixed_var.slice();

        case NUMBER_TAG:
            let n = mixed_var;
            return n;

        case REGEXP_TAG:
            return this.__cloneRegExp(mixed_var, context);

        case SYMBOL_TAG:
            return this.__cloneSymbol(mixed_var);

        case DATE_TAG:
            return this.__cloneDate(mixed_var);

        case SET_TAG:
            return this.__cloneSet(mixed_var, context);

        case MAP_TAG:
            return this.__cloneMap(mixed_var, context);

        case ARRAY_BUFFER_TAG:
            return this.__cloneArrayBuffer(mixed_var);

        case DATAVIEW_TAG:
            return this.__cloneDataView(mixed_var);

        case ARRAY_BUFFER_TAG:
            return this.__cloneBuffer(mixed_var);

        case FLOAT32_TAG:
        case FLOAT64_TAG:
        case INT8_TAG:
        case INT16_TAG:
        case INT32_TAG:
        case UINT8_TAG:
        case UINT8CLAMPED_TAG:
        case UINT16_TAG:
        case UINT32_TAG:
            return this.__cloneTypedArray(object);

        case ERROR_TAG:
        case WEAKMAP_TAG:
            return {};
    }

    return mixed_var;
}

/**
 * Clones an object
 * 
 * @param   {object}  obj
 * @returns {object}
 */
__cloneObj(obj, context, isDeep)
{
    // Handle date objects
    if (obj instanceof Date)
    {
        let r = new Date();

        r.setTime(obj.getTime());

        return r;
    }

    // Loop keys and functions
    let keys = this.object_props(obj);
    let ret = {};

    if (keys.length === 0)
    {
        return ret;
    }

    if (CURR_CLONES.has(obj))
    {
        return CURR_CLONES.get(obj);
    }

    CURR_CLONES.set(obj, ret);

    this.each(keys, function(i, key)
    {
        ret[key] = this.__cloneVar(obj[key], typeof context === 'undefined' ? ret : context);

    }, this);

    return ret;
}

/**
 * Clones a function
 * 
 * @param   {function}  function
 * @param   {mixed}     context   Context to bind function
 * @returns {function}
 */
__cloneFunc(func, context)
{
    return this.__bind(func, context);
}

/**
 * Clones an array
 * 
 * @param   {array}  arr
 * @returns {array}
 */
__cloneArray(arr, context)
{
    let ret = [];

    let cacheKey = { array: arr };

    if (CURR_CLONES.has(cacheKey))
    {
        return CURR_CLONES.get(cacheKey);
    }

    CURR_CLONES.set(cacheKey, ret);

    this.each(arr, function(i, val)
    {
        ret[i] = this.__cloneVar(val, context);
    
    }, this);

    return ret;
}

__cloneDate(d)
{
    let r = new Date();

    r.setTime(d.getTime());

    return r;
}

__cloneSymbol(symbol)
{
    return Object(Symbol.prototype.valueOf.call(symbol));
}

__cloneRegExp(regexp)
{
    let reFlags = /\w*$/;

    let result = new regexp.constructor(regexp.source, reFlags.exec(regexp));

    result.lastIndex = regexp.lastIndex;

    return result;
}

__cloneMap(m, context)
{
    const ret = new Map();

    m.this.each((v, k) =>
    {
        ret.set(k, this.__cloneVar(v, context));
    
    }, this);

    return ret;
}

__cloneSet(s, context)
{
    const ret = new Set();

    s.this.each((val, k) =>
    {
        ret.add(k, this.__cloneVar(v, context));
    
    }, this);

    return ret;
}

__cloneArrayBuffer(arrayBuffer)
{
    const result = new arrayBuffer.constructor(arrayBuffer.byteLength)

    new Uint8Array(result).set(new Uint8Array(arrayBuffer));

    return result;
}

__cloneDataView(dataView)
{
    const buffer = this.__cloneArrayBuffer(dataView.buffer);

    return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}

/**
 * Creates a clone of `buffer`.
 *
 * @param   {Buffer}   buffer   The buffer to clone.
 * @param   {boolean} [isDeep]  Specify a deep clone.
 * @returns {Buffer}   Returns  the cloned buffer.
 */
__cloneBuffer(buffer)
{
    const length = buffer.length;

    const result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

    buffer.copy(result);

    return result;
}

/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */
__cloneTypedArray(typedArray)
{
    const buffer = this.__cloneArrayBuffer(typedArray.buffer);

    return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

		/**
 * Creates a new object in 'dot.notation'
 * 
 * @param   {Object} obj Object
 * @returns {Object} 
 */
dotify(obj)
{
    var res = {};

    function recurse(obj, current)
    {
        for (var key in obj)
        {
            var value = obj[key];
            var newKey = (current ? current + '.' + key : key); // joined key with dot

            if (value && typeof value === 'object' && !(value instanceof Date))
            {
                recurse(value, newKey); // it's a nested object, so do it again
            }
            else
            {
                res[newKey] = value; // it's not an object, so set the property
            }
        }
    }

    recurse(obj);

    return res;
}
		/**
 * Extends a function with prototype inheritance.
 *
 * @param   {function}           baseFunc    Base function to extend
 * @param   {function}           extendFunc  Function to get extended.
 * @param   {undefined|boolean}  callSuper   If true "extendFunc" is treated as a constructor and the BaseFunc / any nested prototypes will get instantiated. (default true)
 * @returns {function}
 */
extend(baseFunc, extendFunc, callSuper)
{
    callSuper = this.is_undefined(callSuper) ? true : callSuper;

    const oldConstructor = extendFunc.prototype.constructor;
    const constructors = [...this.__protoConstructors(baseFunc), oldConstructor];
    const newProto = function() {};
    const oldProto = extendFunc.prototype;
    const fncName = extendFunc.name;

    newProto.prototype = oldProto;

    Object.setPrototypeOf(oldProto, baseFunc.prototype);

    Object.setPrototypeOf(extendFunc, newProto);

    if (callSuper)
    {
        extendFunc = function()
        {
            let args = TO_ARR.call(arguments);

            let _this = this;

            this.each(constructors, function(i, constr)
            {
                if (constr.name !== 'Object')
                {
                    this.__bind(constr, _this).apply(_this, args);
                }
                
            }, this);
        };
    }

    extendFunc.prototype = oldProto;

    this.__applyStatics(constructors, extendFunc);

    extendFunc.prototype.constructor = extendFunc;

    Object.defineProperty(extendFunc, 'name', { value: fncName, writable: false });

    return extendFunc;
}

/**
 * Returns an array of prototype constructors nested inside a function.
 *
 * @private
 * @param   {function}  func  Function to loop
 * @returns {array}
 */
__protoConstructors(func)
{
    let protos = [];
    let proto = func.prototype || Object.getPrototypeOf(func);

    while (proto && proto.constructor)
    {
        // recursive stopper
        if (protos.includes.proto)
        {
            break;
        }

        protos.push(proto.constructor);

        proto = proto.prototype || Object.getPrototypeOf(proto);
    }

    return protos.reverse();
}

/**
 * Apply static properties to extended function.
 *
 * @private
 * @param  {array}     constructors  Array of prototype chain constructors
 * @param  {function}  func          Function to apply props to
 */
__applyStatics(constructors, func)
{
    this.each(constructors, function(i, constructor)
    {
        let props = Object.keys(constructor).filter(key => !PROTO_EXCLUDES.includes(key));

        if (props.length)
        {
            this.each(props, function(i, key)
            {
                let prop = constructor[key];

                if (this.is_function(prop))
                {
                    prop = this.__bind(prop, func);
                }

                func[key] = prop;

            }, this);
        }
    }, this);
}

		/**
 * Joins an object into a string
 * 
 * @param   {Object} obj       Object
 * @param   {string} seperator Seperator Between key & value
 * @param   {string} glue      Glue between value and next key
 * @returns {string} 
 */
join_obj(obj, seperator, glue, recursive, trimLast)
{
    seperator = this.is_undefined(seperator) ? '' : seperator;
    glue      = this.is_undefined(glue) ? '' : glue;
    recursive = this.is_undefined(recursive) ? false : recursive;
    trimLast  = this.is_undefined(trimLast)  ? true : trimLast;
    
    var ret = '';

    this.each(obj, function(key, val)
    {
        if (this.is_object(val))
        {
            val = recursive ? '{' + this.join_obj(val, seperator, glue, recursive, trimLast) + '}' : {};
        }
        else if (this.is_array(val))
        {
            val = recursive ? this.join_obj(val, seperator, glue, recursive, trimLast) : val.join(', ').replaceAll('[object Object]', '{}');
        }
        else
        {            
            val = `${val}`;
        }

        ret += `${glue}${key}${seperator}${val}`;

    }, this);

    if (ret === `${glue}${seperator}` || ret.trim() === '') return '';

    return trimLast ? this.rtrim(this.ltrim(ret, glue), seperator) : this.ltrim(ret, glue).trim() + glue;
}
		/**
 * Deep merge two objects.
 * 
 * @param   {object} target
 * @param   {object} ...sources
 * @returns {object}
 */
merge_deep()
{
    let args = TO_ARR.call(arguments);

    // No args
    if (args.length === 0)
    {
        throw new Error('Nothing to merge.');
    }
    // Single arg
    else if (args.length === 1)
    {
        return args[1];
    }

    // Must be an object
    if (!this.is_object(args[0]))
    {
        throw new Error('Arguments must be an object.');
    }

    // Remove first and cache
    let first = args.shift();

    this.each(args, function(i, arg)
    {
        if (!this.is_object(arg))
        {
            throw new Error('Arguments must be an object.');
        }

        let cloned = this.clone_deep(arg, first);

        this.each(cloned, function(k, v)
        {
            first[k] = v;
        });
        
    }, this);

    return first;
}
		/**
 * Returns an immutable object with set,get,isset,delete methods that accept dot.notation.
 *
 * @returns {object}
 */
obj()
{
    return new __MAP;
}

/**
 * Recursively delete from array/object.
 *
 * @param   {array}        keys    Keys in search order
 * @param   {object|array} object  Object to get from
 * @returns {mixed}
 */
__arrayDeleteRecursive(keys, object)
{
    var key = keys.shift();

    var islast = keys.length === 0;

    if (islast)
    {
        if (TO_STR.call(object) === '[object Array]')
        {
            object.splice(key, 1);
        }
        else
        {
            delete object[key];
        }
    }

    if (!object[key])
    {
        return false;
    }

    return this.__arrayDeleteRecursive(keys, object[key]);
}

/**
 * Recursively search from array/object.
 *
 * @param   {array}        keys    Keys in search order
 * @param   {object|array} object  Object to get from
 * @returns {mixed}
 */
__arrayGetRecursive(keys, object)
{
    var key = keys.shift();
    var islast = keys.length === 0;

    if (islast)
    {
        return object[key];
    }

    if (!object[key])
    {
        return undefined;
    }

    return this.__arrayGetRecursive(keys, object[key]);
}

/**
 * Recursively set array/object.
 *
 * @param {array}          keys     Keys in search order
 * @param {mixed}          value    Value to set
 * @param {object|array}   object   Object to get from
 * @param {string|number}  nextKey  Next key to set
 */
__arraySetRecursive(keys, value, object, nextKey)
{
    var key = keys.shift();
    var islast = keys.length === 0;
    var lastObj = object;
    object = !nextKey ? object : object[nextKey];

    // Trying to set a value on nested array that doesn't exist
    if (!['object', 'function'].includes(typeof object))
    {
        throw new Error('Invalid dot notation. Cannot set key "' + key + '" on "' + JSON.stringify(lastObj) + '[' + nextKey + ']"');
    }

    if (!object[key])
    {
        // Trying to put object key into an array
        if (TO_STR.call(object) === '[object Array]' && typeof key === 'string')
        {
            var converted = Object.assign({}, object);

            lastObj[nextKey] = converted;

            object = converted;
        }

        if (keys[0] && typeof keys[0] === 'string')
        {
            object[key] = {};
        }
        else
        {
            object[key] = [];
        }
    }

    if (islast)
    {
        object[key] = value;

        return;
    }

    this.__arraySetRecursive(keys, value, object, key);
}

/**
 * Segments an array/object path using from "dot.notation" into an array of keys in order.
 *
 * @param   {string}  path Path to parse
 * @returns {array}
 */
__arrayKeySegment(path)
{
    var result = [];
    var segments = path.split('.');

    for (var i = 0; i < segments.length; i++)
    {
        var segment = segments[i];

        if (!segment.includes('['))
        {
            result.push(segment);

            continue;
        }

        var subSegments = segment.split('[');

        for (var j = 0; j < subSegments.length; j++)
        {
            if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(subSegments[j][0]))
            {
                result.push(parseInt(subSegments[j].replace(']')));
            }
            else if (subSegments[j] !== '')
            {
                result.push(subSegments[j])
            }
        }
    }

    return result;
}

/**
 * Recursively delete from array/object.
 *
 * @param   {array}        keys    Keys in search order
 * @param   {object|array} object  Object to get from
 * @returns {mixed}
 */
__arrayDeleteRecursive(keys, object)
{
    var key = keys.shift();

    var islast = keys.length === 0;

    if (islast)
    {
        if (TO_STR.call(object) === '[object Array]')
        {
            object.splice(key, 1);
        }
        else
        {
            delete object[key];
        }
    }

    if (!object[key])
    {
        return false;
    }

    return this.__arrayDeleteRecursive(keys, object[key]);
}
		/**
 * Clone an object
 * 
 * @access {public}
 * @param  {object}  src       The object to clone
 * @return {object}
 */
obj_clone(src)
{
    var clone = {};

    for (var prop in src)
    {
        if (src.hasOwnProperty(prop))
        {
            clone[prop] = src[prop];
        }
    }
    return clone;
}
		/**
 * Returns object properties and methods as array of keys.
 * 
 * @param   {mixed}    mixed_var    Variable to test
 * @param   {boolean}  withMethods  Return methods and props (optional) (default "true")
 * @returns {array}
 */
object_props(mixed_var, withMethods)
{
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

    return this.array_unique(keys.filter(function(key)
    {
        return !PROTO_EXCLUDES.includes(key);
    }));
}
		camel_case_to_hyphen(str)
{
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/\b([A-Z]+)([A-Z])([a-z])/, '$1-$2$3').toLowerCase();
}
		/**
 * Json encode
 * 
 * @param  {mixed} str String JSON
 * @return {object|false}
 */
json_decode(str)
{
    var obj;
    try
    {
        obj = JSON.parse(str);
    }
    catch (e)
    {
        return false;
    }
    return obj;
}
		/**
 * Json encode
 * 
 * @param  {mixed} str String JSON
 * @return {object|false}
 */
json_encode(str)
{
    var obj;
    try
    {
        obj = JSON.stringify(str);
    }
    catch (e)
    {
        return false;
    }
    return obj;
}
		/**
 * Left trim string 
 * 
 * @param  {str}           str
 * @return {array|string} charlist (optional)
 */
ltrim(str, charlist)
{
    // Special fast cases
    if (!charlist) return str.trimStart();

    if (this.is_string(charlist))
    {
        return str.slice(0, charlist.length) === charlist ? str.replace(charlist, '') : str;
    }

    var ret = str;

    this.each(charlist, function(i, char)
    {
        if (str.slice(0, char.length) === char)
        {
            ret = str.replace(char, '');
            
            // break            
            return false;
        }

    }, this);

    return ret;
}


		/**
 * Make a random string
 *
 * @param  {int}    length String length
 * @return {string}
 */
makeid(length)
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    for (var i = 0; i < length; i++)
    {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return text;
}
		/**
 * Left trim string 
 * 
 * @param  {str}           str
 * @return {array|string} charlist (optional)
 */
rtrim(str, charlist)
{
    if (!charlist) return str.trimEnd();

    if (this.is_string(charlist))
    {
        let len = charlist.length; 

        return str.slice(-len) === charlist ? str.slice(0, -len) : str;
    }

    var ret = str;

    this.each(charlist, function(i, chars)
    {
        var len = chars.length;

        if (str.slice(-len) === chars)
        {
            ret = str.slice(0, -len);

            return false;
        }

    }, this);

    return ret;
}
		to_camel_case(str)
{
    str = str.trim();

    // Shouldn't be changed
    if (!str.includes(' ') && !str.includes('-') && /[A-Z]/.test(str))
    {
        return str;
    }

    return str.toLowerCase().replace(/['"]/g, '').replace(/\W+/g, ' ').replace(/ (.)/g, function($1)
    {
        return $1.toUpperCase();
    })
    .replace(/ /g, '');
}
		/**
 * Left and right trim string.
 * 
 * @param  {str}           str
 * @return {array|string} charlist (optional)
 */
trim(str, charlist)
{
    if (!charlist) return str.trim();

    return this.rtrim(this.ltrim(str, charlist), charlist);
}
		/* Capatalize first letter */
uc_first(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}
		/* Capatalize first letter of all words */
ucwords(str)
{
    return (str + '').replace(/^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g, function($1)
    {
        return $1.toUpperCase();
    });
}
		lc_first(string)
{
    return string.charAt(0).toLowerCase() + string.slice(1);
}
		/**
 * Checks if variable should be considered "true" or "false" using "common sense".
 * 
 * @param   {mixed} mixed_var  Variable to test
 * @returns {boolean}
 */
bool(mixed_var)
{
    mixed_var = (typeof mixed_var === 'undefined' ? false : mixed_var);

    if (this.is_bool(mixed_var))
    {
        return mixed_var;
    }

    if (this.is_number(mixed_var))
    {
        return mixed_var > 0;
    }

    if (this.is_array(mixed_var))
    {
        return mixed_var.length > 0;
    }

    if (this.is_object(mixed_var))
    {
        return Object.keys(mixed_var).length > 0;
    }

    if (this.is_string(mixed_var))
    {
        mixed_var = mixed_var.toLowerCase().trim();

        if (mixed_var === 'false')
        {
            return false;
        }
        if (mixed_var === 'true')
        {
            return true;
        }
        if (mixed_var === 'on')
        {
            return true;
        }
        if (mixed_var === 'off')
        {
            return false;
        }
        if (mixed_var === 'undefined')
        {
            return false;
        }
        if (this.is_numeric(mixed_var))
        {
            return Number(mixed_var) > 0;
        }
        if (mixed_var === '')
        {
            return false;
        }
    }

    return false;
}

		/**
 * Returns function / class name
 *
 * @param   {mixed}  mixed_var Variable to evaluate
 * @returns {string}
 */
callable_name(mixed_var)
{
    if (this.is_callable(mixed_var))
    {
        return mixed_var.name;
    }
    else if (this.is_object(mixed_var))
    {
        return mixed_var.constructor.name;
    }
}
		/**
 * Count
 *
 * @access {public}
 * @param  {mixed}  mixed_var Variable to count
 * @return {int}
 */
count(mixed_var)
{
    return this.size(mixed_var);
}
		/**
 * Checks if HtmlElement is in current DOM
 *
 * @param   {HTMLElement}  element  Element to check
 * @returns {boolean}
 */
in_dom(element)
{
    if (!this.is_htmlElement(element))
    {
        return false;
    }

    if (element === document.body || element === document.documentElement)
    {
        return true;
    }

    while (element)
    {
        if (element === document.documentElement)
        {
            return true;
        }

        element = element.parentNode;
    }

    return false;
}
		/**
 * Is args array.
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {boolean}
 */
is_args(mixed_var)
{
    return this.var_type(mixed_var) === ARGS_TAG;
}
		/**
 * Is array.
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {boolean}
 */
is_array(mixed_var, strict)
{
    strict = typeof strict === 'undefined' ? false : strict;

    let type = this.var_type(mixed_var);

    return !strict ? ARRAYISH_TAGS.includes(type) : type === ARRAY_TAG;
}
		/**
 * Is bool.
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {boolean}
 */
is_bool(mixed_var)
{
    return this.var_type(mixed_var) === BOOL_TAG;
}
		/**
 * Is Array buffer.
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {boolean}
 */
is_buffer(mixed_var)
{
    return this.var_type(mixed_var) === ARRAY_BUFFER_TAG;
}
		/**
 * Is variable a function / constructor.
 *
 * @param   {mixed}  mixed_var  Variable to check
 * @returns {boolean}
 */
is_callable(mixed_var)
{
    return this.is_function(mixed_var);
}
		/**
 * Checks if variable is a class declaration or extends a class and/or constructable function.
 *
 * @param   {mixed}                        mixed_var  Variable to evaluate
 * @oaram   {string} | undefined | boolean} classname  Classname or strict if boolean provided
 * @param   {boolean}                      strict     If "true" only returns true on ES6 classes (default "false")
 * @returns {boolean}
 */
is_class(mixed_var, classname, strict)
{
    // this.is_class(foo, true)
    if (classname === true || classname === false)
    {
        strict = classname;
        classname = null;
    }
    // this.is_class(foo, 'Bar') || this.is_class(foo, 'Bar', false)
    else
    {
        strict = typeof strict === 'undefined' ? false : strict;
    }

    if (typeof mixed_var !== 'function' || !this.is_constructable(mixed_var))
    {
        return false;
    }

    let isES6 = /^\s*class\s+\w+/.test(mixed_var.toString());

    if (classname)
    {
        if (!isES6 && strict)
        {
            return false;
        }

        if (mixed_var.name === classname || mixed_var.prototype.constructor.name === classname)
        {
            return true;
        }

        let protos = [];
        let proto = mixed_var.prototype || Object.getPrototypeOf(mixed_var);
        let ret = false;

        while (proto && proto.constructor)
        {
            // recursive stopper
            if (protos.includes.proto)
            {
                break;
            }

            protos.push(proto);

            if (proto.constructor.name === classname)
            {
                ret = true;

                break;
            }

            proto = proto.prototype || Object.getPrototypeOf(proto);
        }

        return ret;
    }

    // ES6 class declaration depending on strict

    return strict ? isES6 : this.is_constructable(mixed_var);
}
		/**
 * Checks if variable is construable.
 *
 * @param   {mixed}  mixed_var  Variable to evaluate
 * @returns {boolean}
 */
is_constructable(mixed_var)
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
    let props = this.object_props(mixed_var.prototype);

    return props.length >= 1;
}
		/**
 * Is dataView obj.
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {boolean}
 */
is_dataview(mixed_var)
{
    return this.var_type(mixed_var) === DATAVIEW_TAG;
}
		/**
 * Is date object.
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {boolean}
 */
is_date(mixed_var)
{
    return this.var_type(mixed_var) === DATE_TAG;
}
		/**
 * Is empty
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {boolean}
 */
is_empty(mixed_var)
{
    if (mixed_var === false || mixed_var === null || (typeof mixed_var === 'undefined'))
    {
        return true;
    }
    else if (this.is_array(mixed_var))
    {
        return mixed_var.length === null || mixed_var.length <= 0;
    }
    else if (this.is_object(mixed_var))
    {
        return Object.keys(mixed_var).length === 0;
    }
    else if (this.is_string(mixed_var))
    {
        return mixed_var.trim() === '';
    }
    else if (this.is_number(mixed_var))
    {
        return isNaN(mixed_var);
    }
    else if (this.is_function(mixed_var))
    {
        return false;
    }

    return false;
}
		/**
 * Deep check for equal
 * 
 * @param   {mixed}  a
 * @param   {mixed}  b
 * @param   {bool}   strict Strict comparison (optional) (default false)
 * @returns {bool}
 * 
 *  * Note that strict set to true would return false in the following:
 *  is_equal ({ foo : 'bar'}, { foo : 'bar'});
 */
is_equal(a, b, strict)
{
    strict = this.is_undefined(strict) ? false : strict;

    if ((typeof a) !== (typeof b))
    {
        return false;
    }
    else if (this.is_string(a) || this.is_number(a) || this.is_bool(a) || this.is_null(a))
    {
        return a === b;
    }
    else if (this.is_function(a))
    {
        return this.___equalFunction(a, b);
    }
    else if (this.is_array(a) || this.is_object(b))
    {
        if (strict)
        {
            if (a !== b || this.is_array(a) && !this.is_array(b))
            {
                return false;
            }
            
            return true;
        }
        
        return this.__equalTraverseable(a, b);
    }

    return true;
}

/**
 * Checks if two functions are equal
 * 
 * @param   {function}  a
 * @param   {function}  b
 * @returns {boolean}
 */
___equalFunction(a, b)
{
    // They're not technically equal
    if (a !== b)
    {
        // Functions have the same name
        if (a.name === b.name)
        {
            // If the functions were bound or cloned by the library they can technically still be equal
            if ( a.name.includes('bound '))
            {
                return a.this.__isBound === b.this.__isBound && a.this.__boundContext === b.this.__boundContext && a.this.__origional === b.this.__origional;
            }

            // Native arrow functions
            if (!a.prototype || !a.prototype.constructor)
            {
                return false;
            }

            // Check the prototypes
            let aProps = object_props(a.prototype);
            let bProps = object_props(b.prototype);

            if (aProps.length === 0 && bProps.length === 0) return true;

            let ret = true;

            this.each(aProps, function(i, key)
            {                
                if (!this.is_equal(a.prototype[key], b.prototype[key]))
                {
                    ret = false;

                    return false;
                }
            }, this);

            return ret;
        }

        return false;
    }

    return true;
}


/**
 * Checks if traversable's are equal
 * 
 * @param   {array} | object}  a
 * @param   {array} | object}  b
 * @returns {boolean}
 */
__equalTraverseable(a, b)
{
    if (this.size(a) !== this.size(b))
    {
        return false;
    }

    let ret = true;

    this.each(a, function(i, val)
    {
        if (!this.is_equal(val, b[i]))
        {
            ret = false;

            return false;
        }
    }, this);

    return ret;
}

		/**
 * Is function.
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {boolean}
 */
is_function(mixed_var)
{
    return this.var_type(mixed_var) === FUNC_TAG;
}
		/**
 * Checks if variable is HTMLElement.
 *
 * @param   {mixed}  mixed_var  Variable to evaluate
 * @returns {boolean}
 */
is_htmlElement(mixed_var)
{
    if (mixed_var && mixed_var.nodeType)
    {
        let type = this.var_type(mixed_var);

        return HTML_REGXP.test(type) || type === '[object HTMLDocument]' || type === '[object Text]';
    }

    return false;
}
		/**
 * Is valid JSON
 * 
 * @param  {mixed} str String JSON
 * @return {object|false}
 */
is_json(str)
{
    var obj;
    try
    {
        obj = JSON.parse(str);
    }
    catch (e)
    {
        return false;
    }
    return obj;
}


		/**
 * Is Map.
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {boolean}
 */
is_map(mixed_var)
{
    return this.var_type(mixed_var) === MAP_TAG;
}
		/**
 * Is node type.
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @param   {string} tag        Tag to compare
 * @returns {boolean}
 */
is_node_type(mixed_var, tag)
{
    return mixed_var.tagName.toUpperCase() === tag.toUpperCase();
}

		/**
 * Is nodelist.
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {boolean}
 */
is_nodelist(mixed_var)
{
    return this.var_type(mixed_var) === NODELST_TAG;
}
		/**
 * Is null.
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {boolean}
 */
is_null(mixed_var)
{
    return this.var_type(mixed_var) === NULL_TAG;
}
		/**
 * Is number.
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {boolean}
 */
is_number(mixed_var)
{
    return !isNaN(mixed_var) && this.var_type(mixed_var) === NUMBER_TAG;
}
		/**
 * Is string.
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {boolean}
 */
is_numeric(mixed_var)
{
    if (this.is_number(mixed_var))
    {
        return true;
    }
    else if (this.is_string(mixed_var))
    {
        return /^-?(0|[1-9]\d*)(\.\d+)?$/.test(mixed_var.trim());
    }

    return false;
}
		/**
 * Checks if variable is an object.
 *
 * @param   {mixed}  mixed_var Variable to evaluate
 * @returns {boolean}
 */
is_object(mixed_var)
{
    return mixed_var !== null && this.var_type(mixed_var) === OBJECT_TAG;
}
		/**
 * Is regexp.
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {boolean}
 */
is_regexp(mixed_var)
{
    return this.var_type(mixed_var) === REGEXP_TAG;
}
		/**
 * Is Set.
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {boolean}
 */
is_set(mixed_var)
{
    return this.var_type(mixed_var) === SET_TAG;
}
		/**
 * Is string.
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {boolean}
 */
is_string(mixed_var)
{
    return this.var_type(mixed_var) === STRING_TAG;
}
		/**
 * Is Symbol.
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {boolean}
 */
is_symbol(mixed_var)
{
    return this.var_type(mixed_var) === SYMBOL_TAG;
}
		/**
 * Is undefined.
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {boolean}
 */
is_undefined(mixed_var)
{
    return this.var_type(mixed_var) === UNDEF_TAG;
}
		/**
 * Returns array/object/string/number size.
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {number}
 */
size(mixed_var)
{
    if (this.is_string(mixed_var) || this.is_array(mixed_var))
    {
        return mixed_var.length;
    }
    else if (this.is_number(mixed_var))
    {
        return mixed_var;
    }
    else if (this.is_bool(mixed_var))
    {
        return mixed_var === true ? 1 : -1;
    }
    else(this.is_object(mixed_var))
    {
        return Object.keys(mixed_var).length;
    }

    return 1;
}

		/**
 * Gets the `toStringTag` of `value`.
 *
 * @public
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var_type(value)
{
    if (value == null)
    {
        return value === undefined ? '[object Undefined]' : '[object Null]'
    }

    return TO_STR.call(value);
}
		 // Destructor
    destruct()
    {
        this.clearEventListeners();
    }
}

Container.singleton('Helper', HelperJS);

console.log(Container.get('Helper'));
})();


// Vendors
(function()
{
    /*
     *  Copyright 2012-2013 (c) Pierre Duquesne <stackp@online.fr>
     *  Licensed under the New BSD License.
     *  https://github.com/stackp/promisejs
     */
    (function(a)
    {
        function b()
        {
            this._callbacks = [];
        }
        b.prototype.then = function(a, c)
        {
            var d;
            if (this._isdone) d = a.apply(c, this.result);
            else
            {
                d = new b();
                this._callbacks.push(function()
                {
                    var b = a.apply(c, arguments);
                    if (b && typeof b.then === 'function') b.then(d.done, d);
                });
            }
            return d;
        };
        b.prototype.done = function()
        {
            this.result = arguments;
            this._isdone = true;
            for (var a = 0; a < this._callbacks.length; a++) this._callbacks[a].apply(null, arguments);
            this._callbacks = [];
        };

        function c(a)
        {
            var c = new b();
            var d = [];
            if (!a || !a.length)
            {
                c.done(d);
                return c;
            }
            var e = 0;
            var f = a.length;

            function g(a)
            {
                return function()
                {
                    e += 1;
                    d[a] = Array.prototype.slice.call(arguments);
                    if (e === f) c.done(d);
                };
            }
            for (var h = 0; h < f; h++) a[h].then(g(h));
            return c;
        }

        function d(a, c)
        {
            var e = new b();
            if (a.length === 0) e.done.apply(e, c);
            else a[0].apply(null, c).then(function()
            {
                a.splice(0, 1);
                d(a, arguments).then(function()
                {
                    e.done.apply(e, arguments);
                });
            });
            return e;
        }

        function e(a)
        {
            var b = "";
            if (typeof a === "string") b = a;
            else
            {
                var c = encodeURIComponent;
                var d = [];
                for (var e in a)
                    if (a.hasOwnProperty(e)) d.push(c(e) + '=' + c(a[e]));
                b = d.join('&');
            }
            return b;
        }

        function f()
        {
            var a;
            if (window.XMLHttpRequest) a = new XMLHttpRequest();
            else if (window.ActiveXObject) try
            {
                a = new ActiveXObject("Msxml2.XMLHTTP");
            }
            catch (b)
            {
                a = new ActiveXObject("Microsoft.XMLHTTP");
            }
            return a;
        }

        function g(a, c, d, g)
        {
            var h = new b();
            var j, k;
            d = d ||
            {};
            g = g ||
            {};
            try
            {
                j = f();
            }
            catch (l)
            {
                h.done(i.ENOXHR, "");
                return h;
            }
            k = e(d);
            if (a === 'GET' && k)
            {
                c += '?' + k;
                k = null;
            }
            j.open(a, c);
            var m = 'application/x-www-form-urlencoded';
            for (var n in g)
                if (g.hasOwnProperty(n))
                    if (n.toLowerCase() === 'content-type') m = g[n];
                    else j.setRequestHeader(n, g[n]);
            j.setRequestHeader('Content-type', m);

            function o()
            {
                j.abort();
                h.done(i.ETIMEOUT, "", j);
            }
            var p = i.ajaxTimeout;
            if (p) var q = setTimeout(o, p);
            j.onreadystatechange = function()
            {
                if (p) clearTimeout(q);
                if (j.readyState === 4)
                {
                    var a = (!j.status || (j.status < 200 || j.status >= 300) && j.status !== 304);
                    h.done(a, j.responseText, j);
                }
            };
            j.send(k);
            return h;
        }

        function h(a)
        {
            return function(b, c, d)
            {
                return g(a, b, c, d);
            };
        }
        var i = {
            Promise: b,
            join: c,
            chain: d,
            ajax: g,
            get: h('GET'),
            post: h('POST'),
            put: h('PUT'),
            del: h('DELETE'),
            ENOXHR: 1,
            ETIMEOUT: 2,
            ajaxTimeout: 0
        };
        if (typeof define === 'function' && define.amd) define(function()
        {
            return i;
        });
        else a.promise = i;
    })(this);

    var _promise = promise;

    window.promise = null;

    Container.set('Promise', function()
    {
        return new _promise.Promise();
    });

}());

/**
 * Smoothscroll
 *
 * This is a utility class used internally to scroll to elements on a page.
 * It can still be invoked directly via the IOC container if you want to use it.
 * @example {Container.get('SmoothScroll').animateScroll('#'} + id, null, options);
 * @see     {https://github.com/cferdinandi/smooth-scroll}
 * @see     {waypoints.js}
 */
(function()
{

    (function(root, factory)
    {
        if (typeof define === 'function' && define.amd)
        {
            define([], factory(root));
        }
        else if (typeof exports === 'object')
        {
            module.exports = factory(root);
        }
        else
        {
            root.smoothScroll = factory(root);
        }
    })(typeof global !== 'undefined' ? global : this.window || this.global, function(root)
    {

        'use strict';

        //
        // Variables
        //

        var smoothScroll = {}; // Object for public APIs
        var supports = 'querySelector' in document && 'addEventListener' in root; // Feature test
        var settings, eventTimeout, fixedHeader, headerHeight, animationInterval;

        // Default settings
        var defaults = {
            selector: '[data-scroll]',
            selectorHeader: '[data-scroll-header]',
            speed: 500,
            easing: 'easeInOutCubic',
            offset: 0,
            updateURL: true,
            callback: function() {}
        };


        //
        // Methods
        //

        /**
         * Merge two or more objects. Returns a new object.
         * @private
         * @param {Boolean}  deep     If true, do a deep (or recursive) merge [optional]
         * @param {Object}   objects  The objects to merge together
         * @returns {Object}          Merged values of defaults and options
         */
        var extend = function()
        {

            // Variables
            var extended = {};
            var deep = false;
            var i = 0;
            var length = arguments.length;

            // Check if a deep merge
            if (Object.prototype.toString.call(arguments[0]) === '[object Boolean]')
            {
                deep = arguments[0];
                i++;
            }

            // Merge the object into the extended object
            var merge = function(obj)
            {
                for (var prop in obj)
                {
                    if (Object.prototype.hasOwnProperty.call(obj, prop))
                    {
                        // If deep merge and property is an object, merge properties
                        if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]')
                        {
                            extended[prop] = extend(true, extended[prop], obj[prop]);
                        }
                        else
                        {
                            extended[prop] = obj[prop];
                        }
                    }
                }
            };

            // Loop through each object and conduct a merge
            for (; i < length; i++)
            {
                var obj = arguments[i];
                merge(obj);
            }

            return extended;

        };

        /**
         * Get the height of an element.
         * @private
         * @param  {DOMElement}   elem The element to get the height of
         * @return {Number}      The element's height in pixels
         */
        var getHeight = function(elem)
        {
            return Math.max(elem.scrollHeight, elem.offsetHeight, elem.clientHeight);
        };

        /**
         * Get the closest matching element up the DOM tree.
         * @private
         * @param  {Element} elem     Starting element
         * @param  {String}  selector Selector to match against (class, ID, data attribute, or tag)
         * @return {Boolean|Element}  Returns null if not match found
         */
        var getClosest = function(elem, selector)
        {

            // Variables
            var firstChar = selector.charAt(0);
            var supports = 'classList' in document.documentElement;
            var attribute, value;

            // If selector is a data attribute, split attribute from value
            if (firstChar === '[')
            {
                selector = selector.substr(1, selector.length - 2);
                attribute = selector.split('=');

                if (attribute.length > 1)
                {
                    value = true;
                    attribute[1] = attribute[1].replace(/"/g, '').replace(/'/g, '');
                }
            }

            // Get closest match
            for (; elem && elem !== document; elem = elem.parentNode)
            {

                // If selector is a class
                if (firstChar === '.')
                {
                    if (supports)
                    {
                        if (elem.classList.contains(selector.substr(1)))
                        {
                            return elem;
                        }
                    }
                    else
                    {
                        if (new RegExp('(^|\\s)' + selector.substr(1) + '(\\s|$)').test(elem.className))
                        {
                            return elem;
                        }
                    }
                }

                // If selector is an ID
                if (firstChar === '#')
                {
                    if (elem.id === selector.substr(1))
                    {
                        return elem;
                    }
                }

                // If selector is a data attribute
                if (firstChar === '[')
                {
                    if (elem.hasAttribute(attribute[0]))
                    {
                        if (value)
                        {
                            if (elem.getAttribute(attribute[0]) === attribute[1])
                            {
                                return elem;
                            }
                        }
                        else
                        {
                            return elem;
                        }
                    }
                }

                // If selector is a tag
                if (elem.tagName.toLowerCase() === selector)
                {
                    return elem;
                }

            }

            return null;

        };

        /**
         * Escape special characters for use with querySelector
         * @public
         * @param {String} id The anchor ID to escape
         * @author {Mathias} Bynens}
         * @link {https://github.com/mathiasbynens/CSS.escape}
         */
        smoothScroll.escapeCharacters = function(id)
        {

            // Remove leading hash
            if (id.charAt(0) === '#')
            {
                id = id.substr(1);
            }

            var string = String(id);
            var length = string.length;
            var index = -1;
            var codeUnit;
            var result = '';
            var firstCodeUnit = string.charCodeAt(0);
            while (++index < length)
            {
                codeUnit = string.charCodeAt(index);
                // Note: there’s no need to special-case astral symbols, surrogate
                // pairs, or lone surrogates.

                // If the character is NULL (U+0000), then throw an
                // `InvalidCharacterError` exception and terminate these steps.
                if (codeUnit === 0x0000)
                {
                    throw new InvalidCharacterError(
                        'Invalid character: the input contains U+0000.'
                    );
                }

                if (
                    // If the character is in the range [\1-\1F] (U+0001 to U+001F) or is
                    // U+007F, […]
                    (codeUnit >= 0x0001 && codeUnit <= 0x001F) || codeUnit == 0x007F ||
                    // If the character is the first character and is in the range [0-9]
                    // (U+0030 to U+0039), […]
                    (index === 0 && codeUnit >= 0x0030 && codeUnit <= 0x0039) ||
                    // If the character is the second character and is in the range [0-9]
                    // (U+0030 to U+0039) and the first character is a `-` (U+002D), […]
                    (
                        index === 1 &&
                        codeUnit >= 0x0030 && codeUnit <= 0x0039 &&
                        firstCodeUnit === 0x002D
                    )
                )
                {
                    // http://dev.w3.org/csswg/cssom/#escape-a-character-as-code-point
                    result += '\\' + codeUnit.toString(16) + ' ';
                    continue;
                }

                // If the character is not handled by one of the above rules and is
                // greater than or equal to U+0080, is `-` (U+002D) or `_` (U+005F), or
                // is in one of the ranges [0-9] (U+0030 to U+0039), [A-Z] (U+0041 to
                // U+005A), or [a-z] (U+0061 to U+007A), […]
                if (
                    codeUnit >= 0x0080 ||
                    codeUnit === 0x002D ||
                    codeUnit === 0x005F ||
                    codeUnit >= 0x0030 && codeUnit <= 0x0039 ||
                    codeUnit >= 0x0041 && codeUnit <= 0x005A ||
                    codeUnit >= 0x0061 && codeUnit <= 0x007A
                )
                {
                    // the character itself
                    result += string.charAt(index);
                    continue;
                }

                // Otherwise, the escaped character.
                // http://dev.w3.org/csswg/cssom/#escape-a-character
                result += '\\' + string.charAt(index);

            }

            return '#' + result;

        };

        /**
         * Calculate the easing pattern
         * @private
         {*} @link https://gist.github.com/gre/1650294
         * @param {String} type Easing pattern
         * @param {Number} time Time animation should take to complete
         * @returns {Number}
         */
        var easingPattern = function(type, time)
        {
            var pattern;
            if (type === 'easeInQuad') pattern = time * time; // accelerating from zero velocity
            if (type === 'easeOutQuad') pattern = time * (2 - time); // decelerating to zero velocity
            if (type === 'easeInOutQuad') pattern = time < 0.5 ? 2 * time * time : -1 + (4 - 2 * time) * time; // acceleration until halfway, then deceleration
            if (type === 'easeInCubic') pattern = time * time * time; // accelerating from zero velocity
            if (type === 'easeOutCubic') pattern = (--time) * time * time + 1; // decelerating to zero velocity
            if (type === 'easeInOutCubic') pattern = time < 0.5 ? 4 * time * time * time : (time - 1) * (2 * time - 2) * (2 * time - 2) + 1; // acceleration until halfway, then deceleration
            if (type === 'easeInQuart') pattern = time * time * time * time; // accelerating from zero velocity
            if (type === 'easeOutQuart') pattern = 1 - (--time) * time * time * time; // decelerating to zero velocity
            if (type === 'easeInOutQuart') pattern = time < 0.5 ? 8 * time * time * time * time : 1 - 8 * (--time) * time * time * time; // acceleration until halfway, then deceleration
            if (type === 'easeInQuint') pattern = time * time * time * time * time; // accelerating from zero velocity
            if (type === 'easeOutQuint') pattern = 1 + (--time) * time * time * time * time; // decelerating to zero velocity
            if (type === 'easeInOutQuint') pattern = time < 0.5 ? 16 * time * time * time * time * time : 1 + 16 * (--time) * time * time * time * time; // acceleration until halfway, then deceleration
            return pattern || time; // no easing, no acceleration
        };

        /**
         * Calculate how far to scroll
         * @private
         * @param {Element} anchor The anchor element to scroll to
         * @param {Number} headerHeight Height of a fixed header, if any
         * @param {Number} offset Number of pixels by which to offset scroll
         * @returns {Number}
         */
        var getEndLocation = function(anchor, headerHeight, offset)
        {
            var location = 0;
            if (anchor.offsetParent)
            {
                do {
                    location += anchor.offsetTop;
                    anchor = anchor.offsetParent;
                } while (anchor);
            }
            location = location - headerHeight - offset;
            return location >= 0 ? location : 0;
        };

        /**
         * Determine the document's height
         * @private
         {*} @returns {Number}
         */
        var getDocumentHeight = function()
        {
            return Math.max(
                root.document.body.scrollHeight, root.document.documentElement.scrollHeight,
                root.document.body.offsetHeight, root.document.documentElement.offsetHeight,
                root.document.body.clientHeight, root.document.documentElement.clientHeight
            );
        };

        /**
         * Convert data-options attribute into an object of key/value pairs
         * @private
         * @param {String} options Link-specific options as a data attribute string
         * @returns {Object}
         */
        var getDataOptions = function(options)
        {
            return !options || !(typeof JSON === 'object' && typeof JSON.parse === 'function') ?
            {} : JSON.parse(options);
        };

        /**
         * Update the URL
         * @private
         * @param {Element} anchor The element to scroll to
         * @param {Boolean} url Whether or not to update the URL history
         */
        var updateUrl = function(anchor, url)
        {
            if (root.history.pushState && (url || url === 'true') && root.location.protocol !== 'file:')
            {
                root.history.pushState(null, null, [root.location.protocol, '//', root.location.host, root.location.pathname, root.location.search, anchor].join(''));
            }
        };

        var getHeaderHeight = function(header)
        {
            return header === null ? 0 : (getHeight(header) + header.offsetTop);
        };

        /**
         * Start/stop the scrolling animation
         * @public
         * @param {Element} anchor The element to scroll to
         * @param {Element} toggle The element that toggled the scroll event
         * @param {Object} options
         */
        smoothScroll.animateScroll = function(anchor, toggle, options)
        {

            // Options and overrides
            var overrides = getDataOptions(toggle ? toggle.getAttribute('data-options') : null);
            var animateSettings = extend(settings || defaults, options ||
            {}, overrides); // Merge user options with defaults

            // Selectors and variables
            var isNum = Object.prototype.toString.call(anchor) === '[object Number]' ? true : false;
            var anchorElem = isNum ? null : (anchor === '#' ? root.document.documentElement : root.document.querySelector(anchor));
            if (!isNum && !anchorElem) return;
            var startLocation = root.pageYOffset; // Current location on the page
            if (!fixedHeader)
            {
                fixedHeader = root.document.querySelector(animateSettings.selectorHeader);
            } // Get the fixed header if not already set
            if (!headerHeight)
            {
                headerHeight = getHeaderHeight(fixedHeader);
            } // Get the height of a fixed header if one exists and not already set
            var endLocation = isNum ? anchor : getEndLocation(anchorElem, headerHeight, parseInt(animateSettings.offset, 10)); // Location to scroll to
            var distance = endLocation - startLocation; // distance to travel
            var documentHeight = getDocumentHeight();
            var timeLapsed = 0;
            var percentage, position;

            // Update URL
            if (!isNum)
            {
                updateUrl(anchor, animateSettings.updateURL);
            }

            /**
             * Stop the scroll animation when it reaches its target (or the bottom/top of page)
             * @private
             * @param {Number} position Current position on the page
             * @param {Number} endLocation Scroll to location
             * @param {Number} animationInterval How much to scroll on this loop
             */
            var stopAnimateScroll = function(position, endLocation, animationInterval)
            {
                var currentLocation = root.pageYOffset;
                if (position == endLocation || currentLocation == endLocation || ((root.innerHeight + currentLocation) >= documentHeight))
                {
                    clearInterval(animationInterval);
                    if (!isNum)
                    {
                        anchorElem.focus();
                    }
                    animateSettings.callback(anchor, toggle); // Run callbacks after animation complete
                }
            };

            /**
             * Loop scrolling animation
             * @private
             */
            var loopAnimateScroll = function()
            {
                timeLapsed += 16;
                percentage = (timeLapsed / parseInt(animateSettings.speed, 10));
                percentage = (percentage > 1) ? 1 : percentage;
                position = startLocation + (distance * easingPattern(animateSettings.easing, percentage));
                root.scrollTo(0, Math.floor(position));
                stopAnimateScroll(position, endLocation, animationInterval);
            };

            /**
             * Set interval timer
             * @private
             */
            var startAnimateScroll = function()
            {
                clearInterval(animationInterval);
                animationInterval = setInterval(loopAnimateScroll, 16);
            };

            /**
             * Reset position to fix weird iOS bug
             * @link {https://github.com/cferdinandi/smooth-scroll/issues/45}
             */
            if (root.pageYOffset === 0)
            {
                root.scrollTo(0, 0);
            }

            // Start scrolling animation
            startAnimateScroll();

        };

        /**
         * If smooth scroll element clicked, animate scroll
         * @private
         */
        var eventHandler = function(e)
        {
            e = e || window.event;

            // Don't run if right-click or command/control + click
            if (e.button !== 0 || e.metaKey || e.ctrlKey) return;

            // If a smooth scroll link, animate it
            var toggle = getClosest(e.target, settings.selector);
            if (toggle && toggle.tagName.toLowerCase() === 'a')
            {
                e.preventDefault(); // Prevent default click event
                var hash = smoothScroll.escapeCharacters(toggle.hash); // Escape hash characters
                smoothScroll.animateScroll(hash, toggle, settings); // Animate scroll
            }

        };

        /**
         * On window scroll and resize, only run events at a rate of 15fps for better performance
         * @private
         * @param  {Function} eventTimeout Timeout function
         * @param  {Object} settings
         */
        var eventThrottler = function(e)
        {
            if (!eventTimeout)
            {
                eventTimeout = setTimeout(function()
                {
                    eventTimeout = null; // Reset timeout
                    headerHeight = getHeaderHeight(fixedHeader); // Get the height of a fixed header if one exists
                }, 66);
            }
        };

        /**
         * Destroy the current initialization.
         * @public
         */
        smoothScroll.destroy = function()
        {

            // If plugin isn't already initialized, stop
            if (!settings) return;

            // Remove event listeners
            root.document.removeEventListener('click', eventHandler, false);
            root.removeEventListener('resize', eventThrottler, false);

            // Reset varaibles
            settings = null;
            eventTimeout = null;
            fixedHeader = null;
            headerHeight = null;
            animationInterval = null;
        };

        /**
         * Initialize Smooth Scroll
         * @public
         * @param {Object} options User settings
         */
        smoothScroll.init = function(options)
        {

            // feature test
            if (!supports) return;

            // Destroy any existing initializations
            smoothScroll.destroy();

            // Selectors and variables
            settings = extend(defaults, options ||
            {}); // Merge user options with defaults
            fixedHeader = root.document.querySelector(settings.selectorHeader); // Get the fixed header
            headerHeight = getHeaderHeight(fixedHeader);

            // When a toggle is clicked, run the click handler
            root.document.addEventListener('click', eventHandler, false);
            if (fixedHeader)
            {
                root.addEventListener('resize', eventThrottler, false);
            }

        };


        //
        // Public APIs
        //

        return smoothScroll;

    });

    var scrl = smoothScroll;

    window.smoothScroll = null;

    // Load into container
    Container.set('SmoothScroll', scrl);

}());

(function()
{
    /* NProgress, (c) 2013, 2014 Rico Sta. Cruz - http://ricostacruz.com/nprogress
     * @license {MIT} */
    ! function(n, e)
    {
        "function" == typeof define && define.amd ? define(e) : "object" == typeof exports ? module.exports = e() : n.NProgress = e()
    }(this, function()
    {
        function n(n, e, t)
        {
            return e > n ? e : n > t ? t : n
        }

        function e(n)
        {
            return 100 * (-1 + n)
        }

        function t(n, t, r)
        {
            var i;
            return i = "translate3d" === c.positionUsing ?
            {
                transform: "translate3d(" + e(n) + "%,0,0)"
            } : "translate" === c.positionUsing ?
            {
                transform: "translate(" + e(n) + "%,0)"
            } :
            {
                "margin-left": e(n) + "%"
            }, i.transition = "all " + t + "ms " + r, i
        }

        function r(n, e)
        {
            var t = "string" == typeof n ? n : o(n);
            return t.indexOf(" " + e + " ") >= 0
        }

        function i(n, e)
        {
            var t = o(n),
                i = t + e;
            r(t, e) || (n.className = i.substring(1))
        }

        function s(n, e)
        {
            var t, i = o(n);
            r(n, e) && (t = i.replace(" " + e + " ", " "), n.className = t.substring(1, t.length - 1))
        }

        function o(n)
        {
            return (" " + (n && n.className || "") + " ").replace(/\s+/gi, " ")
        }

        function a(n)
        {
            n && n.parentNode && n.parentNode.removeChild(n)
        }
        var u = {};
        u.version = "0.2.0";
        var c = u.settings = {
            minimum: .08,
            easing: "linear",
            positionUsing: "",
            speed: 200,
            trickle: !0,
            trickleSpeed: 200,
            showSpinner: !0,
            barSelector: '[role="bar"]',
            spinnerSelector: '[role="spinner"]',
            parent: "body",
            template: '<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
        };
        u.configure = function(n)
            {
                var e, t;
                for (e in n) t = n[e], void 0 !== t && n.hasOwnProperty(e) && (c[e] = t);
                return this
            }, u.status = null, u.set = function(e)
            {
                var r = u.isStarted();
                e = n(e, c.minimum, 1), u.status = 1 === e ? null : e;
                var i = u.render(!r),
                    s = i.querySelector(c.barSelector),
                    o = c.speed,
                    a = c.easing;
                return i.offsetWidth, l(function(n)
                {
                    "" === c.positionUsing && (c.positionUsing = u.getPositioningCSS()), f(s, t(e, o, a)), 1 === e ? (f(i,
                    {
                        transition: "none",
                        opacity: 1
                    }), i.offsetWidth, setTimeout(function()
                    {
                        f(i,
                        {
                            transition: "all " + o + "ms linear",
                            opacity: 0
                        }), setTimeout(function()
                        {
                            u.remove(), n()
                        }, o)
                    }, o)) : setTimeout(n, o)
                }), this
            }, u.isStarted = function()
            {
                return "number" == typeof u.status
            }, u.start = function()
            {
                u.status || u.set(0);
                var n = function()
                {
                    setTimeout(function()
                    {
                        u.status && (u.trickle(), n())
                    }, c.trickleSpeed)
                };
                return c.trickle && n(), this
            }, u.done = function(n)
            {
                return n || u.status ? u.inc(.3 + .5 * Math.random()).set(1) : this
            }, u.inc = function(e)
            {
                var t = u.status;
                return t ? t > 1 ? void 0 : ("number" != typeof e && (e = t >= 0 && .2 > t ? .1 : t >= .2 && .5 > t ? .04 : t >= .5 && .8 > t ? .02 : t >= .8 && .99 > t ? .005 : 0), t = n(t + e, 0, .994), u.set(t)) : u.start()
            }, u.trickle = function()
            {
                return u.inc()
            },
            function()
            {
                var n = 0,
                    e = 0;
                u.promise = function(t)
                {
                    return t && "resolved" !== t.state() ? (0 === e && u.start(), n++, e++, t.always(function()
                    {
                        e--, 0 === e ? (n = 0, u.done()) : u.set((n - e) / n)
                    }), this) : this
                }
            }(), u.render = function(n)
            {
                if (u.isRendered()) return document.getElementById("nprogress");
                i(document.documentElement, "nprogress-busy");
                var t = document.createElement("div");
                t.id = "nprogress", t.innerHTML = c.template;
                var r, s = t.querySelector(c.barSelector),
                    o = n ? "-100" : e(u.status || 0),
                    l = document.querySelector(c.parent);
                return f(s,
                {
                    transition: "all 0 linear",
                    transform: "translate3d(" + o + "%,0,0)"
                }), c.showSpinner || (r = t.querySelector(c.spinnerSelector), r && a(r)), l != document.body && i(l, "nprogress-custom-parent"), l.appendChild(t), t
            }, u.remove = function()
            {
                s(document.documentElement, "nprogress-busy"), s(document.querySelector(c.parent), "nprogress-custom-parent");
                var n = document.getElementById("nprogress");
                n && a(n)
            }, u.isRendered = function()
            {
                return !!document.getElementById("nprogress")
            }, u.getPositioningCSS = function()
            {
                var n = document.body.style,
                    e = "WebkitTransform" in n ? "Webkit" : "MozTransform" in n ? "Moz" : "msTransform" in n ? "ms" : "OTransform" in n ? "O" : "";
                return e + "Perspective" in n ? "translate3d" : e + "Transform" in n ? "translate" : "margin"
            };
        var l = function()
            {
                function n()
                {
                    var t = e.shift();
                    t && t(n)
                }
                var e = [];
                return function(t)
                {
                    e.push(t), 1 == e.length && n()
                }
            }(),
            f = function()
            {
                function n(n)
                {
                    return n.replace(/^-ms-/, "ms-").replace(/-([\da-z])/gi, function(n, e)
                    {
                        return e.toUpperCase()
                    })
                }

                function e(n)
                {
                    var e = document.body.style;
                    if (n in e) return n;
                    for (var t, r = i.length, s = n.charAt(0).toUpperCase() + n.slice(1); r--;)
                        if (t = i[r] + s, t in e) return t;
                    return n
                }

                function t(t)
                {
                    return t = n(t), s[t] || (s[t] = e(t))
                }

                function r(n, e, r)
                {
                    e = t(e), n.style[e] = r
                }
                var i = ["Webkit", "O", "Moz", "ms"],
                    s = {};
                return function(n, e)
                {
                    var t, i, s = arguments;
                    if (2 == s.length)
                        for (t in e) i = e[t], void 0 !== i && e.hasOwnProperty(t) && r(n, t, i);
                    else r(n, s[1], s[2])
                }
            }();
        return u
    });

    var _NProgress = NProgress;

    window.NProgress = null;

    // Load into container 
    Container.set('NProgress', _NProgress);

})();

/**
 * Pluralize
 * @see {https://shopify.dev/docs/themes/ajax-api/reference/product-recommendations}
 * 
 * @example {Container.Helper().pluralize('tomato',} 5);
 * 
 */
(function()
{
    /**
     * Pluralize a word.
     *
     * @param  {string} word  The input word
     * @param  {int}    count The amount of items (optional) (default 2)
     * @return {string}
     */
    var Pluralize = function(word, count)
    {
        /**
         * The word to convert.
         *
         * @var {string}
         */
        this.word = '';

        /**
         * Lowercase version of word.
         *
         * @var {string}
         */
        this.lowercase = '';

        /**
         * Uppercase version of word.
         *
         * @var {string}
         */
        this.upperCase = '';

        /**
         * Sentence-case version of word.
         *
         * @var {string}
         */
        this.sentenceCase = '';

        /**
         * Casing pattern of the provided word.
         *
         * @var {string}
         */
        this.casing = '';

        /**
         * Sibilants.
         *
         * @var {array}
         */
        this.sibilants = ['x', 's', 'z', 's'];

        /**
         * Vowels.
         *
         * @var {array}
         */
        this.vowels = ['a', 'e', 'i', 'o', 'u'];

        /**
         * Consonants.
         *
         * @var {array}
         */
        this.consonants = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z'];

        count = (typeof count === 'undefined' ? 2 : count);

        return this.convert(string, word, int);
    }

    /**
     * Pluralize a word.
     *
     * @param  {string} word  The input word
     * @param  {int}    count The amount of items (optional) (default 2)
     * @return {string}
     */
    Pluralize.prototype.convert = function(word, count)
    {
        // Return the word if we don't need to pluralize
        if (count === 1)
        {
            return word;
        }

        // Set class variables for use
        this.word = word;
        this.lowercase = strtolower(word);
        this.upperCase = strtoupper(word);
        this.sentenceCase = uc_first(word);
        this.casing = this.getCasing();

        // save some time in the case that singular and plural are the same
        if (this.isUncountable())
        {
            return word;
        }

        // check for irregular forms
        irregular = this.isIrregular();
        if (irregular)
        {
            return this.toCasing(irregular, this.casing);
        }

        // nouns that end in -ch, x, s, z or s-like sounds require an es for the plural:
        if (in_array(this.suffix(this.lowercase, 1), this.sibilants) || (this.suffix(this.lowercase, 2) === 'ch'))
        {
            return this.toCasing(word + 'es', this.casing);
        }

        // Nouns that end in a vowel + y take the letter s:
        if (in_array(this.nthLast(this.lowercase, 1), this.vowels) && this.suffix(this.lowercase, 1) === 'y')
        {
            return this.toCasing(word + 's', this.casing);
        }

        // Nouns that end in a consonant + y drop the y and take ies:
        if (in_array(this.nthLast(this.lowercase, 1), this.consonants) && this.suffix(this.lowercase, 1) === 'y')
        {
            return this.toCasing(this.sliceFromEnd(word, 1) + 'ies', this.casing);
        }

        // Nouns that end in a consonant + o add s:
        if (in_array(this.nthLast(this.lowercase, 1), this.consonants) && this.suffix(this.lowercase, 1) === 'o')
        {
            return this.toCasing(word + 's', this.casing);
        }

        // Nouns that end in a vowel + o take the letter s:
        if (in_array(this.nthLast(this.lowercase, 1), this.vowels) && this.suffix(this.lowercase, 1) === 'o')
        {
            return this.toCasing(word + 's', this.casing);
        }

        // irregular suffixes that cant be pluralized
        if (this.suffix(this.lowercase, 4) === 'ness' || this.suffix(this.lowercase, 3) === 'ess')
        {
            return word;
        }

        // Lastly, change the word based on suffix rules
        pluralized = this.autoSuffix();

        if (pluralized)
        {
            return this.toCasing(this.sliceFromEnd(word, pluralized[0]) + pluralized[1], this.casing);
        }

        return this.word + 's';
    }

    /**
     * Is the word irregular and uncountable (e.g fish).
     *
     * @return {bool}
     */
    Pluralize.prototype.isUncountable = function()
    {
        var uncountable = [
            'gold',
            'audio',
            'police',
            'sheep',
            'fish',
            'deer',
            'series',
            'species',
            'money',
            'rice',
            'information',
            'equipment',
            'bison',
            'buffalo',
            'duck',
            'pike',
            'plankton',
            'salmon',
            'squid',
            'swine',
            'trout',
            'moose',
            'aircraft',
            'you',
            'pants',
            'shorts',
            'eyeglasses',
            'scissors',
            'offspring',
            'eries',
            'premises',
            'kudos',
            'corps',
            'heep',
        ];

        return in_array(this.lowercase, uncountable);
    }

    /**
     * Returns plural version of iregular words or FALSE if it is not irregular.
     *
     * @return {string|bool}
     */
    Pluralize.prototype.isIrregular = function()
    {
        var irregular = {
            'addendum': 'addenda',
            'alga': 'algae',
            'alumna': 'alumnae',
            'alumnus': 'alumni',
            'analysis': 'analyses',
            'antenna': 'antennae',
            'apparatus': 'apparatuses',
            'appendix': 'appendices',
            'axis': 'axes',
            'bacillus': 'bacilli',
            'bacterium': 'bacteria',
            'basis': 'bases',
            'beau': 'beaux',
            'kilo': 'kilos',
            'bureau': 'bureaus',
            'bus': 'buses',
            'cactus': 'cacti',
            'calf': 'calves',
            'child': 'children',
            'corps': 'corps',
            'corpus': 'corpora',
            'crisis': 'crises',
            'criterion': 'criteria',
            'curriculum': 'curricula',
            'datum': 'data',
            'deer': 'deer',
            'die': 'dice',
            'dwarf': 'dwarves',
            'diagnosis': 'diagnoses',
            'echo': 'echoes',
            'elf': 'elves',
            'ellipsis': 'ellipses',
            'embargo': 'embargoes',
            'emphasis': 'emphases',
            'erratum': 'errata',
            'fireman': 'firemen',
            'fish': 'fish',
            'fly': 'flies',
            'focus': 'focuses',
            'foot': 'feet',
            'formula': 'formulas',
            'fungus': 'fungi',
            'genus': 'genera',
            'goose': 'geese',
            'human': 'humans',
            'half': 'halves',
            'hero': 'heroes',
            'hippopotamus': 'hippopotami',
            'hoof': 'hooves',
            'hypothesis': 'hypotheses',
            'index': 'indices',
            'knife': 'knives',
            'leaf': 'leaves',
            'life': 'lives',
            'loaf': 'loaves',
            'louse': 'lice',
            'man': 'men',
            'matrix': 'matrices',
            'means': 'means',
            'medium': 'media',
            'memorandum': 'memoranda',
            'millennium': 'millenniums',
            'moose': 'moose',
            'mosquito': 'mosquitoes',
            'mouse': 'mice',
            'my': 'our',
            'nebula': 'nebulae',
            'neurosis': 'neuroses',
            'nucleus': 'nuclei',
            'neurosis': 'neuroses',
            'nucleus': 'nuclei',
            'oasis': 'oases',
            'octopus': 'octopi',
            'ovum': 'ova',
            'ox': 'oxen',
            'paralysis': 'paralyses',
            'parenthesis': 'parentheses',
            'person': 'people',
            'phenomenon': 'phenomena',
            'potato': 'potatoes',
            'quiz': 'quizzes',
            'radius': 'radii',
            'scarf': 'scarfs',
            'self': 'selves',
            'series': 'series',
            'sheep': 'sheep',
            'shelf': 'shelves',
            'scissors': 'scissors',
            'species': 'species',
            'stimulus': 'stimuli',
            'stratum': 'strata',
            'syllabus': 'syllabi',
            'symposium': 'symposia',
            'synthesis': 'syntheses',
            'synopsis': 'synopses',
            'tableau': 'tableaux',
            'that': 'those',
            'thesis': 'theses',
            'thief': 'thieves',
            'this': 'these',
            'tomato': 'tomatoes',
            'tooth': 'teeth',
            'torpedo': 'torpedoes',
            'vertebra': 'vertebrae',
            'veto': 'vetoes',
            'vita': 'vitae',
            'virus': 'viri',
            'watch': 'watches',
            'wife': 'wives',
            'wolf': 'wolves',
            'woman': 'women',
            'is': 'are',
            'was': 'were',
            'he': 'they',
            'she': 'they',
            'i': 'we',
            'zero': 'zeroes',
        };

        if (typeof irregular[this.lowercase] !== 'undefined')
        {
            return irregular[this.lowercase];
        }

        return false;
    }

    /**
     * Return an array with an index of where to cut off the ending and a suffix or FALSE.
     *
     * @return {array|false}
     */
    Pluralize.prototype.autoSuffix = function()
    {
        var suffix1 = this.suffix(this.lowercase, 1);
        var suffix2 = this.suffix(this.lowercase, 2);
        var suffix3 = this.suffix(this.lowercase, 3);

        if (this.suffix(this.lowercase, 4) === 'zoon') return [4, 'zoa'];

        if (suffix3 === 'eau') return [3, 'eaux'];
        if (suffix3 === 'ieu') return [3, 'ieux'];
        if (suffix3 === 'ion') return [3, 'ions'];
        if (suffix3 === 'oof') return [3, 'ooves'];

        if (suffix2 === 'an') return [2, 'en'];
        if (suffix2 === 'ch') return [2, 'ches'];
        if (suffix2 === 'en') return [2, 'ina'];
        if (suffix2 === 'ex') return [2, 'exes'];
        if (suffix2 === 'is') return [2, 'ises'];
        if (suffix2 === 'ix') return [2, 'ices'];
        if (suffix2 === 'nx') return [2, 'nges'];
        if (suffix2 === 'nx') return [2, 'nges'];
        if (suffix2 === 'fe') return [2, 'ves'];
        if (suffix2 === 'on') return [2, 'a'];
        if (suffix2 === 'sh') return [2, 'shes'];
        if (suffix2 === 'um') return [2, 'a'];
        if (suffix2 === 'us') return [2, 'i'];
        if (suffix2 === 'x') return [1, 'xes'];
        if (suffix2 === 'y') return [1, 'ies'];

        if (suffix1 === 'a') return [1, 'ae'];
        if (suffix1 === 'o') return [1, 'oes'];
        if (suffix1 === 'f') return [1, 'ves'];

        return false;
    }

    /**
     * Get provided casing of word.
     *
     * @return {string}
     */
    Pluralize.prototype.getCasing = function()
    {
        var casing = 'lower';
        casing = this.lowercase === this.word ? 'lower' : casing;
        casing = this.upperCase === this.word ? 'upper' : casing;
        casing = this.sentenceCase === this.word ? 'sentence' : casing;

        return casing;
    }

    /**
     * Convert word to a casing.
     *
     * @param  {string} word   The word to convert
     * @param  {string} casing The casing format to convert to
     * @return {string}
     */
    Pluralize.prototype.toCasing = function(word, casing)
    {
        if (casing === 'lower')
        {
            return word.toLowerCase();
        }
        elseif(casing === 'upper')
        {
            return word.toUpperCase();
        }
        elseif(casing === 'sentence')
        {
            return word.charAt(0).toUpperCase() + word.slice(1);
        }

        return word;
    }

    /**
     * Strip end off a word at a given char index and return the end part.
     *
     * @param  {string} word  The word to convert
     * @param  {int}    count The index to split at
     * @return {string}
     */
    Pluralize.prototype.suffix = function(word, count)
    {
        return substr(word, word.length - count);
    }

    /**
     * Strip end off a word at a given char index and return the start part.
     *
     * @param  {string} word  The word to convert
     * @param  {int}    count The index to split at
     * @return {string}
     */
    Pluralize.prototype.sliceFromEnd = function(word, count)
    {
        return substr(word, 0, word.length - count);
    }

    /**
     * Get the nth last character of a string.
     *
     * @param  {string} word  The word to convert
     * @param  {int}    count The index to get
     * @return {string}
     */
    Pluralize.prototype.nthLast = function(word, count)
    {
        return word.split().reverse().join()[count];
    }

    Container.set('pluralize', Pluralize);

}());


// Utility
/**
 * Cookie manager
 *
 * @see {https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie}
 * 
 */
(function()
{
    /* Base64 Polyfill https://github.com/davidchambers/Base64.js */
    ! function(e)
    {
        "use strict";
        if ("object" == typeof exports && null != exports && "number" != typeof exports.nodeType) module.exports = e();
        else if ("function" == typeof define && null != define.amd) define([], e);
        else
        {
            var t = e(),
                o = "undefined" != typeof self ? self : $.global;
            "function" != typeof o.btoa && (o.btoa = t.btoa), "function" != typeof o.atob && (o.atob = t.atob)
        }
    }(function()
    {
        "use strict";
        var f = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

        function c(e)
        {
            this.message = e
        }
        return (c.prototype = new Error).name = "InvalidCharacterError",
        {
            btoa: function(e)
            {
                for (var t, o, r = String(e), n = 0, a = f, i = ""; r.charAt(0 | n) || (a = "=", n % 1); i += a.charAt(63 & t >> 8 - n % 1 * 8))
                {
                    if (255 < (o = r.charCodeAt(n += .75))) throw new c("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
                    t = t << 8 | o
                }
                return i
            },
            atob: function(e)
            {
                var t = String(e).replace(/[=]+$/, "");
                if (t.length % 4 == 1) throw new c("'atob' failed: The string to be decoded is not correctly encoded.");
                for (var o, r, n = 0, a = 0, i = ""; r = t.charAt(a++); ~r && (o = n % 4 ? 64 * o + r : r, n++ % 4) && (i += String.fromCharCode(255 & o >> (-2 * n & 6)))) r = f.indexOf(r);
                return i
            }
        }
    });

    /**
     * Cookie prefix
     * 
     * @var {string}
     */
    var _prefix = '_hb';

    /**
     * Module constructor
     *
     * @access {public}
     * @constructor
     {*} @return this
     */
    class Cookies
    {
        /**
         * Set a cookie
         *
         * @access {public}
         * @param  {string}    key      Cookie key
         * @param  {string}    value    Cookie value
         * @param  {int}    days     Cookie expiry in days (optional) (default when browser closes)
         * @param  {string}    path     Cookie path (optional) (default "/")
         * @param  {bool}   secure   Secure policy (optional) (default) (true)
         * @param  {stringing} samesite Samesite policy (optional) (default) (true)
         * @return {sting}
         */
        set(key, value, days, path, secure, samesite)
        {
            value = this._encodeCookieValue(value);
            key = this._normaliseKey(key);
            path = typeof path === 'undefined' ? '; path=/' : '; path=' + path;
            secure = (typeof secure === 'undefined' || secure === true) && window.location.protocol === 'https:' ? '; secure' : '';
            samesite = typeof samesite === 'undefined' ? '' : '; samesite=' + samesite;
            var expires = expires = "; expires=" + this._normaliseExpiry(days | 365);

            document.cookie = key + '=' + value + expires + path + secure + samesite;

            return value;
        }

        /**
         * Get a cookie
         *
         * @access {public}
         * @param  {string} key Cookie key
         * @return {mixed}
         */
        get(key)
        {
            key = this._normaliseKey(key);

            var ca = document.cookie.split(';');

            for (var i = 0; i < ca.length; i++)
            {
                var c = ca[i];

                while (c.charAt(0) == ' ')
                {
                    c = c.substring(1);
                }

                if (c.indexOf(key) == 0)
                {
                    return this._decodeCookieValue(c.split('=').pop());
                }
            }

            return false;
        }

        /**
         * Remove a cookie
         *
         * @access {public}
         * @param  {string} key Cookie to remove
         */
        remove(key)
        {
            key = this._normaliseKey(key);

            document.cookie = key + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        }

        /**
         * Normalise cookie expiry date
         *
         * @access {private}
         * @param  {int}    days Days when cookie expires
         * @return {sting}
         */
        _normaliseExpiry(days)
        {
            var date = new Date();

            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));

            return date.toUTCString();
        }

        /**
         * Normalise cookie key
         *
         * @access {private}
         * @param  {string} key Cookie key
         * @return {sting}
         */
        _normaliseKey(key)
        {
            key = key.replace(/[^a-z0-9+]+/gi, '').toLowerCase();

            return _prefix + key;
        }

        /**
         * Encode cookie value
         *
         * @access {private}
         * @param  {mixed}  value Value to encode
         * @return {sting}
         */
        _encodeCookieValue(value)
        {
            try
            {
                value = this._base64_encode(JSON.stringify(value));
            }
            catch (e)
            {
                value = this._base64_encode(value);
            }

            return value;
        }

        /**
         * Decode cookie value
         *
         * @access {private}
         * @param  {string}  str Value to decode
         * @return {mixed}
         */
        _decodeCookieValue(str)
        {
            var value = this._base64_decode(str);

            try
            {
                value = JSON.parse(value);
            }
            catch (e)
            {
                return value;
            }

            return value;
        }

        /**
         * Base64 encode
         *
         * @access {private}
         * @param  {string} str String to encode
         * @return {sting}
         */
        _base64_encode(str)
        {
            return btoa(this._toBinary(str)).replace(/=/g, '_');
        }

        /**
         * Base64 decode
         *
         * @access {pubic}
         * @param  {string} str String to decode
         * @return {sting}
         */
        _base64_decode(str)
        {
            return this._fromBinary(atob(str.replace(/_/g, '=')));
        }

        /**
         * From binary
         *
         * @access {prvate}
         * @param  {string} binary String to decode
         * @return {string}
         */
        _fromBinary(binary)
        {
            const bytes = new Uint8Array(binary.length);

            for (var i = 0; i < bytes.length; i++)
            {
                bytes[i] = binary.charCodeAt(i);
            }

            return String.fromCharCode.apply(null, new Uint16Array(bytes.buffer));
        }

        /**
         * To binary
         *
         * @access {pubic}
         * @param  {string} string String to encode
         * @return {sting}
         */
        _toBinary(string)
        {
            const codeUnits = new Uint16Array(string.length);

            for (var i = 0; i < codeUnits.length; i++)
            {
                codeUnits[i] = string.charCodeAt(i);
            }

            return String.fromCharCode.apply(null, new Uint8Array(codeUnits.buffer));
        }
    }

    // Register as DOM Module and invoke
    Container.singleton('Cookies', Cookies);

})();

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
     * @var {object}
     */
    const Helper = Container.Helper();

    /**
     * Module constructor
     *
     * @class
     {*} @constructor
     * @access {public}
     * @return {this}
     */
    class Events
    {
        _callbacks = {};

        /**
         * Module destructor - clears event cache
         *
         * @access {public}
         */
        destruct()
        {
            this._callbacks = {};
        }

        /**
         * Fire a custom event
         *
         * @param {string} eventName The event name to fire
         * @param {mixed}  subject   What should be given as "this" to the event callbacks
         * @param {mixed}  args      List of additional args to push (optional)
         * @access {public}
         */
        fire()
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
         * @param {eventName} string The event name
         * @param {callback}  func   The callback function
         * @access {public}
         */
        on(eventName, callback)
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
         * @param {eventName} string The event name
         * @param {callback}  func   The callback function
         * @access {public}
         */
        off(eventName, callback)
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
         * @param {fn} string The function key
         * @access {private}
         * @return {string}
         */
        _getFnName(fn)
        {
            var f = typeof fn == 'function';

            var s = f && ((fn.name && ['', fn.name]) || fn.toString().match(/function ([^\(]+)/));

            return (!f && 'not a function') || (s && s[1] || 'anonymous');
        }
    }

    // Load into container and invoke
    Container.singleton('Events', Events);

}());

/**
 * Filters
 *
 * This class handles custom event firing and callback assigning.
 *
 */
(function()
{

    /**
     * Module constructor
     *
     * @class
     {*} @constructor
     * @access {public}
     * @return {this}
     */
    class Filters
    {
        _callbacks = {};

        /**
         * Module destructor - clears event cache
         *
         * @access {public}
         */
        destruct()
        {
            this._callbacks = {};
        }

        /**
         * Fire a custom event
         *
         * @param {eventName} string The event name to fire
         * @param {subject}   mixed  What should be given as "this" to the event callbacks
         * @access {public}
         */
        filter(eventName, subject)
        {
            var response = subject;

            for (var key in this._callbacks)
            {
                if (!this._callbacks.hasOwnProperty(key))
                {
                    continue;
                }

                var callbackEvent = key.split('______')[0];

                if (callbackEvent === eventName)
                {
                    var callback = this._callbacks[key].callback;

                    response = callback.call(response, response);
                }
            }

            return response;
        }

        /**
         * Bind a callback to an event
         *
         * @param {eventName} string The event name
         * @param {callback}  func   The callback function
         * @access {public}
         */
        on(eventName, callback)
        {
            // Make sure the function is unique - unless it is ananonymous
            var callbackName = this._getFnName(callback);

            if (callbackName === 'anonymous')
            {
                callbackName = 'anonymous_' + Object.keys(this._callbacks).length;
            }

            var key = eventName + '______' + callbackName;

            // Save the callback and event name
            this._callbacks[key] = {
                name: eventName,
                callback: callback,
            };
        }

        /**
         * UnBind a callback to an event
         *
         * @param {eventName} string The event name
         * @param {callback}  func   The callback function
         * @access {public}
         */
        off(eventName, callback)
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
         * @param {fn} string The function key
         * @access {private}
         * @return {string}
         */
        _getFnName(fn)
        {
            var f = typeof fn == 'function';

            var s = f && ((fn.name && ['', fn.name]) || fn.toString().match(/function ([^\(]+)/));

            return (!f && 'not a function') || (s && s[1] || 'anonymous');
        }
    }

    // Load into container and invoke
    Container.singleton('Filters', Filters);

}());

/**
 * InputMasker
 *
 * @see {https://github.com/text-mask/text-mask/tree/master/vanilla}
 */
(function()
{
    /**
     * JS Helper reference
     * 
     * @see {https://github.com/text-mask/text-mask/tree/master/vanilla}
     */
    ! function(e, r)
    {
        "object" == typeof exports && "object" == typeof module ? module.exports = r() : "function" == typeof define && define.amd ? define([], r) : "object" == typeof exports ? exports.vanillaTextMask = r() : e.vanillaTextMask = r()
    }(this, function()
    {
        return function(e)
        {
            function r(n)
            {
                if (t[n]) return t[n].exports;
                var o = t[n] = {
                    exports:
                    {},
                    id: n,
                    loaded: !1
                };
                return e[n].call(o.exports, o, o.exports, r), o.loaded = !0, o.exports
            }
            var t = {};
            return r.m = e, r.c = t, r.p = "", r(0)
        }([function(e, r, t)
        {
            "use strict";

            function n(e)
            {
                return e && e.__esModule ? e :
                {
                    default: e
                }
            }

            function o(e)
            {
                var r = e.inputElement,
                    t = (0, u.default)(e),
                    n = function(e)
                    {
                        var r = e.target.value;
                        return t.update(r)
                    };
                return r.addEventListener("input", n), t.update(r.value),
                {
                    textMaskInputElement: t,
                    _destroy: function()
                    {
                        r.removeEventListener("input", n)
                    }
                }
            }
            Object.defineProperty(r, "__esModule",
            {
                value: !0
            }), r.conformToMask = void 0, r.maskInput = o;
            var i = t(2);
            Object.defineProperty(r, "conformToMask",
            {
                enumerable: !0,
                get: function()
                {
                    return n(i).default
                }
            });
            var a = t(5),
                u = n(a);
            r.default = o
        }, function(e, r)
        {
            "use strict";
            Object.defineProperty(r, "__esModule",
            {
                value: !0
            }), r.placeholderChar = "_", r.strFunction = "function"
        }, function(e, r, t)
        {
            "use strict";

            function n()
            {
                var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : l,
                    r = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : u,
                    t = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] :
                    {};
                if (!(0, i.isArray)(r))
                {
                    if (("undefined" == typeof r ? "undefined" : o(r)) !== a.strFunction) throw new Error("Text-mask:conformToMask; The mask property must be an array.");
                    r = r(e, t), r = (0, i.processCaretTraps)(r).maskWithoutCaretTraps
                }
                var n = t.guide,
                    s = void 0 === n || n,
                    f = t.previousConformedValue,
                    d = void 0 === f ? l : f,
                    c = t.placeholderChar,
                    p = void 0 === c ? a.placeholderChar : c,
                    v = t.placeholder,
                    h = void 0 === v ? (0, i.convertMaskToPlaceholder)(r, p) : v,
                    m = t.currentCaretPosition,
                    y = t.keepCharPositions,
                    g = s === !1 && void 0 !== d,
                    b = e.length,
                    C = d.length,
                    k = h.length,
                    x = r.length,
                    P = b - C,
                    T = P > 0,
                    O = m + (T ? -P : 0),
                    M = O + Math.abs(P);
                if (y === !0 && !T)
                {
                    for (var w = l, S = O; S < M; S++) h[S] === p && (w += p);
                    e = e.slice(0, O) + w + e.slice(O, b)
                }
                for (var _ = e.split(l).map(function(e, r)
                    {
                        return {
                            char: e,
                            isNew: r >= O && r < M
                        }
                    }), j = b - 1; j >= 0; j--)
                {
                    var V = _[j].char;
                    if (V !== p)
                    {
                        var A = j >= O && C === x;
                        V === h[A ? j - P : j] && _.splice(j, 1)
                    }
                }
                var E = l,
                    N = !1;
                e: for (var F = 0; F < k; F++)
                {
                    var I = h[F];
                    if (I === p)
                    {
                        if (_.length > 0)
                            for (; _.length > 0;)
                            {
                                var L = _.shift(),
                                    R = L.char,
                                    J = L.isNew;
                                if (R === p && g !== !0)
                                {
                                    E += p;
                                    continue e
                                }
                                if (r[F].test(R))
                                {
                                    if (y === !0 && J !== !1 && d !== l && s !== !1 && T)
                                    {
                                        for (var W = _.length, q = null, z = 0; z < W; z++)
                                        {
                                            var B = _[z];
                                            if (B.char !== p && B.isNew === !1) break;
                                            if (B.char === p)
                                            {
                                                q = z;
                                                break
                                            }
                                        }
                                        null !== q ? (E += R, _.splice(q, 1)) : F--
                                    }
                                    else E += R;
                                    continue e
                                }
                                N = !0
                            }
                        g === !1 && (E += h.substr(F, k));
                        break
                    }
                    E += I
                }
                if (g && T === !1)
                {
                    for (var D = null, G = 0; G < E.length; G++) h[G] === p && (D = G);
                    E = null !== D ? E.substr(0, D + 1) : l
                }
                return {
                    conformedValue: E,
                    meta:
                    {
                        someCharsRejected: N
                    }
                }
            }
            Object.defineProperty(r, "__esModule",
            {
                value: !0
            });
            var o = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e)
            {
                return typeof e
            } : function(e)
            {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
            };
            r.default = n;
            var i = t(3),
                a = t(1),
                u = [],
                l = ""
        }, function(e, r, t)
        {
            "use strict";

            function n()
            {
                var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : s,
                    r = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : l.placeholderChar;
                if (!o(e)) throw new Error("Text-mask:convertMaskToPlaceholder; The mask property must be an array.");
                if (e.indexOf(r) !== -1) throw new Error("Placeholder character must not be used as part of the mask. Please specify a character that is not present in your mask as your placeholder character.\n\n" + ("The placeholder character that was received is: " + JSON.stringify(r) + "\n\n") + ("The mask that was received is: " + JSON.stringify(e)));
                return e.map(function(e)
                {
                    return e instanceof RegExp ? r : e
                }).join("")
            }

            function o(e)
            {
                return Array.isArray && Array.isArray(e) || e instanceof Array
            }

            function i(e)
            {
                return "string" == typeof e || e instanceof String
            }

            function a(e)
            {
                return "number" == typeof e && void 0 === e.length && !isNaN(e)
            }

            function u(e)
            {
                for (var r = [], t = void 0; t = e.indexOf(f), t !== -1;) r.push(t), e.splice(t, 1);
                return {
                    maskWithoutCaretTraps: e,
                    indexes: r
                }
            }
            Object.defineProperty(r, "__esModule",
            {
                value: !0
            }), r.convertMaskToPlaceholder = n, r.isArray = o, r.isString = i, r.isNumber = a, r.processCaretTraps = u;
            var l = t(1),
                s = [],
                f = "[]"
        }, function(e, r)
        {
            "use strict";

            function t(e)
            {
                var r = e.previousConformedValue,
                    t = void 0 === r ? o : r,
                    i = e.previousPlaceholder,
                    a = void 0 === i ? o : i,
                    u = e.currentCaretPosition,
                    l = void 0 === u ? 0 : u,
                    s = e.conformedValue,
                    f = e.rawValue,
                    d = e.placeholderChar,
                    c = e.placeholder,
                    p = e.indexesOfPipedChars,
                    v = void 0 === p ? n : p,
                    h = e.caretTrapIndexes,
                    m = void 0 === h ? n : h;
                if (0 === l || !f.length) return 0;
                var y = f.length,
                    g = t.length,
                    b = c.length,
                    C = s.length,
                    k = y - g,
                    x = k > 0,
                    P = 0 === g,
                    T = k > 1 && !x && !P;
                if (T) return l;
                var O = x && (t === s || s === c),
                    M = 0,
                    w = void 0,
                    S = void 0;
                if (O) M = l - k;
                else
                {
                    var _ = s.toLowerCase(),
                        j = f.toLowerCase(),
                        V = j.substr(0, l).split(o),
                        A = V.filter(function(e)
                        {
                            return _.indexOf(e) !== -1
                        });
                    S = A[A.length - 1];
                    var E = a.substr(0, A.length).split(o).filter(function(e)
                        {
                            return e !== d
                        }).length,
                        N = c.substr(0, A.length).split(o).filter(function(e)
                        {
                            return e !== d
                        }).length,
                        F = N !== E,
                        I = void 0 !== a[A.length - 1] && void 0 !== c[A.length - 2] && a[A.length - 1] !== d && a[A.length - 1] !== c[A.length - 1] && a[A.length - 1] === c[A.length - 2];
                    !x && (F || I) && E > 0 && c.indexOf(S) > -1 && void 0 !== f[l] && (w = !0, S = f[l]);
                    for (var L = v.map(function(e)
                        {
                            return _[e]
                        }), R = L.filter(function(e)
                        {
                            return e === S
                        }).length, J = A.filter(function(e)
                        {
                            return e === S
                        }).length, W = c.substr(0, c.indexOf(d)).split(o).filter(function(e, r)
                        {
                            return e === S && f[r] !== e
                        }).length, q = W + J + R + (w ? 1 : 0), z = 0, B = 0; B < C; B++)
                    {
                        var D = _[B];
                        if (M = B + 1, D === S && z++, z >= q) break
                    }
                }
                if (x)
                {
                    for (var G = M, H = M; H <= b; H++)
                        if (c[H] === d && (G = H), c[H] === d || m.indexOf(H) !== -1 || H === b) return G
                }
                else if (w)
                {
                    for (var K = M - 1; K >= 0; K--)
                        if (s[K] === S || m.indexOf(K) !== -1 || 0 === K) return K
                }
                else
                    for (var Q = M; Q >= 0; Q--)
                        if (c[Q - 1] === d || m.indexOf(Q) !== -1 || 0 === Q) return Q
            }
            Object.defineProperty(r, "__esModule",
            {
                value: !0
            }), r.default = t;
            var n = [],
                o = ""
        }, function(e, r, t)
        {
            "use strict";

            function n(e)
            {
                return e && e.__esModule ? e :
                {
                    default: e
                }
            }

            function o(e)
            {
                var r = {
                    previousConformedValue: void 0,
                    previousPlaceholder: void 0
                };
                return {
                    state: r,
                    update: function(t)
                    {
                        var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : e,
                            o = n.inputElement,
                            s = n.mask,
                            d = n.guide,
                            m = n.pipe,
                            g = n.placeholderChar,
                            b = void 0 === g ? v.placeholderChar : g,
                            C = n.keepCharPositions,
                            k = void 0 !== C && C,
                            x = n.showMask,
                            P = void 0 !== x && x;
                        if ("undefined" == typeof t && (t = o.value), t !== r.previousConformedValue)
                        {
                            ("undefined" == typeof s ? "undefined" : l(s)) === y && void 0 !== s.pipe && void 0 !== s.mask && (m = s.pipe, s = s.mask);
                            var T = void 0,
                                O = void 0;
                            if (s instanceof Array && (T = (0, p.convertMaskToPlaceholder)(s, b)), s !== !1)
                            {
                                var M = a(t),
                                    w = o.selectionEnd,
                                    S = r.previousConformedValue,
                                    _ = r.previousPlaceholder,
                                    j = void 0;
                                if (("undefined" == typeof s ? "undefined" : l(s)) === v.strFunction)
                                {
                                    if (O = s(M,
                                        {
                                            currentCaretPosition: w,
                                            previousConformedValue: S,
                                            placeholderChar: b
                                        }), O === !1) return;
                                    var V = (0, p.processCaretTraps)(O),
                                        A = V.maskWithoutCaretTraps,
                                        E = V.indexes;
                                    O = A, j = E, T = (0, p.convertMaskToPlaceholder)(O, b)
                                }
                                else O = s;
                                var N = {
                                        previousConformedValue: S,
                                        guide: d,
                                        placeholderChar: b,
                                        pipe: m,
                                        placeholder: T,
                                        currentCaretPosition: w,
                                        keepCharPositions: k
                                    },
                                    F = (0, c.default)(M, O, N),
                                    I = F.conformedValue,
                                    L = ("undefined" == typeof m ? "undefined" : l(m)) === v.strFunction,
                                    R = {};
                                L && (R = m(I, u(
                                {
                                    rawValue: M
                                }, N)), R === !1 ? R = {
                                    value: S,
                                    rejected: !0
                                } : (0, p.isString)(R) && (R = {
                                    value: R
                                }));
                                var J = L ? R.value : I,
                                    W = (0, f.default)(
                                    {
                                        previousConformedValue: S,
                                        previousPlaceholder: _,
                                        conformedValue: J,
                                        placeholder: T,
                                        rawValue: M,
                                        currentCaretPosition: w,
                                        placeholderChar: b,
                                        indexesOfPipedChars: R.indexesOfPipedChars,
                                        caretTrapIndexes: j
                                    }),
                                    q = J === T && 0 === W,
                                    z = P ? T : h,
                                    B = q ? z : J;
                                r.previousConformedValue = B, r.previousPlaceholder = T, o.value !== B && (o.value = B, i(o, W))
                            }
                        }
                    }
                }
            }

            function i(e, r)
            {
                document.activeElement === e && (g ? b(function()
                {
                    return e.setSelectionRange(r, r, m)
                }, 0) : e.setSelectionRange(r, r, m))
            }

            function a(e)
            {
                if ((0, p.isString)(e)) return e;
                if ((0, p.isNumber)(e)) return String(e);
                if (void 0 === e || null === e) return h;
                throw new Error("The 'value' provided to Text Mask needs to be a string or a number. The value received was:\n\n " + JSON.stringify(e))
            }
            Object.defineProperty(r, "__esModule",
            {
                value: !0
            });
            var u = Object.assign || function(e)
                {
                    for (var r = 1; r < arguments.length; r++)
                    {
                        var t = arguments[r];
                        for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n])
                    }
                    return e
                },
                l = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e)
                {
                    return typeof e
                } : function(e)
                {
                    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
                };
            r.default = o;
            var s = t(4),
                f = n(s),
                d = t(2),
                c = n(d),
                p = t(3),
                v = t(1),
                h = "",
                m = "none",
                y = "object",
                g = "undefined" != typeof navigator && /Android/i.test(navigator.userAgent),
                b = "undefined" != typeof requestAnimationFrame ? requestAnimationFrame : setTimeout
        }])
    });

    var vanillaMasker = vanillaTextMask;

    window.vanillaTextMask = null;

    /**
     * Reference to all applied masks
     * 
     * @var {array}
     */
    var _masks = [];

    /**
     * JS Helper reference
     * 
     * @var {object}
     */
    const Helper = Container.Helper();

    /**
     * Module constructor
     *
     * @constructor
     {*} @access public
     */
    class InputMasker
    {
        constructor(element)
        {
            this._element = element;

            this._mask = null;

            return this;
        }

        /**
         * Mask Credit Card
         *
         * @access {public}
         */
        creditcard()
        {
            var _mask = vanillaMasker.maskInput(
            {
                inputElement: this._element,
                guide: false,
                mask: [/[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/]
            });

            _mask['_element'] = this._element;

            _masks.push(_mask);
        }

        /**
         * Mask money
         *
         * @access {public}
         */
        money()
        {
            var _filter = function(rawValue)
            {
                var mask = [];

                if (rawValue.length > 1)
                {
                    for (var i = 0; i < rawValue.length; i++)
                    {
                        mask.push(/[0-9]|\./);
                    }

                    return mask;
                }

                return [/[0-9]/];
            };

            var _mask = vanillaMasker.maskInput(
            {
                inputElement: this._element,
                guide: false,
                mask: _filter
            });

            _mask['_element'] = this._element;

            _masks.push(_mask);
        }

        /**
         * Mask money
         *
         * @access {public}
         */
        numeric()
        {
            var _filter = function(rawValue)
            {
                var mask = [];

                if (rawValue.length > 1)
                {
                    for (var i = 0; i < rawValue.length; i++)
                    {
                        mask.push(/[0-9]/);
                    }

                    return mask;
                }

                return [/[0-9]/];
            };

            var _mask = vanillaMasker.maskInput(
            {
                inputElement: this._element,
                guide: false,
                mask: _filter
            });

            _mask['_element'] = this._element;

            _masks.push(_mask);
        }

        /**
         * Mask numeric with decimals
         *
         * @access {public}
         */
        numericDecimal()
        {
            var _filter = function(rawValue)
            {
                var mask = [];

                if (rawValue.length > 1)
                {
                    for (var i = 0; i < rawValue.length; i++)
                    {
                        mask.push(/[0-9]|\./);
                    }

                    return mask;
                }

                return [/[0-9]/];
            };

            var _mask = vanillaMasker.maskInput(
            {
                inputElement: this._element,
                guide: false,
                mask: _filter
            });

            _mask['_element'] = this._element;

            _masks.push(_mask);
        }

        /**
         * Mask alpha numeric
         *
         * @access {public}
         */
        alphaNumeric()
        {
            var _filter = function(rawValue)
            {
                var mask = [];

                var regex = /[A-z0-9]/;

                if (rawValue.length > 1)
                {
                    for (var i = 0; i < rawValue.length; i++)
                    {
                        mask.push(regex);
                    }

                    return mask;
                }

                return [regex];
            };

            var _mask = vanillaMasker.maskInput(
            {
                inputElement: this._element,
                guide: false,
                mask: _filter
            });

            _mask['_element'] = this._element;

            _masks.push(_mask);
        }

        /**
         * Mask alpha space
         *
         * @access {public}
         */
        alphaSpace()
        {
            var _filter = function(rawValue)
            {
                var mask = [];

                var regex = /[A-z ]/;

                if (rawValue.length > 1)
                {
                    for (var i = 0; i < rawValue.length; i++)
                    {
                        mask.push(regex);
                    }

                    return mask;
                }

                return [regex];
            };

            var _mask = vanillaMasker.maskInput(
            {
                inputElement: this._element,
                guide: false,
                mask: _filter
            });

            _mask['_element'] = this._element;

            _masks.push(_mask);
        }

        /**
         * Mask alpha dash
         *
         * @access {public}
         */
        alphaDash()
        {
            var _filter = function(rawValue)
            {
                var mask = [];

                var regex = /[A-z-]/;

                if (rawValue.length > 1)
                {
                    for (var i = 0; i < rawValue.length; i++)
                    {
                        mask.push(regex);
                    }

                    return mask;
                }

                return [regex];
            };

            var _mask = vanillaMasker.maskInput(
            {
                inputElement: this._element,
                guide: false,
                mask: _filter
            });

            _mask['_element'] = this._element;

            _masks.push(_mask);
        }

        /**
         * Mask alphanumeric dash
         *
         * @access {public}
         */
        alphaNumericDash()
        {
            var _filter = function(rawValue)
            {
                var mask = [];

                var regex = /[A-z0-9-]/;

                if (rawValue.length > 1)
                {
                    for (var i = 0; i < rawValue.length; i++)
                    {
                        mask.push(regex);
                    }

                    return mask;
                }

                return [regex];
            };

            var _mask = vanillaMasker.maskInput(
            {
                inputElement: this._element,
                guide: false,
                mask: _filter
            });

            _mask['_element'] = this._element;

            _masks.push(_mask);
        }

        /**
         * Mask custom regex
         *
         * @access {public}
         * @param  {regex}  pattern The pattern regex to mask
         */
        regex(pattern)
        {
            var _filter = function(rawValue)
            {
                var mask = [];

                if (rawValue.length > 1)
                {
                    for (var i = 0; i < rawValue.length; i++)
                    {
                        mask.push(pattern);
                    }

                    return mask;
                }

                return [pattern];
            };

            var _mask = vanillaMasker.maskInput(
            {
                inputElement: this._element,
                guide: false,
                mask: _filter
            });

            _mask['_element'] = this._element;

            _masks.push(_mask);
        }

        /**
         * Disable the mask
         *
         * @access {public}
         */
        remove()
        {
            for (var i = _masks.length - 1; i >= 0; i--)
            {
                if (_masks[i]['_element'] === this._element)
                {
                    _masks[i]._destroy();

                    _masks.splice(i, 1);
                }
            }
        }
    }

    // SET IN IOC
    /*****************************************/
    Container.set('InputMasker', InputMasker);

}());

/**
 * Modal
 *
 * The Modal class is a utility class used to
 * display a modal.
 *
 */
(function()
{
    /**
     * @var {obj}
     */
    const Helper = Container.Helper();

    /**
     * @var {obj}
     */
    var defaults = {
        title: '',
        message: '',
        closeAnywhere: true,
        targetContent: null,

        cancelBtn: true,
        cancelText: 'Cancel',
        cancelClass: 'btn btn-pure',

        confirmBtn: true,
        confirmClass: 'btn btn-pure btn-primary',
        confirmText: 'Confirm',
        overlay: 'light',
        extras: '',

        onBuilt: null,
        onBuiltArgs: null,
        onRender: null,
        onRenderArgs: null,
        onClose: null,
        onCloseArgs: null,
        validateConfirm: null,
        validateConfirmArgs: null

    };

    /**
     * Module constructor
     *
     * @class
     {*} @constructor
     * @params {options} obj
     * @access {public}
     * @return {this}
     */
    class Modal
    { 
        constructor(options)
        {
            this._options = Helper.array_merge(defaults, options);
            this._timer = null;
            this._modal = null;
            this._overlay = null;
            this._modalInner = null;

            this._invoke();

            return this;
        }

        /**
         * After options have parsed invoke the modal
         *
         * @access {private}
         */
        _invoke()
        {
            // Build the modal
            this._buildModal();

            // Render the modal        
            this._render();

            // Add listeners
            this._bindListeners();

            return this;
        }

        /**
         * Build the actual modal
         *
         * @access {private}
         */
        _buildModal()
        {
            var modal = document.createElement('DIV');
            modal.className = 'modal-wrap';

            var overlay = document.createElement('DIV');
            overlay.className = 'modal-overlay ' + this._options['overlay'];

            var content = '';

            if (this._options.targetContent)
            {
                modal.innerHTML = this._buildTargetModal();
            }
            else
            {
                var closeButton = this._options.cancelBtn === true ? '<button type="button" class="btn ' + this._options.cancelClass + ' js-modal-close js-modal-cancel">' + this._options.cancelText + '</button>' : '';
                var confirmButton = this._options.confirmBtn === true ? '<button type="button" class="btn ' + this._options.confirmClass + ' js-modal-close js-modal-confirm">' + this._options.confirmText + '</button>' : '';

                Helper.inner_HTML(modal, [
                    '<div class="modal-dialog js-modal-dialog">',
                    '<div class="card js-modal-panel">',
                    '<div class="card-header">',
                    '<h4 class="card-title">' + this._options.title + '</h4>',
                    '</div>',
                    this._options.extras,
                    '<div class="card-block">',
                    '<p class="card-text">' + this._options.message + '</p>',
                    '</div>',
                    '<div class="card-actions">',
                    closeButton,
                    confirmButton,
                    '</div>',
                    '</div>',
                    '</div>',
                ]);
            }

            this._modal = modal;
            this._overlay = overlay;
            this._modalInner = Helper.$('.js-modal-dialog', modal);
            this._fireBuilt();
        }

        /**
         * Get modal content from an existing DOM node
         *
         * @access {private}
         * @return {string}
         */
        _buildTargetModal()
        {
            var content = Helper.$(this._options.targetContent);

            if (!Helper.in_dom(content))
            {
                throw new Error('Could not find modal content with selector "' + this._options.targetContent + '"');
            }

            return '<div class="modal-dialog js-modal-dialog"><div class="card js-modal-panel">' + content.innerHTML + '</div></div>';
        }

        /**
         * Render the modal
         *
         * @access {private}
         */
        _render()
        {
            var _this = this;
            document.body.appendChild(this._overlay);
            document.body.appendChild(this._modal);

            this._centerModal();

            Helper.add_class(this._overlay, 'active');

            this._fireRender();

            Helper.addEventListener(window, 'resize', function modalResize()
            {
                _this._centerModal();
            });

            Helper.add_class(document.body, 'no-scroll');
        }

        /**
         * Bind event listeners inside the built modal
         *
         * @access {private}
         */
        _bindListeners()
        {
            var _this = this;

            var closeModal = function(e)
            {
                e = e || window.event;

                if (_this._options.closeAnywhere === true)
                {
                    if (this === _this._modal)
                    {
                        var clickedInner = Helper.closest(e.target, '.js-modal-dialog');

                        if (clickedInner)
                        {
                            return;
                        }
                    }
                }

                e.preventDefault();

                clearTimeout(_this._timer);

                if (Helper.has_class(this, 'js-modal-confirm'))
                {
                    var canClose = _this._fireConfirmValidator();

                    if (!canClose)
                    {
                        return;
                    }
                }

                Helper.add_class(_this._overlay, 'transition-off');

                _this._fireClosed();

                if (Helper.has_class(this, 'js-modal-confirm'))
                {
                    _this._fireConfirm();
                }

                _this._timer = setTimeout(function()
                {
                    Helper.remove_from_dom(_this._overlay);
                    Helper.remove_from_dom(_this._modal);
                    Helper.remove_class(document.body, 'no-scroll');
                }, 600);
            }

            if (this._options.closeAnywhere === true)
            {
                Helper.addEventListener(this._modal, 'click', closeModal, false);
            }

            var modalCloses = Helper.$All('.js-modal-close', this._modal);
            if (!Helper.is_empty(modalCloses))
            {
                Helper.addEventListener(modalCloses, 'click', closeModal, false);
            }

            var modalCancel = Helper.$('.js-modal-cancel', this._modal);
            if (Helper.in_dom(modalCancel))
            {
                Helper.addEventListener(modalCancel, 'click', closeModal, false);
            }
        }

        /**
         * Fire render event
         *
         * @access {private}
         */
        _fireRender()
        {
            if (this._options.onRender !== null && Helper.is_callable(this._options.onRender))
            {
                var callback = this._options.onRender;
                var args = this._options.onRenderArgs;
                callback.apply(this._modal, args);

            }
        }

        /**
         * Fire the closed event
         *
         * @access {private}
         */
        _fireClosed()
        {
            if (this._options.onClose !== null && Helper.is_callable(this._options.onClose))
            {
                var callback = this._options.onClose;
                var args = this._options.onCloseArgs;
                callback.apply(this._modal, args);
                Helper.remove_class(document.body, 'no-scroll');
            }
        }

        /**
         * Fire the confirm event
         *
         * @access {private}
         */
        _fireConfirm()
        {
            if (this._options.onConfirm !== null && Helper.is_callable(this._options.onConfirm))
            {
                var callback = this._options.onConfirm;
                var args = this._options.onConfirmArgs;
                callback.apply(this._modal, args);
            }
        }

        /**
         * Fire the confirm validation
         *
         * @access {private}
         */
        _fireConfirmValidator()
        {
            if (this._options.validateConfirm !== null && Helper.is_callable(this._options.validateConfirm))
            {
                var callback = this._options.validateConfirm;
                var args = this._options.validateConfirmArgs;
                return callback.apply(this._modal, args);
            }

            return true;
        }

        /**
         * Fire the built event
         *
         * @access {private}
         */
        _fireBuilt()
        {
            if (this._options.onBuilt !== null && Helper.is_callable(this._options.onBuilt))
            {
                var callback = this._options.onBuilt;
                var args = this._options.onBuiltArgs;
                callback.apply(this._modal, args);
            }
        }

        /**
         * Center the modal vertically
         *
         * @access {private}
         */
        _centerModal()
        {
            var el = this._modalInner;
            var computedStyle = window.getComputedStyle(el);
            var modalH = parseInt(el.offsetHeight);
            var windowH = window.innerHeight || document.documentElement.clientHeight || getElementsByTagName('body')[0].clientHeight;

            // If the window height is less than the modal dialog
            // We need to adjust the dialog so it is at the top of the page
            if (windowH <= modalH)
            {
                el.style.marginTop = '0px';
                el.style.top = '0';
            }
            else
            {
                el.style.marginTop = '-' + (modalH / 2) + 'px';
                el.style.top = '50%';
            }
        }
    }

    // Load into container 
    Container.set('Modal', Modal);

})();

/**
 * Modal
 *
 * The Modal class is a utility class used to
 * display a Frontdrop.
 *
 */
(function()
{
    /**
     * @var {obj}
     */
    const Helper = Container.Helper();

    /**
     * @var {obj}
     */
    var defaults =
    {
        title: '',
        content: '',
        closeAnywhere: true,
        targetContent: null,

        closeBtn: true,
        closeText: '',
        closeClass: 'btn btn-pure',

        confirmBtn: true,
        confirmText: 'Confirm',
        confirmClass: 'btn btn-primary',
        
        overlay: 'light',
        onBuilt: null,
        onBuiltArgs: null,
        onRender: null,
        onRenderArgs: null,
        onClose: null,
        onCloseArgs: null,
        validateConfirm: null,
        validateConfirmArgs: null

    };

    /**
     * Module constructor
     *
     * @class
     {*} @constructor
     * @params {options} obj
     * @access {public}
     * @return {this}
     */
    class Frontdrop
    {
        constructor(options)
        {
            if (typeof options !== 'undefined')
            {
                this._options = Helper.array_merge(defaults, options);
                this._timer = null;
                this._modal = null;
                this._overlay = null;
                this._modalInner = null;

                this._invoke();
            }

            return this;
        }

        /**
         * After options have parsed invoke the modal
         *
         * @access {private}
         */
        _invoke()
        {
            // Build the modal
            this._buildModal();

            // Render the modal        
            this._render();

            // Add listeners
            this._bindListeners();

            return this;
        }

        /**
         * Build the actual modal
         *
         * @access {private}
         */
        _buildModal()
        {
            var modal = document.createElement('DIV');
            modal.className = 'frontdrop-wrap';

            var overlay = document.createElement('DIV');
            overlay.className = 'frontdrop-overlay ' + this._options['overlay'];

            var close   = '';
            var content = this._options.targetContent !== null ? this._getTargetContent() : this._options.content;
            var confirm = this._options.confirmBtn === true ? '<button type="button" class="btn btn-xl ' + this._options.confirmClass + ' btn-confirm js-frontdrop-close js-frontdrop-confirm">' + this._options.confirmText + '</button>' : '';

            if (this._options.closeBtn)
            {
                if (this._options.closeText)
                {
                    close = '<button type="button" class="' + this._options.closeClass + ' js-frontdrop-close">' + this._options.closeText + '</button>';
                }
                else
                {
                    close = '<button type="button" class="btn btn-pure btn-sm btn-circle btn-close js-frontdrop-close"><span class="glyph-icon glyph-icon-cross2"></span></button>';
                }
            }

            Helper.inner_HTML(modal, [
                '<div class="frontdrop-dialog js-frontdrop-dialog">',
                    '<div class="frontdrop-header">',
                        close,
                        '<h4 class="frontdrop-title">' + this._options.title + '</h4>',
                    '</div>',
                    '<div class="frontdrop-body">',
                        content,
                    '</div>',
                    confirm,
                '</div>',
            ]);

            this._modal      = modal;
            this._overlay    = overlay;
            this._modalInner = Helper.$('.js-frontdrop-dialog', modal);
            this._fireBuilt();
        }

        /**
         * Get modal content from an existing DOM node
         *
         * @access {private}
         * @return {string}
         */
        _getTargetContent()
        {
            var content = Helper.$(this._options.targetContent);

            if (!Helper.in_dom(content))
            {
                throw new Error('Could not find modal content with selector "' + this._options.targetContent + '"');
            }

            return content.innerHTML.trim();
        }

        /**
         * Render the modal
         *
         * @access {private}
         */
        _render()
        {
            var _this = this;
            document.body.appendChild(this._overlay);
            document.body.appendChild(this._modal);

            var overlay = this._overlay;

            setTimeout(function()
            {
                Helper.add_class(overlay, 'active');

            }, 50);

            this._fireRender();

            Helper.add_class(document.body, 'no-scroll');
        }

        /**
         * Bind event listeners inside the built modal
         *
         * @access {private}
         */
        _bindListeners()
        {
            var _this = this;

            var closeModal = function(e)
            {
                e = e || window.event;

                if (_this._options.closeAnywhere === true)
                {
                    if (this === _this._modal)
                    {
                        var clickedInner = Helper.closest(e.target, '.js-frontdrop-dialog');

                        if (clickedInner)
                        {
                            return;
                        }
                    }
                }

                e.preventDefault();

                clearTimeout(_this._timer);

                if (Helper.has_class(this, 'js-frontdrop-confirm'))
                {
                    var canClose = _this._fireConfirmValidator();

                    if (!canClose)
                    {
                        return;
                    }
                }

                Helper.add_class(_this._overlay, 'transition-off');

                _this._fireClosed();

                if (Helper.has_class(this, 'js-frontdrop-confirm'))
                {
                    _this._fireConfirm();
                }

                _this._timer = setTimeout(function()
                {
                    Helper.remove_from_dom(_this._overlay);
                    Helper.remove_from_dom(_this._modal);
                    Helper.remove_class(document.body, 'no-scroll');
                }, 500);
            }

            if (this._options.closeAnywhere === true)
            {
                Helper.addEventListener(this._modal, 'click', closeModal, false);
            }

            var modalCloses = Helper.$All('.js-frontdrop-close', this._modal);
            if (!Helper.is_empty(modalCloses))
            {
                Helper.addEventListener(modalCloses, 'click', closeModal, false);
            }
        }

        /**
         * Fire render event
         *
         * @access {private}
         */
        _fireRender()
        {
            if (this._options.onRender !== null && Helper.is_callable(this._options.onRender))
            {
                var callback = this._options.onRender;
                var args = this._options.onRenderArgs;
                callback.apply(this._modal, args);

            }
        }

        /**
         * Fire the closed event
         *
         * @access {private}
         */
        _fireClosed()
        {
            if (this._options.onClose !== null && Helper.is_callable(this._options.onClose))
            {
                var callback = this._options.onClose;
                var args = this._options.onCloseArgs;
                callback.apply(this._modal, args);
                Helper.remove_class(document.body, 'no-scroll');
            }
        }

        /**
         * Fire the confirm event
         *
         * @access {private}
         */
        _fireConfirm()
        {
            if (this._options.onConfirm !== null && Helper.is_callable(this._options.onConfirm))
            {
                var callback = this._options.onConfirm;
                var args = this._options.onConfirmArgs;
                callback.apply(this._modal, args);
            }
        }

        /**
         * Fire the confirm validation
         *
         * @access {private}
         */
        _fireConfirmValidator()
        {
            if (this._options.validateConfirm !== null && Helper.is_callable(this._options.validateConfirm))
            {
                var callback = this._options.validateConfirm;
                var args = this._options.validateConfirmArgs;
                return callback.apply(this._modal, args);
            }

            return true;
        }

        /**
         * Fire the built event
         *
         * @access {private}
         */
        _fireBuilt()
        {
            if (this._options.onBuilt !== null && Helper.is_callable(this._options.onBuilt))
            {
                var callback = this._options.onBuilt;
                var args = this._options.onBuiltArgs;
                callback.apply(this._modal, args);
            }
        }
    }

    // Load into container 
    Container.set('Frontdrop', Frontdrop);

})();

/**
 * Notification
 *
 * The Notification class is a utility class used to
 * display a notification.
 *
 */
(function()
{

    /**
     * @var {Helper} obj
     */
    const Helper = Container.Helper();

    /**
     * @var {_activeNotifs} array
     */
    var _activeNotifs = [];

    /**
     * Module constructor
     *
     * @class
     {*} @constructor
     * @params {options} obj
     * @access {public}
     * @return {this}
     */
    class Notification
    {
        constructor(options)
        {
            this._notifWrap = Helper.$('.js-nofification-wrap');

            if (!Helper.in_dom(this._notifWrap))
            {
                this._buildNotificationContainer();
            }

            this._invoke(options);

            return this;
        }

        /**
         * Build the notification container
         *
         * @access {private}
         */
        _buildNotificationContainer()
        {
            var wrap = document.createElement('DIV');
            wrap.className = 'notification-wrap js-nofification-wrap';
            document.body.appendChild(wrap);
            this._notifWrap = Helper.$('.js-nofification-wrap');
        }


        /**
         * Display the notification
         *
         * @params {options} obj
         * @access {private}
         */
        _invoke(options)
        {
            if (typeof options.isCallback !== 'undefined' && options.isCallback === true)
            {
                this._invokeCallbackable(options);

                return;
            }

            var _this = this;
            var content = '<div class="msg-body"><p>' + options.msg + '</p></div>';
            var notif = Helper.new_node('div', 'msg-' + options.type + ' msg animate-notif', null, content, this._notifWrap);
            var timeout = typeof options.timeoutMs === 'undefined' ? 6000 : options.timeoutMs;

            Helper.add_class(this._notifWrap, 'active');

            // Timout remove automatically
            _activeNotifs.push(
            {
                node: notif,
                timeout: setTimeout(function()
                {
                    _this._removeNotification(notif);
                }, timeout),
            });

            // Click to remove
            notif.addEventListener('click', function()
            {
                _this._removeNotification(notif);
            });
        }

        /**
         * Create a notification that has callback buttons 
         *
         * @params {options} obj
         * @access {private}
         */
        _invokeCallbackable(options)
        {
            var _this = this;
            var confirmText = typeof options.confirmText === 'undefined' ? 'Confirm' : options.confirmText;
            var dismissX = typeof options.showDismiss === 'undefined' ? '' : '<button type="button" class="btn btn-xs btn-pure btn-dismiss btn-circle js-dismiss"><span class="glyph-icon glyph-icon-cross2"></span></button>';
            var timeout = typeof options.timeoutMs === 'undefined' ? 6000 : options.timeoutMs;

            var content = '<div class="msg-body"><p>' + options.msg + '</p></div><div class="msg-btn"><button type="button" class="btn btn-primary btn-sm btn-pure js-confirm">' + confirmText + '</button>' + dismissX + '</div>';

            var notif = Helper.new_node('div', 'msg animate-notif', null, content, this._notifWrap);
            var confirm = Helper.$('.js-confirm', notif);
            var dismiss = Helper.$('.js-dismiss', notif);

            Helper.add_class(this._notifWrap, 'active');

            _activeNotifs.push(
            {
                node: notif,
                timeout: setTimeout(function()
                {
                    _this._removeNotification(notif);
                }, timeout),
            });

            // Click to remove
            notif.addEventListener('click', function()
            {
                if (Helper.is_callable(options.onDismiss))
                {
                    options.onDismiss(options.onDismissArgs);
                }

                _this._removeNotification(notif);
            });

            // Click confirm to remove
            confirm.addEventListener('click', function()
            {
                if (Helper.is_callable(options.onConfirm))
                {
                    options.onConfirm(options.onConfirmArgs);
                }

                _this._removeNotification(notif);
            });

            if (dismiss)
            {
                dismiss.addEventListener('click', function()
                {
                    if (Helper.is_callable(options.onDismiss))
                    {
                        options.onDismiss(options.onDismissArgs);
                    }

                    _this._removeNotification(notif);
                });
            }
        }

        /**
         * Remove a notification
         *
         * @params {_node} node
         * @access {private}
         */
        _removeNotification(_node)
        {
            var _this = this;
            var i = _activeNotifs.length;
            while (i--)
            {
                if (_node === _activeNotifs[i].node)
                {
                    clearTimeout(_activeNotifs[i].timeout);
                    Helper.remove_class(_node, 'animate-notif');
                    Helper.animate(_node, 'opacity', '1', '0', 350, 'ease');
                    Helper.animate(_node, 'max-height', '100px', '0', 450, 'ease');
                    _activeNotifs.splice(i, 1);
                    setTimeout(function()
                    {
                        Helper.remove_from_dom(_node);

                        if (_activeNotifs.length === 0)
                        {
                            Helper.remove_class(_this._notifWrap, 'active');
                        }
                    }, 450);
                    return;
                }
            }
        }
    }

    // Add to container
    Container.set('Notification', Notification);

})();

/**
 * Ajax Utility
 *
 * @example 

{var} headers = {'foo' : 'bar'};
var data    = {'foo' : 'bar'};

var ajax = new _Ajax;

ajax.complete(function()
{
    console.log('Completed');
});

ajax.abort(function()
{
    console.log('Aborted');
});

ajax.post('https://stackoverflow.com/bar/bafsdfz', {foo: 'bar'}, function abort() {console.log('aborted here')}, {header: 'baz'});

setTimeout(function()
{
    ajax.abort();
}, 500);

var ajax = new _Ajax;
ajax.post('https://stackoverflow.com/foo', data,
function abort(response)
{
    console.log('aborted')
},
function success(response)
{
    console.log('success');
    
},
function error(response)
{
    console.log('error');
    
},
function complete(response)
{
    console.log('Completed');
    
},

headers);

ajax.abort();

var headers = {'foo' : 'bar'};
var data    = {'foo' : 'bar'};

_Ajax.get('https://stackoverflow.com', function complete(response)
{
    console.log('Completed');
    
});

_Ajax.get('https://stackoverflow.com', function complete(response)
{
    console.log('Completed');
    
}, headers);

_Ajax.post('https://stackoverflow.com', data,
function success(response)
{
    console.log('success');
    
},
function error(response)
{
    console.log('error');
});

_Ajax.post('https://stackoverflow.com', data,
function success(response)
{
    console.log('success');
    
},
function error(response)
{
    console.log('error');
    
},
function complete(response)
{
    console.log('Completed');
    
}, headers);

_Ajax.post('https://stackoverflow.com', data,
function success(response)
{
    console.log('success');
    
},
function error(response)
{
    console.log('error');
    
},
function complete(response)
{
    console.log('Completed');
    
},
function abort()
{
    
},headers);

*/
(function()
{
    /**
     * JS Queue
     *
     * @see {https://medium.com/@griffinmichl/asynchronous-javascript-queue-920828f6327}
     */
    class Queue
    {
        constructor(concurrency)
        {
            this.running = 0;
            this.concurrency = concurrency;
            this.taskQueue = [];

            return this;
        }

        add(task, _this, _args)
        {
            if (this.running < this.concurrency)
            {
                this._runTask(task, _this, _args);
            }
            else
            {
                this._enqueueTask(task, _this, _args);
            }
        }

        next()
        {
            this.running--;

            if (this.taskQueue.length > 0)
            {
                var task = this.taskQueue.shift();

                this._runTask(task['callback'], task['_this'], task['_args']);
            }
        }

        _runTask(task, _this, _args)
        {
            this.running++;

            task.apply(_this, _args);
        }

        _enqueueTask(task, _this, _args)
        {
            this.taskQueue.push(
            {
                'callback': task,
                '_this': _this,
                '_args': _args
            });
        }
    }

    var AjaxQueue = new Queue(5);

    /**
     * Module constructor
     *
     * @access {public}
     * @constructor
     {*} @return this
     */
    class _Ajax
    {
        constructor()
        {
            this._settings =
            {
                'url': '',
                'async': true,
                'headers':
                {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accepts': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                },
            };

            this._complete = false;
            this._success  = false;
            this._error    = false;
            this._abort    = false;
            this._xhr      = null;

            return this;
        }

        /**
         * Ajax Methods 
         *
         * @access {public}
         * @param  {string}        url     Destination URL
         * @param  {string|object} data    Data (optional)
         * @param  {function}      success Success callback (optional)
         * @param  {function}      error   Error callback (optional)
         * @param  {function}      abort   Abort callback (optional)
         * @param  {object}        headers Request headers (optional)
         * @return {this}
         */
        post(url, data, success, error, complete, abort, headers)
        {
            AjaxQueue.add(this._call, this, this._normaliseArgs('POST', url, data, success, error, complete, abort, headers));

            return this;
        }
        get(url, data, success, error, complete, abort, headers)
        {
            AjaxQueue.add(this._call, this, this._normaliseArgs('GET', url, data, success, error, complete, abort, headers));

            return this;
        }
        head(url, data, success, error, complete, abort, headers)
        {
            AjaxQueue.add(this._call, this, this._normaliseArgs('HEAD', url, data, success, error, complete, abort, headers));

            return this;
        }
        put(url, data, success, error, complete, abort, headers)
        {
            AjaxQueue.add(this._call, this, this._normaliseArgs('PUT', url, data, success, error, complete, abort, headers));

            return this;
        }
        delete(url, data, success, error, complete, abort, headers)
        {
            AjaxQueue.add(this._call, this, this._normaliseArgs('DELETE', url, data, success, error, complete, abort, headers));

            return this;
        }

        /**
         * Success function
         *
         * @param  {function}  callback Callback function
         * @return {this}
         */
        success(callback)
        {
            if (!this._isFunc(callback))
            {
                throw new Error('Error the provided argument "' + JSON.parse(callback) + '" is not a valid callback');
            }

            this._success = callback;

            return this;
        }

        /**
         * Error function
         *
         * @param  {function}  callback Callback function
         * @return {this}
         */
        error(callback)
        {
            if (!this._isFunc(callback))
            {
                throw new Error('Error the provided argument "' + JSON.parse(callback) + '" is not a valid callback');
            }

            this._error = callback;

            return this;
        }

        /**
         * Alias for complete
         *
         * @param  {function}  callback Callback function
         * @return {this}
         */
        then(callback)
        {
            return this.complete(callback);
        }

        /**
         * Complete function
         *
         * @param  {function}  callback Callback function
         * @return {this}
         */
        complete(callback)
        {
            if (!this._isFunc(callback))
            {
                throw new Error('Error the provided argument "' + JSON.parse(callback) + '" is not a valid callback');
            }

            this._complete = callback;

            return this;
        }

        /**
         * Abort an ajax call
         *
         * @param  {function}  callback Callback function
         * @return {this}
         */
        abort(callback)
        {
            // Called after XHR created
            if (this._xhr)
            {
                // Already completed
                if (!this._xhr.readyState >= 4)
                {
                    return;
                }

                this._complete = null;
                this._error    = null;
                this._success  = null;
                this._xhr.onreadystatechange = function(){};
                this._xhr.abort();

                if (this._isFunc(this._abort))
                {
                    this._abort.call(this._xhr, this._xhr.responseText, false);
                }

                if (this._isFunc(callback))
                {
                    callback.call(this._xhr, this._xhr.responseText, false);
                }

                return this;
            }
            // Called before XHR created
            else
            {
                if (!this._isFunc(callback))
                {
                    throw new Error('Error the provided argument "' + JSON.parse(callback) + '" is not a valid callback');
                }

                this._abort = callback;

                return this;
            }
        }

        /**
         * Special Upload Function
         *
         * @access {public}
         * @param  {string}        url      Destination URL
         * @param  {object}        data     Form data
         * @param  {function}      success  Success callback
         * @param  {function}      error    Error callback
         * @param  {function}      start    Start callback (optional)
         * @param  {function}      progress Progress callback (optional)
         * @param  {function}      complete Complete callback (optional)
         * @return {this}
         */
        upload(url, data, success, error, start, progress, complete)
        {
            var formData = new FormData();

            for (var key in data)
            {
                if (data.hasOwnProperty(key))
                {
                    var value = data[key];

                    if (value['type'])
                    {
                        formData.append(key, value, value.name);
                    }
                    else
                    {
                        formData.append(key, value);
                    }
                }
            }

            xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

            if (data)
            {
                data = this._params(data);
            }

            xhr.requestURL = url;

            xhr.method = 'POST';

            if (this.isFunction(start))
            {
                xhr.upload.addEventListener('loadstart', start, false);
            }
            if (this.isFunction(progress))
            {
                xhr.upload.addEventListener('progress', progress, false);
            }
            if (this.isFunction(complete))
            {
                xhr.upload.addEventListener('load', complete, false);
            }
            xhr.addEventListener('readystatechange', function(e)
            {
                e = e || window.event;
                var status, text, readyState;
                try
                {
                    readyState = e.target.readyState;
                    text = e.target.responseText;
                    status = e.target.status;
                }
                catch (e)
                {
                    return;
                }

                if (readyState == 4)
                {
                    if (status >= 200 && status < 300 || status === 304)
                    {
                        var response = e.target.responseText;

                        if (_this.isFunction(success))
                        {
                            success(response);
                        }
                    }
                    else
                    {
                        // error callback
                        if (_this.isFunction(error))
                        {
                            error.call(status, xhr);
                        }
                    }


                }

            }, false);
            xhr.open("POST", url, true);
            xhr.setRequestHeader('REQUESTED-WITH', 'XMLHttpRequest');
            xhr.send(formData);
        }

        /**
         * Ajax call 
         *
         * @access {private}
         * @param  {string}        method   Request method
         * @param  {string}        url      Destination URL
         * @param  {string|object} data     Data (optional)
         * @param  {function}      success  Success callback (optional)
         * @param  {function}      error    Error callback (optional)
         * @param  {function}      complete Complete callback (optional)
         * @param  {function}      abort    Abort callback (optional)
         * @param  {object}        headers  Request headers (optional)
         * @return {this}
         */
        _call(method, url, data, success, error, complete, abort, headers)
        {
            var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

            this._xhr = xhr;

            xhr.requestURL = url;

            xhr.mthod = method;

            xhr.open(method, url, this._settings['async']);

            this._sendHeaders(xhr, headers);

            var _this = this;

            if (abort && this._isFunc(abort)) this._abort = abort;

            if (this._settings['async'])
            {
                xhr.onreadystatechange = function()
                {
                    _this._ready.call(_this, xhr, success, error, complete, abort);
                }

                xhr.send(data);
            }
            else
            {
                xhr.send(data);

                this._ready.call(this, xhr, success, error, complete, abort);
            }

            return this;
        }

        /**
         * Send XHR headers
         *
         * @access {private}
         * @param  {object}    xhr     XHR object
         * @param  {object}    headers Request headers (optional)
         * @return {This}
         */
        _sendHeaders(xhr, headers)
        {
            if (xhr.mthod === 'POST')
            {
                this._settings['headers']['REQUESTED-WITH'] = 'XMLHttpRequest';
            }

            if (this._isObj(headers))
            {
                this._settings['headers'] = Object.assign(
                {}, this._settings['headers'], headers);
            }

            for (var k in this._settings['headers'])
            {
                if (this._settings['headers'].hasOwnProperty(k))
                {
                    xhr.setRequestHeader(k, this._settings['headers'][k]);
                }
            }
        }

        /**
         * Normalise arguments from original call function
         *
         * @param  {string}        method   Request method
         * @param  {string}        url      Destination URL
         * @param  {string|object} data     Data (optional)
         * @param  {function}      success  Success callback (optional)
         * @param  {function}      error    Error callback (optional)
         * @param  {function}      complete Complete callback (optional)
         * @param  {function}      error    Abort callback (optional)
         * @param  {object}        headers  Request headers (optional)
         * @return {This}
         */
        _normaliseArgs(method, url, data, success, error, complete, abort, headers)
        {
            var ret =
            {
                '_method'   : method,
                '_url'      : url,
                '_data'     : undefined,
                '_success'  : undefined,
                '_error'    : undefined,
                '_complete' : undefined,
                '_abort'    : undefined,
                '_headers'  : undefined
            };

            var args = Array.prototype.slice.call(arguments).filter(function( item ){return item !== undefined;});

            args.splice(0,2);

            // Check for function names
            for (var i = 0; i < args.length; i++)
            {
                var arg = args[i];

                // Argument is a function
                if (this._isFunc(arg))
                {
                    var funcname = this._funcName(arg);

                    if (funcname === 'success')
                    {
                        ret._success = arg;
                    }
                    else if (funcname === 'error')
                    {
                        ret._error = arg;
                    }
                    else if (funcname === 'complete')
                    {
                        ret._complete = arg;
                    }
                    else if (funcname === 'abort')
                    {
                        ret._abort = arg;
                    }
                    // Anonymous function
                    else if (funcname === 'function')
                    {
                        // called (url, complete)
                        // (url, complete, data)
                        if (i === 0 || i === 1)
                        {
                            ret._complete = arg;
                        }
                    }
                }
                else if (this._isObj(arg))
                {
                    // First arg is always data if it's an object
                    if (i === 0)
                    {
                        ret._data = arg;
                    }
                    // Last arg should be headers if it's an object
                    else if (i === args.length-1)
                    {
                        ret._headers = arg;
                    }
                }
            }

            // Ajax.get('foo.com?foo=bar&baz')
            if (method !== 'POST')
            {
                if (this._isObj(ret._data) && !this._isEmpty(ret._data))
                {
                    ret._url += ret._url.includes('?') ? '&' : '?';
                    ret._url += this._params(ret._data);
                    ret._data = undefined;
                }
            }
            else if (this._isObj(ret._data) && !this._isEmpty(ret._data))
            {
                ret._data = this._params(ret._data);
            }

            return [ret._method, ret._url, ret._data, ret._success, ret._error, ret._complete, ret._abort, ret._headers];
        }


        /**
         * Ready callback
         *
         * @param  {XMLHttpRequest} xhr     XHR Object
         * @param  {function}      success  Success callback (optional)
         * @param  {function}      error    Error callback (optional)
         * @param  {function}      complete Complete callback (optional)
         * @param  {function}      abort    Abort callback (optional)
         */
        _ready(xhr, success, error, complete, abort)
        {
            if (xhr.readyState == 4)
            {
                var successfull = false;

                if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)
                {
                    successfull = true;

                    // set data
                    var response = xhr.responseText;

                    // success callback
                    if (this._isFunc(success))
                    {
                        success.call(xhr, response);
                    }

                    if (this._success)
                    {
                        this._success.call(xhr, response);
                    }
                }
                else
                {
                    successfull = false;

                    // error callback
                    if (this._isFunc(error))
                    {
                        error.call(xhr, response);
                    }

                    if (this._error)
                    {
                        this._error.call(xhr, response)
                    }
                }

                // Complete
                if (this._isFunc(complete))
                {
                    complete.call(xhr, response, successfull);
                }

                if (this._complete)
                {
                    this._complete.call(xhr, response, successfull);
                }

                // Next queue
                AjaxQueue.next();
            }
        }

        _isEmpty(mixedvar)
        {
            return mixedvar && Object.keys(mixedvar).length === 0 && mixedvar.constructor === Object;
        }

        _isFunc(mixedvar)
        {
            return Object.prototype.toString.call(mixedvar) === '[object Function]';
        }

        _isObj(mixedvar)
        {
            return Object.prototype.toString.call(mixedvar) === '[object Object]';
        }

        _funcName(func)
        {
            if (func === window) return null;

            if (func.name) return func.name.toLowerCase();

            if (func.constructor && func.constructor.name) return func.constructor.name.toLowerCase();

            return null;
        }

        _params(obj)
        {
            var s = [];

            for (var key in obj)
            {
                s.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
            }

            return s.join('&');
        }
    }

    Container.set('Ajax', _Ajax);

})();

/**
 * FormValidator
 *
 * This class is used to validate a form and 
 * also apply and classes to display form results and input errors.
 *
 */
(function()
{

    /**
     * @var {Helper} obj
     */
    const Helper = Container.Helper();

    /**
     * Module constructor
     *
     * @class
     {*} @constructor
     * @param {form} node
     * @access {public}
     * @return {this}
     */
    class FormValidator
    {
        constructor(form)
        {
            // Save inputs
            this._form = form;
            this._inputs = Helper.form_inputs(form);

            // Defaults
            this._rulesIndex = [];
            this._invalids = [];
            this._formObj = {};
            this._nameIndex = {};
            this._validForm = true;

            // Initialize
            this._indexInputs();

            return this;
        }

        // PUBLIC ACCESS

        /**
         *  Is the form valid?
         *
         * @access {public}
         * @return {boolean}
         */
        isValid()
        {
            return this._validateForm();
        }

        /**
         * Show invalid inputs
         *
         * @access {public}
         */
        showInvalid()
        {
            this._clearForm();

            // Show the invalid inputs
            for (var j = 0; j < this._invalids.length; j++)
            {
                var __wrap = Helper.closest(this._invalids[j], '.form-field');
                if (Helper.in_dom(__wrap)) Helper.add_class(__wrap, 'danger');
            }
        }

        /**
         * Remove errored inputs
         *
         * @access {public}
         */
        clearInvalid()
        {
            this._clearForm();
        }

        /**
         * Show form result
         *
         * @access {public}
         */
        showResult(result)
        {
            this._clearForm();
            Helper.add_class(this._form, result);
        }

        /**
         * Append a key/pair and return form obj
         *
         * @access {public}
         * @return {obj}
         */
        append(key, value)
        {
            this._formObj[key] = value;
            return this._generateForm();
        };

        /**
         * Get the form object
         *
         * @access {public}
         * @return {obj}
         */
        form()
        {
            return this._generateForm();
        }

        // PRIVATE FUNCTIONS

        /**
         * Index form inputs by name and rules
         *
         * @access {public}
         */
        _indexInputs()
        {
            for (var i = 0; i < this._inputs.length; i++)
            {
                if (!this._inputs[i].name) continue;
                var name = this._inputs[i].name;
                this._nameIndex[name] = this._inputs[i];
                this._rulesIndex.push(
                {
                    node: this._inputs[i],
                    isRequired: this._inputs[i].dataset.jsRequired || null,
                    validationMinLength: this._inputs[i].dataset.jsMinLegnth || null,
                    validationMaxLength: this._inputs[i].dataset.jsMaxLegnth || null,
                    validationType: this._inputs[i].dataset.jsValidation || null,
                    isValid: true,
                });
            }
        }

        /**
         * Validate the form inputs
         *
         * @access {private}
         * @return {boolean}
         */
        _validateForm()
        {
            this._invalids = [];
            this._validForm = true;

            for (var i = 0; i < this._rulesIndex.length; i++)
            {

                this._rulesIndex[i].isValid = true;

                var pos = this._rulesIndex[i];
                var value = Helper.input_value(pos.node);

                if (!pos.isRequired && value === '')
                {
                    continue;
                }
                else if (pos.isRequired && value.replace(/ /g, '') === '')
                {
                    this._devalidate(i);
                }
                else if (pos.validationMinLength && !this._validateMinLength(value, pos.validationMinLength))
                {
                    this._devalidate(i);
                }
                else if (pos.validationMaxLength && !this._validateMaxLength(value, pos.validationMaxLength))
                {
                    this._devalidate(i);
                }
                else if (pos.validationType)
                {
                    var isValid = true;
                    if (pos.validationType === 'email') isValid = this._validateEmail(value);
                    if (pos.validationType === 'name') isValid = this._validateName(value);
                    if (pos.validationType === 'password') isValid = this._validatePassword(value);
                    if (pos.validationType === 'creditcard') isValid = this._validateCreditCard(value);
                    if (pos.validationType === 'url') isValid = this._validateUrl(value);
                    if (pos.validationType === 'alpha') isValid = this.alpha(value);
                    if (pos.validationType === 'numeric') isValid = this._validateNumeric(value);
                    if (pos.validationType === 'list') isValid = this._validateList(value);
                    if (!isValid) this._devalidate(i);
                }
            }

            return this._validForm;
        }

        /**
         * Generate the form object
         *
         * @access {private}
         * @return {obj}
         */
        _generateForm()
        {
            for (var i = 0; i < this._inputs.length; i++)
            {
                var name = this._inputs[i].name;
                var value = Helper.input_value(this._inputs[i]);
                if (this._inputs[i].type === 'radio' && this._inputs[i].checked == false)
                {
                    continue;
                }
                if (this._inputs[i].type === 'checkbox')
                {
                    this._formObj[name] = (this._inputs[i].checked == true);
                    continue;
                }
                if (name.indexOf('[]') > -1)
                {
                    if (!this._formObj[name]) this._formObj[name] = [];
                    this._formObj[name].push(value);
                }
                else
                {
                    this._formObj[name] = value;
                }
            }
            return this._formObj;
        }

        /**
         * Mark an input as not valid (internally)
         *
         * @access {private}
         * @return {obj}
         */
        _devalidate(i)
        {
            this._rulesIndex[i].isValid = false;
            this._validForm = false;
            this._invalids.push(this._rulesIndex[i].node);
        }

        /**
         * Clear form result and input errors
         *
         * @access {private}
         * @return {obj}
         */
        _clearForm(i)
        {
            // Remove the form result
            Helper.remove_class(this._form, ['info', 'success', 'warning', 'danger']);

            // Make all input elements 'valid' - i.e hide the error msg and styles.
            for (var i = 0; i < this._inputs.length; i++)
            {
                var _wrap = Helper.closest(this._inputs[i], '.form-field');
                if (Helper.in_dom(_wrap)) Helper.remove_class(_wrap, ['info', 'success', 'warning', 'danger'])
            }
        }

        /**
         * Private validator methods
         *
         * @access {private}
         * @return {boolean}
         */
        _validateEmail(value)
        {
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(value);
        }
        _validateName(value)
        {
            var re = /^[A-z _-]+$/;
            return re.test(value);
        }
        _validateNumeric(value)
        {
            var re = /^[\d]+$/;
            return re.test(value);
        }
        _validatePassword(value)
        {
            var re = /^(?=.*[^a-zA-Z]).{6,40}$/;
            return re.test(value);
        }
        _validateUrl(value)
        {
            re = /^(www\.|[A-z]|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
            return re.test(value);
        }
        _validateMinLength(value, min)
        {
            return value.length >= min;
        }
        _validateMaxLength(value, max)
        {
            return value.length <= max;
        }
        _validateAplha(value)
        {
            var re = /^[A-z _-]+$/;
            return re.test(value);
        }
        _validateAplhaNumeric(value)
        {
            var re = /^[A-z0-9]+$/;
            return re.test(value);
        }
        _validateList(value)
        {
            var re = /^[-\w\s]+(?:,[-\w\s]*)*$/;
            return re.test(value);
        }
        _validateCreditCard(value)
        {
            var arr = [0, 2, 4, 6, 8, 1, 3, 5, 7, 9];
            var ccNum = String(value).replace(/[- ]/g, '');

            var
                len = ccNum.length,
                bit = 1,
                sum = 0,
                val;

            while (len)
            {
                val = parseInt(ccNum.charAt(--len), 10);
                sum += (bit ^= 1) ? arr[val] : val;
            }

            return sum && sum % 10 === 0;
        }
    }

    // Load into container
    Container.set('FormValidator', FormValidator);

})();


// DOM Module
(function()
{
    /**
     * JS Helper
     * 
     * @var {obj}
     */
    const Helper = Container.Helper();

    /**
     * AJAX Module
     * 
     * @var {obj}
     */
    var Ajax = Hubble.require('Ajax');

    /**
     * AJAX URL to list paginated reviews
     * 
     * @var {string}
     */
    var _urlBase = window.location.origin;

    /**
     * Has pjax been invoked
     * 
     * @var {bool}
     */
    var _invoked = false;

    /**
     * Are we listening for state changes ?
     * 
     * @var {bool}
     */
    var _listening = false;

    /**
     * Are we currently loading a pjax request ?
     * 
     * @var {bool}
     */
    var _requesting = false;

    /**
     * Default options
     * 
     * @var {object}
     */
    var _defaults = 
    {
        element:   'body',
        timeout :   10000,
        cacheBust:  true,
        keepScroll: false,
        animation:  'fade',
        progress:   true,
    };

    /**
     * Pjax module
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE}
     */
    class Pjax
    {
        /**
         * Module constructor
         *
         * @constructor
         {*} @access public
         */
        constructor()
        {
            if (!_invoked)
            {
                this._bind();
            }

            return this;
        }

        /**
         * Module destructor - unbinds events
         *
         * @access {public}
         */
        destruct()
        {
            _invoked = false;
            _listening = false;

            window.removeEventListener('popstate', this._popStateHandler, false);
        }

        /**
         * Bind events
         *
         * @access {public}
         */
        _bind()
        {
            _invoked   = true;
            _listening = true;

            window.addEventListener('popstate', this._popStateHandler, false);
        }

        /**
         * Start a pjax request
         *
         * @access {public}
         * @param  {string}            url                The url to send the request to
         * @param  {object|null}       options            Options (optional)
         * @param  {string|DOMElement} options.element    Can be a selector or an existing dom element to replace content into (optional) (default 'body')
         * @param  {bool}              options.keepScroll Weather to retain existing scroll position (optional) (default false) 
         * @param  {bool}              options.scroll_pos  If provided will scroll to position  
         * @param  {string}            options.animation  fade|undefined|null
         * @param  {bool}              options.progress   Use Nprogress on load
         * @param  {int}               options.timeout    Timeout in MS (optional) (default 10,000)
         * @param  {bool}              options.cacheBust  When set to true, Pjax appends a timestamp query string segment to the requested URL in order to skip the browser cache (optional) (default true)
         * @param  {function}          options.onError    Callback when error occurs (optional)
         * @param  {function}          options.onSuccess  Callback when success occurs (optional)
         * @param  {function}          options.onComplete Callback when complete occurs (optional)
         */
        invoke(url, options)
        {
            // If we are already loading a pjax, cancel it and
            if (_requesting)
            {
                this._ajax.abort();
            }

            // We are now loading
            _requesting = true;

            // Merge options with defaults
            options = (typeof options === 'undefined' ? _defaults : Helper.array_merge(_defaults, options));

            // Normalize the url
            url = this._normaliseUrl(url.trim());

            // Normalize current url
            var currUrl = this._normaliseUrl(window.location.href); 

            this._load(url, options);
        }

        /**
         * Send a pjax request
         *
         * @access {private}
         * @param  {string}            url                The url to send the request to
         * @param  {object|null}       options            Options (optional)
         * @param  {string|DOMElement} options.element    Can be a selector or an existing dom element to replace content into (optional) (default 'body')
         * @param  {string}            options.animation  fade|undefined|null
         * @param  {int}               options.timeout    Timeout in MS (optional) (default 10,000)
         * @param  {bool}              options.cacheBust  When set to true, Pjax appends a timestamp query string segment to the requested URL in order to skip the browser cache (optional) (default true)
         * @param  {function}          options.onError    Callback when error occurs (optional)
         * @param  {function}          options.onSuccess  Callback when success occurs (optional)
         * @param  {function}          options.onComplete Callback when complete occurs (optional)
         */
        _load(url, options)
        {
            // Store this
            var _this = this;

            // Cachebust
            if (options.cacheBust)
            {
                //@todo
                // url = this._cacheBustURL(url);
            }

            // Store URL in options for callbacks
            options.url = url;
            
            // Push the current state
            window.history.pushState( { id: currUrl, scroll: Helper.scroll_pos() }, '', currUrl);

            // Fire the start event
            Hubble.require('Events').fire('pjax:start', options);

            // Send GET request
            this._ajax = Ajax.get(url,
            function success(HTML)
            {
                // Handle the response
                _this._handleSuccess(HTML, options);
            },
            
            // Handle the error
            function error(error)
            {
                // Handle the error
                _this._handleError(HTML, options);

            }, [{'X-PJAX': true}]);
        }

        /**
         * Pjax success handler
         *
         * @access {private}
         * @param  {object} locationObj Location object from the cache
         * @param  {string} HTML        HTML string response from server
         * @param  {bool}   stateChange Change the window history state
         */
        _handleSuccess(HTML, options)
        {
            // Parse the HTML
            var responseDoc = this._parseHTML(HTML);

            // Try to get the title
            var _title = this._findDomTitle(responseDoc);

            // Cache scripts
            var responseScripts = this._getScripts(responseDoc);
            var currScripts     = this._getScripts(document);
            responseDoc         = this._removeScripts(responseDoc);

            // Default to document bodys
            var targetEl        = document.body;
            var responseEl      = responseDoc.body;

            // Was pjax supported?
            var pjaxSuported    = HTML.startsWith('<!DOCTYPE html>')

            // Selector
            if (Helper.is_string(options.element))
            {
                targetEl   = document.querySelector(options.element);
                responseEl = responseDoc.querySelector(options.element);
            }
            // DOM Node
            else if (Helper.in_dom(options.element))
            {
                // Target is options.element
                targetEl = options.element;
            }

            // Insert content
            targetEl.innerHTML = responseEl.innerHTML;

            _this._appendScripts(currScripts, newScripts, function then()
            {
                Hubble.require('Events').fire('pjax:success', options);
                Hubble.require('Events').fire('pjax:complete', options);

                _requesting = false;
            });
        }

        /**
         * Handle Pjax Error
         *
         * @access {private}
         * @param  {object} locationObj Location object from the cache
         */
        _handleError(HTML, options)
        {
            
            _requesting = false;
        }

        /**
         * Add the state change listener to use internal page cache
         * to prevent back/forward events if that state is cached here
         *
         * @access {private}
         */
        _stateListener()
        {
            if (!_listening)
            {
                window.addEventListener('popstate', this._popStateHandler);

                _listening = true;
            }
        }

        /**
         * State change event handler (back/forward clicks)
         *
         * Popstate is treated as another pjax request essentially
         * 
         * @access {private}
         * @param  {e}       event JavaScript 'popstate' event
         */
        _popStateHandler(e)
        {
            e = e || window.event;

            var _this = Hubble.require('Pjax');

            // State obj exists 
            if (e.state && typeof e.state.id !== 'undefined')
            {
                // Prevent default
                e.preventDefault();

                var stateObj = e.state;

                opts = array_merge(_defaults, { scroll_pos: stateObj.scroll, keepScroll: false });

                // Load entire body from cache
                _this._load(stateObj.id, _defaults);
            }
            else
            {
                history.back();
            }
        }

        /**
         * If there are any new scripts load them
         * 
         * Note that appending or replacing content via 'innerHTML' or even
         * native Nodes with scripts inside their 'innerHTML'
         * will not load scripts so we need to compare what scripts have loaded
         * on the current page with any scripts that are in the new DOM tree 
         * and load any that don't already exist
         *
         * @access {private}
         * @param  {array}   currScripts Currently loaded scripts array
         * @param  {object}  newScripts  Newly loaded scripts
         */
        _appendScripts(currScripts, newScripts, callback)
        {
            var newScripts = newScripts.filter(x => !Helper.in_array(x, currScripts));
            var complete  = !Helper.is_empty(newScripts);

            if (!complete)
            {
                Helper.foreach(newScripts, function(i, script)
                {
                    this._appendScript(script);
                });
            }
            else
            {
                callback();
            }
        }

        _appendScript(scriptObj)
        {
            // Create a new script
            var script   = document.createElement('script');
            script.type  = 'text/javascript';
            script.async = false;

            // Is this an inline script or a src ?
            if (scriptObj.inline === true)
            {
                script.innerHTML = scriptObj.content;
            }
            else
            {
                script.src = scriptObj.content;
                script.addEventListener('load', function()
                {
                    chain.next();
                });
            }

            // Append the new script
            document.body.appendChild(script);
        }


        /**
         * Filter scripts with unique key/values into an array
         *
         * @access {private}
         * @param  {string} html HTML as a string (with or without full doctype)
         * @return {array}
         */
        _getScripts(doc)
        {
            var ret     = [];
            var scripts = Array.prototype.slice.call(doc.getElementsByTagName('script'));

            Helper.foreach(scripts, function(i, script)
            {
                var src = script.getAttribute('src');

                if (src)
                {
                    // Remove the query string
                    src = src.split('?')[0];

                    ret.push(
                    {
                        'inline' : false,
                        'content': src
                    });
                }
                else
                {
                    ret.push(
                    {
                        'inline' : true,
                        'content': script.innerHTML.trim()
                    });
                }
            });

            return ret;
        }

        /**
         * Remove all scripts from a document
         *
         * @access {private}
         * @param  {Document} Document Document element
         * @return {Document}
         */
        _removeScripts(doc)
        {
            var scripts = Array.prototype.slice.call(doc.getElementsByTagName('script'));

            Helper.foreach(scripts, function(i, script)
            {
                script.parentNode.removeChild(script);
            });

            return doc;
        }

        /**
         * Try to find the page title in a DOM tree
         *
         * @access {private}
         * @param  {string} html HTML as a string (with or without full doctype)
         * @return {string|false}
         */
        _findDomTitle(DOM)
        {
            var title = DOM.getElementsByTagName('title');

            if (title.length)
            {
                return title[0].innerHTML.trim();
            }

            return false;
        }

        /**
         * Parse HTML from string into a document
         *
         * @access {private}
         * @param  {string} html HTML as a string (with or without full doctype)
         * @return {DOM} tree
         */
        _parseHTML(html)
        {
            var parser = new DOMParser();
            return parser.parseFromString(html, 'text/html');
        }

        /**
         * Normalises a url
         *
         * @access {private}
         * @param  {string}  url The url to normalise
         * @return {string}
         */
        _normaliseUrl(url)
        {
            // If the url was set as local

            // e.g www.foobar.com/foobar
            // foobar.com/foobar
            if (url.indexOf('http') < 0)
            {
                // Get the path
                var path = url.indexOf('/') >= 0 ? url.substr(url.indexOf('/') + 1) : url;

                // e.g www.foobar.com/foobar
                if (url[0] === 'w')
                {
                    var host = url.split('.com');

                    url = window.location.protocol + '//' + host[0] + '.com/' + path;
                }
                else
                {
                    // foobar.com/foobar
                    if (url.indexOf('.com') !== -1)
                    {
                        var host = url.split('.com');
                        url = window.location.protocol + '//www.' + host[0] + '.com/' + path;
                    }
                    // /foobar/bar/
                    else
                    {
                        url = window.location.origin + '/' + path;
                    }

                }
            }

            return url;
        }
    }
        
    // Load into Hubble DOM core
    Container.singleton('Pjax', Pjax);

})();

(function()
{
    /**
     * JS Helper reference
     * 
     * @var {object}
     */
    const Helper = Container.Helper();
    
    /**
     * Pjax Links Module
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE}
     */
    class PjaxLinks
    {
        /**
         * Module constructor
         *
         * @access {public}
         * @constructor
         */
    	constructor()
        {
            this._nodes = Helper.$All('.js-pjax-link');

            if (!Helper.is_empty(this._nodes))
            {
                this._bind();
            }

            return this;
        }

        /**
         * Module destructor
         *
         * @access {public}
         */
        destruct()
        {
            this._unbind();
        }

        /**
         * Event binder - Binds all events on node click
         *
         * @access {private}
         */
        _bind()
        {
            Helper.addEventListener(this._nodes, 'click', this._eventHandler, false);
        }

        /**
         * Event unbinder - Removes all events on node click
         *
         * @access {private}
         */
        _unbind()
        {
            Helper.removeEventListener(this._nodes, 'click', this._eventHandler, false);
        }

        /**
         * Handle the click event
         *
         * @param {event|null} e JavaScript click event
         * @access {private}
         */
        _eventHandler(e)
        {
            e = e || window.event;

            e.preventDefault();

            var trigger = this;
            var href = trigger.dataset.pjaxHref;
            var target = trigger.dataset.pjaxTarget;
            var title = trigger.dataset.pjaxTitle || false;
            var stateChange = Helper.bool(trigger.dataset.pjaxStateChange);
            var singleRequest = Helper.bool(trigger.dataset.pjaxSingleRequest);

            Hubble.require('Pjax').invoke(href, target, title, stateChange, singleRequest);
        }
    }

    // Load into Hubble DOM core
    Hubble.dom().register('PjaxLinks', PjaxLinks);

}());

/**
 * Scrollbars
 *
 * This is a utility class used internally to add custom vertical scrollbars to an element.
 * This class handles the events of the scrollbars.
 * This should not be used at all outside of the framework.
 * @see {https://github.com/noraesae/perfect-scrollbar}
 */
(function()
{
    var defaults =
    {
        elements:
        {
            area: '.scrollbar-area',
            wrapper: '.scrollbar-wrapper',
            track: '.scrollbar-track',
            handle: '.scrollbar-handle'
        },
        stateClasses:
        {
            dragging: 'scrollbar-dragging',
            hover: 'scrollbar-hover'
        }
    };

    // SCROLLBAR HANDLER
    /*****************************************/
    class _ScrollbarHandler
    {
        constructor(element, opts)
        {

            // handle constructor call without `new` keyword
            if (!(this instanceof _ScrollbarHandler)) return new _ScrollbarHandler(element, opts);

            // is plugin already initialized?
            if (this.el)
            {
                return;
            }

            this.el = element;
            this.opts = extend({}, defaults, opts || {});

            this._setupElements();

            // check if browser has physical scrollbars (usually desktop)
            if (this.scrollbarWidth = getScrollbarWidth())
            {
                this._enableTrack();

                this._observeHover(this.area);
                this._observeHover(this.track);
                this._enableScroll();
                this._enableDragging();

                this.refresh();
            }
            else
            {
                this._allowNativeScroll();
            }

            return this;
        }

        // PUBLIC API
        /*****************************************/
        /**
         * Destroys plugin instance.
         */
        destroy()
        {
            var stateClasses = this.opts.stateClasses;

            this._removeAllListeners();

            this.wrapper.style.overflowY = '';
            this.wrapper.style.marginRight = '';
            this.track.style.display = '';

            remove_class(document.body, stateClasses.dragging);
            remove_class(this.area, stateClasses.dragging);
            remove_class(this.area, stateClasses.hover);
            remove_class(this.track, stateClasses.hover);

            delete this.el;
        }

        /**
         * Refreshes scrollbar by adjusting its handle's height and position.
         */
        refresh()
        {
            var newRatio;

            if (!this.el || this.isNative())
            {
                return;
            }

            if (this.wrapper.scrollHeight > this.wrapper.offsetHeight)
            {
                this.track.style.display = 'block';

                newRatio = this.track.offsetHeight / this.wrapper.scrollHeight;

                if (newRatio !== this.ratio)
                {
                    this.ratio = newRatio;

                    this._resizeHandle();
                    this._positionHandle();
                }
            }
            else
            {
                this.track.style.display = 'none';
            }
        }

        /**
         * Checks if native scroll is enabled.
         *
         * @returns {Boolean}
         */
        isNative()
        {
            return !this.scrollbarWidth;
        }

        // PRIVATE API
        /*****************************************/
        /**
         * Sets up elements.
         *
         * @private
         */
        _setupElements()
        {
            var elements = this.opts.elements;

            this.area = this.el.querySelector(elements.area);
            this.wrapper = this.el.querySelector(elements.wrapper);
            this.handle = this.el.querySelector(elements.handle);
            this.track = this.el.querySelector(elements.track);
        }

        /**
         * Observes when element is hovered and toggles corresponding class.
         *
         * @param {HTMLElement} element
         * @private
         */
        _observeHover(element)
        {
            var cls = this.opts.stateClasses.hover;

            this._addListener(element, 'mouseenter', function()
            {
                add_class(element, cls);
            });
            this._addListener(element, 'mouseleave', function()
            {
                remove_class(element, cls);
            });
        }

        /**
         * Enables scroll by overflowing native scrollbar and starting to listen to `scroll` event.
         *
         * @private
         */
        _enableScroll()
        {
            this._addListener(this.wrapper, 'scroll', bind(this._positionHandle, this));
        }

        /**
         * Enables handle's dragging along the track.
         *
         * @private
         */
        _enableDragging()
        {
            var cls = this.opts.stateClasses.dragging,
                initialPosition = null,
                initialTop = null,
                startDragging,
                stopDragging;

            this._addListener(this.handle, 'mousedown', bind(function(e)
            {
                initialPosition = this.wrapper.scrollTop;
                initialTop = e.clientY;

                this._addListener(document, 'mousemove', startDragging);
                this._addListener(document, 'mouseup', stopDragging);
            }, this));

            startDragging = bind(function(e)
            {
                var newPosition,
                    wrapperHeight,
                    wrapperInnerHeight;

                if (initialTop !== null)
                {
                    newPosition = Math.round(initialPosition + (e.clientY - initialTop) / this.ratio);

                    wrapperHeight = this.wrapper.offsetHeight;
                    wrapperInnerHeight = this.wrapper.scrollHeight;

                    if (newPosition + wrapperHeight > wrapperInnerHeight)
                    {
                        newPosition = wrapperInnerHeight - wrapperHeight;
                    }

                    this.wrapper.scrollTop = newPosition;
                    this._positionHandle();

                    add_class(document.body, cls);
                    add_class(this.area, cls);
                }
            }, this);

            stopDragging = bind(function()
            {
                initialTop = null;
                initialPosition = null;

                remove_class(document.body, cls);
                remove_class(this.area, cls);

                this._removeListener(document, 'mousemove', startDragging);
                this._removeListener(document, 'mouseup', stopDragging);
            }, this);
        }

        /**
         * Enables track.
         *
         * @private
         */
        _enableTrack()
        {
            this.wrapper.style.overflowY = 'scroll';
            this.wrapper.style.marginRight = -1 * this.scrollbarWidth + 'px';
        }

        /**
         * Allows native scrolling by making sure that div is scrollable.
         *
         * @private
         */
        _allowNativeScroll()
        {
            this.wrapper.style.overflowY = 'auto';
        }

        /**
         * Resizes handle by adjusting its `height`.
         *
         * @private
         */
        _resizeHandle()
        {
            this.handle.style.height = Math.ceil(this.ratio * this.track.offsetHeight) + 'px';
        }

        /**
         * Positions handle by adjusting its `top` position.
         *
         * @private
         */
        _positionHandle()
        {
            var wrapperTop = this.wrapper.scrollTop,
                top;

            if (wrapperTop + this.wrapper.offsetHeight < this.wrapper.scrollHeight)
            {
                top = Math.ceil(this.ratio * this.wrapper.scrollTop);
            }
            else
            {
                // if scroll position has reached the end, force scrollbar to track's end
                top = this.track.offsetHeight - this.handle.offsetHeight;
            }

            this.handle.style.top = top + 'px';
        }

        /**
         * Adds event listener and keeps track of it.
         *
         * @param {HTMLElement} element
         * @param {String}      eventName
         * @param {Function}    handler
         * @private
         */
        _addListener(element, eventName, handler)
        {
            var events = this._events;

            if (!events)
            {
                this._events = events = {};
            }
            if (!events[eventName])
            {
                events[eventName] = [];
            }

            events[eventName].push(
            {
                element: element,
                handler: handler
            });

            addEventListener.apply(null, arguments);
        }

        /**
         * Removes event listener.
         *
         * @param {HTMLElement} element
         * @param {String}      eventName
         * @param {Function}    handler
         * @private
         */
        _removeListener(element, eventName, handler)
        {
            var event = this._events[eventName],
                index,
                total;

            for (index = 0, total = event.length; index < total; index++)
            {
                if (event[index].handler === handler)
                {
                    event.splice(index, 1);
                    removeEventListener.apply(null, arguments);
                    break;
                }
            }
        }

        /**
         * Removes all event listeners.
         *
         * @private
         */
        _removeAllListeners()
        {
            var events = this._events,
                eventName,
                event,
                iter,
                total;

            for (eventName in events)
            {
                event = events[eventName];

                for (iter = 0, total = event.length; iter < total; iter++)
                {
                    removeEventListener(event[iter].element, eventName, event[iter].handler);
                }
            }

            delete this._events;
        }
    }

    // HELPER FUNCTIONS
    /*****************************************/
    function bind(fn, context)
    {
        return function()
        {
            fn.apply(context, arguments);
        };
    }

    function extend()
    {
        var iter;
        for (iter = 1; iter < arguments.length; iter++)
        {
            var key;
            for (key in arguments[iter])
            {
                if (arguments[iter].hasOwnProperty(key))
                {
                    arguments[0][key] = arguments[iter][key];
                }
            }
        }
        return arguments[0];
    }

    function addEventListener(el, eventName, handler)
    {
        if (el.addEventListener)
        {
            el.addEventListener(eventName, handler);
        }
        else
        {
            el.attachEvent("on" + eventName, handler);
        }
    }

    function removeEventListener(el, eventName, handler)
    {
        if (el.removeEventListener)
        {
            el.removeEventListener(eventName, handler);
        }
        else
        {
            el.detachEvent("on" + eventName, handler);
        }
    }

    function add_class(el, className)
    {
        if (el.classList)
        {
            el.classList.add(className);
        }
        else
        {
            el.className += " " + className;
        }
    }

    function remove_class(el, className)
    {
        if (el.classList)
        {
            el.classList.remove(className);
        }
        else
        {
            el.className = el.className.replace(new RegExp("(^|\\b)" + className.split(" ").join("|") + "(\\b|$)", "gi"), " ");
        }
    }

    function getScrollbarWidth()
    {
        var wrapper = document.createElement("div"),
            content = document.createElement("div"),
            width;
        wrapper.style.position = "absolute";
        wrapper.style.top = "-50px";
        wrapper.style.height = "50px";
        wrapper.style.overflow = "scroll";
        wrapper.appendChild(content);
        document.body.appendChild(wrapper);
        width = wrapper.offsetWidth - content.offsetWidth;
        document.body.removeChild(wrapper);
        return width;
    }

    Container.set('_ScrollbarHandler', _ScrollbarHandler);

})();

(function()
{
    /**
     * Helper instance
     * 
     * @var {object}
     */
    const Helper = Container.Helper();

    /**
     * Custom Scrollbars
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE}
     */
    class ScrollBars
    {

        /**
         * Module constructor
         *
         * @constructor
         {*} @access public
         */
    	constructor()
        {
            this._nodes = [];
            this._handlers = [];

            // Find nodes
            this._nodes = Helper.$All('.js-custom-scroll');

            // Bind DOM listeners
            if (!Helper.is_empty(this._nodes))
            {
                for (var i = 0; i < this._nodes.length; i++)
                {
                    this._invoke(this._nodes[i]);
                }
            }

            return this;
        }

        /**
         * Module destructor - removes handler
         *
         * @access {public}
         */
        desctruct()
        {
            for (var i = 0; i < this._handlers.length; i++)
            {
                this._handlers[i].destroy();
            }

            this._nodes = [];
            this._handlers = [];
        }

        /**
         * Create the necessary nodes for the scroller to work.
         * Also check if the element has overflow
         *
         * @params {el} node
         * @access {private}
         */
        _invoke(el)
        {
            if (Helper.has_class(el, 'js-auto-scroll-invoked'))
            {
                var handler = Container.get('_ScrollbarHandler', el);
                this._handlers.push(handler);
                return;
            }

            var needsScroller = this._needsScroller(el);
            if (!needsScroller) return;

            var insertAfter = false;
            var parent = el.parentNode;
            var children = Helper.first_children(el);
            if (el.nextSibling) insertAfter = el.nextSibling;

            var scrollArea = document.createElement('DIV');
            var scrollWrap = document.createElement('DIV');
            var scrollTrack = document.createElement('DIV');
            var scrollHandle = document.createElement('DIV');

            scrollArea.className = 'scrollbar-area';
            scrollWrap.className = 'scrollbar-wrapper';
            scrollTrack.className = 'scrollbar-track';
            scrollHandle.className = 'scrollbar-handle';

            scrollArea.appendChild(scrollWrap);
            for (var i = 0; i < children.length; i++)
            {
                scrollWrap.appendChild(children[i]);
            }
            scrollWrap.appendChild(scrollTrack);
            scrollTrack.appendChild(scrollHandle);
            el.appendChild(scrollArea);
            var handler = Container.get('_ScrollbarHandler', el);
            this._handlers.push(handler);
            Helper.add_class(el, 'js-auto-scroll-invoked');
        }

        /**
         * Check if an element needs to be scrolled or not.
         *
         * @params {el} node
         * @access {private}
         * @return {boolean}
         */
        _needsScroller(el)
        {
            var computedStyle = window.getComputedStyle(el);

            // Is the element hidden?
            var isHidden = el.offsetParent === null;
            var hiddenEl = false;
            var inlineDisplay = false;
            var needsScroller = false;

            if (isHidden)
            {
                if (computedStyle.display === 'none')
                {
                    hiddenEl = el;
                }
                else
                {
                    var parent = el;
                    while (parent !== document.body)
                    {
                        parent = parent.parentNode;
                        var parentStyle = window.getComputedStyle(parent);

                        if (parentStyle.display === 'none')
                        {
                            hiddenEl = parent

                            break;
                        }
                    }
                }
            }

            // Make visible
            if (hiddenEl)
            {
                inlineDisplay = hiddenEl.style.display;
                hiddenEl.style.display = 'block';
            }
            var endHeight = el.scrollHeight - parseInt(computedStyle.paddingTop) - parseInt(computedStyle.paddingBottom) + parseInt(computedStyle.borderTop) + parseInt(computedStyle.borderBottom);
            endHeight = parseInt(endHeight);
            if (endHeight > el.offsetHeight)
            {
                needsScroller = true;
                el.style.height = el.offsetHeight + 'px';
            }
            // Make invisible
            if (hiddenEl)
            {
                if (inlineDisplay)
                {
                    hiddenEl.style.display = inlineDisplay;
                }
                else
                {
                    hiddenEl.style.removeProperty('display');
                }
            }

            return needsScroller;
        }

        /**
         * Refresh the scroll position
         *
         * This can be usefull if you have custom scrollbars
         * on an element but change it's height (e.g responsive or add/remove children)
         *
         * @params {elem} node
         * @access {public}
         * @example {Container.get('ScrollBars').refresh(node)} // Node = $.('.js-custom-scroll');
         */
        refresh(elem)
        {
            for (var i = 0; i < this._handlers.length; i++)
            {
                var handler = this._handlers[i];

                if (handler.el === elem) handler.refresh();
            }
        }

        /**
         * Destroy a handler by dom node .js-custom-scroll
         *
         * @params {elem} node
         * @access {public}
         */
        destroy(elem)
        {
            var i = this._handlers.length;

            while (i--)
            {
                var handler = this._handlers[i];
                if (handler.el === elem) handler.destroy();
                this._handlers.splice(i, 1);
            }
        }

        /**
         * Get a handler by dom node .js-custom-scroll
         *
         * @params {elem} node
         * @access {public}
         * @return {mixed}
         */
        getHandler(elem)
        {
            for (var i = 0; i < this._handlers.length; i++)
            {
                var handler = this._handlers[i];

                if (handler.el === elem) return handler;
            }
        }
    }

    // Load into Hubble DOM core
    Hubble.dom().register('Scrollbars', ScrollBars);

})();

(function()
{
    const [$, $All, addEventListener, animate_css, bool, has_class, is_node_type, removeEventListener, toggle_class] = Container.import(['$','$All','addEventListener','animate_css','bool','has_class','is_node_type','removeEventListener','toggle_class']).from('Helper');

    /**
     * Toggle height on click
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE}
     */
    class Collapse
    {
        /**
         * Module constructor
         *
         * @access {public}
         * @constructor
         */
    	constructor()
        {
            /**
             * Array of click-triggers
             * 
             * @var {array}
             */
            this._nodes = $All('.js-collapse');

            this._bind();

            return this;
        }

        /**
         * Module destructor
         *
         * @access {public}
         */
        destruct()
        {
            this._unbind();

            this._nodes = [];
        }

        /**
         * Event binder - Binds all events on button click
         *
         * @access {private}
         */
        _bind()
        {
            addEventListener(this._nodes, 'click', this._eventHandler);
        }

        /**
         * Event unbinder - Removes all events on button click
         *
         * @access {private}
         */
        _unbind()
        {
            removeEventListener(this._nodes, 'click', this._eventHandler);
        }

        /**
         * Handle the click event
         *
         * @param {event|null} e JavaScript click event
         * @access {private}
         */
        _eventHandler(e)
        {
            e = e || window.event;

            if (is_node_type(this, 'a'))
            {
                e.preventDefault();
            }

            var clicked  = this;
            var targetEl = $('#' + clicked.dataset.collapseTarget);
            var duration = parseInt(clicked.dataset.collapseSpeed) || 350;
            var easing   = clicked.dataset.collapseEasing || 'easeOutExpo';
            var opacity  = bool(clicked.dataset.withOpacity);
            var options  = 
            {
                property: 'height',
                to: has_class(clicked, 'active') ? '0px' : 'auto',
                from: has_class(clicked, 'active') ? 'auto' : '0px',
                duration: duration, 
                easing: easing
            };

            animate_css(targetEl, options);
            toggle_class(clicked, 'active');
        }
    }

    // Load into Hubble DOM core
    Hubble.dom().register('Collapse', Collapse);

}());

(function()
{
    /**
     * JS Helper reference
     * 
     * @var {object}
     */
    const Helper = Container.Helper();

    /**
     * Dropdown Buttons
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE}
     */
    class DropDowns
    {
        /**
         * Module constructor
         *
         * @access {public}
         */
        constructor()
        {            
            this._triggers = Helper.$All('.js-drop-trigger');

            if (!Helper.is_empty(this._triggers))
            {
                this._bind();
            }
        }
 
        /**
         * Module destructor
         *
         * @access {public}
         */
        destruct()
        {
            this._unbind();
            
            this._triggers = [];
        }

        /**
         * Bind click listener to containers
         *
         * @access {private}
         */
        _bind()
        {
            Helper.addEventListener(this._triggers, 'click', this._clickHandler);

            Helper.addEventListener(window, 'click', this._windowClick);
        }

        /**
         * Unbind listener to containers
         *
         * @access {private}
         */
        _unbind()
        {
            Helper.removeEventListener(this._triggers, 'click', this._clickHandler);

            Helper.removeEventListener(window, 'click', this._windowClick);
        }

        /**
         * Click event handler
         *
         * @param  {event|null} e JavaScript Click event
         * @access {private}
         */
        _clickHandler(e)
        {
            e = e || window.event;
            e.preventDefault();

            var button = this;
            var _this = Container.get('DropDowns');

            // Hide all dropdowns except this
            _this._hideDropDowns(button);

            // Remove active and return
            if (Helper.has_class(button, 'active'))
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
         * @param  {event|null} e JavaScript Click event
         * @access {private}
         */
        _hideDrop(button)
        {
            var drop = Helper.$('.drop-menu', button.parentNode);
            Helper.remove_class(button, 'active');
            button.setAttribute('aria-pressed', 'false');
            Helper.hide_aria(drop);
            drop.blur();
        }

        /**
         * Click event handler
         *
         * @param  {event|null} e JavaScript Click event
         * @access {private}
         */
        _showDrop(button)
        {
            var drop = Helper.$('.drop-menu', button.parentNode);
            Helper.add_class(button, 'active');
            button.setAttribute('aria-pressed', 'true');
            Helper.show_aria(drop);
            drop.focus();
        }

        /**
         * Window click event
         *
         * @param {event|null} e JavaScript click event
         * @access {private}
         */
        _windowClick(e)
        {
            e = e || window.event;
            if (Helper.closest(e.target, '.js-drop-trigger'))
            {
                return;
            }
            if (!Helper.has_class(e.target, 'js-drop-trigger'))
            {
                var _this = Container.get('DropDowns');

                _this._hideDropDowns();
            }
        }

        /**
         * Hide all dropdowns
         *
         * @param {exception} (optional) Button to skip
         * @access {private}
         */
        _hideDropDowns(exception)
        {
            var dropTriggers = Helper.$All('.js-drop-trigger');
            var exception = (typeof exception === 'undefined' ? false : exception);

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
    }

    // Load into Hubble DOM core
    Hubble.dom().register('DropDowns', DropDowns);

})();

(function()
{
    /**
     * Helper instance
     * 
     * @var {object}
     */
    const Helper = Container.Helper();

    /**
     * Tab Nav
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE}
     */
    class TabNav
    {
        /**
         * Module constructor
         *
         * @constructor
         {*} @access public
         */
    	constructor()
        {
            // Find nodes
            this._nodes = Helper.$All('.js-tab-nav');

            // If nothing to do destruct straight away
            if (!Helper.is_empty(this._nodes))
            {
                for (var i = 0; i < this._nodes.length; i++)
                {
                    this._bindDOMListeners(this._nodes[i]);
                }
            }

            return this;
        };

        /**
         * Module destructor - unbinds click events
         *
         * @access {public}
         */
        destruct()
        {
            for (var i = 0; i < this._nodes.length; i++)
            {
                this._unbindDOMListeners(this._nodes[i]);
            }

            this._nodes = [];
        }

        /**
         * Bind click events on all <a> tags in a .js-tab-nav
         *
         * @params {navWrap} node
         * @access {private}
         */
        _bindDOMListeners(navWrap)
        {
            var links  = Helper.$All('li > *', navWrap);
            
            Helper.addEventListener(links, 'click', this._eventHandler);
        }

        /**
         * Unbind click events on all <a> tags in a .js-tab-nav
         *
         * @params {navWrap} node
         * @access {private}
         */
        _unbindDOMListeners(navWrap)
        {
            var links = Helper.$All('li > *', navWrap);
            
            Helper.removeEventListener(links, 'click', this._eventHandler);
        }

        /**
         * Click event handler
         *
         * @param {event|null} e JavaScript click event
         * @access {private}
         */
        _eventHandler(e)
        {
            e = e || window.event;
            e.preventDefault();

            var _this = Container.get('TabNav');
            
            var node = this;

            if (Helper.has_class(node, 'active')) return;
            
            var tab           = node.dataset.tab;
            var tabNav        = Helper.closest(node, 'ul');

            var tabPane       = Helper.$('[data-tab-panel="' + tab + '"]');
            var tabPanel      = Helper.closest_class(tabPane, 'js-tab-panels-wrap');
            var activePanel   = Helper.$('.tab-panel.active', tabPanel);

            var navWrap       = Helper.closest_class(node, 'js-tab-nav');
            var activeNav     = Helper.$('.active', navWrap);
            var activeClass   = navWrap.dataset.activeClass;
            var activeClasses = ['active'];

            if (!Helper.is_empty(activeClass))
            {
                activeClasses.push(activeClass);
            }

            Helper.remove_class(activeNav, activeClasses);
            Helper.remove_class(activePanel, activeClasses);

            Helper.add_class(node, activeClasses);
            Helper.add_class(tabPane, activeClasses);
            
        }
    }

    // Load into Hubble DOM core
    Hubble.dom().register('TabNav', TabNav);

})();
/**
 * Modal
 *
 * The Modal class is a utility class used to
 * display a Backdrop.
 *
 */
(function()
{
    /**
     * @var {obj}
     */
    const _ = Container.Helper();
    

})();

(function()
{
    /**
     * JS Helper
     * 
     * @var {obj}
     */
    const Helper = Container.Helper();

    /**
     * Show/hide sidebar overlay timer
     * 
     * @var {setTimeout}
     */
    var overleyTimer;

    /**
     * Show/hide sidebar el timer
     * 
     * @var {setTimeout}
     */
    var toggleTimer;

    /**
     * Last scroll y on page
     * 
     * @var {int}
     */
    var lastScrollY;

    /**
     * Drawer
     * 
     */
    class Drawer
    {
        /**
         * Module constructor
         *
         * @access {public}
         * @constructor
         {*} @return this
         */
    	constructor()
        {
            this._openTriggers = Helper.$All('.js-open-drawer-trigger');
            this._closeTriggers = Helper.$All('.js-close-drawer-trigger');
            this._drawerEl = Helper.$('.js-drawer');
            this._overlayEl = Helper.$('.js-drawer-overlay');

            if (Helper.in_dom(this._drawerEl))
            {
                this._bind();
            }

            return this;
        }

        /**
         * Module destructor
         *
         * @access {public}
         */
        destruct()
        {
            this._unbind();
        }

        /**
         * Bind event listeners
         *
         * @access {private}
         */
        _bind()
        {
            this._drawerWidth = Helper.rendered_style(this._drawerEl, 'max-width');

            Helper.addEventListener(this._openTriggers, 'click', this.open);

            Helper.addEventListener(this._closeTriggers, 'click', this.close);

            Helper.addEventListener(this._overlayEl, 'click', this.close);
        }

        /**
         * Unbind event listeners
         *
         * @access {private}
         */
        _unbind()
        {
            Helper.removeEventListener(this._openTriggers, 'click', this.open);

            Helper.removeEventListener(this._closeTriggers, 'click', this.close);

            Helper.removeEventListener(this._overlayEl, 'click', this.close);
        }

        /**
         * Handle show sidebar
         *
         * @access {private}
         * @param  {event|null} e Button click even
         */
        open(e)
        {
            e = e || window.event;

            if (e && e.target && Helper.is_node_type(e.target, 'a'))
            {
                e.preventDefault();
            }

            lastScrollY = document.documentElement.scrollTop || document.body.scrollTop;

            clearTimeout(overleyTimer);
            clearTimeout(toggleTimer);

            var _this = Container.Drawer();

            // Overlay
            Helper.css(_this._overlayEl, 'visibility', 'visible');
            Helper.animate(_this._overlayEl, 'opacity', 0, 1, 200, 'easeOutCubic');
            Helper.show_aria(_this._overlayEl);

            // Sidebar
            Helper.css(_this._drawerEl, 'visibility', 'visible');
            if (Helper.has_class(_this._drawerEl, 'drawer-right'))
            {
                Helper.animate(_this._drawerEl, 'transform', 'translateX('+ _this._drawerWidth + ')', 'translateX(0)', 200, 'easeOutCubic');
            }
            else
            {
                Helper.animate(_this._drawerEl, 'transform', 'translateX(-' + _this._drawerWidth +')', 'translateX(0)', 200, 'easeOutCubic');
            }

            Helper.add_class(document.body, 'no-scroll');
            Helper.show_aria(_this._drawerEl);
            Helper.add_class(_this._drawerEl, 'active');
            _this._drawerEl.focus();
        }

        /**
         * Handle hide sidebar
         *
         * @access {public}
         * @param  {event|null} e Button click even
         */
        close(e)
        {
            e = e || window.event;

            if (e && e.target && Helper.is_node_type(e.target, 'a'))
            {
                e.preventDefault();
            }

            clearTimeout(overleyTimer);
            clearTimeout(toggleTimer);

            var _this = Container.Drawer();

            // Overlay
            Helper.animate(_this._overlayEl, 'opacity', 1, 0, 200, 'easeOutCubic');
            overleyTimer = setTimeout(function()
            {
                Helper.css(_this._overlayEl, 'visibility', 'hidden');

            }, 250);
            Helper.hide_aria(_this._overlayEl);

            // Sidebar
            if (Helper.has_class(_this._drawerEl, 'drawer-right'))
            {
                Helper.animate(_this._drawerEl, 'transform', 'translateX(0)', 'translateX(' + _this._drawerWidth + ')', 200, 'easeOutCubic');
            }
            else
            {
                Helper.animate(_this._drawerEl, 'transform', 'translateX(0)', 'translateX(-' + _this._drawerWidth + ')', 200, 'easeOutCubic');
            }

            toggleTimer = setTimeout(function()
            {
                Helper.css(_this._drawerEl, 'visibility', 'hidden');
                
            }, 250);

            Helper.remove_class(document.body, 'no-scroll');
            Helper.hide_aria(_this._drawerEl);
            _this._drawerEl.blur();

            if (lastScrollY)
            {
                window.scrollTo(0, lastScrollY);
            }
        }
    }

    // Register as DOM Module and invoke
    Hubble.dom().register('Drawer', Drawer, true);

}());
(function()
{
    /**
     * JS Helper reference
     * 
     * @var {object}
     */
    const Helper = Container.Helper();

    /**
     * Popover Handler
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE}
     */
    class _popHandler
    {
        /**
         * Module constructor
         *
         * @access {public}
         * @constructor
         */
    	constructor(options)
        {
            this.trigger = options.target;
            this.options = options;
            this.el = this.buildPopEl();
            this.el.className = options.classes;
            this.animation = false;

            if (options.animation === 'pop')
            {
                this.animation = 'popover-pop';
            }
            else if (options.animation === 'fade')
            {
                this.animation = 'popover-fade';
            }

            this.render = function()
            {
                document.body.appendChild(this.el);
                this.stylePop();
                this.el.classList.add(this.animation);
            }
            return this;
        }

        /**
         * Build the popover
         *
         * @access {private}
         */
        buildPopEl()
        {
            var pop = document.createElement('div');
            pop.className = this.options.classes;

            if (typeof this.options.template === 'string')
            {
                pop.innerHTML = this.options.template;
            }
            else
            {
                pop.appendChild(this.options.template);
            }
            return pop;
        }

        /**
         * Remove the popover
         *
         * @access {public}
         */
        remove()
        {
            if (Helper.in_dom(this.el)) this.el.parentNode.removeChild(this.el);
        }

        /**
         * Position the popover
         *
         * @access {public}
         */
        stylePop()
        {

            var tarcoordinates = Helper.coordinates(this.options.target);

            if (this.options.direction === 'top')
            {
                this.el.style.top = tarcoordinates.top - this.el.scrollHeight + 'px';
                this.el.style.left = tarcoordinates.left - (this.el.offsetWidth / 2) + (this.options.target.offsetWidth / 2) + 'px';
                return;
            }
            else if (this.options.direction === 'bottom')
            {
                this.el.style.top = tarcoordinates.top + this.options.target.offsetHeight + 10 + 'px';
                this.el.style.left = tarcoordinates.left - (this.el.offsetWidth / 2) + (this.options.target.offsetWidth / 2) + 'px';
                return;
            }
            else if (this.options.direction === 'left')
            {
                this.el.style.top = tarcoordinates.top - (this.el.offsetHeight / 2) + (this.options.target.offsetHeight / 2) + 'px';
                this.el.style.left = tarcoordinates.left - this.el.offsetWidth - 10 + 'px';
                return;
            }
            else if (this.options.direction === 'right')
            {
                this.el.style.top = tarcoordinates.top - (this.el.offsetHeight / 2) + (this.options.target.offsetHeight / 2) + 'px';
                this.el.style.left = tarcoordinates.left + this.options.target.offsetWidth + 10 + 'px';
                return;
            }
        }
    }

    // Set into container for private use
    Container.set('_popHandler', _popHandler);

}());

(function()
{
    /**
     * JS Helper reference
     * 
     * @var {object}
     */
    const [$, $All, add_class, addEventListener, closest, has_class, is_empty, remove_class, removeEventListener] = Container.import(['$', '$All', 'add_class', 'addEventListener', 'closest', 'has_class', 'is_empty', 'remove_class', 'removeEventListener']).from('Helper');

    /**
     * Popovers
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE}
     */
    class Popovers
    {
        /**
         * Module constructor
         *
         * @access {public}
         * @constructor
         */
    	constructor()
        {
            this._pops = [];
            this._nodes = [];

            // Find nodes
            this._nodes = $All('.js-popover');

            // Bind events
            if (!is_empty(this._nodes))
            {
                for (var i = 0; i < this._nodes.length; i++)
                {
                    this._bind(this._nodes[i]);
                }

                this._addWindowClickEvent();
            }

            return this;
        }

        /**
         * Module destructor
         *
         * @access {public}
         * @return {this}
         */
        destruct()
        {
            if (!is_empty(this._nodes))
            {
                for (var i = 0; i < this._nodes.length; i++)
                {
                    this._unbind(this._nodes[i]);
                }
            }

            this._removeAll();

            this._nodes = [];

            this._pops = [];
        }

        /**
         * Unbind event listeners on a trigger
         *
         * @param {trigger} node
         * @access {private}
         */
        _unbind(trigger)
        {
            var evnt = trigger.dataset.popoverEvent;

            if (evnt === 'click')
            {
                removeEventListener(trigger, 'click', this._clickHandler);
                window.removeEventListener('resize', this._windowResize);
            }
            else
            {
                removeEventListener(trigger, 'mouseenter', this._hoverOver);
                removeEventListener(trigger, 'mouseleave', this._hoverLeavTimeout);
            }
        }

        /**
         * Initialize the handlers on a trigger
         *
         * @access {private}
         * @param  {DOMElement} trigger Click/hover trigger
         */
        _bind(trigger)
        {
            var direction = trigger.dataset.popoverDirection;
            var title = trigger.dataset.popoverTitle;
            var theme = trigger.dataset.popoverTheme || 'dark';
            var content = trigger.dataset.popoverContent;
            var evnt = trigger.dataset.popoverEvent;
            var animation = trigger.dataset.popoverAnimate || 'pop';
            var target = trigger.dataset.popoverTarget;
            var closeBtn = evnt === 'click' ? '<button type="button" class="btn btn-sm btn-pure btn-circle js-remove-pop close-btn"><span class="glyph-icon glyph-icon-cross3"></span></button>' : '';
            var pop = '<div class="popover-content"><p>' + content + '</p></div>';


            if (title)
            {
                pop = closeBtn + '<h5 class="popover-title">' + title + '</h5>' + pop;
            }

            if (target)
            {
                pop = $('#' + target).cloneNode(true);
                pop.classList.remove('hidden');
            }

            var popHandler = Container.get('_popHandler',
            {
                target: trigger,
                direction: direction,
                template: pop,
                animation: animation,
                classes: 'popover ' + direction + ' ' + theme,
            });

            this._pops.push(popHandler);

            if (evnt === 'click')
            {
                addEventListener(trigger, 'click', this._clickHandler);
                window.addEventListener('resize', this._windowResize);
            }
            else
            {
                var _this = this;
                addEventListener(trigger, 'mouseenter', this._hoverOver);
                addEventListener(trigger, 'mouseleave', this._hoverLeavTimeout);
            }
        }

        /**
         * Timeout handler for hoverleave
         *
         * @access {private}
         */
        _hoverLeavTimeout(e)
        {
            e = e || window.event;
            setTimeout(function()
            {
                Container.get('Popovers')._hoverLeave(e);
            }, 300);
        }

        /**
         * Hover over event handler
         *
         * @access {private}
         */
        _hoverOver()
        {
            var trigger = this;
            var _this = Container.get('Popovers');
            var popHandler = _this._getHandler(trigger);
            if (has_class(trigger, 'popped')) return;
            popHandler.render();
            add_class(trigger, 'popped');
        }

        /**
         * Hover leave event handler
         *
         * @access {private}
         */
        _hoverLeave(e)
        {
            var _this = Container.get('Popovers');
            var hovers = $All(':hover');
            for (var i = 0; i < hovers.length; i++)
            {
                if (has_class(hovers[i], 'popover'))
                {
                    hovers[i].addEventListener('mouseleave', function(_e)
                    {
                        _e = _e || window.event;
                        _this._hoverLeave(_e);
                    });
                    return;
                }
            }

            _this._removeAll();
        }

        /**
         * Window resize event handler
         *
         * @access {private}
         */
        _windowResize()
        {
            var _this = Container.get('Popovers');

            for (var i = 0; i < _this._nodes.length; i++)
            {
                if (has_class(_this._nodes[i], 'popped'))
                {
                    var popHandler = _this._getHandler(_this._nodes[i]);
                    popHandler.stylePop();
                }
            }
        }

        /**
         * Click event handler
         *
         * @param {event|null} e JavaScript click event
         * @access {private}
         */
        _clickHandler(e)
        {
            e = e || window.event;
            e.preventDefault();
            var trigger = this;
            var _this = Container.get('Popovers');
            var popHandler = _this._getHandler(trigger);

            if (has_class(trigger, 'popped'))
            {
                _this._removeAll();
                popHandler.remove();
                remove_class(trigger, 'popped');
            }
            else
            {
                _this._removeAll();
                popHandler.render();
                add_class(trigger, 'popped');
            }
        }

        /**
         * Remove all popovers when anything is clicked
         *
         * @access {private}
         */
        _addWindowClickEvent()
        {
            var _this = this;

            window.addEventListener('click', function(e)
            {
                e = e || window.event;
                var clicked = e.target;

                // Clicked the close button
                if (has_class(clicked, 'js-remove-pop') || closest(clicked, '.js-remove-pop'))
                {
                    _this._removeAll();

                    return;
                }

                // Clicked inside the popover
                if (has_class(clicked, 'popover') || closest(clicked, '.popover'))
                {
                    return;
                }

                // Clicked a popover trigger
                if (has_class(clicked, 'js-popover') || closest(clicked, '.js-popover'))
                {
                    return;
                }

                _this._removeAll();
            });
        }

        /**
         * Get the handler for the trigger
         * 
         * @access {private}
         * @param  {DOMElement}    trigger DOM node that triggered event
         * @return {object|false}
         */
        _getHandler(trigger)
        {
            for (var i = 0; i < this._pops.length; i++)
            {
                if (this._pops[i]['trigger'] === trigger) return this._pops[i];
            }

            return false;
        }

        /**
         * Remove all the popovers currently being displayed
         *
         * @access {private}
         */
        _removeAll()
        {
            for (var i = 0; i < this._pops.length; i++)
            {
                this._pops[i].remove();

                remove_class(this._pops[i].options.target, 'popped');
            }
        }
    }

    // Load into Hubble DOM core
    Hubble.dom().register('Popovers', Popovers);

}());

/**
 * Ripple click animation
 *
 * @author    {Joe J. Howard}
 * @copyright {Joe J. Howard}
 * @license   {https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE}
 */
(function()
{
    /**
     * Ripple handler
     * 
     * @var {object}
     */
    /**
     * Ripple handler
     * 
     * @see {https://github.com/samthor/js-ripple}
     */
    var rippleTypeAttr = 'data-event';

    /**
     * @param {string} type
     * @param {!Event|!Touch} at
     */
    function startRipple(type, at, holder)
    {
        holder = Helper.$('.js-ripple-container', holder);

        if (!holder)
        {
            return false; // ignore
        }
        
        var cl = holder.classList;

        // Store the event use to generate this ripple on the holder: don't allow
        // further events of different types until we're done. Prevents double-
        // ripples from mousedown/touchstart.
        var prev = holder.getAttribute(rippleTypeAttr);
        if (prev && prev !== type)
        {
            return false;
        }
        holder.setAttribute(rippleTypeAttr, type);

        // Create and position the ripple.
        var rect = holder.getBoundingClientRect();
        var x = at.offsetX;
        var y;
        if (x !== undefined)
        {
            y = at.offsetY;
        }
        else
        {
            x = at.clientX - rect.left;
            y = at.clientY - rect.top;
        }
        var ripple = document.createElement('div');
        var max;
        if (rect.width === rect.height)
        {
            max = rect.width * 1.412;
        }
        else
        {
            max = Math.sqrt(rect.width * rect.width + rect.height * rect.height);
        }
        var dim = max * 2 + 'px';
        ripple.style.width = dim;
        ripple.style.height = dim;
        ripple.style.marginLeft = -max + x + 'px';
        ripple.style.marginTop = -max + y + 'px';

        // Activate/add the element.
        ripple.className = 'ripple';
        holder.appendChild(ripple);
        window.setTimeout(function()
        {
            ripple.classList.add('held');
        }, 0);

        var releaseEvent = (type === 'mousedown' ? 'mouseup' : 'touchend');
        var release = function(ev)
        {
            // TODO: We don't check for _our_ touch here. Releasing one finger
            // releases all ripples.
            document.removeEventListener(releaseEvent, release);
            ripple.classList.add('done');

            // larger than animation: duration in css
            window.setTimeout(function()
            {
                holder.removeChild(ripple);
                if (!holder.children.length)
                {
                    cl.remove('active');
                    holder.removeAttribute(rippleTypeAttr);
                }
            }, 650);
        };
        document.addEventListener(releaseEvent, release);
    }

    /**
     * JS Helper reference
     * 
     * @var {object}
     */
    const Helper = Container.Helper();

    
    class Ripple
    {
        /**
         * Module constructor
         *
         * @access {public}
         * @constructor
         */
        constructor()
        {
            this._classes =
            [
                '.btn',
                '.chip',
                '.list > li',
                '.pagination li a',
                '.tab-nav li a',
                '.card-img',
                '.card-img-top',
                '.js-ripple'
            ];

            this._nodes = Helper.$All(this._classes.join(','));

            this._bind();

            return this;
        };

        /**
         * Module destructor - removes event listeners
         *
         * @access {public}
         */
        destruct()
        {
            this._unbind();

            this._nodes = [];
        }

        /**
         * Insert ripples
         *
         * @access {private}
         */
        _bind()
        {
            for (var i = 0; i < this._nodes.length; i++)
            {
                this._insertRipple(this._nodes[i]);
            }
        }

        /**
         * Remove ripples
         *
         * @access {private}
         */
        _unbind()
        {
            for (var i = 0; i < this._nodes.length; i++)
            {
                var wrapper = this._nodes[i];

                var ripples = Helper.$All('.js-ripple-container', wrapper);

                Helper.removeEventListener(wrapper, 'mousedown', this._mouseDown);

                Helper.removeEventListener(wrapper, 'touchstart', this._touchStart);

                for (var j = 0; j < ripples.length; j++)
                {
                    Helper.remove_from_dom(ripples[j]);
                }
            }
        }

        /**
         * Insert ripple
         *
         * @access {private}
         * @param  {DOMElement}    wrapper
         */
        _insertRipple(wrapper)
        {
            // If this is a user-defined JS-Ripple we need to insert it
            var rip  = document.createElement('span');
                
            rip.className = 'ripple-container js-ripple-container';

            if (Helper.has_class(wrapper, 'chip'))
            { 
                rip.className = 'ripple-container fill js-ripple-container';
            }
            
            Helper.preapend(rip, wrapper);

            Helper.addEventListener(wrapper, 'mousedown', this._mouseDown, true, 'foo', 'bar');

            Helper.addEventListener(wrapper, 'touchstart', this._touchStart, true, 'foo', 'bar');
      
        }

        /**
         * On mousedown
         *
         * @access {private}
         * @param  {event|null} e
         */
        _mouseDown(e)
        {
            e = e || window.event;

            if (e.button === 0)
            {
                startRipple(e.type, e, this);
            }

        }

        /**
         * On touchstart
         *
         * @access {private}
         * @param  {event|null}   e
         */
        _touchStart(e, foo, bar)
        {
            e = e || window.event;

            for (var i = 0; i < e.changedTouches.length; ++i)
            {
                startRipple(e.type, e.changedTouches[i], this);
            }
        }
    }
    
    // Load into Hubble DOM core
    Hubble.dom().register('Ripple', Ripple);

})();

(function()
{
    /**
     * JS Helper reference
     * 
     * @var {object}
     */
    const Helper = Container.Helper();

    /**
     * Input masker
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE}
     */
    class InputMasks
    {
        /**
         * Module constructor
         *
         * @constructor
         {*} @access public
         */
    	constructor()
        {
            // Private
            this._nodes_money = [];
            this._nodes_creditcard = [];
            this._nodes_numeric = [];
            this._nodes_numericDecimal = [];
            this._nodes_alphaNumeric = [];
            this._nodes_alphaSpace = [];
            this._nodes_alphaDash = [];
            this._nodes_AlphaNumericDash = [];

            // Constructor
            this._invoke();

            return this;
        }

        /**
         * Public destructor remove all masks
         *
         * @access {public}
         */
        destruct()
        {
            this._loopUnBind(this._nodes_money);
            this._loopUnBind(this._nodes_creditcard);
            this._loopUnBind(this._nodes_numeric);
            this._loopUnBind(this._nodes_numericDecimal);
            this._loopUnBind(this._nodes_alphaNumeric);
            this._loopUnBind(this._nodes_alphaSpace);
            this._loopUnBind(this._nodes_alphaDash);
            this._loopUnBind(this._nodes_AlphaNumericDash);
            this._nodes_money = [];
            this._nodes_creditcard = [];
            this._nodes_numeric = [];
            this._nodes_numericDecimal = [];
            this._nodes_alphaNumeric = [];
            this._nodes_alphaSpace = [];
            this._nodes_alphaDash = [];
            this._nodes_AlphaNumericDash = [];
        }

        /**
         * Find all the nodes and apply any masks
         *
         * @access {private}
         */
        _invoke()
        {
            // Find all the nodes
            this._nodes_money = Helper.$All('.js-mask-money');
            this._nodes_creditcard = Helper.$All('.js-mask-creditcard');
            this._nodes_numeric = Helper.$All('.js-mask-numeric');
            this._nodes_numericDecimal = Helper.$All('.js-mask-numeric-decimal');
            this._nodes_alphaNumeric = Helper.$All('.js-mask-alpha-numeric');
            this._nodes_alphaSpace = Helper.$All('.js-mask-alpha-space');
            this._nodes_alphaDash = Helper.$All('.js-mask-alpha-dash');
            this._nodes_AlphaNumericDash = Helper.$All('.js-mask-alpha-numeric-dash');

            if (!Helper.is_empty(this._nodes_money))
            {
                this._loopBind(this._nodes_money, 'money');
            }
            if (!Helper.is_empty(this._nodes_creditcard))
            {
                this._loopBind(this._nodes_creditcard, 'creditcard');
            }
            if (!Helper.is_empty(this._nodes_numeric))
            {
                this._loopBind(this._nodes_numeric, 'numeric');
            }
            if (!Helper.is_empty(this._nodes_numericDecimal))
            {
                this._loopBind(this._nodes_numericDecimal, 'numericDecimal');
            }
            if (!Helper.is_empty(this._nodes_alphaNumeric))
            {
                this._loopBind(this._nodes_alphaNumeric, 'alphaNumeric');
            }
            if (!Helper.is_empty(this._nodes_alphaSpace))
            {
                this._loopBind(this._nodes_alphaSpace, 'alphaSpace');
            }
            if (!Helper.is_empty(this._nodes_alphaDash))
            {
                this._loopBind(this._nodes_alphaDash, 'alphaDash');
            }
            if (!Helper.is_empty(this._nodes_AlphaNumericDash))
            {
                this._loopBind(this._nodes_AlphaNumericDash, 'alphaNumericDash');
            }
        }

        /**
         * Loop and bind masks to DOM LIST
         *
         * @access {private}
         */
        _loopBind(nodes, mask)
        {
            for (var i = 0; i < nodes.length; i++)
            {
                Container.get('InputMasker', nodes[i])[mask]();
            }
        }

        /**
         * Loop and unbind masks to DOM LIST
         *
         * @access {private}
         */
        _loopUnBind(nodes)
        {
            for (var i = 0; i < nodes.length; i++)
            {
                Container.get('InputMasker', nodes[i]).remove();
            }
        }
    }

    // Load into Hubble DOM core
    Hubble.dom().register('InputMasks', InputMasks);

}());

(function()
{
    /**
     * Helper instance
     * 
     * @var {object}
     */
    const Helper = Container.Helper();

    /**
     * Message closers
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE}
     */
    class MessageClosers
    {
        /**
         * Module constructor
         *
         * @constructor
         {*} @access public
         */
        constructor()
        {
            this._triggers = Helper.$All('.js-close-msg');

            if (!Helper.is_empty(this._triggers))
            {
                this._bind();
            }

            return this;
        }

        /**
         * Module destructor - removes event listeners
         *
         * @constructor
         {*} @access public
         */
        destruct()
        {
            this._unbind();

            this._triggers = [];
        }

        /**
         * Event binder - Binds all events on button click
         *
         * @access {private}
         */
        _bind()
        {
            Helper.addEventListener(this._triggers, 'click', this._eventHandler);
        }

        /**
         * Event ubinder - Binds all event handlers on button click
         *
         * @access {private}
         */
        _unbind()
        {
            Helper.removeEventListener(this._triggers, 'click', this._eventHandler);
        }

        /**
         * Event handler - handles removing the message
         *
         * @param  {event}   e JavaScript click event
         * @access {private}
         */
        _eventHandler(e)
        {
            e = e || window.event;

            e.preventDefault();

            var toRemove = Helper.closest(this, '.msg');

            if (Helper.has_class(this, 'js-rmv-parent'))
            {
                toRemove = toRemove.parentNode;
            }

            Helper.animate_css(toRemove, { opacity: 0, duration: 500, easing: 'easeInOutCubic', callback: function()
            {                
                Helper.remove_from_dom(toRemove);
            }});
        }
    }

    // Load into Hubble DOM core
    Hubble.dom().register('MessageClosers', MessageClosers);

})();

(function()
{
    /**
     * Helper instance
     * 
     * @var {object}
     */
    const Helper = Container.Helper();

    /**
     * Has the page loaded?
     * 
     * @var {object}
     */
    var pageLoaded = false;

    /**
     * Waypoints
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE}
     */
    class WayPoints
    {
        /**
         * Module constructor
         *
         * @constructor
         {*} @access public
         */
    	constructor()
        {    // Load nodes
            this._nodes = Helper.$All('.js-waypoint-trigger');

            // bind listeners
            if (!Helper.is_empty(this._nodes))
            {
                for (var i = 0; i < this._nodes.length; i++)
                {
                    this._bind(this._nodes[i]);
                }
            }

            // Invoke pageload
            if (!pageLoaded)
            {
                this._invokePageLoad();
            }

            return this;
        }

        /**
         * Module destructor
         *
         * @access {public}
         */
        destruct()
        {
            // Unbind listeners
            for (var i = 0; i < this._nodes.length; i++)
            {
                this._unbind(this._nodes[i]);
            }

            // Clear Nodes
            this._nodes = [];
        }

        /**
         * Event binder
         *
         * @params {trigger} node
         * @access {private}
         */
        _bind(trigger)
        {
            Helper.addEventListener(trigger, 'click', this._eventHandler);
        }

        /**
         * Event unbinder
         *
         * @params {trigger} node
         * @access {private}
         */
        _unbind(trigger)
        {
            Helper.removeEventListener(trigger, 'click', this._eventHandler);
        }

        /**
         * Event handler
         *
         * @param {event|null} e JavaScript click event
         * @access {private}
         */
        _eventHandler(e)
        {
            e = e || window.event;
            e.preventDefault();
            var trigger = this;
            var waypoint = trigger.dataset.waypointTarget;
            var targetEl = Helper.$('[data-waypoint="' + waypoint + '"]');

            if (Helper.in_dom(targetEl))
            {
                var id = waypoint;
                var speed = typeof trigger.dataset.waypointSpeed !== "undefined" ? trigger.dataset.waypointSpeed : 500;
                var easing = typeof trigger.dataset.waypointEasing !== "undefined" ? trigger.dataset.waypointEasing : 'easeInOutCubic';
                targetEl.id = id;

                var options = {
                    easing: easing,
                    speed: speed,
                };

                Container.get('SmoothScroll').animateScroll('#' + id, trigger, options);
            }
        }

        /**
         * Scroll to a element with id when the page loads
         *
         * @access {private}
         */
        _invokePageLoad()
        {
            var url = Helper.parse_url(window.location.href);

            if (url.hash && url.hash !== '')
            {
                var waypoint = Helper.trim(url.hash, '/');
                var options = {
                    speed: 100,
                    easing: 'Linear'
                };
                var targetEl = Helper.$('[data-waypoint="' + waypoint + '"]');

                if (Helper.in_dom(targetEl))
                {
                    var id = waypoint;
                    targetEl.id = id;
                    Container.get('SmoothScroll').animateScroll('#' + id, null, options);
                }
            }

            pageLoaded = true;
        }
    }


    // Load into Hubble DOM core
    Hubble.dom().register('WayPoints', WayPoints);

}());

(function()
{
    /**
     * JS Helper reference
     * 
     * @var {object}
     */
    const Helper = Container.Helper();

    /**
     * Adds classes to inputs
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE}
     */
    class Inputs
    {
        /**
         * Module constructor
         *
         * @access {public}
         * @constructor
         */
    	constructor()
        {
            this._inputs = Helper.$All('.form-field input, .form-field select, .form-field textarea');
            this._labels = Helper.$All('.form-field label');

            if (!Helper.is_empty(this._inputs))
            {
                this._bind();
            }

            return this;
        }

        /**
         * Module destructor - removes event listeners
         *
         * @access {public}
         */
        destruct()
        {
            this._unbind();

            this._inputs = [];
        }

        /**
         * Event binder
         *
         * @access {private}
         */
        _bind()
        {
            Helper.addEventListener(this._labels, 'click', this._onLabelClick);
            Helper.addEventListener(this._inputs, 'click', this._eventHandler);
            Helper.addEventListener(this._inputs, 'focus', this._eventHandler);
            Helper.addEventListener(this._inputs, 'blur', this._eventHandler);
            Helper.addEventListener(this._inputs, 'change', this._eventHandler);
            Helper.addEventListener(this._inputs, 'input', this._eventHandler);
            Helper.addEventListener(this._inputs, 'hover', this._eventHandler);
        }

        /**
         * Event ubinder
         *
         * @access {private}
         */
        _unbind()
        {
            Helper.removeEventListener(this._labels, 'click', this._onLabelClick);
            Helper.removeEventListener(this._inputs, 'click', this._eventHandler);
            Helper.removeEventListener(this._inputs, 'focus', this._eventHandler);
            Helper.removeEventListener(this._inputs, 'blur', this._eventHandler);
            Helper.removeEventListener(this._inputs, 'change', this._eventHandler);
            Helper.removeEventListener(this._inputs, 'input', this._eventHandler);
            Helper.removeEventListener(this._inputs, 'hover', this._eventHandler);
        }

        /**
         * Event handler
         *
         * @access {private}
         * @params {event|null} e Browser click event
         */
        _onLabelClick(e)
        {
            e = e || window.event;

            var input = Helper.$('input', this.parentNode);

            if (Helper.in_dom(input))
            {
                input.focus();

                return;
            }

            var input = Helper.$('select', this.parentNode);

            if (Helper.in_dom(input))
            {
                input.focus();

                return;
            }

            var input = Helper.$('textarea', this.parentNode);

            if (Helper.in_dom(input))
            {
                input.focus();

                return;
            }
        }

        /**
         * Event handler
         *
         * @access {private}
         * @params {event|null} e Browser click event
         */
        _eventHandler(e)
        {
            e = e || window.event;

            if (e.type === 'click')
            {
                this.focus();
            }
            else if (e.type === 'focus')
            {
                Helper.add_class(this.parentNode, 'focus');
            }
            else if (e.type === 'blur')
            {
                Helper.remove_class(this.parentNode, 'focus');
            }

            if (e.type === 'change' || e.type === 'input' || e.type === 'blur')
            {
                var _value = Helper.input_value(this);

                if (_value === '')
                {
                    Helper.remove_class(this.parentNode, 'not-empty');
                    Helper.add_class(this.parentNode, 'empty');
                }
                else
                {
                    Helper.remove_class(this.parentNode, 'empty');
                    Helper.add_class(this.parentNode, 'not-empty');
                }
            }
        }
    }

    // Load into Hubble DOM core
    Hubble.dom().register('Inputs', Inputs);

})();

(function()
{
    /**
     * JS Helper reference
     * 
     * @var {object}
     */
    const Helper = Container.Helper();

    /**
     * File inputs
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE}
     */
    class FileInput
    {
        /**
         * Module constructor
         *
         * @constructor
         {*} @access public
         */
    	constructor()
        {
            this._nodes = Helper.$All('.js-file-input');

            this._bind();

            return this;
        }

        /**
         * Module destructor remove event handlers
         *
         * @access {public}
         */
        destruct()
        {
            this._unbind();

            this._nodes = [];
        }

        /**
         * Bind DOM listeners
         *
         * @access {public}
         */
        _bind()
        {
            Helper.addEventListener(this._nodes, 'change', this._eventHandler);
        }

        /**
         * Unbind DOM listeners
         *
         * @access {public}
         */
        _unbind()
        {
            Helper.removeEventListener(this._nodes, 'change', this._eventHandler);
        }

        /**
         * Handle the change event
         *
         * @access {private}
         */
        _eventHandler()
        {
            var fileInput = this;
            var wrap = Helper.closest(fileInput, '.js-file-field');
            var showInput = Helper.$('.js-file-text', wrap);
            var fullPath = fileInput.value;
            if (fullPath)
            {
                var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
                var filename = fullPath.substring(startIndex);
                if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0)
                {
                    filename = filename.substring(1);
                }
                showInput.value = filename;
            }
        }
    }

    // Load into Hubble DOM core
    Hubble.dom().register('FileInput', FileInput);

}());

(function()
{
    /**
     * JS Helper reference
     * 
     * @var {object}
     */
    const Helper = Container.Helper();

    /**
     * Chip inputs
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE}
     */
    class ChipInputs
    {
        /**
         * Module constructor
         *
         * @constructor
         {*} @access public
         */
    	constructor()
        {
            this._wrappers = Helper.$All('.js-chips-input');

            this._bind();

            return this;
        }

        /**
         * Module destructor remove event handlers
         *
         * @access {public}
         */
        destruct()
        {
            this._unbind();

            this._wrappers = [];
        }

        /**
         * Bind DOM listeners
         *
         * @access {private}
         */
        _bind()
        {
            for (var i = 0; i < this._wrappers.length; i++)
            {
                this._initInput(this._wrappers[i]);
            }
        }

        /**
         * Unbind DOM listeners
         *
         * @access {private}
         */
        _unbind()
        {
            for (var i = 0; i < this._wrappers.length; i++)
            {
                this._destroy(this._wrappers[i]);
            }
        }

        /**
         * Init a chips input
         *
         * @access {private}
         * @param  {DOMElement}    _wrapper
         */
        _initInput(_wrapper)
        {
            var _removeBtns = Helper.$All('.chip .remove-icon', _wrapper);
            var _input = Helper.$('.js-chip-input', _wrapper);

            Helper.addEventListener(_removeBtns, 'click', this._removeChip);

            Helper.addEventListener(_input, 'keyup', this._onKeyUp);

            if (Helper.closest(_input, 'form'))
            {
                Helper.addEventListener(_input, 'keydown', this._preventSubmit);
            }
        }

        /**
         * Destroy chip listeners
         *
         * @access {private}
         * @param  {DOMElement}    _wrapper
         */
        _destroy(_wrapper)
        {
            var _removeBtns = Helper.$All('.chip .remove-icon', _wrapper);
            var _input = Helper.$('.js-chip-input', _wrapper);

            Helper.removeEventListener(_removeBtns, 'click', this._removeChip);

            Helper.removeEventListener(_input, 'keyup', this._onKeyUp);

            if (Helper.closest(_input, 'form'))
            {
                Helper.removeEventListener(_input, 'keydown', this._preventSubmit);
            }
        }

        /**
         * Prevent the form from submitting if it's part of a form
         *
         * @access {private}
         * @param  {event|null} e
         */
        _preventSubmit(e)
        {
            e = e || window.event;

            var _key = e.code || e.key || e.keyCode || e.charCode;

            if (_key == 'Enter' || _key === 13)
            {
                e.preventDefault();

                return false;
            }
            // Backspace
            else if (_key == 'Delete' || _key == 'Backspace' || _key == 8 || _key == 46)
            {
                if (this.value === '')
                {
                    var _wrapper = Helper.closest(this, '.js-chips-input');

                    Container.ChipInputs()._removeLastChip(_wrapper);
                }
            }
        }

        /**
         * Handle pressing enter to insert the chip
         *
         * @access {private}
         * @param  {event|null} e
         */
        _onKeyUp(e)
        {
            e = e || window.event;

            var _key = e.code || e.key || e.keyCode || e.charCode;

            // Enter
            if (_key == 'Enter' || _key === 13)
            {
                var _this = Container.ChipInputs();

                var _wrapper = Helper.closest(this, '.js-chips-input');

                var _value = Helper.input_value(this).trim();

                if (!Helper.in_array(_value, _this._getChipsValues(_wrapper)) && _value !== '')
                {
                    _this.addChip(_value, _wrapper);

                    this.value = '';
                }
            }
        }

        /**
         * Remove last chip
         *
         * @access {private}
         * @param  {DOMElement}    _wrapper
         */
        _removeLastChip(_wrapper)
        {
            var _chips = Helper.$All('.chip', _wrapper);

            if (!Helper.is_empty(_chips))
            {
                Helper.remove_from_dom(_chips.pop());
            }
        }

        /**
         * Insert new chip
         *
         * @access {public}
         * @param  {string}      _value
         * @param  {DOMElement}        _wrapper
         * @param  {string|bool} _icon
         */
        addChip(_value, _wrapper, _icon)
        {
            _icon = typeof _icon === 'undefined' ? false : _icon;
            var _name = _wrapper.dataset.inputName;
            var _chip = document.createElement('span');
            var _children = Helper.first_children(_wrapper);
            var _classes = _wrapper.dataset.chipClass;
            var _iconStr = '';

            if (_classes)
            {
                _chip.className += ' ' + _classes;
            }

            if (_icon)
            {
                _iconStr = '<span class="chip-icon"><span class="glyph-icon glyph-icon-' + _iconclass + '"></span></span>';
            }

            _chip.className = 'chip';
            _chip.innerHTML = _iconStr + '<span class="chip-text">' + _value + '</span><span class="remove-icon"></span><input type="hidden" value="' + _value + '" name="' + _name + '">';

            _wrapper.insertBefore(_chip, _children.pop());

            Helper.addEventListener(_chip.querySelector('.remove-icon'), 'click', this._removeChip);
        }

        /**
         * Remove an existing chip
         *
         * @access {private}
         * @param  {event|null} e
         */
        _removeChip(e)
        {
            e = e || window.event;

            Helper.remove_from_dom(Helper.closest(this, '.chip'));
        }

        /**
         * Get all values from chip input
         *
         * @access {private}
         * @param  {DOMElement}    _wrapper
         * @return {array}
         */
        _getChipsValues(_wrapper)
        {
            var _result = [];

            var _chips = Helper.$All('.chip input', _wrapper);

            for (var i = 0; i < _chips.length; i++)
            {
                _result.push(Helper.input_value(_chips[i]));
            }

            return _result;
        }
    }

    // Load into Hubble DOM core
    Hubble.dom().register('ChipInputs', ChipInputs);

}());

(function()
{
    /**
     * JS Helper reference
     * 
     * @var {object}
     */
    const Helper = Container.Helper();

    /**
     * Chip suggestions.
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE}
     */
    class ChipSuggestions
    {
        /**
         * Module constructor
         *
         * @constructor
         {*} @access public
         */
    	constructor()
        {
            this._chips = Helper.$All('.js-chip-suggestions .chip');

            this._bind();

            return this;
        }

        /**
         * Module destructor remove event handlers
         *
         * @access {public}
         */
        destruct()
        {
            this._unbind();

            this._chips = [];
        }

        /**
         * Bind DOM listeners
         *
         * @access {private}
         */
        _bind()
        {
            Helper.addEventListener(this._chips, 'click', this._clickHandler);
        }

        /**
         * Unbind DOM listeners
         *
         * @access {private}
         */
        _unbind()
        {
            Helper.removeEventListener(this._chips, 'click', this._clickHandler);
        }

        /**
         * Chip click handler
         *
         * @access {private}
         * @param  {event|null} e
         */
        _clickHandler(e)
        {
            e = e || window.event;

            var _wrapper = Helper.closest(this, '.js-chip-suggestions');
            var _id = _wrapper.dataset.inputTarget;
            var _input = Helper.$('#' + _id);
            var _text = this.innerText.trim();

            if (!_input || !Helper.in_dom(_input))
            {
                throw new Error('Target node does not exist.');

                return false;
            }

            // Chips input
            if (Helper.has_class(_input, 'js-chips-input'))
            {
                Container.ChipInputs().addChip(_text, _input);

                Helper.remove_from_dom(this);

                return;
            }


            var _chip = document.createElement('span');
            var _classes = _wrapper.dataset.chipClass;
            var _space = '';
            _chip.className = 'chip';

            if (_classes)
            {
                _chip.className += _classes;
            }

            if (_input.value !== '')
            {
                _space = ' ';
            }

            _input.value += _space + _text;

            Helper.remove_from_dom(this);
        }
    }

    // Load into Hubble DOM core
    Hubble.dom().register('ChipSuggestions', ChipSuggestions);

}());

(function()
{
    const [$, $All, add_class, addEventListener, closest, has_class, remove_class, removeEventListener] = Container.import(['$', '$All', 'add_class', 'addEventListener', 'closest', 'has_class', 'remove_class', 'removeEventListener']).from('Helper');

    /**
     * Choice chips
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE}
     */
    class ChoiceChips
    {
        /**
         * Module constructor
         *
         * @constructor
         {*} @access public
         */
        constructor()
        {
            this._chips = $All('.js-choice-chips .chip');

            this._bind();

            return this;
        }

        /**
         * Module destructor remove event handlers
         *
         * @access {public}
         */
        destruct()
        {
            this._unbind();

            this._chips = [];
        }

        /**
         * Bind DOM listeners
         *
         * @access {private}
         */
        _bind()
        {
            addEventListener(this._chips, 'click', this._clickHandler);
        }

        /**
         * Unbind DOM listeners
         *
         * @access {private}
         */
        _unbind()
        {
            removeEventListener(this._chips, 'click', this._clickHandler);
        }

        /**
         * Handle click event on chip
         *
         * @access {private}
         * @param  {event|null} e
         */
        _clickHandler(e)
        {
            e = e || window.event;

            var _wrapper = closest(this, '.js-choice-chips');
            var _input = $('.js-choice-input', _wrapper);

            if (!has_class(this, 'selected'))
            {                
                remove_class($('.chip.selected', _wrapper), 'selected');

                add_class(this, 'selected');

                if (_input)
                {
                    _input.value = this.dataset.value;

                    Container.Events().fire('Chips:selected', [this.dataset.value, !has_class(this, 'selected')]);
                }
            }
        }
    }

    // Load into Hubble DOM core
    Hubble.dom().register('ChoiceChips', ChoiceChips);

}());

(function()
{
    /**
     * JS Helper reference
     * 
     * @var {object}
     */
    const Helper = Container.Helper();

    /**
     * Filter chips
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE}
     */
    class FilterChips
    {
        /**
         * Module constructor
         *
         * @constructor
         {*} @access public
         */
    	constructor()
        {
            this._chips = Helper.$All('.js-filter-chips .chip');

            this._bind();

            return this;
        }

        /**
         * Module destructor remove event handlers
         *
         * @access {public}
         */
        destruct()
        {
            this._unbind();

            this._chips = [];
        }

        /**
         * Bind DOM listeners
         *
         * @access {private}
         */
        _bind()
        {
            Helper.addEventListener(this._chips, 'click', this._clickHandler);
        }

        /**
         * Unbind DOM listeners
         *
         * @access {private}
         */
        _unbind()
        {
            Helper.removeEventListener(this._chips, 'click', this._clickHandler);
        }

        /**
         * Handle click event on chip
         *
         * @access {private}
         * @param  {event|null} e
         */
        _clickHandler(e)
        {
            e = e || window.event;

            Container.Events().fire('Chips:selected', [this.dataset.value, !Helper.has_class(this, 'checked')]);

            Helper.toggle_class(this, 'checked');
        }
    }

    // Load into Hubble DOM core
    Hubble.dom().register('FilterChips', FilterChips);

}());

(function()
{
    /**
     * JS Helper reference
     * 
     * @var {object}
     */
    const Helper = Container.Helper();

    /**
     * Clicking one element triggers a lick on another
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE}
     */
    class ClickTriggers
    {
        /**
         * Module constructor
         *
         * @access {public}
         * @constructor
         */
    	constructor()
        {
            /**
             * List of click-triggers
             * 
             * @var {array}
             */
            this._containers = Helper.$All('.js-click-trigger');

            if (!Helper.is_empty(this._containers))
            {
                this._bind();
            }

            return this;
        }

        /**
         * Module destructor - removes event listeners
         *
         * @access {public}
         */
        destruct()
        {
            this._unbind();

            this._containers = [];
        }

        /**
         * Event binder - Binds all events on button click
         *
         * @access {private}
         */
        _bind()
        {
            Helper.addEventListener(this._containers, 'click', this._eventHandler);
        }

        /**
         * Event ubinder - Binds all event handlers on button click
         *
         * @access {private}
         */
        _unbind()
        {
            Helper.removeEventListener(this._containers, 'click', this._eventHandler);
        }

        /**
         * Event handler
         *
         * @access {private}
         * @params {event|null} e Browser click event
         */
        _eventHandler(e)
        {
            e = e || window.event;

            if (Helper.is_node_type(this, 'a'))
            {
                e.preventDefault();
            }

            var clicked = this;
            var targetEl = Helper.$(clicked.dataset.clickTarget);

            if (Helper.in_dom(targetEl))
            {
                Helper.trigger_event(targetEl, 'click');
            }
        }
    }

    // Load into Hubble DOM core
    Hubble.dom().register('ClickTriggers', ClickTriggers);

})();

/**
 * Modal
 *
 * The Modal class is a utility class used to
 * display a Backdrop.
 *
 */
(function()
{
    /**
     * @var {obj}
     */
    const _ = Container.Helper();

    /**
     * Cached so we can throttle later.
     * 
     * @var {function}
     */
    const RESIZE_HANDLER = throttle(function() { Container.Backdrop().resize() }, 100);

    /**
     * @var {obj}
     */
    var BACKDROP_OPEN = false;

    /**
     * @var {obj}
     */
    const DEFAULTS =
    {
        noScroll:          true,
        pushBody:          false,
        direction:         'top',
        height:            'auto',
        width:             '100%',

        onOpen:            () => { },
        onOpenArgs:        null,
        onClose:           () => { },
        onCloseArgs:       null,
        validateClose:     () => { return true; },
        validateCloseArgs: null
    };

    class Backdrop
    {
        
        /**
         * Module constructor
         *
         * @class
         * @constructor
         * @params {options} obj
         * @access {public}
         * @return {this}
         */
        constructor()
        {
            this._DOMElementopenBtns  = _.$All('.js-backdrop-open-trigger');
            this._DOMElementCloseBtns = _.$All('.js-backdrop-close-trigger');
            this._DOMElementBackdrop  = _.$('.js-backdrop-wrapper');
            this._DOMElementPageWrap  = _.$('.js-backdrop-page-wrapper');
            
            if (!_.is_empty(this._DOMElementopenBtns))
            {
                this._bind();
            }

            this._setOptions();
        }

        /**
         * Module destructor
         *
         * @access {public}
         */
        destruct()
        {
            this.close();

            this._unbind();

            this._DOMElementopenBtns = [];

            this._DOMElementCloseBtns = [];
        }

        /**
         * Bind click listener to containers
         *
         * @access {private}
         */
        _bind()
        {
            _.addEventListener(this._DOMElementopenBtns, 'click', this._clickHandler);

            _.addEventListener(this._DOMElementCloseBtns, 'click', this.close);
        }

        /**
         * Unbind listener to containers
         *
         * @access {private}
         */
        _unbind()
        {
            _.removeEventListener(this._DOMElementopenBtns, 'click', this._clickHandler);

            _.removeEventListener(this._DOMElementCloseBtns, 'click', this.close);

            _.removeEventListener(window, 'resize', RESIZE_HANDLER);

            this._DOMElementopenBtns = [];

            this._DOMElementCloseBtns = [];
        }

        /**
         * Open the backdrop.
         *
         * @access {public}
         * @param  {object} options Options (optional)
         */
        open(options)
        {
            const DOMElementBackdrop = this._DOMElementBackdrop;
            const DOMElementPageWrap = this._DOMElementPageWrap;

            if (!_.in_dom(this._DOMElementBackdrop))
            {
                console.error('Backdrop Error: The backdrop wrapper was not found in the DOM.');
            }
            else if (!_.in_dom(this._DOMElementPageWrap))
            {
                console.error('Backdrop Error: The backdrop page wrapper was not found in the DOM.');
            }
            else if (BACKDROP_OPEN)
            {
                return;
            }

            // Backdrop now open
            BACKDROP_OPEN = true;

            // Merge options if provided
            if (options) this._setOptions(options);

            // Set width and heights
            _.css(DOMElementBackdrop, 'height', this.height);
            _.css(DOMElementBackdrop, 'width', this.width);

            // Make backdrop visible
            _.add_class(DOMElementBackdrop, 'backdrop-open');

            // Push body down
            /*if (this.pushBody)
            {
                _.add_class(this._DOMElementBackdrop, 'backdrop-open');
                _.add_class(this._DOMElementBackdrop, 'backdrop-push-body');

                _.animate_css(this._DOMElementBackdrop, { top: '0px', duration: 300 });
                _.animate_css(this._DOMElementPageWrap, { transform: `translateY(${fromTop})`, duration: 300 });
            }*/

            // Set backdrop to position top, left, bottom, right

            // Push backdrop in
            _.animate_css(DOMElementBackdrop, { 
                [this.direction]: { from: '-50px', to: '0px', duration: 350, easing: 'easeOutCirc'},
                opacity:          { from: '0', to: '1', duration: 350, easing: 'easeOutCirc'}
            });

        
            // No scrolling
            if (this.noScroll)
            {
                _.add_class([document.documentElement, document.body], 'no-scroll');
            }

            /*
           

            // Open classes
            _.add_class(this._DOMElementBackdrop, 'backdrop-open');
            _.add_class(this._DOMElementPageWrap, 'backdrop-open');

            // Resize handler
            _.addEventListener(window, 'resize', RESIZE_HANDLER);*/
            
            this._fireOpen();
        }

        /**
         * Close the backdrop.
         *
         * @access {public}
         * @param  {object} options Options (optional)
         */
        close()
        {
            if (this.pushBody)
            {
                /*_.animate_css(this._DOMElementBackdrop, { transform: `translateY(0)`});
                _.animate_css(this._DOMElementPageWrap, { transform: `translateY(0)`});*/
            }
            else
            {

            }

            /*_.remove_class(this._DOMElementBackdrop, ['backdrop-push-body', 'backdrop-open']);
            _.remove_class(this._DOMElementPageWrap, 'backdrop-open');
            _.remove_class([document.documentElement, document.body], 'no-scroll');*/

            if (this._fireValidateClose())
            {
                this._fireClose();

                BACKDROP_OPEN = false;
            }
        }

        /**
         * Update the the sizing
         *
         */
        resize()
        {
            if (this.pushBody)
            {
                //_.css(this._DOMElementPageWrap, 'transform', `translateY(${_.height(this._DOMElementBackdrop)}px)`);
            }
        }

        /**
         * Set options from open/close call.
         *
         * @access {private}
         * @param  {object} options Options (optional)
         */
        _setOptions(options)
        {
            options = _.is_object(options) ? _.array_merge({}, DEFAULTS, options) : _.array_merge({}, DEFAULTS);

            _.each(options, function(k, v)
            {
                this[k] = v;

            }, this);

        }

        /**
         * Fire render event
         *
         * @access {private}
         */
        _fireOpen()
        {
            this.onOpen.apply(this._DOMElementBackdrop, this.onOpenArgs);
        }

        /**
         * Fire the closed event
         *
         * @access {private}
         */
        _fireClose()
        {
            this.onClose.apply(this._DOMElementBackdrop, this.onCloseArgs);
        }

        /**
         * Fire the confirm validation
         *
         * @access {private}
         */
        _fireValidateClose()
        {
            return this.validateClose.apply(this._DOMElementBackdrop, this.validateCloseArgs);
        }
    }

    // Load into container 
    Hubble.dom().register('Backdrop', Backdrop);

    /*window.addEventListener('DOMReady', function()
    {
        setTimeout(function()
        {
            Container.Backdrop().open();

        }, 1000);
    });*/

   /* setTimeout(function()
    {
        Container.Backdrop().close();
    }, 5000);*/

})();

(function()
{
    /**
     * JS Helper reference
     * 
     * @var {object}
     */
    const Helper = Container.Helper();

    
    /**
     * Image zoom hover
     * 
     */
    class ImageZoom
    {
        /**
         * Module constructor
         *
         * @constructor
         {*} @access public
         */
    	constructor()
        {
            this._nodes = Helper.$All('.js-img-hover-zoom');

            this._bind();

            return this;
        }

        /**
         * Module destructor remove event handlers
         *
         * @access {public}
         */
        destruct()
        {
            this._unbind();

            this._nodes = [];
        }

        /**
         * Bind DOM listeners
         *
         * @access {public}
         */
        _bind()
        {
            for (var i = 0; i < this._nodes.length; i++)
            {
                Helper.css(this._nodes[i], 'background-image', 'url(' + this._nodes[i].dataset.zoomSrc + ')');

                Helper.addEventListener(this._nodes[i], 'mousemove', this._onHover);

                Helper.$('img', this._nodes[i]).alt = '';

                Helper.$('img', this._nodes[i]).title = '';
            }
        }

        /**
         * Unbind DOM listeners
         *
         * @access {public}
         */
        _unbind()
        {
            Helper.removeEventListener(this._nodes, 'mousemove', this._onHover);
        }

        /**
         * On hover event
         *
         * @param  {e} event|null "mousemove" event
         * @access {private}
         */
        _onHover(e)
        {
            e = e || window.event;

            if (!e || !e.currentTarget)
            {
                return false;
            }

            var _wrapper = e.currentTarget;
            var _zoomSrc = Helper.parse_url(Helper.rendered_style(_wrapper, 'background-image').replace('url(', '').replace(')', ''));
            var _dataZoomSrc = Helper.parse_url(_wrapper.dataset.zoomSrc);

            if (_zoomSrc.path !== _dataZoomSrc.path)
            {
                Helper.css(_wrapper, 'background-image', 'url(' + _wrapper.dataset.zoomSrc + ')');
            }

            var offsetX = 0;
            var offsetY = 0;
            if (e.offsetX)
            {
                offsetX = e.offsetX;
            }
            else if (e.touches && e.touches[0] && e.touches[0].pageX)
            {
                offsetX = e.touches[0].pageX;
            }
            else
            {
                return false;
            }

            if (e.offsetY)
            {
                offsetY = e.offsetY;
            }
            else if (e.touches && e.touches[0] && e.touches[0].pageY)
            {
                offsetY = e.touches[0].pageY;
            }
            else
            {
                return false;
            }

            x = offsetX / _wrapper.offsetWidth * 100;
            y = offsetY / _wrapper.offsetHeight * 100;


            Helper.css(_wrapper, 'background-position', x + '% ' + y + '%');
        }
    }

    // Register as DOM Module and invoke
    Hubble.dom().register('ImageZoom', ImageZoom);

}());


// Boot Hubble
/**
 * Boot and initialize Hubble core
 *
 * @author    {Joe J. Howard}
 * @copyright {Joe J. Howard}
 * @license   {https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE}
 */
(function()
{
    Container.get('Hubble').boot();

    var hubbleReady = new CustomEvent('HubbleReady',
    {
        detail: Container.get('Hubble')
    });

    window.dispatchEvent(hubbleReady);
})();

