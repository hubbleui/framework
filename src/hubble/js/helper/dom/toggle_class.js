/**
 * Toogle a classname
 *
 * @access {public}
 * @param  {DOMElement}         el         Target element
 * @param  {string}       className  Class name to toggle
 */
toggle_class(el, className)
{
    if (!this.in_dom(el))
    {
        return;
    }

    if (this.has_class(el, className))
    {
        this.remove_class(el, className);
    }
    else
    {
        this.add_class(el, className);
    }
}