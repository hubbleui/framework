/**
 * Scrollbars
 *
 * This module uses the "vendor/scrollbars.js" module to handle the scroll
 * events. This module itself handles the activation and injection of the 
 * required nodes for the module to function.
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
     * @params null
     * @access public
     * @return this
     */
    var AutoScrollBars = function() {
        
        this._nodes    = [];
        this._handlers = [];

        // Find nodes
        this._nodes = Helper.$All('.js-custom-scroll');

        // Bind DOM listeners
        if (!Helper.empty(this._nodes)) {
            for (var i = 0; i < this._nodes.length; i++) {
                this._invoke(this._nodes[i]);
            }
        }
        
        return this;
    };

    /**
     * Module destructor - removes handler
     *
     * @params null
     * @access public
     */
    AutoScrollBars.prototype.desctruct = function() {
        for (var i = 0; i < this._handlers.length; i++) {
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
    AutoScrollBars.prototype._invoke = function(el) {
        if (Helper.hasClass(el, 'js-auto-scroll-invoked')) {
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
        for (var i = 0; i < children.length; i++) {
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
    AutoScrollBars.prototype._needsScroller = function(el) {
        var computedStyle = window.getComputedStyle(el);

        // Is the element hidden?
        var isHidden      = el.offsetParent === null;
        var hiddenEl      = false;
        var inlineDisplay = false;
        var needsScroller = false;

        if (isHidden) {
            if (computedStyle.display === 'none') {
                hiddenEl = el;
            }
            else {
                var parent = el;
                while (parent !== document.body) {
                    parent = parent.parentNode;
                    var parentStyle = window.getComputedStyle(parent);
                    if (parentStyle.display === 'none') {
                        hiddenEl = parent
                        break;
                    }
                }
            }
        }

        // Make visible
        if (hiddenEl) {
            inlineDisplay = hiddenEl.style.display;
            hiddenEl.style.display = 'block';
        }
        var endHeight = el.scrollHeight - parseInt(computedStyle.paddingTop) - parseInt(computedStyle.paddingBottom) + parseInt(computedStyle.borderTop) + parseInt(computedStyle.borderBottom);
        endHeight     = parseInt(endHeight);
        if (endHeight > el.offsetHeight) {
            needsScroller   = true;
            el.style.height = el.offsetHeight+'px';
        }
        // Make invisible
        if (hiddenEl) {
            if (inlineDisplay) {
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
     * @example Container.get('AutoScrollBars').refresh(node) // Node = $.('.js-custom-scroll');
     */
    AutoScrollBars.prototype.refresh = function(elem) {
        for (var i = 0; i < this._handlers.length; i++) {
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
    AutoScrollBars.prototype.destroy = function(elem) {
        var i = this._handlers.length;
        while (i--) {
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
    AutoScrollBars.prototype.getHandler = function(elem) {
        for (var i = 0; i < this._handlers.length; i++) {
            var handler = this._handlers[i];
            if (handler.el === elem) return handler;
        }
    }

    // Load into hubble DOM core
    Container.get('Hubble').dom().register('AutoScrollBars', AutoScrollBars);

})();