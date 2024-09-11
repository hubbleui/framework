/**
 * Check if a node has a class
 *
 * @access {public}
 * @param  {DOMElement}         el         Target element
 * @param  {string|array} className  Class name(s) to check for
 * @return {bool}
 */
_.prototype.has_class = function(DOMElement, className)
{
    let ret = false;

    if (this.is_array(className))
    {
        this.each(className, (i, _className) => { if (this.has_class(DOMElement, _className)) ret = true; return false; });
        
        return ret;
    }

    if (className.includes(','))
    {
        this.each(this.array_filter(className.split(',')), (i, _className) => { if (this.has_class(DOMElement, _className)) ret = true; return false; });
    
        return ret;
    }

    if (className.includes('.'))
    {
        let count = className.split('.').length;

        if (count >= 3)
        {
            this.each(this.array_filter(className.split('.')), (i, _className) => { ret = this.has_class(DOMElement, _className); if (!ret) return false; });

            return ret;
        }
    }

    className = className.trim();

    if (className[0] === '.') className = className.slice(1);

    return DOMElement.classList.contains(className);
}