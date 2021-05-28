/**
 * Boot and initialize Hubble core
 *
 * @author    Joe J. Howard
 * @copyright Joe J. Howard
 * @license   https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE
 */

(function()
{
    Container.get('Hubble').boot();

    var hubbleReady = new CustomEvent('HubbleReady', { detail: Container.get('Hubble') });

    window.dispatchEvent(hubbleReady);
})();