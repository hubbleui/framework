(function()
{
    /**
     * Helper functions
     * 
     * @var {Function}
     */
    const [find, find_all, each, dom_element, add_class, toggle_class, on, off, has_class, remove_class, remove_from_dom, css, height, width, preapend, scroll_pos, animate_css, rendered_style] = FrontBx.import(['find','find_all','each','dom_element','add_class','toggle_class','on','off','has_class','remove_class','remove_from_dom', 'css', 'height', 'width', 'preapend', 'scroll_pos', 'animate_css', 'rendered_style']).from('_');

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

        // Force overlay on persistent drawer
        persistentOverlay: false,

        // When true allows swiping on screen to hide/show
        swipeable: false,

        // When keepEdge is true, the default state to set "expanded"|"collapsed"
        state: 'expanded',

        // Where the drawer comes from - left,right,top,bottom
        direction: 'left',

        // Collapses to icon size
        peekable: false,

        // Adapt body body
        persistent: false,

        // Responsive
        responsive: false,

        // Push body instead of changing width
        pushbody: false,

        // Animiation time
        animationTime: 250,

        // Animation easing
        easing: 'easeOut',

        // HTML initialized
        fromHTML: false,
        
        // Additional classes to apply to wrapper
        classes: '',

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

        if (this._options.peekable) this._options.persistent = true;

        if (this._options.pushbody)
        {
            this._options.persistent = true;

            this._options.peekable = false;
        }

        // Save state
        this._state = this._options.state;

        // Animating
        this._animating = false;

        // Already mounted?
        this._mounted = false;

        // Initial mount
        this._animateOnMount = typeof this._options.animateOnMount === 'undefined' ? this._state === 'expanded' && !this._options.fromHTML : this._options.animateOnMount;

        // Do we have an overlay
        this._hasOverlay = !this._options.persistent || (this._options.persistent && this._options.persistentOverlay);

        // Cache resize throttle
        this._resizeThrottle = throttle(() => this.resize(), 100);

        // Build the drawer
        this._build();

        // Render the drawer        
        this._mount();

        // Add listeners
        this._bindListeners();

        return this;
    }

    /**
     * Is drawer open?
     *
     * @access {public}
     * @return {Boolean}
     */
    Drawer.prototype.opened = function()
    {
        return this._state === 'expanded';
    }

    /**
     * Is drawer closed?
     *
     * @access {public}
     * @return {Boolean}
     */
    Drawer.prototype.closed = function()
    {
        return this._state === 'collapsed';
    }

    /**
     * Is drawer open or closed?
     *
     * @access {public}
     * @return {String}
     */
    Drawer.prototype.state = function()
    {
        return this._state;
    }

    /**
     * Returns drawer direction.
     *
     * @access {public}
     * @return {String}
     */
    Drawer.prototype.direction = function()
    {
        return this._options.direction;
    }

    /**
     * Window resize handler
     *
     * @access {public}
     */
    Drawer.prototype.resize = function()
    {
        if (this._animating) return;

        let x = width(window);

        if (x < 768 && this.opened())
        {
            this.close();
        }
        else if (x > 768 && this.closed())
        {
            this.open();
        }
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
        if (this._options.persistent) this._unwrapBody();

        if (this._options.responsive && this._options.persistent) 
        {
            off(window, 'resize', this._resizeThrottle, this);
        }

        if (WRAPPED_DRAWERS <= 0)
        {
            remove_from_dom(this._containerWrap);
        }
        else
        {
            if (this._hasOverlay) remove_from_dom(this._overlay);

            remove_from_dom(this._drawer);
        }
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

        this._animating = true;

        remove_class(this._containerWrap, 'closed, closing');

        add_class(this._containerWrap, 'opening');

        remove_class(this._drawer, 'disabled');

        this._animteDrawer();

        if (this._hasOverlay)
        {
            add_class(document.body, 'no-scroll');

            this._animateOverlay();
        }

        if (this._options.pushbody) add_class(document.body, 'no-scroll');

        if (this._options.persistent) this._animateBody();

        if (!this._mounted) this._toggleEnd();
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

        add_class(this._containerWrap, 'closing');

        remove_class(this._containerWrap, 'expanded, opening');

        remove_class(document.body, 'no-scroll');

        this._animteDrawer();

        if (this._hasOverlay) this._animateOverlay();

        if (this._options.persistent) this._animateBody();

        if (!this._mounted) this._toggleEnd();
    }

    /**
     * Wrap body when 'persistent' true.
     *
     * @access {private}
     */
    Drawer.prototype._animteDrawer = function()
    {
        let peekable  = this._options.peekable;
        let state     = this._state;
        let direction = this._options.direction;
        let duration  = this._options.animationTime;
        let easing    = this._options.easing;
        let property  = peekable ? (direction === 'left' || direction === 'right' ? 'width' : 'height') : 'transform';
        let to        = peekable ? (state === 'collapsed' ? this._drawerSize : this._peekableSize) : 'translate3d(0px, 0px, 0px)';
        let from      = peekable ? (state === 'collapsed' ? this._peekableSize : 'auto') : null;

        if (peekable && state === 'collapsed' && (direction === 'top' || direction === 'bottom'))
        {
            to = this._drawerSize;
        }

        if (!peekable)
        {
            let x = (direction === 'left' || direction === 'right') ? (direction === 'left' ? '-100%' : '100%') : '0px';
            let y = (direction === 'top' || direction === 'bottom') ? (direction === 'top' ? '-100%' : '100%') : '0px';
            let tofrom = `translate3d(${x}, ${y}, 0px)`;

            state === 'expanded' ? to = tofrom : from = tofrom;
        }

        (this._mounted || (!this._mounted && this._animateOnMount)) ? animate_css(this._drawer, {property, from, to, duration, easing, callback: () => this._toggleEnd() }) : css(this._drawer, property, to);
    }

    /**
     * Wrap body when 'persistent' true.
     *
     * @access {private}
     */
    Drawer.prototype._animateOverlay = function()
    {
        let duration  = this._options.animationTime;
        let easing    = this._options.easing;
        let property  = 'opacity';
        let to        = this._state === 'collapsed' ? '1' : '0';
        let from      = this._state === 'collapsed' ? '0' : '1';

        (this._mounted || (!this._mounted && this._animateOnMount)) ? animate_css(this._overlay, {property, from, to, duration, easing }) : css(this._overlay, property, to);
    }

    /**
     * Wrap body when 'persistent' true.
     *
     * @access {private}
     */
    Drawer.prototype._animateBody = function()
    {
        if (!this._options.persistent) return;

        let peekable  = this._options.peekable;
        let state     = this._state;
        let direction = this._options.direction;
        let duration  = this._options.animationTime;
        let easing    = this._options.easing;
        let property  = 'margin';
        let n, e, s, w;
        n = e = s = w = '0px';

        if (direction === 'left')   w = state === 'collapsed' ? this._drawerSize  : (peekable ? this._peekableSize : '0px');
        if (direction === 'right')  e = state === 'collapsed' ? this._drawerSize  : (peekable ? this._peekableSize : '0px');
        if (direction === 'top')    n = state === 'collapsed' ? `${height(this._drawer)}px` : (peekable ? this._peekableSize : '0px');

        let to = `${n} ${e} ${s} ${w}`;

        if (this._options.pushbody)
        {
            property = 'transform';
            to = 'translate3d(0px, 0px, 0px)';

            if (state === 'collapsed')
            {
                let x, y;
                x = y = '0px';
                if (e !== '0px') x = `-${e}`;
                if (w !== '0px') x = w;
                if (n !== '0px') y = n;
                to = `translate3d(${x}, ${y}, 0px)`;
            }
        }

        (this._mounted || (!this._mounted && this._animateOnMount)) ? animate_css(this._bodyWrap, {property, to, duration, easing }) : css(this._bodyWrap, property, to);
    }

    /**
     * Completed opening / closing.
     *
     * @access {private}
     */
    Drawer.prototype._toggleEnd = function()
    {        
        // Multiple transitions
        if (!this._animating) return;

        this._state = this._state === 'collapsed' ? 'expanded' : 'collapsed';

        add_class(this._containerWrap, this._state === 'expanded' ? 'expanded' : 'closed');

        remove_class(this._containerWrap, this._state === 'expanded' ? 'opening' : 'closing');

        this._makeCallback(this._state === 'expanded' ? this._options.callbackOpen : this._options.callbackClose);

        this._animating = false;
    }

    /**
     * Build DOM Elements for drawer.
     *
     * @access {private}
     */
    Drawer.prototype._build = function()
    {
        let container = dom_element({tag: 'div', class: `js-drawer-container drawer-container drawer-${this._options.direction} ${this._options.persistent ? 'persistent' : ''} ${this._options.peekable ? 'peekable' : null } overlay-${this._options.overlay} ${this._options.classes}`});
        let overlay   = dom_element({tag: 'div', class: 'js-drawer-overlay drawer-overlay'}, !this._hasOverlay ? null : container);
        let drawer    = dom_element({tag: 'aside', class: 'js-drawer-wrap drawer-wrap'}, container, 
            dom_element({tag: 'div', class: 'drawer-dialog js-drawer-dialog' }, null, this._options.content )
        );

        this._containerWrap = container;
        this._drawer        = drawer;
        this._overlay       = overlay;
        this._dialog        = find('.js-drawer-dialog', this._drawer);

        if (this._options.persistent)
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

        this._containerWrap.offsetHeight;

        this._peekableSize = this._options.peekableSize || rendered_style(this._containerWrap, '--fbx-drawer-size-peekable');
        this._drawerSize   = this._options.drawerSize || rendered_style(this._containerWrap, '--fbx-drawer-width');

        if (this._options.persistent) this._wrapBody();

        this._state = this._state === 'expanded' ? 'collapsed' : 'expanded';

        this._state === 'collapsed' ? this.open() : this.close();

        this._mounted = true;

        this._makeCallback(this._options.callbackRender);
    }

    /**
     * Wrap body when 'persistent' true.
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

            if (this._containerWrap.parentNode) this._containerWrap.parentNode.removeChild(this._containerWrap);

            this._containerWrap = find('.js-drawer-container');

            this._bodyWrap = find('.js-drawer-body-wrap');

            this._containerWrap.className = classN;

            this._containerWrap.appendChild(this._drawer);

            return;
        }

        WRAPPED_BODY = true;

        let pos = scroll_pos();

        let content = find_all('body > *');

        this._bodyWrap = dom_element({tag: 'div', class: 'js-drawer-body-wrap drawer-body-wrap'});

        preapend(this._bodyWrap, this._containerWrap);
        
        each(content, (i, node) => node !== this._containerWrap ? this._bodyWrap.appendChild(node) : null);

        this._containerWrap.scrollTo(pos.left, pos.top);
    }

    /**
     * Unwrap body when 'persistent' true.
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
           
            window.scrollTo(pos.left, pos.top);

            WRAPPED_BODY = false;
        }
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
        if (!this._options.fromHTML) 
        {
            let context = this._options.persistent ? this._drawer : this._containerWrap;
            
            FrontBx.dom().refresh(context);
        }

        if (this._options.responsive && this._options.persistent) 
        {
            on(window, 'resize', this._resizeThrottle, this);
        }

        on(this._overlay, 'click', this._closeValidate, this);

        let directions = SWIPE_DIRECTIONS[this._options.direction];

        this._gestures = FrontBx.TinyGesture(this._options.swipeable ? window : this._drawer, { mouseSupport: true, velocityThreshold: 3, threshold: (type, self) => this._options.swipeable ? 20 : 3 });

        this._gestures.on(directions[0], () => this.open() );

        this._gestures.on(directions[1], () => this._closeValidate() );
    }

    /**
     * Fire callbacks.
     *
     * @access {private}
     */
    Drawer.prototype._makeCallback = function(callback)
    {
        if (callback) return callback(this._containerWrap, this._drawer, this._overlay, this._bodyWrap);
    }

    // Load into container 
    FrontBx.set('Drawer', Drawer);

})();