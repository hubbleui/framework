/**
 * Add a css class or list of classes
 *
 * @access {public}
 * @param  {node}         el         Target element
 * @param  {array|string} className  Class name(s) to add
 */
add_class(el, className)
{
    if (!this.in_dom(el))
    {
        return;
    }

    if (TO_STR.call(className) === '[object Array]')
    {
        for (var i = 0; i < className.length; i++)
        {
            el.classList.add(className[i]);
        }

        return;
    }

    el.classList.add(className);
}