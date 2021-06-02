/**
 * Pjax Links Module
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
     * Bool val 
     * 
     * @var function
     */
    function boolval(l)
    {
        return !1 !== l && ("false" !== l && (0 !== l && 0 !== l && ("" !== l && "0" !== l && ((!Array.isArray(l) || 0 !== l.length) && (null !== l && void 0 !== l)))))
    }

    /**
     * Module constructor
     *
     * @access public
     * @constructor
     */
    var PjaxLinks = function()
    {
        this._nodes = Helper.$All('.js-pjax-link');

        if (!Helper.empty(this._nodes))
        {
            this._bind();
        }

        return this;
    }

    /**
     * Module destructor
     *
     * @access public
     */
    PjaxLinks.prototype.destruct = function()
    {
        this._unbind();
    }

    /**
     * Event binder - Binds all events on node click
     *
     * @access private
     */
    PjaxLinks.prototype._bind = function()
    {
        for (var i = 0; i < this._nodes.length; i++)
        {
            Helper.addEventListener(this._nodes[i], 'click', this._eventHandler, false);
        }
    }

    /**
     * Event unbinder - Removes all events on node click
     *
     * @access private
     */
    PjaxLinks.prototype._unbind = function()
    {
        for (var i = 0; i < this._nodes.length; i++)
        {
            Helper.removeEventListener(this._nodes[i], 'click', this._eventHandler, false);
        }
    }

    /**
     * Handle the click event
     *
     * @param event|null e JavaScript click event
     * @access private
     */
    PjaxLinks.prototype._eventHandler = function(e)
    {
        e = e || window.event;

        e.preventDefault();

        var trigger = this;
        var href = trigger.dataset.pjaxHref;
        var target = trigger.dataset.pjaxTarget;
        var title = trigger.dataset.pjaxTitle || false;
        var stateChange = boolval(trigger.dataset.pjaxStateChange);
        var singleRequest = boolval(trigger.dataset.pjaxSingleRequest);

        Hubble.require('Pjax').invoke(href, target, title, stateChange, singleRequest);
    }

    // Load into Hubble DOM core
    Container.get('Hubble').dom().register('PjaxLinks', PjaxLinks);

}());
