(function()
{
    /**
     * Helper instance
     * 
     * @var {object}
     */
    const Helper = Container.Helper();

    /**
     * Message closers
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE}
     */
    class MessageClosers
    {
        /**
         * Module constructor
         *
         * @constructor
         {*} @access public
         */
        constructor()
        {
            this._triggers = Helper.$All('.js-close-msg');

            if (!Helper.is_empty(this._triggers))
            {
                this._bind();
            }

            return this;
        }

        /**
         * Module destructor - removes event listeners
         *
         * @constructor
         {*} @access public
         */
        destruct()
        {
            this._unbind();

            this._triggers = [];
        }

        /**
         * Event binder - Binds all events on button click
         *
         * @access {private}
         */
        _bind()
        {
            Helper.addEventListener(this._triggers, 'click', this._eventHandler);
        }

        /**
         * Event ubinder - Binds all event handlers on button click
         *
         * @access {private}
         */
        _unbind()
        {
            Helper.removeEventListener(this._triggers, 'click', this._eventHandler);
        }

        /**
         * Event handler - handles removing the message
         *
         * @param  {event}   e JavaScript click event
         * @access {private}
         */
        _eventHandler(e)
        {
            e = e || window.event;

            e.preventDefault();

            var toRemove = Helper.closest(this, '.msg');

            if (Helper.has_class(this, 'js-rmv-parent'))
            {
                toRemove = toRemove.parentNode;
            }

            Helper.animate_css(toRemove, { opacity: 0, duration: 500, easing: 'easeInOutCubic', callback: function()
            {                
                Helper.remove_from_dom(toRemove);
            }});
        }
    }

    // Load into Hubble DOM core
    Hubble.dom().register('MessageClosers', MessageClosers);

})();
