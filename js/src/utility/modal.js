(function()
{
    /**
     * Helper functions
     * 
     * @var {Function}
     */
    const [find, dom_element, add_class, on, off, remove_class, remove_from_dom, hide_aria, show_aria] = FrontBx.import(['find','dom_element','add_class','on','off','remove_class','remove_from_dom','hide_aria','show_aria']).from('_');

    /**
     * Default options
     * 
     * @var {obj}
     */
    var DEFAULT_OPTIONS =
    {
        // Title
        title: '',

        // Content - can be a node, nodelist, or string of HTML
        content: '',

        // Additional classes to pass to modal
        classes: '',

        // Does not create card
        custom: false,

        // Click anywhere to close
        closeAnywhere: true,

        // Scroll 'content' or 'modal'
        scroll: 'modal',

        // Cancel btn
        cancelBtn: null,
        cancelClass: 'btn-danger btn-pure',

        // Confirm btn
        confirmBtn: null,
        confirmClass: 'btn-pure',
        
        // Overlay color - dark, light, none,
        overlay: 'dark',

        // Default state when created/mounted set "open"|"closed"
        state: 'open',

        // Loaded from HTML DOM
        fromHTML: false,

        // State callbacks
        callbackBuilt:    () => { },
        callbackRender:   () => { },
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
     */
    const Modal = function(options)
    { 
        // Merge options
        this._options = {...DEFAULT_OPTIONS, ...options};

        // Save state
        this._state = this._options.state;

        // Animating
        this._animating = false;

        // Build the Modal
        this._build();

        // Add listeners
        this._bindListeners();

        // Render the Modal        
        this._mount();

        return this;
    }

    /**
     * Is Modal open?
     *
     * @access {public}
     * @return {Boolean}
     */
    Modal.prototype.opened = function()
    {
        return this._state === 'open';
    }

    /**
     * Is Modal closed?
     *
     * @access {public}
     * @return {Boolean}
     */
    Modal.prototype.closed = function()
    {
        return this._state === 'closed';
    }

    /**
     * Is Modal open or closed?
     *
     * @access {public}
     * @return {String}
     */
    Modal.prototype.state = function()
    {
        return this._state;
    }

    /**
     * Destroy Modal.
     *
     * @access {public}
     */
    Modal.prototype.destroy = function()
    {
        this.close();

        remove_from_dom(this._modal);

        remove_from_dom(this._overlay);
    }

    /**
     * Close Modal.
     *
     * @access {public}
     */
    Modal.prototype.open = function()
    {
        // Don't open when animating or not already closed
        if (this._state !== 'closed' || this._animating) return;

        this._animating = true;

        on(this._dialog, 'transitionend', this._toggleEnd, this);

        remove_class([this._modal, this._overlay], 'closed, closing');

        add_class([this._modal, this._overlay], 'opening');

        if (this._options.overlay !== false) add_class(document.body, 'no-scroll');

        show_aria([this._modal, this._overlay]);
    }

    /**
     * Open Modal.
     *
     * @access {public}
     */
    Modal.prototype.close = function()
    {
        if (this._state !== 'open' || this._animating) return;

        this._animating = true;

        on(this._dialog, 'transitionend', this._toggleEnd, this);

        remove_class([this._modal, this._overlay], 'opening, opened');

        add_class([this._modal, this._overlay], 'closing');

        remove_class(document.body, 'no-scroll');

        hide_aria([this._modal, this._overlay]);

        this._dialog.blur();
    }

    /**
     * Completed opening / closing.
     *
     * @access {private}
     */
    Modal.prototype._toggleEnd = function()
    {                
        // Multiple transitions
        if (!this._animating) return;

        if (this._state === 'closed') this._dialog.focus();

        this._state = this._state === 'closed' ? 'open' : 'closed';

        remove_class([this._modal, this._overlay], this._state === 'open' ? 'opening' : 'closing');

        add_class([this._modal, this._overlay], this._state === 'open' ? 'opened' : 'closed');

        this._makeCallback(this._state === 'open' ? this._options.callbackOpen : this._options.callbackClose);

        off(this._dialog, 'transitionend', this._toggleEnd, this);

        this._animating = false;
    }

    /**
     * Build DOM Elements for Modal.
     *
     * @access {private}
     */
    Modal.prototype._build = function()
    {
        this._cancelBtn  = this._options.cancelBtn  ? dom_element({tag: 'button', type: 'button', class: `btn ${this._options.cancelClass}`}, null, this._options.cancelBtn) : null; 
        
        this._confirmBtn = this._options.confirmBtn ? dom_element({tag: 'button', type: 'button', class: `btn ${this._options.confirmClass}`}, null, this._options.confirmBtn) : null;
        
        this._overlay = dom_element({tag: 'div', role: 'presentation', class: `modal-overlay closed overlay-${this._options.overlay} ${this._options.overlay === false ? 'disabled' : ''}`});
        
        this._modal    = dom_element({tag: 'div', role: 'presentation', tabindex: '-1', class: `modal-wrap closed scroll-${this._options.scroll} ${this._options.classes}`}, null, 
        dom_element({tag: 'div', class: 'modal-dialog js-modal-dialog'}, null,
            this._options.custom ? this._options.content : dom_element({tag: 'div', class: `card ${this._options.scroll === 'content' ? 'card-scrollable-content' : 'card-scrollable'} `}, null, 
                [
                    dom_element({tag: 'div', class: 'card-header'}, null, 
                        dom_element({tag: 'div', class: 'card-header-content'}, null, 
                            dom_element({tag: 'div', class: 'card-title'}, null, this._options.title)
                        )
                    ),
                    dom_element({tag: 'div', class: 'card-block'}, null, this._options.content),
                    (this._cancelBtn || this._confirmBtn ? 
                        dom_element({tag: 'div', class: 'card-footer'}, null, [ dom_element({tag: 'div', class: 'card-footer-content'}, null, '&nbsp;'),
                            dom_element({tag: 'div', class: 'card-footer-right'}, null, [ this._cancelBtn, this._confirmBtn ])]
                        ) : null)
                ])
            )
        );

        this._dialog = find('.js-modal-dialog', this._modal);

        this._makeCallback(this._options.callbackBuilt);
    }

    /**
     * Mount and render the Modal.
     *
     * @access {private}
     */
    Modal.prototype._mount = function()
    {
        document.body.appendChild(this._overlay);

        document.body.appendChild(this._modal);

        this._modal.offsetHeight;

        this._overlay.offsetHeight;

        if (!this._options.fromHTML) FrontBx.dom().refresh(this._modal);

        if (this._state === 'open')
        {
            this._state = 'closed';

            this.open();
        }
    }

    /**
     * Bind event listeners for Modal.
     *
     * @access {private}
     */
    Modal.prototype._bindListeners = function()
    {
        if (this._options.closeAnywhere) on(this._modal, 'click', this._closeClick, this);

        if (this._cancelBtn) on(this._cancelBtn, 'click', this._closeValidate, this);

        if (this._confirmBtn) on(this._confirmBtn, 'click', this._closeValidate, this);
    }

    /**
     * Validate closing.
     *
     * @access {private}
     */
    Modal.prototype._closeClick = function(e, clicked)
    {
        if (e.target === this._modal) this._closeValidate();
    }

    /**
     * Validate closing.
     *
     * @access {private}
     */
    Modal.prototype._closeValidate = function()
    {
        if (this._makeCallback(this._options.callbackValidate)) this.close();
    }

    /**
     * Fire callbacks.
     *
     * @access {private}
     */
    Modal.prototype._makeCallback = function(callback)
    {
        if (callback) return callback(this._modal, this._Modal, this._overlay, this._bodyWrap);
    }

    // Load into container 
    FrontBx.set('Modal', Modal);

})();