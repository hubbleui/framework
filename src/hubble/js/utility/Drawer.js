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
    const [find, find_all, each, dom_element, add_class, toggle_class, on, off, has_class, remove_class, remove_from_dom, css, height, preapend, scroll_pos] = Hubble.import(['find','find_all','each','dom_element','add_class','toggle_class','on','off','has_class','remove_class','remove_from_dom', 'css', 'height', 'preapend', 'scroll_pos']).from('_');

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
     * Don't double wrap body.
     * 
     * @var {boolean}
     */
    var WRAPPED_BODY = false;

    /**
     * Don't double wrap body.
     * 
     * @var {boolean}
     */
    var WRAPPED_DRAWERS = 0;

    /**
     * Module constructor
     *
     * @class
     * @params {options} obj
     * @access {public}
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

        // Build the drawer
        this._build();

        // Render the drawer        
        this._mount();

        // Add listeners
        this._bindListeners();

        return this;
    }

    /**
     * Destroy drawer.
     *
     * @access {public}
     */
    Drawer.prototype.destroy = function()
    {
        // Close
        this.close();

        // Remove gestures
        this._gestures.destroy();

        // Unwrap body
        if (this._options.pushBody) this._unwrapBody();

        // Remove from DOM and unbind
        remove_from_dom(this._containerWrap);
    }

    /**
     * Close drawer.
     *
     * @access {public}
     */
    Drawer.prototype.open = function()
    {
        // Don't open when animating or not already closed
        if (this._state !== 'collapsed' || this._animating) return;

        this._state = 'expanded';

        this._animating = true;

        remove_class(this._bodyWrap, 'disabled');

        if (!this._options.pushBody) add_class(document.body, 'no-scroll');

        remove_class(this._containerWrap, 'closed, closing');

        add_class(this._containerWrap, 'expanded');

        // Push body if necessary
        if (this._options.pushBody && (this._options.direction === 'top' || this._options.direction === 'bottom')) this._pushBody();

        on(this._containerWrap, 'transitionend', this._transitioned, this);
    }

    /**
     * Completed opening / closing.
     *
     * @access {private}
     */
    Drawer.prototype._transitioned = function()
    {
        // Multiple transitions
        if (!this._animating) return;

        this._animating = false;

        // Opened
        if (this._state === 'expanded')
        {
            this._makeCallback(this._options.callbackOpen);
        }
        // closed
        else
        {
            remove_class(document.body, 'no-scroll');

            add_class(this._containerWrap, 'closed');

            remove_class(this._containerWrap, 'closing');

            this._makeCallback(this._options.callbackClose);
        }

        off(this._containerWrap, 'transitionend', this._transitioned, this);
    }

    /**
     * Open drawer.
     *
     * @access {public}
     */
    Drawer.prototype.close = function()
    {        
        if (this._state !== 'expanded' || this._animating) return;

        this._animating = true;

        this._state = 'collapsed';

        add_class(this._containerWrap, 'closing');

        remove_class(this._containerWrap, 'expanded');

        if (this._options.pushBody && (this._options.direction === 'top' || this._options.direction === 'bottom')) this._pullBody();

        on(this._containerWrap, 'transitionend', this._transitioned, this);
    }

    /**
     * Build DOM Elements for drawer.
     *
     * @access {private}
     */
    Drawer.prototype._build = function()
    {
        this._containerWrap = dom_element({tag: 'div', class: `js-drawer-container drawer-container drawer-${this._options.direction} ${this._options.pushBody ? 'push-body' : ''} ${this._options.peekable ? 'drawer-peekable' : null } overlay-${this._options.overlay}`});

        let overlay = dom_element({tag: 'div', class: 'js-drawer-overlay drawer-overlay'});
        let drawer   = dom_element({tag: 'div', class: 'js-drawer-wrap drawer-wrap'}, null, 
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
     * Mount and render the drawer.
     *
     * @access {private}
     */
    Drawer.prototype._mount = function()
    {
        document.body.appendChild(this._containerWrap);

        if (this._options.pushBody) this._wrapBody();

        // Wrap body and set 'body to the body-wrap
        // We also need to wrap everything so the drawer and body-wrap share the same CSS Variables
        if (this._state === 'expanded')
        {
            this._state = 'collapsed';

            if (!this._options.pushBody) this._containerWrap.appendChild(this._overlay);

            this._containerWrap.appendChild(this._drawer);

            setTimeout(() => this.open(), 5);

            this._makeCallback(this._options.callbackRender);
        }
        // No transition, mount and closed
        else
        {
            add_class(this._containerWrap, 'closed');

            if (!this._options.pushBody) this._containerWrap.appendChild(this._overlay);

            this._containerWrap.appendChild(this._drawer);
        }
    }

    /**
     * Wrap body when 'pushBody' true.
     *
     * @access {private}
     */
    Drawer.prototype._wrapBody = function()
    {
        WRAPPED_DRAWERS++;

        // Don't double-wrap body
        if (WRAPPED_BODY)
        {
            // Disable other drawers
            each(find_all('.js-drawer-wrap'), (i, drawer) => add_class(drawer, 'disabled'));

            let classN = this._containerWrap.className;

            this._containerWrap.parentNode.removeChild(this._containerWrap);

            this._containerWrap = find('.js-drawer-container');

            this._bodyWrap = find('.js-drawer-body-wrap');

            this._containerWrap.className = classN;

            return;
        }

        WRAPPED_BODY = true;

        let pos = scroll_pos();

        let content = find_all('body > *');

        this._bodyWrap = dom_element({tag: 'div', class: 'js-drawer-body-wrap drawer-body-wrap'});

        this._containerWrap.appendChild(this._bodyWrap);
        
        each(content, (i, node) => node !== this._containerWrap ? this._bodyWrap.appendChild(node) : null);

        this._containerWrap.scrollTo(pos.left, pos.top);
    }

    /**
     * Unwrap body when 'pushBody' true.
     *
     * @access {private}
     */
    Drawer.prototype._unwrapBody = function()
    {
        if (!WRAPPED_BODY) return;

        WRAPPED_DRAWERS--;

        // Only unwrap if we're the last drawer using the container.
        if (WRAPPED_DRAWERS <= 0)
        {
            let pos = scroll_pos(this._containerWrap);

            let content = find_all('> *', this._bodyWrap);

            each(content, (i, node) => document.body.appendChild(node));

            document.body.removeChild(this._containerWrap);
           
            window.scrollTo(pos.left, pos.top);

            WRAPPED_BODY = false;
        }
    }

    /**
     * Push body for "top" only.
     *
     * @access {private}
     */
    Drawer.prototype._pushBody = function()
    {
        if (this._options.direction === 'top')
        {
            let h = height(this._drawer);

            css(this._bodyWrap, 'margin-top', `${h}px`);
        }
    }

    /**
     * Pull body back.
     *
     * @access {private}
     */
    Drawer.prototype._pullBody = function()
    {
        css(this._bodyWrap, 'margin', false);
    }

    /**
     * Validate closing.
     *
     * @access {private}
     */
    Drawer.prototype._closeValidate = function()
    {
        if (this._makeCallback(this._options.callbackValidate)) this.close();
    }

    /**
     * Bind event listeners for drawer.
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
     * Fire callbacks.
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
