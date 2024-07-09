/**
 * Add an event listener
 *
 * @access {public}
 * @param  {DOMElement}    element    The target DOM node
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
        this.each(element, function(i, el)
        {
            this.addEventListener(el, eventName, handler, useCapture);

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
                this.addEventListener(element, event, handler, useCapture);
                
            }, this);

            return;
        }

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
 * Adds a listener to the element
 *
 * @access {private}
 * @param  {DOMElement}    element    The target DOM node
 * @param  {string}  eventName  Event type
 * @param  {closure} handler    Callback event
 * @param  {bool}    useCapture Use capture (optional) (defaul false)
 */
__addListener(el, eventName, handler, useCapture)
{
    if (el.addEventListener)
    {
        el.addEventListener(eventName, handler, useCapture);
    }
    else
    {
        el.attachEvent('on' + eventName, handler, useCapture);
    }
}