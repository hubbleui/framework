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