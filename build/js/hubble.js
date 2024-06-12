// Polyfills
/**
 * A fix to allow you to use window.location.origin consistently
 *
 * @see https://tosbourn.com/a-fix-for-window-location-origin-in-internet-explorer/
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
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent#Polyfill
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
 * @see Underscore.js 1.9.1
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
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes
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
 * @author Chris Ferdinandi
 * @license MIT
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
 * @var obj
 * @source https://gist.github.com/1129031
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


// Container
/**
 * JS IoC Container
 *
 * @author    Joe J. Howard
 * @copyright Joe J. Howard
 * @license   https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE
 */
(function(window)
{
    /**
     * Module constructor
     *
     * @class
     * @constructor
     * @access public
     */
    var ArrayHelper = function()
    {
        return this;
    };

    /**
     * Set a key using dot/bracket notation on an object or array
     *
     * @access public
     * @param  string       path   Path to set
     * @param  mixed        value  Value to set
     * @param  object|array object Object to set into
     * @return object|array
     */
    ArrayHelper.prototype.set = function(path, value, object)
    {
        this._setRecursive(this._keySegment(path), value, object);

        return object;
    }

    /**
     * Gets an from an array/object using dot/bracket notation
     *
     * @access public
     * @param  string       path   Path to get
     * @param  object|array object Object to get from
     * @return mixed
     */
    ArrayHelper.prototype.get = function(path, object)
    {
        return this._getRecursive(this._keySegment(path), object);
    }

    /**
     * Checks if array/object contains path using dot/bracket notation
     *
     * @access public
     * @param  string       path   Path to check
     * @param  object|array object Object to check on
     * @return bool
     */
    ArrayHelper.prototype.has = function(path, object)
    {
        return typeof this.get(path, object) !== 'undefined';
    }

    /**
     * Deletes from an array/object using dot/bracket notation
     *
     * @access public
     * @param  string       path   Path to delete
     * @param  object|array object Object to delete from
     * @return object|array
     */
    ArrayHelper.prototype.delete = function(path, object)
    {
        this._deleteRecursive(this._keySegment(path), object);

        return object;
    }

    /**
     * Recursively delete from array/object
     *
     * @access private
     * @param  array        keys   Keys in search order
     * @param  object|array object Object to get from
     * @return mixed
     */
    ArrayHelper.prototype._deleteRecursive = function(keys, object)
    {
        var key = keys.shift();
        var islast = keys.length === 0;

        if (islast)
        {
            if (Object.prototype.toString.call(object) === '[object Array]')
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

        return this._deleteRecursive(keys, object[key]);

    }

    /**
     * Recursively search array/object
     *
     * @access private
     * @param  array        keys   Keys in search order
     * @param  object|array object Object to get from
     * @return mixed
     */
    ArrayHelper.prototype._getRecursive = function(keys, object)
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

        return this._getRecursive(keys, object[key]);
    }

    /**
     * Recursively set array/object
     *
     * @access private
     * @param  array        keys   Keys in search order
     * @param  mixed        value  Value to set
     * @param  parent       object|array or null
     * @param  object|array object Object to set on
     */
    ArrayHelper.prototype._setRecursive = function(keys, value, object, nextKey)
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
            if (Object.prototype.toString.call(object) === '[object Array]' && typeof key === 'string')
            {
                var converted = Object.assign(
                {}, object);

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

        this._setRecursive(keys, value, object, key);
    }

    /**
     * Segments an array/object path using dot notation
     *
     * @access private
     * @param  string  path Path to parse
     * @return array
     */
    ArrayHelper.prototype._keySegment = function(path)
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

    var Arr = new ArrayHelper;

    /**
     * Module constructor
     *
     * @class
     * @constructor
     * @access public
     */
    var Container = function()
    {
        this.data = {};

        this.singletons = {};

        return this;
    };

    /**
     * Set data key to value
     *
     * @access public
     * @param string key   The data key
     * @param mixed  value The data value
     */
    Container.prototype.set = function(key, value)
    {
        if (key.includes('.') || key.includes('['))
        {
            Arr.set(key, value, this.data);
        }
        else
        {
            this.data[key] = value;

            this._setProto(key, this._isInvokable(value) || this._isInvoked(value));
        }
    }

    /**
     * Sets the key as a prototype method
     *
     * @access public
     * @param  string key   The data key
     * @return mixed
     */
    Container.prototype._setProto = function(key, invokable)
    {
        var _this = this;

        var _key = this._normalizeKey(key);

        var _proto = Object.getPrototypeOf(this);

        _proto[_key] = function()
        {
            var args = Array.prototype.slice.call(arguments);

            args.unshift(key);

            if (invokable)
            {
                return _this.get.apply(_this, args);
            }

            return _this.get(key);
        };
    }

    /**
     * Remove a key/value
     *
     * @access public
     * @param string key   The data key
     */
    Container.prototype.delete = function(key)
    {
        if (key.includes('.') || key.includes('['))
        {
            Arr.delete(key, this.data);

            return;
        }

        delete this.data[key];

        key = this._normalizeKey(key);

        var _proto = Object.getPrototypeOf(this);

        if (typeof _proto[key] !== 'undefined')
        {
            _proto[key] = null;
        }
    }

    /**
     * Stores a globally unique singleton
     *
     * @access public
     * @param  string key      The value or object name
     * @param  object classObj The closure that defines the object
     * @return this
     */
    Container.prototype.singleton = function(key, classObj)
    {
        if (key.includes('.') || key.includes('['))
        {
            throw new Error('Cannot set singletons using dot notation.');
        }

        var args = this._normalizeArgs(arguments);

        var instance;

        if (this._isInvoked(classObj))
        {
            instance = classObj;
        }

        this.singletons[key] = true;

        this.set(key, function()
        {
            if (!instance)
            {
                if (!this._isInvoked(instance))
                {
                    instance = this._newInstance(classObj, args);
                }
            }

            return instance;
        });

        return this;
    }

    /**
     * Get data value with key
     *
     * @access public
     * @param  string key The data key
     * @param  mixed  ... Any additional parameters to pass to the constructor (optional) (default null)
     * @return mixed      The data value
     */
    Container.prototype.get = function(key)
    {
        if (key.includes('.') || key.includes('['))
        {
            return Arr.get(key, this.data);
        }

        if (this.has(key))
        {
            if (this._isSingleton(key))
            {
                return this.data[key].apply(this);
            }
            else if (this._isInvokable(this.data[key]))
            {
                return this._newInstance(this.data[key], arguments);
            }

            return this.data[key];
        }

        return false;
    }

    /**
     * Does this set contain a key?
     *
     * @access public
     * @param  string  key The data key
     * @return boolean
     */
    Container.prototype.has = function(key)
    {
        if (key.includes('.') || key.includes('['))
        {
            return Arr.has(key, this.data);
        }

        for (var _key in this.data)
        {
            if (_key === key)
            {
                return true;
            }
        }

        return false;
    }

    /**
     * Checks if key is a singleton
     *
     * @access private
     * @
     * @return bool
     */
    Container.prototype._isSingleton = function(key)
    {
        for (var _key in this.singletons)
        {
            if (_key === key)
            {
                return true;
            }
        }

        return false;
    }

    /**
     * Checks if a variable is invokable
     *
     * @access private
     * @param  mixed mixedVar The object instance or reference
     * @return bool
     */
    Container.prototype._isInvokable = function(mixedVar)
    {
        return Object.prototype.toString.call(mixedVar) === '[object Function]';
    }

    /**
     * Checks if a class object has been invoked
     *
     * @access private
     * @param  mixed classObj The object instance or reference
     * @return bool
     */
    Container.prototype._isInvoked = function(classObj)
    {
        return typeof classObj === 'object' && classObj.constructor && typeof classObj.constructor === 'function' && classObj.constructor.toString().includes('function (');
    }

    /**
     * Invokes and returns a new class instance
     *
     * @access private
     * @param  mixed classObj The object instance or reference
     * @param  array args     Arguements to pass to class constructor (optional) (default null)
     * @return object
     */
    Container.prototype._newInstance = function(reference, args)
    {
        return new(Function.prototype.bind.apply(reference, args));
    }

    /**
     * Fixes args passed to constructors 
     *
     * @access private
     * @param  array args Array of args passed to origional function
     * @return array
     */
    Container.prototype._normalizeArgs = function(args)
    {
        if (Object.prototype.toString.call(args) === '[object Arguments]')
        {
            var _args = Array.prototype.slice.call(args);

            _args.shift();

            return _args;
        }

        return args;
    }

    /**
     * Normalizes key for prototypes
     *
     * @access private
     * @param  string key Key to normalize
     * @return string
     */
    Container.prototype._normalizeKey = function(key)
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
     * Loads container into global namespace as "Hubble"
     *
     */
    if (!window.Container)
    {
        var ContainerInstance = new Container;

        window.Container = ContainerInstance;
    }

})(window);

/**
 * Application core
 *
 * @author    Joe J. Howard
 * @copyright Joe J. Howard
 * @license   https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE
 */
(function()
{
    /**
     * Module constructor
     *
     * @class
     * @constructor
     * @params null
     * @access public
     */
    var Application = function()
    {
        return this;
    };

    /**
     * Called when the application is first initialized
     *
     * @access public
     */
    Application.prototype.boot = function()
    {
        this.dom().boot();
    }

    /**
     * Get the Container component
     *
     * @access public
     * @return object
     */
    Application.prototype.container = function()
    {
        return Container;
    }

    /**
     * Get the DOM component
     *
     * @access public
     * @return object
     */
    Application.prototype.dom = function()
    {
        return Container.get('HubbleDom');
    }

    /**
     * Get the Helper component
     *
     * @access public
     * @return object
     */
    Application.prototype.helper = function()
    {
        return Container.Helper();
    }

    /**
     * Require a module and/or key/value
     *
     * @access public
     * @param  string key The name of the key
     * @return mixed
     */
    Application.prototype.require = function(key)
    {
        return Container.get.apply(Container, arguments);
    }

    // Loads into container
    Container.singleton('Hubble', Application);

    if (!window.Hubble)
    {
        window.Hubble = Container.get('Hubble');
    }

})();

/**
 * DOM Manager
 *
 * @author    Joe J. Howard
 * @copyright Joe J. Howard
 * @license   https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE
 */
(function()
{
    /**
     * Module constructor
     *
     * @class
     * @constructor
     * @access public
     */
    var Dom = function()
    {
        this._modules = {};

        return this;
    };

    /**
     * Boot Dom
     *
     * @access public
     * @param string name   Name of the module
     * @param object module Uninvoked module object
     */
    Dom.prototype.boot = function()
    {
        this._bindModules();

        var _this = this;

        var hubbleDomReady = new CustomEvent('hubbleDomReady',
        {
            detail: _this
        });

        window.dispatchEvent(hubbleDomReady);

        document.hubbleDomReady = true;
    }

    /**
     * Register a DOM module (singleton)
     *
     * @access public
     * @param string name   Name of the module
     * @param object module Uninvoked module object
     * @param bool   invoke Invoke the module immediately (optional) (default false)
     */
    Dom.prototype.register = function(name, module, invoke)
    {
        invoke = (typeof invoke === 'undefined' ? false : true);

        this._modules[name] = module;

        if (invoke)
        {
            this._bindModule(name);
        }
    }

    /**
     * Refresh the DOM modiules or a string module
     *
     * @access public
     * @param string name Name of the module (optional) (default false)
     */
    Dom.prototype.refresh = function(module)
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
            this._unbindModules();

            Container.Helper().collectGarbage();

            this._bindModules();
        }

    }

    /**
     * Unbind listener to containers
     *
     * @param null
     * @access private
     */
    Dom.prototype._unbindModules = function()
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
     * @param  string  key Name of module to unbind
     * @access private
     */
    Dom.prototype._unbindModule = function(key)
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
     * @access private
     */
    Dom.prototype._bindModules = function()
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
     * @param string key Name of module to bind
     * @access private
     */
    Dom.prototype._bindModule = function(key)
    {
        Container.singleton(key, this._modules[key]).get(key);
    }

    /**
     * Checks if a class object has a method by name
     *
     * @access private
     * @param  mixed  classObj The object instance or reference
     * @param  string method   The name of the method to check for
     * @return bool
     */
    Dom.prototype._hasMethod = function(classObj, method)
    {
        return typeof classObj === 'object' && typeof classObj[method] === 'function';
    }

    // Load into container and invoke
    Container.singleton('HubbleDom', Dom);

})();


// Helper
/**
 * JavaScript helper library
 *
 * @author    Joe J. Howard
 * @copyright Joe J. Howard
 * @license   https://github.com/kanso-cms/cms/blob/master/LICENSE
 */
(function()
{
        
        /**
         * Module constructor
         *
         * @access public
         * @constructor
         */
        var Helper = function()
        {

            this.version = "1.0.0";

            this.author = "Joe Howard";

            this.browser = false;

            this.cssPrefixable = [

                // transitions
                'transition',
                'transition-delay',
                'transition-duration',
                'transition-property',
                'transition-timing-function',

                // trnasforms
                'transform',
                'transform-origin',
                'transform-style',
                'perspective',
                'perspective-origin',
                'backface-visibility',

                // misc
                'box-sizing',
                'calc',
                'flex',
            ];

            this.cssPrefixes = [
                'webkit',
                'Moz',
                'ms',
                'O',
            ];

            this.cssEasings = {

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
             * List of shorthand properties and their longhand equivalents
             *
             * @var object
             */
            this.shortHandProps = {
                // CSS 2.1: http://www.w3.org/TR/CSS2/propidx.html
                'list-style': ['-type', '-position', '-image'],
                'margin': ['-top', '-right', '-bottom', '-left'],
                'outline': ['-width', '-style', '-color'],
                'padding': ['-top', '-right', '-bottom', '-left'],

                // CSS Backgrounds and Borders Module Level 3: http://www.w3.org/TR/css3-background/
                'background': ['-image', '-position', '-size', '-repeat', '-origin', '-clip', '-attachment', '-color'],
                'border': ['-width', '-style', '-color'],
                'borderColor': ['border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color'],
                'borderStyle': ['border-top-style', 'border-right-style', 'border-bottom-style', 'border-left-style'],
                'borderWidth': ['border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width'],
                'borderTop': ['-width', '-style', '-color'],
                'borderTight': ['-width', '-style', '-color'],
                'borderBottom': ['-width', '-style', '-color'],
                'borderLeft': ['-width', '-style', '-color'],
                'borderRadius': ['border-top-left-radius', 'border-top-right-radius', 'border-bottom-right-radius', 'border-bottom-left-radius'],
                'borderImage': ['-source', '-slice', '-width', '-outset', '-repeat'],

                // CSS Fonts Module Level 3: http://www.w3.org/TR/css3-fonts/
                'font': ['-style', '-variant', '-weight', '-stretch', '-size', 'line-height', '-family'],
                'fontVariant': ['-ligatures', '-alternates', '-caps', '-numeric', '-east-asian'],

                // CSS Masking Module Level 1: http://www.w3.org/TR/css-masking/
                'mask': ['-image', '-mode', '-position', '-size', '-repeat', '-origin', '-clip'],
                'maskBorder': ['-source', '-slice', '-width', '-outset', '-repeat', '-mode'],

                // CSS Multi-column Layout Module: http://www.w3.org/TR/css3-multicol/
                'columns': ['column-width', 'column-count'],
                'columnRule': ['-width', '-style', '-color'],

                // CSS Speech Module: http://www.w3.org/TR/css3-speech/
                'cue': ['-before', '-after'],
                'pause': ['-before', '-after'],
                'rest': ['-before', '-after'],

                // CSS Text Decoration Module Level 3: http://www.w3.org/TR/css-text-decor-3/
                'textDecoration': ['-line', '-style', '-color'],
                'textEmphasis': ['-style', '-color'],

                // CSS Animations (WD): http://www.w3.org/TR/css3-animations
                'webkitAnimation': ['-name', '-duration', '-timing-function', '-delay', '-iteration-count', '-direction', '-fill-mode', '-play-state'],
                'MozAnimation': ['-name', '-duration', '-timing-function', '-delay', '-iteration-count', '-direction', '-fill-mode', '-play-state'],
                'msAnimation': ['-name', '-duration', '-timing-function', '-delay', '-iteration-count', '-direction', '-fill-mode', '-play-state'],
                'Oanimation': ['-name', '-duration', '-timing-function', '-delay', '-iteration-count', '-direction', '-fill-mode', '-play-state'],
                'animation': ['-name', '-duration', '-timing-function', '-delay', '-iteration-count', '-direction', '-fill-mode', '-play-state'],

                // CSS Transitions (WD): http://www.w3.org/TR/css3-transitions/
                'webkitTransition': ['-property', '-duration', '-timing-function', '-delay'],
                'MozTransition': ['-property', '-duration', '-timing-function', '-delay'],
                'msTransition': ['-property', '-duration', '-timing-function', '-delay'],
                'OTransition': ['-property', '-duration', '-timing-function', '-delay'],
                'transition': ['-property', '-duration', '-timing-function', '-delay'],

                // CSS Flexible Box Layout Module Level 1 (WD): http://www.w3.org/TR/css3-flexbox/
                'webkitFlex': ['-grow', '-shrink', '-basis'],
                'msFlex': ['-grow', '-shrink', '-basis'],
                'flex': ['-grow', '-shrink', '-basis'],
            };

            this._events = {};

            return this;

        };

        // reset the prototype
        Helper.prototype = {};

        // Destructor
        Helper.prototype.destruct = function()
        {
            this.clearEventListeners();
        }

/**
 * Helper DOM helpers
 *
 * @author    Joe J. Howard
 * @copyright Joe J. Howard
 * @license   https://github.com/kanso-cms/cms/blob/master/LICENSE
 */

/**
 * Select and return all nodes by selector
 *
 * @access public
 * @param  string selector CSS selector
 * @param  node   context (optional) (default document)
 * @return node
 */
Helper.prototype.$All = function(selector, context)
{
    context = (typeof context === 'undefined' ? document : context);
    return Array.prototype.slice.call(context.querySelectorAll(selector));
}

/**
 * Select single node by selector
 *
 * @access public
 * @param  string selector CSS selector
 * @param  node   context (optional) (default document)
 * @return node
 */
Helper.prototype.$ = function(selector, context)
{
    context = (typeof context === 'undefined' ? document : context);
    return context.querySelector(selector)
}

/**
 * Closest parent node by type/class or array of either
 *
 * @access public
 * @param  node   el   Target element
 * @param  string type Node type to find
 * @return node\null
 */
Helper.prototype.closest = function(el, type)
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
        return this.closestClass(el, type);
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
 * @access public
 * @param  node   el   Target element
 * @param  string clas Node class to find
 * @return node\null
 */
Helper.prototype.closestClass = function(el, clas)
{    
    // Type is class
    if (this.is_array(clas))
    {
        for (var i = 0; i < clas.length; i++)
        {
            var response = this.closestClass(el, clas[i]);

            if (response)
            {
                return response;
            }
        }

        return null;
    }

    if (this.hasClass(el, clas))
    {
        return el;
    }

    if (this.hasClass(el.parentNode, clas))
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
        if (this.hasClass(parent, clas))
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
 * Get all first level children
 *
 * @access public
 * @param  node   el   Target element
 * @return node\null
 */
Helper.prototype.firstChildren = function(el)
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
 * Traverse nextSibling untill type or class or array of either
 *
 * @access public
 * @param  node   el   Target element
 * @param  string type Target node type
 * @return node\null
 */
Helper.prototype.next = function(el, type)
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
        return this.nextUntillClass(el, type);
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
 * @access public
 * @param  node   el        Target element
 * @param  string className Target node classname
 * @return node\null
 */
Helper.prototype.nextUntillClass = function(el, className)
{
    if (className[0] === '.')
    {
        className = className.substring(1);
    }

    if (el.nextSibling && this.hasClass(el.nextSibling, className))
    {
        return el.nextSibling;
    }

    var next = el.nextSibling;

    while (next !== document.body && typeof next !== "undefined" && next !== null)
    {
        if (next && this.hasClass(next, className))
        {
            return next;
        }

        next = next.nextSibling;

    }

    return null;
}

/**
 * Traverse previousSibling untill type
 *
 * @access public
 * @param  node   el   Target element
 * @param  string type Target node type
 * @return node\null
 */
Helper.prototype.previous = function(el, type)
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
        return this._previousUntillClass(el, type);
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
 * @access public
 * @param  node   el        Target element
 * @param  string className Target node classname
 * @return node\null
 */
Helper.prototype._previousUntillClass = function(el, className)
{
    if (className[0] === '.')
    {
        className = className.substring(1);
    }

    if (el.previousSibling && this.hasClass(el.previousSibling, className))
    {
        return el.previousSibling;
    }

    var prev = el.previousSibling;

    while (prev !== document.body && typeof prev !== "undefined" && prev !== null)
    {
        prev = prev.previousSibling;

        if (prev && this.hasClass(prev, className))
        {
            return prev;
        }
    }

    return null;
}

/**
 * Create and insert a new node
 *
 * @access public
 * @param  string type    New node type
 * @param  string classes New node class names (optional) (default '')
 * @param  string classes New node ID (optional) (default '')
 * @param  string content New node innerHTML (optional) (default '')
 * @param  node   target  Parent to append new node into
 * @return node
 */
Helper.prototype.newNode = function(type, classes, ID, content, target)
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
 * Inserts node as first child
 *
 * @access public
 * @param  node node     New node to insert
 * @param  node wrapper  Parent to preappend new node into
 * @return node
 */
Helper.prototype.preapend = function(node, wrapper)
{
    wrapper.insertBefore(node, wrapper.firstChild);

    return node;
}

/**
 * Check if a node exists in the DOM
 *
 * @access public
 * @param  node   element Target element
 * @return bool
 */
Helper.prototype.nodeExists = function(element)
{
    if (element === document.body)
    {
        return true;
    }

    if (typeof(element) !== "undefined" && element !== null)
    {
        if (typeof(element.parentNode) !== "undefined" && element.parentNode !== null)
        {
            return (element === document.body) ? false : document.body.contains(element);
        }
    }

    return false;
}

/**
 * Remove an element from the DOM
 *
 * This function also removes all attached event listeners
 * 
 * @access public
 * @param  node   el Target element
 */
Helper.prototype.removeFromDOM = function(el)
{
    if (this.nodeExists(el))
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
 * Remove inline css property
 * 
 * @access public
 * @param  node   el   Target element
 * @param  string prop CSS property to removes
 */
Helper.prototype.removeStyle = function(el, prop)
{
    if (typeof prop === 'undefined')
    {
        prop = 'style';
    }
    else
    {
        if (Object.prototype.toString.call(prop) === '[object Array]')
        {
            for (var i = 0; i < prop.length; i++)
            {
                this.removeStyle(el, prop[i]);
            }

            return;
        }
        else
        {
            prop = this.toCamelCase(prop);
        }
    }

    if (prop === 'style')
    {
        el.removeAttribute("style");
    }
    else
    {
        if (el.style.removeProperty)
        {
            el.style.removeProperty(prop);
        }
        else
        {
            el.style.removeAttribute(prop);
        }
    }


}

/**
 * Add a css class or list of classes
 *
 * @access public
 * @param  node         el         Target element
 * @param  array|string className  Class name(s) to add
 */
Helper.prototype.addClass = function(el, className)
{
    if (!this.nodeExists(el))
    {
        return;
    }

    if (Object.prototype.toString.call(className) === '[object Array]')
    {
        for (var i = 0; i < className.length; i++)
        {
            el.classList.add(className[i]);
        }

        return;
    }

    el.classList.add(className);
}

/**
 * Remove a css class or list of classes
 *
 * @access public
 * @param  node         el         Target element
 * @param  array|string className  Class name(s) to remove
 */
Helper.prototype.removeClass = function(el, className)
{
    if (!this.nodeExists(el))
    {
        return;
    }

    if (Object.prototype.toString.call(className) === '[object Array]')
    {
        for (var i = 0; i < className.length; i++)
        {
            el.classList.remove(className[i]);
        }

        return;
    }

    el.classList.remove(className);
}

/**
 * Toogle a classname
 *
 * @access public
 * @param  node         el         Target element
 * @param  string       className  Class name to toggle
 */
Helper.prototype.toggleClass = function(el, className)
{
    if (!this.nodeExists(el))
    {
        return;
    }

    if (this.hasClass(el, className))
    {
        this.removeClass(el, className);
    }
    else
    {
        this.addClass(el, className);
    }
}

/**
 * Check if a node has a class
 *
 * @access public
 * @param  node         el         Target element
 * @param  string|array className  Class name(s) to check for
 * @return bool
 */
Helper.prototype.hasClass = function(el, className)
{
    if (!this.nodeExists(el))
    {
        return false;
    }

    if (Object.prototype.toString.call(className) === '[object Array]')
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
 * Check if a node is a certain type
 *
 * @access public
 * @param  node   el         Target element
 * @param  string NodeType   Node type to validate
 * @return bool
 */
Helper.prototype.isNodeType = function(el, NodeType)
{
    return el.tagName.toUpperCase() === NodeType.toUpperCase();
}

/**
 * Get an element's absolute coordinates
 *
 * @access public
 * @param  node   el Target element
 * @return object
 */
Helper.prototype.getCoords = function(el)
{
    var box = el.getBoundingClientRect();
    var body = document.body;
    var docEl = document.documentElement;
    var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;
    var clientTop = docEl.clientTop || body.clientTop || 0;
    var clientLeft = docEl.clientLeft || body.clientLeft || 0;
    var borderL = parseInt(this.getStyle(el, 'border-top-width'));
    var borderR = parseInt(this.getStyle(el, 'border-top-width'));
    var borderT = parseInt(this.getStyle(el, 'border-top-width'));
    var borderB = parseInt(this.getStyle(el, 'border-top-width'));
    var top = box.top + scrollTop - clientTop - borderT - borderB;
    var left = box.left + scrollLeft - clientLeft + borderL - borderR;
    var width = parseFloat(this.getStyle(el, "width"));
    var height = parseFloat(this.getStyle(el, "height"));

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
 * Triggers a native event on an element
 *
 * @access public
 * @param  node   el   Target element
 * @param  string type Valid event name
 */
Helper.prototype.triggerEvent = function(el, type)
{
    if ("createEvent" in document)
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
 * Replaces element's innerText without destroying childnodes
 *
 * @access public
 * @param  node   el   Target element
 * @param  string text Text to replace
 */
Helper.prototype.innerText = function(el, text)
{
    if (this.isset(el.childNodes[0]))
    {
        el.childNodes[0].nodeValue = text;
    }
}

/**
 * Get all input elements from a form
 *
 * @access public
 * @param  node   form Target element
 * @return array
 */
Helper.prototype.getFormInputs = function(form)
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
 * Gets an input element's value
 *
 * @access public
 * @param  node   input Target element
 * @return mixed
 */
Helper.prototype.getInputValue = function(input)
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
 * Get an array of name/value objects for all inputs in a form
 *
 * @access public
 * @param  node   form Target element
 * @return array
 */
Helper.prototype.formArray = function(form)
{
    var inputs = this.getFormInputs(form);
    var response = [];

    for (var i = 0; i < inputs.length; i++)
    {
        response.push(
        {
            'name': inputs[i].name,
            'value': this.getInputValue(this.getInputValue(inputs[i]))
        });
    }

    return response;
}

/**
 * Replace or append a node's innerHTML
 *
 * @access public
 * @param  node   target  Target element
 * @param  string content Target content
 * @param  bool   append  Append innerHTML or replace (optional) (default false)
 */
Helper.prototype.innerHTML = function(target, content, append)
{
    content = this.is_array(content) ? content.join("\n") : content;

    if (append)
    {
        target.innerHTML += content;
    }
    else
    {
        target.innerHTML = content;
    }
}

/**
 * Check if an element is in current viewport
 *
 * @access public
 * @param  node   el Target DOM node
 * @return bool
 */
Helper.prototype.inViewport = function(el)
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
 * Aria hide an element
 *
 * @access public
 * @param  node   el Target DOM node
 */
Helper.prototype.hideAria = function(el)
{
    el.setAttribute("aria-hidden", 'true');
}

/**
 * Aria show an element
 *
 * @access public
 * @param  node   el Target DOM node
 */
Helper.prototype.showAria = function(el)
{
    el.setAttribute("aria-hidden", 'false');
}

/**
 * String Helper Functions
 *
 * @author    Joe J. Howard
 * @copyright Joe J. Howard
 * @license   https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE
 */

/**
 * Is valid JSON
 * 
 * @param  mixed str String JSON
 * @return object|false
 */
Helper.prototype.isJSON = function(str)
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
 * @param  mixed str String JSON
 * @return object|false
 */
Helper.prototype.json_encode = function(str)
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
 * Json encode
 * 
 * @param  mixed str String JSON
 * @return object|false
 */
Helper.prototype.json_decode = function(str)
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
 * Make a random string
 *
 * @param  int    length String length
 * @return string
 */
Helper.prototype.makeid = function(length)
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
 * Is variable numeric?
 *
 * @param  mixed mixed_var Variable to validate
 * @return bool
 */
Helper.prototype.is_numeric = function(mixed_var)
{
    var whitespace =
        " \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000";
    return (typeof mixed_var === 'number' || (typeof mixed_var === 'string' && whitespace.indexOf(mixed_var.slice(-1)) === -
        1)) && mixed_var !== '' && !isNaN(mixed_var);
}

/**
 * Parse url
 *
 * @param  string    str       The URL to parse. Invalid characters are replaced by _.
 * @param  string    component Specify one of PHP_URL_SCHEME, PHP_URL_HOST, PHP_URL_PORT, PHP_URL_USER, PHP_URL_PASS, PHP_URL_PATH, PHP_URL_QUERY or PHP_URL_FRAGMENT to retrieve just a specific URL component as a string (except when PHP_URL_PORT is given, in which case the return value will be an integer).
 * @return object
 */
Helper.prototype.parse_url = function(str, component)
{
    //       discuss at: http://phpjs.org/functions/parse_url/
    //      original by: Steven Levithan (http://blog.stevenlevithan.com)
    // reimplemented by: Brett Zamir (http://brett-zamir.me)
    //         input by: Lorenzo Pisani
    //         input by: Tony
    //      improved by: Brett Zamir (http://brett-zamir.me)
    //             note: original by http://stevenlevithan.com/demo/parseuri/js/assets/parseuri.js
    //             note: blog post at http://blog.stevenlevithan.com/archives/parseuri
    //             note: demo at http://stevenlevithan.com/demo/parseuri/js/assets/parseuri.js
    //             note: Does not replace invalid characters with '_' as in PHP, nor does it return false with
    //             note: a seriously malformed URL.
    //             note: Besides function name, is essentially the same as parseUri as well as our allowing
    //             note: an extra slash after the scheme/protocol (to allow file:/// as in PHP)
    //        example 1: parse_url('http://username:password@hostname/path?arg=value#anchor');
    //        returns 1: {scheme: 'http', host: 'hostname', user: 'username', pass: 'password', path: '/path', query: 'arg=value', fragment: 'anchor'}

    var query, key = ['source', 'scheme', 'authority', 'userInfo', 'user', 'pass', 'host', 'port',
            'relative', 'path', 'directory', 'file', 'query', 'fragment'
        ],
        ini = (this.php_js && this.php_js.ini) ||
        {},
        mode = (ini['phpjs.parse_url.mode'] &&
            ini['phpjs.parse_url.mode'].local_value) || 'php',
        parser = {
            php: /^(?:([^:\/?#]+):)?(?:\/\/()(?:(?:()(?:([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?()(?:(()(?:(?:[^?#\/]*\/)*)()(?:[^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
            strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
            loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/\/?)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/ // Added one optional slash to post-scheme to catch file:/// (should restrict this)
        };

    var m = parser[mode].exec(str),
        uri = {},
        i = 14;
    while (i--)
    {
        if (m[i])
        {
            uri[key[i]] = m[i];
        }
    }

    if (component)
    {
        return uri[component.replace('PHP_URL_', '')
            .toLowerCase()];
    }
    if (mode !== 'php')
    {
        var name = (ini['phpjs.parse_url.queryKey'] &&
            ini['phpjs.parse_url.queryKey'].local_value) || 'queryKey';
        parser = /(?:^|&)([^&=]*)=?([^&]*)/g;
        uri[name] = {};
        query = uri[key[12]] || '';
        query.replace(parser, function($0, $1, $2)
        {
            if ($1)
            {
                uri[name][$1] = $2;
            }
        });
    }

    if (!'scheme' in uri || !uri.scheme || uri.scheme === '')
    {
        uri['scheme'] = window.location.protocol.replace(':', '').replaceAll('/', '');
    }

    delete uri.source;
    return uri;
}

/* Left trim */
Helper.prototype.ltrim = function(str, charlist)
{
    //  discuss at: http://phpjs.org/functions/ltrim/
    // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    //    input by: Erkekjetter
    // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // bugfixed by: Onno Marsman
    //   example 1: ltrim('    Kevin van Zonneveld    ');
    //   returns 1: 'Kevin van Zonneveld    '

    charlist = !charlist ? ' \\s\u00A0' : (charlist + '')
        .replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '$1');
    var re = new RegExp('^[' + charlist + ']+', 'g');
    return (str + '')
        .replace(re, '');
}

/* Left trim */
Helper.prototype.rtrim = function(str, charlist)
{
    //  discuss at: http://phpjs.org/functions/rtrim/
    // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    //    input by: Erkekjetter
    //    input by: rem
    // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // bugfixed by: Onno Marsman
    // bugfixed by: Brett Zamir (http://brett-zamir.me)
    //   example 1: rtrim('    Kevin van Zonneveld    ');
    //   returns 1: '    Kevin van Zonneveld'

    charlist = !charlist ? ' \\s\u00A0' : (charlist + '')
        .replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '\\$1');
    var re = new RegExp('[' + charlist + ']+$', 'g');
    return (str + '')
        .replace(re, '');
}

/* Trim */
Helper.prototype.trim = function(str, charlist)
{
    //  discuss at: http://phpjs.org/functions/trim/
    // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // improved by: mdsjack (http://www.mdsjack.bo.it)
    // improved by: Alexander Ermolaev (http://snippets.dzone.com/user/AlexanderErmolaev)
    // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // improved by: Steven Levithan (http://blog.stevenlevithan.com)
    // improved by: Jack
    //    input by: Erkekjetter
    //    input by: DxGx
    // bugfixed by: Onno Marsman
    //   example 1: trim('    Kevin van Zonneveld    ');
    //   returns 1: 'Kevin van Zonneveld'
    //   example 2: trim('Hello World', 'Hdle');
    //   returns 2: 'o Wor'
    //   example 3: trim(16, 1);
    //   returns 3: 6

    var whitespace, l = 0,
        i = 0;
    str += '';

    if (!charlist)
    {
        // default list
        whitespace =
            ' \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000';
    }
    else
    {
        // preg_quote custom list
        charlist += '';
        whitespace = charlist.replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '$1');
    }

    l = str.length;
    for (var i = 0; i < l; i++)
    {
        if (whitespace.indexOf(str.charAt(i)) === -1)
        {
            str = str.substring(i);
            break;
        }
    }

    l = str.length;
    for (i = l - 1; i >= 0; i--)
    {
        if (whitespace.indexOf(str.charAt(i)) === -1)
        {
            str = str.substring(0, i + 1);
            break;
        }
    }

    return whitespace.indexOf(str.charAt(0)) === -1 ? str : '';
}

/* regex escape */
Helper.prototype.preg_quote = function(str, delimiter)
{
    //  discuss at: http://phpjs.org/functions/preg_quote/
    // original by: booeyOH
    // improved by: Ates Goral (http://magnetiq.com)
    // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // improved by: Brett Zamir (http://brett-zamir.me)
    // bugfixed by: Onno Marsman
    //   example 1: preg_quote("$40");
    //   returns 1: '\\$40'
    //   example 2: preg_quote("*RRRING* Hello?");
    //   returns 2: '\\*RRRING\\* Hello\\?'
    //   example 3: preg_quote("\\.+*?[^]$(){}=!<>|:");
    //   returns 3: '\\\\\\.\\+\\*\\?\\[\\^\\]\\$\\(\\)\\{\\}\\=\\!\\<\\>\\|\\:'

    return String(str)
        .replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\' + (delimiter || '') + '-]', 'g'), '\\$&');
}

/* Preg match all */
Helper.prototype.preg_match_all = function(pattern, subject)
{

    // convert the pattern to regix
    // if needed. return null on fail
    if (typeof pattern === 'string')
    {
        try
        {
            pattern = new RegExp(pattern);
        }
        catch (err)
        {
            return null;
        }
    }
    var _this = this;
    var matches = [];
    var matched = pattern.exec(subject);
    if (matched !== null)
    {
        var i = 0;
        while (matched = pattern.exec(subject))
        {
            subject = _this.str_split_index(subject, (matched.index + matched[0].length - 1))[1];
            matched.index = i > 0 ? (matched.index + (matched[0].length - 1)) : matched.index - 1;
            matches.push(matched);
            i++;
        }
        return matches;
    }
    return null;
}

/* split string at index */
Helper.prototype.str_split_index = function(value, index)
{
    return [value.substring(0, index + 1), value.substring(index + 1)];
}

/* Capatalize first letter */
Helper.prototype.ucfirst = function(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/* Capatalize first letter of all words */
Helper.prototype.ucwords = function(str)
{
    //  discuss at: http://phpjs.org/functions/ucwords/
    // original by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
    // improved by: Waldo Malqui Silva
    // improved by: Robin
    // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // bugfixed by: Onno Marsman
    //    input by: James (http://www.james-bell.co.uk/)
    //   example 1: ucwords('kevin van  zonneveld');
    //   returns 1: 'Kevin Van  Zonneveld'
    //   example 2: ucwords('HELLO WORLD');
    //   returns 2: 'HELLO WORLD'

    return (str + '')
        .replace(/^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g, function($1)
        {
            return $1.toUpperCase();
        });
}

/* Reduce a string to a x words/letters with (optional) suffix */
Helper.prototype.strReduce = function(string, length, suffix, toChar)
{

    toChar = (typeof toChar === 'undefined' ? true : false);
    suffix = (typeof suffix === 'undefined' ? '' : suffix);

    if (toChar) return (string.length > length) ? string.substring(0, length) + suffix : string;

    var words = string.split(" ");

    if (count(words) > length) return fruits.slice(0, length).join(' ').suffix;

    return string;

}

/* Return human friendly time-ago */
Helper.prototype.timeAgo = function(time, asArray)
{
    asArray = (typeof asArray === 'undefined' ? false : true);
    time = isValidTimeStamp(time) ? parseInt(time) : strtotime(time);
    var units = [
    {
        name: "second",
        limit: 60,
        in_seconds: 1
    },
    {
        name: "minute",
        limit: 3600,
        in_seconds: 60
    },
    {
        name: "hour",
        limit: 86400,
        in_seconds: 3600
    },
    {
        name: "day",
        limit: 604800,
        in_seconds: 86400
    },
    {
        name: "week",
        limit: 2629743,
        in_seconds: 604800
    },
    {
        name: "month",
        limit: 31556926,
        in_seconds: 2629743
    },
    {
        name: "year",
        limit: null,
        in_seconds: 31556926
    }];
    var diff = (new Date() - new Date(time * 1000)) / 1000;
    if (diff < 5) return "now";

    var i = 0,
        unit;
    while (unit = units[i++])
    {
        if (diff < unit.limit || !unit.limit)
        {
            var diff = Math.floor(diff / unit.in_seconds);
            if (asArray)
            {
                return {
                    unit: unit.name + (diff > 1 ? "s" : ""),
                    time: diff
                };
            }
            return diff + " " + unit.name + (diff > 1 ? "s" : "");
        }
    }
}

/* Convert a string-date to a timestamp */
Helper.prototype.strtotime = function(text)
{
    var timestamp = Math.round(new Date(text).getTime() / 1000);

    if (isNaN(timestamp))
    {
        timestamp = Date.parse(text);

        if (isNaN(timestamp))
        {
            var split = text.split('/');

            if (Helper.count(split) !== 3)
            {
                return false;
            }

            // MM/DD/YY
            timestamp = Date.parse(split[1] + '/' + split[0] + '/' + split[2]);

            if (isNaN(timestamp))
            {
                return false;
            }
        }
    }

    return timestamp;
}

/* String replace */
Helper.prototype.str_replace = function(search, replace, subject, count)
{
    //  discuss at: http://phpjs.org/functions/str_replace/
    // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // improved by: Gabriel Paderni
    // improved by: Philip Peterson
    // improved by: Simon Willison (http://simonwillison.net)
    // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // improved by: Onno Marsman
    // improved by: Brett Zamir (http://brett-zamir.me)
    //  revised by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
    // bugfixed by: Anton Ongson
    // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // bugfixed by: Oleg Eremeev
    // bugfixed by: Glen Arason (http://CanadianDomainRegistry.ca)
    // bugfixed by: Glen Arason (http://CanadianDomainRegistry.ca) Corrected count
    //    input by: Onno Marsman
    //    input by: Brett Zamir (http://brett-zamir.me)
    //    input by: Oleg Eremeev
    //        note: The count parameter must be passed as a string in order
    //        note: to find a global variable in which the result will be given
    //   example 1: str_replace(' ', '.', 'Kevin van Zonneveld');
    //   returns 1: 'Kevin.van.Zonneveld'
    //   example 2: str_replace(['{name}', 'l'], ['hello', 'm'], '{name}, lars');
    //   returns 2: 'hemmo, mars'
    //   example 3: str_replace(Array('S','F'),'x','ASDFASDF');
    //   returns 3: 'AxDxAxDx'
    //   example 4: str_replace(['A','D'], ['x','y'] , 'ASDFASDF' , 'cnt');
    //   returns 4: 'xSyFxSyF' // cnt = 0 (incorrect before fix)
    //   returns 4: 'xSyFxSyF' // cnt = 4 (correct after fix)

    var i = 0,
        j = 0,
        temp = '',
        repl = '',
        sl = 0,
        fl = 0,
        f = [].concat(search),
        r = [].concat(replace),
        s = subject,
        ra = Object.prototype.toString.call(r) === '[object Array]',
        sa = Object.prototype.toString.call(s) === '[object Array]';
    s = [].concat(s);

    if (typeof(search) === 'object' && typeof(replace) === 'string')
    {
        temp = replace;
        replace = new Array();
        for (var i = 0; i < search.length; i += 1)
        {
            replace[i] = temp;
        }
        temp = '';
        r = [].concat(replace);
        ra = Object.prototype.toString.call(r) === '[object Array]';
    }

    if (count)
    {
        this.window[count] = 0;
    }

    for (i = 0, sl = s.length; i < sl; i++)
    {
        if (s[i] === '')
        {
            continue;
        }
        for (j = 0, fl = f.length; j < fl; j++)
        {
            temp = s[i] + '';
            repl = ra ? (r[j] !== undefined ? r[j] : '') : r[0];
            s[i] = (temp)
                .split(f[j])
                .join(repl);
            if (count)
            {
                this.window[count] += ((temp.split(f[j]))
                    .length - 1);
            }
        }
    }
    return sa ? s : s[0];
}

Helper.prototype.str_split = function(string, split_length)
{
    //  discuss at: http://phpjs.org/functions/str_split/
    // original by: Martijn Wieringa
    // improved by: Brett Zamir (http://brett-zamir.me)
    // bugfixed by: Onno Marsman
    //  revised by: Theriault
    //  revised by: Rafał Kukawski (http://blog.kukawski.pl/)
    //    input by: Bjorn Roesbeke (http://www.bjornroesbeke.be/)
    //   example 1: str_split('Hello Friend', 3);
    //   returns 1: ['Hel', 'lo ', 'Fri', 'end']

    if (split_length === null)
    {
        split_length = 1;
    }
    if (string === null || split_length < 1)
    {
        return false;
    }
    string += '';
    var chunks = [],
        pos = 0,
        len = string.length;
    while (pos < len)
    {
        chunks.push(string.slice(pos, pos += split_length));
    }

    return chunks;
}

Helper.prototype.toCamelCase = function(str)
{
    return str.toLowerCase()
        .replace(/['"]/g, '')
        .replace(/\W+/g, ' ')
        .replace(/ (.)/g, function($1)
        {
            return $1.toUpperCase();
        })
        .replace(/ /g, '');
}

Helper.prototype.camelCaseToHyphen = function(str)
{
    return str
        // insert a hyphen between lower & upper
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        // hyphen before last upper in a sequence followed by lower
        .replace(/\b([A-Z]+)([A-Z])([a-z])/, '$1-$2$3').toLowerCase();
}


Helper.prototype.explode = function(delimiter, string, limit)
{
    //  discuss at: http://phpjs.org/functions/explode/
    // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    //   example 1: explode(' ', 'Kevin van Zonneveld');
    //   returns 1: {0: 'Kevin', 1: 'van', 2: 'Zonneveld'}

    if (arguments.length < 2 || typeof delimiter === 'undefined' || typeof string === 'undefined') return null;
    if (delimiter === '' || delimiter === false || delimiter === null) return false;
    if (typeof delimiter === 'function' || typeof delimiter === 'object' || typeof string === 'function' || typeof string ===
        'object')
    {
        return {
            0: ''
        };
    }
    if (delimiter === true) delimiter = '1';

    // Here we go...
    delimiter += '';
    string += '';

    var s = string.split(delimiter);

    if (typeof limit === 'undefined') return s;

    // Support for limit
    if (limit === 0) limit = 1;

    // Positive limit
    if (limit > 0)
    {
        if (limit >= s.length) return s;
        return s.slice(0, limit - 1)
            .concat([s.slice(limit - 1)
                .join(delimiter)
            ]);
    }

    // Negative limit
    if (-limit >= s.length) return [];

    s.splice(s.length + limit);
    return s;
}

Helper.prototype.htmlspecialchars = function(string, quote_style, charset, double_encode)
{
    // http://kevin.vanzonneveld.net
    // +   original by: Mirek Slugen
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Nathan
    // +   bugfixed by: Arno
    // +    revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +    bugfixed by: Brett Zamir (http://brett-zamir.me)
    // +      input by: Ratheous
    // +      input by: Mailfaker (http://www.weedem.fr/)
    // +      reimplemented by: Brett Zamir (http://brett-zamir.me)
    // +      input by: felix
    // +    bugfixed by: Brett Zamir (http://brett-zamir.me)
    // %        note 1: charset argument not supported
    // *     example 1: htmlspecialchars("<a href='test'>Test</a>", 'ENT_QUOTES');
    // *     returns 1: '&lt;a href=&#039;test&#039;&gt;Test&lt;/a&gt;'
    // *     example 2: htmlspecialchars("ab\"c'd", ['ENT_NOQUOTES', 'ENT_QUOTES']);
    // *     returns 2: 'ab"c&#039;d'
    // *     example 3: htmlspecialchars("my "&entity;" is still here", null, null, false);
    // *     returns 3: 'my &quot;&entity;&quot; is still here'
    var optTemp = 0,
        i = 0,
        noquotes = false;
    if (typeof quote_style === 'undefined' || quote_style === null)
    {
        quote_style = 2;
    }
    string = string.toString();
    if (double_encode !== false)
    { // Put this first to avoid double-encoding
        string = string.replace(/&/g, '&amp;');
    }
    string = string.replace(/</g, '&lt;').replace(/>/g, '&gt;');

    var OPTS = {
        'ENT_NOQUOTES': 0,
        'ENT_HTML_QUOTE_SINGLE': 1,
        'ENT_HTML_QUOTE_DOUBLE': 2,
        'ENT_COMPAT': 2,
        'ENT_QUOTES': 3,
        'ENT_IGNORE': 4
    };
    if (quote_style === 0)
    {
        noquotes = true;
    }
    if (typeof quote_style !== 'number')
    { // Allow for a single string or an array of string flags
        quote_style = [].concat(quote_style);
        for (var i = 0; i < quote_style.length; i++)
        {
            // Resolve string input to bitwise e.g. 'ENT_IGNORE' becomes 4
            if (OPTS[quote_style[i]] === 0)
            {
                noquotes = true;
            }
            else if (OPTS[quote_style[i]])
            {
                optTemp = optTemp | OPTS[quote_style[i]];
            }
        }
        quote_style = optTemp;
    }
    if (quote_style & OPTS.ENT_HTML_QUOTE_SINGLE)
    {
        string = string.replace(/'/g, '&#039;');
    }
    if (!noquotes)
    {
        string = string.replace(/"/g, '&quot;');
    }

    return string;
}


Helper.prototype.htmlspecialchars_decode = function(string, quote_style)
{
    //       discuss at: http://phpjs.org/functions/htmlspecialchars_decode/
    //      original by: Mirek Slugen
    //      improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    //      bugfixed by: Mateusz "loonquawl" Zalega
    //      bugfixed by: Onno Marsman
    //      bugfixed by: Brett Zamir (http://brett-zamir.me)
    //      bugfixed by: Brett Zamir (http://brett-zamir.me)
    //         input by: ReverseSyntax
    //         input by: Slawomir Kaniecki
    //         input by: Scott Cariss
    //         input by: Francois
    //         input by: Ratheous
    //         input by: Mailfaker (http://www.weedem.fr/)
    //       revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // reimplemented by: Brett Zamir (http://brett-zamir.me)
    //        example 1: htmlspecialchars_decode("<p>this -&gt; &quot;</p>", 'ENT_NOQUOTES');
    //        returns 1: '<p>this -> &quot;</p>'
    //        example 2: htmlspecialchars_decode("&amp;quot;");
    //        returns 2: '&quot;'

    var optTemp = 0,
        i = 0,
        noquotes = false;
    if (typeof quote_style === 'undefined')
    {
        quote_style = 2;
    }
    string = string.toString()
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>');
    var OPTS = {
        'ENT_NOQUOTES': 0,
        'ENT_HTML_QUOTE_SINGLE': 1,
        'ENT_HTML_QUOTE_DOUBLE': 2,
        'ENT_COMPAT': 2,
        'ENT_QUOTES': 3,
        'ENT_IGNORE': 4
    };
    if (quote_style === 0)
    {
        noquotes = true;
    }
    if (typeof quote_style !== 'number')
    { // Allow for a single string or an array of string flags
        quote_style = [].concat(quote_style);
        for (var i = 0; i < quote_style.length; i++)
        {
            // Resolve string input to bitwise e.g. 'PATHINFO_EXTENSION' becomes 4
            if (OPTS[quote_style[i]] === 0)
            {
                noquotes = true;
            }
            else if (OPTS[quote_style[i]])
            {
                optTemp = optTemp | OPTS[quote_style[i]];
            }
        }
        quote_style = optTemp;
    }
    if (quote_style & OPTS.ENT_HTML_QUOTE_SINGLE)
    {
        string = string.replace(/&#0*39;/g, "'"); // PHP doesn't currently escape if more than one 0, but it should
        // string = string.replace(/&apos;|&#x0*27;/g, "'"); // This would also be useful here, but not a part of PHP
    }
    if (!noquotes)
    {
        string = string.replace(/&quot;/g, '"');
    }
    // Put this in last place to avoid escape being double-decoded
    string = string.replace(/&amp;/g, '&');

    return string;
}

Helper.prototype.get_html_translation_table = function(table, quoteStyle)
{

    // eslint-disable-line camelcase
    //  discuss at: http://locutus.io/php/get_html_translation_table/
    // original by: Philip Peterson
    //  revised by: Kevin van Zonneveld (http://kvz.io)
    // bugfixed by: noname
    // bugfixed by: Alex
    // bugfixed by: Marco
    // bugfixed by: madipta
    // bugfixed by: Brett Zamir (http://brett-zamir.me)
    // bugfixed by: T.Wild
    // improved by: KELAN
    // improved by: Brett Zamir (http://brett-zamir.me)
    //    input by: Frank Forte
    //    input by: Ratheous
    //      note 1: It has been decided that we're not going to add global
    //      note 1: dependencies to Locutus, meaning the constants are not
    //      note 1: real constants, but strings instead. Integers are also supported if someone
    //      note 1: chooses to create the constants themselves.
    //   example 1: get_html_translation_table('HTML_SPECIALCHARS')
    //   returns 1: {'"': '&quot;', '&': '&amp;', '<': '&lt;', '>': '&gt;'}

    var entities = {}
    var hashMap = {}
    var decimal
    var constMappingTable = {}
    var constMappingQuoteStyle = {}
    var useTable = {}
    var useQuoteStyle = {}

    // Translate arguments
    constMappingTable[0] = 'HTML_SPECIALCHARS'
    constMappingTable[1] = 'HTML_ENTITIES'
    constMappingQuoteStyle[0] = 'ENT_NOQUOTES'
    constMappingQuoteStyle[2] = 'ENT_COMPAT'
    constMappingQuoteStyle[3] = 'ENT_QUOTES'

    useTable = !isNaN(table) ?
        constMappingTable[table] :
        table ?
        table.toUpperCase() :
        'HTML_SPECIALCHARS'

    useQuoteStyle = !isNaN(quoteStyle) ?
        constMappingQuoteStyle[quoteStyle] :
        quoteStyle ?
        quoteStyle.toUpperCase() :
        'ENT_COMPAT'

    if (useTable !== 'HTML_SPECIALCHARS' && useTable !== 'HTML_ENTITIES')
    {
        throw new Error('Table: ' + useTable + ' not supported')
    }

    entities['38'] = '&amp;'
    if (useTable === 'HTML_ENTITIES')
    {
        entities['160'] = '&nbsp;'
        entities['161'] = '&iexcl;'
        entities['162'] = '&cent;'
        entities['163'] = '&pound;'
        entities['164'] = '&curren;'
        entities['165'] = '&yen;'
        entities['166'] = '&brvbar;'
        entities['167'] = '&sect;'
        entities['168'] = '&uml;'
        entities['169'] = '&copy;'
        entities['170'] = '&ordf;'
        entities['171'] = '&laquo;'
        entities['172'] = '&not;'
        entities['173'] = '&shy;'
        entities['174'] = '&reg;'
        entities['175'] = '&macr;'
        entities['176'] = '&deg;'
        entities['177'] = '&plusmn;'
        entities['178'] = '&sup2;'
        entities['179'] = '&sup3;'
        entities['180'] = '&acute;'
        entities['181'] = '&micro;'
        entities['182'] = '&para;'
        entities['183'] = '&middot;'
        entities['184'] = '&cedil;'
        entities['185'] = '&sup1;'
        entities['186'] = '&ordm;'
        entities['187'] = '&raquo;'
        entities['188'] = '&frac14;'
        entities['189'] = '&frac12;'
        entities['190'] = '&frac34;'
        entities['191'] = '&iquest;'
        entities['192'] = '&Agrave;'
        entities['193'] = '&Aacute;'
        entities['194'] = '&Acirc;'
        entities['195'] = '&Atilde;'
        entities['196'] = '&Auml;'
        entities['197'] = '&Aring;'
        entities['198'] = '&AElig;'
        entities['199'] = '&Ccedil;'
        entities['200'] = '&Egrave;'
        entities['201'] = '&Eacute;'
        entities['202'] = '&Ecirc;'
        entities['203'] = '&Euml;'
        entities['204'] = '&Igrave;'
        entities['205'] = '&Iacute;'
        entities['206'] = '&Icirc;'
        entities['207'] = '&Iuml;'
        entities['208'] = '&ETH;'
        entities['209'] = '&Ntilde;'
        entities['210'] = '&Ograve;'
        entities['211'] = '&Oacute;'
        entities['212'] = '&Ocirc;'
        entities['213'] = '&Otilde;'
        entities['214'] = '&Ouml;'
        entities['215'] = '&times;'
        entities['216'] = '&Oslash;'
        entities['217'] = '&Ugrave;'
        entities['218'] = '&Uacute;'
        entities['219'] = '&Ucirc;'
        entities['220'] = '&Uuml;'
        entities['221'] = '&Yacute;'
        entities['222'] = '&THORN;'
        entities['223'] = '&szlig;'
        entities['224'] = '&agrave;'
        entities['225'] = '&aacute;'
        entities['226'] = '&acirc;'
        entities['227'] = '&atilde;'
        entities['228'] = '&auml;'
        entities['229'] = '&aring;'
        entities['230'] = '&aelig;'
        entities['231'] = '&ccedil;'
        entities['232'] = '&egrave;'
        entities['233'] = '&eacute;'
        entities['234'] = '&ecirc;'
        entities['235'] = '&euml;'
        entities['236'] = '&igrave;'
        entities['237'] = '&iacute;'
        entities['238'] = '&icirc;'
        entities['239'] = '&iuml;'
        entities['240'] = '&eth;'
        entities['241'] = '&ntilde;'
        entities['242'] = '&ograve;'
        entities['243'] = '&oacute;'
        entities['244'] = '&ocirc;'
        entities['245'] = '&otilde;'
        entities['246'] = '&ouml;'
        entities['247'] = '&divide;'
        entities['248'] = '&oslash;'
        entities['249'] = '&ugrave;'
        entities['250'] = '&uacute;'
        entities['251'] = '&ucirc;'
        entities['252'] = '&uuml;'
        entities['253'] = '&yacute;'
        entities['254'] = '&thorn;'
        entities['255'] = '&yuml;'
    }

    if (useQuoteStyle !== 'ENT_NOQUOTES')
    {
        entities['34'] = '&quot;'
    }
    if (useQuoteStyle === 'ENT_QUOTES')
    {
        entities['39'] = '&#39;'
    }
    entities['60'] = '&lt;'
    entities['62'] = '&gt;'

    // ascii decimals to real symbols
    for (decimal in entities)
    {
        if (entities.hasOwnProperty(decimal))
        {
            hashMap[String.fromCharCode(decimal)] = entities[decimal]
        }
    }

    return hashMap
}

Helper.prototype.html_entity_decode = function(string, quote_style)
{
    //  discuss at: http://phpjs.org/functions/html_entity_decode/
    // original by: john (http://www.jd-tech.net)
    //    input by: ger
    //    input by: Ratheous
    //    input by: Nick Kolosov (http://sammy.ru)
    // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // improved by: marc andreu
    //  revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    //  revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // bugfixed by: Onno Marsman
    // bugfixed by: Brett Zamir (http://brett-zamir.me)
    // bugfixed by: Fox
    //  depends on: get_html_translation_table
    //   example 1: html_entity_decode('Kevin &amp; van Zonneveld');
    //   returns 1: 'Kevin & van Zonneveld'
    //   example 2: html_entity_decode('&amp;lt;');
    //   returns 2: '&lt;'

    var hash_map = {},
        symbol = '',
        tmp_str = '',
        entity = '';
    tmp_str = string.toString();

    if (false === (hash_map = this.get_html_translation_table('HTML_ENTITIES', quote_style)))
    {
        return false;
    }

    // fix &amp; problem
    // http://phpjs.org/functions/get_html_translation_table:416#comment_97660
    delete(hash_map['&']);
    hash_map['&'] = '&amp;';

    for (symbol in hash_map)
    {
        entity = hash_map[symbol];
        tmp_str = tmp_str.split(entity)
            .join(symbol);
    }
    tmp_str = tmp_str.split('&#039;')
        .join("'");

    return tmp_str;
}

Helper.prototype.strcmp = function(str1, str2)
{
    //  discuss at: http://phpjs.org/functions/strcmp/
    // original by: Waldo Malqui Silva (http://waldo.malqui.info)
    //    input by: Steve Hilder
    // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    //  revised by: gorthaur
    //   example 1: strcmp( 'waldo', 'owald' );
    //   returns 1: 1
    //   example 2: strcmp( 'owald', 'waldo' );
    //   returns 2: -1

    return ((str1 == str2) ? 0 : ((str1 > str2) ? 1 : -1))
}

Helper.prototype.strnatcmp = function(f_string1, f_string2, f_version)
{
    //  discuss at: http://phpjs.org/functions/strnatcmp/
    // original by: Martijn Wieringa
    // improved by: Michael White (http://getsprink.com)
    // improved by: Jack
    // bugfixed by: Onno Marsman
    //  depends on: strcmp
    //        note: Added f_version argument against code guidelines, because it's so neat
    //   example 1: strnatcmp('Price 12.9', 'Price 12.15');
    //   returns 1: 1
    //   example 2: strnatcmp('Price 12.09', 'Price 12.15');
    //   returns 2: -1
    //   example 3: strnatcmp('Price 12.90', 'Price 12.15');
    //   returns 3: 1
    //   example 4: strnatcmp('Version 12.9', 'Version 12.15', true);
    //   returns 4: -6
    //   example 5: strnatcmp('Version 12.15', 'Version 12.9', true);
    //   returns 5: 6

    var i = 0

    if (f_version == undefined)
    {
        f_version = false
    }

    var __strnatcmp_split = function(f_string)
    {
        var result = []
        var buffer = ''
        var chr = ''
        var i = 0,
            f_stringl = 0

        var text = true

        f_stringl = f_string.length
        for (var i = 0; i < f_stringl; i++)
        {
            chr = f_string.substring(i, i + 1)
            if (chr.match(/\d/))
            {
                if (text)
                {
                    if (buffer.length > 0)
                    {
                        result[result.length] = buffer
                        buffer = ''
                    }

                    text = false
                }
                buffer += chr
            }
            else if ((text == false) && (chr === '.') && (i < (f_string.length - 1)) && (f_string.substring(i + 1, i +
                        2)
                    .match(/\d/)))
            {
                result[result.length] = buffer
                buffer = ''
            }
            else
            {
                if (text == false)
                {
                    if (buffer.length > 0)
                    {
                        result[result.length] = parseInt(buffer, 10)
                        buffer = ''
                    }
                    text = true
                }
                buffer += chr
            }
        }

        if (buffer.length > 0)
        {
            if (text)
            {
                result[result.length] = buffer
            }
            else
            {
                result[result.length] = parseInt(buffer, 10)
            }
        }

        return result
    }

    var array1 = __strnatcmp_split(f_string1 + '')
    var array2 = __strnatcmp_split(f_string2 + '')

    var len = array1.length
    var text = true

    var result = -1
    var r = 0

    if (len > array2.length)
    {
        len = array2.length
        result = 1
    }

    for (var i = 0; i < len; i++)
    {
        if (isNaN(array1[i]))
        {
            if (isNaN(array2[i]))
            {
                text = true

                if ((r = this.strcmp(array1[i], array2[i])) != 0)
                {
                    return r
                }
            }
            else if (text)
            {
                return 1
            }
            else
            {
                return -1
            }
        }
        else if (isNaN(array2[i]))
        {
            if (text)
            {
                return -1
            }
            else
            {
                return 1
            }
        }
        else
        {
            if (text || f_version)
            {
                if ((r = (array1[i] - array2[i])) != 0)
                {
                    return r
                }
            }
            else
            {
                if ((r = this.strcmp(array1[i].toString(), array2[i].toString())) != 0)
                {
                    return r
                }
            }

            text = false
        }
    }

    return result
}

Helper.prototype.number_format = function(number, decimals, decPoint, thousandsSep)
{ // eslint-disable-line camelcase
    //  discuss at: http://locutus.io/php/number_format/
    // original by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
    // improved by: Kevin van Zonneveld (http://kvz.io)
    // improved by: davook
    // improved by: Brett Zamir (http://brett-zamir.me)
    // improved by: Brett Zamir (http://brett-zamir.me)
    // improved by: Theriault (https://github.com/Theriault)
    // improved by: Kevin van Zonneveld (http://kvz.io)
    // bugfixed by: Michael White (http://getsprink.com)
    // bugfixed by: Benjamin Lupton
    // bugfixed by: Allan Jensen (http://www.winternet.no)
    // bugfixed by: Howard Yeend
    // bugfixed by: Diogo Resende
    // bugfixed by: Rival
    // bugfixed by: Brett Zamir (http://brett-zamir.me)
    //  revised by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
    //  revised by: Luke Smith (http://lucassmith.name)
    //    input by: Kheang Hok Chin (http://www.distantia.ca/)
    //    input by: Jay Klehr
    //    input by: Amir Habibi (http://www.residence-mixte.com/)
    //    input by: Amirouche
    //   example 1: number_format(1234.56)
    //   returns 1: '1,235'
    //   example 2: number_format(1234.56, 2, ',', ' ')
    //   returns 2: '1 234,56'
    //   example 3: number_format(1234.5678, 2, '.', '')
    //   returns 3: '1234.57'
    //   example 4: number_format(67, 2, ',', '.')
    //   returns 4: '67,00'
    //   example 5: number_format(1000)
    //   returns 5: '1,000'
    //   example 6: number_format(67.311, 2)
    //   returns 6: '67.31'
    //   example 7: number_format(1000.55, 1)
    //   returns 7: '1,000.6'
    //   example 8: number_format(67000, 5, ',', '.')
    //   returns 8: '67.000,00000'
    //   example 9: number_format(0.9, 0)
    //   returns 9: '1'
    //  example 10: number_format('1.20', 2)
    //  returns 10: '1.20'
    //  example 11: number_format('1.20', 4)
    //  returns 11: '1.2000'
    //  example 12: number_format('1.2000', 3)
    //  returns 12: '1.200'
    //  example 13: number_format('1 000,50', 2, '.', ' ')
    //  returns 13: '100 050.00'
    //  example 14: number_format(1e-8, 8, '.', '')
    //  returns 14: '0.00000001'

    number = (number + '').replace(/[^0-9+\-Ee.]/g, '')
    var n = !isFinite(+number) ? 0 : +number
    var prec = !isFinite(+decimals) ? 0 : Math.abs(decimals)
    var sep = (typeof thousandsSep === 'undefined') ? ',' : thousandsSep
    var dec = (typeof decPoint === 'undefined') ? '.' : decPoint
    var s = ''

    var toFixedFix = function(n, prec)
    {
        if (('' + n).indexOf('e') === -1)
        {
            return +(Math.round(n + 'e+' + prec) + 'e-' + prec)
        }
        else
        {
            var arr = ('' + n).split('e')
            var sig = ''
            if (+arr[1] + prec > 0)
            {
                sig = '+'
            }
            return (+(Math.round(+arr[0] + 'e' + sig + (+arr[1] + prec)) + 'e-' + prec)).toFixed(prec)
        }
    }

    // @todo: for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec).toString() : '' + Math.round(n)).split('.')
    if (s[0].length > 3)
    {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep)
    }
    if ((s[1] || '').length < prec)
    {
        s[1] = s[1] || ''
        s[1] += new Array(prec - s[1].length + 1).join('0')
    }

    return s.join(dec)
}

Helper.prototype.urlencode = function(str)
{
    //       discuss at: https://locutus.io/php/urlencode/
    //      original by: Philip Peterson
    //      improved by: Kevin van Zonneveld (https://kvz.io)
    //      improved by: Kevin van Zonneveld (https://kvz.io)
    //      improved by: Brett Zamir (https://brett-zamir.me)
    //      improved by: Lars Fischer
    //      improved by: Waldo Malqui Silva (https://fayr.us/waldo/)
    //         input by: AJ
    //         input by: travc
    //         input by: Brett Zamir (https://brett-zamir.me)
    //         input by: Ratheous
    //      bugfixed by: Kevin van Zonneveld (https://kvz.io)
    //      bugfixed by: Kevin van Zonneveld (https://kvz.io)
    //      bugfixed by: Joris
    // reimplemented by: Brett Zamir (https://brett-zamir.me)
    // reimplemented by: Brett Zamir (https://brett-zamir.me)
    //           note 1: This reflects PHP 5.3/6.0+ behavior
    //           note 1: Please be aware that this function
    //           note 1: expects to encode into UTF-8 encoded strings, as found on
    //           note 1: pages served as UTF-8
    //        example 1: urlencode('Kevin van Zonneveld!')
    //        returns 1: 'Kevin+van+Zonneveld%21'
    //        example 2: urlencode('https://kvz.io/')
    //        returns 2: 'https%3A%2F%2Fkvz.io%2F'
    //        example 3: urlencode('https://www.google.nl/search?q=Locutus&ie=utf-8')
    //        returns 3: 'https%3A%2F%2Fwww.google.nl%2Fsearch%3Fq%3DLocutus%26ie%3Dutf-8'

    str = (str + '')

    return encodeURIComponent(str)
        .replace(/!/g, '%21')
        .replace(/'/g, '%27')
        .replace(/\(/g, '%28')
        .replace(/\)/g, '%29')
        .replace(/\*/g, '%2A')
        .replace(/~/g, '%7E')
        .replace(/%20/g, '+')
}

Helper.prototype.urldecode = function(str)
{
    //       discuss at: https://locutus.io/php/urldecode/
    //      original by: Philip Peterson
    //      improved by: Kevin van Zonneveld (https://kvz.io)
    //      improved by: Kevin van Zonneveld (https://kvz.io)
    //      improved by: Brett Zamir (https://brett-zamir.me)
    //      improved by: Lars Fischer
    //      improved by: Orlando
    //      improved by: Brett Zamir (https://brett-zamir.me)
    //      improved by: Brett Zamir (https://brett-zamir.me)
    //         input by: AJ
    //         input by: travc
    //         input by: Brett Zamir (https://brett-zamir.me)
    //         input by: Ratheous
    //         input by: e-mike
    //         input by: lovio
    //      bugfixed by: Kevin van Zonneveld (https://kvz.io)
    //      bugfixed by: Rob
    // reimplemented by: Brett Zamir (https://brett-zamir.me)
    //           note 1: info on what encoding functions to use from:
    //           note 1: https://xkr.us/articles/javascript/encode-compare/
    //           note 1: Please be aware that this function expects to decode
    //           note 1: from UTF-8 encoded strings, as found on
    //           note 1: pages served as UTF-8
    //        example 1: urldecode('Kevin+van+Zonneveld%21')
    //        returns 1: 'Kevin van Zonneveld!'
    //        example 2: urldecode('https%3A%2F%2Fkvz.io%2F')
    //        returns 2: 'https://kvz.io/'
    //        example 3: urldecode('https%3A%2F%2Fwww.google.nl%2Fsearch%3Fq%3DLocutus%26ie%3Dutf-8%26oe%3Dutf-8%26aq%3Dt%26rls%3Dcom.ubuntu%3Aen-US%3Aunofficial%26client%3Dfirefox-a')
    //        returns 3: 'https://www.google.nl/search?q=Locutus&ie=utf-8&oe=utf-8&aq=t&rls=com.ubuntu:en-US:unofficial&client=firefox-a'
    //        example 4: urldecode('%E5%A5%BD%3_4')
    //        returns 4: '\u597d%3_4'

    return decodeURIComponent((str + '')
        .replace(/%(?![\da-f]{2})/gi, function()
        {
            // PHP tolerates poorly formed escape sequences
            return '%25'
        })
        .replace(/\+/g, '%20'))
}

/**
 * Array utility functions
 *
 * @author    Joe J. Howard
 * @copyright Joe J. Howard
 * @license   https://github.com/kanso-cms/cms/blob/master/LICENSE
 */

/**
 * Copys an array
 *
 * @access public
 * @param  array  arr  The target array to copy
 * @return array
 */
Helper.prototype.array_copy = function(arr)
{
    return Array.prototype.slice.call(arr);
}

/**
 * Checks if an array contains a value
 *
 * @access public
 * @param  string needle    The value to search for
 * @param  array  haystack  The target array to index
 * @param  bool   argStrict Compare strict
 * @return bool
 */
Helper.prototype.in_array = function(needle, haystack, argStrict)
{

    var key = '',
        strict = !!argStrict;

    //we prevent the double check (strict && arr[key] === ndl) || (!strict && arr[key] == ndl)
    //in just one for, in order to improve the performance 
    //deciding wich type of comparation will do before walk array
    if (strict)
    {
        for (key in haystack)
        {
            if (haystack[key] === needle)
            {
                return true;
            }
        }
    }
    else
    {
        for (key in haystack)
        {
            if (haystack[key] == needle)
            {
                return true;
            }
        }
    }

    return false;
}

/**
 * Reduce an array to n values
 * 
 * @access public
 * @param  array  array The target array to change
 * @param  int    count The amount of items to reduce the array to
 * @return array
 */
Helper.prototype.array_reduce = function(array, count)
{
    return this.array_slice(array, 0, count);
}

/**
 * Compare two arrays
 * 
 * @access public
 * @param  array  a
 * @param  array  b
 * @return array
 */
Helper.prototype.array_compare = function(a, b)
{
    return JSON.stringify(a) === JSON.stringify(b);;
}

/**
 * Implode an array
 * 
 * @access public
 * @param  array  array  The target array to implode
 * @param  string prefix Imploding prefix
 * @param  string suffix Imploding sufix (optional) (default )
 * @return string
 */
Helper.prototype.implode = function(array, prefix, suffix)
{
    if (this.is_obj(array))
    {
        if (this.empty(array))
        {
            return '';
        }

        glue = typeof prefix === 'undefined' ? '' : prefix;

        separator = typeof suffix === 'undefined' ? '' : suffix;

        return this.rtrim(Object.keys(array).map(function(key, value)
        {
            return [key, array[key]].join(glue);
        }).join(separator), suffix);
    }

    var str = '';

    prefix = typeof prefix === 'undefined' ? '' : prefix;

    suffix = typeof suffix === 'undefined' ? '' : suffix;

    for (var i = 0; i < array.length; i++)
    {
        if (i === array.length - 1)
        {
            str += prefix + array[i];
        }
        else
        {
            str += prefix + array[i] + suffix;
        }
    }
    return str;
}

/**
 * PHP "array_slice" function
 * 
 * @access public
 * @param  array array         The target array to slice
 * @param  int   offst         At what offset to start the slice
 * @param  int   lgth          Target ending length
 * @param  bool  preserve_keys Preserve array keys (optional) (default false)
 * @return array
 */
Helper.prototype.array_slice = function(arr, offst, lgth, preserve_keys)
{
    //  discuss at: http://phpjs.org/functions/array_slice/
    // original by: Brett Zamir (http://brett-zamir.me)
    //  depends on: is_int
    //    input by: Brett Zamir (http://brett-zamir.me)
    // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    //        note: Relies on is_int because !isNaN accepts floats
    //   example 1: array_slice(["a", "b", "c", "d", "e"], 2, -1);
    //   returns 1: {0: 'c', 1: 'd'}
    //   example 2: array_slice(["a", "b", "c", "d", "e"], 2, -1, true);
    //   returns 2: {2: 'c', 3: 'd'}

    /*
    if ('callee' in arr && 'length' in arr) {
      arr = Array.prototype.slice.call(arr);
    }
    */

    var key = '';

    if (Object.prototype.toString.call(arr) !== '[object Array]' ||
        (preserve_keys && offst !== 0))
    { // Assoc. array as input or if required as output
        var lgt = 0,
            newAssoc = {};
        for (key in arr)
        {
            //if (key !== 'length') {
            lgt += 1;
            newAssoc[key] = arr[key];
            //}
        }
        arr = newAssoc;

        offst = (offst < 0) ? lgt + offst : offst;
        lgth = lgth === undefined ? lgt : (lgth < 0) ? lgt + lgth - offst : lgth;

        var assoc = {};
        var start = false,
            it = -1,
            arrlgth = 0,
            no_pk_idx = 0;
        for (key in arr)
        {
            ++it;
            if (arrlgth >= lgth)
            {
                break;
            }
            if (it == offst)
            {
                start = true;
            }
            if (!start)
            {
                continue;
            }++arrlgth;
            if (this.is_int(key) && !preserve_keys)
            {
                assoc[no_pk_idx++] = arr[key];
            }
            else
            {
                assoc[key] = arr[key];
            }
        }
        //assoc.length = arrlgth; // Make as array-like object (though length will not be dynamic)
        return assoc;
    }

    if (lgth === undefined)
    {
        return arr.slice(offst);
    }
    else if (lgth >= 0)
    {
        return arr.slice(offst, offst + lgth);
    }
    else
    {
        return arr.slice(offst, lgth);
    }
}

/**
 * Paginates an array of data
 * 
 * @access public
 * @param  array array The target array to paginate
 * @param  int   page  The current page
 * @param  int   limit Data per page
 * @return array
 */
Helper.prototype.paginate = function(array, page, limit)
{
    page = (page === false || page === 0 ? 1 : page);
    limit = (limit ? limit : 10);
    var total = count(array);
    var pages = Math.ceil((total / limit));
    var offset = (page - 1) * limit;
    var start = offset + 1;
    var end = Math.min((offset + limit), total);
    var paged = [];

    if (page > pages) return false;

    for (var i = 0; i < pages; i++)
    {
        offset = i * limit;
        paged.push(array.slice(offset, limit));
    }

    return paged;
}

/**
 * Foreach loop
 * 
 * @access public
 * @param  object  obj       The target object to loop over
 * @param  closure callback  Callback to apply to each iteration
 * @param  array   args      Array of params to apply to callback (optional) (default null)
 */
Helper.prototype.foreach = function(obj, callback, args)
{
    var value, i = 0,
        length = obj.length,
        isArray = Object.prototype.toString.call(obj) === '[object Array]';

    if (Object.prototype.toString.call(args) === '[object Array]')
    {
        if (isArray)
        {
            for (; i < length; i++)
            {

                var _currArgs = [i, obj[i]];

                value = callback.apply(obj, this.array_merge([i, obj[i]], args));

                if (value === false)
                {
                    break;
                }
            }
        }
        else
        {
            for (i in obj)
            {

                var _currArgs = [i, obj[i]];

                value = callback.apply(obj, this.array_merge([i, obj[i]], args));

                if (value === false)
                {
                    break;
                }
            }
        }

        // A special, fast, case for the most common use of each
    }
    else
    {
        if (isArray)
        {
            for (; i < length; i++)
            {
                value = callback.call(obj, i, obj[i]);

                if (value === false)
                {
                    break;
                }
            }
        }
        else
        {
            for (i in obj)
            {
                value = callback.call(obj, i, obj[i]);

                if (value === false)
                {
                    break;
                }
            }
        }
    }

    return obj;
}

/**
 * Clone an object
 * 
 * @access public
 * @param  object  src       The object to clone
 * @return object
 */
Helper.prototype.cloneObj = function(src)
{
    var clone = {};
    for (var prop in src)
    {
        if (src.hasOwnProperty(prop)) clone[prop] = src[prop];
    }
    return clone;
}

/**
 * Merge multiple arrays together
 * 
 * @access public
 * @param  ...   List of arrays to merge
 * @return array
 */
Helper.prototype.array_merge = function()
{
    //  discuss at: http://phpjs.org/functions/array_merge/
    // original by: Brett Zamir (http://brett-zamir.me)
    // bugfixed by: Nate
    // bugfixed by: Brett Zamir (http://brett-zamir.me)
    //    input by: josh
    //   example 1: arr1 = {"color": "red", 0: 2, 1: 4}
    //   example 1: arr2 = {0: "a", 1: "b", "color": "green", "shape": "trapezoid", 2: 4}
    //   example 1: array_merge(arr1, arr2)
    //   returns 1: {"color": "green", 0: 2, 1: 4, 2: "a", 3: "b", "shape": "trapezoid", 4: 4}
    //   example 2: arr1 = []
    //   example 2: arr2 = {1: "data"}
    //   example 2: array_merge(arr1, arr2)
    //   returns 2: {0: "data"}

    var args = Array.prototype.slice.call(arguments),
        argl = args.length,
        arg,
        retObj = {},
        k = '',
        argil = 0,
        j = 0,
        i = 0,
        ct = 0,
        toStr = Object.prototype.toString,
        retArr = true;

    for (var i = 0; i < argl; i++)
    {
        if (toStr.call(args[i]) !== '[object Array]')
        {
            retArr = false;
            break;
        }
    }

    if (retArr)
    {
        retArr = [];
        for (var i = 0; i < argl; i++)
        {
            retArr = retArr.concat(args[i]);
        }
        return retArr;
    }

    for (i = 0, ct = 0; i < argl; i++)
    {
        arg = args[i];
        if (toStr.call(arg) === '[object Array]')
        {
            for (j = 0, argil = arg.length; j < argil; j++)
            {
                retObj[ct++] = arg[j];
            }
        }
        else
        {
            for (k in arg)
            {
                if (arg.hasOwnProperty(k))
                {
                    if (parseInt(k, 10) + '' === k)
                    {
                        retObj[ct++] = arg[k];
                    }
                    else
                    {
                        retObj[k] = arg[k];
                    }
                }
            }
        }
    }
    return retObj;
}

/**
 * Array filter
 * 
 * @access public
 * @param  array array Target array to filter
 * @return array
 */
Helper.prototype.array_filter = function(array)
{
    var result = [];
    for (var i = 0; i < array.length; i++)
    {
        if (array[i] === '' || this.empty(array[i])) continue;
        result.push(array[i]);
    }
    return result;
}

/**
 * Array filter
 * 
 * @access public
 * @param  array array Target array to filter
 * @return array
 */
Helper.prototype.array_unique = function(array)
{
    var result = [];

    if (this.is_array(array))
    {
        for (var i = 0; i < array.length; i++)
        {
            if (!this.in_array(array[i], result))
            {
                result.push(array[i])
            }
        }
    }

    return result;
}

/**
 * Is array
 * 
 * @access public
 * @param  mixed mixed_var Target object to to check
 * @return bool
 */
Helper.prototype.is_obj = function(mixed_var)
{
    if ((typeof mixed_var === "object" || typeof mixed_var === 'function') && (mixed_var !== null))
    {
        return true;
    }

    return false;
}


/**
 * Is array
 * 
 * @access public
 * @param  array array Target array to filter
 * @return bool
 */
Helper.prototype.is_array = function(mixed_var)
{
    return Object.prototype.toString.call(mixed_var) === '[object Array]' || Object.prototype.toString.call(mixed_var) === '[object NodeList]';
}

/**
 * Miscellaneous helper functions
 *
 * @author    Joe J. Howard
 * @copyright Joe J. Howard
 * @license   https://github.com/kanso-cms/cms/blob/master/LICENSE
 */

/**
 * Is numeric? 
 *
 * @access public
 * @param  mixed  mixed_var Variable to check
 * @return bool
 */
Helper.prototype.is_numeric = function(mixed_var)
{
    var whitespace =
        " \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000";
    return (typeof mixed_var === 'number' || (typeof mixed_var === 'string' && whitespace.indexOf(mixed_var.slice(-1)) === -
        1)) && mixed_var !== '' && !isNaN(mixed_var);
}

/**
 * Is callable ?
 *
 * @access public
 * @param  mixed  mixed_var Variable to check
 * @return bool
 */
Helper.prototype.isCallable = function(obj)
{
    return Object.prototype.toString.call(obj) === '[object Function]';
}

/**
 * Count
 *
 * @access public
 * @param  mixed  mixed_var Variable to count
 * @param  string mode      Variable count mode
 * @return int
 */
Helper.prototype.count = function(mixed_var, mode)
{
    var key, cnt = 0;
    if (mixed_var === null || typeof mixed_var === 'undefined')
    {
        return 0;
    }
    else if (mixed_var.constructor !== Array && mixed_var.constructor !== Object)
    {
        return 1;
    }

    if (mode === 'COUNT_RECURSIVE')
    {
        mode = 1;
    }
    if (mode != 1)
    {
        mode = 0;
    }

    for (key in mixed_var)
    {
        if (mixed_var.hasOwnProperty(key))
        {
            cnt++;
            if (mode == 1 && mixed_var[key] && (mixed_var[key].constructor === Array || mixed_var[key].constructor ===
                    Object))
            {
                cnt += this.count(mixed_var[key], 1);
            }
        }
    }

    return cnt;
}

/**
 * Convert to boolean
 *
 * @access public
 * @param  mixed  value Variable to evaluate
 * @return bool
 */
Helper.prototype.bool = function(value)
{

    value = (typeof value === 'undefined' ? false : value);

    if (typeof value === 'boolean') return value;

    if (typeof value === 'number') return value > 0;

    if (typeof value === 'string')
    {
        if (value.toLowerCase() === 'false') return false;
        if (value.toLowerCase() === 'true') return true;
        if (value.toLowerCase() === 'on') return true;
        if (value.toLowerCase() === 'off') return false;
        if (value.toLowerCase() === 'undefined') return false;
        if (this.is_numeric(value)) return Number(value) > 0;
        if (value === '') return false;
    }

    return false;
}

/**
 * Convert to integer
 *
 * @access public
 * @param  mixed  mixed_var Variable to evaluate
 * @return int
 */
Helper.prototype.intval = function(mixed_var, base)
{
    //  discuss at: http://phpjs.org/functions/intval/
    // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // improved by: stensi
    // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // bugfixed by: Brett Zamir (http://brett-zamir.me)
    // bugfixed by: Rafał Kukawski (http://kukawski.pl)
    //    input by: Matteo
    //   example 1: intval('Kevin van Zonneveld');
    //   returns 1: 0
    //   example 2: intval(4.2);
    //   returns 2: 4
    //   example 3: intval(42, 8);
    //   returns 3: 42
    //   example 4: intval('09');
    //   returns 4: 9
    //   example 5: intval('1e', 16);
    //   returns 5: 30

    var tmp;

    var type = typeof mixed_var;

    if (type === 'boolean')
    {
        return +mixed_var;
    }
    else if (type === 'string')
    {
        tmp = parseInt(mixed_var, base || 10);
        return (isNaN(tmp) || !isFinite(tmp)) ? 0 : tmp;
    }
    else if (type === 'number' && isFinite(mixed_var))
    {
        return mixed_var | 0;
    }
    else
    {
        return 0;
    }
}

/**
 * Convert to f,oat
 *
 * @access public
 * @param  mixed  mixed_var Variable to evaluate
 * @return float
 */
Helper.prototype.floatval = function(mixedVar)
{
    return (parseFloat(mixedVar) || 0)
}

/**
 * Checks if variable is set
 *
 * @access public
 * @param  mixed  mixed_var Variable to evaluate
 * @return bool
 */
Helper.prototype.isset = function()
{
    //  discuss at: http://phpjs.org/functions/isset/
    // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // improved by: FremyCompany
    // improved by: Onno Marsman
    // improved by: Rafał Kukawski
    //   example 1: isset( undefined, true);
    //   returns 1: false
    //   example 2: isset( 'Kevin van Zonneveld' );
    //   returns 2: true

    var a = arguments,
        l = a.length,
        i = 0,
        undef;

    if (l === 0)
    {
        throw new Error('Empty isset');
    }

    while (i !== l)
    {
        if (a[i] === undef || a[i] === null)
        {
            return false;
        }
        i++;
    }
    return true;
}

/**
 * Checks if variable is empty
 *
 * @access public
 * @param  mixed  value Variable to evaluate
 * @return bool
 */
Helper.prototype.empty = function(value)
{

    value = (typeof value === 'undefined' ? false : value);

    if (typeof value === 'boolean') return value !== true;

    if (typeof value === 'number') return value < 1;

    if (typeof value === 'string')
    {
        if (value.toLowerCase() === 'undefined') return true;
        if (this.is_numeric(value)) return Number(value) < 1;
        if (value === '') return true;
        if (value !== '') return false;
    }

    if (Object.prototype.toString.call(value) === '[object Array]') return value.length < 1;

    if (Object.prototype.toString.call(value) === '[object Object]') return (Object.getOwnPropertyNames(value).length === 0);

    return false;

}

/**
 * Checks if variable is an object
 *
 * @access public
 * @param  mixed  mixed_var Variable to evaluate
 * @return bool
 */
Helper.prototype.is_object = function(mixed_var)
{
    //  discuss at: http://phpjs.org/functions/is_object/
    // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // improved by: Legaev Andrey
    // improved by: Michael White (http://getsprink.com)
    //   example 1: is_object('23');
    //   returns 1: false
    //   example 2: is_object({foo: 'bar'});
    //   returns 2: true
    //   example 3: is_object(null);
    //   returns 3: false

    if (Object.prototype.toString.call(mixed_var) === '[object Array]')
    {
        return false;
    }
    return mixed_var !== null && typeof mixed_var === 'object';
}

/**
 * Checks if variable is a nodelist-array
 *
 * @access public
 * @param  mixed  nodes Variable to evaluate
 * @return bool
 */
Helper.prototype.isNodeList = function(nodes)
{
    return nodes == '[object NodeList]';
}

/**
 * Gets url query
 *
 * @access public
 * @param  string  name String query to get (optional)
 * @return object|string
 */
Helper.prototype.url_query = function(name)
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
 * DOM Event Listener Manager
 *
 * @author    Joe J. Howard
 * @copyright Joe J. Howard
 * @license   https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE
 */

/**
 * Add an event listener
 *
 * @access public
 * @param  node    element    The target DOM node
 * @param  string  eventName  Event type
 * @param  closure handler    Callback event
 * @param  bool    useCapture Use capture (optional) (defaul false)
 */
Helper.prototype.addEventListener = function(element, eventName, handler, useCapture)
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

        this._addListener(element, eventName, handler, useCapture);
    }
}

/**
 * Removes event listeners on a DOM node
 *
 * If no event name is given, all attached event listeners are removed.
 * If no callback is given, all callbacks for the event type will be removed.
 * This function can still remove "annonymous" functions that are given a name as they are declared.
 * 
 * @access public
 * @param  node    element    The target DOM node
 * @param  string  eventName  Event type
 * @param  closure handler    Callback event
 * @param  bool    useCapture Use capture (optional) (defaul false)
 */
Helper.prototype.removeEventListener = function(element, eventName, handler, useCapture)
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
            return this._removeElementListeners(element);
        }

        // If the callback was not provided - remove all events of the type on the element
        if (!handler)
        {
            return this._removeElementTypeListeners(element, eventName);
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
                this._removeListener(element, eventName, handler, useCapture);
                this._events[eventName].splice(i, 1);
                break;
            }
        }
    }
}

/**
 * Removes all event listeners registered by the library
 *
 * @access public
 */
Helper.prototype.clearEventListeners = function()
{
    var events = this._events;

    for (var eventName in events)
    {
        var eventObj = events[eventName];
        var i = eventObj.length;
        while (i--)
        {
            this._removeListener(eventObj[i]['element'], eventName, eventObj[i]['handler'], eventObj[i]['useCapture']);
            this._events[eventName].splice(i, 1);
        }
    }
}

/**
 * Removes all event listeners registered by the library on nodes
 * that are no longer part of the DOM tree
 *
 * @access public
 */
Helper.prototype.collectGarbage = function()
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
            if (!this.nodeExists(el))
            {
                this._removeListener(eventObj[i]['element'], eventName, eventObj[i]['handler'], eventObj[i]['useCapture']);
                this._events[eventName].splice(i, 1);
            }
        }
    }
}

/**
 * Removes all registered event listners on an element
 *
 * @access private
 * @param  node    element Target node element
 */
Helper.prototype._removeElementListeners = function(element)
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
                this._removeListener(eventObj[i]['element'], eventName, eventObj[i]['handler'], eventObj[i]['useCapture']);
                this._events[eventName].splice(i, 1);
            }
        }
    }
}

/**
 * Removes all registered event listners of a specific type on an element
 *
 * @access private
 * @param  node    element Target node element
 * @param  string  type    Event listener type
 */
Helper.prototype._removeElementTypeListeners = function(element, type)
{
    var eventObj = this._events[type];
    var i = eventObj.length;
    while (i--)
    {
        if (eventObj[i]['element'] === element)
        {
            this._removeListener(eventObj[i]['element'], type, eventObj[i]['handler'], eventObj[i]['useCapture']);
            this._events[type].splice(i, 1);
        }
    }
}

/**
 * Adds a listener to the element
 *
 * @access private
 * @param  node    element    The target DOM node
 * @param  string  eventName  Event type
 * @param  closure handler    Callback event
 * @param  bool    useCapture Use capture (optional) (defaul false)
 */
Helper.prototype._addListener = function(el, eventName, handler, useCapture)
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
 * Removes a listener from the element
 *
 * @access private
 * @param  node    element    The target DOM node
 * @param  string  eventName  Event type
 * @param  closure handler    Callback event
 * @param  bool    useCapture Use capture (optional) (defaul false)
 */
Helper.prototype._removeListener = function(el, eventName, handler, useCapture)
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
 * Helper Animation component
 *
 * @author    Joe J. Howard
 * @copyright Joe J. Howard
 * @license   https://github.com/kanso-cms/cms/blob/master/LICENSE
 */

/**
 * Vendor prefix a css property and convert to camelCase
 *
 * @access private
 * @param  string property The CSS base property
 * @return array
 */
Helper.prototype._vendorPrefix = function(property)
{
    // Properties to return
    var props = [];

    // Convert to regular hyphenated property 
    property = this.camelCaseToHyphen(property);

    // Is the property prefixable ?
    if (this.in_array(property, this.cssPrefixable))
    {
        var prefixes = this.cssPrefixes;

        // Loop vendor prefixes
        for (var i = 0; i < prefixes.length; i++)
        {
            props.push(prefixes[i] + this.ucfirst(this.toCamelCase(property)));
        }
    }

    // Add non-prefixed property
    props.push(this.toCamelCase(property));

    return props;
}

/**
 * Expand shorthand property to longhand properties 
 *
 * @access private
 * @param  string property The CSS base property (in camelCase)
 * @return array
 */
Helper.prototype._shortHandExpand = function(property, recurse)
{
    var _this = this;
    var props = this.shortHandProps;

    // Doesn't exist
    if (!props.hasOwnProperty(property))
    {
        return [property];
    }

    return props[property].map(function(p)
    {
        if (p.substr(0, 1) === '-')
        {
            var longhand = property + _this.toCamelCase(p);
        }
        else
        {
            var longhand = p;
        }
        //var longhand = p.substr(0, 1) === '-' ? property + p : p;
        return recurse ? _this._shortHandExpand(longhand, recurse) : longhand;
    });
}

/**
 * Get the element's computed style on a property
 *
 * @access private
 * @param  node   el   Target element
 * @param  string prop CSS property to check (in camelCase) (optional)
 * @return mixed
 */
Helper.prototype._computeStyle = function(el, property)
{
    if (window.getComputedStyle)
    {
        if (property)
        {
            return window.getComputedStyle(el, null)[property];
        }

        return window.getComputedStyle(el, null);

    }
    if (el.currentStyle)
    {
        if (property)
        {
            return el.currentStyle[property];
        }
        return el.currentStyle;
    }

    return '';
}

/**
 * Concatenate longhand to shorthand
 *
 * @access private
 * @param  node   el      Target element
 * @param  array  longHandProps Array of longhanded CSS properties in order (camelCased)
 * @return string
 */
Helper.prototype._concatShortHandProperties = function(el, longHandProps)
{
    var shorthand = '';
    var multiValArr = [];

    for (var j = 0, len = longHandProps.length; j < len; j++)
    {
        var longHandStyle = this._computeStyle(el, longHandProps[j]);

        if (longHandStyle)
        {
            if (longHandStyle.indexOf(',') >= 0)
            {
                multiValArr.push(longHandStyle.split(',').map(Function.prototype.call, String.prototype.trim));
            }
            else
            {
                shorthand += ' ' + longHandStyle;
            }
        }
    }

    if (!this.empty(multiValArr))
    {
        var _this = this;
        var multiValArrStrs = [];
        for (var k = 0, len = multiValArr.length; k < len; k++)
        {
            multiValArr[k].map(function(val, n)
            {
                if (!_this.isset(multiValArrStrs[n]))
                {
                    multiValArrStrs[n] = val;
                }
                else
                {
                    multiValArrStrs[n] += ' ' + val;
                }
            });
        }

        return multiValArrStrs.join(', ');
    }

    return shorthand.trim();
}

/**
 * Normalizes and easing e.g 'ease-in-out' and 'easeInOut' will both return cubic bezier
 *
 * @access private
 * @param  string value easing value or string
 * @return array
 */
Helper.prototype._normalizeEasing = function(value)
{
    for (var camelCased in this.cssEasings)
    {
        if (!this.cssEasings.hasOwnProperty(camelCased))
        {
            continue;
        }
        if (value === this.cssEasings[camelCased] || value === camelCased)
        {
            return this.cssEasings[camelCased];
        }
    }

    return value;
}

/**
 * Get an element's currently displaying style
 * Works on shorthand and longhand
 *
 * @access public
 * @param  node   el   Target element
 * @param  string prop CSS property to check
 * @return string
 */
Helper.prototype.getStyle = function(el, prop)
{
    // Firefox and otther browsers do not concatenate to the shorthand property even when
    // it was defined as shorthand in the stylsheet
    // console.log(window.getComputedStyle(document.body));
    // console.log(window.getComputedStyle(document.body).padding);
    // console.log(window.getComputedStyle(document.body).getPropertyValue('padding'));

    // Additionally, some css values can be comma separated
    // e.g
    // transition height 300ms ease, width 300ms ease;

    // Normalize the property to camelCase and check for vendor prefixes
    var properties = this._vendorPrefix(prop);

    for (var i = 0, len = properties.length; i < len; i++)
    {
        // current prop
        var property = properties[i];

        // Get longhand properties in order
        var longHands = this._shortHandExpand(property);

        // is this a shorthand property ?
        var isShortHandProp = longHands.length === 1;

        // Do we need to concatenate to shorthand ?
        if (isShortHandProp)
        {
            return this._computeStyle(el, property);
        }

        var shorthand = this._concatShortHandProperties(el, longHands);

        if (shorthand)
        {
            return shorthand;
        }
    }
}

/**
 * Set CSS value(s) on element
 *
 * @access public
 * @param  node   el     Target DOM node
 * @param  string|object Assoc array of property->value or string property
 * @example Helper.css(node, { display : 'none' });
 * @example Helper.css(node, 'display', 'none');
 */
Helper.prototype.css = function(el, property, value)
{
    // If their is no value and property is an object
    if (this.is_object(property))
    {
        for (var key in property)
        {
            if (!property.hasOwnProperty(key))
            {
                continue;
            }

            this.css(el, key, property[key]);
        }
    }
    else
    {
        // Normalise if this is an easing value - e.g display, 'ease-in-out'
        value = this._normalizeEasing(value);

        // vendor prefix the property if need be and convert to camelCase
        var properties = this._vendorPrefix(property);

        // Loop vendored (if added) and unvendored properties and apply
        for (var i = 0; i < properties.length; i++)
        {
            el.style[properties[i]] = value;
        }
    }
}

/**
 * Animate a css proprety
 *
 * @access public
 * @param  node     el          Target DOM node
 * @param  string   cssProperty CSS property
 * @param  mixed    from        Start value
 * @param  mixed    to          Ending value
 * @param  int      time        Animation time in ms
 * @param  string   easing      Easing function
 * @param  function callback    Callback to apply when animation ends (optional)
 */
Helper.prototype.animate = function(el, cssProperty, from, to, time, easing, callback)
{
    // Set defaults if values were not provided;
    time = (typeof time === 'undefined' ? 300 : time);
    easing = (typeof easing === 'undefined' ? 'linear' : this._normalizeEasing(easing));
    callback = (typeof callback === 'undefined' ? false : callback);

    // Width and height need to use js to get the starting size
    // if it was set to auto/initial/null
    if ((cssProperty === 'height' || cssProperty === 'width') && (from === 'initial' || from === 'auto' || !from))
    {
        if (cssProperty === 'height')
        {
            from = (el.clientHeight || el.offsetHeight) + 'px';
        }
        else
        {
            from = (el.clientWidth || el.offsetWidth) + 'px';
        }

        // Float/integer of number fallback if not provided as string
        if (Number.isInteger(from) || Number(from) === from && from % 1 !== 0)
        {
            from = from + 'px';
        }

        this.css(el, cssProperty, from);
    }

    // Ortherwise set the current style or the defined "from"
    else
    {
        if (from === 'initial' || from === 'auto' || !from)
        {
            this.css(el, cssProperty, this.getStyle(el, cssProperty));
        }
        else
        {
            this.css(el, cssProperty, from);
        }
    }


    // We need to merge transitions into a single allied value
    var existingTransitions = this.getStyle(el, 'transition');

    console.log(existingTransitions);

    if (existingTransitions !== 'none' && existingTransitions !== 'all 0s ease 0s')
    {
        // Don't apply the same transition value twice 
        // The animation transition on a property should override 
        // an existing one
        var transitions = existingTransitions.split(',').map(Function.prototype.call, String.prototype.trim);
        transitions.push(cssProperty + ' ' + time + 'ms ' + easing);

        var props = [];
        for (var i = transitions.length - 1; i >= 0; --i)
        {
            var prop = transitions[i].split(' ')[0];
            if (this.in_array(prop, props))
            {
                transitions.splice(i, 1);
            }
            props.push(prop);
        }

        this.css(el, 'transition', transitions.join(', '));
    }
    else
    {
        this.css(el, 'transition', cssProperty + ' ' + time + 'ms ' + easing);
    }

    this.css(el, cssProperty, to);

    // Add an event listener to check when the transition has finished
    var _this = this;

    el.addEventListener('transitionend', function transitionEnd(e)
    {
        e = e || window.event;

        if (e.propertyName == cssProperty)
        {
            _this.removeStyle(el, 'transition');

            el.removeEventListener('transitionend', transitionEnd, false);

            if (_this.isCallable(callback))
            {
                callback.call(null, el);
            }
        }

    }, false);
}

/**
 * Browser utility functions
 *
 * @author    Joe J. Howard
 * @copyright Joe J. Howard
 * @license   https://github.com/kanso-cms/cms/blob/master/LICENSE
 */

/**
 * Get the browser with version
 *
 * @access public
 * @return object
 */
Helper.prototype.getBrowser = function()
{
    if (this.browser)
    {
        return this.browser;
    }

    /**
     * Detect.js: User-Agent Parser
     * https://github.com/darcyclarke/Detect.js
     * Dual licensed under the MIT and GPL licenses.
     *
     * @version 2.2.2
     * @author Darcy Clarke
     * @url http://darcyclarke.me
     * @createdat Mon Oct 26 2015 08:21:54 GMT-0200 (Horário brasileiro de verão)
     *
     * Based on UA-Parser (https://github.com/tobie/ua-parser) by Tobie Langel
     *
     * Example Usage:
     * var agentInfo = detect.parse(navigator.userAgent);
     * console.log(agentInfo.browser.family); // Chrome
     *
     */
    (function(e)
    {
        Array.prototype.map || (Array.prototype.map = function(e, r)
        {
            var a, o, i;
            if (null == this) throw new TypeError(" this is null or not defined");
            var n = Object(this),
                t = n.length >>> 0;
            if ("function" != typeof e) throw new TypeError(e + " is not a function");
            for (r && (a = r), o = Array(t), i = 0; t > i;)
            {
                var l, d;
                i in n && (l = n[i], d = e.call(a, l, i, n), o[i] = d), i++
            }
            return o
        });
        var r = e.detect = function()
        {
            var e = function() {},
                r = {
                    browser_parsers: [
                    {
                        regex: "^(Opera)/(\\d+)\\.(\\d+) \\(Nintendo Wii",
                        family_replacement: "Wii",
                        manufacturer: "Nintendo"
                    },
                    {
                        regex: "(SeaMonkey|Camino)/(\\d+)\\.(\\d+)\\.?([ab]?\\d+[a-z]*)",
                        family_replacement: "Camino",
                        other: !0
                    },
                    {
                        regex: "(Pale[Mm]oon)/(\\d+)\\.(\\d+)\\.?(\\d+)?",
                        family_replacement: "Pale Moon (Firefox Variant)",
                        other: !0
                    },
                    {
                        regex: "(Fennec)/(\\d+)\\.(\\d+)\\.?([ab]?\\d+[a-z]*)",
                        family_replacement: "Firefox Mobile"
                    },
                    {
                        regex: "(Fennec)/(\\d+)\\.(\\d+)(pre)",
                        family_replacment: "Firefox Mobile"
                    },
                    {
                        regex: "(Fennec)/(\\d+)\\.(\\d+)",
                        family_replacement: "Firefox Mobile"
                    },
                    {
                        regex: "Mobile.*(Firefox)/(\\d+)\\.(\\d+)",
                        family_replacement: "Firefox Mobile"
                    },
                    {
                        regex: "(Namoroka|Shiretoko|Minefield)/(\\d+)\\.(\\d+)\\.(\\d+(?:pre)?)",
                        family_replacement: "Firefox ($1)"
                    },
                    {
                        regex: "(Firefox)/(\\d+)\\.(\\d+)(a\\d+[a-z]*)",
                        family_replacement: "Firefox Alpha"
                    },
                    {
                        regex: "(Firefox)/(\\d+)\\.(\\d+)(b\\d+[a-z]*)",
                        family_replacement: "Firefox Beta"
                    },
                    {
                        regex: "(Firefox)-(?:\\d+\\.\\d+)?/(\\d+)\\.(\\d+)(a\\d+[a-z]*)",
                        family_replacement: "Firefox Alpha"
                    },
                    {
                        regex: "(Firefox)-(?:\\d+\\.\\d+)?/(\\d+)\\.(\\d+)(b\\d+[a-z]*)",
                        family_replacement: "Firefox Beta"
                    },
                    {
                        regex: "(Namoroka|Shiretoko|Minefield)/(\\d+)\\.(\\d+)([ab]\\d+[a-z]*)?",
                        family_replacement: "Firefox ($1)"
                    },
                    {
                        regex: "(Firefox).*Tablet browser (\\d+)\\.(\\d+)\\.(\\d+)",
                        family_replacement: "MicroB",
                        tablet: !0
                    },
                    {
                        regex: "(MozillaDeveloperPreview)/(\\d+)\\.(\\d+)([ab]\\d+[a-z]*)?"
                    },
                    {
                        regex: "(Flock)/(\\d+)\\.(\\d+)(b\\d+?)",
                        family_replacement: "Flock",
                        other: !0
                    },
                    {
                        regex: "(RockMelt)/(\\d+)\\.(\\d+)\\.(\\d+)",
                        family_replacement: "Rockmelt",
                        other: !0
                    },
                    {
                        regex: "(Navigator)/(\\d+)\\.(\\d+)\\.(\\d+)",
                        family_replacement: "Netscape"
                    },
                    {
                        regex: "(Navigator)/(\\d+)\\.(\\d+)([ab]\\d+)",
                        family_replacement: "Netscape"
                    },
                    {
                        regex: "(Netscape6)/(\\d+)\\.(\\d+)\\.(\\d+)",
                        family_replacement: "Netscape"
                    },
                    {
                        regex: "(MyIBrow)/(\\d+)\\.(\\d+)",
                        family_replacement: "My Internet Browser",
                        other: !0
                    },
                    {
                        regex: "(Opera Tablet).*Version/(\\d+)\\.(\\d+)(?:\\.(\\d+))?",
                        family_replacement: "Opera Tablet",
                        tablet: !0
                    },
                    {
                        regex: "(Opera)/.+Opera Mobi.+Version/(\\d+)\\.(\\d+)",
                        family_replacement: "Opera Mobile"
                    },
                    {
                        regex: "Opera Mobi",
                        family_replacement: "Opera Mobile"
                    },
                    {
                        regex: "(Opera Mini)/(\\d+)\\.(\\d+)",
                        family_replacement: "Opera Mini"
                    },
                    {
                        regex: "(Opera Mini)/att/(\\d+)\\.(\\d+)",
                        family_replacement: "Opera Mini"
                    },
                    {
                        regex: "(Opera)/9.80.*Version/(\\d+)\\.(\\d+)(?:\\.(\\d+))?",
                        family_replacement: "Opera"
                    },
                    {
                        regex: "(OPR)/(\\d+)\\.(\\d+)(?:\\.(\\d+))?",
                        family_replacement: "Opera"
                    },
                    {
                        regex: "(webOSBrowser)/(\\d+)\\.(\\d+)",
                        family_replacement: "webOS"
                    },
                    {
                        regex: "(webOS)/(\\d+)\\.(\\d+)",
                        family_replacement: "webOS"
                    },
                    {
                        regex: "(wOSBrowser).+TouchPad/(\\d+)\\.(\\d+)",
                        family_replacement: "webOS TouchPad"
                    },
                    {
                        regex: "(luakit)",
                        family_replacement: "LuaKit",
                        other: !0
                    },
                    {
                        regex: "(Lightning)/(\\d+)\\.(\\d+)([ab]?\\d+[a-z]*)",
                        family_replacement: "Lightning",
                        other: !0
                    },
                    {
                        regex: "(Firefox)/(\\d+)\\.(\\d+)\\.(\\d+(?:pre)?) \\(Swiftfox\\)",
                        family_replacement: "Swiftfox",
                        other: !0
                    },
                    {
                        regex: "(Firefox)/(\\d+)\\.(\\d+)([ab]\\d+[a-z]*)? \\(Swiftfox\\)",
                        family_replacement: "Swiftfox",
                        other: !0
                    },
                    {
                        regex: "rekonq",
                        family_replacement: "Rekonq",
                        other: !0
                    },
                    {
                        regex: "(conkeror|Conkeror)/(\\d+)\\.(\\d+)\\.?(\\d+)?",
                        family_replacement: "Conkeror",
                        other: !0
                    },
                    {
                        regex: "(konqueror)/(\\d+)\\.(\\d+)\\.(\\d+)",
                        family_replacement: "Konqueror",
                        other: !0
                    },
                    {
                        regex: "(WeTab)-Browser",
                        family_replacement: "WeTab",
                        other: !0
                    },
                    {
                        regex: "(Comodo_Dragon)/(\\d+)\\.(\\d+)\\.(\\d+)",
                        family_replacement: "Comodo Dragon",
                        other: !0
                    },
                    {
                        regex: "(YottaaMonitor)",
                        family_replacement: "Yottaa Monitor",
                        other: !0
                    },
                    {
                        regex: "(Kindle)/(\\d+)\\.(\\d+)",
                        family_replacement: "Kindle"
                    },
                    {
                        regex: "(Symphony) (\\d+).(\\d+)",
                        family_replacement: "Symphony",
                        other: !0
                    },
                    {
                        regex: "Minimo",
                        family_replacement: "Minimo",
                        other: !0
                    },
                    {
                        regex: "(Edge)/(\\d+)\\.(\\d+)",
                        family_replacement: "Edge"
                    },
                    {
                        regex: "(CrMo)/(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+)",
                        family_replacement: "Chrome Mobile"
                    },
                    {
                        regex: "(CriOS)/(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+)",
                        family_replacement: "Chrome Mobile iOS"
                    },
                    {
                        regex: "(Chrome)/(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+) Mobile",
                        family_replacement: "Chrome Mobile"
                    },
                    {
                        regex: "(chromeframe)/(\\d+)\\.(\\d+)\\.(\\d+)",
                        family_replacement: "Chrome Frame"
                    },
                    {
                        regex: "(UC Browser)(\\d+)\\.(\\d+)\\.(\\d+)",
                        family_replacement: "UC Browser",
                        other: !0
                    },
                    {
                        regex: "(SLP Browser)/(\\d+)\\.(\\d+)",
                        family_replacement: "Tizen Browser",
                        other: !0
                    },
                    {
                        regex: "(Epiphany)/(\\d+)\\.(\\d+).(\\d+)",
                        family_replacement: "Epiphany",
                        other: !0
                    },
                    {
                        regex: "(SE 2\\.X) MetaSr (\\d+)\\.(\\d+)",
                        family_replacement: "Sogou Explorer",
                        other: !0
                    },
                    {
                        regex: "(Pingdom.com_bot_version_)(\\d+)\\.(\\d+)",
                        family_replacement: "PingdomBot",
                        other: !0
                    },
                    {
                        regex: "(facebookexternalhit)/(\\d+)\\.(\\d+)",
                        family_replacement: "FacebookBot"
                    },
                    {
                        regex: "(Twitterbot)/(\\d+)\\.(\\d+)",
                        family_replacement: "TwitterBot"
                    },
                    {
                        regex: "(AdobeAIR|Chromium|FireWeb|Jasmine|ANTGalio|Midori|Fresco|Lobo|PaleMoon|Maxthon|Lynx|OmniWeb|Dillo|Camino|Demeter|Fluid|Fennec|Shiira|Sunrise|Chrome|Flock|Netscape|Lunascape|WebPilot|NetFront|Netfront|Konqueror|SeaMonkey|Kazehakase|Vienna|Iceape|Iceweasel|IceWeasel|Iron|K-Meleon|Sleipnir|Galeon|GranParadiso|Opera Mini|iCab|NetNewsWire|ThunderBrowse|Iron|Iris|UP\\.Browser|Bunjaloo|Google Earth|Raven for Mac)/(\\d+)\\.(\\d+)\\.(\\d+)"
                    },
                    {
                        regex: "(Bolt|Jasmine|IceCat|Skyfire|Midori|Maxthon|Lynx|Arora|IBrowse|Dillo|Camino|Shiira|Fennec|Phoenix|Chrome|Flock|Netscape|Lunascape|Epiphany|WebPilot|Opera Mini|Opera|NetFront|Netfront|Konqueror|Googlebot|SeaMonkey|Kazehakase|Vienna|Iceape|Iceweasel|IceWeasel|Iron|K-Meleon|Sleipnir|Galeon|GranParadiso|iCab|NetNewsWire|Iron|Space Bison|Stainless|Orca|Dolfin|BOLT|Minimo|Tizen Browser|Polaris)/(\\d+)\\.(\\d+)"
                    },
                    {
                        regex: "(iRider|Crazy Browser|SkipStone|iCab|Lunascape|Sleipnir|Maemo Browser) (\\d+)\\.(\\d+)\\.(\\d+)"
                    },
                    {
                        regex: "(iCab|Lunascape|Opera|Android|Jasmine|Polaris|BREW) (\\d+)\\.(\\d+)\\.?(\\d+)?"
                    },
                    {
                        regex: "(Android) Donut",
                        v2_replacement: "2",
                        v1_replacement: "1"
                    },
                    {
                        regex: "(Android) Eclair",
                        v2_replacement: "1",
                        v1_replacement: "2"
                    },
                    {
                        regex: "(Android) Froyo",
                        v2_replacement: "2",
                        v1_replacement: "2"
                    },
                    {
                        regex: "(Android) Gingerbread",
                        v2_replacement: "3",
                        v1_replacement: "2"
                    },
                    {
                        regex: "(Android) Honeycomb",
                        v1_replacement: "3"
                    },
                    {
                        regex: "(IEMobile)[ /](\\d+)\\.(\\d+)",
                        family_replacement: "IE Mobile"
                    },
                    {
                        regex: "(MSIE) (\\d+)\\.(\\d+).*XBLWP7",
                        family_replacement: "IE Large Screen"
                    },
                    {
                        regex: "(Firefox)/(\\d+)\\.(\\d+)\\.(\\d+)"
                    },
                    {
                        regex: "(Firefox)/(\\d+)\\.(\\d+)(pre|[ab]\\d+[a-z]*)?"
                    },
                    {
                        regex: "(Obigo)InternetBrowser",
                        other: !0
                    },
                    {
                        regex: "(Obigo)\\-Browser",
                        other: !0
                    },
                    {
                        regex: "(Obigo|OBIGO)[^\\d]*(\\d+)(?:.(\\d+))?",
                        other: !0
                    },
                    {
                        regex: "(MAXTHON|Maxthon) (\\d+)\\.(\\d+)",
                        family_replacement: "Maxthon",
                        other: !0
                    },
                    {
                        regex: "(Maxthon|MyIE2|Uzbl|Shiira)",
                        v1_replacement: "0",
                        other: !0
                    },
                    {
                        regex: "(PLAYSTATION) (\\d+)",
                        family_replacement: "PlayStation",
                        manufacturer: "Sony"
                    },
                    {
                        regex: "(PlayStation Portable)[^\\d]+(\\d+).(\\d+)",
                        manufacturer: "Sony"
                    },
                    {
                        regex: "(BrowseX) \\((\\d+)\\.(\\d+)\\.(\\d+)",
                        other: !0
                    },
                    {
                        regex: "(POLARIS)/(\\d+)\\.(\\d+)",
                        family_replacement: "Polaris",
                        other: !0
                    },
                    {
                        regex: "(Embider)/(\\d+)\\.(\\d+)",
                        family_replacement: "Polaris",
                        other: !0
                    },
                    {
                        regex: "(BonEcho)/(\\d+)\\.(\\d+)\\.(\\d+)",
                        family_replacement: "Bon Echo",
                        other: !0
                    },
                    {
                        regex: "(iPod).+Version/(\\d+)\\.(\\d+)\\.(\\d+)",
                        family_replacement: "Mobile Safari",
                        manufacturer: "Apple"
                    },
                    {
                        regex: "(iPod).*Version/(\\d+)\\.(\\d+)",
                        family_replacement: "Mobile Safari",
                        manufacturer: "Apple"
                    },
                    {
                        regex: "(iPod)",
                        family_replacement: "Mobile Safari",
                        manufacturer: "Apple"
                    },
                    {
                        regex: "(iPhone).*Version/(\\d+)\\.(\\d+)\\.(\\d+)",
                        family_replacement: "Mobile Safari",
                        manufacturer: "Apple"
                    },
                    {
                        regex: "(iPhone).*Version/(\\d+)\\.(\\d+)",
                        family_replacement: "Mobile Safari",
                        manufacturer: "Apple"
                    },
                    {
                        regex: "(iPhone)",
                        family_replacement: "Mobile Safari",
                        manufacturer: "Apple"
                    },
                    {
                        regex: "(iPad).*Version/(\\d+)\\.(\\d+)\\.(\\d+)",
                        family_replacement: "Mobile Safari",
                        tablet: !0,
                        manufacturer: "Apple"
                    },
                    {
                        regex: "(iPad).*Version/(\\d+)\\.(\\d+)",
                        family_replacement: "Mobile Safari",
                        tablet: !0,
                        manufacturer: "Apple"
                    },
                    {
                        regex: "(iPad)",
                        family_replacement: "Mobile Safari",
                        tablet: !0,
                        manufacturer: "Apple"
                    },
                    {
                        regex: "(AvantGo) (\\d+).(\\d+)",
                        other: !0
                    },
                    {
                        regex: "(Avant)",
                        v1_replacement: "1",
                        other: !0
                    },
                    {
                        regex: "^(Nokia)",
                        family_replacement: "Nokia Services (WAP) Browser",
                        manufacturer: "Nokia"
                    },
                    {
                        regex: "(NokiaBrowser)/(\\d+)\\.(\\d+).(\\d+)\\.(\\d+)",
                        manufacturer: "Nokia"
                    },
                    {
                        regex: "(NokiaBrowser)/(\\d+)\\.(\\d+).(\\d+)",
                        manufacturer: "Nokia"
                    },
                    {
                        regex: "(NokiaBrowser)/(\\d+)\\.(\\d+)",
                        manufacturer: "Nokia"
                    },
                    {
                        regex: "(BrowserNG)/(\\d+)\\.(\\d+).(\\d+)",
                        family_replacement: "NokiaBrowser",
                        manufacturer: "Nokia"
                    },
                    {
                        regex: "(Series60)/5\\.0",
                        v2_replacement: "0",
                        v1_replacement: "7",
                        family_replacement: "NokiaBrowser",
                        manufacturer: "Nokia"
                    },
                    {
                        regex: "(Series60)/(\\d+)\\.(\\d+)",
                        family_replacement: "Nokia OSS Browser",
                        manufacturer: "Nokia"
                    },
                    {
                        regex: "(S40OviBrowser)/(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+)",
                        family_replacement: "Nokia Series 40 Ovi Browser",
                        manufacturer: "Nokia"
                    },
                    {
                        regex: "(Nokia)[EN]?(\\d+)",
                        manufacturer: "Nokia"
                    },
                    {
                        regex: "(PlayBook).+RIM Tablet OS (\\d+)\\.(\\d+)\\.(\\d+)",
                        family_replacement: "Blackberry WebKit",
                        tablet: !0,
                        manufacturer: "Nokia"
                    },
                    {
                        regex: "(Black[bB]erry).+Version/(\\d+)\\.(\\d+)\\.(\\d+)",
                        family_replacement: "Blackberry WebKit",
                        manufacturer: "RIM"
                    },
                    {
                        regex: "(Black[bB]erry)\\s?(\\d+)",
                        family_replacement: "Blackberry",
                        manufacturer: "RIM"
                    },
                    {
                        regex: "(OmniWeb)/v(\\d+)\\.(\\d+)",
                        other: !0
                    },
                    {
                        regex: "(Blazer)/(\\d+)\\.(\\d+)",
                        family_replacement: "Palm Blazer",
                        manufacturer: "Palm"
                    },
                    {
                        regex: "(Pre)/(\\d+)\\.(\\d+)",
                        family_replacement: "Palm Pre",
                        manufacturer: "Palm"
                    },
                    {
                        regex: "(Links) \\((\\d+)\\.(\\d+)",
                        other: !0
                    },
                    {
                        regex: "(QtWeb) Internet Browser/(\\d+)\\.(\\d+)",
                        other: !0
                    },
                    {
                        regex: "(Silk)/(\\d+)\\.(\\d+)(?:\\.([0-9\\-]+))?",
                        other: !0,
                        tablet: !0
                    },
                    {
                        regex: "(AppleWebKit)/(\\d+)\\.?(\\d+)?\\+ .* Version/\\d+\\.\\d+.\\d+ Safari/",
                        family_replacement: "WebKit Nightly"
                    },
                    {
                        regex: "(Version)/(\\d+)\\.(\\d+)(?:\\.(\\d+))?.*Safari/",
                        family_replacement: "Safari"
                    },
                    {
                        regex: "(Safari)/\\d+"
                    },
                    {
                        regex: "(OLPC)/Update(\\d+)\\.(\\d+)",
                        other: !0
                    },
                    {
                        regex: "(OLPC)/Update()\\.(\\d+)",
                        v1_replacement: "0",
                        other: !0
                    },
                    {
                        regex: "(SEMC\\-Browser)/(\\d+)\\.(\\d+)",
                        other: !0
                    },
                    {
                        regex: "(Teleca)",
                        family_replacement: "Teleca Browser",
                        other: !0
                    },
                    {
                        regex: "Trident(.*)rv.(\\d+)\\.(\\d+)",
                        family_replacement: "IE"
                    },
                    {
                        regex: "(MSIE) (\\d+)\\.(\\d+)",
                        family_replacement: "IE"
                    }],
                    os_parsers: [
                    {
                        regex: "(Android) (\\d+)\\.(\\d+)(?:[.\\-]([a-z0-9]+))?"
                    },
                    {
                        regex: "(Android)\\-(\\d+)\\.(\\d+)(?:[.\\-]([a-z0-9]+))?"
                    },
                    {
                        regex: "(Android) Donut",
                        os_v2_replacement: "2",
                        os_v1_replacement: "1"
                    },
                    {
                        regex: "(Android) Eclair",
                        os_v2_replacement: "1",
                        os_v1_replacement: "2"
                    },
                    {
                        regex: "(Android) Froyo",
                        os_v2_replacement: "2",
                        os_v1_replacement: "2"
                    },
                    {
                        regex: "(Android) Gingerbread",
                        os_v2_replacement: "3",
                        os_v1_replacement: "2"
                    },
                    {
                        regex: "(Android) Honeycomb",
                        os_v1_replacement: "3"
                    },
                    {
                        regex: "(Silk-Accelerated=[a-z]{4,5})",
                        os_replacement: "Android"
                    },
                    {
                        regex: "(Windows Phone 6\\.5)"
                    },
                    {
                        regex: "(Windows (?:NT 5\\.2|NT 5\\.1))",
                        os_replacement: "Windows XP"
                    },
                    {
                        regex: "(XBLWP7)",
                        os_replacement: "Windows Phone OS"
                    },
                    {
                        regex: "(Windows NT 6\\.1)",
                        os_replacement: "Windows 7"
                    },
                    {
                        regex: "(Windows NT 6\\.0)",
                        os_replacement: "Windows Vista"
                    },
                    {
                        regex: "(Windows 98|Windows XP|Windows ME|Windows 95|Windows CE|Windows 7|Windows NT 4\\.0|Windows Vista|Windows 2000)"
                    },
                    {
                        regex: "(Windows NT 6\\.4|Windows NT 10\\.0)",
                        os_replacement: "Windows 10"
                    },
                    {
                        regex: "(Windows NT 6\\.2)",
                        os_replacement: "Windows 8"
                    },
                    {
                        regex: "(Windows Phone 8)",
                        os_replacement: "Windows Phone 8"
                    },
                    {
                        regex: "(Windows NT 5\\.0)",
                        os_replacement: "Windows 2000"
                    },
                    {
                        regex: "(Windows Phone OS) (\\d+)\\.(\\d+)"
                    },
                    {
                        regex: "(Windows ?Mobile)",
                        os_replacement: "Windows Mobile"
                    },
                    {
                        regex: "(WinNT4.0)",
                        os_replacement: "Windows NT 4.0"
                    },
                    {
                        regex: "(Win98)",
                        os_replacement: "Windows 98"
                    },
                    {
                        regex: "(Tizen)/(\\d+)\\.(\\d+)",
                        other: !0
                    },
                    {
                        regex: "(Mac OS X) (\\d+)[_.](\\d+)(?:[_.](\\d+))?",
                        manufacturer: "Apple"
                    },
                    {
                        regex: "(?:PPC|Intel) (Mac OS X)",
                        manufacturer: "Apple"
                    },
                    {
                        regex: "(CPU OS|iPhone OS) (\\d+)_(\\d+)(?:_(\\d+))?",
                        os_replacement: "iOS",
                        manufacturer: "Apple"
                    },
                    {
                        regex: "(iPhone|iPad|iPod); Opera",
                        os_replacement: "iOS",
                        manufacturer: "Apple"
                    },
                    {
                        regex: "(iPad); Opera",
                        tablet: !0,
                        manufacturer: "Apple"
                    },
                    {
                        regex: "(iPhone|iPad|iPod).*Mac OS X.*Version/(\\d+)\\.(\\d+)",
                        os_replacement: "iOS",
                        manufacturer: "Apple"
                    },
                    {
                        regex: "(CrOS) [a-z0-9_]+ (\\d+)\\.(\\d+)(?:\\.(\\d+))?",
                        os_replacement: "Chrome OS"
                    },
                    {
                        regex: "(Debian)-(\\d+)\\.(\\d+)\\.(\\d+)(?:\\.(\\d+))?",
                        other: !0
                    },
                    {
                        regex: "(Linux Mint)(?:/(\\d+))?",
                        other: !0
                    },
                    {
                        regex: "(Mandriva)(?: Linux)?/(\\d+)\\.(\\d+)\\.(\\d+)(?:\\.(\\d+))?",
                        other: !0
                    },
                    {
                        regex: "(Symbian[Oo][Ss])/(\\d+)\\.(\\d+)",
                        os_replacement: "Symbian OS"
                    },
                    {
                        regex: "(Symbian/3).+NokiaBrowser/7\\.3",
                        os_replacement: "Symbian^3 Anna"
                    },
                    {
                        regex: "(Symbian/3).+NokiaBrowser/7\\.4",
                        os_replacement: "Symbian^3 Belle"
                    },
                    {
                        regex: "(Symbian/3)",
                        os_replacement: "Symbian^3"
                    },
                    {
                        regex: "(Series 60|SymbOS|S60)",
                        os_replacement: "Symbian OS"
                    },
                    {
                        regex: "(MeeGo)",
                        other: !0
                    },
                    {
                        regex: "Symbian [Oo][Ss]",
                        os_replacement: "Symbian OS"
                    },
                    {
                        regex: "(Black[Bb]erry)[0-9a-z]+/(\\d+)\\.(\\d+)\\.(\\d+)(?:\\.(\\d+))?",
                        os_replacement: "BlackBerry OS",
                        manufacturer: "RIM"
                    },
                    {
                        regex: "(Black[Bb]erry).+Version/(\\d+)\\.(\\d+)\\.(\\d+)(?:\\.(\\d+))?",
                        os_replacement: "BlackBerry OS",
                        manufacturer: "RIM"
                    },
                    {
                        regex: "(RIM Tablet OS) (\\d+)\\.(\\d+)\\.(\\d+)",
                        os_replacement: "BlackBerry Tablet OS",
                        tablet: !0,
                        manufacturer: "RIM"
                    },
                    {
                        regex: "(Play[Bb]ook)",
                        os_replacement: "BlackBerry Tablet OS",
                        tablet: !0,
                        manufacturer: "RIM"
                    },
                    {
                        regex: "(Black[Bb]erry)",
                        os_replacement: "Blackberry OS",
                        manufacturer: "RIM"
                    },
                    {
                        regex: "(webOS|hpwOS)/(\\d+)\\.(\\d+)(?:\\.(\\d+))?",
                        os_replacement: "webOS"
                    },
                    {
                        regex: "(SUSE|Fedora|Red Hat|PCLinuxOS)/(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+)",
                        other: !0
                    },
                    {
                        regex: "(SUSE|Fedora|Red Hat|Puppy|PCLinuxOS|CentOS)/(\\d+)\\.(\\d+)\\.(\\d+)",
                        other: !0
                    },
                    {
                        regex: "(Ubuntu|Kindle|Bada|Lubuntu|BackTrack|Red Hat|Slackware)/(\\d+)\\.(\\d+)"
                    },
                    {
                        regex: "(Windows|OpenBSD|FreeBSD|NetBSD|Ubuntu|Kubuntu|Android|Arch Linux|CentOS|WeTab|Slackware)"
                    },
                    {
                        regex: "(Linux|BSD)",
                        other: !0
                    }],
                    mobile_os_families: ["Windows Phone 6.5", "Windows CE", "Symbian OS"],
                    device_parsers: [
                    {
                        regex: "HTC ([A-Z][a-z0-9]+) Build",
                        device_replacement: "HTC $1",
                        manufacturer: "HTC"
                    },
                    {
                        regex: "HTC ([A-Z][a-z0-9 ]+) \\d+\\.\\d+\\.\\d+\\.\\d+",
                        device_replacement: "HTC $1",
                        manufacturer: "HTC"
                    },
                    {
                        regex: "HTC_Touch_([A-Za-z0-9]+)",
                        device_replacement: "HTC Touch ($1)",
                        manufacturer: "HTC"
                    },
                    {
                        regex: "USCCHTC(\\d+)",
                        device_replacement: "HTC $1 (US Cellular)",
                        manufacturer: "HTC"
                    },
                    {
                        regex: "Sprint APA(9292)",
                        device_replacement: "HTC $1 (Sprint)",
                        manufacturer: "HTC"
                    },
                    {
                        regex: "HTC ([A-Za-z0-9]+ [A-Z])",
                        device_replacement: "HTC $1",
                        manufacturer: "HTC"
                    },
                    {
                        regex: "HTC-([A-Za-z0-9]+)",
                        device_replacement: "HTC $1",
                        manufacturer: "HTC"
                    },
                    {
                        regex: "HTC_([A-Za-z0-9]+)",
                        device_replacement: "HTC $1",
                        manufacturer: "HTC"
                    },
                    {
                        regex: "HTC ([A-Za-z0-9]+)",
                        device_replacement: "HTC $1",
                        manufacturer: "HTC"
                    },
                    {
                        regex: "(ADR[A-Za-z0-9]+)",
                        device_replacement: "HTC $1",
                        manufacturer: "HTC"
                    },
                    {
                        regex: "(HTC)",
                        manufacturer: "HTC"
                    },
                    {
                        regex: "SonyEricsson([A-Za-z0-9]+)/",
                        device_replacement: "Ericsson $1",
                        other: !0,
                        manufacturer: "Sony"
                    },
                    {
                        regex: "Android[\\- ][\\d]+\\.[\\d]+\\; [A-Za-z]{2}\\-[A-Za-z]{2}\\; WOWMobile (.+) Build"
                    },
                    {
                        regex: "Android[\\- ][\\d]+\\.[\\d]+\\.[\\d]+; [A-Za-z]{2}\\-[A-Za-z]{2}\\; (.+) Build"
                    },
                    {
                        regex: "Android[\\- ][\\d]+\\.[\\d]+\\-update1\\; [A-Za-z]{2}\\-[A-Za-z]{2}\\; (.+) Build"
                    },
                    {
                        regex: "Android[\\- ][\\d]+\\.[\\d]+\\; [A-Za-z]{2}\\-[A-Za-z]{2}\\; (.+) Build"
                    },
                    {
                        regex: "Android[\\- ][\\d]+\\.[\\d]+\\.[\\d]+; (.+) Build"
                    },
                    {
                        regex: "NokiaN([0-9]+)",
                        device_replacement: "Nokia N$1",
                        manufacturer: "Nokia"
                    },
                    {
                        regex: "Nokia([A-Za-z0-9\\v-]+)",
                        device_replacement: "Nokia $1",
                        manufacturer: "Nokia"
                    },
                    {
                        regex: "NOKIA ([A-Za-z0-9\\-]+)",
                        device_replacement: "Nokia $1",
                        manufacturer: "Nokia"
                    },
                    {
                        regex: "Nokia ([A-Za-z0-9\\-]+)",
                        device_replacement: "Nokia $1",
                        manufacturer: "Nokia"
                    },
                    {
                        regex: "Lumia ([A-Za-z0-9\\-]+)",
                        device_replacement: "Lumia $1",
                        manufacturer: "Nokia"
                    },
                    {
                        regex: "Symbian",
                        device_replacement: "Nokia",
                        manufacturer: "Nokia"
                    },
                    {
                        regex: "(PlayBook).+RIM Tablet OS",
                        device_replacement: "Blackberry Playbook",
                        tablet: !0,
                        manufacturer: "RIM"
                    },
                    {
                        regex: "(Black[Bb]erry [0-9]+);",
                        manufacturer: "RIM"
                    },
                    {
                        regex: "Black[Bb]erry([0-9]+)",
                        device_replacement: "BlackBerry $1",
                        manufacturer: "RIM"
                    },
                    {
                        regex: "(Pre)/(\\d+)\\.(\\d+)",
                        device_replacement: "Palm Pre",
                        manufacturer: "Palm"
                    },
                    {
                        regex: "(Pixi)/(\\d+)\\.(\\d+)",
                        device_replacement: "Palm Pixi",
                        manufacturer: "Palm"
                    },
                    {
                        regex: "(Touchpad)/(\\d+)\\.(\\d+)",
                        device_replacement: "HP Touchpad",
                        manufacturer: "HP"
                    },
                    {
                        regex: "HPiPAQ([A-Za-z0-9]+)/(\\d+).(\\d+)",
                        device_replacement: "HP iPAQ $1",
                        manufacturer: "HP"
                    },
                    {
                        regex: "Palm([A-Za-z0-9]+)",
                        device_replacement: "Palm $1",
                        manufacturer: "Palm"
                    },
                    {
                        regex: "Treo([A-Za-z0-9]+)",
                        device_replacement: "Palm Treo $1",
                        manufacturer: "Palm"
                    },
                    {
                        regex: "webOS.*(P160UNA)/(\\d+).(\\d+)",
                        device_replacement: "HP Veer",
                        manufacturer: "HP"
                    },
                    {
                        regex: "(Kindle Fire)",
                        manufacturer: "Amazon"
                    },
                    {
                        regex: "(Kindle)",
                        manufacturer: "Amazon"
                    },
                    {
                        regex: "(Silk)/(\\d+)\\.(\\d+)(?:\\.([0-9\\-]+))?",
                        device_replacement: "Kindle Fire",
                        tablet: !0,
                        manufacturer: "Amazon"
                    },
                    {
                        regex: "(iPad) Simulator;",
                        manufacturer: "Apple"
                    },
                    {
                        regex: "(iPad);",
                        manufacturer: "Apple"
                    },
                    {
                        regex: "(iPod);",
                        manufacturer: "Apple"
                    },
                    {
                        regex: "(iPhone) Simulator;",
                        manufacturer: "Apple"
                    },
                    {
                        regex: "(iPhone);",
                        manufacturer: "Apple"
                    },
                    {
                        regex: "Nexus\\ ([A-Za-z0-9\\-]+)",
                        device_replacement: "Nexus $1"
                    },
                    {
                        regex: "acer_([A-Za-z0-9]+)_",
                        device_replacement: "Acer $1",
                        manufacturer: "Acer"
                    },
                    {
                        regex: "acer_([A-Za-z0-9]+)_",
                        device_replacement: "Acer $1",
                        manufacturer: "Acer"
                    },
                    {
                        regex: "Amoi\\-([A-Za-z0-9]+)",
                        device_replacement: "Amoi $1",
                        other: !0,
                        manufacturer: "Amoi"
                    },
                    {
                        regex: "AMOI\\-([A-Za-z0-9]+)",
                        device_replacement: "Amoi $1",
                        other: !0,
                        manufacturer: "Amoi"
                    },
                    {
                        regex: "Asus\\-([A-Za-z0-9]+)",
                        device_replacement: "Asus $1",
                        manufacturer: "Asus"
                    },
                    {
                        regex: "ASUS\\-([A-Za-z0-9]+)",
                        device_replacement: "Asus $1",
                        manufacturer: "Asus"
                    },
                    {
                        regex: "BIRD\\-([A-Za-z0-9]+)",
                        device_replacement: "Bird $1",
                        other: !0
                    },
                    {
                        regex: "BIRD\\.([A-Za-z0-9]+)",
                        device_replacement: "Bird $1",
                        other: !0
                    },
                    {
                        regex: "BIRD ([A-Za-z0-9]+)",
                        device_replacement: "Bird $1",
                        other: !0
                    },
                    {
                        regex: "Dell ([A-Za-z0-9]+)",
                        device_replacement: "Dell $1",
                        manufacturer: "Dell"
                    },
                    {
                        regex: "DoCoMo/2\\.0 ([A-Za-z0-9]+)",
                        device_replacement: "DoCoMo $1",
                        other: !0
                    },
                    {
                        regex: "([A-Za-z0-9]+)\\_W\\;FOMA",
                        device_replacement: "DoCoMo $1",
                        other: !0
                    },
                    {
                        regex: "([A-Za-z0-9]+)\\;FOMA",
                        device_replacement: "DoCoMo $1",
                        other: !0
                    },
                    {
                        regex: "vodafone([A-Za-z0-9]+)",
                        device_replacement: "Huawei Vodafone $1",
                        other: !0
                    },
                    {
                        regex: "i\\-mate ([A-Za-z0-9]+)",
                        device_replacement: "i-mate $1",
                        other: !0
                    },
                    {
                        regex: "Kyocera\\-([A-Za-z0-9]+)",
                        device_replacement: "Kyocera $1",
                        other: !0
                    },
                    {
                        regex: "KWC\\-([A-Za-z0-9]+)",
                        device_replacement: "Kyocera $1",
                        other: !0
                    },
                    {
                        regex: "Lenovo\\-([A-Za-z0-9]+)",
                        device_replacement: "Lenovo $1",
                        manufacturer: "Lenovo"
                    },
                    {
                        regex: "Lenovo\\_([A-Za-z0-9]+)",
                        device_replacement: "Lenovo $1",
                        manufacturer: "Levovo"
                    },
                    {
                        regex: "LG/([A-Za-z0-9]+)",
                        device_replacement: "LG $1",
                        manufacturer: "LG"
                    },
                    {
                        regex: "LG-LG([A-Za-z0-9]+)",
                        device_replacement: "LG $1",
                        manufacturer: "LG"
                    },
                    {
                        regex: "LGE-LG([A-Za-z0-9]+)",
                        device_replacement: "LG $1",
                        manufacturer: "LG"
                    },
                    {
                        regex: "LGE VX([A-Za-z0-9]+)",
                        device_replacement: "LG $1",
                        manufacturer: "LG"
                    },
                    {
                        regex: "LG ([A-Za-z0-9]+)",
                        device_replacement: "LG $1",
                        manufacturer: "LG"
                    },
                    {
                        regex: "LGE LG\\-AX([A-Za-z0-9]+)",
                        device_replacement: "LG $1",
                        manufacturer: "LG"
                    },
                    {
                        regex: "LG\\-([A-Za-z0-9]+)",
                        device_replacement: "LG $1",
                        manufacturer: "LG"
                    },
                    {
                        regex: "LGE\\-([A-Za-z0-9]+)",
                        device_replacement: "LG $1",
                        manufacturer: "LG"
                    },
                    {
                        regex: "LG([A-Za-z0-9]+)",
                        device_replacement: "LG $1",
                        manufacturer: "LG"
                    },
                    {
                        regex: "(KIN)\\.One (\\d+)\\.(\\d+)",
                        device_replacement: "Microsoft $1"
                    },
                    {
                        regex: "(KIN)\\.Two (\\d+)\\.(\\d+)",
                        device_replacement: "Microsoft $1"
                    },
                    {
                        regex: "(Motorola)\\-([A-Za-z0-9]+)",
                        manufacturer: "Motorola"
                    },
                    {
                        regex: "MOTO\\-([A-Za-z0-9]+)",
                        device_replacement: "Motorola $1",
                        manufacturer: "Motorola"
                    },
                    {
                        regex: "MOT\\-([A-Za-z0-9]+)",
                        device_replacement: "Motorola $1",
                        manufacturer: "Motorola"
                    },
                    {
                        regex: "Philips([A-Za-z0-9]+)",
                        device_replacement: "Philips $1",
                        manufacturer: "Philips"
                    },
                    {
                        regex: "Philips ([A-Za-z0-9]+)",
                        device_replacement: "Philips $1",
                        manufacturer: "Philips"
                    },
                    {
                        regex: "SAMSUNG-([A-Za-z0-9\\-]+)",
                        device_replacement: "Samsung $1",
                        manufacturer: "Samsung"
                    },
                    {
                        regex: "SAMSUNG\\; ([A-Za-z0-9\\-]+)",
                        device_replacement: "Samsung $1",
                        manufacturer: "Samsung"
                    },
                    {
                        regex: "Softbank/1\\.0/([A-Za-z0-9]+)",
                        device_replacement: "Softbank $1",
                        other: !0
                    },
                    {
                        regex: "Softbank/2\\.0/([A-Za-z0-9]+)",
                        device_replacement: "Softbank $1",
                        other: !0
                    },
                    {
                        regex: "(hiptop|avantgo|plucker|xiino|blazer|elaine|up.browser|up.link|mmp|smartphone|midp|wap|vodafone|o2|pocket|mobile|pda)",
                        device_replacement: "Generic Smartphone"
                    },
                    {
                        regex: "^(1207|3gso|4thp|501i|502i|503i|504i|505i|506i|6310|6590|770s|802s|a wa|acer|acs\\-|airn|alav|asus|attw|au\\-m|aur |aus |abac|acoo|aiko|alco|alca|amoi|anex|anny|anyw|aptu|arch|argo|bell|bird|bw\\-n|bw\\-u|beck|benq|bilb|blac|c55/|cdm\\-|chtm|capi|comp|cond|craw|dall|dbte|dc\\-s|dica|ds\\-d|ds12|dait|devi|dmob|doco|dopo|el49|erk0|esl8|ez40|ez60|ez70|ezos|ezze|elai|emul|eric|ezwa|fake|fly\\-|fly\\_|g\\-mo|g1 u|g560|gf\\-5|grun|gene|go.w|good|grad|hcit|hd\\-m|hd\\-p|hd\\-t|hei\\-|hp i|hpip|hs\\-c|htc |htc\\-|htca|htcg)",
                        device_replacement: "Generic Feature Phone"
                    },
                    {
                        regex: "^(htcp|htcs|htct|htc\\_|haie|hita|huaw|hutc|i\\-20|i\\-go|i\\-ma|i230|iac|iac\\-|iac/|ig01|im1k|inno|iris|jata|java|kddi|kgt|kgt/|kpt |kwc\\-|klon|lexi|lg g|lg\\-a|lg\\-b|lg\\-c|lg\\-d|lg\\-f|lg\\-g|lg\\-k|lg\\-l|lg\\-m|lg\\-o|lg\\-p|lg\\-s|lg\\-t|lg\\-u|lg\\-w|lg/k|lg/l|lg/u|lg50|lg54|lge\\-|lge/|lynx|leno|m1\\-w|m3ga|m50/|maui|mc01|mc21|mcca|medi|meri|mio8|mioa|mo01|mo02|mode|modo|mot |mot\\-|mt50|mtp1|mtv |mate|maxo|merc|mits|mobi|motv|mozz|n100|n101|n102|n202|n203|n300|n302|n500|n502|n505|n700|n701|n710|nec\\-|nem\\-|newg|neon)",
                        device_replacement: "Generic Feature Phone"
                    },
                    {
                        regex: "^(netf|noki|nzph|o2 x|o2\\-x|opwv|owg1|opti|oran|ot\\-s|p800|pand|pg\\-1|pg\\-2|pg\\-3|pg\\-6|pg\\-8|pg\\-c|pg13|phil|pn\\-2|pt\\-g|palm|pana|pire|pock|pose|psio|qa\\-a|qc\\-2|qc\\-3|qc\\-5|qc\\-7|qc07|qc12|qc21|qc32|qc60|qci\\-|qwap|qtek|r380|r600|raks|rim9|rove|s55/|sage|sams|sc01|sch\\-|scp\\-|sdk/|se47|sec\\-|sec0|sec1|semc|sgh\\-|shar|sie\\-|sk\\-0|sl45|slid|smb3|smt5|sp01|sph\\-|spv |spv\\-|sy01|samm|sany|sava|scoo|send|siem|smar|smit|soft|sony|t\\-mo|t218|t250|t600|t610|t618|tcl\\-|tdg\\-|telm|tim\\-|ts70|tsm\\-|tsm3|tsm5|tx\\-9|tagt)",
                        device_replacement: "Generic Feature Phone"
                    },
                    {
                        regex: "^(talk|teli|topl|tosh|up.b|upg1|utst|v400|v750|veri|vk\\-v|vk40|vk50|vk52|vk53|vm40|vx98|virg|vite|voda|vulc|w3c |w3c\\-|wapj|wapp|wapu|wapm|wig |wapi|wapr|wapv|wapy|wapa|waps|wapt|winc|winw|wonu|x700|xda2|xdag|yas\\-|your|zte\\-|zeto|aste|audi|avan|blaz|brew|brvw|bumb|ccwa|cell|cldc|cmd\\-|dang|eml2|fetc|hipt|http|ibro|idea|ikom|ipaq|jbro|jemu|jigs|keji|kyoc|kyok|libw|m\\-cr|midp|mmef|moto|mwbp|mywa|newt|nok6|o2im|pant|pdxg|play|pluc|port|prox|rozo|sama|seri|smal|symb|treo|upsi|vx52|vx53|vx60|vx61|vx70|vx80|vx81|vx83|vx85|wap\\-|webc|whit|wmlb|xda\\-|xda\\_)",
                        device_replacement: "Generic Feature Phone"
                    },
                    {
                        regex: "(bot|borg|google(^tv)|yahoo|slurp|msnbot|msrbot|openbot|archiver|netresearch|lycos|scooter|altavista|teoma|gigabot|baiduspider|blitzbot|oegp|charlotte|furlbot|http%20client|polybot|htdig|ichiro|mogimogi|larbin|pompos|scrubby|searchsight|seekbot|semanticdiscovery|silk|snappy|speedy|spider|voila|vortex|voyager|zao|zeal|fast\\-webcrawler|converacrawler|dataparksearch|findlinks)",
                        device_replacement: "Spider"
                    }],
                    mobile_browser_families: ["Firefox Mobile", "Opera Mobile", "Opera Mini", "Mobile Safari", "webOS", "IE Mobile", "Playstation Portable", "Nokia", "Blackberry", "Palm", "Silk", "Android", "Maemo", "Obigo", "Netfront", "AvantGo", "Teleca", "SEMC-Browser", "Bolt", "Iris", "UP.Browser", "Symphony", "Minimo", "Bunjaloo", "Jasmine", "Dolfin", "Polaris", "BREW", "Chrome Mobile", "Chrome Mobile iOS", "UC Browser", "Tizen Browser"]
                };
            e.parsers = ["device_parsers", "browser_parsers", "os_parsers", "mobile_os_families", "mobile_browser_families"], e.types = ["browser", "os", "device"], e.regexes = r || function()
            {
                var r = {};
                return e.parsers.map(function(e)
                {
                    r[e] = []
                }), r
            }(), e.families = function()
            {
                var r = {};
                return e.types.map(function(e)
                {
                    r[e] = []
                }), r
            }();
            var a = Array.prototype,
                o = (Object.prototype, Function.prototype, a.forEach);
            a.indexOf;
            var i = function(e, r)
                {
                    for (var a = {}, o = 0; r.length > o && !(a = r[o](e)); o++);
                    return a
                },
                n = function(e, r)
                {
                    t(e, function(e)
                    {
                        t(r, function(r)
                        {
                            delete e[r]
                        })
                    })
                },
                t = forEach = function(e, r, a)
                {
                    if (null != e)
                        if (o && e.forEach === o) e.forEach(r, a);
                        else if (e.length === +e.length)
                        for (var i = 0, n = e.length; n > i; i++) r.call(a, e[i], i, e);
                    else
                        for (var t in e) _.has(e, t) && r.call(a, e[t], t, e)
                },
                l = function(e)
                {
                    return !(!e || e === undefined || null == e)
                },
                d = function(e)
                {
                    var r = "";
                    return e = e ||
                    {}, l(e) && l(e.major) && (r += e.major, l(e.minor) && (r += "." + e.minor, l(e.patch) && (r += "." + e.patch))), r
                },
                c = function(e)
                {
                    e = e ||
                    {};
                    var r = d(e);
                    return r && (r = " " + r), e && l(e.family) ? e.family + r : ""
                };
            return e.parse = function(r)
            {
                var a = function(r)
                    {
                        return e.regexes[r + "_parsers"].map(function(e)
                        {
                            function a(r)
                            {
                                var a = r.match(o);
                                if (!a) return null;
                                var t = {};
                                return t.family = (i ? i.replace("$1", a[1]) : a[1]) || "other", t.major = parseInt(n ? n : a[2]) || null, t.minor = a[3] ? parseInt(a[3]) : null, t.patch = a[4] ? parseInt(a[4]) : null, t.tablet = e.tablet, t.man = e.manufacturer || null, t
                            }
                            var o = RegExp(e.regex),
                                i = e[("browser" === r ? "family" : r) + "_replacement"],
                                n = e.major_version_replacement;
                            return a
                        })
                    },
                    o = function() {},
                    t = a("browser"),
                    m = a("os"),
                    p = a("device"),
                    s = new o;
                s.source = r, s.browser = i(r, t), l(s.browser) ? (s.browser.name = c(s.browser), s.browser.version = d(s.browser)) : s.browser = {}, s.os = i(r, m), l(s.os) ? (s.os.name = c(s.os), s.os.version = d(s.os)) : s.os = {}, s.device = i(r, p), l(s.device) ? (s.device.name = c(s.device), s.device.version = d(s.device)) : s.device = {
                    tablet: !1,
                    family: "Other"
                };
                var g = {};
                return e.regexes.mobile_browser_families.map(function(e)
                {
                    g[e] = !0
                }), e.regexes.mobile_os_families.map(function(e)
                {
                    g[e] = !0
                }), s.device.type = "Spider" === s.browser.family ? "Spider" : s.browser.tablet || s.os.tablet || s.device.tablet ? "Tablet" : g.hasOwnProperty(s.browser.family) ? "Mobile" : "Desktop", s.device.manufacturer = s.browser.man || s.os.man || s.device.man || null, n([s.browser, s.os, s.device], ["tablet", "man"]), s
            }, e
        }();
        "undefined" != typeof exports ? ("undefined" != typeof module && module.exports && (exports = module.exports = r), exports.detect = r) : e.detect = r, "function" == typeof define && define.amd && define(function()
        {
            return r
        })
    })(window);

    var ua = detect.parse(navigator.userAgent);

    this.browser = {
        'name': ua.browser.family,
        'version': ua.browser.version,
        'device': ua.device.type,
        'os': ua.os.name
    };

    return this.browser;
}

/**
 * Is this a mobile user agent?
 *
 * @return bool
 */
Helper.prototype.isMobile = function()
{
    return this.getBrowser()['device'] === 'Mobile';
}

/**
 * Is this a mobile user agent?
 *
 * @return bool
 */
Helper.prototype.isRetina = function()
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

	Container.singleton('Helper', Helper).Helper().getBrowser();

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
 * @example Container.get('SmoothScroll').animateScroll('#' + id, null, options);
 * @see     https://github.com/cferdinandi/smooth-scroll
 * @see     waypoints.js
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
         * @param  {Node} elem The element to get the height of
         * @return {Number}    The element's height in pixels
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
         * @author Mathias Bynens
         * @link https://github.com/mathiasbynens/CSS.escape
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
         * @link https://gist.github.com/gre/1650294
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
         * @returns {Number}
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
             * @link https://github.com/cferdinandi/smooth-scroll/issues/45
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
     * @license MIT */
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
 * @see https://shopify.dev/docs/themes/ajax-api/reference/product-recommendations
 * 
 * @example Container.Helper().pluralize('tomato', 5);
 * 
 */
(function()
{
    /**
     * Pluralize a word.
     *
     * @param  string word  The input word
     * @param  int    count The amount of items (optional) (default 2)
     * @return string
     */
    var Pluralize = function(word, count)
    {
        /**
         * The word to convert.
         *
         * @var string
         */
        this.word = '';

        /**
         * Lowercase version of word.
         *
         * @var string
         */
        this.lowercase = '';

        /**
         * Uppercase version of word.
         *
         * @var string
         */
        this.upperCase = '';

        /**
         * Sentence-case version of word.
         *
         * @var string
         */
        this.sentenceCase = '';

        /**
         * Casing pattern of the provided word.
         *
         * @var string
         */
        this.casing = '';

        /**
         * Sibilants.
         *
         * @var array
         */
        this.sibilants = ['x', 's', 'z', 's'];

        /**
         * Vowels.
         *
         * @var array
         */
        this.vowels = ['a', 'e', 'i', 'o', 'u'];

        /**
         * Consonants.
         *
         * @var array
         */
        this.consonants = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z'];

        count = (typeof count === 'undefined' ? 2 : count);

        return this.convert(string, word, int);
    }

    /**
     * Pluralize a word.
     *
     * @param  string word  The input word
     * @param  int    count The amount of items (optional) (default 2)
     * @return string
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
        this.sentenceCase = ucfirst(word);
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
     * @return bool
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
     * @return string|bool
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
     * @return array|false
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
     * @return string
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
     * @param  string word   The word to convert
     * @param  string casing The casing format to convert to
     * @return string
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
     * @param  string word  The word to convert
     * @param  int    count The index to split at
     * @return string
     */
    Pluralize.prototype.suffix = function(word, count)
    {
        return substr(word, word.length - count);
    }

    /**
     * Strip end off a word at a given char index and return the start part.
     *
     * @param  string word  The word to convert
     * @param  int    count The index to split at
     * @return string
     */
    Pluralize.prototype.sliceFromEnd = function(word, count)
    {
        return substr(word, 0, word.length - count);
    }

    /**
     * Get the nth last character of a string.
     *
     * @param  string word  The word to convert
     * @param  int    count The index to get
     * @return string
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
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie
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
     * @var string
     */
    var _prefix = '_hb';

    /**
     * Module constructor
     *
     * @access public
     * @constructor
     * @return this
     */
    var Cookies = function()
    {
        return this;
    }

    /**
     * Set a cookie
     *
     * @access public
     * @param  string    key      Cookie key
     * @param  string    value    Cookie value
     * @param  int    days     Cookie expiry in days (optional) (default when browser closes)
     * @param  string    path     Cookie path (optional) (default "/")
     * @param  bool   secure   Secure policy (optional) (default) (true)
     * @param  stringing samesite Samesite policy (optional) (default) (true)
     * @return sting
     */
    Cookies.prototype.set = function(key, value, days, path, secure, samesite)
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
     * @access public
     * @param  string key Cookie key
     * @return mixed
     */
    Cookies.prototype.get = function(key)
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
     * @access public
     * @param  string key Cookie to remove
     */
    Cookies.prototype.remove = function(key)
    {
        key = this._normaliseKey(key);

        document.cookie = key + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }

    /**
     * Normalise cookie expiry date
     *
     * @access private
     * @param  int    days Days when cookie expires
     * @return sting
     */
    Cookies.prototype._normaliseExpiry = function(days)
    {
        var date = new Date();

        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));

        return date.toUTCString();
    }

    /**
     * Normalise cookie key
     *
     * @access private
     * @param  string key Cookie key
     * @return sting
     */
    Cookies.prototype._normaliseKey = function(key)
    {
        key = key.replace(/[^a-z0-9+]+/gi, '').toLowerCase();

        return _prefix + key;
    }

    /**
     * Encode cookie value
     *
     * @access private
     * @param  mixed  value Value to encode
     * @return sting
     */
    Cookies.prototype._encodeCookieValue = function(value)
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
     * @access private
     * @param  string  str Value to decode
     * @return mixed
     */
    Cookies.prototype._decodeCookieValue = function(str)
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
     * @access private
     * @param  string str String to encode
     * @return sting
     */
    Cookies.prototype._base64_encode = function(str)
    {
        return btoa(this._toBinary(str)).replace(/=/g, '_');
    }

    /**
     * Base64 decode
     *
     * @access pubic
     * @param  string str String to decode
     * @return sting
     */
    Cookies.prototype._base64_decode = function(str)
    {
        return this._fromBinary(atob(str.replace(/_/g, '=')));
    }

    /**
     * From binary
     *
     * @access prvate
     * @param  string binary String to decode
     * @return string
     */
    Cookies.prototype._fromBinary = function(binary)
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
     * @access pubic
     * @param  string string String to encode
     * @return sting
     */
    Cookies.prototype._toBinary = function(string)
    {
        const codeUnits = new Uint16Array(string.length);

        for (var i = 0; i < codeUnits.length; i++)
        {
            codeUnits[i] = string.charCodeAt(i);
        }

        return String.fromCharCode.apply(null, new Uint8Array(codeUnits.buffer));
    }

    // Register as DOM Module and invoke
    Container.singleton('Cookies', Cookies);

})();

/**
 * ToggleHeight
 *
 * The ToggleHeight module allows to transition an element's height 
 * from 0 -> auto or from auto -> 0
 *
 */
(function()
{

    /**
     * @var Helper obj
     */
    var Helper = Container.Helper();

    /**
     * Module constructor
     *
     * @class
     * @constructor
     * @access public
     * @params el          node     The target node
     * @params initial     int      The height in px to start the transition
     * @params time        int      The time in ms of the transition
     * @params easing      string   Transition easing - valid css easing function
     * @params withOpacity boolean Should the transition include and opacity fade ?
     */
    var ToggleHeight = function(el, initial, time, easing, withOpacity)
    {
        // Set defaults if values were not provided;
        initial = (typeof initial === 'undefined' ? 0 : initial);
        time = (typeof time === 'undefined' ? 300 : time);
        easing = (typeof easing === 'undefined' ? 'ease-in' : easing);
        withOpacity = (typeof withOpacity === 'undefined' ? false : withOpacity);

        // Get the element's current height
        var actualHeight = parseInt(el.clientHeight || el.offsetHeight);

        // Get the element's projected height
        var computedStyle = Helper._computeStyle(el);
        var endHeight = parseInt(el.scrollHeight - parseInt(computedStyle.paddingTop) - parseInt(computedStyle.paddingBottom) + parseInt(computedStyle.borderTopWidth) + parseInt(computedStyle.borderBottomWidth));

        // Dispatch appropriate function
        if (endHeight === actualHeight || actualHeight > endHeight)
        {
            this._fromAuto(el, initial, time, easing, actualHeight, withOpacity);
        }
        else
        {
            this._toAuto(el, time, easing, actualHeight, endHeight, withOpacity);
        }
    }

    /**
     * Transition element's height from some height to auto.
     *
     * @access private
     * @params el                   node     The target node
     * @params initial              int      The height in px to start the transition
     * @params time                 int      The time in ms of the transition
     * @params easing               string   Transition easing - valid css easing function
     * @params actualHeight         int      Height in px that the transition will start at
     * @params endHeight            int      Height in px that the transition will end at
     * @params withOpacity          boolean  Should the transition include and opacity fade ?
     */
    ToggleHeight.prototype._toAuto = function(el, time, easing, actualHeight, endHeight, withOpacity)
    {
        // Bugfix if the height is set to auto transition from auto
        if (el.style.height === 'auto')
        {
            this._fromAuto(el, 0, time, easing, actualHeight, withOpacity);

            return;
        }

        // Bugfix if both heights are the same just set the height to auto
        if (actualHeight === endHeight)
        {
            el.style.height = 'auto';

            return;
        }

        // Opacity timer
        var opacityTime = (75 * time) / 100 + time;

        // Set the height to the actual height (which could be zero)
        // and force the browser to repaint
        Helper.css(el, 'height', actualHeight + 'px');
        el.offsetHeight;

        // Run animations
        var remove = function()
        {
            Helper.css(el, 'height', 'auto');
        };

        Helper.animate(el, 'height', actualHeight + 'px', endHeight + 'px', time, easing, remove);

        if (withOpacity)
        {
            Helper.animate(el, 'opacity', '0', '1', opacityTime, easing);
        }
    }

    /**
     * Transition element's height from "auto" to 0.
     *
     * @access private
     * @params el                   node     The target node
     * @params initial              int      The height in px to start the transition
     * @params time                 int      The time in ms of the transition
     * @params easing               string   Transition easing - valid css easing function
     * @params actualHeight         int      Height in px that the transition will start at
     * @params withOpacity          boolean  Should the transition include and opacity fade ?
     */
    ToggleHeight.prototype._fromAuto = function(el, initial, time, easing, actualHeight, withOpacity)
    {
        var opacityTime = (15 * time) / 100 + time;

        // Set the height to the actual height (which could be zero)
        // and force the browser to repaint
        Helper.css(el, 'height', actualHeight + 'px');
        el.offsetHeight;

        // Run animations
        Helper.animate(el, 'height', actualHeight + 'px', '0px', time, easing);

        if (withOpacity)
        {
            Helper.animate(el, 'opacity', '1', '0', opacityTime, easing);
        }
    }

    // Load into container
    Container.set('ToggleHeight', ToggleHeight);

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
     * @constructor
     * @access public
     * @return this
     */
    var Filters = function()
    {
        this._callbacks = {};

        return this;
    }

    /**
     * Module destructor - clears event cache
     *
     * @access public
     */
    Filters.prototype.destruct = function()
    {
        this._callbacks = {};
    }

    /**
     * Fire a custom event
     *
     * @param eventName string The event name to fire
     * @param subject   mixed  What should be given as "this" to the event callbacks
     * @access public
     */
    Filters.prototype.filter = function(eventName, subject)
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
     * @param eventName string The event name
     * @param callback  func   The callback function
     * @access public
     */
    Filters.prototype.on = function(eventName, callback)
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
     * @param eventName string The event name
     * @param callback  func   The callback function
     * @access public
     */
    Filters.prototype.off = function(eventName, callback)
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
    Filters.prototype._getFnName = function(fn)
    {
        var f = typeof fn == 'function';

        var s = f && ((fn.name && ['', fn.name]) || fn.toString().match(/function ([^\(]+)/));

        return (!f && 'not a function') || (s && s[1] || 'anonymous');
    }

    // Load into container and invoke
    Container.singleton('Filters', Filters);

}());

/**
 * InputMasker
 *
 * @see https://github.com/text-mask/text-mask/tree/master/vanilla
 */
(function()
{
    /**
     * JS Helper reference
     * 
     * @see https://github.com/text-mask/text-mask/tree/master/vanilla
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
     * @var array
     */
    var _masks = [];

    /**
     * JS Helper reference
     * 
     * @var object
     */
    var Helper = Container.Helper();

    /**
     * Module constructor
     *
     * @constructor
     * @access public
     */
    var InputMasker = function(element)
    {
        this._element = element;

        this._mask = null;

        return this;
    }


    /**
     * Mask Credit Card
     *
     * @access public
     */
    InputMasker.prototype.creditcard = function()
    {
        var _mask = vanillaMasker.maskInput(
        {
            inputElement: this._element,
            guide: false,
            mask: [/[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/]
        });

        _mask['_element'] = this._element;

        _masks.push(_mask);
    };

    /**
     * Mask money
     *
     * @access public
     */
    InputMasker.prototype.money = function()
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
    };

    /**
     * Mask money
     *
     * @access public
     */
    InputMasker.prototype.numeric = function()
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
    };

    /**
     * Mask numeric with decimals
     *
     * @access public
     */
    InputMasker.prototype.numericDecimal = function()
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
    };

    /**
     * Mask alpha numeric
     *
     * @access public
     */
    InputMasker.prototype.alphaNumeric = function()
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
    };

    /**
     * Mask alpha space
     *
     * @access public
     */
    InputMasker.prototype.alphaSpace = function()
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
    };

    /**
     * Mask alpha dash
     *
     * @access public
     */
    InputMasker.prototype.alphaDash = function()
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
    };

    /**
     * Mask alphanumeric dash
     *
     * @access public
     */
    InputMasker.prototype.alphaNumericDash = function()
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
    };

    /**
     * Mask custom regex
     *
     * @access public
     * @param  regex  pattern The pattern regex to mask
     */
    InputMasker.prototype.regex = function(pattern)
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
    };

    /**
     * Disable the mask
     *
     * @access public
     */
    InputMasker.prototype.remove = function()
    {
        for (var i = _masks.length - 1; i >= 0; i--)
        {
            if (_masks[i]['_element'] === this._element)
            {
                _masks[i]._destroy();

                _masks.splice(i, 1);
            }
        }
    };

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
     * @var obj
     */
    var Helper = Container.Helper();

    /**
     * @var obj
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
     * @constructor
     * @params options obj
     * @access public
     * @return this
     */
    var Modal = function(options)
    {
        this._options = Helper.array_merge(defaults, options);
        this._timer = null;
        this._modal = null;
        this._overlay = null;
        this._modalInner = null;

        this._invoke();

        return this;
    };

    /**
     * After options have parsed invoke the modal
     *
     * @access private
     */
    Modal.prototype._invoke = function()
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
     * @access private
     */
    Modal.prototype._buildModal = function()
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

            Helper.innerHTML(modal, [
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
     * @access private
     * @return string
     */
    Modal.prototype._buildTargetModal = function()
    {
        var content = Helper.$(this._options.targetContent);

        if (!Helper.nodeExists(content))
        {
            throw new Error('Could not find modal content with selector "' + this._options.targetContent + '"');
        }

        return '<div class="modal-dialog js-modal-dialog"><div class="card js-modal-panel">' + content.innerHTML + '</div></div>';
    }

    /**
     * Render the modal
     *
     * @access private
     */
    Modal.prototype._render = function()
    {
        var _this = this;
        document.body.appendChild(this._overlay);
        document.body.appendChild(this._modal);

        this._centerModal();

        Helper.addClass(this._overlay, 'active');

        this._fireRender();

        Helper.addEventListener(window, 'resize', function modalResize()
        {
            _this._centerModal();
        });

        Helper.addClass(document.body, 'no-scroll');
    }

    /**
     * Bind event listeners inside the built modal
     *
     * @access private
     */
    Modal.prototype._bindListeners = function()
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

            if (Helper.hasClass(this, 'js-modal-confirm'))
            {
                var canClose = _this._fireConfirmValidator();

                if (!canClose)
                {
                    return;
                }
            }

            Helper.addClass(_this._overlay, 'transition-off');

            _this._fireClosed();

            if (Helper.hasClass(this, 'js-modal-confirm'))
            {
                _this._fireConfirm();
            }

            _this._timer = setTimeout(function()
            {
                Helper.removeFromDOM(_this._overlay);
                Helper.removeFromDOM(_this._modal);
                Helper.removeClass(document.body, 'no-scroll');
            }, 600);
        }

        if (this._options.closeAnywhere === true)
        {
            Helper.addEventListener(this._modal, 'click', closeModal, false);
        }

        var modalCloses = Helper.$All('.js-modal-close', this._modal);
        if (!Helper.empty(modalCloses))
        {
            Helper.addEventListener(modalCloses, 'click', closeModal, false);
        }

        var modalCancel = Helper.$('.js-modal-cancel', this._modal);
        if (Helper.nodeExists(modalCancel))
        {
            Helper.addEventListener(modalCancel, 'click', closeModal, false);
        }
    }

    /**
     * Fire render event
     *
     * @access private
     */
    Modal.prototype._fireRender = function()
    {
        if (this._options.onRender !== null && Helper.isCallable(this._options.onRender))
        {
            var callback = this._options.onRender;
            var args = this._options.onRenderArgs;
            callback.apply(this._modal, args);

        }
    }

    /**
     * Fire the closed event
     *
     * @access private
     */
    Modal.prototype._fireClosed = function()
    {
        if (this._options.onClose !== null && Helper.isCallable(this._options.onClose))
        {
            var callback = this._options.onClose;
            var args = this._options.onCloseArgs;
            callback.apply(this._modal, args);
            Helper.removeClass(document.body, 'no-scroll');
        }
    }

    /**
     * Fire the confirm event
     *
     * @access private
     */
    Modal.prototype._fireConfirm = function()
    {
        if (this._options.onConfirm !== null && Helper.isCallable(this._options.onConfirm))
        {
            var callback = this._options.onConfirm;
            var args = this._options.onConfirmArgs;
            callback.apply(this._modal, args);
        }
    }

    /**
     * Fire the confirm validation
     *
     * @access private
     */
    Modal.prototype._fireConfirmValidator = function()
    {
        if (this._options.validateConfirm !== null && Helper.isCallable(this._options.validateConfirm))
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
     * @access private
     */
    Modal.prototype._fireBuilt = function()
    {
        if (this._options.onBuilt !== null && Helper.isCallable(this._options.onBuilt))
        {
            var callback = this._options.onBuilt;
            var args = this._options.onBuiltArgs;
            callback.apply(this._modal, args);
        }
    }

    /**
     * Center the modal vertically
     *
     * @access private
     */
    Modal.prototype._centerModal = function()
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
     * @var obj
     */
    var Helper = Container.Helper();

    /**
     * @var obj
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
     * @constructor
     * @params options obj
     * @access public
     * @return this
     */
    var Frontdrop = function(options)
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
    };

    /**
     * After options have parsed invoke the modal
     *
     * @access private
     */
    Frontdrop.prototype._invoke = function()
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
     * @access private
     */
    Frontdrop.prototype._buildModal = function()
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

        Helper.innerHTML(modal, [
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
     * @access private
     * @return string
     */
    Frontdrop.prototype._getTargetContent = function()
    {
        var content = Helper.$(this._options.targetContent);

        if (!Helper.nodeExists(content))
        {
            throw new Error('Could not find modal content with selector "' + this._options.targetContent + '"');
        }

        return content.innerHTML.trim();
    }

    /**
     * Render the modal
     *
     * @access private
     */
    Frontdrop.prototype._render = function()
    {
        var _this = this;
        document.body.appendChild(this._overlay);
        document.body.appendChild(this._modal);

        var overlay = this._overlay;

        setTimeout(function()
        {
            Helper.addClass(overlay, 'active');

        }, 50);

        this._fireRender();

        Helper.addClass(document.body, 'no-scroll');
    }

    /**
     * Bind event listeners inside the built modal
     *
     * @access private
     */
    Frontdrop.prototype._bindListeners = function()
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

            if (Helper.hasClass(this, 'js-frontdrop-confirm'))
            {
                var canClose = _this._fireConfirmValidator();

                if (!canClose)
                {
                    return;
                }
            }

            Helper.addClass(_this._overlay, 'transition-off');

            _this._fireClosed();

            if (Helper.hasClass(this, 'js-frontdrop-confirm'))
            {
                _this._fireConfirm();
            }

            _this._timer = setTimeout(function()
            {
                Helper.removeFromDOM(_this._overlay);
                Helper.removeFromDOM(_this._modal);
                Helper.removeClass(document.body, 'no-scroll');
            }, 500);
        }

        if (this._options.closeAnywhere === true)
        {
            Helper.addEventListener(this._modal, 'click', closeModal, false);
        }

        var modalCloses = Helper.$All('.js-frontdrop-close', this._modal);
        if (!Helper.empty(modalCloses))
        {
            Helper.addEventListener(modalCloses, 'click', closeModal, false);
        }
    }

    /**
     * Fire render event
     *
     * @access private
     */
    Frontdrop.prototype._fireRender = function()
    {
        if (this._options.onRender !== null && Helper.isCallable(this._options.onRender))
        {
            var callback = this._options.onRender;
            var args = this._options.onRenderArgs;
            callback.apply(this._modal, args);

        }
    }

    /**
     * Fire the closed event
     *
     * @access private
     */
    Frontdrop.prototype._fireClosed = function()
    {
        if (this._options.onClose !== null && Helper.isCallable(this._options.onClose))
        {
            var callback = this._options.onClose;
            var args = this._options.onCloseArgs;
            callback.apply(this._modal, args);
            Helper.removeClass(document.body, 'no-scroll');
        }
    }

    /**
     * Fire the confirm event
     *
     * @access private
     */
    Frontdrop.prototype._fireConfirm = function()
    {
        if (this._options.onConfirm !== null && Helper.isCallable(this._options.onConfirm))
        {
            var callback = this._options.onConfirm;
            var args = this._options.onConfirmArgs;
            callback.apply(this._modal, args);
        }
    }

    /**
     * Fire the confirm validation
     *
     * @access private
     */
    Frontdrop.prototype._fireConfirmValidator = function()
    {
        if (this._options.validateConfirm !== null && Helper.isCallable(this._options.validateConfirm))
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
     * @access private
     */
    Frontdrop.prototype._fireBuilt = function()
    {
        if (this._options.onBuilt !== null && Helper.isCallable(this._options.onBuilt))
        {
            var callback = this._options.onBuilt;
            var args = this._options.onBuiltArgs;
            callback.apply(this._modal, args);
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
     * @var Helper obj
     */
    var Helper = Container.Helper();

    /**
     * @var _activeNotifs array
     */
    var _activeNotifs = [];

    /**
     * Module constructor
     *
     * @class
     * @constructor
     * @params options obj
     * @access public
     * @return this
     */
    var Notification = function(options)
    {
        this._notifWrap = Helper.$('.js-nofification-wrap');

        if (!Helper.nodeExists(this._notifWrap))
        {
            this._buildNotificationContainer();
        }

        this._invoke(options);

        return this;
    }

    /**
     * Build the notification container
     *
     * @access private
     */
    Notification.prototype._buildNotificationContainer = function()
    {
        var wrap = document.createElement('DIV');
        wrap.className = 'notification-wrap js-nofification-wrap';
        document.body.appendChild(wrap);
        this._notifWrap = Helper.$('.js-nofification-wrap');
    }


    /**
     * Display the notification
     *
     * @params options obj
     * @access private
     */
    Notification.prototype._invoke = function(options)
    {
        if (typeof options.isCallback !== 'undefined' && options.isCallback === true)
        {
            this._invokeCallbackable(options);

            return;
        }

        var _this = this;
        var content = '<div class="msg-body"><p>' + options.msg + '</p></div>';
        var notif = Helper.newNode('div', 'msg-' + options.type + ' msg animate-notif', null, content, this._notifWrap);
        var timeout = typeof options.timeoutMs === 'undefined' ? 6000 : options.timeoutMs;

        Helper.addClass(this._notifWrap, 'active');

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
     * @params options obj
     * @access private
     */
    Notification.prototype._invokeCallbackable = function(options)
    {
        var _this = this;
        var confirmText = typeof options.confirmText === 'undefined' ? 'Confirm' : options.confirmText;
        var dismissX = typeof options.showDismiss === 'undefined' ? '' : '<button type="button" class="btn btn-xs btn-pure btn-dismiss btn-circle js-dismiss"><span class="glyph-icon glyph-icon-cross2"></span></button>';
        var timeout = typeof options.timeoutMs === 'undefined' ? 6000 : options.timeoutMs;

        var content = '<div class="msg-body"><p>' + options.msg + '</p></div><div class="msg-btn"><button type="button" class="btn btn-primary btn-sm btn-pure js-confirm">' + confirmText + '</button>' + dismissX + '</div>';

        var notif = Helper.newNode('div', 'msg animate-notif', null, content, this._notifWrap);
        var confirm = Helper.$('.js-confirm', notif);
        var dismiss = Helper.$('.js-dismiss', notif);

        Helper.addClass(this._notifWrap, 'active');

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
            if (Helper.isCallable(options.onDismiss))
            {
                options.onDismiss(options.onDismissArgs);
            }

            _this._removeNotification(notif);
        });

        // Click confirm to remove
        confirm.addEventListener('click', function()
        {
            if (Helper.isCallable(options.onConfirm))
            {
                options.onConfirm(options.onConfirmArgs);
            }

            _this._removeNotification(notif);
        });

        if (dismiss)
        {
            dismiss.addEventListener('click', function()
            {
                if (Helper.isCallable(options.onDismiss))
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
     * @params _node node
     * @access private
     */
    Notification.prototype._removeNotification = function(_node)
    {
        var _this = this;
        var i = _activeNotifs.length;
        while (i--)
        {
            if (_node === _activeNotifs[i].node)
            {
                clearTimeout(_activeNotifs[i].timeout);
                Helper.removeClass(_node, 'animate-notif');
                Helper.animate(_node, 'opacity', '1', '0', 350, 'ease');
                Helper.animate(_node, 'max-height', '100px', '0', 450, 'ease');
                _activeNotifs.splice(i, 1);
                setTimeout(function()
                {
                    Helper.removeFromDOM(_node);

                    if (_activeNotifs.length === 0)
                    {
                        Helper.removeClass(_this._notifWrap, 'active');
                    }
                }, 450);
                return;
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

*/
(function()
{
    /**
     * JS Queue
     *
     * @see https://medium.com/@griffinmichl/asynchronous-javascript-queue-920828f6327
     */
    var Queue = function(concurrency)
    {
        this.running = 0;
        this.concurrency = concurrency;
        this.taskQueue = [];

        return this;
    }

    Queue.prototype.add = function(task, _this, _args)
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

    Queue.prototype.next = function()
    {
        this.running--;

        if (this.taskQueue.length > 0)
        {
            var task = this.taskQueue.shift();

            this._runTask(task['callback'], task['_this'], task['_args']);
        }
    }

    Queue.prototype._runTask = function(task, _this, _args)
    {
        this.running++;

        task.apply(_this, _args);
    }

    Queue.prototype._enqueueTask = function(task, _this, _args)
    {
        this.taskQueue.push(
        {
            'callback': task,
            '_this': _this,
            '_args': _args
        });
    }

    var AjaxQueue = new Queue(1);

    /**
     * Module constructor
     *
     * @access public
     * @constructor
     * @return this
     */
    var _Ajax = function()
    {
        this._settings = {
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
        this._success = false;
        this._error = false;

        return this;
    }

    /**
     * Ajax Methods 
     *
     * @access public
     * @param  string        url     Destination URL
     * @param  string|object data    Data (optional)
     * @param  function      success Success callback (optional)
     * @param  function      error   Error callback (optional)
     * @param  object        headers Request headers (optional)
     * @return this
     */
    _Ajax.prototype.post = function(url, data, success, error, complete, headers)
    {
        var instance = new _Ajax;

        AjaxQueue.add(instance._call, instance, instance._normaliseArgs('POST', url, data, success, error, complete, headers));

        return instance;
    }
    _Ajax.prototype.get = function(url, data, success, error, complete, headers)
    {
        var instance = new _Ajax;

        AjaxQueue.add(instance._call, instance, instance._normaliseArgs('GET', url, data, success, error, complete, headers));

        return instance;
    }
    _Ajax.prototype.head = function(url, data, success, error, complete, headers)
    {
        var instance = new _Ajax;

        AjaxQueue.add(instance._call, instance, instance._normaliseArgs('HEAD', url, data, success, error, complete, headers));

        return instance;
    }
    _Ajax.prototype.put = function(url, data, success, error, complete, headers)
    {
        var instance = new _Ajax;

        AjaxQueue.add(instance._call, instance, instance._normaliseArgs('PUT', url, data, success, error, complete, headers));

        return instance;
    }
    _Ajax.prototype.delete = function(url, data, success, error, complete, headers)
    {
        var instance = new _Ajax;

        AjaxQueue.add(instance._call, instance, instance._normaliseArgs('DELETE', url, data, success, error, complete, headers));

        return instance;
    }

    /**
     * Success function
     *
     * @param  function  callback Callback function
     * @return this
     */
    _Ajax.prototype.success = function(callback)
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
     * @param  function  callback Callback function
     * @return this
     */
    _Ajax.prototype.error = function(callback)
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
     * @param  function  callback Callback function
     * @return this
     */
    _Ajax.prototype.then = function(callback)
    {
        return this.complete(callback);
    }

    /**
     * Complete function
     *
     * @param  function  callback Callback function
     * @return this
     */
    _Ajax.prototype.complete = function(callback)
    {
        if (!this._isFunc(callback))
        {
            throw new Error('Error the provided argument "' + JSON.parse(callback) + '" is not a valid callback');
        }

        this._complete = callback;

        return this;
    }

    /**
     * Special Upload Function
     *
     * @access public
     * @param  string        url      Destination URL
     * @param  object        data     Form data
     * @param  function      success  Success callback
     * @param  function      error    Error callback
     * @param  function      start    Start callback (optional)
     * @param  function      progress Progress callback (optional)
     * @param  function      complete Complete callback (optional)
     * @return this
     */
    _Ajax.prototype.upload = function(url, data, success, error, start, progress, complete)
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
     * @access private
     * @param  string        method  Request method
     * @param  string        url     Destination URL
     * @param  string|object data    Data (optional)
     * @param  function      success Success callback (optional)
     * @param  function      error   Error callback (optional)
     * @param  function      complete Complete callback (optional)
     * @param  object        headers Request headers (optional)
     * @return this
     */
    _Ajax.prototype._call = function(method, url, data, success, error, complete, headers)
    {

        xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

        this._xhr = xhr;

        xhr.requestURL = url;

        xhr.mthod = method;

        xhr.open(method, url, this._settings['async']);

        this._sendHeaders(xhr, headers);

        var _this = this;

        if (this._settings['async'])
        {
            xhr.onreadystatechange = function()
            {
                _this._ready.call(_this, xhr, success, error, complete);
            }

            xhr.send(data);
        }
        else
        {
            xhr.send(data);

            this._ready.call(this, xhr, success, error, complete);
        }

        return this;
    }

    /**
     * Send XHR headers
     *
     * @access private
     * @param  object    xhr     XHR object
     * @param  object    headers Request headers (optional)
     * @return {This}
     */
    _Ajax.prototype._sendHeaders = function(xhr, headers)
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
     * @param  string        method  Request method
     * @param  string        url     Destination URL
     * @param  string|object data    Data (optional)
     * @param  function      success Success callback (optional)
     * @param  function      error   Error callback (optional)
     * @param  object        headers Request headers (optional)
     * @return {This}
     */
    _Ajax.prototype._normaliseArgs = function(method, url, data, success, error, complete, headers)
        {
            var complete = typeof complete === 'undefined' ? 'false' : complete;

            // (url, complete)
            if (this._isFunc(data))
            {
                complete = data;

                //OR (url, complete, headers)
                if (this._isFunc(success))
                {
                    headers = success;
                }

                success = false;

                error = false;
            }

            if (method !== 'POST')
            {
                if (this._isObj(data) && !this._isEmpty(data))
                {
                    url += url.includes('?') ? '&' : '?';
                    url += this._params(data);
                    data = null;
                }
            }
            else if (this._isObj(data) && !this._isEmpty(data))
            {
                data = this._params(data);
            }

            return [method, url, data, success, error, complete, headers];
        }
        /**
         * Ready callback
         *
         * @return string
         */
    _Ajax.prototype._ready = function(xhr, success, error, complete)
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

    _Ajax.prototype._isEmpty = function(mixedvar)
    {
        return mixedvar && Object.keys(mixedvar).length === 0 && mixedvar.constructor === Object;
    }

    _Ajax.prototype._isFunc = function(mixedvar)
    {
        return Object.prototype.toString.call(mixedvar) === '[object Function]';
    }

    _Ajax.prototype._isObj = function(mixedvar)
    {
        return Object.prototype.toString.call(mixedvar) === '[object Object]';
    }

    _Ajax.prototype._params = function(obj)
    {
        var s = [];

        for (var key in obj)
        {
            s.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
        }

        return s.join('&');
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
     * @var Helper obj
     */
    var Helper = Container.Helper();

    /**
     * Module constructor
     *
     * @class
     * @constructor
     * @param form node
     * @access public
     * @return this
     */
    var FormValidator = function(form)
    {

        // Save inputs
        this._form = form;
        this._inputs = Helper.getFormInputs(form);

        // Defaults
        this._rulesIndex = [];
        this._invalids = [];
        this._formObj = {};
        this._nameIndex = {};
        this._validForm = true;

        // Initialize
        this._indexInputs();

        return this;

    };

    // PUBLIC ACCESS

    /**
     *  Is the form valid?
     *
     * @access public
     * @return boolean
     */
    FormValidator.prototype.isValid = function()
    {
        return this._validateForm();
    };

    /**
     * Show invalid inputs
     *
     * @access public
     */
    FormValidator.prototype.showInvalid = function()
    {

        this._clearForm();

        // Show the invalid inputs
        for (var j = 0; j < this._invalids.length; j++)
        {
            var __wrap = Helper.closest(this._invalids[j], '.form-field');
            if (Helper.nodeExists(__wrap)) Helper.addClass(__wrap, 'danger');
        }
    }

    /**
     * Remove errored inputs
     *
     * @access public
     */
    FormValidator.prototype.clearInvalid = function()
    {
        this._clearForm();
    }

    /**
     * Show form result
     *
     * @access public
     */
    FormValidator.prototype.showResult = function(result)
    {
        this._clearForm();
        Helper.addClass(this._form, result);
    }

    /**
     * Append a key/pair and return form obj
     *
     * @access public
     * @return obj
     */
    FormValidator.prototype.append = function(key, value)
    {
        this._formObj[key] = value;
        return this._generateForm();
    };

    /**
     * Get the form object
     *
     * @access public
     * @return obj
     */
    FormValidator.prototype.form = function()
    {
        return this._generateForm();
    };


    // PRIVATE FUNCTIONS

    /**
     * Index form inputs by name and rules
     *
     * @access public
     */
    FormValidator.prototype._indexInputs = function()
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
    };

    /**
     * Validate the form inputs
     *
     * @access private
     * @return boolean
     */
    FormValidator.prototype._validateForm = function()
    {
        this._invalids = [];
        this._validForm = true;

        for (var i = 0; i < this._rulesIndex.length; i++)
        {

            this._rulesIndex[i].isValid = true;

            var pos = this._rulesIndex[i];
            var value = Helper.getInputValue(pos.node);

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
    };

    /**
     * Generate the form object
     *
     * @access private
     * @return obj
     */
    FormValidator.prototype._generateForm = function()
    {
        for (var i = 0; i < this._inputs.length; i++)
        {
            var name = this._inputs[i].name;
            var value = Helper.getInputValue(this._inputs[i]);
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
                if (!Helper.isset(this._formObj[name])) this._formObj[name] = [];
                this._formObj[name].push(value);
            }
            else
            {
                this._formObj[name] = value;
            }
        }
        return this._formObj;
    };

    /**
     * Mark an input as not valid (internally)
     *
     * @access private
     * @return obj
     */
    FormValidator.prototype._devalidate = function(i)
    {
        this._rulesIndex[i].isValid = false;
        this._validForm = false;
        this._invalids.push(this._rulesIndex[i].node);
    };

    /**
     * Clear form result and input errors
     *
     * @access private
     * @return obj
     */
    FormValidator.prototype._clearForm = function(i)
    {
        // Remove the form result
        Helper.removeClass(this._form, ['info', 'success', 'warning', 'danger']);

        // Make all input elements 'valid' - i.e hide the error msg and styles.
        for (var i = 0; i < this._inputs.length; i++)
        {
            var _wrap = Helper.closest(this._inputs[i], '.form-field');
            if (Helper.nodeExists(_wrap)) Helper.removeClass(_wrap, ['info', 'success', 'warning', 'danger'])
        }
    };

    /**
     * Private validator methods
     *
     * @access private
     * @return boolean
     */
    FormValidator.prototype._validateEmail = function(value)
    {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(value);
    };
    FormValidator.prototype._validateName = function(value)
    {
        var re = /^[A-z _-]+$/;
        return re.test(value);
    };
    FormValidator.prototype._validateNumeric = function(value)
    {
        var re = /^[\d]+$/;
        return re.test(value);
    };
    FormValidator.prototype._validatePassword = function(value)
    {
        var re = /^(?=.*[^a-zA-Z]).{6,40}$/;
        return re.test(value);
    };
    FormValidator.prototype._validateUrl = function(value)
    {
        re = /^(www\.|[A-z]|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
        return re.test(value);
    };
    FormValidator.prototype._validateMinLength = function(value, min)
    {
        return value.length >= min;
    };
    FormValidator.prototype._validateMaxLength = function(value, max)
    {
        return value.length <= max;
    };
    FormValidator.prototype._validateAplha = function(value)
    {
        var re = /^[A-z _-]+$/;
        return re.test(value);
    };
    FormValidator.prototype._validateAplhaNumeric = function(value)
    {
        var re = /^[A-z0-9]+$/;
        return re.test(value);
    };
    FormValidator.prototype._validateList = function(value)
    {
        var re = /^[-\w\s]+(?:,[-\w\s]*)*$/;
        return re.test(value);
    };
    FormValidator.prototype._validateCreditCard = function(value)
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
    };

    // Load into container
    Container.set('FormValidator', FormValidator);

})();

/**
 * Money Formatter
 *
 * @see https://github.com/gerardojbaez/money
 * @example Money.format(12.99, 'USD'); // RESULT: $12.99
 * 
 */
(function()
{
    /**
     * number_format
     *
     * @see https://github.com/locutusjs/locutus/blob/e0a68222d482d43164e96ab96023b712d25680a6/src/php/strings/number_format.js
     */
    function number_format(number, decimals, decPoint, thousandsSep)
    { // eslint-disable-line camelcase
        //  discuss at: https://locutus.io/php/number_format/
        // original by: Jonas Raoni Soares Silva (https://www.jsfromhell.com)
        // improved by: Kevin van Zonneveld (https://kvz.io)
        // improved by: davook
        // improved by: Brett Zamir (https://brett-zamir.me)
        // improved by: Brett Zamir (https://brett-zamir.me)
        // improved by: Theriault (https://github.com/Theriault)
        // improved by: Kevin van Zonneveld (https://kvz.io)
        // bugfixed by: Michael White (https://getsprink.com)
        // bugfixed by: Benjamin Lupton
        // bugfixed by: Allan Jensen (https://www.winternet.no)
        // bugfixed by: Howard Yeend
        // bugfixed by: Diogo Resende
        // bugfixed by: Rival
        // bugfixed by: Brett Zamir (https://brett-zamir.me)
        //  revised by: Jonas Raoni Soares Silva (https://www.jsfromhell.com)
        //  revised by: Luke Smith (https://lucassmith.name)
        //    input by: Kheang Hok Chin (https://www.distantia.ca/)
        //    input by: Jay Klehr
        //    input by: Amir Habibi (https://www.residence-mixte.com/)
        //    input by: Amirouche
        //   example 1: number_format(1234.56)
        //   returns 1: '1,235'
        //   example 2: number_format(1234.56, 2, ',', ' ')
        //   returns 2: '1 234,56'
        //   example 3: number_format(1234.5678, 2, '.', '')
        //   returns 3: '1234.57'
        //   example 4: number_format(67, 2, ',', '.')
        //   returns 4: '67,00'
        //   example 5: number_format(1000)
        //   returns 5: '1,000'
        //   example 6: number_format(67.311, 2)
        //   returns 6: '67.31'
        //   example 7: number_format(1000.55, 1)
        //   returns 7: '1,000.6'
        //   example 8: number_format(67000, 5, ',', '.')
        //   returns 8: '67.000,00000'
        //   example 9: number_format(0.9, 0)
        //   returns 9: '1'
        //  example 10: number_format('1.20', 2)
        //  returns 10: '1.20'
        //  example 11: number_format('1.20', 4)
        //  returns 11: '1.2000'
        //  example 12: number_format('1.2000', 3)
        //  returns 12: '1.200'
        //  example 13: number_format('1 000,50', 2, '.', ' ')
        //  returns 13: '100 050.00'
        //  example 14: number_format(1e-8, 8, '.', '')
        //  returns 14: '0.00000001'

        number = (number + '').replace(/[^0-9+\-Ee.]/g, '')
        const n = !isFinite(+number) ? 0 : +number
        const prec = !isFinite(+decimals) ? 0 : Math.abs(decimals)
        const sep = (typeof thousandsSep === 'undefined') ? ',' : thousandsSep
        const dec = (typeof decPoint === 'undefined') ? '.' : decPoint
        let s = '';

        const toFixedFix = function(n, prec)
        {
            if (('' + n).indexOf('e') === -1)
            {
                return +(Math.round(n + 'e+' + prec) + 'e-' + prec)
            }
            else
            {
                const arr = ('' + n).split('e')
                let sig = ''
                if (+arr[1] + prec > 0)
                {
                    sig = '+'
                }
                return (+(Math.round(+arr[0] + 'e' + sig + (+arr[1] + prec)) + 'e-' + prec)).toFixed(prec)
            }
        }

        // @todo: for IE parseFloat(0.55).toFixed(0) = 0;
        s = (prec ? toFixedFix(n, prec).toString() : '' + Math.round(n)).split('.')
        if (s[0].length > 3)
        {
            s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep)
        }
        if ((s[1] || '').length < prec)
        {
            s[1] = s[1] || ''
            s[1] += new Array(prec - s[1].length + 1).join('0')
        }

        return s.join(dec)
    }


    /**
     * Currency Formats.
     *
     * Formats initially collected from
     * http://www.joelpeterson.com/blog/2011/03/formatting-over-100-currencies-in-php/
     *
     * All currencies were validated against some trusted
     * sources like Wikipedia, thefinancials.com and
     * cldr.unicode.org.
     *
     * Please note that each format used on each currency is
     * the format for that particular country/language.
     * When the country is unknown, the English format is used.
     *
     * @todo REFACTOR! This should be located on a separated file. Working on that!
     *
     * @var array
     */
    var currencies = {
        'NGN':
        {
            'code': 'NGN',
            'title': 'Nigerian Naira',
            'symbol': '₦',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'ARS':
        {
            'code': 'ARS',
            'title': 'Argentine Peso',
            'symbol': 'AR$',
            'precision': 2,
            'thousandSeparator': '.',
            'decimalSeparator': ',',
            'symbolPlacement': 'before'
        },
        'AMD':
        {
            'code': 'AMD',
            'title': 'Armenian Dram',
            'symbol': 'Դ',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'AWG':
        {
            'code': 'AWG',
            'title': 'Aruban Guilder',
            'symbol': 'Afl. ',
            'precision': 2,
            'thousandSeparator': '.',
            'decimalSeparator': ',',
            'symbolPlacement': 'before'
        },
        'AUD':
        {
            'code': 'AUD',
            'title': 'Australian Dollar',
            'symbol': '$',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'BSD':
        {
            'code': 'BSD',
            'title': 'Bahamian Dollar',
            'symbol': 'B$',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'BHD':
        {
            'code': 'BHD',
            'title': 'Bahraini Dinar',
            'symbol': null,
            'precision': 3,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'BDT':
        {
            'code': 'BDT',
            'title': 'Bangladesh, Taka',
            'symbol': null,
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'BZD':
        {
            'code': 'BZD',
            'title': 'Belize Dollar',
            'symbol': 'BZ$',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'BMD':
        {
            'code': 'BMD',
            'title': 'Bermudian Dollar',
            'symbol': 'BD$',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'BOB':
        {
            'code': 'BOB',
            'title': 'Bolivia, Boliviano',
            'symbol': 'Bs',
            'precision': 2,
            'thousandSeparator': '.',
            'decimalSeparator': ',',
            'symbolPlacement': 'before'
        },
        'BAM':
        {
            'code': 'BAM',
            'title': 'Bosnia and Herzegovina convertible mark',
            'symbol': 'KM ',
            'precision': 2,
            'thousandSeparator': '.',
            'decimalSeparator': ',',
            'symbolPlacement': 'before'
        },
        'BWP':
        {
            'code': 'BWP',
            'title': 'Botswana, Pula',
            'symbol': 'p',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'BRL':
        {
            'code': 'BRL',
            'title': 'Brazilian Real',
            'symbol': 'R$',
            'precision': 2,
            'thousandSeparator': '.',
            'decimalSeparator': ',',
            'symbolPlacement': 'before'
        },
        'BND':
        {
            'code': 'BND',
            'title': 'Brunei Dollar',
            'symbol': 'B$',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'CAD':
        {
            'code': 'CAD',
            'title': 'Canadian Dollar',
            'symbol': 'CA$',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'KYD':
        {
            'code': 'KYD',
            'title': 'Cayman Islands Dollar',
            'symbol': 'CI$',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'CLP':
        {
            'code': 'CLP',
            'title': 'Chilean Peso',
            'symbol': 'CLP$',
            'precision': 0,
            'thousandSeparator': '.',
            'decimalSeparator': '',
            'symbolPlacement': 'before'
        },
        'CNY':
        {
            'code': 'CNY',
            'title': 'China Yuan Renminbi',
            'symbol': 'CN¥',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'COP':
        {
            'code': 'COP',
            'title': 'Colombian Peso',
            'symbol': 'COL$',
            'precision': 2,
            'thousandSeparator': '.',
            'decimalSeparator': ',',
            'symbolPlacement': 'before'
        },
        'CRC':
        {
            'code': 'CRC',
            'title': 'Costa Rican Colon',
            'symbol': '₡',
            'precision': 2,
            'thousandSeparator': '.',
            'decimalSeparator': ',',
            'symbolPlacement': 'before'
        },
        'HRK':
        {
            'code': 'HRK',
            'title': 'Croatian Kuna',
            'symbol': ' kn',
            'precision': 2,
            'thousandSeparator': '.',
            'decimalSeparator': ',',
            'symbolPlacement': 'after'
        },
        'CUC':
        {
            'code': 'CUC',
            'title': 'Cuban Convertible Peso',
            'symbol': 'CUC$',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'CUP':
        {
            'code': 'CUP',
            'title': 'Cuban Peso',
            'symbol': 'CUP$',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'CYP':
        {
            'code': 'CYP',
            'title': 'Cyprus Pound',
            'symbol': '£',
            'precision': 2,
            'thousandSeparator': '.',
            'decimalSeparator': ',',
            'symbolPlacement': 'before'
        },
        'CZK':
        {
            'code': 'CZK',
            'title': 'Czech Koruna',
            'symbol': ' Kč',
            'precision': 2,
            'thousandSeparator': ' ',
            'decimalSeparator': ',',
            'symbolPlacement': 'after'
        },
        'DKK':
        {
            'code': 'DKK',
            'title': 'Danish Krone',
            'symbol': ' kr.',
            'precision': 2,
            'thousandSeparator': '.',
            'decimalSeparator': ',',
            'symbolPlacement': 'after'
        },
        'DOP':
        {
            'code': 'DOP',
            'title': 'Dominican Peso',
            'symbol': 'RD$',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'XCD':
        {
            'code': 'XCD',
            'title': 'East Caribbean Dollar',
            'symbol': 'EC$',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'EGP':
        {
            'code': 'EGP',
            'title': 'Egyptian Pound',
            'symbol': 'EGP',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'SVC':
        {
            'code': 'SVC',
            'title': 'El Salvador Colon',
            'symbol': '₡',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'EUR':
        {
            'code': 'EUR',
            'title': 'Euro',
            'symbol': '€',
            'precision': 2,
            'thousandSeparator': '.',
            'decimalSeparator': ',',
            'symbolPlacement': 'before'
        },
        'GHC':
        {
            'code': 'GHC',
            'title': 'Ghana, Cedi',
            'symbol': 'GH₵',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'GIP':
        {
            'code': 'GIP',
            'title': 'Gibraltar Pound',
            'symbol': '£',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'GTQ':
        {
            'code': 'GTQ',
            'title': 'Guatemala, Quetzal',
            'symbol': 'Q',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'HNL':
        {
            'code': 'HNL',
            'title': 'Honduras, Lempira',
            'symbol': 'L',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'HKD':
        {
            'code': 'HKD',
            'title': 'Hong Kong Dollar',
            'symbol': 'HK$',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'HUF':
        {
            'code': 'HUF',
            'title': 'Hungary, Forint',
            'symbol': ' Ft',
            'precision': 0,
            'thousandSeparator': ' ',
            'decimalSeparator': '',
            'symbolPlacement': 'after'
        },
        'ISK':
        {
            'code': 'ISK',
            'title': 'Iceland Krona',
            'symbol': ' kr',
            'precision': 0,
            'thousandSeparator': '.',
            'decimalSeparator': '',
            'symbolPlacement': 'after'
        },
        'INR':
        {
            'code': 'INR',
            'title': 'Indian Rupee ₹',
            'symbol': '₹',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'IDR':
        {
            'code': 'IDR',
            'title': 'Indonesia, Rupiah',
            'symbol': 'Rp',
            'precision': 2,
            'thousandSeparator': '.',
            'decimalSeparator': ',',
            'symbolPlacement': 'before'
        },
        'IRR':
        {
            'code': 'IRR',
            'title': 'Iranian Rial',
            'symbol': null,
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'JMD':
        {
            'code': 'JMD',
            'title': 'Jamaican Dollar',
            'symbol': 'J$',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'JPY':
        {
            'code': 'JPY',
            'title': 'Japan, Yen',
            'symbol': '¥',
            'precision': 0,
            'thousandSeparator': ',',
            'decimalSeparator': '',
            'symbolPlacement': 'before'
        },
        'JOD':
        {
            'code': 'JOD',
            'title': 'Jordanian Dinar',
            'symbol': null,
            'precision': 3,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'KES':
        {
            'code': 'KES',
            'title': 'Kenyan Shilling',
            'symbol': 'KSh',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'KWD':
        {
            'code': 'KWD',
            'title': 'Kuwaiti Dinar',
            'symbol': 'K.D.',
            'precision': 3,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'KZT':
        {
            'code': 'KZT',
            'title': 'Kazakh tenge',
            'symbol': '₸',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'LVL':
        {
            'code': 'LVL',
            'title': 'Latvian Lats',
            'symbol': 'Ls',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'LBP':
        {
            'code': 'LBP',
            'title': 'Lebanese Pound',
            'symbol': 'LBP',
            'precision': 0,
            'thousandSeparator': ',',
            'decimalSeparator': '',
            'symbolPlacement': 'before'
        },
        'LTL':
        {
            'code': 'LTL',
            'title': 'Lithuanian Litas',
            'symbol': ' Lt',
            'precision': 2,
            'thousandSeparator': ' ',
            'decimalSeparator': ',',
            'symbolPlacement': 'after'
        },
        'MKD':
        {
            'code': 'MKD',
            'title': 'Macedonia, Denar',
            'symbol': 'ден ',
            'precision': 2,
            'thousandSeparator': '.',
            'decimalSeparator': ',',
            'symbolPlacement': 'before'
        },
        'MYR':
        {
            'code': 'MYR',
            'title': 'Malaysian Ringgit',
            'symbol': 'RM',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'MTL':
        {
            'code': 'MTL',
            'title': 'Maltese Lira',
            'symbol': 'Lm',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'MUR':
        {
            'code': 'MUR',
            'title': 'Mauritius Rupee',
            'symbol': 'Rs',
            'precision': 0,
            'thousandSeparator': ',',
            'decimalSeparator': '',
            'symbolPlacement': 'before'
        },
        'MXN':
        {
            'code': 'MXN',
            'title': 'Mexican Peso',
            'symbol': 'MX$',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'MZM':
        {
            'code': 'MZM',
            'title': 'Mozambique Metical',
            'symbol': 'MT',
            'precision': 2,
            'thousandSeparator': '.',
            'decimalSeparator': ',',
            'symbolPlacement': 'before'
        },
        'NPR':
        {
            'code': 'NPR',
            'title': 'Nepalese Rupee',
            'symbol': null,
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'ANG':
        {
            'code': 'ANG',
            'title': 'Netherlands Antillian Guilder',
            'symbol': 'NAƒ ',
            'precision': 2,
            'thousandSeparator': '.',
            'decimalSeparator': ',',
            'symbolPlacement': 'before'
        },
        'ILS':
        {
            'code': 'ILS',
            'title': 'New Israeli Shekel ₪',
            'symbol': ' ₪',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'after'
        },
        'TRY':
        {
            'code': 'TRY',
            'title': 'New Turkish Lira',
            'symbol': '₺',
            'precision': 2,
            'thousandSeparator': '.',
            'decimalSeparator': ',',
            'symbolPlacement': 'before'
        },
        'NZD':
        {
            'code': 'NZD',
            'title': 'New Zealand Dollar',
            'symbol': 'NZ$',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'NOK':
        {
            'code': 'NOK',
            'title': 'Norwegian Krone',
            'symbol': 'kr ',
            'precision': 2,
            'thousandSeparator': ' ',
            'decimalSeparator': ',',
            'symbolPlacement': 'before'
        },
        'PKR':
        {
            'code': 'PKR',
            'title': 'Pakistan Rupee',
            'symbol': null,
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'PEN':
        {
            'code': 'PEN',
            'title': 'Peru, Nuevo Sol',
            'symbol': 'S/.',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'UYU':
        {
            'code': 'UYU',
            'title': 'Peso Uruguayo',
            'symbol': '$U ',
            'precision': 2,
            'thousandSeparator': '.',
            'decimalSeparator': ',',
            'symbolPlacement': 'before'
        },
        'PHP':
        {
            'code': 'PHP',
            'title': 'Philippine Peso',
            'symbol': '₱',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'PLN':
        {
            'code': 'PLN',
            'title': 'Poland, Zloty',
            'symbol': ' zł',
            'precision': 2,
            'thousandSeparator': ' ',
            'decimalSeparator': ',',
            'symbolPlacement': 'after'
        },
        'GBP':
        {
            'code': 'GBP',
            'title': 'Pound Sterling',
            'symbol': '£',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'OMR':
        {
            'code': 'OMR',
            'title': 'Rial Omani',
            'symbol': 'OMR',
            'precision': 3,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'RON':
        {
            'code': 'RON',
            'title': 'Romania, New Leu',
            'symbol': null,
            'precision': 2,
            'thousandSeparator': '.',
            'decimalSeparator': ',',
            'symbolPlacement': 'before'
        },
        'ROL':
        {
            'code': 'ROL',
            'title': 'Romania, Old Leu',
            'symbol': null,
            'precision': 2,
            'thousandSeparator': '.',
            'decimalSeparator': ',',
            'symbolPlacement': 'before'
        },
        'RUB':
        {
            'code': 'RUB',
            'title': 'Russian Ruble',
            'symbol': ' ₽',
            'precision': 2,
            'thousandSeparator': ' ',
            'decimalSeparator': ',',
            'symbolPlacement': 'after'
        },
        'SAR':
        {
            'code': 'SAR',
            'title': 'Saudi Riyal',
            'symbol': 'SAR',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'SGD':
        {
            'code': 'SGD',
            'title': 'Singapore Dollar',
            'symbol': 'S$',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'SKK':
        {
            'code': 'SKK',
            'title': 'Slovak Koruna',
            'symbol': ' SKK',
            'precision': 2,
            'thousandSeparator': ' ',
            'decimalSeparator': ',',
            'symbolPlacement': 'after'
        },
        'SIT':
        {
            'code': 'SIT',
            'title': 'Slovenia, Tolar',
            'symbol': null,
            'precision': 2,
            'thousandSeparator': '.',
            'decimalSeparator': ',',
            'symbolPlacement': 'before'
        },
        'ZAR':
        {
            'code': 'ZAR',
            'title': 'South Africa, Rand',
            'symbol': 'R',
            'precision': 2,
            'thousandSeparator': ' ',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'KRW':
        {
            'code': 'KRW',
            'title': 'South Korea, Won ₩',
            'symbol': '₩',
            'precision': 0,
            'thousandSeparator': ',',
            'decimalSeparator': '',
            'symbolPlacement': 'before'
        },
        'SZL':
        {
            'code': 'SZL',
            'title': 'Swaziland, Lilangeni',
            'symbol': 'E',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'SEK':
        {
            'code': 'SEK',
            'title': 'Swedish Krona',
            'symbol': ' kr',
            'precision': 2,
            'thousandSeparator': ' ',
            'decimalSeparator': ',',
            'symbolPlacement': 'after'
        },
        'CHF':
        {
            'code': 'CHF',
            'title': 'Swiss Franc',
            'symbol': 'SFr ',
            'precision': 2,
            'thousandSeparator': '\'',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'TZS':
        {
            'code': 'TZS',
            'title': 'Tanzanian Shilling',
            'symbol': 'TSh',
            'precision': 0,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'THB':
        {
            'code': 'THB',
            'title': 'Thailand, Baht ฿',
            'symbol': '฿',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'TOP':
        {
            'code': 'TOP',
            'title': 'Tonga, Paanga',
            'symbol': 'T$ ',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'AED':
        {
            'code': 'AED',
            'title': 'UAE Dirham',
            'symbol': 'AED',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'UAH':
        {
            'code': 'UAH',
            'title': 'Ukraine, Hryvnia',
            'symbol': ' ₴',
            'precision': 2,
            'thousandSeparator': ' ',
            'decimalSeparator': ',',
            'symbolPlacement': 'after'
        },
        'USD':
        {
            'code': 'USD',
            'title': 'US Dollar',
            'symbol': '$',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'VUV':
        {
            'code': 'VUV',
            'title': 'Vanuatu, Vatu',
            'symbol': 'VT',
            'precision': 0,
            'thousandSeparator': ',',
            'decimalSeparator': '',
            'symbolPlacement': 'before'
        },
        'VEF':
        {
            'code': 'VEF',
            'title': 'Venezuela Bolivares Fuertes',
            'symbol': 'Bs.',
            'precision': 2,
            'thousandSeparator': '.',
            'decimalSeparator': ',',
            'symbolPlacement': 'before'
        },
        'VEB':
        {
            'code': 'VEB',
            'title': 'Venezuela, Bolivar',
            'symbol': 'Bs.',
            'precision': 2,
            'thousandSeparator': '.',
            'decimalSeparator': ',',
            'symbolPlacement': 'before'
        },
        'VND':
        {
            'code': 'VND',
            'title': 'Viet Nam, Dong ₫',
            'symbol': ' ₫',
            'precision': 0,
            'thousandSeparator': '.',
            'decimalSeparator': '',
            'symbolPlacement': 'after'
        },
        'ZWD':
        {
            'code': 'ZWD',
            'title': 'Zimbabwe Dollar',
            'symbol': 'Z$',
            'precision': 2,
            'thousandSeparator': ' ',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
    };

    /**
     * Create new Currency instance.
     *
     * @param  string Currency ISO-4217 code
     * @return void
     */
    var Currency = function(code)
    {
        /**
         * ISO-4217 Currency Code.
         *
         * @var string
         */
        this.code = null;

        /**
         * Currency symbol.
         *
         * @var string
         */
        this.symbol = null;

        /**
         * Currency precision (number of decimals).
         *
         * @var int
         */
        this.precision = null;

        /**
         * Currency title.
         *
         * @var string
         */
        this.title = null;

        /**
         * Currency thousand separator.
         *
         * @var string
         */
        this.thousandSeparator = null;

        /**
         * Currency decimal separator.
         *
         * @var string
         */
        this.decimalSeparator = null;

        /**
         * Currency symbol placement.
         *
         * @var string (front|after) currency
         */
        this.symbolPlacement = null;

        if (!this.hasCurrency(code))
        {
            throw new Error('Currency not found: "' + code + '"');
        }

        var currency = this.getCurrency(code);

        for (var key in currency)
        {
            if (!currency.hasOwnProperty(key))
            {
                continue;
            }

            this[key] = currency[key];
        }

        return this;
    }

    /**
     * Get currency ISO-4217 code.
     *
     * @return string
     */
    Currency.prototype.getCode = function()
    {
        return this.code;
    }

    /**
     * Get currency symbol.
     *
     * @return string
     */
    Currency.prototype.getSymbol = function()
    {
        return this.symbol;
    }

    /**
     * Get currency precision.
     *
     * @return int
     */
    Currency.prototype.getPrecision = function()
    {
        return this.precision;
    }

    /**
     * @param integer precision
     * @return this
     */
    Currency.prototype.setPrecision = function(precision)
    {
        this.precision = precision;

        return this;
    }

    /**
     * Get currency title.
     *
     * @return string
     */
    Currency.prototype.getTitle = function()
    {
        return this.title;
    }

    /**
     * Get currency thousand separator.
     *
     * @return string
     */
    Currency.prototype.getThousandSeparator = function()
    {
        return this.thousandSeparator;
    }

    /**
     * @param string separator
     * @return this
     */
    Currency.prototype.setThousandSeparator = function(separator)
    {
        this.thousandSeparator = separator;

        return this;
    }

    /**
     * Get currency decimal separator.
     *
     * @return string
     */
    Currency.prototype.getDecimalSeparator = function()
    {
        return this.decimalSeparator;
    }

    /**
     * @param string separator
     * @return this
     */
    Currency.prototype.setDecimalSeparator = function(separator)
    {
        this.decimalSeparator = separator;

        return this;
    }

    /**
     * Get currency symbol placement.
     *
     * @return string
     */
    Currency.prototype.getSymbolPlacement = function()
    {
        return this.symbolPlacement;
    }

    /**
     * @param string placement [before|after]
     * @return this
     */
    Currency.prototype.setSymbolPlacement = function(placement)
    {
        this.symbolPlacement = placement;

        return this;
    }

    /**
     * Get all currencies.
     *
     * @return object
     */
    Currency.prototype.getAllCurrencies = function()
    {
        return currencies;
    }

    /**
     * Set currency
     * 
     * @return void
     */
    Currency.prototype.setCurrency = function(code, currency)
    {
        currencies[code] = currency;
    }

    /**
     * Get currency.
     *
     * @access protected
     * @return object
     */
    Currency.prototype.getCurrency = function(code)
    {
        return currencies[code];
    }

    /**
     * Check currency existence (within the class)
     *
     * @access protected
     * @return bool
     */
    Currency.prototype.hasCurrency = function(code)
    {
        return code in currencies
    }

    /**
     * Create new Money Instance
     *
     * @param float|int
     * @param mixed $currency
     * @return void
     */
    var Money = function(amount, currency)
    {
        this._amount = parseFloat(amount);

        currency = (typeof currency === 'undefined' ? 'AUD' : currency);

        if (typeof currency === 'string')
        {
            this._currency = new Currency(currency);
        }
        else if (currency instanceof Currency)
        {
            this._currency = currency;
        }

        return this;
    }

    /**
     * Converts from cents to dollars
     *
     * @return string
     */
    Money.prototype.fromCents = function()
    {
        this._amount = this._amount / 100;

        return this;
    }

    /**
     * Format amount to currency equivalent string.
     *
     * @return string
     */
    Money.prototype.format = function()
    {
        var format = this.amount();

        if (this._currency.getSymbol() === null)
        {
            format += ' ' + this._currency.getCode();
        }
        else if (this._currency.getSymbolPlacement() == 'before')
        {
            format = this._currency.getSymbol() + format;
        }
        else
        {
            format += this._currency.getSymbol();
        }

        return format;
    }

    /**
     * Get amount formatted to currency.
     *
     * @return mixed
     */
    Money.prototype.amount = function()
    {
        // Indian Rupee use special format
        if (this._currency.getCode() == 'INR')
        {
            return this._amount.toString().split('.')[0].length > 3 ? this._amount.toString().substring(0, this._amount.toString().split('.')[0].length - 3).replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + this._amount.toString().substring(this._amount.toString().split('.')[0].length - 3) : this._amount.toString();
        }

        // Return western format
        return number_format(
            this._amount,
            this._currency.getPrecision(),
            this._currency.getDecimalSeparator(),
            this._currency.getThousandSeparator()
        );
    }

    /**
     * Get amount formatted decimal.
     *
     * @return string decimal
     */
    Money.prototype.toDecimal = function()
    {
        return this._amount.toString();
    }

    /**
     * parses locale formatted money string
     * to object of class Money
     *
     * @param  string          $str      Locale Formatted Money String
     * @param  Currency|string $currency default 'AUD'
     * @return Money           $money    Decimal String
     */
    Money.prototype.parse = function(str, currency)
    {
        currency = typeof currency === 'undefined' ? 'AUD' : currency;

        // get currency object
        currency = typeof currency === 'string' ? new Currency(currency) : currency;

        // remove HTML encoded characters: http://stackoverflow.com/a/657670
        // special characters that arrive like &0234;
        // remove all leading non numbers
        str = str.replace(/&#?[a-z0-9]{2,8};/ig, '').replace(/^[^0-9]*/g, '');

        // remove all thousands separators
        if (currency.getThousandSeparator().length > 0)
        {
            str = str.replaceAll(currency.getThousandSeparator(), '');
        }

        if (currency.getDecimalSeparator().length > 0)
        {
            // make decimal separator regex safe
            var char = currency.getDecimalSeparator();

            // remove all other characters
            // convert all decimal seperators to PHP/bcmath safe decimal '.'

            str = str.replace(new RegExp('[^\\' + char + '\\d]+', 'g'), '').replaceAll(char, '.');
        }
        else
        {
            // for currencies that do not have decimal points
            // remove all other characters
            str = str.replace(/[^\d]/, '');
        }

        return new Money(str, currency);
    }

    // Load into container 
    Container.set('Money', Money);

    Container.set('Currency', Currency);

}());

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
        this._options.onErrorArgs = typeof options.onErrorArgs === 'undefined' ? [] : options.onErrorArgs;

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
        var target = Helper.$(this._options.target);
        var ajaxUrl = this._options.url;
        var form = this._options.form ||
        {};
        var trigger = this._options.trigger;
        var _this = this;

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
        var target = Helper.$(this._options.target);

        for (var i = 0; i < classes.length; i++)
        {
            var content = details[classes[i]['key']] || null;
            var node = Helper.$(classes[i]['class'], target);

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
            var args = this._options.onRenderArgs;
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
            var args = this._options.onErrorArgs;
            args.unshift(error);

            callback.apply(this._options.target, args);
        }
    }

    // Load into container
    Container.set('_DynamicUiHandler', DynamicUiHandler);

})();

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
        this._options.onErrorArgs = typeof options.onErrorArgs === 'undefined' ? [] : options.onErrorArgs;

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
        var target = Helper.$(this._options.target);
        var ajaxUrl = this._options.url;
        var form = this._options.form ||
        {};
        var trigger = this._options.trigger;
        var _this = this;

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
        var target = Helper.$(this._options.target);

        for (var i = 0; i < classes.length; i++)
        {
            var content = details[classes[i]['key']] || null;
            var node = Helper.$(classes[i]['class'], target);

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
            var args = this._options.onRenderArgs;
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
            var args = this._options.onErrorArgs;
            args.unshift(error);

            callback.apply(this._options.target, args);
        }
    }

    // Load into container
    Container.set('_DynamicUiHandler', DynamicUiHandler);

})();


// DOM Module
/**
 * Pjax module
 *
 * @author    Joe J. Howard
 * @copyright Joe J. Howard
 * @license   https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE
 */

(function()
{
    /**
     * JS Helper
     * 
     * @var obj
     */
    var Helper = Hubble.helper();

    /**
     * AJAX Module
     * 
     * @var obj
     */
    var Ajax = Hubble.require('Ajax');

    /**
     * AJAX URL to list paginated reviews
     * 
     * @var string
     */
    var _urlBase = window.location.origin;

    /**
     * Has pjax been invoked
     * 
     * @var bool
     */
    var _invoked = false;

    /**
     * Array of page caches
     * 
     * @var array
     */
    var _cache = [];

    /**
     * Array of requested urls
     * 
     * @var array
     */
    var _requestedUrls = [];

    /**
     * Are we listening for state changes ?
     * 
     * @var bool
     */
    var _listening = false;

    /**
     * Are we currently loading a pjax request ?
     * 
     * @var bool
     */
    var _loading = false;

    /**
     * Very simple chain library
     * 
     * @var obj
     * @source https://github.com/krasimir/chain
     */
    var Chain = function()
    {
        var n = {},
            t = null,
            r = this,
            e = {},
            o = [],
            i = [],
            u = function(f, t)
            {
                return n[f] || (n[f] = []), n[f].push(t), e
            },
            p = function(t, r)
            {
                if (n[t])
                    for (var o = 0; f = n[t][o]; o++) f(r, e)
            },
            l = function()
            {
                if (arguments.length > 0)
                {
                    o = [];
                    for (var n = 0; r = arguments[n]; n++) o.push(r);
                    var f = o.shift();
                    if ("function" == typeof f) f(t, e);
                    else if ("object" == typeof f && f.length > 0)
                    {
                        var r = f.shift();
                        r.apply(r, f.concat([e.next]))
                    }
                }
                else p("done", t);
                return e
            },
            a = function()
            {
                return arguments.length > 0 && (2 === arguments.length && "string" == typeof arguments[0] && "function" == typeof arguments[1] ? u.apply(self, arguments) : l.apply(self, arguments)), a
            };
        return e = {
            on: u,
            off: function(t, r)
            {
                if (n[t])
                {
                    for (var o = [], i = 0; f = n[t][i]; i++) f !== r && o.push(f);
                    n[t] = o
                }
                return e
            },
            next: function(n)
            {
                t = n, l.apply(r, o)
            },
            error: function(n)
            {
                return void 0 !== n ? (i.push(n), e) : i
            }
        }, a
    };

    /**
     * DOM parser pollyfill (legacy support)
     * 
     * @var obj
     * @source https://gist.github.com/1129031
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

    /**
     * Module constructor
     *
     * @constructor
     * @access public
     */
    var Pjax = function()
    {
        if (!_invoked)
        {
            this._bind();
        }

        return this;
    };

    /**
     * Module destructor - unbinds events
     *
     * @access public
     */
    Pjax.prototype.destruct = function()
    {
        // Keep the CAHCE so that state changes are retained
        _invoked = false;
        _listening = false;

        window.removeEventListener('popstate', this._stateChange, false);

        Hubble.require('Events').off('pjax:start', this._onStart);
        Hubble.require('Events').off('pjax:complete', this._onComplete);
    }

    /**
     * Bind events
     *
     * @access public
     */
    Pjax.prototype._bind = function()
    {
        _invoked = true;

        this._cachePage();

        _requestedUrls.push(this._normaliseUrl(window.location.href));

        Hubble.require('Events').on('pjax:start', this._onStart);
        Hubble.require('Events').on('pjax:complete', this._onComplete);
    }

    /**
     * Check if the module has loaded a url
     *
     * @access public
     * @param  string url URL to check
     * @return bool
     */
    Pjax.prototype.requestedUrl = function(url)
    {
        return Helper.in_array(this._normaliseUrl(url), _requestedUrls);
    }

    /**
     * Remove a requested url
     *
     * @access public
     * @param  string url URL to check
     */
    Pjax.prototype.removeUrl = function(url)
    {
        if (this.requestedUrl(url))
        {
            url = this._normaliseUrl(url);
            var i = _requestedUrls.length;
            while (i--)
            {
                if (_requestedUrls[i] === url)
                {
                    _requestedUrls.splice(i, 1);
                }
            }
        }
    }

    /**
     * Set a state based on a url
     *
     * @access public
     * @param  string url URL to check
     */
    Pjax.prototype.setState = function(url)
    {
        url = this._normaliseUrl(url)

        if (this.requestedUrl(url))
        {
            var _content = this._cacheGet(url + '____content');
            var _location = this._cacheGet(url + '____location');

            if (!_content || !_location)
            {
                window.location.href = url;
            }

            // Load entire body from cache
            this._restoreState(_location, _content);
        }
    }

    /**
     * On pjax start event
     *
     * @access private
     */
    Pjax.prototype._onStart = function()
    {
        Hubble.require('NProgress').start();
    }

    /**
     * On pjax complete event
     *
     * @access private
     */
    Pjax.prototype._onComplete = function()
    {
        Hubble.require('NProgress').done();
        Hubble.dom().refresh();
    }

    /**
     * Start a pjax request
     *
     * @access public
     * @param  string url           The url to send the request to
     * @param  string target        The id to put the response into
     * @param  string title         The new page title (optional)
     * @param  bool   stateChange   Change the window history state (optional default false) 
     * @param  bool   singleRequest Is this a single request ? (optional default false
     */
    Pjax.prototype.invoke = function(url, target, title, stateChange, singleRequest)
    {
        // Save the document's current state
        this._cachePage();

        // If we are already loading a pjax request don't proceed
        if (_loading)
        {
            return;
        }

        // We are now loading
        _loading = true;

        // Fallback title
        title = (typeof title === 'undefined' ? false : title);

        // State change defaults to false
        stateChange = (typeof stateChange === 'undefined' ? false : stateChange);

        // State change defaults to false
        singleRequest = (typeof singleRequest === 'undefined' ? false : singleRequest);

        // Normalize the url
        url = this._normaliseUrl(url.trim());

        // Are we changing the window state	
        if (stateChange)
        {
            // Push the current state
            window.history.pushState(
                {
                    id: window.location.href
                },
                document.title,
                window.location.href
            );
        }

        // Create a new location object
        var newLocation = {
            location: url,
            target: target,
            title: title,
            scroll:
            {
                left: 0,
                top: 0
            },
        };

        // Do we need to request fresh ?
        if (singleRequest === true && Helper.in_array(url, _requestedUrls))
        {
            if (stateChange === true)
            {
                if (title)
                {
                    document.title = title;
                }

                window.history.pushState(
                    {
                        id: url
                    },
                    title,
                    url
                );
            }

            _loading = false;

            return;
        }

        // pjax GET the new content
        this._load(newLocation, stateChange, singleRequest);
    }

    /**
     * Send and handle the pjax request
     *
     * @access private
     * @param  object locationObj Location object from the cache
     * @param  bool   stateChange Change the window history state
     * @param  bool   singleRequest Is this a single request (first time only) ?
     */
    Pjax.prototype._load = function(locationObj, stateChange, singleRequest)
    {
        // Store this
        var _this = this;

        // We have now requested this url  
        _requestedUrls.push(locationObj['location']);

        // Fire the start event
        Hubble.require('Events').fire('pjax:start', locationObj);

        // Send GET request
        Ajax.get(locationObj['location'], null, function(HTML)
            {
                // Fire the success event
                Hubble.require('Events').fire('pjax:success', locationObj);

                // Handle the response
                _this._handleSuccess(locationObj, HTML, stateChange);

            },
            // Handle the error
            function(error)
            {
                // Fire the error event
                Hubble.require('Events').fire('pjax:error', locationObj);

                // Handle the error
                _this._handleError(locationObj, error);

            }, [
            {
                'X-PJAX': true
            }]);
    }

    /**
     * Handle Pjax Error
     *
     * @access private
     * @param  object locationObj Location object from the cache
     */
    Pjax.prototype._handleError = function(locationObj)
    {
        // Fire the complete
        Hubble.require('Events').fire('pjax:complete', locationObj);

        _loading = false;

        // Load the page normally
        window.location.href = locationObj.location;
    }

    /**
     * Pjax success handler
     *
     * @access private
     * @param  object locationObj Location object from the cache
     * @param  string HTML        HTML string response from server
     * @param  bool   stateChange Change the window history state
     */
    Pjax.prototype._handleSuccess = function(locationObj, HTML, stateChange)
    {
        // Parse the HTML
        var domCotent = this._parseHTML(HTML);

        // Try to get the title
        var _title = this._findDomTitle(domCotent);

        if (_title)
        {
            locationObj['title'] = _title;
        }
        else
        {
            if (!locationObj['title'])
            {
                locationObj['title'] = document.title;
            }
        }

        // Set the title
        document.title = locationObj['title'];

        // Find the target element in the new HTML and the current DOM
        // If the target is set to 'document-body' get the body
        // Otherwise get by id
        if (locationObj['target'] === 'document-body')
        {
            var targetEl = document.body;
            var domTarget = domCotent.body;
        }
        else
        {
            var targetEl = document.getElementById(locationObj['target']);
            var domTarget = domCotent.getElementById(locationObj['target']);
        }

        // Cache the current document scripts to compare
        var currScripts = this._filterScripts(Array.prototype.slice.call(document.getElementsByTagName('script')));
        var newScripts = this._filterScripts(Array.prototype.slice.call(domCotent.getElementsByTagName('script')));

        // Replace the target el's innerHTML
        if (typeof domTarget === 'undefined' || domTarget === null)
        {
            targetEl.innerHTML = HTML;
        }
        // Or the entire element itself
        else
        {
            HTML = domTarget.innerHTML;
            targetEl.innerHTML = HTML;
        }

        // If we don't need to change the state we can stop here
        if (!stateChange)
        {
            Hubble.require('Events').fire('pjax:complete', locationObj);

            _loading = false;

            return;
        }

        // Push the state change and append any new scripts
        // from the response
        var _this = this;
        Chain()
            (
                function(res, chain)
                {
                    // Append scripts, wait for load/execution and call next chain
                    _this._appendScripts(currScripts, newScripts, chain);
                },
                function(res, chain)
                {
                    // Push the history state
                    window.history.pushState(
                        {
                            id: locationObj.location
                        },
                        locationObj.title,
                        locationObj.location
                    );
                    chain.next();
                },
                function(res, chain)
                {
                    // If we are not listening for any state changes
                    // Add the listener
                    if (!_listening)
                    {
                        _this._stateListener();
                    }

                    // Finished loading
                    _loading = false;

                    // Pjax complete event
                    Hubble.require('Events').fire('pjax:complete', locationObj);

                    // Wait for spinner to finish
                    setTimeout(function()
                    {
                        _this._cachePage();

                    }, 500);
                }
            );
    }

    /**
     * Add the state change listener to use internal page cache
     * to prevent back/forward events if that state is cached here
     *
     * @access private
     */
    Pjax.prototype._stateListener = function()
    {
        window.addEventListener('popstate', this._onStateChange);

        _listening = true;
    }

    /**
     * State change event handler (back/forward clicks)
     *
     * @access private
     * @param  e       event JavaScript 'popstate' event
     */
    Pjax.prototype._onStateChange = function(e)
    {
        e = e || window.event;

        var _this = Hubble.require('Pjax');

        // If this is a cached state
        if (e.state && typeof e.state.id !== 'undefined')
        {
            var _content = _this._cacheGet(e.state.id + '____content');
            var _location = _this._cacheGet(e.state.id + '____location');

            // If the history state was 'broken' 
            // ie page1 -> pjax -> page2 -> leave -> page3 back <- page2 back <- page1
            // then the location object won't be available - refresh normally
            if (!_content || !_location)
            {
                e.preventDefault();
                window.location.href = window.location.href;
                return;
            }

            // Prevent default
            e.preventDefault();

            // Load entire body from cache
            _this._restoreState(_location, _content);
        }
        else
        {
            history.back();
        }
    }

    /**
     * Restore a previous state
     *
     * @access private
     * @param  object locationObj Location object from the cache
     * @param  string HTML        document.body.innerHTML
     */
    Pjax.prototype._restoreState = function(locationObj, HTML)
    {
        // Parse the HTML
        var domCotent = this._parseHTML(HTML);

        // Try to get the title
        var _title = this._findDomTitle(domCotent);

        if (_title)
        {
            locationObj['title'] = _title;
        }
        else
        {
            if (!locationObj['title'])
            {
                locationObj['title'] = document.title;
            }
        }

        // Set the title
        document.title = locationObj['title'];

        document.body.innerHTML = HTML;

        // Cache the current document scripts to compare
        var currScripts = this._filterScripts(Array.prototype.slice.call(document.getElementsByTagName('script')));
        var newScripts = this._filterScripts(Array.prototype.slice.call(domCotent.getElementsByTagName('script')));

        // Push the state change and append any new scripts
        // from the response
        var _this = this;
        Chain()
            (
                function(res, chain)
                {
                    // Append scripts, wait for load/execution and call next chain
                    _this._appendScripts(currScripts, newScripts, chain);
                },
                function(res, chain)
                {
                    _loading = false;
                    Hubble.require('Events').fire('pjax:complete', locationObj);
                }
            );
    }

    /**
     * If there are any new scripts load them
     * 
     * Note that appending or replacing content via 'innerHTML'
     * will not load any inline scripts so we need to compare what scripts have loaded
     * on the current page with any scripts that are in the new DOM tree 
     * and load any that don't already exist
     *
     * @access private
     * @param  array   currScripts Currently loaded scripts array
     * @param  object  newScripts  Newly loaded scripts
     */
    Pjax.prototype._appendScripts = function(currScripts, newScripts, chain)
    {
        var listeningForChain = false;

        for (var i = 0; i < newScripts.length; i++)
        {
            // Script is not in the current DOM tree
            if (!this._hasScript(newScripts[i], currScripts))
            {
                // Create a new script
                var script = document.createElement('script');
                script.type = 'text/javascript';
                script.async = false;

                // Is this an inline script or a src ?
                if (newScripts[i]['src'] === true)
                {
                    // Listen for the script to load to chain next
                    if (!this._havMoreScriptSources(i, newScripts))
                    {
                        script.addEventListener('load', function()
                        {
                            chain.next();
                        });
                        listeningForChain = true;
                    }

                    script.src = newScripts[i]['content'];
                }
                else
                {
                    script.innerHTML = newScripts[i]['content'];

                    // If there are either no more scripts to load
                    // Or no more src scripts to load:
                    // and we haven't added a listener to call the next chain
                    // Add a function so once this script executes the next chain will be called
                    if (!listeningForChain && !this._havMoreScriptSources(i, newScripts))
                    {
                        listeningForChain = true;
                        window.nextChain = function()
                        {
                            chain.next();
                            delete window.nextChain;
                        };

                        script.innerHTML += ';(function(){ nextChain(); })();';
                    }
                }

                // Append the new script
                document.body.appendChild(script);
            }
        }

        // If no listeners call next
        if (!listeningForChain)
        {
            chain.next();
        }
    }

    /**
     * Checks if the current iteration is the last script with a src attribute to load
     *
     * @access private
     * @param  int     i       Current loop iteration
     * @param  array   scripts Array of script objects
     * @return bool
     */
    Pjax.prototype._havMoreScriptSources = function(i, scripts)
    {
        // Are we at the last iteration ?
        if (i < scripts.length - 1)
        {
            return false;
        }

        for (var k = 0; k < scripts.length; k++)
        {
            if (k > i && scripts[k]['src'] === true)
            {
                return true;
            }
        }

        return false;
    }

    /**
     * Filter scripts with unique key/values into an array
     *
     * @access private
     * @param  string html HTML as a string (with or without full doctype)
     * @return array
     */
    Pjax.prototype._filterScripts = function(nodes)
    {
        var result = [];

        for (var i = 0; i < nodes.length; i++)
        {
            var src = nodes[i].getAttribute('src');

            if (src)
            {
                // Remove the query string
                src = src.split('?')[0];

                result.push(
                {
                    'src': true,
                    'inline': false,
                    'content': src
                });
            }
            else
            {
                // Don't append JSON inline scripts
                if (Helper.isJSON(nodes[i].innerHTML.trim()))
                {
                    continue;
                }

                result.push(
                {
                    'src': false,
                    'inline': true,
                    'content': nodes[i].innerHTML.trim()
                });
            }
        }

        return result;
    }

    /**
     * Check if a script with a source or an inline script is in the current scripts
     *
     * @access private
     * @param  object   script
     * @param  array    currScripts
     * @return bool
     */
    Pjax.prototype._hasScript = function(script, currScripts)
    {
        for (var i = 0; i < currScripts.length; i++)
        {
            if (script['content'] === currScripts[i]['content'])
            {
                return true;
            }
        }

        return false;
    }

    /**
     * Try to find the page title in a DOM tree
     *
     * @access private
     * @param  string html HTML as a string (with or without full doctype)
     * @return string|false
     */
    Pjax.prototype._findDomTitle = function(DOM)
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
     * @access private
     * @param  string html HTML as a string (with or without full doctype)
     * @return DOM tree
     */
    Pjax.prototype._parseHTML = function(html)
    {
        var parser = new DOMParser();
        return parser.parseFromString(html, 'text/html');
    }

    /**
     * Get the current document scroll position
     *
     * @access private
     * @return obj
     */
    Pjax.prototype._getScrollPos = function()
    {
        var doc = document.documentElement;
        var top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
        var left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
        return {
            top: top,
            left: left
        };
    }

    /**
     * Save a key/value to the cache
     *
     * @access private
     * @param  string key   The key to save the value under
     * @param  mixed  value The value to save
     */
    Pjax.prototype._cachePut = function(key, value)
    {
        for (var i = 0; i < _cache.length; i++)
        {
            if (_cache[i]['key'] === key)
            {
                _cache[i]['value'] = value;
                return;
            }
        }

        _cache.push(
        {
            key: key,
            value: value
        });
    }

    /**
     * Get a value from the cache by key
     *
     * @access private
     * @param  string key   The key to save the value under
     * @return mixed|false
     */
    Pjax.prototype._cacheGet = function(key)
    {
        for (var i = 0; i < _cache.length; i++)
        {
            if (_cache[i]['key'] === key)
            {
                return _cache[i]['value'];
            }
        }

        return false;
    }

    /**
     * Cache the current page DOM
     *
     * @access private
     */
    Pjax.prototype._cachePage = function()
    {
        var content = document.body.innerHTML;

        var _location = {
            location: window.location.href,
            target: 'document-body',
            title: document.title,
            scroll: this._getScrollPos(),
        };
        this._cachePut(window.location.href + '____location', _location);
        this._cachePut(window.location.href + '____content', content);
    }

    /**
     * Cache the current page DOM
     *
     * @access private
     * @param  string  url The url to normalise
     */
    Pjax.prototype._normaliseUrl = function(url)
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
    
    // Load into Hubble DOM core
    Container.get('Hubble').dom().register('Pjax', Pjax);

})();

/**
 * Pjax Links Module
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
     * Bool val 
     * 
     * @var function
     */
    function boolval(l)
    {
        return !1 !== l && ("false" !== l && (0 !== l && 0 !== l && ("" !== l && "0" !== l && ((!Array.isArray(l) || 0 !== l.length) && (null !== l && void 0 !== l)))))
    }

    /**
     * Module constructor
     *
     * @access public
     * @constructor
     */
    var PjaxLinks = function()
    {
        this._nodes = Helper.$All('.js-pjax-link');

        if (!Helper.empty(this._nodes))
        {
            this._bind();
        }

        return this;
    }

    /**
     * Module destructor
     *
     * @access public
     */
    PjaxLinks.prototype.destruct = function()
    {
        this._unbind();
    }

    /**
     * Event binder - Binds all events on node click
     *
     * @access private
     */
    PjaxLinks.prototype._bind = function()
    {
        Helper.addEventListener(this._nodes, 'click', this._eventHandler, false);
    }

    /**
     * Event unbinder - Removes all events on node click
     *
     * @access private
     */
    PjaxLinks.prototype._unbind = function()
    {
        Helper.removeEventListener(this._nodes, 'click', this._eventHandler, false);
    }

    /**
     * Handle the click event
     *
     * @param event|null e JavaScript click event
     * @access private
     */
    PjaxLinks.prototype._eventHandler = function(e)
    {
        e = e || window.event;

        e.preventDefault();

        var trigger = this;
        var href = trigger.dataset.pjaxHref;
        var target = trigger.dataset.pjaxTarget;
        var title = trigger.dataset.pjaxTitle || false;
        var stateChange = boolval(trigger.dataset.pjaxStateChange);
        var singleRequest = boolval(trigger.dataset.pjaxSingleRequest);

        Hubble.require('Pjax').invoke(href, target, title, stateChange, singleRequest);
    }

    // Load into Hubble DOM core
    Container.get('Hubble').dom().register('PjaxLinks', PjaxLinks);

}());

/**
 * Scrollbars
 *
 * This is a utility class used internally to add custom vertical scrollbars to an element.
 * This class handles the events of the scrollbars.
 * This should not be used at all outside of the framework.
 * @see https://github.com/noraesae/perfect-scrollbar
 */
(function()
{

    var defaults = {
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
    function Scrollbar(element, opts)
    {

        // handle constructor call without `new` keyword
        if (!(this instanceof Scrollbar)) return new Scrollbar(element, opts);

        // is plugin already initialized?
        if (this.el)
        {
            return;
        }

        this.el = element;
        this.opts = extend(
        {}, defaults, opts ||
        {});

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
    Scrollbar.prototype.destroy = function()
    {
        var stateClasses = this.opts.stateClasses;

        this._removeAllListeners();

        this.wrapper.style.overflowY = '';
        this.wrapper.style.marginRight = '';
        this.track.style.display = '';

        removeClass(document.body, stateClasses.dragging);
        removeClass(this.area, stateClasses.dragging);
        removeClass(this.area, stateClasses.hover);
        removeClass(this.track, stateClasses.hover);

        delete this.el;
    }

    /**
     * Refreshes scrollbar by adjusting its handle's height and position.
     */
    Scrollbar.prototype.refresh = function()
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
    Scrollbar.prototype.isNative = function()
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
    Scrollbar.prototype._setupElements = function()
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
    Scrollbar.prototype._observeHover = function(element)
        {
            var cls = this.opts.stateClasses.hover;

            this._addListener(element, 'mouseenter', function()
            {
                addClass(element, cls);
            });
            this._addListener(element, 'mouseleave', function()
            {
                removeClass(element, cls);
            });
        },

        /**
         * Enables scroll by overflowing native scrollbar and starting to listen to `scroll` event.
         *
         * @private
         */
        Scrollbar.prototype._enableScroll = function()
        {
            this._addListener(this.wrapper, 'scroll', bind(this._positionHandle, this));
        }

    /**
     * Enables handle's dragging along the track.
     *
     * @private
     */
    Scrollbar.prototype._enableDragging = function()
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

                addClass(document.body, cls);
                addClass(this.area, cls);
            }
        }, this);

        stopDragging = bind(function()
        {
            initialTop = null;
            initialPosition = null;

            removeClass(document.body, cls);
            removeClass(this.area, cls);

            this._removeListener(document, 'mousemove', startDragging);
            this._removeListener(document, 'mouseup', stopDragging);
        }, this);
    }

    /**
     * Enables track.
     *
     * @private
     */
    Scrollbar.prototype._enableTrack = function()
    {
        this.wrapper.style.overflowY = 'scroll';
        this.wrapper.style.marginRight = -1 * this.scrollbarWidth + 'px';
    }

    /**
     * Allows native scrolling by making sure that div is scrollable.
     *
     * @private
     */
    Scrollbar.prototype._allowNativeScroll = function()
    {
        this.wrapper.style.overflowY = 'auto';
    }

    /**
     * Resizes handle by adjusting its `height`.
     *
     * @private
     */
    Scrollbar.prototype._resizeHandle = function()
    {
        this.handle.style.height = Math.ceil(this.ratio * this.track.offsetHeight) + 'px';
    }

    /**
     * Positions handle by adjusting its `top` position.
     *
     * @private
     */
    Scrollbar.prototype._positionHandle = function()
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
    Scrollbar.prototype._addListener = function(element, eventName, handler)
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
    Scrollbar.prototype._removeListener = function(element, eventName, handler)
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
    Scrollbar.prototype._removeAllListeners = function()
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

    function addClass(el, className)
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

    function removeClass(el, className)
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

    Container.set('Scrollbar', Scrollbar);

})();

/**
 * Custom Scrollbars
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
    var Helper = Hubble.helper();

    /**
     * Module constructor
     *
     * @constructor
     * @access public
     */
    var ScrollBars = function()
    {
        this._nodes = [];
        this._handlers = [];

        // Find nodes
        this._nodes = Helper.$All('.js-custom-scroll');

        // Bind DOM listeners
        if (!Helper.empty(this._nodes))
        {
            for (var i = 0; i < this._nodes.length; i++)
            {
                this._invoke(this._nodes[i]);
            }
        }

        return this;
    };

    /**
     * Module destructor - removes handler
     *
     * @access public
     */
    ScrollBars.prototype.desctruct = function()
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
     * @params el node
     * @access private
     */
    ScrollBars.prototype._invoke = function(el)
    {
        if (Helper.hasClass(el, 'js-auto-scroll-invoked'))
        {
            var handler = Container.get('Scrollbar', el);
            this._handlers.push(handler);
            return;
        }

        var needsScroller = this._needsScroller(el);
        if (!needsScroller) return;

        var insertAfter = false;
        var parent = el.parentNode;
        var children = Helper.firstChildren(el);
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
        var handler = Container.get('Scrollbar', el);
        this._handlers.push(handler);
        Helper.addClass(el, 'js-auto-scroll-invoked');
    }

    /**
     * Check if an element needs to be scrolled or not.
     *
     * @params el node
     * @access private
     * @return boolean
     */
    ScrollBars.prototype._needsScroller = function(el)
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
     * @params elem node
     * @access public
     * @example Container.get('ScrollBars').refresh(node) // Node = $.('.js-custom-scroll');
     */
    ScrollBars.prototype.refresh = function(elem)
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
     * @params elem node
     * @access public
     */
    ScrollBars.prototype.destroy = function(elem)
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
     * @params elem node
     * @access public
     * @return mixed
     */
    ScrollBars.prototype.getHandler = function(elem)
    {
        for (var i = 0; i < this._handlers.length; i++)
        {
            var handler = this._handlers[i];

            if (handler.el === elem) return handler;
        }
    }

    // Load into Hubble DOM core
    Container.get('Hubble').dom().register('Scrollbars', ScrollBars);

})();

/**
 * Toggle height on click
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
    var Collapse = function()
    {
        /**
         * Array of click-triggers
         * 
         * @var array
         */
        this._nodes = Helper.$All('.js-collapse');

        this._bind();

        return this;
    }

    /**
     * Module destructor
     *
     * @access public
     */
    Collapse.prototype.destruct = function()
    {
        this._unbind();

        this._nodes = [];
    }

    /**
     * Event binder - Binds all events on button click
     *
     * @access private
     */
    Collapse.prototype._bind = function()
    {
        Helper.addEventListener(this._nodes, 'click', this._eventHandler);
    }

    /**
     * Event unbinder - Removes all events on button click
     *
     * @access private
     */
    Collapse.prototype._unbind = function()
    {
        Helper.removeEventListener(this._nodes, 'click', this._eventHandler);
    }

    /**
     * Handle the click event
     *
     * @param event|null e JavaScript click event
     * @access private
     */
    Collapse.prototype._eventHandler = function(e)
    {
        e = e || window.event;

        if (Helper.isNodeType(this, 'a'))
        {
            e.preventDefault();
        }

        var clicked = this;
        var targetEl = Helper.$('#' + clicked.dataset.collapseTarget);
        var speed = parseInt(clicked.dataset.collapseSpeed) || 350;
        var easing = clicked.dataset.collapseEasing || 'cubic-bezier(0.19, 1, 0.22, 1)';
        var opacity = clicked.dataset.withOpacity;

        Container.get('ToggleHeight', targetEl, 0, speed, easing, opacity);

        Helper.toggleClass(clicked, 'active');
    }

    // Load into Hubble DOM core
    Container.get('Hubble').dom().register('Collapse', Collapse);

}());

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

    class DropDowns
    {
        constructor()
        {
            this._triggers = Helper.$All('.js-drop-trigger');

            if (!Helper.empty(this._triggers))
            {
                this._bind();
            }
        }
 
        /**
         * Module destructor
         *
         * @access public
         */
        destruct()
        {
            this._unbind();
            
            this._triggers = [];
        }

        /**
         * Bind click listener to containers
         *
         * @access private
         */
        _bind()
        {
            Helper.addEventListener(this._triggers, 'click', this._clickHandler);

            Helper.addEventListener(window, 'click', this._windowClick);
        }

        /**
         * Unbind listener to containers
         *
         * @access private
         */
        _unbind()
        {
            Helper.removeEventListener(this._triggers, 'click', this._clickHandler);

            Helper.removeEventListener(window, 'click', this._windowClick);
        }

        /**
         * Click event handler
         *
         * @param  event|null e JavaScript Click event
         * @access private
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
        _hideDrop(button)
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
        _showDrop(button)
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
        _windowClick(e)
        {
            e = e || window.event;
            if (Helper.closest(e.target, '.js-drop-trigger'))
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
    Container.get('Hubble').dom().register('DropDowns', DropDowns);

})();

/**
 * Tab Nav
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
    var Helper = Hubble.helper();

    /**
     * Module constructor
     *
     * @constructor
     * @access public
     */
    var TabNav = function()
    {
        // Find nodes
        this._nodes = Helper.$All('.js-tab-nav');

        // If nothing to do destruct straight away
        if (!Helper.empty(this._nodes))
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
     * @access public
     */
    TabNav.prototype.destruct = function()
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
     * @params navWrap node
     * @access private
     */
    TabNav.prototype._bindDOMListeners = function(navWrap)
    {
        var links  = Helper.$All('li > *', navWrap);
        
        for (var i = 0; i < links.length; i++)
        {
            Helper.addEventListener(links[i], 'click', this._eventHandler);
        }
    }

    /**
     * Unbind click events on all <a> tags in a .js-tab-nav
     *
     * @params navWrap node
     * @access private
     */
    TabNav.prototype._unbindDOMListeners = function(navWrap)
    {
        var links = Helper.$All('li > *', navWrap);
        
        for (var i = 0; i < links.length; i++)
        {
            Helper.removeEventListener(links[i], 'click', this._eventHandler);
        }
    }

    /**
     * Click event handler
     *
     * @param event|null e JavaScript click event
     * @access private
     */
    TabNav.prototype._eventHandler = function(e)
    {
        e = e || window.event;
        e.preventDefault();

        var _this = Container.get('TabNav');
        
        var node = this;

        if (Helper.hasClass(node, 'active')) return;
        
        var tab           = node.dataset.tab;
        var tabNav        = Helper.closest(node, 'ul');

        var tabPane       = Helper.$('[data-tab-panel="' + tab + '"]');
        var tabPanel      = Helper.closestClass(tabPane, 'js-tab-panels-wrap');
        var activePanel   = Helper.$('.tab-panel.active', tabPanel);

        var navWrap       = Helper.closestClass(node, 'js-tab-nav');
        var activeNav     = Helper.$('.active', navWrap);
        var activeClass   = navWrap.dataset.activeClass;
        var activeClasses = ['active'];

        if (!Helper.empty(activeClass))
        {
            activeClasses.push(activeClass);
        }

        Helper.removeClass(activeNav, activeClasses);
        Helper.removeClass(activePanel, activeClasses);

        Helper.addClass(node, activeClasses);
        Helper.addClass(tabPane, activeClasses);
        
    }

    // Load into Hubble DOM core
    Container.get('Hubble').dom().register('TabNav', TabNav);

})();
/**
 * Bottom nav
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
    var Helper = Hubble.helper();

    /**
     * Module constructor
     *
     * @constructor
     * @access public
     */
    var BottomNav = function()
    {
        // Find nodes
        this._nav = Helper.$('.js-bottom-nav');

        if (Helper.nodeExists(this._nav))
        {
            this._bind();
        }

        return this;
    };

    /**
     * Show nav
     *
     * @access public
     */
    BottomNav.prototype.show = function()
    {
        if (Helper.nodeExists(this._nav))
        {
            Helper.addClass(this._nav, 'active');
        }
    }

    /**
     * Hide nav
     *
     * @access public
     */
    BottomNav.prototype.hide = function()
    {
        if (Helper.nodeExists(this._nav))
        {
            Helper.removeClass(this._nav, 'active');
        }
    }

    /**
     * Show nav
     *
     * @access public
     */
    BottomNav.prototype.state = function()
    {
        if (Helper.nodeExists(this._nav))
        {
            if (Helper.hasClass(this._nav, 'active'))
            {
                return 'show';
            }
        }

        return 'hide';
    }

    /**
     * Module destructor - unbinds click events
     *
     * @access public
     */
    BottomNav.prototype.destruct = function()
    {
        if (Helper.nodeExists(this._nav))
        {
            var links = Helper.$All('.btn', this._nav);

            Helper.removeEventListener(links, 'click', this._eventHandler);

            this._nav = null;
        }
    }

    /**
     * Bind click events on all button
     *
     * @access private
     */
    BottomNav.prototype._bind = function()
    {
        var links = Helper.$All('.btn', this._nav);

        Helper.addEventListener(links, 'click', this._eventHandler);
    }

    /**
     * Click event handler
     *
     * @param event|null e JavaScript click event
     * @access private
     */
    BottomNav.prototype._eventHandler = function(e)
    {
        e = e || window.event;

        e.preventDefault();

        if (Helper.hasClass(this, 'active'))
        {
            return;
        }

        Helper.removeClass(Helper.$('.js-bottom-nav .btn.active'), 'active');

        Helper.addClass(this, 'active');
    }

    // Load into Hubble DOM core
    Container.get('Hubble').dom().register('BottomNav', BottomNav);

})();

/**
 * Drawer
 * 
 */
(function()
{
    /**
     * JS Helper
     * 
     * @var obj
     */
    var Helper = Hubble.helper();

    /**
     * Show/hide sidebar overlay timer
     * 
     * @var setTimeout
     */
    var overleyTimer;

    /**
     * Show/hide sidebar el timer
     * 
     * @var setTimeout
     */
    var toggleTimer;

    /**
     * Last scroll y on page
     * 
     * @var int
     */
    var lastScrollY;

    /**
     * Module constructor
     *
     * @access public
     * @constructor
     * @return this
     */
    var Drawer = function()
    {
        this._openTriggers = Helper.$All('.js-open-drawer-trigger');
        this._closeTriggers = Helper.$All('.js-close-drawer-trigger');
        this._drawerEl = Helper.$('.js-drawer');
        this._overlayEl = Helper.$('.js-drawer-overlay');

        if (Helper.nodeExists(this._drawerEl))
        {
            this._bind();
        }

        return this;
    }

    /**
     * Module destructor
     *
     * @access public
     */
    Drawer.prototype.destruct = function()
    {
        this._unbind();
    }

    /**
     * Bind event listeners
     *
     * @access private
     */
    Drawer.prototype._bind = function()
    {
        this._drawerWidth = Helper.getStyle(this._drawerEl, 'max-width');

        Helper.addEventListener(this._openTriggers, 'click', this.open);

        Helper.addEventListener(this._closeTriggers, 'click', this.close);

        Helper.addEventListener(this._overlayEl, 'click', this.close);
    }

    /**
     * Unbind event listeners
     *
     * @access private
     */
    Drawer.prototype._unbind = function()
    {
        Helper.removeEventListener(this._openTriggers, 'click', this.open);

        Helper.removeEventListener(this._closeTriggers, 'click', this.close);

        Helper.removeEventListener(this._overlayEl, 'click', this.close);
    }

    /**
     * Handle show sidebar
     *
     * @access private
     * @param  event|null e Button click even
     */
    Drawer.prototype.open = function(e)
    {
        e = e || window.event;

        if (e && e.target && Helper.isNodeType(e.target, 'a'))
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
        Helper.showAria(_this._overlayEl);

        // Sidebar
        Helper.css(_this._drawerEl, 'visibility', 'visible');
        if (Helper.hasClass(_this._drawerEl, 'drawer-right'))
        {
            Helper.animate(_this._drawerEl, 'transform', 'translateX('+ _this._drawerWidth + ')', 'translateX(0)', 200, 'easeOutCubic');
        }
        else
        {
            Helper.animate(_this._drawerEl, 'transform', 'translateX(-' + _this._drawerWidth +')', 'translateX(0)', 200, 'easeOutCubic');
        }

        Helper.addClass(document.body, 'no-scroll');
        Helper.showAria(_this._drawerEl);
        Helper.addClass(_this._drawerEl, 'active');
        _this._drawerEl.focus();
    }

    /**
     * Handle hide sidebar
     *
     * @access public
     * @param  event|null e Button click even
     */
    Drawer.prototype.close = function(e)
    {
        e = e || window.event;

        if (e && e.target && Helper.isNodeType(e.target, 'a'))
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
        Helper.hideAria(_this._overlayEl);

        // Sidebar
        if (Helper.hasClass(_this._drawerEl, 'drawer-right'))
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

        Helper.removeClass(document.body, 'no-scroll');
        Helper.hideAria(_this._drawerEl);
        _this._drawerEl.blur();

        if (lastScrollY)
        {
            window.scrollTo(0, lastScrollY);
        }
    }

    // Register as DOM Module and invoke
    Hubble.dom().register('Drawer', Drawer, true);

}());
/**
 * Popover Handler
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
    var _popHandler = function(options)
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
     * @access private
     */
    _popHandler.prototype.buildPopEl = function()
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
     * @access public
     */
    _popHandler.prototype.remove = function()
    {
        if (Helper.nodeExists(this.el)) this.el.parentNode.removeChild(this.el);
    }

    /**
     * Position the popover
     *
     * @access public
     */
    _popHandler.prototype.stylePop = function()
    {

        var targetCoords = Helper.getCoords(this.options.target);

        if (this.options.direction === 'top')
        {
            this.el.style.top = targetCoords.top - this.el.scrollHeight + 'px';
            this.el.style.left = targetCoords.left - (this.el.offsetWidth / 2) + (this.options.target.offsetWidth / 2) + 'px';
            return;
        }
        else if (this.options.direction === 'bottom')
        {
            this.el.style.top = targetCoords.top + this.options.target.offsetHeight + 10 + 'px';
            this.el.style.left = targetCoords.left - (this.el.offsetWidth / 2) + (this.options.target.offsetWidth / 2) + 'px';
            return;
        }
        else if (this.options.direction === 'left')
        {
            this.el.style.top = targetCoords.top - (this.el.offsetHeight / 2) + (this.options.target.offsetHeight / 2) + 'px';
            this.el.style.left = targetCoords.left - this.el.offsetWidth - 10 + 'px';
            return;
        }
        else if (this.options.direction === 'right')
        {
            this.el.style.top = targetCoords.top - (this.el.offsetHeight / 2) + (this.options.target.offsetHeight / 2) + 'px';
            this.el.style.left = targetCoords.left + this.options.target.offsetWidth + 10 + 'px';
            return;
        }
    }

    // Set into container for private use
    Container.set('_popHandler', _popHandler);

}());

/**
 * Popovers
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
    var Popovers = function()
    {
        this._pops = [];
        this._nodes = [];

        // Find nodes
        this._nodes = Helper.$All('.js-popover');

        // Bind events
        if (!Helper.empty(this._nodes))
        {
            for (var i = 0; i < this._nodes.length; i++)
            {
                this._bind(this._nodes[i]);
            }

            this._addWindowClickEvent();
        }

        return this;
    };

    /**
     * Module destructor
     *
     * @access public
     * @return this
     */
    Popovers.prototype.destruct = function()
    {
        if (!Helper.empty(this._nodes))
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
     * @param trigger node
     * @access private
     */
    Popovers.prototype._unbind = function(trigger)
    {
        var evnt = trigger.dataset.popoverEvent;

        if (evnt === 'click')
        {
            Helper.removeEventListener(trigger, 'click', this._clickHandler);
            window.removeEventListener('resize', this._windowResize);
        }
        else
        {
            Helper.removeEventListener(trigger, 'mouseenter', this._hoverOver);
            Helper.removeEventListener(trigger, 'mouseleave', this._hoverLeavTimeout);
        }
    }

    /**
     * Initialize the handlers on a trigger
     *
     * @access private
     * @param  node trigger Click/hover trigger
     */
    Popovers.prototype._bind = function(trigger)
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
            pop = Helper.$('#' + target).cloneNode(true);
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
            Helper.addEventListener(trigger, 'click', this._clickHandler);
            window.addEventListener('resize', this._windowResize);
        }
        else
        {
            var _this = this;
            Helper.addEventListener(trigger, 'mouseenter', this._hoverOver);
            Helper.addEventListener(trigger, 'mouseleave', this._hoverLeavTimeout);
        }
    }

    /**
     * Timeout handler for hoverleave
     *
     * @access private
     */
    Popovers.prototype._hoverLeavTimeout = function(e)
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
     * @access private
     */
    Popovers.prototype._hoverOver = function()
    {
        var trigger = this;
        var _this = Container.get('Popovers');
        var popHandler = _this._getHandler(trigger);
        if (Helper.hasClass(trigger, 'popped')) return;
        popHandler.render();
        Helper.addClass(trigger, 'popped');
    }

    /**
     * Hover leave event handler
     *
     * @access private
     */
    Popovers.prototype._hoverLeave = function(e)
    {
        var _this = Container.get('Popovers');
        var hovers = Helper.$All(':hover');
        for (var i = 0; i < hovers.length; i++)
        {
            if (Helper.hasClass(hovers[i], 'popover'))
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
     * @access private
     */
    Popovers.prototype._windowResize = function()
    {
        var _this = Container.get('Popovers');

        for (var i = 0; i < _this._nodes.length; i++)
        {
            if (Helper.hasClass(_this._nodes[i], 'popped'))
            {
                var popHandler = _this._getHandler(_this._nodes[i]);
                popHandler.stylePop();
            }
        }
    }

    /**
     * Click event handler
     *
     * @param event|null e JavaScript click event
     * @access private
     */
    Popovers.prototype._clickHandler = function(e)
    {
        e = e || window.event;
        e.preventDefault();
        var trigger = this;
        var _this = Container.get('Popovers');
        var popHandler = _this._getHandler(trigger);

        if (Helper.hasClass(trigger, 'popped'))
        {
            _this._removeAll();
            popHandler.remove();
            Helper.removeClass(trigger, 'popped');
        }
        else
        {
            _this._removeAll();
            popHandler.render();
            Helper.addClass(trigger, 'popped');
        }
    }

    /**
     * Remove all popovers when anything is clicked
     *
     * @access private
     */
    Popovers.prototype._addWindowClickEvent = function()
    {
        var _this = this;

        window.addEventListener('click', function(e)
        {
            e = e || window.event;
            var clicked = e.target;

            // Clicked the close button
            if (Helper.hasClass(clicked, 'js-remove-pop') || Helper.closest(clicked, '.js-remove-pop'))
            {
                _this._removeAll();

                return;
            }

            // Clicked inside the popover
            if (Helper.hasClass(clicked, 'popover') || Helper.closest(clicked, '.popover'))
            {
                return;
            }

            // Clicked a popover trigger
            if (Helper.hasClass(clicked, 'js-popover') || Helper.closest(clicked, '.js-popover'))
            {
                return;
            }

            _this._removeAll();
        });
    }

    /**
     * Get the handler for the trigger
     * 
     * @access private
     * @param  node    trigger DOM node that triggered event
     * @return object|false
     */
    Popovers.prototype._getHandler = function(trigger)
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
     * @access private
     */
    Popovers.prototype._removeAll = function()
    {
        for (var i = 0; i < this._pops.length; i++)
        {
            this._pops[i].remove();

            Helper.removeClass(this._pops[i].options.target, 'popped');
        }
    }

    // Load into Hubble DOM core
    Container.get('Hubble').dom().register('Popovers', Popovers);

}());

/**
 * Ripple click animation
 *
 * @author    Joe J. Howard
 * @copyright Joe J. Howard
 * @license   https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE
 */
(function()
{
    /**
     * Ripple handler
     * 
     * @var object
     */
    /**
     * Ripple handler
     * 
     * @see https://github.com/samthor/js-ripple
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
     * @var object
     */
    var Helper = Hubble.helper();

    /**
     * Module constructor
     *
     * @access public
     * @constructor
     */
    var Ripple = function()
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
     * @access public
     */
    Ripple.prototype.destruct = function()
    {
        this._unbind();

        this._nodes = [];
    }

    /**
     * Insert ripples
     *
     * @access private
     */
    Ripple.prototype._bind = function()
    {
        for (var i = 0; i < this._nodes.length; i++)
        {
            this._insertRipple(this._nodes[i]);
        }
    }

    /**
     * Remove ripples
     *
     * @access private
     */
    Ripple.prototype._unbind = function()
    {
        for (var i = 0; i < this._nodes.length; i++)
        {
            var wrapper = this._nodes[i];

            var ripples = Helper.$All('.js-ripple-container', wrapper);

            Helper.removeEventListener(wrapper, 'mousedown', this._mouseDown);

            Helper.removeEventListener(wrapper, 'touchstart', this._touchStart);

            for (var j = 0; j < ripples.length; j++)
            {
                Helper.removeFromDOM(ripples[j]);
            }
        }
    }

    /**
     * Insert ripple
     *
     * @access private
     * @param  node    wrapper
     */
    Ripple.prototype._insertRipple = function(wrapper)
    {
        // If this is a user-defined JS-Ripple we need to insert it
        var rip  = document.createElement('span');
            
        rip.className = 'ripple-container js-ripple-container';

        if (Helper.hasClass(wrapper, 'chip'))
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
     * @access private
     * @param  event|null e
     */
    Ripple.prototype._mouseDown = function(e)
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
     * @access private
     * @param  event|null   e
     */
    Ripple.prototype._touchStart = function(e, foo, bar)
    {
        e = e || window.event;

        for (var i = 0; i < e.changedTouches.length; ++i)
        {
            startRipple(e.type, e.changedTouches[i], this);
        }
    }
    
    // Load into Hubble DOM core
    Container.get('Hubble').dom().register('Ripple', Ripple);

})();

/**
 * Input masker
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
     * @constructor
     * @access public
     */
    var InputMasks = function()
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
     * @access public
     */
    InputMasks.prototype.destruct = function()
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
     * @access private
     */
    InputMasks.prototype._invoke = function()
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

        if (!Helper.empty(this._nodes_money))
        {
            this._loopBind(this._nodes_money, 'money');
        }
        if (!Helper.empty(this._nodes_creditcard))
        {
            this._loopBind(this._nodes_creditcard, 'creditcard');
        }
        if (!Helper.empty(this._nodes_numeric))
        {
            this._loopBind(this._nodes_numeric, 'numeric');
        }
        if (!Helper.empty(this._nodes_numericDecimal))
        {
            this._loopBind(this._nodes_numericDecimal, 'numericDecimal');
        }
        if (!Helper.empty(this._nodes_alphaNumeric))
        {
            this._loopBind(this._nodes_alphaNumeric, 'alphaNumeric');
        }
        if (!Helper.empty(this._nodes_alphaSpace))
        {
            this._loopBind(this._nodes_alphaSpace, 'alphaSpace');
        }
        if (!Helper.empty(this._nodes_alphaDash))
        {
            this._loopBind(this._nodes_alphaDash, 'alphaDash');
        }
        if (!Helper.empty(this._nodes_AlphaNumericDash))
        {
            this._loopBind(this._nodes_AlphaNumericDash, 'alphaNumericDash');
        }
    }

    /**
     * Loop and bind masks to DOM LIST
     *
     * @access private
     */
    InputMasks.prototype._loopBind = function(nodes, mask)
    {
        for (var i = 0; i < nodes.length; i++)
        {
            Container.get('InputMasker', nodes[i])[mask]();
        }
    }

    /**
     * Loop and unbind masks to DOM LIST
     *
     * @access private
     */
    InputMasks.prototype._loopUnBind = function(nodes)
    {
        for (var i = 0; i < nodes.length; i++)
        {
            Container.get('InputMasker', nodes[i]).remove();
        }
    }

    // Load into Hubble DOM core
    Container.get('Hubble').dom().register('InputMasks', InputMasks);

}());

/**
 * Message closers
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
    var Helper = Hubble.helper();

    /**
     * Module constructor
     *
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
        Helper.addEventListener(this._triggers, 'click', this._eventHandler);
    }

    /**
     * Event ubinder - Binds all event handlers on button click
     *
     * @access private
     */
    MessageClosers.prototype._unbind = function()
    {
        Helper.removeEventListener(this._triggers, 'click', this._eventHandler);
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

        var toRemove = Helper.closest(this, '.msg');

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

    // Load into Hubble DOM core
    Container.get('Hubble').dom().register('MessageClosers', MessageClosers);

})();

/**
 * Waypoints
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
    var Helper = Hubble.helper();

    /**
     * Has the page loaded?
     * 
     * @var object
     */
    var pageLoaded = false;

    /**
     * Module constructor
     *
     * @constructor
     * @access public
     */
    var WayPoints = function()
    {
        // Load nodes
        this._nodes = Helper.$All('.js-waypoint-trigger');

        // bind listeners
        if (!Helper.empty(this._nodes))
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
    };

    /**
     * Module destructor
     *
     * @access public
     */
    WayPoints.prototype.destruct = function()
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
     * @params trigger node
     * @access private
     */
    WayPoints.prototype._bind = function(trigger)
    {
        Helper.addEventListener(trigger, 'click', this._eventHandler);
    }

    /**
     * Event unbinder
     *
     * @params trigger node
     * @access private
     */
    WayPoints.prototype._unbind = function(trigger)
    {
        Helper.removeEventListener(trigger, 'click', this._eventHandler);
    }

    /**
     * Event handler
     *
     * @param event|null e JavaScript click event
     * @access private
     */
    WayPoints.prototype._eventHandler = function(e)
    {
        e = e || window.event;
        e.preventDefault();
        var trigger = this;
        var waypoint = trigger.dataset.waypointTarget;
        var targetEl = Helper.$('[data-waypoint="' + waypoint + '"]');

        if (Helper.nodeExists(targetEl))
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
     * @access private
     */
    WayPoints.prototype._invokePageLoad = function()
    {
        var url = Helper.parse_url(window.location.href);

        if (Helper.isset(url['fragment']) && url['fragment'] !== '')
        {
            var waypoint = Helper.trim(url['fragment'], '/');
            var options = {
                speed: 100,
                easing: 'Linear'
            };
            var targetEl = Helper.$('[data-waypoint="' + waypoint + '"]');

            if (Helper.nodeExists(targetEl))
            {
                var id = waypoint;
                targetEl.id = id;
                Container.get('SmoothScroll').animateScroll('#' + id, null, options);
            }
        }

        pageLoaded = true;
    }


    // Load into Hubble DOM core
    Container.get('Hubble').dom().register('WayPoints', WayPoints);

}());

/**
 * Adds classes to inputs
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
    var Inputs = function()
    {
        this._inputs = Helper.$All('.form-field input, .form-field select, .form-field textarea');
        this._labels = Helper.$All('.form-field label');

        if (!Helper.empty(this._inputs))
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
    Inputs.prototype.destruct = function()
    {
        this._unbind();

        this._inputs = [];
    }

    /**
     * Event binder
     *
     * @access private
     */
    Inputs.prototype._bind = function()
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
     * @access private
     */
    Inputs.prototype._unbind = function()
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
     * @access private
     * @params event|null e Browser click event
     */
    Inputs.prototype._onLabelClick = function(e)
    {
        e = e || window.event;

        var input = Helper.$('input', this.parentNode);

        if (Helper.nodeExists(input))
        {
            input.focus();

            return;
        }

        var input = Helper.$('select', this.parentNode);

        if (Helper.nodeExists(input))
        {
            input.focus();

            return;
        }

        var input = Helper.$('textarea', this.parentNode);

        if (Helper.nodeExists(input))
        {
            input.focus();

            return;
        }
    }

    /**
     * Event handler
     *
     * @access private
     * @params event|null e Browser click event
     */
    Inputs.prototype._eventHandler = function(e)
    {
        e = e || window.event;

        if (e.type === 'click')
        {
            this.focus();
        }
        else if (e.type === 'focus')
        {
            Helper.addClass(this.parentNode, 'focus');
        }
        else if (e.type === 'blur')
        {
            Helper.removeClass(this.parentNode, 'focus');
        }

        if (e.type === 'change' || e.type === 'input' || e.type === 'blur')
        {
            var _value = Helper.getInputValue(this);

            if (_value === '')
            {
                Helper.removeClass(this.parentNode, 'not-empty');
                Helper.addClass(this.parentNode, 'empty');
            }
            else
            {
                Helper.removeClass(this.parentNode, 'empty');
                Helper.addClass(this.parentNode, 'not-empty');
            }
        }
    }

    // Load into Hubble DOM core
    Container.get('Hubble').dom().register('Inputs', Inputs);

})();

/**
 * File inputs
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
     * @constructor
     * @access public
     */
    var FileInput = function()
    {
        this._nodes = Helper.$All('.js-file-input');

        this._bind();

        return this;
    }

    /**
     * Module destructor remove event handlers
     *
     * @access public
     */
    FileInput.prototype.destruct = function()
    {
        this._unbind();

        this._nodes = [];
    }

    /**
     * Bind DOM listeners
     *
     * @access public
     */
    FileInput.prototype._bind = function()
    {
        Helper.addEventListener(this._nodes, 'change', this._eventHandler);
    }

    /**
     * Unbind DOM listeners
     *
     * @access public
     */
    FileInput.prototype._unbind = function()
    {
        Helper.removeEventListener(this._nodes, 'change', this._eventHandler);
    }

    /**
     * Handle the change event
     *
     * @access private
     */
    FileInput.prototype._eventHandler = function()
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

    // Load into Hubble DOM core
    Container.get('Hubble').dom().register('FileInput', FileInput);

}());

/**
 * Chip inputs
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
     * @constructor
     * @access public
     */
    var ChipInputs = function()
    {
        this._wrappers = Helper.$All('.js-chips-input');

        this._bind();

        return this;
    }

    /**
     * Module destructor remove event handlers
     *
     * @access public
     */
    ChipInputs.prototype.destruct = function()
    {
        this._unbind();

        this._wrappers = [];
    }

    /**
     * Bind DOM listeners
     *
     * @access private
     */
    ChipInputs.prototype._bind = function()
    {
        for (var i = 0; i < this._wrappers.length; i++)
        {
            this._initInput(this._wrappers[i]);
        }
    }

    /**
     * Unbind DOM listeners
     *
     * @access private
     */
    ChipInputs.prototype._unbind = function()
    {
        for (var i = 0; i < this._wrappers.length; i++)
        {
            this._destroy(this._wrappers[i]);
        }
    }

    /**
     * Init a chips input
     *
     * @access private
     * @param  node    _wrapper
     */
    ChipInputs.prototype._initInput = function(_wrapper)
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
     * @access private
     * @param  node    _wrapper
     */
    ChipInputs.prototype._destroy = function(_wrapper)
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
     * @access private
     * @param  event|null e
     */
    ChipInputs.prototype._preventSubmit = function(e)
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
     * @access private
     * @param  event|null e
     */
    ChipInputs.prototype._onKeyUp = function(e)
    {
        e = e || window.event;

        var _key = e.code || e.key || e.keyCode || e.charCode;

        // Enter
        if (_key == 'Enter' || _key === 13)
        {
            var _this = Container.ChipInputs();

            var _wrapper = Helper.closest(this, '.js-chips-input');

            var _value = Helper.getInputValue(this).trim();

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
     * @access private
     * @param  node    _wrapper
     */
    ChipInputs.prototype._removeLastChip = function(_wrapper)
    {
        var _chips = Helper.$All('.chip', _wrapper);

        if (!Helper.empty(_chips))
        {
            Helper.removeFromDOM(_chips.pop());
        }
    }

    /**
     * Insert new chip
     *
     * @access public
     * @param  string      _value
     * @param  node        _wrapper
     * @param  string|bool _icon
     */
    ChipInputs.prototype.addChip = function(_value, _wrapper, _icon)
    {
        _icon = typeof _icon === 'undefined' ? false : _icon;
        var _name = _wrapper.dataset.inputName;
        var _chip = document.createElement('span');
        var _children = Helper.firstChildren(_wrapper);
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
     * @access private
     * @param  event|null e
     */
    ChipInputs.prototype._removeChip = function(e)
    {
        e = e || window.event;

        Helper.removeFromDOM(Helper.closest(this, '.chip'));
    }

    /**
     * Get all values from chip input
     *
     * @access private
     * @param  node    _wrapper
     * @return array
     */
    ChipInputs.prototype._getChipsValues = function(_wrapper)
    {
        var _result = [];

        var _chips = Helper.$All('.chip input', _wrapper);

        for (var i = 0; i < _chips.length; i++)
        {
            _result.push(Helper.getInputValue(_chips[i]));
        }

        return _result;
    }

    // Load into Hubble DOM core
    Container.get('Hubble').dom().register('ChipInputs', ChipInputs);

}());

/**
 * Chip suggestions.
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
     * @constructor
     * @access public
     */
    var ChipSuggestions = function()
    {
        this._chips = Helper.$All('.js-chip-suggestions .chip');

        this._bind();

        return this;
    }

    /**
     * Module destructor remove event handlers
     *
     * @access public
     */
    ChipSuggestions.prototype.destruct = function()
    {
        this._unbind();

        this._chips = [];
    }

    /**
     * Bind DOM listeners
     *
     * @access private
     */
    ChipSuggestions.prototype._bind = function()
    {
        Helper.addEventListener(this._chips, 'click', this._clickHandler);
    }

    /**
     * Unbind DOM listeners
     *
     * @access private
     */
    ChipSuggestions.prototype._unbind = function()
    {
        Helper.removeEventListener(this._chips, 'click', this._clickHandler);
    }

    /**
     * Chip click handler
     *
     * @access private
     * @param  event|null e
     */
    ChipSuggestions.prototype._clickHandler = function(e)
    {
        e = e || window.event;

        var _wrapper = Helper.closest(this, '.js-chip-suggestions');
        var _id = _wrapper.dataset.inputTarget;
        var _input = Helper.$('#' + _id);
        var _text = this.innerText.trim();

        if (!_input || !Helper.nodeExists(_input))
        {
            throw new Error('Target node does not exist.');

            return false;
        }

        // Chips input
        if (Helper.hasClass(_input, 'js-chips-input'))
        {
            Container.ChipInputs().addChip(_text, _input);

            Helper.removeFromDOM(this);

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

        Helper.removeFromDOM(this);
    }

    // Load into Hubble DOM core
    Container.get('Hubble').dom().register('ChipSuggestions', ChipSuggestions);


}());

/**
 * Choice chips
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
     * @constructor
     * @access public
     */
    var ChoiceChips = function()
    {
        this._chips = Helper.$All('.js-choice-chips .chip');

        this._bind();

        return this;
    }

    /**
     * Module destructor remove event handlers
     *
     * @access public
     */
    ChoiceChips.prototype.destruct = function()
    {
        this._unbind();

        this._chips = [];
    }

    /**
     * Bind DOM listeners
     *
     * @access private
     */
    ChoiceChips.prototype._bind = function()
    {
        Helper.addEventListener(this._chips, 'click', this._clickHandler);
    }

    /**
     * Unbind DOM listeners
     *
     * @access private
     */
    ChoiceChips.prototype._unbind = function()
    {
        Helper.removeEventListener(this._chips, 'click', this._clickHandler);
    }

    /**
     * Handle click event on chip
     *
     * @access private
     * @param  event|null e
     */
    ChoiceChips.prototype._clickHandler = function(e)
    {
        e = e || window.event;

        var _wrapper = Helper.closest(this, '.js-choice-chips');
        var _input = Helper.$('.js-choice-input', _wrapper);

        if (!Helper.hasClass(this, 'selected'))
        {
            Helper.removeClass(Helper.$('.chip.selected', _wrapper), 'selected');

            Helper.addClass(this, 'selected');

            if (_input)
            {
                _input.value = this.dataset.value;

                Container.Events().fire('Chips:selected', [this.dataset.value, !Helper.hasClass(this, 'selected')]);
            }
        }
    }

    // Load into Hubble DOM core
    Container.get('Hubble').dom().register('ChoiceChips', ChoiceChips);

}());

/**
 * Filter chips
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
     * @constructor
     * @access public
     */
    var FilterChips = function()
    {
        this._chips = Helper.$All('.js-filter-chips .chip');

        this._bind();

        return this;
    }

    /**
     * Module destructor remove event handlers
     *
     * @access public
     */
    FilterChips.prototype.destruct = function()
    {
        this._unbind();

        this._chips = [];
    }

    /**
     * Bind DOM listeners
     *
     * @access private
     */
    FilterChips.prototype._bind = function()
    {
        Helper.addEventListener(this._chips, 'click', this._clickHandler);
    }

    /**
     * Unbind DOM listeners
     *
     * @access private
     */
    FilterChips.prototype._unbind = function()
    {
        Helper.removeEventListener(this._chips, 'click', this._clickHandler);
    }

    /**
     * Handle click event on chip
     *
     * @access private
     * @param  event|null e
     */
    FilterChips.prototype._clickHandler = function(e)
    {
        e = e || window.event;

        Container.Events().fire('Chips:selected', [this.dataset.value, !Helper.hasClass(this, 'checked')]);

        Helper.toggleClass(this, 'checked');
    }

    // Load into Hubble DOM core
    Container.get('Hubble').dom().register('FilterChips', FilterChips);

}());

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
        Helper.addEventListener(this._containers, 'click', this._eventHandler);
    }

    /**
     * Event ubinder - Binds all event handlers on button click
     *
     * @access private
     */
    ClickTriggers.prototype._unbind = function()
    {
        Helper.removeEventListener(this._containers, 'click', this._eventHandler);
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

/**
 * Image zoom hover
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
     * @constructor
     * @access public
     */
    var ImageZoom = function()
    {
        this._nodes = Helper.$All('.js-img-hover-zoom');

        this._bind();

        return this;
    }

    /**
     * Module destructor remove event handlers
     *
     * @access public
     */
    ImageZoom.prototype.destruct = function()
    {
        this._unbind();

        this._nodes = [];
    }

    /**
     * Bind DOM listeners
     *
     * @access public
     */
    ImageZoom.prototype._bind = function()
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
     * @access public
     */
    ImageZoom.prototype._unbind = function()
    {
        Helper.removeEventListener(this._nodes, 'mousemove', this._onHover);
    }

    /**
     * On hover event
     *
     * @param  e event|null "mousemove" event
     * @access private
     */
    ImageZoom.prototype._onHover = function(e)
    {
        e = e || window.event;

        if (!e || !e.currentTarget)
        {
            return false;
        }

        var _wrapper = e.currentTarget;
        var _zoomSrc = Helper.parse_url(Helper.getStyle(_wrapper, 'background-image').replace('url(', '').replace(')', ''));
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

    // Register as DOM Module and invoke
    Container.get('Hubble').dom().register('ImageZoom', ImageZoom);

}());


// Boot Hubble
/**
 * Boot and initialize Hubble core
 *
 * @author    Joe J. Howard
 * @copyright Joe J. Howard
 * @license   https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE
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

