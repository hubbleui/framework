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
    
    return context.querySelector(selector)
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
            ret = [...ret, ...this.$All(s, context)];
        
        }, this);

        return ret;
    }

    return TO_ARR.call(context.querySelectorAll(`:scope ${selector}`));
}

