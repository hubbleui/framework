/**
 * JavaScript IoC container
 *
 * @author    Joe J. Howard
 * @copyright Joe J. Howard
 * @license   https://github.com/kanso-cms/cms/blob/master/LICENSE
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
