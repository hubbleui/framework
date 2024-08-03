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
    const [add_class, add_event_listener, array_merge, closest, has_class, inner_HTML, remove_class, remove_from_dom] = Hubble.import(['add_class','add_event_listener','array_merge','closest','has_class','inner_HTML','remove_class','remove_from_dom']).from('_');

    /**
     * @var {obj}
     */
    var DEFALT_OPTIONS =
    {
        title: '',
        message: '',
        closeAnywhere: true,
        customContent: null,

        cancelBtn: null,
        cancelClass: 'btn-danger',

        confirmBtn: null,
        confirmClass: '',
        
        overlay: 'dark',
        extras: '',

        callbackBuilt:    () => { },
        callbackRender:   () => { },
        callbackCanel:    () => { },
        callbackConfirm:  () => { },
        callbackClose:    () => { },
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
    class Modal
    { 
        constructor(options)
        {
            this._options = array_merge(DEFALT_OPTIONS, options);
            this._modal = null;
            this._overlay = null;

            this._invoke();

            return this;
        }

        /**
         * Forced close
         *
         * @access {public}
         */
        close()
        {
            const _this = this;

            add_class(this._overlay, 'transition-off');

            remove_class(document.body, 'no-scroll');

            setTimeout(function()
            {
                remove_from_dom(_this._overlay);
                remove_from_dom(_this._modal);
                remove_class(document.body, 'no-scroll');
            }, 600);
        }

        /**
         * After options have parsed invoke the modal
         *
         * @access {private}
         */
        _invoke()
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
        _buildModal()
        {
            var modal = document.createElement('DIV');
            modal.className = 'modal-wrap';

            var overlay = document.createElement('DIV');
            overlay.className = 'modal-overlay ' + this._options['overlay'];

            var content = '';

            if (this._options.customContent)
            {
                modal.innerHTML = `<div class="modal-dialog"><div class="container-fluid"><div class="card js-modal-inner">${this._options.customContent}</div></div></div>`;
            }
            else
            {
                let closeButton   = this._options.cancelBtn  ? `<button type="button" class="btn btn btn-pure ${this._options.cancelClass}  js-modal-cancel">${this._options.cancelBtn}</button>` : '';
                let confirmButton = this._options.confirmBtn ? `<button type="button" class="btn btn btn-pure ${this._options.confirmClass} js-modal-confirm">${this._options.confirmBtn}</button>` : '';

                inner_HTML(modal, [
                    '<div class="modal-dialog">',
                        '<div class="container-fluid">',
                            '<div class="card js-modal-inner">',
                                '<div class="card-header">',
                                    `<div class="card-header-content"><span class="card-title">${this._options.title}</span></div>`,
                                '</div>',
                                '<div class="card-block">',
                                    `<p>${this._options.message}</p>`,
                                '</div>',
                                this._options.extras,
                                '<div class="card-footer">',
                                    `<div class="card-footer-content">${closeButton}${confirmButton}</div>`,
                                '</div>',
                            '</div>',
                        '</div>',
                    '</div>',
                ]);
            }

            this._modal = modal;
            this._overlay = overlay;
            this._fireBuilt();
        }

        /**
         * Render the modal
         *
         * @access {private}
         */
        _render()
        {
            var _this = this;
            document.body.appendChild(this._overlay);
            document.body.appendChild(this._modal);

            this._modal.offsetHeight;

            setTimeout(() => add_class(this._overlay, 'active'), 15);

            this._fireRender();

            add_class(document.body, 'no-scroll');
        }

        /**
         * Bind event listeners inside the built modal
         *
         * @access {private}
         */
        _bindListeners()
        {
            var _this = this;

            const closeAnywhere = _this._options.closeAnywhere;

            const closeValidator = (e) =>
            {
                e = e || window.event;

                e.preventDefault();

                const clicked = e.target;

                // Clicked cancel or confirm button
                if (has_class(clicked, ['js-modal-confirm', 'js-modal-cancel']))
                {
                    if (_this._fireConfirmValidator())
                    {
                        if (has_class(clicked, 'js-modal-confirm'))
                        {
                            this._fireConfirm();
                        }
                        else
                        {
                            this._fireCancel();
                        }

                        _this.close();

                        _this._fireClosed();
                    }

                    return;
                }

                if (closeAnywhere)
                {                       
                    if (!closest(clicked, '.js-modal-inner'))
                    {
                        _this.close();

                        _this._fireClosed();
                    }
                }
            }

            add_event_listener(this._modal, 'click', closeValidator);
            add_event_listener(this._overlay, 'click', closeValidator);
            
        }

        /**
         * Fire render event
         *
         * @access {private}
         */
        _fireRender()
        {
            this._options.callbackRender.call(null, this._modal);
        }

        /**
         * Fire the closed event
         *
         * @access {private}
         */
        _fireClosed()
        {
            this._options.callbackClose.call(null, this._modal);
        }

        /**
         * Fire the confirm event
         *
         * @access {private}
         */
        _fireConfirm()
        {
            this._options.callbackConfirm.call(null, this._modal);
        }

        /**
         * Fire the confirm event
         *
         * @access {private}
         */
        _fireCancel()
        {
            this._options.callbackCanel.call(null, this._modal);
        }

        /**
         * Fire the confirm validation
         *
         * @access {private}
         */
        _fireConfirmValidator()
        {
            return this._options.callbackValidate.call(null, this._modal);
        }

        /**
         * Fire the built event
         *
         * @access {private}
         */
        _fireBuilt()
        {
            this._options.callbackBuilt.call(null, this._modal);
        }
    }

    // Load into container 
    Hubble.set('Modal', Modal);

})();
