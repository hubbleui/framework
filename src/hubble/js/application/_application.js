(function()
{
    Container._().trigger_event(window, 'Hubble:loading', this);

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
        this.dom().boot();

        Container._().trigger_event(window, 'Hubble:ready', this);
    }

    /**
     * Get the DOM component
     *
     * @access {public}
     * @return {object}
     */
    Application.prototype.dom = function()
    {
        return Container.get('HubbleDom');
    }

    // Load into container
    Container.singleton('Hubble', Application);

    // Set global
    window.Hubble = Container.get('Hubble');

})();