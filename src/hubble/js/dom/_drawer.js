/**
 * Drawer
 * 
 */
(function()
{
    /**
     * JS Helper
     * 
     * @var obj
     */
    var Helper = Hubble.helper();

    /**
     * Show/hide sidebar overlay timer
     * 
     * @var setTimeout
     */
    var overleyTimer;

    /**
     * Show/hide sidebar el timer
     * 
     * @var setTimeout
     */
    var toggleTimer;

    /**
     * Last scroll y on page
     * 
     * @var int
     */
    var lastScrollY;

    /**
     * Module constructor
     *
     * @access public
     * @constructor
     * @return this
     */
    var Drawer = function()
    {
        this._openTriggers = Helper.$All('.js-open-drawer-trigger');
        this._closeTriggers = Helper.$All('.js-close-drawer-trigger');
        this._drawerEl = Helper.$('.js-drawer');
        this._overlayEl = Helper.$('.js-drawer-overlay');

        if (Helper.nodeExists(this._drawerEl))
        {
            this._bind();
        }

        return this;
    }

    /**
     * Module destructor
     *
     * @access public
     */
    Drawer.prototype.destruct = function()
    {
        this._unbind();
    }

    /**
     * Bind event listeners
     *
     * @access private
     */
    Drawer.prototype._bind = function()
    {
        this._drawerWidth = Helper.getStyle(this._drawerEl, 'max-width');

        Helper.addEventListener(this._openTriggers, 'click', this.open);

        Helper.addEventListener(this._closeTriggers, 'click', this.close);

        Helper.addEventListener(this._overlayEl, 'click', this.close);
    }

    /**
     * Unbind event listeners
     *
     * @access private
     */
    Drawer.prototype._unbind = function()
    {
        Helper.removeEventListener(this._openTriggers, 'click', this.open);

        Helper.removeEventListener(this._closeTriggers, 'click', this.close);

        Helper.removeEventListener(this._overlayEl, 'click', this.close);
    }

    /**
     * Handle show sidebar
     *
     * @access private
     * @param  event|null e Button click even
     */
    Drawer.prototype.open = function(e)
    {
        e = e || window.event;

        if (e && e.target && Helper.isNodeType(e.target, 'a'))
        {
            e.preventDefault();
        }

        lastScrollY = document.documentElement.scrollTop || document.body.scrollTop;

        clearTimeout(overleyTimer);
        clearTimeout(toggleTimer);

        var _this = Container.Drawer();

        // Overlay
        Helper.css(_this._overlayEl, 'visibility', 'visible');
        Helper.animate(_this._overlayEl, 'opacity', 0, 1, 200, 'easeOutCubic');
        Helper.showAria(_this._overlayEl);

        // Sidebar
        Helper.css(_this._drawerEl, 'visibility', 'visible');
        if (Helper.hasClass(_this._drawerEl, 'drawer-right'))
        {
            Helper.animate(_this._drawerEl, 'transform', 'translateX('+ _this._drawerWidth + ')', 'translateX(0)', 200, 'easeOutCubic');
        }
        else
        {
            Helper.animate(_this._drawerEl, 'transform', 'translateX(-' + _this._drawerWidth +')', 'translateX(0)', 200, 'easeOutCubic');
        }

        Helper.addClass(document.body, 'no-scroll');
        Helper.showAria(_this._drawerEl);
        Helper.addClass(_this._drawerEl, 'active');
        _this._drawerEl.focus();
    }

    /**
     * Handle hide sidebar
     *
     * @access public
     * @param  event|null e Button click even
     */
    Drawer.prototype.close = function(e)
    {
        e = e || window.event;

        if (e && e.target && Helper.isNodeType(e.target, 'a'))
        {
            e.preventDefault();
        }

        clearTimeout(overleyTimer);
        clearTimeout(toggleTimer);

        var _this = Container.Drawer();

        // Overlay
        Helper.animate(_this._overlayEl, 'opacity', 1, 0, 200, 'easeOutCubic');
        overleyTimer = setTimeout(function()
        {
            Helper.css(_this._overlayEl, 'visibility', 'hidden');

        }, 250);
        Helper.hideAria(_this._overlayEl);

        // Sidebar
        if (Helper.hasClass(_this._drawerEl, 'drawer-right'))
        {
            Helper.animate(_this._drawerEl, 'transform', 'translateX(0)', 'translateX(' + _this._drawerWidth + ')', 200, 'easeOutCubic');
        }
        else
        {
            Helper.animate(_this._drawerEl, 'transform', 'translateX(0)', 'translateX(-' + _this._drawerWidth + ')', 200, 'easeOutCubic');
        }

        toggleTimer = setTimeout(function()
        {
            Helper.css(_this._drawerEl, 'visibility', 'hidden');
            
        }, 250);

        Helper.removeClass(document.body, 'no-scroll');
        Helper.hideAria(_this._drawerEl);
        _this._drawerEl.blur();

        if (lastScrollY)
        {
            window.scrollTo(0, lastScrollY);
        }
    }

    // Register as DOM Module and invoke
    Hubble.dom().register('Drawer', Drawer, true);

}());