/**
 * --------------------------------------------------------------------------
 * frontbx.esm.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

// Core
// polyfills
// polyfills
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


// container
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

// Utils
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

// Empty object
const EMPTY_OBJ_KEYS = Object.getOwnPropertyNames(Object.getPrototypeOf({}));
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
// Current clone map (stops recursive cloning between array/objects)

/**
 * Default options.
 * 
 * @var {object}
 */
const ANIMATION_DEFAULT_OPTIONS =
{
    // Options
    //'property', 'from', 'to', 'callback', 'complete', 'start', 'fail'
    easing:               'ease',
    duration:              500,
    fps:                   60, // (16ms)
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
 * Currently animating animations.
 * 
 * @var {array}
 */
const ANIMATING = [];


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
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',

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
 * Array of HTML events
 *
 * @var {array}
 */
const DOC_EVENTS = Object.getOwnPropertyNames(document).concat(Object.getOwnPropertyNames(Object.getPrototypeOf(Object.getPrototypeOf(document)))).concat(Object.getOwnPropertyNames(Object.getPrototypeOf(window))).filter(function(i){return !i.indexOf('on')&&(document[i]==null||typeof document[i]=='function');}).filter(function(elem, pos, self){return self.indexOf(elem) == pos;}).map((x) => x.replace('on', '').toLowerCase());
/**
 * Boolean attributes
 *
 * @var {array}
 */
const BOOLEAN_ATTRS = 
[
	'allowfullscreen',
	'async',
	'autofocus',
	'autoplay',
	'checked',
	'controls',
	'default',
	'defer',
	'disabled',
	'formnovalidate',
	'inert',
	'ismap',
	'itemscope',
	'loop',
	'multiple',
	'muted',
	'nomodule',
	'novalidate',
	'open',
	'playsinline',
	'readonly',
	'required',
	'reversed',
	'selected'
];

/**
 * Property attributes
 *
 * @var {array}
 */
const PROP_ATTRIBUTES = ['href', 'list', 'form', 'tabIndex', 'download'];

(function()
{
    var _THIS = null;

    const _ = function()
    {
        this.version = "1.0.0";

        this.author = "Joe Howard";

        this.browser = false;

        this._events = {};

        this._guid = 1;

        _THIS = this;
    }

    _.prototype._guidgen = function()
    {
        return `__${this._guid++}`;
    }
const AnimateJS = function(DOMElement, options)
{
    this.DOMElement = DOMElement;

    this.options = options;

    this.keyframes = [];

    this.currentKeyframe = 0;

    this.duration = options.duration;

    this.intervalDelay = Math.floor(1000 / options.fps);

    this.keyFrameCount = Math.floor(this.duration / this.intervalDelay) + 1;

    this.easing = options.easing;

    this.CSSProperty = options.property;

    this.isTransform = this.CSSProperty.toLowerCase().includes('transform');

    this.isScroll = this.CSSProperty.toLowerCase().replace('-', '') === 'scrollto' && DOMElement === window;

    this.isColor = options.property.includes('color') || options.to.startsWith('#') || options.to.startsWith('rgb');

    this.clearAnimating(DOMElement);

    this.parseOptions();

    this.generateKeyframes();

    this.stopped = true;

    return this;
}

AnimateJS.prototype.clearAnimating = function(DOMElement)
{
    const CSSprop = this.CSSProperty;

    _THIS.each(ANIMATING, function(i, animation)
    {
        if (animation.CSSProperty === CSSprop && animation.DOMElement === DOMElement)
        {
            animation.stop();

            ANIMATING.splice(i, 1);

            return false;
        }
    });
}

AnimateJS.prototype.start = function()
{
    if (this.keyFrameCount === 0) return;

    this.stopped = false;

    if (!this.isScroll) this.clearTransitions();

    if (this.options.start) this.options.start(this.DOMElement);

    const loop = () =>
    {        
        if (this.stopped) return;

        this._applyKeyframe(this.keyframes.shift());

        if (this.keyframes.length === 0)
        {            
            this._complete();

            return;
        }

        setTimeout(loop, this.intervalDelay);
    }

    loop();

    this._failTimer = setTimeout(() =>
    {            
        if (this.options.fail) this.options.fail(this.DOMElement);

    }, this.duration + 50 );

    ANIMATING.push(this);

    return this;
}

AnimateJS.prototype._applyKeyframe = function(keyframe)
{
    if (!keyframe) return;

    let prop = Object.keys(keyframe)[0];

    this.isScroll ? window.scrollTo(keyframe[0], keyframe[1]) : _THIS.css(this.DOMElement, prop, keyframe[prop]);
}

AnimateJS.prototype._complete = function()
{
    clearTimeout(this._failTimer);

    _THIS.each(ANIMATING, (i, animation) =>
    {
        if (animation === this)
        {
            ANIMATING.splice(i, 1);

            return false;
        }
    });

    let DOMElement = this.DOMElement;

    if (this.options.complete) this.options.complete(DOMElement);

    if (this.options.callback) this.options.callback(DOMElement);

    if (!this.isScroll) _THIS.css(DOMElement, 'transition', this._pre_transition );
}

AnimateJS.prototype.stop = function()
{
    this.stopped = true;

    clearTimeout(this._failTimer);

    return this;
}

AnimateJS.prototype.parseOptions = function()
{
    if (this.isScroll)
    {
        this.parseScrollOptions();
    }
    else if (this.isTransform)
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

AnimateJS.prototype.parseScrollOptions = function()
{
    if (!this.options.to.includes(','))
    {
        throw new Error('Invalid scroll value. Animating scroll should be provided as [Y, X].');
    }

    // We ignore 'from'
    let startY = window.scrollY;
    let startX = window.scrollX;
    let endX   = parseInt(this.options.to.split(',').shift().trim());
    let endY   = parseInt(this.options.to.split(',').pop().trim());
    let distX  = Math.abs(endX < startX ? (startX - endX) : (endX - startX))
    let distY  = Math.abs(endY < startY ? (startY - endY) : (endY - startY))

    this.startValue    = [startX, startY];
    this.endValue      = [endX, endY];
    this.backAnimation = [endX < startX, endY < startY];
    this.distance      = [distX, distY] ;
    this.CSSunits      = '';
}

AnimateJS.prototype.parseDefaultOptions = function()
{
    var startVal = _THIS.is_undefined(this.options.from) ? _THIS.rendered_style(this.DOMElement, this.CSSProperty) : this.options.from;
    var endVal   = this.options.to;

    // We need to set the end value, then remove it and re-apply any inline styles if they
    // existed
    if (endVal === 'auto' || endVal === 'initial' || endVal === 'unset')
    {
        let prevStyle = _THIS.inline_style(this.DOMElement, this.CSSProperty);

        _THIS.css(this.DOMElement, this.CSSProperty, endVal);
        
        endVal = _THIS.rendered_style(this.DOMElement, this.CSSProperty);
        
        _THIS.css(this.DOMElement, this.CSSProperty, prevStyle ? prevStyle : false);
    }

    // From auto
    if (startVal === 'auto' || startVal === 'initial')
    {
        startVal = _THIS.rendered_style(this.DOMElement, this.CSSProperty);
    }

    var startUnit = _THIS.css_value_unit(startVal);
    var endUnit   = _THIS.css_value_unit(endVal);

    if (startUnit !== endUnit && this.CSSProperty !== 'opacity')
    {
        if (startUnit !== 'px')
        {
            startVal  = _THIS.css_to_px(startVal + startUnit, this.DOMElement, this.CSSProperty);
            startUnit = 'px';
        }
        if (endUnit !== 'px')
        {
            endVal  = _THIS.css_to_px(this.options.to, this.DOMElement, this.CSSProperty);
            endUnit = 'px';
        }
    }

    startVal = _THIS.css_unit_value(startVal);
    endVal   = _THIS.css_unit_value(endVal);

    this.startValue    = _THIS.css_unit_value(startVal);
    this.endValue      = _THIS.css_unit_value(endVal);
    this.backAnimation = endVal < startVal;
    this.distance      = Math.abs(endVal < startVal ? (startVal - endVal) : (endVal - startVal));
    this.CSSunits      = endUnit;
}

AnimateJS.prototype.parseTransformOptions = function()
{
    var DOMElement    = this.DOMElement;
    var startValues   = _THIS.css_transform_props(DOMElement, false);
    var endValues     = _THIS.css_transform_props(this.options.to, false);

    // If a start value was specified it gets overwritten as the transform
    // property is singular
    if (this.options.from)
    {
        startValues = _THIS.css_transform_props(this.options.from);
    }

    this.CSSProperty    = [];
    this.startValue     = [];
    this.endValue       = [];
    this.CSSunits       = [];
    this.backAnimation  = [];
    this.distance       = [];
    this.baseTransforms = _THIS.is_empty(startValues) ? '' : _THIS.join_obj(_THIS.map(startValues, (prop, val) => !endValues[prop] ? val : false), '(', ') ', false, false);

    _THIS.each(endValues, function(propAxis, valueStr)
    {
        var startValStr        = !startValues[propAxis] ? (propAxis.includes('scale') ? '1' : '0') : startValues[propAxis];
        var startVal           = _THIS.css_unit_value(startValStr);
        var endVal             = _THIS.css_unit_value(valueStr);
        var startUnit          = _THIS.css_value_unit(startValStr);
        var endUnit            = _THIS.css_value_unit(valueStr);
        var CSSpropertyUnits   = endUnit;

        if (startUnit !== endUnit)
        {
            // 0 no need to convert
            if (_THIS.is_empty(startUnit))
            {
                startUnit = endUnit;
            }
            else
            {
                if (startUnit !== 'px') startVal = _THIS.css_to_px(startVal + startUnit, DOMElement, propAxis.includes('Y') ? 'height' : 'width');
                if (endUnit !== 'px') endVal = _THIS.css_to_px(endVal + endUnit, DOMElement, propAxis.includes('Y') ? 'height' : 'width');
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
    this.startValue = this.sanitizeColor(this.options.from || _THIS.rendered_style(this.DOMElement, this.CSSProperty));
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
    if (_THIS.is_equal(this.startValue, this.endValue))
    {
        this.keyFrameCount = 0;

        return;
    }

    if (this.isScroll)
    {
        _THIS.for(this.keyFrameCount, function(index)
        {
            let x = this.generateKeyframe(index, 0);
            let y = this.generateKeyframe(index, 1);

            this.keyframes.push([x, y]);
                            
        }, this);

        // Fallback
        this.keyframes.push([this.endValue[0], this.endValue[1]]);

        return;
    }

    if (this.isTransform)
    {
        _THIS.for(this.endValue, function(transformIndex)
        {
            _THIS.for(this.keyFrameCount, function(index)
            {
                this.keyframes.push(this.generateKeyframe(index, transformIndex));
                
            }, this);
            
        }, this);

        return;
    }

    _THIS.for(this.keyFrameCount, function(index)
    {
        this.keyframes.push(this.generateKeyframe(index));
        
    }, this);

    // Failsafe
    if (this.keyframes[this.keyFrameCount -1][this.CSSProperty] !== `${this.endValue}${this.CSSunits}`)
    {
        this.keyframes.push({[this.CSSProperty]: `${this.endValue}${this.CSSunits}`});
    }
}

AnimateJS.prototype.generateKeyframe = function(index, transformIndex)
{
    if (this.isColor)
    {
        const change = this.tween(this.easing, (index / this.keyFrameCount));
        
        return { [this.CSSProperty]: this.mixColors(this.startValue, this.endValue, change) };
    }
    
    const backAnimation = this.isTransform || this.isScroll ? this.backAnimation[transformIndex] : this.backAnimation;

    const startValue = this.isTransform || this.isScroll ? this.startValue[transformIndex] : this.startValue;

    const distance = this.isTransform || this.isScroll ? this.distance[transformIndex] : this.distance;

    const change = (distance * this.tween(this.easing, (index / this.keyFrameCount)));

    const keyVal = this.roundNumber(backAnimation ? startValue - change : startValue + change, this.CSSProperty === 'opacity' ? 5 : 1);

    var property = this.isTransform ? 'transform' : this.CSSProperty;

    var prefix  = this.isTransform ? `${this.CSSProperty[transformIndex]}(` : '';

    var suffix  = this.isTransform ? `${this.CSSunits[transformIndex]})` : this.CSSunits;
    
    var keyframe = { [property]:  `${prefix}${keyVal}${suffix}` };
    
    if (this.isScroll)
    {
        return keyVal;
    }

    if (this.isTransform && _THIS.is_undefined(this.keyframes[index]))
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
    var transitions    = _THIS.css_transition_props(this.DOMElement);
    var css_transition = _THIS.inline_style(this.DOMElement, 'transition'); 

    if (_THIS.is_empty(transitions) || !transitions[CSSProperty]) return;

    transitions[CSSProperty] = '0s linear 0s';

    _THIS.css(this.DOMElement, 'transition', _THIS.join_obj(transitions, ' ', ', '));

    this._pre_transition = !css_transition ? false : css_transition;
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

_.prototype.__animate_js = function(DOMElement, options)
{
    return (new AnimateJS(DOMElement, options)).start();
}
const AnimateCss = function(DOMElement, options)
{     
    // Domeleement   
    this.DOMElement = DOMElement;

    // Options
    this.options = options;

    // Props to animate
    this.animatedProps = {};

    // Pre animation transitions to restore
    this.preAnimatedTransitions = {};

    // Cache stopvalues
    this.stopValues = {};

    // Fail timer
    this._failTimer = null;
    
    // Max duration
    this.duration  = 0;
    
    // Callbacks
    this._callbackStart    = () => {};
    this._callbackComplete = () => {};
    this._callbackFail     = () => {};
    this._callbackStep     = () => {};

    this.preProcessStartEndValues();

    return this;
};

/**
 * Start animation.
 *
 */
AnimateCss.prototype.start = function()
{
    this._callbackStart(this.DOMElement);

    this.applyStartValues();

    this.applyTransitions();

    _THIS.add_event_listener(this.DOMElement, 'transitionend', this.transitionEnd, this);

    let _this = this;

    this._failTimer = setTimeout(() =>
    {
        _this._callbackFail(_this.DOMElement);

        _this.stop();

    }, this.duration + 50 );

    this._stepTimer = setInterval(() => this._callbackStep(), 16);

    this.applyEndValues();

    return this;
}

/**
 * Stop animation.
 *
 */
AnimateCss.prototype.stop = function()
{
    clearTimeout(this._failTimer);

    clearInterval(this._stepTimer);

    this.resotoreElement();

    _THIS.css(this.DOMElement, this.stopValues);
}

/**
 * Stop animation and destroy.
 *
 */
AnimateCss.prototype.destory = function()
{
    this.stop();

    this.animatedProps = {};

    this.preAnimatedTransitions = {};
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
AnimateCss.prototype.resotoreElement = function()
{
    _THIS.css(this.DOMElement, 'transition', this.preAnimatedTransitions);

    _THIS.remove_event_listener(this.DOMElement, 'transitionend', this.transitionEnd, this);
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
AnimateCss.prototype.transitionEnd = function(e)
{
    e = e || window.event;

    let prop = _THIS.css_prop_to_hyphen_case(e.propertyName);

    // Convert to shorthand if needed
    if (prop.includes('-'))
    {
        let shorthand = prop.split('-').shift();

        if (this.animatedProps[shorthand]) prop = shorthand;
    }

    let endVal = this.animatedProps[prop];

    // Change inline style back to auto
    if (endVal === 'auto' || endVal === 'initial' || endVal === 'unset') _THIS.css(this.DOMElement, prop, endVal);

    delete this.animatedProps[prop];
    
    if (_THIS.is_empty(this.animatedProps))
    {        
        clearTimeout(this._failTimer);

        clearInterval(this._stepTimer);

        this.resotoreElement();

        this._callbackComplete(this.DOMElement);
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
    _THIS.each(this.options, function(i, option)
    {
        // Cache start and fail callbacks
        if (option.start) this._callbackStart = option.start;
        if (option.fail) this._callbackFail = option.fail;
        if (option.step) this._callbackStep = option.step;

        // Keep the longest callback
        if (option.duration >= this.duration && (option.callback || option.complete))
        {
            this._callbackComplete = (option.callback || option.complete);
        }

        // Store the maximum duration
        if (option.duration >= this.duration) this.duration = option.duration;

        let startValue  = option.from;
        let endValue    = option.to;
        let CSSProperty = option.property;
        
        if (startValue === 'auto' || startValue === 'initial' || startValue === 'unset' || !startValue)
        {
            option.from = _THIS.rendered_style(DOMElement, CSSProperty);
        }

        if (endValue === 'auto' || endValue === 'initial' || endValue === 'unset')
        {
            let inlineStyle = _THIS.inline_style(DOMElement, CSSProperty);

            _THIS.css(DOMElement, CSSProperty, endValue);

            option.to = _THIS.rendered_style(DOMElement, CSSProperty);

            _THIS.css(DOMElement, CSSProperty, inlineStyle ? inlineStyle : false);
        }

        this.animatedProps[CSSProperty] = endValue;

        this.stopValues[CSSProperty] = _THIS.inline_style(DOMElement, CSSProperty) || false;

    }, this);
}

/**
 * Apply start values.
 * 
 */
AnimateCss.prototype.applyStartValues = function()
{
    var styles = {};

    _THIS.each(this.options, function(i, option)
    {
        styles[option.property] = option.from;
    });

    if (!_THIS.is_empty(styles)) _THIS.css(this.DOMElement, styles);
}

/**
 * Apply animation transitions.
 * 
 */
AnimateCss.prototype.applyTransitions = function()
{
    let transitions = _THIS.css_transition_props(this.DOMElement);

    this.preAnimatedTransitions  = _THIS.inline_style(this.DOMElement, 'transition') || false;

    _THIS.each(this.options, function(i, option)
    {
        // Setup and convert duration from MS to seconds
        let property = option.property;
        let duration = (option.duration / 1000);
        let easing   = CSS_EASINGS[option.easing] || 'ease';

        // Set the transition for the property
        // in our merged obj
        transitions[property] = `${duration}s ${easing}`;

    }, this);

    _THIS.css(this.DOMElement, 'transition', _THIS.join_obj(transitions, ' ', ', '));
}

/**
 * Apply animation end values.
 * 
 */
AnimateCss.prototype.applyEndValues = function()
{
    let styles = {};

    _THIS.each(this.options, function(i, option)
    {
        styles[option.property] = option.to;

    }, this);

    _THIS.css(this.DOMElement, styles);
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
_.prototype.__animate_css = function(DOMElement, options)
{    
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
_.prototype.animate = function(DOMElement, options)
{    
    const animationSet = [];

    const Animation = function()
    {
        return this;
    };

    Animation.prototype.start = function()
    {
        for (var i = 0; i < animationSet.length; i++)
        {
            animationSet[i].start();
        }
    };

    Animation.prototype.stop = function()
    {
        for (var i = 0; i < animationSet.length; i++)
        {
            animationSet[i].stop(true);
        }
    };

    Animation.prototype.destory = function()
    {
        for (var i = 0; i < animationSet.length; i++)
        {
            animationSet[i].destory();
        }

        animationSet = [];
    };

    const factoryOptions = !options.FROM_FACTORY ? this.__animation_factory(DOMElement, options) : options;

    const AnimationInstance = new Animation;

    this.each(factoryOptions, function(i, opts)
    {
        animationSet.push(this.__animate_js(DOMElement, opts));

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
_.prototype.animate_css = function(DOMElement, options)
{
    let cssAnimation;

    const Animation = function()
    {
        return this;
    };

    Animation.prototype.start = function()
    {
        cssAnimation.start();
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
_.prototype.__animation_factory = function(DOMElement, opts)
{
    var optionSets = [];

    this.each(opts, function(key, val)
    {
        // animation_factory('foo', { property : 'left', from : '-300px', to: '0',  easing: 'easeInOutElastic', duration: 3000} );
        if (key === 'property')
        {
            var options = { ...ANIMATION_DEFAULT_OPTIONS, ...opts};

            options.FROM_FACTORY = true;
            options.property     = this.css_prop_to_hyphen_case(val);
            options.el           = DOMElement;
            optionSets.push(options);

            // break
            return false;
        }
        else if (!this.in_array(key, ANIMATION_ALLOWED_OPTIONS))
        {
            // Only worth adding if the property is valid
            var camelProp = this.css_prop_to_camel_case(key);
            
            if (!this.is_undefined(document.body.style[camelProp]))
            {
                var isObjSet = this.is_object(val);
                var toMerge  = isObjSet ? val : opts;
                var options  = { ...ANIMATION_DEFAULT_OPTIONS, ...toMerge};
                
                // animation_factory('foo', { height: '100px', opacity: 0 } );
                if (!isObjSet)
                {
                    options.to = val;
                }

                // animation_factory('foo', { height: { from: '100px', to: '500px', easing: 'easeInOutElastic'}, opacity:{ to: 0, easing: 'linear'} } );
                options.FROM_FACTORY = true;
                options.property     = this.css_prop_to_hyphen_case(key);
                options.el           = DOMElement;
                optionSets.push(options);
            }
        }
    }, this);

    // Santize callbacks
    let longest  = 0;
    let longestI = 0;
    let start    = () => {};
    let fail     = () => {};
    let complete = () => {};
    let step     = () => {};

    this.each(optionSets, function(i, options)
    {
        if (options.start)
        {
            start = options.start;

            delete options.start;
        }

        if (options.fail)
        {
            fail = options.fail;

            delete options.fail;
        }

        if (options.step)
        {
            step = options.step;

            delete options.step;
        }

        // Store the maximum duration
        if (options.duration >= longest)
        {
            if ((options.callback || options.complete)) complete = (options.callback || options.complete);

            delete options.callback;

            delete options.complete;

            longest = options.duration;

            longestI = i;
        }

        // Not nessaray, but sanitize out redundant options
        options = this.map(options, function(key, val)
        {
            return this.in_array(key, ANIMATION_FILTER_OPTIONS) ? val : false;

        }, this);

        // Sanitize to/from to strings
        if (this.array_has('to', options)) options.to = options.to + '';
        if (this.array_has('from', options)) options.from = options.from + '';

        if (!ANIMATION_EASING_FUNCTIONS[options.easing]) options.easing = 'ease';

        options.FROM_FACTORY = true;

        optionSets[i] = options;

    }, this);

    if (this.is_empty(optionSets))
    {
        console.error('Animation Error: Either no CSS property(s) was provided or the provided property(s) is unsupported.');
    }

    optionSets[longestI].fail     = fail;
    optionSets[longestI].start    = start;
    optionSets[longestI].complete = complete;
    optionSets[longestI].step     = step;

    return optionSets;
}
/**
 * Recursively delete from array/object.
 *
 * @param   {array}        keys    Keys in search order
 * @param   {object|array} object  Object to get from
 * @returns {mixed}
 */
_.prototype.__array_delete_recursive = function(keys, object)
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

    return this.__array_delete_recursive(keys, object[key]);
}

/**
 * Recursively search from array/object.
 *
 * @param   {array}        keys    Keys in search order
 * @param   {object|array} object  Object to get from
 * @returns {mixed}
 */
_.prototype.__array_get_recursive = function(keys, object)
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

    return this.__array_get_recursive(keys, object[key]);
}

/**
 * Recursively set array/object.
 *
 * @param {array}          keys     Keys in search order
 * @param {mixed}          value    Value to set
 * @param {object|array}   object   Object to get from
 * @param {string|number}  nextKey  Next key to set
 */
_.prototype.__array_set_recursive = function(keys, value, object, nextKey)
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

    this.__array_set_recursive(keys, value, object, key);
}

/**
 * Segments an array/object path using from "dot.notation" into an array of keys in order.
 *
 * @param   {string}  path Path to parse
 * @returns {array}
 */
_.prototype.__array_key_segment = function(path)
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
_.prototype.__array_delete_recursive = function(keys, object)
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

    return this.__array_delete_recursive(keys, object[key]);
}
/**
 * Deletes from an array/object using dot/bracket notation.
 *
 * @param   {string}        path   Path to delete
 * @param   {object|array}  object Object to delete from
 * @returns {object|array}
 */
_.prototype.array_delete = function(path, object)
{
    this.__array_delete_recursive(this.__array_key_segment(path), object);

    return object;
}
/**
 * Filters empty array entries and returns new array
 *
 * @param   {object|array}  object Object to delete from
 * @returns {object|array}
 */
_.prototype.array_filter = function(arr)
{
    let isArr = this.is_array(arr);

    let ret = isArr ? [] : {};

    this.each(arr, function(i, val)
    {
        if (!this.is_empty(val))
        {
            isArr ? ret.push(val) : ret[i] = val;
        }
        
    }, this);

    return ret;
}
/**
 * Gets an from an array/object using dot/bracket notation.
 *
 * @param   {string}        path    Path to get
 * @param   {object|array}  object  Object to get from
 * @returns {mixed}
 */
_.prototype.array_get = function(path, object)
{
    return this.__array_get_recursive(this.__array_key_segment(path), object);
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
_.prototype.array_has = function(path, object)
{
    return !this.is_undefined(this.array_get(path, object));
}
/**
 * Merges multiple objects or arrays into the original.
 *
 * @param   {object|array} First array then any number of array or objects to merge into
 * @returns {object|array}
 */
_.prototype.array_merge = function()
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
_.prototype.array_set = function(path, value, object)
{
    this.__array_set_recursive(this.__array_key_segment(path), value, object);

    return object;
}
/**
 * Removes duplicates and returns new array.
 *
 * @param   {array} arr Array to run
 * @returns {array}
 */
_.prototype.array_unique = function(arr)
{
    return arr.filter((value, index, self) => self.indexOf(value) === index);
}
/**
 * Checks if element is last element in array or object.
 *
 * @access {public}
 * @param  {string} needle    The value to search for
 * @param  {array}  haystack  The target array to index
 * @param  {bool}   strict    Strict comparison (optional) (default false)
 * @return {bool}
 * 
 */
_.prototype.is_array_last = function(needle, haystack, strict)
{
    strict = this.is_undefined(strict) ? false : strict;

    let last = TO_STR.call(haystack) === '[object Array]' ? haystack[haystack.length -1] : haystack[Object.keys(haystack).pop()];
    
    return this.is_equal(needle, last, strict);
}
/**
 * Foreach loop
 * 
 * @access {public}
 * @param  {object}  obj       The target object to loop over
 * @param  {closure} callback  Callback to apply to each iteration
 * @param  {array}   args      Array of params to apply to callback (optional) (default null)
 */
_.prototype.each = function(obj, callback)
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

_.prototype.foreach = function()
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
_.prototype.for = function(count, callback)
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
_.prototype.in_array = function(needle, haystack, strict)
{
    strict = this.is_undefined(strict) ? false : strict;
    
    if (!strict) return haystack.includes(needle);

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
_.prototype.map = function(obj, callback)
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
_.prototype.attr = function(DOMElement, name, value)
{        
    // Get attribute
    // e.g attr(node, style)
    if ((TO_ARR.call(arguments)).length === 2 && this.is_string(name))
    {
        return this.__get_attribute(DOMElement, name);
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

    // Set or remove attibute.
    switch (name)
    {
        // innerHTML
        case 'innerHTML':
            DOMElement.innerHTML = !value ? '' : value;
            break;

        // innerText
        case 'innerText':
            DOMElement.innerText = !value ? '' : value;
            break;

        // Children
        case 'children':

            this.each(DOMElement.children, function(node)
            {
                this.remove_from_dom(node);
            
            }, this);

            this.each(value, function(node)
            {
                DOMElement.appendChild(node);
            });

            break;

        // Class
        case 'class':
        case 'className':

            // Cleanup classname
            value = this.is_string(value) ? this.replace(value, ['undefined', 'null', 'false', 'true'], '').replace(/\s\s+/g, ' ').trim() : value;

            if (this.is_empty(value))
            {
                DOMElement.removeAttribute('class');
            }
            else
            {
                DOMElement.className = value;
            }

            break;

        // Style
        case 'style':

            // remove all styles completely
            if (this.is_empty(value))
            {
                DOMElement.removeAttribute('style');
            }

            DOMElement.style = '';

            let style = this.is_string(value) ? this.css_to_object(value) : value;

            this.each(style, (prop, value) => this.css(DOMElement, prop, value));
           
            break;

        // Events / attributes
        default:

            // Events
            if (name[0] === 'o' && name[1] === 'n')
            {
                var evt = name.slice(2).toLowerCase();

                // Remove old listeners
                this.remove_event_listener(DOMElement, evt);

                // Add new listener if one provided
                if (value)
                {
                    this.add_event_listener(DOMElement, evt, value);
                }
            }
            // All other node attributes
            else
            {
                let isData     = name.startsWith('data');
                let isAria     = name.startsWith('aria');
                let camelName  = name.includes('-') ? this.to_camel_case(name) : name;
                let hyphenName = name.includes('-') ? name : this.camel_case_to_hyphen(name);
                let isEmpty    = this.is_empty(value);

                // Special data
                if (isData)
                {
                    if (isEmpty)
                    {
                        DOMElement.removeAttribute(hyphenName);

                        delete DOMElement.dataset[this.lc_first(this.ltrim(camelName, 'data'))];
                    }
                    else
                    {
                        DOMElement.setAttribute(hyphenName, value);

                        DOMElement.dataset[this.lc_first(this.ltrim(camelName, 'data'))] = value;
                    }

                    break;
                }

                // Special booleans
                if (this.in_array(name, BOOLEAN_ATTRS))
                {
                    DOMElement[name] = isEmpty ? '' : value;

                    if (isEmpty) DOMElement.removeAttribute(name);

                    break;
                }

                if (!PROP_ATTRIBUTES.includes(camelName))
                {
                    try
                    {                        
                        DOMElement[camelName] = isEmpty ? '' : value;

                    } catch (e) {}
                }

                if (isEmpty)
                {
                    DOMElement.removeAttribute(hyphenName);
                }
                else
                {
                    DOMElement.setAttribute(hyphenName, value);
                }
            }

            break;
    }
}

/**
 * Simple get html attribute.
 *
 * No third arg returns attribute value, third arg set to null or false removes attribute.
 * 
 * @access {private}
 * @param  {HTMLElement}      DOMElement  Dom node
 * @param  {string}           name        Property name
 * @return {string|undefined}
 */
_.prototype.__get_attribute = function(DOMElement, name)
{
    if (name.startsWith('data'))
    {
        name = name.startsWith('data-') ? this.to_camel_case(name.substring(5)) : name.substring(4);

        return DOMElement.dataset[name];
    }

    // Special booleans
    if (this.in_array(name, BOOLEAN_ATTRS))
    {
        if (DOMElement[name] === '' || DOMElement[name] === 'true' || DOMElement[name] === true) return true;

        return DOMElement[name] === 'false' || !DOMElement[name] ? false : true;
    }

    let camelName  = name.includes('-') ? this.to_camel_case(name) : name;
    let hyphenName = name.includes('-') ? name : this.camel_case_to_hyphen(name);
    let retCamel   = DOMElement[camelName];
    let retAttr    = DOMElement.getAttribute(hyphenName);

    return retAttr === null || this.is_undefined(retAttr) ? retCamel : retAttr;
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
_.prototype.css = function(el, property, value)
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
            if (value.includes('important') || property.startsWith('--'))
            {
                let styles = el.getAttribute('style');

                if (styles && styles.includes(property))
                {
                    let re = new RegExp(`${property}\s?:[^;]+;?`, 'g');

                    styles = styles.replace(re, '').trim();
                }
                
                styles = !styles ? `${property}:${value}` : `${this.rtrim(styles, ';')};${property}:${value}`;

                el.setAttribute('style', styles);

                return;
            }
            else
            {
                el.style[property] = value;    
            }
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
_.prototype.css_prop_to_camel_case = function(prop)
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
_.prototype.css_prop_to_hyphen_case = function(prop)
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
_.prototype.css_to_longhand = function(css)
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
 * Note if values are not provide not all browsers will except initial
 * for all properties in shorthand syntax
 * 
 * @access {private}
 * @param  {string}  CSS rules
 * @return {object}
 */
_.prototype.css_to_shorthand = function(css)
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
_.prototype.css_to_object = function(styles)
{
    var ret = {};

    const nested_regex = /([^\{]+\{)([\s\S]+?\})(\s*\})/g;

    const css_regex = /([^{]+\s*\{\s*)([^}]+)(\s*\}\s*)/g;

    if (styles.includes('{'))
    {
        var nestedStyles = [...css.matchAll(nested_regex)];
    }

    this.each(styles.split(/;(?=(?:[^"]*"[^"]*")*[^"]*$)/g), function(i, rule)
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
_.prototype.css_unit_value = function(value)
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
_.prototype.css_value_unit = function(value)
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
_.prototype.css_to_px = function(valueStr, DOMElement, property)
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
_.prototype.inline_style = function(element, prop)
{
    const elementStyle = element.style;

    prop = this.css_prop_to_hyphen_case(prop);

    if (prop.startsWith('--'))
    {
        return window.getComputedStyle(element).getPropertyValue(prop);
    }
    else if (Object.hasOwn(elementStyle, prop))
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
_.prototype.remove_style = function(el, prop)
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
_.prototype.rendered_style = function(DOMElement, property)
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
_.prototype.__computed_style = function(DOMElement, property)
{
    if (window.getComputedStyle)
    {
        let styles = window.getComputedStyle(DOMElement, null);

        if (property && property.startsWith('--')) return styles.getPropertyValue(property);

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
_.prototype.css_transition_props = function(DOMElement)
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
_.prototype.css_transform_props = function(DOMElement, returnAsString)
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
    if (!emptys.includes(inline))
    {
        return returnAsString ? inline : this.__un_css_matrix(inline, false);
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
_.prototype.__un_css_matrix = function(DOMElement, returnAsString)
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
_.prototype.css_to_3d_transform = function(transformsStr)
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
_.prototype.add_class = function(DOMElement, className)
{    
    if (this.is_array(DOMElement))
    {
        this.each(DOMElement, (i, _DOMElement) =>  this.add_class(_DOMElement, className));

        return this;
    }

    if (this.is_array(className))
    {
        this.each(className, (i, _className) =>  this.add_class(DOMElement, _className));
    
        return this;
    }

    if (className.includes(','))
    {
        this.each(this.array_filter(className.split(',')), (i, _className) => this.add_class(DOMElement, _className));
    
        return this;
    }

    if (className.includes('.'))
    {
        this.each(this.array_filter(className.split('.')), (i, _className) => this.add_class(DOMElement, _className));
    
        return this;
    }

    className = className.trim();

    if (className[0] === '.') className = className.slice(1);

    DOMElement.classList.add(className);

    return this;
}
/**
 * Closest parent node by type/class or array of either
 *
 * @access {public}
 * @param  {DOMElement}   el   Target element
 * @param  {string} type Node type to find
 * @return {node\null}
 */
_.prototype.closest = function(el, type)
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

    // Type is class
    if (this.is_htmlElement(type))
    {
        if (el === type) return true;
        
        let ret = false;

        this.traverse_up(el, (parent) =>
        {
            if (parent === type)
            {
                ret = true;

                return true;
            }
        });

        return ret;
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
_.prototype.closest_class = function(el, clas)
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
_.prototype.coordinates = function(DOMElement)
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
_.prototype.first_children = function(el)
{
    return this.$All('> *', el);
}
/**
 * Get all input elements from a form
 *
 * @access {public}
 * @param  {DOMElement}   form Target element
 * @return {array}
 */
_.prototype.form_inputs = function(form)
{
    return this.$All('input, textarea, select', form);
}
/**
 * Get an array of name/value objects for all inputs in a form
 *
 * @access {public}
 * @param  {DOMElement}   form Target element
 * @return {array}
 */
_.prototype.form_values = function(form)
{
    var inputs = this.form_inputs(form);
    var ret    = {};
    
    this.each(inputs, function(i, input)
    {
        let name = input.name;

        if (input.type === 'radio')
        {
            if (this.attr(input, 'checked')) ret[name] = this.input_value(input);
        }
        else if (input.type === 'checkbox')
        {
            ret[name] = this.attr(input, 'checked');
        }
        else
        {
            ret[name] = this.input_value(input);
        }
        if (name.includes('[]'))
        {
            if (!ret[name] || !this.is_array(ret[name]))
            {
                ret[name] = [];
            }

            ret[name].push(this.input_value(input));
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
_.prototype.has_class = function(DOMElement, className)
{
    let ret = false;

    if (this.is_array(className))
    {
        this.each(className, (i, _className) => { if (this.has_class(DOMElement, _className)) ret = true; return false; });
        
        return ret;
    }

    if (className.includes(','))
    {
        this.each(this.array_filter(className.split(',')), (i, _className) => { if (this.has_class(DOMElement, _className)) ret = true; return false; });
    
        return ret;
    }

    if (className.includes('.'))
    {
        let count = className.split('.').length;

        if (count >= 3)
        {
            this.each(this.array_filter(className.split('.')), (i, _className) => { ret = this.has_class(DOMElement, _className); if (!ret) return false; });

            return ret;
        }
    }

    className = className.trim();

    if (className[0] === '.') className = className.slice(1);

    return DOMElement.classList.contains(className);
}
/**
 * Aria hide an element
 *
 * @access {public}
 * @param  {DOMElement}   HTMLElement Target DOM node
 */
_.prototype.hide_aria = function(HTMLElement)
{
    if (this.is_array(HTMLElement)) return this.each(HTMLElement, (i, el) => this.hide_aria(el));
    
    this.attr(HTMLElement, 'aria-hidden', 'true');
}
/**
 * Check if an element is in current viewport
 *
 * @access {public}
 * @param  {DOMElement}   el Target DOM node
 * @return {bool}
 */
_.prototype.in_viewport = function(el)
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
_.prototype.inner_HTML = function(DOMElement, content, append)
{
    content = this.is_array(content) ? content.join("\n") : content;

    if (append)
    {
        DOMElement.innerHTML += content;
    }
    else
    {
        this.clear_event_listeners(DOMElement, true);

        DOMElement.innerHTML = content;
    }

    this.trigger_event(DOMElement, `FrontBx:dom:mutate`);

    this.trigger_event(window, `FrontBx:dom:mutate`, { DOMElement: DOMElement });
}
/**
 * Replaces element's innerText without destroying childnodes
 *
 * @access {public}
 * @param  {DOMElement}   el   Target element
 * @param  {string} text Text to replace
 */
_.prototype.inner_Text = function(el, text)
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
_.prototype.input_value = function(input)
{
    if (input.type == "number" || this.is_numeric(input.value))
    {
        return input.value.includes('.') ? parseInt(input.value) : parseFloat(input.value);
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
 * @param {object} options
 */
_.prototype.dom_element = function(options, appendTo, innerHTMLOrChildren)
{    
    // dom_element(null, wrappper, content);
    if (!options && appendTo && innerHTMLOrChildren)
    {
        this._recursive_dom_element(innerHTMLOrChildren, appendTo);

        return appendTo;
    }

    if (!options.tag) throw new Error('Element tag not provided.');

    let node = document.createElement(options.tag);

    delete options.tag;

    this.attr(node, options);

    if (innerHTMLOrChildren)
    {
        this._recursive_dom_element(innerHTMLOrChildren, node);
    }

    if (appendTo)
    {
        appendTo.appendChild(node);
    }

    return node;
}

_.prototype._recursive_dom_element = function(mixedVar, parent)
{
    if (this.is_htmlElement(mixedVar))
    {
        parent.appendChild(mixedVar);
    }
    else if (this.is_array(mixedVar))
    {
        this.each(this.array_filter(mixedVar), (i, child) =>
        {
            this._recursive_dom_element(child, parent);
        }); 
    }
    else if (this.is_object(mixedVar))
    {
        this.dom_element(mixedVar, node);
    }
    else
    {
        parent.innerHTML += mixedVar;
    }
}


/**
 * Traverse nextSibling untill type or class or array of either
 *
 * @access {public}
 * @param  {DOMElement}   el   Target element
 * @param  {string} type Target node type
 * @return {node\null}
 */
_.prototype.next = function(el, type)
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
_.prototype.next_untill_class = function(el, className)
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
_.prototype.preapend = function(node, wrapper)
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
_.prototype.previous = function(el, type)
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
_.prototype.previous_untill_class = function(el, className)
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
_.prototype.remove_class = function(DOMElement, className)
{
    if (this.is_array(DOMElement))
    {
        this.each(DOMElement, (i, _DOMElement) =>  this.remove_class(_DOMElement, className));

        return this;
    }

    if (this.is_array(className))
    {
        this.each(className, (i, _className) =>  this.remove_class(DOMElement, _className));
    
        return this;
    }

    if (className.includes(','))
    {
        this.each(this.array_filter(className.split(',')), (i, _className) => this.remove_class(DOMElement, _className));
    
        return this;
    }

    if (className.includes('.'))
    {
        this.each(this.array_filter(className.split('.')), (i, _className) => this.remove_class(DOMElement, _className));
    
        return this;
    }

    className = className.trim();

    if (className[0] === '.') className = className.slice(1);

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
_.prototype.remove_from_dom = function(el)
{
    if (this.is_array(el))
    {
        return this.each(el, (i, DOMElement) => this.remove_from_dom(DOMElement));
    }

    if (this.in_dom(el))
    {
        el.parentNode.removeChild(el);

        var children = this.$All('*', el).reverse();

        for (var i = 0, len = children.length; i < len; i++)
        {
            this.remove_event_listener(children[i]);

            this.trigger_event(children[i], `FrontBx:dom:remove`);
        }

        this.remove_event_listener(el);

        this.trigger_event(el, `FrontBx:dom:remove`);

        this.trigger_event(window, `FrontBx:dom:remove`, { DOMElement: el });
    }
}
/**
 * Get the current document scroll position
 *
 * @access {private}
 * @return {obj}
 */
_.prototype.scroll_pos = function(context)
{
    if (context && this.is_htmlElement(context))
    {
        return {
            top: context.scrollTop,
            left: context.scrollLeft
        };
    }

    var doc  = document.documentElement;
    var top  = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
    var left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
    
    return {
        top: top,
        left: left
    };
}
/**
 * Select single node by selector
 *
 * @access {public}
 * @param  {string} selector CSS selector
 * @param  {DOMElement}   context (optional) (default document)
 * @return {DOMElement}
 */
_.prototype.$ = function(selector, context)
{
    context = (typeof context === 'undefined' ? document : context);

    let fchild = selector.trim().substring(0, 1) === '>';
    let multi  = selector.includes(',');

    // Fast
    if (!fchild && !multi) return context.querySelector(selector);

    if (multi) selector = selector.replaceAll(/,\s?>/g, ', :scope >');
    
    if (fchild) selector = `:scope ${selector}`;

    return context.querySelector(selector);
}

/**
 * "$" Alias
 *
 */
_.prototype.find = function(selector, context)
{
    return this.$(selector, context);
}

/**
 * Select and return all nodes by selector
 *
 * @access {public}
 * @param  {string} selector CSS selector
 * @param  {DOMElement}   context (optional) (default document)
 * @return {DOMElement}
 */
_.prototype.$All = function(selector, context, includeContextEl)
{
    context = (typeof context === 'undefined' ? document : context);

    includeContextEl = (typeof includeContextEl === 'undefined' ? false : includeContextEl && context !== document);

    let fchild = selector.trim().substring(0, 1) === '>';
    let multi  = selector.includes(',');
    let deleteParent = false;

    if (includeContextEl)
    {
        if (!hasParent)
        {
            parent = document.createElement('div');
            parent.appendChild(context);
            deleteParent = true;
        }

        context = context.parentNode;
    }

    if (multi)  selector = selector.replaceAll(/,\s?>/g, ', :scope >');
    if (fchild) selector = `:scope ${selector}`;

    let ret = TO_ARR.call(context.querySelectorAll(selector));

    if (deleteParent) context.parentNode.removeChild(context);

    return ret;
}

/**
 * "$All" Alias
 *
 */
_.prototype.find_all = function(selector, context)
{
    return this.$All(selector, context);
}
/**
 * Aria show an element
 *
 * @access {public}
 * @param  {DOMElement}   el Target DOM node
 */
_.prototype.show_aria = function(HTMLElement)
{
    if (this.is_array(HTMLElement)) return this.each(HTMLElement, (i, el) => this.show_aria(el));

    this.attr(HTMLElement, 'aria-hidden', 'false');
}

/**
 * Toogle a classname
 *
 * @access {public}
 * @param  {DOMElement}         el         Target element
 * @param  {string}       className  Class name to toggle
 */
_.prototype.toggle_class = function(DOMElement, className)
{    
    if (this.has_class(DOMElement, className))
    {
        this.remove_class(DOMElement, className);
    }
    else
    {
        this.add_class(DOMElement, className);
    }
}
/**
 * Triggers an event on an element
 *
 * @access {public}
 * @param  {DOMElement}   DOMElement   Target element
 * @param  {string}       eventName    Event name
 * @param  {mixed}        data         Extra data to pass to custom events 
 */
_.prototype.trigger_event = function(DOMElement, eventName, data)
{
    if (this.in_array(eventName.toLowerCase(), DOC_EVENTS))
    {
        if ('createEvent' in document)
        {
            var evt = document.createEvent('HTMLEvents');

            evt.initEvent(eventName, false, true);

            DOMElement.dispatchEvent(evt);
        }
        else
        {
            DOMElement.fireEvent(eventName);
        }
    }
    else
    {
        // Actual object
        if (!this.is_constructed(data) && this.is_object(data))
        {
            data = { ...{ DOMElement: DOMElement, name: eventName }, ...data};
        }
        else
        {
            data = { DOMElement: DOMElement, name: eventName, state: data };
        }

        const event = new CustomEvent(eventName, { detail: data });

        DOMElement.dispatchEvent(event);

        if (eventName.includes(':'))
        {
            var events = eventName.split(':').slice(0, -1);
            var base   = events.shift();
            var count  = events.length + 1;

            this.for(count, function(i)
            {
                let subevent = i === (count -1) ? base : `${base}:${events.join(':')}`;

                data.name = eventName;

                const evt = new CustomEvent(subevent, { detail: data });

                DOMElement.dispatchEvent(evt);

                events.pop();
            });
        }
    }
}
/**
 * Closest parent node by type/class or array of either
 *
 * @access {public}
 * @param  {DOMElement}   el   Target element
 * @param  {string} type Node type to find
 * @return {node\null}
 */
_.prototype.traverse_up = function(DOMElement, callback, origional)
{    
    origional = typeof origional === "undefined" ? DOMElement : origional;

    // Stop on document
    if (DOMElement === document || typeof DOMElement === "undefined" || DOMElement === null) return;

    if (callback(DOMElement))
    {
        return origional;
    }

    var parent = DOMElement.parentNode;

    return this.traverse_up(parent, callback, origional);
}

_.prototype.traverse_down = function(DOMElement, callback)
{
}

_.prototype.traverse_next = function(DOMElement, callback)
{
}

_.prototype.traverse_prev = function(DOMElement, callback)
{
}

/**
 * Get an element's actual width in px
 *
 * @access {public}
 * @param  {DOMElement}   DOMElement Target element
 * @return {object}
 */
_.prototype.width = function(DOMElement)
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
_.prototype.height = function(DOMElement)
{
    if (DOMElement === window || DOMElement === document || DOMElement === document.documentElement) return Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

    return this.css_unit_value(this.rendered_style(DOMElement, 'height'));
}
/**
 * Returns nth child
 *
 * @access {public}
 * @param  {DOMElement}   el   Target element
 * @return {node\null}
 */
_.prototype.nth_child = function(el, n)
{
    let children = this.first_children(el);

    if (children[n]) return children[n];
}
/**
 * Returns nth position from siblings
 *
 * @access {public}
 * @param  {DOMElement}   el   Target element
 * @return {node\null}
 */
_.prototype.nth_siblings = function(DOMElement)
{
    let children = this.first_children(DOMElement.parentNode);

    for (var i = 0; i < children.length; i++)
    {
        if (children[i] === DOMElement) return i;
    }

    return 0;
}
/**
 * Add an event listener
 *
 * @access {public}
 * @param  {DOMElement}    element    The target DOM node
 * @param  {string}        eventName  Event type
 * @param  {closure}       handler    Callback event
 * @param  {array}         args       Args to pass to handler (first array element gets set to "this")
 * @param  {boolean}       pushfirst  If boolean (true) is provided, pushes callback to first in stack (default false)
 */
_.prototype.on = function()
{
    return this.add_event_listener(...arguments);
}

/**
 * Add an event listener
 *
 * @access {public}
 * @param  {DOMElement}    element    The target DOM node
 * @param  {string}        eventName  Event type
 * @param  {closure}       handler    Callback event
 * @param  {array}         args       Args to pass to handler (first array element gets set to "this")
 * @param  {boolean}       pushfirst  If boolean (true) is provided, pushes callback to first in stack (default false)
 */
_.prototype.add_event_listener = function(DOMElement, eventName, handler)
{    
    var args = TO_ARR.call(arguments);

    // Multiple elements
    if (this.is_array(DOMElement))
    {
        var baseArgs = args.slice(1);

        this.each(DOMElement, function(i, el)
        {            
            this.add_event_listener.apply(this, [el, ...baseArgs]);

        }, this);
    }
    else
    {
        // If event has a comma or is an array we're doing multiple events
        if (this.is_array(eventName) || eventName.includes(','))
        {
            let eventsArr = this.is_array(eventName) ? eventName : eventName.split(',').map((x) => x.trim()).filter((x) => x !== '');

            this.each(eventsArr, function(i, event)
            {
                args[1] = event;

                this.add_event_listener.apply(this, args);
                
            }, this);

            return;
        }

        // If array of arguments is provided, "this" will always be the first
        // argument provided
        // However the first and second argument passed to the callback will always the event object and the element
        // e.g. add_event_listener(el, 'click', callback, ['baz', 'foo', 'bar']) -> callback(e, el, foo, bar) this = 'baz'

        // Remove element, eventName, handler from args
        let argsNormal = this.__normaliseListenerArgs(DOMElement, args);

        this.__addListener(DOMElement, eventName, handler, argsNormal.thisArg, argsNormal.args, argsNormal.pushFirst);
    }
}

/**
 * Nomralize event listener args
 * 
 * @param  {DOMElement}    DOMElement   The target DOM node
 * @param  {array}         args         Args passed to add_event_listener or remove_event_listener
 */
_.prototype.__normaliseListenerArgs = function(DOMElement, args)
{
    // Remove DOMElement, eventName, handler
    args = args.slice(3);

    // Default "this" to the dom element
    let thisArg   = DOMElement;
    let pushFirst = false;

    // Push first
    if (!this.is_empty(args))
    {
        thisArg   = args.shift();
        pushFirst = this.bool(args.shift());
    }

    return {args, thisArg, pushFirst};
}

/**
 * Adds a listener to the element
 *
 * @access {private}
 * @param  {DOMElement}    element    The target DOM node
 * @param  {string}  eventName  Event type
 * @param  {closure} handler    Callback event
 * @param  {bool}    data Use capture (optional) (defaul false)
 */
_.prototype.__addListener = function(element, eventName, callback, thisArg, args, pushFirst)
{
    // Apply GUID to element and callback
    element.guid = element.guid || (element.guid = this._guidgen());
    callback.guid    = callback.guid || (callback.guid = this._guidgen());

    let hasHandler = true;
    let guid       = element.guid;

    // Make sure an array for event type exists
    if (!this._events[guid])
    {
        hasHandler = false;

        this._events[guid] = {};
    }

    if (!this._events[guid][eventName])
    {
        hasHandler = false;

        this._events[guid][eventName] = [];
    }

    // Push the details to the events object
    const handlerObj = {callback, thisArg, args, element};
    
    pushFirst ? this._events[guid][eventName].unshift(handlerObj) : this._events[guid][eventName].push(handlerObj);

    if (!hasHandler)
    {
        element.addEventListener(eventName, this.__event_dispatcher);
    }
}

/**
 * Event dispatcher
 *
 * @access {private}
 * @param  {eventObject}  e  
 */
_.prototype.__event_dispatcher = function(e)
{
    e = e || window.event;

    let DOMElement = this;

    let guid = DOMElement.guid;

    if (!guid) return;

    let callbacks =  _THIS._events[guid][e.type] || [];

    _THIS.each(callbacks, (i, handler) =>
    {        
        if (handler)
        {
            let handled = handler.callback.apply(handler.thisArg, [e, DOMElement, ...handler.args]);

            if (handled === false || handled === null)
            {
                e.preventDefault();

                e.stopPropagation();

                if (handled === null) return false;
            }
        }
    });
}

/**
 * Removes all event listeners registered by the library
 *
 * @access {public}
 */
_.prototype.clear_event_listeners = function(DOMElement, onlyChildren)
{
    DOMElement = this.is_undefined(DOMElement) ? document : DOMElement;

    onlyChildren = this.is_undefined(onlyChildren) ? false : onlyChildren;

    if (DOMElement !== document)
    {
        let children = this.find_all('*', DOMElement).reverse();

        this.each(children, (i, child) => this.off(child));

        if (!onlyChildren) this.off(DOMElement);
        
        return;
    }

    var events = this._events;

    let _this = this;

    _this.each(this._events, (guid, types) =>
    {
        _this.each(types, (type, callbacks) =>
        {
            let DOMElement = callbacks[0].element;
            
            _this.__remove_listener(DOMElement, type);
        });
    });

    this._events = {};



}
/**
 * Removes all event listeners registered by the library on nodes
 * that are no longer part of the DOM tree
 *
 * @access {public}
 */
_.prototype.collect_garbage = function()
{
    let _this = this;

    _this.each(this._events, (guid, types) =>
    {
        var cleared = false;

        _this.each(types, (type, callbacks) =>
        {
            let DOMElement = callbacks[0].element;

            if (!this.in_dom(DOMElement))
            {
                cleared = true;

                _this.__remove_listener(DOMElement, type);
            }
        });

        if (cleared) delete this._events[guid];
    });
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
_.prototype.event_listeners = function(DOMElement, eventName)
{
    var args = TO_ARR.call(arguments);
    var ret  = [];

    // No args, return all events
    if (args.length === 0)
    {
        this.each(this._events, function(guid, types)
        {
            this.each(types, function(type, callbacks)
            {
                let summary = callbacks.map( (details) => ({ el: details.element, callback: details.callback, type: type }) );

                ret = [...ret, ...summary];
            });

        }, this);

        return ret;
    }
    
    // eventListeners(node) or
    // eventListeners('click')
    else if (args.length === 1)
    {
        // eventListeners('click')
        if (this.is_string(DOMElement))
        {   
            this.each(this._events, function(guid, types)
            {
                this.each(types, function(type, callbacks)
                {
                    if (type === DOMElement)
                    {
                        let summary = callbacks.map( (details) => ({ el: details.element, callback: details.callback, type: type }) );

                        ret = [...ret, ...summary];
                    }
                });

            }, this);

            return ret;
        }
        
        // eventListeners(node)
        let guid = DOMElement.guid;

        if (!guid || !this._events[guid]) return ret;

        this.each(this._events[guid], function(type, callbacks)
        {
            let summary = callbacks.map( (details) => ({ el: details.element, callback: details.callback, type: type }) );

            ret = [...ret, ...summary];

        }, this);

        return ret;
    }

    // eventListeners(node)
    let guid = DOMElement.guid;

    if (!guid || !this._events[guid] || !this._events[guid][eventName]) return ret;

    this.each(this._events[guid][eventName], function(i, details)
    {
        ret.push({ el: details.element, callback: details.callback, type: eventName });

    }, this);

    return ret;
}
/**
 * Add an event listener
 *
 * @access {public}
 * @param  {DOMElement}    element    The target DOM node
 * @param  {string}        eventName  Event type
 * @param  {closure}       handler    Callback event
 * @param  {array}         args       Args to pass to handler (first array element gets set to "this")
 * @param  {boolean}       pushfirst  If boolean (true) is provided, pushes callback to first in stack (default false)
 */
_.prototype.off = function()
{
    return this.remove_event_listener(...arguments);
}

/**
 * Remove an event listener
 *
 * @access {public}
 * @param  {DOMElement}    element    The target DOM node
 * @param  {string}        eventName  Event type
 * @param  {closure}       handler    Callback event
 * @param  {array}         args       Args to pass to handler (first array element gets set to "this")
 * @param  {boolean}       pushfirst  If boolean (true) is provided, pushes callback to first in stack (default false)
 */
_.prototype.remove_event_listener = function(DOMElement, eventName, handler)
{
    var args = TO_ARR.call(arguments);

    if (this.is_array(DOMElement))
    {
        var baseArgs = args.slice(1);

        this.each(DOMElement, function(i, el)
        {            
            this.remove_event_listener.apply(this, [el, ...baseArgs]);
        
        }, this);
    }
    else
    {
        // If the eventName name was not provided - remove all event handlers on element
        if (!eventName)
        {
            return this.__remove_element_listeners(DOMElement);
        }

        // If event has a comma or is an array we're doing multiple events
        if (this.is_array(eventName) || eventName.includes(','))
        {
            let eventsArr = this.is_array(eventName) ? eventName : eventName.split(',').map((x) => x.trim()).filter((x) => x !== '');

            this.each(eventsArr, function(i, event)
            {
                args[1] = event;

                this.remove_event_listener.apply(this, args);
                
            }, this);

            return;
        }

        // If the callback was not provided - remove all events of the type on the element
        if (!handler)
        {
            return this.__remove_element_type_listeners(DOMElement, eventName);
        }
        
        let guid = DOMElement.guid;

        // Nothing to remove
        if (!guid) return;

        let handlers = this.array_get(`${guid}.${eventName}`, this._events);

        // Nothing to remove
        if (!handlers) return;

        // Loop stored events and match node, event name, handler, use capture
        this.each(handlers, function(i, _handler)
        {            
            if (_handler.callback.guid === handler.guid || this.is_equal(_handler.callback, handler))
            {
                this._events[guid][eventName].splice(i, 1);

                if (this.is_empty(this._events[guid][eventName]))
                {
                    delete this._events[guid][eventName];

                    this.__remove_listener(DOMElement, eventName);
                }

                if (this.is_empty(this._events[guid]))
                {
                    delete this._events[guid];
                }
                
                // Break only remove first
                return false;
            } 
        
        }, this);
    }
}

/**
 * Removes all registered event listeners on an element
 *
 * @access {private}
 * @param  {DOMElement} DOMElement Target node element
 */
_.prototype.__remove_element_listeners = function(DOMElement)
{
    let guid = DOMElement.guid;

    if (!guid) return;

    if (this._events[guid])
    {
        this.each(this._events[guid], function(type, callbacks)
        {
            this.__remove_listener(DOMElement, type);
            
        }, this);
    }

    delete this._events[guid];
}

/**
 * Removes all registered event listeners of a specific type on an element
 *
 * @access {private}
 * @param  {DOMElement} DOMElement Target node element
 * @param  {string}     type       Event listener type
 */
_.prototype.__remove_element_type_listeners = function(DOMElement, type)
{
    let guid = DOMElement.guid;

    if (!guid) return;

    // Make sure an array for event type exists
    if (this._events[guid] && this._events[guid][type])
    {
        delete this._events[guid][type];

        this.__remove_listener(DOMElement, type);

        if (this.is_empty(this._events[guid]))
        {
            delete this._events[guid];
        }
    }
}

/**
 * Removes a listener from the element
 *
 * @access {private}
 * @param  {DOMElement} DOMElement The target DOM node
 * @param  {string}     eventType  Event type
 * @param  {closure}    handler    Callback event
 * @param  {bool}       useCapture Use capture (optional) (defaul false)
 */
_.prototype.__remove_listener = function(DOMElement, eventType)
{    
    DOMElement.removeEventListener(eventType, this.__event_dispatcher);
}

/**
 * Is this a mobile user agent?
 *
 * @return {bool}
 */
_.prototype.is_retina = function()
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
_.prototype.parse_url = function(str)
{
    var ret = {};
    var url = new URL(str);

    if (url.search)
    {
        var queries = url.search.substring(1).split('&');
        var qret    = {};
        
        this.each(queries, function(i, query)
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
_.prototype.url_query = function(name)
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
 * Normalises a url
 *
 * @access {public}
 * @param  {string}  url The url to normalise
 * @return {string}
 */
_.prototype.normalize_url = function(url)
{
    // Remove www.
    if (url.startsWith('www.') || url.includes('//www.')) url = url.replace('www.', '');

    // Back dirs
    if (url.startsWith('../'))
    {
        let paths = this.parse_url(this.trim(window.location.href, '/')).pathname.split('/');

        if (!this.is_empty(paths))
        {
            // Remove file
            if (paths.slice(-1).includes('.')) paths.pop();

            let backs = url.split('../').length;

            this.for(backs, () => paths.pop());

            url = '/' + this.trim(`${paths.join('/')}/${url.replace(/\.\.\//g, '')}`, '/');
        }
    }

    // Local
    if (url[0] === '/') url = window.location.origin + url;

    // Add protocol
    if (!url.startsWith('https') && !url.startsWith('http')) url = `${window.location.protocol}//${url}`;

    return url;
}
/**
 * Clones any variables
 * 
 * @param   {mixed}  mixed_var
 * @param   {mixed}  context   Context to bind functions
 * @returns {mixed}
 */
_.prototype.clone_deep = function(mixed_var, context)
{
    return this.__clone_var(mixed_var, this.is_undefined(context) ? mixed_var : context);
}

/**
 * Clone's variable with context.
 * 
 * @param   {mixed}  mixed_var  Variable to clone
 * @param   {mixed}  context    Context when cloning recursive objects and arrays.
 * @returns {mixed}
 */
_.prototype.__clone_var = function(mixed_var, context)
{
    let tag = this.var_type(mixed_var);

    switch (tag)
    {
        case OBJECT_TAG:
            return this.__clone_obj(mixed_var, context);

        case ARRAY_TAG:
        case NODELST_TAG:
        case ARGS_TAG:
            return this.__clone_array(mixed_var, context);

        case FUNC_TAG:
            return this.__clone_func(mixed_var, context);

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
            return this.__clone_RegExp(mixed_var, context);

        case SYMBOL_TAG:
            return this.__clone_symbol(mixed_var);

        case DATE_TAG:
            return this.__clone_date(mixed_var);

        case SET_TAG:
            return this.__clone_set(mixed_var, context);

        case MAP_TAG:
            return this.__clone_map(mixed_var, context);

        case ARRAY_BUFFER_TAG:
            return this.__clone_array_buffer(mixed_var);

        case DATAVIEW_TAG:
            return this.__clone_data_view(mixed_var);

        case ARRAY_BUFFER_TAG:
            return this.__clone_buffer(mixed_var);

        case FLOAT32_TAG:
        case FLOAT64_TAG:
        case INT8_TAG:
        case INT16_TAG:
        case INT32_TAG:
        case UINT8_TAG:
        case UINT8CLAMPED_TAG:
        case UINT16_TAG:
        case UINT32_TAG:
            return this.__clone_typed_array(object);

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
_.prototype.__clone_obj = function(obj, context)
{
    // Shallow keys
    let keys = this.object_props(obj);
    let ret  = {};

    // Empty object
    if (keys.length === 0 || this.is_empty(obj))
    {
        return ret;
    }

    this.each(keys, function(i, key)
    {
        ret[key] = this.clone_deep(obj[key], context);

    }, this);

    // Clone prototypes
    let protos = this.prototypes(obj);

    if (protos.length >= 1)
    {
        let curr = ret;

        while(protos.length > 0)
        {
            let proto        = protos.shift();
            let clone        = this.clone_deep(proto, context);
            clone.constrctor = this.clone_deep(proto.constructor, context);
            
            Object.setPrototypeOf(curr, clone);
            
            curr = clone;
        }
    }

    return ret;
}

/**
 * Clones a function
 * 
 * @param   {function}  function
 * @param   {mixed}     context   Context to bind function
 * @returns {function}
 */
_.prototype.__clone_func = function(func, context)
{
    return this.bind(func, context);
}

/**
 * Clones an array
 * 
 * @param   {array}  arr
 * @returns {array}
 */
_.prototype.__clone_array = function(arr, context)
{
    let ret = [];

    this.each(arr, function(i, val)
    {
        ret[i] = this.clone_deep(val, context);
    
    }, this);

    return ret;
}

_.prototype.__clone_date = function(d)
{
    let r = new Date();

    r.setTime(d.getTime());

    return r;
}

_.prototype.__clone_symbol = function(symbol)
{
    return Object(Symbol.prototype.valueOf.call(symbol));
}

_.prototype.__clone_RegExp = function(regexp)
{
    let reFlags = /\w*$/;

    let result = new regexp.constructor(regexp.source, reFlags.exec(regexp));

    result.lastIndex = regexp.lastIndex;

    return result;
}

_.prototype.__clone_map = function(m, context)
{
    const ret = new Map();

    m.this.each((v, k) =>
    {
        ret.set(k, this.clone_deep(v, context));
    
    }, this);

    return ret;
}

_.prototype.__clone_set = function(s, context)
{
    const ret = new Set();

    s.this.each((val, k) =>
    {
        ret.add(k, this.clone_deep(v, context));
    
    }, this);

    return ret;
}

_.prototype.__clone_array_buffer = function(arrayBuffer)
{
    const result = new arrayBuffer.constructor(arrayBuffer.byteLength)

    new Uint8Array(result).set(new Uint8Array(arrayBuffer));

    return result;
}

_.prototype.__clone_data_view = function(dataView)
{
    const buffer = this.__clone_array_buffer(dataView.buffer);

    return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}

/**
 * Creates a clone of `buffer`.
 *
 * @param   {Buffer}   buffer   The buffer to clone.
 * @param   {boolean} [isDeep]  Specify a deep clone.
 * @returns {Buffer}   Returns  the cloned buffer.
 */
_.prototype.__clone_buffer = function(buffer)
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
_.prototype.__clone_typed_array = function(typedArray)
{
    const buffer = this.__clone_array_buffer(typedArray.buffer);

    return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

/**
 * Binds a function so that it can be identified.
 * 
 * @param   {function}  func    Function to bind
 * @param   {mixed}     context Context to bind "this"
 * @returns {function}
 */
_.prototype.bind = function(func, context)
{
    context = typeof context === 'undefined' ? window : context;

    const bound = function()
    {
        return func.apply(context, arguments);
    }

    Object.defineProperty(bound, 'name', { value: func.name });

    bound.__isBound      = true;
    bound.__boundContext = context;
    bound.__origional    = func;

    return bound;
}
/**
 * Creates a new object in 'dot.notation'
 * 
 * @param   {Object} obj Object
 * @returns {Object} 
 */
_.prototype.dotify = function(obj)
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
 * @param   {function}           superType    Base function to extend
 * @param   {function}           subType  Function to get extended.
 * @param   {undefined|boolean}  callSuper   If true "subType" is treated as a constructor and the superType / any nested prototypes will get instantiated. (default true)
 * @returns {function}
 */
_.prototype.extend = function(base, extension)
{
    const _this = this;

    function proxySuper(superFn, fn)
    {
        return function()
        {
            var tmp = this.super;
            
            this.super = superFn;
            
            var ret = fn.apply(this, arguments);
            
            this.super = tmp;

            return ret;
        }
    }

    function Class() {}

    Class.extend = function(protoProps)
    {
        var parent = this, _super = parent.prototype, child;

        if (protoProps && protoProps.hasOwnProperty('constructor'))
        {
            child = proxySuper(parent, protoProps.constructor);
            
            delete protoProps.constructor; // remove constructor
        }
        else
        {
            child = function()
            {
                parent.apply(this, arguments);
            };
        }

        var prototype = Object.create(parent.prototype,
        {
            constructor:
            {
                value: child,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });

        for (var name in protoProps)
        {
            prototype[name] = _this.is_function(protoProps[name]) && _this.is_function(_super[name]) && /\bsuper\b/.test(protoProps[name])
            ? proxySuper(_super[name], protoProps[name]) : protoProps[name];
        }

        child.prototype = prototype;
        child.extend = Class.extend;

        return child;
    };

    if (this.var_type(base) !== this.var_type(extension)) throw new Error('Extended variables need to be the same type.');

    if (this.is_object(base)) return this.extend_obj(base, extension);

    const baseProto   = base.prototype;
    const extendProto = extension.prototype;

    if (!baseProto.hasOwnProperty('constructor')) baseProto['constructor'] = base;
   
    if (!extendProto.hasOwnProperty('constructor')) extendProto['constructor'] = extension;
    
    var b = Class.extend(baseProto);

    var e = b.extend(extendProto);

    Object.defineProperty(e, 'name', { value: extension.name, writable: false });

    return e;
}

/**
 * Extends a function with prototype inheritance.
 *
 * @param   {function}           superType    Base function to extend
 * @param   {function}           subType  Function to get extended.
 * @param   {undefined|boolean}  callSuper   If true "subType" is treated as a constructor and the superType / any nested prototypes will get instantiated. (default true)
 * @returns {function}
 */
_.prototype.extend_obj = function(base, extension)
{
    const extProto  = this.prototypes(extension);
    const baseProto = this.prototypes(base);

    // Plain objects
    if (this.is_empty(extProto) && this.is_empty(baseProto)) return {...base, ...extension};

    const newProto = new (function() {});
    
    Object.setPrototypeOf(newProto, base);

    this.each(extProto, (i, proto) =>
    {
        this.each(proto, (k, v) =>
        {
            newProto[k] = v;
        })

    }, this);

    Object.defineProperty(newProto, 'name', { value: 'Class', writable: false });

    Object.setPrototypeOf(extension, newProto);

    return extension;
}


/**
 * Joins an object into a string
 * 
 * @param   {Object} obj       Object
 * @param   {string} seperator Seperator Between key & value
 * @param   {string} glue      Glue between value and next key
 * @returns {string} 
 */
_.prototype.join_obj = function(obj, seperator, glue, recursive, trimLast)
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
_.prototype.merge_deep = function()
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
 * Returns object properties and methods as array of keys.
 * 
 * @param   {mixed}    mixed_var    Variable to test
 * @param   {boolean}  withMethods  Return methods and props (optional) (default "true")
 * @returns {array}
 */
_.prototype.object_props = function(mixed_var, deep)
{
    if (!mixed_var) return [];

    deep = typeof deep === 'undefined' ? false : deep;

    let keys = Object.keys(mixed_var);

    let proto = mixed_var.prototype || Object.getPrototypeOf(mixed_var);

    if (deep)
    {
        keys = [...keys, ...this.object_props(proto, true)];
    }
    
    return this.array_unique(keys);
}


/**
 * Returns an array of prototypes
 * 
 * @param   {mixed}    mixed_var    Variable to test
 * @param   {boolean}  withMethods  Return methods and props (optional) (default "true")
 * @returns {array}
 */
_.prototype.prototypes = function(mixed_var)
{
    let ret = [];

    if (!mixed_var) return ret;

    const _this = this;

    const recursive = function(obj)
    {
        let proto = obj.prototype || Object.getPrototypeOf(obj);

        // No prototype
        if (!proto) return;

        // Prototype is native object
        let protokeys = Object.getOwnPropertyNames(proto);

        if (protokeys.filter(x => !EMPTY_OBJ_KEYS.includes(x)).length === 0) return;

        ret.push(proto);

        recursive(proto);
    }

    recursive(mixed_var);

    return ret;
}


/**
 * Returns object properties and methods as array of keys.
 * 
 * @param   {mixed}    mixed_var    Variable to test
 * @param   {boolean}  withMethods  Return methods and props (optional) (default "true")
 * @returns {array}
 */
_.prototype.flatten_obj = function(obj, deep)
{
    deep = typeof deep === 'undefined' ? false : deep;

    var ret = {};

    this.each(obj, (k,v) => ret[k] = v);
   
    if (deep)
    {
        let proto = mixed_var.prototype || Object.getPrototypeOf(mixed_var);

        ret = {...ret, ...this.flatten_obj(proto, true)};
    }
    
    return ret;
}
_.prototype.camel_case_to_hyphen = function(str)
{
    if (str === str.toLowerCase()) return str;
    
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/\b([A-Z]+)([A-Z])([a-z])/, '$1-$2$3').toLowerCase();
}
/**
 * Json encode
 * 
 * @param  {mixed} str String JSON
 * @return {object|false}
 */
_.prototype.json_decode = function(str)
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
_.prototype.json_encode = function(str)
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
_.prototype.ltrim = function(str, charlist)
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
_.prototype.makeid = function(length)
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
_.prototype.rtrim = function(str, charlist)
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
_.prototype.to_camel_case = function(str)
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
_.prototype.trim = function(str, charlist)
{
    if (!charlist) return str.trim();

    return this.rtrim(this.ltrim(str, charlist), charlist);
}
/* Capatalize first letter */
_.prototype.uc_first = function(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}
/* Capatalize first letter of all words */
_.prototype.ucwords = function(str)
{
    return (str + '').replace(/^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g, function($1)
    {
        return $1.toUpperCase();
    });
}
_.prototype.lc_first = function(string)
{
    return string.charAt(0).toLowerCase() + string.slice(1);
}
/**
 * String replace
 * 
 * @param  {str}           str
 * @return {array|string} charlist (optional)
 */
_.prototype.replace = function(str, charlist, value)
{
    if (this.is_string(charlist) || this.is_regexp(charlist))
    {
        return str.replaceAll(charlist, value)
    }

    this.each(charlist, function(i, char)
    {
        str = str.replaceAll(char, value);

    }, this);

    return str;
}


/**
 * Checks if variable should be considered "true" or "false" using "common sense".
 * 
 * @param   {mixed} mixed_var  Variable to test
 * @returns {boolean}
 */
_.prototype.bool = function(mixed_var)
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
_.prototype.callable_name = function(mixed_var)
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
_.prototype.count = function(mixed_var)
{
    return this.size(mixed_var);
}
/**
 * Checks if HtmlElement is in current DOM
 *
 * @param   {HTMLElement}  element  Element to check
 * @returns {boolean}
 */
_.prototype.in_dom = function(element)
{
    if (element === window || element === document || element === document.body || element === document.documentElement)
    {
        return true;
    }

    if (!this.is_htmlElement(element))
    {
        return false;
    }

    let ret = false;

    this.traverse_up(element, function(node)
    {
        if (node === document.body || node === document.documentElement)
        {
            ret = true;

            return true;
        }

        return false;
    });

    return ret;
}
/**
 * Is args array.
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {boolean}
 */
_.prototype.is_args = function(mixed_var)
{
    return this.var_type(mixed_var) === ARGS_TAG;
}
/**
 * Is array.
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {boolean}
 */
_.prototype.is_array = function(mixed_var, strict)
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
_.prototype.is_bool = function(mixed_var)
{
    return this.var_type(mixed_var) === BOOL_TAG;
}
/**
 * Is Array buffer.
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {boolean}
 */
_.prototype.is_buffer = function(mixed_var)
{
    return this.var_type(mixed_var) === ARRAY_BUFFER_TAG;
}
/**
 * Is variable a function / constructor.
 *
 * @param   {mixed}  mixed_var  Variable to check
 * @returns {boolean}
 */
_.prototype.is_callable = function(mixed_var)
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
_.prototype.is_class = function(mixed_var, classname, strict)
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
_.prototype.is_constructable = function(mixed_var)
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
    return this.object_props(mixed_var, true).length > 0;
}
/**
 * Checks if variable is constructed object function.
 *
 * @param   {mixed}  mixed_var  Variable to evaluate
 * @returns {boolean}
 */
_.prototype.is_constructed = function(mixed_var)
{
    if (typeof mixed_var === 'object' && mixed_var.constructor && typeof mixed_var.constructor === 'function')
    {
        var constr = mixed_var.constructor.toString().trim();
        
        return constr.startsWith('function (') || constr.startsWith('function(') || constr.startsWith('function Object(') || constr.startsWith('class ') ;
    }

    return false;
}
/**
 * Is dataView obj.
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {boolean}
 */
_.prototype.is_dataview = function(mixed_var)
{
    return this.var_type(mixed_var) === DATAVIEW_TAG;
}
/**
 * Is date object.
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {boolean}
 */
_.prototype.is_date = function(mixed_var)
{
    return this.var_type(mixed_var) === DATE_TAG;
}
/**
 * Is empty
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {boolean}
 */
_.prototype.is_empty = function(mixed_var)
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
        if (Object.keys(mixed_var).length > 0) return false;

        if (this.prototypes(mixed_var).length > 0) return false;

        return true;
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
_.prototype.is_equal = function(a, b, strict)
{    
    strict = this.is_undefined(strict) ? false : strict;

    if ((typeof a) !== (typeof b))
    {
        return false;
    }
    else if (this.is_string(a) || this.is_number(a) || this.is_bool(a) || this.is_null(a) || this.is_htmlElement(a))
    {
        return a === b;
    }
    else if (this.is_function(a))
    {        
        return strict ? a === b : this.__is_equal_func(a, b);
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
        
        return this.__is_equal_traverseable(a, b);
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
_.prototype.__is_equal_func = function(a, b)
{
    // Functions have the same name
    if (a.name === b.name)
    {
        // If the functions were bound or cloned by the library they can technically still be equal
        if (a.__isBound)
        {
            if (!b.__isBound) return false;

            if (!this.is_equal(a.__boundContext, b.__boundContext)) return false;
            
            if (!this.is_equal(a.__origional, b.__origional)) return false;
        }

        // Check string
        if (a.toString() !== b.toString()) return false;

        // Prototypes are different
        if (!this.__is_equal_protos(a, b)) return false;

        return true;
    }

    return false;
}

/**
 * Checks if object prototypes are equal
 * 
 * @param   {array} | object}  a
 * @param   {array} | object}  b
 * @returns {boolean}
 */
_.prototype.__is_equal_protos = function(a, b)
{
    // Check the prototypes
    let aProtos = this.prototypes(a);
    let bProtos = this.prototypes(b);

    if (aProtos.length !== bProtos.length) return false;

    if (aProtos.length === 0 && bProtos.length === 0) return true;

    let ret = true;

    this.each(aProtos, (i, proto) =>
    {                
        if (!this.is_equal(proto, bProtos[i]))
        {
            ret = false;

            return false;
        }

    }, this);

    return ret;
}


/**
 * Checks if traversable's are equal
 * 
 * @param   {array} | object}  a
 * @param   {array} | object}  b
 * @returns {boolean}
 */
_.prototype.__is_equal_traverseable = function(a, b)
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

    if (!ret) return false;

    if (this.is_object(a)) return this.__is_equal_protos(a, b);

    return ret;
}

/**
 * Is function.
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {boolean}
 */
_.prototype.is_function = function(mixed_var)
{
    return this.var_type(mixed_var) === FUNC_TAG;
}
/**
 * Checks if variable is HTMLElement.
 *
 * @param   {mixed}  mixed_var  Variable to evaluate
 * @returns {boolean}
 */
_.prototype.is_htmlElement = function(mixed_var)
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
_.prototype.is_json = function(str)
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
_.prototype.is_map = function(mixed_var)
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
_.prototype.is_node_type = function(mixed_var, tag)
{
    return mixed_var.tagName.toUpperCase() === tag.toUpperCase();
}

/**
 * Is nodelist.
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {boolean}
 */
_.prototype.is_nodelist = function(mixed_var)
{
    return this.var_type(mixed_var) === NODELST_TAG;
}
/**
 * Is null.
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {boolean}
 */
_.prototype.is_null = function(mixed_var)
{
    return this.var_type(mixed_var) === NULL_TAG;
}
/**
 * Is number.
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {boolean}
 */
_.prototype.is_number = function(mixed_var)
{
    return !isNaN(mixed_var) && this.var_type(mixed_var) === NUMBER_TAG;
}
/**
 * Is string.
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {boolean}
 */
_.prototype.is_numeric = function(mixed_var)
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
_.prototype.is_object = function(mixed_var)
{
    return mixed_var !== null && this.var_type(mixed_var) === OBJECT_TAG;
}
/**
 * Is regexp.
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {boolean}
 */
_.prototype.is_regexp = function(mixed_var)
{
    return this.var_type(mixed_var) === REGEXP_TAG;
}
/**
 * Is Set.
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {boolean}
 */
_.prototype.is_set = function(mixed_var)
{
    return this.var_type(mixed_var) === SET_TAG;
}
/**
 * Is string.
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {boolean}
 */
_.prototype.is_string = function(mixed_var)
{
    return this.var_type(mixed_var) === STRING_TAG;
}
/**
 * Is Symbol.
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {boolean}
 */
_.prototype.is_symbol = function(mixed_var)
{
    return this.var_type(mixed_var) === SYMBOL_TAG;
}
/**
 * Is undefined.
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {boolean}
 */
_.prototype.is_undefined = function(mixed_var)
{
    return this.var_type(mixed_var) === UNDEF_TAG;
}
/**
 * Returns array/object/string/number size.
 * 
 * @param   {mixed}  mixed_var  Variable to test
 * @returns {number}
 */
_.prototype.size = function(mixed_var)
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
_.prototype.var_type = function(value)
{
    if (value == null)
    {
        return value === undefined ? '[object Undefined]' : '[object Null]'
    }

    return TO_STR.call(value);
}
// Destructor
_.prototype.destruct = function()
{
    this.clear_event_listeners();
}

Container.singleton('_', _);

})();

// frontbx core
(function()
{
    /**
     * Application core
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.comfrontbx/uimaster/LICENSE}
     */
    const Application = function()
    {
        this.version_major = '0';

        this.version_minor = '1';

        this.version_patch = '0';

        this.version = `${this.version_major}.${this.version_minor}.${this.version_patch }`;
    }

    /**
     * Called when the application is first initialized
     *
     * @access {public}
     */
    Application.prototype.boot = function()
    {        
        this.dom().boot();

        this._().trigger_event(window, 'FrontBx:ready', this);
    }

    /**
     * Get the DOM component
     *
     * @access {public}
     * @return {object}
     */
    Application.prototype.dom = function()
    {
        return this.Dom();
    }

    Container._().trigger_event(window, 'FrontBx:loading');

    const app = Container._().extend(Container, new Application);

    window.Container = undefined;

    delete window['Container'];

    // Set global
    window.FrontBx = app;

})();
(function()
{
    /**
     * Utility functions
     *
     * @var {Function}
     */
    const [each, trigger_event, collect_garbage, is_undefined, is_string, is_htmlElement] = FrontBx.import(['each', 'trigger_event', 'collect_garbage', 'is_undefined', 'is_string', 'is_htmlElement']).from('_');

    /**
     * Prefix for container.
     *
     * @var {String}
     */
    const KEYPREFIX = 'HB_DOM:';

    /**
     * DOM Manager
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.comfrontbx/uimaster/LICENSE}
     */
    const Dom = function()
    {
        this._isReady = false;

        this.components = [];
    }

    /**
     * Boot Dom
     *
     * @access {public}
     * @param {string} name   Name of the module
     * @param {object} module Uninvoked module object
     */
    Dom.prototype.boot = function()
    {
        each(this.components, function(i, name)
        {
            this._bindComponent(name, document);

        }, this);

        this._dispatchReady();

        this._isReady = true;
    }

    /**
     * Register a DOM component
     *
     * @access {public}
     * @param {string} name   Name of the module
     * @param {object} module Uninvoked module object
     * @param {bool}   invoke Invoke the module immediately (optional) (default false)
     */
    Dom.prototype.register = function(name, component, invoke)
    {
        invoke = (typeof invoke === 'undefined' ? false : invoke);

        this.components.push(name);

        FrontBx.singleton(this._normaliseKey(name), component);

        if (invoke || this._isReady)
        {
            this._bindComponent(name, document);
        }
    }

    /**
     * Returns a component.
     *
     * @access {public}
     */
    Dom.prototype.component = function(name)
    {
        return FrontBx.get(this._normaliseKey(name));
    }

    /**
     * Returns a component.
     *
     * @access {public}
     */
    Dom.prototype.create = function(name, options, appendTo)
    {
        return this.component(name).create(options, appendTo);
    }

    /**
     * Boot Dom
     *
     * @access {public}
     * @param {string} name   Name of the module
     * @param {object} module Uninvoked module object
     */
    Dom.prototype._dispatchReady = function()
    {
        trigger_event(window, 'FrontBx:dom:ready', {dom: this});
    }

    /**
     * Boot Dom
     *
     * @access {public}
     * @param {string} name   Name of the module
     * @param {object} module Uninvoked module object
     */
    Dom.prototype._dispatchComponent = function(name, event, component, context)
    {
        trigger_event(window, `FrontBx:dom:${event}:${name}`, { component: component, context: context});
    }

    /**
     * Bind a single module
     *
     * @param {string} key Name of module to bind
     * @access {private}
     */
    Dom.prototype._bindComponent = function(name, context, isRefresh)
    {                
        let component = FrontBx.get(this._normaliseKey(name));

        if (this._hasMethod(component, 'construct') && isRefresh)
        {
            component.construct(context);
            
            this._dispatchComponent(name, 'refresh', component, context);
        }

        this._dispatchComponent(name, 'bind', component, context);
    }

    /**
     * Unbind a single module
     *
     * @param  {string}  key Name of module to unbind
     * @access {private}
     */
    Dom.prototype._unbindComponent = function(name, context)
    {            
        let component = FrontBx.get(this._normaliseKey(name));

        if (this._hasMethod(component, 'destruct'))
        {
            component.destruct(context);
        }

        this._dispatchComponent(name, 'unbind', component, context);
    }

    /**
     * Refresh the DOM modiules or a string module
     *
     * @access {public}
     * @param {string} name Name of the module (optional) (default false)
     */
    Dom.prototype.refresh = function(component, context)
    {
        let globalRefresh = false;

        // refresh()
        if (arguments.length === 0)
        {
            component = false;

            context = document;

            globalRefresh = true;
        }
        else
        {
            // refresh(DOMElement)
            if (is_htmlElement(component))
            {
                context  = component;
                
                component = false;

                globalRefresh = true;
            }

            // refresh('module')
            // refresh('module', DOMElement)
            else if (is_string(component))
            {
                context = is_undefined(context) ? document : context;
            }
        }

        each(this.components, function(i, name)
        {
            if (!component || component === name)
            {
                this._unbindComponent(name, context);

                collect_garbage();

                this._bindComponent(name, context, true);
            }
        }, this);

        trigger_event(window, `FrontBx:dom:refresh`, { context: context});

        if (globalRefresh) this._dispatchReady();
    }

    /**
     * Checks if a class object has a method by name
     *
     * @access {private}
     * @param  {mixed}  classObj The object instance or reference
     * @param  {string} method   The name of the method to check for
     * @return {bool}
     */
    Dom.prototype._hasMethod = function(classObj, method)
    {
        return typeof classObj === 'object' && typeof classObj[method] === 'function';
    }

    /**
     * Normalize key
     *
     * @access {public}
     * @param {string} name   Name of the module
     * @param {object} module Uninvoked module object
     */
    Dom.prototype._normaliseKey = function(key)
    {
        return `${KEYPREFIX}${key}`;
    }

    // Load into container and invoke
    FrontBx.singleton('Dom', Dom);
    
})();
(function()
{
    const [find_all, each, closest, is_empty] = FrontBx.import(['find_all','each','closest','is_empty']).from('_');

    /**
     * Component base class
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.comfrontbx/uimaster/LICENSE}
     */
    const Component = function(selector)
    {
        /**
         * Default props.
         *
         * @var {object}
         */
        this.defaultProps = !this.defaultProps ? {} : this.defaultProps;

        /**
         * Selector.
         *
         * @var {string}
         */
        this._selector = selector;

        /**
         * Dom elements
         *
         * @var {array}
         */
        this._DOMElements = [];

        // Init
        if (!is_empty(this._selector)) this.construct(document);

        return this;
    }

    /**
     * Module constructor
     *
     * @access {public}
     */
    Component.prototype.construct = function(context)
    {
        if (is_empty(this._selector)) return;

        let nodes = find_all(this._selector, context, context !== document);

        if (!is_empty(nodes))
        {
            this._DOMElements = [...this._DOMElements, ...nodes];

            each(nodes, (i, node) => this.bind(node), this);
        }
    }

    /**
     * Module destructor
     *
     * @access {public}
     */
    Component.prototype.destruct = function(context)
    {
        if (!context || context === document)
        {
            each(this._DOMElements, (i, node) => this.unbind(node), this);
            
            this._DOMElements = [];

            return;
        }

        const _this = this;

        each(this._DOMElements, function(i, DOMElement)
        {                
            if (closest(DOMElement, context))
            {
                _this.unbind(DOMElement);

                _this._DOMElements.splice(i, 1);
            }
        });
    }

    /**
     * Create DOM elements and bind
     * 
     */
    Component.prototype.create = function(props, appendTo)
    {
        props = !props ? {} : props;

        props = {...this.defaultProps, ...props};

        let node = this.template(props);

        if (appendTo) appendTo.appendChild(node);

        FrontBx.Dom().refresh(node);

        return node;
    }

    /**
     * Template abstract method
     *
     * @access {public}
     */
    Component.prototype.template = function()
    {
        throw new Error('[template] method must be implemented.');
    }


    /**
     * Bind abstract method
     *
     * @access {public}
     */
    Component.prototype.bind = function(context)
    {
        throw new Error('[bind] method must be implemented.');
    }

    /**
     * Unbind abstract method
     *
     * @access {public}
     */
    Component.prototype.unbind = function(context)
    {
        throw new Error('[unbind] method must be implemented.');
    }

    // Register
    FrontBx.set('Component', [Component]);

})();

// lazyload
(function()
{
    /**
     * Lazyload fallback
     * 
     * @var {string}
     */
    var LAZY_FALLBACK_IMAGE = typeof LAZY_FALLBACK_IMAGE === 'undefined' ? "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMiAzMiIgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSJ3aGl0ZSI+CiAgPHBhdGggZD0iTTAgNCBMMCAyOCBMMzIgMjggTDMyIDQgeiBNNCAyNCBMMTAgMTAgTDE1IDE4IEwxOCAxNCBMMjQgMjR6IE0yNSA3IEE0IDQgMCAwIDEgMjUgMTUgQTQgNCAwIDAgMSAyNSA3Ij48L3BhdGg+Cjwvc3ZnPg==" : LAZY_FALLBACK_IMAGE;
    
    /**
     * JS Async Queue
     *
     * @see https://medium.com/@griffinmichl/asynchronous-javascript-queue-920828f6327
     */
    var Queue = function(concurrency)
    {
        this.running     = 0;
        this.concurrency = concurrency;
        this.taskQueue   = [];
        
        return this;
    }

    Queue.prototype.add = function(task)
    {
        if (this.running < this.concurrency)
        {
            this._runTask(task);
        }
        else
        {
            this._enqueueTask(task);
        }
    }

    Queue.prototype.next = function()
    {        
        this.running--;

        if (this.taskQueue.length > 0)
        {
            this._runTask(this.taskQueue.shift());
        }
    }

    Queue.prototype._runTask = function(task)
    {       
        this.running++;

        task(this);
    }

    Queue.prototype._enqueueTask = function(task)
    {
        this.taskQueue.push(task);
    }

    /**
     * Module constructor
     *
     * @access public
     * @constructor
     * @return this
     */
    const LazyLoad = function()
    {
        this._DOMElements = [];

        this.construct(document);       

        return this;
    }

    /**
     * Destroy
     *
     * @access public
     */
    LazyLoad.prototype.construct = function(context)
    {       
        this._queue = new Queue(15);

        let nodes = Array.prototype.slice.call(document.querySelectorAll('.js-lazyload'));

        if (context !== document) nodes.unshift(context);

        if (nodes.length >= 1)
        {
            for (var i = 0; i < nodes.length; i++)
            {
                this.bind(nodes[i]);
            }

            this._DOMElements = [...this._DOMElements, ...nodes];
        }
    }

    /**
     * Destroy
     *
     * @access public
     */
    LazyLoad.prototype.destruct = function(context)
    {       
        if (!context || context === document)
        {            
            this._DOMElements = [];

            return;
        }

        const [each, closest] = FrontBx.import(['each', 'closest']).from('_');

        each(this._DOMElements, function(i, DOMElement)
        {                
            if (closest(DOMElement, context))
            {
                this._DOMElements.splice(i, 1);
            }

        }, this);
    }

    /**
     * Bind and load images
     *
     * @access private
     */
    LazyLoad.prototype.bind = function(node)
    {
        var url = this._getSrc(node);

        if (this._canLoad(node))
        {
            this._loadImage(node, url, this._isImage(node));
        }
    }

    /**
     * Bind and load images
     *
     * @access private
     * @param  node    node    DOM node
     * @param  string  url     The image URL to load
     * @param  bool    isImage Is the node an <img> tag
     */
    LazyLoad.prototype._loadImage = function(node, url, isImage)
    {
        // Placeholder and image are the same
        if (isImage && node.src === url)
        {
            this._markLoaded(node);
        }
        else
        {
            this._queue.add(this._getLoadFunc(node, url, isImage));
        }
    }

    /**
     * Return the image load function
     *
     * @access private
     * @param  node    node       DOM node
     * @param  string  url        The image URL to load
     * @param  bool    isImage    Is the node an <img> tag?
     * @return function
     */
    LazyLoad.prototype._getLoadFunc = function(node, url, isImage)
    {
        const _this = this;

        return function loadImage(queue)
        {
            var _image = new Image();

            _image.onload = function()
            {
                if (isImage)
                {
                    node.src = url;
                }
                else
                {
                    node.style.backgroundImage = 'url('+ url +')';
                }

                _this._markLoaded(node);

                _image.onload  = {};
                _image.onerror = {};
                
                queue.next();
            };

            _image.onerror = function()
            {
                if (isImage)
                {
                    node.src = LAZY_FALLBACK_IMAGE;
                }
                else
                {
                    node.style.backgroundImage = 'url('+ LAZY_FALLBACK_IMAGE +')';
                }

                _this._markFailed(node);

                queue.next();

                _image.onload  = {};
                _image.onerror = {};
            };

            _image.classList.add('lazy-loading');

            _image.src = url;
        };
    }

    /**
     * Mark node as loaded
     *
     * @access private
     * @param  node    node Image node element
     * @return string
     */
    LazyLoad.prototype._markFailed = function(node)
    {
        node.classList.add('failed');

        this._markLoaded(node);
    }

    /**
     * Mark node as loaded
     *
     * @access private
     * @param  node    node Image node element
     * @return string
     */
    LazyLoad.prototype._markLoaded = function(node)
    {
        node.classList.add('lazy-loaded');

        node.classList.remove('lazy-loading');
    }

    /**
     * Get an image's src attribute
     *
     * @access private
     * @param  node    node Image node element
     * @return string
     */
    LazyLoad.prototype._getSrc = function(node)
    {
        return node.getAttribute('data-src') || node.dataset.src;
    }

    /**
     * Should we load this image
     *
     * @access private
     * @param  node    node Image node element
     * @return bool
     */
    LazyLoad.prototype._canLoad = function(node)
    {
        return typeof this._getSrc(node) !== 'undefined' && (!node.classList.contains('lazy-loading') || !node.classList.contains('lazy-loaded'));
    }

    /**
     * Is node an image
     *
     * @access private
     * @param  node    node Image node element
     * @return bool
     */
    LazyLoad.prototype._isImage = function(node)
    {
        return node.nodeName.toLowerCase() === 'img';
    }

    if (!window.FrontBx)
    {
        window.addEventListener('DOMContentLoaded', () =>
        {
            // Invoke and start loading images
            const lazy = new LazyLoad();

            // Listen for FrontBx:ready and register into dom
            // Will not be invoked unless dom().refresh() is called
            FrontBx.dom().register('LazyLoad', lazy, false);
        })
    }
    
})();

// vendors
(function()
{
    /* NProgress, (c) 2013, 2014 Rico Sta. Cruz - http://ricostacruz.com/nprogress * @license MIT */
        var NProgress = {};

        NProgress.version = '0.2.0';

        var Settings = NProgress.settings = {
            minimum: 0.08,
            easing: 'linear',
            positionUsing: '',
            speed: 200,
            trickle: true,
            trickleSpeed: 200,
            showSpinner: true,
            barSelector: '[role="bar"]',
            spinnerSelector: '[role="spinner"]',
            parent: 'body',
            template: '<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
        };

    /**
    * Updates configuration.
    *
    *     NProgress.configure({
    *       minimum: 0.1
    *     });
    */
        NProgress.configure = function(options) {
            var key, value;
            for (key in options) {
                value = options[key];
                if (value !== undefined && options.hasOwnProperty(key)) Settings[key] = value;
            }

            return this;
        };

    /**
    * Last number.
    */

        NProgress.status = null;

    /**
    * Sets the progress bar status, where `n` is a number from `0.0` to `1.0`.
    *
    *     NProgress.set(0.4);
    *     NProgress.set(1.0);
    */

        NProgress.set = function(n) {
            var started = NProgress.isStarted();

            n = clamp(n, Settings.minimum, 1);
            NProgress.status = (n === 1 ? null : n);

            var progress = NProgress.render(!started),
            bar      = progress.querySelector(Settings.barSelector),
            speed    = Settings.speed,
            ease     = Settings.easing;

    progress.offsetWidth; /* Repaint */

            queue(function(next) {
    // Set positionUsing if it hasn't already been set
                if (Settings.positionUsing === '') Settings.positionUsing = NProgress.getPositioningCSS();

    // Add transition
                css(bar, barPositionCSS(n, speed, ease));

                if (n === 1) {
      // Fade out
                  css(progress, {
                    transition: 'none',
                    opacity: 1
                });
      progress.offsetWidth; /* Repaint */

                  setTimeout(function() {
                    css(progress, {
                      transition: 'all ' + speed + 'ms linear',
                      opacity: 0
                  });
                    setTimeout(function() {
                      NProgress.remove();
                      next();
                  }, speed);
                }, speed);
              } else {
                  setTimeout(next, speed);
              }
          });

            return this;
        };

        NProgress.isStarted = function() {
            return typeof NProgress.status === 'number';
        };

    /**
    * Shows the progress bar.
    * This is the same as setting the status to 0%, except that it doesn't go backwards.
    *
    *     NProgress.start();
    *
    */
        NProgress.start = function() {
            if (!NProgress.status) NProgress.set(0);

            var work = function() {
                setTimeout(function() {
                  if (!NProgress.status) return;
                  NProgress.trickle();
                  work();
              }, Settings.trickleSpeed);
            };

            if (Settings.trickle) work();

            return this;
        };

    /**
    * Hides the progress bar.
    * This is the *sort of* the same as setting the status to 100%, with the
    * difference being `done()` makes some placebo effect of some realistic motion.
    *
    *     NProgress.done();
    *
    * If `true` is passed, it will show the progress bar even if its hidden.
    *
    *     NProgress.done(true);
    */

        NProgress.done = function(force) {
            if (!force && !NProgress.status) return this;

            return NProgress.inc(0.3 + 0.5 * Math.random()).set(1);
        };

    /**
    * Increments by a random amount.
    */

        NProgress.inc = function(amount) {
            var n = NProgress.status;

            if (!n) {
                return NProgress.start();
            } else if(n > 1) {
                return;
            } else {
                if (typeof amount !== 'number') {
                  if (n >= 0 && n < 0.2) { amount = 0.1; }
                  else if (n >= 0.2 && n < 0.5) { amount = 0.04; }
                  else if (n >= 0.5 && n < 0.8) { amount = 0.02; }
                  else if (n >= 0.8 && n < 0.99) { amount = 0.005; }
                  else { amount = 0; }
              }

              n = clamp(n + amount, 0, 0.994);
              return NProgress.set(n);
          }
      };

      NProgress.trickle = function() {
        return NProgress.inc();
    };

    /**
    * Waits for all supplied jQuery promises and
    * increases the progress as the promises resolve.
    *
    * @param $promise jQUery Promise
    */
    (function() {
        var initial = 0, current = 0;

        NProgress.promise = function($promise) {
            if (!$promise || $promise.state() === "resolved") {
              return this;
          }

          if (current === 0) {
              NProgress.start();
          }

          initial++;
          current++;

          $promise.always(function() {
              current--;
              if (current === 0) {
                  initial = 0;
                  NProgress.done();
              } else {
                  NProgress.set((initial - current) / initial);
              }
          });

          return this;
      };

    })();

    /**
    * (Internal) renders the progress bar markup based on the `template`
    * setting.
    */

    NProgress.render = function(fromStart) {
        if (NProgress.isRendered()) return document.getElementById('nprogress');

        addClass(document.documentElement, 'nprogress-busy');

        var progress = document.createElement('div');
        progress.id = 'nprogress';
        progress.innerHTML = Settings.template;



        var bar = progress.querySelector(Settings.barSelector),
        perc = fromStart ? '-100' : toBarPerc(NProgress.status || 0),
        parent = isDOM(Settings.parent)
        ? Settings.parent
        : document.querySelector(Settings.parent),
        spinner

        css(bar, {
            transition: 'all 0 linear',
            transform: 'translate3d(' + perc + '%,0,0)'
        });

        if (!Settings.showSpinner) {
            spinner = progress.querySelector(Settings.spinnerSelector);
            spinner && removeElement(spinner);
        }

        if (parent != document.body) {
            addClass(parent, 'nprogress-custom-parent');
        }

        parent.appendChild(progress);
        return progress;
    };

    /**
    * Removes the element. Opposite of render().
    */

    NProgress.remove = function() {
        removeClass(document.documentElement, 'nprogress-busy');
        var parent = isDOM(Settings.parent)
        ? Settings.parent
        : document.querySelector(Settings.parent)
        removeClass(parent, 'nprogress-custom-parent')
        var progress = document.getElementById('nprogress');
        progress && removeElement(progress);
    };

    /**
    * Checks if the progress bar is rendered.
    */

    NProgress.isRendered = function() {
        return !!document.getElementById('nprogress');
    };

    /**
    * Determine which positioning CSS rule to use.
    */

    NProgress.getPositioningCSS = function() {
    // Sniff on document.body.style
        var bodyStyle = document.body.style;

    // Sniff prefixes
        var vendorPrefix = ('WebkitTransform' in bodyStyle) ? 'Webkit' :
        ('MozTransform' in bodyStyle) ? 'Moz' :
        ('msTransform' in bodyStyle) ? 'ms' :
        ('OTransform' in bodyStyle) ? 'O' : '';

        if (vendorPrefix + 'Perspective' in bodyStyle) {
    // Modern browsers with 3D support, e.g. Webkit, IE10
            return 'translate3d';
        } else if (vendorPrefix + 'Transform' in bodyStyle) {
    // Browsers without 3D support, e.g. IE9
            return 'translate';
        } else {
    // Browsers without translate() support, e.g. IE7-8
            return 'margin';
        }
    };

    /**
    * Helpers
    */

    function isDOM (obj) {
        if (typeof HTMLElement === 'object') {
            return obj instanceof HTMLElement
        }
        return (
            obj &&
            typeof obj === 'object' &&
            obj.nodeType === 1 &&
            typeof obj.nodeName === 'string'
            )
    }

    function clamp(n, min, max) {
        if (n < min) return min;
        if (n > max) return max;
        return n;
    }

    /**
    * (Internal) converts a percentage (`0..1`) to a bar translateX
    * percentage (`-100%..0%`).
    */

    function toBarPerc(n) {
        return (-1 + n) * 100;
    }


    /**
    * (Internal) returns the correct CSS for changing the bar's
    * position given an n percentage, and speed and ease from Settings
    */

    function barPositionCSS(n, speed, ease) {
        var barCSS;

        if (Settings.positionUsing === 'translate3d') {
            barCSS = { transform: 'translate3d('+toBarPerc(n)+'%,0,0)' };
        } else if (Settings.positionUsing === 'translate') {
            barCSS = { transform: 'translate('+toBarPerc(n)+'%,0)' };
        } else {
            barCSS = { 'margin-left': toBarPerc(n)+'%' };
        }

        barCSS.transition = 'all '+speed+'ms '+ease;

        return barCSS;
    }

    /**
    * (Internal) Queues a function to be executed.
    */

    var queue = (function() {
        var pending = [];

        function next() {
            var fn = pending.shift();
            if (fn) {
              fn(next);
          }
      }

      return function(fn) {
        pending.push(fn);
        if (pending.length == 1) next();
    };
    })();

    /**
    * (Internal) Applies css properties to an element, similar to the jQuery
    * css method.
    *
    * While this helper does assist with vendor prefixed property names, it
    * does not perform any manipulation of values prior to setting styles.
    */

    var css = (function() {
        var cssPrefixes = [ 'Webkit', 'O', 'Moz', 'ms' ],
        cssProps    = {};

        function camelCase(string) {
            return string.replace(/^-ms-/, 'ms-').replace(/-([\da-z])/gi, function(match, letter) {
              return letter.toUpperCase();
          });
        }

        function getVendorProp(name) {
            var style = document.body.style;
            if (name in style) return name;

            var i = cssPrefixes.length,
            capName = name.charAt(0).toUpperCase() + name.slice(1),
            vendorName;
            while (i--) {
              vendorName = cssPrefixes[i] + capName;
              if (vendorName in style) return vendorName;
          }

          return name;
      }

      function getStyleProp(name) {
        name = camelCase(name);
        return cssProps[name] || (cssProps[name] = getVendorProp(name));
    }

    function applyCss(element, prop, value) {
        prop = getStyleProp(prop);
        element.style[prop] = value;
    }

    return function(element, properties) {
        var args = arguments,
        prop,
        value;

        if (args.length == 2) {
          for (prop in properties) {
            value = properties[prop];
            if (value !== undefined && properties.hasOwnProperty(prop)) applyCss(element, prop, value);
        }
    } else {
      applyCss(element, args[1], args[2]);
    }
    }
    })();

    /**
    * (Internal) Determines if an element or space separated list of class names contains a class name.
    */

    function hasClass(element, name) {
        var list = typeof element == 'string' ? element : classList(element);
        return list.indexOf(' ' + name + ' ') >= 0;
    }

    /**
    * (Internal) Adds a class to an element.
    */

    function addClass(element, name) {
        var oldList = classList(element),
        newList = oldList + name;

        if (hasClass(oldList, name)) return;

    // Trim the opening space.
        element.className = newList.substring(1);
    }

    /**
    * (Internal) Removes a class from an element.
    */

    function removeClass(element, name) {
        var oldList = classList(element),
        newList;

        if (!hasClass(element, name)) return;

    // Replace the class name.
        newList = oldList.replace(' ' + name + ' ', ' ');

    // Trim the opening and closing spaces.
        element.className = newList.substring(1, newList.length - 1);
    }

    /**
    * (Internal) Gets a space separated list of the class names on the element.
    * The list is wrapped with a single space on each end to facilitate finding
    * matches within the list.
    */

    function classList(element) {
        return (' ' + (element && element.className || '') + ' ').replace(/\s+/gi, ' ');
    }

    /**
    * (Internal) Removes an element from the DOM.
    */

    function removeElement(element) {
        element && element.parentNode && element.parentNode.removeChild(element);
    }

    // Load into container 
    FrontBx.singleton('NProgress', NProgress);

})();

// utility
// utility
(function()
{
    /**
     * Helper functions
     * 
     * @var {Function}
     */
    const [each, is_function, is_object, is_array_last, is_empty, callable_name] = FrontBx.import(['each','is_function','is_object','is_array_last','is_empty','callable_name']).from('_');

    /**
     * Named callbacks
     * 
     * @var {array}
     */
    const NAMED_CALLBACKS = ['success', 'error', 'complete', 'abort', 'progress'];

    /**
     * JS Queue
     *
     * @class
     * @see {https://medium.com/@griffinmichl/asynchronous-javascript-queue-920828f6327}
     */
    const Queue = function(concurrency)
    {
        this.running = 0;
        this.concurrency = concurrency;
        this.taskQueue = [];
    };

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

    const AJAX_QUEUE = new Queue(15);

    /**
     * Module constructor
     *
     * @access {public}
     * @class
     */
    const Ajax = function()
    {
        this._reset();
    }

    /**
     * Reset internals.
     *
     * @return {this}
     */
    Ajax.prototype._reset = function()
    {
        this._settings =
        {
            'url': '',
            'async': true,
            'timeout': 10000,
            'headers':
            {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accepts': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            },
        };

        this._complete = () => {};
        this._success  = () => {};
        this._error    = () => {};
        this._abort    = () => {};
        this._progress = () => {};
        this._xhr      = null;
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
    Ajax.prototype.post = function(url, data, success, error, complete, abort, headers)
    {
        this._setResponseHandlers('POST', url, data, success, error, complete, abort, headers);

        AJAX_QUEUE.add(this._call, this);

        return this;
    }
    Ajax.prototype.get = function(url, data, success, error, complete, abort, headers)
    {
        this._setResponseHandlers('GET', url, data, success, error, complete, abort, headers);

        AJAX_QUEUE.add(this._call, this);

        return this;
    }
    Ajax.prototype.head = function(url, data, success, error, complete, abort, headers)
    {
        this._setResponseHandlers('HEAD', url, data, success, error, complete, abort, headers);

        AJAX_QUEUE.add(this._call, this);

        return this;
    }
    Ajax.prototype.put = function(url, data, success, error, complete, abort, headers)
    {
        this._setResponseHandlers('PUT', url, data, success, error, complete, abort, headers);

        AJAX_QUEUE.add(this._call, this);

        return this;
    }
    Ajax.prototype.delete = function(url, data, success, error, complete, abort, headers)
    {
        this._setResponseHandlers('DELETE', url, data, success, error, complete, abort, headers);

        AJAX_QUEUE.add(this._call, this);

        return this;
    }
    Ajax.prototype.upload = function(url, data, success, error, complete, abort, progress, headers)
    {
        this._settings.async = true;

        this._setResponseHandlers('UPLOAD', url, data, success, error, complete, abort, headers, progress);

        AJAX_QUEUE.add(this._call, this);

        return this;
    }


    /**
     * Set async
     *
     * @param  {function}  callback Callback function
     * @return {this}
     */
    Ajax.prototype.async = function(bool)
    {
        this._settings.async = bool;

        return this;
    }

    /**
     * Adds headers
     *
     * @param  {object}  headers
     * @return {this}
     */
    Ajax.prototype.headers = function(_headers)
    {
        this._settings.headers = {...this._settings.headers, ..._headers};

        return this;
    }

    /**
     * Adds progress handler
     *
     * @param  {object}  headers
     * @return {this}
     */
    Ajax.prototype.progress = function(callback)
    {
        this._progress = callback;

        return this;
    }

    /**
     * Success function
     *
     * @param  {function}  callback Callback function
     * @return {this}
     */
    Ajax.prototype.success = function(callback)
    {
        this._success = callback;

        return this;
    }

    /**
     * Error function
     *
     * @param  {function}  callback Callback function
     * @return {this}
     */
    Ajax.prototype.error = function(callback)
    {
        this._error = callback;

        return this;
    }

    /**
     * Alias for complete
     *
     * @param  {function}  callback Callback function
     * @return {this}
     */
    Ajax.prototype.then = function(callback)
    {
        return this.complete(callback);
    }

    /**
     * Complete function
     *
     * @param  {function}  callback Callback function
     * @return {this}
     */
    Ajax.prototype.complete = function(callback)
    {
        this._complete = callback;

        return this;
    }

    /**
     * Abort an ajax call
     *
     * @param  {function}  callback Callback function
     * @return {this}
     */
    Ajax.prototype.abort = function(callback)
    {
        let xhr = this._xhr;

        // Called before XHR request
        if (!xhr)
        {
            this._abort = callback;

            return this;
        }

        // Already completed
        if (!xhr.readyState >= 4)
        {
            return this;
        }

        xhr.onreadystatechange = () => {};
        this._complete = null;
        this._success  = null;
        xhr.abort();

        this._makeCallback(this._abort, this, [xhr.responseText, false]);

        this._makeCallback(this._error, this, [xhr.responseText]);
    }

    /**
     * Call callback function
     *
     * @param  {function}  callback Callback function
     * @return {this}
     */
    Ajax.prototype._makeCallback = function(callback, _this, args)
    {
        if (is_function(callback)) callback.apply(_this, args);
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
    Ajax.prototype._call = function()
    {
        let [method, url] = [this.method, this.url];

        var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

        this._xhr = xhr;

        xhr.requestURL = url;

        xhr.mthod = method === 'UPLOAD' ? 'POST' : method;

        if (method === 'UPLOAD' && is_function(this._progress))
        {
            xhr.upload.addEventListener('progress', this._progress, false);
        }

        if (method === 'UPLOAD')
        {
            if (is_function(this._progress)) xhr.upload.addEventListener('progress', this._progress, false);

            if (is_function(this._complete)) xhr.upload.addEventListener('load', this._complete, false);
        }

        xhr.open(method, url, this._settings.async);

        xhr.timeout = this._settings.timeout;

        this._sendHeaders();

        if (this._settings.async)
        {
            xhr.onreadystatechange = () => { this._ready() };

            xhr.send(this.data || null);
        }
        else
        {
            xhr.send(this.data || null);

            this._ready();
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
    Ajax.prototype._sendHeaders = function()
    {
        if (this.method === 'POST') this._settings.headers['REQUESTED-WITH'] = 'XMLHttpRequest';

        each(this._settings.headers, (k,v) => this._xhr.setRequestHeader(k, v));
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
    Ajax.prototype._setResponseHandlers = function(method, url, data, success, error, complete, abort, headers, progress)
    {
        let ret = { method, url, data, success, error, complete, abort, headers, progress };

        // Cleanup
        let args = Array.prototype.slice.call(arguments);

        // Remove method and URL
        args.splice(0,2);

        // post(url, complete)
        // put(url, data)
        if (args.length === 1 && is_function(args[0]) && !NAMED_CALLBACKS.includes(callable_name(args[0])))
        {
            ret.complete = data;
            ret.data = ret.success = ret.error = ret.complete = ret.abort = ret.progress = ret.headers = null;
        }
        // post(url, data, complete)
        else if (args.length === 2 && is_function(args[1]) && !NAMED_CALLBACKS.includes(callable_name(args[1])))
        {
            ret.complete = success;
            ret.success = ret.error = ret.complete = ret.abort = ret.progress = ret.headers = null;
        }
        else
        {
            each(args, (i, arg) =>
            {
                if (is_function(arg))
                {
                    let name = callable_name(arg).toLowerCase();

                    if (NAMED_CALLBACKS.includes(callable_name(arg)))
                    {
                        ret[name] = arg;
                    }
                }
                else if (is_object(arg))
                {
                    // First arg is always data if it's an object
                    if (i === 0)
                    {
                        ret.data = arg;
                    }
                    // Last arg should be headers if it's an object
                    else if (is_array_last(arg, args))
                    {
                        ret.headers = arg;
                    }
                }
            });
        }

        // Sanitize params
        let hasData = is_object(ret.data) && !is_empty(ret.data);

        // Ajax.get('foo.com?foo=bar&baz')
        if (hasData)
        {
            if (method === 'UPLOAD')
            {
                let form = new FormData();

                each(data, (k, v) =>
                {
                    form.append(key, value, v.type);
                });
            }
            else if (method !== 'POST')
            {   
                let suffix = ret.url.includes('?') ? '&' : '?';
                let params = this._params(ret.data);
                ret.url    = `${ret.url}${suffix}${params}`;
                ret.data   = undefined;
            }
            else
            {
                ret.data = this._params(ret.data);
            }
        }

        let callbacks = ['success', 'error', 'complete', 'abort', 'headers', 'progress'];

        each(ret, (k,v) => callbacks.includes(k) ? this[k](v) : this[k] = v);
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
    Ajax.prototype._ready = function()
    {        
        let xhr = this._xhr;

        if (xhr.readyState == 4)
        {
            let successfull = xhr.status >= 200 && xhr.status < 300 || xhr.status === 304;

            let response = xhr.responseText;

            this._makeCallback(successfull ? this._success : this._error, xhr, [response]);

            this._makeCallback(this._complete, xhr, [response, successfull]);

            // Next queue
            AJAX_QUEUE.next();
        }
    }

    Ajax.prototype._params = function(obj)
    {
        let s = [];

        each(obj, (k,v) => s.push(encodeURIComponent(k) + '=' + encodeURIComponent(v)))

        return s.join('&');
    }

    FrontBx.set('Ajax', Ajax);
})();
(function()
{
    /**
     * Helper functions.
     * 
     * @var {Function}
     */
    const [find, find_all, on, each, map, in_array, in_dom, is_empty, is_string, scroll_pos, trigger_event, normalize_url, inner_HTML, extend] = FrontBx.import(['find','find_all','on','each','map','in_array','in_dom','is_empty','is_string','scroll_pos','trigger_event','normalize_url','inner_HTML','extend']).from('_');

    /**
     * Are we listening for state changes ?
     * 
     * @var {bool}
     */
    var _listening = false;

    /**
     * Default options
     * 
     * @var {object}
     */
    const DEFAULT_OPTIONS = 
    {
        element:   'body',
        cacheBust:  true,
        once:       false,
        keepScroll: true,
        pushstate:  false,
        urlhash:    false,
    };

    /**
     * Pjax module
     *
     * @class
     * @extends   {Ajax}
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.comfrontbx/uimaster/LICENSE}
     */
    const Pjax = function()
    {
        this.super();

        if (!_listening)
        {
            on(window, 'popstate', this._popStateHandler, this);

            _listening = true;
        }
    }

    Pjax.prototype.request = function(url, options, success, error, complete, abort, headers)
    {
        // If we are already loading a pjax, cancel it and
        if (this._xhr) this.abort();

        // Reset variables
        this._reset();

        // Merge options with defaults
        options = typeof options === 'undefined' ? { ...DEFAULT_OPTIONS } : { ...DEFAULT_OPTIONS, ...options };

        // Set PJAX header
        this.headers({'X-PJAX': true});

        // Store URL in options for callbacks
        options.url = normalize_url(url.trim());

        // Default data to send
        let data = options.cacheBust ? { t: Date.now().toString() } : {};
        
        // Fire the start event
        trigger_event(window, 'FrontBx:Pjax:start', { options });

        // Set response handlers
        this._setResponseHandlers('GET', options.url, data, success, error, complete, abort, headers);

        // Cache callbacks
        const [_success, _error, _complete, _abort ] = [this.success, this.error, this.complete, this.abort];

        // Cache current state
        if (options.pushstate)
        {            
            let state = { ...options, id: normalize_url(window.location.href), scroll: {top: 0, left: 0} };

            window.history.pushState(state, '', state.id);
        }

        FrontBx.NProgress().start();

        this.success((response) =>
        {            
            this._handleSuccess(response.trim(), options);

            if (_success) this._makeCallback(_success, this._xhr, [response]);
        })
        .error((response) =>
        {
            trigger_event(window, 'FrontBx:Pjax:error', { options });

            if (_error) this._makeCallback(_error, this._xhr, [response]);
        })
        .abort((response) =>
        {
            rigger_event(window, 'FrontBx:Pjax:abort', { options });

            if (_abort) this._makeCallback(_abort, this, [response, false]);
        })
        .complete((response, successfull) =>
        {
            if (_complete) this._makeCallback(_complete, this._xhr, [response, successfull]);

            this._reset();

            FrontBx.NProgress().done();

        })._call();
    }

    /**
     * Pjax success handler
     *
     * @access {private}
     * @param  {object} locationObj Location object from the cache
     * @param  {string} HTML        HTML string response from server
     * @param  {bool}   stateChange Change the window history state
     */
    Pjax.prototype._handleSuccess = function(HTML, options)
    {        
        // Parse the HTML
        let responseDoc = this._parseHTML(HTML);

        // Cache scripts
        let descrMeta       = find('meta[name=description]');
        let responseTitle   = this._findDomTitle(responseDoc);
        let responseDesc    = this._findDomDesc(responseDoc);
        let responseScripts = this._getScripts(responseDoc);
        let currScripts     = this._getScripts(document);
        responseDoc         = this._removeScripts(responseDoc);

        // Move scripts to head incase we're replacing body
        //each(currScripts, (i, script) => { if (script.node.parentNode.nodeName.toLowerCase() !== 'head') find('head').appendChild(script.node); });

        // Default to document bodys
        let targetEl        = document.body;
        let responseEl      = responseDoc.body;

        // Selector
        if (is_string(options.element))
        {
            targetEl = find(options.element);
        }
        // DOM Node
        else if (in_dom(options.element))
        {
            // Target is options.element
            targetEl = options.element;
        }

        // Push new state
        if (options.pushstate)
        {
            if (responseTitle) document.title = responseTitle;

            if (responseDesc && descrMeta) descrMeta.content = responseDesc;
        
            let state = { ...options, id: options.url, scroll: { top: 0, left: 0 } };

            window.history.pushState(state, '', options.url);
        }
        // Adjust hash
        else if (options.urlhash && targetEl !== document.body)
        {
            let url = window.location.href.split('#').shift();

            window.history.replaceState({}, '', `${url}#${targetEl.id}`);
        }

        // Insert content
        inner_HTML(targetEl, responseEl.innerHTML);

        this._appendScripts(currScripts, responseScripts, () =>
        {
            FrontBx.dom().refresh(targetEl === document.body ? document : targetEl);

            trigger_event(window, 'FrontBx:Pjax:success', {options});
        });

        if (!options.keepScroll || targetEl === document.body) window.scrollTo(0, 0);
    }

    /**
     * State change event handler (back/forward clicks)
     *
     * Popstate is treated as another pjax request essentially
     * 
     * @access {private}
     * @param  {e}       event JavaScript 'popstate' event
     */
    Pjax.prototype._popStateHandler = function(e)
    {
        // State obj exists 
        if (e.state && typeof e.state.id !== 'undefined')
        {
            // Prevent default
            e.preventDefault();

            let options = e.state;

            this.request(options.id, {...options, pushstate: false });

            return false;
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
    Pjax.prototype._appendScripts = function(currScripts, newScripts, callback)
    {
        let scripts = map(newScripts, (i, script) =>
        {
            let ret = script;

            each(currScripts, (i, cScript) =>
            {
                if (cScript.content === script.content && cScript.inline === script.inline)
                {
                    ret = false;

                    return;
                }
            })

            return ret;
        });

        if (scripts.length > 0) 
        {
            return each(scripts, (i, script) =>  this._appendScript(script, i === scripts.length -1 ? callback : null));
        }

        callback();
    }

    Pjax.prototype._appendScript = function(scriptObj, callback)
    {
        let element = document.createElement(scriptObj.type);

        element.type = scriptObj.type === 'script' ? 'text/javascript' : 'text/css';

        if (scriptObj.type === 'script')
        {
            element.async = false;

            if (!scriptObj.inline)
            {
                element.src = scriptObj.src;

                if (callback) element.onload = () => callback();
            }
            else
            {
                element.innerHTML = scriptObj.src;

                if (callback) callback();
            }
        }
        else
        {
            element.rel = 'stylesheet';
            
            element.href = scriptObj.src;

            if (callback) element.onload = () => callback();
        }

        find('head').appendChild(element);
    }

    /**
     * Filter scripts with unique key/values into an array
     *
     * @access {private}
     * @param  {string} html HTML as a string (with or without full doctype)
     * @return {array}
     */
    Pjax.prototype._getScripts = function(doc)
    {
        var ret     = [];
        var scripts = find_all('script, link[rel=stylesheet]', doc);

        each(scripts, function(i, script)
        {
            let type   = script.nodeName.toLowerCase();
            let src    = type === 'link' ? script.getAttribute('href') : script.getAttribute('src');
            let inline = false; 
            let node   = script;

            if (!src)
            {
                inline = true;
                src = script.innerHTML.trim()
            }

            ret.push({type, src, inline, node });
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
    Pjax.prototype._removeScripts = function(doc)
    {
        var scripts = find_all('script, link[rel=stylesheet]', doc);

        each(scripts, (i, script) => script.parentNode.removeChild(script));

        return doc;
    }

    /**
     * Try to find the page title in a DOM tree
     *
     * @access {private}
     * @param  {string} html HTML as a string (with or without full doctype)
     * @return {string|false}
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
     * Try to find the page title in a DOM tree
     *
     * @access {private}
     * @param  {string} html HTML as a string (with or without full doctype)
     * @return {string|false}
     */
    Pjax.prototype._findDomDesc = function(DOM)
    {
        var desc = find('meta[name=description]', DOM);

        if (desc)
        {
            return desc.content.trim();
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
    Pjax.prototype._parseHTML = function(html)
    {
        var parser = new DOMParser();

        return parser.parseFromString(html, 'text/html');
    }

    // Pjax is singleton
    FrontBx.singleton('Pjax', extend(FrontBx.Ajax().constructor, Pjax));

})();
(function()
{
    /**
     * 
     * @var {Helper} obj
     */
    const [find, each, _for, is_array, is_object, in_array, is_undefined, is_callable, is_htmlElement, in_dom, is_empty, animate, add_class, remove_class, width, height, inline_style, rendered_style, css, is_array_last, dom_element] = FrontBx.import(['find','each','for','is_array', 'is_object', 'in_array','is_undefined','is_callable','is_htmlElement','in_dom','is_empty','animate', 'add_class','remove_class', 'width', 'height', 'inline_style', 'rendered_style', 'css', 'is_array_last','dom_element']).from('_');

    /**
    * Wrappers that need "position:relative" to hide overflow.
    * 
    * @var {array}
    */
    const STATIC_POSITIONS = ['static', 'unset', 'initial'];

    /**
     * Default options.
     * 
     * @var {array}
    */
    const DEFAULT_OPTIONS =
    {
        count: 1,
        lines: 0,
        height: null,
        width: null,
        variant: 'block',
        aspectratio: '',

    };

    /**
    * Class variants.
    * 
    * @var {array}
    */
    const CLASS_VARIANTS = ['block', 'text', 'btn', 'input', 'circle', 'wave', 'rounded', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

    /**
    * Class variants.
    * 
    * @var {array}
    */
    const WRAPPER_VARIANTS = ['text-block', 'block-h1', 'block-h2', 'block-h3', 'block-h4', 'block-h5', 'block-h6'];

    /**
    * Skeleton.
    *
    * @param  {DOMElement}   DOMElement Target node
    * @param  {object|array} options
    * @return {this}
    */
    const Skeleton = function(DOMElement, options)
    {
    this._DOMElement = DOMElement;

    this._nodes = [];

    this._isMulti = is_array(options);

    if (is_empty(options)) return this;

    if (is_array(options))
    {
        each(options, function(i, optionSet)
        {
            optionSet = {...DEFAULT_OPTIONS, ...optionSet};

            this._build(optionSet);

        }, this);
    }
    else
    {
        options = {...DEFAULT_OPTIONS, ...options};

        this._build(options);
    }
    }

    /**
     * Gracefully individual content
     * 
     * @param  {DOMElement|String} content
     * @param  {function|null}     callback
     * @access {public}
     */
    Skeleton.prototype.load = function(content, callback, wrapper)
    {
        if (is_object(content))
        {
            each(content, (selector, node) => 
            {
                let cb = is_array_last(node, content) ? callback : null;

                this.load(node, cb, find(selector, this._DOMElement));

            }, this);

            return;
        }

        wrapper = !wrapper ? this._DOMElement : wrapper;
        const isHTML  = is_htmlElement(content);
        
        // Cache wrapper height and width and so we can transition content without changing layout
        const h           = height(wrapper);
        const w           = width(wrapper);
        const position    = rendered_style(wrapper, 'position');
        const InlOverflow = inline_style(wrapper, 'overflow') || false;
        const InlPosition = inline_style(wrapper, 'overflow') || false;
        const InlHeight   = inline_style(wrapper, 'height') || false;
        const InlWidth    = inline_style(wrapper, 'width') || false;
        const InlStyles   = { overflow: InlOverflow, position: InlPosition, height: InlHeight, width: InlWidth };
        const newStyles   = { overflow: 'hidden', height: `${h}px`, width: `${w}px` };
        if (in_array(position, STATIC_POSITIONS)) newStyles.position = 'relative';

        // Prep content for inserting
        var isFragment = false;
        var oldContnet;

        if (isHTML)
        {
            add_class(content, 'swapping-content-wrapper');
        }
        else
        {
            let div    = dom_element({tag: 'div', class: 'swapping-content-wrapper'}, null, content);
            isFragment = div.children.length > 1;
            if (isFragment) div.className += ' fragment';
            oldContnet = content;
            content    = div;
        }

        const _this = this;

        const complete = function()
        {
            // Make optional user callback
            if (is_callable(callback))
            {
                callback();
            }

            // If we wrapped 'content' we need to remove the outer '.swapping-content-wrapper'
            if (!isHTML)
            {
                if (isFragment)
                {
                    wrapper.innerHTML = '';

                    dom_element(null, wrapper, oldContnet);
                }
                else
                {
                    wrapper.replaceChild(content.children[0], content);
                }
            }
            else
            {
                remove_class(content, 'swapping-content-wrapper');
            }

            // Remove skeletons
            each(_this._nodes, function(i, node)
            {
                if (in_dom(node)) node.parentNode.removeChild(node);                    
            });

            // Set inline styles back to original
            css(wrapper, InlStyles);

            // Remove wrapper classes
            remove_class(wrapper, 'skeleton-swapping-content');
        }

        // Fix dimensions, overflow and positioning while transition.
        css(wrapper, newStyles);

        // Add wrapper class to position content swap while transitioning
        add_class(wrapper, 'skeleton-swapping-content');

        // Finally append content
        wrapper.appendChild(content);

        each(this._nodes, function(i, node)
        {
            animate(node, { property : 'opacity', to : 0, duration: 500 });
        });

        animate(content, { property : 'opacity', from: '0', to : '1', duration: 750, callback: complete});
    }

    /**
     * Remove and destroy
     *
     * @params {function} callback (optional)
     * @params {boolean}  destroy  (optional default true)
     * @access {private}
     */
    Skeleton.prototype.fade_out = function(callback, destroy)
    {
        destroy = is_undefined(destroy) ? true : destroy;
        
        let _this = this;

        const complete = function()
        {
            if (destroy)
            {
                _this.destroy();
            }

            if (is_callable(callback))
            {
                callback();
            }
        }

        let madeCallback = false;

        each(this._nodes, function(i, node)
        {
            let _callback = madeCallback ? undefined : complete;

            animate(node, { property : 'opacity', to : 0, duration: 500, callback: complete});

            madeCallback = true;
        });
    }

    /**
     * Remove and destroy
     *
     * @params {_node} node
     * @access {private}
     */
    Skeleton.prototype.destroy = function()
    {
        each(this._nodes, function(i, node)
        {
            node.parentNode.removeChild(node);
        });

        this._nodes = [];
    }

    /**
     * Remove a notification
     *
     * @params {_node} node
     * @access {private}
     */
    Skeleton.prototype._build = function(options)
    {
        let wrapper    = null;
        let skeleton   = document.createElement('div');
        let variants   = options.variant.split(' ').map((x) => x.trim().toLowerCase()).filter((x) => x !== '');
        let DOMElement = options.selector ? find(options.selector, this._DOMElement) : this._DOMElement;
        let width      = options.width;
        let height     = options.height;
        let classes    = ['skeleton'];

        each(variants, function(i, variant)
        {
            if (in_array(variant, CLASS_VARIANTS))
            {
                classes.push(`skeleton-${variant}`);
            }
            else if (in_array(variant, WRAPPER_VARIANTS))
            {
                classes = ['skeleton'];

                if (!wrapper)
                {
                    wrapper = document.createElement('div');
                    wrapper.className = options.lines > 1 ? 'skeleton-text-block skeleton-lines' : 'skeleton-text-block' ;
                }

                if (variant !== 'text-block')
                {
                    wrapper.className += ` skeleton-text-${variant}`;
                }
            }
        });

        skeleton.className = classes.join(' ');

        let skeletons = [skeleton];

        if (options.count > 1 || options.lines > 1)
        {
            let count = Math.max(options.count, options.lines);

            _for(count -1, (i) => skeletons.push(skeleton.cloneNode(true)));
        }

        each(skeletons, function(i, _skeleton)
        {
            this._setDimensions(_skeleton, width, height, wrapper, options.aspectratio, options.lines > 1);

            if (wrapper)
            {
                wrapper.appendChild(_skeleton);
            }
            else
            {
                DOMElement.appendChild(_skeleton);
            }

        }, this);

        if (wrapper)
        {                
            DOMElement.appendChild(wrapper);

            this._nodes.push(wrapper);
        }
        else
        {
            each(skeletons, (i, skel) => this._nodes.push(skel), this);
        }
    }

    /**
     * Remove and destroy
     *
     * @params {callback} node
     * @access {private}
     */
    Skeleton.prototype._setDimensions = function(skeleton, width, height, wrapper, aspectRatio, isLines)
    {
        // Text blocks get random width;
        if (wrapper)
        {
            let min = isLines ? 70 : 15;
            let max = isLines ? 95 : 85;
            let w   = Math.floor(Math.random() * (max - min + 1) + min);

            skeleton.style.width = `${w}%`;

            return;
        }

        if (aspectRatio !== '')
        {
            skeleton.style.width  = '100%';
            skeleton.style.height = 'auto';
            skeleton.style.aspectRatio = aspectRatio;

            return;
        }

        if (width)
        {
            skeleton.style.width = width;
        }

        if (height)
        {
            skeleton.style.height = height;
        }
    }

    // Add to container
    FrontBx.set('Skeleton', Skeleton);

})();
(function()
{
    /**
     * TinyGesture.js
     *
     * This service uses passive listeners, so you can't call event.preventDefault()
     * on any of the events.
     *
     * Adapted from https://gist.github.com/SleepWalker/da5636b1abcbaff48c4d
     * and https://github.com/uxitten/xwiper
     * plus a bunch more of my own code.
     */
    class TinyGesture {
        constructor(element, options) {
            this.element = element;
            this.touch1 = null;
            this.touch2 = null;
            this.touchStartX = null;
            this.touchStartY = null;
            this.touchEndX = null;
            this.touchEndY = null;
            this.touchMove1 = null;
            this.touchMove2 = null;
            this.touchMoveX = null;
            this.touchMoveY = null;
            this.velocityX = null;
            this.velocityY = null;
            this.longPressTimer = null;
            this.doubleTapTimer = null;
            this.doubleTapWaiting = false;
            this.thresholdX = 0;
            this.thresholdY = 0;
            this.disregardVelocityThresholdX = 0;
            this.disregardVelocityThresholdY = 0;
            this.swipingHorizontal = false;
            this.swipingVertical = false;
            this.swipingDirection = null;
            this.swipedHorizontal = false;
            this.swipedVertical = false;
            this.originalDistance = null;
            this.newDistance = null;
            this.scale = null;
            this.originalAngle = null;
            this.newAngle = null;
            this.rotation = null;
            this.handlers = {
                panstart: [],
                panmove: [],
                panend: [],
                swipeleft: [],
                swiperight: [],
                swipeup: [],
                swipedown: [],
                tap: [],
                doubletap: [],
                longpress: [],
                pinch: [],
                pinchend: [],
                rotate: [],
                rotateend: [],
            };
            this._onTouchStart = this.onTouchStart.bind(this);
            this._onTouchMove = this.onTouchMove.bind(this);
            this._onTouchEnd = this.onTouchEnd.bind(this);
            this.opts = Object.assign({}, TinyGesture.defaults, options);
            this.element.addEventListener('touchstart', this._onTouchStart, passiveIfSupported);
            this.element.addEventListener('touchmove', this._onTouchMove, passiveIfSupported);
            this.element.addEventListener('touchend', this._onTouchEnd, passiveIfSupported);
            if (this.opts.mouseSupport && !('ontouchstart' in window)) {
                this.element.addEventListener('mousedown', this._onTouchStart, passiveIfSupported);
                document.addEventListener('mousemove', this._onTouchMove, passiveIfSupported);
                document.addEventListener('mouseup', this._onTouchEnd, passiveIfSupported);
            }
        }
        destroy() {
            var _a, _b;
            this.element.removeEventListener('touchstart', this._onTouchStart);
            this.element.removeEventListener('touchmove', this._onTouchMove);
            this.element.removeEventListener('touchend', this._onTouchEnd);
            this.element.removeEventListener('mousedown', this._onTouchStart);
            document.removeEventListener('mousemove', this._onTouchMove);
            document.removeEventListener('mouseup', this._onTouchEnd);
            clearTimeout((_a = this.longPressTimer) !== null && _a !== void 0 ? _a : undefined);
            clearTimeout((_b = this.doubleTapTimer) !== null && _b !== void 0 ? _b : undefined);
        }
        on(type, fn) {
            if (this.handlers[type]) {
                this.handlers[type].push(fn);
                return {
                    type,
                    fn,
                    cancel: () => this.off(type, fn),
                };
            }
        }
        off(type, fn) {
            if (this.handlers[type]) {
                const idx = this.handlers[type].indexOf(fn);
                if (idx !== -1) {
                    this.handlers[type].splice(idx, 1);
                }
            }
        }
        fire(type, event) {
            for (let i = 0; i < this.handlers[type].length; i++) {
                this.handlers[type][i](event);
            }
        }
        onTouchStart(event) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1;
            let didTouch1 = false;
            let didTouch2 = false;
            if (event.type !== 'mousedown') {
                if (!this.touch1) {
                    this.touch1 = event.changedTouches[0];
                    didTouch1 = true;
                }
                if (((didTouch1 && event.changedTouches.length > 1) || !didTouch1) && !this.touch2) {
                    this.touch2 =
                        [...event.changedTouches].find((touch) => { var _a; return touch.identifier !== ((_a = this.touch1) === null || _a === void 0 ? void 0 : _a.identifier); }) ||
                            null;
                    this.originalDistance = Math.sqrt(Math.pow(((_b = (_a = this.touch2) === null || _a === void 0 ? void 0 : _a.screenX) !== null && _b !== void 0 ? _b : 0) - ((_f = (_d = (_c = this.touchMove1) === null || _c === void 0 ? void 0 : _c.screenX) !== null && _d !== void 0 ? _d : (_e = this.touch1) === null || _e === void 0 ? void 0 : _e.screenX) !== null && _f !== void 0 ? _f : 0), 2) +
                        Math.pow(((_h = (_g = this.touch2) === null || _g === void 0 ? void 0 : _g.screenY) !== null && _h !== void 0 ? _h : 0) - ((_m = (_k = (_j = this.touchMove1) === null || _j === void 0 ? void 0 : _j.screenY) !== null && _k !== void 0 ? _k : (_l = this.touch1) === null || _l === void 0 ? void 0 : _l.screenY) !== null && _m !== void 0 ? _m : 0), 2));
                    this.originalAngle =
                        Math.atan2(((_p = (_o = this.touch2) === null || _o === void 0 ? void 0 : _o.screenY) !== null && _p !== void 0 ? _p : 0) - ((_t = (_r = (_q = this.touchMove1) === null || _q === void 0 ? void 0 : _q.screenY) !== null && _r !== void 0 ? _r : (_s = this.touch1) === null || _s === void 0 ? void 0 : _s.screenY) !== null && _t !== void 0 ? _t : 0), ((_v = (_u = this.touch2) === null || _u === void 0 ? void 0 : _u.screenX) !== null && _v !== void 0 ? _v : 0) - ((_z = (_x = (_w = this.touchMove1) === null || _w === void 0 ? void 0 : _w.screenX) !== null && _x !== void 0 ? _x : (_y = this.touch1) === null || _y === void 0 ? void 0 : _y.screenX) !== null && _z !== void 0 ? _z : 0)) /
                            (Math.PI / 180);
                    return;
                }
                if (!didTouch1 && !didTouch2) {
                    return;
                }
            }
            if (didTouch1 || event.type === 'mousedown') {
                this.thresholdX = this.opts.threshold('x', this);
                this.thresholdY = this.opts.threshold('y', this);
                this.disregardVelocityThresholdX = this.opts.disregardVelocityThreshold('x', this);
                this.disregardVelocityThresholdY = this.opts.disregardVelocityThreshold('y', this);
                this.touchStartX = event.type === 'mousedown' ? event.screenX : ((_0 = this.touch1) === null || _0 === void 0 ? void 0 : _0.screenX) || 0;
                this.touchStartY = event.type === 'mousedown' ? event.screenY : ((_1 = this.touch1) === null || _1 === void 0 ? void 0 : _1.screenY) || 0;
                this.touchMoveX = null;
                this.touchMoveY = null;
                this.touchEndX = null;
                this.touchEndY = null;
                this.swipingDirection = null;
                this.longPressTimer = setTimeout(() => this.fire('longpress', event), this.opts.longPressTime);
                this.scale = 1;
                this.rotation = 0;
                this.fire('panstart', event);
            }
        }
        onTouchMove(event) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
            if (event.type === 'mousemove' && (!this.touchStartX || this.touchEndX !== null)) {
                return;
            }
            let touch1 = undefined;
            let touch2 = undefined;
            if (event.type !== 'mousemove') {
                touch1 = [...event.changedTouches].find((touch) => { var _a; return touch.identifier === ((_a = this.touch1) === null || _a === void 0 ? void 0 : _a.identifier); });
                this.touchMove1 = touch1 || this.touchMove1;
                touch2 = [...event.changedTouches].find((touch) => { var _a; return touch.identifier === ((_a = this.touch2) === null || _a === void 0 ? void 0 : _a.identifier); });
                this.touchMove2 = touch2 || this.touchMove2;
            }
            if (event.type === 'mousemove' || touch1) {
                const touchMoveX = (event.type === 'mousemove' ? event.screenX : (_a = touch1 === null || touch1 === void 0 ? void 0 : touch1.screenX) !== null && _a !== void 0 ? _a : 0) - ((_b = this.touchStartX) !== null && _b !== void 0 ? _b : 0);
                this.velocityX = touchMoveX - ((_c = this.touchMoveX) !== null && _c !== void 0 ? _c : 0);
                this.touchMoveX = touchMoveX;
                const touchMoveY = (event.type === 'mousemove' ? event.screenY : (_d = touch1 === null || touch1 === void 0 ? void 0 : touch1.screenY) !== null && _d !== void 0 ? _d : 0) - ((_e = this.touchStartY) !== null && _e !== void 0 ? _e : 0);
                this.velocityY = touchMoveY - ((_f = this.touchMoveY) !== null && _f !== void 0 ? _f : 0);
                this.touchMoveY = touchMoveY;
                const absTouchMoveX = Math.abs(this.touchMoveX);
                const absTouchMoveY = Math.abs(this.touchMoveY);
                this.swipingHorizontal = absTouchMoveX > this.thresholdX;
                this.swipingVertical = absTouchMoveY > this.thresholdY;
                this.swipingDirection =
                    absTouchMoveX > absTouchMoveY
                        ? this.swipingHorizontal
                            ? 'horizontal'
                            : 'pre-horizontal'
                        : this.swipingVertical
                            ? 'vertical'
                            : 'pre-vertical';
                if (Math.max(absTouchMoveX, absTouchMoveY) > this.opts.pressThreshold) {
                    clearTimeout((_g = this.longPressTimer) !== null && _g !== void 0 ? _g : undefined);
                }
                this.fire('panmove', event);
            }
            if (event.type !== 'mousemove' && this.touchMove1 != null && this.touchMove2 != null) {
                this.newDistance = Math.sqrt(Math.pow(this.touchMove2.screenX - this.touchMove1.screenX, 2) +
                    Math.pow(this.touchMove2.screenY - this.touchMove1.screenY, 2));
                this.scale = this.newDistance / ((_h = this.originalDistance) !== null && _h !== void 0 ? _h : 0);
                this.fire('pinch', event);
                this.newAngle =
                    Math.atan2(((_j = this.touchMove2.screenY) !== null && _j !== void 0 ? _j : 0) - ((_k = this.touchMove1.screenY) !== null && _k !== void 0 ? _k : 0), ((_l = this.touchMove2.screenX) !== null && _l !== void 0 ? _l : 0) - ((_m = this.touchMove1.screenX) !== null && _m !== void 0 ? _m : 0)) /
                        (Math.PI / 180);
                this.rotation = this.newAngle - ((_o = this.originalAngle) !== null && _o !== void 0 ? _o : 0);
                this.fire('rotate', event);
            }
        }
        onTouchEnd(event) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
            let touch1 = undefined;
            if (event.type !== 'mouseup') {
                touch1 = [...event.changedTouches].find((touch) => { var _a; return touch.identifier === ((_a = this.touch1) === null || _a === void 0 ? void 0 : _a.identifier); });
                if (![...event.touches].find((touch) => { var _a; return touch.identifier === ((_a = this.touch1) === null || _a === void 0 ? void 0 : _a.identifier); })) {
                    this.touch1 = null;
                    this.touchMove1 = null;
                }
                if (![...event.touches].find((touch) => { var _a; return touch.identifier === ((_a = this.touch2) === null || _a === void 0 ? void 0 : _a.identifier); })) {
                    this.touch2 = null;
                    this.touchMove2 = null;
                }
            }
            if (event.type === 'mouseup' && (!this.touchStartX || this.touchEndX !== null)) {
                return;
            }
            if (event.type === 'mouseup' || touch1) {
                this.touchEndX = event.type === 'mouseup' ? event.screenX : (_a = touch1 === null || touch1 === void 0 ? void 0 : touch1.screenX) !== null && _a !== void 0 ? _a : 0;
                this.touchEndY = event.type === 'mouseup' ? event.screenY : (_b = touch1 === null || touch1 === void 0 ? void 0 : touch1.screenY) !== null && _b !== void 0 ? _b : 0;
                this.fire('panend', event);
                clearTimeout((_c = this.longPressTimer) !== null && _c !== void 0 ? _c : undefined);
                const x = this.touchEndX - ((_d = this.touchStartX) !== null && _d !== void 0 ? _d : 0);
                const absX = Math.abs(x);
                const y = this.touchEndY - ((_e = this.touchStartY) !== null && _e !== void 0 ? _e : 0);
                const absY = Math.abs(y);
                const distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
                const absDistance = Math.abs(distance);
                const diagonal = absY / absX;
                if (absX > this.thresholdX ||
                    absY > this.thresholdY ||
                    (this.opts.diagonalSwipes && (absDistance > this.thresholdX || absDistance > this.thresholdY))) {
                    this.swipedHorizontal = absX > this.thresholdX || (this.opts.diagonalSwipes && absDistance > this.thresholdX);
                    this.swipedVertical = absY > this.thresholdY || (this.opts.diagonalSwipes && absDistance > this.thresholdY);
                    if (!this.opts.diagonalSwipes ||
                        diagonal < Math.tan(((45 - this.opts.diagonalLimit) * Math.PI) / 180) ||
                        diagonal > Math.tan(((45 + this.opts.diagonalLimit) * Math.PI) / 180)) {
                        if (absX >= absY) {
                            this.swipedVertical = false;
                        }
                        if (absY > absX) {
                            this.swipedHorizontal = false;
                        }
                    }
                    if (this.swipedHorizontal) {
                        if (x < 0) {
                            if (((_f = this.velocityX) !== null && _f !== void 0 ? _f : 0) < -this.opts.velocityThreshold || distance < -this.disregardVelocityThresholdX) {
                                this.fire('swipeleft', event);
                            }
                        }
                        else {
                            if (((_g = this.velocityX) !== null && _g !== void 0 ? _g : 0) > this.opts.velocityThreshold || distance > this.disregardVelocityThresholdX) {
                                this.fire('swiperight', event);
                            }
                        }
                    }
                    if (this.swipedVertical) {
                        if (y < 0) {
                            if (((_h = this.velocityY) !== null && _h !== void 0 ? _h : 0) < -this.opts.velocityThreshold || distance < -this.disregardVelocityThresholdY) {
                                this.fire('swipeup', event);
                            }
                        }
                        else {
                            if (((_j = this.velocityY) !== null && _j !== void 0 ? _j : 0) > this.opts.velocityThreshold || distance > this.disregardVelocityThresholdY) {
                                this.fire('swipedown', event);
                            }
                        }
                    }
                }
                else if (absX < this.opts.pressThreshold && absY < this.opts.pressThreshold) {
                    if (this.doubleTapWaiting) {
                        this.doubleTapWaiting = false;
                        clearTimeout((_k = this.doubleTapTimer) !== null && _k !== void 0 ? _k : undefined);
                        this.fire('doubletap', event);
                    }
                    else {
                        this.doubleTapWaiting = true;
                        this.doubleTapTimer = setTimeout(() => (this.doubleTapWaiting = false), this.opts.doubleTapTime);
                        this.fire('tap', event);
                    }
                }
            }
            if (!this.touch1 && !this.touch2) {
                this.fire('pinchend', event);
                this.fire('rotateend', event);
                this.originalDistance = null;
                this.newDistance = null;
                this.scale = null;
                this.originalAngle = null;
                this.newAngle = null;
                this.rotation = null;
            }
        }
    }
    TinyGesture.defaults = {
        threshold: (type, _self) => Math.max(25, Math.floor(0.15 *
            (type === 'x'
                ? window.innerWidth || document.body.clientWidth
                : window.innerHeight || document.body.clientHeight))),
        velocityThreshold: 10,
        disregardVelocityThreshold: (type, self) => Math.floor(0.5 * (type === 'x' ? self.element.clientWidth : self.element.clientHeight)),
        pressThreshold: 8,
        diagonalSwipes: false,
        diagonalLimit: 15,
        longPressTime: 500,
        doubleTapTime: 300,
        mouseSupport: true,
    };
    let passiveIfSupported = false;
    try {
        window.addEventListener('test', null, Object.defineProperty({}, 'passive', {
            get: function () {
                passiveIfSupported = { passive: true };
            },
        }));
    }
    catch (err) { }

    FrontBx.set('TinyGesture', TinyGesture);

})();
(function()
{
    /**
     * Helper functions
     * 
     * @var {Function}
     */
    const [find, find_all, each, dom_element, add_class, toggle_class, on, off, has_class, remove_class, remove_from_dom, css, height, width, preapend, scroll_pos, animate_css, rendered_style] = FrontBx.import(['find','find_all','each','dom_element','add_class','toggle_class','on','off','has_class','remove_class','remove_from_dom', 'css', 'height', 'width', 'preapend', 'scroll_pos', 'animate_css', 'rendered_style']).from('_');

    /**
     * Default options
     * 
     * @var {obj}
     */
    var DEFAULT_OPTIONS =
    {
        // Content - can be a node, nodelist, or string of HTML
        content: '',
        
        // Overlay color - dark, light, none,
        overlay: 'dark',

        // Force overlay on persistent drawer
        persistentOverlay: false,

        // When true allows swiping on screen to hide/show
        swipeable: false,

        // When keepEdge is true, the default state to set "expanded"|"collapsed"
        state: 'expanded',

        // Where the drawer comes from - left,right,top,bottom
        direction: 'left',

        // Collapses to icon size
        peekable: false,

        // Adapt body body
        persistent: false,

        // Responsive
        responsive: false,

        // Push body instead of changing width
        pushbody: false,

        // Animiation time
        animationTime: 250,

        // Animation easing
        easing: 'easeOut',

        // HTML initialized
        fromHTML: false,
        
        // Additional classes to apply to wrapper
        classes: '',

        // State callbacks
        callbackBuilt:    () => { },
        callbackRender:   () => { },
        callbackClose:    () => { },
        callbackOpen:     () => { },
        callbackValidate: () => true,
    };

    /**
     * Closing arrow icons.
     * 
     * @var {obj}
     */
    const PUSH_ARROWS =
    {
        left: 'left',
        right: 'right',
        top: 'up',
        bottom: 'down'
    };

    /**
     * Swipe open/close directions.
     * 
     * @var {obj}
     */
    const SWIPE_DIRECTIONS =
    {
        left: ['swiperight', 'swipeleft'],
        right: ['swipeleft', 'swiperight'],
        top:  ['swipedown', 'swipeup'],
        bottom: ['swipeup', 'swipedown'],
    };

    /**
     * Don't double wrap body.
     * 
     * @var {boolean}
     */
    var WRAPPED_BODY = false;

    /**
     * Don't double wrap body.
     * 
     * @var {boolean}
     */
    var WRAPPED_DRAWERS = 0;

    /**
     * Module constructor
     *
     * @class
     * @params {options} obj
     * @access {public}
     */
    const Drawer = function(options)
    { 
        // Merge options
        this._options = {...DEFAULT_OPTIONS, ...options};

        if (!SWIPE_DIRECTIONS[this._options.direction]) throw new Error('Unsupported direction.');

        if (this._options.peekable) this._options.persistent = true;

        if (this._options.pushbody)
        {
            this._options.persistent = true;

            this._options.peekable = false;
        }

        // Save state
        this._state = this._options.state;

        // Animating
        this._animating = false;

        // Already mounted?
        this._mounted = false;

        // Initial mount
        this._animateOnMount = typeof this._options.animateOnMount === 'undefined' ? this._state === 'expanded' && !this._options.fromHTML : this._options.animateOnMount;

        // Do we have an overlay
        this._hasOverlay = !this._options.persistent || (this._options.persistent && this._options.persistentOverlay);

        // Cache resize throttle
        this._resizeThrottle = throttle(() => this.resize(), 100);

        // Build the drawer
        this._build();

        // Render the drawer        
        this._mount();

        // Add listeners
        this._bindListeners();

        return this;
    }

    /**
     * Is drawer open?
     *
     * @access {public}
     * @return {Boolean}
     */
    Drawer.prototype.opened = function()
    {
        return this._state === 'expanded';
    }

    /**
     * Is drawer closed?
     *
     * @access {public}
     * @return {Boolean}
     */
    Drawer.prototype.closed = function()
    {
        return this._state === 'collapsed';
    }

    /**
     * Is drawer open or closed?
     *
     * @access {public}
     * @return {String}
     */
    Drawer.prototype.state = function()
    {
        return this._state;
    }

    /**
     * Returns drawer direction.
     *
     * @access {public}
     * @return {String}
     */
    Drawer.prototype.direction = function()
    {
        return this._options.direction;
    }

    /**
     * Window resize handler
     *
     * @access {public}
     */
    Drawer.prototype.resize = function()
    {
        if (this._animating) return;

        let x = width(window);

        if (x < 768 && this.opened())
        {
            this.close();
        }
        else if (x > 768 && this.closed())
        {
            this.open();
        }
    }

    /**
     * Destroy drawer.
     *
     * @access {public}
     */
    Drawer.prototype.destroy = function()
    {
        // Close
        this.close();

        // Remove gestures
        this._gestures.destroy();

        // Unwrap body
        if (this._options.persistent) this._unwrapBody();

        if (this._options.responsive && this._options.persistent) 
        {
            off(window, 'resize', this._resizeThrottle, this);
        }

        if (WRAPPED_DRAWERS <= 0)
        {
            remove_from_dom(this._containerWrap);
        }
        else
        {
            if (this._hasOverlay) remove_from_dom(this._overlay);

            remove_from_dom(this._drawer);
        }
    }

    /**
     * Close drawer.
     *
     * @access {public}
     */
    Drawer.prototype.open = function()
    {
        // Don't open when animating or not already closed
        if (this._state !== 'collapsed' || this._animating) return;

        this._animating = true;

        remove_class(this._containerWrap, 'closed, closing');

        add_class(this._containerWrap, 'opening');

        remove_class(this._drawer, 'disabled');

        this._animteDrawer();

        if (this._hasOverlay)
        {
            add_class(document.body, 'no-scroll');

            this._animateOverlay();
        }

        if (this._options.pushbody) add_class(document.body, 'no-scroll');

        if (this._options.persistent) this._animateBody();

        if (!this._mounted) this._toggleEnd();
    }

    /**
     * Open drawer.
     *
     * @access {public}
     */
    Drawer.prototype.close = function()
    {
        if (this._state !== 'expanded' || this._animating) return;

        this._animating = true;

        add_class(this._containerWrap, 'closing');

        remove_class(this._containerWrap, 'expanded, opening');

        remove_class(document.body, 'no-scroll');

        this._animteDrawer();

        if (this._hasOverlay) this._animateOverlay();

        if (this._options.persistent) this._animateBody();

        if (!this._mounted) this._toggleEnd();
    }

    /**
     * Wrap body when 'persistent' true.
     *
     * @access {private}
     */
    Drawer.prototype._animteDrawer = function()
    {
        let peekable  = this._options.peekable;
        let state     = this._state;
        let direction = this._options.direction;
        let duration  = this._options.animationTime;
        let easing    = this._options.easing;
        let property  = peekable ? (direction === 'left' || direction === 'right' ? 'width' : 'height') : 'transform';
        let to        = peekable ? (state === 'collapsed' ? this._drawerSize : this._peekableSize) : 'translate3d(0px, 0px, 0px)';
        let from      = peekable ? (state === 'collapsed' ? this._peekableSize : 'auto') : null;

        if (peekable && state === 'collapsed' && (direction === 'top' || direction === 'bottom'))
        {
            to = this._drawerSize;
        }

        if (!peekable)
        {
            let x = (direction === 'left' || direction === 'right') ? (direction === 'left' ? '-100%' : '100%') : '0px';
            let y = (direction === 'top' || direction === 'bottom') ? (direction === 'top' ? '-100%' : '100%') : '0px';
            let tofrom = `translate3d(${x}, ${y}, 0px)`;

            state === 'expanded' ? to = tofrom : from = tofrom;
        }

        (this._mounted || (!this._mounted && this._animateOnMount)) ? animate_css(this._drawer, {property, from, to, duration, easing, callback: () => this._toggleEnd() }) : css(this._drawer, property, to);
    }

    /**
     * Wrap body when 'persistent' true.
     *
     * @access {private}
     */
    Drawer.prototype._animateOverlay = function()
    {
        let duration  = this._options.animationTime;
        let easing    = this._options.easing;
        let property  = 'opacity';
        let to        = this._state === 'collapsed' ? '1' : '0';
        let from      = this._state === 'collapsed' ? '0' : '1';

        (this._mounted || (!this._mounted && this._animateOnMount)) ? animate_css(this._overlay, {property, from, to, duration, easing }) : css(this._overlay, property, to);
    }

    /**
     * Wrap body when 'persistent' true.
     *
     * @access {private}
     */
    Drawer.prototype._animateBody = function()
    {
        if (!this._options.persistent) return;

        let peekable  = this._options.peekable;
        let state     = this._state;
        let direction = this._options.direction;
        let duration  = this._options.animationTime;
        let easing    = this._options.easing;
        let property  = 'margin';
        let n, e, s, w;
        n = e = s = w = '0px';

        if (direction === 'left')   w = state === 'collapsed' ? this._drawerSize  : (peekable ? this._peekableSize : '0px');
        if (direction === 'right')  e = state === 'collapsed' ? this._drawerSize  : (peekable ? this._peekableSize : '0px');
        if (direction === 'top')    n = state === 'collapsed' ? `${height(this._drawer)}px` : (peekable ? this._peekableSize : '0px');

        let to = `${n} ${e} ${s} ${w}`;

        if (this._options.pushbody)
        {
            property = 'transform';
            to = 'translate3d(0px, 0px, 0px)';

            if (state === 'collapsed')
            {
                let x, y;
                x = y = '0px';
                if (e !== '0px') x = `-${e}`;
                if (w !== '0px') x = w;
                if (n !== '0px') y = n;
                to = `translate3d(${x}, ${y}, 0px)`;
            }
        }

        (this._mounted || (!this._mounted && this._animateOnMount)) ? animate_css(this._bodyWrap, {property, to, duration, easing }) : css(this._bodyWrap, property, to);
    }

    /**
     * Completed opening / closing.
     *
     * @access {private}
     */
    Drawer.prototype._toggleEnd = function()
    {        
        // Multiple transitions
        if (!this._animating) return;

        this._state = this._state === 'collapsed' ? 'expanded' : 'collapsed';

        add_class(this._containerWrap, this._state === 'expanded' ? 'expanded' : 'closed');

        remove_class(this._containerWrap, this._state === 'expanded' ? 'opening' : 'closing');

        this._makeCallback(this._state === 'expanded' ? this._options.callbackOpen : this._options.callbackClose);

        this._animating = false;
    }

    /**
     * Build DOM Elements for drawer.
     *
     * @access {private}
     */
    Drawer.prototype._build = function()
    {
        let container = dom_element({tag: 'div', class: `js-drawer-container drawer-container drawer-${this._options.direction} ${this._options.persistent ? 'persistent' : ''} ${this._options.peekable ? 'peekable' : null } overlay-${this._options.overlay} ${this._options.classes}`});
        let overlay   = dom_element({tag: 'div', class: 'js-drawer-overlay drawer-overlay'}, !this._hasOverlay ? null : container);
        let drawer    = dom_element({tag: 'aside', class: 'js-drawer-wrap drawer-wrap'}, container, 
            dom_element({tag: 'div', class: 'drawer-dialog js-drawer-dialog' }, null, this._options.content )
        );

        this._containerWrap = container;
        this._drawer        = drawer;
        this._overlay       = overlay;
        this._dialog        = find('.js-drawer-dialog', this._drawer);

        if (this._options.persistent)
        {
            let header = dom_element({tag: 'div', class: `flex-row-fluid align-cols-center-y drawer-header ${this._options.direction !== 'right' ? 'align-cols-right' : ''}`});
            let closer = dom_element({tag: 'button', type: 'button', class: 'btn btn-pure btn-circle btn-xs close-btn'}, header, dom_element({tag: 'span', class: `fa fa-chevron-${PUSH_ARROWS[this._options.direction]}`}));
            
            this._options.direction === 'top' ? this._dialog.appendChild(header) : preapend(header, this._dialog);

            on(closer, 'click', this._closeValidate, this);
        }

        this._makeCallback(this._options.callbackBuilt);
    }

    /**
     * Mount and render the drawer.
     *
     * @access {private}
     */
    Drawer.prototype._mount = function()
    {
        document.body.appendChild(this._containerWrap);

        this._containerWrap.offsetHeight;

        this._peekableSize = this._options.peekableSize || rendered_style(this._containerWrap, '--fbx-drawer-size-peekable');
        this._drawerSize   = this._options.drawerSize || rendered_style(this._containerWrap, '--fbx-drawer-width');

        if (this._options.persistent) this._wrapBody();

        this._state = this._state === 'expanded' ? 'collapsed' : 'expanded';

        this._state === 'collapsed' ? this.open() : this.close();

        this._mounted = true;

        this._makeCallback(this._options.callbackRender);
    }

    /**
     * Wrap body when 'persistent' true.
     *
     * @access {private}
     */
    Drawer.prototype._wrapBody = function()
    {
        WRAPPED_DRAWERS++;

        // Don't double-wrap body
        if (WRAPPED_BODY)
        {
            // Disable other drawers
            each(find_all('.js-drawer-wrap'), (i, drawer) => add_class(drawer, 'disabled'));

            let classN = this._containerWrap.className;

            if (this._containerWrap.parentNode) this._containerWrap.parentNode.removeChild(this._containerWrap);

            this._containerWrap = find('.js-drawer-container');

            this._bodyWrap = find('.js-drawer-body-wrap');

            this._containerWrap.className = classN;

            this._containerWrap.appendChild(this._drawer);

            return;
        }

        WRAPPED_BODY = true;

        let pos = scroll_pos();

        let content = find_all('body > *');

        this._bodyWrap = dom_element({tag: 'div', class: 'js-drawer-body-wrap drawer-body-wrap'});

        preapend(this._bodyWrap, this._containerWrap);
        
        each(content, (i, node) => node !== this._containerWrap ? this._bodyWrap.appendChild(node) : null);

        this._containerWrap.scrollTo(pos.left, pos.top);
    }

    /**
     * Unwrap body when 'persistent' true.
     *
     * @access {private}
     */
    Drawer.prototype._unwrapBody = function()
    {
        if (!WRAPPED_BODY) return;

        WRAPPED_DRAWERS--;

        // Only unwrap if we're the last drawer using the container.
        if (WRAPPED_DRAWERS <= 0)
        {
            let pos = scroll_pos(this._containerWrap);

            let content = find_all('> *', this._bodyWrap);

            each(content, (i, node) => document.body.appendChild(node));
           
            window.scrollTo(pos.left, pos.top);

            WRAPPED_BODY = false;
        }
    }

    /**
     * Validate closing.
     *
     * @access {private}
     */
    Drawer.prototype._closeValidate = function()
    {
        if (this._makeCallback(this._options.callbackValidate)) this.close();
    }

    /**
     * Bind event listeners for drawer.
     *
     * @access {private}
     */
    Drawer.prototype._bindListeners = function()
    {
        if (!this._options.fromHTML) 
        {
            let context = this._options.persistent ? this._drawer : this._containerWrap;
            
            FrontBx.dom().refresh(context);
        }

        if (this._options.responsive && this._options.persistent) 
        {
            on(window, 'resize', this._resizeThrottle, this);
        }

        on(this._overlay, 'click', this._closeValidate, this);

        let directions = SWIPE_DIRECTIONS[this._options.direction];

        this._gestures = FrontBx.TinyGesture(this._options.swipeable ? window : this._drawer, { mouseSupport: true, velocityThreshold: 3, threshold: (type, self) => this._options.swipeable ? 20 : 3 });

        this._gestures.on(directions[0], () => this.open() );

        this._gestures.on(directions[1], () => this._closeValidate() );
    }

    /**
     * Fire callbacks.
     *
     * @access {private}
     */
    Drawer.prototype._makeCallback = function(callback)
    {
        if (callback) return callback(this._containerWrap, this._drawer, this._overlay, this._bodyWrap);
    }

    // Load into container 
    FrontBx.set('Drawer', Drawer);

})();
(function()
{
    /**
     * Helper functions
     * 
     * @var {Function}
     */
    const [on, find, dom_element, extend] = FrontBx.import(['on','find','dom_element','extend']).from('_');

    /**
     * Helper functions
     * 
     * @var {Function}
     */
    const Drawer = FrontBx.Drawer(FrontBx.IMPORT_AS_REF);

    /**
     * @var {obj}
     */
    var DEFAULT_OPTIONS =
    {
        // Content - can be a node, nodelist, or string of HTML
        content: '',

        // Confirm button text or null + confirm button class
        confirmBtn: null,
        confirmClass: '',
        
        // Overlay color - "dark"| "light"
        overlay: 'dark',

        // Allows collapsing,expanding
        peekable: false,

        // When true allows swiping on screen to hide/show
        swipeable: false,

        // When keepEdge is true, the default state to set "expanded"|"collapsed"
        state: 'expanded',

        // Private
        animationTime: 225,
        persistentOverlay: true,
        direction: 'bottom',
        classes: '',
        persistent: false,

        // State callbacks
        callbackBuilt:    () => { },
        callbackRender:   () => { },
        callbackConfirm:  () => { },
        callbackClose:    () => { },
        callbackOpen:     () => { },
        callbackValidate: () => true,
    };

    /**
     * Module constructor
     *
     * @class
     * @params {options} obj
     * @access {public}
     * @return {this}
     */
    const Frontdrop = function(options)
    {
        let classes = options.confirmBtn ? `frontdrop with-confirmation ${options.classes}` : `frontdrop ${options.classes}`;

        options = {...DEFAULT_OPTIONS, ...options, classes};

        let content = this._buildFD(options);

        options = {...options, content};

        this.super(options);

        if (options.confirmBtn) on(find('.js-frontdrop-confirm', content), 'click', this._closeValidate, this);
    }

    /**
     * Build the frontdrop and overlay.
     *
     * @access {private}
     */
    Frontdrop.prototype._buildFD = function(options)
    {
        let footer = options.confirmBtn ? dom_element({tag: 'div', class: 'card-footer'}, null, 
            dom_element({tag: 'div', class: 'card-footer'}, null,
                dom_element({tag: 'div', class: 'card-footer-content'}, null,
                    dom_element({tag: 'div', class: 'container-fluid'}, null,
                        dom_element({tag: 'button', type: 'button', class: `btn btn-block js-frontdrop-confirm ${options.confirmClass}`}, null, options.confirmBtn)
                    )
                )
            )
        ) : null;

        return dom_element({tag: 'div', class: 'card js-frontdrop-inner'}, null,
        [ 
            dom_element({tag: 'div', class: 'card-header'}, null,
                dom_element({tag: 'div', class: 'container-fluid'}, null, 
                    dom_element({tag: 'div', class: 'card-header-content'}, null,
                        dom_element({tag: 'div', class: 'card-title'}, null, options.title)
                    )
                )
            ),
            dom_element({tag: 'div', class: 'card-block'}, null, 
                dom_element({tag: 'div', class: 'container-fluid'}, null, options.content)
            ),
            footer
        ])
    }

    // Load into container 
    FrontBx.set('Frontdrop', extend(Drawer, Frontdrop));

})();
(function()
{
    /**
     * Helper functions
     * 
     * @var {Function}
     */
    const [on, find, dom_element, extend] = FrontBx.import(['on','find','dom_element','extend']).from('_');

    /**
     * Helper functions
     * 
     * @var {Function}
     */
    const Drawer = FrontBx.Drawer(FrontBx.IMPORT_AS_REF);

    /**
     * Module constructor
     *
     * @class
     * @params {options} obj
     * @access {public}
     * @return {this}
     */
    const Backdrop = function(options)
    {
        let classes = !options.classes ? 'backdrop' : `backdrop ${options.classes}`;

        let persistent = true;

        options = {...options, classes, persistent };

        this.super(options);
    }

    // Load into container 
    FrontBx.set('Backdrop', extend(Drawer, Backdrop));
})();
(function()
{
    /**
     * Helper functions
     * 
     * @var {Function}
     */
    const [find, dom_element, add_class, on, off, remove_class, remove_from_dom, hide_aria, show_aria] = FrontBx.import(['find','dom_element','add_class','on','off','remove_class','remove_from_dom','hide_aria','show_aria']).from('_');

    /**
     * Default options
     * 
     * @var {obj}
     */
    var DEFAULT_OPTIONS =
    {
        // Title
        title: '',

        // Content - can be a node, nodelist, or string of HTML
        content: '',

        // Additional classes to pass to modal
        classes: '',

        // Does not create card
        custom: false,

        // Click anywhere to close
        closeAnywhere: true,

        // Scroll 'content' or 'modal'
        scroll: 'modal',

        // Cancel btn
        cancelBtn: null,
        cancelClass: 'btn-danger btn-pure',

        // Confirm btn
        confirmBtn: null,
        confirmClass: 'btn-pure',
        
        // Overlay color - dark, light, none,
        overlay: 'dark',

        // Default state when created/mounted set "open"|"closed"
        state: 'open',

        // Loaded from HTML DOM
        fromHTML: false,

        // State callbacks
        callbackBuilt:    () => { },
        callbackRender:   () => { },
        callbackClose:    () => { },
        callbackOpen:     () => { },
        callbackValidate: () => true,
    };

    /**
     * Module constructor
     *
     * @class
     * @params {options} obj
     * @access {public}
     */
    const Modal = function(options)
    { 
        // Merge options
        this._options = {...DEFAULT_OPTIONS, ...options};

        // Save state
        this._state = this._options.state;

        // Animating
        this._animating = false;

        // Build the Modal
        this._build();

        // Add listeners
        this._bindListeners();

        // Render the Modal        
        this._mount();

        return this;
    }

    /**
     * Is Modal open?
     *
     * @access {public}
     * @return {Boolean}
     */
    Modal.prototype.opened = function()
    {
        return this._state === 'open';
    }

    /**
     * Is Modal closed?
     *
     * @access {public}
     * @return {Boolean}
     */
    Modal.prototype.closed = function()
    {
        return this._state === 'closed';
    }

    /**
     * Is Modal open or closed?
     *
     * @access {public}
     * @return {String}
     */
    Modal.prototype.state = function()
    {
        return this._state;
    }

    /**
     * Destroy Modal.
     *
     * @access {public}
     */
    Modal.prototype.destroy = function()
    {
        this.close();

        remove_from_dom(this._modal);

        remove_from_dom(this._overlay);
    }

    /**
     * Close Modal.
     *
     * @access {public}
     */
    Modal.prototype.open = function()
    {
        // Don't open when animating or not already closed
        if (this._state !== 'closed' || this._animating) return;

        this._animating = true;

        on(this._dialog, 'transitionend', this._toggleEnd, this);

        remove_class([this._modal, this._overlay], 'closed, closing');

        add_class([this._modal, this._overlay], 'opening');

        if (this._options.overlay !== false) add_class(document.body, 'no-scroll');

        show_aria([this._modal, this._overlay]);
    }

    /**
     * Open Modal.
     *
     * @access {public}
     */
    Modal.prototype.close = function()
    {
        if (this._state !== 'open' || this._animating) return;

        this._animating = true;

        on(this._dialog, 'transitionend', this._toggleEnd, this);

        remove_class([this._modal, this._overlay], 'opening, opened');

        add_class([this._modal, this._overlay], 'closing');

        remove_class(document.body, 'no-scroll');

        hide_aria([this._modal, this._overlay]);

        this._dialog.blur();
    }

    /**
     * Completed opening / closing.
     *
     * @access {private}
     */
    Modal.prototype._toggleEnd = function()
    {                
        // Multiple transitions
        if (!this._animating) return;

        if (this._state === 'closed') this._dialog.focus();

        this._state = this._state === 'closed' ? 'open' : 'closed';

        remove_class([this._modal, this._overlay], this._state === 'open' ? 'opening' : 'closing');

        add_class([this._modal, this._overlay], this._state === 'open' ? 'opened' : 'closed');

        this._makeCallback(this._state === 'open' ? this._options.callbackOpen : this._options.callbackClose);

        off(this._dialog, 'transitionend', this._toggleEnd, this);

        this._animating = false;
    }

    /**
     * Build DOM Elements for Modal.
     *
     * @access {private}
     */
    Modal.prototype._build = function()
    {
        this._cancelBtn  = this._options.cancelBtn  ? dom_element({tag: 'button', type: 'button', class: `btn ${this._options.cancelClass}`}, null, this._options.cancelBtn) : null; 
        
        this._confirmBtn = this._options.confirmBtn ? dom_element({tag: 'button', type: 'button', class: `btn ${this._options.confirmClass}`}, null, this._options.confirmBtn) : null;
        
        this._overlay = dom_element({tag: 'div', role: 'presentation', class: `modal-overlay closed overlay-${this._options.overlay} ${this._options.overlay === false ? 'disabled' : ''}`});
        
        this._modal    = dom_element({tag: 'div', role: 'presentation', tabindex: '-1', class: `modal-wrap closed scroll-${this._options.scroll} ${this._options.classes}`}, null, 
        dom_element({tag: 'div', class: 'modal-dialog js-modal-dialog'}, null,
            this._options.custom ? this._options.content : dom_element({tag: 'div', class: `card ${this._options.scroll === 'content' ? 'card-scrollable-content' : 'card-scrollable'} `}, null, 
                [
                    dom_element({tag: 'div', class: 'card-header'}, null, 
                        dom_element({tag: 'div', class: 'card-header-content'}, null, 
                            dom_element({tag: 'div', class: 'card-title'}, null, this._options.title)
                        )
                    ),
                    dom_element({tag: 'div', class: 'card-block'}, null, this._options.content),
                    (this._cancelBtn || this._confirmBtn ? 
                        dom_element({tag: 'div', class: 'card-footer'}, null, [ dom_element({tag: 'div', class: 'card-footer-content'}, null, '&nbsp;'),
                            dom_element({tag: 'div', class: 'card-footer-right'}, null, [ this._cancelBtn, this._confirmBtn ])]
                        ) : null)
                ])
            )
        );

        this._dialog = find('.js-modal-dialog', this._modal);

        this._makeCallback(this._options.callbackBuilt);
    }

    /**
     * Mount and render the Modal.
     *
     * @access {private}
     */
    Modal.prototype._mount = function()
    {
        document.body.appendChild(this._overlay);

        document.body.appendChild(this._modal);

        this._modal.offsetHeight;

        this._overlay.offsetHeight;

        if (!this._options.fromHTML) FrontBx.dom().refresh(this._modal);

        if (this._state === 'open')
        {
            this._state = 'closed';

            this.open();
        }
    }

    /**
     * Bind event listeners for Modal.
     *
     * @access {private}
     */
    Modal.prototype._bindListeners = function()
    {
        if (this._options.closeAnywhere) on(this._modal, 'click', this._closeClick, this);

        if (this._cancelBtn) on(this._cancelBtn, 'click', this._closeValidate, this);

        if (this._confirmBtn) on(this._confirmBtn, 'click', this._closeValidate, this);
    }

    /**
     * Validate closing.
     *
     * @access {private}
     */
    Modal.prototype._closeClick = function(e, clicked)
    {
        if (e.target === this._modal) this._closeValidate();
    }

    /**
     * Validate closing.
     *
     * @access {private}
     */
    Modal.prototype._closeValidate = function()
    {
        if (this._makeCallback(this._options.callbackValidate)) this.close();
    }

    /**
     * Fire callbacks.
     *
     * @access {private}
     */
    Modal.prototype._makeCallback = function(callback)
    {
        if (callback) return callback(this._modal, this._Modal, this._overlay, this._bodyWrap);
    }

    // Load into container 
    FrontBx.set('Modal', Modal);

})();
(function()
{
    /**
     * Helper functions
     * 
     * @var {Function}
     */
    const [find, add_class, on, in_dom, remove_class, remove_from_dom, dom_element] = FrontBx.import(['find','add_class','on','in_dom','remove_class','remove_from_dom','dom_element']).from('_');

    /**
     * Default options
     * 
     * @var {array}
     */
    const DEFAULT_OPTIONS =
    {
        text:             '',
        variant:          '',
        icon:             '',
        position:         'bottom',
        timeout:          6000,
        btn:              false,
        btnVariant:       'primary',
        callbackBuilt:    () => {},
        callbackRender:   () => {},
        callbackDismiss:  () => {},        
        callbackValidate: () => { return true; }
    };

    /**
     * Notification
     *
     * The Notification class is a utility class used to
     * display a notification.
     *
     */
    const Notification = function(options)
    {
        this._options = {...DEFAULT_OPTIONS, ...options };

        this._buildNotificationContainer();

        this._build();

        this._render();

        this._bindListeners();
    }

    /**
     * Returns the notification element.
     *
     * @access {public}
     */
    Notification.prototype.domElement = function()
    {
        return this._notification;
    }

    /**
     * Remove the notification.
     *
     * @access {public}
     */
    Notification.prototype.remove = function()
    {
        clearTimeout(this._timeout);

        const wrappper = this._DOMElementWrapper;

        add_class(this._notification, this._animateOutClass);
        
        remove_class(this._notification, this._animateInClass);

        this._makeCallback(this._options.callbackDismiss);

        setTimeout(() =>
        {
            if (wrappper.children.length === 0) remove_class(wrappper, 'active');

            remove_from_dom(this._notification);

        }, 300);
    }

    /**
     * Build the notification container
     *
     * @access {private}
     */
    Notification.prototype._buildNotificationContainer = function()
    {
        this._wrapperClass = `.js-nofification-wrap.position-${this._options.position}`;

        let wrapper = find(this._wrapperClass);

        if (!wrapper)
        {
            wrapper = dom_element({tag: 'div', class: `notification-wrap position-${this._options.position} js-nofification-wrap`}, document.body);
        }

        this._DOMElementWrapper = wrapper;
    }

    /**
     * Build the notification
     *
     * @access {private}
     */
    Notification.prototype._build = function()
    {        
        let options = this._options;

        this._animateInClass = this._animateIn();

        this._animateOutClass = this._animateOut();

        let notif = dom_element({tag: 'div', class: options.variant ? `msg msg-dense msg-${options.variant} ${this._animateInClass}` : `msg msg-dense ${this._animateInClass}` });
        
        if (options.icon)
        {
            dom_element({tag: 'div', class: 'msg-icon' }, notif, dom_element({tag: 'span', class: `fa fa-${options.icon}` }));
        }

        dom_element({tag: 'div', class: 'msg-body'}, notif, dom_element({tag: 'p', innerHTML: options.text }))

        if (options.btn)
        {
            this._btn = dom_element({tag: 'div', class: 'msg-btn' }, notif, dom_element({tag: 'button', class: `btn btn-pure btn-${options.btnVariant} btn-sm js-notif-btn`, innerText: options.btn }));
        }

        this._notification = notif;

        this._makeCallback(this._options.callbackBuilt);
    }

    /**
     * Build the notification
     *
     * @access {private}
     */
    Notification.prototype._animateIn = function()
    {
        if (this._options.position.includes('top')) return 'animate-in-down';

        return 'animate-in-up';
    }

     /**
     * Build the notification
     *
     * @access {private}
     */
    Notification.prototype._animateOut = function()
    {
        if (this._options.position.includes('top')) return 'animate-out-up';

        return 'animate-out-down';
    }

    /**
     * Render the notification.
     *
     * @access {private}
     */
    Notification.prototype._render = function()
    {
        add_class(this._DOMElementWrapper, 'active');

        this._DOMElementWrapper.appendChild(this._notification);

        this._notification.offsetHeight;

        this._makeCallback(this._options.callbackRender);

    }

    /**
     * Render the notification.
     *
     * @access {private}
     */
    Notification.prototype._removeValidate = function()
    {
        if (this._makeCallback(this._options.callbackValidate)) this.remove();
    }

    /**
     * Render the notification.
     *
     * @access {private}
     */
    Notification.prototype._bindListeners = function()
    {
        if (this._options.timeout !== false)
        {
            this._timeout = setTimeout(() => this._removeValidate(), this._options.timeout);
        }

        on(this._notification, 'click', this._removeValidate, this);
    }

    /**
     * Fire callbacks.
     *
     * @access {private}
     */
    Notification.prototype._makeCallback = function(callback,)
    {
        if (callback) return callback(this._notification);
    }

    // Add to container
    FrontBx.set('Notification', Notification);

})();
(function()
{
    /**
     * Helper functions
     * 
     * @var {Function}
     */
    const [find, in_dom, normalize_url, is_string, coordinates, animate] = FrontBx.import(['find','in_dom','normalize_url','is_string','coordinates','animate']).from('_');

    /**
     * Default options
     * 
     * @var {object}
     */
    const DEFAULT_OPTIONS =
    {
        'speed'     : 500,
        'easing'    : 'easeInOutCubic',
        'updateURL' : true,
    };

    /**
     * Smooth scroll to an element or id
     *
     * @access {private}
     */
    function SmoothScroll(nodeOrId, options)
    {
        options = {...DEFAULT_OPTIONS, ...options};

        let DOMElement = is_string(nodeOrId) ? find(nodeOrId) : nodeOrId;

        if (!in_dom(DOMElement)) return;

        let pos = coordinates(DOMElement).top;

        let url = normalize_url(window.location.href);

        let isHashable = is_string(nodeOrId);

        const complete = function()
        {
            window.location.hash = nodeOrId;
        }

        animate(window, { property : 'scrollTo', to: `0, ${pos}`,  easing: options.easing, duration: options.speed, callback: isHashable && options.updateURL ? complete : null});
    }


    // Load into FrontBx DOM core
    FrontBx.set('SmoothScroll', SmoothScroll);

})();
(function()
{
    /**
     * Cached helper functions.
     * 
     * @var {functions}
     */
    const [on, off, _map, is_regexp] = FrontBx.import(['on', 'off', 'map', 'is_regexp']).from('_');

    /**
     * Regex masks
     * 
     * @var {object}
     */
    const MASK_MAP = 
    {
        creditcard: /[0-9]/,
        money: /[0-9.]/,
        numeric: /[0-9]/,
        numericdecimal: /[0-9.]/,
        alphanumeric: /[A-z0-9-]/,
        alphaspace: /[A-z ]/,
        alphadash: /[A-z-]/,
        alphanumericdash: /[A-z0-9-]/,
    };

    /**
     * Credit card formatters.
     * 
     * @var {function}
     */
    const _format_464 = function(cc)
    {
        return [cc.substring(0,4),cc.substring(4,10),cc.substring(10,14)].join(' ').trim()
    };
    const _format_465 = function(cc)
    {
        return [cc.substring(0,4),cc.substring(4,10),cc.substring(10,15)].join(' ').trim()
    };
    const _format_4444 = function(cc)
    {
        return cc?cc.match(/[0-9]{1,4}/g).join(' '):''
    };

    /**
     * Credit card formatting.
     * 
     * @var {object}
     */
    const _CARD_TYPES =
    [
        {'type':'visa','pattern':/^4/, 'format': _format_4444, 'maxlength': 19},
        {'type':'master','pattern':/^((5[12345])|(2[2-7]))/, 'format': _format_4444, 'maxlength': 16},
        {'type':'amex','pattern':/^3[47]/, 'format': _format_465, 'maxlength':15},
        {'type':'jcb','pattern':/^35[2-8]/, 'format': _format_465, 'maxlength':19},
        {'type':'maestro','pattern':/^(5018|5020|5038|5893|6304|6759|676[123])/, 'format': _format_4444, 'maxlength':19},
        {'type':'discover','pattern':/^6[024]/, 'format': _format_4444, 'maxlength':19},
        {'type':'instapayment','pattern':/^63[789]/, 'format': _format_4444, 'maxlength':16},
        {'type':'diners_club','pattern':/^54/, 'format': _format_4444, 'maxlength':16},
        {'type':'diners_club_international','pattern':/^36/, 'format': _format_464, 'maxlength':14},
        {'type':'diners_club_carte_blanche','pattern':/^30[0-5]/, 'format': _format_464, 'maxlength':14}
    ];

    /**
     * Component constructor.
     *
     * @constructor
     * @param       {DOMElement}  element  Input element
     * @param       {string}      mask     Supported mask name or regex filter as string
     * @param       {string}      format   Optional format e.g (xxxx-xxxx-xxxx-xxxx);
     */
    const InputMasker = function(element, mask, format)
    {
        this.DOMElement = element;

        this.maskRegexp = this._getMaskRegexp(mask);

        this.format = !format ? null : this._buildFormatRegexp(format);

        this.maskName = mask;

        this.handler = function(){};

        this._bind();

    }

    /**
     * Disable the mask
     *
     * @access {public}
     */
    InputMasker.prototype.destroy = function()
    {
        off(this.DOMElement, 'input', this.handler);
        off(this.DOMElement, 'paste', this.handler);
    }

    /**
     * Binds input events.
     *
     * @access {private}
     */
    InputMasker.prototype._bind = function()
    {
        var _this      = this;
        var DOMElement = this.DOMElement;
        var maskRegexp = this.maskRegexp;
        var format     = this.format;
        var isCC       = _this.maskName === 'creditcard';

        const _handler = function(e)
        {
            e = e || window.event;

            _this._handle(DOMElement, DOMElement.value, maskRegexp, isCC);
        }

        this.handler = _handler;

        on(this.DOMElement, 'input', _handler);
        on(this.DOMElement, 'paste', _handler);
    }

    /**
     * Get or builds mask regexp.
     *
     * @access {private}
     * @param  {string}  mask
     * @return {RegExp}
     */
    InputMasker.prototype._getMaskRegexp = function(mask)
    {
        if (is_regexp(mask)) return mask;
        
        let regexp = MASK_MAP[mask.replaceAll('-', '').toLowerCase()];

        if (!regexp)
        {
            return new RegExp(mask);
        }

        return regexp;
    }

    /**
     * Builds custom format values.
     *
     * @access {private}
     * @param  {string}  format Formatting string
     * @return {object}
     */
    InputMasker.prototype._buildFormatRegexp = function(format)
    {
        let raw        = format;
        let seperators = format.split('x').filter((x) => x !== '');
        let regexp     = new RegExp(_map(format.split(/[^x]/), (i, x) => x.includes('x') ? `(.{0,${x.length}})` : false ).join(''));
        let prefix     = format.startsWith('x') ? '' : seperators.shift();
        let suffix     = format.endsWith('x') ? '' : seperators.pop();
        let len        = (raw.length -suffix.length);

        return { seperators, regexp, prefix, suffix, raw, len };
    }

    /**
     * Custom format function.
     *
     * @access {private}
     * @param  {string}  str
     * @return {str}
     */
    InputMasker.prototype._formatFilter = function(str)
    {
        // Regex filter
        str = _map(str.split(''), (x, char) => !this.maskRegexp.test(char) ? null : char ).join('');

        // Ignore or no formatting
        if (str === '' || !this.format) return str;

        // Cache seperators
        let { seperators, regexp, prefix, suffix, raw, len } = this.format;

        let splits = _map(str.match(regexp).slice(1), (i, str) => str === '' ? false : str);
        let mapped = _map(splits, function(i, match)
        {
            return i === 0 ? prefix + match : seperators[i-1] + match;
            
        }).join('');

        if (mapped.length === len)
        {
            mapped += suffix;
        }

        return mapped;
    }

    /**
     * Sepcial handler for creditcard
     *
     * @access {private}
     */
    InputMasker.prototype._formatCC = function(cc)
    {           
        cc = cc.replaceAll(/[^0-9]/g, '');

        for(var i in _CARD_TYPES)
        {
            const ct = _CARD_TYPES[i];

            if (cc.match(ct.pattern))
            {
                cc = cc.substring(0, ct.maxlength)
                
                return ct.format(cc);
            }
        }

        cc = cc.substring(0,19);

        return _format_4444(cc);
    }

    /**
     * Handles input event
     *
     * @access {private}
     * @param  {DOMElement} DOMElement
     * @param  {string}     oldval     
     * @param  {RegExp}     maskRegexp 
     * @param  {bool}       isCC 
     */
    InputMasker.prototype._handle = function(DOMElement, oldval, maskRegexp, isCC)
    {
        // Filter
        let newVal = isCC ? this._formatCC(oldval) : this._formatFilter(oldval);

        // Ignore no change
        if (newVal == oldval) return;

        // Set position and format
        var pos          = DOMElement.selectionStart;
        var before_caret = oldval.substring(0, pos);
        before_caret     = isCC ? this._formatCC(oldval) : this._formatFilter(before_caret);
        pos              = before_caret.length;
        
        DOMElement.value = newVal;
        DOMElement.focus();
        DOMElement.setSelectionRange(pos,pos);
    }

    // SET IN IOC
    FrontBx.set('InputMasker', InputMasker);

})();
(function()
{
    /**
     * Helper functions
     * 
     * @var {Function}
     */
    const [find_all, add_class, attr, bool, closest, each, form_inputs, form_values, in_dom, input_value, is_callable, is_empty, remove_class] = FrontBx.import(['find_all','add_class','attr','bool','closest','each','form_inputs','form_values','in_dom','input_value','is_callable','is_empty','remove_class']).from('_');

    /**
     * Validator functions
     *
     * @access {private}
     * @return {boolean}
     */
    const VALIDATORS = 
    {
        email: function(value)
        {
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(value);
        },
        name: function(value)
        {
            var re = /^[A-z _-]+$/;
            return re.test(value);
        },
        numeric: function(value)
        {
            var re = /^[\d]+$/;
            return re.test(value);
        },
        password: function(value)
        {
            var re = /^(?=.*[^a-zA-Z]).{6,40}$/;
            return re.test(value);
        },
        url: function(value)
        {
            re = /^(www\.|[A-z]|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
            return re.test(value);
        },
        alpha: function(value)
        {
            var re = /^[A-z _-]+$/;
            return re.test(value);
        },
        alphanumeric: function(value)
        {
            var re = /^[A-z0-9]+$/;
            return re.test(value);
        },
        list: function(value)
        {
            var re = /^[-\w\s]+(?:,[-\w\s]*)*$/;

            return re.test(value);
        },
        creditcard: function(value)
        {
            /*Amex Card: ^3[47][0-9]{13}$
            BCGlobal: ^(6541|6556)[0-9]{12}$
            Carte Blanche Card: ^389[0-9]{11}$
            Diners Club Card: ^3(?:0[0-5]|[68][0-9])[0-9]{11}$
            Discover Card: ^65[4-9][0-9]{13}|64[4-9][0-9]{13}|6011[0-9]{12}|(622(?:12[6-9]|1[3-9][0-9]|[2-8][0-9][0-9]|9[01][0-9]|92[0-5])[0-9]{10})$
            Insta Payment Card: ^63[7-9][0-9]{13}$
            JCB Card: ^(?:2131|1800|35\d{3})\d{11}$
            KoreanLocalCard: ^9[0-9]{15}$
            Laser Card: ^(6304|6706|6709|6771)[0-9]{12,15}$
            Maestro Card: ^(5018|5020|5038|6304|6759|6761|6763)[0-9]{8,15}$
            Mastercard: ^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$
            Solo Card: ^(6334|6767)[0-9]{12}|(6334|6767)[0-9]{14}|(6334|6767)[0-9]{15}$
            Switch Card: ^(4903|4905|4911|4936|6333|6759)[0-9]{12}|(4903|4905|4911|4936|6333|6759)[0-9]{14}|(4903|4905|4911|4936|6333|6759)[0-9]{15}|564182[0-9]{10}|564182[0-9]{12}|564182[0-9]{13}|633110[0-9]{10}|633110[0-9]{12}|633110[0-9]{13}$
            Union Pay Card: ^(62[0-9]{14,17})$
            Visa Card: ^4[0-9]{12}(?:[0-9]{3})?$
            Visa Master Card: ^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14})$*/

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
        },
        minlength: function(value, min)
        {
            return value.length >= min;
        },
        maxlength: function(value, max)
        {
            return value.length <= max;
        }
    };

    /**
     * FormValidator
     *
     * This class is used to validate a form and 
     * also apply and classes to display form results and input errors.
     *
     */
    const FormValidator = function(form)
    {
        // Save inputs
        this._DOMElementForm = form;
        this._DOMElementsFormFields = find_all('.form-field', form);
        this._inputs = form_inputs(form);

        // Defaults
        this._rulesIndex = [];
        this._invalids   = [];
        this._formObj    = {};

        // Initialize
        this._indexValidations();
    }

    /**
     *  Is the form valid?
     *
     * @access {public}
     * @return {boolean}
     */
    FormValidator.prototype.isValid = function()
    {
        return this._validateForm();
    }

    /**
     * Show invalid inputs
     *
     * @access {public}
     */
    FormValidator.prototype.showInvalid = function()
    {
        this._clearForm();

        each(this._invalids, function(i, input)
        {
            var fieldWrap = closest(input, '.form-field');

            if (in_dom(fieldWrap)) add_class(fieldWrap, 'danger');
        });
    }

    /**
     * Remove errored inputs
     *
     * @access {public}
     */
    FormValidator.prototype.clearInvalid = function()
    {
        this._clearForm();
    }

    /**
     * Show form result
     *
     * @access {public}
     */
    FormValidator.prototype.showResult = function(result)
    {
        this._clearForm();

        add_class(this._DOMElementForm, result);
    }

    /**
     * Append a key/pair and return form obj
     *
     * @access {public}
     * @return {obj}
     */
    FormValidator.prototype.append = function(key, value)
    {
        this._formObj[key] = value;

        let form = this.form();

        return {...form, ...this._formObj};
    };

    /**
     * Get the form object
     *
     * @access {public}
     * @return {obj}
     */
    FormValidator.prototype.form = function()
    {
        return form_values(this._DOMElementForm);
    }

    /**
     * Index form inputs by name and rules
     *
     * @access {public}
     */
    FormValidator.prototype._indexValidations = function()
    {
        each(this._inputs, function(i, input)
        {
            // No name
            if (!input.name) return;

            this._rulesIndex.push(
            {
                node:       input,
                required:   bool(attr(input, 'data-js-required')),
                minlength:  attr(input, 'data-js-min-length'),
                maxlength:  attr(input, 'data-js-max-length'),
                validation: this._validationFunc(attr(input, 'data-js-validation')),
                valid:      true,
            });

        }, this);
    }

    /**
     * Index form inputs by name and rules
     *
     * @access {public}
     */
    FormValidator.prototype._validationFunc = function(name)
    {
        if (!name) return;

        let key = name.replaceAll('-', '').toLowerCase();

        if (!VALIDATORS[key]) throw new error(`Unsupported input validation [${name}].`)

        return VALIDATORS[key];
    }

    /**
     * Validate the form inputs
     *
     * @access {private}
     * @return {boolean}
     */
    FormValidator.prototype._validateForm = function()
    {
        this._invalids = [];
        this._isValid  = true;

        each(this._rulesIndex, function(i, ruleset)
        {
            let input = ruleset.node;
            let value = input_value(ruleset.node);

            // Skip radios, they don't have any validation
            if (input.type === 'radio') return;
            
            if (ruleset.required && is_empty(value))
            {
                this._devalidate(input);
            }
            else if (ruleset.minlength && !VALIDATORS.minlength.call(null, value, ruleset.minlength))
            {
                this._devalidate(input);
            }
            else if (ruleset.maxlength && !VALIDATORS.maxlength.call(null, value, ruleset.maxlength))
            {
                this._devalidate(input);
            }
            else if (is_callable(ruleset.validation) && !ruleset.validation.call(null, value))
            {
                this._devalidate(input);
            }

        }, this);

        return this._isValid;
    }

    /**
     * Mark an input as not valid (internally)
     *
     * @access {private}
     * @return {obj}
     */
    FormValidator.prototype._devalidate = function(node)
    {
        this._isValid = false;

        this._invalids.push(node);
    }

    /**
     * Clear form result and input errors
     *
     * @access {private}
     * @return {obj}
     */
    FormValidator.prototype._clearForm = function()
    {
        // Remove the form result
        remove_class(this._DOMElementForm, ['info', 'success', 'warning', 'danger']);

        // Make all input elements 'valid' - i.e hide the error msg and styles.
        remove_class(this._DOMElementsFormFields, ['info', 'success', 'warning', 'danger']);
    }

    // Load into container
    FrontBx.set('FormValidator', FormValidator);

})();

// dom components
(function()
{
    /**
     * Helper functions
     * 
     * @var {Function}
     */
    const [add_class, animate, attr, css, dom_element, each, find, find_all, _for, is_object, map, nth_siblings, off, on, preapend, remove_class, rendered_style, width, remove_from_dom, inline_style] = FrontBx.import(['add_class','animate','attr','css','dom_element','each','find','find_all','for','is_object','map','nth_siblings','off','on','preapend','remove_class','rendered_style','width','remove_from_dom','inline_style']).from('_');

    /**
     * Default options
     * 
     * @var {Object}
     */
    const DEFAULT_OPTIONS =
    {
        // enable keyboard navigation, pressing left & right keys
        accessibility: true,
        
        // advances to the next cell
        // if true, default is 3 seconds
        // or set time between advances in milliseconds
        // i.e. `autoPlay: 1000` will advance every 1 second
        autoPlay: true,

        // zero-based index of the initial selected cell
        initialIndex: 0,
        
        controls: true,
        // creates and enables buttons to click to previous & next cells

        dots: true,
        // create and enable page dots

        resize: true,
        // listens to window resize events to adjust size & positions

        wrap: true,
        // at end of cells, wraps-around to first for infinite scrolling

        // Group slides
        groupSlides: false,

        pauseOnHover: true,
        // Pauses autoplay on hover

        easing: 'easeOutExpo',
        // Easing pattern

        draggable: true,
        // Draggable

        friction: 0.85,
        // Dragging friction

        mouseSupport: true,
        // Enables dragging with mouse,

        // Minimum swipe distance to be a "swipe"
        threshold: (type, self) => 3,

        // Minimum travel swipe velocity to be considered a "swipe"
        velocityThreshold: 3,
        
    };

    /**
     * Slider.
     *
     * @param {HTMLElement} wrapper Wrapper element
     * @param {Object}      options Options
     */
    const _Slider = function(wrapper, options)
    {
        this.options = is_object(options) ? {...DEFAULT_OPTIONS, ...options } :  {...DEFAULT_OPTIONS };

        this.DOMElementWrapper = wrapper;

        this._animating = false;

        this._playing = 'stopped';

        this._translated = 0;

        this._resizeThrottle = throttle(() => this.resize(), 100);

        this._build();

        this._moveIndexToMiddle();

        this.resize();

        if (this.options.autoPlay) this.play();
    }

    /**
     * Destroy the slider.
     *
     * @access {public}
     */
    _Slider.prototype.destroy = function()
    {
        this.stop();

        if (this._gestures) this._gestures.destroy();

        off(window, 'resize', this._resizeThrottle, this);

        off(this.DOMElementWrapper, 'mouseover', this.pause, this);

        off(this.DOMElementWrapper, 'mouseout', this.unpause, this);

        if (this.options.dots) remove_from_dom(this._dotWrap);

        if (this.options.controls) remove_from_dom([this._righBtn, this._leftBtn]);

        let slides = !this.options.groupSlides ? this._slides : find_all('.slide-group > *', this.DOMElementWrapper);

        each(slides, (i, slide) => this.DOMElementWrapper.appendChild(slide));
    }

    /**
     * Next slide
     *
     * @access {public}
     */
    _Slider.prototype.next = function(animationOrClickEvent)
    {
        // Stop on animating
        if (this._animating || this._dragging) return;

        // Do nothing on non-wrap and at end
        if (!this.options.wrap && this._index === this._slidesIndexs) return;

        // Don't animate
        if (animationOrClickEvent === false) return this._toSlideDirect(this._index +1);

        // Pause autoplay
        this.pause();

        // We're now animating
        this._animating = true;

        // Run animation
        let distance = this._slideWidthWGap;

        if (!this.options.wrap)
        {
            distance += this._translated;
            
            this._translated = distance;
        }

        // Update the index and dots.        
        this._updateIndex(1);
        this._updateDots();

        // Shuffle before animation
        if (this.options.wrap)
        {
            // Adjust pre distance before animation
            let preDistance = this._offset - this._slideWidthWGap;

            this._moved(1);

            css(this._DOMElementViewport, 'left', `-${preDistance}px`);
        }

        animate(this._DOMElementViewport, { transform: `translateX(-${distance}px)`, easing: this.options.easing, duration: 550, complete: () =>
        { 
            if (this.options.wrap)
            {
                css(this._DOMElementViewport, 'left', `-${this._offset}px`);

                css(this._DOMElementViewport, 'transform', `translateX(0px)`);
            }

            if (!this.options.wrap) this._moved(1);

            this._animating = false;

            if (!animationOrClickEvent) this.unpause();
        }});
    }

    /**
     * Previous slide
     *
     * @access {public}
     */
    _Slider.prototype.previous = function(animationOrClickEvent)
    {
        // Stop on animating
        if (this._animating || this._dragging) return;

        // Do nothing on non-wrap and at start
        if (!this.options.wrap && this._index === 0) return;

        // Don't animate
        if (animationOrClickEvent === false) return this._toSlideDirect(this._index +1);

        // Clear timeout
        this.pause();

        // We're now animating
        this._animating = true;

        // Cache distance
        let distance = !this.options.wrap ? (this._translated - this._slideWidthWGap) : this._slideWidthWGap;

        this._translated = distance < 2 ? 0 : distance;

        // Failsafe 
        if (!this.options.wrap) distance = distance < 2 ? 0 : -distance;

        // Update dots and indexes
        this._updateIndex(-1);
        this._updateDots();

        // Shuffle before animation
        if (this.options.wrap)
        {
            // Adjust pre distance before animation
            let preDistance = this._offset + this._slideWidthWGap;

            this._moved(-1);

            css(this._DOMElementViewport, 'left', `-${preDistance}px`);
        }

        // Run animation
        animate(this._DOMElementViewport, { transform: `translateX(${distance}px)`, easing: this.options.easing, duration: 550, complete: () => 
        { 
            if (this.options.wrap)
            {
                css(this._DOMElementViewport, 'left', `-${this._offset}px`);

                css(this._DOMElementViewport, 'transform', `translateX(0px)`);
            }

            this._animating = false;

            if (!animationOrClickEvent) this.unpause();
        } });
    }

    /**
     * Go to slide.
     *
     * @access {public}
     * @param  {integer} slideNum Slide number
     */
    _Slider.prototype.toSlide = function(slideNum, animation, fromClick)
    {
        // Animating
        if (this._animating) return false;

        animation = typeof animation === 'undefined' ? true : animation;

        fromClick = typeof fromClick === 'undefined' ? false : fromClick;

        if (!animation) return this._toSlideDirect(slideNum);

        // convert slide number to index
        let index = slideNum === 1 ? 0 : slideNum-1;

        // Invalid or does nothing
        if (index === this._index || index > this._slidesIndexs || index < 0) return;

        // Go to previous
        if ( (index === (this._index -1) && this._index > 0) || (index === this._slidesIndexs && this._index === 0 && this.options.wrap))
        {
            return this.previous();
        }

        // Go to next
        else if ((index === (this._index + 1) && this._index < this._slidesIndexs) || (index === 0 && this._index === this._slidesIndexs && this.options.wrap))
        {            
            return this.next();
        }

        // We're now animating
        this._animating = true;

        // Clear timeout
        this.pause();

        // Default delta and direction
        let { delta, direction } = this._moveDelta(index);

        // If we're not wrapping we can skip all of this
        if (!this.options.wrap)
        {
            let distance = this._slideWidthWGap * delta;

            distance = direction === -1 ? this._translated - distance : this._translated + distance;
            
            this._translated = distance < 2 ? 0 : distance;

            _for(delta, () => { this._updateIndex(direction) });

            this._updateDots();
            
            animate(this._DOMElementViewport, { transform: `translateX(${distance < 2 ? 0 : -distance}px)`, easing: this.options.easing, duration: 550, complete: () => 
            { 
                this._animating = false;

                if (!fromClick) this.unpause();

            } });

            return;
        }

        // Moving back shifts index forward
        // Moving forwards shifts index back
        let postIndex = direction === -1 ? this._middleIndex + delta : (this._middleIndex - delta) + this._bufferSize;

        // Since we know the new index, we can just calculate how far offset center it is.
        let tmpOffset = (postIndex * this._slideWidthWGap) - (this._viewportWidth / 2) + (this._slideWidth / 2);

        // Run animation
        let distance = this._slideWidthWGap * delta;
        distance  = direction === 1 ? -distance : distance;

        // Shuffle slides
        _for(delta, () => { this._moved(direction); this._updateIndex(direction) }, this);

        // Insert buffer clones
        let clones = this._bufferNodes(direction);

        css(this._DOMElementViewport, 'left', `-${tmpOffset}px`);

        // Run animation
        animate(this._DOMElementViewport, { transform: `translateX(${distance}px)`, easing: this.options.easing, duration: 650, complete: () => 
        { 
            each(clones, (i, clone) =>
            {
                clone.parentNode.removeChild(clone);
            });

            css(this._DOMElementViewport, 'left', `-${this._offset}px`);

            css(this._DOMElementViewport, 'transform', `translateX(0px)`);

            this._animating = false;

            if (!fromClick) this.unpause();

        } });

        this._updateDots();
    }

     /**
     * Go to slide.
     *
     * @access {public}
     * @param  {integer} slideNum Slide number
     */
    _Slider.prototype._toSlideDirect = function(slideNum)
    {
        // convert slide number to index
        let index = slideNum === 1 ? 0 : slideNum-1;

        // Clear timeout
        this.pause();

        // Default delta and direction
        let delta       = index < this._index ? this._index - index : index - this._index;
        let direction   = index < this._index ? -1 : 1;

        // If we're not wrapping we can skip all of this
        if (!this.options.wrap)
        {
            let distance = this._slideWidthWGap * delta;

            distance = direction === -1 ? this._translated - distance : this._translated + distance;
            
            this._translated = distance < 2 ? 0 : distance;

            _for(delta, () => { this._updateIndex(direction) });

            this._updateDots();

            css(this._DOMElementViewport, 'transform',  `translateX(${distance < 2 ? 0 : -distance}px)`);
            
            this.unpause();

            return;
        }

        // Shuffle slides
        _for(delta, () => { this._moved(direction); this._updateIndex(direction) }, this);

        css(this._DOMElementViewport, 'transform', `translateX(0px)`);

        this._updateDots();

        this.unpause();
    }

    /**
     * Window resize handler.
     *
     * @access {private}
     */
    _Slider.prototype.resize = function()
    {
        if (this._slidesCount === 0) return;

        // Is full width, may change with responsive CSS
        this._isFullWidth = parseInt(rendered_style(this._slides[0], 'max-width')) === 100;

        // Viewport width
        this._viewportWidth = Math.round(width(this.DOMElementWrapper));

        // Gap size
        this._gapSize = parseInt(rendered_style(this._DOMElementViewport, 'column-gap'));

        // Slide width
        this._slideWidth = Math.round(width(this._slides[0], this.DOMElementWrapper));

        // Slide width with gap
        this._slideWidthWGap = this._slideWidth + this._gapSize;

        // Offset
        this._offset = Math.round(this.options.wrap ? (this._middleIndex * this._slideWidthWGap) - (this._viewportWidth / 2) + (this._slideWidth / 2) : this._slideWidthWGap - ((this._viewportWidth + this._slideWidth) / 2));

        // Buffer
        if (!this._isFullWidth)
        {
            let percentagWidth  = (100 * this._slideWidth) / this._viewportWidth;
            this._bufferSize    = percentagWidth > 50 ? 3 : Math.round(100 / percentagWidth);            
        }

        // Make offset
        css(this._DOMElementViewport, 'left', `${this._offset === 0 ? 0 : -this._offset}px`);

        // Visible slides
        this._visibleSlides = this._isFullWidth ? 1 : this._viewportWidth / this._slideWidthWGap;

        this._dragBoundryL = this._offset - this._slideWidthWGap;

        this._dragBoundryR = -(this._dragBoundryL);
    }

    /**
     * Start autoplay.
     *
     * @access {public}
     */
    _Slider.prototype.play = function()
    {      
        if (this._playing === 'playing') return;

        // do not play if page is hidden, start playing when page is visible
        let isPageHidden = document.hidden;
        
        if (isPageHidden)
        {
            on(document, 'visibilitychange', this._onVisibilityPlay, this);

            return;
        }

        this._playing = 'playing';

        // listen to visibility change
        on(document, 'visibilitychange', this._onVisibilityChange, this);

        // start ticking
        this._tick();
    }

    /**
     * Stop autoplay.
     *
     * @access {public}
     */
    _Slider.prototype.stop = function()
    {
        this._playing = 'stopped';

        clearTimeout(this._playTimer);
        
        // remove visibility change event
        off(document, 'visibilitychange', this._onVisibilityChange, this);
    }

    /**
     * Pause autoplay.
     *
     * @access {public}
     */
    _Slider.prototype.pause = function()
    {
        if (this._playing === 'playing')
        {
            this._playing = 'paused';
            
            clearTimeout(this._playTimer);
        }
    }

    /**
     * Unpause autoplay.
     *
     * @access {public}
     */
    _Slider.prototype.unpause = function()
    {
        // re-start play if paused
        if (this._playing === 'paused') this.play();
    }

    /**
     * Build the slider.
     *
     * @access {private}
     */
    _Slider.prototype._build = function()
    {
        // Find slides
        this._slides = !this.options.groupSlides ? find_all('> *', this.DOMElementWrapper) : map([...Array(Math.ceil(find_all('> *', this.DOMElementWrapper).length / this.options.groupSlides)).keys()], (i) =>
        {
            // Since we're appending children as we go we're always taking the first n children
            return dom_element({tag: 'div', class: 'slide-group'}, null, find_all('> *', this.DOMElementWrapper).slice(0, this.options.groupSlides));
        });

        // Slides count
        this._slidesCount = this._slides.length;

        // Slide indexes
        this._slidesIndexs = this._slides.length -1;

        // Starting index
        this._index = this.options.initialIndex;

        // Middle index
        this._middleIndex = Math.floor(this._slidesCount / 2);

        // Visible slides
        this._visibleSlides = 1;

        // Buffer size
        this._bufferSize = 0;

        // Create viewport
        this._DOMElementViewport = dom_element({tag: 'div', class: 'slider-viewport js-slider-viewport'}, this.DOMElementWrapper, this._slides);

        // Controls
        if (this.options.controls) this._buildControls();

        // Dots
        this._dots = [];
        if (this.options.dots) this._buildDots();

        // Pause on hover
        if (this.options.autoPlay && this.options.pauseOnHover)
        {
            on(this.DOMElementWrapper, 'mouseover', this.pause, this);

            on(this.DOMElementWrapper, 'mouseout', this.unpause, this);
        }

        // Window resize
        if (this.options.resize)
        {
            on(window, 'resize', this._resizeThrottle, this);
        }

        if (this.options.draggable && this._slidesCount > 1)
        {
            add_class(this.DOMElementWrapper, 'draggable');

            this._bindGestures();
        }

        add_class(this.DOMElementWrapper, 'js-slider');
    }

    /**
     * Start dragging slide.
     *
     * @access {public}
     * @param  {integer} slideNum Slide number
     */
    _Slider.prototype._dragSlide = function(moved)
    {
        let x = this._dragX;

        if (this.options.wrap)
        {
            let nearEnd = (x < 0 && x <= this._dragBoundryR) || (x > 0 && x >= this._dragBoundryL);

            if (nearEnd)
            {
                this._dragCloneSlides();

                return;
            }
        }

        css(this._DOMElementViewport, 'transform', `translateX(${x}px)`);
    }

    /**
     * Go to slide.
     *
     * @access {public}
     * @param  {integer} slideNum Slide number
     */
    _Slider.prototype._dragCloneSlides = function()
    {   
        // No need to clone on non wrapping sliders     
        if (!this.options.wrap) return;

        let distance = this._slideWidthWGap * this._bufferSize;

        // Push out the drag boundaries
        // Drag bondry L remains the same as it is a fixed position from start
        this._dragBoundryR = -((this._slideWidthWGap * (this._bufferSize + this._slidesCount -1)) + (this._slideWidth /2));

        // Adjust the dragging buffer
        this._draggingbuffer = !this._draggingbuffer ? distance : this._draggingbuffer + distance;

        // Resting distance
        distance = this._dragX - distance;

        // Pad sides and clone
        this._bufferDragClones();

        // Adjust drag position
        css(this._DOMElementViewport, 'transform', `translateX(${distance}px)`);
    }

    /**
     * Fake shuffle cloned slides to start or end
     *
     * @access {private}
     */
    _Slider.prototype._bufferDragClones = function()
    {    
        if (!this.options.wrap) return;

        let viewport = this._DOMElementViewport;

        let clones = [];

        _for(this._bufferSize, (i) =>
        {
            let cloneR = find(`> *:nth-child(${this._dragRIndex})`, this._DOMElementViewport).cloneNode(true);
            let cloneL = find(`> *:nth-last-child(${this._dragLIndex})`, this._DOMElementViewport).cloneNode(true);
            add_class([cloneR, cloneL], 'slide-clone');

            this._dragClones.push(cloneR);
            this._dragClones.push(cloneL);

            preapend(cloneL, viewport);

            viewport.appendChild(cloneR);

            this._dragRIndex += 2;

            this._dragLIndex += 2;
        });
    }

    /**
     * Clear drag clones.
     *
     * @access {private}
     */
    _Slider.prototype._clearDragClones = function()
    {
        each(this._dragClones, (i, clone) =>
        {
            this._DOMElementViewport.removeChild(clone);
        });
    }

    _Slider.prototype._restingDragPos = function()
    {
        let ret = { rest: 0, slideIndex: 1 };

        // There would be a smarter way to figure all this out, however have not been able to figure out an easy solution
        let wrapping = this.options.wrap;

        // What distance have we actually moved in total?
        let moved = !wrapping ? Math.abs(this._dragX) - Math.abs(this._offset) : (this._slideWidthWGap * this._middleIndex) + (this._slideWidth / 2)

        if (wrapping) moved = this._dragX < 0 ? moved + Math.abs(this._dragX) : moved - this._dragX;

        // Always first slide
        if (!wrapping && (this._dragX > 0 || moved < 0)) return ret;

        // Get the DOM index of the slide that should be resting
        let index = !wrapping ? Math.ceil(moved / this._slideWidthWGap) : Math.ceil(moved / this._slideWidthWGap) -1;

        // Dragged over the edge on non-wrapping sliders
        if (!wrapping && index > this._slidesIndexs) index = this._slidesIndexs;

        // Get X pos of where target slide starts
        let slideStarts = (index * this._slideWidthWGap) - (this._viewportWidth / 2) + (this._slideWidth / 2);

        // Figure out the resting point
        let rest = this._offset - slideStarts;

        let slideIndex = parseInt(attr(find(`>:nth-child(${index +1})`, this._DOMElementViewport), 'data-index')) +1;

        this._dragMoved = (slideIndex -1) !== this._index;

        if (!wrapping) this._translated = Math.abs(rest);

        return { rest, slideIndex };
    }

    /**
     * Find closest slide on end
     *
     * @access {private}
     */
    _Slider.prototype._onDragEnd = function()
    {
        let { rest, slideIndex } = this._restingDragPos();

        this._dragEndAnim = animate(this._DOMElementViewport, { property: 'transform', from: `translateX(${this._dragX}px)`, to: `translateX(${rest}px)`, duration: 650, easing: this.options.easing, complete: () => 
        {
            if (this._dragClones.length >= 1) this._clearDragClones();

            if (this._dragMoved && this.options.wrap) this.toSlide(slideIndex, false, false);

            if (!this._dragMoved && this.options.wrap) css(this._DOMElementViewport, 'transform', `translateX(0px)`);

            this._index = slideIndex -1;

            this._translated = Math.abs(rest);

            this._updateDots();

            this.unpause();

            this._resetDragVars();
        }} );
    }

    /**
     * Build controls.
     *
     * @access {private}
     */
    _Slider.prototype._resetDragVars = function()
    {
        this._dragClones      = [];
        this._dragRIndex      = 1;
        this._dragLIndex      = 1;
        this._dragging        = false;
        this._dragMoved       = false;
        this._dragStartPointX = { x: 0, y: 0};
        this._dragBoundryL    = this._offset - this._slideWidthWGap;
        this._dragBoundryR    = -(this._dragBoundryL);
        
        delete this._dragX;

        delete this._prevDrag;

        delete this._dragEndAnim;

        delete this._draggingbuffer;
    }

    /**
     * Build controls.
     *
     * @access {private}
     */
    _Slider.prototype._bindGestures = function()
    {
        let wrapper = this.DOMElementWrapper;

        const gestures = FrontBx.TinyGesture(this.DOMElementWrapper, { mouseSupport: this.options.mouseSupport, velocityThreshold: this.options.velocityThreshold, threshold: this.options.threshold });

        this._resetDragVars();

        gestures.on('panstart', (event) =>
        {
            // No drag on transitioning
            if (this._animating) return;

            // Clear timeout
            this.pause();

            // Register start point
            this._dragStartPointX = event.pageX;

            // We have a previous unfinished drag
            if (this._dragEndAnim)
            {
                this._dragEndAnim.stop();

                this._prevDrag = parseFloat(inline_style(this._DOMElementViewport, 'transform').replaceAll(/[^0-9-.]/g, ''));

                delete this._dragEndAnim;
            }

            // Add helper class for optional UI
            add_class(wrapper, 'dragging');
        });

        gestures.on('panmove', (event) =>
        {
            // No drag on transitioning
            if (this._animating) return;

            // Base movement
            let moveVectorX = (event.pageX - this._dragStartPointX);

            // No drag
            if ( Math.abs(moveVectorX) < 3 ) return;

            this._dragging = true;

            // Much slower on non-wrapping sliders when at end or start and going in opposite direction
            if (!this.options.wrap && ( (this._index === 0 && moveVectorX > 0) || (this._index === this._slidesIndexs && moveVectorX < 0) ))
            {
                moveVectorX = moveVectorX * (this.options.friction / 3);
            }
            else
            {
                // Slow down further we drag
                moveVectorX = moveVectorX * this.options.friction;
            }

            // Previous drag
            if (this._prevDrag)
            {
                moveVectorX = this._prevDrag + moveVectorX
            }

            // Non wrap + translated
            else if (!this.options.wrap)
            {
                moveVectorX = moveVectorX - this._translated;
            }

            // Calculate travel distance
            this._dragX = !this._draggingbuffer ? moveVectorX : moveVectorX - this._draggingbuffer;

            // Drag the slide
            this._dragSlide();
        });

        gestures.on('panend', (event) =>
        {
            remove_class(wrapper, 'dragging');

            if (!this._dragX) return this.unpause();

            this._onDragEnd();
        });

        gestures.on('swiperight', (event) =>
        {
            // Don't swipe on animating
            if (this._animating) return;

            // Don't swipe on drags
            if (this._dragEndAnim && this._dragMoved) return;

            // Can't go back
            if (!this.options.wrap && this._index === 0) return;

            // Stop dragend if running
            if (this._dragEndAnim) this._dragEndAnim.stop();

            this._resetDragVars();

            this.previous();
        });
        gestures.on('swipeleft', (event) =>
        {
            // Don't swipe on animating
            if (this._animating) return;

            // Don't swipe on drags
            if (this._dragEndAnim && this._dragMoved) return;
            
            // Can't go forward
            if (!this.options.wrap && this._index === this._slidesIndexs) return;

            // Stop dragend if running
            if (this._dragEndAnim) this._dragEndAnim.stop();

            this._resetDragVars();

            this.next();
        });

        this._gestures = gestures;
    }

    /**
     * Build controls.
     *
     * @access {private}
     */
    _Slider.prototype._buildControls = function()
    {
        // Right button
        this._righBtn = dom_element({tag: 'button', type: 'button', class: 'slider-control control-right btn btn-pure'}, this.DOMElementWrapper, 
            dom_element({tag: 'span',class: 'fa fa-caret-right'})
        );

        // Left button
        this._leftBtn = dom_element({tag: 'button', type: 'button', class: 'slider-control control-left btn btn-pure'}, this.DOMElementWrapper, 
            dom_element({tag: 'span',class: 'fa fa-caret-left'})
        );

        // Handlers
        on(this._righBtn, 'click', this.next, this);
        on(this._leftBtn, 'click', this.previous, this);
    }

    /**
     * Build dots.
     *
     * @access {private}
     */
    _Slider.prototype._buildDots = function()
    {
        let index = this._index;

        this._dotWrap = dom_element({tag: 'div', class: 'slider-dots js-slider-dots'}, this.DOMElementWrapper, map(this._slides, (i, slide) =>
        {
            let active = i === index ? 'active' : '';

            let dot = dom_element({tag: 'button', type: 'button', dataIndex: i, class: `slider-dot js-slider-dot btn btn-circle ${active}`});

            on(dot, 'click', this._dotClick, this);

            this._dots.push(dot);

            return dot;
        }));
    }

     /**
     * Moves indexed slide to middle.
     *
     * @access {private}
     */
    _Slider.prototype._moveIndexToMiddle = function()
    {
        each(this._slides, (i) =>
        {
            attr(this._slides[i], 'data-index', i);
        
        }, this);

        if (!this.options.wrap) return;

        let slide = this._slides[this._index];

        _for(this._slidesCount, (i) =>
        {
            if (nth_siblings(slide) === this._middleIndex) return false;

            preapend(find('> *:last-child', this._DOMElementViewport), this._DOMElementViewport);
        
        }, this);  
    }

    /**
     * On dot click.
     *
     * @access {private}
     */
    _Slider.prototype._dotClick = function(e, dot)
    {
        if (this._animating || this._dragging) return;

        let index = parseInt(attr(dot, 'data-index')) +1;

        this.toSlide(index, true, true);
    }

    /**
     * Update index from previous / next.
     *
     * @access {private}
     * @param  {Integer} direction -1|1
     */
    _Slider.prototype._updateIndex = function(direction)
    {
        if (direction === 1)
        {
            this._index = this._index === this._slidesIndexs ? 0 : this._index + 1;
        }
        else
        {
            this._index = this._index === 0 ? this._slidesIndexs : this._index - 1;
        }
    }

    /**
     * Returns the move delta
     *
     * @access {private}
     * @param  {Integer} direction -1|1
     */
    _Slider.prototype._moveDelta = function(index)
    {
        // Default delta and direction
        let delta       = index < this._index ? this._index - index : index - this._index;
        let direction   = index < this._index ? -1 : 1;
        
        // We only go shortest path if we're wrapping and there's more than 5 slides
        if (this.options.wrap && this._slidesCount > 4)
        {
            if (index > this._index)
            {
                let backN = (this._slidesCount - index) + this._index;

                if (backN < delta)
                {
                    delta = backN;
                    direction = -1;
                }
            }
            else if (index < this._index)
            {
                let forwdN = (this._slidesCount - this._index) + index;

                if (forwdN < delta)
                {
                    delta = forwdN;
                    direction = 1;
                }
            }
        }

        return { delta, direction };
    }

    /**
     * Create buffers cloned nodes.
     *
     * @access {private}
     * @param  {Integer} direction -1|1
     */
    _Slider.prototype._bufferNodes = function(direction)
    {
        let viewport = this._DOMElementViewport;

        return map([...Array(this._bufferSize).keys()], (i) =>
        {
            let clone = find(`> *:nth${direction === -1 ? '-' : '-last-'}child(${i+1})`, viewport).cloneNode(true);

            direction === -1 ? viewport.appendChild(clone) : preapend(clone, viewport);

            return clone;
        });
    }

    /**
     * pause if page visibility is hidden, unpause if visible
     *
     * @access {private}
     */
    _Slider.prototype._onVisibilityChange = function()
    {
        let isPageHidden = document.hidden;
        
        this[ isPageHidden ? 'pause' : 'unpause' ]();
    }

    /**
     * Start playing on page return.
     *
     * @access {private}
     */
    _Slider.prototype._onVisibilityPlay = function()
    {
        this.play();
        
        off(document, 'visibilitychange', this._onVisibilityPlay, this);
    }

    /**
     * Timeout ticker.
     *
     * @access {private}
     */
    _Slider.prototype._tick = function()
    {
        // do not tick if not playing
        if ( this._playing !== 'playing' ) return;

        // default to 3 seconds
        let time = typeof this.options.autoPlay == 'number' ? this.options.autoPlay : 3000;

        // HACK: reset ticks if stopped and started within interval
        clearTimeout(this._playTimer);

        this._playTimer = setTimeout( () =>
        {
            this.next();
            
            this._tick();

        }, time );
    }

    /**
     * Shuffle slides after moved.
     *
     * @access {private}
     * @param  {Integer} direction -1|1
     */
    _Slider.prototype._moved = function(direction)
    {    
        if (!this.options.wrap) return;

        if (direction === 1)
        {
            this._DOMElementViewport.appendChild(find('> *:first-child', this._DOMElementViewport));
        }
        else
        {
           preapend(find('> *:last-child', this._DOMElementViewport), this._DOMElementViewport);
        }
    }

    /**
     * Update active dot after move.
     *
     * @access {private}
     */
    _Slider.prototype._updateDots = function()
    {
        if (!this.options.dots) return;

        remove_class(find('.js-slider-dots .js-slider-dot.active', this.DOMElementWrapper), 'active');

        add_class(this._dots[this._index], 'active');
    }

    // Load into container
    FrontBx.set('_Slider', _Slider);

})();
(function()
{
    /**
     * Component base
     * 
     * @var {Class}
     */
    const [Component] = FrontBx.get('Component');

    /**
     * Helper functions
     * 
     * @var {Function}
     */
    const [attr, each, map, extend, dom_element, json_decode] = FrontBx.import(['attr', 'each', 'map', 'extend', 'dom_element', 'json_decode']).from('_');

    /**
     * Slider instances.
     * 
     * @var {Array}
     */
    const SLIDERS = [];

    /**
     * Dom Slider component.
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.comfrontbx/uimaster/LICENSE}
     */
    const Slider = function()
    {
        this.super('.js-slider');
    }

    /**
     * @inheritdoc
     * 
     */
    Slider.prototype.bind = function(node)
    {
        let options = attr(node, 'data-slider-options');

        options = !options ? {} : json_decode(options);

        SLIDERS.push(FrontBx._Slider(node, options));
    }

    /**
     * @inheritdoc
     * 
     */
    Slider.prototype.unbind  = function(node)
    {
        each(SLIDERS, (i, slider) =>
        {
            if (slider.DOMElementWrapper === node)
            {
                slider.destroy();

                SLIDERS.splice(i, 1);

                return false;
            }
        });
    }

    /**
     * @inheritdoc
     * 
     */
    Slider.prototype.template = function(props)
    {
        return dom_element({tag: 'div', class: 'slider js-slider'}, null, props.slides);
    }

    // Load into FrontBx DOM core
    FrontBx.dom().register('Slider', extend(Component, Slider));
})();
(function()
{
    /**
     * Helper functions
     * 
     * @var {Function}
     */
    const [in_dom, coordinates] = FrontBx.import(['in_dom','coordinates']).from('_');

    /**
     * Popover Handler
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.comfrontbx/uimaster/LICENSE}
     */
    const PopHandler = function(options)
    {
        this.trigger = options.target;
        this.options = options;
        this.el = this.buildPopEl();
        this.el.className = options.classes;
        this.animation = false;
        this.state = 'inactive';

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

            this.state = 'active';

            return this.el;
        }
    }

    /**
     * Build the popover
     *
     * @access {private}
     */
    PopHandler.prototype.buildPopEl = function()
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
    PopHandler.prototype.remove = function()
    {
        if (in_dom(this.el)) this.el.parentNode.removeChild(this.el);

        this.state = 'inactive';
    }

    /**
     * Position the popover
     *
     * @access {public}
     */
    PopHandler.prototype.stylePop = function()
    {
        var tarcoordinates = coordinates(this.options.target);

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

    // Set into container for private use
    FrontBx.set('PopHandler', PopHandler);

})();
(function()
{
    /**
     * Component base
     * 
     * @var {class}
     */
    const [Component] = FrontBx.get('Component');

    /**
     * JS Helper reference
     * 
     * @var {object}
     */
    const [find, find_all, add_class, on, closest, has_class, is_empty, remove_class, off, each, extend] = FrontBx.import(['find', 'find_all', 'add_class', 'on', 'closest', 'has_class', 'is_empty', 'remove_class', 'off', 'each', 'extend']).from('_');

    var HOVER_TIMER;

    var POP_HANDLERS = new Map;

    /**
     * Popover
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.comfrontbx/uimaster/LICENSE}
     */
    const Popover = function()
    {
        this.super('.js-popover');

        this._windowClick = false;

        this.defaultProps = 
        {
            direction: 'top',
            animation: 'pop',
            theme:     'light',
            title:     '',
            content:   '',
            event:     'click',
        };
    }

    /**
     * Initialize the handlers on a trigger
     *
     * @access {private}
     * @param  {DOMElement} trigger Click/hover trigger
     */
    Popover.prototype.template = function(props)
    {

    }

    /**
     * Initialize the handlers on a trigger
     *
     * @access {private}
     * @param  {DOMElement} trigger Click/hover trigger
     */
    Popover.prototype._build = function(options)
    {

    }

    /**
     * Initialize the handlers on a trigger
     *
     * @access {private}
     * @param  {DOMElement} trigger Click/hover trigger
     */
    Popover.prototype.bind = function(trigger)
    {
        if (!this._windowClick)
        {
            on(window, 'click', this._windowClickHandler, this);

            this._windowClick = true;
        }

        let direction = trigger.dataset.popoverDirection;
        let title     = trigger.dataset.popoverTitle;
        let theme     = trigger.dataset.popoverTheme || 'dark';
        let content   = trigger.dataset.popoverContent;
        let evnt      = trigger.dataset.popoverEvent;
        let animation = trigger.dataset.popoverAnimate || 'pop';
        let target    = trigger.dataset.popoverTarget;
        let closeBtn  = evnt === 'click' ? '<button type="button" class="btn btn-sm btn-pure btn-circle js-remove-pop close-btn"><span class="fa fa-xmark"></span></button>' : '';
        let pop       = '<div class="popover-content"><p>' + content + '</p></div>';

        if (title)
        {
            pop = closeBtn + '<h5 class="popover-title">' + title + '</h5>' + pop;
        }

        if (target)
        {
            pop = find('#' + target).cloneNode(true);
            pop.classList.remove('hidden');
        }

        let popHandler = FrontBx.get('PopHandler',
        {
            target: trigger,
            direction: direction,
            template: pop,
            animation: animation,
            classes: 'popover ' + direction + ' ' + theme,
        });

        if (evnt === 'click')
        {
            on(trigger, 'click', this._clickHandler, this);
            on(window, 'resize', this._windowResize, this);
        }
        else
        {                
            on(trigger, 'mouseenter', this._hoverEnter, this);
        }

        POP_HANDLERS.set(trigger, popHandler);
    }

    /**
     * Unbind event listeners on a trigger
     *
     * @param {trigger} node
     * @access {private}
     */
    Popover.prototype.unbind = function(trigger)
    {
        if (this._windowClick)
        {
            off(window, 'click', this._windowClickHandler, this);

            this._windowClick = false;
        }

        var evnt = trigger.dataset.popoverEvent;

        if (evnt === 'click')
        {
            off(trigger, 'click', this._clickHandler, this);
            off(window, 'resize', this._windowResize, this);
        }
        else
        {
            off(trigger, 'mouseenter', this._hoverEnter, this);
            off(trigger, 'mouseleave', this._hoverLeave, this);

            this._killPop(trigger);

            POP_HANDLERS.delete(trigger);
        }
    }

    /**
     * Hover over event handler
     *
     * @access {private}
     */
    Popover.prototype._hoverEnter = function(e, trigger)
    {
        if (has_class(trigger, 'popped')) return;

        let handler = POP_HANDLERS.get(trigger);
        
        let pop = handler.render();

        on(pop, 'mouseenter', this._hoverPop, this);

        on(trigger, 'mouseleave', this._hoverLeave, this);
        
        add_class(trigger, 'popped');
    }

    /**
     * Hover leave event handler
     *
     * @access {private}
     */
    Popover.prototype._hoverLeave = function(e, trigger)
    {
        clearTimeout(HOVER_TIMER);

        // Mouse leaving pop not trigger
        if (!has_class(trigger, '.js-popover'))
        {
            for (let [_trigger, handler] of POP_HANDLERS)
            {
                if (handler.el === trigger) trigger = handler.trigger;
            }
        }

        HOVER_TIMER = setTimeout(() => 
        {
            this._killPop(trigger);

            off(trigger, 'mouseleave', this._hoverLeave, this);

        }, 300);
    }

    /**
     * Hover leave event handler
     *
     * @access {private}
     */
    Popover.prototype._hoverPop = function(e, pop)
    {
        clearTimeout(HOVER_TIMER);

        on(pop, 'mouseleave', this._hoverLeave, this);
    }

    /**
     * Window resize event handler
     *
     * @access {private}
     */
    Popover.prototype._windowResize = function()
    {
        for (let [trigger, handler] of POP_HANDLERS)
        {
            if (handler.state === 'active') handler.stylePop();

        }
    }

    /**
     * Click event handler
     *
     * @param {event|null} e JavaScript click event
     * @access {private}
     */
    Popover.prototype._killPop = function(trigger)
    {            
        let handler = POP_HANDLERS.get(trigger);

        handler.remove();
        
        remove_class(trigger, 'popped');
    }

    /**
     * Click event handler
     *
     * @param {event|null} e JavaScript click event
     * @access {private}
     */
    Popover.prototype._clickHandler = function(e, trigger)
    {
        e = e || window.event;

        e.preventDefault();
        
        var popHandler = POP_HANDLERS.get(trigger);

        if (has_class(trigger, 'popped'))
        {
            this._removeAll(trigger);
            
            popHandler.remove();
            
            remove_class(trigger, 'popped');
        }
        else
        {
            this._removeAll(trigger);
            
            popHandler.render();
            
            add_class(trigger, 'popped');
        }
    }

    /**
     * Remove all popovers when anything is clicked
     *
     * @access {private}
     */
    Popover.prototype._windowClickHandler = function(e)
    {        
        let clicked = e.target;

        // Clicked the close button
        if (has_class(clicked, 'js-remove-pop') || closest(clicked, '.js-remove-pop'))
        {
            this._removeAll();

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

        this._removeAll();
    }

    /**
     * Remove all the popovers currently being displayed
     *
     * @access {private}
     */
    Popover.prototype._removeAll = function(exception)
    {        
        for (let [trigger, handler] of POP_HANDLERS)
        {
            if (!exception || (exception && trigger !== exception))
            {
                handler.remove();

                remove_class(trigger, 'popped');
            }
        }
    }

    // Load into FrontBx DOM core
    FrontBx.dom().register('Popover', extend(Component, Popover));

}());

(function()
{
    /**
     * Creates a chip
     *
     */
    function createChip(options)
    {
        let chip = document.createElement(options.removeable || options.input ? 'SPAN' : 'BUTTON');

        if (options.removeable || options.input) chip.type = 'button';

        chip.className = options.variant ? `btn btn-chip ${options.variant}` : 'btn btn-chip';
        chip.innerText = options.posticon || options.removeable ? `${options.text} ` : options.text;

        if (options.preicon)
        {
            let icon1 = document.createElement('SPAN');
            icon1.className = `fa fa-${options.preicon}`;
            chip.appendChild(icon1);
        }

        if (options.removeable)
        {
            let removeBtn = document.createElement('BUTTON');
            removeBtn.className = 'remove-btn btn-unstyled js-remove-btn';
            removeBtn.ariaLabel = 'remove';
            removeBtn.type = 'button';

            let x = document.createElement('SPAN');
            x.className = 'fa fa-xmark';
            removeBtn.appendChild(x);

            chip.appendChild(removeBtn);
        }
        else if (options.posticon)
        {
            let icon2 = document.createElement('SPAN');
            icon2.className = `fa fa-${options.posticon}`;
            chip.appendChild(icon2);
        }
        
        if (options.input)
        {
            let input = document.createElement('INPUT');
            input.hidden = true;
            input.name   = options.input;
            input.value  = options.text;
            input.setAttribute('value', options.text);

            chip.appendChild(input);
        }

        return chip;
    }

    // Load into FrontBx DOM core
    FrontBx.set('Chip', createChip);

})();
(function()
{
    /**
     * Component base
     * 
     * @var {class}
     */
    const [Component] = FrontBx.get('Component');

    /**
     * Helper functions
     * 
     * @var {Function}
     */
    const [$, $All, add_event_listener, closest, first_children, in_array, input_value, is_empty, remove_event_listener, remove_from_dom, extend] = FrontBx.import(['$','$All','add_event_listener','closest','first_children','in_array','input_value','is_empty','remove_event_listener','remove_from_dom','extend']).from('_');

    /**
     * Chip inputs
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.comfrontbx/uimaster/LICENSE}
     */
    const ChipInputs = function()
    {
        this.super('.js-chips-input');
    }

    /**
     * Init a chips input
     *
     * @access {private}
     * @param  {DOMElement}    _wrapper
     */
    ChipInputs.prototype.bind = function(_wrapper)
    {
        let _input = $('.js-chip-input', _wrapper);

        add_event_listener($All('.js-remove-btn', _wrapper), 'click', this._removeChip);

        add_event_listener(_input, 'keyup', this._onKeyUp, this);

        if (closest(_input, 'form'))
        {
            add_event_listener(_input, 'keydown', this._preventSubmit, this);
        }
    }

    /**
     * Destroy chip listeners
     *
     * @access {private}
     * @param  {DOMElement}    _wrapper
     */
    ChipInputs.prototype.unbind = function(_wrapper)
    {
        var _removeBtns = $All('.btn-chip .js-remove-btn', _wrapper);
        var _input = $('.js-chip-input', _wrapper);

        remove_event_listener(_removeBtns, 'click', this._removeChip);

        remove_event_listener(_input, 'keyup', this._onKeyUp, this);

        if (closest(_input, 'form'))
        {
            remove_event_listener(_input, 'keydown', this._preventSubmit, this);
        }
    }

    /**
     * Prevent the form from submitting if it's part of a form
     *
     * @access {private}
     * @param  {event|null} e
     */
    ChipInputs.prototype._preventSubmit = function(e, input)
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
            if (input.value === '')
            {
                var _wrapper = closest(input, '.js-chips-input');

                this._removeLastChip(_wrapper);
            }
        }
    }

    /**
     * Handle pressing enter to insert the chip
     *
     * @access {private}
     * @param  {event|null} e
     */
    ChipInputs.prototype._onKeyUp = function(e, input)
    {
        e = e || window.event;

        var _key = e.code || e.key || e.keyCode || e.charCode;

        // Enter
        if (_key == 'Enter' || _key === 13)
        {
            var _wrapper = closest(input, '.js-chips-input');

            var _value = input_value(input).trim();

            if (!in_array(_value, this._getChipsValues(_wrapper)) && _value !== '')
            {
                this.addChip(_value, _wrapper);

                input.value = '';
            }
        }
    }

    /**
     * Remove last chip
     *
     * @access {private}
     * @param  {DOMElement}    _wrapper
     */
    ChipInputs.prototype._removeLastChip = function(_wrapper)
    {
        var _chips = $All('.btn-chip', _wrapper);

        if (!is_empty(_chips))
        {
            remove_from_dom(_chips.pop());
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
    ChipInputs.prototype.addChip = function(_value, _wrapper, _icon)
    {
        let chip = FrontBx.Chip({
            text       : _value.trim(),
            removeable : true,
            input      : _wrapper.dataset.inputName,
            variant    : _wrapper.dataset.chipClass,
        });

        _wrapper.insertBefore(chip, first_children(_wrapper).pop());

        add_event_listener($('.js-remove-btn', chip), 'click', this._removeChip);

        FrontBx.dom().refresh('Ripple', _wrapper);
    }

    /**
     * Remove an existing chip
     *
     * @access {private}
     * @param  {event|null} e
     */
    ChipInputs.prototype._removeChip = function(e)
    {
        e = e || window.event;

        e.preventDefault();

        remove_from_dom(closest(this, '.btn-chip'));
    }

    /**
     * Get all values from chip input
     *
     * @access {private}
     * @param  {DOMElement}    _wrapper
     * @return {array}
     */
    ChipInputs.prototype._getChipsValues = function(_wrapper)
    {
        var _result = [];

        var _chips = $All('.btn-chip input', _wrapper);

        for (var i = 0; i < _chips.length; i++)
        {
            _result.push(input_value(_chips[i]));
        }

        return _result;
    }

    // Load into FrontBx DOM core
    FrontBx.dom().register('ChipInputs', extend(Component, ChipInputs));

})();
(function()
{
    /**
     * Component base
     * 
     * @var {class}
     */
    const [Component] = FrontBx.get('Component');

    /**
     * Helper functions
     * 
     * @var {Function}
     */
    const [find, add_class, on, closest, has_class, remove_class, off, attr, css, dom_element, extend] = FrontBx.import(['find','add_class','on','closest','has_class','remove_class','off','attr','css','dom_element','extend']).from('_');

    /**
     * Dropdown Buttons
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.comfrontbx/uimaster/LICENSE}
     */
    const Menu = function()
    {
        this.super('.js-select-menu > *:not(.menu-divider):not(.menu-header), .js-check-menu > *:not(.menu-divider):not(.menu-header), .js-active-menu > *:not(.menu-divider):not(.menu-header)');
    }

    /**
     * @inheritdoc
     * 
     */
    Menu.prototype.bind = function(node)
    {
        on(node, 'click', this._clickHandler, this);
    }

     /**
     * @inheritdoc
     * 
     */
    Menu.prototype.unbind = function(node)
    {
        off(node, 'click', this._clickHandler, this);
    }

    /**
     * Click event handler
     *
     * @param  {event|null} e JavaScript Click event
     * @access {private}
     */
    Menu.prototype._clickHandler = function(e, item)
    {
        // Nothing to do
        if (has_class(item, 'selected') || has_class(item, 'active') || has_class(item, 'checked')) return;

        // Menu and class
        let menu        = closest(item, '.js-select-menu') || closest(item, '.js-check-menu') || closest(item, '.js-active-menu');
        let activeClass = has_class(menu, 'js-select-menu') ? 'selected' : (has_class(menu, 'js-check-menu') ? 'checked' : 'active');
        let selected    = find(`> .${activeClass}`, menu);
        let isCheck     = activeClass === 'checked';
        let content     = item.innerText.trim();
            
        if (selected) remove_class(selected, activeClass);
        
        add_class(item, activeClass);

        if (isCheck)
        {
            if (selected)
            {
                let selectedCheck = find('.item-right .fa.fa-check', selected);

                if (selectedCheck) css(selectedCheck.parentNode, 'display', 'none');
            }
            
            let check = find('.item-right .fa', item);

            if (!check)
            {
                let itemContent = find('.item-body', item);

                if (!itemContent)
                {
                    item.innerText = '';

                    dom_element({tag: 'span', class: 'item-body'}, item, content);
                }

                dom_element({tag: 'span', class: 'item-right'}, item, dom_element({tag: 'span', class: 'fa fa-check'}));
            }
            else
            {
                attr(check.parentNode, 'style', false);
            }
        }
    }

    // Load into FrontBx DOM core
    FrontBx.dom().register('Menu', extend(Component, Menu));

})();
(function()
{
    /**
     * Component base
     * 
     * @var {class}
     */
    const [Component] = FrontBx.get('Component');

    /**
     * Helper functions
     * 
     * @var {Function}
     */
    const [$, add_event_listener, attr, closest, has_class, in_dom, remove_event_listener, remove_from_dom, trigger_event, extend] = FrontBx.import(['$','add_event_listener','attr','closest','has_class','in_dom','remove_event_listener','remove_from_dom','trigger_event','extend']).from('_');

    /**
     * Chip suggestions.
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.comfrontbx/uimaster/LICENSE}
     */
    const ChipSuggestions = function()
    {
        this.super('.js-chip-suggestions .btn-chip');
    }

    /**
     * Bind DOM listeners
     *
     * @access {private}
     */
    ChipSuggestions.prototype.bind = function(node)
    {
        add_event_listener(node, 'click', this._clickHandler);
    }

    /**
     * Unbind DOM listeners
     *
     * @access {private}
     */
    ChipSuggestions.prototype.unbind = function()
    {
        remove_event_listener(node, 'click', this._clickHandler);
    }

    /**
     * Chip click handler
     *
     * @access {private}
     * @param  {event|null} e
     */
    ChipSuggestions.prototype._clickHandler = function(e)
    {
        e = e || window.event;

        e.preventDefault();

        var _wrapper = closest(this, '.js-chip-suggestions');
        var _input   = $('#' + _wrapper.dataset.inputTarget);
        var _text    = this.innerText.trim();

        if (!_input || !in_dom(_input))
        {
            throw new Error('Target node does not exist.');

            return false;
        }

        // Chips input
        if (has_class(_input, '.js-chips-input'))
        {
            FrontBx.dom().component('ChipInputs').addChip(_text, _input);

            remove_from_dom(this);

            return;
        }

        let val = attr(_input, 'value');

        attr(_input, 'value',  val === '' ? _text : `${val} ${_text}`);

        trigger_event(_input, 'change');

        remove_from_dom(this);
    }

    // Load into FrontBx DOM core
    FrontBx.dom().register('ChipSuggestions', extend(Component, ChipSuggestions));

})();
(function()
{
    /**
     * Component base
     * 
     * @var {class}
     */
    const [Component] = FrontBx.get('Component');

    /**
     * Helper functions
     * 
     * @var {Function}
     */
    const [$, add_class, add_event_listener, closest, has_class, remove_class, remove_event_listener, trigger_event, extend] = FrontBx.import(['$','add_class','add_event_listener','closest','has_class','remove_class','remove_event_listener','trigger_event','extend']).from('_');

    /**
     * Choice chips
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.comfrontbx/uimaster/LICENSE}
     */
    const ChoiceChips = function()
    {
        this.super('.js-choice-chips .btn-chip');
    }

    /**
     * Bind DOM listeners
     *
     * @access {private}
     */
    ChoiceChips.prototype.bind = function(node)
    {
        add_event_listener(node, 'click', this._clickHandler);
    }

    /**
     * Unbind DOM listeners
     *
     * @access {private}
     */
    ChoiceChips.prototype.unbind = function(node)
    {
        remove_event_listener(node, 'click', this._clickHandler);
    }

    /**
     * Handle click event on chip
     *
     * @access {private}
     * @param  {event|null} e
     */
    ChoiceChips.prototype._clickHandler = function(e)
    {
        e = e || window.event;

        var _wrapper = closest(this, '.js-choice-chips');

        var _input = $('.js-choice-input', _wrapper);

        if (!has_class(this, 'selected'))
        {                
            remove_class($('.btn-chip.selected', _wrapper), 'selected');

            add_class(this, 'selected');

            if (_input)
            {
                _input.value = this.dataset.value || this.innerText.trim();

                trigger_event(_input, 'input');
                trigger_event(_input, 'change');
            }
        }
    }

    // Load into FrontBx DOM core
    FrontBx.dom().register('ChoiceChips', extend(Component, ChoiceChips));

})();
(function()
{
    /**
     * Component base
     * 
     * @var {class}
     */
    const [Component] = FrontBx.get('Component');

    /**
     * Helper functions
     * 
     * @var {Function}
     */
    const [add_event_listener, remove_event_listener, toggle_class, extend] = FrontBx.import(['add_event_listener','remove_event_listener','toggle_class', 'extend']).from('_');

    /**
     * Filter chips
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.comfrontbx/uimaster/LICENSE}
     */
    const FilterChips = function()
    {
        this.super('.js-filter-chips .btn-chip');
    }

    /**
     * Bind DOM listeners
     *
     * @access {private}
     */
    FilterChips.prototype.bind = function(node)
    {
        add_event_listener(node, 'click', this._clickHandler);
    }

    /**
     * Unbind DOM listeners
     *
     * @access {private}
     */
    FilterChips.prototype.unbind = function(node)
    {
        remove_event_listener(node, 'click', this._clickHandler);
    }

    /**
     * Handle click event on chip
     *
     * @access {private}
     * @param  {event|null} e
     */
    FilterChips.prototype._clickHandler = function(e)
    {
        e = e || window.event;

        e.preventDefault();

        toggle_class(this, 'checked');
    }

    // Load into FrontBx DOM core
    FrontBx.dom().register('FilterChips', extend(Component, FilterChips));

})();
(function()
{
    /**
     * Component base
     * 
     * @var {class}
     */
    const [Component] = FrontBx.get('Component');

    /**
     * Helper functions
     * 
     * @var {Function}
     */
    const [find, each, is_undefined, attr, on, off, to_camel_case, extend] = FrontBx.import(['find','each','is_undefined','attr','on','off','to_camel_case','extend']).from('_');

    /**
     * Available data attributes.
     * 
     * @var {Array}
     */
    const DATA_ATTRIBUTES = ['title','content','classes','custom','close-anywhere','scroll','cancel-btn','cancel-class','confirm-btn','confirm-class','overlay','state'];

    /**
     * Toggle active on lists
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.comfrontbx/uimaster/LICENSE}
     */
    const Modal = function()
    { 
        this.modals = new Map;

        this.super('.js-modal-trigger');
    }

    /**
     * @inheritdoc
     * 
     */
    Modal.prototype.bind = function(node)
    {            
        let options = { fromHTML: true, state: 'closed' };

        let elem;

        each(DATA_ATTRIBUTES, (i, attribute) =>
        {
            let value = attr(node, `data-${attribute}`);

            if (!is_undefined(value))
            {
                if (value === 'true' || value === 'false')value = value === 'true' ? true : false;

                if (attribute === 'content' && value[0] === '#')
                {
                    elem = find(value);

                    value = elem;
                }

                options[to_camel_case(attribute)] = value;
            }
        });

        let modal = FrontBx.Modal(options);

        this.modals.set(node, modal);

        on(node, 'click', this._toggle, this);

        if (elem) elem.style = '';
    }

    /**
     * @inheritdoc
     * 
     */
    Modal.prototype.unbind = function(node)
    {
        let modal   = this.modals.get(node);
        let content = attr(node, 'data-content');

        if (content[0] === '#')
        {
            content = find(content);

            content.style.display = 'none';

            document.body.appendChild(content);
        }

        modal.destroy();

        this.modals.delete(node);

        off(node, 'click', this._toggle, this);
    }

    /**
     * Toggle modal.
     * 
     * @access {private}
     */
    Modal.prototype._toggle = function(e, trigger)
    { 
        let modal = this.modals.get(trigger);

        modal.closed() ? modal.open() : modal.close();
    }

    // Load into FrontBx DOM core
    FrontBx.dom().register('Modal', extend(Component, Modal));
})();
(function()
{
    const [Component] = FrontBx.get('Component');

    /**
     * Helper functions
     * 
     * @var {Function}
     */
    const [find, each, is_undefined, attr, on, off, to_camel_case, add_class, remove_class, extend] = FrontBx.import(['find','each','is_undefined','attr','on','off','to_camel_case','add_class','remove_class','extend']).from('_');

    /**
     * Available data attributes.
     * 
     * @var {Array}
     */
    const DATA_ATTRIBUTES = ['content','direction','overlay','persistent','peekable','swipeable','classes','state','easing','animation-time','responsive'];

    /**
     * Drawer
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.comfrontbx/uimaster/LICENSE}
     */
    const Drawer = function()
    { 
        this.drawers = new Map;

        this.super('.js-drawer-trigger');
    }

    /**
     * @inheritdoc
     * 
     */
    Drawer.prototype.bind = function(node)
    {            
        let options = 
        { 
            fromHTML: true,
            state: 'collapsed',
            callbackClose: () => remove_class(node, 'active'),
            callbackOpen: () => add_class(node, 'active'),
        };

        let elem;

        each(DATA_ATTRIBUTES, (i, attribute) =>
        {
            let value = attr(node, `data-${attribute}`);

            if (!is_undefined(value))
            {
                if (value === 'true' || value === 'false') value = value === 'true' ? true : false;

                if (attribute === 'content' && value[0] === '#')
                {
                    elem = find(value);

                    value = elem;
                }

                options[to_camel_case(attribute)] = value;
            }
        });

        let drawer = FrontBx.Drawer(options);

        this.drawers.set(node, drawer);

        on(node, 'click', this._toggle, this);

        if (elem) elem.style = '';
    }

    /**
     * @inheritdoc
     * 
     */
    Drawer.prototype.unbind = function(node)
    {
        let drawer = this.drawers.get(node);

        let content = attr(node, 'data-content');

        if (content[0] === '#')
        {
            content = find(content);

            content.style.display = 'none';

            document.body.appendChild(content);
        }

        drawer.destroy();

        this.drawers.delete(node);

        off(node, 'click', this._toggle, this);
    }

    /**
     * Toggle drawer.
     * 
     * @access {private}
     */
    Drawer.prototype._toggle = function(e, trigger)
    { 
        let drawer = this.drawers.get(trigger);

        drawer.closed() ? drawer.open() : drawer.close();
    }

    // Load into FrontBx DOM core
    FrontBx.dom().register('Drawer', extend(Component, Drawer));
    
})();
(function()
{
    /**
     * Component base
     * 
     * @var {class}
     */
    const [Component] = FrontBx.get('Component');

    /**
     * Helper functions
     * 
     * @var {Function}
     */
    const [find, each, is_undefined, attr, on, off, to_camel_case, add_class, remove_class, extend] = FrontBx.import(['find','each','is_undefined','attr','on','off','to_camel_case','add_class','remove_class','extend']).from('_');

    /**
     * Available data attributes.
     * 
     * @var {Array}
     */
    const DATA_ATTRIBUTES = ['content','overlay','persistent','peekable','swipeable','classes','state','easing','animation-time'];

    /**
     * Toggle active on lists
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.comfrontbx/uimaster/LICENSE}
     */
    const Frontdrop = function()
    { 
        this.drawers = new Map;

        this.super('.js-frontdrop-trigger');
    }

    /**
     * @inheritdoc
     * 
     */
    Frontdrop.prototype.bind = function(node)
    {            
        let options = 
        { 
            fromHTML: true,
            state: 'collapsed',
            callbackClose: () => remove_class(node, 'active'),
            callbackOpen: () => add_class(node, 'active'),
        };

        let elem;

        each(DATA_ATTRIBUTES, (i, attribute) =>
        {
            let value = attr(node, `data-${attribute}`);

            if (!is_undefined(value))
            {
                if (value === 'true' || value === 'false') value = value === 'true' ? true : false;

                if (attribute === 'content' && value[0] === '#')
                {
                    elem = find(value);

                    value = elem;
                }

                options[to_camel_case(attribute)] = value;
            }
        });

        let frontdrop = FrontBx.Frontdrop(options);

        this.drawers.set(node, frontdrop);

        on(node, 'click', this._toggle, this);

        if (elem) elem.style = '';
    }

    /**
     * @inheritdoc
     * 
     */
    Frontdrop.prototype.unbind = function(node)
    {
        let frontdrop = this.drawers.get(node);

        let content = attr(node, 'data-content');

        if (content[0] === '#')
        {
            content = find(content);

            content.style.display = 'none';

            document.body.appendChild(content);
        }

        frontdrop.destroy();

        this.drawers.delete(node);

        off(node, 'click', this._toggle, this);
    }

    /**
     * Toggle Frontdrop.
     * 
     * @access {private}
     */
    Frontdrop.prototype._toggle = function(e, trigger)
    { 
        let frontdrop = this.drawers.get(trigger);

        frontdrop.closed() ? frontdrop.open() : frontdrop.close();
    }

    // Load into FrontBx DOM core
    FrontBx.dom().register('Frontdrop', extend(Component, Frontdrop));
    
})();
(function()
{
    /**
     * Component base
     * 
     * @var {class}
     */
    const [Component] = FrontBx.get('Component');

     /**
     * Helper functions
     * 
     * @var {Function}
     */
    const [find, each, is_undefined, attr, on, off, to_camel_case, add_class, remove_class, extend] = FrontBx.import(['find','each','is_undefined','attr','on','off','to_camel_case','add_class','remove_class','extend']).from('_');

    /**
     * Available data attributes.
     * 
     * @var {Array}
     */
    const DATA_ATTRIBUTES = ['title','content','direction','classes','pushbody','swipeable','state','easing','animation-time','responsive'];

    /**
     * Toggle active on lists
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.comfrontbx/uimaster/LICENSE}
     */
    const Backdrop = function()
    { 
        this.drawers = new Map;

        this.super('.js-backdrop-trigger');
    }

    /**
     * @inheritdoc
     * 
     */
    Backdrop.prototype.bind = function(node)
    {            
        let options = 
        { 
            fromHTML: true,
            state: 'collapsed',
            callbackClose: () => remove_class(node, 'active'),
            callbackOpen: () => add_class(node, 'active'),
        };

        let elem;

        each(DATA_ATTRIBUTES, (i, attribute) =>
        {
            let value = attr(node, `data-${attribute}`);

            if (!is_undefined(value))
            {
                if (value === 'true' || value === 'false') value = value === 'true' ? true : false;

                if (attribute === 'content' && value[0] === '#')
                {
                    elem = find(value);

                    value = elem;
                }

                options[to_camel_case(attribute)] = value;
            }
        });

        let backdrop = FrontBx.Backdrop(options);

        this.drawers.set(node, backdrop);

        on(node, 'click', this._toggle, this);

        if (elem) elem.style = '';
    }

    /**
     * @inheritdoc
     * 
     */
    Backdrop.prototype.unbind = function(node)
    {
        let backdrop = this.drawers.get(node);
        let content = attr(node, 'data-content');

        if (content[0] === '#')
        {
            content = find(content);

            content.style.display = 'none';

            document.body.appendChild(content);
        }

        backdrop.destroy();

        this.drawers.delete(node);

        off(node, 'click', this._toggle, this);
    }

    /**
     * Toggle Backdrop.
     * 
     * @access {private}
     */
    Backdrop.prototype._toggle = function(e, trigger)
    { 
        let backdrop = this.drawers.get(trigger);
        
        backdrop.closed() ? backdrop.open() : backdrop.close();
    }

    // Load into FrontBx DOM core
    FrontBx.dom().register('Backdrop', extend(Component, Backdrop));

})();
(function()
{
    /**
     * Component base
     * 
     * @var {class}
     */
    const [Component] = FrontBx.get('Component');

    /**
     * Helper functions
     * 
     * @var {Function}
     */
    const [find, each, is_undefined, attr, on, off, to_camel_case, extend] = FrontBx.import(['find','each','is_undefined','attr','on','off','to_camel_case','extend']).from('_');

    /**
     * Available data attributes.
     * 
     * @var {Array}
     */
    const DATA_ATTRIBUTES = ['text','timeout','icon','btn','variant','btnVariant'];

    /**
     * Toggle active on lists
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.comfrontbx/uimaster/LICENSE}
     */
    const Notification = function()
    {
        this.super('.js-notification-trigger');
    }

    /**
     * @inheritdoc
     * 
     */
    Notification.prototype.bind = function(node)
    {            
        on(node, 'click', this._show, this);
    }

    /**
     * @inheritdoc
     * 
     */
    Notification.prototype.unbind = function(node)
    {

        off(node, 'click', this._show, this);
    }

    /**
     * Toggle notification.
     * 
     * @access {private}
     */
    Notification.prototype._show = function(e, trigger)
    { 
        let options = { fromHTML: true };

        each(DATA_ATTRIBUTES, (i, attribute) =>
        {
            let value = attr(trigger, `data-${attribute}`);

            if (!is_undefined(value))
            {
                if (value === 'true' || value === 'false') value = value === 'true' ? true : false;

                if (attribute === 'timeout') value = parseInt(value);

                options[to_camel_case(attribute)] = value;
            }
        });

        FrontBx.Notification(options);
    }

    // Load into FrontBx DOM core
    FrontBx.dom().register('Notification', extend(Component, Notification));

})();
(function()
{
    /**
     * Component base
     * 
     * @var {class}
     */
    const [Component] = FrontBx.get('Component');

    /**
     * Helper functions
     * 
     * @var {Function}
     */
    const [on, off, attr, bool, extend]  = FrontBx.import(['on','off','attr','bool','extend']).from('_');

    /**
     * URLS Requested
     * 
     * @var {object}
     */
    const REQUESTED = [];

    /**
     * Pjax Links Module
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.comfrontbx/uimaster/LICENSE}
     */
    const PjaxLinks = function()
    {
        this.super('.js-pjax-link');
    }

    /**
     * @inheritdoc
     * 
     */
    PjaxLinks.prototype.bind = function(node)
    {
        on(node, 'click', this._eventHandler, this);
    }

    /**
     * @inheritdoc
     * 
     */
    PjaxLinks.prototype.unbind = function(node)
    {
        off(node, 'click', this._eventHandler, this);
    }

    /**
     * Event handler
     *
     * @param {event|null} e JavaScript click event
     * @access {private}
     */
    PjaxLinks.prototype._eventHandler = function(e, clicked)
    {
        let url       = clicked.href || attr(clicked, 'data-pjax-target');
        let once      = attr(clicked, 'data-pjax-once') || false;
        let element   = attr(clicked, 'data-pjax-target');
        let cacheBust = bool(attr(clicked, 'data-pjax-nocache'));
        let pushstate = !element ? true : false;
        let urlhash   = !element ? false : bool(attr(clicked, 'data-pjax-urlhash'));

        // Only request once
        if (REQUESTED.includes(url) && once) return;

        REQUESTED.push(url);

        if (element) element = element[0] !== '#' ? `#${element}` : element;

        FrontBx.Pjax().request(url, {once, element, cacheBust, pushstate, urlhash});

        return false;
    }

    // Load into FrontBx DOM core
    FrontBx.dom().register('PjaxLinks', extend(Component, PjaxLinks));

})();
(function()
{
    /**
     * Component base
     * 
     * @var {class}
     */
    const [Component] = FrontBx.get('Component');

    /**
     * Helper functions
     * 
     * @var {Function}
     */
    const [$, add_event_listener, animate, bool, has_class, is_node_type, remove_event_listener, toggle_class, trigger_event, extend] = FrontBx.import(['$','add_event_listener','animate','bool','has_class','is_node_type','remove_event_listener','toggle_class','trigger_event','extend']).from('_');

    /**
     * Toggle height on click
     *
     * @class
     * @extends {Component}
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.comfrontbx/uimaster/LICENSE}
     */
    const Collapse = function()
    {        
        this.super('.js-collapse');
    }

    /**
     * Event binder - Binds all events on button click
     *
     * @access {private}
     */
    Collapse.prototype.bind = function(node)
    {
        add_event_listener(node, 'click', this._eventHandler);
    }

    /**
     * Event unbinder - Removes all events on button click
     *
     * @access {private}
     */
    Collapse.prototype.unbind = function(node)
    {
        remove_event_listener(node, 'click', this._eventHandler);
    }

    /**
     * Handle the click event
     *
     * @param {event|null} e JavaScript click event
     * @access {private}
     */
    Collapse.prototype._eventHandler = function(e)
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
        var closing  = has_class(clicked, 'active');

        trigger_event(targetEl, 'collapse:toggle', closing ? 'close' : 'open');

        var options  = 
        {
            property: 'height',
            to: closing ? '0px' : 'auto',
            from: closing ? 'auto' : '0px',
            duration: duration, 
            easing: easing,
            callback: () => { trigger_event(targetEl, 'collapse:toggled', closing ? 'close' : 'open'); }
        };

        animate(targetEl, options);
        toggle_class(clicked, 'active');
    }

    // Load into FrontBx DOM core
    FrontBx.dom().register('Collapse', extend(Component, Collapse));
})();
(function()
{
    /**
     * Component base
     * 
     * @var {class}
     */
    const [Component] = FrontBx.get('Component');

    /**
     * Helper functions
     * 
     * @var {Function}
     */
    const [find, add_event_listener, remove_event_listener, has_class, add_class, remove_class, closest, trigger_event, dom_element, map, extend] = FrontBx.import(['find','add_event_listener','remove_event_listener','has_class','add_class','remove_class','closest','trigger_event','dom_element', 'map','extend']).from('_');

    /**
     * Toggle active on lists
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.comfrontbx/uimaster/LICENSE}
     */
    const List = function()
    { 
        this.super('.js-select-list > li');
    }

    /**
     * @inheritdoc
     * 
     */
    List.prototype.bind = function(node)
    {            
        add_event_listener(node, 'click', this._eventHandler);
    }

    /**
     * @inheritdoc
     * 
     */
    List.prototype.unbind = function(node)
    {
        remove_event_listener(node, 'click', this._eventHandler);
    }

    /**
     * Handle the click event
     *
     * @param {event|null} e JavaScript click event
     * @access {private}
     */
    List.prototype._eventHandler = function(e)
    {
        e = e || window.event;
        
        if (has_class(this, 'selected')) return;

        var list = closest(this, '.js-select-list');

        remove_class(find('li.selected', list), 'selected');
        
        add_class(this, 'selected');

        trigger_event(list, 'list:selected', {item: this});
    }

    /**
     * @inheritdoc
     * 
     */
    List.prototype.template = function(props)
    {
        return dom_element({tag: 'ul', class: `list ${props.classes ? props.classes : ''} ${props.dense ? 'list-dense' : ''} ${props.ellipsis ? 'list-ellipsis' : ''} ${ props.selectable ? `js-select-list` : '' }`}, null, map(props.items, (i, item) =>
            {
                return dom_element({tag: 'li', class: `${item.state} ${props.selected && (props.selected === item.value || props.selected === item.text) ? 'selected' : null}`}, null,
                [
                    item.left ? dom_element({tag: 'span', class: 'item-left', innerHTML: item.left}) : null,
                    dom_element({tag: 'span', class: 'item-body', innerText: item.body || item.text || item }),
                    item.right ? dom_element({tag: 'span', class: 'item-right', innerHTML: item.right}) : null,
                ])
            })
        );
    }

    // Load into FrontBx DOM core
    FrontBx.dom().register('List', extend(Component, List));
})();
(function()
{
    /**
     * Component base
     * 
     * @var {class}
     */
    const [Component] = FrontBx.get('Component');

    /**
     * Helper functions
     * 
     * @var {Function}
     */
    const [find, find_all, map, add_class, on, closest, has_class, is_string, hide_aria, remove_class, off, show_aria, attr, css, dom_element, extend] = FrontBx.import(['find','find_all','map','add_class','on','closest','has_class','is_string','hide_aria','remove_class','off','show_aria','attr','css','dom_element','extend']).from('_');

    /**
     * Dropdown Buttons
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.comfrontbx/uimaster/LICENSE}
     */
    const Dropdown = function()
    {
        this.super('.js-drop-trigger, .drop-container .js-select-menu > *:not(.menu-divider):not(.menu-header), .drop-container .js-check-menu > *:not(.menu-divider):not(.menu-header), .drop-container .js-active-menu > *:not(.menu-divider):not(.menu-header)');

        this.defaultProps =
        {
            checkable:    false,
            selectable:   false,
            caret:        false,
            ellipsis:     false,
            dense:        false,
            position:     'sw',
            anchorText:   '',
            anchorTag:    'button', 
            items:        [],
        };

        this.boundWindow  = false;
    }

    /**
     * @inheritdoc
     * 
     */
    Dropdown.prototype.bind = function(node)
    {
        if (has_class(node, 'js-drop-trigger'))
        {
            on(node, 'click', this._clickHandler, this);
        }
        else
        {
            on(node, 'click', this._selectHandler, this);
        }

        if (!this.boundWindow)
        {
            on(window, 'click', this._windowClick, this);

            this.boundWindow = true;
        }
    }

     /**
     * @inheritdoc
     * 
     */
    Dropdown.prototype.unbind = function(node)
    {
        if (has_class(node, 'js-drop-trigger'))
        {
            off(node, 'click', this._clickHandler, this);
        }
        else
        {
            off(node, 'click', this._selectHandler, this);
        }

        if (this.boundWindow)
        {
            off(window, 'click', this._windowClick, this);

            this.boundWindow = false;
        }
    }

    /**
     * Click event handler
     *
     * @param  {event|null} e JavaScript Click event
     * @access {private}
     */
    Dropdown.prototype._clickHandler = function(e, button)
    {
        e = e || window.event;

        var active = find('.js-drop-trigger.drop-active');

        if (active) this._hideDrop(active);

        // Remove active and return
        if (active !== button)
        {
            this._showDrop(button);
        }
    }

    /**
     * Click event handler
     *
     * @param  {event|null} e JavaScript Click event
     * @access {private}
     */
    Dropdown.prototype._hideDrop = function(button)
    {
        var drop = find('.js-drop-menu', button.parentNode);
        
        remove_class(button, ['active', 'drop-active']);
        
        button.setAttribute('aria-pressed', 'false');
        
        hide_aria(drop);
        
        drop.blur();
    }

    /**
     * Click event handler
     *
     * @param  {event|null} e JavaScript Click event
     * @access {private}
     */
    Dropdown.prototype._showDrop = function(button)
    {
        var drop = find('.js-drop-menu', button.parentNode);
        
        add_class(button, ['active', 'drop-active']);
        
        button.setAttribute('aria-pressed', 'true');
        
        show_aria(drop);
        
        drop.focus();
    }

    /**
     * Window click event
     *
     * @param {event|null} e JavaScript click event
     * @access {private}
     */
    Dropdown.prototype._windowClick = function(e)
    {
        e = e || window.event;

        if (closest(e.target, '.js-drop-trigger'))
        {
            return;
        }

        var active = find('.js-drop-trigger.drop-active');

        if (active) this._hideDrop(active);
    }

    /**
     * Click item on select handler
     *
     * @param  {event|null} e JavaScript Click event
     * @access {private}
     */
    Dropdown.prototype._selectHandler = function(e, item)
    {
        let wrapper    = closest(item, '.drop-container');
        let menu       = find('.js-select-menu, .js-check-menu, .js-active-menu', wrapper);
        let trigger    = find('.js-drop-trigger', wrapper);
        let selectable = has_class(trigger, 'js-drop-selectable');
        let content    = item.innerText.trim();
        let value      = attr(item, 'data-value') || content;
        let input      = find('> input', wrapper);

        if (input) attr(input, 'value', value);

        if (selectable) trigger.innerText = content;
    }

    /**
     * @inheritdoc
     * 
     */
    Dropdown.prototype.template = function(props)
    {
        return dom_element({tag: 'div', class: 'drop-container'}, null,
        [
            // Input
            props.checkable ? dom_element({tag: 'input', type: 'hidden', name: props.input, value: props.selected || ''}) : null,

            // button / anchor
            dom_element({tag: props.anchorTag, type: props.anchorTag === 'button' ? 'button' : null, role: props.anchorTag === 'button' ? 'button' : null, class: `${props.anchorTag === 'button' ? 'btn btn-dropdown' : 'btn-dropdown'} js-drop-trigger ${props.anchorClass} ${props.selectable ? 'js-select-menu' : '' }`}, null,
                [
                    props.anchorText,
                    props.caret ? dom_element({tag: 'span', class: `caret-${props.caret}`}) : null,
                ]
            ),

            // Dropdown
            dom_element({tag: 'div', class: `drop-menu ${ props.position ? `drop-${props.position}` : '' } js-drop-menu`}, null, 
                dom_element({tag: 'ul', class: `menu ${props.dense ? 'menu-dense' : ''} ${props.ellipsis ? 'menu-ellipsis' : ''} ${ props.checkable ? 'js-menu-check' : '' }`}, null, 
                    map(props.items, (i, item) =>
                    {
                        return dom_element({tag: 'li', class: `${item.state} ${props.selected && (props.selected === item.value || props.selected === item.text) ? 'selected' : null}`, dataValue: item.value || item.text || item}, null,
                        [
                            item.left ? dom_element({tag: 'span', class: 'item-left', innerHTML: item.left}) : null,
                            dom_element({tag: 'span', class: 'item-body', innerText: item.body || item.text || item }),
                            item.right ? dom_element({tag: 'span', class: 'item-right', innerHTML: item.right}) : null,
                        ])
                    })
                )
            )
        ]);
    }

    // Load into FrontBx DOM core
    FrontBx.dom().register('Dropdown', extend(Component, Dropdown));

})();
(function()
{
    /**
     * Component base
     * 
     * @var {class}
     */
    const [Component] = FrontBx.get('Component');

    /**
     * Helper functions
     * 
     * @var {Function}
     */
    const [find, attr, add_class, on, closest, has_class, is_empty, remove_class, off, extend] = FrontBx.import(['find','attr','add_class','on','closest','has_class','is_empty','remove_class','off','extend']).from('_');

    /**
     * Tab Nav
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.comfrontbx/uimaster/LICENSE}
     */
    const TabNav = function()
    {
        this.super('.js-tab-nav > li > *, .js-tab-nav > *:not(li)');
    }

    /**
     * @inheritdoc
     * 
     */
    TabNav.prototype.bind = function(node)
    {            
        on(node, 'click', this._eventHandler);
    }

    /**
     * Unbind click events on all <a> tags in a .js-tab-nav
     *
     * @params {navWrap} node
     * @access {private}
     */
    TabNav.prototype.unbind = function(node)
    {            
        off(node, 'click', this._eventHandler, this);
    }

    /**
     * Click event handler
     *
     * @param {event|null} e JavaScript click event
     * @access {private}
     */
    TabNav.prototype._eventHandler = function(e, clicked)
    {
        let nav         = closest(clicked, '.js-tab-nav');
        let activeClass = attr(nav, 'data-active-class') || 'active';
        let panel       = find(`[data-tab-panel=${attr(clicked, 'data-tab')}]`);
        let panels      = closest(panel, '.js-tab-panels');

        if (has_class(clicked, activeClass)) return false;

        remove_class(find(`.${activeClass}[data-tab]`, nav), activeClass);
        add_class(clicked, activeClass);

        remove_class(find('.active[data-tab-panel]', panels), 'active');
        add_class(panel, 'active');

        return false;
    }   

    // Load into FrontBx DOM core
    FrontBx.dom().register('TabNav', extend(Component, TabNav));
})();
(function()
{
    /**
     * JS Helper reference
     * 
     * @var {object}
     */
    const Helper = FrontBx._();

    /**
     * Input masker
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.comfrontbx/uimaster/LICENSE}
     */
    const InputMasks = function()
    {
        this._nodes = Helper.$All('.js-mask');
        
        this._masks = [];

        this._bind();

        return this;
    }

    /**
     * Public destructor remove all masks
     *
     * @access {public}
     */
    InputMasks.prototype.destruct = function()
    {
        Helper.each(this._masks, function(i, mask)
        {
            mask.destroy();
        });
        
        this._nodes = [];

        this._masks = [];
    }

    /**
     * Find all the nodes and apply any masks
     *
     * @access {private}
     */
    InputMasks.prototype._bind = function()
    {
        // Find all the nodes
        Helper.each(this._nodes, function(i, input)
        {
            let mask = Helper.attr(input, 'data-mask');

            let format = Helper.attr(input, 'data-format');

            if (mask && mask.startsWith('regex('))
            {
                mask = mask.trim().replace('regex(', '').slice(0, -1);
            }

            if (mask)
            {
                this._masks.push(FrontBx.InputMasker(input, mask, format));
            }

        }, this);
    }

    // Load into FrontBx DOM core
    FrontBx.dom().register('InputMasks', InputMasks);

})();
(function()
{
    /**
     * Component base
     * 
     * @var {class}
     */
    const [Component] = FrontBx.get('Component');

    /**
     * Helper functions
     * 
     * @var {function}
     */
    const [add_event_listener, animate_css, closest, has_class, remove_from_dom, remove_event_listener, trigger_event, extend] = FrontBx.import(['add_event_listener','animate_css','closest','has_class','remove_from_dom','remove_event_listener','trigger_event','extend']).from('_');

    /**
     * Message closers
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.comfrontbx/uimaster/LICENSE}
     */
    const MessageClosers = function()
    {
        this.super('.js-close-msg');
    }

    /**
     * @inheritdoc
     * 
     */
    MessageClosers.prototype.bind = function(node)
    {
        add_event_listener(node, 'click', this._eventHandler);
    }

    /**
     * @inheritdoc
     * 
     */
    MessageClosers.prototype.unbind = function(node)
    {
        remove_event_listener(node, 'click', this._eventHandler);
    }

    /**
     * Event handler - handles removing the message
     *
     * @param  {event}   e JavaScript click event
     * @access {private}
     */
    MessageClosers.prototype._eventHandler = function(e)
    {
        e = e || window.event;

        e.preventDefault();

        let msg      = closest(this, '.msg');
        let toRemove = msg;

        trigger_event(msg, 'message:close');

        if (has_class(this, 'js-rmv-parent'))
        {
            toRemove = toRemove.parentNode;
        }

        animate_css(toRemove, { opacity: 0, duration: 500, easing: 'easeInOutCubic', callback: function()
        {
            trigger_event(msg, 'message:closed');

            remove_from_dom(toRemove);
        }});
    }

    // Load into FrontBx DOM core
    FrontBx.dom().register('MessageClosers', extend(Component, MessageClosers));

})();
(function()
{
    /**
     * Component base
     * 
     * @var {class}
     */
    const [Component] = FrontBx.get('Component');

    /**
     * Helper functions
     * 
     * @var {Function}
     */
    const [$, add_event_listener, remove_event_listener, has_class, in_dom, parse_url, extend]  = FrontBx.import(['$','add_event_listener','remove_event_listener','has_class','in_dom','parse_url','extend']).from('_');

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
     * @license   {https://raw.githubusercontent.comfrontbx/uimaster/LICENSE}
     */
    const WayPoints = function()
    {        
        this.super('.js-waypoint-trigger');

        // Invoke pageload
        if (!pageLoaded)
        {
            this._invokePageLoad();
        }

        pageLoaded = true;
    }

    /**
     * @inheritdoc
     * 
     */
    WayPoints.prototype.bind = function(node)
    {
        add_event_listener(node, 'click', this._eventHandler);
    }

    /**
     * @inheritdoc
     * 
     */
    WayPoints.prototype.unbind = function(node)
    {
        remove_event_listener(node, 'click', this._eventHandler);
    }

    /**
     * Event handler
     *
     * @param {event|null} e JavaScript click event
     * @access {private}
     */
    WayPoints.prototype._eventHandler = function(e)
    {
        e = e || window.event;
        
        e.preventDefault();

        let trigger   = this;
        let id        = trigger.dataset.waypointTarget;
        let speed     = parseInt(trigger.dataset.waypointSpeed) || 500;
        let easing    = trigger.dataset.waypointEasing || 'easeInOutCubic';
        let updateUrl = trigger.dataset.updateUrl === 'false' ? false : true;

        FrontBx.SmoothScroll('#' + id, { easing: easing, speed: speed, updateUrl: updateUrl });
    }

    /**
     * Scroll to a element with id when the page loads
     *
     * @access {private}
     */
    WayPoints.prototype._invokePageLoad = function()
    {
        var url = parse_url(window.location.href);

        let targetEl = url.hash && url.hash !== '' ? $(url.hash) : false;

        if (!in_dom(targetEl) || !has_class(targetEl, '.js-waypoint')) return;
       
        let speed  = parseInt(targetEl.dataset.waypointSpeed) || 500;
        let easing = targetEl.dataset.waypointEasing || 'easeInOutCubic';

        const scroll = function()
        {
            FrontBx.SmoothScroll(url.hash, { easing: easing, speed: speed, updateUrl: false });

            remove_event_listener(window, 'FrontBx:ready', scroll);
        }

        window.scrollTo(0, 0);

        add_event_listener(window, 'FrontBx:ready', scroll);
    }

    // Load into FrontBx DOM core
    FrontBx.dom().register('WayPoints', extend(Component, WayPoints));

})();
(function()
{
    /**
     * Component base
     * 
     * @var {class}
     */
    const [Component] = FrontBx.get('Component');

    /**
     * Helper functions
     * 
     * @var {function}
     */
    const [$, add_class, add_event_listener, closest, in_dom, input_value, remove_class, remove_event_listener, extend] = FrontBx.import(['$','add_class','add_event_listener','closest','in_dom','input_value','remove_class','remove_event_listener','extend']).from('_');

    /**
     * Adds classes to inputs
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.comfrontbx/uimaster/LICENSE}
     */
    const Inputs = function()
    {
        this.super('.form-field input:not([type="radio"]):not([type="checkbox"]):not([type="range"]), .form-field select, .form-field textarea, .form-field label');

        return this;
    }

    /**
     * Event binder
     *
     * @access {private}
     */
    Inputs.prototype.bind = function(node)
    {
        if (node.tagName.toLowerCase() === 'label')
        {
            add_event_listener(node, 'click', this._onLabelClick);
        }
        else
        {
            add_event_listener(node, 'click, focus, blur, change, input', this._eventHandler);

            this._setClasses(node);
        }
    }

    /**
     * Event ubinder
     *
     * @access {private}
     */
    Inputs.prototype.unbind = function(node)
    {
        if (node.tagName.toLowerCase() === 'label')
        {
            remove_event_listener(node, 'click', this._onLabelClick);
        }
        else
        {
            remove_event_listener(node, 'click, focus, blur, change, input', this._eventHandler);
        }
    }

    /**
     * Event handler
     *
     * @access {private}
     * @params {event|null} e Browser click event
     */
    Inputs.prototype._onLabelClick = function(e)
    {
        e = e || window.event;

        var input = $('input', this.parentNode);

        if (in_dom(input))
        {
            input.focus();

            return;
        }

        var input = $('select', this.parentNode);

        if (in_dom(input))
        {
            input.focus();

            return;
        }

        var input = $('textarea', this.parentNode);

        if (in_dom(input))
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
    Inputs.prototype._eventHandler = function(e)
    {
        e = e || window.event;

        var wrapper = closest(this, '.form-field');

        if (!wrapper) return;

        if (e.type === 'click')
        {
            this.focus();
        }
        else if (e.type === 'focus')
        {
            add_class(wrapper, 'focus');
        }
        else if (e.type === 'blur')
        {
            remove_class(wrapper, 'focus');
        }

        if (e.type === 'change' || e.type === 'input' || e.type === 'blur')
        {
            var _value = input_value(this);

            if (_value === '')
            {
                remove_class(wrapper, 'not-empty');
                add_class(wrapper, 'empty');
            }
            else
            {
                remove_class(wrapper, 'empty');
                add_class(wrapper, 'not-empty');
            }
        }
    }

    /**
     * Sets initial classes on load.
     *
     * @access {private}
     * @params {DOMElement} input 
     */
    Inputs.prototype._setClasses = function(input)
    {
        var wrapper = closest(input, '.form-field');

        if (!wrapper) return;

        var _value = input_value(input);

        if (_value === '')
        {
            remove_class(wrapper, 'not-empty');
            add_class(wrapper, 'empty');
        }
        else
        {
            remove_class(wrapper, 'empty');
            add_class(wrapper, 'not-empty');
        }
    }

    // Load into FrontBx DOM core
    FrontBx.dom().register('Inputs', extend(Component, Inputs));
})();
(function()
{
    /**
     * Component base
     * 
     * @var {class}
     */
    const [Component] = FrontBx.get('Component');

    /**
     * Helper functions
     * 
     * @var {Function}
     */
    const [find, add_class, on, animate_css, closest, coordinates, css, has_class, height, in_array, in_dom, inline_style, preapend, remove_class, off, rendered_style, traverse_up, trigger_event, width, extend] = FrontBx.import(['find','add_class','on','animate_css','closest','coordinates','css','has_class','height','in_array','in_dom','inline_style','preapend','remove_class','off','rendered_style','traverse_up','trigger_event','width','extend']).from('_');

    /**
     * Wrappers that need "position:relative" to hide overflow.
     * 
     * @var {array}
     */
    const STATIC_POSITIONS = ['static', 'unset', 'initial'];

    /**
     * Original inline styles
     * 
     * @var {Map}
     */
    const INLINESTYLES = new Map();

    /**
     * Currently rippling
     * 
     * @var {Map}
     */
    const RIPPLING = new Map();

    /**
     * Currently clicking
     * 
     * @var {Map}
     */
    var CLICKING;

    /**
     * Selectors
     * 
     * @var {Map}
     */
    const SELECTORS =
    [
        '.btn',
        '.list > li',
        '.pagination li a',
        '.tab-nav li a',
        '.card.primary-action',
        '.card .primary-action',
        '.card-media',
        '.js-ripple'
    ];

    /**
     * Ripple click animation
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.comfrontbx/uimaster/LICENSE}
     */
    const Ripple = function()
    {
        this.super(SELECTORS.join(','));
    }

    /**
     * @inheritdoc
     * 
     */
    Ripple.prototype.bind = function(node)
    {        
        // No ripples inside primary actions
        if (!has_class(node, 'primary-action') && closest(node, '.primary-action') && !has_class(node, 'card'))
        {
            return;
        }

        // No ripples inside list buttons
        if (has_class(node, 'btn') && closest(node, '.list'))
        {
            return;
        }

        // No ripples on list items with checkbox controls
        if (closest(node, '.list') && (find('> .item-right .checkbox', node) || find('> .item-right .radio', node)  || find('> .item-right .switch', node))) return;

        // Cache 'overflow' and 'position' inline styles
        // to revert back to after complete
        // If these are empty they will be removed
        if (!INLINESTYLES.has(node))
        {
            let CSSoverflow = inline_style(node, 'overflow') || false;
            
            let CSSposition = inline_style(node, 'position') || false;

            INLINESTYLES.set(node, [CSSoverflow, CSSposition]);
        }

        on(node, 'mousedown, touchstart', this._startRipple, this);
    }

    /**
     * @inheritdoc
     * 
     */
    Ripple.prototype.unbind  = function(node)
    {
        off(node, 'mousedown, touchstart', this._startRipple, this);
    }

    /**
     * Ripple handler
     *
     * @access {private}
     * @param  {event|null} e
     */
    Ripple.prototype._restore  = function(wrapper)
    {
        if (in_dom(wrapper))
        {
            wrapper.offsetHeight;

            wrapper.removeAttribute('data-event');
        
            remove_class(wrapper, 'ripple-down');

            let styles = INLINESTYLES.get(wrapper);

            css(wrapper, 'overflow', styles[0]);

            css(wrapper, 'position', styles[1]);
        }
    }

    /**
     * Ripple handler
     *
     * @access {private}
     * @param  {event|null} e
     */
    Ripple.prototype._startRipple  = function(e, wrapper)
    {
        const _this = this;

        // Ignore disabled
        if (wrapper.disabled || has_class(wrapper, 'disabled')) return;

        // Single finger "clicks" only
        if (e.touches && e.touches.length > 1) return;

        // Left click only on mouse
        if ('button' in e && e.button !== 0) return;

        // Store the event used to generate this ripple on the holder: don't allow
        // further events of different types until we're done.
        // Prevents double-ripples from mousedown/touchstart.
        var prev = wrapper.getAttribute('data-event');
        if (prev && prev !== e.type) return;

        // Clear restorer
        clearTimeout(RIPPLING.get(wrapper));

        // Add the data-attribute to identify ripple event type
        wrapper.setAttribute('data-event', e.type);

        // Add class to parent do identify mousedown/touchstart
        add_class(wrapper, 'ripple-down');

        // Figure out release event type
        var releaseEvent = (e.type === 'mousedown' ? 'mouseup' : 'touchend');

        // Cached timer for release
        var releaseTimer;
        var released = false;

        // Animation started
        const t0 = performance.now();

        // Create ripple and append immediately
        var ripple = document.createElement('SPAN');
        ripple.className = 'ripple';

        // Release event
        const release = function(ev)
        {
            // Clear timer
            clearTimeout(releaseTimer);

            // Remove release listener
            document.removeEventListener(releaseEvent, release);

            add_class(ripple, 'complete');

            setTimeout(() => wrapper.removeChild(ripple), 400);

            let restoreTimer = setTimeout(() => _this._restore(wrapper), 500);

            RIPPLING.set(wrapper, restoreTimer);
        };  

        // Figure out where to place ripple inside parent
        var c = coordinates(wrapper);
        var s = Math.max(height(wrapper), width(wrapper));
        var x = (e.pageX - c.left) - (s / 2);
        var y = (e.pageY - c.top) - (s / 2);

        // Apply styles to ripple
        css(ripple, 
        {
            width:  `${s}px`,
            height: `${s}px`,
            left:   `${x}px`,
            top:    `${y}px`
        });

        // Issue here is that if ripple is clicked multiple times in quick succession
        // the original inline overflow and position styles are overwritten by the next
        // click

        // Ensure parent hides overflow
        css(wrapper, 'overflow', 'hidden !important');

        // Ensure position relative if needed
        if (in_array(rendered_style(wrapper, 'position'), STATIC_POSITIONS))
        {
            css(wrapper, 'position', 'relative');
        }

        // Release listener
        document.addEventListener(releaseEvent, release);
            
        preapend(ripple, wrapper);
    }

    // Load into FrontBx DOM core
    FrontBx.dom().register('Ripple', extend(Component, Ripple));

})();
(function()
{
    /**
     * Component base
     * 
     * @var {class}
     */
    const [Component] = FrontBx.get('Component');

    /**
     * Helper functions
     * 
     * @var {Function}
     */
    const [find, on, off, has_class, add_class, remove_class, closest, trigger_event, dom_element, map, is_object, extend] = FrontBx.import(['find','on','off','has_class','add_class','remove_class','closest','trigger_event','dom_element','map','is_object','extend']).from('_');

    /**
     * Toggle active on tables
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.comfrontbx/uimaster/LICENSE}
     */
    const Table = function()
    { 
        this.super('.js-select-table > tbody > tr');
    }

    /**
     * @inheritdoc
     * 
     */
    Table.prototype.bind = function(node)
    {            
        on(node, 'click', this._eventHandler);
    }

    /**
     * @inheritdoc
     * 
     */
    Table.prototype.unbind = function(node)
    {
        off(node, 'click', this._eventHandler);
    }

    /**
     * Handle the click event
     *
     * @param {event|null} e JavaScript click event
     * @access {private}
     */
    Table.prototype._eventHandler = function(e)
    {
        e = e || window.event;
        
        if (has_class(this, 'selected')) return;

        var table = closest(this, '.js-select-table');

        remove_class(find('tr.selected', table), 'selected');
        
        add_class(this, 'selected');

        trigger_event(table, 'table:selected', {item: this});
    }

    /**
     * @inheritdoc
     * 
     */
    Table.prototype.template = function(props)
    {
        let head = dom_element({tag: 'thead'}, null, dom_element({tag: 'tr'}, null, map(props.head, (i, cell) =>
        {   
            return is_object(cell) ? dom_element({tag: 'th', ...cell}) : dom_element({tag: 'th'}, null, cell);                    
        })));

        let body = dom_element({tag: 'tbody'}, null, map(props.rows, (i, item) =>
        {
            return dom_element({tag: 'tr', class: `${props.selected && (props.selected === i) ? 'selected' : null}`}, null, map(item, (j, cell) =>
            {
                return is_object(cell) ? dom_element({tag: 'th', ...cell}) : dom_element({tag: 'th'}, null, cell);
            }));
        }));

        return dom_element({tag: 'table', class: `table ${props.classes ? props.classes : ''} ${props.dense ? 'table-dense' : ''} ${ props.selectable ? `js-select-table` : '' }`}, null, [head, body]);
    }

    // Load into FrontBx DOM core
    FrontBx.dom().register('Table', extend(Component, Table));

})();
(function()
{
    /**
     * Lazyload fallback
     * 
     * @var {string}
     */
    var LAZY_FALLBACK_IMAGE = typeof LAZY_FALLBACK_IMAGE === 'undefined' ? '"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMiAzMiIgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSJ3aGl0ZSI+CiAgPHBhdGggZD0iTTAgNCBMMCAyOCBMMzIgMjggTDMyIDQgeiBNNCAyNCBMMTAgMTAgTDE1IDE4IEwxOCAxNCBMMjQgMjR6IE0yNSA3IEE0IDQgMCAwIDEgMjUgMTUgQTQgNCAwIDAgMSAyNSA3Ij48L3BhdGg+Cjwvc3ZnPg=="' : LAZY_FALLBACK_IMAGE;

    /**
     * Component base
     * 
     * @var {class}
     */
    const [Component] = FrontBx.get('Component');

    /**
     * Helper functions
     * 
     * @var {Function}
     */
    const [is_undefined, map, dom_element, extend] = FrontBx.import(['is_undefined','map','dom_element','extend']).from('_');

    /**
     * Helper functions
     * 
     * @var {Function}
     */
    const AVAILABLE_OPTIONS =[ 'background', 'lazy', 'ratio', 'placeholder', 'src', 'grayscale'];

    /**
     * Toggle active on lists
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.comfrontbx/uimaster/LICENSE}
     */
    const Image = function()
    { 
        this.super();
    }

    /**
     * @inheritdoc
     * 
     */
    Image.prototype.template = function(props)
    {
        let attrs        = map({...props}, (k, v) => !AVAILABLE_OPTIONS.includes(k) ? v : false );
        let isBackground = props.background;
        let isRatio      = !is_undefined(props.ratio);
        let isLazy       = is_undefined(props.lazy) ? false : props.lazy;
        let src          = isLazy ? (props.placeholder || LAZY_FALLBACK_IMAGE) : props.src;
        let dataSrc      = isLazy ? props.src : false;
        
        if (!attrs.style) attrs.style = '';
        if (!attrs.class) attrs.class = '';

        if (isLazy)
        {
            attrs.class  += ` lazyload js-lazyload ${props.grayscale ? 'grayscale' : ''}`;
            attrs.dataSrc = dataSrc;
        }

        // Background image
        if (isBackground)
        {
            attrs.class += ' bg-image';
            attrs.style += `;background-image: url(${src})`;
            
            if (isRatio) attrs.class += ` ratio-${props.ratio}`;

            return dom_element({...attrs, tag: 'div'});
        }

        attrs.src = src;

        let image = dom_element({...attrs, src: src, dataSrc: dataSrc, tag: 'img'})

        // Ratio image
        if (isRatio)
        {
            return dom_element({tag: 'div', class: `ratio-img ratio-${props.ratio}`}, null, image);
        }

        return image;
    }

    // Load into FrontBx DOM core
    FrontBx.dom().register('Image', extend(Component, Image));
    
})();

// boot frontbx
/**
 * Boot and initialize FrontBx core
 *
 * @author    {Joe J. Howard}
 * @copyright {Joe J. Howard}
 * @license   {https://raw.githubusercontent.comfrontbx/uimaster/LICENSE}
 */
(function()
{
	FrontBx.boot();

})();

const FrontBx = window.FrontBx;

export default FrontBx;
