(function()
{
    /**
     * Helper functions.
     * 
     * @var {Function}
     */
    const [find, find_all, on, each, map, in_array, in_dom, is_empty, is_string, scroll_pos, trigger_event, normalize_url, inner_HTML, extend] = FrontBx.import(['find','find_all','on','each','map','in_array','in_dom','is_empty','is_string','scroll_pos','trigger_event','normalize_url','inner_HTML','extend']).from('_');

    /**
     * Are we listening for state changes ?
     * 
     * @var {bool}
     */
    var _listening = false;

    /**
     * Default options
     * 
     * @var {object}
     */
    const DEFAULT_OPTIONS = 
    {
        element:   'body',
        cacheBust:  true,
        once:       false,
        keepScroll: true,
        pushstate:  false,
        urlhash:    false,
    };

    /**
     * Pjax module
     *
     * @class
     * @extends   {Ajax}
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.comfrontbx/uimaster/LICENSE}
     */
    const Pjax = function()
    {
        this.super();

        if (!_listening)
        {
            on(window, 'popstate', this._popStateHandler, this);

            _listening = true;
        }
    }

    Pjax.prototype.request = function(url, options, success, error, complete, abort, headers)
    {
        // If we are already loading a pjax, cancel it and
        if (this._xhr) this.abort();

        // Reset variables
        this._reset();

        // Merge options with defaults
        options = typeof options === 'undefined' ? { ...DEFAULT_OPTIONS } : { ...DEFAULT_OPTIONS, ...options };

        // Set PJAX header
        this.headers({'X-PJAX': true});

        // Store URL in options for callbacks
        options.url = normalize_url(url.trim());

        // Default data to send
        let data = options.cacheBust ? { t: Date.now().toString() } : {};
        
        // Fire the start event
        trigger_event(window, 'FrontBx:Pjax:start', { options });

        // Set response handlers
        this._setResponseHandlers('GET', options.url, data, success, error, complete, abort, headers);

        // Cache callbacks
        const [_success, _error, _complete, _abort ] = [this.success, this.error, this.complete, this.abort];

        // Cache current state
        if (options.pushstate)
        {            
            let state = { ...options, id: normalize_url(window.location.href), scroll: {top: 0, left: 0} };

            window.history.pushState(state, '', state.id);
        }

        FrontBx.NProgress().start();

        this.success((response) =>
        {            
            this._handleSuccess(response.trim(), options);

            if (_success) this._makeCallback(_success, this._xhr, [response]);
        })
        .error((response) =>
        {
            trigger_event(window, 'FrontBx:Pjax:error', { options });

            if (_error) this._makeCallback(_error, this._xhr, [response]);
        })
        .abort((response) =>
        {
            rigger_event(window, 'FrontBx:Pjax:abort', { options });

            if (_abort) this._makeCallback(_abort, this, [response, false]);
        })
        .complete((response, successfull) =>
        {
            if (_complete) this._makeCallback(_complete, this._xhr, [response, successfull]);

            this._reset();

            FrontBx.NProgress().done();

        })._call();
    }

    /**
     * Pjax success handler
     *
     * @access {private}
     * @param  {object} locationObj Location object from the cache
     * @param  {string} HTML        HTML string response from server
     * @param  {bool}   stateChange Change the window history state
     */
    Pjax.prototype._handleSuccess = function(HTML, options)
    {        
        // Parse the HTML
        let responseDoc = this._parseHTML(HTML);

        // Cache scripts
        let descrMeta       = find('meta[name=description]');
        let responseTitle   = this._findDomTitle(responseDoc);
        let responseDesc    = this._findDomDesc(responseDoc);
        let responseScripts = this._getScripts(responseDoc);
        let currScripts     = this._getScripts(document);
        responseDoc         = this._removeScripts(responseDoc);

        // Move scripts to head incase we're replacing body
        //each(currScripts, (i, script) => { if (script.node.parentNode.nodeName.toLowerCase() !== 'head') find('head').appendChild(script.node); });

        // Default to document bodys
        let targetEl        = document.body;
        let responseEl      = responseDoc.body;

        // Selector
        if (is_string(options.element))
        {
            targetEl = find(options.element);
        }
        // DOM Node
        else if (in_dom(options.element))
        {
            // Target is options.element
            targetEl = options.element;
        }

        // Push new state
        if (options.pushstate)
        {
            if (responseTitle) document.title = responseTitle;

            if (responseDesc && descrMeta) descrMeta.content = responseDesc;
        
            let state = { ...options, id: options.url, scroll: { top: 0, left: 0 } };

            window.history.pushState(state, '', options.url);
        }
        // Adjust hash
        else if (options.urlhash && targetEl !== document.body)
        {
            let url = window.location.href.split('#').shift();

            window.history.replaceState({}, '', `${url}#${targetEl.id}`);
        }

        // Insert content
        inner_HTML(targetEl, responseEl.innerHTML);

        this._appendScripts(currScripts, responseScripts, () =>
        {
            FrontBx.dom().refresh(targetEl === document.body ? document : targetEl);

            trigger_event(window, 'FrontBx:Pjax:success', {options});
        });

        if (!options.keepScroll || targetEl === document.body) window.scrollTo(0, 0);
    }

    /**
     * State change event handler (back/forward clicks)
     *
     * Popstate is treated as another pjax request essentially
     * 
     * @access {private}
     * @param  {e}       event JavaScript 'popstate' event
     */
    Pjax.prototype._popStateHandler = function(e)
    {
        // State obj exists 
        if (e.state && typeof e.state.id !== 'undefined')
        {
            // Prevent default
            e.preventDefault();

            let options = e.state;

            this.request(options.id, {...options, pushstate: false });

            return false;
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
    Pjax.prototype._appendScripts = function(currScripts, newScripts, callback)
    {
        let scripts = map(newScripts, (i, script) =>
        {
            let ret = script;

            each(currScripts, (i, cScript) =>
            {
                if (cScript.content === script.content && cScript.inline === script.inline)
                {
                    ret = false;

                    return;
                }
            })

            return ret;
        });

        if (scripts.length > 0) 
        {
            return each(scripts, (i, script) =>  this._appendScript(script, i === scripts.length -1 ? callback : null));
        }

        callback();
    }

    Pjax.prototype._appendScript = function(scriptObj, callback)
    {
        let element = document.createElement(scriptObj.type);

        element.type = scriptObj.type === 'script' ? 'text/javascript' : 'text/css';

        if (scriptObj.type === 'script')
        {
            element.async = false;

            if (!scriptObj.inline)
            {
                element.src = scriptObj.src;

                if (callback) element.onload = () => callback();
            }
            else
            {
                element.innerHTML = scriptObj.src;

                if (callback) callback();
            }
        }
        else
        {
            element.rel = 'stylesheet';
            
            element.href = scriptObj.src;

            if (callback) element.onload = () => callback();
        }

        find('head').appendChild(element);
    }

    /**
     * Filter scripts with unique key/values into an array
     *
     * @access {private}
     * @param  {string} html HTML as a string (with or without full doctype)
     * @return {array}
     */
    Pjax.prototype._getScripts = function(doc)
    {
        var ret     = [];
        var scripts = find_all('script, link[rel=stylesheet]', doc);

        each(scripts, function(i, script)
        {
            let type   = script.nodeName.toLowerCase();
            let src    = type === 'link' ? script.getAttribute('href') : script.getAttribute('src');
            let inline = false; 
            let node   = script;

            if (!src)
            {
                inline = true;
                src = script.innerHTML.trim()
            }

            ret.push({type, src, inline, node });
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
    Pjax.prototype._removeScripts = function(doc)
    {
        var scripts = find_all('script, link[rel=stylesheet]', doc);

        each(scripts, (i, script) => script.parentNode.removeChild(script));

        return doc;
    }

    /**
     * Try to find the page title in a DOM tree
     *
     * @access {private}
     * @param  {string} html HTML as a string (with or without full doctype)
     * @return {string|false}
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
     * Try to find the page title in a DOM tree
     *
     * @access {private}
     * @param  {string} html HTML as a string (with or without full doctype)
     * @return {string|false}
     */
    Pjax.prototype._findDomDesc = function(DOM)
    {
        var desc = find('meta[name=description]', DOM);

        if (desc)
        {
            return desc.content.trim();
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
    Pjax.prototype._parseHTML = function(html)
    {
        var parser = new DOMParser();

        return parser.parseFromString(html, 'text/html');
    }

    // Pjax is singleton
    FrontBx.singleton('Pjax', extend(FrontBx.Ajax().constructor, Pjax));

})();