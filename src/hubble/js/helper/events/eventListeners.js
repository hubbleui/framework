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