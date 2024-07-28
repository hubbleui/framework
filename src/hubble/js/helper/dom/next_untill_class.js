/**
 * Traverse nextSibling untill class type or class or array of either
 *
 * @access {public}
 * @param  {DOMElement}   el        Target element
 * @param  {string} className Target node classname
 * @return {node\null}
 */
_.prototype.next_untill_class = function(el, className)
{
    if (className[0] === '.')
    {
        className = className.substring(1);
    }

    if (el.nextSibling && this.has_class(el.nextSibling, className))
    {
        return el.nextSibling;
    }

    var next = el.nextSibling;

    while (next !== document.body && typeof next !== "undefined" && next !== null)
    {
        if (next && this.has_class(next, className))
        {
            return next;
        }

        next = next.nextSibling;

    }

    return null;
}