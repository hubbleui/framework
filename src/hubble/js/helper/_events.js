JSHelper.prototype.addEventListener = function(element, eventName, handler, useCapture) {

    // Boolean use capture defaults to false
    useCapture = typeof useCapture === 'undefined' ? false : Boolean(useCapture);

    // Class event storage
    var events = this._events;

    // Make sure events are set
    if (!events) this._events = events = {};

    // Make sure an array for the event type exists
    if (!events[eventName]) events[eventName] = [];

    // Push the details to the events object
    events[eventName].push({
        element    : element,
        handler    : handler,
        useCapture : useCapture,
    });

    this._addListener(element, eventName, handler, useCapture);
}

JSHelper.prototype.removeEventListener = function(element, eventName, handler, useCapture) {

    // If the eventName name was not provided - remove all event handlers on element
    if (!eventName) return this._removeElementListeners(element);

    // If the callback was not provided - remove all events of the type on the element
    if (!handler) return this._removeElementTypeListeners(element, eventName);

    // Default use capture
    useCapture = typeof useCapture === 'undefined' ? false : Boolean(useCapture);

    var eventObj = this._events[eventName];

    if (typeof eventObj === 'undefined') return;

    for (var i = 0, len = eventObj.length; i < len; i++) {
        if (eventObj[i]['handler'] === handler && eventObj[i]['useCapture'] === useCapture && eventObj[i]['element'] === element) {
            this._removeListener(element, eventName, handler, useCapture);
            this._events[eventName].splice(i, 1);
            break;
        }
    }
}

JSHelper.prototype.clearEventListeners = function() {
    var events = this._events;
    for (var eventName in events) {
        var eventObj = events[eventName];
        var i = eventObj.length;
        while (i--) {
            this._removeListener(eventObj[i]['element'], eventName, eventObj[i]['handler'], eventObj[i]['useCapture']);
            this._events[eventName].splice(i, 1);
        }
    }
}

JSHelper.prototype._removeElementListeners = function(element) {
    var events = this._events;
    for (var eventName in events) {
        var eventObj = events[eventName];
        var i = eventObj.length;
        while (i--) {
            if (eventObj[i]['element'] === element) {
                this._removeListener(eventObj[i]['element'], eventName, eventObj[i]['handler'], eventObj[i]['useCapture']);
                this._events[eventName].splice(i, 1);
            }
        }
    }
}

JSHelper.prototype._removeElementTypeListeners = function(element, type) {
    var eventObj = this._events[type];
    var i = eventObj.length;
    while (i--) {
        if (eventObj[i]['element'] === element) {
            this._removeListener(eventObj[i]['element'], type, eventObj[i]['handler'], eventObj[i]['useCapture']);
            this._events[type].splice(i, 1);
        }
    }
}

JSHelper.prototype.collectGarbage = function() {
    var events = this._events;
    for (var eventName in events) {
        var eventObj = events[eventName];
        var i = eventObj.length;
        while (i--) {
            var el = eventObj[i]['element'];
            if (el == window || el == document || el == document.body) continue;
            if (!this.nodeExists(el)) {
                this._removeListener(eventObj[i]['element'], eventName, eventObj[i]['handler'], eventObj[i]['useCapture']);
                this._events[eventName].splice(i, 1);
            }
        }
    }
}


JSHelper.prototype._addListener = function(el, eventName, handler, useCapture) {
    if (el.addEventListener) {
        el.addEventListener(eventName, handler, useCapture);
    } else {
        el.attachEvent('on' + eventName, handler, useCapture);
    }
}

JSHelper.prototype._removeListener = function(el, eventName, handler, useCapture) {
    if (el.removeEventListener) {
        el.removeEventListener(eventName, handler, useCapture);
    } else {
        el.detachEvent('on' + eventName, handler, useCapture);
    }
}