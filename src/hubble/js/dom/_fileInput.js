(function()
{
    /**
     * JS Helper reference
     * 
     * @var object
     */
    var Helper = Hubble.helper();

    /**
     * File inputs
     *
     * @author    Joe J. Howard
     * @copyright Joe J. Howard
     * @license   https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE
     */
    class FileInput
    {
        /**
         * Module constructor
         *
         * @constructor
         * @access public
         */
    	constructor()
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
        destruct()
        {
            this._unbind();

            this._nodes = [];
        }

        /**
         * Bind DOM listeners
         *
         * @access public
         */
        _bind()
        {
            Helper.addEventListener(this._nodes, 'change', this._eventHandler);
        }

        /**
         * Unbind DOM listeners
         *
         * @access public
         */
        _unbind()
        {
            Helper.removeEventListener(this._nodes, 'change', this._eventHandler);
        }

        /**
         * Handle the change event
         *
         * @access private
         */
        _eventHandler()
        {
            var fileInput = this;
            var wrap = Helper.closest(fileInput, '.js-file-field');
            var showInput = Helper.$('.js-file-text', wrap);
            var fullPath = fileInput.value;
            if (fullPath)
            {
                var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
                var filename = fullPath.substring(startIndex);
                if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0)
                {
                    filename = filename.substring(1);
                }
                showInput.value = filename;
            }
        }
    }

    // Load into Hubble DOM core
    Container.get('Hubble').dom().register('FileInput', FileInput);

}());
