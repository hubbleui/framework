/**
 * Material button wave component
 * 
 * This class manages the wave effect on material type buttons.
 */
(function() {

    /**
     * @var JSHelper
     */
    var Helper = Modules.require('JSHelper');

    /**
     * Module constructor
     *
     * @class
     * @constructor
     * @params null
     * @access public
     */
    var ButtonRipple = function() {

        /** @access private */
        this._containers = Helper.$All('.js-ripple');
        
        if (!Helper.empty(this._containers)) { 
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
    ButtonRipple.prototype.destruct = function() {
        this._unbind();
        this._containers = [];
    }

    /**
     * Bind click listener to containers
     *
     * @params null
     * @access private
     */
    ButtonRipple.prototype._bind = function() {
        for (var i = 0; i < this._containers.length; i++) {
            Helper.addEventListener(this._containers[i], 'click', this._invoke);
        }
    }

    /**
     * Unbind listener to containers
     *
     * @params null
     * @access private
     */
    ButtonRipple.prototype._unbind = function() {
        for (var i = 0; i < this._containers.length; i++) {
            Helper.removeEventListener(this._containers[i], 'click', this._invoke);
        }
    }

    /**
     * Click event handler
     *
     * @param e event
     * @access private
     */
    ButtonRipple.prototype._invoke = function(e) {
        e = e || window.event;
        var container  = this;
        var wave       = document.createElement('span');
        wave.className = 'wave';
        container.appendChild(wave);

        var coords = Helper.getCoords(container);
        var x      = e.pageX - coords.left - wave.offsetWidth / 2;
        var y      = e.pageY - coords.top - wave.offsetHeight / 2;
        var size   = container.offsetWidth;

        Helper.css(wave, {
            top: y + 'px',
            left: x + 'px',
            width: size + 'px',
            height: size + 'px'
        });
        Helper.addClass(wave, 'animate');
        setTimeout(function () {
            container.removeChild(wave);
        }, 500);
    }

    // Load into container and invoke
    Modules.singleton('ButtonRipple', ButtonRipple).require('ButtonRipple');

})();