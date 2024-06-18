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
     * @var {obj}
     */
    var Helper = Container.Helper();

    /**
     * @var {obj}
     */
    var defaults = {
        title: '',
        message: '',
        closeAnywhere: true,
        targetContent: null,

        cancelBtn: true,
        cancelText: 'Cancel',
        cancelClass: 'btn btn-pure',

        confirmBtn: true,
        confirmClass: 'btn btn-pure btn-primary',
        confirmText: 'Confirm',
        overlay: 'light',
        extras: '',

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
    var Modal = function(options)
    {
        this._options = Helper.array_merge(defaults, options);
        this._timer = null;
        this._modal = null;
        this._overlay = null;
        this._modalInner = null;

        this._invoke();

        return this;
    };

    /**
     * After options have parsed invoke the modal
     *
     * @access {private}
     */
    Modal.prototype._invoke = function()
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
    Modal.prototype._buildModal = function()
    {
        var modal = document.createElement('DIV');
        modal.className = 'modal-wrap';

        var overlay = document.createElement('DIV');
        overlay.className = 'modal-overlay ' + this._options['overlay'];

        var content = '';

        if (this._options.targetContent)
        {
            modal.innerHTML = this._buildTargetModal();
        }
        else
        {
            var closeButton = this._options.cancelBtn === true ? '<button type="button" class="btn ' + this._options.cancelClass + ' js-modal-close js-modal-cancel">' + this._options.cancelText + '</button>' : '';
            var confirmButton = this._options.confirmBtn === true ? '<button type="button" class="btn ' + this._options.confirmClass + ' js-modal-close js-modal-confirm">' + this._options.confirmText + '</button>' : '';

            Helper.inner_HTML(modal, [
                '<div class="modal-dialog js-modal-dialog">',
                '<div class="card js-modal-panel">',
                '<div class="card-header">',
                '<h4 class="card-title">' + this._options.title + '</h4>',
                '</div>',
                this._options.extras,
                '<div class="card-block">',
                '<p class="card-text">' + this._options.message + '</p>',
                '</div>',
                '<div class="card-actions">',
                closeButton,
                confirmButton,
                '</div>',
                '</div>',
                '</div>',
            ]);
        }

        this._modal = modal;
        this._overlay = overlay;
        this._modalInner = Helper.$('.js-modal-dialog', modal);
        this._fireBuilt();
    }

    /**
     * Get modal content from an existing DOM node
     *
     * @access {private}
     * @return {string}
     */
    Modal.prototype._buildTargetModal = function()
    {
        var content = Helper.$(this._options.targetContent);

        if (!Helper.in_dom(content))
        {
            throw new Error('Could not find modal content with selector "' + this._options.targetContent + '"');
        }

        return '<div class="modal-dialog js-modal-dialog"><div class="card js-modal-panel">' + content.innerHTML + '</div></div>';
    }

    /**
     * Render the modal
     *
     * @access {private}
     */
    Modal.prototype._render = function()
    {
        var _this = this;
        document.body.appendChild(this._overlay);
        document.body.appendChild(this._modal);

        this._centerModal();

        Helper.add_class(this._overlay, 'active');

        this._fireRender();

        Helper.addEventListener(window, 'resize', function modalResize()
        {
            _this._centerModal();
        });

        Helper.add_class(document.body, 'no-scroll');
    }

    /**
     * Bind event listeners inside the built modal
     *
     * @access {private}
     */
    Modal.prototype._bindListeners = function()
    {
        var _this = this;

        var closeModal = function(e)
        {
            e = e || window.event;

            if (_this._options.closeAnywhere === true)
            {
                if (this === _this._modal)
                {
                    var clickedInner = Helper.closest(e.target, '.js-modal-dialog');

                    if (clickedInner)
                    {
                        return;
                    }
                }
            }

            e.preventDefault();

            clearTimeout(_this._timer);

            if (Helper.has_class(this, 'js-modal-confirm'))
            {
                var canClose = _this._fireConfirmValidator();

                if (!canClose)
                {
                    return;
                }
            }

            Helper.add_class(_this._overlay, 'transition-off');

            _this._fireClosed();

            if (Helper.has_class(this, 'js-modal-confirm'))
            {
                _this._fireConfirm();
            }

            _this._timer = setTimeout(function()
            {
                Helper.remove_from_dom(_this._overlay);
                Helper.remove_from_dom(_this._modal);
                Helper.remove_class(document.body, 'no-scroll');
            }, 600);
        }

        if (this._options.closeAnywhere === true)
        {
            Helper.addEventListener(this._modal, 'click', closeModal, false);
        }

        var modalCloses = Helper.$All('.js-modal-close', this._modal);
        if (!Helper.is_empty(modalCloses))
        {
            Helper.addEventListener(modalCloses, 'click', closeModal, false);
        }

        var modalCancel = Helper.$('.js-modal-cancel', this._modal);
        if (Helper.in_dom(modalCancel))
        {
            Helper.addEventListener(modalCancel, 'click', closeModal, false);
        }
    }

    /**
     * Fire render event
     *
     * @access {private}
     */
    Modal.prototype._fireRender = function()
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
    Modal.prototype._fireClosed = function()
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
    Modal.prototype._fireConfirm = function()
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
    Modal.prototype._fireConfirmValidator = function()
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
    Modal.prototype._fireBuilt = function()
    {
        if (this._options.onBuilt !== null && Helper.is_callable(this._options.onBuilt))
        {
            var callback = this._options.onBuilt;
            var args = this._options.onBuiltArgs;
            callback.apply(this._modal, args);
        }
    }

    /**
     * Center the modal vertically
     *
     * @access {private}
     */
    Modal.prototype._centerModal = function()
    {
        var el = this._modalInner;
        var computedStyle = window.getComputedStyle(el);
        var modalH = parseInt(el.offsetHeight);
        var windowH = window.innerHeight || document.documentElement.clientHeight || getElementsByTagName('body')[0].clientHeight;

        // If the window height is less than the modal dialog
        // We need to adjust the dialog so it is at the top of the page
        if (windowH <= modalH)
        {
            el.style.marginTop = '0px';
            el.style.top = '0';
        }
        else
        {
            el.style.marginTop = '-' + (modalH / 2) + 'px';
            el.style.top = '50%';
        }
    }

    // Load into container 
    Container.set('Modal', Modal);

})();
