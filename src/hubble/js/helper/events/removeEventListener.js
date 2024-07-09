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
removeEventListener(DOMElement, eventName, callback, usecapture)
{
    if (this.is_array(DOMElement))
    {
        this.each(DOMElement, function(i, el)
        {
            this.removeEventListener(el, eventName, callback, usecapture);
        
        }, this);
    }
    else
    {
        // If the eventName name was not provided - remove all event handlers on element
        if (!eventName)
        {
            return this.__removeElementListeners(DOMElement);
        }

        // If event has a comma or is an array we're doing multiple events
        if (this.is_array(eventName) || eventName.includes(','))
        {
            let eventsArr = this.is_array(eventName) ? eventName : eventName.split(',').map((x) => x.trim()).filter((x) => x !== '');

            this.each(eventsArr, function(i, event)
            {
                this.removeEventListener(DOMElement, event, callback, usecapture);

            }, this);

            return;
        }

        // If the callback was not provided - remove all events of the type on the element
        if (!callback)
        {
            return this.__removeElementTypeListeners(DOMElement, eventName);
        }

        // Default use capture
        usecapture = typeof usecapture === 'undefined' ? false : Boolean(usecapture);

        // No events to remove
        if (!this._events[eventName])
        {
            return;
        }

        // Loop stored events and match node, event name, handler, use capture
        this.each(this._events[eventName], function(i, event)
        {
            if (event.handler === callback && event.useCapture === usecapture && event.element === DOMElement)
            {
                this.__removeListener(DOMElement, eventName, callback, usecapture);

                this._events[eventName].splice(i, 1);
                
                // Break only remove first
                return false;
            }
        
        }, this);
    }
}

/**
 * Removes all registered event listners on an element
 *
 * @access {private}
 * @param  {DOMElement}    element Target node element
 */
__removeElementListeners(DOMElement)
{
    this.each(this._events, function(type, events)
    {
        this._events[type] = this.map(events, function(i, event)
        {
            if (event.element === DOMElement)
            {
                this.__removeListener(DOMElement, type, event.handler, event.useCapture);
                
                return false;
            }

            return event;
        
        }, this);

    }, this);
}

/**
 * Removes all registered event listners of a specific type on an element
 *
 * @access {private}
 * @param  {DOMElement}    element Target node element
 * @param  {string}  type    Event listener type
 */
__removeElementTypeListeners(DOMElement, type)
{
    this._events[type] = this.map(this._events[type], function(i, event)
    {
        if (event.element === DOMElement)
        {
            this.__removeListener(DOMElement, type, event.handler, event.useCapture);
            
            return false;
        }

        return event;
    
    }, this);
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
