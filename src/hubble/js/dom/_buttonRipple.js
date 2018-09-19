/**
 * Button wave click effect
 *
 * @author    Joe J. Howard
 * @copyright Joe J. Howard
 * @license   https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE
 */

(function()
{
    /**
     * JS Helper reference
     * 
     * @var object
     */
    var Helper = Hubble.helper();

    /**
     * Module constructor
     *
     * @access public
     * @constructor
     */
    var ButtonRipple = function()
    {
        /**
         * List of click-triggers
         * 
         * @var array
         */
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
     * @access public
     */
    ButtonRipple.prototype.destruct = function()
    {
        this._unbind();

        this._containers = [];
    }

    /**
     * Event binder - Binds all events on button click
     *
     * @access private
     */
    ButtonRipple.prototype._bind = function()
    {
        for (var i = 0; i < this._containers.length; i++)
        {
            Helper.addEventListener(this._containers[i], 'click', this._eventHandler);
        }
    }

    /**
     * Event ubinder - Binds all event handlers on button click
     *
     * @access private
     */
    ButtonRipple.prototype._unbind = function()
    {
        for (var i = 0; i < this._containers.length; i++)
        {
            Helper.removeEventListener(this._containers[i], 'click', this._eventHandler);
        }
    }

    /**
     * Event handler - handles the wave effect
     *
     * @access private
     * @params event|null e Browser click event
     */
    ButtonRipple.prototype._eventHandler = function(e)
    {
        e = e || window.event;
        var container  = this;
        var wave       = document.createElement('span');
        wave.className = 'wave';
        container.appendChild(wave);

        var coords = Helper.getCoords(container);
        var size   = container.offsetWidth;
        var x      = e.pageX - coords.left - (container.offsetWidth / 2);
        var y      = e.pageY - coords.top - (container.offsetHeight * 1.3);
       
        Helper.css(wave, 
        {
            top: y + 'px',
            left: x + 'px',
            width: size + 'px',
            height: size + 'px'
        });

        Helper.addClass(wave, 'animate');

        setTimeout(function ()
        {
            container.removeChild(wave);

        }, 500);
    }

    // Load into Hubble DOM core
    Container.get('Hubble').dom().register('ButtonRipple', ButtonRipple);

})();
