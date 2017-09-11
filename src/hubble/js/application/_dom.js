/**
 * DOM Manager
 *
 * @author    Joe J. Howard
 * @copyright Joe J. Howard
 * @license   https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE
 */

(function()
{
    /**
     * Module constructor
     *
     * @class
     * @constructor
     * @access public
     */
    var Dom = function()
    {
    	this._modules = {};

        return this;
    };

    /**
     * Boot Dom
     *
     * @access public
     * @param string name   Name of the module
     * @param object module Uninvoked module object
     */
    Dom.prototype.boot = function()
    {
    	this._bindModules();
    }

    /**
     * Register a DOM module (singleton)
     *
     * @access public
     * @param string name   Name of the module
     * @param object module Uninvoked module object
     * @param bool   invoke Invoke the module immediately (optional) (default false)
     */
    Dom.prototype.register = function(name, module, invoke)
    {
        invoke = (typeof invoke === 'undefined' ? false : true);

        this._modules[name] = module;

        if (invoke)
        {
            this._bindModule(name);
        }
    }

    /**
     * Refresh the DOM modiules or a string module
     *
     * @access public
     * @param string name Name of the module (optional) (default false)
     */
    Dom.prototype.refresh = function(module)
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

                    Container.get('JSHelper').collectGarbage();
                }
            }
        }
        else
        {
            this._unbindModules();

            Container.get('JSHelper').collectGarbage();

            this._bindModules();
        }
        
    }

    /**
     * Unbind listener to containers
     *
     * @param null
     * @access private
     */
    Dom.prototype._unbindModules = function()
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
     * @param  string  key Name of module to unbind
     * @access private
     */
    Dom.prototype._unbindModule = function(key)
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
     * @access private
     */
    Dom.prototype._bindModules = function()
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
     * @param string key Name of module to bind
     * @access private
     */
    Dom.prototype._bindModule = function(key)
    {
        Container.singleton(key, this._modules[key]).get(key);
    }

    /**
     * Checks if a class object has a method by name
     *
     * @access private
     * @param  mixed  classObj The object instance or reference
     * @param  string method   The name of the method to check for
     * @return bool
     */
    Dom.prototype._hasMethod = function(classObj, method)
    {
        return typeof classObj === 'object' && typeof classObj[method] === 'function';
    }

    // Load into container and invoke
    Container.singleton('HubbleDom', Dom);

})();