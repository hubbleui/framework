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
    const [find, attr, add_class, on, closest, has_class, is_empty, remove_class, off, extend] = FrontBx.import(['find','attr','add_class','on','closest','has_class','is_empty','remove_class','off','extend']).from('_');

    /**
     * Tab Nav
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.comfrontbx/uimaster/LICENSE}
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
        on(node, 'click', this._eventHandler);
    }

    /**
     * Unbind click events on all <a> tags in a .js-tab-nav
     *
     * @params {navWrap} node
     * @access {private}
     */
    TabNav.prototype.unbind = function(node)
    {            
        off(node, 'click', this._eventHandler, this);
    }

    /**
     * Click event handler
     *
     * @param {event|null} e JavaScript click event
     * @access {private}
     */
    TabNav.prototype._eventHandler = function(e, clicked)
    {
        let nav         = closest(clicked, '.js-tab-nav');
        let activeClass = attr(nav, 'data-active-class') || 'active';
        let panel       = find(`[data-tab-panel=${attr(clicked, 'data-tab')}]`);
        let panels      = closest(panel, '.js-tab-panels');

        if (has_class(clicked, activeClass)) return false;

        remove_class(find(`.${activeClass}[data-tab]`, nav), activeClass);
        add_class(clicked, activeClass);

        remove_class(find('.active[data-tab-panel]', panels), 'active');
        add_class(panel, 'active');

        return false;
    }   

    // Load into FrontBx DOM core
    FrontBx.dom().register('TabNav', extend(Component, TabNav));
})();