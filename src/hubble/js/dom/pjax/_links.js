(function()
{
    /**
     * JS Helper reference
     * 
     * @var {object}
     */
    var Helper = Hubble.helper();
    
    /**
     * Pjax Links Module
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE}
     */
    class PjaxLinks
    {
        /**
         * Module constructor
         *
         * @access {public}
         * @constructor
         */
    	constructor()
        {
            this._nodes = Helper.$All('.js-pjax-link');

            if (!Helper.is_empty(this._nodes))
            {
                this._bind();
            }

            return this;
        }

        /**
         * Module destructor
         *
         * @access {public}
         */
        destruct()
        {
            this._unbind();
        }

        /**
         * Event binder - Binds all events on node click
         *
         * @access {private}
         */
        _bind()
        {
            Helper.addEventListener(this._nodes, 'click', this._eventHandler, false);
        }

        /**
         * Event unbinder - Removes all events on node click
         *
         * @access {private}
         */
        _unbind()
        {
            Helper.removeEventListener(this._nodes, 'click', this._eventHandler, false);
        }

        /**
         * Handle the click event
         *
         * @param {event|null} e JavaScript click event
         * @access {private}
         */
        _eventHandler(e)
        {
            e = e || window.event;

            e.preventDefault();

            var trigger = this;
            var href = trigger.dataset.pjaxHref;
            var target = trigger.dataset.pjaxTarget;
            var title = trigger.dataset.pjaxTitle || false;
            var stateChange = Helper.bool(trigger.dataset.pjaxStateChange);
            var singleRequest = Helper.bool(trigger.dataset.pjaxSingleRequest);

            Hubble.require('Pjax').invoke(href, target, title, stateChange, singleRequest);
        }
    }

    // Load into Hubble DOM core
    Hubble.dom().register('PjaxLinks', PjaxLinks);

}());
