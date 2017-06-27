/**
 * File inputs
 *
 * This class is used to handle custom file
 * input change events
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
     * @return this
     */
    var FileInput = function() {
                
        this._nodes = Helper.$All('.js-file-input');

        if (!Helper.empty(this._nodes)) {
            for (var i = 0; i < this._nodes.length; i++) {
                Helper.addEventListener(this._nodes[i], 'change', this._eventHandler);
            }
        }
        
        return this;
    }

    /**
     * Module destructor remove event handlers
     *
     * @access public
     */
    FileInput.prototype.destruct = function() {
        for (var i = 0; i < this._nodes.length; i++) {
            Helper.removeEventListener(this._nodes[i], 'change', this._eventHandler);
        }
        this._nodes  = [];
    }

    /**
     * Handle the change event
     *
     * @access private
     */
    FileInput.prototype._eventHandler = function() {
        var fileInput = this;
        var wrap      = Helper.closestClass(fileInput, 'js-file-field');
        var showInput = Helper.$('.js-file-text', wrap);
        var fullPath  = fileInput.value;
        if (fullPath) {
            var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
            var filename   = fullPath.substring(startIndex);
            if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
                filename = filename.substring(1);
            }
            showInput.value = filename;
        }
    }

    // Load into hubble DOM core
    Container.get('Hubble').dom().register('FileInput', FileInput);

}());
