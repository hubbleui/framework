/**
 * Check if a node has a class
 *
 * @access {public}
 * @param  {DOMElement}         el         Target element
 * @param  {string|array} className  Class name(s) to check for
 * @return {bool}
 */
_.prototype.has_class = function(el, className)
{
    if (!this.in_dom(el))
    {
        return false;
    }

    if (!el.classList)
    {
        return false;
    }

    if (this.is_array(className))
    {
        for (var i = 0; i < className.length; i++)
        {
            if (el.classList.contains(className[i]))
            {
                return true;
            }
        }

        return false;
    }

    var classNames = className.split('.');

    if ((classNames.length - 1) > 1)
    {
        for (var i = 0; i < classNames.length; i++)
        {
            if (el.classList.contains(classNames[i]))
            {
                return true;
            }
        }
    }

    if (className[0] === '.')
    {
        className = className.substring(1);
    }

    return el.classList.contains(className);
}