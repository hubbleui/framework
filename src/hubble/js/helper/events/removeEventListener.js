/**
 * Remove an event listener
 *
 * @access {public}
 * @param  {DOMElement}    element    The target DOM node
 * @param  {string}        eventName  Event type
 * @param  {closure}       handler    Callback event
 * @param  {array}         args       Args to pass to handler (first array element gets set to "this")
 * @param  {boolean}       pushfirst  If boolean (true) is provided, pushes callback to first in stack (default false)
 */
removeEventListener(DOMElement, eventName, handler)
{
    var args = TO_ARR.call(arguments);

    if (this.is_array(DOMElement))
    {
        var baseArgs = args.slice(1);

        this.each(DOMElement, function(i, el)
        {            
            this.removeEventListener.apply(this, [el, ...baseArgs]);
        
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
                args[1] = event;

                this.removeEventListener.apply(this, args);
                
            }, this);

            return;
        }

        // If the callback was not provided - remove all events of the type on the element
        if (!handler)
        {
            return this.__removeElementTypeListeners(DOMElement, eventName);
        }
        
        let guid = DOMElement.guid;

        // Nothing to remove
        if (!guid) return;

        let handlers = this.array_get(`${guid}.${eventName}`, this._events);

        // Nothing to remove
        if (!handlers) return;

        // Loop stored events and match node, event name, handler, use capture
        this.each(handlers, function(i, _handler)
        {
            if (_handler.callback.guid === handler.guid || this.is_equial(_handler.callback, handler))
            {
                this._events[guid][eventName].splice(i, 1);

                if (this.is_empty(this._events[guid][eventName]))
                {
                    delete this._events[guid][eventName];

                    this.__removeListener(DOMElement, eventName);
                }
                
                // Break only remove first
                return false;
            } 
        
        }, this);

        
    }
}

/**
 * Removes all registered event listeners on an element
 *
 * @access {private}
 * @param  {DOMElement} DOMElement Target node element
 */
__removeElementListeners(DOMElement)
{
    let guid = DOMElement.guid;

    if (!guid) return;

    if (this._events[guid])
    {
        this.each(this._events[guid], function(type, callbacks)
        {
            this.__removeListener(DOMElement, type);
            
        }, this);
    }

    delete this._events[guid];
}

/**
 * Removes all registered event listeners of a specific type on an element
 *
 * @access {private}
 * @param  {DOMElement} DOMElement Target node element
 * @param  {string}     type       Event listener type
 */
__removeElementTypeListeners(DOMElement, type)
{
    let guid = DOMElement.guid;

    if (!guid) return;

    // Make sure an array for event type exists
    if (this._events[guid] && this._events[guid][type])
    {
        delete this._events[guid][type];

        this.__removeListener(DOMElement, type);
    }
}

/**
 * Removes a listener from the element
 *
 * @access {private}
 * @param  {DOMElement} DOMElement The target DOM node
 * @param  {string}     eventType  Event type
 * @param  {closure}    handler    Callback event
 * @param  {bool}       useCapture Use capture (optional) (defaul false)
 */
__removeListener(DOMElement, eventType)
{    
    if (DOMElement.addEventListener)
    {
        DOMElement.removeEventListener(eventType, this.__eventDispatcher);
    }
    else
    {
        DOMElement.removeEventListener('on' + eventType, this.__eventDispatcher);
    }
}
