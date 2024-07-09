(function()
{
    const [$, $All, addEventListener, animate_css, bool, has_class, is_node_type, removeEventListener, toggle_class, trigger_event] = Container.import(['$','$All','addEventListener','animate_css','bool','has_class','is_node_type','removeEventListener','toggle_class','trigger_event']).from('Helper');

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
            this._nodes = $All('.js-collapse');

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

            if (is_node_type(this, 'a'))
            {
                e.preventDefault();
            }

            var clicked  = this;
            var targetEl = $('#' + clicked.dataset.collapseTarget);
            var duration = parseInt(clicked.dataset.collapseSpeed) || 350;
            var easing   = clicked.dataset.collapseEasing || 'easeOutExpo';
            var opacity  = bool(clicked.dataset.withOpacity);
            var closing  = has_class(clicked, 'active');

            trigger_event(targetEl, 'collapse:toggle', closing ? 'close' : 'open');

            var options  = 
            {
                property: 'height',
                to: closing ? '0px' : 'auto',
                from: closing ? 'auto' : '0px',
                duration: duration, 
                easing: easing,
                callback: () => { trigger_event(targetEl, 'collapse:toggled', closing ? 'close' : 'open'); }
            };

            animate_css(targetEl, options);
            toggle_class(clicked, 'active');
        }
    }

    // Load into Hubble DOM core
    Hubble.dom().register('Collapse', Collapse);

}());
