(function() {

    var defaults = {
        elements: {
            area: '.scrollbar-area',
            wrapper: '.scrollbar-wrapper',
            track: '.scrollbar-track',
            handle: '.scrollbar-handle'
        },
        stateClasses: {
            dragging: 'scrollbar-dragging',
            hover: 'scrollbar-hover'
        }
    };

    // SCROLLBAR HANDLER
    /*****************************************/
    function Scrollbar(element, opts) {

        // handle constructor call without `new` keyword
        if (!(this instanceof Scrollbar))  return new Scrollbar(element, opts);

        // is plugin already initialized?
        if (this.el) {
            return;
        }

        this.el = element;
        this.opts = extend({}, defaults, opts || {});

        this._setupElements();

        // check if browser has physical scrollbars (usually desktop)
        if (this.scrollbarWidth = getScrollbarWidth()) {
            this._enableTrack();

            this._observeHover(this.area);
            this._observeHover(this.track);
            this._enableScroll();
            this._enableDragging();

            this.refresh();
        } else {
            this._allowNativeScroll();
        }

        return this;
    }

    // PUBLIC API
    /*****************************************/
    /**
     * Destroys plugin instance.
     */
    Scrollbar.prototype.destroy = function() {
        var stateClasses = this.opts.stateClasses;

        this._removeAllListeners();

        this.wrapper.style.overflowY = '';
        this.wrapper.style.marginRight = '';
        this.track.style.display = '';

        removeClass(document.body, stateClasses.dragging);
        removeClass(this.area, stateClasses.dragging);
        removeClass(this.area, stateClasses.hover);
        removeClass(this.track, stateClasses.hover);

        delete this.el;
    }

    /**
     * Refreshes scrollbar by adjusting its handle's height and position.
     */
    Scrollbar.prototype.refresh = function() {
        var newRatio;

        if (!this.el || this.isNative()) {
            return;
        }
        
        if (this.wrapper.scrollHeight > this.wrapper.offsetHeight) {
            this.track.style.display = 'block';

            newRatio = this.track.offsetHeight / this.wrapper.scrollHeight;

            if (newRatio !== this.ratio) {
                this.ratio = newRatio;

                this._resizeHandle();
                this._positionHandle();
            }
        } else {
            this.track.style.display = 'none';
        }
    }

    /**
     * Checks if native scroll is enabled.
     *
     * @returns {Boolean}
     */
    Scrollbar.prototype.isNative = function() {
        return !this.scrollbarWidth;
    }

    // PRIVATE API
    /*****************************************/
    /**
     * Sets up elements.
     *
     * @private
     */
    Scrollbar.prototype._setupElements = function() {
        var elements = this.opts.elements;

        this.area = this.el.querySelector(elements.area);
        this.wrapper = this.el.querySelector(elements.wrapper);
        this.handle = this.el.querySelector(elements.handle);
        this.track = this.el.querySelector(elements.track);
    }

    /**
     * Observes when element is hovered and toggles corresponding class.
     *
     * @param {HTMLElement} element
     * @private
     */
    Scrollbar.prototype._observeHover = function(element) {
        var cls = this.opts.stateClasses.hover;

        this._addListener(element, 'mouseenter', function() {
            addClass(element, cls);
        });
        this._addListener(element, 'mouseleave', function() {
            removeClass(element, cls);
        });
    },

    /**
     * Enables scroll by overflowing native scrollbar and starting to listen to `scroll` event.
     *
     * @private
     */
    Scrollbar.prototype._enableScroll = function() {
        this._addListener(this.wrapper, 'scroll', bind(this._positionHandle, this));
    }

    /**
     * Enables handle's dragging along the track.
     *
     * @private
     */
    Scrollbar.prototype._enableDragging = function() {
        var cls = this.opts.stateClasses.dragging,
            initialPosition = null,
            initialTop = null,
            startDragging,
            stopDragging;

        this._addListener(this.handle, 'mousedown', bind(function(e) {
            initialPosition = this.wrapper.scrollTop;
            initialTop = e.clientY;

            this._addListener(document, 'mousemove', startDragging);
            this._addListener(document, 'mouseup', stopDragging);
        }, this));

        startDragging = bind(function(e) {
            var newPosition,
                wrapperHeight,
                wrapperInnerHeight;

            if (initialTop !== null) {
                newPosition = Math.round(initialPosition + (e.clientY - initialTop) / this.ratio);

                wrapperHeight = this.wrapper.offsetHeight;
                wrapperInnerHeight = this.wrapper.scrollHeight;

                if (newPosition + wrapperHeight > wrapperInnerHeight) {
                    newPosition = wrapperInnerHeight - wrapperHeight;
                }

                this.wrapper.scrollTop = newPosition;
                this._positionHandle();

                addClass(document.body, cls);
                addClass(this.area, cls);
            }
        }, this);

        stopDragging = bind(function() {
            initialTop = null;
            initialPosition = null;

            removeClass(document.body, cls);
            removeClass(this.area, cls);

            this._removeListener(document, 'mousemove', startDragging);
            this._removeListener(document, 'mouseup', stopDragging);
        }, this);
    }

    /**
     * Enables track.
     *
     * @private
     */
    Scrollbar.prototype._enableTrack = function() {
        this.wrapper.style.overflowY = 'scroll';
        this.wrapper.style.marginRight = -1 * this.scrollbarWidth + 'px';
    }

    /**
     * Allows native scrolling by making sure that div is scrollable.
     *
     * @private
     */
    Scrollbar.prototype._allowNativeScroll = function() {
        this.wrapper.style.overflowY = 'auto';
    }

    /**
     * Resizes handle by adjusting its `height`.
     *
     * @private
     */
    Scrollbar.prototype._resizeHandle = function() {
        this.handle.style.height = Math.ceil(this.ratio * this.track.offsetHeight) + 'px';
    }

    /**
     * Positions handle by adjusting its `top` position.
     *
     * @private
     */
    Scrollbar.prototype._positionHandle = function() {
        var wrapperTop = this.wrapper.scrollTop,
            top;

        if (wrapperTop + this.wrapper.offsetHeight < this.wrapper.scrollHeight) {
            top = Math.ceil(this.ratio * this.wrapper.scrollTop);
        } else {
            // if scroll position has reached the end, force scrollbar to track's end
            top = this.track.offsetHeight - this.handle.offsetHeight;
        }

        this.handle.style.top = top + 'px';
    }

    /**
     * Adds event listener and keeps track of it.
     *
     * @param {HTMLElement} element
     * @param {String}      eventName
     * @param {Function}    handler
     * @private
     */
    Scrollbar.prototype._addListener = function(element, eventName, handler) {
        var events = this._events;

        if (!events) {
            this._events = events = {};
        }
        if (!events[eventName]) {
            events[eventName] = [];
        }

        events[eventName].push({
            element: element,
            handler: handler
        });

        addEventListener.apply(null, arguments);
    }

    /**
     * Removes event listener.
     *
     * @param {HTMLElement} element
     * @param {String}      eventName
     * @param {Function}    handler
     * @private
     */
    Scrollbar.prototype._removeListener = function(element, eventName, handler) {
        var event = this._events[eventName],
            index,
            total;

        for (index = 0, total = event.length; index < total; index++) {
            if (event[index].handler === handler) {
                event.splice(index, 1);
                removeEventListener.apply(null, arguments);
                break;
            }
        }
    }

    /**
     * Removes all event listeners.
     *
     * @private
     */
    Scrollbar.prototype._removeAllListeners = function() {
        var events = this._events,
            eventName,
            event,
            iter,
            total;

        for (eventName in events) {
            event = events[eventName];

            for (iter = 0, total = event.length; iter < total; iter++) {
                removeEventListener(event[iter].element, eventName, event[iter].handler);
            }
        }

        delete this._events;
    }

    // HELPER FUNCTIONS
    /*****************************************/
    function bind(fn,context){return function(){fn.apply(context,arguments);};}function extend(){var iter;for(iter=1;iter<arguments.length;iter++){var key;for(key in arguments[iter]){if(arguments[iter].hasOwnProperty(key)){arguments[0][key]=arguments[iter][key];}}}return arguments[0];}function addEventListener(el,eventName,handler){if(el.addEventListener){el.addEventListener(eventName,handler);}else{el.attachEvent("on"+eventName,handler);}}function removeEventListener(el,eventName,handler){if(el.removeEventListener){el.removeEventListener(eventName,handler);}else{el.detachEvent("on"+eventName,handler);}}function addClass(el,className){if(el.classList){el.classList.add(className);}else{el.className+=" "+className;}}function removeClass(el,className){if(el.classList){el.classList.remove(className);}else{el.className=el.className.replace(new RegExp("(^|\\b)"+className.split(" ").join("|")+"(\\b|$)","gi")," ");}}function getScrollbarWidth(){var wrapper=document.createElement("div"),content=document.createElement("div"),width;wrapper.style.position="absolute";wrapper.style.top="-50px";wrapper.style.height="50px";wrapper.style.overflow="scroll";wrapper.appendChild(content);document.body.appendChild(wrapper);width=wrapper.offsetWidth-content.offsetWidth;document.body.removeChild(wrapper);return width;}

    Modules.set('Scrollbar', Scrollbar);

})();


// AUTO LOAD SCROLLBARS
/*****************************************/
(function() {

    // REQUIRES
    /*****************************************/
    var Helper = Modules.require('JSHelper');

    // MODULE
    /*****************************************/
    var AutoScrollBars = function() {
        
        this._nodes    = [];
        this._handlers = [];
        this.__construct();

        return this;
    };

     // CONSTRUCTOR
    /*****************************************/
    AutoScrollBars.prototype.__construct = function() {
        
        // Find nodes
        this._nodes = Helper.$All('.js-custom-scroll');

        // If nothing to do destruct straight away
        if (!this._nodes.length) {
            this.desctruct();
            return;
        }

        // Bind DOM listeners
        for (var i = 0; i < this._nodes.length; i++) {
            this._invoke(this._nodes[i]);
        }
    }

    // DESTRUCTOR
    /*****************************************/
    AutoScrollBars.prototype.desctruct = function() {
        for (var i = 0; i < this._handlers.length; i++) {
            this._handlers[i].destroy();
        }
        this._nodes    = [];
        this._handlers = [];
    }

    // INVOKER
    /*****************************************/
    AutoScrollBars.prototype._invoke = function(el) {
        if (Helper.hasClass(el, 'js-auto-scroll-invoked')) {
            var handler = Modules.require('Scrollbar', el);
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
        var handler = Modules.require('Scrollbar', el);
        this._handlers.push(handler);
        Helper.addClass(el, 'js-auto-scroll-invoked');
    }

    // CHECK IF A DROPDOWN NEEDS TO BE SCROLLED 
    // THIS FUNCTION MAKES IT SO MAX-HEIGHT CAN BE USED
    /*****************************************/
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



    // REFRESH
    /*****************************************/
    AutoScrollBars.prototype.refresh = function(elem) {
        for (var i = 0; i < this._handlers.length; i++) {
            var handler = this._handlers[i];
            if (handler.el === elem) handler.refresh();
        }
    }

    // DESTROY
    /*****************************************/
    AutoScrollBars.prototype.destroy = function(elem) {
        var i = this._handlers.length;
        while (i--) {
            var handler = this._handlers[i];
            if (handler.el === elem) handler.destroy();
            this._handlers.splice(i, 1);
        }
    }
    
    // GET HANDLER
    /*****************************************/
    AutoScrollBars.prototype.getHandler = function(elem) {
        for (var i = 0; i < this._handlers.length; i++) {
            var handler = this._handlers[i];
            if (handler.el === elem) return handler;
        }
    }

    // PUSH TO MODULES AND INVOKE
    /*****************************************/

    Modules.singleton('AutoScrollBars', AutoScrollBars).require('AutoScrollBars');

})();