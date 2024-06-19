/**
 * Triggers a native event on an element
 *
 * @access {public}
 * @param  {node}   el   Target element
 * @param  {string} type Valid event name
 */
trigger_event(el, type)
{
    if ('createEvent' in document)
    {
        var evt = document.createEvent("HTMLEvents");

        evt.initEvent(type, false, true);

        el.dispatchEvent(evt);
    }
    else
    {
        el.fireEvent(type);
    }
}