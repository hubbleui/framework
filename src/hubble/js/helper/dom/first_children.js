/**
 * Get all first level children
 *
 * @access {public}
 * @param  {node}   el   Target element
 * @return {node\null}
 */
first_children(el)
{
    var children = [];

    var childnodes = el.childNodes;

    for (var i = 0; i < childnodes.length; i++)
    {
        if (childnodes[i].nodeType == 1)
        {
            children.push(childnodes[i]);
        }
    }

    return children;
}