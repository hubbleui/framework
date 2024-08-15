/**
 * Select single node by selector
 *
 * @access {public}
 * @param  {string} selector CSS selector
 * @param  {DOMElement}   context (optional) (default document)
 * @return {DOMElement}
 */
_.prototype.$ = function(selector, context)
{
    context = (typeof context === 'undefined' ? document : context);

    let fchild = selector.trim().substring(0, 1) === '>';
    let multi  = selector.includes(',');

    // Fast
    if (!fchild && !multi) return context.querySelector(selector);

    if (multi) selector = selector.replaceAll(/,\s?>/g, ', :scope >');
    
    if (fchild) selector = `:scope ${selector}`;

    return context.querySelector(selector);
}

/**
 * "$" Alias
 *
 */
_.prototype.find = function(selector, context)
{
    return this.$(selector, context);
}

/**
 * Select and return all nodes by selector
 *
 * @access {public}
 * @param  {string} selector CSS selector
 * @param  {DOMElement}   context (optional) (default document)
 * @return {DOMElement}
 */
_.prototype.$All = function(selector, context, includeContextEl)
{
    context = (typeof context === 'undefined' ? document : context);

    includeContextEl = (typeof includeContextEl === 'undefined' ? false : includeContextEl && context !== document);

    let fchild = selector.trim().substring(0, 1) === '>';
    let multi  = selector.includes(',');
    let deleteParent = false;

    if (includeContextEl)
    {
        if (!hasParent)
        {
            parent = document.createElement('div');
            parent.appendChild(context);
            deleteParent = true;
        }

        context = context.parentNode;
    }

    if (multi)  selector = selector.replaceAll(/,\s?>/g, ', :scope >');
    if (fchild) selector = `:scope ${selector}`;

    let ret = TO_ARR.call(context.querySelectorAll(selector));

    if (deleteParent) context.parentNode.removeChild(context);

    return ret;
}

/**
 * "$All" Alias
 *
 */
_.prototype.find_all = function(selector, context)
{
    return this.$All(selector, context);
}