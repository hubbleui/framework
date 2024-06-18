/**
 * Ajax Utility
 *
 * @example 

{var} headers = {'foo' : 'bar'};
var data    = {'foo' : 'bar'};

var ajax = new _Ajax;

ajax.complete(function()
{
    console.log('Completed');
});

ajax.abort(function()
{
    console.log('Aborted');
});

ajax.post('https://stackoverflow.com/bar/bafsdfz', {foo: 'bar'}, function abort() {console.log('aborted here')}, {header: 'baz'});

setTimeout(function()
{
    ajax.abort();
}, 500);

var ajax = new _Ajax;
ajax.post('https://stackoverflow.com/foo', data,
function abort(response)
{
    console.log('aborted')
},
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
    
},

headers);

ajax.abort();

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
    
},
function abort()
{
    
},headers);

*/
(function()
{
    /**
     * JS Queue
     *
     * @see {https://medium.com/@griffinmichl/asynchronous-javascript-queue-920828f6327}
     */
    class Queue
    {
        constructor(concurrency)
        {
            this.running = 0;
            this.concurrency = concurrency;
            this.taskQueue = [];

            return this;
        }

        add(task, _this, _args)
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

        next()
        {
            this.running--;

            if (this.taskQueue.length > 0)
            {
                var task = this.taskQueue.shift();

                this._runTask(task['callback'], task['_this'], task['_args']);
            }
        }

        _runTask(task, _this, _args)
        {
            this.running++;

            task.apply(_this, _args);
        }

        _enqueueTask(task, _this, _args)
        {
            this.taskQueue.push(
            {
                'callback': task,
                '_this': _this,
                '_args': _args
            });
        }
    }

    var AjaxQueue = new Queue(5);

    /**
     * Module constructor
     *
     * @access {public}
     * @constructor
     {*} @return this
     */
    class _Ajax
    {
        constructor()
        {
            this._settings =
            {
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
            this._success  = false;
            this._error    = false;
            this._abort    = false;
            this._xhr      = null;

            return this;
        }

        /**
         * Ajax Methods 
         *
         * @access {public}
         * @param  {string}        url     Destination URL
         * @param  {string|object} data    Data (optional)
         * @param  {function}      success Success callback (optional)
         * @param  {function}      error   Error callback (optional)
         * @param  {function}      abort   Abort callback (optional)
         * @param  {object}        headers Request headers (optional)
         * @return {this}
         */
        post(url, data, success, error, complete, abort, headers)
        {
            AjaxQueue.add(this._call, this, this._normaliseArgs('POST', url, data, success, error, complete, abort, headers));

            return this;
        }
        get(url, data, success, error, complete, abort, headers)
        {
            AjaxQueue.add(this._call, this, this._normaliseArgs('GET', url, data, success, error, complete, abort, headers));

            return this;
        }
        head(url, data, success, error, complete, abort, headers)
        {
            AjaxQueue.add(this._call, this, this._normaliseArgs('HEAD', url, data, success, error, complete, abort, headers));

            return this;
        }
        put(url, data, success, error, complete, abort, headers)
        {
            AjaxQueue.add(this._call, this, this._normaliseArgs('PUT', url, data, success, error, complete, abort, headers));

            return this;
        }
        delete(url, data, success, error, complete, abort, headers)
        {
            AjaxQueue.add(this._call, this, this._normaliseArgs('DELETE', url, data, success, error, complete, abort, headers));

            return this;
        }

        /**
         * Success function
         *
         * @param  {function}  callback Callback function
         * @return {this}
         */
        success(callback)
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
         * @param  {function}  callback Callback function
         * @return {this}
         */
        error(callback)
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
         * @param  {function}  callback Callback function
         * @return {this}
         */
        then(callback)
        {
            return this.complete(callback);
        }

        /**
         * Complete function
         *
         * @param  {function}  callback Callback function
         * @return {this}
         */
        complete(callback)
        {
            if (!this._isFunc(callback))
            {
                throw new Error('Error the provided argument "' + JSON.parse(callback) + '" is not a valid callback');
            }

            this._complete = callback;

            return this;
        }

        /**
         * Abort an ajax call
         *
         * @param  {function}  callback Callback function
         * @return {this}
         */
        abort(callback)
        {
            // Called after XHR created
            if (this._xhr)
            {
                // Already completed
                if (!this._xhr.readyState >= 4)
                {
                    return;
                }

                this._complete = null;
                this._error    = null;
                this._success  = null;
                this._xhr.onreadystatechange = function(){};
                this._xhr.abort();

                if (this._isFunc(this._abort))
                {
                    this._abort.call(this._xhr, this._xhr.responseText, false);
                }

                if (this._isFunc(callback))
                {
                    callback.call(this._xhr, this._xhr.responseText, false);
                }

                return this;
            }
            // Called before XHR created
            else
            {
                if (!this._isFunc(callback))
                {
                    throw new Error('Error the provided argument "' + JSON.parse(callback) + '" is not a valid callback');
                }

                this._abort = callback;

                return this;
            }
        }

        /**
         * Special Upload Function
         *
         * @access {public}
         * @param  {string}        url      Destination URL
         * @param  {object}        data     Form data
         * @param  {function}      success  Success callback
         * @param  {function}      error    Error callback
         * @param  {function}      start    Start callback (optional)
         * @param  {function}      progress Progress callback (optional)
         * @param  {function}      complete Complete callback (optional)
         * @return {this}
         */
        upload(url, data, success, error, start, progress, complete)
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
         * @access {private}
         * @param  {string}        method   Request method
         * @param  {string}        url      Destination URL
         * @param  {string|object} data     Data (optional)
         * @param  {function}      success  Success callback (optional)
         * @param  {function}      error    Error callback (optional)
         * @param  {function}      complete Complete callback (optional)
         * @param  {function}      abort    Abort callback (optional)
         * @param  {object}        headers  Request headers (optional)
         * @return {this}
         */
        _call(method, url, data, success, error, complete, abort, headers)
        {
            var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

            this._xhr = xhr;

            xhr.requestURL = url;

            xhr.mthod = method;

            xhr.open(method, url, this._settings['async']);

            this._sendHeaders(xhr, headers);

            var _this = this;

            if (abort && this._isFunc(abort)) this._abort = abort;

            if (this._settings['async'])
            {
                xhr.onreadystatechange = function()
                {
                    _this._ready.call(_this, xhr, success, error, complete, abort);
                }

                xhr.send(data);
            }
            else
            {
                xhr.send(data);

                this._ready.call(this, xhr, success, error, complete, abort);
            }

            return this;
        }

        /**
         * Send XHR headers
         *
         * @access {private}
         * @param  {object}    xhr     XHR object
         * @param  {object}    headers Request headers (optional)
         * @return {This}
         */
        _sendHeaders(xhr, headers)
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
         * @param  {string}        method   Request method
         * @param  {string}        url      Destination URL
         * @param  {string|object} data     Data (optional)
         * @param  {function}      success  Success callback (optional)
         * @param  {function}      error    Error callback (optional)
         * @param  {function}      complete Complete callback (optional)
         * @param  {function}      error    Abort callback (optional)
         * @param  {object}        headers  Request headers (optional)
         * @return {This}
         */
        _normaliseArgs(method, url, data, success, error, complete, abort, headers)
        {
            var ret =
            {
                '_method'   : method,
                '_url'      : url,
                '_data'     : undefined,
                '_success'  : undefined,
                '_error'    : undefined,
                '_complete' : undefined,
                '_abort'    : undefined,
                '_headers'  : undefined
            };

            var args = Array.prototype.slice.call(arguments).filter(function( item ){return item !== undefined;});

            args.splice(0,2);

            // Check for function names
            for (var i = 0; i < args.length; i++)
            {
                var arg = args[i];

                // Argument is a function
                if (this._isFunc(arg))
                {
                    var funcname = this._funcName(arg);

                    if (funcname === 'success')
                    {
                        ret._success = arg;
                    }
                    else if (funcname === 'error')
                    {
                        ret._error = arg;
                    }
                    else if (funcname === 'complete')
                    {
                        ret._complete = arg;
                    }
                    else if (funcname === 'abort')
                    {
                        ret._abort = arg;
                    }
                    // Anonymous function
                    else if (funcname === 'function')
                    {
                        // called (url, complete)
                        // (url, complete, data)
                        if (i === 0 || i === 1)
                        {
                            ret._complete = arg;
                        }
                    }
                }
                else if (this._isObj(arg))
                {
                    // First arg is always data if it's an object
                    if (i === 0)
                    {
                        ret._data = arg;
                    }
                    // Last arg should be headers if it's an object
                    else if (i === args.length-1)
                    {
                        ret._headers = arg;
                    }
                }
            }

            // Ajax.get('foo.com?foo=bar&baz')
            if (method !== 'POST')
            {
                if (this._isObj(ret._data) && !this._isEmpty(ret._data))
                {
                    ret._url += ret._url.includes('?') ? '&' : '?';
                    ret._url += this._params(ret._data);
                    ret._data = undefined;
                }
            }
            else if (this._isObj(ret._data) && !this._isEmpty(ret._data))
            {
                ret._data = this._params(ret._data);
            }

            return [ret._method, ret._url, ret._data, ret._success, ret._error, ret._complete, ret._abort, ret._headers];
        }


        /**
         * Ready callback
         *
         * @param  {XMLHttpRequest} xhr     XHR Object
         * @param  {function}      success  Success callback (optional)
         * @param  {function}      error    Error callback (optional)
         * @param  {function}      complete Complete callback (optional)
         * @param  {function}      abort    Abort callback (optional)
         */
        _ready(xhr, success, error, complete, abort)
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

        _isEmpty(mixedvar)
        {
            return mixedvar && Object.keys(mixedvar).length === 0 && mixedvar.constructor === Object;
        }

        _isFunc(mixedvar)
        {
            return Object.prototype.toString.call(mixedvar) === '[object Function]';
        }

        _isObj(mixedvar)
        {
            return Object.prototype.toString.call(mixedvar) === '[object Object]';
        }

        _funcName(func)
        {
            if (func === window) return null;

            if (func.name) return func.name.toLowerCase();

            if (func.constructor && func.constructor.name) return func.constructor.name.toLowerCase();

            return null;
        }

        _params(obj)
        {
            var s = [];

            for (var key in obj)
            {
                s.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
            }

            return s.join('&');
        }
    }

    Container.set('Ajax', _Ajax);

})();
