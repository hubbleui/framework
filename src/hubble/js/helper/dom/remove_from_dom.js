/**
 * Remove an element from the DOM
 *
 * This function also removes all attached event listeners
 * 
 * @access {public}
 * @param  {DOMElement}   el Target element
 */
remove_from_dom(el)
{
    if (this.in_dom(el))
    {
        el.parentNode.removeChild(el);

        var children = this.$All('*', el).reverse();

        for (var i = 0, len = children.length; i < len; i++)
        {
            this.removeEventListener(children[i]);

            this.trigger_event(children[i], `Hubble:dom:remove`);
        }

        this.removeEventListener(el);

        this.trigger_event(el, `Hubble:dom:remove`);

        this.trigger_event(window, `Hubble:dom:remove`, { DOMElement: el });
    }
}