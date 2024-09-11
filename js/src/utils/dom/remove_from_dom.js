/**
 * Remove an element from the DOM
 *
 * This function also removes all attached event listeners
 * 
 * @access {public}
 * @param  {DOMElement}   el Target element
 */
_.prototype.remove_from_dom = function(el)
{
    if (this.is_array(el))
    {
        return this.each(el, (i, DOMElement) => this.remove_from_dom(DOMElement));
    }

    if (this.in_dom(el))
    {
        el.parentNode.removeChild(el);

        var children = this.$All('*', el).reverse();

        for (var i = 0, len = children.length; i < len; i++)
        {
            this.remove_event_listener(children[i]);

            this.trigger_event(children[i], `FrontBx:dom:remove`);
        }

        this.remove_event_listener(el);

        this.trigger_event(el, `FrontBx:dom:remove`);

        this.trigger_event(window, `FrontBx:dom:remove`, { DOMElement: el });
    }
}