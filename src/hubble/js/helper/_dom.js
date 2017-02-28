/* Quick selctor all */
JSHelper.prototype.$All = function(selector, context) {
    context = (typeof context === 'undefined' ? document : context);
    return Array.prototype.slice.call(context.querySelectorAll(selector));
}

/* Quck selector single */
JSHelper.prototype.$ = function(selector, context) {
    context = (typeof context === 'undefined' ? document : context);
    return context.querySelector(selector)
}

/* Closest */
JSHelper.prototype.closest = function(el, type) {
    type = type.toLowerCase();
    if (typeof el === "undefined") return null;
    if (el.nodeName.toLowerCase() === type) return el;
    if (el.parentNode && el.parentNode.nodeName.toLowerCase() === type) return el.parentNode;
    var parent = el.parentNode;
    while (parent !== document.body && typeof parent !== "undefined" && parent !== null) {
        parent = parent.parentNode;
        if (parent && parent.nodeName.toLowerCase() === type) return parent;
    }
    return null;
}

JSHelper.prototype.firstChildren = function(el) {
    var children = [];
    var childnodes = el.childNodes;
    for (var i = 0; i < childnodes.length; i++) {
        if (childnodes[i].nodeType == 1)  children.push(childnodes[i]);
    }
    return children;
}

/* Parant untill class */
JSHelper.prototype.parentUntillClass = function(el, clas) {
    if (this.hasClass(el, clas)) {
        return el;
    }
    if (this.hasClass(el.parentNode, clas)) {
        return el.parentNode;
    }
    var parent = el.parentNode;
    if (parent === window.document) return null;
    while (parent !== document.body) {
        parent = parent.parentNode;
        if (this.hasClass(parent, clas)) {
            return parent;
        }
    }
    return null;
}



/* Next untill type */
JSHelper.prototype.nextUntillType = function(el, type) {
    type = type.toLowerCase();
    if (el.nextSibling && el.nextSibling.nodeName.toLowerCase() === type) return el.nextSibling;
    var next = el.nextSibling;
    while (next !== document.body && typeof next !== "undefined" && next !== null) {
        next = next.nextSibling;
        if (next && next.nodeName.toLowerCase() === type) {
            return next;
        }
    }
    return null;
}

/* Next untill type */
JSHelper.prototype.previousUntillType = function(el, type) {
    type = type.toLowerCase();
    if (el.previousSibling && el.previousSibling.nodeName.toLowerCase() === type) return el.previousSibling;
    var prev = el.previousSibling;
    while (prev !== document.body && typeof prev !== "undefined" && prev !== null) {
        prev = prev.previousSibling;
        if (prev && prev.nodeName.toLowerCase() === type) {
            return prev;
        }
    }
    return null;
}

/* New Node */
JSHelper.prototype.newNode = function(type, classes, ID, content, target) {
    var node = document.createElement(type);
    classes = (typeof classes === "undefined" ? null : classes);
    ID = (typeof ID === "undefined" ? null : ID);
    content = (typeof content === "undefined" ? null : content);
    if (classes !== null) {
        node.className = classes
    }
    if (ID !== null) {
        node.id = ID
    }
    if (content !== null) {
        node.innerHTML = content
    }
    target.appendChild(node);
    return node
}

/* Node Exists */
JSHelper.prototype.nodeExists = function(element) {
    if (element === document.body) return true;
    if (typeof(element) !== "undefined" && element !== null) {
        if (typeof(element.parentNode) !== "undefined" && element.parentNode !== null) {
            return (element === document.body) ? false : document.body.contains(element);
        }
    }
    return false;
}

/* Remove From DOM */
JSHelper.prototype.removeFromDOM = function(el) {
    if (this.nodeExists(el)) {
        el.parentNode.removeChild(el);
        var children = this.$All('*', el);
        for (var i = 0, len = children.length; i < len; i++) {
            this.removeEventListener(children[i]);
        }
        this.removeEventListener(el);
    }
}

/* Remove From DOM */
JSHelper.prototype.removeStyle = function(el, prop) {

    prop = (typeof prop === 'undefined' ? 'style' : this.toCamelCase(prop));

    if (el.style.removeProperty) {
        el.style.removeProperty(prop);
    }
    else {
        el.style.removeAttribute(prop);
    }
}

/* Add class */
JSHelper.prototype.addClass = function(el, className) {
    if (!this.nodeExists(el)) return;
    if (Object.prototype.toString.call(className) === '[object Array]') {
        for (var i = 0; i < className.length; i++) {
            el.classList.add(className[i]);
        }
        return;
    }
    el.classList.add(className);
}

/* Remove Class */
JSHelper.prototype.removeClass = function(el, className) {
    if (!this.nodeExists(el)) return;
    if (Object.prototype.toString.call(className) === '[object Array]') {
        for (var i = 0; i < className.length; i++) {
            el.classList.remove(className[i]);
        }
        return;
    }
    el.classList.remove(className);
}

/* Toggle class */
JSHelper.prototype.toggleClass = function(el, className) {
    if (!this.nodeExists(el)) return;
    if (this.hasClass(el, className)) {
        this.removeClass(el, className);
    }
    else {
        this.addClass(el, className);
    }
}

/* Has Class */
JSHelper.prototype.hasClass = function(el, className) {
    if (!this.nodeExists(el)) return false;
    if (Object.prototype.toString.call(className) === '[object Array]') {
        for (var i = 0; i < className.length; i++) {
            if (el.classList.contains(className[i])) return true;
        }
        return false;
    }
    return el.classList.contains(className);
}

/* Is node type */
JSHelper.prototype.isNodeType = function(el, NodeType) {
    return el.tagName.toUpperCase() === NodeType.toUpperCase();
}

/* Get Element Coordinates */
JSHelper.prototype.getCoords = function(el) {
    var box = el.getBoundingClientRect();
    var body = document.body;
    var docEl = document.documentElement;
    var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;
    var clientTop = docEl.clientTop || body.clientTop || 0;
    var clientLeft = docEl.clientLeft || body.clientLeft || 0;
    var borderL  = parseInt(this.getStyle(el, 'border-top-width'));
    var borderR  = parseInt(this.getStyle(el, 'border-top-width'));
    var borderT  = parseInt(this.getStyle(el, 'border-top-width'));
    var borderB  = parseInt(this.getStyle(el, 'border-top-width'));
    var top      = box.top  + scrollTop  - clientTop  - borderT - borderB;
    var left     = box.left + scrollLeft - clientLeft + borderL - borderR;
    var width    = parseFloat(this.getStyle(el, "width"));
    var height   = parseFloat(this.getStyle(el, "height"));

    return {
        top    : top,
        left   : left,
        right  : left + width,
        bottom : top + height,
        height : height,
        width  : width,
    }
}

/* Get style */
JSHelper.prototype.getStyle = function(el, prop) {
    if (window.getComputedStyle) {
        return window.getComputedStyle(el, null).getPropertyValue(prop)
    }
    else {
        if (el.currentStyle) {
            return el.currentStyle[prop]
        }
    }
}

/* Trigger a native event */
JSHelper.prototype.triggerEvent = function(el, type) {
    if ("createEvent" in document) {
        var evt = document.createEvent("HTMLEvents");
        evt.initEvent(type, false, true);
        el.dispatchEvent(evt)
    }
    else {
        el.fireEvent(type)
    }
}

JSHelper.prototype.innerText = function(el, text) {
    if (this.isset(el.childNodes[0])) {
        el.childNodes[0].nodeValue = text;
    }
}

/* Get all inputs from a form */
JSHelper.prototype.getFormInputs = function(form) {
    var allInputs = this.$All('input, textarea, select', form);
    var i = allInputs.length;
    while (i--) {
        var input = allInputs[i];
        if (input.type == "radio" && input.checked !== true) allInputs.splice(i, 1);
    }

    return allInputs;
}

/* Get input value */
JSHelper.prototype.getInputValue = function(input) {

    if (input.type == "checkbox") {
        var val    = '';
        var checks = this.$All('input[name='+input.name+']');
        for (var i = 0, len = checks.length; i < len; i++) {
            if (checks[i].checked) {
                val += checks[i].value + ', ';
            }
        }
        return this.rtrim(val, ', '); 
    }

    if (input.type == "select") return input.options[input.selectedIndex].value;
    if (input.type == "file") {
        if (input.multiple == true) return input.files;
        return input.files[0];
    }
    return input.value;
}

JSHelper.prototype.innerHTML = function(target, content, append) {
    content = this.is_array(content) ? content.join("\n") : content;
    if (append) {
        target.innerHTML += content;
    }
    else {
        target.innerHTML = content;
    }
}

/* SET AN INLINE CSS PROPERTY */
JSHelper.prototype.css = function(el, property, value) {

    // If their is no value and property is an object
    if (this.is_object(property)) {
        for (var key in property) {
            if (!property.hasOwnProperty(key)) continue;
            this.css(el, key, property[key]);
        }
    }
    else {
        if (this.isset(this.cssEasings[value])) value = this.cssEasings[value];

        if (this.in_array(property, this.cssPrefixable)) {
            for (var i = 0; i < this.cssPrefixes.length; i++) {
                var prefix  = this.cssPrefixes[i];
                var prop    = this.toCamelCase(prefix + property);
                el.style[prop] = value;
            }
        }
        else {
            var prop = this.toCamelCase(property);
            el.style[prop] = value;
        }
    }
}

/* Animate a CSS property */
JSHelper.prototype.animate = function(el, cssProperty, from, to, time, easing) {
    

    /*
       Set defaults if values were not provided;
    */
    time = (typeof time === 'undefined' ? 300 : time);
    easing = (typeof easing === 'undefined' || !this.isset(this.cssEasings[easing]) ? 'ease' : this.cssEasings[easing]);

    /*
        Width and height need to use js to get the size
    */
    if ((cssProperty === 'height' || cssProperty === 'width') && from === 'auto') {
        if (cssProperty === 'height') {
            from = el.clientHeight || el.offsetHeight;
        }
        else {
            from = el.clientWidth || el.offsetWidth;
        }
    }

    /*
        Set the initial value
    */
    if (from !== 'initial') this.css(el, cssProperty, from);

    /*
        Set the css transition
    */
    var transitions         = [];
    var computedStyle       = window.getComputedStyle(el);
    var existingTransitions = computedStyle.transition;
    if (existingTransitions !== 'none' && existingTransitions !== 'all 0s ease 0s') {
        transitions.push(existingTransitions);
        transitions.push(cssProperty + ' ' + time + 'ms ' + easing);
        el.style.transition = transitions.join(', ');
    }
    else {
        this.css(el, 'transition', cssProperty + ' ' + time + 'ms ' + easing);
    }

    
    /*
        Set the end property
    */
    this.css(el, cssProperty, to);

    /*
       Add an event listener to check when the transition has finished,
       remove any transition styles ans set the height to auto.
       Then remove the event listener
    */
    var _this = this;

    el.addEventListener('transitionend', function transitionEnd(e) {
        e = e || window.event;
        if (e.propertyName == cssProperty) {
            _this.removeStyle(el, 'transition');
            el.removeEventListener('transitionend', transitionEnd, false);
        }
    }, false);
}


JSHelper.prototype.inViewport = function(el) {
    
    var rect = el.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
    );
}

JSHelper.prototype.hideAria = function(el) {
    el.setAttribute("aria-hidden", 'true');
}

JSHelper.prototype.showAria = function(el) {
    el.setAttribute("aria-hidden", 'false');
}


