/**
 * Modal
 *
 * The Modal class is a utility class used to
 * display a modal.
 *
 */
(function()
{
    /**
     * Helper functions
     * 
     * @var {Function}
     */
    const [find, dom_element, add_class, toggle_class, on, has_class, remove_class, remove_from_dom] = Hubble.import(['find','dom_element','add_class','toggle_class','on','has_class','remove_class','remove_from_dom']).from('_');

    /**
     * @var {obj}
     */
    var DEFAULT_OPTIONS =
    {
        // Title - string
        title: '',

        // Content - can be a node, nodelist, or string of HTML
        content: '',

        // Confirm button text or null + confirm button class
        confirmBtn: null,
        confirmClass: 'btn-primary',
        
        // Overlay color - "dark"| "light"
        overlay: 'dark',

        // Allows collapsing,expanding
        keepEdge: false,

        // When true allows swiping on screen to hide/show
        swipeable: false,

        // When keepEdge is true, the default state to set "expanded"|"collapsed"
        state: 'expanded',

        // State callbacks
        callbackBuilt:    () => { },
        callbackRender:   () => { },
        callbackConfirm:  () => { },
        callbackClose:    () => { },
        callbackOpen:     () => { },
        callbackValidate: () => true,
    };

    /**
     * Module constructor
     *
     * @class
     * @params {options} obj
     * @access {public}
     * @return {this}
     */
    const Frontdrop = function(options)
    { 
        // Merge options
        this._options = {...DEFAULT_OPTIONS, ...options};

        // Save state
        this._state = this._options.state;

        // Animating
        this._animating = false;

        // State timer
        this._stateTimer = null;

        // Build the modal
        this._build();

        // Render the modal        
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
    Frontdrop.prototype.destroy = function()
    {        
        this.close();

        this._gestures.destroy();

        remove_from_dom(this._modal);

        remove_from_dom(this._overlay);
    }

    /**
     * Forced close
     *
     * @access {public}
     */
    Frontdrop.prototype.open = function()
    {
        if (this._state !== 'collapsed' || this._animating) return;

        this._state = 'expanded';

        this._animating = true;

        clearTimeout(this._stateTimer);

        remove_class([this._modal, this._overlay], 'closed, closing');

        add_class([this._modal, this._overlay], 'expanded');

        this._stateTimer = setTimeout(() =>
        {
            this._animating = false;

            add_class(document.body, 'no-scroll');

            this._makeCallback(this._options.callbackOpen);

        }, 500);
    }

    /**
     * Forced close
     *
     * @access {public}
     */
    Frontdrop.prototype.close = function(e)
    {        
        if (this._state !== 'expanded' || this._animating) return;

        if ( (e && (e.target === this._overlay || e.target === this._dialog)) || typeof e === 'undefined')
        {
            this._animating = true;

            clearTimeout(this._stateTimer);

            this._state = 'collapsed';

            add_class([this._modal, this._overlay], 'closing');

            this._stateTimer = setTimeout(() =>
            {
                this._animating = false;

                remove_class(document.body, 'no-scroll');

                add_class([this._modal, this._overlay], 'closed');

                remove_class([this._modal, this._overlay], 'closing, expanded');

                this._makeCallback(this._options.callbackClose);

            }, 500);
        }
    }

    /**
     * Build the frontdrop and overlay.
     *
     * @access {private}
     */
    Frontdrop.prototype._build = function()
    {
        let footer = this._options.confirmBtn ? dom_element({tag: 'div', class: 'card-footer'}, null, 
            dom_element({tag: 'div', class: 'card-footer'}, null,
                dom_element({tag: 'div', class: 'card-footer-content'}, null,
                    dom_element({tag: 'div', class: 'container-fluid'}, null,
                        dom_element({tag: 'button', type: 'button', class: `btn btn-block js-frontdrop-confirm ${this._options.confirmClass}`}, null, this._options.confirmBtn)
                    )
                )
            )
        ) : null;

        let overlay = dom_element({tag: 'div', class: `frontdrop-overlay ${this._options.overlay}`});
        let modal   = dom_element({tag: 'div', class: `frontdrop-wrap ${this._options.confirmBtn ? 'with-confirmation' : ''} ${this._options.keepEdge ? 'collapsible' : null }`}, null, 
            dom_element({tag: 'div', class: 'frontdrop-dialog js-frontdrop-dialog' }, null, 
                dom_element({tag: 'div', class: 'card js-frontdrop-inner'}, null,
                [ 
                    dom_element({tag: 'div', class: 'card-header'}, null,
                        dom_element({tag: 'div', class: 'container-fluid'}, null, 
                            dom_element({tag: 'div', class: 'card-header-content'}, null,
                                dom_element({tag: 'card-title', class: 'card-title'}, null, this._options.title)
                            )
                        )
                    ),
                    dom_element({tag: 'div', class: 'card-block'}, null, 
                        dom_element({tag: 'div', class: 'container-fluid'}, null, this._options.content)
                    ),
                    footer
                ])
            )
        );

        this._modal      = modal;
        this._overlay    = overlay;
        this._dialog     = find('.js-frontdrop-dialog', this._modal);
        
        this._makeCallback(this._options.callbackBuilt);
    }

    /**
     * Render the modal
     *
     * @access {private}
     */
    Frontdrop.prototype._mount = function()
    {
        if (this._state === 'expanded')
        {
            document.body.appendChild(this._overlay);

            document.body.appendChild(this._modal);

            add_class(document.body, 'no-scroll');

            this._modal.offsetHeight;

            setTimeout(() =>
            {
                add_class(this._modal, 'expanded');

                add_class(this._overlay, 'expanded');

            }, 5);

            this._makeCallback(this._options.callbackRender);
        }
        // No transition, mount and closed
        else
        {
            add_class(this._modal, 'closed');

            add_class(this._overlay, 'closed');

            document.body.appendChild(this._overlay);

            document.body.appendChild(this._modal);
        }
    }

    /**
     * Bind event listeners inside the built modal
     *
     * @access {private}
     */
    Frontdrop.prototype._closeValidate = function(e, clicked)
    {
        if (this._makeCallback(this._options.callbackValidate))
        {
            this._makeCallback(this._options.callbackConfirm);

            this.close();
        }
    }

    /**
     * Bind event listeners inside the built modal
     *
     * @access {private}
     */
    Frontdrop.prototype._bindListeners = function()
    {
        Hubble.dom().refresh(this._modal);

        if (this._options.confirmBtn) on(find('.js-frontdrop-confirm', this._modal), 'click', this._closeValidate, this);

        on([this._overlay, this._dialog], 'click', this.close, this);

        on(this._modal, 'mousedown, mouseup, touchstart, touchend', () => toggle_class(this._modal, 'cursor-down') );

        this._gestures = Hubble.TinyGesture(this._options.swipeable ? window : this._modal, { mouseSupport: true, velocityThreshold: 3, threshold: (type, self) => this._options.swipeable ? 20 : 3 });

        this._gestures.on('swipeup', (event) => this.open() );

        this._gestures.on('swipedown', (event) => this.close() );
    }

    /**
     * Fire render event
     *
     * @access {private}
     */
    Frontdrop.prototype._makeCallback = function(callback)
    {
        if (callback) return callback(this._modal);
    }

    // Load into container 
    Hubble.set('Frontdrop', Frontdrop);

})();
