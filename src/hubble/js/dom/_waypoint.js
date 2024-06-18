(function()
{
    /**
     * Helper instance
     * 
     * @var {object}
     */
    var Helper = Hubble.helper();

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
        {    // Load nodes
            this._nodes = Helper.$All('.js-waypoint-trigger');

            // bind listeners
            if (!Helper.is_empty(this._nodes))
            {
                for (var i = 0; i < this._nodes.length; i++)
                {
                    this._bind(this._nodes[i]);
                }
            }

            // Invoke pageload
            if (!pageLoaded)
            {
                this._invokePageLoad();
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
            // Unbind listeners
            for (var i = 0; i < this._nodes.length; i++)
            {
                this._unbind(this._nodes[i]);
            }

            // Clear Nodes
            this._nodes = [];
        }

        /**
         * Event binder
         *
         * @params {trigger} node
         * @access {private}
         */
        _bind(trigger)
        {
            Helper.addEventListener(trigger, 'click', this._eventHandler);
        }

        /**
         * Event unbinder
         *
         * @params {trigger} node
         * @access {private}
         */
        _unbind(trigger)
        {
            Helper.removeEventListener(trigger, 'click', this._eventHandler);
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
            var trigger = this;
            var waypoint = trigger.dataset.waypointTarget;
            var targetEl = Helper.$('[data-waypoint="' + waypoint + '"]');

            if (Helper.in_dom(targetEl))
            {
                var id = waypoint;
                var speed = typeof trigger.dataset.waypointSpeed !== "undefined" ? trigger.dataset.waypointSpeed : 500;
                var easing = typeof trigger.dataset.waypointEasing !== "undefined" ? trigger.dataset.waypointEasing : 'easeInOutCubic';
                targetEl.id = id;

                var options = {
                    easing: easing,
                    speed: speed,
                };

                Container.get('SmoothScroll').animateScroll('#' + id, trigger, options);
            }
        }

        /**
         * Scroll to a element with id when the page loads
         *
         * @access {private}
         */
        _invokePageLoad()
        {
            var url = Helper.parse_url(window.location.href);

            if (url.hash && url.hash !== '')
            {
                var waypoint = Helper.trim(url.hash, '/');
                var options = {
                    speed: 100,
                    easing: 'Linear'
                };
                var targetEl = Helper.$('[data-waypoint="' + waypoint + '"]');

                if (Helper.in_dom(targetEl))
                {
                    var id = waypoint;
                    targetEl.id = id;
                    Container.get('SmoothScroll').animateScroll('#' + id, null, options);
                }
            }

            pageLoaded = true;
        }
    }


    // Load into Hubble DOM core
    Hubble.dom().register('WayPoints', WayPoints);

}());
