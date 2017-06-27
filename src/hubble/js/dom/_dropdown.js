/**
 * Dropdown buttons
 * 
 * This class manages the click events for dropdown buttons
 */
(function() {

    /**
     * @var JSHelper
     */
    var Helper = Container.get('JSHelper');

    /**
     * Module constructor
     *
     * @class
     * @constructor
     * @params null
     * @access public
     */
    var DropDowns = function() {

        /** @access private */
        this._triggers = Helper.$All('.js-drop-trigger');

        if (!Helper.empty(this._triggers)) { 
            this._bind();
        }

        return this;
    };

    /**
     * Module destructor
     *
     * @params null
     * @access public
     */
    DropDowns.prototype.destruct = function() {
        this._unbind();
        this._triggers = [];
    }

    /**
     * Bind click listener to containers
     *
     * @params null
     * @access private
     */
    DropDowns.prototype._bind = function() {
        for (var i = 0; i < this._triggers.length; i++) {
            Helper.addEventListener(this._triggers[i], 'click', this._invoke);
        }
        Helper.addEventListener(window, 'click', this._windowClick);
    }

    /**
     * Unbind listener to containers
     *
     * @params null
     * @access private
     */
    DropDowns.prototype._unbind = function() {
        for (var i = 0; i < this._triggers.length; i++) {
            Helper.removeEventListener(this._triggers[i], 'click', this._invoke);
        }
        Helper.removeEventListener(window, 'click', this._windowClick);
    }

    /**
     * Click event handler
     *
     * @param e event
     * @access private
     */
    DropDowns.prototype._invoke = function(e) {
        e = e || window.event;
        e.preventDefault();
        e.stopPropagation();
        var button   = this;
        var _this    = Container.get('DropDowns');

        // Hide all dropdowns except this
        _this._hideDropDowns(button);

        // Remove active and return
        if (Helper.hasClass(button, 'active')) return Helper.removeClass(button, 'active');

        // Add active
        Helper.addClass(button, 'active');
    }

    /**
     * Window click event
     *
     * @param e event
     * @access private
     */
    DropDowns.prototype._windowClick = function(e) {
        e = e || window.event;
        e.stopPropagation();
        if (!Helper.hasClass(e.target, 'js-drop-trigger')) {
            var _this = Container.get('DropDowns');
            _this._hideDropDowns();
        }
    }

    /**
     * Hide all dropdowns
     *
     * @param exception (optional) Button to skip
     * @access private
     */
    DropDowns.prototype._hideDropDowns = function(exception) {
        dropTriggers = Helper.$All('.js-drop-trigger');
        exception    = (typeof exception === 'undefined' ? false : exception);
        for (var i = 0; i < dropTriggers.length; i++) {
            var node = dropTriggers[i];
            if (node === exception) continue;
            Helper.removeClass(node, 'active');
        }
    }

    // Load into hubble DOM core
    Container.get('Hubble').dom().register('DropDowns', DropDowns);

})();