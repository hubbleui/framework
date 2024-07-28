/**
 * Triggers an event on an element
 *
 * @access {public}
 * @param  {DOMElement}   DOMElement   Target element
 * @param  {string}       eventName    Event name
 * @param  {mixed}        data         Extra data to pass to custom events 
 */
_.prototype.trigger_event = function(DOMElement, eventName, data)
{
    if (this.in_array(eventName.toLowerCase(), DOC_EVENTS))
    {
        if ('createEvent' in document)
        {
            var evt = document.createEvent('HTMLEvents');

            evt.initEvent(eventName, false, true);

            DOMElement.dispatchEvent(evt);
        }
        else
        {
            DOMElement.fireEvent(eventName);
        }
    }
    else
    {
        // Actual object
        if (!this.is_constructed(data) && this.is_object(data))
        {
            data = { ...{ DOMElement: DOMElement, name: eventName }, ...data};
        }
        else
        {
            data = { DOMElement: DOMElement, name: eventName, state: data };
        }

        const event = new CustomEvent(eventName, { detail: data });

        DOMElement.dispatchEvent(event);

        if (eventName.includes(':'))
        {
            var events = eventName.split(':').slice(0, -1);
            var base   = events.shift();
            var count  = events.length + 1;

            this.for(count, function(i)
            {
                let subevent = i === (count -1) ? base : `${base}:${events.join(':')}`;

                data.name = eventName;

                const evt = new CustomEvent(subevent, { detail: data });

                DOMElement.dispatchEvent(evt);

                events.pop();
            });
        }
    }
}