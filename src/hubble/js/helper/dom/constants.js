/**
 * Array of HTML events
 *
 * @var {array}
 */
const DOC_EVENTS = Object.getOwnPropertyNames(document).concat(Object.getOwnPropertyNames(Object.getPrototypeOf(Object.getPrototypeOf(document)))).concat(Object.getOwnPropertyNames(Object.getPrototypeOf(window))).filter(function(i){return !i.indexOf('on')&&(document[i]==null||typeof document[i]=='function');}).filter(function(elem, pos, self){return self.indexOf(elem) == pos;}).map((x) => x.replace('on', '').toLowerCase());