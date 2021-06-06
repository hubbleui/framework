/**
 * Bottom nav
 *
 * @author    Joe J. Howard
 * @copyright Joe J. Howard
 * @license   https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE
 */
(function()
{
    /**
     * Helper instance
     * 
     * @var object
     */
    var Helper = Hubble.helper();

    /**
     * Module constructor
     *
     * @constructor
     * @access public
     */
    var BottomNav = function()
    {
        // Find nodes
        this._nav = Helper.$('.js-bottom-nav');

        if (Helper.nodeExists(this._nav))
        {
            this._bind();
        }

        return this;
    };

    /**
     * Show nav
     *
     * @access public
     */
    BottomNav.prototype.show = function()
    {
        if (Helper.nodeExists(this._nav))
        {
            Helper.addClass(this._nav, 'active');
        }
    }

    /**
     * Hide nav
     *
     * @access public
     */
    BottomNav.prototype.hide = function()
    {
        if (Helper.nodeExists(this._nav))
        {
            Helper.removeClass(this._nav, 'active');
        }
    }

    /**
     * Show nav
     *
     * @access public
     */
    BottomNav.prototype.state = function()
    {
        if (Helper.nodeExists(this._nav))
        {
            if (Helper.hasClass(this._nav, 'active'))
            {
                return 'show';
            }
        }

        return 'hide';
    }

    /**
     * Module destructor - unbinds click events
     *
     * @access public
     */
    BottomNav.prototype.destruct = function()
    {
        if (Helper.nodeExists(this._nav))
        {
            var links = Helper.$All('.btn', this._nav);

            Helper.removeEventListener(links, 'click', this._eventHandler);

            this._nav = null;
        }
    }

    /**
     * Bind click events on all button
     *
     * @access private
     */
    BottomNav.prototype._bind = function()
    {
        var links = Helper.$All('.btn', this._nav);

        Helper.addEventListener(links, 'click', this._eventHandler);
    }

    /**
     * Click event handler
     *
     * @param event|null e JavaScript click event
     * @access private
     */
    BottomNav.prototype._eventHandler = function(e)
    {
        e = e || window.event;

        e.preventDefault();

        if (Helper.hasClass(this, 'active'))
        {
            return;
        }

        Helper.removeClass(Helper.$('.js-bottom-nav .btn.active'), 'active');

        Helper.addClass(this, 'active');
    }

    // Load into Hubble DOM core
    Container.get('Hubble').dom().register('BottomNav', BottomNav);

})();
