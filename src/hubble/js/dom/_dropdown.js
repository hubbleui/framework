(function()
{
    /**
     * JS Helper reference
     * 
     * @var object
     */
    var Helper = Hubble.helper();

    /**
     * Dropdown Buttons
     *
     * @author    Joe J. Howard
     * @copyright Joe J. Howard
     * @license   https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE
     */
    class DropDowns
    {
        /**
         * Module constructor
         *
         * @access public
         */
        constructor()
        {
            this._triggers = Helper.$All('.js-drop-trigger');

            if (!Helper.empty(this._triggers))
            {
                this._bind();
            }
        }
 
        /**
         * Module destructor
         *
         * @access public
         */
        destruct()
        {
            this._unbind();
            
            this._triggers = [];
        }

        /**
         * Bind click listener to containers
         *
         * @access private
         */
        _bind()
        {
            Helper.addEventListener(this._triggers, 'click', this._clickHandler);

            Helper.addEventListener(window, 'click', this._windowClick);
        }

        /**
         * Unbind listener to containers
         *
         * @access private
         */
        _unbind()
        {
            Helper.removeEventListener(this._triggers, 'click', this._clickHandler);

            Helper.removeEventListener(window, 'click', this._windowClick);
        }

        /**
         * Click event handler
         *
         * @param  event|null e JavaScript Click event
         * @access private
         */
        _clickHandler(e)
        {
            e = e || window.event;
            e.preventDefault();

            var button = this;
            var _this = Container.get('DropDowns');

            // Hide all dropdowns except this
            _this._hideDropDowns(button);

            // Remove active and return
            if (Helper.hasClass(button, 'active'))
            {
                _this._hideDrop(button);
            }
            else
            {
                _this._showDrop(button);
            }
        }

        /**
         * Click event handler
         *
         * @param  event|null e JavaScript Click event
         * @access private
         */
        _hideDrop(button)
        {
            var drop = Helper.$('.drop-menu', button.parentNode);
            Helper.removeClass(button, 'active');
            button.setAttribute('aria-pressed', 'false');
            Helper.hideAria(drop);
            drop.blur();
        }

        /**
         * Click event handler
         *
         * @param  event|null e JavaScript Click event
         * @access private
         */
        _showDrop(button)
        {
            var drop = Helper.$('.drop-menu', button.parentNode);
            Helper.addClass(button, 'active');
            button.setAttribute('aria-pressed', 'true');
            Helper.showAria(drop);
            drop.focus();
        }

        /**
         * Window click event
         *
         * @param event|null e JavaScript click event
         * @access private
         */
        _windowClick(e)
        {
            e = e || window.event;
            if (Helper.closest(e.target, '.js-drop-trigger'))
            {
                return;
            }
            if (!Helper.hasClass(e.target, 'js-drop-trigger'))
            {
                var _this = Container.get('DropDowns');

                _this._hideDropDowns();
            }
        }

        /**
         * Hide all dropdowns
         *
         * @param exception (optional) Button to skip
         * @access private
         */
        _hideDropDowns(exception)
        {
            var dropTriggers = Helper.$All('.js-drop-trigger');
            var exception = (typeof exception === 'undefined' ? false : exception);

            for (var i = 0; i < dropTriggers.length; i++)
            {
                var node = dropTriggers[i];

                if (node === exception)
                {
                    continue;
                }

                this._hideDrop(node);
            }
        }
    }

    // Load into Hubble DOM core
    Container.get('Hubble').dom().register('DropDowns', DropDowns);

})();
