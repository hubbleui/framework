/**
 * Aria show an element
 *
 * @access {public}
 * @param  {DOMElement}   el Target DOM node
 */
_.prototype.show_aria = function(HTMLElement)
{
    if (this.is_array(HTMLElement)) return this.each(HTMLElement, (i, el) => this.show_aria(el));

    this.attr(HTMLElement, 'aria-hidden', 'false');
}
