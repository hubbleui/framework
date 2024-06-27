/**
 * Replaces element's innerText without destroying childnodes
 *
 * @access {public}
 * @param  {DOMElement}   el   Target element
 * @param  {string} text Text to replace
 */
inner_Text(el, text)
{
    if (el.childNodes[0])
    {
        el.childNodes[0].nodeValue = text;
    }
}