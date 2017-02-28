/* Auto transition height */
(function() {

    // REQUIRES
    /*****************************************/
    var Helper = Modules.require('JSHelper');

    // VARS
    /*****************************************/
    var _opacityTimer;

    // MODULE OBJECT CONSTRUCTOR
    /*****************************************/
    var ToggleHeight = function(el, initial, time, easing, withOpacity) {
        /*
           Set defaults if values were not provided;
        */
        initial     = (typeof initial === 'undefined' ? 0 : initial);
        time        = (typeof time === 'undefined' ? 300 : time);
        easing      = (typeof easing === 'undefined' ? 'ease-in' : easing);
        withOpacity = (typeof withOpacity === 'undefined' ? false : withOpacity);

        /*   
           Get the elements's current height
        */
        var actualHeight = el.clientHeight || el.offsetHeight;
        actualHeight = parseInt(actualHeight);

        /*   
           Get the elements's projected height
        */
        var computedStyle = window.getComputedStyle(el);
        var endHeight     = el.scrollHeight - parseInt(computedStyle.paddingTop) - parseInt(computedStyle.paddingBottom) + parseInt(computedStyle.borderTopWidth) + parseInt(computedStyle.borderBottomWidth);
        endHeight         = parseInt(endHeight);
        var existingTransitions = computedStyle.transition;

        /*
           Dispatch appropriate function
        */
        if (endHeight === actualHeight || actualHeight > endHeight) {
            this._fromAuto(el, initial, time, easing, actualHeight, existingTransitions, withOpacity);
        }
        else {
            this._toAuto(el, time, easing, actualHeight, endHeight, existingTransitions, withOpacity);
        }

    };

    // PRIVATE TRANSITION TO AUTO METHOD
    /*****************************************/
    ToggleHeight.prototype._toAuto = function(el, time, easing, actualHeight, endHeight, existingTransitions, withOpacity) {

        /* 
            Bugfix if the height is set to auto transition from auto
        */
        if (el.style.height === 'auto') {
            this._fromAuto(el, 0, time, easing, actualHeight, existingTransitions, withOpacity);
            return;
        }

        /* 
            Bugfix if both heights are the same just set the height to auto
        */
        if (actualHeight === endHeight) {
            el.style.height = 'auto';
            return;
        }

        /*
            Opacity timer
        */
        var opacityTime = (75 * time) / 100 + time; 

        /*
           Set the height to the actual height (which could be zero)
           and force the browser to repaint
        */
        el.style.height = actualHeight + "px";
        el.offsetHeight;
        if (withOpacity) el.style.opacity = '0';

        var transitions = [];
        if (existingTransitions !== 'none' && existingTransitions !== 'all 0s ease 0s') {
            transitions.push(existingTransitions);
        }

        /*
           Add the transitions and set the height.
        */
        if (withOpacity) {
            var transition = 'height ' + time + 'ms ' + easing + ', opacity ' + opacityTime + 'ms ' + easing;
            transitions.push(transition);
            el.style.transition = transitions.join(', ');
            el.style.opacity = '1'; 
        }
        else {
            var transition = 'height ' + time + 'ms ' + easing;
            transitions.push(transition);
            el.style.transition = transitions.join(', ');
        }
        Helper.addClass(el, 'webkit-gpu-acceleration');
        el.style.height = endHeight + "px";
        
        /*
           Add an event listener to check when the transition has finished,
           remove any transition styles ans set the height to auto.
           Then remove the event listener
        */
        el.addEventListener('transitionend', function transitionEnd(e) {
            e = e || window.event;
            if (e.propertyName == 'height') {
                if (!withOpacity) el.style.transition = '';
                el.style.height = 'auto';
                el.removeEventListener('transitionend', transitionEnd, false);
                Helper.removeClass(el, 'webkit-gpu-acceleration');
            }
        }, false);

        if (withOpacity) {
            clearTimeout(_opacityTimer);
            _opacityTimer = setTimeout(function(){ 
                el.style.transition = '';
            }, opacityTime);
        }
    }

    // PRIVATE TRANSITION FROM AUTO METHOD
    /*****************************************/
    ToggleHeight.prototype._fromAuto = function(el, initial, time, easing, actualHeight, existingTransitions, withOpacity) {
        /*
           Set the height to the actual height (which could be zero)
           and force the browser to repaint
        */
        var delay       = Math.round(time - ((75 * time) / 100));
        var opacityTime = (15 * time) / 100 + time; 
        el.style.height = actualHeight + "px";
        el.offsetHeight;

        /*
           Add the transitions and set the height.
        */
        var transitions = [];
        if (existingTransitions !== 'none' && existingTransitions !== 'all 0s ease 0s') {
            transitions.push(existingTransitions);
        }

        if (withOpacity) {
            var transition = 'height ' + time + 'ms ease, opacity ' + opacityTime + 'ms ease-out';
            transitions.push(transition);
            el.style.transition = transitions.join(', ');
            el.style.opacity = '0';
        }
        else {
            var transition = 'height ' + time + 'ms ' + easing;
            transitions.push(transition);
            el.style.transition = transitions.join(', ');
        }
        Helper.addClass(el, 'webkit-gpu-acceleration');
        el.style.height = parseInt(initial) + "px"; 

        if (withOpacity) {
            clearTimeout(_opacityTimer);
            _opacityTimer = setTimeout(function(){ 
                el.style.transition = '';
                Helper.removeClass(el, 'webkit-gpu-acceleration');
            }, opacityTime);
        }
        else {
            el.addEventListener('transitionend', function transitionEnd(e) {
                e = e || window.event;
                if (e.propertyName == 'height') {
                    el.style.transition = '';
                    Helper.removeClass(el, 'webkit-gpu-acceleration');
                    el.removeEventListener('transitionend', transitionEnd, false);
                }
            }, false);
        }
    }

    // Load into container
    /*****************************************/
    Modules.set('ToggleHeight', ToggleHeight);

})();