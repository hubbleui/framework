/* Trigger a waypoint */
(function() {

    // REQUIRES
    /*****************************************/
    var Helper       = Modules.require('JSHelper');
    var pageLoaded   = false;

    // MODULE OBJECT
    /*****************************************/
    var WayPoints = function() {
        
        this.__construct();

        return this;
    };

    // CONSTURCTOR
    /*****************************************/
    WayPoints.prototype.__construct = function() {
        
        // Load dependancies
        if (Helper === 'null') Helper = Modules.require('JSHelper');
        
        // Load nodes
        this._nodes = Helper.$All('.js-waypoint-trigger');

        // bind listeners
        for (var i = 0; i < this._nodes.length; i++) {
            this._bind(this._nodes[i]);
        }

        // Invoke pageload
        if (!pageLoaded) this._invokePageLoad();

        // Auto destructor
        if (!this._nodes.length) this.destruct();
    }

    // DESTRUCTOR
    /*****************************************/
    WayPoints.prototype.destruct = function() {

        // Unbind listeners
        for (var i = 0; i < this._nodes.length; i++) {
            this._unbind(this._nodes[i]);
        }
        
        // Clear Nodes
        this._nodes = [];

        // Clear variables
        Helper = 'null';
    }

    // LISTENER BINDER
    /*****************************************/
    WayPoints.prototype._bind = function(trigger) {
        Helper.addEventListener(trigger, 'click', this._invoke);
    }

    // LISTENER UNBINDER
    /*****************************************/
    WayPoints.prototype._unbind = function(trigger) {
        Helper.removeEventListener(trigger, 'click', this._invoke);
    }

    // CLICK HANDLER
    /*****************************************/
    WayPoints.prototype._invoke = function(e) {
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
            Modules.require('SmoothScroll').animateScroll('#' + id, trigger, options);
        }
    }

    // SCROLL TO A ELEMENT WITH ID WHEN THE PAGE LOADS
    /*****************************************/
    WayPoints.prototype._invokePageLoad = function() {

        var url = Helper.parse_url(window.location.href);

        if (Helper.isset(url['fragment']) && url['fragment'] !== '') {

            var waypoint = url['fragment'];
            var options  = {
                speed:   50,
                easing: 'Linear'
            };
            var targetEl = Helper.$('[data-waypoint="' + waypoint + '"]');
            
            if (Helper.nodeExists(targetEl)) {
                var id      = waypoint;
                targetEl.id = id;
                Modules.require('SmoothScroll').animateScroll('#' + id, null, options);
            }
        }

        pageLoaded = true;
    }

    // PUSH TO MODULES AND INVOKE
    /*****************************************/
    Modules.singleton('WayPoints', WayPoints).require('WayPoints');

}());
