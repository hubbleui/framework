(function()
{
    /**
     * Component base
     * 
     * @var {class}
     */
    const [Component] = Hubble.get('Component');

    /**
     * Helper functions
     * 
     * @var {Function}
     */
    const [$, add_class, add_event_listener, closest, closest_class, has_class, is_empty, remove_class, remove_event_listener, extend] = Hubble.import(['$','add_class','add_event_listener','closest','closest_class','has_class','is_empty','remove_class','remove_event_listener','extend']).from('_');

    /**
     * Tab Nav
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE}
     */
    const TabNav = function()
    {
        this.super('.js-tab-nav > li > *, .js-tab-nav > *:not(li)');
    }

    /**
     * @inheritdoc
     * 
     */
    TabNav.prototype.bind = function(node)
    {            
        add_event_listener(node, 'click', this._eventHandler);
    }

    /**
     * Unbind click events on all <a> tags in a .js-tab-nav
     *
     * @params {navWrap} node
     * @access {private}
     */
    TabNav.prototype.unbind = function(node)
    {            
        remove_event_listener(node, 'click', this._eventHandler);
    }

    /**
     * Click event handler
     *
     * @param {event|null} e JavaScript click event
     * @access {private}
     */
    TabNav.prototype._eventHandler = function(e)
    {
        e = e || window.event;

        e.preventDefault();

        var _this = Hubble.get('TabNav');
        
        var node = this;

        if (has_class(node, 'active')) return;
        
        var tab           = node.dataset.tab;
        var tabNav        = closest(node, '.js-tab-nav');

        var tabPane       = $('[data-tab-panel="' + tab + '"]');
        var tabPanel      = closest_class(tabPane, '.js-tab-panels-wrap');
        var activePanel   = $('.tab-panel.active', tabPanel);

        var navWrap       = closest_class(node, 'js-tab-nav');
        var activeNav     = $('.active', navWrap);
        var activeClass   = navWrap.dataset.activeClass;
        var activeClasses = ['active'];

        if (!is_empty(activeClass))
        {
            activeClasses.push(activeClass);
        }

        remove_class(activeNav, activeClasses);
        remove_class(activePanel, activeClasses);

        add_class(node, activeClasses);
        add_class(tabPane, activeClasses);
        
    }

    // Load into Hubble DOM core
    Hubble.dom().register('TabNav', extend(Component, TabNav));

})();