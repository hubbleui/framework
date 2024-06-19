/**
 * Replace or append a node's innerHTML
 *
 * @access {public}
 * @param  {node}   DOMElement  Target element
 * @param  {string} content     Target content
 * @param  {bool}   append      Append innerHTML or replace (optional) (default false)
 */
inner_HTML(DOMElement, content, append)
{
    content = this.is_array(content) ? content.join("\n") : content;

    if (append)
    {
        DOMElement.innerHTML += content;
    }
    else
    {
        DOMElement.innerHTML = content;
    }
}