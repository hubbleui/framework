(function()
{
    /**
     * Helper instance
     * 
     * @var {object}
     */
    var Helper = Hubble.helper();

    /**
     * Bottom nav
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE}
     */
    class BottomNav
    {
        /**
         * Module constructor
         *
         * @constructor
         {*} @access public
         */
        constructor()
        {
            // Find nodes
            this._nav = Helper.$('.js-bottom-nav');

            if (Helper.in_dom(this._nav))
            {
                this._bind();
            }

            return this;
        }

        /**
         * Show nav
         *
         * @access {public}
         */
        show()
        {
            if (Helper.in_dom(this._nav))
            {
                Helper.add_class(this._nav, 'active');
            }
        }

        /**
         * Hide nav
         *
         * @access {public}
         */
        hide()
        {
            if (Helper.in_dom(this._nav))
            {
                Helper.remove_class(this._nav, 'active');
            }
        }

        /**
         * Show nav
         *
         * @access {public}
         */
        state()
        {
            if (Helper.in_dom(this._nav))
            {
                if (Helper.has_class(this._nav, 'active'))
                {
                    return 'show';
                }
            }

            return 'hide';
        }

        /**
         * Module destructor - unbinds click events
         *
         * @access {public}
         */
        destruct()
        {
            if (Helper.in_dom(this._nav))
            {
                var links = Helper.$All('.btn', this._nav);

                Helper.removeEventListener(links, 'click', this._eventHandler);

                this._nav = null;
            }
        }

        /**
         * Bind click events on all button
         *
         * @access {private}
         */
        _bind()
        {
            var links = Helper.$All('.btn', this._nav);

            Helper.addEventListener(links, 'click', this._eventHandler);
        }

        /**
         * Click event handler
         *
         * @param {event|null} e JavaScript click event
         * @access {private}
         */
        _eventHandler(e)
        {
            e = e || window.event;

            e.preventDefault();

            if (Helper.has_class(this, 'active'))
            {
                return;
            }

            Helper.remove_class(Helper.$('.js-bottom-nav .btn.active'), 'active');

            Helper.add_class(this, 'active');
        }
    }

    // Load into Hubble DOM core
    Hubble.dom().register('BottomNav', BottomNav);

})();
