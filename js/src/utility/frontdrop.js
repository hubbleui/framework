(function()
{
    /**
     * Helper functions
     * 
     * @var {Function}
     */
    const [on, find, dom_element, extend] = FrontBx.import(['on','find','dom_element','extend']).from('_');

    /**
     * Helper functions
     * 
     * @var {Function}
     */
    const Drawer = FrontBx.Drawer(FrontBx.IMPORT_AS_REF);

    /**
     * @var {obj}
     */
    var DEFAULT_OPTIONS =
    {
        // Content - can be a node, nodelist, or string of HTML
        content: '',

        // Confirm button text or null + confirm button class
        confirmBtn: null,
        confirmClass: '',
        
        // Overlay color - "dark"| "light"
        overlay: 'dark',

        // Allows collapsing,expanding
        peekable: false,

        // When true allows swiping on screen to hide/show
        swipeable: false,

        // When keepEdge is true, the default state to set "expanded"|"collapsed"
        state: 'expanded',

        // Private
        animationTime: 225,
        persistentOverlay: true,
        direction: 'bottom',
        classes: '',
        persistent: false,

        // State callbacks
        callbackBuilt:    () => { },
        callbackRender:   () => { },
        callbackConfirm:  () => { },
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
     * @return {this}
     */
    const Frontdrop = function(options)
    {
        let classes = options.confirmBtn ? `frontdrop with-confirmation ${options.classes}` : `frontdrop ${options.classes}`;

        options = {...DEFAULT_OPTIONS, ...options, classes};

        let content = this._buildFD(options);

        options = {...options, content};

        this.super(options);

        if (options.confirmBtn) on(find('.js-frontdrop-confirm', content), 'click', this._closeValidate, this);
    }

    /**
     * Build the frontdrop and overlay.
     *
     * @access {private}
     */
    Frontdrop.prototype._buildFD = function(options)
    {
        let footer = options.confirmBtn ? dom_element({tag: 'div', class: 'card-footer'}, null, 
            dom_element({tag: 'div', class: 'card-footer'}, null,
                dom_element({tag: 'div', class: 'card-footer-content'}, null,
                    dom_element({tag: 'div', class: 'container-fluid'}, null,
                        dom_element({tag: 'button', type: 'button', class: `btn btn-block js-frontdrop-confirm ${options.confirmClass}`}, null, options.confirmBtn)
                    )
                )
            )
        ) : null;

        return dom_element({tag: 'div', class: 'card js-frontdrop-inner'}, null,
        [ 
            dom_element({tag: 'div', class: 'card-header'}, null,
                dom_element({tag: 'div', class: 'container-fluid'}, null, 
                    dom_element({tag: 'div', class: 'card-header-content'}, null,
                        dom_element({tag: 'div', class: 'card-title'}, null, options.title)
                    )
                )
            ),
            dom_element({tag: 'div', class: 'card-block'}, null, 
                dom_element({tag: 'div', class: 'container-fluid'}, null, options.content)
            ),
            footer
        ])
    }

    // Load into container 
    FrontBx.set('Frontdrop', extend(Drawer, Frontdrop));

})();