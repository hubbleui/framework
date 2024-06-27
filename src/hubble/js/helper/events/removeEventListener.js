/**
 * Removes event listeners on a DOM node
 *
 * If no event name is given, all attached event listeners are removed.
 * If no callback is given, all callbacks for the event type will be removed.
 * This function can still remove "annonymous" functions that are given a name as they are declared.
 * 
 * @access {public}
 * @param  {DOMElement}    element    The target DOM node
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
 * Removes all registered event listners on an element
 *
 * @access {private}
 * @param  {DOMElement}    element Target node element
 */
__removeElementListeners(element)
{
    var events = this._events;
    for (var eventName in events)
    {
        var eventObj = events[eventName];
        var i = eventObj.length;
        while (i--)
        {
            if (eventObj[i]['element'] === element)
            {
                this.__removeListener(eventObj[i]['element'], eventName, eventObj[i]['handler'], eventObj[i]['useCapture']);
                this._events[eventName].splice(i, 1);
            }
        }
    }
}

/**
 * Removes all registered event listners of a specific type on an element
 *
 * @access {private}
 * @param  {DOMElement}    element Target node element
 * @param  {string}  type    Event listener type
 */
__removeElementTypeListeners(element, type)
{
    var eventObj = this._events[type];
    var i = eventObj.length;
    while (i--)
    {
        if (eventObj[i]['element'] === element)
        {
            this.__removeListener(eventObj[i]['element'], type, eventObj[i]['handler'], eventObj[i]['useCapture']);

            this._events[type].splice(i, 1);
        }
    }
}



/**
 * Removes a listener from the element
 *
 * @access {private}
 * @param  {DOMElement}    element    The target DOM node
 * @param  {string}  eventName  Event type
 * @param  {closure} handler    Callback event
 * @param  {bool}    useCapture Use capture (optional) (defaul false)
 */
__removeListener(el, eventName, handler, useCapture)
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
