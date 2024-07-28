/**
 * Get the current document scroll position
 *
 * @access {private}
 * @return {obj}
 */
_.prototype.scroll_pos = function()
{
    var doc  = document.documentElement;
    var top  = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
    var left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
    
    return {
        top: top,
        left: left
    };
}