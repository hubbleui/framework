(function()
{
    /**
     * JS Helper reference
     * 
     * @var {object}
     */
    var Helper = Hubble.helper();

    /**
     * Toggle height on click
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE}
     */
    class Collapse
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
            this._nodes = Helper.$All('.js-collapse');

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
            Helper.addEventListener(this._nodes, 'click', this._eventHandler);
        }

        /**
         * Event unbinder - Removes all events on button click
         *
         * @access {private}
         */
        _unbind()
        {
            Helper.removeEventListener(this._nodes, 'click', this._eventHandler);
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

            if (Helper.is_node_type(this, 'a'))
            {
                e.preventDefault();
            }

            var clicked  = this;
            var targetEl = Helper.$('#' + clicked.dataset.collapseTarget);
            var duration = parseInt(clicked.dataset.collapseSpeed) || 350;
            var easing   = clicked.dataset.collapseEasing || 'easeOutExpo';
            var opacity  = Helper.bool(clicked.dataset.withOpacity);
            var options  = 
            {
                height: Helper.has_class(clicked, 'active') ? '0px' : 'auto',
                duration: duration, 
                easing: easing
            };

            if (opacity)
            {
                options.opacity = Helper.has_class(clicked, 'active') ? '0' : '1';
            }

            Helper.animate(targetEl, options);
            Helper.toggle_class(clicked, 'active');
        }
    }

    // Load into Hubble DOM core
    Hubble.dom().register('Collapse', Collapse);

}());
