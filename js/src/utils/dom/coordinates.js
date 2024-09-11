/**
 * Get an element's absolute coordinates
 *
 * @access {public}
 * @param  {DOMElement}   el Target element
 * @return {object}
 */
_.prototype.coordinates = function(DOMElement)
{
    // If element is hiddien we need to display it quickly
    var inlineDisplay = this.inline_style(DOMElement, 'display');
    var hidden        = this.rendered_style(DOMElement, 'display');
    
    if (hidden === 'none')
    {
        // If the element was "display:none" with an inline
        // style, remove the inline display so it defaults to
        // whatever styles are set on in through stylesheet
        if (inlineDisplay)
        {
            this.css(DOMElement, 'display', false);
        }
        // Otherwise set it to unset
        else
        {
            this.css(DOMElement, 'display', 'unset');
        }
    }

    var box        = DOMElement.getBoundingClientRect();
    var body       = document.body;
    var docEl      = document.documentElement;
    var scrollTop  = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;
    var clientTop  = docEl.clientTop || body.clientTop || 0;
    var clientLeft = docEl.clientLeft || body.clientLeft || 0;
    var borderL    = parseInt(this.rendered_style(DOMElement, 'border-top-width'));
    var borderR    = parseInt(this.rendered_style(DOMElement, 'border-top-width'));
    var borderT    = parseInt(this.rendered_style(DOMElement, 'border-top-width'));
    var borderB    = parseInt(this.rendered_style(DOMElement, 'border-top-width'));
    var top        = box.top + scrollTop - clientTop - borderT - borderB;
    var left       = box.left + scrollLeft - clientLeft + borderL - borderR;
    var width      = parseFloat(this.rendered_style(DOMElement, "width"));
    var height     = parseFloat(this.rendered_style(DOMElement, "height"));

    if (inlineDisplay)
    {
        this.css(DOMElement, 'display', inlineDisplay);
    }
    else
    {
        this.css(DOMElement, 'display', false);
    }
    
    return {
        top: top,
        left: left,
        right: left + width,
        bottom: top + height,
        height: height,
        width: width,
    };
}