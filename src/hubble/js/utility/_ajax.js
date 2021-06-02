/**
 * Ajax Utility
 *
 * @example 

var headers = {'foo' : 'bar'};
var data    = {'foo' : 'bar'};

_Ajax.get('https://stackoverflow.com', function complete(response)
{
    console.log('Completed');
    
});

_Ajax.get('https://stackoverflow.com', function complete(response)
{
    console.log('Completed');
    
}, headers);

_Ajax.post('https://stackoverflow.com', data,
function success(response)
{
    console.log('success');
    
},
function error(response)
{
    console.log('error');
});

_Ajax.post('https://stackoverflow.com', data,
function success(response)
{
    console.log('success');
    
},
function error(response)
{
    console.log('error');
    
},
function complete(response)
{
    console.log('Completed');
    
}, headers);

*/
(function()
{
    /**
     * JS Queue
     *
     * @see https://medium.com/@griffinmichl/asynchronous-javascript-queue-920828f6327
     */
    var Queue = function(concurrency)
    {
        this.running = 0;
        this.concurrency = concurrency;
        this.taskQueue = [];

        return this;
    }

    Queue.prototype.add = function(task, _this, _args)
    {
        if (this.running < this.concurrency)
        {
            this._runTask(task, _this, _args);
        }
        else
        {
            this._enqueueTask(task, _this, _args);
        }
    }

    Queue.prototype.next = function()
    {
        this.running--;

        if (this.taskQueue.length > 0)
        {
            var task = this.taskQueue.shift();

            this._runTask(task['callback'], task['_this'], task['_args']);
        }
    }

    Queue.prototype._runTask = function(task, _this, _args)
    {
        this.running++;

        task.apply(_this, _args);
    }

    Queue.prototype._enqueueTask = function(task, _this, _args)
    {
        this.taskQueue.push(
        {
            'callback': task,
            '_this': _this,
            '_args': _args
        });
    }

    var AjaxQueue = new Queue(1);

    /**
     * Module constructor
     *
     * @access public
     * @constructor
     * @return this
     */
    var _Ajax = function()
    {
        this._settings = {
            'url': '',
            'async': true,
            'headers':
            {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accepts': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            },
        };

        this._complete = false;
        this._success = false;
        this._error = false;

        return this;
    }

    /**
     * Ajax Methods 
     *
     * @access public
     * @param  string        url     Destination URL
     * @param  string|object data    Data (optional)
     * @param  function      success Success callback (optional)
     * @param  function      error   Error callback (optional)
     * @param  object        headers Request headers (optional)
     * @return this
     */
    _Ajax.prototype.post = function(url, data, success, error, complete, headers)
    {
        var instance = new _Ajax;

        AjaxQueue.add(instance._call, instance, instance._normaliseArgs('POST', url, data, success, error, complete, headers));

        return instance;
    }
    _Ajax.prototype.get = function(url, data, success, error, complete, headers)
    {
        var instance = new _Ajax;

        AjaxQueue.add(instance._call, instance, instance._normaliseArgs('GET', url, data, success, error, complete, headers));

        return instance;
    }
    _Ajax.prototype.head = function(url, data, success, error, complete, headers)
    {
        var instance = new _Ajax;

        AjaxQueue.add(instance._call, instance, instance._normaliseArgs('HEAD', url, data, success, error, complete, headers));

        return instance;
    }
    _Ajax.prototype.put = function(url, data, success, error, complete, headers)
    {
        var instance = new _Ajax;

        AjaxQueue.add(instance._call, instance, instance._normaliseArgs('PUT', url, data, success, error, complete, headers));

        return instance;
    }
    _Ajax.prototype.delete = function(url, data, success, error, complete, headers)
    {
        var instance = new _Ajax;

        AjaxQueue.add(instance._call, instance, instance._normaliseArgs('DELETE', url, data, success, error, complete, headers));

        return instance;
    }

    /**
     * Success function
     *
     * @param  function  callback Callback function
     * @return this
     */
    _Ajax.prototype.success = function(callback)
    {
        if (!this._isFunc(callback))
        {
            throw new Error('Error the provided argument "' + JSON.parse(callback) + '" is not a valid callback');
        }

        this._success = callback;

        return this;
    }

    /**
     * Error function
     *
     * @param  function  callback Callback function
     * @return this
     */
    _Ajax.prototype.error = function(callback)
    {
        if (!this._isFunc(callback))
        {
            throw new Error('Error the provided argument "' + JSON.parse(callback) + '" is not a valid callback');
        }

        this._error = callback;

        return this;
    }

    /**
     * Alias for complete
     *
     * @param  function  callback Callback function
     * @return this
     */
    _Ajax.prototype.then = function(callback)
    {
        return this.complete(callback);
    }

    /**
     * Complete function
     *
     * @param  function  callback Callback function
     * @return this
     */
    _Ajax.prototype.complete = function(callback)
    {
        if (!this._isFunc(callback))
        {
            throw new Error('Error the provided argument "' + JSON.parse(callback) + '" is not a valid callback');
        }

        this._complete = callback;

        return this;
    }

    /**
     * Special Upload Function
     *
     * @access public
     * @param  string        url      Destination URL
     * @param  object        data     Form data
     * @param  function      success  Success callback
     * @param  function      error    Error callback
     * @param  function      start    Start callback (optional)
     * @param  function      progress Progress callback (optional)
     * @param  function      complete Complete callback (optional)
     * @return this
     */
    _Ajax.prototype.upload = function(url, data, success, error, start, progress, complete)
    {
        var formData = new FormData();

        for (var key in data)
        {
            if (data.hasOwnProperty(key))
            {
                var value = data[key];

                if (value['type'])
                {
                    formData.append(key, value, value.name);
                }
                else
                {
                    formData.append(key, value);
                }
            }
        }

        xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

        if (data)
        {
            data = this._params(data);
        }

        xhr.requestURL = url;

        xhr.method = 'POST';

        if (this.isFunction(start))
        {
            xhr.upload.addEventListener('loadstart', start, false);
        }
        if (this.isFunction(progress))
        {
            xhr.upload.addEventListener('progress', progress, false);
        }
        if (this.isFunction(complete))
        {
            xhr.upload.addEventListener('load', complete, false);
        }
        xhr.addEventListener('readystatechange', function(e)
        {
            e = e || window.event;
            var status, text, readyState;
            try
            {
                readyState = e.target.readyState;
                text = e.target.responseText;
                status = e.target.status;
            }
            catch (e)
            {
                return;
            }

            if (readyState == 4)
            {
                if (status >= 200 && status < 300 || status === 304)
                {
                    var response = e.target.responseText;

                    if (_this.isFunction(success))
                    {
                        success(response);
                    }
                }
                else
                {
                    // error callback
                    if (_this.isFunction(error))
                    {
                        error.call(status, xhr);
                    }
                }


            }

        }, false);
        xhr.open("POST", url, true);
        xhr.setRequestHeader('REQUESTED-WITH', 'XMLHttpRequest');
        xhr.send(formData);
    }

    /**
     * Ajax call 
     *
     * @access private
     * @param  string        method  Request method
     * @param  string        url     Destination URL
     * @param  string|object data    Data (optional)
     * @param  function      success Success callback (optional)
     * @param  function      error   Error callback (optional)
     * @param  function      complete Complete callback (optional)
     * @param  object        headers Request headers (optional)
     * @return this
     */
    _Ajax.prototype._call = function(method, url, data, success, error, complete, headers)
    {

        xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

        this._xhr = xhr;

        xhr.requestURL = url;

        xhr.mthod = method;

        xhr.open(method, url, this._settings['async']);

        this._sendHeaders(xhr, headers);

        var _this = this;

        if (this._settings['async'])
        {
            xhr.onreadystatechange = function()
            {
                _this._ready.call(_this, xhr, success, error, complete);
            }

            xhr.send(data);
        }
        else
        {
            xhr.send(data);

            this._ready.call(this, xhr, success, error, complete);
        }

        return this;
    }

    /**
     * Send XHR headers
     *
     * @access private
     * @param  object    xhr     XHR object
     * @param  object    headers Request headers (optional)
     * @return {This}
     */
    _Ajax.prototype._sendHeaders = function(xhr, headers)
    {
        if (xhr.mthod === 'POST')
        {
            this._settings['headers']['REQUESTED-WITH'] = 'XMLHttpRequest';
        }

        if (this._isObj(headers))
        {
            this._settings['headers'] = Object.assign(
            {}, this._settings['headers'], headers);
        }

        for (var k in this._settings['headers'])
        {
            if (this._settings['headers'].hasOwnProperty(k))
            {
                xhr.setRequestHeader(k, this._settings['headers'][k]);
            }
        }
    }

    /**
     * Normalise arguments from original call function
     *
     * @param  string        method  Request method
     * @param  string        url     Destination URL
     * @param  string|object data    Data (optional)
     * @param  function      success Success callback (optional)
     * @param  function      error   Error callback (optional)
     * @param  object        headers Request headers (optional)
     * @return {This}
     */
    _Ajax.prototype._normaliseArgs = function(method, url, data, success, error, complete, headers)
    {
        var complete = typeof complete === 'undefined' ? 'false' : complete;

        // (url, complete)
        if (this._isFunc(data))
        {
            complete = data;

            //OR (url, complete, headers)
            if (this._isFunc(success))
            {
                headers = success;
            }

            success = false;

            error = false;
        }

        if (method !== 'POST')
        {
            if (this._isObj(data) && !this._isEmpty(data))
            {
                url += url.includes('?') ? '&' : '?';
                url += this._params(data);
                data = null;
            }
        }
        else if (this._isObj(data) && !this._isEmpty(data))
        {
            data = this._params(data);
        }

        return [method, url, data, success, error, complete, headers];
    }
    /**
     * Ready callback
     *
     * @return string
     */
    _Ajax.prototype._ready = function(xhr, success, error, complete)
    {
        if (xhr.readyState == 4)
        {
            var successfull = false;

            if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)
            {
                successfull = true;

                // set data
                var response = xhr.responseText;

                // success callback
                if (this._isFunc(success))
                {
                    success.call(xhr, response);
                }

                if (this._success)
                {
                    this._success.call(xhr, response);
                }
            }
            else
            {
                successfull = false;

                // error callback
                if (this._isFunc(error))
                {
                    error.call(xhr, response);
                }

                if (this._error)
                {
                    this._error.call(xhr, response)
                }
            }

            // Complete
            if (this._isFunc(complete))
            {
                complete.call(xhr, response, successfull);
            }

            if (this._complete)
            {
                this._complete.call(xhr, response, successfull);
            }

            // Next queue
            AjaxQueue.next();
        }
    }

    _Ajax.prototype._isEmpty = function(mixedvar)
    {
        return mixedvar && Object.keys(mixedvar).length === 0 && mixedvar.constructor === Object;
    }

    _Ajax.prototype._isFunc = function(mixedvar)
    {
        return Object.prototype.toString.call(mixedvar) === '[object Function]';
    }

    _Ajax.prototype._isObj = function(mixedvar)
    {
        return Object.prototype.toString.call(mixedvar) === '[object Object]';
    }

    _Ajax.prototype._params = function(obj)
    {
        var s = [];

        for (var key in obj)
        {
            s.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
        }

        return s.join('&');
    }

    Container.set('Ajax', _Ajax);

})();