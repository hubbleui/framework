/**
 * Toogle a classname
 *
 * @access {public}
 * @param  {DOMElement}         el         Target element
 * @param  {string}       className  Class name to toggle
 */
_.prototype.toggle_class = function(DOMElement, className)
{    
    if (this.has_class(DOMElement, className))
    {
        this.remove_class(DOMElement, className);
    }
    else
    {
        this.add_class(DOMElement, className);
    }
}