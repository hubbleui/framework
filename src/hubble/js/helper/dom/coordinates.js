/**
 * Get an element's absolute coordinates
 *
 * @access {public}
 * @param  {node}   el Target element
 * @return {object}
 */
coordinates(el)
{
    var box = el.getBoundingClientRect();
    var body = document.body;
    var docEl = document.documentElement;
    var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;
    var clientTop = docEl.clientTop || body.clientTop || 0;
    var clientLeft = docEl.clientLeft || body.clientLeft || 0;
    var borderL = parseInt(this.rendered_style(el, 'border-top-width'));
    var borderR = parseInt(this.rendered_style(el, 'border-top-width'));
    var borderT = parseInt(this.rendered_style(el, 'border-top-width'));
    var borderB = parseInt(this.rendered_style(el, 'border-top-width'));
    var top = box.top + scrollTop - clientTop - borderT - borderB;
    var left = box.left + scrollLeft - clientLeft + borderL - borderR;
    var width = parseFloat(this.rendered_style(el, "width"));
    var height = parseFloat(this.rendered_style(el, "height"));

    return {
        top: top,
        left: left,
        right: left + width,
        bottom: top + height,
        height: height,
        width: width,
    };
}