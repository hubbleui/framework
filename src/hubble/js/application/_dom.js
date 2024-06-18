(function()
{    
    /**
     * DOM Manager
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE}
     */
    class Dom
    {
        _modules = {};

        _ready = false;

        /**
         * Module constructor
         *
         * @class
         {*} @constructor
         * @access {public}
         */
        constructor()
        {
            window.hbDOMReady = false;

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
            this._bindModules();

            this._dispatchReady();
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
            if (!this._ready)
            {
                const event = document.createEvent('Event');

                event.initEvent('DOMReady', true, true);

                this._ready = event;
            }

            window.dispatchEvent(this._ready);
            
            window.hbDOMReady = true;
        }

        /**
         * Register a DOM module (singleton)
         *
         * @access {public}
         * @param {string} name   Name of the module
         * @param {object} module Uninvoked module object
         * @param {bool}   invoke Invoke the module immediately (optional) (default false)
         */
        register(name, module, invoke)
        {
            invoke = (typeof invoke === 'undefined' ? false : true);

            this._modules[name] = module;

            if (invoke && window.hbDOMReady)
            {
                this._bindModule(name);
            }
        }

        /**
         * Refresh the DOM modiules or a string module
         *
         * @access {public}
         * @param {string} name Name of the module (optional) (default false)
         */
        refresh(module)
        {
            module = (typeof module === 'undefined' ? false : module);

            if (module)
            {
                for (var key in this._modules)
                {
                    if (!this._modules.hasOwnProperty(key))
                    {
                        continue;
                    }

                    if (module === key)
                    {
                        this._unbindModule(key);

                        this._bindModule(key);

                        Container.Helper().collectGarbage();
                    }
                }
            }
            else
            {
                window.hbDOMReady = false;

                this._unbindModules();

                Container.Helper().collectGarbage();

                this._bindModules();

                this._dispatchReady();
            }
        }

        /**
         * Unbind listener to containers
         *
         * @param {null}
         * @access {private}
         */
        _unbindModules()
        {
            for (var key in this._modules)
            {
                if (!this._modules.hasOwnProperty(key))
                {
                    continue;
                }

                this._unbindModule(key);
            }
        }

        /**
         * Unbind a single module
         *
         * @param  {string}  key Name of module to unbind
         * @access {private}
         */
        _unbindModule(key)
        {
            var module = Container.get(key);

            if (this._hasMethod(module, 'destruct'))
            {
                module.destruct();
            }

            Container.delete(key);
        }

        /**
         * Unbind listener to containers
         *
         * @access {private}
         */
        _bindModules()
        {            
            for (var key in this._modules)
            {
                if (!this._modules.hasOwnProperty(key))
                {
                    continue;
                }

                this._bindModule(key);
            }
        }

        /**
         * Bind a single module
         *
         * @param {string} key Name of module to bind
         * @access {private}
         */
        _bindModule(key)
        {
            Container.singleton(key, this._modules[key], true);
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
