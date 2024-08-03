/**
 * Get all first level children
 *
 * @access {public}
 * @param  {DOMElement}   el   Target element
 * @return {node\null}
 */
_.prototype.first_children = function(el)
{
    return this.$All('> *', el);
}