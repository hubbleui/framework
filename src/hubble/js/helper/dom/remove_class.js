/**
 * Remove a css class or list of classes
 *
 * @access {public}
 * @param  {node}         DOMElement Target element
 * @param  {array|string} className  Class name(s) to remove
 */
remove_class(DOMElement, className)
{
    if (this.is_array(DOMElement))
    {
        this.each(DOMElement, function(i, _DOMElement)
        {
            this.remove_class(_DOMElement, className);

        }, this);

        return this;
    }

    if (!this.in_dom(DOMElement))
    {
        return this;
    }

    if (this.is_array(className))
    {
        this.each(className, function(i, _className)
        {
            DOMElement.classList.remove(_className);

        });

        return;
    }

    DOMElement.classList.remove(className);
}