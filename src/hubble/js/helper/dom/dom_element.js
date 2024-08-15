/**
 * Create and insert a new node
 *
 * @param {object} options
 */
_.prototype.dom_element = function(options, appendTo, innerHTMLOrChildren)
{    
    // dom_element(null, wrappper, content);
    if (!options && appendTo && innerHTMLOrChildren)
    {
        this._recursive_dom_element(innerHTMLOrChildren, appendTo);

        return appendTo;
    }

    if (!options.tag) throw new Error('Element tag not provided.');

    let node = document.createElement(options.tag);

    delete options.tag;

    this.attr(node, options);

    if (innerHTMLOrChildren)
    {
        this._recursive_dom_element(innerHTMLOrChildren, node);
    }

    if (appendTo)
    {
        appendTo.appendChild(node);
    }

    return node;
}

_.prototype._recursive_dom_element = function(mixedVar, parent)
{
    if (this.is_htmlElement(mixedVar))
    {
        parent.appendChild(mixedVar);
    }
    else if (this.is_array(mixedVar))
    {
        this.each(this.array_filter(mixedVar), (i, child) =>
        {
            this._recursive_dom_element(child, parent);
        }); 
    }
    else if (this.is_object(mixedVar))
    {
        this.dom_element(mixedVar, node);
    }
    else
    {
        parent.innerHTML += mixedVar;
    }
}

