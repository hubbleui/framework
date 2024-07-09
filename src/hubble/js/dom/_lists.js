(function()
{
    const [$, $All, addEventListener, removeEventListener, has_class, add_class, remove_class, closest, trigger_event] = Container.import(['$', '$All', 'addEventListener', 'removeEventListener', 'has_class', 'add_class', 'remove_class', 'closest', 'trigger_event']).from('Helper');

    /**
     * Toggle active on lists
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE}
     */
    class Lists
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
             * Array of click-triggers
             * 
             * @var {array}
             */
            this._nodes = $All('.js-select-list > li');

            this._bind();

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

            this._nodes = [];
        }

        /**
         * Event binder - Binds all events on button click
         *
         * @access {private}
         */
        _bind()
        {            
            addEventListener(this._nodes, 'click', this._eventHandler);
        }

        /**
         * Event unbinder - Removes all events on button click
         *
         * @access {private}
         */
        _unbind()
        {
            removeEventListener(this._nodes, 'click', this._eventHandler);
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
            
            if (has_class(this, 'selected')) return;

            var list = closest(this, '.js-select-list');

            remove_class($('li.selected', list), 'selected');
            
            add_class(this, 'selected');

            trigger_event(list, 'list:selected', {item: this});
        }
    }

    // Load into Hubble DOM core
    Hubble.dom().register('Lists', Lists);

}());
