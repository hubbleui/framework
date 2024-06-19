/**
 * Create and insert a new node
 *
 * @access {public}
 * @param  {string} type    New node type
 * @param  {string} classes New node class names (optional) (default '')
 * @param  {string} classes New node ID (optional) (default '')
 * @param  {string} content New node innerHTML (optional) (default '')
 * @param  {node}   target  Parent to append new node into
 * @return {node}
 */
new_node(type, classes, ID, content, target)
{
    var node = document.createElement(type);
    classes = (typeof classes === "undefined" ? null : classes);
    ID = (typeof ID === "undefined" ? null : ID);
    content = (typeof content === "undefined" ? null : content);

    if (classes !== null)
    {
        node.className = classes
    }
    if (ID !== null)
    {
        node.id = ID
    }
    if (content !== null)
    {
        node.innerHTML = content
    }

    target.appendChild(node);

    return node;
}