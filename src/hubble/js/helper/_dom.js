/**
 * Helper DOM helpers
 *
 * @author    {Joe J. Howard}
 * @copyright {Joe J. Howard}
 * @license   {https://github.com/kanso-cms/cms/blob/master/LICENSE}
 */

/**
 * Select and return all nodes by selector
 *
 * @access {public}
 * @param  {string} selector CSS selector
 * @param  {node}   context (optional) (default document)
 * @return {node}
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
 * @param  {node}   context (optional) (default document)
 * @return {node}
 */
$(selector, context)
{
    context = (typeof context === 'undefined' ? document : context);
    return context.querySelector(selector)
}

/**
 * Closest parent node by type/class or array of either
 *
 * @access {public}
 * @param  {node}   el   Target element
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
 * @param  {node}   el   Target element
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
 * Get all first level children
 *
 * @access {public}
 * @param  {node}   el   Target element
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
 * Traverse nextSibling untill type or class or array of either
 *
 * @access {public}
 * @param  {node}   el   Target element
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
 * @param  {node}   el        Target element
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
 * Traverse previousSibling untill type
 *
 * @access {public}
 * @param  {node}   el   Target element
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
 * @access {public}
 * @param  {node}   el        Target element
 * @param  {string} className Target node classname
 * @return {node\null}
 */
_previousUntillClass(el, className)
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
 * Create and insert a new node
 *
 * @access {public}
 * @param  {string} type    New node type
 * @param  {string} classes New node class names (optional) (default '')
 * @param  {string} classes New node ID (optional) (default '')
 * @param  {string} content New node innerHTML (optional) (default '')
 * @param  {node}   target  Parent to append new node into
 * @return {node}
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
 * Inserts node as first child
 *
 * @access {public}
 * @param  {node} node     New node to insert
 * @param  {node} wrapper  Parent to preappend new node into
 * @return {node}
 */
preapend(node, wrapper)
{
    wrapper.insertBefore(node, wrapper.firstChild);

    return node;
}

/**
 * Remove an element from the DOM
 *
 * This function also removes all attached event listeners
 * 
 * @access {public}
 * @param  {node}   el Target element
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
 * Add a css class or list of classes
 *
 * @access {public}
 * @param  {node}         el         Target element
 * @param  {array|string} className  Class name(s) to add
 */
add_class(el, className)
{
    if (!this.in_dom(el))
    {
        return;
    }

    if (TO_STR.call(className) === '[object Array]')
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
 * @access {public}
 * @param  {node}         el         Target element
 * @param  {array|string} className  Class name(s) to remove
 */
remove_class(el, className)
{
    if (!this.in_dom(el))
    {
        return;
    }

    if (TO_STR.call(className) === '[object Array]')
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
 * @access {public}
 * @param  {node}         el         Target element
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
 * Check if a node has a class
 *
 * @access {public}
 * @param  {node}         el         Target element
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
 * Check if a node is a certain type
 *
 * @access {public}
 * @param  {node}   el         Target element
 * @param  {string} NodeType   Node type to validate
 * @return {bool}
 */
is_node_type(el, NodeType)
{
    return el.tagName.toUpperCase() === NodeType.toUpperCase();
}

/**
 * Get an element's absolute coordinates
 *
 * @access {public}
 * @param  {node}   el Target element
 * @return {object}
 */
coordinates(el)
{
    var box = el.getBoundingClientRect();
    var body = document.body;
    var docEl = document.documentElement;
    var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;
    var clientTop = docEl.clientTop || body.clientTop || 0;
    var clientLeft = docEl.clientLeft || body.clientLeft || 0;
    var borderL = parseInt(this.rendered_style(el, 'border-top-width'));
    var borderR = parseInt(this.rendered_style(el, 'border-top-width'));
    var borderT = parseInt(this.rendered_style(el, 'border-top-width'));
    var borderB = parseInt(this.rendered_style(el, 'border-top-width'));
    var top = box.top + scrollTop - clientTop - borderT - borderB;
    var left = box.left + scrollLeft - clientLeft + borderL - borderR;
    var width = parseFloat(this.rendered_style(el, "width"));
    var height = parseFloat(this.rendered_style(el, "height"));

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
 * Triggers a native event on an element
 *
 * @access {public}
 * @param  {node}   el   Target element
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
 * Get all input elements from a form
 *
 * @access {public}
 * @param  {node}   form Target element
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
 * Gets an input element's value
 *
 * @access {public}
 * @param  {node}   input Target element
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
 * Get an array of name/value objects for all inputs in a form
 *
 * @access {public}
 * @param  {node}   form Target element
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
 * Replace or append a node's innerHTML
 *
 * @access {public}
 * @param  {node}   DOMElement  Target element
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
 * @param  {node}   el   Target element
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
 * Check if an element is in current viewport
 *
 * @access {public}
 * @param  {node}   el Target DOM node
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
 * Aria hide an element
 *
 * @access {public}
 * @param  {node}   el Target DOM node
 */
hide_aria(el)
{
    el.setAttribute("aria-hidden", 'true');
}

/**
 * Aria show an element
 *
 * @access {public}
 * @param  {node}   el Target DOM node
 */
show_aria(el)
{
    el.setAttribute("aria-hidden", 'false');
}
