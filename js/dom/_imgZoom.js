(function()
{
    /**
     * Component base
     * 
     * @var {class}
     */
    const [Component] = FrontBx.get('Component');

    /**
     * Helper functions
     * 
     * @var {Function}
     */
    const [$, add_event_listener, css, parse_url, remove_event_listener, rendered_style, extend] = FrontBx.import(['$','add_event_listener','css','parse_url','remove_event_listener','rendered_style','extend']).from('_');

    /**
     * Image zoom hover
     * 
     */
    const ImageZoom = function()
    {
        this.super('.js-img-hover-zoom')
    }

    /**
     * Bind DOM listeners
     *
     * @access {public}
     */
    ImageZoom.prototype.bind = function(node)
    {
        css(node, 'background-image', 'url(' + node.dataset.zoomSrc + ')');

        add_event_listener(node, 'mousemove', this._onHover);

        $('img', node).alt = '';

        $('img', node).title = '';
    }

    /**
     * Unbind DOM listeners
     *
     * @access {public}
     */
    ImageZoom.prototype.unbind = function(node)
    {
        remove_event_listener(node, 'mousemove', this._onHover);
    }

    /**
     * On hover event
     *
     * @param  {e} event|null "mousemove" event
     * @access {private}
     */
    ImageZoom.prototype._onHover = function(e)
    {
        e = e || window.event;

        if (!e || !e.currentTarget)
        {
            return false;
        }

        var _wrapper = e.currentTarget;
        var _zoomSrc = parse_url(rendered_style(_wrapper, 'background-image').replace('url(', '').replace(')', ''));
        var _dataZoomSrc = parse_url(_wrapper.dataset.zoomSrc);

        if (_zoomSrc.path !== _dataZoomSrc.path)
        {
            css(_wrapper, 'background-image', 'url(' + _wrapper.dataset.zoomSrc + ')');
        }

        var offsetX = 0;
        var offsetY = 0;
        if (e.offsetX)
        {
            offsetX = e.offsetX;
        }
        else if (e.touches && e.touches[0] && e.touches[0].pageX)
        {
            offsetX = e.touches[0].pageX;
        }
        else
        {
            return false;
        }

        if (e.offsetY)
        {
            offsetY = e.offsetY;
        }
        else if (e.touches && e.touches[0] && e.touches[0].pageY)
        {
            offsetY = e.touches[0].pageY;
        }
        else
        {
            return false;
        }

        x = offsetX / _wrapper.offsetWidth * 100;
        y = offsetY / _wrapper.offsetHeight * 100;


        css(_wrapper, 'background-position', x + '% ' + y + '%');
    }

    // Register as DOM Module and invoke
    FrontBx.dom().register('ImageZoom', extend(Component, ImageZoom));

}());
