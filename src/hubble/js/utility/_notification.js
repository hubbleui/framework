(function()
{
    /**
     * Helper functions
     * 
     * @var {Function}
     */
    const [$, add_class, add_event_listener, in_dom, remove_class, remove_from_dom, dom_element] = Hubble.import(['$','add_class','add_event_listener','in_dom','remove_class','remove_from_dom','dom_element']).from('_');

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
        timeout:          6000,
        btn:              false,
        btnVariant:       'primary',
        callbackOpen:     () => {},
        callbackBtn:      () => {},
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
    class Notification
    {
        /**
         * Module constructor
         *
         * @params {options} obj
         * @access {public}
         * @return {this}
         */
        constructor(options)
        {
            this._DOMElementWrapper = $('.js-nofification-wrap');

            if (!in_dom(this._DOMElementWrapper))
            {
                this._buildNotificationContainer();
            }

            this._invoke(options);

            return this;
        }

        /**
         * Build the notification container
         *
         * @access {private}
         */
        _buildNotificationContainer()
        {
            var wrap = document.createElement('DIV');

            wrap.className = 'notification-wrap js-nofification-wrap';
            
            document.body.appendChild(wrap);
            
            this._DOMElementWrapper = $('.js-nofification-wrap');
        }

        /**
         * Display the notification
         *
         * @params {options} obj
         * @access {private}
         */
        _invoke(options)
        {
            options = {...DEFAULT_OPTIONS, ...options };

            let notif = dom_element({tag: 'div', class: options.variant ? `msg msg-dense msg-${options.variant} animate-in` : `msg msg-dense animate-in` });
            
            if (options.icon)
            {
                dom_element({tag: 'div', class: 'msg-icon' }, notif, dom_element({tag: 'span', class: `fa fa-${options.icon}` }));
            }

            dom_element({tag: 'div', class: 'msg-body'}, notif, dom_element({tag: 'p', innerText: options.text }))

            if (options.btn)
            {
                dom_element({tag: 'div', class: 'msg-btn' }, notif, dom_element({tag: 'button', class: `btn btn-pure btn-${options.btnVariant} btn-sm js-notif-btn`, innerText: options.btn }));
            }
            
            add_class(this._DOMElementWrapper, 'active');

            this._DOMElementWrapper.appendChild(notif);

            options.callbackOpen.call(null, notif);

            var _this = this;

            const timer = setTimeout(function()
            {
                removefunction();

            }, options.timeout);

            const removefunction = () =>
            {
                if (options.callbackValidate.call(null, notif))
                {
                    clearTimeout(timer);

                    _this._remove(notif);

                    options.callbackDismiss.call(null, notif);
                }
            };

            add_event_listener(notif, 'click', removefunction);

            if (options.btn)
            {
                add_event_listener($('.js-notif-btn', notif), 'click', options.callbackBtn);
                add_event_listener($('.js-notif-btn', notif), 'click', removefunction);
            }
        }

        /**
         * Remove a notification
         *
         * @params {DOMElement} node
         * @access {private}
         */
        _remove(DOMElement)
        {
            const wrappper = this._DOMElementWrapper;

            const removed = function()
            {
                remove_from_dom(DOMElement);

                if (wrappper.children.length === 0)
                {
                    remove_class(wrappper, 'active');
                }
            }
            
            add_class(DOMElement, 'animate-out');
            remove_class(DOMElement, 'animate-in');

            setTimeout(removed, 300);
        }
    }

    // Add to container
    Hubble.set('Notification', Notification);

})();
