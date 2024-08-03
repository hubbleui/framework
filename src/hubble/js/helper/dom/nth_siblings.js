/**
 * Returns nth position from siblings
 *
 * @access {public}
 * @param  {DOMElement}   el   Target element
 * @return {node\null}
 */
_.prototype.nth_siblings = function(DOMElement)
{
    let children = this.first_children(DOMElement.parentNode);

    for (var i = 0; i < children.length; i++)
    {
        if (children[i] === DOMElement) return i;
    }

    return 0;
}