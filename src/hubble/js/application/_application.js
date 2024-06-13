/**
 * Application core
 *
 * @author    Joe J. Howard
 * @copyright Joe J. Howard
 * @license   https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE
 */
(function()
{
    /**
     * Module constructor
     *
     * @class
     * @constructor
     * @params null
     * @access public
     */
    var Application = function()
    {
        return this;
    };

    /**
     * Called when the application is first initialized
     *
     * @access public
     */
    Application.prototype.boot = function()
    {
        this.dom().boot();
    }

    /**
     * Get the Container component
     *
     * @access public
     * @return object
     */
    Application.prototype.container = function()
    {
        return Container;
    }

    /**
     * Get the DOM component
     *
     * @access public
     * @return object
     */
    Application.prototype.dom = function()
    {
        return Container.get('HubbleDom');
    }

    /**
     * Get the Helper component
     *
     * @access public
     * @return object
     */
    Application.prototype.helper = function()
    {
        return Container.Helper();
    }

    /**
     * Require a module and/or key/value
     *
     * @access public
     * @param  string key The name of the key
     * @return mixed
     */
    Application.prototype.require = function()
    {
        return Container.get.apply(Container, arguments);
    }

    // Loads into container
    Container.singleton('Hubble', Application);

    if (!window.Hubble)
    {
        window.Hubble = Container.get('Hubble');
    }

})();
