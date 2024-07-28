/**
 * Traverse nextSibling untill type or class or array of either
 *
 * @access {public}
 * @param  {DOMElement}   el   Target element
 * @param  {string} type Target node type
 * @return {node\null}
 */
_.prototype.next = function(el, type)
{
    // Type is class
    if (this.is_array(type))
    {
        for (var i = 0; i < type.length; i++)
        {
            var response = this.next(el, type[i]);

            if (response)
            {
                return response;
            }
        }

        return null;
    }

    if (type[0] === '.')
    {
        return this.next_untill_class(el, type);
    }

    type = type.toLowerCase();

    if (el.nextSibling && el.nextSibling.nodeName.toLowerCase() === type)
    {
        return el.nextSibling;
    }
    var next = el.nextSibling;

    while (next !== document.body && typeof next !== "undefined" && next !== null)
    {
        next = next.nextSibling;

        if (next && next.nodeName.toLowerCase() === type)
        {
            return next;
        }
    }

    return null;
}