/**
 * Create and insert a new node
 *
 * @param {object} options
 */
_.prototype.dom_element = function(options, appendTo, innerHTMLOrChildren)
{
    if (!options.tag) throw new Error('Element tag not provided.');

    let node = document.createElement(options.tag);

    delete options.tag;

    this.attr(node, options);

    if (innerHTMLOrChildren)
    {
        if (this.is_htmlElement(innerHTMLOrChildren))
        {
            node.appendChild(innerHTMLOrChildren);
        }
        else if (this.is_array(innerHTMLOrChildren))
        {
            this.each(this.array_filter(innerHTMLOrChildren), (i, child) => this.is_string(child) ? node.innerText = child : node.appendChild(child), this);
        }
        else if (this.is_string(innerHTMLOrChildren))
        {
            node.innerHTML = innerHTMLOrChildren;
        }
    }

    if (appendTo)
    {
        appendTo.appendChild(node);
    }

    return node;
}