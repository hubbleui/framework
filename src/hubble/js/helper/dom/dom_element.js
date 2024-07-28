/**
 * Create and insert a new node
 *
 * @param {object} options
 */
_.prototype.dom_element = function(options)
{
    if (!options.type) throw new Error('Element type not provided.');

    let node = document.createElement(options.type);

    delete options.type;

    this.attr(node, options);

    return node;
}