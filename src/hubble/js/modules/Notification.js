(function() {


    // REQUIRES
    /*****************************************/
    var Helper = Modules.require('JSHelper');
    var _activeNotifs = [];

    // MODULE OBJECT
    /*****************************************/
    var Notifications = function(options) {
        this.__construct();
        this._invoke(options);
        return this;
    };

    // CONSTURCTOR
    /*****************************************/
    Notifications.prototype.__construct = function(options) {
        this._notifWrap = Helper.$('.js-nofification-wrap');
        if (!Helper.nodeExists(this._notifWrap)) {
            var wrap = document.createElement('DIV');
            wrap.className = 'notification-wrap js-nofification-wrap';
            document.body.appendChild(wrap);
            this._notifWrap = Helper.$('.js-nofification-wrap');
        }
    }

    // INVOKE - New notification
    /*****************************************/
    Notifications.prototype._invoke = function(options) {
        if (typeof options.isCallback !== 'undefined' && options.isCallback === true) {
            this._invokeCallbackable(options);
            return;
        }

        var _this = this;
        var content   = '<div class="msg-body"><p>' + options.msg + '</p></div>';
        var notif     = Helper.newNode('div', 'msg-'+options.type + ' msg animate-notif', null, content, this._notifWrap);
        Helper.addClass(this._notifWrap, 'active');

        // Timout remove automatically
        _activeNotifs.push({
            node    : notif,
            timeout : setTimeout(function() {
                _this._removeNotif(notif);
            }, 6000),
        });

        // Click to remove
        notif.addEventListener('click', function() {
            _this._removeNotif(notif);
        });
    }

    // INVOKE - NOTIFICATION WITH CALLBACK
    /*****************************************/
    Notifications.prototype._invokeCallbackable = function(options) {
        var _this        = this;
        var cancelText   = typeof options.cancelText === 'undefined'  ? 'Cacnel'  : options.cancelText;
        var confirmText  = typeof options.confirmText === 'undefined' ? 'Confirm' : options.confirmText;
        var cancelClass  = typeof options.cancelClass === 'undefined'  ? 'btn-default'  : options.cancelClass;
        var confirmClass = typeof options.confirmClass === 'undefined'  ? 'btn-success'  : options.confirmClass;

        var content  = '<div class="msg-body"><p>' + options.msg + '</p><div class="row roof-xs msg-buttons"><button class="btn '+cancelClass+' cancel-msg js-cancel">'+cancelText+'</button>&nbsp;&nbsp;<button class="btn '+confirmClass+' js-confirm">' + confirmText + '</button></div></div>';
        var notif    = Helper.newNode('div', 'msg-'+options.type + ' msg animate-notif msg-confirm', null, content, this._notifWrap);
        var cancel   = Helper.$('.js-cancel', notif);
        var confirm  = Helper.$('.js-confirm', notif);
        Helper.addClass(this._notifWrap, 'active');
        
        _activeNotifs.push({
            node    : notif,
            timeout : null,
        });

        // Click cancel to remove
        cancel.addEventListener('click', function() {
            if (Helper.isCallable(options.onCancel)) options.onCancel(options.onCancelArgs);
            _this._removeNotif(notif);
        });

        // Click confirm to remove
        confirm.addEventListener('click', function() {
            if (Helper.isCallable(options.onConfirm)) options.onConfirm(options.onConfirmArgs);
            _this._removeNotif(notif);
        });
    }

    // Remove a notification 
    /*****************************************/
    Notifications.prototype._removeNotif = function(_node) {
        var _this = this;
        var i = _activeNotifs.length;
        while (i--) {
            if (_node === _activeNotifs[i].node) {
                clearTimeout(_activeNotifs[i].timeout);
                Helper.removeClass(_node, 'animate-notif');
                Helper.animate(_node, 'opacity', '1', '0', 350, 'ease');
                Helper.animate(_node, 'max-height', '100px', '0', 450, 'ease');
                _activeNotifs.splice(i, 1);
                setTimeout(function() {
                    Helper.removeFromDOM(_node);
                    if (_activeNotifs.length === 0) Helper.removeClass(_this._notifWrap, 'active');
                }, 450);
                return;
            }
        }
    }

    Modules.set('Notifications', Notifications);

})();