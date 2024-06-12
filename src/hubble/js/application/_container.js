/**
 * JS IoC Container
 *
 * @author    Joe J. Howard
 * @copyright Joe J. Howard
 * @license   https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE
 */
(function(window)
{
    /**
     * Module constructor
     *
     * @class
     * @constructor
     * @access public
     */
    var ArrayHelper = function()
    {
        return this;
    };

    /**
     * Set a key using dot/bracket notation on an object or array
     *
     * @access public
     * @param  string       path   Path to set
     * @param  mixed        value  Value to set
     * @param  object|array object Object to set into
     * @return object|array
     */
    ArrayHelper.prototype.set = function(path, value, object)
    {
        this._setRecursive(this._keySegment(path), value, object);

        return object;
    }

    /**
     * Gets an from an array/object using dot/bracket notation
     *
     * @access public
     * @param  string       path   Path to get
     * @param  object|array object Object to get from
     * @return mixed
     */
    ArrayHelper.prototype.get = function(path, object)
    {
        return this._getRecursive(this._keySegment(path), object);
    }

    /**
     * Checks if array/object contains path using dot/bracket notation
     *
     * @access public
     * @param  string       path   Path to check
     * @param  object|array object Object to check on
     * @return bool
     */
    ArrayHelper.prototype.has = function(path, object)
    {
        return typeof this.get(path, object) !== 'undefined';
    }

    /**
     * Deletes from an array/object using dot/bracket notation
     *
     * @access public
     * @param  string       path   Path to delete
     * @param  object|array object Object to delete from
     * @return object|array
     */
    ArrayHelper.prototype.delete = function(path, object)
    {
        this._deleteRecursive(this._keySegment(path), object);

        return object;
    }

    /**
     * Recursively delete from array/object
     *
     * @access private
     * @param  array        keys   Keys in search order
     * @param  object|array object Object to get from
     * @return mixed
     */
    ArrayHelper.prototype._deleteRecursive = function(keys, object)
    {
        var key = keys.shift();
        var islast = keys.length === 0;

        if (islast)
        {
            if (Object.prototype.toString.call(object) === '[object Array]')
            {
                object.splice(key, 1);
            }
            else
            {
                delete object[key];
            }
        }

        if (!object[key])
        {
            return false;
        }

        return this._deleteRecursive(keys, object[key]);

    }

    /**
     * Recursively search array/object
     *
     * @access private
     * @param  array        keys   Keys in search order
     * @param  object|array object Object to get from
     * @return mixed
     */
    ArrayHelper.prototype._getRecursive = function(keys, object)
    {
        var key = keys.shift();
        var islast = keys.length === 0;

        if (islast)
        {
            return object[key];
        }

        if (!object[key])
        {
            return undefined;
        }

        return this._getRecursive(keys, object[key]);
    }

    /**
     * Recursively set array/object
     *
     * @access private
     * @param  array        keys   Keys in search order
     * @param  mixed        value  Value to set
     * @param  parent       object|array or null
     * @param  object|array object Object to set on
     */
    ArrayHelper.prototype._setRecursive = function(keys, value, object, nextKey)
    {
        var key = keys.shift();
        var islast = keys.length === 0;
        var lastObj = object;
        object = !nextKey ? object : object[nextKey];

        // Trying to set a value on nested array that doesn't exist
        if (!['object', 'function'].includes(typeof object))
        {
            throw new Error('Invalid dot notation. Cannot set key "' + key + '" on "' + JSON.stringify(lastObj) + '[' + nextKey + ']"');
        }

        if (!object[key])
        {
            // Trying to put object key into an array
            if (Object.prototype.toString.call(object) === '[object Array]' && typeof key === 'string')
            {
                var converted = Object.assign(
                {}, object);

                lastObj[nextKey] = converted;

                object = converted;
            }

            if (keys[0] && typeof keys[0] === 'string')
            {
                object[key] = {};
            }
            else
            {
                object[key] = [];
            }
        }

        if (islast)
        {
            object[key] = value;

            return;
        }

        this._setRecursive(keys, value, object, key);
    }

    /**
     * Segments an array/object path using dot notation
     *
     * @access private
     * @param  string  path Path to parse
     * @return array
     */
    ArrayHelper.prototype._keySegment = function(path)
    {
        var result = [];
        var segments = path.split('.');

        for (var i = 0; i < segments.length; i++)
        {
            var segment = segments[i];

            if (!segment.includes('['))
            {
                result.push(segment);

                continue;
            }

            var subSegments = segment.split('[');

            for (var j = 0; j < subSegments.length; j++)
            {
                if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(subSegments[j][0]))
                {
                    result.push(parseInt(subSegments[j].replace(']')));
                }
                else if (subSegments[j] !== '')
                {
                    result.push(subSegments[j])
                }
            }
        }

        return result;
    }

    var Arr = new ArrayHelper;

    /**
     * Module constructor
     *
     * @class
     * @constructor
     * @access public
     */
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
        if (key.includes('.') || key.includes('['))
        {
            Arr.set(key, value, this.data);
        }
        else
        {
            this.data[key] = value;

            this._setProto(key, this._isInvokable(value) || this._isInvoked(value));
        }
    }

    /**
     * Sets the key as a prototype method
     *
     * @access public
     * @param  string key   The data key
     * @return mixed
     */
    Container.prototype._setProto = function(key, invokable)
    {
        var _this = this;

        var _key = this._normalizeKey(key);

        var _proto = Object.getPrototypeOf(this);

        _proto[_key] = function()
        {
            var args = Array.prototype.slice.call(arguments);

            args.unshift(key);

            if (invokable)
            {
                return _this.get.apply(_this, args);
            }

            return _this.get(key);
        };
    }

    /**
     * Remove a key/value
     *
     * @access public
     * @param string key   The data key
     */
    Container.prototype.delete = function(key)
    {
        if (key.includes('.') || key.includes('['))
        {
            Arr.delete(key, this.data);

            return;
        }

        delete this.data[key];

        key = this._normalizeKey(key);

        var _proto = Object.getPrototypeOf(this);

        if (typeof _proto[key] !== 'undefined')
        {
            _proto[key] = null;
        }
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
        if (key.includes('.') || key.includes('['))
        {
            throw new Error('Cannot set singletons using dot notation.');
        }

        var args = this._normalizeArgs(arguments);

        var instance;

        if (this._isInvoked(classObj))
        {
            instance = classObj;
        }

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
        if (key.includes('.') || key.includes('['))
        {
            return Arr.get(key, this.data);
        }

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
        if (key.includes('.') || key.includes('['))
        {
            return Arr.has(key, this.data);
        }

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
        return Object.prototype.toString.call(mixedVar) === '[object Function]';
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
        return typeof classObj === 'object' && classObj.constructor && typeof classObj.constructor === 'function' && classObj.constructor.toString().includes('function (');
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
        return new(Function.prototype.bind.apply(reference, args));
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
        if (Object.prototype.toString.call(args) === '[object Arguments]')
        {
            var _args = Array.prototype.slice.call(args);

            _args.shift();

            return _args;
        }

        return args;
    }

    /**
     * Normalizes key for prototypes
     *
     * @access private
     * @param  string key Key to normalize
     * @return string
     */
    Container.prototype._normalizeKey = function(key)
    {
        key = key.replace(/['"]/g, '').replace(/\W+/g, ' ')
            .replace(/ (.)/g, function($1)
            {
                return $1.toUpperCase();
            })
            .replace(/ /g, '');

        key = key.charAt(0).toUpperCase() + key.slice(1);

        return key;
    }

    /**
     * Loads container into global namespace as "Hubble"
     *
     */
    if (!window.Container)
    {
        var ContainerInstance = new Container;

        window.Container = ContainerInstance;
    }

})(window);
