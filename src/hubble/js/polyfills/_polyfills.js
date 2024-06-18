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
