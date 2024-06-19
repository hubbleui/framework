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

    while (element)
    {
        if (element === document.documentElement)
        {
            return true;
        }

        element = element.parentNode;
    }

    return false;
}