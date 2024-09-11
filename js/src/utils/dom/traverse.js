/**
 * Closest parent node by type/class or array of either
 *
 * @access {public}
 * @param  {DOMElement}   el   Target element
 * @param  {string} type Node type to find
 * @return {node\null}
 */
_.prototype.traverse_up = function(DOMElement, callback, origional)
{    
    origional = typeof origional === "undefined" ? DOMElement : origional;

    // Stop on document
    if (DOMElement === document || typeof DOMElement === "undefined" || DOMElement === null) return;

    if (callback(DOMElement))
    {
        return origional;
    }

    var parent = DOMElement.parentNode;

    return this.traverse_up(parent, callback, origional);
}

_.prototype.traverse_down = function(DOMElement, callback)
{
}

_.prototype.traverse_next = function(DOMElement, callback)
{
}

_.prototype.traverse_prev = function(DOMElement, callback)
{
}
