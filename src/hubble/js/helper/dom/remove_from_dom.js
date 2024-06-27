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

        var children = this.$All('*', el);

        for (var i = 0, len = children.length; i < len; i++)
        {
            this.removeEventListener(children[i]);
        }

        this.removeEventListener(el);
    }
}