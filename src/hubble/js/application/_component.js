(function()
{
    const [$All, each, closest] = Container.import(['$All','each','closest']).from('Helper');

    /**
     * Component base class
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE}
     */
    class Component
    {
        /**
         * Constructor.
         *
         * @access {public}
         * @param  {string} selector DOM Elements selector
         */
        constructor(selector)
        {
            this._DOMElements = [];

            this._selector = selector;
            
            this.construct(document);
        }

        /**
         * Module destructor - removes event listeners
         *
         * @access {public}
         */
        construct(context)
        {
            let nodes = $All(this._selector, context);

            if (context !== document) nodes.unshift(context);

            this._DOMElements = [...this._DOMElements, ...nodes];

            each(nodes, (i, node) => this.bind(node), this);
        }

        /**
         * Module destructor - removes event listeners
         *
         * @access {public}
         */
        destruct(context)
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
         * Insert ripples
         *
         * @access {private}
         */
        bind(node)
        {
        }

        /**
         * Insert ripples
         *
         * @access {private}
         */
        unbind(node)
        {
        }
    }
    
    // Register
    Container.set('Component', [Component]);

})();
