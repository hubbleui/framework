/**
 * Collapse
 *
 * This class handles the toggling of and element's height
 * when a target element is clicked.
 *
 */
 (function() {

    /**
     * @var Helper obj
     */
    var Helper = Container.get('JSHelper');

    /**
     * Module constructor
     *
     * @class
     * @constructor
     * @params null
     * @access public
     * @return this
     */
    var Collapse = function() {
                
        this._nodes = Helper.$All('.js-collapse');
                
        // bind listeners
        if (!Helper.empty(this._nodes)) {
            for (var i = 0; i < this._nodes.length; i++) {
                Helper.addEventListener(this._nodes[i], 'click', this._eventHandler);
            }
        }
        
        return this;
    }

    /**
     * Module destructor
     *
     * @access public
     */
    Collapse.prototype.destruct = function() {
        for (var i = 0; i < this._nodes.length; i++) {
            Helper.removeEventListener(this._nodes[i], 'click', this._eventHandler);
        }
        this._nodes  = [];
    }

    /**
     * Handle the click event
     *
     * @param e event
     * @access private
     */
    Collapse.prototype._eventHandler = function(e) {
        e = e || window.event;
        if (Helper.isNodeType(this, 'a')) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        var clicked  = this;
        var targetEl = Helper.$('#'+clicked.dataset.collapseTarget);
        var speed    = parseInt(clicked.dataset.collapseSpeed) || 350;
        var easing   = clicked.dataset.collapseEasing || 'cubic-bezier(0.19, 1, 0.22, 1)';

        Container.get('ToggleHeight', targetEl, 0, speed, easing, false);
        Helper.toggleClass(clicked, 'active');
    }

    // Load into hubble DOM core
    Container.get('Hubble').dom().register('Collapse', Collapse);

}());
