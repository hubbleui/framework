/**
 * Replace or append a node's innerHTML
 *
 * @access {public}
 * @param  {DOMElement}   DOMElement  Target element
 * @param  {string} content     Target content
 * @param  {bool}   append      Append innerHTML or replace (optional) (default false)
 */
_.prototype.inner_HTML = function(DOMElement, content, append)
{
    content = this.is_array(content) ? content.join("\n") : content;

    if (append)
    {
        DOMElement.innerHTML += content;
    }
    else
    {
        this.clear_event_listeners(DOMElement, true);

        DOMElement.innerHTML = content;
    }

    this.trigger_event(DOMElement, `FrontBx:dom:mutate`);

    this.trigger_event(window, `FrontBx:dom:mutate`, { DOMElement: DOMElement });
}