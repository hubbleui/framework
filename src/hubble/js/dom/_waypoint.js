(function()
{
    /**
     * Helper instance
     * 
     * @var {object}
     */
    const Helper = Container.Helper();

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
     * @license   {https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE}
     */
    class WayPoints
    {
        /**
         * Module constructor
         *
         * @constructor
         {*} @access public
         */
    	constructor()
        {
            // Load nodes
            this._nodes = Helper.$All('.js-waypoint-trigger');

            // bind listeners
            this._bind();

            // Invoke pageload
            if (!pageLoaded)
            {
                this._invokePageLoad();
            }

            pageLoaded = true;

            return this;
        }

        /**
         * Module destructor
         *
         * @access {public}
         */
        destruct()
        {
            Helper.removeEventListener(this._nodes, 'click', this._eventHandler);

            // Clear Nodes
            this._nodes = [];
        }

        /**
         * Event binder
         *
         * @access {private}
         */
        _bind()
        {
            Helper.addEventListener(this._nodes, 'click', this._eventHandler);
        }

        /**
         * Event handler
         *
         * @param {event|null} e JavaScript click event
         * @access {private}
         */
        _eventHandler(e)
        {
            e = e || window.event;
            
            e.preventDefault();

            let trigger   = this;
            let id        = trigger.dataset.waypointTarget;
            let speed     = parseInt(trigger.dataset.waypointSpeed) || 500;
            let easing    = trigger.dataset.waypointEasing || 'easeInOutCubic';
            let updateUrl = trigger.dataset.updateUrl === 'false' ? false : true;

            Container.SmoothScroll('#' + id, { easing: easing, speed: speed, updateUrl: updateUrl });
        }

        /**
         * Scroll to a element with id when the page loads
         *
         * @access {private}
         */
        _invokePageLoad()
        {
            var url = Helper.parse_url(window.location.href);

            let targetEl = url.hash && url.hash !== '' ? Helper.$(url.hash) : false;

            if (!Helper.in_dom(targetEl) || !Helper.has_class(targetEl, '.js-waypoint')) return;
           
            let speed  = parseInt(targetEl.dataset.waypointSpeed) || 500;
            let easing = targetEl.dataset.waypointEasing || 'easeInOutCubic';

            const scroll = function()
            {
                Container.SmoothScroll(url.hash, { easing: easing, speed: speed, updateUrl: false });

                window.removeEventListener('HubbleReady', scroll);
            }

            window.scrollTo(0, 0);

            window.addEventListener('HubbleReady', scroll);
        }
    }


    // Load into Hubble DOM core
    Hubble.dom().register('WayPoints', WayPoints);

}());
