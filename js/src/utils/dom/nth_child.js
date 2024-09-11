/**
 * Returns nth child
 *
 * @access {public}
 * @param  {DOMElement}   el   Target element
 * @return {node\null}
 */
_.prototype.nth_child = function(el, n)
{
    let children = this.first_children(el);

    if (children[n]) return children[n];
}