/**
 * Modal
 *
 * The Modal class is a utility class used to
 * display a Backdrop.
 *
 */
(function()
{
    /**
     * @var {obj}
     */
    const [$, $All, add_class, addEventListener, animate, array_merge, css, each, in_dom, is_empty, is_object, remove_class, removeEventListener] = Container.import(['$', '$All', 'add_class', 'addEventListener', 'animate', 'array_merge', 'css', 'each', 'in_dom', 'is_empty', 'is_object', 'remove_class', 'removeEventListener']).from('Helper');

    /**
     * Cached so we can throttle later.
     * 
     * @var {function}
     */
    const RESIZE_HANDLER = throttle(function() { Container.Backdrop().resize() }, 100);

    /**
     * @var {obj}
     */
    var BACKDROP_OPEN = false;

    /**
     * @var {obj}
     */
    const DEFAULTS =
    {
        noScroll:          true,
        pushBody:          false,
        direction:         'top',
        height:            'auto',
        width:             '100%',

        onOpen:            () => { },
        onOpenArgs:        null,
        onClose:           () => { },
        onCloseArgs:       null,
        validateClose:     () => { return true; },
        validateCloseArgs: null
    };

    class Backdrop
    {
        /**
         * Module constructor
         *
         * @class
         * @constructor
         * @params {options} obj
         * @access {public}
         * @return {this}
         */
        constructor()
        {
            this._DOMElementopenBtns  = $All('.js-backdrop-open-trigger');
            this._DOMElementCloseBtns = $All('.js-backdrop-close-trigger');
            this._DOMElementBackdrop  = $('.js-backdrop-wrapper');
            this._DOMElementPageWrap  = $('.js-backdrop-page-wrapper');
            
            if (!is_empty(this._DOMElementopenBtns))
            {
                this._bind();
            }

            this._setOptions();
        }

        /**
         * Module destructor
         *
         * @access {public}
         */
        destruct()
        {
            this.close();

            this._unbind();

            this._DOMElementopenBtns = [];

            this._DOMElementCloseBtns = [];
        }

        /**
         * Bind click listener to containers
         *
         * @access {private}
         */
        _bind()
        {
            addEventListener(this._DOMElementopenBtns, 'click', this._clickHandler);

            addEventListener(this._DOMElementCloseBtns, 'click', this.close);
        }

        /**
         * Unbind listener to containers
         *
         * @access {private}
         */
        _unbind()
        {
            removeEventListener(this._DOMElementopenBtns, 'click', this._clickHandler);

            removeEventListener(this._DOMElementCloseBtns, 'click', this.close);

            removeEventListener(window, 'resize', RESIZE_HANDLER);

            this._DOMElementopenBtns = [];

            this._DOMElementCloseBtns = [];
        }

        /**
         * Open the backdrop.
         *
         * @access {public}
         * @param  {object} options Options (optional)
         */
        open(options)
        {
            const DOMElementBackdrop = this._DOMElementBackdrop;
            const DOMElementPageWrap = this._DOMElementPageWrap;

            if (!in_dom(this._DOMElementBackdrop))
            {
                console.error('Backdrop Error: The backdrop wrapper was not found in the DOM.');
            }
            else if (!in_dom(this._DOMElementPageWrap))
            {
                console.error('Backdrop Error: The backdrop page wrapper was not found in the DOM.');
            }
            else if (BACKDROP_OPEN)
            {
                return;
            }

            // Backdrop now open
            BACKDROP_OPEN = true;

            // Merge options if provided
            if (options) this._setOptions(options);

            // Set width and heights
            css(DOMElementBackdrop, 'height', this.height);
            css(DOMElementBackdrop, 'width', this.width);

            // Push body down
            /*if (this.pushBody)
            {
                add_class(this._DOMElementBackdrop, 'backdrop-open');
                add_class(this._DOMElementBackdrop, 'backdrop-push-body');

                animate_css(this._DOMElementBackdrop, { top: '0px', duration: 300 });
                animate_css(this._DOMElementPageWrap, { transform: `translateY(${fromTop})`, duration: 300 });
            }*/

            // Set backdrop to position top, left, bottom, right

            // Push backdrop in
            animate(DOMElementBackdrop, { 
                [this.direction]: { from: '-50px', to: '0px', duration: 350, easing: 'easeOutCirc'},
                opacity:          { from: '0', to: '1', duration: 600, easing: 'easeOutCirc'}
            });

            // Make backdrop visible
            setTimeout(function(){ add_class(DOMElementBackdrop, 'backdrop-open');}, 10);
        
            // No scrolling
            if (this.noScroll)
            {
                add_class([document.documentElement, document.body], 'no-scroll');
            }

            /*
           

            // Open classes
            add_class(this._DOMElementBackdrop, 'backdrop-open');
            add_class(this._DOMElementPageWrap, 'backdrop-open');

            // Resize handler
            addEventListener(window, 'resize', RESIZE_HANDLER);*/
            
            this._fireOpen();
        }

        /**
         * Close the backdrop.
         *
         * @access {public}
         * @param  {object} options Options (optional)
         */
        close()
        {
            if (this.pushBody)
            {
                /*animate_css(this._DOMElementBackdrop, { transform: `translateY(0)`});
                animate_css(this._DOMElementPageWrap, { transform: `translateY(0)`});*/
            }
            else
            {

            }

            /*remove_class(this._DOMElementBackdrop, ['backdrop-push-body', 'backdrop-open']);
            remove_class(this._DOMElementPageWrap, 'backdrop-open');
            remove_class([document.documentElement, document.body], 'no-scroll');*/

            if (this._fireValidateClose())
            {
                this._fireClose();

                BACKDROP_OPEN = false;
            }
        }

        /**
         * Update the the sizing
         *
         */
        resize()
        {
            if (this.pushBody)
            {
                //css(this._DOMElementPageWrap, 'transform', `translateY(${height(this._DOMElementBackdrop)}px)`);
            }
        }

        /**
         * Set options from open/close call.
         *
         * @access {private}
         * @param  {object} options Options (optional)
         */
        _setOptions(options)
        {
            options = is_object(options) ? array_merge({}, DEFAULTS, options) : array_merge({}, DEFAULTS);

            each(options, function(k, v)
            {
                this[k] = v;

            }, this);

        }

        /**
         * Fire render event
         *
         * @access {private}
         */
        _fireOpen()
        {
            this.onOpen.apply(this._DOMElementBackdrop, this.onOpenArgs);
        }

        /**
         * Fire the closed event
         *
         * @access {private}
         */
        _fireClose()
        {
            this.onClose.apply(this._DOMElementBackdrop, this.onCloseArgs);
        }

        /**
         * Fire the confirm validation
         *
         * @access {private}
         */
        _fireValidateClose()
        {
            return this.validateClose.apply(this._DOMElementBackdrop, this.validateCloseArgs);
        }
    }

    // Load into container 
    Hubble.dom().register('Backdrop', Backdrop);

    /*window.addEventListener('DOMReady', function()
    {
        setTimeout(function()
        {
            Container.Backdrop().open();

        }, 1000);
    });*/

   /* setTimeout(function()
    {
        Container.Backdrop().close();
    }, 5000);*/

})();
