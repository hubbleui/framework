(function()
{
    /**
     * JS Helper
     * 
     * @var {obj}
     */
    const Helper = Container.Helper();

    /**
     * AJAX Module
     * 
     * @var {obj}
     */
    var Ajax = Hubble.require('Ajax');

    /**
     * AJAX URL to list paginated reviews
     * 
     * @var {string}
     */
    var _urlBase = window.location.origin;

    /**
     * Has pjax been invoked
     * 
     * @var {bool}
     */
    var _invoked = false;

    /**
     * Are we listening for state changes ?
     * 
     * @var {bool}
     */
    var _listening = false;

    /**
     * Are we currently loading a pjax request ?
     * 
     * @var {bool}
     */
    var _requesting = false;

    /**
     * Default options
     * 
     * @var {object}
     */
    var _defaults = 
    {
        element:   'body',
        timeout :   10000,
        cacheBust:  true,
        keepScroll: false,
        animation:  'fade',
        progress:   true,
    };

    /**
     * Pjax module
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE}
     */
    class Pjax
    {
        /**
         * Module constructor
         *
         * @constructor
         {*} @access public
         */
        constructor()
        {
            if (!_invoked)
            {
                this._bind();
            }

            return this;
        }

        /**
         * Module destructor - unbinds events
         *
         * @access {public}
         */
        destruct()
        {
            _invoked = false;
            _listening = false;

            window.removeEventListener('popstate', this._popStateHandler, false);
        }

        /**
         * Bind events
         *
         * @access {public}
         */
        _bind()
        {
            _invoked   = true;
            _listening = true;

            window.addEventListener('popstate', this._popStateHandler, false);
        }

        /**
         * Start a pjax request
         *
         * @access {public}
         * @param  {string}            url                The url to send the request to
         * @param  {object|null}       options            Options (optional)
         * @param  {string|DOMElement} options.element    Can be a selector or an existing dom element to replace content into (optional) (default 'body')
         * @param  {bool}              options.keepScroll Weather to retain existing scroll position (optional) (default false) 
         * @param  {bool}              options.scroll_pos  If provided will scroll to position  
         * @param  {string}            options.animation  fade|undefined|null
         * @param  {bool}              options.progress   Use Nprogress on load
         * @param  {int}               options.timeout    Timeout in MS (optional) (default 10,000)
         * @param  {bool}              options.cacheBust  When set to true, Pjax appends a timestamp query string segment to the requested URL in order to skip the browser cache (optional) (default true)
         * @param  {function}          options.onError    Callback when error occurs (optional)
         * @param  {function}          options.onSuccess  Callback when success occurs (optional)
         * @param  {function}          options.onComplete Callback when complete occurs (optional)
         */
        invoke(url, options)
        {
            // If we are already loading a pjax, cancel it and
            if (_requesting)
            {
                this._ajax.abort();
            }

            // We are now loading
            _requesting = true;

            // Merge options with defaults
            options = (typeof options === 'undefined' ? _defaults : Helper.array_merge(_defaults, options));

            // Normalize the url
            url = this._normaliseUrl(url.trim());

            // Normalize current url
            var currUrl = this._normaliseUrl(window.location.href); 

            this._load(url, options);
        }

        /**
         * Send a pjax request
         *
         * @access {private}
         * @param  {string}            url                The url to send the request to
         * @param  {object|null}       options            Options (optional)
         * @param  {string|DOMElement} options.element    Can be a selector or an existing dom element to replace content into (optional) (default 'body')
         * @param  {string}            options.animation  fade|undefined|null
         * @param  {int}               options.timeout    Timeout in MS (optional) (default 10,000)
         * @param  {bool}              options.cacheBust  When set to true, Pjax appends a timestamp query string segment to the requested URL in order to skip the browser cache (optional) (default true)
         * @param  {function}          options.onError    Callback when error occurs (optional)
         * @param  {function}          options.onSuccess  Callback when success occurs (optional)
         * @param  {function}          options.onComplete Callback when complete occurs (optional)
         */
        _load(url, options)
        {
            // Store this
            var _this = this;

            // Cachebust
            if (options.cacheBust)
            {
                //@todo
                // url = this._cacheBustURL(url);
            }

            // Store URL in options for callbacks
            options.url = url;
            
            // Push the current state
            window.history.pushState( { id: currUrl, scroll: Helper.scroll_pos() }, '', currUrl);

            // Fire the start event
            Hubble.require('Events').fire('pjax:start', options);

            // Send GET request
            this._ajax = Ajax.get(url,
            function success(HTML)
            {
                // Handle the response
                _this._handleSuccess(HTML, options);
            },
            
            // Handle the error
            function error(error)
            {
                // Handle the error
                _this._handleError(HTML, options);

            }, [{'X-PJAX': true}]);
        }

        /**
         * Pjax success handler
         *
         * @access {private}
         * @param  {object} locationObj Location object from the cache
         * @param  {string} HTML        HTML string response from server
         * @param  {bool}   stateChange Change the window history state
         */
        _handleSuccess(HTML, options)
        {
            // Parse the HTML
            var responseDoc = this._parseHTML(HTML);

            // Try to get the title
            var _title = this._findDomTitle(responseDoc);

            // Cache scripts
            var responseScripts = this._getScripts(responseDoc);
            var currScripts     = this._getScripts(document);
            responseDoc         = this._removeScripts(responseDoc);

            // Default to document bodys
            var targetEl        = document.body;
            var responseEl      = responseDoc.body;

            // Was pjax supported?
            var pjaxSuported    = HTML.startsWith('<!DOCTYPE html>')

            // Selector
            if (Helper.is_string(options.element))
            {
                targetEl   = document.querySelector(options.element);
                responseEl = responseDoc.querySelector(options.element);
            }
            // DOM Node
            else if (Helper.in_dom(options.element))
            {
                // Target is options.element
                targetEl = options.element;
            }

            // Insert content
            targetEl.innerHTML = responseEl.innerHTML;

            _this._appendScripts(currScripts, newScripts, function then()
            {
                Hubble.require('Events').fire('pjax:success', options);
                Hubble.require('Events').fire('pjax:complete', options);

                _requesting = false;
            });
        }

        /**
         * Handle Pjax Error
         *
         * @access {private}
         * @param  {object} locationObj Location object from the cache
         */
        _handleError(HTML, options)
        {
            
            _requesting = false;
        }

        /**
         * Add the state change listener to use internal page cache
         * to prevent back/forward events if that state is cached here
         *
         * @access {private}
         */
        _stateListener()
        {
            if (!_listening)
            {
                window.addEventListener('popstate', this._popStateHandler);

                _listening = true;
            }
        }

        /**
         * State change event handler (back/forward clicks)
         *
         * Popstate is treated as another pjax request essentially
         * 
         * @access {private}
         * @param  {e}       event JavaScript 'popstate' event
         */
        _popStateHandler(e)
        {
            e = e || window.event;

            var _this = Hubble.require('Pjax');

            // State obj exists 
            if (e.state && typeof e.state.id !== 'undefined')
            {
                // Prevent default
                e.preventDefault();

                var stateObj = e.state;

                opts = array_merge(_defaults, { scroll_pos: stateObj.scroll, keepScroll: false });

                // Load entire body from cache
                _this._load(stateObj.id, _defaults);
            }
            else
            {
                history.back();
            }
        }

        /**
         * If there are any new scripts load them
         * 
         * Note that appending or replacing content via 'innerHTML' or even
         * native Nodes with scripts inside their 'innerHTML'
         * will not load scripts so we need to compare what scripts have loaded
         * on the current page with any scripts that are in the new DOM tree 
         * and load any that don't already exist
         *
         * @access {private}
         * @param  {array}   currScripts Currently loaded scripts array
         * @param  {object}  newScripts  Newly loaded scripts
         */
        _appendScripts(currScripts, newScripts, callback)
        {
            var newScripts = newScripts.filter(x => !Helper.in_array(x, currScripts));
            var complete  = !Helper.is_empty(newScripts);

            if (!complete)
            {
                Helper.foreach(newScripts, function(i, script)
                {
                    this._appendScript(script);
                });
            }
            else
            {
                callback();
            }
        }

        _appendScript(scriptObj)
        {
            // Create a new script
            var script   = document.createElement('script');
            script.type  = 'text/javascript';
            script.async = false;

            // Is this an inline script or a src ?
            if (scriptObj.inline === true)
            {
                script.innerHTML = scriptObj.content;
            }
            else
            {
                script.src = scriptObj.content;
                script.addEventListener('load', function()
                {
                    chain.next();
                });
            }

            // Append the new script
            document.body.appendChild(script);
        }


        /**
         * Filter scripts with unique key/values into an array
         *
         * @access {private}
         * @param  {string} html HTML as a string (with or without full doctype)
         * @return {array}
         */
        _getScripts(doc)
        {
            var ret     = [];
            var scripts = Array.prototype.slice.call(doc.getElementsByTagName('script'));

            Helper.foreach(scripts, function(i, script)
            {
                var src = script.getAttribute('src');

                if (src)
                {
                    // Remove the query string
                    src = src.split('?')[0];

                    ret.push(
                    {
                        'inline' : false,
                        'content': src
                    });
                }
                else
                {
                    ret.push(
                    {
                        'inline' : true,
                        'content': script.innerHTML.trim()
                    });
                }
            });

            return ret;
        }

        /**
         * Remove all scripts from a document
         *
         * @access {private}
         * @param  {Document} Document Document element
         * @return {Document}
         */
        _removeScripts(doc)
        {
            var scripts = Array.prototype.slice.call(doc.getElementsByTagName('script'));

            Helper.foreach(scripts, function(i, script)
            {
                script.parentNode.removeChild(script);
            });

            return doc;
        }

        /**
         * Try to find the page title in a DOM tree
         *
         * @access {private}
         * @param  {string} html HTML as a string (with or without full doctype)
         * @return {string|false}
         */
        _findDomTitle(DOM)
        {
            var title = DOM.getElementsByTagName('title');

            if (title.length)
            {
                return title[0].innerHTML.trim();
            }

            return false;
        }

        /**
         * Parse HTML from string into a document
         *
         * @access {private}
         * @param  {string} html HTML as a string (with or without full doctype)
         * @return {DOM} tree
         */
        _parseHTML(html)
        {
            var parser = new DOMParser();
            return parser.parseFromString(html, 'text/html');
        }

        /**
         * Normalises a url
         *
         * @access {private}
         * @param  {string}  url The url to normalise
         * @return {string}
         */
        _normaliseUrl(url)
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
    }
        
    // Load into Hubble DOM core
    Container.singleton('Pjax', Pjax);

})();
