/**
 * Removes all event listeners registered by the library
 *
 * @access {public}
 */
_.prototype.clear_event_listeners = function(DOMElement, onlyChildren)
{
    DOMElement = this.is_undefined(DOMElement) ? document : DOMElement;

    onlyChildren = this.is_undefined(onlyChildren) ? false : onlyChildren;

    if (DOMElement !== document)
    {
        let children = this.find_all('*', DOMElement).reverse();

        this.each(children, (i, child) => this.off(child));

        if (!onlyChildren) this.off(DOMElement);
        
        return;
    }

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