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
        this.each(DOMElement, (i, _DOMElement) =>  this.add_class(_DOMElement, className));

        return this;
    }

    if (this.is_array(className))
    {
        this.each(className, (i, _className) =>  this.add_class(DOMElement, _className));
    
        return this;
    }

    if (className.includes(','))
    {
        this.each(this.array_filter(className.split(',')), (i, _className) => this.add_class(DOMElement, _className));
    
        return this;
    }

    if (className.includes('.'))
    {
        this.each(this.array_filter(className.split('.')), (i, _className) => this.add_class(DOMElement, _className));
    
        return this;
    }

    className = className.trim();

    if (className[0] === '.') className = className.slice(1);

    DOMElement.classList.add(className);

    return this;
}