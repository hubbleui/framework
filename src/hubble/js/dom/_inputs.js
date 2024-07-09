(function()
{
    /**
     * JS Helper reference
     * 
     * @var {object}
     */
    const Helper = Container.Helper();

    /**
     * Adds classes to inputs
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE}
     */
    class Inputs
    {
        /**
         * Module constructor
         *
         * @access {public}
         * @constructor
         */
    	constructor()
        {
            this._inputs = Helper.$All('.form-field input, .form-field select, .form-field textarea');
            this._labels = Helper.$All('.form-field label');

            if (!Helper.is_empty(this._inputs))
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

            this._inputs = [];
        }

        /**
         * Event binder
         *
         * @access {private}
         */
        _bind()
        {            
            Helper.addEventListener(this._labels, 'click', this._onLabelClick);
            Helper.addEventListener(this._inputs, 'click, focus, blur, change, input', this._eventHandler);
        }

        /**
         * Event ubinder
         *
         * @access {private}
         */
        _unbind()
        {
            Helper.removeEventListener(this._labels, 'click',  this._onLabelClick);
            Helper.removeEventListener(this._inputs, 'click, focus, blur, change, input', this._eventHandler);
        }

        /**
         * Event handler
         *
         * @access {private}
         * @params {event|null} e Browser click event
         */
        _onLabelClick(e)
        {
            e = e || window.event;

            var input = Helper.$('input', this.parentNode);

            if (Helper.in_dom(input))
            {
                input.focus();

                return;
            }

            var input = Helper.$('select', this.parentNode);

            if (Helper.in_dom(input))
            {
                input.focus();

                return;
            }

            var input = Helper.$('textarea', this.parentNode);

            if (Helper.in_dom(input))
            {
                input.focus();

                return;
            }
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

            var wrapper = Helper.closest(this, '.form-field');

            if (e.type === 'click')
            {
                this.focus();
            }
            else if (e.type === 'focus')
            {
                Helper.add_class(wrapper, 'focus');
            }
            else if (e.type === 'blur')
            {
                Helper.remove_class(wrapper, 'focus');
            }

            if (e.type === 'change' || e.type === 'input' || e.type === 'blur')
            {
                var _value = Helper.input_value(this);

                if (_value === '')
                {
                    Helper.remove_class(wrapper, 'not-empty');
                    Helper.add_class(wrapper, 'empty');
                }
                else
                {
                    Helper.remove_class(wrapper, 'empty');
                    Helper.add_class(wrapper, 'not-empty');
                }
            }
        }
    }

    // Load into Hubble DOM core
    Hubble.dom().register('Inputs', Inputs);

})();
