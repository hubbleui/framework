/**
 * Add an event listener
 *
 * @access {public}
 * @param  {DOMElement}    element    The target DOM node
 * @param  {string}        eventName  Event type
 * @param  {closure}       handler    Callback event
 * @param  {array}         args       Args to pass to handler (first array element gets set to "this")
 * @param  {boolean}       pushfirst  If boolean (true) is provided, pushes callback to first in stack (default false)
 */
_.prototype.off = function()
{
    return this.remove_event_listener(...arguments);
}

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
_.prototype.remove_event_listener = function(DOMElement, eventName, handler)
{
    var args = TO_ARR.call(arguments);

    if (this.is_array(DOMElement))
    {
        var baseArgs = args.slice(1);

        this.each(DOMElement, function(i, el)
        {            
            this.remove_event_listener.apply(this, [el, ...baseArgs]);
        
        }, this);
    }
    else
    {
        // If the eventName name was not provided - remove all event handlers on element
        if (!eventName)
        {
            return this.__remove_element_listeners(DOMElement);
        }

        // If event has a comma or is an array we're doing multiple events
        if (this.is_array(eventName) || eventName.includes(','))
        {
            let eventsArr = this.is_array(eventName) ? eventName : eventName.split(',').map((x) => x.trim()).filter((x) => x !== '');

            this.each(eventsArr, function(i, event)
            {
                args[1] = event;

                this.remove_event_listener.apply(this, args);
                
            }, this);

            return;
        }

        // If the callback was not provided - remove all events of the type on the element
        if (!handler)
        {
            return this.__remove_element_type_listeners(DOMElement, eventName);
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
            if (_handler.callback.guid === handler.guid || this.is_equal(_handler.callback, handler))
            {
                this._events[guid][eventName].splice(i, 1);

                if (this.is_empty(this._events[guid][eventName]))
                {
                    delete this._events[guid][eventName];

                    this.__remove_listener(DOMElement, eventName);
                }

                if (this.is_empty(this._events[guid]))
                {
                    delete this._events[guid];
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
_.prototype.__remove_element_listeners = function(DOMElement)
{
    let guid = DOMElement.guid;

    if (!guid) return;

    if (this._events[guid])
    {
        this.each(this._events[guid], function(type, callbacks)
        {
            this.__remove_listener(DOMElement, type);
            
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
_.prototype.__remove_element_type_listeners = function(DOMElement, type)
{
    let guid = DOMElement.guid;

    if (!guid) return;

    // Make sure an array for event type exists
    if (this._events[guid] && this._events[guid][type])
    {
        delete this._events[guid][type];

        this.__remove_listener(DOMElement, type);

        if (this.is_empty(this._events[guid]))
        {
            delete this._events[guid];
        }
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
_.prototype.__remove_listener = function(DOMElement, eventType)
{    
    DOMElement.removeEventListener(eventType, this.__event_dispatcher);
}
