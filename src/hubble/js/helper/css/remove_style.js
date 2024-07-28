/**
 * Remove inline css style
 * 
 * @access {public}
 * @param  {DOMElement}   el   Target element
 * @param  {string} prop CSS property to removes
 */
_.prototype.remove_style = function(el, prop)
{
    if (typeof prop === 'undefined')
    {
        DOMElement.removeAttribute('style');

        return;
    }

    this.css(el, prop);
}