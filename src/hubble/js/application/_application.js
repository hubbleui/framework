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
        }

        /**
         * Get the Container component
         *
         * @access {public}
         * @return {object}
         */
        container()
        {
            return Container;
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

        /**
         * Get the Helper component
         *
         * @access {public}
         * @return {object}
         */
        helper()
        {
            return Container.Helper();
        }

        /**
         * Require a module and/or key/value
         *
         * @access {public}
         * @param  {string} key The name of the key
         * @return {mixed}
         */
        require()
        {
            return Container.get(...arguments);
        }
    }

    // Loads into container
    Container.singleton('Hubble', Application);

    window.Hubble = Container.get('Hubble');

})();
