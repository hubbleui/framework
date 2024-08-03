/**
 * Check if a node matches a CSS selector
 *
 * @access {public}
 * @param  {DOMElement}   DOMElement Target element
 * @param  {string|array} selector   CSS Selector
 * @return {bool}
 */
_.prototype.$_with_context = function(selector, context)
{
    // has_selector(node, 'div, .class, #id')
    if (selector.includes(','))
    {
        let ret = [];

        this.each(selector.split(','), (i, sel) =>
        {
            ret = [...ret, ...this.$_with_context(sel, context)];

        }, this);

        return ret;
    }

    // Cleanup
    selector = selector.replace(/  +/g, ' ').trim();

    // Match id failsafe
    if (selector[0] === '#')
    {
        return context.id === selector.substring(1).trim().split(/[^A-Za-z0-9-_]/).shift().trim() ? [context] : [];
    }

    // Split rules and keep delimiter
    let selectors = selector.split(/(?=[\s>+~])|(?<=[\s>+~])/).filter((x) => x !== ' ');

    // Are we selecting children?
    let selChilds = selectors.length === 1;

    // Make sure we have a parent
    let parent      = context.parentNode;
    let hasParent   = this.is_htmlElement(parent);

    if (!hasParent)
    {
        parent = document.createElement('div');
        parent.appendChild(context);
    }
    
    // Setup base nth child selector
    let nthSelector = !hasParent ? ':nth-child(1)' : `:nth-child(${this.nth_siblings(context) +1})`;

    let find = `> ${selectors.shift()}${nthSelector} ${selectors.join(' ')}`.trim();
    
    // Find match(es)
    let ret = this.array_unique([...this.$All(selector, context), ...this.$All(find, parent)]);

    if (!hasParent) parent.removeChild(context);
    
    return ret;
}