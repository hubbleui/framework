/**
 * Custom select input
 *
 * @author    Joe J. Howard
 * @copyright Joe J. Howard
 * @license   https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE
 */

(function()
{
    /**
     * JS Helper reference
     * 
     * @var object
     */
    var Helper = Hubble.helper();

    /**
     * Module constructor
     *
     * @access public
     * @constructor
     */
    var Selects = function()
    {
        this._selectTriggers = Helper.$All('.js-select');
        this._listTriggers   = Helper.$All('.js-select > ul > li > a');
                
        this._bind();
        
        return this;
    }

    /**
     * Module destructor
     *
     * @access public
     */
    Selects.prototype.destruct = function()
    {
        this._unbind();

        this._selectTriggers = [];

        this._listTriggers = [];
    }

    /**
     * Event binder - Binds all events on wrapper click
     *
     * @access private
     */
    Selects.prototype._bind = function()
    {
        Helper.addEventListener(this._selectTriggers, 'click', this._triggerHandler);

        Helper.addEventListener(this._listTriggers, 'click', this._listHandler);

        Helper.addEventListener(window, 'click', this._windowClick);
    }

    /**
     * Event unbinder - Removes all events on wrapper click
     *
     * @access private
     */
    Selects.prototype._unbind = function()
    {
        Helper.removeEventListener(this._selectTriggers, 'click', this._triggerHandler);

        Helper.removeEventListener(this._listTriggers, 'click', this._listHandler);

        Helper.removeEventListener(window, 'click', this._windowClick);
    }

    /**
     * Handle the click event on triggers
     *
     * @param event|null e JavaScript click event
     * @access private
     */
    Selects.prototype._triggerHandler = function(e)
    {
        e = e || window.event;

        var _this = Container.Selects();

        // Hide all Selects except this
        _this._hideSelects(this);

        // Remove focus and return
        if (Helper.hasClass(this, 'focus'))
        {
            _this._hideDrop(this);
        }
        else
        {
            _this._showDrop(this);
        }
    }

    /**
     * Handle the click event on list nodes
     *
     * @param event|null e JavaScript click event
     * @access private
     */
    Selects.prototype._listHandler = function(e)
    {
        e = e || window.event;

        e.preventDefault();

        console.log(this);

        var _list     = Helper.closest('ul', this);
        var _link     = this.parentNode;
        var _selected = Helper.$('li.selected', _list);

        if (Helper.hasClass(_link, 'selected'))
        {
            return;
        }

        if (Helper.nodeExists(_selected))
        {
            Helper.removeClass(_selected, 'selected');
        }

        Helper.addClass(_link, 'selected');
    }

    /**
     * Click event handler
     *
     * @param  node    wrapper
     * @access private
     */
    Selects.prototype._hideDrop = function(wrapper)
    {
        var drop = Helper.$('ul', wrapper);
        Helper.removeClass(wrapper, 'focus');
        wrapper.setAttribute('aria-pressed', 'false');
        Helper.hideAria(drop);
        drop.blur();
    }

    /**
     * Click event handler
     *
     * @param  node wrapper
     * @access private
     */
    Selects.prototype._showDrop = function(wrapper)
    {
        var drop = Helper.$('ul', wrapper);
        Helper.addClass(wrapper, 'focus');
        wrapper.setAttribute('aria-pressed', 'true');
        Helper.showAria(drop);
        drop.focus();
    }

    /**
     * Window click event
     *
     * @param event|null e JavaScript click event
     * @access private
     */
    Selects.prototype._windowClick = function(e)
    {
        e = e || window.event;

        if (Helper.closest(e.target, '.js-select'))
        {
            return;
        }

        if (!Helper.hasClass(e.target, 'js-select'))
        {
            var _this = Container.get('Selects');
            
            _this._hideSelects();
        }
    }

    /**
     * Hide all Selects
     *
     * @param exception (optional) wrapper to skip
     * @access private
     */
    Selects.prototype._hideSelects = function(exception)
    {
        var selects  = Helper.$All('.js-select');
        exception    = (typeof exception === 'undefined' ? false : exception);

        for (var i = 0; i < selects.length; i++)
        {
            var node = selects[i];

            if (node === exception)
            {
                continue;
            }

            this._hideDrop(node);
        }
    }

    // Load into Hubble DOM core
    Container.get('Hubble').dom().register('Selects', Selects);

}());
