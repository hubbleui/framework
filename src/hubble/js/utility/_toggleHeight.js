/**
 * ToggleHeight
 *
 * The ToggleHeight module allows to transition an element's height 
 * from 0 -> auto or from auto -> 0
 *
 */
(function()
{

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
     * @params el          node     The target node
     * @params initial     int      The height in px to start the transition
     * @params time        int      The time in ms of the transition
     * @params easing      string   Transition easing - valid css easing function
     * @params withOpacity boolean Should the transition include and opacity fade ?
     */
    var ToggleHeight = function(el, initial, time, easing, withOpacity)
    {
        // Set defaults if values were not provided;
        initial = (typeof initial === 'undefined' ? 0 : initial);
        time = (typeof time === 'undefined' ? 300 : time);
        easing = (typeof easing === 'undefined' ? 'ease-in' : easing);
        withOpacity = (typeof withOpacity === 'undefined' ? false : withOpacity);

        // Get the element's current height
        var actualHeight = parseInt(el.clientHeight || el.offsetHeight);

        // Get the element's projected height
        var computedStyle = Helper._computeStyle(el);
        var endHeight = parseInt(el.scrollHeight - parseInt(computedStyle.paddingTop) - parseInt(computedStyle.paddingBottom) + parseInt(computedStyle.borderTopWidth) + parseInt(computedStyle.borderBottomWidth));

        // Dispatch appropriate function
        if (endHeight === actualHeight || actualHeight > endHeight)
        {
            this._fromAuto(el, initial, time, easing, actualHeight, withOpacity);
        }
        else
        {
            this._toAuto(el, time, easing, actualHeight, endHeight, withOpacity);
        }
    }

    /**
     * Transition element's height from some height to auto.
     *
     * @access private
     * @params el                   node     The target node
     * @params initial              int      The height in px to start the transition
     * @params time                 int      The time in ms of the transition
     * @params easing               string   Transition easing - valid css easing function
     * @params actualHeight         int      Height in px that the transition will start at
     * @params endHeight            int      Height in px that the transition will end at
     * @params withOpacity          boolean  Should the transition include and opacity fade ?
     */
    ToggleHeight.prototype._toAuto = function(el, time, easing, actualHeight, endHeight, withOpacity)
    {
        // Bugfix if the height is set to auto transition from auto
        if (el.style.height === 'auto')
        {
            this._fromAuto(el, 0, time, easing, actualHeight, withOpacity);

            return;
        }

        // Bugfix if both heights are the same just set the height to auto
        if (actualHeight === endHeight)
        {
            el.style.height = 'auto';

            return;
        }

        // Opacity timer
        var opacityTime = (75 * time) / 100 + time;

        // Set the height to the actual height (which could be zero)
        // and force the browser to repaint
        Helper.css(el, 'height', actualHeight + 'px');
        el.offsetHeight;

        // Run animations
        var remove = function()
        {
            Helper.css(el, 'height', 'auto');
        };

        Helper.animate(el, 'height', actualHeight + 'px', endHeight + 'px', time, easing, remove);

        if (withOpacity)
        {
            Helper.animate(el, 'opacity', '0', '1', opacityTime, easing);
        }
    }

    /**
     * Transition element's height from "auto" to 0.
     *
     * @access private
     * @params el                   node     The target node
     * @params initial              int      The height in px to start the transition
     * @params time                 int      The time in ms of the transition
     * @params easing               string   Transition easing - valid css easing function
     * @params actualHeight         int      Height in px that the transition will start at
     * @params withOpacity          boolean  Should the transition include and opacity fade ?
     */
    ToggleHeight.prototype._fromAuto = function(el, initial, time, easing, actualHeight, withOpacity)
    {
        var opacityTime = (15 * time) / 100 + time;

        // Set the height to the actual height (which could be zero)
        // and force the browser to repaint
        Helper.css(el, 'height', actualHeight + 'px');
        el.offsetHeight;

        // Run animations
        Helper.animate(el, 'height', actualHeight + 'px', '0px', time, easing);

        if (withOpacity)
        {
            Helper.animate(el, 'opacity', '1', '0', opacityTime, easing);
        }
    }

    // Load into container
    Container.set('ToggleHeight', ToggleHeight);

})();