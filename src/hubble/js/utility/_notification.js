/**
 * Notification
 *
 * The Notification class is a utility class used to
 * display a notification.
 *
 */
(function()
{

    /**
     * @var {Helper} obj
     */
    var Helper = Container.Helper();

    /**
     * @var {_activeNotifs} array
     */
    var _activeNotifs = [];

    /**
     * Module constructor
     *
     * @class
     {*} @constructor
     * @params {options} obj
     * @access {public}
     * @return {this}
     */
    var Notification = function(options)
    {
        this._notifWrap = Helper.$('.js-nofification-wrap');

        if (!Helper.in_dom(this._notifWrap))
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
    Notification.prototype._buildNotificationContainer = function()
    {
        var wrap = document.createElement('DIV');
        wrap.className = 'notification-wrap js-nofification-wrap';
        document.body.appendChild(wrap);
        this._notifWrap = Helper.$('.js-nofification-wrap');
    }


    /**
     * Display the notification
     *
     * @params {options} obj
     * @access {private}
     */
    Notification.prototype._invoke = function(options)
    {
        if (typeof options.isCallback !== 'undefined' && options.isCallback === true)
        {
            this._invokeCallbackable(options);

            return;
        }

        var _this = this;
        var content = '<div class="msg-body"><p>' + options.msg + '</p></div>';
        var notif = Helper.new_node('div', 'msg-' + options.type + ' msg animate-notif', null, content, this._notifWrap);
        var timeout = typeof options.timeoutMs === 'undefined' ? 6000 : options.timeoutMs;

        Helper.add_class(this._notifWrap, 'active');

        // Timout remove automatically
        _activeNotifs.push(
        {
            node: notif,
            timeout: setTimeout(function()
            {
                _this._removeNotification(notif);
            }, timeout),
        });

        // Click to remove
        notif.addEventListener('click', function()
        {
            _this._removeNotification(notif);
        });
    }

    /**
     * Create a notification that has callback buttons 
     *
     * @params {options} obj
     * @access {private}
     */
    Notification.prototype._invokeCallbackable = function(options)
    {
        var _this = this;
        var confirmText = typeof options.confirmText === 'undefined' ? 'Confirm' : options.confirmText;
        var dismissX = typeof options.showDismiss === 'undefined' ? '' : '<button type="button" class="btn btn-xs btn-pure btn-dismiss btn-circle js-dismiss"><span class="glyph-icon glyph-icon-cross2"></span></button>';
        var timeout = typeof options.timeoutMs === 'undefined' ? 6000 : options.timeoutMs;

        var content = '<div class="msg-body"><p>' + options.msg + '</p></div><div class="msg-btn"><button type="button" class="btn btn-primary btn-sm btn-pure js-confirm">' + confirmText + '</button>' + dismissX + '</div>';

        var notif = Helper.new_node('div', 'msg animate-notif', null, content, this._notifWrap);
        var confirm = Helper.$('.js-confirm', notif);
        var dismiss = Helper.$('.js-dismiss', notif);

        Helper.add_class(this._notifWrap, 'active');

        _activeNotifs.push(
        {
            node: notif,
            timeout: setTimeout(function()
            {
                _this._removeNotification(notif);
            }, timeout),
        });

        // Click to remove
        notif.addEventListener('click', function()
        {
            if (Helper.is_callable(options.onDismiss))
            {
                options.onDismiss(options.onDismissArgs);
            }

            _this._removeNotification(notif);
        });

        // Click confirm to remove
        confirm.addEventListener('click', function()
        {
            if (Helper.is_callable(options.onConfirm))
            {
                options.onConfirm(options.onConfirmArgs);
            }

            _this._removeNotification(notif);
        });

        if (dismiss)
        {
            dismiss.addEventListener('click', function()
            {
                if (Helper.is_callable(options.onDismiss))
                {
                    options.onDismiss(options.onDismissArgs);
                }

                _this._removeNotification(notif);
            });
        }
    }

    /**
     * Remove a notification
     *
     * @params {_node} node
     * @access {private}
     */
    Notification.prototype._removeNotification = function(_node)
    {
        var _this = this;
        var i = _activeNotifs.length;
        while (i--)
        {
            if (_node === _activeNotifs[i].node)
            {
                clearTimeout(_activeNotifs[i].timeout);
                Helper.remove_class(_node, 'animate-notif');
                Helper.animate(_node, 'opacity', '1', '0', 350, 'ease');
                Helper.animate(_node, 'max-height', '100px', '0', 450, 'ease');
                _activeNotifs.splice(i, 1);
                setTimeout(function()
                {
                    Helper.remove_from_dom(_node);

                    if (_activeNotifs.length === 0)
                    {
                        Helper.remove_class(_this._notifWrap, 'active');
                    }
                }, 450);
                return;
            }
        }
    }

    // Add to container
    Container.set('Notification', Notification);

})();
