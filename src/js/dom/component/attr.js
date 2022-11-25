import _ from '../utils';

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
export function attr(elem, name, value)
{    
    // Multiple elements
    if (_.is_array(elem))
    {
        _.foreach(elem, function(i, el)
        {
            attr(el, name, value);
        });

        return;
    }

    // node, { key: value }
    if (is_object(name) && typeof value === 'undefined')
    {
        _.foreach(name, function(key, val)
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
            _.foreach(value.split(';'), function(i, rule)
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
    if (_.is_array(elem))
    {
        _.foreach(elem, function(i, el)
        {
            _removeAttr(el, name, isDataAttr, isAriaAttr);
        });

        return;
    }

    // attr(el, ['data-foo', 'data-bar'], null)
    if (_.is_array(name))
    {
        _.foreach(name, function(i, prop)
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

