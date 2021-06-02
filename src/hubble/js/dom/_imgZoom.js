/**
 * Image zoom hover
 * 
 */
(function()
{
    /**
     * JS Helper reference
     * 
     * @var object
     */
    var Helper = Hubble.helper();

    /**
     * Module constructor
     *
     * @constructor
     * @access public
     */
    var ImageZoom = function()
    {
        this._nodes = Helper.$All('.js-img-hover-zoom');

        this._bind();

        return this;
    }

    /**
     * Module destructor remove event handlers
     *
     * @access public
     */
    ImageZoom.prototype.destruct = function()
    {
        this._unbind();

        this._nodes = [];
    }

    /**
     * Bind DOM listeners
     *
     * @access public
     */
    ImageZoom.prototype._bind = function()
    {
        for (var i = 0; i < this._nodes.length; i++)
        {
            Helper.css(this._nodes[i], 'background-image', 'url(' + this._nodes[i].dataset.zoomSrc + ')');

            Helper.addEventListener(this._nodes[i], 'mousemove', this._onHover);

            Helper.$('img', this._nodes[i]).alt = '';

            Helper.$('img', this._nodes[i]).title = '';
        }
    }

    /**
     * Unbind DOM listeners
     *
     * @access public
     */
    ImageZoom.prototype._unbind = function()
    {
        Helper.removeEventListener(this._nodes, 'mousemove', this._onHover);
    }

    /**
     * On hover event
     *
     * @param  e event|null "mousemove" event
     * @access private
     */
    ImageZoom.prototype._onHover = function(e)
    {
        e = e || window.event;

        if (!e || !e.currentTarget)
        {
            return false;
        }

        var _wrapper = e.currentTarget;
        var _zoomSrc = Helper.parse_url(Helper.getStyle(_wrapper, 'background-image').replace('url(', '').replace(')', ''));
        var _dataZoomSrc = Helper.parse_url(_wrapper.dataset.zoomSrc);

        if (_zoomSrc.path !== _dataZoomSrc.path)
        {
            Helper.css(_wrapper, 'background-image', 'url(' + _wrapper.dataset.zoomSrc + ')');
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


        Helper.css(_wrapper, 'background-position', x + '% ' + y + '%');
    }

    // Register as DOM Module and invoke
    Container.get('Hubble').dom().register('ImageZoom', ImageZoom);

}());
