/**
 * Aria hide an element
 *
 * @access {public}
 * @param  {DOMElement}   HTMLElement Target DOM node
 */
_.prototype.hide_aria = function(HTMLElement)
{
    if (this.is_array(HTMLElement)) return this.each(HTMLElement, (i, el) => this.hide_aria(el));
    
    this.attr(HTMLElement, 'aria-hidden', 'true');
}