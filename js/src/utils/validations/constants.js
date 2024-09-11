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