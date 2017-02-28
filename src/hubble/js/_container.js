// ##############################################################################
// CLASS MANAGER
// ##############################################################################
(function(window) {

	// List of keys
	var _keys = {};

	// List of uninvoked classes/object/variables
	var _raw = {};

	// Container object
	var Container = function() {
		return this;
	};

	// ##############################################################################
	// SET A KEY/VALUE PAIR - OBJECT/CLASS/MIXED
	// ##############################################################################
	// Set key/pair/object/class
	// Note that non-singletons are never invoked when they are set
	// A new instance will always be returned

	Container.prototype.set = function(key, value) {

		// Base object for the module
		var module = {
			callable    : this._is_callable(value),
			key         : key,
			singleton   : false
		};

		// Set the module key-pair
		this._setKeyPair(module, value);

		// Save the raw class
		module.value = value;
		_raw[key]    = module;

		// Chainable
		return this;
	}

	// ##############################################################################
	// SET A SINGLETON CLASS OBJECT
	// ##############################################################################
	// Set a singleton class object
	// Note that a singleton is only invoked when it is first required by another script. 
	// The same instance is always returned
	Container.prototype.singleton = function(key, value) {
		
		// Base object for the module
		var module = {
			invoked     : this._is_invoked(value),
			callable    : true,
			key         : key,
			singleton   : true,
		};

		// Set the module key-pair
		this._setKeyPair(module, value);

		// Save the raw class
		module.value = value;
		_raw[key] = module;

		// Chainable
		return this;
	}

	// ##############################################################################
	// GET ALL FROM CONTAINER
	// ##############################################################################
	Container.prototype.all = function() {
		var data = {};
		for (var key in _keys) {
	    	if (!this.hasOwnProperty(key)) continue;
	    	data[key] = this[key];
		}
		return data;
	}

	// ##############################################################################
	// GET ALL KEYS FROM CONTAINER
	// ##############################################################################
	Container.prototype.keys = function() {
		var keys = [];
		for (var key in _keys) {
	    	if (!_keys.hasOwnProperty(key)) continue;
	    	keys.push(key);
		}
		return keys;
	}

	// ##############################################################################
	// DOES CONTAINER HAVE A KEY
	// ##############################################################################
	Container.prototype.has = function(key) {
		for (var dataKey in _keys) {
	    	if (!_keys.hasOwnProperty(dataKey)) continue;
	    	if (dataKey === key) return true;
		}
		return false;
	}

	// ##############################################################################
	// REMOVE A KEY/VALUE
	// ##############################################################################
	Container.prototype.remove = function(key) {
		if (this.has(key)) {
	    	
	    	var module = _keys[key];
	    	
	    	var Class  = this[key];

	    	// If the class has a destructor call it
	    	if (module.callable && module.invoked && this._has_method(Class, 'destruct')) this[key].destruct();

	    	// Remove it
	    	this._unsetKeyPair(key);
		}
	}

	// ##############################################################################
	// CLEAR EVERYTHING FROM THE CONTAINER
	// ##############################################################################
	Container.prototype.clear = function() {
		for (var dataKey in _keys) {
	    	if (!_keys.hasOwnProperty(dataKey)) continue;
	    	this.remove(dataKey);
		}
		_keys = {};
	}

	// ##############################################################################
	// REFRESH THE CONTAINER OR A MODULE
	// ##############################################################################
	Container.prototype.refresh = function(key) {

		if (key) {
			this.remove(key);
			this.require(key);
			return;
		}

		for (var key in _raw) {
			
			if (!_raw.hasOwnProperty(key)) continue;
			
			var module = _raw[key];

			if (module.singleton === true) {
				this.remove(key);
				this.require(key);
			}
		}
	}

	// ##############################################################################
	// REQUIRE A MODULE / KEY-PAIR
	// ##############################################################################
	Container.prototype.require = function(key) {
		if (this.has(key)) {
			
			var module = _keys[key];

			// If the module was destroyed - grab it from raw
			if (!module) {
				module = _raw[key];
				if (module.singleton === true) {
					this.singleton(key, module.value);
				}
				else {
					this.set(key, module.value);
				}
			}
			
			// Return the singleton class
			if (module.singleton === true) {
				return this._getSingleton(key, arguments);
			}
			
			// Return a new instance of a class
			if (module.callable === true) {
				return this._newInstance(key, arguments);
			}

			// Return an object/string/number - anything that is not a function
			return this[key];
		}

		return false;
	}

	// ##############################################################################
	// ALIAS FOR REQUIRE
	// ##############################################################################
	Container.prototype.get = function(key, args) {
		return this.require(key, args);
	}

	// ##############################################################################
	// SEND UNUSED MODULE TO GARBAGE
	// ##############################################################################
	Container.prototype.sendToGarbage = function(key) {
		// Remove it
	    this[key]  = undefined;
	    _raw[key]  = undefined;
		_keys[key] = undefined;
	}

	// ##############################################################################
	// PRIVATE HELPER FUNCTIONS
	// ##############################################################################

	// Set a key/pair
	Container.prototype._setKeyPair = function(module, value) {
		
		// Set the key
		_keys[module.key] = module;

		// Set the key/pair
		this[module.key] = value;
	}

	// Delete a key/pair
	Container.prototype._unsetKeyPair = function(key) {

		// Remove the key
		_keys[key] = undefined;

		// Delete the module
		this[key]  = undefined;
	}

	// Return a new instance of a class
	Container.prototype._newInstance = function(key, args) {
		// Return new instance
		return new (Function.prototype.bind.apply(this[key], args));
	}

	// Return the singleton class
	Container.prototype._getSingleton = function(key, args) {
		
		// Get the module options
		var module = _keys[key];

		// Has the class already been invoked ?
		if (module.invoked === true) return this[key];

		// Create the singleton
		var classObj = new (Function.prototype.bind.apply(this[key], args));

		// Save it to the container
		this[key] = classObj;

		// Set invoked to true;
		_keys[key]['invoked'] = true;

		// Set invoked to for the raw version;
		_raw[key]['invoked'] = true;

		return this[key];
	}

	// Is a object function ?
	Container.prototype._is_callable = function(mixed_var) {
		return Object.prototype.toString.call( mixed_var ) === '[object Function]';
	}

	// Does the class have a method
	Container.prototype._has_method = function(Class, method) {
		return typeof Class[method] === 'function';
	}

	// Has a function been invoked
	Container.prototype._is_invoked = function(Class) {
		return typeof Class === 'object';
	}


	// Set the global instance to a single local one
	if (!window.Modules) {
		
		// Initialize a local instance
		var ModulesInstance = new Container();

		window.Modules = ModulesInstance;
	}


})(window);