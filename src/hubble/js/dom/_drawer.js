(function()
{
    /**
     * JS Helper
     * 
     * @var {obj}
     */
    const Helper = Container.Helper();

    /**
     * Show/hide sidebar overlay timer
     * 
     * @var {setTimeout}
     */
    var overleyTimer;

    /**
     * Show/hide sidebar el timer
     * 
     * @var {setTimeout}
     */
    var toggleTimer;

    /**
     * Last scroll y on page
     * 
     * @var {int}
     */
    var lastScrollY;

    /**
     * Drawer
     * 
     */
    class Drawer
    {
        /**
         * Module constructor
         *
         * @access {public}
         * @constructor
         {*} @return this
         */
    	constructor()
        {
            this._openTriggers = Helper.$All('.js-open-drawer-trigger');
            this._closeTriggers = Helper.$All('.js-close-drawer-trigger');
            this._drawerEl = Helper.$('.js-drawer');
            this._overlayEl = Helper.$('.js-drawer-overlay');

            if (Helper.in_dom(this._drawerEl))
            {
                this._bind();
            }

            return this;
        }

        /**
         * Module destructor
         *
         * @access {public}
         */
        destruct()
        {
            this._unbind();
        }

        /**
         * Bind event listeners
         *
         * @access {private}
         */
        _bind()
        {
            this._drawerWidth = Helper.rendered_style(this._drawerEl, 'max-width');

            Helper.addEventListener(this._openTriggers, 'click', this.open);

            Helper.addEventListener(this._closeTriggers, 'click', this.close);

            Helper.addEventListener(this._overlayEl, 'click', this.close);
        }

        /**
         * Unbind event listeners
         *
         * @access {private}
         */
        _unbind()
        {
            Helper.removeEventListener(this._openTriggers, 'click', this.open);

            Helper.removeEventListener(this._closeTriggers, 'click', this.close);

            Helper.removeEventListener(this._overlayEl, 'click', this.close);
        }

        /**
         * Handle show sidebar
         *
         * @access {private}
         * @param  {event|null} e Button click even
         */
        open(e)
        {
            e = e || window.event;

            if (e && e.target && Helper.is_node_type(e.target, 'a'))
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
            Helper.show_aria(_this._overlayEl);

            // Sidebar
            Helper.css(_this._drawerEl, 'visibility', 'visible');
            if (Helper.has_class(_this._drawerEl, 'drawer-right'))
            {
                Helper.animate(_this._drawerEl, 'transform', 'translateX('+ _this._drawerWidth + ')', 'translateX(0)', 200, 'easeOutCubic');
            }
            else
            {
                Helper.animate(_this._drawerEl, 'transform', 'translateX(-' + _this._drawerWidth +')', 'translateX(0)', 200, 'easeOutCubic');
            }

            Helper.add_class(document.body, 'no-scroll');
            Helper.show_aria(_this._drawerEl);
            Helper.add_class(_this._drawerEl, 'active');
            _this._drawerEl.focus();
        }

        /**
         * Handle hide sidebar
         *
         * @access {public}
         * @param  {event|null} e Button click even
         */
        close(e)
        {
            e = e || window.event;

            if (e && e.target && Helper.is_node_type(e.target, 'a'))
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
            Helper.hide_aria(_this._overlayEl);

            // Sidebar
            if (Helper.has_class(_this._drawerEl, 'drawer-right'))
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

            Helper.remove_class(document.body, 'no-scroll');
            Helper.hide_aria(_this._drawerEl);
            _this._drawerEl.blur();

            if (lastScrollY)
            {
                window.scrollTo(0, lastScrollY);
            }
        }
    }

    // Register as DOM Module and invoke
    Hubble.dom().register('Drawer', Drawer, true);

}());