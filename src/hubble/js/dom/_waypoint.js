/**
 * Waypoints
 *
 * The waypoint module for click triggers as well as scrolling
 * to an element on page load.
 *
 */
 (function() {

    /**
     * @var Helper obj
     */
    var Helper = Container.get('JSHelper');

    /**
     * @var pageLoaded boolean
     */
    var pageLoaded = false;

    /**
     * Module constructor
     *
     * @class
     * @constructor
     * @params null
     * @access public
     * @return this
     */
    var WayPoints = function() {
        
        // Load nodes
        this._nodes = Helper.$All('.js-waypoint-trigger');

        // bind listeners
        if (!Helper.empty(this._nodes)) {
            for (var i = 0; i < this._nodes.length; i++) {
                this._bind(this._nodes[i]);
            }
        }
        
        // Invoke pageload
        if (!pageLoaded) this._invokePageLoad();

        return this;
    };

    /**
     * Module destructor
     *
     * @params null
     * @access public
     */
    WayPoints.prototype.destruct = function() {

        // Unbind listeners
        for (var i = 0; i < this._nodes.length; i++) {
            this._unbind(this._nodes[i]);
        }
        
        // Clear Nodes
        this._nodes = [];
    }

    /**
     * Event binder
     *
     * @params trigger node
     * @access private
     */
    WayPoints.prototype._bind = function(trigger) {
        Helper.addEventListener(trigger, 'click', this._eventHandler);
    }

    /**
     * Event unbinder
     *
     * @params trigger node
     * @access private
     */
    WayPoints.prototype._unbind = function(trigger) {
        Helper.removeEventListener(trigger, 'click', this._eventHandler);
    }

    /**
     * Event handler
     *
     * @params e event
     * @access private
     */
    WayPoints.prototype._eventHandler = function(e) {
        e = e || window.event;
        e.preventDefault();
        var trigger  = this;
        var waypoint = trigger.dataset.waypointTarget;
        var targetEl = Helper.$('[data-waypoint="' + waypoint + '"]');
        if (Helper.nodeExists(targetEl)) {
            var id      = waypoint;
            var speed   = typeof trigger.dataset.waypointSpeed  !== "undefined" ? trigger.dataset.waypointSpeed : 500;
            var easing  = typeof trigger.dataset.waypointEasing !== "undefined" ? trigger.dataset.waypointEasing : 'easeInOutCubic';
            targetEl.id = id;
            var options = {
                easing : easing,
                speed  : speed,
            }
            Container.get('SmoothScroll').animateScroll('#' + id, trigger, options);
        }
    }

    /**
     * Scroll to a element with id when the page loads
     *
     * @params null
     * @access private
     */
    WayPoints.prototype._invokePageLoad = function() {

        var url = Helper.parse_url(window.location.href);

        if (Helper.isset(url['fragment']) && url['fragment'] !== '') {

            var waypoint = Helper.trim(url['fragment'], '/');
            var options  = {
                speed:   50,
                easing: 'Linear'
            };
            var targetEl = Helper.$('[data-waypoint="' + waypoint + '"]');
            
            if (!Helper.nodeExists(targetEl)) targetEl = Helper.$('#' + waypoint);

            if (Helper.nodeExists(targetEl)) {
                var id      = waypoint;
                targetEl.id = id;
                Container.get('SmoothScroll').animateScroll('#' + id, null, options);
            }
        }

        pageLoaded = true;
    }

    // Load into hubble DOM core
    Container.get('Hubble').dom().register('WayPoints', WayPoints);

}());
