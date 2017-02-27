(function() {

    // REQUIRES
    /*****************************************/
    var Helper = Modules.require('JSHelper');

    
    // HANDLER FOR RENDERING
    /*****************************************/
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

    _popHandler.prototype.remove = function() {
        if (Helper.nodeExists(this.el)) this.el.parentNode.removeChild(this.el);
    }

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

    Modules.set('_popHandler', _popHandler);

}());


(function() {

    // REQUIRES
    /*****************************************/
    var Helper = Modules.require('JSHelper');

    // MODULE
    /*****************************************/
    var Popovers = function() {
        
        this._pops  = [];
        this._nodes = [];
        this._arrowClasses = {
            top    : 'arrow-s',
            left   : 'arrow-e',
            right  : 'arrow-w',
            bottom : 'arrow-n',
        };
        this.__construct();

        return this;
    };

    // CONSTRUCTOR
    /*****************************************/
    Popovers.prototype.__construct = function() {

        // Make sure Helper is included
        if (typeof Helper == null || typeof Helper == 'undefined') {
            Helper = Modules.require('JSHelper');
        }

        // Find nodes
        this._nodes = Helper.$All('.js-popover');

        // If nothing to do destruct straight away
        if (!this._nodes.length) {
            this.destruct();
            return;
        }

        // Bind DOM listeners
        this._bindDOMListeners();
    }

    // DESTRUCTOR
    /*****************************************/
    Popovers.prototype.destruct = function() {
        this._removeAll();
        this._unbindDOMListeners();
        this._nodes = [];
        this._pops  = [];
    }

    // LISTENERS BINDER
    /*****************************************/
    Popovers.prototype._bindDOMListeners = function() {
        for (var i = 0; i < this._nodes.length; i++) {
            this._bind(this._nodes[i]);
        }
    }

    // LISTENERS UN-BINDER
    /*****************************************/
    Popovers.prototype._unbindDOMListeners = function() {
        for (var i = 0; i < this._nodes.length; i++) {
            this._unbind(this._nodes[i]);
        }
    }

    // LISTENER UNBINDER
    /*****************************************/
    Popovers.prototype._unbind = function(trigger) {
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

    // LISTENER BINDER
    /*****************************************/
    Popovers.prototype._bind = function(trigger) {
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

        var popHandler = Modules.require('_popHandler', {
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

    Popovers.prototype._hoverOver = function() {
        var trigger    = this;
        var _this      = Modules.require('Popovers');
        var popHandler = _this._getHandler(trigger);
        if (Helper.hasClass(trigger, 'popped')) return;
        popHandler.render();
        Helper.addClass(trigger, 'popped');
    }

    Popovers.prototype._hoverLeave = function() {
        var trigger    = this;
        var _this      = Modules.require('Popovers');
        var popHandler = _this._getHandler(trigger);
        if (!Helper.hasClass(trigger, 'popped')) return;
        popHandler.remove();
        Helper.removeClass(trigger, 'popped');
    }

    Popovers.prototype._windowResize = function(e) {
        var _this = Modules.require('Popovers');
        for (var i = 0; i < _this._nodes.length; i++) {
            if (Helper.hasClass(_this._nodes[i], 'popped')) {
                var popHandler = _this._getHandler(_this._nodes[i]);
                popHandler.stylePop();
            }
        }
    }

    Popovers.prototype._clickHandler = function(e) {
        e = e || window.event;
        e.preventDefault();
        var trigger    = this;
        var _this      = Modules.require('Popovers');
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

    Popovers.prototype._removeClickPop = function(e) {
        e = e || window.event;
        var clicked = e.target;
        if ( (Helper.hasClass(clicked, 'js-popover') || Helper.hasClass(clicked, 'popover') || Helper.parentUntillClass(clicked, 'popover')) && !Helper.hasClass(clicked, 'js-remove-pop')) return;
        var _this = Modules.require('Popovers');
        _this._removeAll();
        window.removeEventListener("click", _this._removeClickPop);
    }
    

    Popovers.prototype._getHandler = function(trigger) {
        for (var i = 0; i < this._pops.length; i++) {
           if (this._pops[i]['trigger'] === trigger) return this._pops[i];
        }
        return false;
    }

    Popovers.prototype._removeAll = function() {
        for (var i = 0; i < this._pops.length; i++) {
            this._pops[i].remove();
            Helper.removeClass(this._pops[i].options.target, 'popped');
        }
    }
    

    // Load into container and invoke
    Modules.singleton('Popovers', Popovers).require('Popovers');

}());