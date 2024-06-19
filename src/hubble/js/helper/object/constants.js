// Excludes
const PROTO_EXCLUDES = ['constructor', '__proto__', '__defineGetter__', '__defineSetter__', 'hasOwnProperty', '__lookupGetter__', '__lookupSetter__', 'isPrototypeOf', 'propertyIsEnumerable', 'toString', 'toLocaleString', 'valueOf', 'length', 'name', 'arguments', 'caller', 'prototype', 'apply', 'bind', 'call'];

// Current clone map (stops recursive cloning between array/objects)
let CURR_CLONES = new WeakMap();