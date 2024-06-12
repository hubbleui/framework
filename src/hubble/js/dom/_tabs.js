/**
 * Tab Nav
 *
 * @author    Joe J. Howard
 * @copyright Joe J. Howard
 * @license   https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE
 */

(function()
{
    /**
     * Helper instance
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
    var TabNav = function()
    {
        // Find nodes
        this._nodes = Helper.$All('.js-tab-nav');

        // If nothing to do destruct straight away
        if (!Helper.empty(this._nodes))
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
     * @access public
     */
    TabNav.prototype.destruct = function()
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
     * @params navWrap node
     * @access private
     */
    TabNav.prototype._bindDOMListeners = function(navWrap)
    {
        var links  = Helper.$All('li > *', navWrap);
        
        for (var i = 0; i < links.length; i++)
        {
            Helper.addEventListener(links[i], 'click', this._eventHandler);
        }
    }

    /**
     * Unbind click events on all <a> tags in a .js-tab-nav
     *
     * @params navWrap node
     * @access private
     */
    TabNav.prototype._unbindDOMListeners = function(navWrap)
    {
        var links = Helper.$All('li > *', navWrap);
        
        for (var i = 0; i < links.length; i++)
        {
            Helper.removeEventListener(links[i], 'click', this._eventHandler);
        }
    }

    /**
     * Click event handler
     *
     * @param event|null e JavaScript click event
     * @access private
     */
    TabNav.prototype._eventHandler = function(e)
    {
        e = e || window.event;
        e.preventDefault();

        var _this = Container.get('TabNav');
        
        var node = this;

        if (Helper.hasClass(node, 'active')) return;
        
        var tab           = node.dataset.tab;
        var tabNav        = Helper.closest(node, 'ul');

        var tabPane       = Helper.$('[data-tab-panel="' + tab + '"]');
        var tabPanel      = Helper.closestClass(tabPane, 'js-tab-panels-wrap');
        var activePanel   = Helper.$('.tab-panel.active', tabPanel);

        var navWrap       = Helper.closestClass(node, 'js-tab-nav');
        var activeNav     = Helper.$('.active', navWrap);
        var activeClass   = navWrap.dataset.activeClass;
        var activeClasses = ['active'];

        if (!Helper.empty(activeClass))
        {
            activeClasses.push(activeClass);
        }

        Helper.removeClass(activeNav, activeClasses);
        Helper.removeClass(activePanel, activeClasses);

        Helper.addClass(node, activeClasses);
        Helper.addClass(tabPane, activeClasses);
        
    }

    // Load into Hubble DOM core
    Container.get('Hubble').dom().register('TabNav', TabNav);

})();