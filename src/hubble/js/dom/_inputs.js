/**
 * Adds classes to inputs
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
    var Inputs = function()
    {
        this._inputs = Helper.$All('.form-field input, .form-field select, .form-field textarea');
        this._labels = Helper.$All('.form-field label');

        if (!Helper.empty(this._inputs))
        {
            this._bind();
        }

        return this;
    };

    /**
     * Module destructor - removes event listeners
     *
     * @access public
     */
    Inputs.prototype.destruct = function()
    {
        this._unbind();

        this._inputs = [];
    }

    /**
     * Event binder
     *
     * @access private
     */
    Inputs.prototype._bind = function()
    {
        Helper.addEventListener(this._labels, 'click', this._onLabelClick);
        Helper.addEventListener(this._inputs, 'click', this._eventHandler);
        Helper.addEventListener(this._inputs, 'focus', this._eventHandler);
        Helper.addEventListener(this._inputs, 'blur', this._eventHandler);
        Helper.addEventListener(this._inputs, 'change', this._eventHandler);
        Helper.addEventListener(this._inputs, 'input', this._eventHandler);
        Helper.addEventListener(this._inputs, 'hover', this._eventHandler);
    }

    /**
     * Event ubinder
     *
     * @access private
     */
    Inputs.prototype._unbind = function()
    {
        Helper.removeEventListener(this._labels, 'click', this._onLabelClick);
        Helper.removeEventListener(this._inputs, 'click', this._eventHandler);
        Helper.removeEventListener(this._inputs, 'focus', this._eventHandler);
        Helper.removeEventListener(this._inputs, 'blur', this._eventHandler);
        Helper.removeEventListener(this._inputs, 'change', this._eventHandler);
        Helper.removeEventListener(this._inputs, 'input', this._eventHandler);
        Helper.removeEventListener(this._inputs, 'hover', this._eventHandler);
    }

    /**
     * Event handler
     *
     * @access private
     * @params event|null e Browser click event
     */
    Inputs.prototype._onLabelClick = function(e)
    {
        e = e || window.event;

        var input = Helper.$('input', this.parentNode);

        if (Helper.nodeExists(input))
        {
            input.focus();

            return;
        }

        var input = Helper.$('select', this.parentNode);

        if (Helper.nodeExists(input))
        {
            input.focus();

            return;
        }

        var input = Helper.$('textarea', this.parentNode);

        if (Helper.nodeExists(input))
        {
            input.focus();

            return;
        }
    }

    /**
     * Event handler
     *
     * @access private
     * @params event|null e Browser click event
     */
    Inputs.prototype._eventHandler = function(e)
    {
        e = e || window.event;

        if (e.type === 'click')
        {
            this.focus();
        }
        else if (e.type === 'focus')
        {
            Helper.addClass(this.parentNode, 'focus');
        }
        else if (e.type === 'blur')
        {
            Helper.removeClass(this.parentNode, 'focus');
        }

        if (e.type === 'change' || e.type === 'input' || e.type === 'blur')
        {
            var _value = Helper.getInputValue(this);

            console.log(_value);

            if (_value === '')
            {
                Helper.removeClass(this.parentNode, 'not-empty');
                Helper.addClass(this.parentNode, 'empty');
            }
            else
            {
                Helper.removeClass(this.parentNode, 'empty');
                Helper.addClass(this.parentNode, 'not-empty');
            }
        }
    }

    // Load into Hubble DOM core
    Container.get('Hubble').dom().register('Inputs', Inputs);

})();