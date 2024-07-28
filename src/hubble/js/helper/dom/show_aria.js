/**
 * Aria show an element
 *
 * @access {public}
 * @param  {DOMElement}   el Target DOM node
 */
_.prototype.show_aria = function(el)
{
    el.setAttribute('aria-hidden', 'false');
}
