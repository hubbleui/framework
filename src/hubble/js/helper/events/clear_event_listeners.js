/**
 * Removes all event listeners registered by the library
 *
 * @access {public}
 */
_.prototype.clear_event_listeners = function()
{
    var events = this._events;

    let _this = this;

    _this.each(this._events, (guid, types) =>
    {
        _this.each(types, (type, callbacks) =>
        {
            let DOMElement = callbacks[0].element;
            
            _this.__remove_listener(DOMElement, type);
        });
    });

    this._events = {};
}