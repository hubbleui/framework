(function()
{
    /**
     * Application core
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE}
     */
    const Application = function()
    {
        this.version_major = '1';

        this.version_minor = '0';

        this.version_patch = '0';

        this.version = `${this.version_major}.${this.version_minor}.${this.version_patch }`;
    };

    /**
     * Called when the application is first initialized
     *
     * @access {public}
     */
    Application.prototype.boot = function()
    {        
        this.Dom().boot();

        this._().trigger_event(window, 'Hubble:ready', this);
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

    Container._().trigger_event(window, 'Hubble:loading', this);

    const app = Container._().extend(Container, new Application);

    window.Container = undefined;

    delete window['Container'];

    // Set global
    window.Hubble = app;

    console.log(app);

})();