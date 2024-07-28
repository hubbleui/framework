/**
 * Closest parent node by type/class or array of either
 *
 * @access {public}
 * @param  {DOMElement}   el   Target element
 * @param  {string} type Node type to find
 * @return {node\null}
 */
_.prototype.closest = function(el, type)
{
    // Type is class
    if (this.is_array(type))
    {
        for (var i = 0; i < type.length; i++)
        {
            var response = this.closest(el, type[i]);

            if (response)
            {
                return response;
            }
        }

        return null;
    }

    // Type is class
    if (this.is_htmlElement(type))
    {
        if (el === type) return true;
        
        let ret = false;

        this.traverse_up(el, (parent) =>
        {
            if (parent === type)
            {
                ret = true;

                return true;
            }
        });

        return ret;
    }

    if (type[0] === '.')
    {
        return this.closest_class(el, type);
    }

    type = type.toLowerCase();

    if (typeof el === 'undefined')
    {
        return null;
    }

    if (el.nodeName.toLowerCase() === type)
    {
        return el;
    }

    if (el.parentNode && el.parentNode.nodeName.toLowerCase() === type)
    {
        return el.parentNode;
    }

    var parent = el.parentNode;

    while (parent !== document.body && typeof parent !== "undefined" && parent !== null)
    {
        parent = parent.parentNode;

        if (parent && parent.nodeName.toLowerCase() === type)
        {
            return parent;
        }
    }


    return null;
}
