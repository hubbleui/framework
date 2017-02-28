(function() {

    // REQUIRES
    /*****************************************/
    var Helper = Modules.require('JSHelper');

    // MODULE OBJECT
    /*****************************************/
    var Collapse = function() {
        
        this._nodes = [];
        
        this.__construct();
        
        return this;
    }

    // CONSTRUCTOR
    /*****************************************/
    Collapse.prototype.__construct = function() {

        if (Helper === 'null') Helper = Modules.require('JSHelper');

        this._nodes = Helper.$All('.js-collapse');

        if (!this._nodes.length) {
            this.destruct();
            return;
        }
        for (var i = 0; i < this._nodes.length; i++) {
            this._bind(this._nodes[i]);
        }
        
    }

    // DESTRUCTOR
    /*****************************************/
    Collapse.prototype.destruct = function() {
        for (var i = 0; i < this._nodes.length; i++) {
            this._unbind(this._nodes[i]);
        }
        this._nodes  = [];
        Helper       = 'null';
    }

    // BINDER
    /*****************************************/
    Collapse.prototype._bind = function(node) {
        Helper.addEventListener(node, 'click', this._invoke);
    }

    // UNBINDER
    /*****************************************/
    Collapse.prototype._unbind = function(node) {
       Helper.removeEventListener(node, 'click', this._invoke);
    }

    // EVENT HANDLER
    /*****************************************/
    Collapse.prototype._invoke = function(e) {
        e = e || window.event;
        if (Helper.isNodeType(this, 'a')) {
            e.preventDefault();
            e.stopPropagation();
        }
        

        var clicked  = this;
        var targetEl = Helper.$('#'+clicked.dataset.collapseTarget);
        var speed    = parseInt(clicked.dataset.collapseSpeed) || 350;
        var easing   = clicked.dataset.collapseEasing || 'cubic-bezier(0.19, 1, 0.22, 1)';

        Modules.require('ToggleHeight', targetEl, 0, speed, easing, false);
        Helper.toggleClass(clicked, 'active');
    }

    // PUSH TO MODULES AND INVOKE
    /*****************************************/
    Modules.singleton('Collapse', Collapse).require('Collapse');

}());
