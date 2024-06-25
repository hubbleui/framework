(function()
{
    /**
     * JS Helper reference
     * 
     * @var {object}
     */
    const Helper = Container.Helper();

    /**
     * Popovers
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE}
     */
    class Popovers
    {
        /**
         * Module constructor
         *
         * @access {public}
         * @constructor
         */
    	constructor()
        {
            this._pops = [];
            this._nodes = [];

            // Find nodes
            this._nodes = Helper.$All('.js-popover');

            // Bind events
            if (!Helper.is_empty(this._nodes))
            {
                for (var i = 0; i < this._nodes.length; i++)
                {
                    this._bind(this._nodes[i]);
                }

                this._addWindowClickEvent();
            }

            return this;
        }

        /**
         * Module destructor
         *
         * @access {public}
         * @return {this}
         */
        destruct()
        {
            if (!Helper.is_empty(this._nodes))
            {
                for (var i = 0; i < this._nodes.length; i++)
                {
                    this._unbind(this._nodes[i]);
                }
            }

            this._removeAll();

            this._nodes = [];

            this._pops = [];
        }

        /**
         * Unbind event listeners on a trigger
         *
         * @param {trigger} node
         * @access {private}
         */
        _unbind(trigger)
        {
            var evnt = trigger.dataset.popoverEvent;

            if (evnt === 'click')
            {
                Helper.removeEventListener(trigger, 'click', this._clickHandler);
                window.removeEventListener('resize', this._windowResize);
            }
            else
            {
                Helper.removeEventListener(trigger, 'mouseenter', this._hoverOver);
                Helper.removeEventListener(trigger, 'mouseleave', this._hoverLeavTimeout);
            }
        }

        /**
         * Initialize the handlers on a trigger
         *
         * @access {private}
         * @param  {node} trigger Click/hover trigger
         */
        _bind(trigger)
        {
            var direction = trigger.dataset.popoverDirection;
            var title = trigger.dataset.popoverTitle;
            var theme = trigger.dataset.popoverTheme || 'dark';
            var content = trigger.dataset.popoverContent;
            var evnt = trigger.dataset.popoverEvent;
            var animation = trigger.dataset.popoverAnimate || 'pop';
            var target = trigger.dataset.popoverTarget;
            var closeBtn = evnt === 'click' ? '<button type="button" class="btn btn-sm btn-pure btn-circle js-remove-pop close-btn"><span class="glyph-icon glyph-icon-cross3"></span></button>' : '';
            var pop = '<div class="popover-content"><p>' + content + '</p></div>';


            if (title)
            {
                pop = closeBtn + '<h5 class="popover-title">' + title + '</h5>' + pop;
            }

            if (target)
            {
                pop = Helper.$('#' + target).cloneNode(true);
                pop.classList.remove('hidden');
            }

            var popHandler = Container.get('_popHandler',
            {
                target: trigger,
                direction: direction,
                template: pop,
                animation: animation,
                classes: 'popover ' + direction + ' ' + theme,
            });

            this._pops.push(popHandler);

            if (evnt === 'click')
            {
                Helper.addEventListener(trigger, 'click', this._clickHandler);
                window.addEventListener('resize', this._windowResize);
            }
            else
            {
                var _this = this;
                Helper.addEventListener(trigger, 'mouseenter', this._hoverOver);
                Helper.addEventListener(trigger, 'mouseleave', this._hoverLeavTimeout);
            }
        }

        /**
         * Timeout handler for hoverleave
         *
         * @access {private}
         */
        _hoverLeavTimeout(e)
        {
            e = e || window.event;
            setTimeout(function()
            {
                Container.get('Popovers')._hoverLeave(e);
            }, 300);
        }

        /**
         * Hover over event handler
         *
         * @access {private}
         */
        _hoverOver()
        {
            var trigger = this;
            var _this = Container.get('Popovers');
            var popHandler = _this._getHandler(trigger);
            if (Helper.has_class(trigger, 'popped')) return;
            popHandler.render();
            Helper.add_class(trigger, 'popped');
        }

        /**
         * Hover leave event handler
         *
         * @access {private}
         */
        _hoverLeave(e)
        {
            var _this = Container.get('Popovers');
            var hovers = Helper.$All(':hover');
            for (var i = 0; i < hovers.length; i++)
            {
                if (Helper.has_class(hovers[i], 'popover'))
                {
                    hovers[i].addEventListener('mouseleave', function(_e)
                    {
                        _e = _e || window.event;
                        _this._hoverLeave(_e);
                    });
                    return;
                }
            }

            _this._removeAll();
        }

        /**
         * Window resize event handler
         *
         * @access {private}
         */
        _windowResize()
        {
            var _this = Container.get('Popovers');

            for (var i = 0; i < _this._nodes.length; i++)
            {
                if (Helper.has_class(_this._nodes[i], 'popped'))
                {
                    var popHandler = _this._getHandler(_this._nodes[i]);
                    popHandler.stylePop();
                }
            }
        }

        /**
         * Click event handler
         *
         * @param {event|null} e JavaScript click event
         * @access {private}
         */
        _clickHandler(e)
        {
            e = e || window.event;
            e.preventDefault();
            var trigger = this;
            var _this = Container.get('Popovers');
            var popHandler = _this._getHandler(trigger);

            if (Helper.has_class(trigger, 'popped'))
            {
                _this._removeAll();
                popHandler.remove();
                Helper.remove_class(trigger, 'popped');
            }
            else
            {
                _this._removeAll();
                popHandler.render();
                Helper.add_class(trigger, 'popped');
            }
        }

        /**
         * Remove all popovers when anything is clicked
         *
         * @access {private}
         */
        _addWindowClickEvent()
        {
            var _this = this;

            window.addEventListener('click', function(e)
            {
                e = e || window.event;
                var clicked = e.target;

                // Clicked the close button
                if (Helper.has_class(clicked, 'js-remove-pop') || Helper.closest(clicked, '.js-remove-pop'))
                {
                    _this._removeAll();

                    return;
                }

                // Clicked inside the popover
                if (Helper.has_class(clicked, 'popover') || Helper.closest(clicked, '.popover'))
                {
                    return;
                }

                // Clicked a popover trigger
                if (Helper.has_class(clicked, 'js-popover') || Helper.closest(clicked, '.js-popover'))
                {
                    return;
                }

                _this._removeAll();
            });
        }

        /**
         * Get the handler for the trigger
         * 
         * @access {private}
         * @param  {node}    trigger DOM node that triggered event
         * @return {object|false}
         */
        _getHandler(trigger)
        {
            for (var i = 0; i < this._pops.length; i++)
            {
                if (this._pops[i]['trigger'] === trigger) return this._pops[i];
            }

            return false;
        }

        /**
         * Remove all the popovers currently being displayed
         *
         * @access {private}
         */
        _removeAll()
        {
            for (var i = 0; i < this._pops.length; i++)
            {
                this._pops[i].remove();

                Helper.remove_class(this._pops[i].options.target, 'popped');
            }
        }
    }

    // Load into Hubble DOM core
    Hubble.dom().register('Popovers', Popovers);

}());
