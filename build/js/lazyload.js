(function()
{
    var LAZY_FALLBACK_IMAGE = typeof LAZY_FALLBACK_IMAGE === 'undefined' ? "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMiAzMiIgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSJ3aGl0ZSI+CiAgPHBhdGggZD0iTTAgNCBMMCAyOCBMMzIgMjggTDMyIDQgeiBNNCAyNCBMMTAgMTAgTDE1IDE4IEwxOCAxNCBMMjQgMjR6IE0yNSA3IEE0IDQgMCAwIDEgMjUgMTUgQTQgNCAwIDAgMSAyNSA3Ij48L3BhdGg+Cjwvc3ZnPg==" : LAZY_FALLBACK_IMAGE;

    /**
     * JS Async Queue
     *
     * @see https://medium.com/@griffinmichl/asynchronous-javascript-queue-920828f6327
     */
    var Queue = function(concurrency)
    {
        this.running     = 0;
        this.concurrency = concurrency;
        this.taskQueue   = [];
        
        return this;
    }

    Queue.prototype.add = function(task)
    {
        if (this.running < this.concurrency)
        {
            this._runTask(task);
        }
        else
        {
            this._enqueueTask(task);
        }
    }

    Queue.prototype.next = function()
    {        
        this.running--;

        if (this.taskQueue.length > 0)
        {
            this._runTask(this.taskQueue.shift());
        }
    }

    Queue.prototype._runTask = function(task)
    {       
        this.running++;

        task(this);
    }

    Queue.prototype._enqueueTask = function(task)
    {
        this.taskQueue.push(task);
    }

    /**
     * Module constructor
     *
     * @access public
     * @constructor
     * @return this
     */
    var LazyLoad = function()
    {
        this._queue = new Queue(15);

        this._images = Array.prototype.slice.call(document.querySelectorAll('.js-lazyload'));
        
        this._bind();

        return this;
    }

    /**
     * Destroy
     *
     * @access public
     */
    LazyLoad.prototype.destruct = function()
    {       
        this._images = [];
    }

    /**
     * Refresh
     *
     * @access public
     */
    LazyLoad.prototype.refresh = function()
    {
        this._queue = new Queue(15);
        
        this._images = Array.prototype.slice.call(document.querySelectorAll('.lazyload'));

        this._bind();
    }

    /**
     * Bind and load images
     *
     * @access private
     */
    LazyLoad.prototype._bind = function()
    {
        for (var i = 0; i < this._images.length; i++)
        {
            this._handleImage(this._images[i]);
        }
    }

    /**
     * Bind and load images
     *
     * @access private
     * @param  node    img Image node element
     */
    LazyLoad.prototype._handleImage = function(node)
    {
        var url = this._getSrc(node);

        if (this._canLoad(node))
        {
            this._loadImage(node, url, this._isImage(node));
        }
    }

    /**
     * Bind and load images
     *
     * @access private
     * @param  node    node    DOM node
     * @param  string  url     The image URL to load
     * @param  bool    isImage Is the node an <img> tag
     */
    LazyLoad.prototype._loadImage = function(node, url, isImage)
    {
        // Placeholder and image are the same
        if (isImage && node.src === url)
        {
            this._markLoaded(node);
        }
        else
        {
            this._queue.add(this._getLoadFunc(node, url, isImage));
        }
    }

    /**
     * Return the image load function
     *
     * @access private
     * @param  node    node       DOM node
     * @param  string  url        The image URL to load
     * @param  bool    isImage    Is the node an <img> tag?
     * @return function
     */
    LazyLoad.prototype._getLoadFunc = function(node, url, isImage)
    {
        const _this = this;

        return function loadImage(queue)
        {
            var _image = new Image();

            _image.onload = function()
            {
                if (isImage)
                {
                    node.src = url;
                }
                else
                {
                    node.style.backgroundImage = 'url('+ url +')';
                }

                _this._markLoaded(node);

                _image.onload  = {};
                _image.onerror = {};
                
                queue.next();
            };

            _image.onerror = function()
            {
                if (isImage)
                {
                    node.src = LAZY_FALLBACK_IMAGE;
                }
                else
                {
                    node.style.backgroundImage = 'url('+ LAZY_FALLBACK_IMAGE +')';
                }

                _this._markFailed(node);

                queue.next();

                _image.onload  = {};
                _image.onerror = {};
            };

            _image.src = url;
        };
    }

    /**
     * Mark node as loaded
     *
     * @access private
     * @param  node    node Image node element
     * @return string
     */
    LazyLoad.prototype._markFailed = function(node)
    {
        node.classList.add('failed');

        this._markLoaded(node);
    }

    /**
     * Mark node as loaded
     *
     * @access private
     * @param  node    node Image node element
     * @return string
     */
    LazyLoad.prototype._markLoaded = function(node)
    {
        node.classList.add('lazy-loading');

        node.removeAttribute('data-src');

        const _this = this;

        setTimeout(() => _this._loadedComplete(node), 1500);
    }

    /**
     * Mark node as loaded
     *
     * @access private
     * @param  node    node Image node element
     * @return string
     */
    LazyLoad.prototype._loadedComplete = function(node)
    {
        node.classList.add('lazy-loaded');

        node.classList.remove('lazy-loading');
    }

    /**
     * Get an image's src attribute
     *
     * @access private
     * @param  node    node Image node element
     * @return string
     */
    LazyLoad.prototype._getSrc = function(node)
    {
        return node.getAttribute('data-src') || node.dataset.src;
    }

    /**
     * Should we load this image
     *
     * @access private
     * @param  node    node Image node element
     * @return bool
     */
    LazyLoad.prototype._canLoad = function(node)
    {
        return typeof this._getSrc(node) !== 'undefined' && (!node.classList.contains('lazy-loading') || !node.classList.contains('lazy-loaded'));
    }

    /**
     * Is node an image
     *
     * @access private
     * @param  node    node Image node element
     * @return bool
     */
    LazyLoad.prototype._isImage = function(node)
    {
        return node.nodeName.toLowerCase() === 'img';
    }

    // Invoke and start loading images
    var lazy = new LazyLoad();

    // Listen for HubbleReady and register into dom
    // Will no be invoked unless dom().refresh() is called
    const AddModule = function(e)
    {

        Container.Hubble().dom().register('LazyLoad', LazyLoad, false);

        window.removeEventListener('HubbleReady', AddModule);
    }

    window.addEventListener('HubbleReady', AddModule);

})();