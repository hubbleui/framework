(function()
{
    /**
     * Utility functions
     *
     * @var {Function}
     */
    const [each, trigger_event, collect_garbage, is_undefined, is_string, is_htmlElement] = FrontBx.import(['each', 'trigger_event', 'collect_garbage', 'is_undefined', 'is_string', 'is_htmlElement']).from('_');

    /**
     * Prefix for container.
     *
     * @var {String}
     */
    const KEYPREFIX = 'HB_DOM:';

    /**
     * DOM Manager
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.comfrontbx/uimaster/LICENSE}
     */
    const Dom = function()
    {
        this._isReady = false;

        this.components = [];
    }

    /**
     * Boot Dom
     *
     * @access {public}
     * @param {string} name   Name of the module
     * @param {object} module Uninvoked module object
     */
    Dom.prototype.boot = function()
    {
        each(this.components, function(i, name)
        {
            this._bindComponent(name, document);

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
    Dom.prototype.register = function(name, component, invoke)
    {
        invoke = (typeof invoke === 'undefined' ? false : invoke);

        this.components.push(name);

        FrontBx.singleton(this._normaliseKey(name), component);

        if (invoke || this._isReady)
        {
            this._bindComponent(name, document);
        }
    }

    /**
     * Returns a component.
     *
     * @access {public}
     */
    Dom.prototype.component = function(name)
    {
        return FrontBx.get(this._normaliseKey(name));
    }

    /**
     * Returns a component.
     *
     * @access {public}
     */
    Dom.prototype.create = function(name, options, appendTo)
    {
        return this.component(name).create(options, appendTo);
    }

    /**
     * Boot Dom
     *
     * @access {public}
     * @param {string} name   Name of the module
     * @param {object} module Uninvoked module object
     */
    Dom.prototype._dispatchReady = function()
    {
        trigger_event(window, 'FrontBx:dom:ready', {dom: this});
    }

    /**
     * Boot Dom
     *
     * @access {public}
     * @param {string} name   Name of the module
     * @param {object} module Uninvoked module object
     */
    Dom.prototype._dispatchComponent = function(name, event, component, context)
    {
        trigger_event(window, `FrontBx:dom:${event}:${name}`, { component: component, context: context});
    }

    /**
     * Bind a single module
     *
     * @param {string} key Name of module to bind
     * @access {private}
     */
    Dom.prototype._bindComponent = function(name, context, isRefresh)
    {                
        let component = FrontBx.get(this._normaliseKey(name));

        if (this._hasMethod(component, 'construct') && isRefresh)
        {
            component.construct(context);
            
            this._dispatchComponent(name, 'refresh', component, context);
        }

        this._dispatchComponent(name, 'bind', component, context);
    }

    /**
     * Unbind a single module
     *
     * @param  {string}  key Name of module to unbind
     * @access {private}
     */
    Dom.prototype._unbindComponent = function(name, context)
    {            
        let component = FrontBx.get(this._normaliseKey(name));

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
    Dom.prototype.refresh = function(component, context)
    {
        let globalRefresh = false;

        // refresh()
        if (arguments.length === 0)
        {
            component = false;

            context = document;

            globalRefresh = true;
        }
        else
        {
            // refresh(DOMElement)
            if (is_htmlElement(component))
            {
                context  = component;
                
                component = false;

                globalRefresh = true;
            }

            // refresh('module')
            // refresh('module', DOMElement)
            else if (is_string(component))
            {
                context = is_undefined(context) ? document : context;
            }
        }

        each(this.components, function(i, name)
        {
            if (!component || component === name)
            {
                this._unbindComponent(name, context);

                collect_garbage();

                this._bindComponent(name, context, true);
            }
        }, this);

        trigger_event(window, `FrontBx:dom:refresh`, { context: context});

        if (globalRefresh) this._dispatchReady();
    }

    /**
     * Checks if a class object has a method by name
     *
     * @access {private}
     * @param  {mixed}  classObj The object instance or reference
     * @param  {string} method   The name of the method to check for
     * @return {bool}
     */
    Dom.prototype._hasMethod = function(classObj, method)
    {
        return typeof classObj === 'object' && typeof classObj[method] === 'function';
    }

    /**
     * Normalize key
     *
     * @access {public}
     * @param {string} name   Name of the module
     * @param {object} module Uninvoked module object
     */
    Dom.prototype._normaliseKey = function(key)
    {
        return `${KEYPREFIX}${key}`;
    }

    // Load into container and invoke
    FrontBx.singleton('Dom', Dom);
    
})();