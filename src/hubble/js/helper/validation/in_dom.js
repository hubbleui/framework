/**
 * Checks if HtmlElement is in current DOM
 *
 * @param   {HTMLElement}  element  Element to check
 * @returns {boolean}
 */
in_dom(element)
{
    if (!this.is_htmlElement(element))
    {
        return false;
    }

    if (element === document.body || element === document.documentElement)
    {
        return true;
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