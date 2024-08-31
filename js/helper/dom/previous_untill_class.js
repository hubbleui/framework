/**
 * Traverse previousSibling untill class
 *
 * @access {public}
 * @param  {DOMElement}   el        Target element
 * @param  {string} className Target node classname
 * @return {node\null}
 */
_.prototype.previous_untill_class = function(el, className)
{
    if (className[0] === '.')
    {
        className = className.substring(1);
    }

    if (el.previousSibling && this.has_class(el.previousSibling, className))
    {
        return el.previousSibling;
    }

    var prev = el.previousSibling;

    while (prev !== document.body && typeof prev !== "undefined" && prev !== null)
    {
        prev = prev.previousSibling;

        if (prev && this.has_class(prev, className))
        {
            return prev;
        }
    }

    return null;
}