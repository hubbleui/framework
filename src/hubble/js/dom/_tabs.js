(function()
{
    /**
     * Helper instance
     * 
     * @var {object}
     */
    var Helper = Hubble.helper();

    /**
     * Tab Nav
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE}
     */
    class TabNav
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
            this._nodes = Helper.$All('.js-tab-nav');

            // If nothing to do destruct straight away
            if (!Helper.is_empty(this._nodes))
            {
                for (var i = 0; i < this._nodes.length; i++)
                {
                    this._bindDOMListeners(this._nodes[i]);
                }
            }

            return this;
        };

        /**
         * Module destructor - unbinds click events
         *
         * @access {public}
         */
        destruct()
        {
            for (var i = 0; i < this._nodes.length; i++)
            {
                this._unbindDOMListeners(this._nodes[i]);
            }

            this._nodes = [];
        }

        /**
         * Bind click events on all <a> tags in a .js-tab-nav
         *
         * @params {navWrap} node
         * @access {private}
         */
        _bindDOMListeners(navWrap)
        {
            var links  = Helper.$All('li > *', navWrap);
            
            Helper.addEventListener(links, 'click', this._eventHandler);
        }

        /**
         * Unbind click events on all <a> tags in a .js-tab-nav
         *
         * @params {navWrap} node
         * @access {private}
         */
        _unbindDOMListeners(navWrap)
        {
            var links = Helper.$All('li > *', navWrap);
            
            Helper.removeEventListener(links, 'click', this._eventHandler);
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

            var _this = Container.get('TabNav');
            
            var node = this;

            if (Helper.has_class(node, 'active')) return;
            
            var tab           = node.dataset.tab;
            var tabNav        = Helper.closest(node, 'ul');

            var tabPane       = Helper.$('[data-tab-panel="' + tab + '"]');
            var tabPanel      = Helper.closest_class(tabPane, 'js-tab-panels-wrap');
            var activePanel   = Helper.$('.tab-panel.active', tabPanel);

            var navWrap       = Helper.closest_class(node, 'js-tab-nav');
            var activeNav     = Helper.$('.active', navWrap);
            var activeClass   = navWrap.dataset.activeClass;
            var activeClasses = ['active'];

            if (!Helper.is_empty(activeClass))
            {
                activeClasses.push(activeClass);
            }

            Helper.remove_class(activeNav, activeClasses);
            Helper.remove_class(activePanel, activeClasses);

            Helper.add_class(node, activeClasses);
            Helper.add_class(tabPane, activeClasses);
            
        }
    }

    // Load into Hubble DOM core
    Hubble.dom().register('TabNav', TabNav);

})();