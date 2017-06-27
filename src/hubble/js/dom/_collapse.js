/**
 * Toggle height on click
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
    var Collapse = function()
    {
        /**
         * Array of click-triggers
         * 
         * @var array
         */
        this._nodes = Helper.$All('.js-collapse');
                
        this._bind();
        
        return this;
    }

    /**
     * Module destructor
     *
     * @access public
     */
    Collapse.prototype.destruct = function()
    {
        this._unbind();

        this._nodes = [];
    }

    /**
     * Event binder - Binds all events on button click
     *
     * @access private
     */
    Collapse.prototype._bind = function()
    {
        for (var i = 0; i < this._nodes.length; i++)
        {
            Helper.addEventListener(this._nodes[i], 'click', this._eventHandler);
        }
    }

    /**
     * Event unbinder - Removes all events on button click
     *
     * @access private
     */
    Collapse.prototype._unbind = function()
    {
        for (var i = 0; i < this._nodes.length; i++)
        {
            Helper.removeEventListener(this._nodes[i], 'click', this._eventHandler);
        }
    }

    /**
     * Handle the click event
     *
     * @param event|null e JavaScript click event
     * @access private
     */
    Collapse.prototype._eventHandler = function(e)
    {
        e = e || window.event;

        if (Helper.isNodeType(this, 'a'))
        {
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

    // Load into Hubble DOM core
    Container.get('Hubble').dom().register('Collapse', Collapse);

}());
