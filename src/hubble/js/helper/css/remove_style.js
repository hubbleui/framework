/**
 * Remove inline css style
 * 
 * @access {public}
 * @param  {node}   el   Target element
 * @param  {string} prop CSS property to removes
 */
remove_style(el, prop)
{
    if (typeof prop === 'undefined')
    {
        DOMElement.removeAttribute('style');

        return;
    }

    this.css(el, prop);
}