/**
 * Inserts node as first child
 *
 * @access {public}
 * @param  {DOMElement} node     New node to insert
 * @param  {DOMElement} wrapper  Parent to preappend new node into
 * @return {DOMElement}
 */
_.prototype.preapend = function(node, wrapper)
{
    wrapper.insertBefore(node, wrapper.firstChild);

    return node;
}