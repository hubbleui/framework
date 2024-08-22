/**
 * drawer
 *
 * The drawer class is a utility class used to
 * display a drawer.
 *
 */
(function()
{
    /**
     * Helper functions
     * 
     * @var {Function}
     */
    const [find, find_all, each, dom_element, add_class, toggle_class, on, has_class, remove_class, remove_from_dom, css, height, preapend] = Hubble.import(['find','find_all','each','dom_element','add_class','toggle_class','on','has_class','remove_class','remove_from_dom', 'css', 'height', 'preapend']).from('_');

    /**
     * Default options
     * 
     * @var {obj}
     */
    var DEFAULT_OPTIONS =
    {
        // Content - can be a node, nodelist, or string of HTML
        content: '',
        
        // Overlay color - dark, light, none,
        overlay: 'dark',

        // When true allows swiping on screen to hide/show
        swipeable: false,

        // When keepEdge is true, the default state to set "expanded"|"collapsed"
        state: 'expanded',

        // Where the drawer comes from - left,right,top,bottom
        direction: 'left',

        // Collapses to icon size
        peekable: false,

        // Push body
        pushBody: false,

        // State callbacks
        callbackBuilt:    () => { },
        callbackRender:   () => { },
        callbackConfirm:  () => { },
        callbackClose:    () => { },
        callbackOpen:     () => { },
        callbackValidate: () => true,
    };

    /**
     * Closing arrow icons.
     * 
     * @var {obj}
     */
    const PUSH_ARROWS =
    {
        left: 'left',
        right: 'right',
        top: 'up',
        bottom: 'down'
    };

    /**
     * Swipe open/close directions.
     * 
     * @var {obj}
     */
    const SWIPE_DIRECTIONS =
    {
        left: ['swiperight', 'swipeleft'],
        right: ['swipeleft', 'swiperight'],
        top:  ['swipedown', 'swipeup'],
        bottom: ['swipeup', 'swipedown'],
    };

    /**
     * Module constructor
     *
     * @class
     * @params {options} obj
     * @access {public}
     * @return {this}
     */
    const Drawer = function(options)
    { 
        // Merge options
        this._options = {...DEFAULT_OPTIONS, ...options};

        if (!SWIPE_DIRECTIONS[this._options.direction]) throw new Error('Unsupported direction.');

        // Save state
        this._state = this._options.state;

        // Animating
        this._animating = false;

        // State timer
        this._stateTimer = null;

        // Build the drawer
        this._build();

        // Render the drawer        
        this._mount();

        // Add listeners
        this._bindListeners();

        return this;
    }

    /**
     * Destroy
     *
     * @access {public}
     */
    Drawer.prototype.destroy = function()
    {        
        this.close();

        this._gestures.destroy();

        this._containerWrap

        remove_from_dom(this._drawer);

        remove_from_dom(this._overlay);
    }

    /**
     * Forced close
     *
     * @access {public}
     */
    Drawer.prototype.open = function()
    {
        if (this._state !== 'collapsed' || this._animating) return;

        this._state = 'expanded';

        this._animating = true;

        clearTimeout(this._stateTimer);

        remove_class(this._containerWrap, 'closed, closing');

        add_class(this._containerWrap, 'expanded');

        if (this._options.pushBody && (this._options.direction === 'top' || this._options.direction === 'bottom')) this._pushBody();

        this._stateTimer = setTimeout(() =>
        {
            this._animating = false;

            if (!this._options.pushBody) add_class(document.body, 'no-scroll');

            this._makeCallback(this._options.callbackOpen);

        }, 500);
    }

    /**
     * Forced close
     *
     * @access {public}
     */
    Drawer.prototype.close = function(e)
    {        
        if (this._state !== 'expanded' || this._animating) return;

        if ( (e && (e.target === this._overlay || e.target === this._dialog)) || typeof e === 'undefined')
        {
            this._animating = true;

            clearTimeout(this._stateTimer);

            this._state = 'collapsed';

            add_class(this._containerWrap, 'closing');

            remove_class(this._containerWrap, 'expanded');

            if (this._options.pushBody && (this._options.direction === 'top' || this._options.direction === 'bottom')) this._pullBody();

            this._stateTimer = setTimeout(() =>
            {
                this._animating = false;

                add_class(this._containerWrap, 'closed');

                remove_class(this._containerWrap, 'closing');

                remove_class(document.body, 'no-scroll');

                this._makeCallback(this._options.callbackClose);

            }, 500);
        }
    }

    /**
     * Build the frontdrop and overlay.
     *
     * @access {private}
     */
    Drawer.prototype._build = function()
    {
        this._containerWrap = dom_element({tag: 'div', class: `drawer-container drawer-${this._options.direction} ${this._options.pushBody ? 'push-body' : ''} ${this._options.peekable ? 'drawer-peekable' : null } overlay-${this._options.overlay}`});

        let overlay = dom_element({tag: 'div', class: `drawer-overlay`});
        let drawer   = dom_element({tag: 'div', class: 'drawer-wrap'}, null, 
            dom_element({tag: 'div', class: 'drawer-dialog js-drawer-dialog' }, null, this._options.content )
        );

        this._drawer     = drawer;
        this._overlay    = overlay;
        this._dialog     = find('.js-drawer-dialog', this._drawer);

        if (this._options.pushBody)
        {
            let header = dom_element({tag: 'div', class: `flex-row-fluid align-cols-center-y drawer-header ${this._options.direction !== 'right' ? 'align-cols-right' : ''}`});
            let closer = dom_element({tag: 'button', type: 'button', class: 'btn btn-pure btn-circle btn-xs close-btn'}, header, dom_element({tag: 'span', class: `fa fa-chevron-${PUSH_ARROWS[this._options.direction]}`}));
            
            this._options.direction === 'top' ? this._dialog.appendChild(header) : preapend(header, this._dialog);

            on(closer, 'click', this._closeValidate, this);
        }

        this._makeCallback(this._options.callbackBuilt);
    }

    /**
     * Render the drawer
     *
     * @access {private}
     */
    Drawer.prototype._mount = function()
    {
        document.body.appendChild(this._containerWrap);

        // Wrap body and set 'body to the body-wrap
        // We also need to wrap everything so the drawer and body-wrap share the same CSS Variables
        if (this._options.pushBody)
        {
            let content = find_all('body > *');

            this._bodyWrap = dom_element({tag: 'div', class: 'drawer-body-wrap'});

            this._containerWrap.appendChild(this._bodyWrap);
            
            each(content, (i, node) => node !== this._containerWrap ? this._bodyWrap.appendChild(node) : null);
        }

        if (this._state === 'expanded')
        {
            this._state = 'collapsed';

            this._containerWrap.appendChild(this._overlay);

            this._containerWrap.appendChild(this._drawer);

            setTimeout(() => this.open(), 5);

            this._makeCallback(this._options.callbackRender);
        }
        // No transition, mount and closed
        else
        {
            add_class(this._containerWrap, 'closed');

            this._containerWrap.appendChild(this._overlay);

            this._containerWrap.appendChild(this._drawer);
        }
    }

    /**
     * Bind event listeners inside the built drawer
     *
     * @access {private}
     */
    Drawer.prototype._pushBody = function()
    {
        let h = height(this._drawer);

        if (this._options.direction === 'bottom')
        {
            css(this._bodyWrap, 'padding', `${h}px 0 ${h}px 0`);

            h = -h;
        }

        css(this._bodyWrap, 'transform', `translate3d(0px, ${h}px ,0px)`);
    }

    /**
     * Pull body
     *
     * @access {private}
     */
    Drawer.prototype._pullBody = function()
    {
        css(this._bodyWrap, 'padding', false);

        css(this._bodyWrap, 'transform', false);
    }

    /**
     * Bind event listeners inside the built drawer
     *
     * @access {private}
     */
    Drawer.prototype._closeValidate = function(e, clicked)
    {
        if (this._makeCallback(this._options.callbackValidate))
        {
            this._makeCallback(this._options.callbackConfirm);

            this.close();
        }
    }

    /**
     * Bind event listeners inside the built drawer
     *
     * @access {private}
     */
    Drawer.prototype._bindListeners = function()
    {
        Hubble.dom().refresh(this._containerWrap);

        on([this._overlay, this._dialog], 'click', this._closeValidate, this);

        on(this._drawer, 'mousedown, mouseup, touchstart, touchend', () => toggle_class(this._drawer, 'cursor-down') );

        this._gestures = Hubble.TinyGesture(this._options.swipeable ? window : this._drawer, { mouseSupport: true, velocityThreshold: 3, threshold: (type, self) => this._options.swipeable ? 20 : 3 });

        let directions = SWIPE_DIRECTIONS[this._options.direction];

        this._gestures.on(directions[0], (event) => this.open() );

        this._gestures.on(directions[1], (event) => this._closeValidate() );
    }

    /**
     * Fire render event
     *
     * @access {private}
     */
    Drawer.prototype._makeCallback = function(callback)
    {
        if (callback) return callback(this._drawer);
    }

    // Load into container 
    Hubble.set('Drawer', Drawer);

})();
