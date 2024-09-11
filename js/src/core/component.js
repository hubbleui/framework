(function()
{
    const [find_all, each, closest, is_empty] = FrontBx.import(['find_all','each','closest','is_empty']).from('_');

    /**
     * Component base class
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.comfrontbx/uimaster/LICENSE}
     */
    const Component = function(selector)
    {
        /**
         * Default props.
         *
         * @var {object}
         */
        this.defaultProps = !this.defaultProps ? {} : this.defaultProps;

        /**
         * Selector.
         *
         * @var {string}
         */
        this._selector = selector;

        /**
         * Dom elements
         *
         * @var {array}
         */
        this._DOMElements = [];

        // Init
        if (!is_empty(this._selector)) this.construct(document);

        return this;
    }

    /**
     * Module constructor
     *
     * @access {public}
     */
    Component.prototype.construct = function(context)
    {
        if (is_empty(this._selector)) return;

        let nodes = find_all(this._selector, context, context !== document);

        if (!is_empty(nodes))
        {
            this._DOMElements = [...this._DOMElements, ...nodes];

            each(nodes, (i, node) => this.bind(node), this);
        }
    }

    /**
     * Module destructor
     *
     * @access {public}
     */
    Component.prototype.destruct = function(context)
    {
        if (!context || context === document)
        {
            each(this._DOMElements, (i, node) => this.unbind(node), this);
            
            this._DOMElements = [];

            return;
        }

        const _this = this;

        each(this._DOMElements, function(i, DOMElement)
        {                
            if (closest(DOMElement, context))
            {
                _this.unbind(DOMElement);

                _this._DOMElements.splice(i, 1);
            }
        });
    }

    /**
     * Create DOM elements and bind
     * 
     */
    Component.prototype.create = function(props, appendTo)
    {
        props = !props ? {} : props;

        props = {...this.defaultProps, ...props};

        let node = this.template(props);

        if (appendTo) appendTo.appendChild(node);

        FrontBx.Dom().refresh(node);

        return node;
    }

    /**
     * Template abstract method
     *
     * @access {public}
     */
    Component.prototype.template = function()
    {
        throw new Error('[template] method must be implemented.');
    }


    /**
     * Bind abstract method
     *
     * @access {public}
     */
    Component.prototype.bind = function(context)
    {
        throw new Error('[bind] method must be implemented.');
    }

    /**
     * Unbind abstract method
     *
     * @access {public}
     */
    Component.prototype.unbind = function(context)
    {
        throw new Error('[unbind] method must be implemented.');
    }

    // Register
    FrontBx.set('Component', [Component]);

})();