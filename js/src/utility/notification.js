(function()
{
    /**
     * Helper functions
     * 
     * @var {Function}
     */
    const [find, add_class, on, in_dom, remove_class, remove_from_dom, dom_element] = FrontBx.import(['find','add_class','on','in_dom','remove_class','remove_from_dom','dom_element']).from('_');

    /**
     * Default options
     * 
     * @var {array}
     */
    const DEFAULT_OPTIONS =
    {
        text:             '',
        variant:          '',
        icon:             '',
        position:         'bottom',
        timeout:          6000,
        btn:              false,
        btnVariant:       'primary',
        callbackBuilt:    () => {},
        callbackRender:   () => {},
        callbackDismiss:  () => {},        
        callbackValidate: () => { return true; }
    };

    /**
     * Notification
     *
     * The Notification class is a utility class used to
     * display a notification.
     *
     */
    const Notification = function(options)
    {
        this._options = {...DEFAULT_OPTIONS, ...options };

        this._buildNotificationContainer();

        this._build();

        this._render();

        this._bindListeners();
    }

    /**
     * Returns the notification element.
     *
     * @access {public}
     */
    Notification.prototype.domElement = function()
    {
        return this._notification;
    }

    /**
     * Remove the notification.
     *
     * @access {public}
     */
    Notification.prototype.remove = function()
    {
        clearTimeout(this._timeout);

        const wrappper = this._DOMElementWrapper;

        add_class(this._notification, this._animateOutClass);
        
        remove_class(this._notification, this._animateInClass);

        this._makeCallback(this._options.callbackDismiss);

        setTimeout(() =>
        {
            if (wrappper.children.length === 0) remove_class(wrappper, 'active');

            remove_from_dom(this._notification);

        }, 300);
    }

    /**
     * Build the notification container
     *
     * @access {private}
     */
    Notification.prototype._buildNotificationContainer = function()
    {
        this._wrapperClass = `.js-nofification-wrap.position-${this._options.position}`;

        let wrapper = find(this._wrapperClass);

        if (!wrapper)
        {
            wrapper = dom_element({tag: 'div', class: `notification-wrap position-${this._options.position} js-nofification-wrap`}, document.body);
        }

        this._DOMElementWrapper = wrapper;
    }

    /**
     * Build the notification
     *
     * @access {private}
     */
    Notification.prototype._build = function()
    {        
        let options = this._options;

        this._animateInClass = this._animateIn();

        this._animateOutClass = this._animateOut();

        let notif = dom_element({tag: 'div', class: options.variant ? `msg msg-dense msg-${options.variant} ${this._animateInClass}` : `msg msg-dense ${this._animateInClass}` });
        
        if (options.icon)
        {
            dom_element({tag: 'div', class: 'msg-icon' }, notif, dom_element({tag: 'span', class: `fa fa-${options.icon}` }));
        }

        dom_element({tag: 'div', class: 'msg-body'}, notif, dom_element({tag: 'p', innerHTML: options.text }))

        if (options.btn)
        {
            this._btn = dom_element({tag: 'div', class: 'msg-btn' }, notif, dom_element({tag: 'button', class: `btn btn-pure btn-${options.btnVariant} btn-sm js-notif-btn`, innerText: options.btn }));
        }

        this._notification = notif;

        this._makeCallback(this._options.callbackBuilt);
    }

    /**
     * Build the notification
     *
     * @access {private}
     */
    Notification.prototype._animateIn = function()
    {
        if (this._options.position.includes('top')) return 'animate-in-down';

        return 'animate-in-up';
    }

     /**
     * Build the notification
     *
     * @access {private}
     */
    Notification.prototype._animateOut = function()
    {
        if (this._options.position.includes('top')) return 'animate-out-up';

        return 'animate-out-down';
    }

    /**
     * Render the notification.
     *
     * @access {private}
     */
    Notification.prototype._render = function()
    {
        add_class(this._DOMElementWrapper, 'active');

        this._DOMElementWrapper.appendChild(this._notification);

        this._notification.offsetHeight;

        this._makeCallback(this._options.callbackRender);

    }

    /**
     * Render the notification.
     *
     * @access {private}
     */
    Notification.prototype._removeValidate = function()
    {
        if (this._makeCallback(this._options.callbackValidate)) this.remove();
    }

    /**
     * Render the notification.
     *
     * @access {private}
     */
    Notification.prototype._bindListeners = function()
    {
        if (this._options.timeout !== false)
        {
            this._timeout = setTimeout(() => this._removeValidate(), this._options.timeout);
        }

        on(this._notification, 'click', this._removeValidate, this);
    }

    /**
     * Fire callbacks.
     *
     * @access {private}
     */
    Notification.prototype._makeCallback = function(callback,)
    {
        if (callback) return callback(this._notification);
    }

    // Add to container
    FrontBx.set('Notification', Notification);

})();