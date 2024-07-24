(function()
{
    /**
     * Application core
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE}
     */
    class Application
    {
        /**
         * Called when the application is first initialized
         *
         * @access {public}
         */
        boot()
        {        
            this.dom().boot();

            Container.Helper().trigger_event(window, 'Hubble:ready', this);
        }

        /**
         * Get the DOM component
         *
         * @access {public}
         * @return {object}
         */
        dom()
        {
            return Container.get('HubbleDom');
        }
    }

    // Loads into container
    Container.singleton('Hubble', Application);

    window.Hubble = Container.get('Hubble');

})();