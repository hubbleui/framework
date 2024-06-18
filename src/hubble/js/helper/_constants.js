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

const TO_ARR = Array.prototype.slice;

// Regex for HTMLElement types
const HTML_REGXP = /^\[object HTML\w*Element\]$/;

// Excludes
const PROTO_EXCLUDES = ['constructor', '__proto__', '__defineGetter__', '__defineSetter__', 'hasOwnProperty', '__lookupGetter__', '__lookupSetter__', 'isPrototypeOf', 'propertyIsEnumerable', 'toString', 'toLocaleString', 'valueOf', 'length', 'name', 'arguments', 'caller', 'prototype', 'apply', 'bind', 'call'];

// Current clone map (stops recursive cloning between array/objects)
let CURR_CLONES = new WeakMap();

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
    '-webkit-animation': ['-name', '-duration', '-timing-function', '-delay', '-iteration-count', '-direction', '-fill-mode', '-play-state'],
    '-moz-animation': ['-name', '-duration', '-timing-function', '-delay', '-iteration-count', '-direction', '-fill-mode', '-play-state'],
    '-ms-animation': ['-name', '-duration', '-timing-function', '-delay', '-iteration-count', '-direction', '-fill-mode', '-play-state'],
    '-o-animation': ['-name', '-duration', '-timing-function', '-delay', '-iteration-count', '-direction', '-fill-mode', '-play-state'],
    'animation': ['-name', '-duration', '-timing-function', '-delay', '-iteration-count', '-direction', '-fill-mode', '-play-state'],

    // CSS Transitions (WD): http://www.w3.org/TR/css3-transitions/
    'webkit-transition': ['-property', '-duration', '-timing-function', '-delay'],
    '-moz-transition': ['-property', '-duration', '-timing-function', '-delay'],
    '-ms-transition': ['-property', '-duration', '-timing-function', '-delay'],
    '-o-transition': ['-property', '-duration', '-timing-function', '-delay'],
    'transition': ['-property', '-duration', '-timing-function', '-delay'],

    // CSS Flexible Box Layout Module Level 1 (WD): http://www.w3.org/TR/css3-flexbox/
    '-webkit-flex': ['-grow', '-shrink', '-basis'],
    '-ms-flex': ['-grow', '-shrink', '-basis'],
    'flex': ['-grow', '-shrink', '-basis'],
};

/**
 * Cached CSS propery cases.
 *
 * @var {object}
 */
const CSS_PROP_TO_HYPHEN_CASES = {};
const CSS_PROP_TO_CAMEL_CASES  = {};
