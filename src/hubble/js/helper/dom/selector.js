/**
 * Select and return all nodes by selector
 *
 * @access {public}
 * @param  {string} selector CSS selector
 * @param  {node}   context (optional) (default document)
 * @return {node}
 */
$All(selector, context)
{
    context = (typeof context === 'undefined' ? document : context);
    return TO_ARR.call(context.querySelectorAll(selector));
}

/**
 * Select single node by selector
 *
 * @access {public}
 * @param  {string} selector CSS selector
 * @param  {node}   context (optional) (default document)
 * @return {node}
 */
$(selector, context)
{
    context = (typeof context === 'undefined' ? document : context);
    return context.querySelector(selector)
}