/**
 * Removes all event listeners registered by the library on nodes
 * that are no longer part of the DOM tree
 *
 * @access {public}
 */
_.prototype.collect_garbage = function()
{
    let _this = this;

    _this.each(this._events, (guid, types) =>
    {
        var cleared = false;

        _this.each(types, (type, callbacks) =>
        {
            let DOMElement = callbacks[0].element;

            if (!this.in_dom(DOMElement))
            {
                cleared = true;

                _this.__remove_listener(DOMElement, type);
            }
        });

        if (cleared) delete this._events[guid];
    });
}