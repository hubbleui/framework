/**
 * Closest parent node by class
 *
 * @access {public}
 * @param  {DOMElement}   el   Target element
 * @param  {string} clas Node class to find
 * @return {node\null}
 */
_.prototype.closest_class = function(el, clas)
{    
    // Type is class
    if (this.is_array(clas))
    {
        for (var i = 0; i < clas.length; i++)
        {
            var response = this.closest_class(el, clas[i]);

            if (response)
            {
                return response;
            }
        }

        return null;
    }

    if (this.has_class(el, clas))
    {
        return el;
    }

    if (this.has_class(el.parentNode, clas))
    {
        return el.parentNode;
    }

    var parent = el.parentNode;

    if (parent === window.document)
    {
        return null;
    }

    while (parent !== document.body)
    {
        if (this.has_class(parent, clas))
        {
            return parent;
        }

        if (parent === null || typeof parent === 'undefined')
        {
            return null;
        }

        parent = parent.parentNode;
    }

    return null;
}