/**
 * Popover handler
 *
 * This is a utility module for the popover component. This is used
 * by the popover module to build and position the popover element itself.
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
     * @params options obj
     * @access public
     * @return this
     */
    var _popHandler = function(options) {

        if (!(this instanceof _popHandler)) return new _popHandler(options);

        this.trigger      = options.target;
        this.options      = options;
        this.el           = this.buildPopEl();
        this.el.className = options.classes;
        this.animation    = false;

        if (options.animation === 'pop') {
            this.animation = 'popover-pop';
        }
        else if (options.animation === 'fade') {
            this.animation = 'popover-fade';
        }

        this.render = function() {
            this.el.style.opacity    = '0';
            this.el.style.visibility = 'hidden';
            document.body.appendChild(this.el);
            this.stylePop();
            this.el.style.removeProperty('opacity');
            this.el.style.removeProperty('visibility');
            this.el.classList.add(this.animation);
        }
        return this;
    }

    /**
     * Build the popover
     *
     * @params null
     * @access private
     */
    _popHandler.prototype.buildPopEl = function() {
        var pop       = document.createElement('div');
        pop.className = this.options.classes;
        if (typeof this.options.template === 'string') {
            pop.innerHTML = this.options.template;
        }
        else {
            pop.appendChild(this.options.template);
        }
        return pop;
    }

    /**
     * Remove the popover
     *
     * @params null
     * @access private
     */
    _popHandler.prototype.remove = function() {
        if (Helper.nodeExists(this.el)) this.el.parentNode.removeChild(this.el);
    }

    /**
     * Position the popover
     *
     * @params null
     * @access private
     */
    _popHandler.prototype.stylePop = function() {

        var targetCoords = Helper.getCoords(this.options.target);

        if (this.options.direction === 'top') {
            this.el.style.top  = targetCoords.top  - this.el.scrollHeight + 'px';
            this.el.style.left = targetCoords.left - (this.el.offsetWidth /2) + (this.options.target.offsetWidth/2) + 'px';
            return;
        }
        else if (this.options.direction === 'bottom') {
            this.el.style.top  = targetCoords.top  + this.options.target.offsetHeight + 10 + 'px';
            this.el.style.left = targetCoords.left - (this.el.offsetWidth /2) + (this.options.target.offsetWidth/2) + 'px';
            return;
        }
        else if (this.options.direction === 'left') {
            this.el.style.top  = targetCoords.top  - (this.el.offsetHeight/2) + (this.options.target.offsetHeight/2) + 'px';
            this.el.style.left = targetCoords.left - this.el.offsetWidth - 10 + 'px';
            return;
        }
        else if (this.options.direction === 'right') {
            this.el.style.top  = targetCoords.top  - (this.el.offsetHeight/2) + (this.options.target.offsetHeight/2) + 'px';
            this.el.style.left = targetCoords.left + this.options.target.offsetWidth + 10 + 'px';
            return;
        }
    }

    // Set into container for use
    Container.set('_popHandler', _popHandler);

}());

/**
 * Popovers
 *
 * This module handles the initiazling of the popovers, 
 * e.g parsing options, building the DOM nodes, and hanling the events.
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
     * @access public
     * @param null
     * @return this
     */
    var Popovers = function() {
        
        this._pops  = [];
        this._nodes = [];
        this._arrowClasses = {
            top    : 'arrow-s',
            left   : 'arrow-e',
            right  : 'arrow-w',
            bottom : 'arrow-n',
        };

        // Find nodes
        this._nodes = Helper.$All('.js-popover');

        // Bind events
        if (!Helper.empty(this._nodes))
        {
            for (var i = 0; i < this._nodes.length; i++)
            {
                this._initialise(this._nodes[i]);
            }
        }

        return this;
    };

    /**
     * Module destructor
     *
     * @access public
     * @return this
     */
    Popovers.prototype.destruct = function() {
        
        if (!Helper.empty(this._nodes))
        {
            for (var i = 0; i < this._nodes.length; i++)
            {
                this._unbind(this._nodes[i]);
            }
        }

        this._removeAll();

        this._nodes = [];
        
        this._pops  = [];
    }

    /**
     * Unbind event listeners on a trigger
     *
     * @param trigger node
     * @access private
     */
    Popovers.prototype._unbind = function(trigger)
    {
        var evnt = trigger.dataset.popoverEvent;

        if (evnt === 'click') {
            Helper.removeEventListener(trigger, 'click', this._clickHandler);
            window.removeEventListener('resize', this._windowResize);
        }
        else {
            Helper.removeEventListener(trigger, 'mouseenter', this._hoverOver);
            Helper.removeEventListener(trigger, 'mouseleave', this._hoverLeave);
        }
    }

    /**
     * Initialize the handlers on a trigger
     *
     * @param trigger node
     * @access private
     */
    Popovers.prototype._initialise = function(trigger) {
        var direction      = trigger.dataset.popoverDirection;
        var title          = trigger.dataset.popoverTitle;
        var content        = trigger.dataset.popoverContent;
        var type           = trigger.dataset.popoverType || '';
        var evnt           = trigger.dataset.popoverEvent;
        var animation      = trigger.dataset.popoverAnimate || 'pop';
        var target         = trigger.dataset.popoverTarget;
        var closeBtn       = evnt === 'click' ? '<span class="glyph-icon glyph-icon-cross3 js-remove-pop"></span>' : ''; 
        var pop            = '<h3 class="popover-title">'+title+closeBtn+'</h3><div class="popover-content"><p>'+content+'</p></div>';


        if (target) {
            pop = Helper.$('#'+target).cloneNode(true);
            pop.classList.remove('hidden');
        }

        var popHandler = Container.get('_popHandler', {
            target    :  trigger,
            direction :  direction,
            template  :  pop,
            animation :  animation,
            classes   : 'popover '+ direction +' '+ type +' arrow ' + this._arrowClasses[direction],
        });

        this._pops.push(popHandler);

        if (evnt === 'click') {
            Helper.addEventListener(trigger, 'click', this._clickHandler);
            window.addEventListener('resize', this._windowResize);
        }
        else {
            Helper.addEventListener(trigger, 'mouseenter', this._hoverOver);
            Helper.addEventListener(trigger, 'mouseleave', this._hoverLeave);
        }
    }

    /**
     * Hover over event handler
     *
     * @access private
     */
    Popovers.prototype._hoverOver = function() {
        var trigger    = this;
        var _this      = Container.get('Popovers');
        var popHandler = _this._getHandler(trigger);
        if (Helper.hasClass(trigger, 'popped')) return;
        popHandler.render();
        Helper.addClass(trigger, 'popped');
    }

    /**
     * Hover leave event handler
     *
     * @access private
     */
    Popovers.prototype._hoverLeave = function() {
        var trigger    = this;
        var _this      = Container.get('Popovers');
        var popHandler = _this._getHandler(trigger);
        if (!Helper.hasClass(trigger, 'popped')) return;
        popHandler.remove();
        Helper.removeClass(trigger, 'popped');
    }

    /**
     * Window resize event handler
     *
     * @access private
     */
    Popovers.prototype._windowResize = function() {
        var _this = Container.get('Popovers');
        for (var i = 0; i < _this._nodes.length; i++) {
            if (Helper.hasClass(_this._nodes[i], 'popped')) {
                var popHandler = _this._getHandler(_this._nodes[i]);
                popHandler.stylePop();
            }
        }
    }

    /**
     * Click event handler
     *
     * @param e event
     * @access private
     */
    Popovers.prototype._clickHandler = function(e) {
        e = e || window.event;
        e.preventDefault();
        var trigger    = this;
        var _this      = Container.get('Popovers');
        var popHandler = _this._getHandler(trigger);
       
        if (Helper.hasClass(trigger, 'popped')) {
            _this._removeAll();
            popHandler.remove();
            Helper.removeClass(trigger, 'popped');
        }
        else {
            _this._removeAll();
            popHandler.render();
            Helper.addClass(trigger, 'popped');
            setTimeout(function(){ window.addEventListener('click', _this._removeClickPop); }, 300);
        }
    }

    /**
     * Click somewhere else event handler to remove
     *
     * @param e event
     * @access private
     */
    Popovers.prototype._removeClickPop = function(e) {
        e = e || window.event;
        var clicked = e.target;
        if ( (Helper.hasClass(clicked, 'js-popover') || Helper.hasClass(clicked, 'popover') || Helper.closestClass(clicked, 'popover')) && !Helper.hasClass(clicked, 'js-remove-pop')) return;
        var _this = Container.get('Popovers');
        _this._removeAll();
        window.removeEventListener("click", _this._removeClickPop);
    }
    
    /**
     * Get the handler for the trigger
     *
     * @param trigger node
     * @access private
     */
    Popovers.prototype._getHandler = function(trigger) {
        for (var i = 0; i < this._pops.length; i++) {
           if (this._pops[i]['trigger'] === trigger) return this._pops[i];
        }
        return false;
    }

    /**
     * Remove all the popovers currently being displayed
     *
     * @param trigger node
     * @access private
     */
    Popovers.prototype._removeAll = function() {
        for (var i = 0; i < this._pops.length; i++) {
            this._pops[i].remove();
            Helper.removeClass(this._pops[i].options.target, 'popped');
        }
    }

    // Load into hubble DOM core
    Container.get('Hubble').dom().register('Popovers', Popovers);

}());