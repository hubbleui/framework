/**
 * Checks if HtmlElement is in current DOM
 *
 * @param   {HTMLElement}  element  Element to check
 * @returns {boolean}
 */
_.prototype.in_dom = function(element)
{
    if (element === window || element === document || element === document.body || element === document.documentElement)
    {
        return true;
    }

    if (!this.is_htmlElement(element))
    {
        return false;
    }

    let ret = false;

    this.traverse_up(element, function(node)
    {
        if (node === document.body || node === document.documentElement)
        {
            ret = true;

            return true;
        }

        return false;
    });

    return ret;
}