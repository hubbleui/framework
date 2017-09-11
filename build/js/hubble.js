// Container
/**
 * JS IoC Container
 *
 * @author    Joe J. Howard
 * @copyright Joe J. Howard
 * @license   https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE
 */

(function(window)
{
	var Container = function()
	{
		this.data = {};

		this.singletons = {};

		return this;
	};

    /**
     * Set data key to value
     *
     * @access public
     * @param string key   The data key
     * @param mixed  value The data value
     */
    Container.prototype.set = function(key, value)
    {
        this.data[key] = value;
    }

    /**
     * Remove a key/value
     *
     * @access public
     * @param string key   The data key
     */
    Container.prototype.delete = function(key)
    {
        delete this.data[key];
    }

    /**
     * Stores a globally unique singleton
     *
     * @access public
     * @param  string key      The value or object name
     * @param  object classObj The closure that defines the object
     * @return this
     */
    Container.prototype.singleton = function(key, classObj)
    {
    	var args = this._normalizeArgs(arguments);

    	var instance;

    	this.singletons[key] = true;

        this.set(key, function()
        {
        	if (!instance)
        	{        		
        		if (!this._isInvoked(instance))
	            {
	            	instance = this._newInstance(classObj, args);
	            }
        	}

            return instance;
        });

        return this;
    }

    /**
     * Get data value with key
     *
     * @access public
     * @param  string key The data key
     * @param  mixed  ... Any additional parameters to pass to the constructor (optional) (default null)
     * @return mixed      The data value
     */
    Container.prototype.get = function(key)
    {
        if (this.has(key))
        {
        	if (this._isSingleton(key))
            {
            	return this.data[key].apply(this);
            }
            else if (this._isInvokable(this.data[key]))
            {
            	return this._newInstance(this.data[key], arguments);
            }

            return this.data[key];
        }

        return false;
    }

    /**
     * Does this set contain a key?
     *
     * @access public
     * @param  string  key The data key
     * @return boolean
     */
    Container.prototype.has = function(key)
    {
        for (var _key in this.data)
	    {
	        if (_key === key)
	        {
	        	return true;
	        }
	    }

    	return false;
    }
	
	/**
     * Checks if key is a singleton
     *
     * @access private
     * @
     * @return bool
     */
    Container.prototype._isSingleton = function(key)
	{	    
	    for (var _key in this.singletons)
	    {
	        if (_key === key)
	        {
	        	return true;
	        }
	    }

    	return false;
	}

    /**
     * Checks if a variable is invokable
     *
     * @access private
     * @param  mixed mixedVar The object instance or reference
     * @return bool
     */
	Container.prototype._isInvokable = function(mixedVar)
	{
		return Object.prototype.toString.call( mixedVar ) === '[object Function]';
	}

    /**
     * Checks if a class object has been invoked
     *
     * @access private
     * @param  mixed classObj The object instance or reference
     * @return bool
     */
	Container.prototype._isInvoked = function(classObj)
	{
		return typeof classObj === 'object';
	}

	/**
     * Invokes and returns a new class instance
     *
     * @access private
     * @param  mixed classObj The object instance or reference
     * @param  array args     Arguements to pass to class constructor (optional) (default null)
     * @return object
     */
	Container.prototype._newInstance = function(reference, args)
	{
		return new (Function.prototype.bind.apply(reference, args));
	}

    /**
     * Fixes args passed to constructors 
     *
     * @access private
     * @param  array args Array of args passed to origional function
     * @return array
     */
    Container.prototype._normalizeArgs = function(args)
    {
        if ( Object.prototype.toString.call( args ) === '[object Arguments]')
        {
            var _args = Array.prototype.slice.call(args);
            
            _args.shift();

            return _args;
        }

        return args;
    }

	/**
     * Loads container into global namespace as "Hubble"
     *
     */
	if (!window.Container)
	{
		var ContainerInstance = new Container();

		window.Container = ContainerInstance;
	}

})(window);

/**
 * Application core
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
     * @params null
     * @access public
     */
    var Application = function()
    {
        return this;
    };

    /**
     * Called when the application is first initialized
     *
     * @access public
     */
    Application.prototype.boot = function()
    {
        this.dom().boot();
    }

    /**
     * Get the Container component
     *
     * @access public
     * @return object
     */
    Application.prototype.container = function()
    {
        return Container;
    }

    /**
     * Get the DOM component
     *
     * @access public
     * @return object
     */
    Application.prototype.dom = function()
    {
        return Container.get('HubbleDom');
    }

    /**
     * Get the Helper component
     *
     * @access public
     * @return object
     */
    Application.prototype.helper = function()
    {
        return Container.get('JSHelper');
    }

    /**
     * Require a module and/or key/value
     *
     * @access public
     * @param  string key The name of the key
     * @return mixed
     */
    Application.prototype.require = function(key)
    {
        return Container.get.apply(Container, arguments);
    }

    // Loads into container
    Container.singleton('Hubble', Application);

    if (!window.Hubble)
    {
        window.Hubble = Container.get('Hubble');
    }
    
})();
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

// Helper
/**
 * JavaScript helper library
 *
 * @author    Joe J. Howard
 * @copyright Joe J. Howard
 * @license   https://github.com/kanso-cms/cms/blob/master/LICENSE
 */

(function()
{
    /**
     * Module constructor
     *
     * @access public
     * @constructor
     */
    var JSHelper = function()
    {

        this.version = "1.0.0";

        this.author = "Joe Howard";

        this.browser = false;

        this.cssPrefixable = [

            // transitions
            'transition',
            'transition-delay',
            'transition-duration',
            'transition-property',
            'transition-timing-function',

            // trnasforms
            'transform',
            'transform-origin',
            'transform-style',
            'perspective',
            'perspective-origin',
            'backface-visibility',

            // misc
            'box-sizing',
            'calc',
            'flex',
        ];

        this.cssPrefixes = [
            'webkit',
            'Moz',
            'ms',
            'O',
        ];

        this.cssEasings = {

            // Defaults
            ease: 'ease',
            linear: 'linear',
            easeIn: 'ease-in',
            easeOut: 'ease-out',
            easeInOut: 'ease-in-out',

            // sine
            easeInSine: 'cubic-bezier(0.47, 0, 0.745, 0.715)',
            easeOutSine: 'cubic-bezier(0.39, 0.575, 0.565, 1)',
            easeInOutSine: 'cubic-bezier(0.445, 0.05, 0.55, 0.95)',

            // Quad
            easeInQuad: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
            easeOutQuad: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            easeInOutQuad: 'cubic-bezier(0.455, 0.03, 0.515, 0.955)',

            // Cubic
            easeInCubic: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
            easeOutCubic: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
            easeInOutCubic: 'cubic-bezier(0.645, 0.045, 0.355, 1)',

            // Queart
            easeInQuart: 'cubic-bezier(0.895, 0.03, 0.685, 0.22)',
            easeOutQuart: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
            easeInOutQuart: 'cubic-bezier(0.77, 0, 0.175, 1)',

            // Quint
            easeInQuint: 'cubic-bezier(0.755, 0.05, 0.855, 0.06)',
            easeOutQuint: 'cubic-bezier(0.23, 1, 0.32, 1)',
            easeInOutQuint: 'cubic-bezier(0.86, 0, 0.07, 1)',

            // Expo
            easeInExpo: 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
            easeOutExpo: 'cubic-bezier(0.19, 1, 0.22, 1)',
            easeInOutExpo: 'cubic-bezier(1, 0, 0, 1)',

            // Circ
            easeInCirc: 'cubic-bezier(0.6, 0.04, 0.98, 0.335)',
            easeOutCirc: 'cubic-bezier(0.075, 0.82, 0.165, 1)',
            easeInOutCirc: 'cubic-bezier(0.785, 0.135, 0.15, 0.86)',

            // Back
            easeInBack: 'cubic-bezier(0.6, -0.28, 0.735, 0.045)',
            easeOutBack: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            easeInBack: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',

        };

        /**
         * List of shorthand properties and their longhand equivalents
         *
         * @var object
         */
        this.shortHandProps = {
            // CSS 2.1: http://www.w3.org/TR/CSS2/propidx.html
            'list-style':      ['-type', '-position', '-image'],
            'margin':          ['-top', '-right', '-bottom', '-left'],
            'outline':         ['-width', '-style', '-color'],
            'padding':         ['-top', '-right', '-bottom', '-left'],

            // CSS Backgrounds and Borders Module Level 3: http://www.w3.org/TR/css3-background/
            'background':     ['-image', '-position', '-size', '-repeat', '-origin', '-clip', '-attachment', '-color'],
            'border':         ['-width', '-style', '-color'],
            'borderColor':    ['border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color'],
            'borderStyle':    ['border-top-style', 'border-right-style', 'border-bottom-style', 'border-left-style'],
            'borderWidth':    ['border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width'],
            'borderTop':      ['-width', '-style', '-color'],
            'borderTight':    ['-width', '-style', '-color'],
            'borderBottom':   ['-width', '-style', '-color'],
            'borderLeft':     ['-width', '-style', '-color'],
            'borderRadius':   ['border-top-left-radius', 'border-top-right-radius', 'border-bottom-right-radius', 'border-bottom-left-radius'],
            'borderImage':    ['-source', '-slice', '-width', '-outset', '-repeat'],

            // CSS Fonts Module Level 3: http://www.w3.org/TR/css3-fonts/
            'font':            ['-style', '-variant', '-weight', '-stretch', '-size', 'line-height', '-family'],
            'fontVariant':     ['-ligatures', '-alternates', '-caps', '-numeric', '-east-asian'],

            // CSS Masking Module Level 1: http://www.w3.org/TR/css-masking/
            'mask':            ['-image', '-mode', '-position', '-size', '-repeat', '-origin', '-clip'],
            'maskBorder':      ['-source', '-slice', '-width', '-outset', '-repeat', '-mode'],

            // CSS Multi-column Layout Module: http://www.w3.org/TR/css3-multicol/
            'columns':         ['column-width', 'column-count'],
            'columnRule':      ['-width', '-style', '-color'],

            // CSS Speech Module: http://www.w3.org/TR/css3-speech/
            'cue':             ['-before', '-after'],
            'pause':           ['-before', '-after'],
            'rest':            ['-before', '-after'],

            // CSS Text Decoration Module Level 3: http://www.w3.org/TR/css-text-decor-3/
            'textDecoration':  ['-line', '-style', '-color'],
            'textEmphasis':    ['-style', '-color'],

            // CSS Animations (WD): http://www.w3.org/TR/css3-animations
            'webkitAnimation': ['-name', '-duration', '-timing-function', '-delay', '-iteration-count', '-direction', '-fill-mode', '-play-state'],
            'MozAnimation':    ['-name', '-duration', '-timing-function', '-delay', '-iteration-count', '-direction', '-fill-mode', '-play-state'],
            'msAnimation':     ['-name', '-duration', '-timing-function', '-delay', '-iteration-count', '-direction', '-fill-mode', '-play-state'],
            'Oanimation':      ['-name', '-duration', '-timing-function', '-delay', '-iteration-count', '-direction', '-fill-mode', '-play-state'],
            'animation':       ['-name', '-duration', '-timing-function', '-delay', '-iteration-count', '-direction', '-fill-mode', '-play-state'],

            // CSS Transitions (WD): http://www.w3.org/TR/css3-transitions/
            'webkitTransition': ['-property', '-duration', '-timing-function', '-delay'],
            'MozTransition':    ['-property', '-duration', '-timing-function', '-delay'],
            'msTransition':     ['-property', '-duration', '-timing-function', '-delay'],
            'OTransition':      ['-property', '-duration', '-timing-function', '-delay'],
            'transition':       ['-property', '-duration', '-timing-function', '-delay'],

            // CSS Flexible Box Layout Module Level 1 (WD): http://www.w3.org/TR/css3-flexbox/
            'webkitFlex':      ['-grow', '-shrink', '-basis'],
            'msFlex':          ['-grow', '-shrink', '-basis'],
            'flex':            ['-grow', '-shrink', '-basis'],
        };

        this._events = {};

        return this;

    };

    // reset the prototype
    JSHelper.prototype = {};

    // Destructor
    JSHelper.prototype.destruct = function()
    {
        this.clearEventListeners();
    }


/**
 * JSHelper DOM helpers
 *
 * @author    Joe J. Howard
 * @copyright Joe J. Howard
 * @license   https://github.com/kanso-cms/cms/blob/master/LICENSE
 */

/**
 * Select and return all nodes by selector
 *
 * @access public
 * @param  string selector CSS selector
 * @param  node   context (optional) (default document)
 * @return node
 */
JSHelper.prototype.$All = function(selector, context)
{
    context = (typeof context === 'undefined' ? document : context);
    return Array.prototype.slice.call(context.querySelectorAll(selector));
}

/**
 * Select single node by selector
 *
 * @access public
 * @param  string selector CSS selector
 * @param  node   context (optional) (default document)
 * @return node
 */
JSHelper.prototype.$ = function(selector, context)
{
    context = (typeof context === 'undefined' ? document : context);
    return context.querySelector(selector)
}

/**
 * Closest parent node by type
 *
 * @access public
 * @param  node   el   Target element
 * @param  string type Node type to find
 * @return node\null
 */
JSHelper.prototype.closest = function(el, type)
{
    type = type.toLowerCase();
    if (typeof el === "undefined") return null;
    if (el.nodeName.toLowerCase() === type) return el;
    if (el.parentNode && el.parentNode.nodeName.toLowerCase() === type) return el.parentNode;
    var parent = el.parentNode;
    while (parent !== document.body && typeof parent !== "undefined" && parent !== null)
    {
        parent = parent.parentNode;
        if (parent && parent.nodeName.toLowerCase() === type) return parent;
    }
    return null;
}

/**
 * Closest parent node by class
 *
 * @access public
 * @param  node   el   Target element
 * @param  string type Node type to find
 * @return node\null
 */
JSHelper.prototype.closestClass = function(el, clas)
{
    if (this.hasClass(el, clas))
    {
        return el;
    }
    if (this.hasClass(el.parentNode, clas))
    {
        return el.parentNode;
    }
    var parent = el.parentNode;
    if (parent === window.document)
    {
        return null;
    }
    while (parent !== document.body)
    {
        if (this.hasClass(parent, clas))
        {
            return parent;
        }

        if (parent === null || typeof parent === 'undefined')
        {
            return null;
        }

        parent = parent.parentNode;
    }
    return null;
}

/**
 * Get all first level children
 *
 * @access public
 * @param  node   el   Target element
 * @return node\null
 */
JSHelper.prototype.firstChildren = function(el)
{
    var children = [];
    var childnodes = el.childNodes;
    for (var i = 0; i < childnodes.length; i++)
    {
        if (childnodes[i].nodeType == 1)  children.push(childnodes[i]);
    }
    return children;
}

/**
 * Traverse nextSibling untill type
 *
 * @access public
 * @param  node   el   Target element
 * @param  string type Target node type
 * @return node\null
 */
JSHelper.prototype.nextUntillType = function(el, type)
{
    type = type.toLowerCase();
    if (el.nextSibling && el.nextSibling.nodeName.toLowerCase() === type) return el.nextSibling;
    var next = el.nextSibling;
    while (next !== document.body && typeof next !== "undefined" && next !== null)
    {
        next = next.nextSibling;
        if (next && next.nodeName.toLowerCase() === type)
        {
            return next;
        }
    }
    return null;
}

/**
 * Traverse nextSibling untill class
 *
 * @access public
 * @param  node   el        Target element
 * @param  string className Target node classname
 * @return node\null
 */
JSHelper.prototype.nextUntillClass = function(el, className)
{
    if (el.nextSibling && this.hasClass(el.nextSibling, className))
    {
        return el.nextSibling;
    }

    var next = el.nextSibling;

    while (next !== document.body && typeof next !== "undefined" && next !== null)
    {
        if (next && this.hasClass(next, className))
        {
            return next;
        }
        
        next = next.nextSibling;

    }

    return null;
}

/**
 * Traverse previousSibling untill type
 *
 * @access public
 * @param  node   el   Target element
 * @param  string type Target node type
 * @return node\null
 */
JSHelper.prototype.previousUntillType = function(el, type)
{
    type = type.toLowerCase();
    if (el.previousSibling && el.previousSibling.nodeName.toLowerCase() === type) return el.previousSibling;
    var prev = el.previousSibling;
    while (prev !== document.body && typeof prev !== "undefined" && prev !== null)
    {
        prev = prev.previousSibling;
        if (prev && prev.nodeName.toLowerCase() === type)
        {
            return prev;
        }
    }
    return null;
}

/**
 * Traverse previousSibling untill class
 *
 * @access public
 * @param  node   el        Target element
 * @param  string className Target node classname
 * @return node\null
 */
JSHelper.prototype.previousUntillClass = function(el, className)
{
    if (el.previousSibling && this.hasClass(el.previousSibling, className))
    {
        return el.previousSibling;
    }

    var prev = el.previousSibling;

    while (prev !== document.body && typeof prev !== "undefined" && prev !== null)
    {
        prev = prev.previousSibling;

        if (prev && this.hasClass(prev, className))
        {
            return prev;
        }
    }

    return null;
}

/**
 * Create and insert a new node
 *
 * @access public
 * @param  string type    New node type
 * @param  string classes New node class names (optional) (default '')
 * @param  string classes New node ID (optional) (default '')
 * @param  string content New node innerHTML (optional) (default '')
 * @param  node   target  Parent to append new node into
 * @return node
 */
JSHelper.prototype.newNode = function(type, classes, ID, content, target)
{
    var node = document.createElement(type);
    classes  = (typeof classes === "undefined" ? null : classes);
    ID       = (typeof ID === "undefined" ? null : ID);
    content  = (typeof content === "undefined" ? null : content);
    
    if (classes !== null)
    {
        node.className = classes
    }
    if (ID !== null)
    {
        node.id = ID
    }
    if (content !== null)
    {
        node.innerHTML = content
    }

    target.appendChild(node);

    return node;
}

/**
 * Check if a node exists in the DOM
 *
 * @access public
 * @param  node   element Target element
 * @return bool
 */
JSHelper.prototype.nodeExists = function(element)
{
    if (element === document.body)
    {
        return true;
    }

    if (typeof(element) !== "undefined" && element !== null)
    {
        if (typeof(element.parentNode) !== "undefined" && element.parentNode !== null)
        {
            return (element === document.body) ? false : document.body.contains(element);
        }
    }

    return false;
}

/**
 * Remove an element from the DOM
 *
 * This function also removes all attached event listeners
 * 
 * @access public
 * @param  node   el Target element
 */
JSHelper.prototype.removeFromDOM = function(el)
{
    if (this.nodeExists(el))
    {
        el.parentNode.removeChild(el);
        
        var children = this.$All('*', el);
        
        for (var i = 0, len = children.length; i < len; i++)
        {
            this.removeEventListener(children[i]);
        }

        this.removeEventListener(el);
    }
}

/**
 * Remove inline css property
 * 
 * @access public
 * @param  node   el   Target element
 * @param  string prop CSS property to removes
 */
JSHelper.prototype.removeStyle = function(el, prop)
{
    if (typeof prop === 'undefined')
    {
        prop = 'style';
    }
    else
    {
        if (Object.prototype.toString.call(prop) === '[object Array]')
        {
            for (var i = 0; i < prop.length; i++)
            {
                this.removeStyle(el, prop[i]);
            }

            return;
        }
        else
        {
            prop = this.toCamelCase(prop);
        }
    }

    if (prop === 'style')
    {
        el.removeAttribute("style");
    }
    else
    {
        if (el.style.removeProperty)
        {
            el.style.removeProperty(prop);
        }
        else
        {
            el.style.removeAttribute(prop);
        }
    }

    
}

/**
 * Add a css class or list of classes
 *
 * @access public
 * @param  node         el         Target element
 * @param  array|string className  Class name(s) to add
 */
JSHelper.prototype.addClass = function(el, className)
{
    if (!this.nodeExists(el))
    {
        return;
    }

    if (Object.prototype.toString.call(className) === '[object Array]')
    {
        for (var i = 0; i < className.length; i++)
        {
            el.classList.add(className[i]);
        }

        return;
    }

    el.classList.add(className);
}

/**
 * Remove a css class or list of classes
 *
 * @access public
 * @param  node         el         Target element
 * @param  array|string className  Class name(s) to remove
 */
JSHelper.prototype.removeClass = function(el, className)
{
    if (!this.nodeExists(el))
    {
        return;
    }

    if (Object.prototype.toString.call(className) === '[object Array]')
    {
        for (var i = 0; i < className.length; i++)
        {
            el.classList.remove(className[i]);
        }

        return;
    }

    el.classList.remove(className);
}

/**
 * Toogle a classname
 *
 * @access public
 * @param  node         el         Target element
 * @param  string       className  Class name to toggle
 */
JSHelper.prototype.toggleClass = function(el, className)
{
    if (!this.nodeExists(el))
    {
        return;
    }

    if (this.hasClass(el, className))
    {
        this.removeClass(el, className);
    }
    else
    {
        this.addClass(el, className);
    }
}

/**
 * Check if a node has a class
 *
 * @access public
 * @param  node         el         Target element
 * @param  string|array className  Class name(s) to check for
 * @return bool
 */
JSHelper.prototype.hasClass = function(el, className)
{
    if (!this.nodeExists(el))
    {
        return false;
    }

    if (Object.prototype.toString.call(className) === '[object Array]')
    {
        for (var i = 0; i < className.length; i++)
        {
            if (el.classList.contains(className[i]))
            {
                return true;
            }
        }

        return false;
    }

    if (!el.classList)
    {
        return false;
    }

    return el.classList.contains(className);
}

/**
 * Check if a node is a certain type
 *
 * @access public
 * @param  node   el         Target element
 * @param  string NodeType   Node type to validate
 * @return bool
 */
JSHelper.prototype.isNodeType = function(el, NodeType)
{
    return el.tagName.toUpperCase() === NodeType.toUpperCase();
}

/**
 * Get an element's absolute coordinates
 *
 * @access public
 * @param  node   el Target element
 * @return object
 */
JSHelper.prototype.getCoords = function(el)
{
    var box        = el.getBoundingClientRect();
    var body       = document.body;
    var docEl      = document.documentElement;
    var scrollTop  = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;
    var clientTop  = docEl.clientTop || body.clientTop || 0;
    var clientLeft = docEl.clientLeft || body.clientLeft || 0;
    var borderL    = parseInt(this.getStyle(el, 'border-top-width'));
    var borderR    = parseInt(this.getStyle(el, 'border-top-width'));
    var borderT    = parseInt(this.getStyle(el, 'border-top-width'));
    var borderB    = parseInt(this.getStyle(el, 'border-top-width'));
    var top        = box.top  + scrollTop  - clientTop  - borderT - borderB;
    var left       = box.left + scrollLeft - clientLeft + borderL - borderR;
    var width      = parseFloat(this.getStyle(el, "width"));
    var height     = parseFloat(this.getStyle(el, "height"));

    return {
        top    : top,
        left   : left,
        right  : left + width,
        bottom : top + height,
        height : height,
        width  : width,
    };
}

/**
 * Triggers a native event on an element
 *
 * @access public
 * @param  node   el   Target element
 * @param  string type Valid event name
 */
JSHelper.prototype.triggerEvent = function(el, type)
{
    if ("createEvent" in document)
    {
        var evt = document.createEvent("HTMLEvents");

        evt.initEvent(type, false, true);

        el.dispatchEvent(evt);
    }
    else
    {
        el.fireEvent(type);
    }
}

/**
 * Replaces element's innerText without destroying childnodes
 *
 * @access public
 * @param  node   el   Target element
 * @param  string text Text to replace
 */
JSHelper.prototype.innerText = function(el, text)
{
    if (this.isset(el.childNodes[0]))
    {
        el.childNodes[0].nodeValue = text;
    }
}

/**
 * Get all input elements from a form
 *
 * @access public
 * @param  node   form Target element
 * @return array
 */
JSHelper.prototype.getFormInputs = function(form)
{
    var allInputs = this.$All('input, textarea, select', form);

    var i = allInputs.length;

    while (i--)
    {
        var input = allInputs[i];

        if (input.type == "radio" && input.checked !== true)
        {
            allInputs.splice(i, 1);
        }
    }

    return allInputs;
}

/**
 * Gets an input element's value
 *
 * @access public
 * @param  node   input Target element
 * @return mixed
 */
JSHelper.prototype.getInputValue = function(input)
{
    if (input.type == "checkbox")
    {
        var val    = '';
        
        var checks = this.$All('input[name='+input.name+']');

        for (var i = 0, len = checks.length; i < len; i++)
        {
            if (checks[i].checked)
            {
                val += checks[i].value + ', ';
            }
        }

        return this.rtrim(val, ', '); 
    }

    if (input.type == "select")
    {
        return input.options[input.selectedIndex].value;
    }

    if (input.type == "file")
    {
        if (input.multiple == true)
        {
            return input.files;
        }

        return input.files[0];
    }

    return input.value;
}

/**
 * Replace or append a node's innerHTML
 *
 * @access public
 * @param  node   target  Target element
 * @param  string content Target content
 * @param  bool   append  Append innerHTML or replace (optional) (default false)
 */
JSHelper.prototype.innerHTML = function(target, content, append)
{
    content = this.is_array(content) ? content.join("\n") : content;

    if (append)
    {
        target.innerHTML += content;
    }
    else
    {
        target.innerHTML = content;
    }
}

/**
 * Check if an element is in current viewport
 *
 * @access public
 * @param  node   el Target DOM node
 * @return bool
 */
JSHelper.prototype.inViewport = function(el)
{
    
    var rect = el.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
    );
}

/**
 * Aria hide an element
 *
 * @access public
 * @param  node   el Target DOM node
 */
JSHelper.prototype.hideAria = function(el)
{
    el.setAttribute("aria-hidden", 'true');
}

/**
 * Aria show an element
 *
 * @access public
 * @param  node   el Target DOM node
 */
JSHelper.prototype.showAria = function(el)
{
    el.setAttribute("aria-hidden", 'false');
}

/**
 * String Helper Functions
 *
 * @author    Joe J. Howard
 * @copyright Joe J. Howard
 * @license   https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE
 */

/**
 * Is valid JSON
 * 
 * @param  mixed str String JSON
 * @return object|false
 */
JSHelper.prototype.isJSON = function(str)
{
    var obj;
    try
    {
        obj = JSON.parse(str);
    }
    catch (e)
    {
        return false;
    }
    return obj;
}

/**
 * Make a random string
 *
 * @param  int    length String length
 * @return string
 */
JSHelper.prototype.makeid = function(length)
{
    var text     = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    
    for (var i = 0; i < length; i++)
    {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return text;
}

/**
 * Is variable numeric?
 *
 * @param  mixed mixed_var Variable to validate
 * @return bool
 */
JSHelper.prototype.is_numeric = function(mixed_var)
{
    var whitespace =
        " \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000";
    return (typeof mixed_var === 'number' || (typeof mixed_var === 'string' && whitespace.indexOf(mixed_var.slice(-1)) === -
        1)) && mixed_var !== '' && !isNaN(mixed_var);
}

/**
 * Parse url
 *
 * @param  string    str       The URL to parse. Invalid characters are replaced by _.
 * @param  string    component Specify one of PHP_URL_SCHEME, PHP_URL_HOST, PHP_URL_PORT, PHP_URL_USER, PHP_URL_PASS, PHP_URL_PATH, PHP_URL_QUERY or PHP_URL_FRAGMENT to retrieve just a specific URL component as a string (except when PHP_URL_PORT is given, in which case the return value will be an integer).
 * @return object
 */
JSHelper.prototype.parse_url = function(str, component)
{
    //       discuss at: http://phpjs.org/functions/parse_url/
    //      original by: Steven Levithan (http://blog.stevenlevithan.com)
    // reimplemented by: Brett Zamir (http://brett-zamir.me)
    //         input by: Lorenzo Pisani
    //         input by: Tony
    //      improved by: Brett Zamir (http://brett-zamir.me)
    //             note: original by http://stevenlevithan.com/demo/parseuri/js/assets/parseuri.js
    //             note: blog post at http://blog.stevenlevithan.com/archives/parseuri
    //             note: demo at http://stevenlevithan.com/demo/parseuri/js/assets/parseuri.js
    //             note: Does not replace invalid characters with '_' as in PHP, nor does it return false with
    //             note: a seriously malformed URL.
    //             note: Besides function name, is essentially the same as parseUri as well as our allowing
    //             note: an extra slash after the scheme/protocol (to allow file:/// as in PHP)
    //        example 1: parse_url('http://username:password@hostname/path?arg=value#anchor');
    //        returns 1: {scheme: 'http', host: 'hostname', user: 'username', pass: 'password', path: '/path', query: 'arg=value', fragment: 'anchor'}

    var query, key = ['source', 'scheme', 'authority', 'userInfo', 'user', 'pass', 'host', 'port',
            'relative', 'path', 'directory', 'file', 'query', 'fragment'
        ],
        ini = (this.php_js && this.php_js.ini) || {},
        mode = (ini['phpjs.parse_url.mode'] &&
            ini['phpjs.parse_url.mode'].local_value) || 'php',
        parser = {
            php: /^(?:([^:\/?#]+):)?(?:\/\/()(?:(?:()(?:([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?()(?:(()(?:(?:[^?#\/]*\/)*)()(?:[^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
            strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
            loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/\/?)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/ // Added one optional slash to post-scheme to catch file:/// (should restrict this)
        };

    var m = parser[mode].exec(str),
        uri = {},
        i = 14;
    while (i--)
    {
        if (m[i])
        {
            uri[key[i]] = m[i];
        }
    }

    if (component)
    {
        return uri[component.replace('PHP_URL_', '')
            .toLowerCase()];
    }
    if (mode !== 'php')
    {
        var name = (ini['phpjs.parse_url.queryKey'] &&
            ini['phpjs.parse_url.queryKey'].local_value) || 'queryKey';
        parser = /(?:^|&)([^&=]*)=?([^&]*)/g;
        uri[name] = {};
        query = uri[key[12]] || '';
        query.replace(parser, function($0, $1, $2)
        {
            if ($1)
            {
                uri[name][$1] = $2;
            }
        });
    }
    delete uri.source;
    return uri;
}

/* Left trim */
JSHelper.prototype.ltrim = function(str, charlist)
{
    //  discuss at: http://phpjs.org/functions/ltrim/
    // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    //    input by: Erkekjetter
    // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // bugfixed by: Onno Marsman
    //   example 1: ltrim('    Kevin van Zonneveld    ');
    //   returns 1: 'Kevin van Zonneveld    '

    charlist = !charlist ? ' \\s\u00A0' : (charlist + '')
        .replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '$1');
    var re = new RegExp('^[' + charlist + ']+', 'g');
    return (str + '')
        .replace(re, '');
}

/* Left trim */
JSHelper.prototype.rtrim = function(str, charlist)
{
    //  discuss at: http://phpjs.org/functions/rtrim/
    // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    //    input by: Erkekjetter
    //    input by: rem
    // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // bugfixed by: Onno Marsman
    // bugfixed by: Brett Zamir (http://brett-zamir.me)
    //   example 1: rtrim('    Kevin van Zonneveld    ');
    //   returns 1: '    Kevin van Zonneveld'

    charlist = !charlist ? ' \\s\u00A0' : (charlist + '')
        .replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '\\$1');
    var re = new RegExp('[' + charlist + ']+$', 'g');
    return (str + '')
        .replace(re, '');
}

/* Trim */
JSHelper.prototype.trim = function(str, charlist)
{
    //  discuss at: http://phpjs.org/functions/trim/
    // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // improved by: mdsjack (http://www.mdsjack.bo.it)
    // improved by: Alexander Ermolaev (http://snippets.dzone.com/user/AlexanderErmolaev)
    // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // improved by: Steven Levithan (http://blog.stevenlevithan.com)
    // improved by: Jack
    //    input by: Erkekjetter
    //    input by: DxGx
    // bugfixed by: Onno Marsman
    //   example 1: trim('    Kevin van Zonneveld    ');
    //   returns 1: 'Kevin van Zonneveld'
    //   example 2: trim('Hello World', 'Hdle');
    //   returns 2: 'o Wor'
    //   example 3: trim(16, 1);
    //   returns 3: 6

    var whitespace, l = 0,
        i = 0;
    str += '';

    if (!charlist)
    {
        // default list
        whitespace =
            ' \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000';
    }
    else {
        // preg_quote custom list
        charlist += '';
        whitespace = charlist.replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '$1');
    }

    l = str.length;
    for (i = 0; i < l; i++)
    {
        if (whitespace.indexOf(str.charAt(i)) === -1)
        {
            str = str.substring(i);
            break;
        }
    }

    l = str.length;
    for (i = l - 1; i >= 0; i--)
    {
        if (whitespace.indexOf(str.charAt(i)) === -1)
        {
            str = str.substring(0, i + 1);
            break;
        }
    }

    return whitespace.indexOf(str.charAt(0)) === -1 ? str : '';
}

/* regex escape */
JSHelper.prototype.preg_quote = function(str, delimiter)
{
    //  discuss at: http://phpjs.org/functions/preg_quote/
    // original by: booeyOH
    // improved by: Ates Goral (http://magnetiq.com)
    // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // improved by: Brett Zamir (http://brett-zamir.me)
    // bugfixed by: Onno Marsman
    //   example 1: preg_quote("$40");
    //   returns 1: '\\$40'
    //   example 2: preg_quote("*RRRING* Hello?");
    //   returns 2: '\\*RRRING\\* Hello\\?'
    //   example 3: preg_quote("\\.+*?[^]$(){}=!<>|:");
    //   returns 3: '\\\\\\.\\+\\*\\?\\[\\^\\]\\$\\(\\)\\{\\}\\=\\!\\<\\>\\|\\:'

    return String(str)
        .replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\' + (delimiter || '') + '-]', 'g'), '\\$&');
}

/* Preg match all */
JSHelper.prototype.preg_match_all = function(pattern, subject)
{

    // convert the pattern to regix
    // if needed. return null on fail
    if (typeof pattern === 'string')
    {
        try {
            pattern = new RegExp(pattern);
        }
        catch (err)
        {
            return null;
        }
    }
    var _this   = this;
    var matches = [];
    var matched = pattern.exec(subject);
    if (matched !== null)
    {
        var i = 0;
        while (matched = pattern.exec(subject))
        {
            subject = _this.str_split_index(subject, (matched.index + matched[0].length - 1))[1];
            matched.index = i > 0 ? (matched.index + (matched[0].length - 1)) : matched.index - 1;
            matches.push(matched);
            i++;
        }
        return matches;
    }
    return null;
}

/* split string at index */
JSHelper.prototype.str_split_index = function(value, index)
{
    return [value.substring(0, index + 1), value.substring(index + 1)];
}

/* Capatalize first letter */
JSHelper.prototype.ucfirst = function(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/* Capatalize first letter of all words */
JSHelper.prototype.ucwords = function(str)
{
    //  discuss at: http://phpjs.org/functions/ucwords/
    // original by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
    // improved by: Waldo Malqui Silva
    // improved by: Robin
    // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // bugfixed by: Onno Marsman
    //    input by: James (http://www.james-bell.co.uk/)
    //   example 1: ucwords('kevin van  zonneveld');
    //   returns 1: 'Kevin Van  Zonneveld'
    //   example 2: ucwords('HELLO WORLD');
    //   returns 2: 'HELLO WORLD'

    return (str + '')
        .replace(/^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g, function($1)
        {
            return $1.toUpperCase();
        });
}

/* Reduce a string to a x words/letters with (optional) suffix */
JSHelper.prototype.strReduce = function(string, length, suffix, toChar)
{

    toChar = (typeof toChar === 'undefined' ? true : false);
    suffix = (typeof suffix === 'undefined' ? '' : suffix);

    if (toChar) return (string.length > length) ? string.substring(0, length) + suffix : string;

    var words = string.split(" ");

    if (count(words) > length) return fruits.slice(0, length).join(' ').suffix;

    return string;

}

/* Return human friendly time-ago */
JSHelper.prototype.timeAgo = function(time, asArray)
{
    asArray = (typeof asArray === 'undefined' ? false : true);
    time = isValidTimeStamp(time) ? parseInt(time) : strtotime(time);
    var units = [{
        name: "second",
        limit: 60,
        in_seconds: 1
    }, {
        name: "minute",
        limit: 3600,
        in_seconds: 60
    }, {
        name: "hour",
        limit: 86400,
        in_seconds: 3600
    }, {
        name: "day",
        limit: 604800,
        in_seconds: 86400
    }, {
        name: "week",
        limit: 2629743,
        in_seconds: 604800
    }, {
        name: "month",
        limit: 31556926,
        in_seconds: 2629743
    }, {
        name: "year",
        limit: null,
        in_seconds: 31556926
    }];
    var diff = (new Date() - new Date(time * 1000)) / 1000;
    if (diff < 5) return "now";

    var i = 0,
        unit;
    while (unit = units[i++])
    {
        if (diff < unit.limit || !unit.limit)
        {
            var diff = Math.floor(diff / unit.in_seconds);
            if (asArray)
            {
                return {
                    unit: unit.name + (diff > 1 ? "s" : ""),
                    time: diff
                };
            }
            return diff + " " + unit.name + (diff > 1 ? "s" : "");
        }
    }
}

/* Convert a string-date to a timestamp */
JSHelper.prototype.strtotime = function(text)
{
    return Math.round(new Date(text).getTime() / 1000);
}

/* String replace */
JSHelper.prototype.str_replace = function(search, replace, subject, count)
{
    //  discuss at: http://phpjs.org/functions/str_replace/
    // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // improved by: Gabriel Paderni
    // improved by: Philip Peterson
    // improved by: Simon Willison (http://simonwillison.net)
    // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // improved by: Onno Marsman
    // improved by: Brett Zamir (http://brett-zamir.me)
    //  revised by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
    // bugfixed by: Anton Ongson
    // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // bugfixed by: Oleg Eremeev
    // bugfixed by: Glen Arason (http://CanadianDomainRegistry.ca)
    // bugfixed by: Glen Arason (http://CanadianDomainRegistry.ca) Corrected count
    //    input by: Onno Marsman
    //    input by: Brett Zamir (http://brett-zamir.me)
    //    input by: Oleg Eremeev
    //        note: The count parameter must be passed as a string in order
    //        note: to find a global variable in which the result will be given
    //   example 1: str_replace(' ', '.', 'Kevin van Zonneveld');
    //   returns 1: 'Kevin.van.Zonneveld'
    //   example 2: str_replace(['{name}', 'l'], ['hello', 'm'], '{name}, lars');
    //   returns 2: 'hemmo, mars'
    //   example 3: str_replace(Array('S','F'),'x','ASDFASDF');
    //   returns 3: 'AxDxAxDx'
    //   example 4: str_replace(['A','D'], ['x','y'] , 'ASDFASDF' , 'cnt');
    //   returns 4: 'xSyFxSyF' // cnt = 0 (incorrect before fix)
    //   returns 4: 'xSyFxSyF' // cnt = 4 (correct after fix)

    var i = 0,
        j = 0,
        temp = '',
        repl = '',
        sl = 0,
        fl = 0,
        f = [].concat(search),
        r = [].concat(replace),
        s = subject,
        ra = Object.prototype.toString.call(r) === '[object Array]',
        sa = Object.prototype.toString.call(s) === '[object Array]';
    s = [].concat(s);

    if (typeof(search) === 'object' && typeof(replace) === 'string')
    {
        temp = replace;
        replace = new Array();
        for (i = 0; i < search.length; i += 1)
        {
            replace[i] = temp;
        }
        temp = '';
        r = [].concat(replace);
        ra = Object.prototype.toString.call(r) === '[object Array]';
    }

    if (count)
    {
        this.window[count] = 0;
    }

    for (i = 0, sl = s.length; i < sl; i++)
    {
        if (s[i] === '')
        {
            continue;
        }
        for (j = 0, fl = f.length; j < fl; j++)
        {
            temp = s[i] + '';
            repl = ra ? (r[j] !== undefined ? r[j] : '') : r[0];
            s[i] = (temp)
                .split(f[j])
                .join(repl);
            if (count)
            {
                this.window[count] += ((temp.split(f[j]))
                    .length - 1);
            }
        }
    }
    return sa ? s : s[0];
}

JSHelper.prototype.str_split = function(string, split_length)
{
    //  discuss at: http://phpjs.org/functions/str_split/
    // original by: Martijn Wieringa
    // improved by: Brett Zamir (http://brett-zamir.me)
    // bugfixed by: Onno Marsman
    //  revised by: Theriault
    //  revised by: Rafał Kukawski (http://blog.kukawski.pl/)
    //    input by: Bjorn Roesbeke (http://www.bjornroesbeke.be/)
    //   example 1: str_split('Hello Friend', 3);
    //   returns 1: ['Hel', 'lo ', 'Fri', 'end']

    if (split_length === null)
    {
        split_length = 1;
    }
    if (string === null || split_length < 1)
    {
        return false;
    }
    string += '';
    var chunks = [],
        pos = 0,
        len = string.length;
    while (pos < len)
    {
        chunks.push(string.slice(pos, pos += split_length));
    }

    return chunks;
}

JSHelper.prototype.toCamelCase = function(str)
{
    return str.toLowerCase()
        .replace(/['"]/g, '')
        .replace(/\W+/g, ' ')
        .replace(/ (.)/g, function($1)
        {
            return $1.toUpperCase();
        })
        .replace(/ /g, '');
}

JSHelper.prototype.camelCaseToHyphen = function(str)
{
     return str
        // insert a hyphen between lower & upper
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        // hyphen before last upper in a sequence followed by lower
        .replace(/\b([A-Z]+)([A-Z])([a-z])/, '$1-$2$3').toLowerCase();
}


JSHelper.prototype.explode = function(delimiter, string, limit)
{
    //  discuss at: http://phpjs.org/functions/explode/
    // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    //   example 1: explode(' ', 'Kevin van Zonneveld');
    //   returns 1: {0: 'Kevin', 1: 'van', 2: 'Zonneveld'}

    if (arguments.length < 2 || typeof delimiter === 'undefined' || typeof string === 'undefined') return null;
    if (delimiter === '' || delimiter === false || delimiter === null) return false;
    if (typeof delimiter === 'function' || typeof delimiter === 'object' || typeof string === 'function' || typeof string ===
        'object')
    {
        return {
            0: ''
        };
    }
    if (delimiter === true) delimiter = '1';

    // Here we go...
    delimiter += '';
    string += '';

    var s = string.split(delimiter);

    if (typeof limit === 'undefined') return s;

    // Support for limit
    if (limit === 0) limit = 1;

    // Positive limit
    if (limit > 0)
    {
        if (limit >= s.length) return s;
        return s.slice(0, limit - 1)
            .concat([s.slice(limit - 1)
                .join(delimiter)
            ]);
    }

    // Negative limit
    if (-limit >= s.length) return [];

    s.splice(s.length + limit);
    return s;
}

JSHelper.prototype.htmlspecialchars = function(string, quote_style, charset, double_encode)
{
    // http://kevin.vanzonneveld.net
    // +   original by: Mirek Slugen
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Nathan
    // +   bugfixed by: Arno
    // +    revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +    bugfixed by: Brett Zamir (http://brett-zamir.me)
    // +      input by: Ratheous
    // +      input by: Mailfaker (http://www.weedem.fr/)
    // +      reimplemented by: Brett Zamir (http://brett-zamir.me)
    // +      input by: felix
    // +    bugfixed by: Brett Zamir (http://brett-zamir.me)
    // %        note 1: charset argument not supported
    // *     example 1: htmlspecialchars("<a href='test'>Test</a>", 'ENT_QUOTES');
    // *     returns 1: '&lt;a href=&#039;test&#039;&gt;Test&lt;/a&gt;'
    // *     example 2: htmlspecialchars("ab\"c'd", ['ENT_NOQUOTES', 'ENT_QUOTES']);
    // *     returns 2: 'ab"c&#039;d'
    // *     example 3: htmlspecialchars("my "&entity;" is still here", null, null, false);
    // *     returns 3: 'my &quot;&entity;&quot; is still here'
    var optTemp = 0,
        i = 0,
        noquotes = false;
    if (typeof quote_style === 'undefined' || quote_style === null)
    {
        quote_style = 2;
    }
    string = string.toString();
    if (double_encode !== false)
    { // Put this first to avoid double-encoding
        string = string.replace(/&/g, '&amp;');
    }
    string = string.replace(/</g, '&lt;').replace(/>/g, '&gt;');

    var OPTS = {
        'ENT_NOQUOTES': 0,
        'ENT_HTML_QUOTE_SINGLE': 1,
        'ENT_HTML_QUOTE_DOUBLE': 2,
        'ENT_COMPAT': 2,
        'ENT_QUOTES': 3,
        'ENT_IGNORE': 4
    };
    if (quote_style === 0)
    {
        noquotes = true;
    }
    if (typeof quote_style !== 'number')
    { // Allow for a single string or an array of string flags
        quote_style = [].concat(quote_style);
        for (i = 0; i < quote_style.length; i++)
        {
            // Resolve string input to bitwise e.g. 'ENT_IGNORE' becomes 4
            if (OPTS[quote_style[i]] === 0)
            {
                noquotes = true;
            }
            else if (OPTS[quote_style[i]])
            {
                optTemp = optTemp | OPTS[quote_style[i]];
            }
        }
        quote_style = optTemp;
    }
    if (quote_style & OPTS.ENT_HTML_QUOTE_SINGLE)
    {
        string = string.replace(/'/g, '&#039;');
    }
    if (!noquotes)
    {
        string = string.replace(/"/g, '&quot;');
    }

    return string;
}


JSHelper.prototype.htmlspecialchars_decode = function(string, quote_style)
{
  //       discuss at: http://phpjs.org/functions/htmlspecialchars_decode/
  //      original by: Mirek Slugen
  //      improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  //      bugfixed by: Mateusz "loonquawl" Zalega
  //      bugfixed by: Onno Marsman
  //      bugfixed by: Brett Zamir (http://brett-zamir.me)
  //      bugfixed by: Brett Zamir (http://brett-zamir.me)
  //         input by: ReverseSyntax
  //         input by: Slawomir Kaniecki
  //         input by: Scott Cariss
  //         input by: Francois
  //         input by: Ratheous
  //         input by: Mailfaker (http://www.weedem.fr/)
  //       revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // reimplemented by: Brett Zamir (http://brett-zamir.me)
  //        example 1: htmlspecialchars_decode("<p>this -&gt; &quot;</p>", 'ENT_NOQUOTES');
  //        returns 1: '<p>this -> &quot;</p>'
  //        example 2: htmlspecialchars_decode("&amp;quot;");
  //        returns 2: '&quot;'

  var optTemp = 0,
    i = 0,
    noquotes = false;
  if (typeof quote_style === 'undefined')
  {
    quote_style = 2;
  }
  string = string.toString()
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
  var OPTS = {
    'ENT_NOQUOTES': 0,
    'ENT_HTML_QUOTE_SINGLE': 1,
    'ENT_HTML_QUOTE_DOUBLE': 2,
    'ENT_COMPAT': 2,
    'ENT_QUOTES': 3,
    'ENT_IGNORE': 4
  };
  if (quote_style === 0)
  {
    noquotes = true;
  }
  if (typeof quote_style !== 'number')
  { // Allow for a single string or an array of string flags
    quote_style = [].concat(quote_style);
    for (i = 0; i < quote_style.length; i++)
    {
      // Resolve string input to bitwise e.g. 'PATHINFO_EXTENSION' becomes 4
      if (OPTS[quote_style[i]] === 0)
      {
        noquotes = true;
      } else if (OPTS[quote_style[i]])
      {
        optTemp = optTemp | OPTS[quote_style[i]];
      }
    }
    quote_style = optTemp;
  }
  if (quote_style & OPTS.ENT_HTML_QUOTE_SINGLE)
  {
    string = string.replace(/&#0*39;/g, "'"); // PHP doesn't currently escape if more than one 0, but it should
    // string = string.replace(/&apos;|&#x0*27;/g, "'"); // This would also be useful here, but not a part of PHP
  }
  if (!noquotes)
  {
    string = string.replace(/&quot;/g, '"');
  }
  // Put this in last place to avoid escape being double-decoded
  string = string.replace(/&amp;/g, '&');

  return string;
}

JSHelper.prototype.get_html_translation_table = function(table, quoteStyle)
{

  // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/get_html_translation_table/
  // original by: Philip Peterson
  //  revised by: Kevin van Zonneveld (http://kvz.io)
  // bugfixed by: noname
  // bugfixed by: Alex
  // bugfixed by: Marco
  // bugfixed by: madipta
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  // bugfixed by: T.Wild
  // improved by: KELAN
  // improved by: Brett Zamir (http://brett-zamir.me)
  //    input by: Frank Forte
  //    input by: Ratheous
  //      note 1: It has been decided that we're not going to add global
  //      note 1: dependencies to Locutus, meaning the constants are not
  //      note 1: real constants, but strings instead. Integers are also supported if someone
  //      note 1: chooses to create the constants themselves.
  //   example 1: get_html_translation_table('HTML_SPECIALCHARS')
  //   returns 1: {'"': '&quot;', '&': '&amp;', '<': '&lt;', '>': '&gt;'}

  var entities = {}
  var hashMap = {}
  var decimal
  var constMappingTable = {}
  var constMappingQuoteStyle = {}
  var useTable = {}
  var useQuoteStyle = {}

  // Translate arguments
  constMappingTable[0] = 'HTML_SPECIALCHARS'
  constMappingTable[1] = 'HTML_ENTITIES'
  constMappingQuoteStyle[0] = 'ENT_NOQUOTES'
  constMappingQuoteStyle[2] = 'ENT_COMPAT'
  constMappingQuoteStyle[3] = 'ENT_QUOTES'

  useTable = !isNaN(table)
    ? constMappingTable[table]
    : table
      ? table.toUpperCase()
      : 'HTML_SPECIALCHARS'

  useQuoteStyle = !isNaN(quoteStyle)
    ? constMappingQuoteStyle[quoteStyle]
    : quoteStyle
      ? quoteStyle.toUpperCase()
      : 'ENT_COMPAT'

  if (useTable !== 'HTML_SPECIALCHARS' && useTable !== 'HTML_ENTITIES')
  {
    throw new Error('Table: ' + useTable + ' not supported')
  }

  entities['38'] = '&amp;'
  if (useTable === 'HTML_ENTITIES')
  {
    entities['160'] = '&nbsp;'
    entities['161'] = '&iexcl;'
    entities['162'] = '&cent;'
    entities['163'] = '&pound;'
    entities['164'] = '&curren;'
    entities['165'] = '&yen;'
    entities['166'] = '&brvbar;'
    entities['167'] = '&sect;'
    entities['168'] = '&uml;'
    entities['169'] = '&copy;'
    entities['170'] = '&ordf;'
    entities['171'] = '&laquo;'
    entities['172'] = '&not;'
    entities['173'] = '&shy;'
    entities['174'] = '&reg;'
    entities['175'] = '&macr;'
    entities['176'] = '&deg;'
    entities['177'] = '&plusmn;'
    entities['178'] = '&sup2;'
    entities['179'] = '&sup3;'
    entities['180'] = '&acute;'
    entities['181'] = '&micro;'
    entities['182'] = '&para;'
    entities['183'] = '&middot;'
    entities['184'] = '&cedil;'
    entities['185'] = '&sup1;'
    entities['186'] = '&ordm;'
    entities['187'] = '&raquo;'
    entities['188'] = '&frac14;'
    entities['189'] = '&frac12;'
    entities['190'] = '&frac34;'
    entities['191'] = '&iquest;'
    entities['192'] = '&Agrave;'
    entities['193'] = '&Aacute;'
    entities['194'] = '&Acirc;'
    entities['195'] = '&Atilde;'
    entities['196'] = '&Auml;'
    entities['197'] = '&Aring;'
    entities['198'] = '&AElig;'
    entities['199'] = '&Ccedil;'
    entities['200'] = '&Egrave;'
    entities['201'] = '&Eacute;'
    entities['202'] = '&Ecirc;'
    entities['203'] = '&Euml;'
    entities['204'] = '&Igrave;'
    entities['205'] = '&Iacute;'
    entities['206'] = '&Icirc;'
    entities['207'] = '&Iuml;'
    entities['208'] = '&ETH;'
    entities['209'] = '&Ntilde;'
    entities['210'] = '&Ograve;'
    entities['211'] = '&Oacute;'
    entities['212'] = '&Ocirc;'
    entities['213'] = '&Otilde;'
    entities['214'] = '&Ouml;'
    entities['215'] = '&times;'
    entities['216'] = '&Oslash;'
    entities['217'] = '&Ugrave;'
    entities['218'] = '&Uacute;'
    entities['219'] = '&Ucirc;'
    entities['220'] = '&Uuml;'
    entities['221'] = '&Yacute;'
    entities['222'] = '&THORN;'
    entities['223'] = '&szlig;'
    entities['224'] = '&agrave;'
    entities['225'] = '&aacute;'
    entities['226'] = '&acirc;'
    entities['227'] = '&atilde;'
    entities['228'] = '&auml;'
    entities['229'] = '&aring;'
    entities['230'] = '&aelig;'
    entities['231'] = '&ccedil;'
    entities['232'] = '&egrave;'
    entities['233'] = '&eacute;'
    entities['234'] = '&ecirc;'
    entities['235'] = '&euml;'
    entities['236'] = '&igrave;'
    entities['237'] = '&iacute;'
    entities['238'] = '&icirc;'
    entities['239'] = '&iuml;'
    entities['240'] = '&eth;'
    entities['241'] = '&ntilde;'
    entities['242'] = '&ograve;'
    entities['243'] = '&oacute;'
    entities['244'] = '&ocirc;'
    entities['245'] = '&otilde;'
    entities['246'] = '&ouml;'
    entities['247'] = '&divide;'
    entities['248'] = '&oslash;'
    entities['249'] = '&ugrave;'
    entities['250'] = '&uacute;'
    entities['251'] = '&ucirc;'
    entities['252'] = '&uuml;'
    entities['253'] = '&yacute;'
    entities['254'] = '&thorn;'
    entities['255'] = '&yuml;'
  }

  if (useQuoteStyle !== 'ENT_NOQUOTES')
  {
    entities['34'] = '&quot;'
  }
  if (useQuoteStyle === 'ENT_QUOTES')
  {
    entities['39'] = '&#39;'
  }
  entities['60'] = '&lt;'
  entities['62'] = '&gt;'

  // ascii decimals to real symbols
  for (decimal in entities)
  {
    if (entities.hasOwnProperty(decimal))
    {
      hashMap[String.fromCharCode(decimal)] = entities[decimal]
    }
  }

  return hashMap
}

JSHelper.prototype.html_entity_decode = function(string, quote_style)
{
  //  discuss at: http://phpjs.org/functions/html_entity_decode/
  // original by: john (http://www.jd-tech.net)
  //    input by: ger
  //    input by: Ratheous
  //    input by: Nick Kolosov (http://sammy.ru)
  // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // improved by: marc andreu
  //  revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  //  revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // bugfixed by: Onno Marsman
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  // bugfixed by: Fox
  //  depends on: get_html_translation_table
  //   example 1: html_entity_decode('Kevin &amp; van Zonneveld');
  //   returns 1: 'Kevin & van Zonneveld'
  //   example 2: html_entity_decode('&amp;lt;');
  //   returns 2: '&lt;'

  var hash_map = {},
    symbol = '',
    tmp_str = '',
    entity = '';
  tmp_str = string.toString();

  if (false === (hash_map = this.get_html_translation_table('HTML_ENTITIES', quote_style)))
  {
    return false;
  }

  // fix &amp; problem
  // http://phpjs.org/functions/get_html_translation_table:416#comment_97660
  delete(hash_map['&']);
  hash_map['&'] = '&amp;';

  for (symbol in hash_map)
  {
    entity = hash_map[symbol];
    tmp_str = tmp_str.split(entity)
      .join(symbol);
  }
  tmp_str = tmp_str.split('&#039;')
    .join("'");

  return tmp_str;
}

JSHelper.prototype.strcmp = function(str1, str2)
{
  //  discuss at: http://phpjs.org/functions/strcmp/
  // original by: Waldo Malqui Silva (http://waldo.malqui.info)
  //    input by: Steve Hilder
  // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  //  revised by: gorthaur
  //   example 1: strcmp( 'waldo', 'owald' );
  //   returns 1: 1
  //   example 2: strcmp( 'owald', 'waldo' );
  //   returns 2: -1

  return ((str1 == str2) ? 0 : ((str1 > str2) ? 1 : -1))
}

JSHelper.prototype.strnatcmp = function(f_string1, f_string2, f_version)
{
  //  discuss at: http://phpjs.org/functions/strnatcmp/
  // original by: Martijn Wieringa
  // improved by: Michael White (http://getsprink.com)
  // improved by: Jack
  // bugfixed by: Onno Marsman
  //  depends on: strcmp
  //        note: Added f_version argument against code guidelines, because it's so neat
  //   example 1: strnatcmp('Price 12.9', 'Price 12.15');
  //   returns 1: 1
  //   example 2: strnatcmp('Price 12.09', 'Price 12.15');
  //   returns 2: -1
  //   example 3: strnatcmp('Price 12.90', 'Price 12.15');
  //   returns 3: 1
  //   example 4: strnatcmp('Version 12.9', 'Version 12.15', true);
  //   returns 4: -6
  //   example 5: strnatcmp('Version 12.15', 'Version 12.9', true);
  //   returns 5: 6

  var i = 0

  if (f_version == undefined)
  {
    f_version = false
  }

  var __strnatcmp_split = function (f_string)
  {
    var result = []
    var buffer = ''
    var chr = ''
    var i = 0,
      f_stringl = 0

    var text = true

    f_stringl = f_string.length
    for (i = 0; i < f_stringl; i++)
    {
      chr = f_string.substring(i, i + 1)
      if (chr.match(/\d/))
      {
        if (text)
        {
          if (buffer.length > 0)
          {
            result[result.length] = buffer
            buffer = ''
          }

          text = false
        }
        buffer += chr
      } else if ((text == false) && (chr === '.') && (i < (f_string.length - 1)) && (f_string.substring(i + 1, i +
            2)
          .match(/\d/)))
      {
        result[result.length] = buffer
        buffer = ''
      }
      else
      {
        if (text == false)
        {
          if (buffer.length > 0)
          {
            result[result.length] = parseInt(buffer, 10)
            buffer = ''
          }
          text = true
        }
        buffer += chr
      }
    }

    if (buffer.length > 0)
    {
      if (text)
      {
        result[result.length] = buffer
      }
      else
      {
        result[result.length] = parseInt(buffer, 10)
      }
    }

    return result
  }

  var array1 = __strnatcmp_split(f_string1 + '')
  var array2 = __strnatcmp_split(f_string2 + '')

  var len = array1.length
  var text = true

  var result = -1
  var r = 0

  if (len > array2.length)
  {
    len = array2.length
    result = 1
  }

  for (i = 0; i < len; i++)
  {
    if (isNaN(array1[i]))
    {
      if (isNaN(array2[i]))
      {
        text = true

        if ((r = this.strcmp(array1[i], array2[i])) != 0)
        {
          return r
        }
      } else if (text)
      {
        return 1
      }
      else
      {
        return -1
      }
    } else if (isNaN(array2[i]))
    {
      if (text)
      {
        return -1
      }
      else
      {
        return 1
      }
    }
    else
    {
      if (text || f_version)
      {
        if ((r = (array1[i] - array2[i])) != 0)
        {
          return r
        }
      }
      else
      {
        if ((r = this.strcmp(array1[i].toString(), array2[i].toString())) != 0)
        {
          return r
        }
      }

      text = false
    }
  }

  return result
}

/**
 * Array utility functions
 *
 * @author    Joe J. Howard
 * @copyright Joe J. Howard
 * @license   https://github.com/kanso-cms/cms/blob/master/LICENSE
 */

/**
 * Checks if an array contains a value
 *
 * @access public
 * @param  string needle    The value to search for
 * @param  array  haystack  The target array to index
 * @param  bool   argStrict Compare strict
 * @return bool
 */
JSHelper.prototype.in_array = function(needle, haystack, argStrict) {

    var key = '',
    strict = !!argStrict;

    //we prevent the double check (strict && arr[key] === ndl) || (!strict && arr[key] == ndl)
    //in just one for, in order to improve the performance 
    //deciding wich type of comparation will do before walk array
    if (strict) {
        for (key in haystack) {
            if (haystack[key] === needle) {
                return true;
            }
        }
    }
    else {
        for (key in haystack) {
            if (haystack[key] == needle) {
                return true;
            }
        }
    }

    return false;
}

/**
 * Reduce an array to n values
 * 
 * @access public
 * @param  array  array The target array to change
 * @param  int    count The amount of items to reduce the array to
 * @return array
 */
JSHelper.prototype.array_reduce = function(array, count) {
    return this.array_slice(array, 0, count);
}

/**
 * Implode an array
 * 
 * @access public
 * @param  array  array  The target array to implode
 * @param  string prefix Imploding prefix
 * @param  string suffix Imploding sufix (optional) (default )
 * @return string
 */
JSHelper.prototype.implode = function(array, prefix, suffix) {
    var str = '';
    for (i = 0; i < array.length; i++) {
        if (i === array.length - 1) {
            str += prefix + array[i];
        }
        else {
            str += prefix + array[i] + suffix;
        }
    }
    return str;
}

/**
 * PHP "array_slice" function
 * 
 * @access public
 * @param  array array         The target array to slice
 * @param  int   offst         At what offset to start the slice
 * @param  int   lgth          Target ending length
 * @param  bool  preserve_keys Preserve array keys (optional) (default false)
 * @return array
 */
JSHelper.prototype.array_slice = function(arr, offst, lgth, preserve_keys) {
    //  discuss at: http://phpjs.org/functions/array_slice/
    // original by: Brett Zamir (http://brett-zamir.me)
    //  depends on: is_int
    //    input by: Brett Zamir (http://brett-zamir.me)
    // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    //        note: Relies on is_int because !isNaN accepts floats
    //   example 1: array_slice(["a", "b", "c", "d", "e"], 2, -1);
    //   returns 1: {0: 'c', 1: 'd'}
    //   example 2: array_slice(["a", "b", "c", "d", "e"], 2, -1, true);
    //   returns 2: {2: 'c', 3: 'd'}

    /*
    if ('callee' in arr && 'length' in arr) {
      arr = Array.prototype.slice.call(arr);
    }
    */

    var key = '';

    if (Object.prototype.toString.call(arr) !== '[object Array]' ||
        (preserve_keys && offst !== 0)) { // Assoc. array as input or if required as output
        var lgt = 0,
    newAssoc = {};
    for (key in arr) {
            //if (key !== 'length') {
                lgt += 1;
                newAssoc[key] = arr[key];
            //}
        }
        arr = newAssoc;

        offst = (offst < 0) ? lgt + offst : offst;
        lgth = lgth === undefined ? lgt : (lgth < 0) ? lgt + lgth - offst : lgth;

        var assoc = {};
        var start = false,
        it = -1,
        arrlgth = 0,
        no_pk_idx = 0;
        for (key in arr) {
            ++it;
            if (arrlgth >= lgth) {
                break;
            }
            if (it == offst) {
                start = true;
            }
            if (!start) {
                continue;
            }++arrlgth;
            if (this.is_int(key) && !preserve_keys) {
                assoc[no_pk_idx++] = arr[key];
            }
            else {
                assoc[key] = arr[key];
            }
        }
        //assoc.length = arrlgth; // Make as array-like object (though length will not be dynamic)
        return assoc;
    }

    if (lgth === undefined) {
        return arr.slice(offst);
    }
    else if (lgth >= 0) {
        return arr.slice(offst, offst + lgth);
    }
    else {
        return arr.slice(offst, lgth);
    }
}

/**
 * Paginates an array of data
 * 
 * @access public
 * @param  array array The target array to paginate
 * @param  int   page  The current page
 * @param  int   limit Data per page
 * @return array
 */
JSHelper.prototype.paginate = function(array, page, limit) {
    page = (page === false || page === 0 ? 1 : page);
    limit = (limit ? limit : 10);
    var total = count(array);
    var pages = Math.ceil((total / limit));
    var offset = (page - 1) * limit;
    var start = offset + 1;
    var end = Math.min((offset + limit), total);
    var paged = [];

    if (page > pages) return false;

    for (var i = 0; i < pages; i++) {
        offset = i * limit;
        paged.push(array.slice(offset, limit));
    }

    return paged;
}

/**
 * Foreach loop
 * 
 * @access public
 * @param  object  obj       The target object to loop over
 * @param  closure callback  Callback to apply to each iteration
 * @param  array   args      Array of params to apply to callback (optional) (default null)
 */
JSHelper.prototype.foreach = function(obj, callback, args) {
    var value, i = 0,
    length = obj.length,
    isArray = Object.prototype.toString.call(obj) === '[object Array]';

    if (args) {
        if (isArray) {
            for (; i < length; i++) {
                value = callback.apply(obj[i], args);

                if (value === false) {
                    break;
                }
            }
        }
        else {
            for (i in obj) {
                value = callback.apply(obj[i], args);

                if (value === false) {
                    break;
                }
            }
        }

        // A special, fast, case for the most common use of each
    }
    else {
        if (isArray) {
            for (; i < length; i++) {
                value = callback.call(obj[i], i, obj[i]);

                if (value === false) {
                    break;
                }
            }
        }
        else {
            for (i in obj) {
                value = callback.call(obj[i], i, obj[i]);

                if (value === false) {
                    break;
                }
            }
        }
    }

    return obj;
}

/**
 * Clone an object
 * 
 * @access public
 * @param  object  src       The object to clone
 * @return object
 */
JSHelper.prototype.cloneObj = function(src) {
    var clone = {};
    for (var prop in src) {
        if (src.hasOwnProperty(prop)) clone[prop] = src[prop];
    }
    return clone;
}

/**
 * Merge multiple arrays together
 * 
 * @access public
 * @param  ...   List of arrays to merge
 * @return array
 */
JSHelper.prototype.array_merge = function () {
  //  discuss at: http://phpjs.org/functions/array_merge/
  // original by: Brett Zamir (http://brett-zamir.me)
  // bugfixed by: Nate
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  //    input by: josh
  //   example 1: arr1 = {"color": "red", 0: 2, 1: 4}
  //   example 1: arr2 = {0: "a", 1: "b", "color": "green", "shape": "trapezoid", 2: 4}
  //   example 1: array_merge(arr1, arr2)
  //   returns 1: {"color": "green", 0: 2, 1: 4, 2: "a", 3: "b", "shape": "trapezoid", 4: 4}
  //   example 2: arr1 = []
  //   example 2: arr2 = {1: "data"}
  //   example 2: array_merge(arr1, arr2)
  //   returns 2: {0: "data"}

  var args = Array.prototype.slice.call(arguments),
  argl = args.length,
  arg,
  retObj = {},
  k = '',
  argil = 0,
  j = 0,
  i = 0,
  ct = 0,
  toStr = Object.prototype.toString,
  retArr = true;

  for (i = 0; i < argl; i++) {
    if (toStr.call(args[i]) !== '[object Array]') {
      retArr = false;
      break;
  }
}

if (retArr) {
    retArr = [];
    for (i = 0; i < argl; i++) {
      retArr = retArr.concat(args[i]);
  }
  return retArr;
}

for (i = 0, ct = 0; i < argl; i++) {
    arg = args[i];
    if (toStr.call(arg) === '[object Array]') {
      for (j = 0, argil = arg.length; j < argil; j++) {
        retObj[ct++] = arg[j];
    }
} else {
  for (k in arg) {
    if (arg.hasOwnProperty(k)) {
      if (parseInt(k, 10) + '' === k) {
        retObj[ct++] = arg[k];
    } else {
        retObj[k] = arg[k];
    }
}
}
}
}
return retObj;
}

/**
 * Array filter
 * 
 * @access public
 * @param  array array Target array to filter
 * @return array
 */
JSHelper.prototype.array_filter = function(array) {
    var result = [];
    for (var i = 0; i < array.length; i++) {
        if (array[i] === '' || this.empty(array[i])) continue;
        result.push(array[i]);
    }
    return result;
}

/**
 * Is array
 * 
 * @access public
 * @param  array array Target array to filter
 * @return bool
 */
JSHelper.prototype.is_array = function(mixed_var) {
  //  discuss at: http://phpjs.org/functions/is_array/
  // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // improved by: Legaev Andrey
  // improved by: Onno Marsman
  // improved by: Brett Zamir (http://brett-zamir.me)
  // improved by: Nathan Sepulveda
  // improved by: Brett Zamir (http://brett-zamir.me)
  // bugfixed by: Cord
  // bugfixed by: Manish
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  //        note: In php.js, javascript objects are like php associative arrays, thus JavaScript objects will also
  //        note: return true in this function (except for objects which inherit properties, being thus used as objects),
  //        note: unless you do ini_set('phpjs.objectsAsArrays', 0), in which case only genuine JavaScript arrays
  //        note: will return true
  //   example 1: is_array(['Kevin', 'van', 'Zonneveld']);
  //   returns 1: true
  //   example 2: is_array('Kevin van Zonneveld');
  //   returns 2: false
  //   example 3: is_array({0: 'Kevin', 1: 'van', 2: 'Zonneveld'});
  //   returns 3: true
  //   example 4: is_array(function tmp_a(){this.name = 'Kevin'});
  //   returns 4: false

  var ini,
  _getFuncName = function(fn) {
      var name = (/\W*function\s+([\w\$]+)\s*\(/)
      .exec(fn);
      if (!name) {
        return '(Anonymous)';
    }
    return name[1];
};
_isArray = function(mixed_var) {
    // return Object.prototype.toString.call(mixed_var) === '[object Array]';
    // The above works, but let's do the even more stringent approach: (since Object.prototype.toString could be overridden)
    // Null, Not an object, no length property so couldn't be an Array (or String)
    if (!mixed_var || typeof mixed_var !== 'object' || typeof mixed_var.length !== 'number') {
      return false;
  }
  var len = mixed_var.length;
  mixed_var[mixed_var.length] = 'bogus';
    // The only way I can think of to get around this (or where there would be trouble) would be to have an object defined
    // with a custom "length" getter which changed behavior on each call (or a setter to mess up the following below) or a custom
    // setter for numeric properties, but even that would need to listen for specific indexes; but there should be no false negatives
    // and such a false positive would need to rely on later JavaScript innovations like __defineSetter__
    if (len !== mixed_var.length) { // We know it's an array since length auto-changed with the addition of a
      // numeric property at its length end, so safely get rid of our bogus element
  mixed_var.length -= 1;
  return true;
}
    // Get rid of the property we added onto a non-array object; only possible
    // side-effect is if the user adds back the property later, it will iterate
    // this property in the older order placement in IE (an order which should not
    // be depended on anyways)
    delete mixed_var[mixed_var.length];
    return false;
};

if (!mixed_var || typeof mixed_var !== 'object') {
    return false;
}

return _isArray(mixed_var);
}
/**
 * Miscellaneous helper functions
 *
 * @author    Joe J. Howard
 * @copyright Joe J. Howard
 * @license   https://github.com/kanso-cms/cms/blob/master/LICENSE
 */

/**
 * Is numeric? 
 *
 * @access public
 * @param  mixed  mixed_var Variable to check
 * @return bool
 */
JSHelper.prototype.is_numeric = function(mixed_var)
{
    var whitespace =
        " \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000";
    return (typeof mixed_var === 'number' || (typeof mixed_var === 'string' && whitespace.indexOf(mixed_var.slice(-1)) === -
        1)) && mixed_var !== '' && !isNaN(mixed_var);
}

/**
 * Is callable ?
 *
 * @access public
 * @param  mixed  mixed_var Variable to check
 * @return bool
 */
JSHelper.prototype.isCallable = function(obj)
{
    return Object.prototype.toString.call(obj) === '[object Function]';
}

/**
 * Count
 *
 * @access public
 * @param  mixed  mixed_var Variable to count
 * @param  string mode      Variable count mode
 * @return int
 */
JSHelper.prototype.count = function(mixed_var, mode)
{
    var key, cnt = 0;
    if (mixed_var === null || typeof mixed_var === 'undefined')
    {
        return 0;
    }
    else if (mixed_var.constructor !== Array && mixed_var.constructor !== Object)
    {
        return 1;
    }

    if (mode === 'COUNT_RECURSIVE')
    {
        mode = 1;
    }
    if (mode != 1)
    {
        mode = 0;
    }

    for (key in mixed_var)
    {
        if (mixed_var.hasOwnProperty(key))
        {
            cnt++;
            if (mode == 1 && mixed_var[key] && (mixed_var[key].constructor === Array || mixed_var[key].constructor ===
                    Object))
            {
                cnt += this.count(mixed_var[key], 1);
            }
        }
    }

    return cnt;
}

/**
 * Convert to boolean
 *
 * @access public
 * @param  mixed  value Variable to evaluate
 * @return bool
 */
JSHelper.prototype.bool = function(value)
{

    value = (typeof value === 'undefined' ? false : value);

    if (typeof value === 'boolean') return value;

    if (typeof value === 'number') return value > 0;

    if (typeof value === 'string')
    {
        if (value.toLowerCase() === 'false') return false;
        if (value.toLowerCase() === 'true') return true;
        if (value.toLowerCase() === 'on') return true;
        if (value.toLowerCase() === 'off') return false;
        if (value.toLowerCase() === 'undefined') return false;
        if (this.is_numeric(value)) return Number(value) > 0;
        if (value === '') return false;
    }

    return false;
}

/**
 * Convert to integer
 *
 * @access public
 * @param  mixed  mixed_var Variable to evaluate
 * @return int
 */
JSHelper.prototype.intval = function(mixed_var, base)
{
    //  discuss at: http://phpjs.org/functions/intval/
    // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // improved by: stensi
    // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // bugfixed by: Brett Zamir (http://brett-zamir.me)
    // bugfixed by: Rafał Kukawski (http://kukawski.pl)
    //    input by: Matteo
    //   example 1: intval('Kevin van Zonneveld');
    //   returns 1: 0
    //   example 2: intval(4.2);
    //   returns 2: 4
    //   example 3: intval(42, 8);
    //   returns 3: 42
    //   example 4: intval('09');
    //   returns 4: 9
    //   example 5: intval('1e', 16);
    //   returns 5: 30

    var tmp;

    var type = typeof mixed_var;

    if (type === 'boolean')
    {
        return +mixed_var;
    }
    else if (type === 'string')
    {
        tmp = parseInt(mixed_var, base || 10);
        return (isNaN(tmp) || !isFinite(tmp)) ? 0 : tmp;
    }
    else if (type === 'number' && isFinite(mixed_var))
    {
        return mixed_var | 0;
    }
    else {
        return 0;
    }
}

/**
 * Convert to f,oat
 *
 * @access public
 * @param  mixed  mixed_var Variable to evaluate
 * @return float
 */
JSHelper.prototype.floatval = function(mixedVar)
{
    return (parseFloat(mixedVar) || 0)
}

/**
 * Checks if variable is set
 *
 * @access public
 * @param  mixed  mixed_var Variable to evaluate
 * @return bool
 */
JSHelper.prototype.isset = function()
{
    //  discuss at: http://phpjs.org/functions/isset/
    // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // improved by: FremyCompany
    // improved by: Onno Marsman
    // improved by: Rafał Kukawski
    //   example 1: isset( undefined, true);
    //   returns 1: false
    //   example 2: isset( 'Kevin van Zonneveld' );
    //   returns 2: true

    var a = arguments,
        l = a.length,
        i = 0,
        undef;

    if (l === 0)
    {
        throw new Error('Empty isset');
    }

    while (i !== l)
    {
        if (a[i] === undef || a[i] === null)
        {
            return false;
        }
        i++;
    }
    return true;
}

/**
 * Checks if variable is empty
 *
 * @access public
 * @param  mixed  value Variable to evaluate
 * @return bool
 */
JSHelper.prototype.empty = function(value)
{

    value = (typeof value === 'undefined' ? false : value);

    if (typeof value === 'boolean') return value !== true;

    if (typeof value === 'number') return value < 1;

    if (typeof value === 'string')
    {
        if (value.toLowerCase() === 'undefined') return true;
        if (this.is_numeric(value)) return Number(value) < 1;
        if (value === '') return true;
        if (value !== '') return false;
    }

    if (Object.prototype.toString.call(value) === '[object Array]') return value.length < 1;

    if (Object.prototype.toString.call(value) === '[object Object]') return (Object.getOwnPropertyNames(value).length === 0);

    return false;

}

/**
 * Checks if variable is an object
 *
 * @access public
 * @param  mixed  mixed_var Variable to evaluate
 * @return bool
 */
JSHelper.prototype.is_object = function(mixed_var)
{
    //  discuss at: http://phpjs.org/functions/is_object/
    // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // improved by: Legaev Andrey
    // improved by: Michael White (http://getsprink.com)
    //   example 1: is_object('23');
    //   returns 1: false
    //   example 2: is_object({foo: 'bar'});
    //   returns 2: true
    //   example 3: is_object(null);
    //   returns 3: false

    if (Object.prototype.toString.call(mixed_var) === '[object Array]')
    {
        return false;
    }
    return mixed_var !== null && typeof mixed_var === 'object';
}

/**
 * Checks if variable is a nodelist-array
 *
 * @access public
 * @param  mixed  nodes Variable to evaluate
 * @return bool
 */
JSHelper.prototype.isNodeList = function(nodes)
{
    return nodes == '[object NodeList]';
}
/**
 * DOM Event Listener Manager
 *
 * @author    Joe J. Howard
 * @copyright Joe J. Howard
 * @license   https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE
 */

/**
 * Add an event listener
 *
 * @access public
 * @param  node    element    The target DOM node
 * @param  string  eventName  Event type
 * @param  closure handler    Callback event
 * @param  bool    useCapture Use capture (optional) (defaul false)
 */
JSHelper.prototype.addEventListener = function(element, eventName, handler, useCapture)
{

    // Boolean use capture defaults to false
    useCapture = typeof useCapture === 'undefined' ? false : Boolean(useCapture);

    // Class event storage
    var events = this._events;

    // Make sure events are set
    if (!events) this._events = events = {};

    // Make sure an array for the event type exists
    if (!events[eventName]) events[eventName] = [];

    // Push the details to the events object
    events[eventName].push({
        element    : element,
        handler    : handler,
        useCapture : useCapture,
    });

    this._addListener(element, eventName, handler, useCapture);
}

/**
 * Removes event listeners on a DOM node
 *
 * If no event name is given, all attached event listeners are removed.
 * If no callback is given, all callbacks for the event type will be removed.
 * This function can still remove "annonymous" functions that are given a name as they are declared.
 * 
 * @access public
 * @param  node    element    The target DOM node
 * @param  string  eventName  Event type
 * @param  closure handler    Callback event
 * @param  bool    useCapture Use capture (optional) (defaul false)
 */
JSHelper.prototype.removeEventListener = function(element, eventName, handler, useCapture)
{
    // If the eventName name was not provided - remove all event handlers on element
    if (!eventName) return this._removeElementListeners(element);

    // If the callback was not provided - remove all events of the type on the element
    if (!handler) return this._removeElementTypeListeners(element, eventName);

    // Default use capture
    useCapture = typeof useCapture === 'undefined' ? false : Boolean(useCapture);

    var eventObj = this._events[eventName];

    if (typeof eventObj === 'undefined') return;

    for (var i = 0, len = eventObj.length; i < len; i++)
    {
        if (eventObj[i]['handler'] === handler && eventObj[i]['useCapture'] === useCapture && eventObj[i]['element'] === element)
        {
            this._removeListener(element, eventName, handler, useCapture);
            this._events[eventName].splice(i, 1);
            break;
        }
    }
}

/**
 * Removes all event listeners registered by the library
 *
 * @access public
 */
JSHelper.prototype.clearEventListeners = function()
{
    var events = this._events;

    for (var eventName in events)
    {
        var eventObj = events[eventName];
        var i = eventObj.length;
        while (i--)
        {
            this._removeListener(eventObj[i]['element'], eventName, eventObj[i]['handler'], eventObj[i]['useCapture']);
            this._events[eventName].splice(i, 1);
        }
    }
}

/**
 * Removes all event listeners registered by the library on nodes
 * that are no longer part of the DOM tree
 *
 * @access public
 */
JSHelper.prototype.collectGarbage = function()
{
    var events = this._events;
    for (var eventName in events)
    {
        var eventObj = events[eventName];
        var i = eventObj.length;
        while (i--)
        {
            var el = eventObj[i]['element'];
            if (el == window || el == document || el == document.body) continue;
            if (!this.nodeExists(el))
            {
                this._removeListener(eventObj[i]['element'], eventName, eventObj[i]['handler'], eventObj[i]['useCapture']);
                this._events[eventName].splice(i, 1);
            }
        }
    }
}

/**
 * Removes all registered event listners on an element
 *
 * @access private
 * @param  node    element Target node element
 */
JSHelper.prototype._removeElementListeners = function(element)
{
    var events = this._events;
    for (var eventName in events)
    {
        var eventObj = events[eventName];
        var i = eventObj.length;
        while (i--)
        {
            if (eventObj[i]['element'] === element)
            {
                this._removeListener(eventObj[i]['element'], eventName, eventObj[i]['handler'], eventObj[i]['useCapture']);
                this._events[eventName].splice(i, 1);
            }
        }
    }
}

/**
 * Removes all registered event listners of a specific type on an element
 *
 * @access private
 * @param  node    element Target node element
 * @param  string  type    Event listener type
 */
JSHelper.prototype._removeElementTypeListeners = function(element, type)
{
    var eventObj = this._events[type];
    var i = eventObj.length;
    while (i--)
    {
        if (eventObj[i]['element'] === element)
        {
            this._removeListener(eventObj[i]['element'], type, eventObj[i]['handler'], eventObj[i]['useCapture']);
            this._events[type].splice(i, 1);
        }
    }
}

/**
 * Adds a listener to the element
 *
 * @access private
 * @param  node    element    The target DOM node
 * @param  string  eventName  Event type
 * @param  closure handler    Callback event
 * @param  bool    useCapture Use capture (optional) (defaul false)
 */
JSHelper.prototype._addListener = function(el, eventName, handler, useCapture)
{
    if (el.addEventListener)
    {
        el.addEventListener(eventName, handler, useCapture);
    }
    else
    {
        el.attachEvent('on' + eventName, handler, useCapture);
    }
}

/**
 * Removes a listener from the element
 *
 * @access private
 * @param  node    element    The target DOM node
 * @param  string  eventName  Event type
 * @param  closure handler    Callback event
 * @param  bool    useCapture Use capture (optional) (defaul false)
 */
JSHelper.prototype._removeListener = function(el, eventName, handler, useCapture)
{
    if (el.removeEventListener)
    {
        el.removeEventListener(eventName, handler, useCapture);
    }
    else
    {
        el.detachEvent('on' + eventName, handler, useCapture);
    }
}
/**
 * JSHelper Animation component
 *
 * @author    Joe J. Howard
 * @copyright Joe J. Howard
 * @license   https://github.com/kanso-cms/cms/blob/master/LICENSE
 */

/**
 * Vendor prefix a css property and convert to camelCase
 *
 * @access private
 * @param  string property The CSS base property
 * @return array
 */
JSHelper.prototype._vendorPrefix = function(property)
{
    // Properties to return
    var props = [];

    // Convert to regular hyphenated property 
    property = this.camelCaseToHyphen(property);

    // Is the property prefixable ?
    if (this.in_array(property, this.cssPrefixable))
    {
        var prefixes = this.cssPrefixes;

        // Loop vendor prefixes
        for (var i = 0; i < prefixes.length; i++)
        {
            props.push(prefixes[i] + this.ucfirst(this.toCamelCase(property)));
        }
    }

    // Add non-prefixed property
    props.push(this.toCamelCase(property));

    return props;
}

/**
 * Expand shorthand property to longhand properties 
 *
 * @access private
 * @param  string property The CSS base property (in camelCase)
 * @return array
 */
JSHelper.prototype._shortHandExpand = function(property, recurse)
{
    var _this = this;
    var props = this.shortHandProps;

    // Doesn't exist
    if (!props.hasOwnProperty(property))
    {
        return [property];
    }

    return props[property].map(function (p)
    {
        if (p.substr(0, 1) === '-')
        {
            var longhand = property + _this.toCamelCase(p);
        }
        else
        {
            var longhand = p;
        }
        //var longhand = p.substr(0, 1) === '-' ? property + p : p;
        return recurse ? _this._shortHandExpand(longhand, recurse) : longhand;
    });
}

/**
 * Get the element's computed style on a property
 *
 * @access private
 * @param  node   el   Target element
 * @param  string prop CSS property to check (in camelCase) (optional)
 * @return mixed
 */
JSHelper.prototype._computeStyle = function(el, property)
{
    if (window.getComputedStyle)
    {
        if (property)
        {
            return window.getComputedStyle(el, null)[property];
        }

        return window.getComputedStyle(el, null);
        
    }
    if (el.currentStyle)
    {
        if (property)
        {
            return el.currentStyle[property];
        }
        return el.currentStyle;
    }

    return '';
}

/**
 * Concatenate longhand to shorthand
 *
 * @access private
 * @param  node   el      Target element
 * @param  array  longHandProps Array of longhanded CSS properties in order (camelCased)
 * @return string
 */
JSHelper.prototype._concatShortHandProperties = function(el, longHandProps)
{
    var shorthand   = '';
    var multiValArr = [];

    for (var j = 0, len = longHandProps.length; j < len; j++)
    {
        var longHandStyle = this._computeStyle(el, longHandProps[j]);
        var isMulti       = longHandStyle.indexOf(',') >= 0;

        if (longHandStyle)
        {
            if (isMulti)
            {                        
                multiValArr.push(longHandStyle.split(',').map(Function.prototype.call, String.prototype.trim));
            }
            else
            {
                shorthand += ' '+longHandStyle;
            }
        }
    }

    if (!this.empty(multiValArr))
    {
        var _this = this;
        var multiValArrStrs = [];
        for (var k = 0, len = multiValArr.length; k < len; k++)
        {
            multiValArr[k].map(function (val, n)
            {
                if (!_this.isset(multiValArrStrs[n]))
                {
                    multiValArrStrs[n] = val;
                }
                else
                {
                    multiValArrStrs[n] += ' '+val;
                }
            });
        }

        return multiValArrStrs.join(', ');
    }

    return shorthand.trim();
}

/**
 * Normalizes and easing e.g 'ease-in-out' and 'easeInOut' will both return cubic bezier
 *
 * @access private
 * @param  string value easing value or string
 * @return array
 */
JSHelper.prototype._normalizeEasing = function(value)
{
    for (var camelCased in this.cssEasings)
    {
        if (!this.cssEasings.hasOwnProperty(camelCased))
        {
            continue;
        }
        if (value === this.cssEasings[camelCased] || value === camelCased)
        {
            return this.cssEasings[camelCased];
        }
    }

    return value;
}

/**
 * Get an element's currently displaying style
 * Works on shorthand and longhand
 *
 * @access public
 * @param  node   el   Target element
 * @param  string prop CSS property to check
 * @return string
 */
JSHelper.prototype.getStyle = function(el, prop)
{
    // Firefox and otther browsers do not concatenate to the shorthand property even when
    // it was defined as shorthand in the stylsheet
    // console.log(window.getComputedStyle(document.body));
    // console.log(window.getComputedStyle(document.body).padding);
    // console.log(window.getComputedStyle(document.body).getPropertyValue('padding'));
   
    // Additionally, some css values can be comma separated
    // e.g
    // transition height 300ms ease, width 300ms ease;

    // Normalize the property to camelCase and check for vendor prefixes
    var properties = this._vendorPrefix(prop);

    for (var i = 0, len = properties.length; i < len; i++)
    {
        // current prop
        var property = properties[i];

        // Get longhand properties in order
        var longHands = this._shortHandExpand(property);

        // is this a shorthand property ?
        var isShortHandProp = longHands.length === 1;

        // Do we need to concatenate to shorthand ?
        if (isShortHandProp)
        {
            return this._computeStyle(el, property);
        }

        var shorthand = this._concatShortHandProperties(el, longHands);
        
        if (shorthand)
        {
            return shorthand;
        }
    }
}

/**
 * Set CSS value(s) on element
 *
 * @access public
 * @param  node   el     Target DOM node
 * @param  string|object Assoc array of property->value or string property
 * @example JSHelper.css(node, { display : 'none' });
 * @example JSHelper.css(node, 'display', 'none');
 */
JSHelper.prototype.css = function(el, property, value)
{
    // If their is no value and property is an object
    if (this.is_object(property))
    {
        for (var key in property)
        {
            if (!property.hasOwnProperty(key))
            {
                continue;
            }

            this.css(el, key, property[key]);
        }
    }
    else
    {   
        // Normalise if this is an easing value - e.g display, 'ease-in-out'
        value = this._normalizeEasing(value);

        // vendor prefix the property if need be and convert to camelCase
        var properties = this._vendorPrefix(property);

        // Loop vendored (if added) and unvendored properties and apply
        for (var i = 0; i < properties.length; i++)
        {
            el.style[properties[i]] = value;
        }
    }
}

/**
 * Animate a css proprety
 *
 * @access public
 * @param  node   el          Target DOM node
 * @param  string cssProperty CSS property
 * @param  mixed  from        Start value
 * @param  mixed  to          Ending value
 * @param  int    time        Animation time in ms
 * @param  string easing      Easing function
 */
JSHelper.prototype.animate = function(el, cssProperty, from, to, time, easing)
{     
    // Set defaults if values were not provided;
    time   = (typeof time === 'undefined' ? 300 : time);
    easing = (typeof easing === 'undefined' ? 'linear' : this._normalizeEasing(easing));

    // Width and height need to use js to get the starting size
    // if it was set to auto/initial/null
    if ((cssProperty === 'height' || cssProperty === 'width') && (from === 'initial' || from === 'auto' || !from) )
    {
        if (cssProperty === 'height')
        {
            from = (el.clientHeight || el.offsetHeight) + 'px';
        }
        else
        {
            from = (el.clientWidth || el.offsetWidth) + 'px';
        }

        // Float/integer of number fallback if not provided as string
        if (Number.isInteger(from) || Number(from) === from && from % 1 !== 0)
        {
            from = from + 'px';
        }

        this.css(el, cssProperty, from);
    }

    // Ortherwise set the current style or the defined "from"
    else
    {
        if (from === 'initial' || from === 'auto' || !from)
        {
            this.css(el, cssProperty, this.getStyle(el, cssProperty));
        }
        else
        {
            this.css(el, cssProperty, from);
        }
    }


    // We need to merge transitions into a single allied value
    var existingTransitions = this.getStyle(el, 'transition');

    if (existingTransitions !== 'none' && existingTransitions !== 'all 0s ease 0s')
    {
        // Don't apply the same transition value twice 
        // The animation transition on a property should override 
        // an existing one
        var transitions = existingTransitions.split(',').map(Function.prototype.call, String.prototype.trim);
        transitions.push(cssProperty + ' ' + time + 'ms ' + easing);

        var props  = [];
        for (var i = transitions.length - 1; i >= 0; --i)
        {
            var prop = transitions[i].split(' ')[0];
            if (this.in_array(prop, props))
            {
               transitions.splice(i, 1);
            }
            props.push(prop);
        }

        this.css(el, 'transition', transitions.join(', '));
    }
    else
    {
        this.css(el, 'transition', cssProperty + ' ' + time + 'ms ' + easing);
    }

    this.css(el, cssProperty, to);

    // Add an event listener to check when the transition has finished
    var _this = this;

    el.addEventListener('transitionend', function transitionEnd(e)
    {
        e = e || window.event;

        if (e.propertyName == cssProperty)
        {
            _this.removeStyle(el, 'transition');

            el.removeEventListener('transitionend', transitionEnd, false);
        }

    }, false);
}



/**
 * Browser utility functions
 *
 * @author    Joe J. Howard
 * @copyright Joe J. Howard
 * @license   https://github.com/kanso-cms/cms/blob/master/LICENSE
 */

/**
 * Get the browser with version
 *
 * @access public
 * @return object
 */
JSHelper.prototype.getBrowser = function()
{
    if (this.browser) return this.browser;
    var nVer = navigator.appVersion;
    var nAgt = navigator.userAgent;
    var browserName = navigator.appName;
    var fullVersion = "" + parseFloat(navigator.appVersion);
    var majorVersion = parseInt(navigator.appVersion, 10);
    var nameOffset, verOffset, ix;
    if ((verOffset = nAgt.indexOf("OPR/")) != -1)
    {
        browserName = "Opera";
        fullVersion = nAgt.substring(verOffset + 4)
    } else {
        if ((verOffset = nAgt.indexOf("Opera")) != -1)
        {
            browserName = "Opera";
            fullVersion = nAgt.substring(verOffset + 6);
            if ((verOffset = nAgt.indexOf("Version")) != -1)
            {
                fullVersion = nAgt.substring(verOffset + 8)
            }
        } else {
            if ((verOffset = nAgt.indexOf("MSIE")) != -1)
            {
                browserName = "Microsoft Internet Explorer";
                fullVersion = nAgt.substring(verOffset + 5)
            } else {
                if ((verOffset = nAgt.indexOf("Chrome")) != -1)
                {
                    browserName = "Chrome";
                    fullVersion = nAgt.substring(verOffset + 7)
                } else {
                    if ((verOffset = nAgt.indexOf("Safari")) != -1)
                    {
                        browserName = "Safari";
                        fullVersion = nAgt.substring(verOffset + 7);
                        if ((verOffset = nAgt.indexOf("Version")) != -1)
                        {
                            fullVersion = nAgt.substring(verOffset + 8)
                        }
                    } else {
                        if ((verOffset = nAgt.indexOf("Firefox")) != -1)
                        {
                            browserName = "Firefox";
                            fullVersion = nAgt.substring(verOffset + 8)
                        } else {
                            if ((nameOffset = nAgt.lastIndexOf(" ") + 1) < (verOffset = nAgt.lastIndexOf("/")))
                            {
                                browserName = nAgt.substring(nameOffset, verOffset);
                                fullVersion = nAgt.substring(verOffset + 1);
                                if (browserName.toLowerCase() == browserName.toUpperCase())
                                {
                                    browserName = navigator.appName
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    if ((ix = fullVersion.indexOf(";")) != -1)
    {
        fullVersion = fullVersion.substring(0, ix)
    }
    if ((ix = fullVersion.indexOf(" ")) != -1)
    {
        fullVersion = fullVersion.substring(0, ix)
    }
    majorVersion = parseInt("" + fullVersion, 10);
    if (isNaN(majorVersion))
    {
        fullVersion = "" + parseFloat(navigator.appVersion);
        majorVersion = parseInt(navigator.appVersion, 10)
    }
    this.browser = {'name': browserName, 'version': majorVersion };

    return this.browser;
}

/**
 * Is this a mobile user agent?
 *
 * @return bool
 */
JSHelper.prototype.isMobile = function()
{
	return this.in_array(
		
		this.getBrowser()['name'].toLowerCase(),
		
		['android', 'webos', 'iphone', 'ipad', 'ipod', 'blackberry', 'iemobile', 'opera mini']

	);   
}

/**
 * Is this a mobile user agent?
 *
 * @return bool
 */
JSHelper.prototype.isRetina = function()
{
    var mediaQuery = "(-webkit-min-device-pixel-ratio: 1.5),\
                      (min--moz-device-pixel-ratio: 1.5),\
                      (-o-min-device-pixel-ratio: 3/2),\
                      (min-resolution: 1.5dppx)";

    if (window.devicePixelRatio > 1)
    {
      return true;
    }

    if (window.matchMedia && window.matchMedia(mediaQuery).matches)
    {
      return true;
    }

    return false;
}

	Container.singleton('JSHelper', JSHelper).get('JSHelper').getBrowser();

})();

// Vendors
/**
 * Smoothscroll
 *
 * This is a utility class used internally to scroll to elements on a page.
 * It can still be invoked directly via the IOC container if you want to use it.
 * @example Container.get('SmoothScroll').animateScroll('#' + id, null, options);
 * @see     https://github.com/cferdinandi/smooth-scroll
 * @see     waypoints.js
 */
(function() {

        (function (root, factory) {
        if ( typeof define === 'function' && define.amd ) {
            define([], factory(root));
        } else if ( typeof exports === 'object' ) {
            module.exports = factory(root);
        } else {
            root.smoothScroll = factory(root);
        }
    })(typeof global !== 'undefined' ? global : this.window || this.global, function (root) {

        'use strict';

        //
        // Variables
        //

        var smoothScroll = {}; // Object for public APIs
        var supports = 'querySelector' in document && 'addEventListener' in root; // Feature test
        var settings, eventTimeout, fixedHeader, headerHeight, animationInterval;

        // Default settings
        var defaults = {
            selector: '[data-scroll]',
            selectorHeader: '[data-scroll-header]',
            speed: 500,
            easing: 'easeInOutCubic',
            offset: 0,
            updateURL: true,
            callback: function () {}
        };


        //
        // Methods
        //

        /**
         * Merge two or more objects. Returns a new object.
         * @private
         * @param {Boolean}  deep     If true, do a deep (or recursive) merge [optional]
         * @param {Object}   objects  The objects to merge together
         * @returns {Object}          Merged values of defaults and options
         */
        var extend = function () {

            // Variables
            var extended = {};
            var deep = false;
            var i = 0;
            var length = arguments.length;

            // Check if a deep merge
            if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
                deep = arguments[0];
                i++;
            }

            // Merge the object into the extended object
            var merge = function (obj) {
                for ( var prop in obj ) {
                    if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
                        // If deep merge and property is an object, merge properties
                        if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
                            extended[prop] = extend( true, extended[prop], obj[prop] );
                        } else {
                            extended[prop] = obj[prop];
                        }
                    }
                }
            };

            // Loop through each object and conduct a merge
            for ( ; i < length; i++ ) {
                var obj = arguments[i];
                merge(obj);
            }

            return extended;

        };

        /**
         * Get the height of an element.
         * @private
         * @param  {Node} elem The element to get the height of
         * @return {Number}    The element's height in pixels
         */
        var getHeight = function ( elem ) {
            return Math.max( elem.scrollHeight, elem.offsetHeight, elem.clientHeight );
        };

        /**
         * Get the closest matching element up the DOM tree.
         * @private
         * @param  {Element} elem     Starting element
         * @param  {String}  selector Selector to match against (class, ID, data attribute, or tag)
         * @return {Boolean|Element}  Returns null if not match found
         */
        var getClosest = function ( elem, selector ) {

            // Variables
            var firstChar = selector.charAt(0);
            var supports = 'classList' in document.documentElement;
            var attribute, value;

            // If selector is a data attribute, split attribute from value
            if ( firstChar === '[' ) {
                selector = selector.substr(1, selector.length - 2);
                attribute = selector.split( '=' );

                if ( attribute.length > 1 ) {
                    value = true;
                    attribute[1] = attribute[1].replace( /"/g, '' ).replace( /'/g, '' );
                }
            }

            // Get closest match
            for ( ; elem && elem !== document; elem = elem.parentNode ) {

                // If selector is a class
                if ( firstChar === '.' ) {
                    if ( supports ) {
                        if ( elem.classList.contains( selector.substr(1) ) ) {
                            return elem;
                        }
                    } else {
                        if ( new RegExp('(^|\\s)' + selector.substr(1) + '(\\s|$)').test( elem.className ) ) {
                            return elem;
                        }
                    }
                }

                // If selector is an ID
                if ( firstChar === '#' ) {
                    if ( elem.id === selector.substr(1) ) {
                        return elem;
                    }
                }

                // If selector is a data attribute
                if ( firstChar === '[' ) {
                    if ( elem.hasAttribute( attribute[0] ) ) {
                        if ( value ) {
                            if ( elem.getAttribute( attribute[0] ) === attribute[1] ) {
                                return elem;
                            }
                        } else {
                            return elem;
                        }
                    }
                }

                // If selector is a tag
                if ( elem.tagName.toLowerCase() === selector ) {
                    return elem;
                }

            }

            return null;

        };

        /**
         * Escape special characters for use with querySelector
         * @public
         * @param {String} id The anchor ID to escape
         * @author Mathias Bynens
         * @link https://github.com/mathiasbynens/CSS.escape
         */
        smoothScroll.escapeCharacters = function ( id ) {

            // Remove leading hash
            if ( id.charAt(0) === '#' ) {
                id = id.substr(1);
            }

            var string = String(id);
            var length = string.length;
            var index = -1;
            var codeUnit;
            var result = '';
            var firstCodeUnit = string.charCodeAt(0);
            while (++index < length) {
                codeUnit = string.charCodeAt(index);
                // Note: there’s no need to special-case astral symbols, surrogate
                // pairs, or lone surrogates.

                // If the character is NULL (U+0000), then throw an
                // `InvalidCharacterError` exception and terminate these steps.
                if (codeUnit === 0x0000) {
                    throw new InvalidCharacterError(
                        'Invalid character: the input contains U+0000.'
                    );
                }

                if (
                    // If the character is in the range [\1-\1F] (U+0001 to U+001F) or is
                    // U+007F, […]
                    (codeUnit >= 0x0001 && codeUnit <= 0x001F) || codeUnit == 0x007F ||
                    // If the character is the first character and is in the range [0-9]
                    // (U+0030 to U+0039), […]
                    (index === 0 && codeUnit >= 0x0030 && codeUnit <= 0x0039) ||
                    // If the character is the second character and is in the range [0-9]
                    // (U+0030 to U+0039) and the first character is a `-` (U+002D), […]
                    (
                        index === 1 &&
                        codeUnit >= 0x0030 && codeUnit <= 0x0039 &&
                        firstCodeUnit === 0x002D
                    )
                ) {
                    // http://dev.w3.org/csswg/cssom/#escape-a-character-as-code-point
                    result += '\\' + codeUnit.toString(16) + ' ';
                    continue;
                }

                // If the character is not handled by one of the above rules and is
                // greater than or equal to U+0080, is `-` (U+002D) or `_` (U+005F), or
                // is in one of the ranges [0-9] (U+0030 to U+0039), [A-Z] (U+0041 to
                // U+005A), or [a-z] (U+0061 to U+007A), […]
                if (
                    codeUnit >= 0x0080 ||
                    codeUnit === 0x002D ||
                    codeUnit === 0x005F ||
                    codeUnit >= 0x0030 && codeUnit <= 0x0039 ||
                    codeUnit >= 0x0041 && codeUnit <= 0x005A ||
                    codeUnit >= 0x0061 && codeUnit <= 0x007A
                ) {
                    // the character itself
                    result += string.charAt(index);
                    continue;
                }

                // Otherwise, the escaped character.
                // http://dev.w3.org/csswg/cssom/#escape-a-character
                result += '\\' + string.charAt(index);

            }

            return '#' + result;

        };

        /**
         * Calculate the easing pattern
         * @private
         * @link https://gist.github.com/gre/1650294
         * @param {String} type Easing pattern
         * @param {Number} time Time animation should take to complete
         * @returns {Number}
         */
        var easingPattern = function ( type, time ) {
            var pattern;
            if ( type === 'easeInQuad' ) pattern = time * time; // accelerating from zero velocity
            if ( type === 'easeOutQuad' ) pattern = time * (2 - time); // decelerating to zero velocity
            if ( type === 'easeInOutQuad' ) pattern = time < 0.5 ? 2 * time * time : -1 + (4 - 2 * time) * time; // acceleration until halfway, then deceleration
            if ( type === 'easeInCubic' ) pattern = time * time * time; // accelerating from zero velocity
            if ( type === 'easeOutCubic' ) pattern = (--time) * time * time + 1; // decelerating to zero velocity
            if ( type === 'easeInOutCubic' ) pattern = time < 0.5 ? 4 * time * time * time : (time - 1) * (2 * time - 2) * (2 * time - 2) + 1; // acceleration until halfway, then deceleration
            if ( type === 'easeInQuart' ) pattern = time * time * time * time; // accelerating from zero velocity
            if ( type === 'easeOutQuart' ) pattern = 1 - (--time) * time * time * time; // decelerating to zero velocity
            if ( type === 'easeInOutQuart' ) pattern = time < 0.5 ? 8 * time * time * time * time : 1 - 8 * (--time) * time * time * time; // acceleration until halfway, then deceleration
            if ( type === 'easeInQuint' ) pattern = time * time * time * time * time; // accelerating from zero velocity
            if ( type === 'easeOutQuint' ) pattern = 1 + (--time) * time * time * time * time; // decelerating to zero velocity
            if ( type === 'easeInOutQuint' ) pattern = time < 0.5 ? 16 * time * time * time * time * time : 1 + 16 * (--time) * time * time * time * time; // acceleration until halfway, then deceleration
            return pattern || time; // no easing, no acceleration
        };

        /**
         * Calculate how far to scroll
         * @private
         * @param {Element} anchor The anchor element to scroll to
         * @param {Number} headerHeight Height of a fixed header, if any
         * @param {Number} offset Number of pixels by which to offset scroll
         * @returns {Number}
         */
        var getEndLocation = function ( anchor, headerHeight, offset ) {
            var location = 0;
            if (anchor.offsetParent) {
                do {
                    location += anchor.offsetTop;
                    anchor = anchor.offsetParent;
                } while (anchor);
            }
            location = location - headerHeight - offset;
            return location >= 0 ? location : 0;
        };

        /**
         * Determine the document's height
         * @private
         * @returns {Number}
         */
        var getDocumentHeight = function () {
            return Math.max(
                root.document.body.scrollHeight, root.document.documentElement.scrollHeight,
                root.document.body.offsetHeight, root.document.documentElement.offsetHeight,
                root.document.body.clientHeight, root.document.documentElement.clientHeight
            );
        };

        /**
         * Convert data-options attribute into an object of key/value pairs
         * @private
         * @param {String} options Link-specific options as a data attribute string
         * @returns {Object}
         */
        var getDataOptions = function ( options ) {
            return !options || !(typeof JSON === 'object' && typeof JSON.parse === 'function') ? {} : JSON.parse( options );
        };

        /**
         * Update the URL
         * @private
         * @param {Element} anchor The element to scroll to
         * @param {Boolean} url Whether or not to update the URL history
         */
        var updateUrl = function ( anchor, url ) {
            if ( root.history.pushState && (url || url === 'true') && root.location.protocol !== 'file:' ) {
                root.history.pushState( null, null, [root.location.protocol, '//', root.location.host, root.location.pathname, root.location.search, anchor].join('') );
            }
        };

        var getHeaderHeight = function ( header ) {
            return header === null ? 0 : ( getHeight( header ) + header.offsetTop );
        };

        /**
         * Start/stop the scrolling animation
         * @public
         * @param {Element} anchor The element to scroll to
         * @param {Element} toggle The element that toggled the scroll event
         * @param {Object} options
         */
        smoothScroll.animateScroll = function ( anchor, toggle, options ) {

            // Options and overrides
            var overrides = getDataOptions( toggle ? toggle.getAttribute('data-options') : null );
            var animateSettings = extend( settings || defaults, options || {}, overrides ); // Merge user options with defaults

            // Selectors and variables
            var isNum = Object.prototype.toString.call( anchor ) === '[object Number]' ? true : false;
            var anchorElem = isNum ? null : ( anchor === '#' ? root.document.documentElement : root.document.querySelector(anchor) );
            if ( !isNum && !anchorElem ) return;
            var startLocation = root.pageYOffset; // Current location on the page
            if ( !fixedHeader ) { fixedHeader = root.document.querySelector( animateSettings.selectorHeader ); }  // Get the fixed header if not already set
            if ( !headerHeight ) { headerHeight = getHeaderHeight( fixedHeader ); } // Get the height of a fixed header if one exists and not already set
            var endLocation = isNum ? anchor : getEndLocation( anchorElem, headerHeight, parseInt(animateSettings.offset, 10) ); // Location to scroll to
            var distance = endLocation - startLocation; // distance to travel
            var documentHeight = getDocumentHeight();
            var timeLapsed = 0;
            var percentage, position;

            // Update URL
            if ( !isNum ) {
                updateUrl(anchor, animateSettings.updateURL);
            }

            /**
             * Stop the scroll animation when it reaches its target (or the bottom/top of page)
             * @private
             * @param {Number} position Current position on the page
             * @param {Number} endLocation Scroll to location
             * @param {Number} animationInterval How much to scroll on this loop
             */
            var stopAnimateScroll = function (position, endLocation, animationInterval) {
                var currentLocation = root.pageYOffset;
                if ( position == endLocation || currentLocation == endLocation || ( (root.innerHeight + currentLocation) >= documentHeight ) ) {
                    clearInterval(animationInterval);
                    if ( !isNum ) {
                        anchorElem.focus();
                    }
                    animateSettings.callback( anchor, toggle ); // Run callbacks after animation complete
                }
            };

            /**
             * Loop scrolling animation
             * @private
             */
            var loopAnimateScroll = function () {
                timeLapsed += 16;
                percentage = ( timeLapsed / parseInt(animateSettings.speed, 10) );
                percentage = ( percentage > 1 ) ? 1 : percentage;
                position = startLocation + ( distance * easingPattern(animateSettings.easing, percentage) );
                root.scrollTo( 0, Math.floor(position) );
                stopAnimateScroll(position, endLocation, animationInterval);
            };

            /**
             * Set interval timer
             * @private
             */
            var startAnimateScroll = function () {
                clearInterval(animationInterval);
                animationInterval = setInterval(loopAnimateScroll, 16);
            };

            /**
             * Reset position to fix weird iOS bug
             * @link https://github.com/cferdinandi/smooth-scroll/issues/45
             */
            if ( root.pageYOffset === 0 ) {
                root.scrollTo( 0, 0 );
            }

            // Start scrolling animation
            startAnimateScroll();

        };

        /**
         * If smooth scroll element clicked, animate scroll
         * @private
         */
        var eventHandler = function (e) {
            e = e || window.event;

            // Don't run if right-click or command/control + click
            if ( e.button !== 0 || e.metaKey || e.ctrlKey ) return;

            // If a smooth scroll link, animate it
            var toggle = getClosest( e.target, settings.selector );
            if ( toggle && toggle.tagName.toLowerCase() === 'a' ) {
                e.preventDefault(); // Prevent default click event
                var hash = smoothScroll.escapeCharacters( toggle.hash ); // Escape hash characters
                smoothScroll.animateScroll( hash, toggle, settings); // Animate scroll
            }

        };

        /**
         * On window scroll and resize, only run events at a rate of 15fps for better performance
         * @private
         * @param  {Function} eventTimeout Timeout function
         * @param  {Object} settings
         */
        var eventThrottler = function (e) {
            if ( !eventTimeout ) {
                eventTimeout = setTimeout(function() {
                    eventTimeout = null; // Reset timeout
                    headerHeight = getHeaderHeight( fixedHeader ); // Get the height of a fixed header if one exists
                }, 66);
            }
        };

        /**
         * Destroy the current initialization.
         * @public
         */
        smoothScroll.destroy = function () {

            // If plugin isn't already initialized, stop
            if ( !settings ) return;

            // Remove event listeners
            root.document.removeEventListener( 'click', eventHandler, false );
            root.removeEventListener( 'resize', eventThrottler, false );

            // Reset varaibles
            settings = null;
            eventTimeout = null;
            fixedHeader = null;
            headerHeight = null;
            animationInterval = null;
        };

        /**
         * Initialize Smooth Scroll
         * @public
         * @param {Object} options User settings
         */
        smoothScroll.init = function ( options ) {

            // feature test
            if ( !supports ) return;

            // Destroy any existing initializations
            smoothScroll.destroy();

            // Selectors and variables
            settings = extend( defaults, options || {} ); // Merge user options with defaults
            fixedHeader = root.document.querySelector( settings.selectorHeader ); // Get the fixed header
            headerHeight = getHeaderHeight( fixedHeader );

            // When a toggle is clicked, run the click handler
            root.document.addEventListener('click', eventHandler, false );
            if ( fixedHeader ) { root.addEventListener( 'resize', eventThrottler, false ); }

        };


        //
        // Public APIs
        //

        return smoothScroll;

    });

    var scrl = smoothScroll;

    window.smoothScroll = null;

    // Load into container
    Container.set('SmoothScroll', scrl);

}());
/**
 * Flickity PACKAGED v2.0.5
 * Touch, responsive, flickable carousels
 *
 * Licensed GPLv3 for open source use
 * or Flickity Commercial License for commercial use
 *
 * http://flickity.metafizzy.co
 * Copyright 2016 Metafizzy
 *
 */
(function() {
	!function(t,e){"function"==typeof define&&define.amd?define("jquery-bridget/jquery-bridget",["jquery"],function(i){return e(t,i)}):"object"==typeof module&&module.exports?module.exports=e(t,require("jquery")):t.jQueryBridget=e(t,t.jQuery)}(window,function(t,e){"use strict";function i(i,o,a){function l(t,e,n){var s,o="$()."+i+'("'+e+'")';return t.each(function(t,l){var h=a.data(l,i);if(!h)return void r(i+" not initialized. Cannot call methods, i.e. "+o);var c=h[e];if(!c||"_"==e.charAt(0))return void r(o+" is not a valid method");var d=c.apply(h,n);s=void 0===s?d:s}),void 0!==s?s:t}function h(t,e){t.each(function(t,n){var s=a.data(n,i);s?(s.option(e),s._init()):(s=new o(n,e),a.data(n,i,s))})}a=a||e||t.jQuery,a&&(o.prototype.option||(o.prototype.option=function(t){a.isPlainObject(t)&&(this.options=a.extend(!0,this.options,t))}),a.fn[i]=function(t){if("string"==typeof t){var e=s.call(arguments,1);return l(this,t,e)}return h(this,t),this},n(a))}function n(t){!t||t&&t.bridget||(t.bridget=i)}var s=Array.prototype.slice,o=t.console,r="undefined"==typeof o?function(){}:function(t){o.error(t)};return n(e||t.jQuery),i}),function(t,e){"function"==typeof define&&define.amd?define("ev-emitter/ev-emitter",e):"object"==typeof module&&module.exports?module.exports=e():t.EvEmitter=e()}("undefined"!=typeof window?window:this,function(){function t(){}var e=t.prototype;return e.on=function(t,e){if(t&&e){var i=this._events=this._events||{},n=i[t]=i[t]||[];return n.indexOf(e)==-1&&n.push(e),this}},e.once=function(t,e){if(t&&e){this.on(t,e);var i=this._onceEvents=this._onceEvents||{},n=i[t]=i[t]||{};return n[e]=!0,this}},e.off=function(t,e){var i=this._events&&this._events[t];if(i&&i.length){var n=i.indexOf(e);return n!=-1&&i.splice(n,1),this}},e.emitEvent=function(t,e){var i=this._events&&this._events[t];if(i&&i.length){var n=0,s=i[n];e=e||[];for(var o=this._onceEvents&&this._onceEvents[t];s;){var r=o&&o[s];r&&(this.off(t,s),delete o[s]),s.apply(this,e),n+=r?0:1,s=i[n]}return this}},t}),function(t,e){"use strict";"function"==typeof define&&define.amd?define("get-size/get-size",[],function(){return e()}):"object"==typeof module&&module.exports?module.exports=e():t.getSize=e()}(window,function(){"use strict";function t(t){var e=parseFloat(t),i=t.indexOf("%")==-1&&!isNaN(e);return i&&e}function e(){}function i(){for(var t={width:0,height:0,innerWidth:0,innerHeight:0,outerWidth:0,outerHeight:0},e=0;e<h;e++){var i=l[e];t[i]=0}return t}function n(t){var e=getComputedStyle(t);return e||a("Style returned "+e+". Are you running this code in a hidden iframe on Firefox? See http://bit.ly/getsizebug1"),e}function s(){if(!c){c=!0;var e=document.createElement("div");e.style.width="200px",e.style.padding="1px 2px 3px 4px",e.style.borderStyle="solid",e.style.borderWidth="1px 2px 3px 4px",e.style.boxSizing="border-box";var i=document.body||document.documentElement;i.appendChild(e);var s=n(e);o.isBoxSizeOuter=r=200==t(s.width),i.removeChild(e)}}function o(e){if(s(),"string"==typeof e&&(e=document.querySelector(e)),e&&"object"==typeof e&&e.nodeType){var o=n(e);if("none"==o.display)return i();var a={};a.width=e.offsetWidth,a.height=e.offsetHeight;for(var c=a.isBorderBox="border-box"==o.boxSizing,d=0;d<h;d++){var u=l[d],f=o[u],p=parseFloat(f);a[u]=isNaN(p)?0:p}var v=a.paddingLeft+a.paddingRight,g=a.paddingTop+a.paddingBottom,m=a.marginLeft+a.marginRight,y=a.marginTop+a.marginBottom,S=a.borderLeftWidth+a.borderRightWidth,E=a.borderTopWidth+a.borderBottomWidth,b=c&&r,x=t(o.width);x!==!1&&(a.width=x+(b?0:v+S));var C=t(o.height);return C!==!1&&(a.height=C+(b?0:g+E)),a.innerWidth=a.width-(v+S),a.innerHeight=a.height-(g+E),a.outerWidth=a.width+m,a.outerHeight=a.height+y,a}}var r,a="undefined"==typeof console?e:function(t){console.error(t)},l=["paddingLeft","paddingRight","paddingTop","paddingBottom","marginLeft","marginRight","marginTop","marginBottom","borderLeftWidth","borderRightWidth","borderTopWidth","borderBottomWidth"],h=l.length,c=!1;return o}),function(t,e){"use strict";"function"==typeof define&&define.amd?define("desandro-matches-selector/matches-selector",e):"object"==typeof module&&module.exports?module.exports=e():t.matchesSelector=e()}(window,function(){"use strict";var t=function(){var t=Element.prototype;if(t.matches)return"matches";if(t.matchesSelector)return"matchesSelector";for(var e=["webkit","moz","ms","o"],i=0;i<e.length;i++){var n=e[i],s=n+"MatchesSelector";if(t[s])return s}}();return function(e,i){return e[t](i)}}),function(t,e){"function"==typeof define&&define.amd?define("fizzy-ui-utils/utils",["desandro-matches-selector/matches-selector"],function(i){return e(t,i)}):"object"==typeof module&&module.exports?module.exports=e(t,require("desandro-matches-selector")):t.fizzyUIUtils=e(t,t.matchesSelector)}(window,function(t,e){var i={};i.extend=function(t,e){for(var i in e)t[i]=e[i];return t},i.modulo=function(t,e){return(t%e+e)%e},i.makeArray=function(t){var e=[];if(Array.isArray(t))e=t;else if(t&&"number"==typeof t.length)for(var i=0;i<t.length;i++)e.push(t[i]);else e.push(t);return e},i.removeFrom=function(t,e){var i=t.indexOf(e);i!=-1&&t.splice(i,1)},i.getParent=function(t,i){for(;t!=document.body;)if(t=t.parentNode,e(t,i))return t},i.getQueryElement=function(t){return"string"==typeof t?document.querySelector(t):t},i.handleEvent=function(t){var e="on"+t.type;this[e]&&this[e](t)},i.filterFindElements=function(t,n){t=i.makeArray(t);var s=[];return t.forEach(function(t){if(t instanceof HTMLElement){if(!n)return void s.push(t);e(t,n)&&s.push(t);for(var i=t.querySelectorAll(n),o=0;o<i.length;o++)s.push(i[o])}}),s},i.debounceMethod=function(t,e,i){var n=t.prototype[e],s=e+"Timeout";t.prototype[e]=function(){var t=this[s];t&&clearTimeout(t);var e=arguments,o=this;this[s]=setTimeout(function(){n.apply(o,e),delete o[s]},i||100)}},i.docReady=function(t){var e=document.readyState;"complete"==e||"interactive"==e?setTimeout(t):document.addEventListener("DOMContentLoaded",t)},i.toDashed=function(t){return t.replace(/(.)([A-Z])/g,function(t,e,i){return e+"-"+i}).toLowerCase()};var n=t.console;return i.htmlInit=function(e,s){i.docReady(function(){var o=i.toDashed(s),r="data-"+o,a=document.querySelectorAll("["+r+"]"),l=document.querySelectorAll(".js-"+o),h=i.makeArray(a).concat(i.makeArray(l)),c=r+"-options",d=t.jQuery;h.forEach(function(t){var i,o=t.getAttribute(r)||t.getAttribute(c);try{i=o&&JSON.parse(o)}catch(a){return void(n&&n.error("Error parsing "+r+" on "+t.className+": "+a))}var l=new e(t,i);d&&d.data(t,s,l)})})},i}),function(t,e){"function"==typeof define&&define.amd?define("flickity/js/cell",["get-size/get-size"],function(i){return e(t,i)}):"object"==typeof module&&module.exports?module.exports=e(t,require("get-size")):(t.Flickity=t.Flickity||{},t.Flickity.Cell=e(t,t.getSize))}(window,function(t,e){function i(t,e){this.element=t,this.parent=e,this.create()}var n=i.prototype;return n.create=function(){this.element.style.position="absolute",this.x=0,this.shift=0},n.destroy=function(){this.element.style.position="";var t=this.parent.originSide;this.element.style[t]=""},n.getSize=function(){this.size=e(this.element)},n.setPosition=function(t){this.x=t,this.updateTarget(),this.renderPosition(t)},n.updateTarget=n.setDefaultTarget=function(){var t="left"==this.parent.originSide?"marginLeft":"marginRight";this.target=this.x+this.size[t]+this.size.width*this.parent.cellAlign},n.renderPosition=function(t){var e=this.parent.originSide;this.element.style[e]=this.parent.getPositionValue(t)},n.wrapShift=function(t){this.shift=t,this.renderPosition(this.x+this.parent.slideableWidth*t)},n.remove=function(){this.element.parentNode.removeChild(this.element)},i}),function(t,e){"function"==typeof define&&define.amd?define("flickity/js/slide",e):"object"==typeof module&&module.exports?module.exports=e():(t.Flickity=t.Flickity||{},t.Flickity.Slide=e())}(window,function(){"use strict";function t(t){this.parent=t,this.isOriginLeft="left"==t.originSide,this.cells=[],this.outerWidth=0,this.height=0}var e=t.prototype;return e.addCell=function(t){if(this.cells.push(t),this.outerWidth+=t.size.outerWidth,this.height=Math.max(t.size.outerHeight,this.height),1==this.cells.length){this.x=t.x;var e=this.isOriginLeft?"marginLeft":"marginRight";this.firstMargin=t.size[e]}},e.updateTarget=function(){var t=this.isOriginLeft?"marginRight":"marginLeft",e=this.getLastCell(),i=e?e.size[t]:0,n=this.outerWidth-(this.firstMargin+i);this.target=this.x+this.firstMargin+n*this.parent.cellAlign},e.getLastCell=function(){return this.cells[this.cells.length-1]},e.select=function(){this.changeSelectedClass("add")},e.unselect=function(){this.changeSelectedClass("remove")},e.changeSelectedClass=function(t){this.cells.forEach(function(e){e.element.classList[t]("is-selected")})},e.getCellElements=function(){return this.cells.map(function(t){return t.element})},t}),function(t,e){"function"==typeof define&&define.amd?define("flickity/js/animate",["fizzy-ui-utils/utils"],function(i){return e(t,i)}):"object"==typeof module&&module.exports?module.exports=e(t,require("fizzy-ui-utils")):(t.Flickity=t.Flickity||{},t.Flickity.animatePrototype=e(t,t.fizzyUIUtils))}(window,function(t,e){var i=t.requestAnimationFrame||t.webkitRequestAnimationFrame,n=0;i||(i=function(t){var e=(new Date).getTime(),i=Math.max(0,16-(e-n)),s=setTimeout(t,i);return n=e+i,s});var s={};s.startAnimation=function(){this.isAnimating||(this.isAnimating=!0,this.restingFrames=0,this.animate())},s.animate=function(){this.applyDragForce(),this.applySelectedAttraction();var t=this.x;if(this.integratePhysics(),this.positionSlider(),this.settle(t),this.isAnimating){var e=this;i(function(){e.animate()})}};var o=function(){var t=document.documentElement.style;return"string"==typeof t.transform?"transform":"WebkitTransform"}();return s.positionSlider=function(){var t=this.x;this.options.wrapAround&&this.cells.length>1&&(t=e.modulo(t,this.slideableWidth),t-=this.slideableWidth,this.shiftWrapCells(t)),t+=this.cursorPosition,t=this.options.rightToLeft&&o?-t:t;var i=this.getPositionValue(t);this.slider.style[o]=this.isAnimating?"translate3d("+i+",0,0)":"translateX("+i+")";var n=this.slides[0];if(n){var s=-this.x-n.target,r=s/this.slidesWidth;this.dispatchEvent("scroll",null,[r,s])}},s.positionSliderAtSelected=function(){this.cells.length&&(this.x=-this.selectedSlide.target,this.positionSlider())},s.getPositionValue=function(t){return this.options.percentPosition?.01*Math.round(t/this.size.innerWidth*1e4)+"%":Math.round(t)+"px"},s.settle=function(t){this.isPointerDown||Math.round(100*this.x)!=Math.round(100*t)||this.restingFrames++,this.restingFrames>2&&(this.isAnimating=!1,delete this.isFreeScrolling,this.positionSlider(),this.dispatchEvent("settle"))},s.shiftWrapCells=function(t){var e=this.cursorPosition+t;this._shiftCells(this.beforeShiftCells,e,-1);var i=this.size.innerWidth-(t+this.slideableWidth+this.cursorPosition);this._shiftCells(this.afterShiftCells,i,1)},s._shiftCells=function(t,e,i){for(var n=0;n<t.length;n++){var s=t[n],o=e>0?i:0;s.wrapShift(o),e-=s.size.outerWidth}},s._unshiftCells=function(t){if(t&&t.length)for(var e=0;e<t.length;e++)t[e].wrapShift(0)},s.integratePhysics=function(){this.x+=this.velocity,this.velocity*=this.getFrictionFactor()},s.applyForce=function(t){this.velocity+=t},s.getFrictionFactor=function(){return 1-this.options[this.isFreeScrolling?"freeScrollFriction":"friction"]},s.getRestingPosition=function(){return this.x+this.velocity/(1-this.getFrictionFactor())},s.applyDragForce=function(){if(this.isPointerDown){var t=this.dragX-this.x,e=t-this.velocity;this.applyForce(e)}},s.applySelectedAttraction=function(){if(!this.isPointerDown&&!this.isFreeScrolling&&this.cells.length){var t=this.selectedSlide.target*-1-this.x,e=t*this.options.selectedAttraction;this.applyForce(e)}},s}),function(t,e){if("function"==typeof define&&define.amd)define("flickity/js/flickity",["ev-emitter/ev-emitter","get-size/get-size","fizzy-ui-utils/utils","./cell","./slide","./animate"],function(i,n,s,o,r,a){return e(t,i,n,s,o,r,a)});else if("object"==typeof module&&module.exports)module.exports=e(t,require("ev-emitter"),require("get-size"),require("fizzy-ui-utils"),require("./cell"),require("./slide"),require("./animate"));else{var i=t.Flickity;t.Flickity=e(t,t.EvEmitter,t.getSize,t.fizzyUIUtils,i.Cell,i.Slide,i.animatePrototype)}}(window,function(t,e,i,n,s,o,r){function a(t,e){for(t=n.makeArray(t);t.length;)e.appendChild(t.shift())}function l(t,e){var i=n.getQueryElement(t);if(!i)return void(d&&d.error("Bad element for Flickity: "+(i||t)));if(this.element=i,this.element.flickityGUID){var s=f[this.element.flickityGUID];return s.option(e),s}h&&(this.$element=h(this.element)),this.options=n.extend({},this.constructor.defaults),this.option(e),this._create()}var h=t.jQuery,c=t.getComputedStyle,d=t.console,u=0,f={};l.defaults={accessibility:!0,cellAlign:"center",freeScrollFriction:.075,friction:.28,namespaceJQueryEvents:!0,percentPosition:!0,resize:!0,selectedAttraction:.025,setGallerySize:!0},l.createMethods=[];var p=l.prototype;n.extend(p,e.prototype),p._create=function(){var e=this.guid=++u;this.element.flickityGUID=e,f[e]=this,this.selectedIndex=0,this.restingFrames=0,this.x=0,this.velocity=0,this.originSide=this.options.rightToLeft?"right":"left",this.viewport=document.createElement("div"),this.viewport.className="flickity-viewport",this._createSlider(),(this.options.resize||this.options.watchCSS)&&t.addEventListener("resize",this),l.createMethods.forEach(function(t){this[t]()},this),this.options.watchCSS?this.watchCSS():this.activate()},p.option=function(t){n.extend(this.options,t)},p.activate=function(){if(!this.isActive){this.isActive=!0,this.element.classList.add("flickity-enabled"),this.options.rightToLeft&&this.element.classList.add("flickity-rtl"),this.getSize();var t=this._filterFindCellElements(this.element.children);a(t,this.slider),this.viewport.appendChild(this.slider),this.element.appendChild(this.viewport),this.reloadCells(),this.options.accessibility&&(this.element.tabIndex=0,this.element.addEventListener("keydown",this)),this.emitEvent("activate");var e,i=this.options.initialIndex;e=this.isInitActivated?this.selectedIndex:void 0!==i&&this.cells[i]?i:0,this.select(e,!1,!0),this.isInitActivated=!0}},p._createSlider=function(){var t=document.createElement("div");t.className="flickity-slider",t.style[this.originSide]=0,this.slider=t},p._filterFindCellElements=function(t){return n.filterFindElements(t,this.options.cellSelector)},p.reloadCells=function(){this.cells=this._makeCells(this.slider.children),this.positionCells(),this._getWrapShiftCells(),this.setGallerySize()},p._makeCells=function(t){var e=this._filterFindCellElements(t),i=e.map(function(t){return new s(t,this)},this);return i},p.getLastCell=function(){return this.cells[this.cells.length-1]},p.getLastSlide=function(){return this.slides[this.slides.length-1]},p.positionCells=function(){this._sizeCells(this.cells),this._positionCells(0)},p._positionCells=function(t){t=t||0,this.maxCellHeight=t?this.maxCellHeight||0:0;var e=0;if(t>0){var i=this.cells[t-1];e=i.x+i.size.outerWidth}for(var n=this.cells.length,s=t;s<n;s++){var o=this.cells[s];o.setPosition(e),e+=o.size.outerWidth,this.maxCellHeight=Math.max(o.size.outerHeight,this.maxCellHeight)}this.slideableWidth=e,this.updateSlides(),this._containSlides(),this.slidesWidth=n?this.getLastSlide().target-this.slides[0].target:0},p._sizeCells=function(t){t.forEach(function(t){t.getSize()})},p.updateSlides=function(){if(this.slides=[],this.cells.length){var t=new o(this);this.slides.push(t);var e="left"==this.originSide,i=e?"marginRight":"marginLeft",n=this._getCanCellFit();this.cells.forEach(function(e,s){if(!t.cells.length)return void t.addCell(e);var r=t.outerWidth-t.firstMargin+(e.size.outerWidth-e.size[i]);n.call(this,s,r)?t.addCell(e):(t.updateTarget(),t=new o(this),this.slides.push(t),t.addCell(e))},this),t.updateTarget(),this.updateSelectedSlide()}},p._getCanCellFit=function(){var t=this.options.groupCells;if(!t)return function(){return!1};if("number"==typeof t){var e=parseInt(t,10);return function(t){return t%e!==0}}var i="string"==typeof t&&t.match(/^(\d+)%$/),n=i?parseInt(i[1],10)/100:1;return function(t,e){return e<=(this.size.innerWidth+1)*n}},p._init=p.reposition=function(){this.positionCells(),this.positionSliderAtSelected()},p.getSize=function(){this.size=i(this.element),this.setCellAlign(),this.cursorPosition=this.size.innerWidth*this.cellAlign};var v={center:{left:.5,right:.5},left:{left:0,right:1},right:{right:0,left:1}};return p.setCellAlign=function(){var t=v[this.options.cellAlign];this.cellAlign=t?t[this.originSide]:this.options.cellAlign},p.setGallerySize=function(){if(this.options.setGallerySize){var t=this.options.adaptiveHeight&&this.selectedSlide?this.selectedSlide.height:this.maxCellHeight;this.viewport.style.height=t+"px"}},p._getWrapShiftCells=function(){if(this.options.wrapAround){this._unshiftCells(this.beforeShiftCells),this._unshiftCells(this.afterShiftCells);var t=this.cursorPosition,e=this.cells.length-1;this.beforeShiftCells=this._getGapCells(t,e,-1),t=this.size.innerWidth-this.cursorPosition,this.afterShiftCells=this._getGapCells(t,0,1)}},p._getGapCells=function(t,e,i){for(var n=[];t>0;){var s=this.cells[e];if(!s)break;n.push(s),e+=i,t-=s.size.outerWidth}return n},p._containSlides=function(){if(this.options.contain&&!this.options.wrapAround&&this.cells.length){var t=this.options.rightToLeft,e=t?"marginRight":"marginLeft",i=t?"marginLeft":"marginRight",n=this.slideableWidth-this.getLastCell().size[i],s=n<this.size.innerWidth,o=this.cursorPosition+this.cells[0].size[e],r=n-this.size.innerWidth*(1-this.cellAlign);this.slides.forEach(function(t){s?t.target=n*this.cellAlign:(t.target=Math.max(t.target,o),t.target=Math.min(t.target,r))},this)}},p.dispatchEvent=function(t,e,i){var n=e?[e].concat(i):i;if(this.emitEvent(t,n),h&&this.$element){t+=this.options.namespaceJQueryEvents?".flickity":"";var s=t;if(e){var o=h.Event(e);o.type=t,s=o}this.$element.trigger(s,i)}},p.select=function(t,e,i){this.isActive&&(t=parseInt(t,10),this._wrapSelect(t),(this.options.wrapAround||e)&&(t=n.modulo(t,this.slides.length)),this.slides[t]&&(this.selectedIndex=t,this.updateSelectedSlide(),i?this.positionSliderAtSelected():this.startAnimation(),this.options.adaptiveHeight&&this.setGallerySize(),this.dispatchEvent("select"),this.dispatchEvent("cellSelect")))},p._wrapSelect=function(t){var e=this.slides.length,i=this.options.wrapAround&&e>1;if(!i)return t;var s=n.modulo(t,e),o=Math.abs(s-this.selectedIndex),r=Math.abs(s+e-this.selectedIndex),a=Math.abs(s-e-this.selectedIndex);!this.isDragSelect&&r<o?t+=e:!this.isDragSelect&&a<o&&(t-=e),t<0?this.x-=this.slideableWidth:t>=e&&(this.x+=this.slideableWidth)},p.previous=function(t,e){this.select(this.selectedIndex-1,t,e)},p.next=function(t,e){this.select(this.selectedIndex+1,t,e)},p.updateSelectedSlide=function(){var t=this.slides[this.selectedIndex];t&&(this.unselectSelectedSlide(),this.selectedSlide=t,t.select(),this.selectedCells=t.cells,this.selectedElements=t.getCellElements(),this.selectedCell=t.cells[0],this.selectedElement=this.selectedElements[0])},p.unselectSelectedSlide=function(){this.selectedSlide&&this.selectedSlide.unselect()},p.selectCell=function(t,e,i){var n;"number"==typeof t?n=this.cells[t]:("string"==typeof t&&(t=this.element.querySelector(t)),n=this.getCell(t));for(var s=0;n&&s<this.slides.length;s++){var o=this.slides[s],r=o.cells.indexOf(n);if(r!=-1)return void this.select(s,e,i)}},p.getCell=function(t){for(var e=0;e<this.cells.length;e++){var i=this.cells[e];if(i.element==t)return i}},p.getCells=function(t){t=n.makeArray(t);var e=[];return t.forEach(function(t){var i=this.getCell(t);i&&e.push(i)},this),e},p.getCellElements=function(){return this.cells.map(function(t){return t.element})},p.getParentCell=function(t){var e=this.getCell(t);return e?e:(t=n.getParent(t,".flickity-slider > *"),this.getCell(t))},p.getAdjacentCellElements=function(t,e){if(!t)return this.selectedSlide.getCellElements();e=void 0===e?this.selectedIndex:e;var i=this.slides.length;if(1+2*t>=i)return this.getCellElements();for(var s=[],o=e-t;o<=e+t;o++){var r=this.options.wrapAround?n.modulo(o,i):o,a=this.slides[r];a&&(s=s.concat(a.getCellElements()))}return s},p.uiChange=function(){this.emitEvent("uiChange")},p.childUIPointerDown=function(t){this.emitEvent("childUIPointerDown",[t])},p.onresize=function(){this.watchCSS(),this.resize()},n.debounceMethod(l,"onresize",150),p.resize=function(){if(this.isActive){this.getSize(),this.options.wrapAround&&(this.x=n.modulo(this.x,this.slideableWidth)),this.positionCells(),this._getWrapShiftCells(),this.setGallerySize(),this.emitEvent("resize");var t=this.selectedElements&&this.selectedElements[0];this.selectCell(t,!1,!0)}},p.watchCSS=function(){var t=this.options.watchCSS;if(t){var e=c(this.element,":after").content;e.indexOf("flickity")!=-1?this.activate():this.deactivate()}},p.onkeydown=function(t){if(this.options.accessibility&&(!document.activeElement||document.activeElement==this.element))if(37==t.keyCode){var e=this.options.rightToLeft?"next":"previous";this.uiChange(),this[e]()}else if(39==t.keyCode){var i=this.options.rightToLeft?"previous":"next";this.uiChange(),this[i]()}},p.deactivate=function(){this.isActive&&(this.element.classList.remove("flickity-enabled"),this.element.classList.remove("flickity-rtl"),this.cells.forEach(function(t){t.destroy()}),this.unselectSelectedSlide(),this.element.removeChild(this.viewport),a(this.slider.children,this.element),this.options.accessibility&&(this.element.removeAttribute("tabIndex"),this.element.removeEventListener("keydown",this)),this.isActive=!1,this.emitEvent("deactivate"))},p.destroy=function(){this.deactivate(),t.removeEventListener("resize",this),this.emitEvent("destroy"),h&&this.$element&&h.removeData(this.element,"flickity"),delete this.element.flickityGUID,delete f[this.guid]},n.extend(p,r),l.data=function(t){t=n.getQueryElement(t);var e=t&&t.flickityGUID;return e&&f[e]},n.htmlInit(l,"flickity"),h&&h.bridget&&h.bridget("flickity",l),l.Cell=s,l}),function(t,e){"function"==typeof define&&define.amd?define("unipointer/unipointer",["ev-emitter/ev-emitter"],function(i){return e(t,i)}):"object"==typeof module&&module.exports?module.exports=e(t,require("ev-emitter")):t.Unipointer=e(t,t.EvEmitter)}(window,function(t,e){function i(){}function n(){}var s=n.prototype=Object.create(e.prototype);s.bindStartEvent=function(t){this._bindStartEvent(t,!0)},s.unbindStartEvent=function(t){this._bindStartEvent(t,!1)},s._bindStartEvent=function(e,i){i=void 0===i||!!i;var n=i?"addEventListener":"removeEventListener";t.navigator.pointerEnabled?e[n]("pointerdown",this):t.navigator.msPointerEnabled?e[n]("MSPointerDown",this):(e[n]("mousedown",this),e[n]("touchstart",this))},s.handleEvent=function(t){var e="on"+t.type;this[e]&&this[e](t)},s.getTouch=function(t){for(var e=0;e<t.length;e++){var i=t[e];if(i.identifier==this.pointerIdentifier)return i}},s.onmousedown=function(t){var e=t.button;e&&0!==e&&1!==e||this._pointerDown(t,t)},s.ontouchstart=function(t){this._pointerDown(t,t.changedTouches[0])},s.onMSPointerDown=s.onpointerdown=function(t){this._pointerDown(t,t)},s._pointerDown=function(t,e){this.isPointerDown||(this.isPointerDown=!0,this.pointerIdentifier=void 0!==e.pointerId?e.pointerId:e.identifier,this.pointerDown(t,e))},s.pointerDown=function(t,e){this._bindPostStartEvents(t),this.emitEvent("pointerDown",[t,e])};var o={mousedown:["mousemove","mouseup"],touchstart:["touchmove","touchend","touchcancel"],pointerdown:["pointermove","pointerup","pointercancel"],MSPointerDown:["MSPointerMove","MSPointerUp","MSPointerCancel"]};return s._bindPostStartEvents=function(e){if(e){var i=o[e.type];i.forEach(function(e){t.addEventListener(e,this)},this),this._boundPointerEvents=i}},s._unbindPostStartEvents=function(){this._boundPointerEvents&&(this._boundPointerEvents.forEach(function(e){t.removeEventListener(e,this)},this),delete this._boundPointerEvents)},s.onmousemove=function(t){this._pointerMove(t,t)},s.onMSPointerMove=s.onpointermove=function(t){t.pointerId==this.pointerIdentifier&&this._pointerMove(t,t)},s.ontouchmove=function(t){var e=this.getTouch(t.changedTouches);e&&this._pointerMove(t,e)},s._pointerMove=function(t,e){this.pointerMove(t,e)},s.pointerMove=function(t,e){this.emitEvent("pointerMove",[t,e])},s.onmouseup=function(t){this._pointerUp(t,t)},s.onMSPointerUp=s.onpointerup=function(t){t.pointerId==this.pointerIdentifier&&this._pointerUp(t,t)},s.ontouchend=function(t){var e=this.getTouch(t.changedTouches);e&&this._pointerUp(t,e)},s._pointerUp=function(t,e){this._pointerDone(),this.pointerUp(t,e)},s.pointerUp=function(t,e){this.emitEvent("pointerUp",[t,e])},s._pointerDone=function(){this.isPointerDown=!1,delete this.pointerIdentifier,this._unbindPostStartEvents(),this.pointerDone()},s.pointerDone=i,s.onMSPointerCancel=s.onpointercancel=function(t){t.pointerId==this.pointerIdentifier&&this._pointerCancel(t,t)},s.ontouchcancel=function(t){var e=this.getTouch(t.changedTouches);e&&this._pointerCancel(t,e)},s._pointerCancel=function(t,e){this._pointerDone(),this.pointerCancel(t,e)},s.pointerCancel=function(t,e){this.emitEvent("pointerCancel",[t,e])},n.getPointerPoint=function(t){return{x:t.pageX,y:t.pageY}},n}),function(t,e){"function"==typeof define&&define.amd?define("unidragger/unidragger",["unipointer/unipointer"],function(i){return e(t,i)}):"object"==typeof module&&module.exports?module.exports=e(t,require("unipointer")):t.Unidragger=e(t,t.Unipointer)}(window,function(t,e){function i(){}function n(){}var s=n.prototype=Object.create(e.prototype);s.bindHandles=function(){this._bindHandles(!0)},s.unbindHandles=function(){this._bindHandles(!1)};var o=t.navigator;return s._bindHandles=function(t){t=void 0===t||!!t;var e;e=o.pointerEnabled?function(e){e.style.touchAction=t?"none":""}:o.msPointerEnabled?function(e){e.style.msTouchAction=t?"none":""}:i;for(var n=t?"addEventListener":"removeEventListener",s=0;s<this.handles.length;s++){var r=this.handles[s];this._bindStartEvent(r,t),e(r),r[n]("click",this)}},s.pointerDown=function(t,e){if("INPUT"==t.target.nodeName&&"range"==t.target.type)return this.isPointerDown=!1,void delete this.pointerIdentifier;this._dragPointerDown(t,e);var i=document.activeElement;i&&i.blur&&i.blur(),this._bindPostStartEvents(t),this.emitEvent("pointerDown",[t,e])},s._dragPointerDown=function(t,i){this.pointerDownPoint=e.getPointerPoint(i);var n=this.canPreventDefaultOnPointerDown(t,i);n&&t.preventDefault()},s.canPreventDefaultOnPointerDown=function(t){return"SELECT"!=t.target.nodeName},s.pointerMove=function(t,e){var i=this._dragPointerMove(t,e);this.emitEvent("pointerMove",[t,e,i]),this._dragMove(t,e,i)},s._dragPointerMove=function(t,i){var n=e.getPointerPoint(i),s={x:n.x-this.pointerDownPoint.x,y:n.y-this.pointerDownPoint.y};return!this.isDragging&&this.hasDragStarted(s)&&this._dragStart(t,i),s},s.hasDragStarted=function(t){return Math.abs(t.x)>3||Math.abs(t.y)>3},s.pointerUp=function(t,e){this.emitEvent("pointerUp",[t,e]),this._dragPointerUp(t,e)},s._dragPointerUp=function(t,e){this.isDragging?this._dragEnd(t,e):this._staticClick(t,e)},s._dragStart=function(t,i){this.isDragging=!0,this.dragStartPoint=e.getPointerPoint(i),this.isPreventingClicks=!0,this.dragStart(t,i)},s.dragStart=function(t,e){this.emitEvent("dragStart",[t,e])},s._dragMove=function(t,e,i){this.isDragging&&this.dragMove(t,e,i)},s.dragMove=function(t,e,i){t.preventDefault(),this.emitEvent("dragMove",[t,e,i])},s._dragEnd=function(t,e){this.isDragging=!1,setTimeout(function(){delete this.isPreventingClicks}.bind(this)),this.dragEnd(t,e)},s.dragEnd=function(t,e){this.emitEvent("dragEnd",[t,e])},s.onclick=function(t){this.isPreventingClicks&&t.preventDefault()},s._staticClick=function(t,e){if(!this.isIgnoringMouseUp||"mouseup"!=t.type){var i=t.target.nodeName;"INPUT"!=i&&"TEXTAREA"!=i||t.target.focus(),this.staticClick(t,e),"mouseup"!=t.type&&(this.isIgnoringMouseUp=!0,setTimeout(function(){delete this.isIgnoringMouseUp}.bind(this),400))}},s.staticClick=function(t,e){this.emitEvent("staticClick",[t,e])},n.getPointerPoint=e.getPointerPoint,n}),function(t,e){"function"==typeof define&&define.amd?define("flickity/js/drag",["./flickity","unidragger/unidragger","fizzy-ui-utils/utils"],function(i,n,s){return e(t,i,n,s)}):"object"==typeof module&&module.exports?module.exports=e(t,require("./flickity"),require("unidragger"),require("fizzy-ui-utils")):t.Flickity=e(t,t.Flickity,t.Unidragger,t.fizzyUIUtils)}(window,function(t,e,i,n){function s(){return{x:t.pageXOffset,y:t.pageYOffset}}n.extend(e.defaults,{draggable:!0,dragThreshold:3}),e.createMethods.push("_createDrag");var o=e.prototype;n.extend(o,i.prototype);var r="createTouch"in document,a=!1;o._createDrag=function(){this.on("activate",this.bindDrag),this.on("uiChange",this._uiChangeDrag),this.on("childUIPointerDown",this._childUIPointerDownDrag),this.on("deactivate",this.unbindDrag),r&&!a&&(t.addEventListener("touchmove",function(){}),a=!0)},o.bindDrag=function(){this.options.draggable&&!this.isDragBound&&(this.element.classList.add("is-draggable"),this.handles=[this.viewport],this.bindHandles(),this.isDragBound=!0)},o.unbindDrag=function(){this.isDragBound&&(this.element.classList.remove("is-draggable"),this.unbindHandles(),delete this.isDragBound)},o._uiChangeDrag=function(){delete this.isFreeScrolling},o._childUIPointerDownDrag=function(t){t.preventDefault(),this.pointerDownFocus(t)};var l={TEXTAREA:!0,INPUT:!0,OPTION:!0},h={radio:!0,checkbox:!0,button:!0,submit:!0,image:!0,file:!0};o.pointerDown=function(e,i){var n=l[e.target.nodeName]&&!h[e.target.type];if(n)return this.isPointerDown=!1,void delete this.pointerIdentifier;this._dragPointerDown(e,i);var o=document.activeElement;o&&o.blur&&o!=this.element&&o!=document.body&&o.blur(),this.pointerDownFocus(e),this.dragX=this.x,this.viewport.classList.add("is-pointer-down"),this._bindPostStartEvents(e),this.pointerDownScroll=s(),t.addEventListener("scroll",this),this.dispatchEvent("pointerDown",e,[i])};var c={touchstart:!0,MSPointerDown:!0},d={INPUT:!0,SELECT:!0};return o.pointerDownFocus=function(e){if(this.options.accessibility&&!c[e.type]&&!d[e.target.nodeName]){var i=t.pageYOffset;this.element.focus(),t.pageYOffset!=i&&t.scrollTo(t.pageXOffset,i)}},o.canPreventDefaultOnPointerDown=function(t){var e="touchstart"==t.type,i=t.target.nodeName;return!e&&"SELECT"!=i},o.hasDragStarted=function(t){return Math.abs(t.x)>this.options.dragThreshold},o.pointerUp=function(t,e){delete this.isTouchScrolling,this.viewport.classList.remove("is-pointer-down"),this.dispatchEvent("pointerUp",t,[e]),this._dragPointerUp(t,e)},o.pointerDone=function(){t.removeEventListener("scroll",this),delete this.pointerDownScroll},o.dragStart=function(e,i){this.dragStartPosition=this.x,this.startAnimation(),t.removeEventListener("scroll",this),this.dispatchEvent("dragStart",e,[i])},o.pointerMove=function(t,e){var i=this._dragPointerMove(t,e);this.dispatchEvent("pointerMove",t,[e,i]),this._dragMove(t,e,i)},o.dragMove=function(t,e,i){t.preventDefault(),this.previousDragX=this.dragX;var n=this.options.rightToLeft?-1:1,s=this.dragStartPosition+i.x*n;if(!this.options.wrapAround&&this.slides.length){var o=Math.max(-this.slides[0].target,this.dragStartPosition);s=s>o?.5*(s+o):s;var r=Math.min(-this.getLastSlide().target,this.dragStartPosition);s=s<r?.5*(s+r):s}this.dragX=s,this.dragMoveTime=new Date,this.dispatchEvent("dragMove",t,[e,i])},o.dragEnd=function(t,e){this.options.freeScroll&&(this.isFreeScrolling=!0);var i=this.dragEndRestingSelect();if(this.options.freeScroll&&!this.options.wrapAround){var n=this.getRestingPosition();this.isFreeScrolling=-n>this.slides[0].target&&-n<this.getLastSlide().target}else this.options.freeScroll||i!=this.selectedIndex||(i+=this.dragEndBoostSelect());delete this.previousDragX,this.isDragSelect=this.options.wrapAround,this.select(i),delete this.isDragSelect,this.dispatchEvent("dragEnd",t,[e])},o.dragEndRestingSelect=function(){
	var t=this.getRestingPosition(),e=Math.abs(this.getSlideDistance(-t,this.selectedIndex)),i=this._getClosestResting(t,e,1),n=this._getClosestResting(t,e,-1),s=i.distance<n.distance?i.index:n.index;return s},o._getClosestResting=function(t,e,i){for(var n=this.selectedIndex,s=1/0,o=this.options.contain&&!this.options.wrapAround?function(t,e){return t<=e}:function(t,e){return t<e};o(e,s)&&(n+=i,s=e,e=this.getSlideDistance(-t,n),null!==e);)e=Math.abs(e);return{distance:s,index:n-i}},o.getSlideDistance=function(t,e){var i=this.slides.length,s=this.options.wrapAround&&i>1,o=s?n.modulo(e,i):e,r=this.slides[o];if(!r)return null;var a=s?this.slideableWidth*Math.floor(e/i):0;return t-(r.target+a)},o.dragEndBoostSelect=function(){if(void 0===this.previousDragX||!this.dragMoveTime||new Date-this.dragMoveTime>100)return 0;var t=this.getSlideDistance(-this.dragX,this.selectedIndex),e=this.previousDragX-this.dragX;return t>0&&e>0?1:t<0&&e<0?-1:0},o.staticClick=function(t,e){var i=this.getParentCell(t.target),n=i&&i.element,s=i&&this.cells.indexOf(i);this.dispatchEvent("staticClick",t,[e,n,s])},o.onscroll=function(){var t=s(),e=this.pointerDownScroll.x-t.x,i=this.pointerDownScroll.y-t.y;(Math.abs(e)>3||Math.abs(i)>3)&&this._pointerDone()},e}),function(t,e){"function"==typeof define&&define.amd?define("tap-listener/tap-listener",["unipointer/unipointer"],function(i){return e(t,i)}):"object"==typeof module&&module.exports?module.exports=e(t,require("unipointer")):t.TapListener=e(t,t.Unipointer)}(window,function(t,e){function i(t){this.bindTap(t)}var n=i.prototype=Object.create(e.prototype);return n.bindTap=function(t){t&&(this.unbindTap(),this.tapElement=t,this._bindStartEvent(t,!0))},n.unbindTap=function(){this.tapElement&&(this._bindStartEvent(this.tapElement,!0),delete this.tapElement)},n.pointerUp=function(i,n){if(!this.isIgnoringMouseUp||"mouseup"!=i.type){var s=e.getPointerPoint(n),o=this.tapElement.getBoundingClientRect(),r=t.pageXOffset,a=t.pageYOffset,l=s.x>=o.left+r&&s.x<=o.right+r&&s.y>=o.top+a&&s.y<=o.bottom+a;if(l&&this.emitEvent("tap",[i,n]),"mouseup"!=i.type){this.isIgnoringMouseUp=!0;var h=this;setTimeout(function(){delete h.isIgnoringMouseUp},400)}}},n.destroy=function(){this.pointerDone(),this.unbindTap()},i}),function(t,e){"function"==typeof define&&define.amd?define("flickity/js/prev-next-button",["./flickity","tap-listener/tap-listener","fizzy-ui-utils/utils"],function(i,n,s){return e(t,i,n,s)}):"object"==typeof module&&module.exports?module.exports=e(t,require("./flickity"),require("tap-listener"),require("fizzy-ui-utils")):e(t,t.Flickity,t.TapListener,t.fizzyUIUtils)}(window,function(t,e,i,n){"use strict";function s(t,e){this.direction=t,this.parent=e,this._create()}function o(t){return"string"==typeof t?t:"M "+t.x0+",50 L "+t.x1+","+(t.y1+50)+" L "+t.x2+","+(t.y2+50)+" L "+t.x3+",50  L "+t.x2+","+(50-t.y2)+" L "+t.x1+","+(50-t.y1)+" Z"}var r="http://www.w3.org/2000/svg";s.prototype=new i,s.prototype._create=function(){this.isEnabled=!0,this.isPrevious=this.direction==-1;var t=this.parent.options.rightToLeft?1:-1;this.isLeft=this.direction==t;var e=this.element=document.createElement("button");e.className="flickity-prev-next-button",e.className+=this.isPrevious?" previous":" next",e.setAttribute("type","button"),this.disable(),e.setAttribute("aria-label",this.isPrevious?"previous":"next");var i=this.createSVG();e.appendChild(i),this.on("tap",this.onTap),this.parent.on("select",this.update.bind(this)),this.on("pointerDown",this.parent.childUIPointerDown.bind(this.parent))},s.prototype.activate=function(){this.bindTap(this.element),this.element.addEventListener("click",this),this.parent.element.appendChild(this.element)},s.prototype.deactivate=function(){this.parent.element.removeChild(this.element),i.prototype.destroy.call(this),this.element.removeEventListener("click",this)},s.prototype.createSVG=function(){var t=document.createElementNS(r,"svg");t.setAttribute("viewBox","0 0 100 100");var e=document.createElementNS(r,"path"),i=o(this.parent.options.arrowShape);return e.setAttribute("d",i),e.setAttribute("class","arrow"),this.isLeft||e.setAttribute("transform","translate(100, 100) rotate(180) "),t.appendChild(e),t},s.prototype.onTap=function(){if(this.isEnabled){this.parent.uiChange();var t=this.isPrevious?"previous":"next";this.parent[t]()}},s.prototype.handleEvent=n.handleEvent,s.prototype.onclick=function(){var t=document.activeElement;t&&t==this.element&&this.onTap()},s.prototype.enable=function(){this.isEnabled||(this.element.disabled=!1,this.isEnabled=!0)},s.prototype.disable=function(){this.isEnabled&&(this.element.disabled=!0,this.isEnabled=!1)},s.prototype.update=function(){var t=this.parent.slides;if(this.parent.options.wrapAround&&t.length>1)return void this.enable();var e=t.length?t.length-1:0,i=this.isPrevious?0:e,n=this.parent.selectedIndex==i?"disable":"enable";this[n]()},s.prototype.destroy=function(){this.deactivate()},n.extend(e.defaults,{prevNextButtons:!0,arrowShape:{x0:10,x1:60,y1:50,x2:70,y2:40,x3:30}}),e.createMethods.push("_createPrevNextButtons");var a=e.prototype;return a._createPrevNextButtons=function(){this.options.prevNextButtons&&(this.prevButton=new s((-1),this),this.nextButton=new s(1,this),this.on("activate",this.activatePrevNextButtons))},a.activatePrevNextButtons=function(){this.prevButton.activate(),this.nextButton.activate(),this.on("deactivate",this.deactivatePrevNextButtons)},a.deactivatePrevNextButtons=function(){this.prevButton.deactivate(),this.nextButton.deactivate(),this.off("deactivate",this.deactivatePrevNextButtons)},e.PrevNextButton=s,e}),function(t,e){"function"==typeof define&&define.amd?define("flickity/js/page-dots",["./flickity","tap-listener/tap-listener","fizzy-ui-utils/utils"],function(i,n,s){return e(t,i,n,s)}):"object"==typeof module&&module.exports?module.exports=e(t,require("./flickity"),require("tap-listener"),require("fizzy-ui-utils")):e(t,t.Flickity,t.TapListener,t.fizzyUIUtils)}(window,function(t,e,i,n){function s(t){this.parent=t,this._create()}s.prototype=new i,s.prototype._create=function(){this.holder=document.createElement("ol"),this.holder.className="flickity-page-dots",this.dots=[],this.on("tap",this.onTap),this.on("pointerDown",this.parent.childUIPointerDown.bind(this.parent))},s.prototype.activate=function(){this.setDots(),this.bindTap(this.holder),this.parent.element.appendChild(this.holder)},s.prototype.deactivate=function(){this.parent.element.removeChild(this.holder),i.prototype.destroy.call(this)},s.prototype.setDots=function(){var t=this.parent.slides.length-this.dots.length;t>0?this.addDots(t):t<0&&this.removeDots(-t)},s.prototype.addDots=function(t){for(var e=document.createDocumentFragment(),i=[];t;){var n=document.createElement("li");n.className="dot",e.appendChild(n),i.push(n),t--}this.holder.appendChild(e),this.dots=this.dots.concat(i)},s.prototype.removeDots=function(t){var e=this.dots.splice(this.dots.length-t,t);e.forEach(function(t){this.holder.removeChild(t)},this)},s.prototype.updateSelected=function(){this.selectedDot&&(this.selectedDot.className="dot"),this.dots.length&&(this.selectedDot=this.dots[this.parent.selectedIndex],this.selectedDot.className="dot is-selected")},s.prototype.onTap=function(t){var e=t.target;if("LI"==e.nodeName){this.parent.uiChange();var i=this.dots.indexOf(e);this.parent.select(i)}},s.prototype.destroy=function(){this.deactivate()},e.PageDots=s,n.extend(e.defaults,{pageDots:!0}),e.createMethods.push("_createPageDots");var o=e.prototype;return o._createPageDots=function(){this.options.pageDots&&(this.pageDots=new s(this),this.on("activate",this.activatePageDots),this.on("select",this.updateSelectedPageDots),this.on("cellChange",this.updatePageDots),this.on("resize",this.updatePageDots),this.on("deactivate",this.deactivatePageDots))},o.activatePageDots=function(){this.pageDots.activate()},o.updateSelectedPageDots=function(){this.pageDots.updateSelected()},o.updatePageDots=function(){this.pageDots.setDots()},o.deactivatePageDots=function(){this.pageDots.deactivate()},e.PageDots=s,e}),function(t,e){"function"==typeof define&&define.amd?define("flickity/js/player",["ev-emitter/ev-emitter","fizzy-ui-utils/utils","./flickity"],function(t,i,n){return e(t,i,n)}):"object"==typeof module&&module.exports?module.exports=e(require("ev-emitter"),require("fizzy-ui-utils"),require("./flickity")):e(t.EvEmitter,t.fizzyUIUtils,t.Flickity)}(window,function(t,e,i){function n(t){this.parent=t,this.state="stopped",o&&(this.onVisibilityChange=function(){this.visibilityChange()}.bind(this),this.onVisibilityPlay=function(){this.visibilityPlay()}.bind(this))}var s,o;"hidden"in document?(s="hidden",o="visibilitychange"):"webkitHidden"in document&&(s="webkitHidden",o="webkitvisibilitychange"),n.prototype=Object.create(t.prototype),n.prototype.play=function(){if("playing"!=this.state){var t=document[s];if(o&&t)return void document.addEventListener(o,this.onVisibilityPlay);this.state="playing",o&&document.addEventListener(o,this.onVisibilityChange),this.tick()}},n.prototype.tick=function(){if("playing"==this.state){var t=this.parent.options.autoPlay;t="number"==typeof t?t:3e3;var e=this;this.clear(),this.timeout=setTimeout(function(){e.parent.next(!0),e.tick()},t)}},n.prototype.stop=function(){this.state="stopped",this.clear(),o&&document.removeEventListener(o,this.onVisibilityChange)},n.prototype.clear=function(){clearTimeout(this.timeout)},n.prototype.pause=function(){"playing"==this.state&&(this.state="paused",this.clear())},n.prototype.unpause=function(){"paused"==this.state&&this.play()},n.prototype.visibilityChange=function(){var t=document[s];this[t?"pause":"unpause"]()},n.prototype.visibilityPlay=function(){this.play(),document.removeEventListener(o,this.onVisibilityPlay)},e.extend(i.defaults,{pauseAutoPlayOnHover:!0}),i.createMethods.push("_createPlayer");var r=i.prototype;return r._createPlayer=function(){this.player=new n(this),this.on("activate",this.activatePlayer),this.on("uiChange",this.stopPlayer),this.on("pointerDown",this.stopPlayer),this.on("deactivate",this.deactivatePlayer)},r.activatePlayer=function(){this.options.autoPlay&&(this.player.play(),this.element.addEventListener("mouseenter",this))},r.playPlayer=function(){this.player.play()},r.stopPlayer=function(){this.player.stop()},r.pausePlayer=function(){this.player.pause()},r.unpausePlayer=function(){this.player.unpause()},r.deactivatePlayer=function(){this.player.stop(),this.element.removeEventListener("mouseenter",this)},r.onmouseenter=function(){this.options.pauseAutoPlayOnHover&&(this.player.pause(),this.element.addEventListener("mouseleave",this))},r.onmouseleave=function(){this.player.unpause(),this.element.removeEventListener("mouseleave",this)},i.Player=n,i}),function(t,e){"function"==typeof define&&define.amd?define("flickity/js/add-remove-cell",["./flickity","fizzy-ui-utils/utils"],function(i,n){return e(t,i,n)}):"object"==typeof module&&module.exports?module.exports=e(t,require("./flickity"),require("fizzy-ui-utils")):e(t,t.Flickity,t.fizzyUIUtils)}(window,function(t,e,i){function n(t){var e=document.createDocumentFragment();return t.forEach(function(t){e.appendChild(t.element)}),e}var s=e.prototype;return s.insert=function(t,e){var i=this._makeCells(t);if(i&&i.length){var s=this.cells.length;e=void 0===e?s:e;var o=n(i),r=e==s;if(r)this.slider.appendChild(o);else{var a=this.cells[e].element;this.slider.insertBefore(o,a)}if(0===e)this.cells=i.concat(this.cells);else if(r)this.cells=this.cells.concat(i);else{var l=this.cells.splice(e,s-e);this.cells=this.cells.concat(i).concat(l)}this._sizeCells(i);var h=e>this.selectedIndex?0:i.length;this._cellAddedRemoved(e,h)}},s.append=function(t){this.insert(t,this.cells.length)},s.prepend=function(t){this.insert(t,0)},s.remove=function(t){var e,n,s=this.getCells(t),o=0,r=s.length;for(e=0;e<r;e++){n=s[e];var a=this.cells.indexOf(n)<this.selectedIndex;o-=a?1:0}for(e=0;e<r;e++)n=s[e],n.remove(),i.removeFrom(this.cells,n);s.length&&this._cellAddedRemoved(0,o)},s._cellAddedRemoved=function(t,e){e=e||0,this.selectedIndex+=e,this.selectedIndex=Math.max(0,Math.min(this.slides.length-1,this.selectedIndex)),this.cellChange(t,!0),this.emitEvent("cellAddedRemoved",[t,e])},s.cellSizeChange=function(t){var e=this.getCell(t);if(e){e.getSize();var i=this.cells.indexOf(e);this.cellChange(i)}},s.cellChange=function(t,e){var i=this.slideableWidth;if(this._positionCells(t),this._getWrapShiftCells(),this.setGallerySize(),this.emitEvent("cellChange",[t]),this.options.freeScroll){var n=i-this.slideableWidth;this.x+=n*this.cellAlign,this.positionSlider()}else e&&this.positionSliderAtSelected(),this.select(this.selectedIndex)},e}),function(t,e){"function"==typeof define&&define.amd?define("flickity/js/lazyload",["./flickity","fizzy-ui-utils/utils"],function(i,n){return e(t,i,n)}):"object"==typeof module&&module.exports?module.exports=e(t,require("./flickity"),require("fizzy-ui-utils")):e(t,t.Flickity,t.fizzyUIUtils)}(window,function(t,e,i){"use strict";function n(t){if("IMG"==t.nodeName&&t.getAttribute("data-flickity-lazyload"))return[t];var e=t.querySelectorAll("img[data-flickity-lazyload]");return i.makeArray(e)}function s(t,e){this.img=t,this.flickity=e,this.load()}e.createMethods.push("_createLazyload");var o=e.prototype;return o._createLazyload=function(){this.on("select",this.lazyLoad)},o.lazyLoad=function(){var t=this.options.lazyLoad;if(t){var e="number"==typeof t?t:0,i=this.getAdjacentCellElements(e),o=[];i.forEach(function(t){var e=n(t);o=o.concat(e)}),o.forEach(function(t){new s(t,this)},this)}},s.prototype.handleEvent=i.handleEvent,s.prototype.load=function(){this.img.addEventListener("load",this),this.img.addEventListener("error",this),this.img.src=this.img.getAttribute("data-flickity-lazyload"),this.img.removeAttribute("data-flickity-lazyload")},s.prototype.onload=function(t){this.complete(t,"flickity-lazyloaded")},s.prototype.onerror=function(t){this.complete(t,"flickity-lazyerror")},s.prototype.complete=function(t,e){this.img.removeEventListener("load",this),this.img.removeEventListener("error",this);var i=this.flickity.getParentCell(this.img),n=i&&i.element;this.flickity.cellSizeChange(n),this.img.classList.add(e),this.flickity.dispatchEvent("lazyLoad",t,n)},e.LazyLoader=s,e}),function(t,e){"function"==typeof define&&define.amd?define("flickity/js/index",["./flickity","./drag","./prev-next-button","./page-dots","./player","./add-remove-cell","./lazyload"],e):"object"==typeof module&&module.exports&&(module.exports=e(require("./flickity"),require("./drag"),require("./prev-next-button"),require("./page-dots"),require("./player"),require("./add-remove-cell"),require("./lazyload")))}(window,function(t){return t}),function(t,e){"function"==typeof define&&define.amd?define("flickity-as-nav-for/as-nav-for",["flickity/js/index","fizzy-ui-utils/utils"],e):"object"==typeof module&&module.exports?module.exports=e(require("flickity"),require("fizzy-ui-utils")):t.Flickity=e(t.Flickity,t.fizzyUIUtils)}(window,function(t,e){function i(t,e,i){return(e-t)*i+t}t.createMethods.push("_createAsNavFor");var n=t.prototype;return n._createAsNavFor=function(){this.on("activate",this.activateAsNavFor),this.on("deactivate",this.deactivateAsNavFor),this.on("destroy",this.destroyAsNavFor);var t=this.options.asNavFor;if(t){var e=this;setTimeout(function(){e.setNavCompanion(t)})}},n.setNavCompanion=function(i){i=e.getQueryElement(i);var n=t.data(i);if(n&&n!=this){this.navCompanion=n;var s=this;this.onNavCompanionSelect=function(){s.navCompanionSelect()},n.on("select",this.onNavCompanionSelect),this.on("staticClick",this.onNavStaticClick),this.navCompanionSelect(!0)}},n.navCompanionSelect=function(t){if(this.navCompanion){var e=this.navCompanion.selectedCells[0],n=this.navCompanion.cells.indexOf(e),s=n+this.navCompanion.selectedCells.length-1,o=Math.floor(i(n,s,this.navCompanion.cellAlign));if(this.selectCell(o,!1,t),this.removeNavSelectedElements(),!(o>=this.cells.length)){var r=this.cells.slice(n,s+1);this.navSelectedElements=r.map(function(t){return t.element}),this.changeNavSelectedClass("add")}}},n.changeNavSelectedClass=function(t){this.navSelectedElements.forEach(function(e){e.classList[t]("is-nav-selected")})},n.activateAsNavFor=function(){this.navCompanionSelect(!0)},n.removeNavSelectedElements=function(){this.navSelectedElements&&(this.changeNavSelectedClass("remove"),delete this.navSelectedElements)},n.onNavStaticClick=function(t,e,i,n){"number"==typeof n&&this.navCompanion.selectCell(n)},n.deactivateAsNavFor=function(){this.removeNavSelectedElements()},n.destroyAsNavFor=function(){this.navCompanion&&(this.navCompanion.off("select",this.onNavCompanionSelect),this.off("staticClick",this.onNavStaticClick),delete this.navCompanion)},t}),function(t,e){"use strict";"function"==typeof define&&define.amd?define("imagesloaded/imagesloaded",["ev-emitter/ev-emitter"],function(i){return e(t,i)}):"object"==typeof module&&module.exports?module.exports=e(t,require("ev-emitter")):t.imagesLoaded=e(t,t.EvEmitter)}(window,function(t,e){function i(t,e){for(var i in e)t[i]=e[i];return t}function n(t){var e=[];if(Array.isArray(t))e=t;else if("number"==typeof t.length)for(var i=0;i<t.length;i++)e.push(t[i]);else e.push(t);return e}function s(t,e,o){return this instanceof s?("string"==typeof t&&(t=document.querySelectorAll(t)),this.elements=n(t),this.options=i({},this.options),"function"==typeof e?o=e:i(this.options,e),o&&this.on("always",o),this.getImages(),a&&(this.jqDeferred=new a.Deferred),void setTimeout(function(){this.check()}.bind(this))):new s(t,e,o)}function o(t){this.img=t}function r(t,e){this.url=t,this.element=e,this.img=new Image}var a=t.jQuery,l=t.console;s.prototype=Object.create(e.prototype),s.prototype.options={},s.prototype.getImages=function(){this.images=[],this.elements.forEach(this.addElementImages,this)},s.prototype.addElementImages=function(t){"IMG"==t.nodeName&&this.addImage(t),this.options.background===!0&&this.addElementBackgroundImages(t);var e=t.nodeType;if(e&&h[e]){for(var i=t.querySelectorAll("img"),n=0;n<i.length;n++){var s=i[n];this.addImage(s)}if("string"==typeof this.options.background){var o=t.querySelectorAll(this.options.background);for(n=0;n<o.length;n++){var r=o[n];this.addElementBackgroundImages(r)}}}};var h={1:!0,9:!0,11:!0};return s.prototype.addElementBackgroundImages=function(t){var e=getComputedStyle(t);if(e)for(var i=/url\((['"])?(.*?)\1\)/gi,n=i.exec(e.backgroundImage);null!==n;){var s=n&&n[2];s&&this.addBackground(s,t),n=i.exec(e.backgroundImage)}},s.prototype.addImage=function(t){var e=new o(t);this.images.push(e)},s.prototype.addBackground=function(t,e){var i=new r(t,e);this.images.push(i)},s.prototype.check=function(){function t(t,i,n){setTimeout(function(){e.progress(t,i,n)})}var e=this;return this.progressedCount=0,this.hasAnyBroken=!1,this.images.length?void this.images.forEach(function(e){e.once("progress",t),e.check()}):void this.complete()},s.prototype.progress=function(t,e,i){this.progressedCount++,this.hasAnyBroken=this.hasAnyBroken||!t.isLoaded,this.emitEvent("progress",[this,t,e]),this.jqDeferred&&this.jqDeferred.notify&&this.jqDeferred.notify(this,t),this.progressedCount==this.images.length&&this.complete(),this.options.debug&&l&&l.log("progress: "+i,t,e)},s.prototype.complete=function(){var t=this.hasAnyBroken?"fail":"done";if(this.isComplete=!0,this.emitEvent(t,[this]),this.emitEvent("always",[this]),this.jqDeferred){var e=this.hasAnyBroken?"reject":"resolve";this.jqDeferred[e](this)}},o.prototype=Object.create(e.prototype),o.prototype.check=function(){var t=this.getIsImageComplete();return t?void this.confirm(0!==this.img.naturalWidth,"naturalWidth"):(this.proxyImage=new Image,this.proxyImage.addEventListener("load",this),this.proxyImage.addEventListener("error",this),this.img.addEventListener("load",this),this.img.addEventListener("error",this),void(this.proxyImage.src=this.img.src))},o.prototype.getIsImageComplete=function(){return this.img.complete&&void 0!==this.img.naturalWidth},o.prototype.confirm=function(t,e){this.isLoaded=t,this.emitEvent("progress",[this,this.img,e])},o.prototype.handleEvent=function(t){var e="on"+t.type;this[e]&&this[e](t)},o.prototype.onload=function(){this.confirm(!0,"onload"),this.unbindEvents()},o.prototype.onerror=function(){this.confirm(!1,"onerror"),this.unbindEvents()},o.prototype.unbindEvents=function(){this.proxyImage.removeEventListener("load",this),this.proxyImage.removeEventListener("error",this),this.img.removeEventListener("load",this),this.img.removeEventListener("error",this)},r.prototype=Object.create(o.prototype),r.prototype.check=function(){this.img.addEventListener("load",this),this.img.addEventListener("error",this),this.img.src=this.url;var t=this.getIsImageComplete();t&&(this.confirm(0!==this.img.naturalWidth,"naturalWidth"),this.unbindEvents())},r.prototype.unbindEvents=function(){this.img.removeEventListener("load",this),this.img.removeEventListener("error",this)},r.prototype.confirm=function(t,e){this.isLoaded=t,this.emitEvent("progress",[this,this.element,e])},s.makeJQueryPlugin=function(e){e=e||t.jQuery,e&&(a=e,a.fn.imagesLoaded=function(t,e){var i=new s(this,t,e);return i.jqDeferred.promise(a(this))})},s.makeJQueryPlugin(),s}),function(t,e){"function"==typeof define&&define.amd?define(["flickity/js/index","imagesloaded/imagesloaded"],function(i,n){return e(t,i,n)}):"object"==typeof module&&module.exports?module.exports=e(t,require("flickity"),require("imagesloaded")):t.Flickity=e(t,t.Flickity,t.imagesLoaded)}(window,function(t,e,i){"use strict";e.createMethods.push("_createImagesLoaded");var n=e.prototype;return n._createImagesLoaded=function(){this.on("activate",this.imagesLoaded)},n.imagesLoaded=function(){function t(t,i){var n=e.getParentCell(i.img);e.cellSizeChange(n&&n.element),e.options.freeScroll||e.positionSliderAtSelected()}if(this.options.imagesLoaded){var e=this;i(this.slider).on("progress",t)}},e});
	
	var _flickity = Flickity;

    window.Flickity = null;

    // Load into container 
    Container.set('Flickity', _flickity);
})();
(function()
{
    /* NProgress, (c) 2013, 2014 Rico Sta. Cruz - http://ricostacruz.com/nprogress
    * @license MIT */
    !function(n,e){"function"==typeof define&&define.amd?define(e):"object"==typeof exports?module.exports=e():n.NProgress=e()}(this,function(){function n(n,e,t){return e>n?e:n>t?t:n}function e(n){return 100*(-1+n)}function t(n,t,r){var i;return i="translate3d"===c.positionUsing?{transform:"translate3d("+e(n)+"%,0,0)"}:"translate"===c.positionUsing?{transform:"translate("+e(n)+"%,0)"}:{"margin-left":e(n)+"%"},i.transition="all "+t+"ms "+r,i}function r(n,e){var t="string"==typeof n?n:o(n);return t.indexOf(" "+e+" ")>=0}function i(n,e){var t=o(n),i=t+e;r(t,e)||(n.className=i.substring(1))}function s(n,e){var t,i=o(n);r(n,e)&&(t=i.replace(" "+e+" "," "),n.className=t.substring(1,t.length-1))}function o(n){return(" "+(n&&n.className||"")+" ").replace(/\s+/gi," ")}function a(n){n&&n.parentNode&&n.parentNode.removeChild(n)}var u={};u.version="0.2.0";var c=u.settings={minimum:.08,easing:"linear",positionUsing:"",speed:200,trickle:!0,trickleSpeed:200,showSpinner:!0,barSelector:'[role="bar"]',spinnerSelector:'[role="spinner"]',parent:"body",template:'<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'};u.configure=function(n){var e,t;for(e in n)t=n[e],void 0!==t&&n.hasOwnProperty(e)&&(c[e]=t);return this},u.status=null,u.set=function(e){var r=u.isStarted();e=n(e,c.minimum,1),u.status=1===e?null:e;var i=u.render(!r),s=i.querySelector(c.barSelector),o=c.speed,a=c.easing;return i.offsetWidth,l(function(n){""===c.positionUsing&&(c.positionUsing=u.getPositioningCSS()),f(s,t(e,o,a)),1===e?(f(i,{transition:"none",opacity:1}),i.offsetWidth,setTimeout(function(){f(i,{transition:"all "+o+"ms linear",opacity:0}),setTimeout(function(){u.remove(),n()},o)},o)):setTimeout(n,o)}),this},u.isStarted=function(){return"number"==typeof u.status},u.start=function(){u.status||u.set(0);var n=function(){setTimeout(function(){u.status&&(u.trickle(),n())},c.trickleSpeed)};return c.trickle&&n(),this},u.done=function(n){return n||u.status?u.inc(.3+.5*Math.random()).set(1):this},u.inc=function(e){var t=u.status;return t?t>1?void 0:("number"!=typeof e&&(e=t>=0&&.2>t?.1:t>=.2&&.5>t?.04:t>=.5&&.8>t?.02:t>=.8&&.99>t?.005:0),t=n(t+e,0,.994),u.set(t)):u.start()},u.trickle=function(){return u.inc()},function(){var n=0,e=0;u.promise=function(t){return t&&"resolved"!==t.state()?(0===e&&u.start(),n++,e++,t.always(function(){e--,0===e?(n=0,u.done()):u.set((n-e)/n)}),this):this}}(),u.render=function(n){if(u.isRendered())return document.getElementById("nprogress");i(document.documentElement,"nprogress-busy");var t=document.createElement("div");t.id="nprogress",t.innerHTML=c.template;var r,s=t.querySelector(c.barSelector),o=n?"-100":e(u.status||0),l=document.querySelector(c.parent);return f(s,{transition:"all 0 linear",transform:"translate3d("+o+"%,0,0)"}),c.showSpinner||(r=t.querySelector(c.spinnerSelector),r&&a(r)),l!=document.body&&i(l,"nprogress-custom-parent"),l.appendChild(t),t},u.remove=function(){s(document.documentElement,"nprogress-busy"),s(document.querySelector(c.parent),"nprogress-custom-parent");var n=document.getElementById("nprogress");n&&a(n)},u.isRendered=function(){return!!document.getElementById("nprogress")},u.getPositioningCSS=function(){var n=document.body.style,e="WebkitTransform"in n?"Webkit":"MozTransform"in n?"Moz":"msTransform"in n?"ms":"OTransform"in n?"O":"";return e+"Perspective"in n?"translate3d":e+"Transform"in n?"translate":"margin"};var l=function(){function n(){var t=e.shift();t&&t(n)}var e=[];return function(t){e.push(t),1==e.length&&n()}}(),f=function(){function n(n){return n.replace(/^-ms-/,"ms-").replace(/-([\da-z])/gi,function(n,e){return e.toUpperCase()})}function e(n){var e=document.body.style;if(n in e)return n;for(var t,r=i.length,s=n.charAt(0).toUpperCase()+n.slice(1);r--;)if(t=i[r]+s,t in e)return t;return n}function t(t){return t=n(t),s[t]||(s[t]=e(t))}function r(n,e,r){e=t(e),n.style[e]=r}var i=["Webkit","O","Moz","ms"],s={};return function(n,e){var t,i,s=arguments;if(2==s.length)for(t in e)i=e[t],void 0!==i&&e.hasOwnProperty(t)&&r(n,t,i);else r(n,s[1],s[2])}}();return u});

    var _NProgress = NProgress;

    window.NProgress = null;

    // Load into container 
    Container.set('NProgress', _NProgress);

})();

// Utility
/**
 * ToggleHeight
 *
 * The ToggleHeight module allows to transition an element's height 
 * from 0 -> auto or from auto -> 0
 *
 */
 (function() {

    /**
     * @var Helper obj
     */
    var Helper = Container.get('JSHelper');

    var timer;

    /**
     * Module constructor
     *
     * @class
     * @constructor
     * @access public
     * @params el          node     The target node
     * @params initial     int      The height in px to start the transition
     * @params time        int      The time in ms of the transition
     * @params easing      string   Transition easing - valid css easing function
     * @params withOpacity boolean Should the transition include and opacity fade ?
     */
    var ToggleHeight = function(el, initial, time, easing, withOpacity)
    {
        // Set defaults if values were not provided;
        initial     = (typeof initial === 'undefined' ? 0 : initial);
        time        = (typeof time === 'undefined' ? 300 : time);
        easing      = (typeof easing === 'undefined' ? 'ease-in' : easing);
        withOpacity = (typeof withOpacity === 'undefined' ? false : withOpacity);

        // Get the element's current height
        var actualHeight = parseInt(el.clientHeight || el.offsetHeight);

        // Get the element's projected height
        var computedStyle = Helper._computeStyle(el);
        var endHeight     = parseInt(el.scrollHeight - parseInt(computedStyle.paddingTop) - parseInt(computedStyle.paddingBottom) + parseInt(computedStyle.borderTopWidth) + parseInt(computedStyle.borderBottomWidth));

        // Dispatch appropriate function
        if (endHeight === actualHeight || actualHeight > endHeight)
        {
            this._fromAuto(el, initial, time, easing, actualHeight, withOpacity);
        }
        else
        {
            this._toAuto(el, time, easing, actualHeight, endHeight, withOpacity);
        }
    }

    /**
     * Transition element's height from some height to auto.
     *
     * @access private
     * @params el                   node     The target node
     * @params initial              int      The height in px to start the transition
     * @params time                 int      The time in ms of the transition
     * @params easing               string   Transition easing - valid css easing function
     * @params actualHeight         int      Height in px that the transition will start at
     * @params endHeight            int      Height in px that the transition will end at
     * @params withOpacity          boolean  Should the transition include and opacity fade ?
     */
    ToggleHeight.prototype._toAuto = function(el, time, easing, actualHeight, endHeight, withOpacity)
    {
        // Bugfix if the height is set to auto transition from auto
        if (el.style.height === 'auto')
        {
            this._fromAuto(el, 0, time, easing, actualHeight, withOpacity);
            return;
        }

        // Bugfix if both heights are the same just set the height to auto
        if (actualHeight === endHeight)
        {
            el.style.height = 'auto';
            return;
        }
        
        clearTimeout(timer);

        // Opacity timer
        var opacityTime = (75 * time) / 100 + time;

        // Set the height to the actual height (which could be zero)
        // and force the browser to repaint
        Helper.css(el, 'height', actualHeight + 'px');
        el.offsetHeight;
        
        // Run animations
        Helper.animate(el, 'height',  actualHeight + 'px', endHeight + 'px', time, easing);
        if  (withOpacity)
        {
            Helper.animate(el, 'opacity', '0', '1', opacityTime, easing);
        }

        timer = setTimeout(function()
        {
            Helper.css(el, 'height', 'auto');
        }, time);

    }

    /**
     * Transition element's height from "auto" to 0.
     *
     * @access private
     * @params el                   node     The target node
     * @params initial              int      The height in px to start the transition
     * @params time                 int      The time in ms of the transition
     * @params easing               string   Transition easing - valid css easing function
     * @params actualHeight         int      Height in px that the transition will start at
     * @params withOpacity          boolean  Should the transition include and opacity fade ?
     */
    ToggleHeight.prototype._fromAuto = function(el, initial, time, easing, actualHeight, withOpacity)
    {
        clearTimeout(timer);
        var opacityTime = (15 * time) / 100 + time; 

        // Set the height to the actual height (which could be zero)
        // and force the browser to repaint
        Helper.css(el, 'height', actualHeight + 'px');
        el.offsetHeight;

        // Run animations
        Helper.animate(el, 'height',  actualHeight + 'px', '0px', time, easing);
        
        if  (withOpacity)
        {
            Helper.animate(el, 'opacity', '1', '0', opacityTime, easing);
        }
    }

    // Load into container
    Container.set('ToggleHeight', ToggleHeight);

})();
/**
 * Events
 *
 * This class handles custom event firing and callback assigning.
 *
 */
 (function()
 {

    /**
     * Module constructor
     *
     * @class
     * @constructor
     * @access public
     * @return this
     */
    var Events = function()
    {
        
        this._callbacks = {};
        
        return this;
    }

    /**
     * Module destructor - clears event cache
     *
     * @access public
     */
    Events.prototype.destruct = function()
    {
        this._callbacks = {};
    }

    /**
     * Fire a custom event
     *
     * @param eventName string The event name to fire
     * @param eventName string What should be given as "this" to the event callbacks
     * @access public
     */
    Events.prototype.fire = function(eventName, subject)
    {
        for (var key in this._callbacks)
        {
            if (!this._callbacks.hasOwnProperty(key))
            {
                continue;
            }

            var callbackEvent = key.split('______')[0];

            if (callbackEvent === eventName)
            {
                var callback = this._callbacks[key].callback;
                
                callback.apply(subject, []);
            }
        }
    }

    /**
     * Bind a callback to an event
     *
     * @param eventName string The event name
     * @param callback  func   The callback function
     * @access public
     */
    Events.prototype.on = function(eventName, callback)
    {
        // Make sure the function is unique - unless it is ananonymous
        var callbackName = this._getFnName(callback);
        
        if (callbackName === 'anonymous')
        {
            callbackName = 'anonymous_' + Object.keys(this._callbacks).length;
        }

        var key  = eventName+'______'+callbackName;

        // Save the callback and event name
        this._callbacks[key] = {
            name     : eventName,
            callback : callback,
        };
    }

    /**
     * UnBind a callback to an event
     *
     * @param eventName string The event name
     * @param callback  func   The callback function
     * @access public
     */
    Events.prototype.off = function(eventName, callback)
    {
        for (var key in this._callbacks)
        {
            if (!this._callbacks.hasOwnProperty(key))
            {
                continue;
            }

            var callbackEvent = key.split('______')[0];
            
            if (callbackEvent === eventName && this._callbacks[key]['callback'] === callback)
            {
                delete this._callbacks[key];
            }
        }
    }

    /**
     * Get a callback function by key
     *
     * @param fn string The function key
     * @access private
     * @return string
     */
    Events.prototype._getFnName = function(fn)
    {
        var f = typeof fn == 'function';
        
        var s = f && ((fn.name && ['', fn.name]) || fn.toString().match(/function ([^\(]+)/));

        return (!f && 'not a function') || (s && s[1] || 'anonymous');
    }

    // Load into container and invoke
    Container.singleton('Events', Events);

}());

/**
 * InputMasker
 *
 * The InputMasker is a utility class used internally to apply and handle intput masking.
 * It can still be invoked directly via the IOC container if you want to use it.
 * @example Container.get('InputMasker').creditcard();
 * @see     inputMasks.js
 */
 (function() {

    /**
     * @var Helper obj
     */
    var Helper = Container.get('JSHelper');

    var Patterns = function() {
        
    };

    Patterns.money = function(value, opts) {
        opts = mergeMoneyOptions(opts);
        if (opts.zeroCents) {
            opts.lastOutput = opts.lastOutput || "";
            var zeroMatcher = ("(" + opts.separator + "[0]{0," + opts.precision + "})"),
                zeroRegExp = new RegExp(zeroMatcher, "g"),
                digitsLength = value.toString().replace(/[\D]/g, "").length || 0,
                lastDigitLength = opts.lastOutput.toString().replace(/[\D]/g, "").length || 0;
            value = value.toString().replace(zeroRegExp, "");
            if (digitsLength < lastDigitLength) {
                value = value.slice(0, value.length - 1);
            }
        }
        var number = value.toString().replace(/[\D]/g, ""),
            clearDelimiter = new RegExp("^(0|\\" + opts.delimiter + ")"),
            clearSeparator = new RegExp("(\\" + opts.separator + ")$"),
            money = number.substr(0, number.length - opts.moneyPrecision),
            masked = money.substr(0, money.length % 3),
            cents = new Array(opts.precision + 1).join("0");
        money = money.substr(money.length % 3, money.length);
        for (var i = 0, len = money.length; i < len; i++) {
            if (i % 3 === 0) {
                masked += opts.delimiter;
            }
            masked += money[i];
        }
        masked = masked.replace(clearDelimiter, "");
        masked = masked.length ? masked : "0";
        if (!opts.zeroCents) {
            var beginCents = number.length - opts.precision,
                centsValue = number.substr(beginCents, opts.precision),
                centsLength = centsValue.length,
                centsSliced = (opts.precision > centsLength) ? opts.precision : centsLength;
            cents = (cents + centsValue).slice(-centsSliced);
        }
        var output = opts.unit + masked + opts.separator + cents + opts.suffixUnit;
        return output.replace(clearSeparator, "");
    };

    Patterns.pattern = function(value, opts) {
        var pattern = (typeof opts === 'object' ? opts.pattern : opts),
            patternChars = pattern.replace(/\W/g, ''),
            output = pattern.split(""),
            values = value.toString().replace(/\W/g, ""),
            charsValues = values.replace(/\W/g, ''),
            index = 0,
            i,
            outputLength = output.length,
            placeholder = (typeof opts === 'object' ? opts.placeholder : undefined);

        for (i = 0; i < outputLength; i++) {
            // Reached the end of input
            if (index >= values.length) {
                if (patternChars.length == charsValues.length) {
                    return output.join("");
                } else if ((placeholder !== undefined) && (patternChars.length > charsValues.length)) {
                    return addPlaceholdersToOutput(output, i, placeholder).join("");
                } else {
                    break;
                }
            }
            // Remaining chars in input
            else {
                if ((output[i] === DIGIT && values[index].match(/[0-9]/)) ||
                    (output[i] === ALPHA && values[index].match(/[a-zA-Z]/)) ||
                    (output[i] === ALPHANUM && values[index].match(/[0-9a-zA-Z]/))) {
                    output[i] = values[index++];
                } else if (output[i] === DIGIT || output[i] === ALPHA || output[i] === ALPHANUM) {
                    if (placeholder !== undefined) {
                        return addPlaceholdersToOutput(output, i, placeholder).join("");
                    } else {
                        return output.slice(0, i).join("");
                    }
                }
            }
        }
        return output.join("").substr(0, i);
    };

    Patterns.numeric = function(value) {
        return value.toString().replace(/(?!^-)[^0-9]/g, "");
    };

    Patterns.alphaNumeric = function(value) {
        return value.toString().replace(/[^a-z0-9]+/i, "");
    };

    Patterns.alphaSpace = function(value) {
        return value.toString().replace(/[^a-z ]+/i, "");
    };

    Patterns.alphaNumericDash = function(value) {
        return value.toString().replace(/[^a-z0-9-]+/i, "");
    };

    Patterns.numericDecimal = function(value) {
        return value.toString().replace(/(?!^-)[^0-9\.]/g, "")
    };

    Patterns.alphaDash = function(value) {
        var val = value.toString();
        while (val[0] === '-') {
            val = val.slice(1);
        }
        return val.replace(/[^a-z-]+/i, "");
    };

    Patterns.alphaDashNumDot = function(value) {
        var val = value.toString();
        while (val[0] === '-') {
            val = val.slice(1);
        }
        return val.replace(/[^a-z0-9-.]+/i, "");
    };

    // INTERNAL VARIABLES
    /*****************************************/
    var DIGIT = "9",
    ALPHA = "A",
    ALPHANUM = "S",
    BY_PASS_KEYS = [9, 16, 17, 18, 36, 37, 38, 39, 40, 91, 92, 93],
    isAllowedKeyCode = function(keyCode) {
        for (var i = 0, len = BY_PASS_KEYS.length; i < len; i++) {
            if (keyCode == BY_PASS_KEYS[i]) {
                return false;
            }
        }
        return true;
    },
    mergeMoneyOptions = function(opts) {
        opts = opts || {};
        opts = {
            precision: opts.hasOwnProperty("precision") ? opts.precision : 2,
            separator: opts.separator || ",",
            delimiter: opts.delimiter || ".",
            unit: opts.unit && (opts.unit.replace(/[\s]/g, '') + " ") || "",
            suffixUnit: opts.suffixUnit && (" " + opts.suffixUnit.replace(/[\s]/g, '')) || "",
            zeroCents: opts.zeroCents,
            lastOutput: opts.lastOutput
        };
        opts.moneyPrecision = opts.zeroCents ? 0 : opts.precision;
        return opts;
    },
    // Fill wildcards past index in output with placeholder
    addPlaceholdersToOutput = function(output, index, placeholder) {
        for (; index < output.length; index++) {
            if (output[index] === DIGIT || output[index] === ALPHA || output[index] === ALPHANUM) {
                output[index] = placeholder;
            }
        }
        return output;
    };

    // MODULE OBJECT
    /*****************************************/
    var InputMasker = function(element) {
        
        this.element = element;
    
        return this;
    }

    // UNBIND 
    /*****************************************/
    InputMasker.prototype._unbindElementToMask = function() {
        this.element.lastOutput = "";
        this.element.onkeyup = false;
        this.element.onkeydown = false;

        if (this.element.value.length) {
            this.element.value = this.element.value.replace(/\D/g, '');
        }
    };

    // BIND 
    /*****************************************/
    InputMasker.prototype._bindElementToMask = function(maskFunction) {
        var that = this,
            onType = function(e) {
                e = e || window.event;
                var source = e.target || e.srcElement;

                if (isAllowedKeyCode(e.keyCode)) {
                    setTimeout(function() {
                        that.opts.lastOutput = source.lastOutput;
                        source.value = Patterns[maskFunction](source.value, that.opts);
                        source.lastOutput = source.value;
                        if (source.setSelectionRange && that.opts.suffixUnit) {
                            source.setSelectionRange(source.value.length, (source.value.length - that.opts.suffixUnit.length));
                        }
                    }, 0);
                }
            };
        
        this.element.lastOutput = "";
        this.element.onkeyup = onType;
        if (this.element.value.length) {
            this.element.value = Patterns[maskFunction](this.element.value, this.opts);
        }
       
    };

    // PRESETS
    /*****************************************/
    InputMasker.prototype.creditcard = function() {
        this.opts = { pattern: '9999 9999 9999 9999' };
        this._bindElementToMask("pattern");
    };

    InputMasker.prototype.money = function(opts) {
        this.opts = mergeMoneyOptions(opts);
        this._bindElementToMask("money");
    };

    InputMasker.prototype.numeric = function() {
        this.opts = {};
        this._bindElementToMask("numeric");
    };

    InputMasker.prototype.numericDecimal = function(pattern) {
        this.opts = {
            pattern: pattern
        };
        this._bindElementToMask("numericDecimal");
    };

    InputMasker.prototype.alphaNumeric = function() {
        this.opts = {};
        this._bindElementToMask("alphaNumeric");
    };

    InputMasker.prototype.alphaSpace = function() {
        this.opts = {};
        this._bindElementToMask("alphaSpace");
    };

    InputMasker.prototype.alphaDash = function() {
        this.opts = {};
        this._bindElementToMask("alphaDash");
    };

    InputMasker.prototype.alphaNumericDash = function() {
        this.opts = {};
        this._bindElementToMask("alphaNumericDash");
    };

    InputMasker.prototype.pattern = function(pattern) {
        this.opts = {
            pattern: pattern
        };
        this._bindElementToMask("pattern");
    };

    InputMasker.prototype.remove = function() {
        this._unbindElementToMask();
    };

    // SET IN IOC
    /*****************************************/
    Container.set('InputMasker', InputMasker);

}());
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
        var modalH        = parseInt(el.offsetHeight);
        var windowH       = window.innerHeight|| document.documentElement.clientHeight|| getElementsByTagName('body')[0].clientHeight;
        
        // If the window height is less than the modal dialog
        // We need to adjust the dialog so it is at the top of the page
        if (centered)
        {
            if (windowH <= modalH)
            {
                el.style.marginTop  = '0px';
                el.style.top  = '0';
            }
            else
            {
                el.style.marginTop  = '-' + (modalH/2) + 'px';
                el.style.top  = '50%';
            }
        }
        else
        {
           el.style.top  = '0';
        }
    }

    // Load into container 
    Container.set('Modal', Modal);

})();
/**
 * Notifications
 *
 * The Notifications class is a utility class used to
 * display a notification.
 *
 */
(function() {

    /**
     * @var Helper obj
     */
    var Helper = Container.get('JSHelper');

    /**
     * @var _activeNotifs array
     */
    var _activeNotifs = [];

    /**
     * Module constructor
     *
     * @class
     * @constructor
     * @params options obj
     * @access public
     * @return this
     */
    var Notifications = function(options) {
        this._notifWrap = Helper.$('.js-nofification-wrap');
        
        if (!Helper.nodeExists(this._notifWrap)) {
            var wrap = document.createElement('DIV');
            wrap.className = 'notification-wrap js-nofification-wrap';
            document.body.appendChild(wrap);
            this._notifWrap = Helper.$('.js-nofification-wrap');
        }
        
        this._invoke(options);
        
        return this;
    };

    /**
     * Display the notification
     *
     * @params options obj
     * @access private
     */
    Notifications.prototype._invoke = function(options) {
        if (typeof options.isCallback !== 'undefined' && options.isCallback === true) {
            this._invokeCallbackable(options);
            return;
        }

        var _this = this;
        var content   = '<div class="msg-body"><p>' + options.msg + '</p></div>';
        var notif     = Helper.newNode('div', 'msg-'+options.type + ' msg animate-notif', null, content, this._notifWrap);
        Helper.addClass(this._notifWrap, 'active');

        // Timout remove automatically
        _activeNotifs.push({
            node    : notif,
            timeout : setTimeout(function() {
                _this._removeNotif(notif);
            }, 6000),
        });

        // Click to remove
        notif.addEventListener('click', function() {
            _this._removeNotif(notif);
        });
    }

    /**
     * Create a notification that has callback buttons 
     *
     * @params options obj
     * @access private
     */
    Notifications.prototype._invokeCallbackable = function(options) {
        var _this        = this;
        var cancelText   = typeof options.cancelText === 'undefined'  ? 'Cacnel'  : options.cancelText;
        var confirmText  = typeof options.confirmText === 'undefined' ? 'Confirm' : options.confirmText;
        var cancelClass  = typeof options.cancelClass === 'undefined'  ? 'btn-default'  : options.cancelClass;
        var confirmClass = typeof options.confirmClass === 'undefined'  ? 'btn-success'  : options.confirmClass;

        var content  = '<div class="msg-body"><p>' + options.msg + '</p><div class="row roof-xs msg-buttons"><button class="btn '+cancelClass+' cancel-msg js-cancel">'+cancelText+'</button>&nbsp;&nbsp;<button class="btn '+confirmClass+' js-confirm">' + confirmText + '</button></div></div>';
        var notif    = Helper.newNode('div', 'msg-'+options.type + ' msg animate-notif msg-confirm', null, content, this._notifWrap);
        var cancel   = Helper.$('.js-cancel', notif);
        var confirm  = Helper.$('.js-confirm', notif);
        Helper.addClass(this._notifWrap, 'active');
        
        _activeNotifs.push({
            node    : notif,
            timeout : null,
        });

        // Click cancel to remove
        cancel.addEventListener('click', function() {
            if (Helper.isCallable(options.onCancel)) options.onCancel(options.onCancelArgs);
            _this._removeNotif(notif);
        });

        // Click confirm to remove
        confirm.addEventListener('click', function() {
            if (Helper.isCallable(options.onConfirm)) options.onConfirm(options.onConfirmArgs);
            _this._removeNotif(notif);
        });
    }

    /**
     * Remove a notification
     *
     * @params _node node
     * @access private
     */
    Notifications.prototype._removeNotif = function(_node) {
        var _this = this;
        var i = _activeNotifs.length;
        while (i--) {
            if (_node === _activeNotifs[i].node) {
                clearTimeout(_activeNotifs[i].timeout);
                Helper.removeClass(_node, 'animate-notif');
                Helper.animate(_node, 'opacity', '1', '0', 350, 'ease');
                Helper.animate(_node, 'max-height', '100px', '0', 450, 'ease');
                _activeNotifs.splice(i, 1);
                setTimeout(function() {
                    Helper.removeFromDOM(_node);
                    if (_activeNotifs.length === 0) Helper.removeClass(_this._notifWrap, 'active');
                }, 450);
                return;
            }
        }
    }

    // Add to container
    Container.set('Notifications', Notifications);

})();
/**
 * Ajax
 *
 * Ajax utility module
 *
 */
(function() {

    /**
     * @namespace HelperAjax
     */
    var HelperAjax = {

        /**
         * @property {XMLHttpRequest|ActiveXObject}
         */
        xhr: null,

        /**
         * @property {Object} Default ajax settings
         */
        settings: {
            url: '',
            type: 'GET',
            dataType: 'text', // text, html, json or xml
            async: true,
            cache: true,
            data: null,
            contentType: 'application/x-www-form-urlencoded',
            success: null,
            error: null,
            complete: null,
            headers: [],
            accepts: {
                text: 'text/plain',
                html: 'text/html',
                xml: 'application/xml, text/xml',
                json: 'application/json, text/javascript'
            }
        },

        construct: function() {},
        destruct: function() {},

        /**
         * Ajax call
         * @param {Object} [options] Overwrite the default settings (see ajaxSettings)
         * @return {This}
         */
        call: function(options) {
            var self = this,
                xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP'),
                opts = (function(s, o) {
                    var opts = {};

                    for (var key in s)
                        opts[key] = (typeof o[key] == 'undefined') ? s[key] : o[key];

                    return opts;
                })(this.settings, options),
                ready = function() {
                    if (xhr.readyState == 4) {
                        if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
                            // set data
                            var data = (opts.dataType == 'xml') ? xhr.responseXML : xhr.responseText;

                            //console.log(data);

                            // parse json data
                            if (opts.dataType == 'json')
                                data = self.parseJSON(data);

                            // success callback
                            if (self.isFunction(opts.success))
                                opts.success.call(opts, data, xhr.status, xhr);
                        } else {
                            // error callback
                            if (self.isFunction(opts.error))
                                opts.error.call(opts, xhr, xhr.status);
                        }

                        // complete callback
                        if (self.isFunction(opts.complete))
                            opts.complete.call(opts, xhr, xhr.status);
                    }
                };

            this.xhr = xhr;

            // prepare options
            if (!opts.cache)
                opts.url += ((opts.url.indexOf('?') > -1) ? '&' : '?') + '_nocache=' + (new Date()).getTime();

            if (opts.data) {
                if (opts.type == 'GET') {
                    opts.url += ((opts.url.indexOf('?') > -1) ? '&' : '?') + this.param(opts.data);
                    opts.data = null;
                } else {
                    opts.data = this.param(opts.data);
                }
            }

            // set request
            xhr.open(opts.type, opts.url, opts.async);
            xhr.setRequestHeader('Content-type', opts.contentType);
            xhr.setRequestHeader('REQUESTED-WITH', 'XMLHttpRequest');

            if (opts.dataType && opts.accepts[opts.dataType])
                xhr.setRequestHeader('Accept', opts.accepts[opts.dataType]);

            if (opts.headers)
            {
                for (var k = 0; k < opts.headers.length; k++)
                {
                    var header = opts.headers[k];
                    var key    = Object.keys(header)[0];                    
                    xhr.setRequestHeader(key, header[key]);
                }
            }

            if (opts.async) {
                xhr.onreadystatechange = ready;
                xhr.send(opts.data);
            } else {
                xhr.send(opts.data);
                ready();
            }

            return this;
        },

        /**
         * Ajax GET request
         * @param {String} url
         * @param {String|Object} [data] Containing GET values
         * @param {Function} [success] Callback when request was succesfull
         * @return {This}
         */
        get: function(url, data, success, error, headers) {
            if (this.isFunction(data)) {
                error   = success;
                success = data;
                data    = null;
            }

            return this.call({
                url: url,
                type: 'GET',
                data: data,
                success: success,
                error: error,
                headers: headers
            });
        },

        /**
         * Ajax POST request
         * @param {String} url
         * @param {String|Object} [data] Containing POST values
         * @param {Function} [success] Callback when request was succesfull
         * @return {This}
         */
        post: function(url, data, success, error, headers) {
            if (this.isFunction(data)) {
                error   = success;
                success = data;
                data    = null;
            }

            return this.call({
                url: url,
                type: 'POST',
                data: data,
                success: success,
                error: error,
                headers: headers
            });
        },

        upload: function(url, data, success, error, start, progress, load)
        {
            var formData = new FormData();
            for (var key in data) {
                
                //formData.append(name, file, filename);
                // skip loop if the property is from prototype
                if (!data.hasOwnProperty(key)) continue;
                var value = data[key];

                if (value['type']) {
                    formData.append(key, value, value.name);
                }
                else {
                    formData.append(key, value);
                }
            }

            var self = this;
            var xhr  = new XMLHttpRequest();
            if (this.isFunction(start)) {
                xhr.upload.addEventListener("loadstart", start, false);
            }
            if (this.isFunction(progress)) {
                 xhr.upload.addEventListener("progress", progress, false);
            }
            if (this.isFunction(load)) {
                xhr.upload.addEventListener("load", load, false);
            }
            xhr.addEventListener("readystatechange", function(e) {
                e = e || window.event;
                var status, text, readyState;
                try {
                    readyState = e.target.readyState;
                    text       = e.target.responseText;
                    status     = e.target.status;
                } 
                catch (e) {
                    return;
                }

                if (readyState == 4) {
                    if (status >= 200 && status < 300 || status === 304) {
                        var response = e.target.responseText;
                        //console.log(response);
                        if (self.isFunction(success)) success(response);
                    } 
                    else {
                        // error callback
                        if (self.isFunction(error)) error.call(status, xhr);
                    }
                }

            }, false);
            xhr.open("POST", url, true);
            xhr.setRequestHeader('REQUESTED-WITH', 'XMLHttpRequest');
            xhr.send(formData);
            

        },

        /**
         * Set content loaded by an ajax call
         * @param {DOMElement|String} el Can contain an element or the id of the element
         * @param {String} url The url of the ajax call (include GET vars in querystring)
         * @param {String} [data] The POST data, when set method will be set to POST
         * @param {Function} [complete] Callback when loading is completed
         * @return {This}
         */
        load: function(el, url, data, complete) {
            if (typeof el == 'string')
                el = document.getElementById(el);

            return this.call({
                url: url,
                type: data ? 'POST' : 'GET',
                data: data || null,
                complete: complete || null,
                success: function(html) {
                    try {
                        el.innerHTML = html;
                    } catch (e) {
                        var ph = document.createElement('div');
                        ph.innerHTML = html;

                        // empty element content
                        while (el.firstChild)
                            el.removeChild(el.firstChild);

                        // set new html content
                        for (var x = 0, max = ph.childNodes.length; x < max; x++)
                            el.appendChild(ph.childNodes[x]);
                    }
                }
            });
        },

        /**
         * Make querystring outof object or array of values
         * @param {Object|Array} obj Keys/values
         * @return {String} The querystring
         */
        param: function(obj) {
            var s = [];

            for (var key in obj) {
                s.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
            }

            return s.join('&');
        },

        /**
         * Parse JSON string
         * @param {String} data
         * @return {Object} JSON object
         */
        parseJSON: function(data) {
            if (typeof data !== 'string' || !data)
                return null;

            return eval('(' + this.trim(data) + ')');
        },

        /**
         * Trim spaces
         * @param {String} str
         * @return {String}
         */
        trim: function(str) {
            return str.replace(/^\s+/, '').replace(/\s+$/, '');
        },

        /**
         * Check if argument is function
         * @param {Mixed} obj
         * @return {Boolean}
         */
        isFunction: function(obj) {
            return Object.prototype.toString.call(obj) === '[object Function]';
        }

    };

    Container.set('Ajax', HelperAjax);

})();

/**
 * FormValidator
 *
 * This class is used to validate a form and 
 * also apply and classes to display form results and input errors.
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
     * @param form node
     * @access public
     * @return this
     */
    var FormValidator = function(form) {

        // Save inputs
        this._form   = form;
        this._inputs = Helper.getFormInputs(form);

        // Defaults
        this._rulesIndex      = [];
        this._invalids        = [];
        this._formObj         = {};
        this._nameIndex       = {};
        this._validForm       = true;

        // Initialize
        this._indexInputs();
    
        return this;

    };

    // PUBLIC ACCESS
    
    /**
     *  Is the form valid?
     *
     * @access public
     * @return boolean
     */
    FormValidator.prototype.isValid = function() {       
        return this._validateForm();
    };
    
    /**
     * Show invalid inputs
     *
     * @access public
     */
    FormValidator.prototype.showInvalid = function() {
        
        this._clearForm();

        // Show the invalid inputs
        for (var j = 0; j < this._invalids.length; j++) {
            var __wrap = Helper.closestClass(this._invalids[j], 'form-field');
            if (Helper.nodeExists(__wrap)) Helper.addClass(__wrap, 'danger');
        }
    }

    /**
     * Remove errored inputs
     *
     * @access public
     */
    FormValidator.prototype.clearInvalid = function()
    {
        this._clearForm();
    }

    /**
     * Show form result
     *
     * @access public
     */
    FormValidator.prototype.showResult = function(result) {
        this._clearForm();
        Helper.addClass(this._form, result);
    }
    
    /**
     * Append a key/pair and return form obj
     *
     * @access public
     * @return obj
     */
    FormValidator.prototype.append = function(key, value) {
        this._formObj[key] = value;
        return  this._generateForm();
    };
    
    /**
     * Get the form object
     *
     * @access public
     * @return obj
     */
    FormValidator.prototype.form = function() {
        return  this._generateForm();
    };


    // PRIVATE FUNCTIONS

    /**
     * Index form inputs by name and rules
     *
     * @access public
     */
    FormValidator.prototype._indexInputs = function() {
        for (var i = 0; i < this._inputs.length; i++) {
            if (!this._inputs[i].name) continue;
            var name = this._inputs[i].name;
            this._nameIndex[name] = this._inputs[i];
            this._rulesIndex.push({
                node: this._inputs[i],
                isRequired: this._inputs[i].dataset.jsRequired || null,
                validationMinLength: this._inputs[i].dataset.jsMinLegnth || null,
                validationMaxLength: this._inputs[i].dataset.jsMaxLegnth || null,
                validationType: this._inputs[i].dataset.jsValidation || null,
                isValid: true,
            });
        }
    };

    /**
     * Validate the form inputs
     *
     * @access private
     * @return boolean
     */
    FormValidator.prototype._validateForm = function() {
        this._invalids = [];
        this._validForm = true;

        for (var i = 0; i < this._rulesIndex.length; i++) {
            
            this._rulesIndex[i].isValid = true;

            var pos   = this._rulesIndex[i];
            var value = Helper.getInputValue(pos.node);

            if (!pos.isRequired && value === '') {
                continue;
            } else if (pos.isRequired && value.replace(/ /g,'') === '') {
                this._devalidate(i);
            } else if (pos.validationMinLength && !this._validateMinLength(value, pos.validationMinLength)) {
                this._devalidate(i);
            } else if (pos.validationMaxLength && !this._validateMaxLength(value, pos.validationMaxLength)) {
                this._devalidate(i);
            } else if (pos.validationType) {
                var isValid = true;
                if (pos.validationType === 'email') isValid = this._validateEmail(value);
                if (pos.validationType === 'name') isValid = this._validateName(value);
                if (pos.validationType === 'password') isValid = this._validatePassword(value);
                if (pos.validationType === 'creditcard') isValid = this._validateCreditCard(value);
                if (pos.validationType === 'url') isValid = this._validateUrl(value);
                if (pos.validationType === 'alpha') isValid = this.alpha(value);
                if (pos.validationType === 'numeric') isValid = this._validateNumeric(value);
                if (pos.validationType === 'list') isValid = this._validateList(value);
                if (!isValid) this._devalidate(i);
            }
        }

        return this._validForm;
    };

    /**
     * Generate the form object
     *
     * @access private
     * @return obj
     */
    FormValidator.prototype._generateForm = function() {
        for (var i = 0; i < this._inputs.length; i++) {
            var name  = this._inputs[i].name;
            var value = Helper.getInputValue(this._inputs[i]);
            if (this._inputs[i].type === 'radio' && this._inputs[i].checked == false) {
                continue;
            }
            if (this._inputs[i].type === 'checkbox') {
                this._formObj[name] = (this._inputs[i].checked == true);
                continue;
            }
            if (Helper.is_numeric(value)) value = parseInt(value);
            if (name.indexOf('[]') > -1) {
                if (!Helper.isset(this._formObj[name])) this._formObj[name] = [];
                this._formObj[name].push(value);
            }
            else {
                this._formObj[name] = value;
            }
        }
        return this._formObj;
    };

    /**
     * Mark an input as not valid (internally)
     *
     * @access private
     * @return obj
     */
    FormValidator.prototype._devalidate = function(i) {
        this._rulesIndex[i].isValid = false;
        this._validForm = false;
        this._invalids.push(this._rulesIndex[i].node);
    };

    /**
     * Clear form result and input errors
     *
     * @access private
     * @return obj
     */
    FormValidator.prototype._clearForm = function(i) {
        // Remove the form result
        Helper.removeClass(this._form, ['info', 'success', 'warning', 'danger']);

        // Make all input elements 'valid' - i.e hide the error msg and styles.
        for (var i = 0; i < this._inputs.length; i++) {
            var _wrap = Helper.closestClass(this._inputs[i], 'form-field');
            if (Helper.nodeExists(_wrap)) Helper.removeClass(_wrap, ['info', 'success', 'warning', 'danger'])
        }
    };

    /**
     * Private validator methods
     *
     * @access private
     * @return boolean
     */
    FormValidator.prototype._validateEmail = function(value) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(value);
    };
    FormValidator.prototype._validateName = function(value) {
        var re = /^[A-z _-]+$/;
        return re.test(value);
    };
    FormValidator.prototype._validateNumeric = function(value) {
        var re = /^[\d]+$/;
        return re.test(value);
    };
    FormValidator.prototype._validatePassword = function(value) {
        var re = /^(?=.*[^a-zA-Z]).{6,40}$/;
        return re.test(value);
    };
    FormValidator.prototype._validateUrl = function(value) {
        re = /^(www\.|[A-z]|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
        return re.test(value);
    };
    FormValidator.prototype._validateMinLength = function(value, min) {
        return value.length >= min;
    };
    FormValidator.prototype._validateMaxLength = function(value, max) {
        return value.length <= max;
    };
    FormValidator.prototype._validateAplha = function(value) {
        var re = /^[A-z _-]+$/;
        return re.test(value);
    };
    FormValidator.prototype._validateAplhaNumeric = function(value) {
        var re = /^[A-z0-9]+$/;
        return re.test(value);
    };
    FormValidator.prototype._validateList = function(value) {
        var re = /^[-\w\s]+(?:,[-\w\s]*)*$/;
        return re.test(value);
    };
    FormValidator.prototype._validateCreditCard = function(value) {
        value = value.replace(/ /g, "");
        var re = /^[0-9]+$/;
        var check = re.test(value);
        if (check === false) return false;
        if (value.length !== 16) return false;
        return true;
    };

    // Load into container
    Container.set('FormValidator', FormValidator);

})();

/**
 * Component Dynamic Hanlder 
 *
 * @author    Joe J. Howard
 * @copyright Joe J. Howard
 * @license   https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE
 */
(function()
{
    /**
     * JS Helper reference
     * 
     * @var object
     */
    var Helper = Hubble.helper();

    /**
     * AJAX Module
     * 
     * @var obj
     */
    var Ajax = Hubble.require('Ajax');

    /**
     * Module constructor
     *
     * @access      public
     * @constructor
     * @param       object options Object of handler options
     */
    var DynamicUiHandler = function(options)
    {
        this._options = options;

        this._options.onRenderArgs = typeof options.onRenderArgs === 'undefined' ? [] : options.onRenderArgs;
        this._options.onErrorArgs  = typeof options.onErrorArgs === 'undefined'  ? [] : options.onErrorArgs;

        if (Helper.nodeExists(Helper.$(this._options.trigger)))
        {
            this._bind();
        }

        _this = this;

        return this;
    };

    /**
     * Destroy the handler and remove event listener
     *
     * @access public
     */
    DynamicUiHandler.prototype.destroy = function()
    {
        this._unbind();
    }

    /**
     * Bind the event listener
     *
     * @access private
     */
    DynamicUiHandler.prototype._bind = function()
    {
        var _this = this;

        this._callback = function _uiEventHandler(e)
        {
            _this._eventHandler();
        };

        Helper.addEventListener(Helper.$(this._options.trigger), this._options.event, this._callback);
    }

    /**
     * Unbind the event listener
     *
     * @access private
     */
    DynamicUiHandler.prototype._unbind = function()
    {
        Helper.removeEventListener(Helper.$(this._options.trigger), this._options.event, this._callback);
    }

    /**
     * Event handler
     *
     * @access private
     */
    DynamicUiHandler.prototype._eventHandler = function()
    {
        var trigger = Helper.$(this._options.trigger);
        var target  = Helper.$(this._options.target);
        var ajaxUrl = this._options.url;
        var form    = this._options.form || {};
        var trigger = this._options.trigger;
        var _this   = this;

        // Return on loading or disabled
        if (Helper.hasClass(trigger, 'active') || trigger.disabled === true)
        {
            return;
        }

        // Add active class
        Helper.addClass(trigger, 'active');
        Helper.addClass(target, 'active');

        // Request the Ajax
        Ajax.post(ajaxUrl, form, function(success)
        {
            var responseObj = Helper.isJSON(success);

            if (responseObj && responseObj.response === 'valid')
            {
                _this._render(responseObj);
                _this._fireRendered(responseObj);
                Hubble.require('Events').fire('domChange', target);
                Hubble.dom().refresh();
            }
            else
            {
                _this._fireErrored(success);
            }

            Helper.removeClass(trigger, 'active');
            Helper.removeClass(target, 'active');
        },
        function(error)
        {
            Helper.removeClass(trigger, 'active');
            Helper.removeClass(target, 'active');
            _this._fireErrored(error);
        });
    }

    /**
     * Render the DOM changes
     *
     * @access private
     * @param  object  response Response object from the server
     */
    DynamicUiHandler.prototype._render = function(response)
    {
        var details = response.details;
        var classes = this._options.classes;
        var target  = Helper.$(this._options.target);

        for (var i = 0; i < classes.length; i++)
        {
            var content = details[classes[i]['key']] || null;
            var node    = Helper.$(classes[i]['class'], target);

            if (!content || !Helper.nodeExists(node))
            {
                continue;
            }

            node.innerHTML = content;
        }
    }

    /**
     * Fire rendered event
     *
     * @access private
     */
    DynamicUiHandler.prototype._fireRendered = function(response)
    {        
        if (typeof this._options.onRender !== 'undefined')
        {
            var callback = this._options.onRender;
            var args     = this._options.onRenderArgs;
            args.unshift(response);

            callback.apply(this._options.target, args);
        }
    }

    /**
     * Fire errored event
     *
     * @access private
     */
    DynamicUiHandler.prototype._fireErrored = function(error)
    {
        if (typeof this._options.onError !== 'undefined')
        {
            var callback = this._options.onError;
            var args     = this._options.onErrorArgs;
            args.unshift(error);

            callback.apply(this._options.target, args);
        }
    }

    // Load into container
    Container.set('_DynamicUiHandler', DynamicUiHandler);

})();
/**
 * Component Dynamic Hanlder 
 *
 * @author    Joe J. Howard
 * @copyright Joe J. Howard
 * @license   https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE
 */
(function()
{
    /**
     * JS Helper reference
     * 
     * @var object
     */
    var Helper = Hubble.helper();

    /**
     * AJAX Module
     * 
     * @var obj
     */
    var Ajax = Hubble.require('Ajax');

    /**
     * Module constructor
     *
     * @access      public
     * @constructor
     * @param       object options Object of handler options
     */
    var DynamicUiHandler = function(options)
    {
        this._options = options;

        this._options.onRenderArgs = typeof options.onRenderArgs === 'undefined' ? [] : options.onRenderArgs;
        this._options.onErrorArgs  = typeof options.onErrorArgs === 'undefined'  ? [] : options.onErrorArgs;

        if (Helper.nodeExists(Helper.$(this._options.trigger)))
        {
            this._bind();
        }

        _this = this;

        return this;
    };

    /**
     * Destroy the handler and remove event listener
     *
     * @access public
     */
    DynamicUiHandler.prototype.destroy = function()
    {
        this._unbind();
    }

    /**
     * Bind the event listener
     *
     * @access private
     */
    DynamicUiHandler.prototype._bind = function()
    {
        var _this = this;

        this._callback = function _uiEventHandler(e)
        {
            _this._eventHandler();
        };

        Helper.addEventListener(Helper.$(this._options.trigger), this._options.event, this._callback);
    }

    /**
     * Unbind the event listener
     *
     * @access private
     */
    DynamicUiHandler.prototype._unbind = function()
    {
        Helper.removeEventListener(Helper.$(this._options.trigger), this._options.event, this._callback);
    }

    /**
     * Event handler
     *
     * @access private
     */
    DynamicUiHandler.prototype._eventHandler = function()
    {
        var trigger = Helper.$(this._options.trigger);
        var target  = Helper.$(this._options.target);
        var ajaxUrl = this._options.url;
        var form    = this._options.form || {};
        var trigger = this._options.trigger;
        var _this   = this;

        // Return on loading or disabled
        if (Helper.hasClass(trigger, 'active') || trigger.disabled === true)
        {
            return;
        }

        // Add active class
        Helper.addClass(trigger, 'active');
        Helper.addClass(target, 'active');

        // Request the Ajax
        Ajax.post(ajaxUrl, form, function(success)
        {
            var responseObj = Helper.isJSON(success);

            if (responseObj && responseObj.response === 'valid')
            {
                _this._render(responseObj);
                _this._fireRendered(responseObj);
                Hubble.require('Events').fire('domChange', target);
                Hubble.dom().refresh();
            }
            else
            {
                _this._fireErrored(success);
            }

            Helper.removeClass(trigger, 'active');
            Helper.removeClass(target, 'active');
        },
        function(error)
        {
            Helper.removeClass(trigger, 'active');
            Helper.removeClass(target, 'active');
            _this._fireErrored(error);
        });
    }

    /**
     * Render the DOM changes
     *
     * @access private
     * @param  object  response Response object from the server
     */
    DynamicUiHandler.prototype._render = function(response)
    {
        var details = response.details;
        var classes = this._options.classes;
        var target  = Helper.$(this._options.target);

        for (var i = 0; i < classes.length; i++)
        {
            var content = details[classes[i]['key']] || null;
            var node    = Helper.$(classes[i]['class'], target);

            if (!content || !Helper.nodeExists(node))
            {
                continue;
            }

            node.innerHTML = content;
        }
    }

    /**
     * Fire rendered event
     *
     * @access private
     */
    DynamicUiHandler.prototype._fireRendered = function(response)
    {        
        if (typeof this._options.onRender !== 'undefined')
        {
            var callback = this._options.onRender;
            var args     = this._options.onRenderArgs;
            args.unshift(response);

            callback.apply(this._options.target, args);
        }
    }

    /**
     * Fire errored event
     *
     * @access private
     */
    DynamicUiHandler.prototype._fireErrored = function(error)
    {
        if (typeof this._options.onError !== 'undefined')
        {
            var callback = this._options.onError;
            var args     = this._options.onErrorArgs;
            args.unshift(error);

            callback.apply(this._options.target, args);
        }
    }

    // Load into container
    Container.set('_DynamicUiHandler', DynamicUiHandler);

})();

// DOM Module
/**
 * Pjax module
 *
 * @author    Joe J. Howard
 * @copyright Joe J. Howard
 * @license   https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE
 */

(function()
{
    /**
     * JS Helper
     * 
     * @var obj
     */
    var Helper = Hubble.helper();

    /**
     * AJAX Module
     * 
     * @var obj
     */
    var Ajax = Hubble.require('Ajax');

    /**
     * AJAX URL to list paginated reviews
     * 
     * @var string
     */
    var _urlBase = window.location.origin;

    /**
     * Has pjax been invoked
     * 
     * @var bool
     */
    var _invoked = false;

    /**
     * Array of page caches
     * 
     * @var array
     */
    var _cache = [];

    /**
     * Array of requested urls
     * 
     * @var array
     */
    var _requestedUrls = [];

    /**
     * Are we listening for state changes ?
     * 
     * @var bool
     */
    var _listening = false;

    /**
     * Are we currently loading a pjax request ?
     * 
     * @var bool
     */
    var _loading = false;

    /**
     * Very simple chain library
     * 
     * @var obj
     * @source https://github.com/krasimir/chain
     */
    var Chain=function(){var n={},t=null,r=this,e={},o=[],i=[],u=function(f,t){return n[f]||(n[f]=[]),n[f].push(t),e},p=function(t,r){if(n[t])for(var o=0;f=n[t][o];o++)f(r,e)},l=function(){if(arguments.length>0){o=[];for(var n=0;r=arguments[n];n++)o.push(r);var f=o.shift();if("function"==typeof f)f(t,e);else if("object"==typeof f&&f.length>0){var r=f.shift();r.apply(r,f.concat([e.next]))}}else p("done",t);return e},a=function(){return arguments.length>0&&(2===arguments.length&&"string"==typeof arguments[0]&&"function"==typeof arguments[1]?u.apply(self,arguments):l.apply(self,arguments)),a};return e={on:u,off:function(t,r){if(n[t]){for(var o=[],i=0;f=n[t][i];i++)f!==r&&o.push(f);n[t]=o}return e},next:function(n){t=n,l.apply(r,o)},error:function(n){return void 0!==n?(i.push(n),e):i}},a};

    /**
     * DOM parser pollyfill (legacy support)
     * 
     * @var obj
     * @source https://gist.github.com/1129031
     */
    (function(DOMParser){var DOMParser_proto=DOMParser.prototype,real_parseFromString=DOMParser_proto.parseFromString;try{if((new DOMParser).parseFromString("","text/html")){return;}}catch(ex){}DOMParser_proto.parseFromString=function(markup,type){if(/^\s*text\/html\s*(?:;|$)/i.test(type)){var doc=document.implementation.createHTMLDocument(""),doc_elt=doc.documentElement,first_elt;doc_elt.innerHTML=markup;first_elt=doc_elt.firstElementChild;if(doc_elt.childElementCount===1&&first_elt.localName.toLowerCase()==="html"){doc.replaceChild(first_elt,doc_elt);}return doc;}else{return real_parseFromString.apply(this,arguments);}};}(DOMParser));

    /**
     * Module constructor
     *
     * @constructor
     * @access public
     */
    var Pjax = function()
    {
        if (!_invoked)
        {
            this._bind();
        }

        return this;
    };

    /**
     * Module destructor - unbinds events
     *
     * @access public
     */
    Pjax.prototype.destruct = function()
    {
        // Keep the CAHCE so that state changes are retained
        _invoked   = false;
        _listening = false;
        
        window.removeEventListener('popstate', this._stateChange, false);
        
        Hubble.require('Events').off('pjax:start', this._onStart);
        Hubble.require('Events').off('pjax:complete', this._onComplete);
    }

    /**
     * Bind events
     *
     * @access public
     */
    Pjax.prototype._bind = function()
    {
        _invoked = true;

        this._cachePage();

        _requestedUrls.push(this._normaliseUrl(window.location.href));

        Hubble.require('Events').on('pjax:start', this._onStart);
        Hubble.require('Events').on('pjax:complete', this._onComplete);
    }

    /**
     * Check if the module has loaded a url
     *
     * @access public
     * @param  string url URL to check
     * @return bool
     */
    Pjax.prototype.requestedUrl = function(url)
    {
        return Helper.in_array(this._normaliseUrl(url), _requestedUrls);
    }

    /**
     * Remove a requested url
     *
     * @access public
     * @param  string url URL to check
     */
    Pjax.prototype.removeUrl = function(url)
    {
        if (this.requestedUrl(url))
        {
            url = this._normaliseUrl(url);
            var i = _requestedUrls.length;
            while (i--)
            {
                if (_requestedUrls[i] === url)
                {
                    _requestedUrls.splice(i, 1);
                }
            }
        }
    }

    /**
     * Set a state based on a url
     *
     * @access public
     * @param  string url URL to check
     */
    Pjax.prototype.setState = function(url)
    {
        url = this._normaliseUrl(url)
        
        if (this.requestedUrl(url))
        {
            var _content  = this._cacheGet(url + '____content');
            var _location = this._cacheGet(url + '____location');
            
            if (!_content || !_location)
            {
                window.location.href = url;
            }

            // Load entire body from cache
            this._restoreState(_location, _content);
        }
    }

    /**
     * On pjax start event
     *
     * @access private
     */
    Pjax.prototype._onStart = function()
    {
        Hubble.require('NProgress').start();
    }

    /**
     * On pjax complete event
     *
     * @access private
     */
    Pjax.prototype._onComplete = function()
    {
        Hubble.require('NProgress').done();
        Hubble.dom().refresh();
    }

    /**
     * Start a pjax request
     *
     * @access public
     * @param  string url           The url to send the request to
     * @param  string target        The id to put the response into
     * @param  string title         The new page title (optional)
     * @param  bool   stateChange   Change the window history state (optional default false) 
     * @param  bool   singleRequest Is this a single request ? (optional default false
     */
    Pjax.prototype.invoke = function(url, target, title, stateChange, singleRequest)
    {
        // Save the document's current state
        this._cachePage();

        // If we are already loading a pjax request don't proceed
        if (_loading)
        {
            return;
        }

        // We are now loading
        _loading = true;

        // Fallback title
        title = (typeof title === 'undefined' ? false : title);

        // State change defaults to false
        stateChange = (typeof stateChange === 'undefined' ? false : stateChange);

        // State change defaults to false
        singleRequest = (typeof singleRequest === 'undefined' ? false : singleRequest);

        // Normalize the url
        url = this._normaliseUrl(url.trim());

        // Are we changing the window state 
        if (stateChange)
        {
            // Push the current state
            window.history.pushState(
                { id: window.location.href },
                document.title, 
                window.location.href
            );
        }

        // Create a new location object
        var newLocation =
        {
            location : url,
            target   : target,
            title    : title,
            scroll   : { left : 0, top : 0 },
        };

        // Do we need to request fresh ?
        if (singleRequest === true && Helper.in_array(url, _requestedUrls))
        {
            if (stateChange === true)
            {
                if (title)
                {
                    document.title = title;
                }

                window.history.pushState(
                    { id: url }, 
                    title, 
                    url
                );
            }
            _loading = false;
            
            return;
        }

        // pjax GET the new content
        this._load(newLocation, stateChange, singleRequest);
    }

    /**
     * Send and handle the pjax request
     *
     * @access private
     * @param  object locationObj Location object from the cache
     * @param  bool   stateChange Change the window history state
     * @param  bool   singleRequest Is this a single request (first time only) ?
     */
    Pjax.prototype._load = function(locationObj, stateChange, singleRequest)
    {
        // Store this
        var _this = this;

        // We have now requested this url  
        _requestedUrls.push(locationObj['location']);

        // Fire the start event
        Hubble.require('Events').fire('pjax:start', locationObj);

        // Send GET request
        Ajax.get(locationObj['location'], null, function(HTML)
        {
            // Fire the success event
            Hubble.require('Events').fire('pjax:success', locationObj);

            // Handle the response
            _this._handleSuccess(locationObj, HTML, stateChange);

        },
        // Handle the error
        function(error)
        {
            // Fire the error event
            Hubble.require('Events').fire('pjax:error', locationObj);

            // Handle the error
            _this._handleError(locationObj, error);

        }, [{'X-PJAX' : true}]);
    }

    /**
     * Handle Pjax Error
     *
     * @access private
     * @param  object locationObj Location object from the cache
     */
    Pjax.prototype._handleError = function(locationObj)
    {
        // Fire the complete
        Hubble.require('Events').fire('pjax:complete', locationObj);

        _loading = false;

        // Load the page normally
        window.location.href = locationObj.location;
    }

    /**
     * Pjax success handler
     *
     * @access private
     * @param  object locationObj Location object from the cache
     * @param  string HTML        HTML string response from server
     * @param  bool   stateChange Change the window history state
     */
    Pjax.prototype._handleSuccess = function(locationObj, HTML, stateChange)
    {
        // Parse the HTML
        var domCotent = this._parseHTML(HTML);

        // Try to get the title
        var _title = this._findDomTitle(domCotent);
        
        if (_title)
        {
            locationObj['title'] = _title;
        }
        else
        {
            if (!locationObj['title'])
            {
                locationObj['title'] = document.title;
            }
        }

        // Set the title
        document.title = locationObj['title'];
    
        // Find the target element in the new HTML and the current DOM
        // If the target is set to 'document-body' get the body
        // Otherwise get by id
        if (locationObj['target'] === 'document-body')
        {
            var targetEl  = document.body;
            var domTarget = domCotent.body;
        }
        else
        {
            var targetEl  = document.getElementById(locationObj['target']);
            var domTarget = domCotent.getElementById(locationObj['target']);
        }
        
        // Cache the current document scripts to compare
        var currScripts = this._filterScripts(Array.prototype.slice.call(document.getElementsByTagName('script')));
        var newScripts  = this._filterScripts(Array.prototype.slice.call(domCotent.getElementsByTagName('script')));
        
        // Replace the target el's innerHTML
        if (typeof domTarget === 'undefined' || domTarget === null)
        {
            targetEl.innerHTML = HTML;
        }
        // Or the entire element itself
        else
        {
            HTML = domTarget.innerHTML;
            targetEl.innerHTML = HTML;
        }

        // If we don't need to change the state we can stop here
        if (!stateChange)
        {
            Hubble.require('Events').fire('pjax:complete', locationObj);
            
            _loading = false;
            
            return;
        }

        // Push the state change and append any new scripts
        // from the response
        var _this = this;
        Chain()
        (
            function(res, chain)
            {
                // Append scripts, wait for load/execution and call next chain
                _this._appendScripts(currScripts, newScripts, chain);
            },
            function(res, chain)
            {
                // Push the history state
                window.history.pushState(
                    { id: locationObj.location }, 
                    locationObj.title, 
                    locationObj.location
                );
                chain.next();
            },
            function(res, chain)
            {
                // If we are not listening for any state changes
                // Add the listener
                if (!_listening)
                {
                    _this._stateListener();
                }

                // Finished loading
                _loading = false;

                // Pjax complete event
                Hubble.require('Events').fire('pjax:complete', locationObj);

                // Wait for spinner to finish
                setTimeout(function()
                { 
                    _this._cachePage();

                }, 500);                
            }
        );
    }

    /**
     * Add the state change listener to use internal page cache
     * to prevent back/forward events if that state is cached here
     *
     * @access private
     */
    Pjax.prototype._stateListener = function()
    {
        window.addEventListener('popstate', this._onStateChange);
        
        _listening = true;
    }

    /**
     * State change event handler (back/forward clicks)
     *
     * @access private
     * @param  e       event JavaScript 'popstate' event
     */
    Pjax.prototype._onStateChange = function(e)
    {
        e = e || window.event;
        
        var _this = Hubble.require('Pjax');

        // If this is a cached state
        if (e.state && typeof e.state.id !== 'undefined')
        {
            var _content  = _this._cacheGet(e.state.id + '____content');
            var _location = _this._cacheGet(e.state.id + '____location');
            
            // If the history state was 'broken' 
            // ie page1 -> pjax -> page2 -> leave -> page3 back <- page2 back <- page1
            // then the location object won't be available - refresh normally
            if (!_content || !_location)
            {
                e.preventDefault();
                window.location.href = window.location.href;
                return;
            }
            
            // Prevent default
            e.preventDefault();

            // Load entire body from cache
            _this._restoreState(_location, _content);
        }
        else
        {
            history.back();
        }
    }

    /**
     * Restore a previous state
     *
     * @access private
     * @param  object locationObj Location object from the cache
     * @param  string HTML        document.body.innerHTML
     */
    Pjax.prototype._restoreState = function(locationObj, HTML)
    {       
        // Parse the HTML
        var domCotent = this._parseHTML(HTML);

        // Try to get the title
        var _title = this._findDomTitle(domCotent);
        
        if (_title)
        {
            locationObj['title'] = _title;
        }
        else
        {
            if (!locationObj['title'])
            {
                locationObj['title'] = document.title;
            }
        }

        // Set the title
        document.title = locationObj['title'];
    
        document.body.innerHTML = HTML;
        
        // Cache the current document scripts to compare
        var currScripts = this._filterScripts(Array.prototype.slice.call(document.getElementsByTagName('script')));
        var newScripts  = this._filterScripts(Array.prototype.slice.call(domCotent.getElementsByTagName('script')));

        // Push the state change and append any new scripts
        // from the response
        var _this = this;
        Chain()
        (
            function(res, chain)
            {
                // Append scripts, wait for load/execution and call next chain
                _this._appendScripts(currScripts, newScripts, chain);
            },
            function(res, chain)
            {
                _loading = false;
                Hubble.require('Events').fire('pjax:complete', locationObj);
            }
        );
    }

    /**
     * If there are any new scripts load them
     * 
     * Note that appending or replacing content via 'innerHTML'
     * will not load any inline scripts so we need to compare what scripts have loaded
     * on the current page with any scripts that are in the new DOM tree 
     * and load any that don't already exist
     *
     * @access private
     * @param  array   currScripts Currently loaded scripts array
     * @param  object  newScripts  Newly loaded scripts
     */
    Pjax.prototype._appendScripts = function(currScripts, newScripts, chain)
    {
        var listeningForChain = false;

        for (var i = 0; i < newScripts.length; i++)
        {
            // Script is not in the current DOM tree
            if (!this._hasScript(newScripts[i], currScripts))
            {
                // Create a new script
                var script = document.createElement('script');
                script.type  = 'text/javascript';
                script.async = false;

                // Is this an inline script or a src ?
                if (newScripts[i]['src'] === true)
                {
                    // Listen for the script to load to chain next
                    if (!this._havMoreScriptSources(i, newScripts))
                    {
                        script.addEventListener('load', function()
                        {
                            chain.next();
                        });
                        listeningForChain = true;
                    }

                    script.src = newScripts[i]['content'];
                }
                else
                {
                    script.innerHTML = newScripts[i]['content'];

                    // If there are either no more scripts to load
                    // Or no more src scripts to load:
                    // and we haven't added a listener to call the next chain
                    // Add a function so once this script executes the next chain will be called
                    if (!listeningForChain && !this._havMoreScriptSources(i, newScripts))
                    {
                        listeningForChain = true;
                        window.nextChain = function()
                        {
                            chain.next();
                            delete window.nextChain;
                        };

                        script.innerHTML += ';(function(){ nextChain(); })();';
                    }
                }

                // Append the new script
                document.body.appendChild(script);
            }
        }

        // If no listeners call next
        if (!listeningForChain)
        {
            chain.next();
        }
    }

    /**
     * Checks if the current iteration is the last script with a src attribute to load
     *
     * @access private
     * @param  int     i       Current loop iteration
     * @param  array   scripts Array of script objects
     * @return bool
     */
    Pjax.prototype._havMoreScriptSources = function(i, scripts)
    {
        // Are we at the last iteration ?
        if (i < scripts.length - 1)
        {
            return false;
        }

        for (var k = 0; k < scripts.length; k++)
        {
            if (k > i && scripts[k]['src'] === true)
            {
                return true;
            }
        }

        return false;
    }

    /**
     * Filter scripts with unique key/values into an array
     *
     * @access private
     * @param  string html HTML as a string (with or without full doctype)
     * @return array
     */
    Pjax.prototype._filterScripts = function(nodes)
    {
        var result = [];
        
        for (var i = 0; i < nodes.length; i++)
        {
            var src = nodes[i].getAttribute('src');

            if (src)
            {
                // Remove the query string
                src = src.split('?')[0];
                
                result.push( { 'src': true, 'inline' : false, 'content' : src} );
            }
            else
            {   
                // Don't append JSON inline scripts
                if (Helper.isJSON(nodes[i].innerHTML.trim()))
                {
                    continue;
                }

                result.push({ 'src': false, 'inline' : true, 'content' : nodes[i].innerHTML.trim()});
            }
        }

        return result;
    }

    /**
     * Check if a script with a source or an inline script is in the current scripts
     *
     * @access private
     * @param  object   script
     * @param  array    currScripts
     * @return bool
     */
    Pjax.prototype._hasScript = function(script, currScripts)
    {
        for (var i = 0; i < currScripts.length; i++)
        {
            if (script['content'] === currScripts[i]['content'])
            {
                return true;
            }
        }

        return false;
    }

    /**
     * Try to find the page title in a DOM tree
     *
     * @access private
     * @param  string html HTML as a string (with or without full doctype)
     * @return string|false
     */
    Pjax.prototype._findDomTitle = function(DOM)
    {
        var title  = DOM.getElementsByTagName('title');
        
        if (title.length)
        {
            return title[0].innerHTML.trim();
        }

        return false;
    }

    /**
     * Parse HTML from string into a document
     *
     * @access private
     * @param  string html HTML as a string (with or without full doctype)
     * @return DOM tree
     */
    Pjax.prototype._parseHTML = function(html)
    {
        var parser = new DOMParser();
        return parser.parseFromString(html, 'text/html');
    }

    /**
     * Get the current document scroll position
     *
     * @access private
     * @return obj
     */
    Pjax.prototype._getScrollPos = function()
    {
        var doc  = document.documentElement;
        var top  = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
        var left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
        return {
            top  : top,
            left : left
        };
    }

    /**
     * Save a key/value to the cache
     *
     * @access private
     * @param  string key   The key to save the value under
     * @param  mixed  value The value to save
     */
    Pjax.prototype._cachePut = function(key, value)
    {
        for (var i = 0; i < _cache.length; i++)
        {
            if (_cache[i]['key'] === key)
            {
                _cache[i]['value'] = value;
                return;
            }
        }
        
        _cache.push({key: key, value: value});
    }

    /**
     * Get a value from the cache by key
     *
     * @access private
     * @param  string key   The key to save the value under
     * @return mixed|false
     */
    Pjax.prototype._cacheGet = function(key)
    {
        for (var i = 0; i < _cache.length; i++)
        {
            if (_cache[i]['key'] === key)
            {
                return _cache[i]['value'];
            }
        }

        return false;
    }

    /**
     * Cache the current page DOM
     *
     * @access private
     */
    Pjax.prototype._cachePage = function()
    {
        var content = document.body.innerHTML;

        var _location =
        {
            location : window.location.href,
            target   : 'document-body',
            title    : document.title,
            scroll   : this._getScrollPos(),
        };
        this._cachePut(window.location.href+'____location', _location);
        this._cachePut(window.location.href+'____content', content);
    }

     /**
     * Cache the current page DOM
     *
     * @access private
     * @param  string  url The url to normalise
     */
    Pjax.prototype._normaliseUrl = function(url)
    {
        // If the url was set as local
        
        // e.g www.foobar.com/foobar
        // foobar.com/foobar
        if (url.indexOf('http') < 0)
        {
            // Get the path
            var path = url.indexOf('/') >= 0 ? url.substr(url.indexOf('/') + 1) : url;  

            // e.g www.foobar.com/foobar
            if (url[0] === 'w')
            {
                var host = url.split('.com');

                url = window.location.protocol + '//' + host[0] + '.com/' + path;
            }
            else
            {
                // foobar.com/foobar
                if (url.indexOf('.com') !== -1)
                {
                    var host = url.split('.com');
                    url = window.location.protocol + '//www.' + host[0] + '.com/' + path;
                }
                // /foobar/bar/
                else
                {
                    url = window.location.origin + '/' + path;
                }
                
            }
        }

        return url;
    }

    // Load into Hubble DOM core
    Container.get('Hubble').dom().register('Pjax', Pjax);
   
})();
/**
 * Pjax Links Module
 *
 * @author    Joe J. Howard
 * @copyright Joe J. Howard
 * @license   https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE
 */

(function()
{
    /**
     * JS Helper reference
     * 
     * @var object
     */
    var Helper = Hubble.helper();

    /**
     * Bool val 
     * 
     * @var function
     */
    function boolval(l){return!1!==l&&("false"!==l&&(0!==l&&0!==l&&(""!==l&&"0"!==l&&((!Array.isArray(l)||0!==l.length)&&(null!==l&&void 0!==l)))))}

    /**
     * Module constructor
     *
     * @access public
     * @constructor
     */
    var PjaxLinks = function()
    {
        this._nodes = Helper.$All('.js-pjax-link');

        if (!Helper.empty(this._nodes))
        {
        	this._bind();
        }
        
        return this;
    }

    /**
     * Module destructor
     *
     * @access public
     */
    PjaxLinks.prototype.destruct = function()
    {
        this._unbind();
    }

    /**
     * Event binder - Binds all events on node click
     *
     * @access private
     */
    PjaxLinks.prototype._bind = function()
    {
        for (var i = 0; i < this._nodes.length; i++)
        {
            Helper.addEventListener(this._nodes[i], 'click', this._eventHandler, false);
        }
    }

    /**
     * Event unbinder - Removes all events on node click
     *
     * @access private
     */
    PjaxLinks.prototype._unbind = function()
    {
        for (var i = 0; i < this._nodes.length; i++)
        {
            Helper.removeEventListener(this._nodes[i], 'click', this._eventHandler, false);
        }
    }

    /**
     * Handle the click event
     *
     * @param event|null e JavaScript click event
     * @access private
     */
    PjaxLinks.prototype._eventHandler = function(e)
    {
        e = e || window.event;

        e.preventDefault();

        var trigger     = this;
		var href        = trigger.dataset.pjaxHref;
		var target      = trigger.dataset.pjaxTarget;
		var title       = trigger.dataset.pjaxTitle || false;
		var stateChange = boolval(trigger.dataset.pjaxStateChange);
        var singleRequest = boolval(trigger.dataset.pjaxSingleRequest);

		Hubble.require('Pjax').invoke(href, target, title, stateChange, singleRequest);
    }

    // Load into Hubble DOM core
    Container.get('Hubble').dom().register('PjaxLinks', PjaxLinks);

}());

/**
 * Scrollbars
 *
 * This is a utility class used internally to add custom vertical scrollbars to an element.
 * This class handles the events of the scrollbars.
 * This should not be used at all outside of the framework.
 * @see https://github.com/noraesae/perfect-scrollbar
 */
(function() {

    var defaults = {
        elements: {
            area: '.scrollbar-area',
            wrapper: '.scrollbar-wrapper',
            track: '.scrollbar-track',
            handle: '.scrollbar-handle'
        },
        stateClasses: {
            dragging: 'scrollbar-dragging',
            hover: 'scrollbar-hover'
        }
    };

    // SCROLLBAR HANDLER
    /*****************************************/
    function Scrollbar(element, opts) {

        // handle constructor call without `new` keyword
        if (!(this instanceof Scrollbar))  return new Scrollbar(element, opts);

        // is plugin already initialized?
        if (this.el) {
            return;
        }

        this.el = element;
        this.opts = extend({}, defaults, opts || {});

        this._setupElements();

        // check if browser has physical scrollbars (usually desktop)
        if (this.scrollbarWidth = getScrollbarWidth()) {
            this._enableTrack();

            this._observeHover(this.area);
            this._observeHover(this.track);
            this._enableScroll();
            this._enableDragging();

            this.refresh();
        } else {
            this._allowNativeScroll();
        }

        return this;
    }

    // PUBLIC API
    /*****************************************/
    /**
     * Destroys plugin instance.
     */
    Scrollbar.prototype.destroy = function() {
        var stateClasses = this.opts.stateClasses;

        this._removeAllListeners();

        this.wrapper.style.overflowY = '';
        this.wrapper.style.marginRight = '';
        this.track.style.display = '';

        removeClass(document.body, stateClasses.dragging);
        removeClass(this.area, stateClasses.dragging);
        removeClass(this.area, stateClasses.hover);
        removeClass(this.track, stateClasses.hover);

        delete this.el;
    }

    /**
     * Refreshes scrollbar by adjusting its handle's height and position.
     */
    Scrollbar.prototype.refresh = function() {
        var newRatio;

        if (!this.el || this.isNative()) {
            return;
        }
        
        if (this.wrapper.scrollHeight > this.wrapper.offsetHeight) {
            this.track.style.display = 'block';

            newRatio = this.track.offsetHeight / this.wrapper.scrollHeight;

            if (newRatio !== this.ratio) {
                this.ratio = newRatio;

                this._resizeHandle();
                this._positionHandle();
            }
        } else {
            this.track.style.display = 'none';
        }
    }

    /**
     * Checks if native scroll is enabled.
     *
     * @returns {Boolean}
     */
    Scrollbar.prototype.isNative = function() {
        return !this.scrollbarWidth;
    }

    // PRIVATE API
    /*****************************************/
    /**
     * Sets up elements.
     *
     * @private
     */
    Scrollbar.prototype._setupElements = function() {
        var elements = this.opts.elements;

        this.area = this.el.querySelector(elements.area);
        this.wrapper = this.el.querySelector(elements.wrapper);
        this.handle = this.el.querySelector(elements.handle);
        this.track = this.el.querySelector(elements.track);
    }

    /**
     * Observes when element is hovered and toggles corresponding class.
     *
     * @param {HTMLElement} element
     * @private
     */
    Scrollbar.prototype._observeHover = function(element) {
        var cls = this.opts.stateClasses.hover;

        this._addListener(element, 'mouseenter', function() {
            addClass(element, cls);
        });
        this._addListener(element, 'mouseleave', function() {
            removeClass(element, cls);
        });
    },

    /**
     * Enables scroll by overflowing native scrollbar and starting to listen to `scroll` event.
     *
     * @private
     */
    Scrollbar.prototype._enableScroll = function() {
        this._addListener(this.wrapper, 'scroll', bind(this._positionHandle, this));
    }

    /**
     * Enables handle's dragging along the track.
     *
     * @private
     */
    Scrollbar.prototype._enableDragging = function() {
        var cls = this.opts.stateClasses.dragging,
            initialPosition = null,
            initialTop = null,
            startDragging,
            stopDragging;

        this._addListener(this.handle, 'mousedown', bind(function(e) {
            initialPosition = this.wrapper.scrollTop;
            initialTop = e.clientY;

            this._addListener(document, 'mousemove', startDragging);
            this._addListener(document, 'mouseup', stopDragging);
        }, this));

        startDragging = bind(function(e) {
            var newPosition,
                wrapperHeight,
                wrapperInnerHeight;

            if (initialTop !== null) {
                newPosition = Math.round(initialPosition + (e.clientY - initialTop) / this.ratio);

                wrapperHeight = this.wrapper.offsetHeight;
                wrapperInnerHeight = this.wrapper.scrollHeight;

                if (newPosition + wrapperHeight > wrapperInnerHeight) {
                    newPosition = wrapperInnerHeight - wrapperHeight;
                }

                this.wrapper.scrollTop = newPosition;
                this._positionHandle();

                addClass(document.body, cls);
                addClass(this.area, cls);
            }
        }, this);

        stopDragging = bind(function() {
            initialTop = null;
            initialPosition = null;

            removeClass(document.body, cls);
            removeClass(this.area, cls);

            this._removeListener(document, 'mousemove', startDragging);
            this._removeListener(document, 'mouseup', stopDragging);
        }, this);
    }

    /**
     * Enables track.
     *
     * @private
     */
    Scrollbar.prototype._enableTrack = function() {
        this.wrapper.style.overflowY = 'scroll';
        this.wrapper.style.marginRight = -1 * this.scrollbarWidth + 'px';
    }

    /**
     * Allows native scrolling by making sure that div is scrollable.
     *
     * @private
     */
    Scrollbar.prototype._allowNativeScroll = function() {
        this.wrapper.style.overflowY = 'auto';
    }

    /**
     * Resizes handle by adjusting its `height`.
     *
     * @private
     */
    Scrollbar.prototype._resizeHandle = function() {
        this.handle.style.height = Math.ceil(this.ratio * this.track.offsetHeight) + 'px';
    }

    /**
     * Positions handle by adjusting its `top` position.
     *
     * @private
     */
    Scrollbar.prototype._positionHandle = function() {
        var wrapperTop = this.wrapper.scrollTop,
            top;

        if (wrapperTop + this.wrapper.offsetHeight < this.wrapper.scrollHeight) {
            top = Math.ceil(this.ratio * this.wrapper.scrollTop);
        } else {
            // if scroll position has reached the end, force scrollbar to track's end
            top = this.track.offsetHeight - this.handle.offsetHeight;
        }

        this.handle.style.top = top + 'px';
    }

    /**
     * Adds event listener and keeps track of it.
     *
     * @param {HTMLElement} element
     * @param {String}      eventName
     * @param {Function}    handler
     * @private
     */
    Scrollbar.prototype._addListener = function(element, eventName, handler) {
        var events = this._events;

        if (!events) {
            this._events = events = {};
        }
        if (!events[eventName]) {
            events[eventName] = [];
        }

        events[eventName].push({
            element: element,
            handler: handler
        });

        addEventListener.apply(null, arguments);
    }

    /**
     * Removes event listener.
     *
     * @param {HTMLElement} element
     * @param {String}      eventName
     * @param {Function}    handler
     * @private
     */
    Scrollbar.prototype._removeListener = function(element, eventName, handler) {
        var event = this._events[eventName],
            index,
            total;

        for (index = 0, total = event.length; index < total; index++) {
            if (event[index].handler === handler) {
                event.splice(index, 1);
                removeEventListener.apply(null, arguments);
                break;
            }
        }
    }

    /**
     * Removes all event listeners.
     *
     * @private
     */
    Scrollbar.prototype._removeAllListeners = function() {
        var events = this._events,
            eventName,
            event,
            iter,
            total;

        for (eventName in events) {
            event = events[eventName];

            for (iter = 0, total = event.length; iter < total; iter++) {
                removeEventListener(event[iter].element, eventName, event[iter].handler);
            }
        }

        delete this._events;
    }

    // HELPER FUNCTIONS
    /*****************************************/
    function bind(fn,context){return function(){fn.apply(context,arguments);};}function extend(){var iter;for(iter=1;iter<arguments.length;iter++){var key;for(key in arguments[iter]){if(arguments[iter].hasOwnProperty(key)){arguments[0][key]=arguments[iter][key];}}}return arguments[0];}function addEventListener(el,eventName,handler){if(el.addEventListener){el.addEventListener(eventName,handler);}else{el.attachEvent("on"+eventName,handler);}}function removeEventListener(el,eventName,handler){if(el.removeEventListener){el.removeEventListener(eventName,handler);}else{el.detachEvent("on"+eventName,handler);}}function addClass(el,className){if(el.classList){el.classList.add(className);}else{el.className+=" "+className;}}function removeClass(el,className){if(el.classList){el.classList.remove(className);}else{el.className=el.className.replace(new RegExp("(^|\\b)"+className.split(" ").join("|")+"(\\b|$)","gi")," ");}}function getScrollbarWidth(){var wrapper=document.createElement("div"),content=document.createElement("div"),width;wrapper.style.position="absolute";wrapper.style.top="-50px";wrapper.style.height="50px";wrapper.style.overflow="scroll";wrapper.appendChild(content);document.body.appendChild(wrapper);width=wrapper.offsetWidth-content.offsetWidth;document.body.removeChild(wrapper);return width;}

    Container.set('Scrollbar', Scrollbar);

})();
/**
 * Custom Scrollbars
 *
 * @author    Joe J. Howard
 * @copyright Joe J. Howard
 * @license   https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE
 */

(function()
{
    /**
     * Helper instance
     * 
     * @var object
     */
    var Helper = Hubble.helper();

    /**
     * Module constructor
     *
     * @constructor
     * @access public
     */
    var ScrollBars = function()
    {
        this._nodes    = [];
        this._handlers = [];

        // Find nodes
        this._nodes = Helper.$All('.js-custom-scroll');

        // Bind DOM listeners
        if (!Helper.empty(this._nodes))
        {
            for (var i = 0; i < this._nodes.length; i++)
            {
                this._invoke(this._nodes[i]);
            }
        }
        
        return this;
    };

    /**
     * Module destructor - removes handler
     *
     * @access public
     */
    ScrollBars.prototype.desctruct = function()
    {
        for (var i = 0; i < this._handlers.length; i++)
        {
            this._handlers[i].destroy();
        }

        this._nodes    = [];
        this._handlers = [];
    }

    /**
     * Create the necessary nodes for the scroller to work.
     * Also check if the element has overflow
     *
     * @params el node
     * @access private
     */
    ScrollBars.prototype._invoke = function(el)
    {
        if (Helper.hasClass(el, 'js-auto-scroll-invoked'))
        {
            var handler = Container.get('Scrollbar', el);
            this._handlers.push(handler);
            return;
        }

        var needsScroller = this._needsScroller(el);
        if (!needsScroller) return;

        var insertAfter  = false;
        var parent       = el.parentNode;
        var children     = Helper.firstChildren(el);
        if (el.nextSibling) insertAfter = el.nextSibling;

        var scrollArea   = document.createElement('DIV');
        var scrollWrap   = document.createElement('DIV');
        var scrollTrack  = document.createElement('DIV');
        var scrollHandle = document.createElement('DIV');

        scrollArea.className   = 'scrollbar-area';
        scrollWrap.className   = 'scrollbar-wrapper';
        scrollTrack.className  = 'scrollbar-track';
        scrollHandle.className = 'scrollbar-handle';

        scrollArea.appendChild(scrollWrap);
        for (var i = 0; i < children.length; i++)
        {
            scrollWrap.appendChild(children[i]);
        }
        scrollWrap.appendChild(scrollTrack);
        scrollTrack.appendChild(scrollHandle);
        el.appendChild(scrollArea);
        var handler = Container.get('Scrollbar', el);
        this._handlers.push(handler);
        Helper.addClass(el, 'js-auto-scroll-invoked');
    }

    /**
     * Check if an element needs to be scrolled or not.
     *
     * @params el node
     * @access private
     * @return boolean
     */
    ScrollBars.prototype._needsScroller = function(el)
    {
        var computedStyle = window.getComputedStyle(el);

        // Is the element hidden?
        var isHidden      = el.offsetParent === null;
        var hiddenEl      = false;
        var inlineDisplay = false;
        var needsScroller = false;

        if (isHidden)
        {
            if (computedStyle.display === 'none')
            {
                hiddenEl = el;
            }
            else {
                var parent = el;
                while (parent !== document.body)
                {
                    parent = parent.parentNode;
                    var parentStyle = window.getComputedStyle(parent);
                    if (parentStyle.display === 'none')
                    {
                        hiddenEl = parent
                        break;
                    }
                }
            }
        }

        // Make visible
        if (hiddenEl)
        {
            inlineDisplay = hiddenEl.style.display;
            hiddenEl.style.display = 'block';
        }
        var endHeight = el.scrollHeight - parseInt(computedStyle.paddingTop) - parseInt(computedStyle.paddingBottom) + parseInt(computedStyle.borderTop) + parseInt(computedStyle.borderBottom);
        endHeight     = parseInt(endHeight);
        if (endHeight > el.offsetHeight)
        {
            needsScroller   = true;
            el.style.height = el.offsetHeight+'px';
        }
        // Make invisible
        if (hiddenEl)
        {
            if (inlineDisplay)
            {
                hiddenEl.style.display = inlineDisplay;
            }
            else {
                hiddenEl.style.removeProperty('display');
            }   
        }
        return needsScroller;
    }

    /**
     * Refresh the scroll position
     *
     * This can be usefull if you have custom scrollbars
     * on an element but change it's height (e.g responsive or add/remove children)
     *
     * @params elem node
     * @access public
     * @example Container.get('ScrollBars').refresh(node) // Node = $.('.js-custom-scroll');
     */
    ScrollBars.prototype.refresh = function(elem)
    {
        for (var i = 0; i < this._handlers.length; i++)
        {
            var handler = this._handlers[i];
            
            if (handler.el === elem) handler.refresh();
        }
    }

    /**
     * Destroy a handler by dom node .js-custom-scroll
     *
     * @params elem node
     * @access public
     */
    ScrollBars.prototype.destroy = function(elem)
    {
        var i = this._handlers.length;

        while (i--)
        {
            var handler = this._handlers[i];
            if (handler.el === elem) handler.destroy();
            this._handlers.splice(i, 1);
        }
    }
    
    /**
     * Get a handler by dom node .js-custom-scroll
     *
     * @params elem node
     * @access public
     * @return mixed
     */
    ScrollBars.prototype.getHandler = function(elem)
    {
        for (var i = 0; i < this._handlers.length; i++)
        {
            var handler = this._handlers[i];
            
            if (handler.el === elem) return handler;
        }
    }

    // Load into Hubble DOM core
    Container.get('Hubble').dom().register('ScrollBars', ScrollBars);

})();
/**
 * Toggle height on click
 *
 * @author    Joe J. Howard
 * @copyright Joe J. Howard
 * @license   https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE
 */

(function()
{
    /**
     * JS Helper reference
     * 
     * @var object
     */
    var Helper = Hubble.helper();

    /**
     * Module constructor
     *
     * @access public
     * @constructor
     */
    var Collapse = function()
    {
        /**
         * Array of click-triggers
         * 
         * @var array
         */
        this._nodes = Helper.$All('.js-collapse');
                
        this._bind();
        
        return this;
    }

    /**
     * Module destructor
     *
     * @access public
     */
    Collapse.prototype.destruct = function()
    {
        this._unbind();

        this._nodes = [];
    }

    /**
     * Event binder - Binds all events on button click
     *
     * @access private
     */
    Collapse.prototype._bind = function()
    {
        for (var i = 0; i < this._nodes.length; i++)
        {
            Helper.addEventListener(this._nodes[i], 'click', this._eventHandler);
        }
    }

    /**
     * Event unbinder - Removes all events on button click
     *
     * @access private
     */
    Collapse.prototype._unbind = function()
    {
        for (var i = 0; i < this._nodes.length; i++)
        {
            Helper.removeEventListener(this._nodes[i], 'click', this._eventHandler);
        }
    }

    /**
     * Handle the click event
     *
     * @param event|null e JavaScript click event
     * @access private
     */
    Collapse.prototype._eventHandler = function(e)
    {
        e = e || window.event;

        if (Helper.isNodeType(this, 'a'))
        {
            e.preventDefault();
        }
        
        var clicked  = this;
        var targetEl = Helper.$('#'+clicked.dataset.collapseTarget);
        var speed    = parseInt(clicked.dataset.collapseSpeed) || 350;
        var easing   = clicked.dataset.collapseEasing || 'cubic-bezier(0.19, 1, 0.22, 1)';
        var opacity  = clicked.dataset.withOpacity;

        Container.get('ToggleHeight', targetEl, 0, speed, easing, opacity);
        
        Helper.toggleClass(clicked, 'active');
    }

    // Load into Hubble DOM core
    Container.get('Hubble').dom().register('Collapse', Collapse);

}());

/**
 * Dropdown Buttons
 *
 * @author    Joe J. Howard
 * @copyright Joe J. Howard
 * @license   https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE
 */

(function()
{
    /**
     * JS Helper reference
     * 
     * @var object
     */
    var Helper = Hubble.helper();

    /**
     * Module constructor
     *
     * @access public
     * @constructor
     */
    var DropDowns = function()
    {
        /**
         * Array of click-triggers
         * 
         * @var array
         */
        this._triggers = Helper.$All('.js-drop-trigger');

        if (!Helper.empty(this._triggers))
        { 
            this._bind();
        }

        return this;
    };

    /**
     * Module destructor
     *
     * @access public
     */
    DropDowns.prototype.destruct = function()
    {
        this._unbind();
        this._triggers = [];
    }

    /**
     * Bind click listener to containers
     *
     * @access private
     */
    DropDowns.prototype._bind = function()
    {
        for (var i = 0; i < this._triggers.length; i++)
        {
            Helper.addEventListener(this._triggers[i], 'click', this._clickHandler);
        }
        Helper.addEventListener(window, 'click', this._windowClick);
    }

    /**
     * Unbind listener to containers
     *
     * @access private
     */
    DropDowns.prototype._unbind = function()
    {
        for (var i = 0; i < this._triggers.length; i++)
        {
            Helper.removeEventListener(this._triggers[i], 'click', this._clickHandler);
        }
        Helper.removeEventListener(window, 'click', this._windowClick);
    }

    /**
     * Click event handler
     *
     * @param  event|null e JavaScript Click event
     * @access private
     */
    DropDowns.prototype._clickHandler = function(e)
    {
        e = e || window.event;
        e.preventDefault();

        var button   = this;
        var _this    = Container.get('DropDowns');

        // Hide all dropdowns except this
        _this._hideDropDowns(button);

        // Remove active and return
        if (Helper.hasClass(button, 'active'))
        {
            _this._hideDrop(button);
        }
        else
        {
            _this._showDrop(button);
        }
    }

    /**
     * Click event handler
     *
     * @param  event|null e JavaScript Click event
     * @access private
     */
    DropDowns.prototype._hideDrop = function(button)
    {
        var drop = Helper.$('.drop-menu', button.parentNode);
        Helper.removeClass(button, 'active');
        button.setAttribute('aria-pressed', 'false');
        Helper.hideAria(drop);
        drop.blur();
    }

    /**
     * Click event handler
     *
     * @param  event|null e JavaScript Click event
     * @access private
     */
    DropDowns.prototype._showDrop = function(button)
    {
        var drop = Helper.$('.drop-menu', button.parentNode);
        Helper.addClass(button, 'active');
        button.setAttribute('aria-pressed', 'true');
        Helper.showAria(drop);
        drop.focus();
    }

    /**
     * Window click event
     *
     * @param event|null e JavaScript click event
     * @access private
     */
    DropDowns.prototype._windowClick = function(e)
    {
        e = e || window.event;
        if (Helper.closestClass(e.target, 'js-drop-trigger'))
        {
            return;
        }
        if (!Helper.hasClass(e.target, 'js-drop-trigger'))
        {
            var _this = Container.get('DropDowns');
            
            _this._hideDropDowns();
        }
    }

    /**
     * Hide all dropdowns
     *
     * @param exception (optional) Button to skip
     * @access private
     */
    DropDowns.prototype._hideDropDowns = function(exception)
    {
        dropTriggers = Helper.$All('.js-drop-trigger');
        exception    = (typeof exception === 'undefined' ? false : exception);

        for (var i = 0; i < dropTriggers.length; i++)
        {
            var node = dropTriggers[i];

            if (node === exception)
            {
                continue;
            }

            this._hideDrop(node);
        }
    }

    // Load into Hubble DOM core
    Container.get('Hubble').dom().register('DropDowns', DropDowns);

})();
/**
 * Tab Nav
 *
 * @author    Joe J. Howard
 * @copyright Joe J. Howard
 * @license   https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE
 */

(function()
{
    /**
     * Helper instance
     * 
     * @var object
     */
    var Helper = Hubble.helper();

    /**
     * Module constructor
     *
     * @constructor
     * @access public
     */
    var TabNav = function()
    {
        // Find nodes
        this._nodes = Helper.$All('.js-tab-nav');

        // If nothing to do destruct straight away
        if (!Helper.empty(this._nodes))
        {
            for (var i = 0; i < this._nodes.length; i++)
            {
                this._bindDOMListeners(this._nodes[i]);
            }
        }

        return this;
    };

    /**
     * Module destructor - unbinds click events
     *
     * @access public
     */
    TabNav.prototype.destruct = function()
    {
        for (var i = 0; i < this._nodes.length; i++)
        {
            this._unbindDOMListeners(this._nodes[i]);
        }

        this._nodes = [];
    }

    /**
     * Bind click events on all <a> tags in a .js-tab-nav
     *
     * @params navWrap node
     * @access private
     */
    TabNav.prototype._bindDOMListeners = function(navWrap)
    {
        var links  = Helper.$All('a', navWrap);
        
        for (var i = 0; i < links.length; i++)
        {
            Helper.addEventListener(links[i], 'click', this._eventHandler);
        }
    }

    /**
     * Unbind click events on all <a> tags in a .js-tab-nav
     *
     * @params navWrap node
     * @access private
     */
    TabNav.prototype._unbindDOMListeners = function(navWrap)
    {
        var links    = Helper.$All('a', navWrap);
        
        for (var i = 0; i < links.length; i++)
        {
            Helper.removeEventListener(links[i], 'click', this._eventHandler);
        }
    }

    /**
     * Click event handler
     *
     * @param event|null e JavaScript click event
     * @access private
     */
    TabNav.prototype._eventHandler = function(e)
    {
        e = e || window.event;
        e.preventDefault();

        var _this = Container.get('TabNav');
        
        var node = this;

        if (Helper.hasClass(node, 'active')) return;
        
        var tab           = node.dataset.tab;
        var tabNav        = Helper.closest(node, 'ul');

        var tabPane       = Helper.$('[data-tab-panel="' + tab + '"]');
        var tabPanel      = Helper.closestClass(tabPane, 'js-tab-panels-wrap');
        var activePanel   = Helper.$('.tab-panel.active', tabPanel);

        var navWrap       = Helper.closestClass(node, 'js-tab-nav');
        var activeNav     = Helper.$('a.active', navWrap);

        Helper.removeClass(activeNav, 'active');
        Helper.removeClass(activePanel, 'active');

        Helper.addClass(node, 'active');
        Helper.addClass(tabPane, 'active');
        
    }

    // Load into Hubble DOM core
    Container.get('Hubble').dom().register('TabNav', TabNav);

})();
/**
 * Popover Handler
 *
 * @author    Joe J. Howard
 * @copyright Joe J. Howard
 * @license   https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE
 */

(function()
{
    /**
     * JS Helper reference
     * 
     * @var object
     */
    var Helper = Hubble.helper();
    
    /**
     * Module constructor
     *
     * @access public
     * @constructor
     */
    var _popHandler = function(options)
    {
        this.trigger      = options.target;
        this.options      = options;
        this.el           = this.buildPopEl();
        this.el.className = options.classes;
        this.animation    = false;

        if (options.animation === 'pop')
        {
            this.animation = 'popover-pop';
        }
        else if (options.animation === 'fade')
        {
            this.animation = 'popover-fade';
        }

        this.render = function()
        {
            document.body.appendChild(this.el);
            this.stylePop();
            this.el.classList.add(this.animation);
        }
        return this;
    }

    /**
     * Build the popover
     *
     * @access private
     */
    _popHandler.prototype.buildPopEl = function()
    {
        var pop       = document.createElement('div');
        pop.className = this.options.classes;

        if (typeof this.options.template === 'string')
        {
            pop.innerHTML = this.options.template;
        }
        else
        {
            pop.appendChild(this.options.template);
        }
        return pop;
    }

    /**
     * Remove the popover
     *
     * @access public
     */
    _popHandler.prototype.remove = function()
    {
        if (Helper.nodeExists(this.el)) this.el.parentNode.removeChild(this.el);
    }

    /**
     * Position the popover
     *
     * @access public
     */
    _popHandler.prototype.stylePop = function()
    {

        var targetCoords = Helper.getCoords(this.options.target);

        if (this.options.direction === 'top')
        {
            this.el.style.top  = targetCoords.top  - this.el.scrollHeight + 'px';
            this.el.style.left = targetCoords.left - (this.el.offsetWidth /2) + (this.options.target.offsetWidth/2) + 'px';
            return;
        }
        else if (this.options.direction === 'bottom')
        {
            this.el.style.top  = targetCoords.top  + this.options.target.offsetHeight + 10 + 'px';
            this.el.style.left = targetCoords.left - (this.el.offsetWidth /2) + (this.options.target.offsetWidth/2) + 'px';
            return;
        }
        else if (this.options.direction === 'left')
        {
            this.el.style.top  = targetCoords.top  - (this.el.offsetHeight/2) + (this.options.target.offsetHeight/2) + 'px';
            this.el.style.left = targetCoords.left - this.el.offsetWidth - 10 + 'px';
            return;
        }
        else if (this.options.direction === 'right')
        {
            this.el.style.top  = targetCoords.top  - (this.el.offsetHeight/2) + (this.options.target.offsetHeight/2) + 'px';
            this.el.style.left = targetCoords.left + this.options.target.offsetWidth + 10 + 'px';
            return;
        }
    }

    // Set into container for private use
    Container.set('_popHandler', _popHandler);

}());
/**
 * Popovers
 *
 * @author    Joe J. Howard
 * @copyright Joe J. Howard
 * @license   https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE
 */

(function()
{
    /**
     * JS Helper reference
     * 
     * @var object
     */
    var Helper = Hubble.helper();

    /**
     * Module constructor
     *
     * @access public
     * @constructor
     */
    var Popovers = function()
    {
        this._pops  = [];
        this._nodes = [];
        this._arrowClasses = {
            top    : 'arrow-s',
            left   : 'arrow-e',
            right  : 'arrow-w',
            bottom : 'arrow-n',
        };

        // Find nodes
        this._nodes = Helper.$All('.js-popover');

        // Bind events
        if (!Helper.empty(this._nodes))
        {
            for (var i = 0; i < this._nodes.length; i++)
            {
                this._bind(this._nodes[i]);
            }

            this._addWindowClickEvent();
        }

        return this;
    };

    /**
     * Module destructor
     *
     * @access public
     * @return this
     */
    Popovers.prototype.destruct = function()
    {
        if (!Helper.empty(this._nodes))
        {
            for (var i = 0; i < this._nodes.length; i++)
            {
                this._unbind(this._nodes[i]);
            }
        }

        this._removeAll();

        this._nodes = [];
        
        this._pops  = [];
    }

    /**
     * Unbind event listeners on a trigger
     *
     * @param trigger node
     * @access private
     */
    Popovers.prototype._unbind = function(trigger)
    {
        var evnt = trigger.dataset.popoverEvent;

        if (evnt === 'click')
        {
            Helper.removeEventListener(trigger, 'click', this._clickHandler);
            window.removeEventListener('resize', this._windowResize);
        }
        else
        {
            Helper.removeEventListener(trigger, 'mouseenter', this._hoverOver);
            Helper.removeEventListener(trigger, 'mouseleave', this._hoverLeavTimeout);
        }
    }

    /**
     * Initialize the handlers on a trigger
     *
     * @access private
     * @param  node trigger Click/hover trigger
     */
    Popovers.prototype._bind = function(trigger)
    {
        var direction      = trigger.dataset.popoverDirection;
        var title          = trigger.dataset.popoverTitle;
        var content        = trigger.dataset.popoverContent;
        var type           = trigger.dataset.popoverType || '';
        var evnt           = trigger.dataset.popoverEvent;
        var animation      = trigger.dataset.popoverAnimate || 'pop';
        var target         = trigger.dataset.popoverTarget;
        var closeBtn       = evnt === 'click' ? '<span class="glyph-icon glyph-icon-cross js-remove-pop"></span>' : ''; 
        var pop            = '<h3 class="popover-title">'+title+closeBtn+'</h3><div class="popover-content"><p>'+content+'</p></div>';

        if (target)
        {
            pop = Helper.$('#'+target).cloneNode(true);
            pop.classList.remove('hidden');
        }

        var popHandler = Container.get('_popHandler', {
            target    :  trigger,
            direction :  direction,
            template  :  pop,
            animation :  animation,
            classes   : 'popover '+ direction +' '+ type +' arrow ' + this._arrowClasses[direction],
        });

        this._pops.push(popHandler);

        if (evnt === 'click')
        {
            Helper.addEventListener(trigger, 'click', this._clickHandler);
            window.addEventListener('resize', this._windowResize);
        }
        else
        {
            var _this = this;
            Helper.addEventListener(trigger, 'mouseenter', this._hoverOver);
            Helper.addEventListener(trigger, 'mouseleave', this._hoverLeavTimeout);
        }
    }

    /**
     * Timeout handler for hoverleave
     *
     * @access private
     */
    Popovers.prototype._hoverLeavTimeout = function(e)
    {
        e = e || window.event;
        setTimeout(function()
        {
            Container.get('Popovers')._hoverLeave(e);
        }, 300);
    }

    /**
     * Hover over event handler
     *
     * @access private
     */
    Popovers.prototype._hoverOver = function()
    {
        var trigger    = this;
        var _this      = Container.get('Popovers');
        var popHandler = _this._getHandler(trigger);
        if (Helper.hasClass(trigger, 'popped')) return;
        popHandler.render();
        Helper.addClass(trigger, 'popped');
    }

    /**
     * Hover leave event handler
     *
     * @access private
     */
    Popovers.prototype._hoverLeave = function(e)
    {
        var _this = Container.get('Popovers');
        var hovers = Helper.$All(':hover');
        for (var i = 0; i < hovers.length; i++)
        {
            if (Helper.hasClass(hovers[i], 'popover'))
            {
                hovers[i].addEventListener('mouseleave', function(_e)
                {
                    _e = _e || window.event;
                    _this._hoverLeave(_e);
                });
                return;
            }
        }

        _this._removeAll();
    }

    /**
     * Window resize event handler
     *
     * @access private
     */
    Popovers.prototype._windowResize = function()
    {
        var _this = Container.get('Popovers');
        
        for (var i = 0; i < _this._nodes.length; i++)
        {
            if (Helper.hasClass(_this._nodes[i], 'popped'))
            {
                var popHandler = _this._getHandler(_this._nodes[i]);
                popHandler.stylePop();
            }
        }
    }

    /**
     * Click event handler
     *
     * @param event|null e JavaScript click event
     * @access private
     */
    Popovers.prototype._clickHandler = function(e)
    {
        e = e || window.event;
        e.preventDefault();
        var trigger    = this;
        var _this      = Container.get('Popovers');
        var popHandler = _this._getHandler(trigger);
       
        if (Helper.hasClass(trigger, 'popped'))
        {
            _this._removeAll();
            popHandler.remove();
            Helper.removeClass(trigger, 'popped');
        }
        else
        {
            _this._removeAll();
            popHandler.render();
            Helper.addClass(trigger, 'popped');
        }
    }

    /**
     * Remove all popovers when anything is clicked
     *
     * @access private
     */
    Popovers.prototype._addWindowClickEvent = function()
    {
        var _this = this;

        window.addEventListener('click', function (e)
        {
            e = e || window.event;
            var clicked = e.target;

            // Clicked inside the popver itself,
            // Clicked a popover trigger
            // Clicked a close trigger inside the popover
            if ( (Helper.hasClass(clicked, 'js-popover') || Helper.hasClass(clicked, 'popover') || Helper.closestClass(clicked, 'popover')) && !Helper.hasClass(clicked, 'js-remove-pop'))
            {
                return;
            }

            _this._removeAll();
        });
    }
    
    /**
     * Get the handler for the trigger
     * 
     * @access private
     * @param  node    trigger DOM node that triggered event
     * @return object|false
     */
    Popovers.prototype._getHandler = function(trigger)
    {
        for (var i = 0; i < this._pops.length; i++)
        {
           if (this._pops[i]['trigger'] === trigger) return this._pops[i];
        }

        return false;
    }

    /**
     * Remove all the popovers currently being displayed
     *
     * @access private
     */
    Popovers.prototype._removeAll = function()
    {
        for (var i = 0; i < this._pops.length; i++)
        {
            this._pops[i].remove();

            Helper.removeClass(this._pops[i].options.target, 'popped');
        }
    }

    // Load into Hubble DOM core
    Container.get('Hubble').dom().register('Popovers', Popovers);

}());
/**
 * Button wave click effect
 *
 * @author    Joe J. Howard
 * @copyright Joe J. Howard
 * @license   https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE
 */

(function()
{
    /**
     * JS Helper reference
     * 
     * @var object
     */
    var Helper = Hubble.helper();

    /**
     * Module constructor
     *
     * @access public
     * @constructor
     */
    var ButtonRipple = function()
    {
        /**
         * List of click-triggers
         * 
         * @var array
         */
        this._containers = Helper.$All('.js-ripple');
        
        if (!Helper.empty(this._containers))
        {
            this._bind();
        }

        return this;
    };

    /**
     * Module destructor - removes event listeners
     *
     * @access public
     */
    ButtonRipple.prototype.destruct = function()
    {
        this._unbind();

        this._containers = [];
    }

    /**
     * Event binder - Binds all events on button click
     *
     * @access private
     */
    ButtonRipple.prototype._bind = function()
    {
        for (var i = 0; i < this._containers.length; i++)
        {
            Helper.addEventListener(this._containers[i], 'click', this._eventHandler);
        }
    }

    /**
     * Event ubinder - Binds all event handlers on button click
     *
     * @access private
     */
    ButtonRipple.prototype._unbind = function()
    {
        for (var i = 0; i < this._containers.length; i++)
        {
            Helper.removeEventListener(this._containers[i], 'click', this._eventHandler);
        }
    }

    /**
     * Event handler - handles the wave effect
     *
     * @access private
     * @params event|null e Browser click event
     */
    ButtonRipple.prototype._eventHandler = function(e)
    {
        e = e || window.event;
        var container  = this;
        var wave       = document.createElement('span');
        wave.className = 'wave';
        container.appendChild(wave);

        var coords = Helper.getCoords(container);
        var size   = container.offsetWidth;
        var x      = e.pageX - coords.left - (container.offsetWidth / 2);
        var y      = e.pageY - coords.top - (container.offsetHeight * 1.3);
       
        Helper.css(wave, 
        {
            top: y + 'px',
            left: x + 'px',
            width: size + 'px',
            height: size + 'px'
        });

        Helper.addClass(wave, 'animate');

        setTimeout(function ()
        {
            container.removeChild(wave);

        }, 500);
    }

    // Load into Hubble DOM core
    Container.get('Hubble').dom().register('ButtonRipple', ButtonRipple);

})();

/**
 * Input masker
 *
 * @author    Joe J. Howard
 * @copyright Joe J. Howard
 * @license   https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE
 */

 (function()
 {
    /**
     * JS Helper reference
     * 
     * @var object
     */
    var Helper = Hubble.helper();

    /**
     * Module constructor
     *
     * @constructor
     * @access public
     */
    var InputMasks = function()
    {
        // Private
        this._nodes_money			 = [];
        this._nodes_creditcard	     = [];
        this._nodes_numeric          = [];
        this._nodes_numericDecimal   = [];
        this._nodes_alphaNumeric     = [];
        this._nodes_alphaDash        = [];
        this._nodes_AlphaNumericDash = [];
        this._nodes_AlphaNumericDashDecimal = [];

        // Constructor
        this._invoke();
        
        return this;
    }

    /**
     * Public destructor remove all masks
     *
     * @access public
     */
    InputMasks.prototype.destruct = function()
    {
        this._loopUnBind(this._nodes_money);
        this._loopUnBind(this._nodes_creditcard);
        this._loopUnBind(this._nodes_numeric);
        this._loopUnBind(this._nodes_numericDecimal);
        this._loopUnBind(this._nodes_alphaNumeric);
        this._loopUnBind(this._nodes_alphaSpace);
        this._loopUnBind(this._nodes_alphaDash);
        this._loopUnBind(this._nodes_AlphaNumericDash);
        this._nodes_money            = [];
        this._nodes_creditcard       = [];
        this._nodes_numeric          = [];
        this._nodes_numericDecimal   = [];
        this._nodes_alphaNumeric     = [];
        this._nodes_alphaDash        = [];
        this._nodes_AlphaNumericDash = [];
        this._nodes_AlphaNumericDashDecimal = [];
    }

    /**
     * Find all the nodes and apply any masks
     *
     * @access private
     */
    InputMasks.prototype._invoke = function()
    {
        // Find all the nodes
        this._nodes_money			 = Helper.$All('.js-mask-money');
        this._nodes_creditcard	     = Helper.$All('.js-mask-creditcard');
        this._nodes_numeric          = Helper.$All('.js-mask-numeric');
        this._nodes_numericDecimal   = Helper.$All('.js-mask-numeric-decimal');
        this._nodes_alphaNumeric     = Helper.$All('.js-mask-alpha-numeric');
        this._nodes_alphaSpace       = Helper.$All('.js-mask-alpha-space');
        this._nodes_alphaDash        = Helper.$All('.js-mask-alpha-dash');
        this._nodes_AlphaNumericDash = Helper.$All('.js-mask-alpha-numeric-dash');
        this._nodes_AlphaNumericDashDecimal = Helper.$All('.js-mask-alphaNumericDashDecimal');

        if (!Helper.empty(this._nodes_money))
        {
        	this._loopBind(this._nodes_money, 'money');
        }
        if (!Helper.empty(this._nodes_creditcard))
        {
            this._loopBind(this._nodes_creditcard, 'creditcard');
        }
        if (!Helper.empty(this._nodes_numeric))
        {
            this._loopBind(this._nodes_numeric, 'numeric');
        }
        if (!Helper.empty(this._nodes_numericDecimal))
        {
            this._loopBind(this._nodes_numericDecimal, 'numericDecimal');
        }
        if (!Helper.empty(this._nodes_alphaNumeric))
        {
            this._loopBind(this._nodes_alphaNumeric, 'alphaNumeric');
        }
        if (!Helper.empty(this._nodes_alphaSpace))
        {
            this._loopBind(this._nodes_alphaSpace, 'alphaSpace');
        }
        if (!Helper.empty(this._nodes_alphaDash))
        {
            this._loopBind(this._nodes_alphaDash, 'alphaDash');
        }
        if (!Helper.empty(this._nodes_AlphaNumericDash))
        {
            this._loopBind(this._nodes_AlphaNumericDash, 'alphaNumericDash');
        }
    }

    /**
     * Loop and bind masks to DOM LIST
     *
     * @access private
     */
    InputMasks.prototype._loopBind = function(nodes, mask)
    {
    	for (var i = 0; i < nodes.length; i++)
        {
    		Container.get('InputMasker', nodes[i])[mask]();
        }
    }

    /**
     * Loop and unbind masks to DOM LIST
     *
     * @access private
     */
    InputMasks.prototype._loopUnBind = function(nodes)
    {
        for (var i = 0; i < nodes.length; i++)
        {
            Container.get('InputMasker', nodes[i]).remove();
        }
    }

    // Load into Hubble DOM core
    Container.get('Hubble').dom().register('InputMasks', InputMasks);

}());

/**
 * File inputs
 *
 * @author    Joe J. Howard
 * @copyright Joe J. Howard
 * @license   https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE
 */

 (function()
 {
    /**
     * JS Helper reference
     * 
     * @var object
     */
    var Helper = Hubble.helper();

    /**
     * Module constructor
     *
     * @constructor
     * @access public
     */
    var FileInput = function()
    {
        this._nodes = Helper.$All('.js-file-input');

        this._bind();
        
        return this;
    }

    /**
     * Module destructor remove event handlers
     *
     * @access public
     */
    FileInput.prototype.destruct = function()
    {
        this._unbind();

        this._nodes  = [];
    }

    /**
     * Bind DOM listeners
     *
     * @access public
     */
    FileInput.prototype._bind = function()
    {
        for (var i = 0; i < this._nodes.length; i++)
        {
            Helper.addEventListener(this._nodes[i], 'change', this._eventHandler);
        }
    }

    /**
     * Unbind DOM listeners
     *
     * @access public
     */
    FileInput.prototype._unbind = function()
    {
        for (var i = 0; i < this._nodes.length; i++)
        {
            Helper.removeEventListener(this._nodes[i], 'change', this._eventHandler);
        }
    }

    /**
     * Handle the change event
     *
     * @access private
     */
    FileInput.prototype._eventHandler = function()
    {
        var fileInput = this;
        var wrap      = Helper.closestClass(fileInput, 'js-file-field');
        var showInput = Helper.$('.js-file-text', wrap);
        var fullPath  = fileInput.value;
        if (fullPath)
        {
            var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
            var filename   = fullPath.substring(startIndex);
            if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0)
            {
                filename = filename.substring(1);
            }
            showInput.value = filename;
        }
    }

    // Load into Hubble DOM core
    Container.get('Hubble').dom().register('FileInput', FileInput);

}());

/**
 * Message closers
 *
 * @author    Joe J. Howard
 * @copyright Joe J. Howard
 * @license   https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE
 */

(function()
{
    /**
     * Helper instance
     * 
     * @var object
     */
    var Helper = Hubble.helper();

    /**
     * Module constructor
     *
     * @constructor
     * @access public
     */
    var MessageClosers = function()
    {
        this._triggers = Helper.$All('.js-close-msg');
        
        if (!Helper.empty(this._triggers))
        { 
            this._bind();
        }

        return this;
    };

    /**
     * Module destructor - removes event listeners
     *
     * @constructor
     * @access public
     */
    MessageClosers.prototype.destruct = function()
    {
        this._unbind();

        this._triggers = [];
    }

    /**
     * Event binder - Binds all events on button click
     *
     * @access private
     */
    MessageClosers.prototype._bind = function()
    {
        for (var i = 0; i < this._triggers.length; i++)
        {
            Helper.addEventListener(this._triggers[i], 'click', this._eventHandler);
        }
    }

    /**
     * Event ubinder - Binds all event handlers on button click
     *
     * @access private
     */
    MessageClosers.prototype._unbind = function()
    {
        for (var i = 0; i < this._triggers.length; i++)
        {
            Helper.removeEventListener(this._triggers[i], 'click', this._eventHandler);
        }
    }

    /**
     * Event handler - handles removing the message
     *
     * @param  event   e JavaScript click event
     * @access private
     */
    MessageClosers.prototype._eventHandler = function(e)
    {
        e = e || window.event;

        e.preventDefault();

        var toRemove = this.parentNode;

        if (Helper.hasClass(this, 'js-rmv-parent'))
        {
            toRemove = toRemove.parentNode;
        }
        
        Helper.animate(toRemove, 'opacity', '1', '0', 300, 'ease');
        
        setTimeout(function()
        {
            Helper.removeFromDOM(toRemove);

        }, 300);
    }

    // Load into Hubble DOM core
    Container.get('Hubble').dom().register('MessageClosers', MessageClosers);

})();
/**
 * Waypoints
 *
 * @author    Joe J. Howard
 * @copyright Joe J. Howard
 * @license   https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE
 */

(function()
{
    /**
     * Helper instance
     * 
     * @var object
     */
    var Helper = Hubble.helper();

    /**
     * Has the page loaded?
     * 
     * @var object
     */
    var pageLoaded = false;

    /**
     * Module constructor
     *
     * @constructor
     * @access public
     */
    var WayPoints = function()
    {
        // Load nodes
        this._nodes = Helper.$All('.js-waypoint-trigger');

        // bind listeners
        if (!Helper.empty(this._nodes))
        {
            for (var i = 0; i < this._nodes.length; i++)
            {
                this._bind(this._nodes[i]);
            }
        }
        
        // Invoke pageload
        if (!pageLoaded)
        {
            this._invokePageLoad();
        }

        return this;
    };

    /**
     * Module destructor
     *
     * @access public
     */
    WayPoints.prototype.destruct = function()
    {
        // Unbind listeners
        for (var i = 0; i < this._nodes.length; i++)
        {
            this._unbind(this._nodes[i]);
        }
        
        // Clear Nodes
        this._nodes = [];
    }

    /**
     * Event binder
     *
     * @params trigger node
     * @access private
     */
    WayPoints.prototype._bind = function(trigger)
    {
        Helper.addEventListener(trigger, 'click', this._eventHandler);
    }

    /**
     * Event unbinder
     *
     * @params trigger node
     * @access private
     */
    WayPoints.prototype._unbind = function(trigger)
    {
        Helper.removeEventListener(trigger, 'click', this._eventHandler);
    }

    /**
     * Event handler
     *
     * @param event|null e JavaScript click event
     * @access private
     */
    WayPoints.prototype._eventHandler = function(e)
    {
        e = e || window.event;
        e.preventDefault();
        var trigger  = this;
        var waypoint = trigger.dataset.waypointTarget;
        var targetEl = Helper.$('[data-waypoint="' + waypoint + '"]');

        if (Helper.nodeExists(targetEl))
        {
            var id      = waypoint;
            var speed   = typeof trigger.dataset.waypointSpeed  !== "undefined" ? trigger.dataset.waypointSpeed : 500;
            var easing  = typeof trigger.dataset.waypointEasing !== "undefined" ? trigger.dataset.waypointEasing : 'easeInOutCubic';
            targetEl.id = id;

            var options = {
                easing : easing,
                speed  : speed,
            };

            Container.get('SmoothScroll').animateScroll('#' + id, trigger, options);
        }
    }

    /**
     * Scroll to a element with id when the page loads
     *
     * @access private
     */
    WayPoints.prototype._invokePageLoad = function()
    {

        var url = Helper.parse_url(window.location.href);

        if (Helper.isset(url['fragment']) && url['fragment'] !== '')
        {
            var waypoint = Helper.trim(url['fragment'], '/');
            var options  = {
                speed:   100,
                easing: 'Linear'
            };
            var targetEl = Helper.$('[data-waypoint="' + waypoint + '"]');

            if (!Helper.nodeExists(targetEl)) targetEl = Helper.$('#' + waypoint);

            if (Helper.nodeExists(targetEl))
            {
                var id      = waypoint;
                targetEl.id = id;
                Container.get('SmoothScroll').animateScroll('#' + id, null, options);
            }
        }

        pageLoaded = true;
    }


    // Load into Hubble DOM core
    Container.get('Hubble').dom().register('WayPoints', WayPoints);

}());



// Boot Hubble
/**
 * Boot and initialize Hubble core
 *
 * @author    Joe J. Howard
 * @copyright Joe J. Howard
 * @license   https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE
 */

(function()
{
	
    Container.get('Hubble').boot();

})();