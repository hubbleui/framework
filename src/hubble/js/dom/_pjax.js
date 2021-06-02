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
    var Chain = function()
    {
        var n = {},
            t = null,
            r = this,
            e = {},
            o = [],
            i = [],
            u = function(f, t)
            {
                return n[f] || (n[f] = []), n[f].push(t), e
            },
            p = function(t, r)
            {
                if (n[t])
                    for (var o = 0; f = n[t][o]; o++) f(r, e)
            },
            l = function()
            {
                if (arguments.length > 0)
                {
                    o = [];
                    for (var n = 0; r = arguments[n]; n++) o.push(r);
                    var f = o.shift();
                    if ("function" == typeof f) f(t, e);
                    else if ("object" == typeof f && f.length > 0)
                    {
                        var r = f.shift();
                        r.apply(r, f.concat([e.next]))
                    }
                }
                else p("done", t);
                return e
            },
            a = function()
            {
                return arguments.length > 0 && (2 === arguments.length && "string" == typeof arguments[0] && "function" == typeof arguments[1] ? u.apply(self, arguments) : l.apply(self, arguments)), a
            };
        return e = {
            on: u,
            off: function(t, r)
            {
                if (n[t])
                {
                    for (var o = [], i = 0; f = n[t][i]; i++) f !== r && o.push(f);
                    n[t] = o
                }
                return e
            },
            next: function(n)
            {
                t = n, l.apply(r, o)
            },
            error: function(n)
            {
                return void 0 !== n ? (i.push(n), e) : i
            }
        }, a
    };

    /**
     * DOM parser pollyfill (legacy support)
     * 
     * @var obj
     * @source https://gist.github.com/1129031
     */
    (function(DOMParser)
    {
        var DOMParser_proto = DOMParser.prototype,
            real_parseFromString = DOMParser_proto.parseFromString;
        try
        {
            if ((new DOMParser).parseFromString("", "text/html"))
            {
                return;
            }
        }
        catch (ex)
        {}
        DOMParser_proto.parseFromString = function(markup, type)
        {
            if (/^\s*text\/html\s*(?:;|$)/i.test(type))
            {
                var doc = document.implementation.createHTMLDocument(""),
                    doc_elt = doc.documentElement,
                    first_elt;
                doc_elt.innerHTML = markup;
                first_elt = doc_elt.firstElementChild;
                if (doc_elt.childElementCount === 1 && first_elt.localName.toLowerCase() === "html")
                {
                    doc.replaceChild(first_elt, doc_elt);
                }
                return doc;
            }
            else
            {
                return real_parseFromString.apply(this, arguments);
            }
        };
    }(DOMParser));

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
        _invoked = false;
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
            var _content = this._cacheGet(url + '____content');
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
                {
                    id: window.location.href
                },
                document.title,
                window.location.href
            );
        }

        // Create a new location object
        var newLocation = {
            location: url,
            target: target,
            title: title,
            scroll:
            {
                left: 0,
                top: 0
            },
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
                    {
                        id: url
                    },
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

            }, [
            {
                'X-PJAX': true
            }]);
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
            var targetEl = document.body;
            var domTarget = domCotent.body;
        }
        else
        {
            var targetEl = document.getElementById(locationObj['target']);
            var domTarget = domCotent.getElementById(locationObj['target']);
        }

        // Cache the current document scripts to compare
        var currScripts = this._filterScripts(Array.prototype.slice.call(document.getElementsByTagName('script')));
        var newScripts = this._filterScripts(Array.prototype.slice.call(domCotent.getElementsByTagName('script')));

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
                        {
                            id: locationObj.location
                        },
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
            var _content = _this._cacheGet(e.state.id + '____content');
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
        var newScripts = this._filterScripts(Array.prototype.slice.call(domCotent.getElementsByTagName('script')));

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
                script.type = 'text/javascript';
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

                result.push(
                {
                    'src': true,
                    'inline': false,
                    'content': src
                });
            }
            else
            {
                // Don't append JSON inline scripts
                if (Helper.isJSON(nodes[i].innerHTML.trim()))
                {
                    continue;
                }

                result.push(
                {
                    'src': false,
                    'inline': true,
                    'content': nodes[i].innerHTML.trim()
                });
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
        var doc = document.documentElement;
        var top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
        var left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
        return {
            top: top,
            left: left
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

        _cache.push(
        {
            key: key,
            value: value
        });
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

        var _location = {
            location: window.location.href,
            target: 'document-body',
            title: document.title,
            scroll: this._getScrollPos(),
        };
        this._cachePut(window.location.href + '____location', _location);
        this._cachePut(window.location.href + '____content', content);
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
