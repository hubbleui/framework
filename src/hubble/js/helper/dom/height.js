/**
 * Get an element's actual height in px
 *
 * @access {public}
 * @param  {node}   DOMElement Target element
 * @return {object}
 */
height(DOMElement)
{
    if (DOMElement === window || DOMElement === document || DOMElement === document.documentElement ) return Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

    return this.rendered_style(DOMElement, 'height');
}