/**
 * DOM Event Listener Manager
 *
 * @author    {Joe J. Howard}
 * @copyright {Joe J. Howard}
 * @license   {https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE}
 */

/**
 * Add an event listener
 *
 * @access {public}
 * @param  {node}    element    The target DOM node
 * @param  {string}  eventName  Event type
 * @param  {closure} handler    Callback event
 * @param  {bool}    useCapture Use capture (optional) (defaul false)
 */
addEventListener(element, eventName, handler, useCapture)
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

        this.__addListener(element, eventName, handler, useCapture);
    }
}

/**
 * Removes event listeners on a DOM node
 *
 * If no event name is given, all attached event listeners are removed.
 * If no callback is given, all callbacks for the event type will be removed.
 * This function can still remove "annonymous" functions that are given a name as they are declared.
 * 
 * @access {public}
 * @param  {node}    element    The target DOM node
 * @param  {string}  eventName  Event type
 * @param  {closure} handler    Callback event
 * @param  {bool}    useCapture Use capture (optional) (defaul false)
 */
removeEventListener(element, eventName, handler, useCapture)
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
            return this.__removeElementListeners(element);
        }

        // If the callback was not provided - remove all events of the type on the element
        if (!handler)
        {
            return this.__removeElementTypeListeners(element, eventName);
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
                this.__removeListener(element, eventName, handler, useCapture);
                this._events[eventName].splice(i, 1);
                break;
            }
        }
    }
}

/**
 * Removes all event listeners registered by the library
 *
 * @access {public}
 */
clearEventListeners()
{
    var events = this._events;

    for (var eventName in events)
    {
        var eventObj = events[eventName];
        var i = eventObj.length;
        while (i--)
        {
            this.__removeListener(eventObj[i]['element'], eventName, eventObj[i]['handler'], eventObj[i]['useCapture']);
            this._events[eventName].splice(i, 1);
        }
    }
}

/**
 * Removes all event listeners registered by the library on nodes
 * that are no longer part of the DOM tree
 *
 * @access {public}
 */
collectGarbage()
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
            if (!this.in_dom(el))
            {
                this.__removeListener(eventObj[i]['element'], eventName, eventObj[i]['handler'], eventObj[i]['useCapture']);
                this._events[eventName].splice(i, 1);
            }
        }
    }
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
eventListeners(DOMElement, eventName)
{
    var args = TO_ARR.call(arguments);
    var events = this._events;

    // No args, return all events
    if (args.length === 0)
    {
        return events;
    }
    // eventListeners(node) or
    // eventListeners('click')
    else if (args.length === 1)
    {
        // eventListeners('click')
        if (this.is_string(DOMElement))
        {   
            return events[DOMElement] || [];
        }
        
        var ret = [];

        // eventListeners(node)
        for (var evt in events)
        {
            var eventArr = events[evt];

            for (var i = 0; i < eventArr.length; i++)
            {
                var eventObj = eventArr[i];

                if (eventObj.element === DOMElement)
                {
                    ret.push(eventObj);
                }
            }
        }

        return ret;
    }
    // eventListeners(node, 'click')
    var ret = [];

    if (events[eventName])
    {
        var _evts = events[eventName];

        for (var i = 0; i < _evts.length; i++)
        {
            var eventObj = _evts[i];

            if (eventObj.element === DOMElement)
            {
                ret.push(eventObj);
            }
        }
    }

    return ret;
}


