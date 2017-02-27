(function() {

    // REQUIRES
    /*****************************************/
    var Helper = Modules.require('JSHelper');

    // MODULE OBJECT
    /*****************************************/
    var FileInput = function() {
        
        this._nodes = [];
        
        this.__construct();
        
        return this;
    }

    // CONSTRUCTOR
    /*****************************************/
    FileInput.prototype.__construct = function() {

        if (Helper === 'null') Helper = Modules.require('JSHelper');

        this._nodes = Helper.$All('.js-file-input');

        if (!this._nodes.length) {
            this.destruct();
            return;
        }

        for (var i = 0; i < this._nodes.length; i++) {
            this._bind(this._nodes[i]);
        }
    }

    // DESTRUCTOR
    /*****************************************/
    FileInput.prototype.destruct = function() {
        for (var i = 0; i < this._nodes.length; i++) {
            this._unbind(this._nodes[i]);
        }
        this._nodes  = [];
        Helper       = 'null';
    }

    // BINDER
    /*****************************************/
    FileInput.prototype._bind = function(node) {
        Helper.addEventListener(node, 'change', this._invoke);
    }

    // UNBINDER
    /*****************************************/
    FileInput.prototype._unbind = function(node) {
       Helper.removeEventListener(node, 'change', this._invoke);
    }

    // EVENT HANDLER
    /*****************************************/
    FileInput.prototype._invoke = function() {
        var fileInput = this;
        var wrap      = Helper.parentUntillClass(fileInput, 'js-file-field');
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

    // PUSH TO MODULES AND INVOKE
    /*****************************************/
    Modules.singleton('FileInput', FileInput).require('FileInput');

}());
