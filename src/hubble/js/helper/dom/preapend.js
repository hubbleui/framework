/**
 * Inserts node as first child
 *
 * @access {public}
 * @param  {node} node     New node to insert
 * @param  {node} wrapper  Parent to preappend new node into
 * @return {node}
 */
preapend(node, wrapper)
{
    wrapper.insertBefore(node, wrapper.firstChild);

    return node;
}