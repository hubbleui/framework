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
    
    // Fast
    if (!selector.trim().substring(0, 1) === '>') return context.querySelector(selector);

    return context.querySelector(`:scope ${selector}`);
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
_.prototype.$All = function(selector, context)
{
    context = (typeof context === 'undefined' ? document : context);

    let fchild = selector.trim().substring(0, 1) === '>';
    let multi  = selector.includes(',');

    // Fast
    if (!fchild && !multi) return TO_ARR.call(context.querySelectorAll(selector));

    // Easier to just split and loop here
    if (multi)
    {
        let ret = [];

        this.each(selector.split(','), (i, s) =>
        {
            ret = [...ret, ...this.$All(s.trim(), context)];
        
        }, this);

        return this.array_unique(ret);
    }

    return TO_ARR.call(context.querySelectorAll(`:scope ${selector}`));
}

/**
 * "$All" Alias
 *
 */
_.prototype.find_all = function(selector, context)
{
    return this.$All(selector, context);
}