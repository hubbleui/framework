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
    const [$, add_event_listener, remove_event_listener, has_class, in_dom, parse_url, extend]  = FrontBx.import(['$','add_event_listener','remove_event_listener','has_class','in_dom','parse_url','extend']).from('_');

    /**
     * Has the page loaded?
     * 
     * @var {object}
     */
    var pageLoaded = false;

    /**
     * Waypoints
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.comfrontbx/uimaster/LICENSE}
     */
    const WayPoints = function()
    {        
        this.super('.js-waypoint-trigger');

        // Invoke pageload
        if (!pageLoaded)
        {
            this._invokePageLoad();
        }

        pageLoaded = true;
    }

    /**
     * @inheritdoc
     * 
     */
    WayPoints.prototype.bind = function(node)
    {
        add_event_listener(node, 'click', this._eventHandler);
    }

    /**
     * @inheritdoc
     * 
     */
    WayPoints.prototype.unbind = function(node)
    {
        remove_event_listener(node, 'click', this._eventHandler);
    }

    /**
     * Event handler
     *
     * @param {event|null} e JavaScript click event
     * @access {private}
     */
    WayPoints.prototype._eventHandler = function(e)
    {
        e = e || window.event;
        
        e.preventDefault();

        let trigger   = this;
        let id        = trigger.dataset.waypointTarget;
        let speed     = parseInt(trigger.dataset.waypointSpeed) || 500;
        let easing    = trigger.dataset.waypointEasing || 'easeInOutCubic';
        let updateUrl = trigger.dataset.updateUrl === 'false' ? false : true;

        FrontBx.SmoothScroll('#' + id, { easing: easing, speed: speed, updateUrl: updateUrl });
    }

    /**
     * Scroll to a element with id when the page loads
     *
     * @access {private}
     */
    WayPoints.prototype._invokePageLoad = function()
    {
        var url = parse_url(window.location.href);

        let targetEl = url.hash && url.hash !== '' ? $(url.hash) : false;

        if (!in_dom(targetEl) || !has_class(targetEl, '.js-waypoint')) return;
       
        let speed  = parseInt(targetEl.dataset.waypointSpeed) || 500;
        let easing = targetEl.dataset.waypointEasing || 'easeInOutCubic';

        const scroll = function()
        {
            FrontBx.SmoothScroll(url.hash, { easing: easing, speed: speed, updateUrl: false });

            remove_event_listener(window, 'FrontBx:ready', scroll);
        }

        window.scrollTo(0, 0);

        add_event_listener(window, 'FrontBx:ready', scroll);
    }

    // Load into FrontBx DOM core
    FrontBx.dom().register('WayPoints', extend(Component, WayPoints));

})();