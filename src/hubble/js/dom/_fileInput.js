/**
 * File inputs
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
     * @constructor
     * @access public
     */
    var FileInput = function()
    {
        this._nodes = Helper.$All('.js-file-input');

        this._bind();
        
        return this;
    }

    /**
     * Module destructor remove event handlers
     *
     * @access public
     */
    FileInput.prototype.destruct = function()
    {
        this._unbind();

        this._nodes  = [];
    }

    /**
     * Bind DOM listeners
     *
     * @access public
     */
    FileInput.prototype._bind = function()
    {
        for (var i = 0; i < this._nodes.length; i++)
        {
            Helper.addEventListener(this._nodes[i], 'change', this._eventHandler);
        }
    }

    /**
     * Unbind DOM listeners
     *
     * @access public
     */
    FileInput.prototype._unbind = function()
    {
        for (var i = 0; i < this._nodes.length; i++)
        {
            Helper.removeEventListener(this._nodes[i], 'change', this._eventHandler);
        }
    }

    /**
     * Handle the change event
     *
     * @access private
     */
    FileInput.prototype._eventHandler = function()
    {
        var fileInput = this;
        var wrap      = Helper.closestClass(fileInput, 'js-file-field');
        var showInput = Helper.$('.js-file-text', wrap);
        var fullPath  = fileInput.value;
        if (fullPath)
        {
            var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
            var filename   = fullPath.substring(startIndex);
            if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0)
            {
                filename = filename.substring(1);
            }
            showInput.value = filename;
        }
    }

    // Load into Hubble DOM core
    Container.get('Hubble').dom().register('FileInput', FileInput);

}());
