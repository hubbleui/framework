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
_.prototype.on = function()
{
    return this.add_event_listener(...arguments);
}

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
_.prototype.add_event_listener = function(DOMElement, eventName, handler)
{    
    var args = TO_ARR.call(arguments);

    // Multiple elements
    if (this.is_array(DOMElement))
    {
        var baseArgs = args.slice(1);

        this.each(DOMElement, function(i, el)
        {            
            this.add_event_listener.apply(this, [el, ...baseArgs]);

        }, this);
    }
    else
    {
        // If event has a comma or is an array we're doing multiple events
        if (this.is_array(eventName) || eventName.includes(','))
        {
            let eventsArr = this.is_array(eventName) ? eventName : eventName.split(',').map((x) => x.trim()).filter((x) => x !== '');

            this.each(eventsArr, function(i, event)
            {
                args[1] = event;

                this.add_event_listener.apply(this, args);
                
            }, this);

            return;
        }

        // If array of arguments is provided, "this" will always be the first
        // argument provided
        // However the first and second argument passed to the callback will always the event object and the element
        // e.g. add_event_listener(el, 'click', callback, ['baz', 'foo', 'bar']) -> callback(e, el, foo, bar) this = 'baz'

        // Remove element, eventName, handler from args
        let argsNormal = this.__normaliseListenerArgs(DOMElement, args);

        this.__addListener(DOMElement, eventName, handler, argsNormal.thisArg, argsNormal.args, argsNormal.pushFirst);
    }
}

/**
 * Nomralize event listener args
 * 
 * @param  {DOMElement}    DOMElement   The target DOM node
 * @param  {array}         args         Args passed to add_event_listener or remove_event_listener
 */
_.prototype.__normaliseListenerArgs = function(DOMElement, args)
{
    // Remove DOMElement, eventName, handler
    args = args.slice(3);

    // Default "this" to the dom element
    let thisArg   = DOMElement;
    let pushFirst = false;

    // Push first
    if (!this.is_empty(args))
    {
        thisArg   = args.shift();
        pushFirst = this.bool(args.shift());
    }

    return {args, thisArg, pushFirst};
}

/**
 * Adds a listener to the element
 *
 * @access {private}
 * @param  {DOMElement}    element    The target DOM node
 * @param  {string}  eventName  Event type
 * @param  {closure} handler    Callback event
 * @param  {bool}    data Use capture (optional) (defaul false)
 */
_.prototype.__addListener = function(element, eventName, callback, thisArg, args, pushFirst)
{
    // Apply GUID to element and callback
    element.guid = element.guid || (element.guid = this._guidgen());
    callback.guid    = callback.guid || (callback.guid = this._guidgen());

    let hasHandler = true;
    let guid       = element.guid;

    // Make sure an array for event type exists
    if (!this._events[guid])
    {
        hasHandler = false;

        this._events[guid] = {};
    }

    if (!this._events[guid][eventName])
    {
        hasHandler = false;

        this._events[guid][eventName] = [];
    }

    // Push the details to the events object
    const handlerObj = {callback, thisArg, args, element};
    
    pushFirst ? this._events[guid][eventName].unshift(handlerObj) : this._events[guid][eventName].push(handlerObj);

    if (!hasHandler)
    {
        element.addEventListener(eventName, this.__event_dispatcher);
    }
}

/**
 * Event dispatcher
 *
 * @access {private}
 * @param  {eventObject}  e  
 */
_.prototype.__event_dispatcher = function(e)
{
    e = e || window.event;

    let DOMElement = this;

    let guid = DOMElement.guid;

    if (!guid) return;

    let callbacks =  _THIS._events[guid][e.type] || [];

    _THIS.each(callbacks, (i, handler) =>
    {        
        if (handler)
        {
            let handled = handler.callback.apply(handler.thisArg, [e, DOMElement, ...handler.args]);

            if (handled === false || handled === null)
            {
                e.preventDefault();

                e.stopPropagation();

                if (handled === null) return false;
            }
        }
    });
}
