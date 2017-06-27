/**
 * Button ripple
 *
 * This module handles the 'wave' effect on click events.
 *
 */
(function() {

    /**
     * @var Helper
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
    var ButtonRipple = function() {
        
        /** @access private */
        this._containers = Helper.$All('.js-ripple');
        
        if (!Helper.empty(this._containers))
        {
            this._bind();
        }

        return this;
    };

    /**
     * Module destructor - removes event listeners
     *
     * @constructor
     * @params null
     * @access public
     */
    ButtonRipple.prototype.destruct = function() {
        this._unbind();
        this._containers = [];
    }

    /**
     * Event binder - Binds all events on button click
     *
     * @params null
     * @access private
     */
    ButtonRipple.prototype._bind = function() {

        for (var i = 0; i < this._containers.length; i++) {
            Helper.addEventListener(this._containers[i], 'click', this._eventHandler);
        }
    }

    /**
     * Event ubinder - Binds all event handlers on button click
     *
     * @params null
     * @access private
     */
    ButtonRipple.prototype._unbind = function() {
        for (var i = 0; i < this._containers.length; i++) {
            Helper.removeEventListener(this._containers[i], 'click', this._eventHandler);
        }
    }

    /**
     * Event handler - handles the wave
     *
     * @params e event
     * @access private
     */
    ButtonRipple.prototype._eventHandler = function(e) {
        e = e || window.event;
        var container  = this;
        var wave       = document.createElement('span');
        wave.className = 'wave';
        container.appendChild(wave);

        var coords = Helper.getCoords(container);
        var size   = container.offsetWidth;
        var x      = e.pageX - coords.left - (container.offsetWidth / 2);
        var y      = e.pageY - coords.top - (container.offsetHeight * 1.3);
       

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

    // Load into Hubble core
    Container.get('Hubble').dom().register('ButtonRipple', ButtonRipple);

})();