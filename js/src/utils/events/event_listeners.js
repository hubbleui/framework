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
_.prototype.event_listeners = function(DOMElement, eventName)
{
    var args = TO_ARR.call(arguments);
    var ret  = [];

    // No args, return all events
    if (args.length === 0)
    {
        this.each(this._events, function(guid, types)
        {
            this.each(types, function(type, callbacks)
            {
                let summary = callbacks.map( (details) => ({ el: details.element, callback: details.callback, type: type }) );

                ret = [...ret, ...summary];
            });

        }, this);

        return ret;
    }
    
    // eventListeners(node) or
    // eventListeners('click')
    else if (args.length === 1)
    {
        // eventListeners('click')
        if (this.is_string(DOMElement))
        {   
            this.each(this._events, function(guid, types)
            {
                this.each(types, function(type, callbacks)
                {
                    if (type === DOMElement)
                    {
                        let summary = callbacks.map( (details) => ({ el: details.element, callback: details.callback, type: type }) );

                        ret = [...ret, ...summary];
                    }
                });

            }, this);

            return ret;
        }
        
        // eventListeners(node)
        let guid = DOMElement.guid;

        if (!guid || !this._events[guid]) return ret;

        this.each(this._events[guid], function(type, callbacks)
        {
            let summary = callbacks.map( (details) => ({ el: details.element, callback: details.callback, type: type }) );

            ret = [...ret, ...summary];

        }, this);

        return ret;
    }

    // eventListeners(node)
    let guid = DOMElement.guid;

    if (!guid || !this._events[guid] || !this._events[guid][eventName]) return ret;

    this.each(this._events[guid][eventName], function(i, details)
    {
        ret.push({ el: details.element, callback: details.callback, type: eventName });

    }, this);

    return ret;
}