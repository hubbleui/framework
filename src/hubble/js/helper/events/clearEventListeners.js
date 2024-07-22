/**
 * Removes all event listeners registered by the library
 *
 * @access {public}
 */
clearEventListeners()
{
    var events = this._events;

    let _this = this;

    _this.each(this._events, (guid, types) =>
    {
        _this.each(types, (type, callbacks) =>
        {
            let DOMElement = callbacks[0].element;
            
            _this.__removeListener(DOMElement, type);
        });
    });

    this._events = {};
}