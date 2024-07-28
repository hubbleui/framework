(function()
{
    const [$All, each, closest, is_empty] = Container.import(['$All','each','closest','is_empty']).from('_');

    /**
     * Component base class
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE}
     */
    const Component = function(selector)
    {
        this._DOMElements = [];

        this._selector = selector;

        this.construct(document);

        return this;
    }

    /**
     * Module constructor
     *
     * @access {public}
     */
    Component.prototype.construct = function(context)
    {        
        let nodes = $All(this._selector, context);

        if (context !== document) nodes.unshift(context);

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
    Container.set('Component', [Component]);

})();
