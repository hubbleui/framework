/**
 * Get an element's actual width in px
 *
 * @access {public}
 * @param  {node}   DOMElement Target element
 * @return {object}
 */
width(DOMElement)
{
	if (DOMElement === window || DOMElement === document || DOMElement === document.documentElement ) return Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);

    return this.rendered_style(DOMElement, 'width');
}