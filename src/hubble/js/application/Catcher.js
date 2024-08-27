/**
 * JS Error Catcher module
 * 
 */
(function()
{
    /**
     * Module constructor
     *
     * @constructor
     */
    const Catcher = function()
    {
        this._listen();
    }

    /**
     * Destroy
     *
     * @access public
     */
    Catcher.prototype.destruct = function()
    {       
        window.removeEventListener('error', this._handleError);
    }

    /**
     * Listen for exceptions
     *
     * @access public
     */
    Catcher.prototype._listen = function()
    {
        window.addEventListener('error', this._handleError);
    }

    /**
     * Listen for exceptions
     *
     * @access public
     */
    Catcher.prototype._handleError = function(e)
    {
        e = e || window.event;

        if (!e || !Helper.isset(e.error))
        {
            return false;
        }

        let msg = e.error.message || e.message;

        let stack = e.error.stack || 'undefined';

        let url = window.location.href;

        let type = e.type;

        let file = e.filename || 'index.html';

        let line = e.lineno || 'undefined';

        let col = e.colno || 'undefined';

        if (Helper.is_object(browser))
        {
            browser = JSON.stringify(browser);
        }

        var form =
        {
            'browser' : browser,
            'message' : msg,
            'stack'   : stack,
            'url'     : url,
            'type'    : type,
            'file'    : file,
            'line'    : line,
            'col'     : col,
        };

        //form['csrf_token'] = Hubble.container().get('csrf_token');

        //Ajax.post(ajaxURL, form);

        return false;
    }

    //Hubble.container().singleton('Catcher', Catcher).get('Catcher');
    
})();
