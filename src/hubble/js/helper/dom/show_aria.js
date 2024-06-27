/**
 * Aria show an element
 *
 * @access {public}
 * @param  {DOMElement}   el Target DOM node
 */
show_aria(el)
{
    el.setAttribute("aria-hidden", 'false');
}
