/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 897:
/***/ ((module) => {

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

    if (true) module.exports = definition()
    else {}

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

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";

// EXTERNAL MODULE: ./src/js/dom/utils/polyfills.js
var polyfills = __webpack_require__(897);
;// CONCATENATED MODULE: ./src/js/dom/vdom/flag.js
const NODE_FLAG = 
{
    ELEMENT: 1,
    TEXT: 2,
    COMPONENT: 3,
    FRAGMENT: 4,
}

const CHILD_FLAG =
{
    NO_CHILD: 1,
    SINGLE_CHILD: 2,
    NO_KEY_CHILD: 3,
    KEY_CHILD: 4
}

CHILD_FLAG.MULTI_CHILD = CHILD_FLAG.NO_KEY_CHILD | CHILD_FLAG.KEY_CHILD;


;// CONCATENATED MODULE: ./src/js/dom/utils/index.js
/**
 * Triggers a native event on an element
 *
 * @param  node   el   Target element
 * @param  string type Valid event name
 */
function triggerEvent(el, type)
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
 * Is callable ?
 *
 * @param  mixed  mixed_var Variable to check
 * @return bool
 */
function is_callable(obj)
{
    return Object.prototype.toString.call(obj) === '[object Function]';
}

function foreach(obj, callback, args)
{
    var value, i = 0,
        length = obj.length,
        isArray = Object.prototype.toString.call(obj) === '[object Array]';

    var thisArg = typeof args !== 'undefined' && Object.prototype.toString.call(args) !== '[object Array]' ? args : obj;

    if (Object.prototype.toString.call(args) === '[object Array]')
    {
        if (isArray)
        {
            for (; i < length; i++)
            {
                var _currArgs = [i, obj[i]];

                value = callback.apply(thisArg, array_merge([i, obj[i]], args));

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

                value = callback.apply(thisArg, array_merge([i, obj[i]], args));

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
                value = callback.call(thisArg, i, obj[i]);

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
                value = callback.call(thisArg, i, obj[i]);

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
 * Set a key using dot/bracket notation on an object or array
 *
 * @param  string       path   Path to set
 * @param  mixed        value  Value to set
 * @param  object|array object Object to set into
 * @return object|array
 */
function array_set(path, value, object)
{
    _arraySetRecursive(_arrayKeySegment(path), value, object);

    return object;
}

/**
 * Gets an from an array/object using dot/bracket notation
 *
 * @param  string       path   Path to get
 * @param  object|array object Object to get from
 * @return mixed
 */
function utils_array_get(path, object)
{
    return _arrayGetRecursive(_arrayKeySegment(path), object);
}

/**
 * Checks if array/object contains path using dot/bracket notation
 *
 * @param  string       path   Path to check
 * @param  object|array object Object to check on
 * @return bool
 */
function array_has(path, object)
{
    return typeof utils_array_get(path, object) !== 'undefined';
}

/**
 * Deletes from an array/object using dot/bracket notation
 *
 * @param  string       path   Path to delete
 * @param  object|array object Object to delete from
 * @return object|array
 */
function array_delete(path, object)
{
    _arrayDeleteRecursive(_arrayKeySegment(path), object);

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
function _arrayDeleteRecursive(keys, object)
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

    return _arrayDeleteRecursive(keys, object[key]);
}

/**
 * Recursively search array/object
 *
 * @access private
 * @param  array        keys   Keys in search order
 * @param  object|array object Object to get from
 * @return mixed
 */
function _arrayGetRecursive(keys, object)
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

    return _arrayGetRecursive(keys, object[key]);
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
function _arraySetRecursive(keys, value, object, nextKey)
{
    var key     = keys.shift();
    var islast  = keys.length === 0;
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

    _arraySetRecursive(keys, value, object, key);
}

/**
 * Segments an array/object path using dot notation
 *
 * @access private
 * @param  string  path Path to parse
 * @return array
 */
function _arrayKeySegment(path)
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
 * Creates a new object in 'dot.notation'
 * 
 * @param  {Object} obj Object
 * @return {Object} 
 */
function dotify(obj)
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
 * Checks if variable is node.
 *
 * @param  mixed  mixed_var Variable to evaluate
 * @return bool
 */
function is_htmlElement(mixed_var)
{
    return !!(mixed_var && mixed_var.nodeType === 1);
}

/**
 * Checks if variable is an object
 *
 * @param  mixed  mixed_var Variable to evaluate
 * @return bool
 */
function utils_is_object(mixed_var)
{
    if (Object.prototype.toString.call(mixed_var) === '[object Array]')
    {
        return false;
    }

    return mixed_var !== null && typeof mixed_var === 'object';
}

/**
 * Is array
 * 
 * @param  mixed mixed_var Variable to test
 * @return bool
 */
function is_array(mixed_var)
{
    return Object.prototype.toString.call(mixed_var) === '[object Array]' || Object.prototype.toString.call(mixed_var) === '[object NodeList]';
}

/**
 * Is string
 * 
 * @param  mixed mixed_var Variable to test
 * @return bool
 */
function is_string(mixed_var)
{
    return typeof mixed_var === 'string' || mixed_var instanceof String;
}

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
function mergeDeep(target, ...sources)
{
    if (!sources.length) return target;
    
    const source = sources.shift();

    if (isObject(target) && isObject(source))
    {
        for (const key in source)
        {
            if (isObject(source[key]))
            {
                if (!target[key]) Object.assign(target,
                {
                    [key]:
                    {}
                });
                mergeDeep(target[key], source[key]);
            }
            else
            {
                Object.assign(target,
                {
                    [key]: source[key]
                });
            }
        }
    }

    return mergeDeep(target, ...sources);
}

/**
 * Map with break
 * 
 * return undefined to break loop, true to keep, false to reject
 * 
 * @param [{Array}|{Objet}] arrayOrObj Object or array
 * @param {Function}        callback   Callback
 * @param {context}         context    callback context (optional)
 * 
 * // callback(value, keyOrIndex) this = context 
 */
function mapStrict(arrayOrObj, callback, context)
{
    context = typeof context === 'undefined' ? arrayOrObj : context;

    if (Object.prototype.toString.call(arrayOrObj) === '[object Array]')
    {
        var ret = [];

        for (var i = 0; i < arrayOrObj.length; i++)
        {
            var value = callback.call(context, arrayOrObj[i], i);

            if (value === false)
            {
                continue;
            }
            else if (typeof value === 'undefined')
            {
                break;
            }
            else if (value)
            {
                ret.push(value);
            }
        }

        return ret;
    }
    else
    {
        var ret = {};

        for (var key in arrayOrObj)
        {
            if (arrayOrObj.hasOwnProperty(key))
            {
                var value = callback.call(context, arrayOrObj[key], key);

                if (value === false)
                {
                    continue;
                }
                else if (typeof value === 'undefined')
                {
                    break;
                }
                else if (value)
                {
                    ret[key] = value;
                }
            }
        }
    }
}

/**
 * Map object to array
 * 
 * return undefined to break loop, true to keep, false to reject
 * 
 * @param [{Array}|{Objet}] object     Object or array
 * @param {Function}        callback   Callback
 * @param {context}         context    callback context (optional)
 * 
 * // callback(value, keyOrIndex) this = context 
 */
function mapObjectArr(object, callback, context)
{
    context = typeof context === 'undefined' ? object : context;

    var ret = [];

    for (var key in object)
    {
        if (object.hasOwnProperty(key))
        {
            var value = callback.call(context, object[key], key);

            if (value === false)
            {
                continue;
            }
            else if (typeof value === 'undefined')
            {
                break;
            }
            else if (value)
            {
                ret.push(value);
            }
        }
    }

    return ret;
}

/**
 * Join object.
 * 
 * return undefined to break loop, true to keep, false to reject
 * 
 * @param [{Array}|{Objet}] arrayOrObj Object or array
 * @param {Function}        callback   Callback
 * @param {context}         context    callback context (optional)
 * 
 * // callback(value, keyOrIndex) this = context 
 */
function joinObj(obj, glue, separator)
{
    glue = typeof glue === 'undefined' ? '=' : glue;

    separator = typeof separator === 'undefined' ? ',' : separator;

    return Object.keys(obj).map(function (key) { return [key, obj[key]].join(glue); }).join(separator);
}

const _ = {
    triggerEvent,
    foreach,
    array_set,
    array_get: utils_array_get,
    array_has,
    array_delete,
    dotify,
    is_htmlElement,
    is_callable,
    is_object: utils_is_object,
    is_array,
    is_string,
    mergeDeep,
    mapStrict,
    mapObjectArr,
    joinObj
};

/* harmony default export */ const utils = (_);
;// CONCATENATED MODULE: ./src/js/dom/vdom/VNode.js



const TEXT_TYPES = ['boolean', 'number', 'string', 'undefined'];

class VNode
{
    constructor(type, props, children)
    {        
        children = normaliseChildren(children);

        this.$$typof = utils.is_callable(type) ? NODE_FLAG.COMPONENT : (type === undefined ? NODE_FLAG.TEXT : NODE_FLAG.ELEMENT);
        this.key     = null;
        this.props   = props || { children: children };
        this.ref     = null;
        this.type    = type;

        if (props && props.key)
        {
            this.key = props.key;
        }

        const vnode = this;
        
        const makeChildFlag = function(children)
        {
            children = typeof children === 'undefined' ? vnode.props.children : children;

            if (vnode.flag === NODE_FLAG.COMPONENT)
            {
                vnode.__internals._childFlag = CHILD_FLAG.SINGLE_CHILD;
            }
            else
            {
                if (utils.is_array(children))
                {
                    if (children.length === 0)
                    {
                        vnode.__internals._childFlag = CHILD_FLAG.NO_CHILD;
                    }
                    else if (children.length === 1)
                    {
                        vnode.__internals._childFlag = CHILD_FLAG.SINGLE_CHILD;
                        vnode.props.children = children[0];
                    }
                    else
                    {
                        vnode.__internals._childFlag = CHILD_FLAG.KEY_CHILD;
                        vnode.props.children = children;
                    }
                }
                else if (children == null)
                {
                    vnode.__internals._childFlag = CHILD_FLAG.NO_CHILD
                }
                else if (typeof children.$$typof !== 'undefined')
                {
                    vnode.__internals._childFlag = CHILD_FLAG.SINGLE_CHILD
                    vnode.props.children = children
                }
                else
                {                
                    // treat all as text
                    vnode.__internals._childFlag = CHILD_FLAG.SINGLE_CHILD
                    vnode.props.children  = createTextVNode(children);
                }
            }
        }

        this.__internals = 
        {
            _el: null,
            _component: null,
            _childFlag: 1,
            _makeChildFlag: makeChildFlag,
        };

        makeChildFlag(children);
    }
}

function createTextVNode(text, key)
{    
    return {
        $$typof: NODE_FLAG.TEXT,
        type: null,
        props: null,
        text : text + '',
        key: key,
        __internals :
        {
            _el: null,
            _component: null,
            _childFlag: 2,
        }
   };
}

function normaliseChildren(children, offset)
{    
    offset = typeof offset === 'undefined' ? 0 : offset;

    var ret = [];

    if (utils.is_array(children))
    {
        utils.foreach(children, function(i, child)
        {
            const type = typeof child;
            const keyIndex = '|' + (offset + i);

            if (child && child.$$typof)
            {
                if (!child.key)
                {
                    child.key = keyIndex;
                }

                ret.push(child);
            }
            else if (TEXT_TYPES.includes(type))
            {        
                ret.push(createTextVNode(child, keyIndex));
            }
            else if (utils.is_array(child))
            {                
                child = normaliseChildren(child, ret.length);
                
                ret = [...ret, ...child];
            }
        });
    }
    
    return ret;
}
;// CONCATENATED MODULE: ./src/js/dom/vdom/index.js



/* harmony default export */ const vdom = (VNode);
;// CONCATENATED MODULE: ./src/js/dom/diff/index.js



/**
 * Diff Vndoes
 * 
 * @param [{Array}|{null}]  prevChildren  Previous children
 * @param [{Array}|{null}]  nextChildren  Next children
 * @param {htmlElement}     parent        Parent node
 */
function diff(prevChildren, nextChildren, parent)
{    
    let prevIndexMap = {};
    let nextIndexMap = {};
    
    for (let i = 0; i < prevChildren.length; i++)
    {
        let { key } = prevChildren[i];

        prevIndexMap[key] = i;
    }

    let lastIndex = 0;
    
    for (let i = 0; i < nextChildren.length; i++)
    {
        let nextChild = nextChildren[i];
        let nextKey   = nextChild.key;
        let j         = prevIndexMap[nextKey];

        nextIndexMap[nextKey] = i;

        if (j === undefined)
        {
            let refNode = i === 0 ? prevChildren[0].__internals._el : nextChildren[i - 1].__internals._el.nextSibling;

            mount(nextChild, parent, refNode)
        }
        else
        {
            patch(prevChildren[j], nextChild, parent)
            
            if (j < lastIndex)
            {
                let refNode = nextChildren[i - 1].__internals._el.nextSibling;
                
                parent.insertBefore(nextChild.__internals._el, refNode);
            }
            else
            {
                lastIndex = j;
            }
        }
    }

    for (let i = 0; i < prevChildren.length; i++)
    {
        let { key } = prevChildren[i];

        if (!nextIndexMap.hasOwnProperty(key))
        {
            parent.removeChild(prevChildren[i].__internals._el)
        }
    }
}
;// CONCATENATED MODULE: ./src/js/dom/patch/patchChildren.js





function patchChildren(prevChildren, prevChildFlag, nextChildren, nextChildFlag, parent)
{  
    switch (prevChildFlag)
    {
        // The old children is a single child node, the case statement block will be executed
        case CHILD_FLAG.SINGLE_CHILD:
            
            switch (nextChildFlag)
            {
                case CHILD_FLAG.SINGLE_CHILD:
                    // When the new children is also a single child node, the case statement block will be executed
                    patch(prevChildren, nextChildren, parent)

                    break
                case CHILD_FLAG.NO_CHILD:
                    // When there are no child nodes in the new children, the case statement block will be executed
                    parent.removeChild(prevChildren.__internals._el)

                    break
                default:
                    // When there are multiple child nodes in the new children, the case statement block will be executed
                    parent.removeChild(prevChildren.__internals._el)
                    for (let child of nextChildren)
                    {
                        mount(child, parent)
                    }

                    break
                }

            break
        
        // When there are no child nodes in the old children, the case statement block will be executed
        case CHILD_FLAG.NO_CHILD:
            switch (nextChildFlag)
            {
            case CHILD_FLAG.SINGLE_CHILD:
                // When the new children is a single child node, the case statement block will be executed
                mount(nextChildren, parent)

                break
            case CHILD_FLAG.NO_CHILD:
                // When there are no child nodes in the new children, the case statement block will be executed
                break
            default:
                // When there are multiple child nodes in the new children, the case statement block will be executed
                for (const child of nextChildren)
                {
                    mount(child, parent)
                }

                break
            }
            break
        // When there are multiple child nodes in the old children, the case statement block will be executed
        default:
            switch (nextChildFlag)
            {
            case CHILD_FLAG.SINGLE_CHILD:
                
                // When the new children is a single child node, the case statement block will be executed
                for (const child of prevChildren)
                {
                    parent.removeChild(child.__internals._el)
                }
                mount(nextChildren, parent)

                break
            case CHILD_FLAG.NO_CHILD:
                
                // When there are no child nodes in the new children, the case statement block will be executed
                for (const child of prevChildren)
                {
                    parent.removeChild(child.__internals._el)
                }

                break
            default:
                
                // When there are multiple child nodes in the new children, the case statement block will be executed
                // key diff algorithm
                diff(prevChildren, nextChildren, parent)
                break
            }
            break
        }
} 
;// CONCATENATED MODULE: ./src/js/dom/patch/patchComponent.js



function patchComponent(prevNode, nextNode, parent)
{
    // Patch one component with another

    // @todo fragment / no return

    // unmount old compoonent & remove listeners etc..
    /// unmount (prevNode)

    if (prevNode === nextNode)
    {
        return;
    }
    else
    {
        console.log(prevNode);
    }
}
;// CONCATENATED MODULE: ./src/js/dom/component/constants.js
const ACCEPTED_EVENTS = (/* unused pure expression or super */ null && (['onAbort', 'onAfterPrint', 'onAnimationend', 'onAnimationIteration', 'onAnimationStart', 'onAuxClick', 'onBeforeCopy', 'onBeforeCut', 'onBeforeInput', 'onBeforeMatch', 'onBeforePaste', 'onBeforePrint', 'onBeforeUnload', 'onBlur', 'onCancel', 'onCanplay', 'onCanplayThrough', 'onChange', 'onClick', 'onClose', 'onContextLost', 'onContextMenu', 'onContextRestored', 'onCopy', 'onCueChange', 'onCut', 'onDblClick', 'onDrag', 'onDragEnd', 'onDragEnter', 'onDragLeave', 'onDragOver', 'onDragStart', 'onDrop', 'onDurationChange', 'onEmptied', 'onEnded', 'onError', 'onFocus', 'onFormData', 'onFullScreenChange', 'onFullScreenError', 'onGotPointerCapture', 'onHashChange', 'onInput', 'onInvalid', 'onKeydown', 'onKeypress', 'onKeyup', 'onLanguageChange', 'onLoad', 'onLoadedData', 'onLoadedMetaData', 'onLoadDtart', 'onLostPointerCapture', 'onMessage', 'onMessageError', 'onMouseDown', 'onMouseEnter', 'onMouseLeave', 'onMouseMove', 'onMouseOut', 'onMouseOver', 'onMouseUp', 'onMouseWheel', 'onOffline', 'onOnline', 'onPageHide', 'onPageShow', 'onPaste', 'onPause', 'onPlay', 'onPlaying', 'onPointerCancel', 'onPointerDown', 'onPointerEnter', 'onPointerLeave', 'onPointerMove', 'onPointerOut', 'onPointerOver', 'onPointerRawUpdate', 'onPointerUp', 'onPopState', 'onProgress', 'onRateChange', 'onRejectionHandled', 'onReset', 'onResize', 'onScroll', 'onSearch', 'onSecurityPolicyViolation', 'onSeeked', 'onSeeking', 'onSelect', 'onSelectionChange', 'onSelectStart', 'onSlotChange', 'onStalled', 'onStorage', 'onSubmit', 'onSuspend', 'onTimeUpdate', 'onToggle', 'onTransitionCancel', 'onTransitionEnd', 'onTransitionRun', 'onTransitionStart', 'onUnhandledRejection', 'onUnload', 'onVolumeChange', 'onWaiting', 'onWebkitAnimationEnd', 'onWebkitAnimationIteration', 'onWebkitAnimationStart', 'onWebkitFullScreenChange', 'onWebkitFullScreenerror', 'onWebkitTransitionEnd', 'onWheel']));

const ACCEPTED_PROPS = {
	"*": ["about", "acceptCharset", "accessKey", "allowFullScreen", "allowTransparency", "autoComplete", "autoFocus", "autoPlay", "capture", "cellPadding", "cellSpacing", "charSet", "classID", "className", "colSpan", "contentEditable", "contextMenu", "crossOrigin", "dangerouslySetInnerHTML", "datatype", "dateTime", "dir", "draggable", "encType", "formAction", "formEncType", "formMethod", "formNoValidate", "formTarget", "frameBorder", "hidden", "hrefLang", "htmlFor", "httpEquiv", "icon", "id", "inlist", "inputMode", "is", "itemID", "itemProp", "itemRef", "itemScope", "itemType", "keyParams", "keyType", "lang", "marginHeight", "marginWidth", "maxLength", "mediaGroup", "minLength", "noValidate", "onBlur", "onFocus", "onKeyDown", "onKeyPress", "onKeyUp", "prefix", "property", "radioGroup", "readOnly", "resource", "role", "rowSpan", "scoped", "seamless", "security", "spellCheck", "srcDoc", "srcLang", "srcSet", "style", "suppressContentEditableWarning", "tabIndex", "title", "typeof", "unselectable", "useMap", "vocab", "wmode"],
	a: ["coords", "download", "href", "name", "rel", "shape", "target", "type", "onClick"],
	abbr: ["title"],
	applet: ["alt", "height", "name", "width"],
	area: ["alt", "coords", "download", "href", "rel", "shape", "target", "type"],
	audio: ["controls", "loop", "muted", "preload", "src"],
	base: ["href", "target"],
	basefont: ["size"],
	bdo: ["dir"],
	blockquote: ["cite"],
	button: ["disabled", "form", "name", "type", "value"],
	canvas: ["height", "width"],
	col: ["span", "width"],
	colgroup: ["span", "width"],
	data: ["value"],
	del: ["cite"],
	details: ["open"],
	dfn: ["title"],
	dialog: ["open"],
	embed: ["height", "src", "type", "width"],
	fieldset: ["disabled", "form", "name"],
	font: ["size"],
	form: ["accept", "action", "method", "name", "target", "onChange", "onInput", "onInvalid", "onSubmit"],
	frame: ["name", "scrolling", "src"],
	frameset: ["cols", "rows"],
	head: ["profile"],
	hr: ["size", "width"],
	html: ["manifest"],
	iframe: ["height", "name", "sandbox", "scrolling", "src", "width"],
	img: ["alt", "height", "name", "sizes", "src", "width"],
	input: ["accept", "alt", "autoCapitalize", "autoCorrect", "autoSave", "checked", "defaultChecked", "defaultValue", "disabled", "form", "height", "list", "max", "min", "multiple", "name", "onChange", "pattern", "placeholder", "required", "results", "size", "src", "step", "title", "type", "value", "width"],
	ins: ["cite"],
	keygen: ["challenge", "disabled", "form", "name"],
	label: ["form"],
	li: ["type", "value"],
	link: ["color", "href", "integrity", "media", "nonce", "rel", "scope", "sizes", "target", "title", "type"],
	map: ["name"],
	meta: ["content", "name"],
	meter: ["high", "low", "max", "min", "optimum", "value"],
	object: ["data", "form", "height", "name", "type", "width"],
	ol: ["reversed", "start", "type"],
	optgroup: ["disabled", "label"],
	option: ["disabled", "label", "selected", "value"],
	output: ["form", "name"],
	param: ["name", "type", "value"],
	pre: ["width"],
	progress: ["max", "value"],
	q: ["cite"],
	script: ["async", "defer", "integrity", "nonce", "src", "type"],
	select: ["defaultValue", "disabled", "form", "multiple", "name", "onChange", "required", "size", "value"],
	slot: ["name"],
	source: ["media", "sizes", "src", "type"],
	style: ["media", "nonce", "title", "type"],
	table: ["summary", "width"],
	td: ["headers", "height", "scope", "width"],
	textarea: ["autoCapitalize", "autoCorrect", "cols", "defaultValue", "disabled", "form", "name", "onChange", "placeholder", "required", "rows", "value", "wrap"],
	th: ["headers", "height", "scope", "width"],
	track: ["default", "kind", "label", "src"],
	ul: ["type"],
	video: ["controls", "height", "loop", "muted", "playsInline", "poster", "preload", "src", "width"],
	svg: ["accentHeight", "accumulate", "additive", "alignmentBaseline", "allowReorder", "alphabetic", "amplitude", "arabicForm", "ascent", "attributeName", "attributeType", "autoReverse", "azimuth", "baseFrequency", "baseProfile", "baselineShift", "bbox", "begin", "bias", "by", "calcMode", "capHeight", "clip", "clipPath", "clipPathUnits", "clipRule", "color", "colorInterpolation", "colorInterpolationFilters", "colorProfile", "colorRendering", "contentScriptType", "contentStyleType", "cursor", "cx", "cy", "d", "decelerate", "descent", "diffuseConstant", "direction", "display", "divisor", "dominantBaseline", "dur", "dx", "dy", "edgeMode", "elevation", "enableBackground", "end", "exponent", "externalResourcesRequired", "fill", "fillOpacity", "fillRule", "filter", "filterRes", "filterUnits", "floodColor", "floodOpacity", "focusable", "fontFamily", "fontSize", "fontSizeAdjust", "fontStretch", "fontStyle", "fontVariant", "fontWeight", "format", "from", "fx", "fy", "g1", "g2", "glyphName", "glyphOrientationHorizontal", "glyphOrientationVertical", "glyphRef", "gradientTransform", "gradientUnits", "hanging", "height", "horizAdvX", "horizOriginX", "ideographic", "imageRendering", "in", "in2", "intercept", "k", "k1", "k2", "k3", "k4", "kernelMatrix", "kernelUnitLength", "kerning", "keyPoints", "keySplines", "keyTimes", "lengthAdjust", "letterSpacing", "lightingColor", "limitingConeAngle", "local", "markerEnd", "markerHeight", "markerMid", "markerStart", "markerUnits", "markerWidth", "mask", "maskContentUnits", "maskUnits", "mathematical", "mode", "numOctaves", "offset", "opacity", "operator", "order", "orient", "orientation", "origin", "overflow", "overlinePosition", "overlineThickness", "paintOrder", "panose1", "pathLength", "patternContentUnits", "patternTransform", "patternUnits", "pointerEvents", "points", "pointsAtX", "pointsAtY", "pointsAtZ", "preserveAlpha", "preserveAspectRatio", "primitiveUnits", "r", "radius", "refX", "refY", "renderingIntent", "repeatCount", "repeatDur", "requiredExtensions", "requiredFeatures", "restart", "result", "rotate", "rx", "ry", "scale", "seed", "shapeRendering", "slope", "spacing", "specularConstant", "specularExponent", "speed", "spreadMethod", "startOffset", "stdDeviation", "stemh", "stemv", "stitchTiles", "stopColor", "stopOpacity", "strikethroughPosition", "strikethroughThickness", "string", "stroke", "strokeDasharray", "strokeDashoffset", "strokeLinecap", "strokeLinejoin", "strokeMiterlimit", "strokeOpacity", "strokeWidth", "surfaceScale", "systemLanguage", "tableValues", "targetX", "targetY", "textAnchor", "textDecoration", "textLength", "textRendering", "to", "transform", "u1", "u2", "underlinePosition", "underlineThickness", "unicode", "unicodeBidi", "unicodeRange", "unitsPerEm", "vAlphabetic", "vHanging", "vIdeographic", "vMathematical", "values", "vectorEffect", "version", "vertAdvY", "vertOriginX", "vertOriginY", "viewBox", "viewTarget", "visibility", "width", "widths", "wordSpacing", "writingMode", "x", "x1", "x2", "xChannelSelector", "xHeight", "xlinkActuate", "xlinkArcrole", "xlinkHref", "xlinkRole", "xlinkShow", "xlinkTitle", "xlinkType", "xmlBase", "xmlLang", "xmlSpace", "xmlns", "xmlnsXlink", "y", "y1", "y2", "yChannelSelector", "z", "zoomAndPan"],
	elements: ["a", "abbr", "address", "area", "article", "aside", "audio", "b", "base", "bdi", "bdo", "blockquote", "body", "br", "button", "canvas", "caption", "cite", "code", "col", "colgroup", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "div", "dl", "dt", "em", "embed", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "iframe", "img", "input", "ins", "kbd", "keygen", "label", "legend", "li", "link", "main", "map", "mark", "math", "menu", "menuitem", "meta", "meter", "nav", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "picture", "pre", "progress", "q", "rb", "rp", "rt", "rtc", "ruby", "s", "samp", "script", "section", "select", "slot", "small", "source", "span", "strong", "style", "sub", "summary", "sup", "svg", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "u", "ul", "var", "video", "wbr"]
};
;// CONCATENATED MODULE: ./src/js/dom/component/events.js
const _events = {};

/**
 * Add an event listener
 *
 * @access public
 * @param  node    element    The target DOM node
 * @param  string  eventName  Event type
 * @param  closure handler    Callback event
 * @param  bool    useCapture Use capture (optional) (defaul false)
 */
function addEventListener(element, eventName, handler, useCapture)
{
    // Boolean use capture defaults to false
    useCapture = typeof useCapture === 'undefined' ? false : Boolean(useCapture);

    // Class event storage
    var events = _events;

    // Make sure events are set
    if (!events)
    {
        _events = events = {};
    }

    // Make sure an array for the event type exists
    if (!events[eventName])
    {
        events[eventName] = [];
    }

    // Arrays
    if (Array.isArray(element))
    {
        for (var i = 0; i < element.length; i++)
        {
            addEventListener(element[i], eventName, handler, useCapture);
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

        _addListener(element, eventName, handler, useCapture);
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
function removeEventListener(element, eventName, handler, useCapture)
{
    if (Array.isArray(element))
    {
        for (var j = 0; j < element.length; j++)
        {
            removeEventListener(element[j], eventName, handler, useCapture);
        }
    }
    else
    {
        // If the eventName name was not provided - remove all event handlers on element
        if (!eventName)
        {
            return _removeElementListeners(element);
        }

        // If the callback was not provided - remove all events of the type on the element
        if (!handler)
        {
            return _removeElementTypeListeners(element, eventName);
        }

        // Default use capture
        useCapture = typeof useCapture === 'undefined' ? false : Boolean(useCapture);

        var eventObj = _events[eventName];

        if (typeof eventObj === 'undefined')
        {
            return;
        }

        // Loop stored events and match node, event name, handler, use capture
        for (var i = 0, len = eventObj.length; i < len; i++)
        {
            if (eventObj[i]['handler'] === handler && eventObj[i]['useCapture'] === useCapture && eventObj[i]['element'] === element)
            {
                _removeListener(element, eventName, handler, useCapture);

                _events[eventName].splice(i, 1);

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
function clearEventListeners()
{
    var events = _events;

    for (var eventName in events)
    {
        var eventObj = events[eventName];

        var i = eventObj.length;

        while (i--)
        {
            _removeListener(eventObj[i]['element'], eventName, eventObj[i]['handler'], eventObj[i]['useCapture']);

            _events[eventName].splice(i, 1);
        }
    }
}

/**
 * Removes all event listeners registered by the library on nodes
 * that are no longer part of the DOM tree
 *
 * @access public
 */
function collectGarbage()
{
    var events = _events;
    for (var eventName in events)
    {
        var eventObj = events[eventName];
        var i = eventObj.length;
        while (i--)
        {
            var el = eventObj[i]['element'];
            if (el == window || el == document || el == document.body) continue;
            if (!_nodeExists(el))
            {
                _removeListener(eventObj[i]['element'], eventName, eventObj[i]['handler'], eventObj[i]['useCapture']);
                
                _events[eventName].splice(i, 1);
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
function _removeElementListeners(element)
{
    var events = _events;

    for (var eventName in events)
    {
        var eventObj = events[eventName];

        var i = eventObj.length;

        while (i--)
        {
            if (eventObj[i]['element'] === element)
            {
                _removeListener(eventObj[i]['element'], eventName, eventObj[i]['handler'], eventObj[i]['useCapture']);
                
                _events[eventName].splice(i, 1);
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
function _removeElementTypeListeners(element, type)
{
    var eventObj = _events[type];

    var i = eventObj.length;

    while (i--)
    {
        if (eventObj[i]['element'] === element)
        {
            _removeListener(eventObj[i]['element'], type, eventObj[i]['handler'], eventObj[i]['useCapture']);
            
            _events[type].splice(i, 1);
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
function _addListener(el, eventName, handler, useCapture)
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
function _removeListener(el, eventName, handler, useCapture)
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
 * Check if a node exists in the DOM
 *
 * @access public
 * @param  node   element Target element
 * @return bool
 */
function _nodeExists(element)
{
    if (element === document.body || element === document.documentElement)
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

;// CONCATENATED MODULE: ./src/js/dom/component/attr.js


const _PROP_FIX = 
{
    "for"             : "htmlFor",
    "class"           : "className",
    "classname"       : "className",
    "tabindex"        : "tabIndex",
    "readonly"        : "readOnly",
    "maxlength"       : "maxLength",
    "cellspacing"     : "cellSpacing",
    "cellpadding"     : "cellPadding",
    "rowspan"         : "rowSpan",
    "colspan"         : "colSpan",
    "usemap"          : "useMap",
    "frameborder"     : "frameBorder",
    "contenteditable" : "contentEditable",
    "html"            : "innerHTML",
    "text"            : "innerText"
};

/**
 * CSS PREFIXABLE
 *
 * @var array
 */
const CSS_PREFIXABLE =
[
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

/**
 * List of browser prefixes
 *
 * @var array
 */
const CSS_PREFIXES =
[
    'webkit',
    'Moz',
    'ms',
    'O',
];

/**
 * Get or set attribute
 * 
 * Note that this will always set/get the actual property
 * except for style|data-*|aria-* attributes" which it will remove and or set
 *
 * @access public
 * @param  node|array elem  Node or array of nodes
 * @param  string     name  Attribute name
 * @param  mixed      value Attribute value
 */
function attr(elem, name, value)
{    
    // Multiple elements
    if (utils.is_array(elem))
    {
        utils.foreach(elem, function(i, el)
        {
            attr(el, name, value);
        });

        return;
    }

    // node, { key: value }
    if (is_object(name) && typeof value === 'undefined')
    {
        utils.foreach(name, function(key, val)
        {
            attr(elem, key, val);
        });

        return;
    }

    // Cached vars
    let nType      = elem.nodeType;
    let isDataAttr = false;
    let isAriaAttr = false;
    let prop       = name;

    // don't get/set attributes on comment and attribute nodes
    if (!elem || nType === 8 || nType === 2)
    {
        return;
    }

    // Text nodes don't have attribute methods
    if (nType === 3)
    {
        if (name === 'textContent' || name === 'textcontent')
        {
            if (value !== undefined)
            {
                elem.textContent = value === null ? '' : value + '';

                return;
            }
            else
            {
               return elem.textContent;
            }
        }
    }

    // Special case for data and aria attributes
    // handles both data-foo-bar and dataFooBar
    if (name.startsWith('data') || name.startsWith('aria'))
    {
        if (name.startsWith('data'))
        {
            isDataAttr = true;
        }
        else
        {
            isAriaAttr = true;
        }

        // data-foo-bar 
        if (name.includes('-'))
        {
            prop = name.slice(5);
        }
        // dataFooBar -> data-foo-bar
        else
        {
            prop = name;
            name = _dcfirst(_camelCaseToHyphen(toLowerCase()));
        }
    }
    // Special case for style
    else if (name === 'style')
    {
        // attr(el, 'style', null)
        if (value === null)
        {
            elem.removeAttribute('style');

            return;
        }

        // attr(el, 'style', 'color: "red"';background: "blue"'})
        else if (typeof value === 'string')
        {
            utils.foreach(value.split(';'), function(i, rule)
            {
                var style = rule.split(':');

                if (style.length >= 2)
                {
                    css(elem, style.shift().trim(), style.join(':').trim());
                }
            });
        }

        // attr(el, 'style', {color: 'red'})
        else if (is_object(value))
        {
            css(elem, value);
        }

        return;
    }
    else
    {
        name = _PROP_FIX[name] || name;
    }

    // returns value
    // var id = attr(el, 'id')
    if (value === undefined)
    {
        // var name = attr(el, 'data-name')
        var ret = isDataAttr ? elem.dataset[name] : elem[name];

        // Non-existent attributes return null, we normalize to undefined
        return ret === null ? undefined : ret;
    }

    // removes the value
    // attr(el, 'href', null)
    // attr(el, 'data-name', null) etc...
    else if (value === null)
    {
        _removeAttr(elem, name, isDataAttr, isAriaAttr);

        return;
    }

    // attr(el, 'data-name', 'foo bar') etc...
    if (isDataAttr)
    {
        elem.dataset[name] = value + '';

        elem.setAttribute(prop, value + '');
    }

    // attr(el, 'aria-hidden', true) etc...
    else if (isAriaAttr)
    {
        elem.setAttribute(name, value + '');
    }

    // attr(el, 'href', 'foo/bar')
    // attr(el, 'value', 'foo')
    else
    {
        elem[name] = value;
    }
    
    return;
}

/**
 * Remove attribute
 *
 * @access private
 * @param  node         elem       Node or array of nodes
 * @param  string|array attribute  Attribute or array of attribute
 * @param  bool         isDataAttr Is dataset attribute
 * @param  bool         isDataAttr Is aria attribute
 */
function _removeAttr(elem, name, isDataAttr, isAriaAttr)
{
    // Multiple els
    if (utils.is_array(elem))
    {
        utils.foreach(elem, function(i, el)
        {
            _removeAttr(el, name, isDataAttr, isAriaAttr);
        });

        return;
    }

    // attr(el, ['data-foo', 'data-bar'], null)
    if (utils.is_array(name))
    {
        utils.foreach(name, function(i, prop)
        {
            _removeAttr(elem, prop);
        });

        return;
    }

    if (name && elem.nodeType === 1)
    {
        if (isDataAttr)
        {
            delete elem.dataset[name];

            elem.removeAttribute(name);

            return;
        }
        else if (name === 'style')
        {
            elem.removeAttribute('style');

            return;
        }
        else if (name.includes('aria'))
        {
            var camel = _toCamelCase(name);

            if (camel in elem)
            {
                delete elem[camel];
            }

            elem.removeAttribute(name);
        }

        var rboolean = /^(?:checked|selected|autofocus|autoplay|async|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped)$/i;
        var propName = _PROP_FIX[name] || name;
        var isBool   = rboolean.test(name);

        // See #9699 for explanation of this approach (setting first, then removal)
        // Do not do this for boolean attributes (see #10870)
        if (!isBool)
        {
            elem[propName] = '';
        }

        elem.removeAttribute(name);

        // Set corresponding property to false for boolean attributes
        if (isBool && propName in elem)
        {
            elem[propName] = false;
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
function css(el, property, value)
{
    // If their is no value and property is an object
    if ((typeof property === "object" || typeof property === 'function') && (property !== null))
    {
        for (var key in property)
        {
            if (!property.hasOwnProperty(key))
            {
                continue;
            }

            css(el, key, property[key]);
        }
    }
    else
    {
        // vendor prefix the property if need be and convert to camelCase
        var properties = _vendorPrefix(property);

        // Loop vendored (if added) and unvendored properties and apply
        for (var i = 0; i < properties.length; i++)
        {
            el.style[properties[i]] = value;
        }
    }
}

/**
 * Vendor prefix a css property and convert to camelCase
 *
 * @access private
 * @param  string property The CSS base property
 * @return array
 */
function _vendorPrefix(property)
{
    // Properties to return
    var props = [];

    // Convert to regular hyphenated property 
    property = _camelCaseToHyphen(property);

    // Is the property prefixable ?
    if (CSS_PREFIXABLE.includes(property))
    {
        var prefixes = CSS_PREFIXES;

        // Loop vendor prefixes
        for (var i = 0; i < prefixes.length; i++)
        {
            props.push(prefixes[i] + _ucfirst(_toCamelCase(property)));
        }
    }

    // Add non-prefixed property
    props.push(_toCamelCase(property));

    return props;
}

function _toCamelCase(str)
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

function _camelCaseToHyphen(str)
{
    return str
        // insert a hyphen between lower & upper
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        // hyphen before last upper in a sequence followed by lower
        .replace(/\b([A-Z]+)([A-Z])([a-z])/, '$1-$2$3').toLowerCase();
}

function _ucfirst(string)
{
    return (string + '').charAt(0).toUpperCase() + string.slice(1);
}

function _dcfirst(string)
{
    return (string + '').charAt(0).toLowerCase() + string.slice(1);
}


;// CONCATENATED MODULE: ./src/js/dom/jsx/Parser.js
function oneObject(str) {
    var obj = {}
    str.split(",").forEach(_ => obj[_] = true)
    return obj
}
var voidTag = oneObject("area,base,basefont,br,col,frame,hr,img,input,link,meta,param,embed,command,keygen,source,track,wbr")
var specalTag = oneObject('xmp,style,script,noscript,textarea,template,#comment')

var hiddenTag = oneObject('style,script,noscript,template')

const Parser = function(a, f)
{
    if (!(this instanceof Parser)) {
        return parse(a, f)
    }
    this.input = a
    this.getOne = f
}

Parser.prototype = {
    parse: function() {
        return parse(this.input, this.getOne)
    }
}
var rsp = /\s/
    /**
     * 
     * 
     * @param {any} string 
     * @param {any} getOne 只返回一个节点
     * @returns 
     */
function parse(string, getOne) {
    getOne = (getOne === void 666 || getOne === true)
    var ret = lexer(string, getOne)
    if (getOne) {
        return typeof ret[0] === 'string' ? ret[1] : ret[0]
    }
    return ret
}

function lexer(string, getOne) {
    var tokens = []
    var breakIndex = 120
    var stack = []
    var origString = string
    var origLength = string.length

    stack.last = function() {
        return stack[stack.length - 1]
    }
    var ret = []

    function addNode(node) {
        var p = stack.last()
        if (p && p.children) {
            p.children.push(node)
        } else {
            ret.push(node)
        }
    }

    var lastNode
    do {
        if (--breakIndex === 0) {
            break
        }
        var arr = getCloseTag(string)

        if (arr) { //处理关闭标签
            string = string.replace(arr[0], '')
            const node = stack.pop()
                //处理下面两种特殊情况：
                //1. option会自动移除元素节点，将它们的nodeValue组成新的文本节点
                //2. table会将没有被thead, tbody, tfoot包起来的tr或文本节点，收集到一个新的tbody元素中
            if (node.type === 'option') {
                node.children = [{
                    type: '#text',
                    nodeValue: getText(node)
                }]
            } else if (node.type === 'table') {
                insertTbody(node.children)
            }
            lastNode = null
            if (getOne && ret.length === 1 && !stack.length) {
                return [origString.slice(0, origLength - string.length), ret[0]]
            }
            continue
        }

        var arr = getOpenTag(string)
        if (arr) {
            string = string.replace(arr[0], '')
            var node = arr[1]
            addNode(node)
            var selfClose = !!(node.isVoidTag || specalTag[node.type])
            if (!selfClose) { //放到这里可以添加孩子
                stack.push(node)
            }
            if (getOne && selfClose && !stack.length) {
                return [origString.slice(0, origLength - string.length), node]
            }
            lastNode = node
            continue
        }

        var text = ''
        do {
            //处理<div><<<<<<div>的情况
            const index = string.indexOf('<')
            if (index === 0) {
                text += string.slice(0, 1)
                string = string.slice(1)

            } else {
                break
            }
        } while (string.length);
        //处理<div>{aaa}</div>,<div>xxx{aaa}xxx</div>,<div>xxx</div>{aaa}sss的情况
        const index = string.indexOf('<') //判定它后面是否存在标签
        const bindex = string.indexOf('{') //判定它后面是否存在jsx
        const aindex = string.indexOf('}')

        let hasJSX = (bindex < aindex) && (index === -1 || bindex < index)
        if (hasJSX) {
            if (bindex !== 0) { // 收集jsx之前的文本节点
                text += string.slice(0, bindex)
                string = string.slice(bindex)
            }
            addText(lastNode, text, addNode)
            string = string.slice(1) //去掉前面{
            var arr = parseCode(string)
            addNode(makeJSX(arr[1]))
            lastNode = false
            string = string.slice(arr[0].length + 1) //去掉后面的}
        } else {
            if (index === -1) {
                text = string
                string = ''
            } else {
                text += string.slice(0, index)
                string = string.slice(index)
            }
            addText(lastNode, text, addNode)
        }

    } while (string.length);
    return ret
}


function addText(lastNode, text, addNode) {
    if (/\S/.test(text)) {
        if (lastNode && lastNode.type === '#text') {
            lastNode.text += text
        } else {
            lastNode = {
                type: '#text',
                nodeValue: text
            }
            addNode(lastNode)
        }
    }
}

//它用于解析{}中的内容，如果遇到不匹配的}则返回, 根据标签切割里面的内容 
function parseCode(string) { // <div id={ function(){<div/>} }>
    var word = '', //用于匹配前面的单词
        braceIndex = 1,
        codeIndex = 0,
        nodes = [],
        quote,
        escape = false,
        state = 'code'
    for (var i = 0, n = string.length; i < n; i++) {
        var c = string.charAt(i),
            next = string.charAt(i + 1)
        switch (state) {
            case 'code':
                if (c === '"' || c === "'") {
                    state = 'string'
                    quote = c
                } else if (c === '{') {
                    braceIndex++
                } else if (c === '}') {
                    braceIndex--
                    if (braceIndex === 0) {
                        collectJSX(string, codeIndex, i, nodes)
                        return [string.slice(0, i), nodes]
                    }
                } else if (c === '<') {
                    var word = '',
                        empty = true ,
                        index = i - 1
                    do {
                        c = string.charAt(index)
                        if (empty && rsp.test(c)) {
                            continue
                        }
                        if (rsp.test(c)) {
                            break
                        }
                        empty = false
                        word = c + word
                        if (word.length > 7) { //性能优化
                            break
                        }
                    } while (--index >= 0);
                    var chunkString = string.slice(i)
                    if (word === '' || /(=>|return|\{|\(|\[|\,)$/.test(word) && /\<\w/.test(chunkString)) {
                        collectJSX(string, codeIndex, i, nodes)
                        var chunk = lexer(chunkString, true)
                        nodes.push(chunk[1])
                        i += (chunk[0].length - 1) //因为已经包含了<, 需要减1
                        codeIndex = i + 1
                    }

                }
                break
            case 'string':
                if (c == '\\' && (next === '"' || next === "'")) {
                    escape = !escape
                } else if (c === quote && !escape) {
                    state = 'code'
                }
                break
        }

    }
}

function collectJSX(string, codeIndex, i, nodes) {
    var nodeValue = string.slice(codeIndex, i)
    if (/\S/.test(nodeValue)) { //将{前面的东西放进去
        nodes.push({
            type: '#jsx',
            nodeValue: nodeValue
        })
    }
}

var rtbody = /^(tbody|thead|tfoot)$/

function insertTbody(nodes) {
    var tbody = false
    for (var i = 0, n = nodes.length; i < n; i++) {
        var node = nodes[i]
        if (rtbody.test(node.nodeName)) {
            tbody = false
            continue
        }

        if (node.nodeName === 'tr') {
            if (tbody) {
                nodes.splice(i, 1)
                tbody.children.push(node)
                n--
                i--
            } else {
                tbody = {
                    nodeName: 'tbody',
                    props: {},
                    children: [node]
                }
                nodes.splice(i, 1, tbody)
            }
        } else {
            if (tbody) {
                nodes.splice(i, 1)
                tbody.children.push(node)
                n--
                i--
            }
        }
    }
}


function getCloseTag(string) {
    if (string.indexOf("</") === 0) {
        var match = string.match(/\<\/(\w+)>/)
        if (match) {
            var tag = match[1]
            string = string.slice(3 + tag.length)
            return [match[0], {
                type: tag
            }]
        }
    }
    return null
}

function getOpenTag(string) {
    if (string.indexOf("<") === 0) {
        var i = string.indexOf('<!--') //处理注释节点
        if (i === 0) {
            var l = string.indexOf('-->')
            if (l === -1) {
                thow('注释节点没有闭合 ' + string.slice(0, 100))
            }
            var node = {
                type: '#comment',
                nodeValue: string.slice(4, l)
            }

            return [string.slice(0, l + 3), node]
        }
        var match = string.match(/\<(\w[^\s\/\>]*)/) //处理元素节点
        if (match) {
            var leftContent = match[0],
                tag = match[1]
            var node = {
                type: tag,
                props: {},
                children: []
            }

            string = string.replace(leftContent, '') //去掉标签名(rightContent)
            var arr = getAttrs(string) //处理属性
            if (arr) {
                node.props = arr[1]
                string = string.replace(arr[0], '')
                leftContent += arr[0]
            }

            if (string[0] === '>') { //处理开标签的边界符
                leftContent += '>'
                string = string.slice(1)
                if (voidTag[node.type]) {
                    node.isVoidTag = true
                }
            } else if (string.slice(0, 2) === '/>') { //处理开标签的边界符
                leftContent += '/>'
                string = string.slice(2)
                node.isVoidTag = true
            } 

            if (!node.isVoidTag && specalTag[tag]) { //如果是script, style, xmp等元素
                var closeTag = '</' + tag + '>'
                var j = string.indexOf(closeTag)
                var nodeValue = string.slice(0, j)
                leftContent += nodeValue + closeTag
                node.children.push({
                    type: '#text',
                    nodeValue: nodeValue
                })
            }

            return [leftContent, node]
        }
    }
}

function getText(node) {
    var ret = ''
    node.children.forEach(function(el) {
        if (el.type === '#text') {
            ret += el.nodeValue
        } else if (el.children && !hiddenTag[el.type]) {
            ret += getText(el)
        }
    })
    return ret
}

function getAttrs(string) {
    var state = 'AttrNameOrJSX',
        attrName = '',
        attrValue = '',
        quote,
        escape,
        props = {}

    for (var i = 0, n = string.length; i < n; i++) {
        var c = string[i]
        switch (state) {
            case 'AttrNameOrJSX':
                if (c === '/' || c === '>') {
                    return [string.slice(0, i), props]
                }
                if (rsp.test(c)) {
                    if (attrName) {
                        state = 'AttrEqual'
                    }
                } else if (c === '=') {
                    if (!attrName) {
                        throw '必须指定属性名'
                    }
                    state = 'AttrQuoteOrJSX'
                } else if (c === '{') {
                    state = 'SpreadJSX'
                } else {
                    attrName += c
                }
                break
            case 'AttrEqual':
                if (c === '=') {
                    state = 'AttrQuoteOrJSX'
                }
                break
            case 'AttrQuoteOrJSX':
                if (c === '"' || c === "'") {
                    quote = c
                    state = 'AttrValue'
                    escape = false
                } else if (c === '{') {
                    state = 'JSX'
                }
                break
            case 'AttrValue':
                if (c === '\\') {
                    escape = !escape
                }
                if (c !== quote) {
                    attrValue += c
                } else if (c === quote && !escape) {
                    props[attrName] = attrValue
                    attrName = attrValue = ''
                    state = 'AttrNameOrJSX'
                }
                break
            case 'SpreadJSX':
                i += 3
            case 'JSX':

                var arr = parseCode(string.slice(i))
                i += arr[0].length

                props[state === 'SpreadJSX' ? 'spreadAttribute' : attrName] = makeJSX(arr[1])
                attrName = attrValue = ''
                state = 'AttrNameOrJSX'
                break
        }
    }
    throw '必须关闭标签'
}

function makeJSX(JSXNode)
{
    return JSXNode.length === 1 && JSXNode[0].type === '#jsx' ? JSXNode[0] : { type: '#jsx', nodeValue: JSXNode }
}

/* harmony default export */ const jsx_Parser = (Parser);
;// CONCATENATED MODULE: ./src/js/dom/lifecycle/createElement.js



function createElement(tag, props, ...children)
{    
    let normalizedProps = {},
        key,
        ref,
        i;

    for (i in props)
    {
        if (i == 'key') 
        {
            key = props[i];
        }
        else if (i == 'ref')
        {
            ref = props[i];
        }
        
        normalizedProps[i] = props[i];
    }

    children = typeof children === 'undefined' ? [] : children;

    if (arguments.length > 2)
    {
        children = arguments.length > 3 ? [].slice.call(arguments, 2) : children;
    }

    // If a Component VNode, check for and apply defaultProps
    // Note: type may be undefined in development, must never error here.
    if (typeof tag == 'function' && tag.defaultProps != null)
    {
        for (i in tag.defaultProps)
        {
            if (normalizedProps[i] === undefined)
            {
                normalizedProps[i] = tag.defaultProps[i];
            }
        }
    }

    if (queue.current)
    {
        for (var x = 0; x < queue.current.length; x++)
        {
            let vnode = queue.current[x];
            
            if (vnode.type === tag)
            {                
                queue.current.splice(x, 1);

                return vnode;
            }

        }
    }

    return new vdom(tag, normalizedProps, children);
}
;// CONCATENATED MODULE: ./src/js/dom/lifecycle/index.js


/* harmony default export */ const lifecycle = (createElement);

/*export function getDerivedStateFromProps()
{
}

export function componentDidMount()
{
}

export function componentWillUnmount()
{
}

export function componentWillReceiveProps(nextProps)
{
}

export function getSnapshotBeforeUpdate(prevProps, prevState)
{
}

export function shouldComponentUpdate(nextProps, nextState)
{
    return true;
}

export function componentWillUpdate(changedProps, changedState)
{
}

export function componentDidUpdate(prevProps, prevState, snapshot)
{
}

export function componentDidCatch()
{
}*/
;// CONCATENATED MODULE: ./src/js/dom/jsx/evaluate.js



const R_COMPONENT = /^(this|[A-Z])/;
const CACHE_FNS   = {};
const CACHE_STR   = {};

window.__scope = {};

__scope.createElement = lifecycle;

function evaluate(str, obj, config)
{
    var jsx = new innerClass(str, config);

    var output = jsx.init();
    
    if (!obj)
    {
        obj = {};
    }
    
    if (typeof __scope === 'function')
    {
        obj.__scope = __scope;
    }
    var args = 'var args0 = arguments[0];'
    
    for (var i in obj)
    {
        if (i !== 'this')
        {
            args += 'var ' + i + ' = args0["' + i + '"];';
        }
    }

    args += 'return ' + output;
    try
    {
        var fn
        if (CACHE_FNS[args])
        {
            fn = CACHE_FNS[args]
        }
        else
        {
            fn = CACHE_FNS[args] = Function(args)
        }
        
        var a = fn.call(obj.this, obj)
        
        return a;
    }
    catch (e)
    {
        console.log(fn);
        console.log(CACHE_FNS);
        console.log(e)
    }
}

function innerClass(str, config)
{
    config      = config || {};
    config.ns   = '__scope';
    this.input  = str;
    this.ns     = config.ns
    this.type   = config.type
}

innerClass.prototype =
{
    init: function()
    {
        if (typeof jsx_Parser === 'function')
        {
            var useCache = this.input.length < 720
            if (useCache && CACHE_STR[this.input])
            {
                return CACHE_STR[this.input]
            }
            var array = (new jsx_Parser(this.input)).parse();

            var evalString = this.genChildren([array])
            if (useCache)
            {
                return CACHE_STR[this.input] = evalString
            }
            return evalString
        }
        else
        {
            throw 'need Parser https://github.com/RubyLouvre/jsx-parser'
        }
    },
    genTag: function(el)
    {
        var children = this.genChildren(el.children, el);
        var ns       = this.ns;
        var type     = R_COMPONENT.test(el.type) ? el.type : JSON.stringify(el.type);
        
        return ns + '.createElement(' + type +
            ',' + this.genProps(el.props, el) +
            ',' + children + ')'
    },
    genProps: function(props, el)
    {
        if (!props && !el.spreadAttribute)
        {
            return 'null';
        }

        var ret = '{';

        for (var i in props)
        {
            ret += JSON.stringify(i) + ':' + this.genPropValue(props[i]) + ',\n';
        }

        ret = ret.replace(/\,\n$/, '') + '}';
        
        if (el.spreadAttribute)
        {
            return 'Object.assign({},' + el.spreadAttribute + ',' + ret + ')';
        }

        return ret;
    },
    genPropValue: function(val)
    {
        if (typeof val === 'string')
        {
            return JSON.stringify(val)
        }
        if (val)
        {
            if (Array.isArray(val.nodeValue))
            {
                return this.genChildren(val.nodeValue)
            }
            if (val)
            {
                return val.nodeValue
            }
        }
    },
    genChildren: function(children, obj, join)
    {
        if (obj)
        {

            if (obj.isVoidTag || !obj.children.length)
            {
                return 'null'
            }
        }

        var ret = [];
        
        for (var i = 0, el; el = children[i++];)
        {
            if (el.type === '#jsx')
            {
                if (Array.isArray(el.nodeValue))
                {
                    ret[ret.length] = this.genChildren(el.nodeValue, null, ' ')
                }
                else
                {
                    ret[ret.length] = el.nodeValue
                }
            }
            else if (el.type === '#text')
            {
                ret[ret.length] = JSON.stringify(el.nodeValue)
            }
            else if (el)
            {
                ret[ret.length] = this.genTag(el)
            }
        }

        return ret.join(join || ',')
    }
};

;// CONCATENATED MODULE: ./src/js/dom/jsx/index.js


function parseJSX(jsx, obj, config)
{
	return evaluate(jsx, obj, config);
}
;// CONCATENATED MODULE: ./src/js/dom/component/component.js






function attachChildren(component)
{
    const jsx = jsxFactory(component);
    
    component.props.children = [jsx];
}

function renderContext(component)
{
    const exclude = ['constructor', 'render'];
    const funcs   = Object.getOwnPropertyNames(Object.getPrototypeOf(component));
    const props   = Object.keys(component);
    const keys    = [...funcs, ...props];
    let   ret     = {};

    for (var i = 0; i < keys.length; i++)
    {
        const key = keys[i];

        if (!exclude.includes(key))
        {
            ret[key] = component[key];
        }
    }

    return ret;
}

function jsxFactory(component)
{    
    const render = component.render();

    if (render.trim() === '')
    {
        return [];
    }

    const context = renderContext(component);

    return parseJSX(render, {...context, this: component });
}

function reRender(component)
{    
    // @todo / fragemnt / no children
    const prevRender  = component.props.children[0];
    const parentNode  = prevRender.__internals._el.parentNode;
    
    queue.current = [];

    utils.foreach(prevRender.props.children, function(i, vnode)
    {
        if (vnode.$$typof === NODE_FLAG.COMPONENT)
        {
            queue.current.push(vnode);
        }
    });

    const newRender = jsxFactory(component);

    patch(prevRender, newRender, parentNode);
}

/**
 * Base component
 * 
 * @class
 */
class component_Component
{
    /**
     * Context.
     *
     * @var {object}
     */
    context = {};

    /**
     * props.
     *
     * @var {object}
     */
    props = {};

    /**
     * Reference to DOM node.
     *
     * @var {object}
     */
    refs = {};

    /**
     * State obj
     *
     * @var {object}
     */
    state = {};

    /**
     * Default props.
     *
     * @var {object}
     */
    defaultProps = {};

    /**
     * Constructor
     *
     */
    constructor(props)
    {
        // If there is only a single arguement here
        // it means the component was constructed using
        // super(props)

        // Which means the extended class must have a render function
        this.props = !utils.is_object(props) ? {} : props;

        this.internals = {

        };
    }

    static getDerivedStateFromProps()
    {

    }

    componentDidMount()
    {
    }

    componentWillUnmount()
    {
    }

    componentWillReceiveProps(nextProps)
    {
    }

    getSnapshotBeforeUpdate(prevProps, prevState)
    {
    }

    shouldComponentUpdate(nextProps, nextState)
    {
        return true;
    }

    componentWillUpdate(changedProps, changedState)
    {

    }

    componentDidUpdate(prevProps, prevState, snapshot)
    {
    }

    componentDidCatch()
    {
    }
    
    setState(key, value)
    {
        let newState  = {};

        if (arguments.length === 1)
        {
            if (!utils.is_object(key))
            {
                throw new Error('State must be an object.');
            }

            newState = key;
        }
        else
        {
            newState[key] = value;
        }

        newState = utils.dotify(newState);

        if (utils.is_callable(this.componentWillUpdate))
        {
            this.componentWillUpdate(this.props, newState);
        }

        utils.foreach(newState, function(key, value)
        {
            utils.array_set(key, value, this.state);
            
        }, this);

        // @todo no children / fragment / recursive components
        reRender(this);
    }

    getState(key)
    {
        return array_get(key, this.state);
    }

    jsx(jsx)
    {
        const context = renderContext(this);

        return parseJSX(jsx, {...context, this: this});
    }
}

/* harmony default export */ const component = ((/* unused pure expression or super */ null && (component_Component)));
;// CONCATENATED MODULE: ./src/js/dom/component/fragment.js


/**
 * Base component
 * 
 * @class
 */
class Fragment extends (/* unused pure expression or super */ null && (Component))
{
    constructor(props)
    {
        super(props);
    }
}

/* harmony default export */ const fragment = ((/* unused pure expression or super */ null && (Fragment)));
;// CONCATENATED MODULE: ./src/js/dom/component/index.js








/* harmony default export */ const dom_component = ((/* unused pure expression or super */ null && (Component)));
;// CONCATENATED MODULE: ./src/js/dom/patch/patchData.js


const DOM_PROPS_RE = /\[A-Z]|^(?:value|checked|selected|muted)$/;

function patchData(el, key, prevValue, nextValue)
{
    switch (key)
    {
        case 'children':
            
            break;

        case 'style':
            
            for (let k in nextValue)
            {
                el.style[k] = nextValue[k]
            }
            for (let k in prevValue)
            {
                if (!nextValue.hasOwnProperty(k))
                {
                    el.style[k] = '';
                }
            }
            break;

        case 'class':

            el.className = nextValue
            
            break;

        case 'className':

            el.className = nextValue
            
            break;
        
        default:

            const tagName = el.tagName.toLowerCase();

            // event
            if (key[0] === 'o' && key[1] === 'n')
            {
              
                // remove old events
                if (prevValue)
                {
                    removeEventListener(el, key.slice(2).toLowerCase(), prevValue);
                }

                // add new event
                if (nextValue)
                {
                    addEventListener(el, key.slice(2).toLowerCase(), nextValue)
                }
            }
            // Treat as DOM Prop
            else if (DOM_PROPS_RE.test(key))
            {
                el[key] = nextValue
            }
            else if (ACCEPTED_PROPS["*"].includes(key) || ACCEPTED_PROPS[tagName] && ACCEPTED_PROPS[tagName].includes(key))
            {
                attr(el, key, nextValue);
            }
            else
            {
                // Treat as Attr
                el.setAttribute(key, nextValue)
            }
            
        break;
    }
}
;// CONCATENATED MODULE: ./src/js/dom/patch/replaceNode.js


function replaceNode(prevNode, nextNode, parent)
{
    // Node types are different or one is a component

    // @todo framgent / no child
    if (prevNode._component)
    {
        // unmount remove listeners etc...
        parent.innerHTML = '';
    }
    else if (prevNode.__internals._el)
    {
        parent.removeChild(prevNode.__internals._el)
    }
    
    mount(nextNode, parent);
}
;// CONCATENATED MODULE: ./src/js/dom/patch/patchElement.js




function patchElement(prevNode, nextNode, parent)
{
    if (prevNode.tag !== nextNode.tag)
    {
        replaceNode(prevNode, nextNode, parent);
        
        return;
    }

    const el = (nextNode.__internals._el = prevNode.__internals._el);
    
    let prevData = prevNode.props;
    let nextData = nextNode.props;

    if (nextData)
    {
        for (let key of Object.keys(nextData))
        {
            let prevValue = prevData[key];
            let nextValue = nextData[key];
            
            patchData(el, key, prevValue, nextValue)
        }
    }

    if (prevData)
    {
        for (let key of Object.keys(prevData))
        {
            if (!nextData.hasOwnProperty(key))
            {
                patchData(el, key, prevData[key], null);
            }
        }
    }

    let prevChildren = prevNode.props.children;
    let nextChildren = nextNode.props.children;
    let prevChildFlag = prevNode.__internals._childFlag;
    let nextChildFlag = nextNode.__internals._childFlag;

    patchChildren(prevChildren, prevChildFlag, nextChildren, nextChildFlag, el);
}
;// CONCATENATED MODULE: ./src/js/dom/patch/patchText.js
function patchText(prevNode, nextNode)
{
    const el = (nextNode.__internals._el = prevNode.__internals._el)
  
    if (nextNode.text !== prevNode.text)
    {
        el.nodeValue = nextNode.text;
    }
}
;// CONCATENATED MODULE: ./src/js/dom/patch/index.js










function patch(prevNode, nextNode, parent)
{
    if (prevNode.$$typof !== nextNode.$$typof)
    {
        //console.log('replacing');

        replaceNode(prevNode, nextNode, parent)
    }
    else if (nextNode.$$typof === NODE_FLAG.ELEMENT)
    {
        //console.log('patching el');

        patchElement(prevNode, nextNode, parent)
    }
    else if (nextNode.$$typof === NODE_FLAG.TEXT)
    {
        //console.log('patching text');

        patchText(prevNode, nextNode)
    }
    else if (nextNode.$$typof === NODE_FLAG.COMPONENT)
    {
        //console.log('patch COMPONENT');

        patchComponent(prevNode, nextNode, parent);
    }
    else
    {
        console.log('Unknown patch');
    }
}
;// CONCATENATED MODULE: ./src/js/dom/mount/mountElement.js




function mountElement(vnode, parent, refNode)
{
    const childFlag = vnode.__internals._childFlag;
    const el = document.createElement(vnode.type);

    vnode.__internals._el = el;

    if (vnode.props)
    {
        for (let key of Object.keys(vnode.props))
        {
            patchData(el, key, null, vnode.props[key])
        }
    }

    if (childFlag !== CHILD_FLAG.NO_CHILD)
    {
        if (childFlag & CHILD_FLAG.SINGLE_CHILD)
        {
            mount(vnode.props.children, el)
        }
        else if (childFlag & CHILD_FLAG.MULTI_CHILD)
        {
            for (let child of vnode.props.children)
            {
                mount(child, el)
            }
        }
    }

    refNode ? parent.insertBefore(el, refNode) : parent.appendChild(el);
}
;// CONCATENATED MODULE: ./src/js/dom/mount/mountText.js
function mountText(vnode, parent)
{
    const el = document.createTextNode(vnode.text);
    
    vnode.__internals._el = el;
    
    parent.appendChild(el);
}
;// CONCATENATED MODULE: ./src/js/dom/mount/mountComponent.js




function mountComponent(vnode, parent, refNode)
{    
    // @todo fragment / no children
    if (vnode.__internals._component)
    {
        const child = vnode.__internals._component.props.children[0];

        mount(child, parent, refNode);
    }
    else
    {
        const component = new (vnode.type)(vnode.props);

        attachChildren(component);

        vnode.__internals._component = component;

        // Todo fragment / no children
        const child = component.props.children[0];

        mount(child, parent, refNode);
    }
}
;// CONCATENATED MODULE: ./src/js/dom/mount/index.js







function mount(vnode, parent, refNode)
{
    const {$$typof} = vnode;

    if ($$typof === NODE_FLAG.ELEMENT)
    {
        mountElement(vnode, parent, refNode)
    }
    else if ($$typof === NODE_FLAG.COMPONENT)
    {
        mountComponent(vnode, parent, refNode)
    }
    else if ($$typof === NODE_FLAG.TEXT)
    {
        mountText(vnode, parent, refNode)
    }
    else
    {
        throw new Error('Unknown child node.')
    }
}
;// CONCATENATED MODULE: ./src/js/dom/render/queue.js
/**
 * Keeps track of the current owner.
 *
 * The current owner is the component who should own any components that are
 * currently being constructed.
 */
const RENDER_QUEUE =
{
    /**
    * @internal
    * @type {Component}
    */
    current: null,
};

/* harmony default export */ const queue = (RENDER_QUEUE);
;// CONCATENATED MODULE: ./src/js/dom/render/index.js





function render(vnode, parent)
{        
    vnode = ((typeof vnode === 'object') && vnode.constructor && vnode.constructor.name !== 'VNode') || (typeof vnode === 'function') ? new vdom(vnode, {}, []) : vnode;

    let prevNode = parent._vnode;

    if (!prevNode)
    {
        mount(vnode, parent);

        parent._vnode = vnode;
    }
    else
    {
        if (vnode)
        {            
            patch(prevNode, vnode, parent);

            parent._vnode = vnode;
        }
        else
        {
            parent.removeChild(prevNode.__internals._el);
        }
    }
}


/* harmony default export */ const dom_render = (render);
;// CONCATENATED MODULE: ./src/js/dom/index.js





;// CONCATENATED MODULE: ./src/js/index.js


(function()
{
    class Nest2 extends component_Component
    {
        constructor(props)
        {
            super(props);

            console.log('Constructing Nest2');
        }

        render()
        {
            return `
                <div>NEST2</div>
            `;
        }
    }

    class Nest1 extends component_Component
    {
        Nest2 = Nest2;

        constructor(props)
        {
            super(props);

            console.log('Constructing Nest1');
        }

        render()
        {
            return `
                <div>
                    NEST 1
                    <Nest2 />
                </div>
            `;
        }
    }

    class Bar extends component_Component
    {
        constructor(props)
        {
            super(props);

            this.interpolate = 'interpolated from bar!';
            this.evaluate    = this.exampleMethod;
            this.nested      = 'Nested from Bar!';
            this.Nest1       = Nest1;

            console.log('Constructing Bar');
        }

        exampleMethod()
        {
            return 'Evaluated from bar!'
        }
        
        render()
        {
            console.log('rending Bar')
            return `
            <div> 
                <h2>
                    {this.interpolate}
                </h2>
                <Nest1 />
            </div>
            `;
        }
    }

    class Foo extends component_Component
    {
        constructor(props)
        {
            super(props);

            this.state = {counter : 1, foo: 'bar', bar: {foo: 'bar'}};

            this.interpolate = 'interpolated!';
            this.evaluate    = this.returnJsx;
            this.Bar         = Bar;
            this.numbers     = [1, 2, 3, 4, 5];
            this.nested      = 'Nested from Foo!';
            this.Nest1       = Nest1;
            this.variable    = 'interpolated variable';

            var _this = this;

            console.log('Constructing Foo')

            setInterval(function()
            {
                _this.tick();

            }, 1000);
        }

        tick()
        {
            if (this.state.counter > 2)
            {
                return;
            }

            this.setState('counter', this.state.counter + 1);
        }

        exampleMethod()
        {
            return 'Evaluated!'
        }

        returnJsx()
        {
            return this.jsx('<div><h1>Returned JSX! with <i>{variable}</i></h1></div>');
        }

        handler()
        {
            alert('clicked!');
        }

        render()
        {
            return `
                <section>
                    <div onClick={this.handler}>{this.state.counter}</div>
                    <div>
                        <span>
                            {this.exampleMethod()}
                        </span>
                            {this.returnJsx()}
                        <i>Foo</i>
                    </div>
                    <div><Bar /></div>
                </section>
            `;
        }
    }


    const initialProps =
    {
        string: "foo", 
        number: 5,
        boolean: true
    };

/*   let vnode = createElement(
  'ul',
  {
    style: {
      width: '100px',
      height: '100px',
      backgroundColor: 'red'
    }
  },
  [
    createElement('li',{ key: 'li-a' }, 'li-a'),
    createElement('li',{ key: 'li-b' }, 'li-b'),
    createElement('li',{ key: 'li-c' }, 'li-c'),
    createElement('li',{ key: 'li-d', id: 'd' }, 'li-d'),
  ]
)

let nextVNode = createElement(
  'ul',
  {
    style: {
      width: '100px',
      height: '100px',
      backgroundColor: 'green'
    }
  },
  [
    createElement('li', { key: 'li-f' }, 'li-f'),
    createElement('li', { key: 'li-d', id: 'd' }, 'li-d'),
    createElement('li', { key: 'li-b' }, 'li-b'),
    createElement('li', { key: 'li-a' }, 'li-a'),
    createElement('li', { key: 'li-c' }, 'li-c'),
  ]
)

let nextVNode2 = createElement(
  'ul',
  {
    style: {
      width: '100px',
      backgroundColor: 'yellow'
    }
  },
  [
    createElement('li', { key: 'li-b' }, 'li-b'),
    createElement('li', { key: 'li-d', id: 'd' }, 'li-d'),
    createElement('li', { key: 'li-c' }, 'li-c'),
    createElement('li', { key: 'li-a' }, 'li-a'),
    createElement('li', { key: 'li-e' }, 'li-e'),
  ]
)

let nextVNode3 = createElement(
  'ul',
  {
    style: {
      width: '100px',
      backgroundColor: 'yellow'
    }
  },
  [
    createElement('li', { key: 'li-d', id: 'd' }, 'li-d'),
    createElement('li', { key: 'li-a' }, 'li-a'),
    createElement('li', { key: 'li-f' }, 'li-f'),
  ]
)

function fn() {
  setTimeout(() => {
    render(nextVNode, document.getElementById('app'))
    f = document.querySelector('li')
    fn2()
  }, 1000)
}
function fn2() {
  setTimeout(() => {
    render(nextVNode2, document.getElementById('app'))
    fn3()
  }, 1000)
}
function fn3() {
  setTimeout(() => {
    render(nextVNode3, document.getElementById('app'))
    console.log(d === document.getElementById('d'))
    console.log(firstLi === document.getElementsByTagName('li')[1])
    console.log(f === document.getElementsByTagName('li')[2])
  }, 1000)
}

render(vnode, document.getElementById('app'));

fn()
let d = document.getElementById('app');
let firstLi = document.querySelector('li')
let f = null;*/



dom_render(Foo, document.getElementById('app'));

//render(new createElement('div', {}, 'bar'), document.getElementById('app'));


//Hubble.Dom.render(Foo, initialProps, document.getElementById('app'));


//
//const root = Hubble.createElement(Foo, initialProps);

//root.forceUpdate();

//console.log(root);

//document.getElementById('app').appendChild(root.el());


})();
})();

/******/ })()
;