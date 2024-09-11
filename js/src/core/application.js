(function()
{
    /**
     * Application core
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.comfrontbx/uimaster/LICENSE}
     */
    const Application = function()
    {
        this.version_major = '0';

        this.version_minor = '1';

        this.version_patch = '0';

        this.version = `${this.version_major}.${this.version_minor}.${this.version_patch }`;
    }

    /**
     * Called when the application is first initialized
     *
     * @access {public}
     */
    Application.prototype.boot = function()
    {        
        this.dom().boot();

        this._().trigger_event(window, 'FrontBx:ready', this);
    }

    /**
     * Get the DOM component
     *
     * @access {public}
     * @return {object}
     */
    Application.prototype.dom = function()
    {
        return this.Dom();
    }

    Container._().trigger_event(window, 'FrontBx:loading');

    const app = Container._().extend(Container, new Application);

    window.Container = undefined;

    delete window['Container'];

    // Set global
    window.FrontBx = app;

})();