/**
 * Aria hide an element
 *
 * @access {public}
 * @param  {node}   el Target DOM node
 */
hide_aria(el)
{
    el.setAttribute("aria-hidden", 'true');
}