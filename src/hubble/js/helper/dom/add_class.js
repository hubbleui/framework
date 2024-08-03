/**
 * Add a css class or list of classes
 *
 * @access {public}
 * @param  {DOMElement}         DOMElement Target element
 * @param  {array|string} className  Class name(s) to add
 */
_.prototype.add_class = function(DOMElement, className)
{
    if (this.is_array(DOMElement))
    {
        this.each(DOMElement, function(i, _DOMElement)
        {
            this.add_class(_DOMElement, className);

        }, this);

        return this;
    }

    if (this.is_string(className) && className.includes(','))
    {
        this.each(className.split(','), function(i, _className)
        {
            DOMElement.classList.add(_className.trim());
        });

        return;
    }

    if (this.is_array(className))
    {
        this.each(className, function(i, _className)
        {
            DOMElement.classList.add(_className);
        });

        return;
    }

    DOMElement.classList.add(className);
}