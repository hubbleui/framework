/**
 * Modal
 *
 * The Modal class is a utility class used to
 * display a Frontdrop.
 *
 */
(function()
{
    /**
     * @var {obj}
     */
    var Helper = Container.Helper();

    /**
     * @var {obj}
     */
    var defaults =
    {
        title: '',
        content: '',
        closeAnywhere: true,
        targetContent: null,

        closeBtn: true,
        closeText: '',
        closeClass: 'btn btn-pure',

        confirmBtn: true,
        confirmText: 'Confirm',
        confirmClass: 'btn btn-primary',
        
        overlay: 'light',
        onBuilt: null,
        onBuiltArgs: null,
        onRender: null,
        onRenderArgs: null,
        onClose: null,
        onCloseArgs: null,
        validateConfirm: null,
        validateConfirmArgs: null

    };

    /**
     * Module constructor
     *
     * @class
     {*} @constructor
     * @params {options} obj
     * @access {public}
     * @return {this}
     */
    var Frontdrop = function(options)
    {
        if (typeof options !== 'undefined')
        {
            this._options = Helper.array_merge(defaults, options);
            this._timer = null;
            this._modal = null;
            this._overlay = null;
            this._modalInner = null;

            this._invoke();
        }

        return this;
    };

    /**
     * After options have parsed invoke the modal
     *
     * @access {private}
     */
    Frontdrop.prototype._invoke = function()
    {
        // Build the modal
        this._buildModal();

        // Render the modal        
        this._render();

        // Add listeners
        this._bindListeners();

        return this;
    }

    /**
     * Build the actual modal
     *
     * @access {private}
     */
    Frontdrop.prototype._buildModal = function()
    {
        var modal = document.createElement('DIV');
        modal.className = 'frontdrop-wrap';

        var overlay = document.createElement('DIV');
        overlay.className = 'frontdrop-overlay ' + this._options['overlay'];

        var close   = '';
        var content = this._options.targetContent !== null ? this._getTargetContent() : this._options.content;
        var confirm = this._options.confirmBtn === true ? '<button type="button" class="btn btn-xl ' + this._options.confirmClass + ' btn-confirm js-frontdrop-close js-frontdrop-confirm">' + this._options.confirmText + '</button>' : '';

        if (this._options.closeBtn)
        {
            if (this._options.closeText)
            {
                close = '<button type="button" class="' + this._options.closeClass + ' js-frontdrop-close">' + this._options.closeText + '</button>';
            }
            else
            {
                close = '<button type="button" class="btn btn-pure btn-sm btn-circle btn-close js-frontdrop-close"><span class="glyph-icon glyph-icon-cross2"></span></button>';
            }
        }

        Helper.inner_HTML(modal, [
            '<div class="frontdrop-dialog js-frontdrop-dialog">',
                '<div class="frontdrop-header">',
                    close,
                    '<h4 class="frontdrop-title">' + this._options.title + '</h4>',
                '</div>',
                '<div class="frontdrop-body">',
                    content,
                '</div>',
                confirm,
            '</div>',
        ]);

        this._modal      = modal;
        this._overlay    = overlay;
        this._modalInner = Helper.$('.js-frontdrop-dialog', modal);
        this._fireBuilt();
    }

    /**
     * Get modal content from an existing DOM node
     *
     * @access {private}
     * @return {string}
     */
    Frontdrop.prototype._getTargetContent = function()
    {
        var content = Helper.$(this._options.targetContent);

        if (!Helper.in_dom(content))
        {
            throw new Error('Could not find modal content with selector "' + this._options.targetContent + '"');
        }

        return content.innerHTML.trim();
    }

    /**
     * Render the modal
     *
     * @access {private}
     */
    Frontdrop.prototype._render = function()
    {
        var _this = this;
        document.body.appendChild(this._overlay);
        document.body.appendChild(this._modal);

        var overlay = this._overlay;

        setTimeout(function()
        {
            Helper.add_class(overlay, 'active');

        }, 50);

        this._fireRender();

        Helper.add_class(document.body, 'no-scroll');
    }

    /**
     * Bind event listeners inside the built modal
     *
     * @access {private}
     */
    Frontdrop.prototype._bindListeners = function()
    {
        var _this = this;

        var closeModal = function(e)
        {
            e = e || window.event;

            if (_this._options.closeAnywhere === true)
            {
                if (this === _this._modal)
                {
                    var clickedInner = Helper.closest(e.target, '.js-frontdrop-dialog');

                    if (clickedInner)
                    {
                        return;
                    }
                }
            }

            e.preventDefault();

            clearTimeout(_this._timer);

            if (Helper.has_class(this, 'js-frontdrop-confirm'))
            {
                var canClose = _this._fireConfirmValidator();

                if (!canClose)
                {
                    return;
                }
            }

            Helper.add_class(_this._overlay, 'transition-off');

            _this._fireClosed();

            if (Helper.has_class(this, 'js-frontdrop-confirm'))
            {
                _this._fireConfirm();
            }

            _this._timer = setTimeout(function()
            {
                Helper.remove_from_dom(_this._overlay);
                Helper.remove_from_dom(_this._modal);
                Helper.remove_class(document.body, 'no-scroll');
            }, 500);
        }

        if (this._options.closeAnywhere === true)
        {
            Helper.addEventListener(this._modal, 'click', closeModal, false);
        }

        var modalCloses = Helper.$All('.js-frontdrop-close', this._modal);
        if (!Helper.is_empty(modalCloses))
        {
            Helper.addEventListener(modalCloses, 'click', closeModal, false);
        }
    }

    /**
     * Fire render event
     *
     * @access {private}
     */
    Frontdrop.prototype._fireRender = function()
    {
        if (this._options.onRender !== null && Helper.is_callable(this._options.onRender))
        {
            var callback = this._options.onRender;
            var args = this._options.onRenderArgs;
            callback.apply(this._modal, args);

        }
    }

    /**
     * Fire the closed event
     *
     * @access {private}
     */
    Frontdrop.prototype._fireClosed = function()
    {
        if (this._options.onClose !== null && Helper.is_callable(this._options.onClose))
        {
            var callback = this._options.onClose;
            var args = this._options.onCloseArgs;
            callback.apply(this._modal, args);
            Helper.remove_class(document.body, 'no-scroll');
        }
    }

    /**
     * Fire the confirm event
     *
     * @access {private}
     */
    Frontdrop.prototype._fireConfirm = function()
    {
        if (this._options.onConfirm !== null && Helper.is_callable(this._options.onConfirm))
        {
            var callback = this._options.onConfirm;
            var args = this._options.onConfirmArgs;
            callback.apply(this._modal, args);
        }
    }

    /**
     * Fire the confirm validation
     *
     * @access {private}
     */
    Frontdrop.prototype._fireConfirmValidator = function()
    {
        if (this._options.validateConfirm !== null && Helper.is_callable(this._options.validateConfirm))
        {
            var callback = this._options.validateConfirm;
            var args = this._options.validateConfirmArgs;
            return callback.apply(this._modal, args);
        }

        return true;
    }

    /**
     * Fire the built event
     *
     * @access {private}
     */
    Frontdrop.prototype._fireBuilt = function()
    {
        if (this._options.onBuilt !== null && Helper.is_callable(this._options.onBuilt))
        {
            var callback = this._options.onBuilt;
            var args = this._options.onBuiltArgs;
            callback.apply(this._modal, args);
        }
    }

    // Load into container 
    Container.set('Frontdrop', Frontdrop);

})();
