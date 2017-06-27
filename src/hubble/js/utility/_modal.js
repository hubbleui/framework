/**
 * Modal
 *
 * The Modal class is a utility class used to
 * display a modal.
 *
 */
 (function() {

    /**
     * @var Helper obj
     */
    var Helper = Container.get('JSHelper');

    /**
     * Module constructor
     *
     * @class
     * @constructor
     * @params options obj
     * @access public
     * @return this
     */
    var Modal = function(options) {
        
        this._options    = options;
        this._timer      = null;
        this._modal      = null;
        this._overlay    = null;
        this._modalInner = null;


        // Default options
        this._options.overlay       = typeof options.overlay === 'undefined'  ? 'light' : options.overlay;
        this._options.onRenderArgs  = typeof options.onRenderArgs === 'undefined'  ? []   : options.onRenderArgs;
        this._options.onCloseArgs   = typeof options.onCloseArgs === 'undefined'   ? []   : options.onCloseArgs;
        this._options.onBuiltArgs   = typeof options.onBuiltArgs === 'undefined'   ? []   : options.onBuiltArgs;
        this._options.closeAnywhere = typeof options.closeAnywhere === 'undefined' ? true : options.closeAnywhere;
        this._options.centered      = typeof options.centered === 'undefined' ? true : options.centered;
        this._options.iconColor     = typeof options.type === 'undefined' ? '' : 'color-'+options.type

        // Card class
        var _cardclass = typeof options.type === 'undefined' ? '' : options.type;
        if (_cardclass === 'primary') {
            _cardclass = 'card-outline-primary';
        }
        else if (_cardclass === 'info') {
            _cardclass = 'card-outline-info';
        }
        else if (_cardclass === 'success') {
            _cardclass = 'card-outline-success';
        }
        else if (_cardclass === 'warning') {
            _cardclass = 'card-outline-warning';
        }
        else if (_cardclass === 'danger') {
            _cardclass = 'card-outline-danger';
        }
        this._options.cardclass = _cardclass;

        // header class
        var _headerclass = typeof options.header === 'undefined' ? '' : options.header;
        if (_headerclass === 'primary') {
            _headerclass = 'card-header-primary';
        }
        else if (_headerclass === 'info') {
            _headerclass = 'card-header-info';
        }
        else if (_headerclass === 'success') {
            _headerclass = 'card-header-success';
        }
        else if (_headerclass === 'warning') {
            _headerclass = 'card-header-warning';
        }
        else if (_headerclass === 'danger') {
            _headerclass = 'card-header-danger';
        }
        this._options.headerclass = _headerclass;

        this._invoke();

        return this;    
    };

    /**
     * After options have parsed invoke the modal
     *
     * @access private
     */
    Modal.prototype._invoke = function() {
        
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
     * @access private
     */
    Modal.prototype._buildModal = function() {

        var modal   = document.createElement('DIV');
            modal.className   = 'modal-wrap';

        var overlay = document.createElement('DIV');
            overlay.className = 'modal-overlay '+this._options['overlay'];

        var closeButton   = typeof this._options.closeText    === 'undefined'   ? '' : '<button type="button" class="btn js-modal-close">'+this._options.closeText+'</button>';
        var confirmClass  = typeof this._options.confirmClass === 'undefined'   ? 'btn-primary' : this._options.confirmClass;
        var confirmButton = typeof this._options.confirmText  === 'undefined'   ? '' : '<button type="button" class="btn '+confirmClass+' js-modal-close js-modal-confirm">'+this._options.confirmText+'</button>';
        var icon          = typeof this._options.icon  === 'undefined' ? '' : '<div class="row floor-sm roof-sm text-center"><span class="modal-icon '+this._options.iconColor+' glyph-icon glyph-icon-'+this._options.icon+'"></spam></div>';
        var extras        = typeof this._options.extras  === 'undefined' ? '' : this._options.extras;
        Helper.innerHTML(modal, [
            '<div class="modal-dialog js-modal-dialog">',
                '<span class="modal-closer glyph-icon glyph-icon-cross js-modal-cancel"></span>',
                '<div class="card '+this._options.cardclass+' js-modal-panel">',
                    '<div class="card-header '+this._options.headerclass+'">',
                        '<h4>'+this._options.title+'</h4>',
                    '</div>',
                    '<div class="card-block text-center">',
                            icon,
                            '<p class="card-text">'+this._options.message+'</p>',
                            extras,
                            closeButton,
                            confirmButton,
                        '</div>',
                        
                    '</div>',
                '</div>',
            '</div>',
        ]);

        this._modal = modal;
        this._overlay = overlay;
        this._modalInner = Helper.$('.js-modal-dialog', modal);
        this._fireBuilt();
    }

    /**
     * Render the modal
     *
     * @access private
     */
    Modal.prototype._render = function() {
        var _this = this;
        document.body.appendChild(this._overlay);
        document.body.appendChild(this._modal);
        this._centerModal(_this._options.centered);
        Helper.addClass(this._overlay, 'active');
        this._fireRender();
        Helper.addEventListener(window, 'resize', function modalResize() {
            _this._centerModal(_this._options.centered);
        });
        Helper.addClass(document.body, 'hide-overflow');
    }

    /**
     * Fire render event
     *
     * @access private
     */
    Modal.prototype._fireRender = function() {
        if (typeof this._options.onRender !== 'undefined') {
            var callback = this._options.onRender;
            var args     = this._options.onRenderArgs;
            callback.apply(this._modal, args);
            
        }
    }

    /**
     * Bind event listeners inside the built modal
     *
     * @access private
     */
    Modal.prototype._bindListeners = function() {
        
        var _this = this;

        var closeModal = function(e) {
            e = e || window.event;
            if (_this._options.closeAnywhere === true) {
                if (this === _this._modal) {
                    var clickedInner = Helper.closestClass(e.target, 'js-modal-dialog');
                    if (clickedInner) return;
                }
            }

            e.preventDefault();
            clearTimeout(_this._timer);
            
            if (Helper.hasClass(this, 'js-modal-confirm')) {
                var canClose = _this._fireConfirmValidator();
                if (!canClose) return;
            }
            
            Helper.addClass(_this._overlay, 'transition-off');
            _this._fireClosed();
            if (Helper.hasClass(this, 'js-modal-confirm')) _this._fireConfirm();
            _this._timer = setTimeout(function() {
                Helper.removeFromDOM(_this._overlay);
                Helper.removeFromDOM(_this._modal);
                Helper.removeClass(document.body, 'hide-overflow');
            }, 500);
        }
        
        if (this._options.closeAnywhere === true) {
            Helper.addEventListener(this._modal, 'click', closeModal, false);
        }

        var modalCloses = Helper.$All('.js-modal-close', this._modal);
        if (!Helper.empty(modalCloses)) {
            for (var i=0; i < modalCloses.length; i++) {
                Helper.addEventListener(modalCloses[i], 'click', closeModal, false);
            }
        }

        var modalCancel = Helper.$('.js-modal-cancel', this._modal);
        if (Helper.nodeExists(modalCancel)) {
            Helper.addEventListener(modalCancel, 'click', closeModal, false);
        }

        var modalConfirm = Helper.$('.js-modal-confirm', this._modal);
        var inputs = Helper.$All('input', this.modal);
        if (!Helper.empty(inputs) && Helper.nodeExists(modalConfirm)) {
            for (var j=0; j < inputs.length; j++) {
                Helper.addEventListener(inputs[j], 'keyup', this._pressEnter);
            }
        } 
    }

    /**
     * Event handler when user presses enter
     *
     * @param  e event
     * @access private
     */
    Modal.prototype._pressEnter = function(e) {
        e = e || window.event;
        if (e.keyCode == 13) {
            e.preventDefault();
            e.stopPropagation();
            var modal = Helper.closestClass(this, '.js-modal-dialog');
            var modalConfirm = Helper.$('.js-modal-confirm', this._modal);
            Helper.triggerEvent(modalConfirm, 'click');
        }
    }

    /**
     * Fire the closed event
     *
     * @access private
     */
    Modal.prototype._fireClosed = function() {
        if (typeof this._options.onClose !== 'undefined') {
            var callback = this._options.onClose;
            var args     = this._options.onCloseArgs;
            callback.apply(this._modal, args);
            Helper.removeClass(document.body, 'hide-overflow');
        }
    }

    /**
     * Fire the confirm event
     *
     * @access private
     */
    Modal.prototype._fireConfirm = function() {
        if (typeof this._options.onConfirm !== 'undefined') {
            var callback = this._options.onConfirm;
            var args     = this._options.onConfirmArgs;
            callback.apply(this._modal, args);
        }
    }

    /**
     * Fire the confirm validation
     *
     * @access private
     */
    Modal.prototype._fireConfirmValidator = function() {
        if (typeof this._options.validateConfirm !== 'undefined') {
            var callback = this._options.validateConfirm;
            var args     = this._options.validateConfirmArgs;
            return callback.apply(this._modal, args);
        }
        return true;
    }

    /**
     * Fire the built event
     *
     * @access private
     */
    Modal.prototype._fireBuilt = function() {
        if (typeof this._options.onBuilt !== 'undefined') {
            var callback = this._options.onBuilt;
            var args     = this._options.onBuiltArgs;
            callback.apply(this._modal, args);
        }
    }

    /**
     * Center the modal vertically
     *
     * @access private
     */
    Modal.prototype._centerModal = function(centered) {
        var el            = this._modalInner;
        var computedStyle = window.getComputedStyle(el);
        var h             = el.scrollHeight;
        h                 = parseInt(h);
        if (centered) {
            el.style.marginTop  = '-' + (h/2) + 'px';
        }
        else {
           el.style.top  = '0';
        }
    }

    // Load into container 
    Container.set('Modal', Modal);

})();