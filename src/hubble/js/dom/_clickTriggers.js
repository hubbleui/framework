(function()
{
    /**
     * JS Helper reference
     * 
     * @var {object}
     */
    var Helper = Hubble.helper();

    /**
     * Clicking one element triggers a lick on another
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE}
     */
    class ClickTriggers
    {
        /**
         * Module constructor
         *
         * @access {public}
         * @constructor
         */
    	constructor()
        {
            /**
             * List of click-triggers
             * 
             * @var {array}
             */
            this._containers = Helper.$All('.js-click-trigger');

            if (!Helper.is_empty(this._containers))
            {
                this._bind();
            }

            return this;
        }

        /**
         * Module destructor - removes event listeners
         *
         * @access {public}
         */
        destruct()
        {
            this._unbind();

            this._containers = [];
        }

        /**
         * Event binder - Binds all events on button click
         *
         * @access {private}
         */
        _bind()
        {
            Helper.addEventListener(this._containers, 'click', this._eventHandler);
        }

        /**
         * Event ubinder - Binds all event handlers on button click
         *
         * @access {private}
         */
        _unbind()
        {
            Helper.removeEventListener(this._containers, 'click', this._eventHandler);
        }

        /**
         * Event handler
         *
         * @access {private}
         * @params {event|null} e Browser click event
         */
        _eventHandler(e)
        {
            e = e || window.event;

            if (Helper.is_node_type(this, 'a'))
            {
                e.preventDefault();
            }

            var clicked = this;
            var targetEl = Helper.$(clicked.dataset.clickTarget);

            if (Helper.in_dom(targetEl))
            {
                Helper.trigger_event(targetEl, 'click');
            }
        }
    }

    // Load into Hubble DOM core
    Hubble.dom().register('ClickTriggers', ClickTriggers);

})();
