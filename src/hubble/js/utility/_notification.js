(function()
{
    /**
     * @var {Helper} obj
     */
    const Helper = Container._();

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
            this._DOMElementWrapper = Helper.$('.js-nofification-wrap');

            if (!Helper.in_dom(this._DOMElementWrapper))
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
            
            this._DOMElementWrapper = Helper.$('.js-nofification-wrap');
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
            
            var content = '';

            if (options.icon)
            {
                content += `<div class="msg-icon"><span class="glyph-icon glyph-icon-${options.icon}"></span></div>`;
            }

            content += `<div class="msg-body"><p>${options.text}</p></div>`;

            if (options.btn)
            {
                content +=  `<div class="msg-btn"><button type="button" class="btn btn-pure btn-${options.btnVariant} btn-sm js-notif-btn">${options.btn}</button></div>`;
            }     
           
            var notif       = document.createElement('DIV');
            notif.className = 'msg animate-in';

            if (options.variant)
            {
                notif.className += ` msg-${options.variant}`;
            }

            notif.innerHTML = content;

            Helper.add_class(this._DOMElementWrapper, 'active');

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

            Helper.add_event_listener(notif, 'click', removefunction);

            if (options.btn)
            {
                Helper.add_event_listener(Helper.$('.js-notif-btn', notif), 'click', options.callbackBtn);
                Helper.add_event_listener(Helper.$('.js-notif-btn', notif), 'click', removefunction);
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
                Helper.remove_from_dom(DOMElement);

                if (wrappper.children.length === 0)
                {
                    Helper.remove_class(wrappper, 'active');
                }
            }
            
            Helper.add_class(DOMElement, 'animate-out');
            Helper.remove_class(DOMElement, 'animate-in');

            setTimeout(removed, 300);
        }
    }

    // Add to container
    Container.set('Notification', Notification);

})();
