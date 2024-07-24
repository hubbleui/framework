(function()
{    
    const [each, trigger_event, collect_garbage] = Container.import(['each', 'trigger_event', 'collect_garbage']).from('Helper');

    /**
     * DOM Manager
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE}
     */
    class Dom
    {
        /**
         * Module constructor
         *
         * @class
         * @access {public}
         */
        constructor()
        {
            this._isReady = false;

            this.components = [];

            return this;
        }

        /**
         * Boot Dom
         *
         * @access {public}
         * @param {string} name   Name of the module
         * @param {object} module Uninvoked module object
         */
        boot()
        {
            each(this.components, function(i, name)
            {
                const component = Container.get(`HB_DOM:${name}`);

                this._dispatchComponent(name, 'bind', component, document);

            }, this);

            this._dispatchReady();

            this._isReady = true;
        }

        /**
         * Register a DOM component
         *
         * @access {public}
         * @param {string} name   Name of the module
         * @param {object} module Uninvoked module object
         * @param {bool}   invoke Invoke the module immediately (optional) (default false)
         */
        register(name, component, invoke)
        {
            invoke = (typeof invoke === 'undefined' ? false : this._isReady);

            this.components.push(name);

            Container.singleton(`HB_DOM:${name}`, component);

            if (invoke)
            {
                this._bindComponent(name, document);
            }
        }

        /**
         * Boot Dom
         *
         * @access {public}
         * @param {string} name   Name of the module
         * @param {object} module Uninvoked module object
         */
        _dispatchReady()
        {
            trigger_event(window, 'Hubble:dom:ready', this);
        }

        /**
         * Boot Dom
         *
         * @access {public}
         * @param {string} name   Name of the module
         * @param {object} module Uninvoked module object
         */
        _dispatchComponent(name, event, component, context)
        {
            trigger_event(window, `Hubble:dom:refresh:${name}:${event}`, { component: component, context: context});
        }

        /**
         * Bind a single module
         *
         * @param {string} key Name of module to bind
         * @access {private}
         */
        _bindComponent(name, context)
        {
            let component = Container.get(`HB_DOM:${name}`);

            if (this._hasMethod(component, 'construct'))
            {
                component.construct(context);
            }

            this._dispatchComponent(name, 'bind', component, context);
        }

        /**
         * Unbind a single module
         *
         * @param  {string}  key Name of module to unbind
         * @access {private}
         */
        _unbindComponent(name, context)
        {            
            let component = Container.get(`HB_DOM:${name}`);

            if (this._hasMethod(component, 'destruct'))
            {
                component.destruct(context);
            }

            this._dispatchComponent(name, 'unbind', component, context);

        }
        
        /**
         * Refresh the DOM modiules or a string module
         *
         * @access {public}
         * @param {string} name Name of the module (optional) (default false)
         */
        refresh(component, context)
        {
            component = (typeof component === 'undefined' ? false : component);

            // refresh(DOMElement)
            if (component instanceof Element || component instanceof HTMLDocument)
            {
                context = component;
                component  = null;
            }
            // refresh('module')
            // refresh('module', DOMElement)
            else if (typeof component === 'string')
            {
                context = (context instanceof Element || context instanceof HTMLDocument) ? context : document;
            }

            each(this.components, function(i, name)
            {
                if (!component || component === name)
                {
                    this._unbindComponent(name, context);

                    collect_garbage();

                    this._bindComponent(name, context);
                }
            }, this);
        }

        /**
         * Checks if a class object has a method by name
         *
         * @access {private}
         * @param  {mixed}  classObj The object instance or reference
         * @param  {string} method   The name of the method to check for
         * @return {bool}
         */
        _hasMethod(classObj, method)
        {
            return typeof classObj === 'object' && typeof classObj[method] === 'function';
        }
    }

    // Load into container and invoke
    Container.singleton('HubbleDom', Dom);

})();
