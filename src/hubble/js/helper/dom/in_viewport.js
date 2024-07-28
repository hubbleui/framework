/**
 * Check if an element is in current viewport
 *
 * @access {public}
 * @param  {DOMElement}   el Target DOM node
 * @return {bool}
 */
_.prototype.in_viewport = function(el)
{
    var rect = el.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
    );
}